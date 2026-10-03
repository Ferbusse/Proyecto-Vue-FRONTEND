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
              <button type="button" class="admin-btn admin-btn-neutro" title="Actualizar" @click="cargarEnvios"><span aria-hidden="true">⟳</span> Actualizar</button>
            </div>
            <div class="select-all">
              <input v-model.trim="busqueda" class="admin-search-input" type="search" placeholder="Buscar envío..." aria-label="Buscar envío">
              <select v-model="filtroFecha" class="admin-filter-select" aria-label="Filtrar envíos por fecha">
                <option value="todos">Todos</option>
                <option value="hoy">Solo hoy</option>
              </select>
              <span class="select-count">{{ enviosFiltrados.length }} en camino</span>
            </div>
          </div>

          <div class="admin-table-scroll">
            <div class="admin-header-row">
              <col-ordenable class="administrar-h" clave="id" :orden="orden" @ordenar="ordenarPor">Orden</col-ordenable>
              <col-ordenable class="col" clave="cliente" :orden="orden" @ordenar="ordenarPor">Cliente</col-ordenable>
              <col-ordenable class="col" clave="fecha" :orden="orden" @ordenar="ordenarPor">Fecha</col-ordenable>
              <col-ordenable class="col" clave="total" :orden="orden" @ordenar="ordenarPor">Total (UYU)</col-ordenable>
              <col-ordenable class="col" clave="productos" :orden="orden" @ordenar="ordenarPor">Productos</col-ordenable>
            </div>

            <p v-if="cargando" class="producto-vacio" aria-live="polite">Cargando envíos…</p>

            <div class="admin-row" v-for="envio in enviosOrdenados" :key="envio.id">
              <a class="administrar" @click="marcarEntregado(envio)">Marcar entregado</a>
              <div class="col">{{ envio.cliente }}</div>
              <div class="col">{{ envio.fecha }}</div>
              <div class="col">{{ formatearPrecio(envio.total) }}</div>
              <div class="col">{{ resumenItems(envio) }}</div>
            </div>
          </div>

          <p v-if="!cargando && !enviosFiltrados.length && !error" class="producto-vacio">No hay envíos que coincidan con el filtro.</p>
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
import { parsearFecha, formatearFecha } from '../../utils/fechas.js';
import ColOrdenable from '../../components/ColOrdenable.vue';
import { alternarOrden, ordenarLista } from '../../utils/ordenamiento.js';

export default {
  name: 'AdminEnviosView',
  components: { AdminTopbar, AdminSidebar, ColOrdenable },
  data() {
    return {
      envios: [],
      orden: { clave: null, direccion: 'asc' },
      busqueda: '',
      filtroFecha: 'todos',
      cargando: false,
      error: ''
    };
  },
  computed: {
    enviosFiltrados() {
      const texto = this.busqueda.toLowerCase();
      const hoy = new Date().toLocaleDateString('es-UY');

      return this.envios.filter(orden => {
        const coincideTexto = !texto || [
          orden.id,
          orden.cliente,
          orden.fecha,
          this.resumenItems(orden)
        ].join(' ').toLowerCase().includes(texto);
        const coincideFecha = this.filtroFecha === 'todos' || orden.fecha === hoy;
        return coincideTexto && coincideFecha;
      });
    },
    enviosOrdenados() {
      // Qué valor se compara al ordenar por cada columna de la tabla.
      const valores = {
        id: envio => Number(envio.id),
        cliente: envio => envio.cliente,
        fecha: envio => envio.fechaMs,
        total: envio => Number(envio.total),
        productos: envio => this.resumenItems(envio)
      };
      return ordenarLista(this.enviosFiltrados, this.orden, valores);
    }
  },
  async mounted() {
    await this.cargarEnvios();
  },
  methods: {
    formatearPrecio,
    ordenarPor(clave) {
      this.orden = alternarOrden(this.orden, clave);
    },
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
          fecha: formatearFecha(orden.fecha),
          // fecha en milisegundos, solo para poder ordenar bien por esta columna
          fechaMs: parsearFecha(orden.fecha)?.getTime() ?? null
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
