<template>
  <div class="view">
    <store-header></store-header>
    <p v-if="!productos.lista.length" class="producto-vacio">Cargando producto…</p>
    <div v-else-if="!producto" class="producto-vacio" style="text-align:center; padding:60px 20px;">
      <p>No encontramos este producto. Puede que ya no esté disponible.</p>
      <router-link :to="{name:'categoria'}" class="cal-hoy-btn" style="display:inline-block; margin-top:10px;">Ver catálogo</router-link>
    </div>
    <template v-else>
    <div class="product-detail">
      <div class="pd-image img-placeholder">
        <img v-if="producto.imagenUrl" :src="producto.imagenUrl" :alt="producto.name" @error="$event.target.style.display='none'">
        <span v-else-if="producto.icono" class="product-icono product-icono-grande" aria-hidden="true">{{ producto.icono }}</span>
      </div>
      <div class="pd-info">
        <h1>{{ producto.name }}</h1>
        <p class="pd-precio">{{ formatearPrecio(producto.price) }}</p>
        <div class="pd-acciones">
          <button class="btn-primary" :disabled="producto.agotado" @click="agregar">
            {{ producto.agotado ? 'Agotado' : 'Añadir al carrito' }}
          </button>
          <button class="wishlist" :class="{active: favorito}" type="button" :aria-pressed="favorito" @click="alternarFavorito">
            <span class="heart" aria-hidden="true">❤️</span> {{ favorito ? 'Quitar de deseados' : 'Añadir a deseados' }}
          </button>
        </div>
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
      const otros = this.productos.lista.filter(p => p.id !== String(this.id) && !p.agotado);
      if (!this.producto) return otros.slice(0, 3);

      // Solo mostramos productos disponibles de la misma categoría.
      const categoriaIds = this.producto.categoriaIds?.length ? this.producto.categoriaIds : [this.producto.categoriaId].filter(Boolean);
      const mismaCategoria = categoriaIds.length
        ? otros.filter(p => (p.categoriaIds?.length ? p.categoriaIds : [p.categoriaId]).some(id => categoriaIds.includes(id)))
        : [];

      if (mismaCategoria.length) return mismaCategoria.slice(0, 3);

      // Si no hay relacionados de la categoría, mostramos alternativas
      // disponibles para que la sección no quede vacía.
      return otros.slice(0, 3);
    }
  },
  methods: {
    formatearPrecio,
    alternarFavorito() {
      this.favoritos.alternar(this.id);
    },
    agregar() {
      if (this.producto?.agotado) return;
      if (!this.carrito.agregar(this.id)) return;
      this.mostrarAviso = true;
      setTimeout(() => { this.mostrarAviso = false; }, 1800);
    }
  },
  mounted() {
    this.productos.cargar();
  }
};
</script>
