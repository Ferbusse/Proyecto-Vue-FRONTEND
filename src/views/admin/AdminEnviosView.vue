<template>
  <div class="view">
    <admin-topbar></admin-topbar>
    <div class="admin-shell">
      <admin-sidebar active="envios"></admin-sidebar>
      <div class="admin-main">
        <div class="admin-page-header">
          <h1>Envíos</h1>
          <p>Órdenes que ya salieron hacia el cliente, esperando confirmación de entrega.</p>
        </div>

        <div class="admin-table-wrap">
          <div class="admin-table-tools">
            <div class="icons">
              <button type="button" title="Actualizar" @click="cargarEnvios">⟳</button>
            </div>
            <div class="select-all">
              <span class="select-count">{{ envios.length }} en camino</span>
            </div>
          </div>

          <div class="admin-header-row">
            <div class="administrar-h">Orden</div>
            <div class="col">Cliente</div><div class="col">Fecha</div><div class="col">Total (UYU)</div><div class="col">Productos</div>
          </div>

          <p v-if="cargando" class="producto-vacio" aria-live="polite">Cargando envíos…</p>

          <div class="admin-row" v-for="orden in envios" :key="orden.id">
            <a class="administrar" @click="marcarEntregado(orden)">Marcar entregado</a>
            <div class="col">{{ orden.cliente }}</div>
            <div class="col">{{ orden.fecha }}</div>
            <div class="col">{{ formatearPrecio(orden.total) }}</div>
            <div class="col">{{ resumenItems(orden) }}</div>
          </div>

          <p v-if="!cargando && !envios.length && !error" class="producto-vacio">No hay envíos en camino por ahora.</p>
          <p v-if="error" class="producto-error" aria-live="polite">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminTopbar from '../../components/AdminTopbar.vue';
import AdminSidebar from '../../components/AdminSidebar.vue';
import api from '../../Api/api.js';
import { formatearPrecio } from '../../catalog.js';

export default {
  name: 'AdminEnviosView',
  components: { AdminTopbar, AdminSidebar },
  data() {
    return {
      envios: [],
      cargando: false,
      error: ''
    };
  },
  async mounted() {
    await this.cargarEnvios();
  },
  methods: {
    formatearPrecio,
    resumenItems(orden) {
      const items = orden.items || [];
      if (!items.length) return '—';
      return items.map(item => `${item.cantidad}× ${item.nombre}`).join(', ');
    },
    async cargarEnvios() {
      this.cargando = true;
      this.error = '';
      try {
        // El backend acepta ?estado= para traer solo las órdenes en ese estado.
        const response = await api.get('/ordenes', { params: { estado: 'enviado' } });
        this.envios = (response.data || []).map(orden => ({
          ...orden,
          fecha: orden.fecha ? new Date(orden.fecha).toLocaleDateString('es-UY') : '—'
        }));
      } catch (requestError) {
        console.error('Error al cargar envíos:', requestError);
        this.error = 'No se pudieron cargar los envíos.';
      } finally {
        this.cargando = false;
      }
    },
    async marcarEntregado(orden) {
      try {
        await api.put(`/ordenes/${orden.id}`, { estado: 'completado' });
        await this.cargarEnvios();
      } catch (requestError) {
        console.error('Error al actualizar el envío:', requestError);
        this.error = 'No se pudo marcar la orden como entregada.';
      }
    }
  }
};
</script>
