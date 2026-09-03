<template>
  <div class="view">
    <store-header></store-header>
    <div class="checkout-layout">
      <div class="checkout-form">
        <div class="form-row">
          <div class="form-group"><label>Nombre:</label><input type="text"></div>
          <div class="form-group"><label>Apellido</label><input type="text"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Documento de identidad:</label><input type="text"></div>
          <div class="form-group"><label>Teléfono</label><input type="text"></div>
        </div>
        <div class="form-row"><div class="form-group"><label>Correo Electrónico</label><input type="email"></div></div>
        <div class="form-row"><div class="form-group"><label>Dirección a enviar:</label><input type="text"></div></div>
      </div>
      <div class="checkout-summary">
        <div class="summary-table">
          <div v-if="carrito.lineas.length===0" style="padding:20px; text-align:center; color:#888;">No hay productos en el carrito</div>
          <div class="summary-row" v-for="linea in carrito.lineas" :key="linea.product.id">
            <div class="qty">{{linea.qty}}</div>
            <div class="details">
              <div><div class="product-name" style="text-align:left;">{{linea.product.name}}</div><div style="color:var(--azul);">{{formatearPrecio(linea.product.price)}}</div></div>
              <div class="thumb img-placeholder">
                <img v-if="linea.product.imagenUrl" :src="linea.product.imagenUrl" :alt="linea.product.name" @error="$event.target.style.display='none'">
                <span v-else-if="linea.product.icono" class="product-icono product-icono-chico" aria-hidden="true">{{ linea.product.icono }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="cart-total" style="border:1px solid var(--azul); border-top:none; padding:16px 20px;">
          <span class="cart-total label" style="cursor:default;">Total</span>
          <span class="amount">{{carrito.totalFormateado}}</span>
        </div>
      </div>
    </div>
    <div class="checkout-actions">
      <button class="btn-primary" @click="carrito.continuarCompra()">Continuar</button>
    </div>
  </div>
</template>

<script>
import StoreHeader from '../components/StoreHeader.vue';
import { formatearPrecio } from '../catalog.js';
import { useCarritoStore } from '../stores/carrito.js';

export default {
  name: 'CheckoutView',
  components: { StoreHeader },
  data() {
    return { carrito: useCarritoStore() };
  },
  methods: { formatearPrecio }
};
</script>
