<template>
  <div class="view">
    <store-header></store-header>
    <banner-slider></banner-slider>
    <div class="quick-links" v-if="categoriasDestacadas.length">
      <button
        class="tile"
        v-for="categoria in categoriasDestacadas"
        :key="categoria.id"
        @click="$router.push({name:'categoria', query:{categoria: String(categoria.id)}})"
      >{{ categoria.nombre.toUpperCase() }}</button>
    </div>
    <div class="products-wrap">
      <p v-if="productos.cargando" class="producto-vacio">Cargando productos…</p>
      <div class="product-row" v-for="(fila,indiceFila) in filasInicio" :key="indiceFila">
        <product-card v-for="producto in fila" :key="producto.id" :product="producto"></product-card>
      </div>
    </div>
    <site-footer :con-acceso-admin="true"></site-footer>
  </div>
</template>

<script>
import StoreHeader from '../components/StoreHeader.vue';
import BannerSlider from '../components/BannerSlider.vue';
import ProductCard from '../components/ProductCard.vue';
import SiteFooter from '../components/SiteFooter.vue';
import { dividirEnGrupos } from '../catalog.js';
import { useProductosStore } from '../stores/productos.js';
import api from '../Api/api.js';

export default {
  name: 'InicioView',
  components: { StoreHeader, BannerSlider, ProductCard, SiteFooter },
  data() {
    return {
      productos: useProductosStore(),
      // Antes estos 4 botones eran texto fijo ("CATEGORÍA PRODUCTO",
      // "SERVICIO"...) que no llevaban a ningún lado en particular.
      // Ahora muestran categorías reales y filtran el catálogo por esa
      // categoría al tocarlos.
      categoriasDestacadas: []
    };
  },
  computed: {
    filasInicio() {
      const disponibles = this.productos.lista.filter(producto => !producto.agotado);
      return dividirEnGrupos(disponibles.slice(0, 9), 3);
    }
  },
  async mounted() {
    this.productos.cargar();
    try {
      const response = await api.get('/categorias');
      this.categoriasDestacadas = (Array.isArray(response.data) ? response.data : []).slice(0, 4);
    } catch (error) {
      console.error('No se pudieron cargar las categorías destacadas del inicio:', error);
    }
  }
};
</script>
