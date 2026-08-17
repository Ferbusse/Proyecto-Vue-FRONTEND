<template>
  <top-bar-admin></top-bar-admin>
  <div class="admin-shell">
    <barra-lateral cual-es="empleados"></barra-lateral>
    <div class="admin-main">
      <div class="admin-table-wrap">
        <div class="admin-table-tools">
          <div class="icons">
            <button @click="gritoDemo('Eliminar seleccionados')">🗑</button>
            <button @click="gritoDemo('Duplicar')">📄</button>
            <button @click="gritoDemo('Añadir empleado')">＋</button>
          </div>
          <div class="select-all">Seleccionar todos <input type="checkbox"></div>
        </div>
        <div class="admin-row" v-for="pepeN in 8" :key="pepeN">
          <a class="administrar" @click="gritoDemo('Editar empleado (demo)')">Administrar</a>
          <div class="col" style="text-align:center;">NOMBRE EMPLEADO</div>
          <div class="col">Puesto</div>
          <div class="thumb img-placeholder"></div>
          <input class="chk" type="checkbox">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopBarAdmin from '../TopBarAdmin.vue';
import BarraLateral from '../BarraLateral.vue';

export default {
  name: 'Empleados',
  components: { TopBarAdmin, BarraLateral },
  methods: {
    gritoDemo(msg) { alert(msg); }
  }
};
</script>
