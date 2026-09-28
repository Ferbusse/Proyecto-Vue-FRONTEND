<template>
  <div class="view">
    <admin-topbar></admin-topbar>
    <div class="admin-shell">
      <admin-sidebar active="panel"></admin-sidebar>
      <div class="admin-main">
        <div class="admin-page-header">
          <h1>Panel de administración</h1>
          <p>Accesos rápidos y un resumen de cómo viene la semana.</p>
        </div>

        <div class="admin-tiles">
          <button class="admin-tile" @click="$router.push({name:'admin-productos'})">
            <span class="admin-tile-icon">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>
            </span>
            <span class="admin-tile-text">
              <strong>Productos</strong>
              <small>Agregar o editar el catálogo</small>
            </span>
            <span class="admin-tile-arrow" aria-hidden="true">›</span>
          </button>

          <button class="admin-tile" @click="$router.push({name:'admin-ordenes'})">
            <span class="admin-tile-icon">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3.6-.8L3 20l1-5.3a8.4 8.4 0 0 1-.9-3.8A8.4 8.4 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/></svg>
            </span>
            <span class="admin-tile-text">
              <strong>Órdenes</strong>
              <small>Ver pedidos y su estado</small>
            </span>
            <span class="admin-tile-arrow" aria-hidden="true">›</span>
          </button>

          <button class="admin-tile" @click="$router.push({name:'admin-analiticas'})">
            <span class="admin-tile-icon">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19V9M12 19V5M20 19v-7"/></svg>
            </span>
            <span class="admin-tile-text">
              <strong>Analíticas</strong>
              <small>Ventas, categorías y más</small>
            </span>
            <span class="admin-tile-arrow" aria-hidden="true">›</span>
          </button>

          <button class="admin-tile" @click="$router.push({name:'admin-banners'})">
            <span class="admin-tile-icon">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="10" rx="2"/><path d="M3 9h18"/><circle cx="8" cy="17.5" r="1"/><circle cx="12" cy="17.5" r="1"/><circle cx="16" cy="17.5" r="1"/></svg>
            </span>
            <span class="admin-tile-text">
              <strong>Banner de inicio</strong>
              <small>Editar el carrusel de la página principal</small>
            </span>
            <span class="admin-tile-arrow" aria-hidden="true">›</span>
          </button>

          <button class="admin-tile" @click="$router.push({name:'admin-empleados'})">
            <span class="admin-tile-icon">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17.5" cy="8.5" r="2.4"/><path d="M15.8 14.2c2.6.4 4.7 2.3 4.7 5.3"/></svg>
            </span>
            <span class="admin-tile-text">
              <strong>Empleados</strong>
              <small>Gestionar el equipo</small>
            </span>
            <span class="admin-tile-arrow" aria-hidden="true">›</span>
          </button>
        </div>

        <div class="chart-card">
          <div class="chart-card-header">
            <h3>Ventas de los últimos días</h3>
            <span class="chart-card-sub" v-if="periodo">{{ periodo }}</span>
          </div>
          <p v-if="cargando" class="producto-vacio">Cargando…</p>
          <p v-else-if="error" class="producto-error">{{ error }}</p>
          <p v-else-if="!ventasDia.length" class="producto-vacio">Todavía no hay ventas registradas.</p>
          <div v-else class="bar-chart">
            <div class="bar-col" v-for="dia in ventasDia" :key="dia.etiqueta">
              <div class="bar" :style="{height: dia.altura + '%'}" :title="formatearPrecio(dia.ventas)"></div>
              <div class="bar-label">{{ dia.etiqueta }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminTopbar from '../../components/AdminTopbar.vue';
import AdminSidebar from '../../components/AdminSidebar.vue';
import api from '../../Api/api.js';

export default {
  name: 'AdminPanelView',
  components: { AdminTopbar, AdminSidebar },
  data() {
    return {
      cargando: true,
      error: '',
      periodo: '',
      grafico: []
    };
  },
  computed: {
    ventasDia() {
      const maximo = Math.max(1, ...this.grafico.map(dia => dia.ventas || 0));
      return this.grafico.map(dia => ({
        etiqueta: dia.etiqueta,
        ventas: dia.ventas || 0,
        // Altura relativa al día con más ventas del período, con un piso
        // del 4% para que las barras en cero se sigan viendo en el gráfico.
        altura: Math.max(4, Math.round(((dia.ventas || 0) / maximo) * 100))
      }));
    }
  },
  async mounted() {
    try {
      const response = await api.get('/analiticas', { params: { dias: 8 } });
      this.grafico = response.data.grafico || [];
      this.periodo = `${response.data.periodo.inicio} a ${response.data.periodo.fin}`;
    } catch (requestError) {
      console.error('Error al cargar el resumen del dashboard:', requestError);
      this.error = 'No se pudo cargar el resumen de ventas.';
    } finally {
      this.cargando = false;
    }
  },
  methods: {
    formatearPrecio(valor) {
      return new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU', maximumFractionDigits: 0 }).format(Number(valor) || 0);
    }
  }
};
</script>
