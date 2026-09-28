<template>
  <router-view v-slot="{ Component }">
    <transition name="route-fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>

  <cart-drawer></cart-drawer>
  <payment-modals></payment-modals>
  <floating-social v-if="!enAdmin"></floating-social>

  <div class="toast" :class="{show: carrito.mostrarAvisoGlobal}">¡Pago realizado con éxito!</div>
</template>

<script>
import { useCarritoStore } from './stores/carrito.js';
import CartDrawer from './components/CartDrawer.vue';
import PaymentModals from './components/PaymentModals.vue';
import FloatingSocial from './components/FloatingSocial.vue';

export default {
  name: 'App',
  components: { CartDrawer, PaymentModals, FloatingSocial },
  data() {
    return { carrito: useCarritoStore() };
  },
  computed: {
    enAdmin() {
      return this.$route.path.startsWith('/admin');
    }
  }
};
</script>
