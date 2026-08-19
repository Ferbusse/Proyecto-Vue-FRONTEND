<template>
  <div class="admin-sidebar">
    <a :class="{active: cualEs==='panel'}" @click="$router.push({name:'admin-panel'})">Dashboard</a>
    <a :class="{active: cualEs==='productos'}" @click="$router.push({name:'admin-productos'})">Productos</a>
    <a :class="{active: cualEs==='analiticas'}" @click="$router.push({name:'admin-analiticas'})">Analiticas</a>
    <a @click="gritoDemo('Próximamente')">Calendario</a>
    <a @click="gritoDemo('Próximamente')">Financias</a>
    <a :class="{active: cualEs==='ordenes'}" @click="$router.push({name:'admin-ordenes'})">Ordenes</a>
    <a @click="gritoDemo('Próximamente')">Envios</a>
    <a :class="{active: cualEs==='empleados'}" @click="$router.push({name:'admin-empleados'})">Empleados</a>
    <div class="admin-user"><div class="av">🙂</div><div><div class="name">El Pepe</div><div class="role">ADMIN</div></div></div>
  </div>
</template>

<script>
export default {
  name: 'BarraLateral',
  props: ['cualEs'],
  methods: {
    gritoDemo(msg) { alert(msg) }
  }
};
</script>
