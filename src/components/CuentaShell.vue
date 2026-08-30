<template>
  <div class="view">
    <store-header></store-header>

    <!-- Migas de pan -->
    <nav class="breadcrumb" aria-label="Ruta de navegación">
      <ol>
        <li><router-link :to="{name:'inicio'}">Inicio</router-link></li>
        <li aria-hidden="true">›</li>
        <li aria-current="page">{{ tituloSeccion }}</li>
      </ol>
    </nav>

    <div class="cuenta-shell">
      <!-- Menú lateral de la cuenta -->
      <nav class="cuenta-sidebar" aria-label="Menú de mi cuenta">
        <ul>
          <li>
            <span v-if="activo==='escritorio'" aria-current="page">Escritorio</span>
            <router-link v-else :to="{name:'perfil'}">Escritorio</router-link>
          </li>
          <li>
            <span v-if="activo==='pedidos'" aria-current="page">Pedidos</span>
            <router-link v-else :to="{name:'cuenta-pedidos'}">Pedidos</router-link>
          </li>
          <li>
            <span v-if="activo==='direcciones'" aria-current="page">Direcciones</span>
            <router-link v-else :to="{name:'cuenta-direcciones'}">Direcciones</router-link>
          </li>
          <li>
            <span v-if="activo==='detalles'" aria-current="page">Detalles de la cuenta</span>
            <router-link v-else :to="{name:'cuenta-detalles'}">Detalles de la cuenta</router-link>
          </li>
          <li>
            <span v-if="activo==='wishlist'" aria-current="page">Wishlist</span>
            <router-link v-else :to="{name:'cuenta-wishlist'}">Wishlist</router-link>
          </li>
          <li><button type="button" class="salir-link" @click="salir">Cerrar sesión</button></li>
        </ul>
      </nav>

      <!-- Contenido de cada pantalla de "Mi cuenta" -->
      <main class="cuenta-main">
        <h1 class="visually-hidden">{{ tituloSeccion }}</h1>
        <slot></slot>
      </main>
    </div>

    <site-footer></site-footer>
  </div>
</template>

<script>
import StoreHeader from './StoreHeader.vue';
import SiteFooter from './SiteFooter.vue';
import { cerrarSesion } from '../Api/sesion.js';

export default {
  name: 'CuentaShell',
  components: { StoreHeader, SiteFooter },
  props: {
    // 'escritorio' | 'pedidos' | 'direcciones' | 'detalles' | 'wishlist'
    activo: { type: String, required: true },
    tituloSeccion: { type: String, required: true }
  },
  methods: {
    salir() {
      cerrarSesion(this.$router);
    }
  }
};
</script>
