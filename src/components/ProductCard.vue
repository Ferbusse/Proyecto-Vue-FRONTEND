<template>
  <button class="product-card" @click="$router.push({name:'producto', params:{id: product.id}})">
    <div class="product-img img-placeholder">PRODUCTO<br>DESTACADO</div>
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
