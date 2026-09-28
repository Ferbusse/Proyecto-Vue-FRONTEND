<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" :key="$route.fullPath" />
  </router-view>

  <cart-drawer v-if="!enAdmin"></cart-drawer>
  <payment-modals v-if="!enAdmin"></payment-modals>
  <floating-social v-if="!enAdmin"></floating-social>

  <div v-if="!enAdmin" class="toast" :class="{show: carrito.mostrarAvisoGlobal}">¡Pago realizado con éxito!</div>
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
