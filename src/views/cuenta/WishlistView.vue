<template>
  <cuenta-shell activo="wishlist" titulo-seccion="Wishlist">
    <div v-if="!productosFavoritos.length" class="cuenta-vacio">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 20s-7-4.4-9.5-8.8C.8 8 2 4.5 5.4 4 7.7 3.6 10 4.8 12 7c2-2.2 4.3-3.4 6.6-3 3.4.5 4.6 4 3 7.2C19 15.6 12 20 12 20z"/></svg>
      <h2>Tu wishlist está vacía</h2>
      <p>Guardá tus productos favoritos para encontrarlos rápido más adelante.</p>
      <router-link class="cuenta-vacio-cta" :to="{name:'categoria'}">Ver productos</router-link>
    </div>
    <div v-else class="products-wrap">
      <div class="cuenta-barra">
        <span class="cuenta-nota-local">{{ productosFavoritos.length }} producto{{ productosFavoritos.length > 1 ? 's' : '' }} guardado{{ productosFavoritos.length > 1 ? 's' : '' }}</span>
      </div>
      <div class="product-row">
        <div v-for="producto in productosFavoritos" :key="producto.id" class="wishlist-item">
          <product-card :product="producto"></product-card>
          <div class="wishlist-acciones">
            <button type="button" :disabled="agotado(producto)" @click="agregarAlCarrito(producto)">{{ agotado(producto) ? 'Agotado' : 'Agregar al carrito' }}</button>
            <button type="button" class="peligro" @click="favoritos.quitar(producto.id)">Quitar</button>
          </div>
        </div>
      </div>
    </div>
  </cuenta-shell>
</template>

<script>
import CuentaShell from '../../components/CuentaShell.vue';
import ProductCard from '../../components/ProductCard.vue';
import { useFavoritosStore } from '../../stores/favoritos.js';
import { useProductosStore } from '../../stores/productos.js';
import { useCarritoStore } from '../../stores/carrito.js';

export default {
  name: 'WishlistView',
  components: { CuentaShell, ProductCard },
  data() {
    return {
      favoritos: useFavoritosStore(),
      productos: useProductosStore(),
      carrito: useCarritoStore()
    };
  },
  computed: {
    productosFavoritos() {
      return this.productos.lista.filter(producto => this.favoritos.esFavorito(producto.id));
    }
  },
  mounted() {
    this.productos.refrescar();
  },
  methods: {
    agotado(producto) {
      return Number(producto.stock) <= 0 || producto.estado === 'agotado' || producto.agotado;
    },
    agregarAlCarrito(producto) {
      this.carrito.agregar(producto.id);
      this.carrito.abrir();
    }
  }
};
</script>
