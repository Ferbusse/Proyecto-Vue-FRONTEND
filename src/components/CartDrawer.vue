<template>
  <div class="cart-drawer-overlay" :class="{open: carrito.abierto}" @click.self="carrito.cerrar()">
    <div class="cart-drawer">
      <div class="cart-drawer-header">
        <h3>Carrito</h3>
        <button class="cart-drawer-close" @click="carrito.cerrar()">✕</button>
      </div>
      <div class="cart-drawer-items">
        <div class="cart-drawer-empty" v-if="carrito.lineas.length===0">Tu carrito está vacío</div>
        <div class="cart-drawer-item" v-for="linea in carrito.lineas" :key="linea.product.id">
          <div class="thumb img-placeholder">
            <img v-if="linea.product.imagenUrl" :src="linea.product.imagenUrl" :alt="linea.product.name">
            <span v-else-if="linea.product.icono" class="product-icono product-icono-chico" aria-hidden="true">{{ linea.product.icono }}</span>
          </div>
          <div class="info">
            <div class="name">{{ linea.product.name }}</div>
            <div class="price">{{ formatearPrecio(linea.product.price) }}</div>
            <div class="qty-row">
              <button @click="carrito.cambiarCantidad(linea.product.id, -1)">−</button>
              <span>{{ linea.qty }}</span>
              <button @click="carrito.cambiarCantidad(linea.product.id, 1)">+</button>
            </div>
          </div>
          <button class="remove" @click="carrito.quitar(linea.product.id)">✕</button>
        </div>
      </div>
      <div class="cart-drawer-footer">
        <div class="cart-drawer-total"><span>Total</span><span>{{ carrito.totalFormateado }}</span></div>
        <button class="btn-primary" style="width:100%;" @click="pagar">Pagar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCarritoStore } from '../stores/carrito.js';
import { formatearPrecio } from '../catalog.js';

export default {
  name: 'CartDrawer',
  data() {
    return { carrito: useCarritoStore() };
  },
  methods: {
    formatearPrecio,
    pagar() {
      if (this.carrito.pagarDesdeCarrito()) {
        this.$router.push({ name: 'checkout' });
      }
    }
  }
};
</script>
