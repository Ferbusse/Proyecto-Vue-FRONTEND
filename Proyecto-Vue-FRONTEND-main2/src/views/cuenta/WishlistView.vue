<template>
  <cuenta-shell activo="wishlist" titulo-seccion="Wishlist">
    <div class="cuenta-vacio">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 20s-7-4.4-9.5-8.8C.8 8 2 4.5 5.4 4 7.7 3.6 10 4.8 12 7c2-2.2 4.3-3.4 6.6-3 3.4.5 4.6 4 3 7.2C19 15.6 12 20 12 20z"/></svg>
      <h2>Tu wishlist está vacía</h2>
      <p>Guardá tus productos favoritos para encontrarlos rápido más adelante.</p>
      <router-link class="cuenta-vacio-cta" :to="{name:'categoria'}">Ver productos</router-link>
    </div>
  </cuenta-shell>
</template>

<script>
import CuentaShell from '../../components/CuentaShell.vue';

export default {
  name: 'WishlistView',
  components: { CuentaShell }
};
</script>
