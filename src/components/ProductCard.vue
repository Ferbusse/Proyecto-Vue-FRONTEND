<template>
  <button class="product-card" @click="$router.push({name:'producto', params:{id: product.id}})">
    <div class="product-img img-placeholder" :class="{'product-img-sin-fondo': product.imagenUrl}">
      <img v-if="product.imagenUrl" :src="product.imagenUrl" :alt="product.name" @error="$event.target.style.display='none'">
      <span v-else-if="product.icono" class="product-icono" aria-hidden="true">{{ product.icono }}</span>
      <template v-else>PRODUCTO<br>DESTACADO</template>
    </div>
    <div class="product-name">{{ product.name }}<br><span style="font-weight:400;">{{ formatearPrecio(product.price) }}</span></div>
    <span v-if="agotado" class="product-stock-status">Agotado</span>
  </button>
</template>

<script>
import { formatearPrecio } from '../catalog.js';

export default {
  name: 'ProductCard',
  props: ['product'],
  computed: {
    agotado() {
      return Number(this.product.stock) <= 0 || this.product.estado === 'agotado' || this.product.agotado;
    }
  },
  methods: { formatearPrecio }
};
</script>
