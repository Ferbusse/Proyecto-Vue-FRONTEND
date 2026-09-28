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
        <div v-if="!itemsGrilla.length" class="producto-vacio">No hay productos para esta categoría.</div>
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
import api from '../Api/api.js';
import { useProductosStore } from '../stores/productos.js';

export default {
  name: 'CategoriaView',
  components: { StoreHeader, CatCard },
  data() {
    return {
      productos: useProductosStore(),
      categorias: [],
      categoriaSeleccionada: null,
      filtroPrecio: 4000,
      ordenarPor: 'menor'
    };
  },
  computed: {
    // Filtra primero por precio y luego, si hay una categoría seleccionada,
    // deja solo los productos que pertenecen a esa categoría.
    itemsGrilla() {
      let lista = this.productos.lista.filter(p => p.price <= this.filtroPrecio);

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
    }
  },
  watch: {
    // Lee la categoría desde la URL para que el filtro se mantenga si se
    // recarga la página o se comparte el link de una categoría concreta.
    '$route.query.categoria': {
      immediate: true,
      handler(nuevoValor) {
        this.categoriaSeleccionada = nuevoValor ? String(nuevoValor) : null;
      }
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
    }
  }
};
</script>
