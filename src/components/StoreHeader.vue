<template>
  <div class="topbar">
    <router-link class="logo" :to="{name:'inicio'}"><img class="logo-img" :src="logoUrl" alt="Zona Móvil" @error="$event.target.style.display='none'"></router-link>
    <div class="search-box" :class="{'show-results': busquedaAbierta}" @focusin="busquedaAbierta=true" @focusout="alPerderFoco">
      <div class="search-row">
        <input class="search-input" type="text" placeholder="¿Que estas buscando hoy?">
        <button class="search-btn">🔍</button>
      </div>
      <div class="search-results">
        <div class="search-result-item" v-for="producto in resultadosBusqueda" :key="producto.id" @click="$router.push({name:'producto', params:{id: producto.id}})">
          <span class="name">{{ producto.name }}</span><span class="price">{{ formatearPrecio(producto.price) }}</span><div class="thumb img-placeholder"><img v-if="producto.imagenUrl" :src="producto.imagenUrl" :alt="producto.name" @error="$event.target.style.display='none'"><span v-else-if="producto.icono" class="product-icono product-icono-chico" aria-hidden="true">{{ producto.icono }}</span></div>
        </div>
      </div>
    </div>
    <div class="account">
      <div class="user-icon">👤</div>
      <!-- si el usuario esta logueado, mostramos su nombre y el enlace al perfil -->
      <div v-if="usuario" class="user-profile-link">
        <router-link :to="{name:'perfil'}">{{ usuario.name }}</router-link>
      </div>
      <div v-else class="links">
        <router-link :to="{name:'login'}">Iniciar sesión</router-link>
        <router-link :to="{name:'registro'}">Registrarse</router-link>
      </div>
    </div>
  </div>
  <div class="navbar">
    <div class="categorias-wrap" :class="{open: categoriasAbiertas}">
      <button class="categorias-btn" @click="categoriasAbiertas = !categoriasAbiertas"><span class="bars">≡</span> CATEGORÍAS ▾</button>
      <div class="mega-menu">
        <div class="mega-menu-list">
          <div
            class="mega-menu-item"
            v-for="cat in categoriasMenu"
            :key="cat.id"
            :class="{active: categoriaActiva===cat.id}"
            @mouseenter="categoriaActiva = cat.id"
            @click="irACategoria(cat.id)"
          >
            <span class="mm-icon">{{ cat.icono }}</span>
            <span class="mm-label">{{ cat.nombre }}</span>
            <span class="mm-chevron" v-if="cat.subcategorias.length">›</span>
          </div>
        </div>
        <div class="mega-menu-panel" v-if="categoriaActivaData && categoriaActivaData.subcategorias.length">
          <div class="mega-menu-panel-cols">
            <div class="mm-col" v-for="grupo in categoriaActivaData.subcategorias" :key="grupo.titulo">
              <h4>{{ grupo.titulo }}</h4>
              <a v-for="item in grupo.items" :key="item" @click="irACategoria">{{ item }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nav-right">
      <a class="cart-link" @click="carrito.abrir()">
        <div class="cart-icon">🛒<span class="badge">{{ carrito.cantidad }}</span></div>CARRITO<br><span>{{ carrito.totalFormateado }}</span>
      </a>
    </div>
  </div>
</template>

<script>
import logo from '../assets/logo.png';
import { formatearPrecio } from '../catalog.js';
import { useCarritoStore } from '../stores/carrito.js';
import { useProductosStore } from '../stores/productos.js';
import api from '../Api/api.js';
import { esSesionDemo, obtenerUsuarioDemo } from '../Api/demoAuth.js';

export default {
  name: 'StoreHeader',
  data() {
    return {
      carrito: useCarritoStore(),
      productos: useProductosStore(),
      logoUrl: logo,
      busquedaAbierta: false,
      categoriasAbiertas: false,
      usuario: null,
      categoriaActiva: null,
      categoriasMenu: []
    };
  },
  computed: {
    categoriaActivaData() {
      return this.categoriasMenu.find(c => c.id === this.categoriaActiva);
    },
    resultadosBusqueda() {
      return this.productos.lista.slice(0, 2);
    }
  },
  async mounted() {
    this.productos.cargar();
    await this.cargarCategorias();

    if (esSesionDemo()) {
      this.usuario = obtenerUsuarioDemo();
      return;
    }
    try {
      const response = await api.get('/user');
      this.usuario = response.data;
    } catch (error) {
      this.usuario = null;
    }
  },
  methods: {
    formatearPrecio,
    async cargarCategorias() {
      try {
        const response = await api.get('/categorias');
        const categorias = Array.isArray(response.data) ? response.data : [];

        this.categoriasMenu = categorias.map((categoria, index) => ({
          id: String(categoria.id ?? index + 1),
          icono: '▪',
          nombre: categoria.nombre || `Categoría ${index + 1}`,
          subcategorias: []
        }));

        if (this.categoriasMenu.length) {
          this.categoriaActiva = this.categoriasMenu[0].id;
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        this.categoriasMenu = [];
        this.categoriaActiva = null;
      }
    },
    alPerderFoco() {
      setTimeout(() => { this.busquedaAbierta = false; }, 150);
    },
    irACategoria(categoriaId = null) {
      // Si se hace click en una categoría del menú, llevamos al usuario a la
      // vista de catálogo con el filtro aplicado en la query.
      this.categoriasAbiertas = false;
      const query = categoriaId ? { categoria: String(categoriaId) } : {};
      this.$router.push({ name: 'categoria', query });
    }
  }
};
</script>
