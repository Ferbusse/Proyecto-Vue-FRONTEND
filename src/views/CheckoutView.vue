<template>
  <div class="view">
    <store-header></store-header>

    <div class="pago-page">
      <pago-pasos :paso-actual="1"></pago-pasos>

      <div class="checkout-layout">
        <div class="checkout-form pago-tarjeta-contenido">
          <h2 class="pago-card-titulo">Tus datos</h2>
          <p class="pago-card-subtitulo">Los necesitamos para coordinar la entrega de tu pedido.</p>

          <div class="form-row">
            <div class="form-group"><label>Nombre:</label><input v-model.trim="form.nombre" type="text"></div>
            <div class="form-group"><label>Apellido</label><input v-model.trim="form.apellido" type="text"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Documento de identidad:</label><input v-model.trim="form.documento" type="text"></div>
            <div class="form-group"><label>Teléfono</label><input v-model.trim="form.telefono" type="text"></div>
          </div>
          <div class="form-row"><div class="form-group"><label>Correo Electrónico</label><input v-model.trim="form.email" type="email"></div></div>
          <div class="form-row" v-if="direcciones.length">
            <div class="form-group">
              <label for="checkout-direccion-guardada">Usar una dirección guardada:</label>
              <select id="checkout-direccion-guardada" @change="usarDireccion($event.target.value)">
                <option value="">Elegir…</option>
                <option v-for="direccion in direcciones" :key="direccion.id" :value="direccion.id">{{ textoDireccion(direccion) }}</option>
              </select>
            </div>
          </div>
          <div class="form-row"><div class="form-group"><label>Dirección a enviar:</label><input v-model.trim="form.direccion" type="text"></div></div>
          <p v-if="errorFormulario" class="auth-error">{{ errorFormulario }}</p>
        </div>

        <div class="checkout-summary pago-recibo">
          <h2 class="pago-card-titulo">Tu pedido</h2>
          <div v-if="carrito.lineas.length===0" class="pago-recibo-vacio">No hay productos en el carrito</div>
          <div class="pago-recibo-items" v-else>
            <div class="pago-recibo-fila" v-for="linea in carrito.lineas" :key="linea.product.id">
              <div class="thumb img-placeholder">
                <img v-if="linea.product.imagenUrl" :src="linea.product.imagenUrl" :alt="linea.product.name" @error="$event.target.style.display='none'">
                <span v-else-if="linea.product.icono" class="product-icono product-icono-chico" aria-hidden="true">{{ linea.product.icono }}</span>
              </div>
              <div class="pago-recibo-detalle">
                <span class="pago-recibo-nombre">{{ linea.product.name }}</span>
                <span class="pago-recibo-cantidad">{{ linea.qty }} × {{ formatearPrecio(linea.product.price) }}</span>
              </div>
              <div class="pago-recibo-subtotal">{{ formatearPrecio(linea.qty * linea.product.price) }}</div>
            </div>
          </div>
          <div class="pago-recibo-divisor" aria-hidden="true"></div>
          <div class="pago-recibo-total">
            <span>Total</span>
            <span>{{ carrito.totalFormateado }}</span>
          </div>
        </div>
      </div>

      <div class="checkout-actions">
        <button class="btn-primary" @click="continuar">Continuar al pago</button>
      </div>
    </div>
  </div>
</template>

<script>
import StoreHeader from '../components/StoreHeader.vue';
import PagoPasos from '../components/PagoPasos.vue';
import { formatearPrecio } from '../catalog.js';
import { useCarritoStore } from '../stores/carrito.js';
import { haySesion, obtenerUsuarioGuardado, listarDirecciones } from '../Api/cuenta.js';

export default {
  name: 'CheckoutView',
  components: { StoreHeader, PagoPasos },
  data() {
    return {
      carrito: useCarritoStore(),
      form: { nombre: '', apellido: '', documento: '', telefono: '', email: '', direccion: '' },
      errorFormulario: '',
      direcciones: []
    };
  },
  // Si el cliente tiene sesión, le precargamos los datos de su cuenta y su
  // dirección principal para que no tenga que escribirlos de nuevo. Todo
  // sigue siendo editable, y si algo falla el formulario queda en blanco.
  async mounted() {
    if (!haySesion()) return;
    const usuario = obtenerUsuarioGuardado() || {};
    const [nombre, ...resto] = (usuario.name || '').split(' ');
    this.form.nombre = this.form.nombre || nombre || '';
    this.form.apellido = this.form.apellido || resto.join(' ');
    this.form.email = this.form.email || usuario.email || '';
    this.form.telefono = this.form.telefono || usuario.telefono || '';
    try {
      const { datos } = await listarDirecciones();
      this.direcciones = datos;
      const principal = datos.find(d => d.principal) || datos[0];
      if (principal && !this.form.direccion) this.usarDireccion(principal.id);
    } catch (error) {
      console.error('No se pudieron cargar las direcciones guardadas:', error);
    }
  },
  methods: {
    formatearPrecio,
    textoDireccion(direccion) {
      return [direccion.etiqueta, direccion.direccion, direccion.ciudad].filter(Boolean).join(' · ');
    },
    usarDireccion(id) {
      const direccion = this.direcciones.find(d => String(d.id) === String(id));
      if (!direccion) return;
      this.form.direccion = [direccion.direccion, direccion.ciudad, direccion.departamento].filter(Boolean).join(', ');
      if (direccion.telefono && !this.form.telefono) this.form.telefono = direccion.telefono;
    },
    continuar() {
      this.errorFormulario = '';
      const faltante = Object.values(this.form).some(valor => !valor);
      if (faltante) {
        this.errorFormulario = 'Completá todos los datos de envío antes de continuar.';
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(this.form.email)) {
        this.errorFormulario = 'Ingresá un correo electrónico válido.';
        return;
      }
      // Un producto se puede agotar después de haberlo puesto en el carrito.
      const sinStock = this.carrito.lineas.filter(({ product, qty }) => {
        const stock = Number(product.stock);
        return product.agotado || (Number.isFinite(stock) && qty > stock);
      });
      if (sinStock.length) {
        const nombres = sinStock.map(linea => linea.product.name).join(', ');
        this.errorFormulario = `No hay stock suficiente de: ${nombres}. Ajustá el carrito para continuar.`;
        return;
      }
      this.carrito.datosEnvio = { ...this.form };
      this.carrito.continuarCompra();
    }
  }
};
</script>
