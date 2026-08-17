<template>
  <top-bar-admin></top-bar-admin>
  <div class="admin-shell">
    <barra-lateral cual-es="productos"></barra-lateral>
    <div class="admin-main">
      <div class="admin-table-wrap">
        <div class="admin-table-tools">
          <div class="icons">
            <button @click="gritoDemo('Eliminar seleccionados')">🗑</button>
            <button @click="gritoDemo('Duplicar')">📄</button>
            <button @click="gritoDemo('Añadir producto')">＋</button>
          </div>
          <div class="select-all">Seleccionar todos <input type="checkbox"></div>
        </div>
        <div class="admin-header-row">
          <div class="administrar-h">CLICK PARA ORDENAR POR -)</div>
          <div class="col">Valor total (UYU)</div><div class="col">Categoria</div><div class="col">ID</div>
        </div>
        <div class="admin-row" v-for="filaX in pilaDeFilas" :key="filaX.id">
          <a class="administrar" @click="gritoDemo('Editar producto (demo)')">Administrar</a>
          <div class="col">NOMBRE PRODUCTO<br>2000.00$ UYU</div>
          <div class="col">Categoria</div>
          <div class="col">{{filaX.id}}</div>
          <div class="thumb img-placeholder"></div>
          <input class="chk" type="checkbox">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopBarAdmin from '../TopBarAdmin.vue';
import BarraLateral from '../BarraLateral.vue'

export default {
  name: 'Productos',
  components: { TopBarAdmin, BarraLateral },
  computed: {
    pilaDeFilas() {
      const pilita = [];
      for (let j = 2; j <= 8; j++) pilita.push({ id: '100000' + j });
      pilita.push({ id: '1000001' });
      return pilita;
    }
  },
  methods: {
    gritoDemo(msg) { alert(msg); }
  }
};
</script>
