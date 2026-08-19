<template>
  <button class="product-card" @click="$router.push({name:'producto', params:{id: cosa.id}})">
    <div class="product-img img-placeholder">PRODUCTO<br>DESTACADO</div>
    <div class="product-name">{{ cosa.name }}<br><span style="font-weight:400;">{{ plataFormato(cosa.price) }}</span></div>
  </button>
</template>

<script>
import { plataFormato } from '../../data/varios/cositas.js'

export default {
  name: 'TarjetaCosa',
  props: ['cosa'],
  methods: { plataFormato }
};
</script>
