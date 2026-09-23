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

export default {
  name: 'CheckoutView',
  components: { StoreHeader, PagoPasos },
  data() {
    return {
      carrito: useCarritoStore(),
      form: { nombre: '', apellido: '', documento: '', telefono: '', email: '', direccion: '' },
      errorFormulario: ''
    };
  },
  methods: {
    formatearPrecio,
    continuar() {
      this.errorFormulario = '';
      const faltante = Object.values(this.form).some(valor => !valor);
      if (faltante) {
        this.errorFormulario = 'Completá todos los datos de envío antes de continuar.';
        return;
      }
      this.carrito.continuarCompra();
    }
  }
};
</script>
