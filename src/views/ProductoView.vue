<template>
  <div class="view">
    <store-header></store-header>
    <p v-if="!productos.cargado" class="producto-vacio">Cargando producto…</p>
    <template v-else-if="producto">
    <div class="product-detail">
      <div class="pd-image img-placeholder">
        <img v-if="producto.imagenUrl" :src="producto.imagenUrl" :alt="producto.name" @error="$event.target.style.display='none'">
        <span v-else-if="producto.icono" class="product-icono product-icono-grande" aria-hidden="true">{{ producto.icono }}</span>
      </div>
      <div class="pd-info">
        <h1>{{ producto.name }}</h1>
        <h4 style="color:var(--azul); font-size:24px; font-weight:800; margin:4px 0 14px;">{{ formatearPrecio(producto.price) }}</h4>
        <h4>Especificaciones</h4>
        <div class="spec-table"><div class="c1"></div><div class="c2"></div></div>
        <button class="wishlist" :class="{active: favorito}" @click="alternarFavorito">
          <span class="heart">♥</span> {{ favorito ? 'Quitar de deseados' : 'Añadir a deseados' }}
        </button>
        <br>
        <button class="btn-primary" @click="agregar">Añadir al carrito</button>
      </div>
    </div>
    <div class="pd-desc">
      <h4>Descripción:</h4>
      <p>{{ producto.descripcion || 'Este producto todavía no tiene una descripción.' }}</p>
      <div class="pd-related" v-if="productosRelacionados.length">
        <h4>Tal vez te interese...</h4>
        <div class="products-wrap" style="margin:14px 0;">
          <div class="product-row" style="border-bottom:none;">
            <product-card v-for="p in productosRelacionados" :key="p.id" :product="p"></product-card>
          </div>
        </div>
      </div>
    </div>
    </template>
    <site-footer></site-footer>
    <div class="toast" :class="{show: mostrarAviso}">Añadido al carrito ✓</div>
  </div>
</template>

<script>
import StoreHeader from '../components/StoreHeader.vue';
import ProductCard from '../components/ProductCard.vue';
import SiteFooter from '../components/SiteFooter.vue';
import { formatearPrecio } from '../catalog.js';
import { useCarritoStore } from '../stores/carrito.js';
import { useFavoritosStore } from '../stores/favoritos.js';
import { useProductosStore } from '../stores/productos.js';

export default {
  name: 'ProductoView',
  components: { StoreHeader, ProductCard, SiteFooter },
  // "id" llega solo como prop porque en el router pusimos props:true
  // en la ruta /producto/:id — así este componente no depende de
  // leer $route a mano.
  props: ['id'],
  data() {
    return {
      carrito: useCarritoStore(),
      favoritos: useFavoritosStore(),
      productos: useProductosStore(),
      mostrarAviso: false
    };
  },
  computed: {
    producto() { return this.productos.obtenerProducto(this.id); },
    favorito() { return this.favoritos.esFavorito(this.id); },
    productosRelacionados() {
      const otros = this.productos.lista.filter(p => p.id !== String(this.id));
      if (!this.producto) return otros.slice(0, 3);

      // Primero los de la misma categoría (si el producto tiene una);
      // si no alcanzan para completar 3, rellenamos con el resto del
      // catálogo para que la sección no se vea escasa.
      const categoriaIds = this.producto.categoriaIds?.length ? this.producto.categoriaIds : [this.producto.categoriaId].filter(Boolean);
      const mismaCategoria = categoriaIds.length
        ? otros.filter(p => (p.categoriaIds?.length ? p.categoriaIds : [p.categoriaId]).some(id => categoriaIds.includes(id)))
        : [];

      if (mismaCategoria.length >= 3) return mismaCategoria.slice(0, 3);

      const idsYaElegidos = new Set(mismaCategoria.map(p => p.id));
      const relleno = otros.filter(p => !idsYaElegidos.has(p.id));
      return [...mismaCategoria, ...relleno].slice(0, 3);
    }
  },
  methods: {
    formatearPrecio,
    alternarFavorito() {
      this.favoritos.alternar(this.id);
    },
    agregar() {
      this.carrito.agregar(this.id);
      this.mostrarAviso = true;
      setTimeout(() => { this.mostrarAviso = false; }, 1800);
    }
  },
  mounted() {
    this.productos.cargar();
  }
};
</script>
