<template>
  <div class="view">
    <store-header></store-header>
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
            <input type="range" min="290" max="3500" v-model="filtroPrecio">
            <div class="price-label">Precio: 290$ – {{filtroPrecio}}$</div>
          </div>
        </div>
      </div>
      <div class="cat-main">
        <div class="cat-toolbar">
          <h3>Ordenar por:</h3>
          <select v-model="ordenarPor">
            <option value="menor">Menor Precio</option>
            <option value="mayor">Mayor Precio</option>
            <option value="vendidos">Más vendidos</option>
          </select>
        </div>
        <p v-if="productos.cargando" class="producto-vacio">Cargando productos…</p>
        <div class="cat-grid">
          <cat-card v-for="producto in itemsGrilla" :key="producto.id" :product="producto"></cat-card>
        </div>
        <div class="pagination">
          <button class="arrow-btn">‹</button>
          <button v-for="n in 4" :key="n" :class="{active: n===1}">{{n}}</button>
          <button class="arrow-btn">›</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StoreHeader from '../components/StoreHeader.vue';
import CatCard from '../components/CatCard.vue';
import { useProductosStore } from '../stores/productos.js';

export default {
  name: 'CategoriaView',
  components: { StoreHeader, CatCard },
  data() {
    return {
      productos: useProductosStore(),
      filtroPrecio: 4000,
      ordenarPor: 'menor'
    };
  },
  computed: {
    itemsGrilla() {
      const lista = this.productos.lista.filter(p => p.price <= this.filtroPrecio);
      const ordenada = [...lista];
      if (this.ordenarPor === 'menor') ordenada.sort((a, b) => a.price - b.price);
      if (this.ordenarPor === 'mayor') ordenada.sort((a, b) => b.price - a.price);
      // "más vendidos" queda igual al orden que trae el backend, todavía
      // no tenemos ese dato
      return ordenada;
    }
  },
  mounted() {
    this.productos.cargar();
  }
};
</script>
