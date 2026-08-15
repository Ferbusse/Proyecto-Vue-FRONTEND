<template>
  <store-header></store-header>
  <div class="product-detail">
    <div class="pd-image img-placeholder"></div>
    <div class="pd-info">
      <h1>{{ producto.name }}</h1>
      <h4 style="color:var(--azul); font-size:24px; font-weight:800; margin:4px 0 14px;">{{ formatearPrecio(producto.price) }}</h4>
      <h4>Especificaciones</h4>
      <div class="spec-table"><div class="c1"></div><div class="c2"></div></div>
      <button class="wishlist" :class="{active: favorito}" @click="favorito=!favorito">
        <span class="heart">♥</span> Añadir a deseados
      </button>
      <br>
      <button class="btn-primary" @click="agregar">Añadir al carrito</button>
    </div>
  </div>
  <div class="pd-desc">
    <h4>Descripcion:</h4>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. laborum</p>
    <div class="pd-related">
      <h4>Talvez te interese...</h4>
      <div class="products-wrap" style="margin:14px 0;">
        <div class="product-row" style="border-bottom:none;">
          <product-card v-for="p in productosRelacionados" :key="p.id" :product="p"></product-card>
        </div>
      </div>
    </div>
  </div>
  <footer class="site-footer">DISCLAIMERS, CONTACTO, UBICACIÓN, ETC.</footer>
  <div class="toast" :class="{show: mostrarAviso}">Añadido al carrito ✓</div>
</template>

<script>
import StoreHeader from '../components/StoreHeader.vue';
import ProductCard from '../components/ProductCard.vue';
import { CATALOGO, obtenerProducto, formatearPrecio } from '../catalog.js';
import { useCarritoStore } from '../stores/carrito.js';

export default {
  name: 'ProductoView',
  components: { StoreHeader, ProductCard },
  // "id" llega solo como prop porque en el router pusimos props:true
  // en la ruta /producto/:id — así este componente no depende de
  // leer $route a mano.
  props: ['id'],
  data() {
    return {
      carrito: useCarritoStore(),
      favorito: false,
      mostrarAviso: false
    };
  },
  computed: {
    producto() { return obtenerProducto(this.id); },
    productosRelacionados() { return [CATALOGO[3], CATALOGO[6], CATALOGO[9]]; }
  },
  methods: {
    formatearPrecio,
    agregar() {
      this.carrito.agregar(this.id);
      this.mostrarAviso = true;
      setTimeout(() => { this.mostrarAviso = false; }, 1800);
    }
  }
};
</script>
