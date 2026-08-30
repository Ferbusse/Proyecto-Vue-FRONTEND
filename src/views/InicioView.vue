<template>
  <div class="view">
    <store-header></store-header>
    <banner-slider></banner-slider>
    <div class="quick-links">
      <button class="tile" @click="$router.push({name:'categoria'})">CATEGORIA<br>PRODUCTO</button>
      <button class="tile" @click="$router.push({name:'categoria'})">CATEGORIA<br>PRODUCTO</button>
      <button class="tile" @click="$router.push({name:'categoria'})">SERVICIO</button>
      <button class="tile" @click="$router.push({name:'categoria'})">SERVICIO</button>
    </div>
    <div class="products-wrap">
      <p v-if="productos.cargando" class="producto-vacio">Cargando productos…</p>
      <div class="product-row" v-for="(fila,indiceFila) in filasInicio" :key="indiceFila">
        <product-card v-for="producto in fila" :key="producto.id" :product="producto"></product-card>
      </div>
    </div>
    <div class="continua">(continua con ofertas etc)</div>
    <site-footer :con-acceso-admin="true"></site-footer>
  </div>
</template>

<script>
import StoreHeader from '../components/StoreHeader.vue';
import BannerSlider from '../components/BannerSlider.vue';
import ProductCard from '../components/ProductCard.vue';
import SiteFooter from '../components/SiteFooter.vue';
import { dividirEnGrupos } from '../catalog.js';
import { useProductosStore } from '../stores/productos.js';

export default {
  name: 'InicioView',
  components: { StoreHeader, BannerSlider, ProductCard, SiteFooter },
  data() {
    return { productos: useProductosStore() };
  },
  computed: {
    filasInicio() { return dividirEnGrupos(this.productos.lista.slice(0, 9), 3); }
  },
  mounted() {
    this.productos.cargar();
  }
};
</script>
