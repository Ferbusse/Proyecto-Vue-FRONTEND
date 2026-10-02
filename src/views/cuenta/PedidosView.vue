<template>
  <cuenta-shell activo="pedidos" titulo-seccion="Pedidos">
    <p v-if="cargando" aria-live="polite">Cargando tus pedidos…</p>

    <template v-else>
      <p v-if="error" class="producto-error" aria-live="polite">{{ error }}</p>
      <p v-if="local && pedidos.length" class="cuenta-nota-local">Estos pedidos se guardaron solo en este navegador.</p>

      <div v-if="!pedidos.length && !error" class="cuenta-vacio">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>
        <h2>Todavía no tenés pedidos</h2>
        <p>Cuando compres algo, vas a poder ver el estado de tus pedidos acá.</p>
        <router-link class="cuenta-vacio-cta" :to="{name:'categoria'}">Ir a comprar</router-link>
      </div>

      <ul v-else class="pedidos-lista">
        <li v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
          <button type="button" class="pedido-cabecera" :aria-expanded="abierto === pedido.id" @click="abierto = abierto === pedido.id ? null : pedido.id">
            <span class="pedido-id">Pedido {{ numeroVisible(pedido) }}</span>
            <span class="pedido-fecha">{{ formatearFecha(pedido.fecha) }}</span>
            <span class="estado-badge" :style="{background: estados[pedido.estado]?.fondo, color: estados[pedido.estado]?.color}">{{ estados[pedido.estado]?.etiqueta || pedido.estado }}</span>
            <span class="pedido-total">{{ formatearPrecio(pedido.total) }}</span>
            <span class="pedido-flecha" aria-hidden="true">{{ abierto === pedido.id ? '▲' : '▼' }}</span>
          </button>
          <div v-if="abierto === pedido.id" class="pedido-detalle">
            <div v-for="(item, i) in pedido.items" :key="i" class="pedido-item">
              <span>{{ item.cantidad }}× {{ item.nombre }}</span>
              <span v-if="item.precio">{{ formatearPrecio(item.cantidad * item.precio) }}</span>
            </div>
            <p v-if="!pedido.items.length" class="texto-atenuado">Este pedido no tiene el detalle de productos disponible.</p>
            <p v-if="pedido.direccion" class="pedido-extra"><strong>Envío a:</strong> {{ pedido.direccion }}</p>
            <p v-if="pedido.metodo_pago" class="pedido-extra"><strong>Pago:</strong> {{ nombreMetodo(pedido.metodo_pago) }}</p>
          </div>
        </li>
      </ul>
    </template>
  </cuenta-shell>
</template>

<script>
import CuentaShell from '../../components/CuentaShell.vue';
import { listarPedidos, mensajeDeError } from '../../Api/cuenta.js';
import { formatearPrecio } from '../../catalog.js';

// Mismos colores y etiquetas que usa el admin para el estado de las órdenes.
const ESTADOS = {
  pendiente:  { etiqueta: 'Pendiente',  fondo: '#fff3da', color: '#b3791a' },
  en_proceso: { etiqueta: 'En proceso', fondo: '#e7f0ff', color: '#2451e0' },
  enviado:    { etiqueta: 'Enviado',    fondo: '#f2e9ff', color: '#7638c9' },
  completado: { etiqueta: 'Completado', fondo: '#e6f8ec', color: '#1f8a44' },
  cancelado:  { etiqueta: 'Cancelado',  fondo: '#fde8e8', color: '#d3423e' }
};
const METODOS = { visa: 'VISA', mc: 'MasterCard', oca: 'OCA', bank: 'Transferencia bancaria' };

export default {
  name: 'PedidosView',
  components: { CuentaShell },
  data() {
    return { pedidos: [], local: false, cargando: true, error: '', abierto: null, estados: ESTADOS };
  },
  async mounted() {
    try {
      const { datos, local } = await listarPedidos();
      this.pedidos = datos;
      this.local = local;
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      this.error = mensajeDeError(error, 'No se pudieron cargar tus pedidos.');
    } finally {
      this.cargando = false;
    }
  },
  methods: {
    formatearPrecio,
    // los ids locales son largos y feos; se muestran cortos
    numeroVisible(pedido) {
      const id = String(pedido.id);
      return id.startsWith('L') ? '#' + id.slice(-5).toUpperCase() : '#' + id;
    },
    formatearFecha(fecha) {
      return fecha ? new Date(fecha).toLocaleDateString('es-UY') : '—';
    },
    nombreMetodo(metodo) {
      return METODOS[metodo] || metodo;
    }
  }
};
</script>
