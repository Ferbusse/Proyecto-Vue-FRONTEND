<template>
 
  <router-view v-slot="{ Component }">
    <transition name="route-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <cart-drawer></cart-drawer>
  <payment-modals></payment-modals>

  <div class="toast" :class="{show: carrito.mostrarAvisoGlobal}">¡Pago realizado con éxito!</div>

  </template>













<script>
import { useCarritoStore } from './stores/carrito.js';
import CartDrawer from './components/CartDrawer.vue';
import PaymentModals from './components/PaymentModals.vue';

export default {
  name: 'App',
  components: { CartDrawer, PaymentModals },
  data() {
    return { carrito: useCarritoStore() };
  }
};
</script>
