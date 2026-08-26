<template>
  <button class="cat-card" @click="$router.push({name:'producto', params:{id: product.id}})">
    <div class="img-placeholder">
      <span v-if="product.icono" class="product-icono" aria-hidden="true">{{ product.icono }}</span>
    </div>
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
