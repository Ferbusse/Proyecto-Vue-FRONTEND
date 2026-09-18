<template>
  <button class="product-card" @click="$router.push({name:'producto', params:{id: cosa.id}})">
    <div class="product-img img-placeholder">
      <img v-if="cosa.imagenUrl || cosa.imagen_url || cosa.imagen" :src="cosa.imagenUrl || cosa.imagen_url || cosa.imagen" :alt="cosa.name" @error="$event.target.style.display='none'">
      <template v-else>PRODUCTO<br>DESTACADO</template>
    </div>
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
