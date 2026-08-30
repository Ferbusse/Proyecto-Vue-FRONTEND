<template>
  <div class="admin-sidebar">
    <a :class="{active: active==='panel'}" @click="$router.push({name:'admin-panel'})">Dashboard</a>
    <a :class="{active: active==='productos'}" @click="$router.push({name:'admin-productos'})">Productos</a>
    <a :class="{active: active==='analiticas'}" @click="$router.push({name:'admin-analiticas'})">Analiticas</a>
    <a @click="avisoDemo('Próximamente')">Calendario</a>
    <a @click="avisoDemo('Próximamente')">Financias</a>
    <a :class="{active: active==='ordenes'}" @click="$router.push({name:'admin-ordenes'})">Ordenes</a>
    <a @click="avisoDemo('Próximamente')">Envios</a>
    <a class="desactivado" @click="avisoDemo('Sección desactivada por ahora')">Empleados</a>
    <div class="admin-user"><div class="av">🙂</div><div><div class="name">El Pepe</div><div class="role">ADMIN</div></div></div>
  </div>
</template>

<script>
export default {
  name: 'AdminSidebar',
  props: ['active'],
  methods: {
    avisoDemo(msg) { alert(msg); }
  }
};
</script>
