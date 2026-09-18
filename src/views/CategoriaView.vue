<template>
  <div class="view">
    <store-header></store-header>
    <div class="cat-body">
      <div class="cat-sidebar">
        <div class="cat-inner-sidebar">
          <div class="cat-group">
            <a
              class="cat-group-title"
              :class="{activa: !categoriaSeleccionada}"
              @click="seleccionarCategoria(null)"
            >TODAS LAS CATEGORÍAS</a>
          </div>

          <div v-if="categorias.length" class="cat-group" v-for="categoria in categorias" :key="categoria.id">
            <a
              class="cat-group-title"
              :class="{activa: categoriaSeleccionada === String(categoria.id)}"
              @click="seleccionarCategoria(categoria.id)"
            >{{ categoria.nombre.toUpperCase() }}</a>
          </div>
          <p v-else class="producto-vacio">Cargando categorías…</p>
          <div class="filter-box">
            <h4>Filtrar por precio</h4>
            <label class="price-sub-label">Mínimo: {{ filtroPrecioMin }}$</label>
            <input type="range" min="290" max="3500" v-model.number="filtroPrecioMin" @input="alCambiarPrecioMin">
            <label class="price-sub-label">Máximo: {{ filtroPrecioMax }}$</label>
            <input type="range" min="290" max="3500" v-model.number="filtroPrecioMax" @input="alCambiarPrecioMax">
            <div class="price-label">Precio: {{filtroPrecioMin}}$ – {{filtroPrecioMax}}$</div>
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
          <cat-card v-for="producto in itemsPagina" :key="producto.id" :product="producto"></cat-card>
        </div>
        <div v-if="!itemsGrilla.length" class="producto-vacio">No hay productos para esta categoría.</div>
        <div class="pagination" v-if="totalPaginas > 1">
          <button class="arrow-btn" :disabled="paginaActual === 1" @click="irAPagina(paginaActual - 1)">‹</button>
          <button v-for="n in totalPaginas" :key="n" :class="{active: n === paginaActual}" @click="irAPagina(n)">{{n}}</button>
          <button class="arrow-btn" :disabled="paginaActual === totalPaginas" @click="irAPagina(paginaActual + 1)">›</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StoreHeader from '../components/StoreHeader.vue';
import CatCard from '../components/CatCard.vue';
import api from '../Api/api.js';
import { useProductosStore } from '../stores/productos.js';

// Cantidad máxima de productos que se muestran por página de catálogo.
const PRODUCTOS_POR_PAGINA = 16;

export default {
  name: 'CategoriaView',
  components: { StoreHeader, CatCard },
  data() {
    return {
      productos: useProductosStore(),
      categorias: [],
      categoriaSeleccionada: null,
      filtroPrecioMin: 290,
      filtroPrecioMax: 3500,
      ordenarPor: 'menor',
      paginaActual: 1
    };
  },
  computed: {
    // Filtra primero por precio y luego, si hay una categoría seleccionada,
    // deja solo los productos que pertenecen a esa categoría.
    itemsGrilla() {
      let lista = this.productos.lista.filter(
        p => p.price >= this.filtroPrecioMin && p.price <= this.filtroPrecioMax
      );

      if (this.categoriaSeleccionada) {
        lista = lista.filter((producto) => {
          const ids = producto.categoriaIds || [];
          const categoriaId = producto.categoriaId != null ? String(producto.categoriaId) : null;
          return categoriaId === String(this.categoriaSeleccionada) || ids.includes(String(this.categoriaSeleccionada));
        });
      }

      const ordenada = [...lista];
      if (this.ordenarPor === 'menor') ordenada.sort((a, b) => a.price - b.price);
      if (this.ordenarPor === 'mayor') ordenada.sort((a, b) => b.price - a.price);
      if (this.ordenarPor === 'vendidos') ordenada.sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0));
      return ordenada;
    },
    // Los botones de paginación se arman según la cantidad real de
    // productos filtrados, no un número fijo.
    totalPaginas() {
      return Math.max(1, Math.ceil(this.itemsGrilla.length / PRODUCTOS_POR_PAGINA));
    },
    itemsPagina() {
      const desde = (this.paginaActual - 1) * PRODUCTOS_POR_PAGINA;
      return this.itemsGrilla.slice(desde, desde + PRODUCTOS_POR_PAGINA);
    }
  },
  watch: {
    // Lee la categoría desde la URL para que el filtro se mantenga si se
    // recarga la página o se comparte el link de una categoría concreta.
    '$route.query.categoria': {
      immediate: true,
      handler(nuevoValor) {
        this.categoriaSeleccionada = nuevoValor ? String(nuevoValor) : null;
        this.paginaActual = 1;
      }
    },
    // Si cambia cualquier filtro u orden, volvemos a la página 1: si no,
    // se podría quedar en una página que ya no tiene productos.
    filtroPrecioMin() { this.paginaActual = 1; },
    filtroPrecioMax() { this.paginaActual = 1; },
    ordenarPor() { this.paginaActual = 1; },
    // Por si el filtro deja menos páginas de las que había, evita quedar
    // "varado" en una página que ya no existe.
    totalPaginas(nuevoTotal) {
      if (this.paginaActual > nuevoTotal) this.paginaActual = nuevoTotal;
    }
  },
  async mounted() {
    this.productos.cargar();
    await this.cargarCategorias();
  },
  methods: {
    async cargarCategorias() {
      try {
        const response = await api.get('/categorias');
        this.categorias = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        this.categorias = [];
      }
    },
    seleccionarCategoria(categoriaId) {
      // Al hacer click en una categoría, actualizamos el filtro y la URL para
      // que la vista quede sincronizada con la selección del usuario.
      this.categoriaSeleccionada = categoriaId ? String(categoriaId) : null;
      const query = categoriaId ? { categoria: String(categoriaId) } : {};
      this.$router.push({ name: 'categoria', query }).catch(() => {});
    },
    // El mínimo nunca puede pasar al máximo, y viceversa: si se cruzan,
    // el otro extremo se acomoda solo.
    alCambiarPrecioMin() {
      if (this.filtroPrecioMin > this.filtroPrecioMax) this.filtroPrecioMax = this.filtroPrecioMin;
    },
    alCambiarPrecioMax() {
      if (this.filtroPrecioMax < this.filtroPrecioMin) this.filtroPrecioMin = this.filtroPrecioMax;
    },
    irAPagina(n) {
      if (n < 1 || n > this.totalPaginas) return;
      this.paginaActual = n;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
};
</script>
