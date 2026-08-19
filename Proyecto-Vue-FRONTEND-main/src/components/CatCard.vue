<template>
  <button class="cat-card" @click="$router.push({name:'producto', params:{id: product.id}})">
    <div class="img-placeholder"></div>
    <div class="name">{{ product.name }}<br>{{ formatearPrecio(product.price) }}</div>
  </button>
</template>

<script>
import { formatearPrecio } from '../catalog.js';

export default {
  name: 'CatCard',
  props: ['product'],
  methods: { formatearPrecio }
};
</script>
