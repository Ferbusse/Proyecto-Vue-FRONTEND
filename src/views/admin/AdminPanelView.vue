<template>
  <admin-topbar></admin-topbar>
  <div class="admin-shell">
    <admin-sidebar active="panel"></admin-sidebar>
    <div class="admin-main">
      <div class="admin-tiles">
        <button class="admin-tile" @click="$router.push({name:'admin-productos'})">Añadir producto +</button>
        <button class="admin-tile" @click="$router.push({name:'admin-ordenes'})">Consultas</button>
        <button class="admin-tile" @click="$router.push({name:'admin-empleados'})">Empleados</button>
      </div>
      <div class="chart-card">
        <h3>Ventas/Dia</h3>
        <div class="bar-chart">
          <div class="bar-col" v-for="dia in ventasDia" :key="dia.etiqueta">
            <div class="bar" :style="{height:dia.altura+'%'}"></div>
            <div class="bar-label">{{dia.etiqueta}}</div>
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
        {etiqueta:'Lunes', altura:50},{etiqueta:'Martes', altura:70},{etiqueta:'Miercoles', altura:30},
        {etiqueta:'Jueves', altura:45},{etiqueta:'Viernes', altura:75},{etiqueta:'Sabado', altura:60}
      ];
    }
  }
};
</script>
