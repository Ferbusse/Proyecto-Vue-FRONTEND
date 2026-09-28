<template>
  <div class="view">
    <store-header></store-header>
    <banner-slider></banner-slider>

    <!-- Solo se muestra si el backend devuelve productos en /mas-vendidos
         (ver Api/masVendidos.js). Si no, la sección no aparece. -->
    <div class="products-wrap" v-if="filasMasVendidos.length">
      <div class="section-heading"><h2>Más vendidos</h2></div>
      <div class="product-row" v-for="(fila,indiceFila) in filasMasVendidos" :key="indiceFila">
        <product-card v-for="producto in fila" :key="producto.id" :product="producto"></product-card>
      </div>
    </div>

    <div class="benefits-strip">
      <div class="benefit"><span class="benefit-icon" aria-hidden="true">🚚</span><div><strong>Envíos a todo el país</strong><small>Recibí tu pedido en 24-48hs</small></div></div>
      <div class="benefit"><span class="benefit-icon" aria-hidden="true">🛡️</span><div><strong>Garantía de 12 meses</strong><small>En cargadores y accesorios originales</small></div></div>
      <div class="benefit"><span class="benefit-icon" aria-hidden="true">💳</span><div><strong>Pago seguro</strong><small>Elegí el medio que prefieras al pagar</small></div></div>
    </div>

    <div class="products-wrap">
      <div class="section-heading"><h2>Novedades</h2></div>
      <p v-if="productos.cargando" class="producto-vacio">Cargando productos…</p>
      <p v-else-if="!filasInicio.length" class="producto-vacio">Todavía no hay productos cargados.</p>
      <div class="product-row" v-for="(fila,indiceFila) in filasInicio" :key="indiceFila">
        <product-card v-for="producto in fila" :key="producto.id" :product="producto"></product-card>
      </div>
    </div>

    <div class="mini-banner">
      <div class="banner banner-slide-3">
        <div class="banner-text">
          <p class="eyebrow">ZONA MÓVIL</p>
          <h1>Explorá todo el catálogo</h1>
          <p>Fundas, cargadores, auriculares y mucho más, organizado por categoría.</p>
          <button class="btn-primary" style="margin-top:16px;" @click="irACategoria(null)">Ver catálogo completo</button>
        </div>
        <svg class="banner-icon" viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.08)"/>
          <rect x="20" y="20" width="26" height="26" rx="4" fill="#fff" opacity=".95"/>
          <rect x="54" y="20" width="26" height="26" rx="4" fill="#fff" opacity=".7"/>
          <rect x="20" y="54" width="26" height="26" rx="4" fill="#fff" opacity=".7"/>
          <rect x="54" y="54" width="26" height="26" rx="4" fill="#ffd166"/>
        </svg>
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
import { obtenerMasVendidos } from '../Api/masVendidos.js';
import { dividirEnGrupos } from '../catalog.js';
import { useProductosStore } from '../stores/productos.js';

export default {
  name: 'InicioView',
  components: { StoreHeader, BannerSlider, ProductCard, SiteFooter },
  data() {
    return {
      productos: useProductosStore(),
      masVendidos: []
    };
  },
  computed: {
    filasInicio() { return dividirEnGrupos(this.productos.lista.slice(0, 9), 3); },
    filasMasVendidos() { return dividirEnGrupos(this.masVendidos.slice(0, 6), 3); }
  },
  mounted() {
    this.productos.cargar();
    this.cargarMasVendidos();
  },
  methods: {
    async cargarMasVendidos() {
      this.masVendidos = await obtenerMasVendidos(6);
    },
    irACategoria(categoriaId) {
      this.$router.push({ name: 'categoria', query: categoriaId ? { categoria: categoriaId } : {} });
    }
  }
};
</script>
