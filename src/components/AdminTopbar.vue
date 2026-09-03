<template>
  <div class="admin-topbar">
    <router-link class="logo" :to="{name:'inicio'}"><img class="logo-img" :src="logoUrl" alt="Zona Móvil"></router-link>
    <div class="admin-acceso">Acceso Administrador</div>
    <router-link class="admin-back" :to="{name:'inicio'}">Volver a página principal</router-link>
  </div>
</template>

<script>
import logo from '../assets/logo.png';

export default {
  name: 'AdminTopbar',
  data() {
    return { logoUrl: logo };
  }
};
</script>
