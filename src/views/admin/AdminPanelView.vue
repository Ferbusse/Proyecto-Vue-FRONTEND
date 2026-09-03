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
              <strong>Consultas</strong>
              <small>Ver órdenes y pedidos</small>
            </span>
            <span class="admin-tile-arrow" aria-hidden="true">›</span>
          </button>

          <button class="admin-tile admin-tile-desactivado" @click="avisoDemo('Sección desactivada por ahora')">
            <span class="admin-tile-icon">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17.5" cy="8.5" r="2.4"/><path d="M15.8 14.2c2.6.4 4.7 2.3 4.7 5.3"/></svg>
            </span>
            <span class="admin-tile-text">
              <strong>Empleados</strong>
              <small>Desactivado por ahora</small>
            </span>
          </button>
        </div>

        <div class="chart-card">
          <div class="chart-card-header">
            <h3>Ventas de la semana</h3>
            <span class="chart-card-sub">Lunes a sábado</span>
          </div>
          <div class="bar-chart">
            <div class="bar-col" v-for="dia in ventasDia" :key="dia.etiqueta">
              <div class="bar" :style="{height:dia.altura+'%'}"></div>
              <div class="bar-label">{{dia.etiqueta}}</div>
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

export default {
  name: 'AdminPanelView',
  components: { AdminTopbar, AdminSidebar },
  computed: {
    ventasDia() {
      return [
        {etiqueta:'Lunes', altura:50},{etiqueta:'Martes', altura:70},{etiqueta:'Miércoles', altura:30},
        {etiqueta:'Jueves', altura:45},{etiqueta:'Viernes', altura:75},{etiqueta:'Sábado', altura:60}
      ];
    }
  },
  methods: {
    avisoDemo(msg) { alert(msg); }
  }
};
</script>
