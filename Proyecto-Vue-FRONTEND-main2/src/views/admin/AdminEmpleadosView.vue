<template>
  <div class="view">
    <admin-topbar></admin-topbar>
    <div class="admin-shell">
      <admin-sidebar active="empleados"></admin-sidebar>
      <div class="admin-main">
        <div class="admin-table-wrap">
          <div class="admin-table-tools">
            <div class="icons">
              <button @click="avisoDemo('Eliminar seleccionados')">🗑</button>
              <button @click="avisoDemo('Duplicar')">📄</button>
              <button @click="avisoDemo('Añadir empleado')">＋</button>
            </div>
            <div class="select-all">Seleccionar todos <input type="checkbox"></div>
          </div>
          <div class="admin-row" v-for="n in 8" :key="n">
            <a class="administrar" @click="avisoDemo('Editar empleado (demo)')">Administrar</a>
            <div class="col" style="text-align:center;">NOMBRE EMPLEADO</div>
            <div class="col">Puesto</div>
            <div class="thumb img-placeholder"></div>
            <input class="chk" type="checkbox">
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
  name: 'AdminEmpleadosView',
  components: { AdminTopbar, AdminSidebar },
  methods: {
    avisoDemo(msg) { alert(msg); }
  }
};
</script>
