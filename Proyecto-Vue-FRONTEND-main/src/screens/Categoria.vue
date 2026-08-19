<template>
  <cabeza-tienda></cabeza-tienda>
  <div class="cat-body">
    <div class="cat-sidebar">
      <div class="cat-inner-sidebar">
        <div class="cat-group">
          <a class="cat-group-title">CATEGORÍA <span>–</span></a>
          <div class="cat-sub">
            <a v-for="n in 5" :key="n">Subcategoria</a>
          </div>
        </div>
        <div class="cat-group"><a class="cat-group-title">CATEGORÍA <span>+</span></a></div>
        <div class="cat-group"><a class="cat-group-title">CATEGORÍA</a></div>
        <div class="cat-group"><a class="cat-group-title">CATEGORÍA <span>+</span></a></div>
        <div class="cat-group"><a class="cat-group-title">CATEGORÍA</a></div>
        <div class="cat-group"><a class="cat-group-title">CATEGORÍA <span>+</span></a></div>
        <div class="filter-box">
          <h4>Filtrar por precio</h4>
          <input type="range" min="290" max="3500" v-model="limitePlata">
          <div class="price-label">Precio: 290$ – {{limitePlata}}$</div>
        </div>
      </div>
    </div>
    <div class="cat-main">
      <div class="cat-toolbar">
        <h3>Ordenar por:</h3>
        <select v-model="comoOrdenar">
          <option value="menor">Menor Precio</option>
          <option value="mayor">Mayor Precio</option>
          <option value="vendidos">Más vendidos</option>
        </select>
      </div>
      <div class="cat-grid">
        <tarjeta-cat v-for="cositaX in cosasGrilla" :key="cositaX.uid" :cosa="cositaX"></tarjeta-cat>
      </div>
      <div class="pagination">
        <button class="arrow-btn">‹</button>
        <button v-for="n in 4" :key="n" :class="{active: n===1}">{{n}}</button>
        <button class="arrow-btn">›</button>
      </div>
    </div>
  </div>
</template>

<script>
import CabezaTienda from '../components/ui/CabezaTienda.vue';
import TarjetaCat from '../components/tarjetas/TarjetaCat.vue';
import { LISTA_COSAS } from '../data/varios/cositas.js'

export default {
  name: 'Categoria',
  components: { CabezaTienda, TarjetaCat },
  data() {
    return {
      limitePlata: 4000,
      comoOrdenar: 'menor'
    };
  },
  computed: {
    cosasGrilla() {
      const pilita = [];
      for (let j = 0; j < 16; j++) {
        const cositaX = Object.assign({}, LISTA_COSAS[j % LISTA_COSAS.length]);
        cositaX.uid = 'g' + j;
        pilita.push(cositaX);
      }
      return pilita;
    }
  }
};
</script>
