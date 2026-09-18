<template>
  <button class="cat-card" @click="$router.push({name:'producto', params:{id: cosa.id}})">
    <div class="img-placeholder">
      <img v-if="cosa.imagenUrl || cosa.imagen_url || cosa.imagen" :src="cosa.imagenUrl || cosa.imagen_url || cosa.imagen" :alt="cosa.name" @error="$event.target.style.display='none'">
    </div>
    <div class="name">{{ cosa.name }}<br>{{ plataFormato(cosa.price) }}</div>
  </button>
</template>

<script>
import { plataFormato } from '../../data/varios/cositas.js';

export default {
  name: 'TarjetaCat',
  props: ['cosa'],
  methods: { plataFormato }
};
</script>
