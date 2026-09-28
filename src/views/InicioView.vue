<template>
  <div class="view">
    <store-header></store-header>
    <banner-slider></banner-slider>

    <!-- Franja de confianza: envíos / garantía / pago seguro -->
    <div class="franjas-confianza">
      <div class="franja-item">
        <span class="franja-icono" aria-hidden="true">🚚</span>
        <div class="franja-texto">
          <strong>Envíos a todo el país</strong>
          <span>Recibí tu pedido en 24-48hs</span>
        </div>
      </div>
      <div class="franja-item">
        <span class="franja-icono franja-icono-svg" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"/></svg>
        </span>
        <div class="franja-texto">
          <strong>Garantía de 12 meses</strong>
          <span>En cargadores y accesorios originales</span>
        </div>
      </div>
      <div class="franja-item">
        <span class="franja-icono franja-icono-svg" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 9.5h19"/></svg>
        </span>
        <div class="franja-texto">
          <strong>Pago seguro</strong>
          <span>Elegí el medio que prefieras al pagar</span>
        </div>
      </div>
    </div>

    <div class="products-wrap">
      <h2 class="products-wrap-titulo">Novedades</h2>
      <p v-if="cargandoNovedades" class="producto-vacio">Cargando productos…</p>
      <div class="product-row" v-for="(fila,indiceFila) in filasInicio" :key="indiceFila">
        <product-card v-for="producto in fila" :key="producto.id" :product="producto"></product-card>
      </div>
    </div>

    <div class="cta-catalogo-wrap">
      <div class="cta-catalogo">
        <div class="cta-catalogo-texto">
          <p class="cta-catalogo-eyebrow">Zona Móvil</p>
          <h2>Explorá todo el catálogo</h2>
          <p class="cta-catalogo-bajada">Fundas, cargadores, auriculares y mucho más, organizado por categoría.</p>
          <router-link :to="{name:'categoria'}" class="cta-catalogo-btn">Ver catálogo completo</router-link>
        </div>
        <div class="cta-catalogo-icono" aria-hidden="true">
          <span></span><span></span><span></span><span class="acento"></span>
        </div>
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
import { useProductosStore, normalizarProducto } from '../stores/productos.js';
import api from '../Api/api.js';

export default {
  name: 'InicioView',
  components: { StoreHeader, BannerSlider, ProductCard, SiteFooter },
  data() {
    return {
      productos: useProductosStore(),
      cargandoNovedades: false,
      // "Novedades" debería mostrar los productos más vendidos de la
      // última semana. Mientras ese endpoint no exista en el backend,
      // queda en null y el catálogo general se usa como respaldo (ver
      // el comentario grande en cargarNovedades más abajo).
      productosMasVendidos: null
    };
  },
  computed: {
    filasInicio() {
      const origen = this.productosMasVendidos ?? this.productos.lista;
      const disponibles = origen.filter(producto => !producto.agotado);
      return dividirEnGrupos(disponibles.slice(0, 9), 3);
    }
  },
  async mounted() {
    this.productos.cargar();
    this.cargarNovedades();
  },
  methods: {
    // ============================================================
    // PENDIENTE DE BACKEND — para el compañero que arme el endpoint:
    //
    // Esta pantalla necesita un endpoint público (sin login) que
    // devuelva los productos más vendidos de los últimos N días, por
    // ejemplo:
    //
    //   GET /api/productos/mas-vendidos?dias=7
    //
    // Ya existe una consulta muy parecida (agrupa Detalle_Ventas por
    // producto y ordena por cantidad vendida) en
    // AnaliticasController@index — ahí se calcula sobre TODO el
    // historial y solo para el panel de admin. Para este endpoint
    // haría falta:
    //   - Filtrar Detalle_Ventas/Ventas a los últimos $dias (join con
    //     ventas.fecha, igual que hace AnaliticasController).
    //   - Devolver los productos completos (no solo id/nombre/unidades
    //     como en Analíticas), con los mismos campos que ya devuelve
    //     GET /productos, para poder reusar normalizarProducto() del
    //     lado del frontend sin cambios.
    //   - Una ruta pública (sin ghost.auth), a diferencia de
    //     /admin/... o /analiticas.
    //
    // Hasta que exista, este método intenta llamarlo igual: si el
    // endpoint no está (404) o falla por cualquier motivo, no rompe
    // nada — sencillamente se queda con el catálogo general como
    // respaldo (ver el computed "filasInicio").
    // ============================================================
    async cargarNovedades() {
      this.cargandoNovedades = true;
      try {
        const response = await api.get('/productos/mas-vendidos', { params: { dias: 7 } });
        const productos = Array.isArray(response.data) ? response.data : [];
        if (productos.length) {
          this.productosMasVendidos = productos.map(normalizarProducto);
        }
      } catch (error) {
        // Esperable mientras el endpoint no exista todavía: seguimos
        // mostrando el catálogo general sin molestar al usuario.
        console.info('Todavía no hay endpoint de "más vendidos" en el backend; muestro el catálogo general.');
      } finally {
        this.cargandoNovedades = false;
      }
    }
  }
};
</script>
