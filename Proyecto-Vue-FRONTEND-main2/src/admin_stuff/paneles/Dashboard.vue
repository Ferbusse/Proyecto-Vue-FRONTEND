<template>
  <top-bar-admin></top-bar-admin>
  <div class="admin-shell">
    <barra-lateral cual-es="panel"></barra-lateral>
    <div class="admin-main">
      <div class="admin-tiles">
        <button class="admin-tile" @click="$router.push({name:'admin-productos'})">Añadir producto +</button>
        <button class="admin-tile" @click="$router.push({name:'admin-ordenes'})">Consultas</button>
        <button class="admin-tile" @click="$router.push({name:'admin-empleados'})">Empleados</button>
      </div>
      <div class="chart-card">
        <h3>Ventas/Dia</h3>
        <div class="bar-chart">
          <div class="bar-col" v-for="diaX in pilaDeVentas" :key="diaX.etiqueta">
            <div class="bar" :style="{height:diaX.altura+'%'}"></div>
            <div class="bar-label">{{diaX.etiqueta}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopBarAdmin from '../TopBarAdmin.vue'
import BarraLateral from '../BarraLateral.vue';

export default {
  name: 'Dashboard',
  components: { TopBarAdmin, BarraLateral },
  computed: {
    pilaDeVentas() {
      return [
        {etiqueta:'Lunes', altura:50},{etiqueta:'Martes', altura:70},{etiqueta:'Miercoles', altura:30},
        {etiqueta:'Jueves', altura:45},{etiqueta:'Viernes', altura:75},{etiqueta:'Sabado', altura:60}
      ];
    }
  }
};
</script>
