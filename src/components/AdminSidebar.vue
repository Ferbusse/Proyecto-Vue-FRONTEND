<template>
  <div class="admin-sidebar">
    <a :class="{active: active==='panel'}" @click="$router.push({name:'admin-panel'})">Dashboard</a>
    <a :class="{active: active==='productos'}" @click="$router.push({name:'admin-productos'})">Productos</a>
    <a :class="{active: active==='banners'}" @click="$router.push({name:'admin-banners'})">Banner de inicio</a>
    <a :class="{active: active==='analiticas'}" @click="$router.push({name:'admin-analiticas'})">Analíticas</a>
    <a :class="{active: active==='calendario'}" @click="$router.push({name:'admin-calendario'})">Calendario</a>
    <a :class="{active: active==='ordenes'}" @click="$router.push({name:'admin-ordenes'})">Órdenes</a>
    <a :class="{active: active==='envios'}" @click="$router.push({name:'admin-envios'})">Envíos</a>
    <a :class="{active: active==='empleados'}" @click="$router.push({name:'admin-empleados'})">Empleados</a>
    <div class="admin-user"><div class="av">🙂</div><div><div class="name">{{ nombreAdmin }}</div><div class="role">ADMIN</div></div></div>
  </div>
</template>

<script>
export default {
  name: 'AdminSidebar',
  props: ['active'],
  computed: {
    nombreAdmin() {
      try {
        const usuario = JSON.parse(localStorage.getItem('auth_user') || '{}');
        return usuario.name || 'Administrador';
      } catch {
        return 'Administrador';
      }
    }
  }
};
</script>
