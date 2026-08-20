<template>
  <div class="view">
    <store-header></store-header>
    <banner-slider></banner-slider>
    <!-- MARCADOR: Prueba de datos - eliminar todo el bloque DatosLista si no se usa -->
  <!-- <datos-lista></datos-lista> -->
    <!-- FIN MARCADOR -->
    <div class="quick-links">
      <button class="tile" @click="$router.push({name:'categoria'})">CATEGORIA<br>PRODUCTO</button>
      <button class="tile" @click="$router.push({name:'categoria'})">CATEGORIA<br>PRODUCTO</button>
      <button class="tile" @click="$router.push({name:'categoria'})">SERVICIO</button>
      <button class="tile" @click="$router.push({name:'categoria'})">SERVICIO</button>
    </div>
    <div class="products-wrap">
      <div class="product-row" v-for="(fila,indiceFila) in filasInicio" :key="indiceFila">
        <product-card v-for="producto in fila" :key="producto.id" :product="producto"></product-card>
      </div>
    </div>
    <div class="continua">(continua con ofertas etc)</div>
    <footer class="site-footer">
      DISCLAIMERS, CONTACTO, UBICACIÓN, ETC.
      <router-link class="admin-link" :to="{name:'admin-panel'}">Panel Administrador →</router-link>
    </footer>
  </div>
</template>

<script>
import StoreHeader from '../components/StoreHeader.vue';
import BannerSlider from '../components/BannerSlider.vue';
import ProductCard from '../components/ProductCard.vue';
import DatosLista from '../components/DatosLista.vue'; // MARCADOR: Prueba de datos - eliminar esta línea si no se usa
import { CATALOGO, dividirEnGrupos } from '../catalog.js';

export default {
  name: 'InicioView',
  components: { StoreHeader, BannerSlider, ProductCard, DatosLista }, // MARCADOR: Agregar DatosLista
  computed: {
    filasInicio() { return dividirEnGrupos(CATALOGO.slice(0, 9), 3); }
  }
};
</script>
