<template>
  <admin-topbar></admin-topbar>
  <div class="admin-shell">
    <admin-sidebar active="productos"></admin-sidebar>
    <div class="admin-main">
      <div class="admin-table-wrap">
        <div class="admin-table-tools">
          <div class="icons">
            <button @click="avisoDemo('Eliminar seleccionados')">🗑</button>
            <button @click="avisoDemo('Duplicar')">📄</button>
            <button @click="avisoDemo('Añadir producto')">＋</button>
          </div>
          <div class="select-all">Seleccionar todos <input type="checkbox"></div>
        </div>
        <div class="admin-header-row">
          <div class="administrar-h">CLICK PARA ORDENAR POR -)</div>
          <div class="col">Valor total (UYU)</div><div class="col">Categoria</div><div class="col">ID</div>
        </div>
        <div class="admin-row" v-for="fila in filas" :key="fila.id">
          <a class="administrar" @click="avisoDemo('Editar producto (demo)')">Administrar</a>
          <div class="col">NOMBRE PRODUCTO<br>2000.00$ UYU</div>
          <div class="col">Categoria</div>
          <div class="col">{{fila.id}}</div>
          <div class="thumb img-placeholder"></div>
          <input class="chk" type="checkbox">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminTopbar from '../../components/AdminTopbar.vue';
import AdminSidebar from '../../components/AdminSidebar.vue';

export default {
  name: 'AdminProductosView',
  components: { AdminTopbar, AdminSidebar },
  computed: {
    filas() {
      const rows = [];
      for (let i = 2; i <= 8; i++) rows.push({ id: '100000' + i });
      rows.push({ id: '1000001' });
      return rows;
    }
  },
  methods: {
    avisoDemo(msg) { alert(msg); }
  }
};
</script>
