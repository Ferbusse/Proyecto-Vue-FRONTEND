<template>
  <button class="product-card" @click="$router.push({name:'producto', params:{id: product.id}})">
    <div class="product-img img-placeholder">
      <img v-if="product.imagenUrl" :src="product.imagenUrl" :alt="product.name">
      <span v-else-if="product.icono" class="product-icono" aria-hidden="true">{{ product.icono }}</span>
      <template v-else>PRODUCTO<br>DESTACADO</template>
    </div>
    <div class="product-name">{{ product.name }}<br><span style="font-weight:400;">{{ formatearPrecio(product.price) }}</span></div>
  </button>
</template>

<script>
import { formatearPrecio } from '../catalog.js';

export default {
  name: 'ProductCard',
  props: ['product'],
  methods: { formatearPrecio }
};
</script>
