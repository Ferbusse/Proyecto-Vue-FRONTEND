<template>
  <div class="admin-topbar">
    <router-link class="logo" :to="{name:'inicio'}"><img class="logo-img" :src="pepeImg" alt="Zona Móvil"></router-link>
    <div class="admin-acceso">Acceso Administrador</div>
    <router-link class="admin-back" :to="{name:'inicio'}">Volver a pagina principal</router-link>
  </div>
</template>

<script>
import pepeImg from '../recursos/imgs/logo.png'

export default {
  name: 'TopBarAdmin',
  data() {
    return { pepeImg };
  }
};
</script>
