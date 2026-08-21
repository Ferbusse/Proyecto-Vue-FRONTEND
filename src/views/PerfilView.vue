<template>
  <cuenta-shell activo="escritorio" titulo-seccion="Mi cuenta">
    <div class="cuenta-grid" role="list">
      <router-link :to="{name:'cuenta-pedidos'}" class="cuenta-card" role="listitem">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>
        <span>Pedidos</span>
      </router-link>
      <router-link :to="{name:'cuenta-direcciones'}" class="cuenta-card" role="listitem">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
        <span>Direcciones</span>
      </router-link>
      <router-link :to="{name:'cuenta-detalles'}" class="cuenta-card" role="listitem">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
        <span>Detalles de la cuenta</span>
      </router-link>
      <router-link :to="{name:'cuenta-wishlist'}" class="cuenta-card" role="listitem">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 20s-7-4.4-9.5-8.8C.8 8 2 4.5 5.4 4 7.7 3.6 10 4.8 12 7c2-2.2 4.3-3.4 6.6-3 3.4.5 4.6 4 3 7.2C19 15.6 12 20 12 20z"/></svg>
        <span>Wishlist</span>
      </router-link>
      <button type="button" class="cuenta-card cuenta-card-salir" role="listitem" @click="salir">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
        <span>Salir</span>
      </button>
    </div>
  </cuenta-shell>
</template>

<script>
import CuentaShell from '../components/CuentaShell.vue';
import { cerrarSesion } from '../Api/sesion.js';

export default {
  name: 'PerfilView',
  components: { CuentaShell },
  methods: {
    salir() {
      cerrarSesion(this.$router);
    }
  }
};
</script>
