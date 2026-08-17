<template>
  <button class="cat-card" @click="$router.push({name:'producto', params:{id: cosa.id}})">
    <div class="img-placeholder"></div>
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
