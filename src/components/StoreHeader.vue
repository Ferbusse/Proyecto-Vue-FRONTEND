<template>
  <div class="topbar">
    <router-link class="logo" :to="{name:'inicio'}"><img class="logo-img" :src="logoUrl" alt="Zona Móvil" @error="$event.target.style.display='none'"></router-link>
    <div class="search-box" :class="{'show-results': busquedaAbierta}" @focusin="busquedaAbierta=true" @focusout="alPerderFoco">
      <div class="search-row">
        <input class="search-input" type="text" placeholder="¿Que estas buscando hoy?" v-model="busqueda" @keyup.enter="buscar">
        <button class="search-btn" @click="buscar">🔍</button>
      </div>
      <div class="search-results">
        <div class="search-result-item" v-for="producto in resultadosBusqueda" :key="producto.id" @click="$router.push({name:'producto', params:{id: producto.id}})">
          <span class="name">{{ producto.name }}</span><span class="price">{{ formatearPrecio(producto.price) }}</span><div class="thumb img-placeholder"><img v-if="producto.imagenUrl" :src="producto.imagenUrl" :alt="producto.name" @error="$event.target.style.display='none'"><span v-else-if="producto.icono" class="product-icono product-icono-chico" aria-hidden="true">{{ producto.icono }}</span></div>
        </div>
        <div v-if="busqueda.trim() && !resultadosBusqueda.length" class="search-result-item search-sin-resultados">
          Sin resultados para "{{ busqueda.trim() }}"
        </div>
      </div>
    </div>
    <div class="account">
      <!-- si el usuario esta logueado, el icono y el nombre llevan los dos al perfil -->
      <router-link v-if="usuario" class="user-profile-link" :to="{name:'perfil'}">
        <div class="user-icon">👤</div>
        <span>{{ usuario.name }}</span>
      </router-link>
      <template v-else>
        <div class="user-icon">👤</div>
        <div class="links">
          <router-link :to="{name:'login'}">Iniciar sesión</router-link>
          <router-link :to="{name:'registro'}">Registrarse</router-link>
        </div>
      </template>
    </div>
  </div>
  <div class="navbar">
    <div class="categorias-wrap" :class="{open: categoriasAbiertas}" ref="categoriasWrap">
      <button
        class="categorias-btn"
        type="button"
        aria-haspopup="true"
        :aria-expanded="categoriasAbiertas"
        @click="categoriasAbiertas = !categoriasAbiertas"
      >
        <svg class="categorias-btn-icono" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>
        <span>Categorías</span>
        <svg class="categorias-btn-flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="mega-menu">
        <div class="mega-menu-list">
          <p class="mega-menu-titulo">Explorá por categoría</p>
          <button
            type="button"
            class="mega-menu-item"
            :class="{active: categoriaActiva===null}"
            @mouseenter="categoriaActiva = null"
            @click="irACategoria(null)"
          >
            <span class="mm-icon mm-icon-todas" aria-hidden="true">
              <svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/></svg>
            </span>
            <span class="mm-label">Todas las categorías</span>
            <span class="mm-chevron" aria-hidden="true">›</span>
          </button>
          <button
            type="button"
            class="mega-menu-item"
            v-for="cat in categoriasMenu"
            :key="cat.id"
            :class="{active: categoriaActiva===cat.id}"
            @mouseenter="categoriaActiva = cat.id"
            @click="irACategoria(cat.id)"
          >
            <span class="mm-icon" aria-hidden="true">{{ cat.nombre.charAt(0).toUpperCase() }}</span>
            <span class="mm-label">{{ cat.nombre }}</span>
            <span class="mm-chevron" aria-hidden="true">›</span>
          </button>
        </div>
        <div class="mega-menu-panel" v-if="categoriaActivaData && categoriaActivaData.subcategorias.length">
          <div class="mega-menu-panel-cols">
            <div class="mm-col" v-for="grupo in categoriaActivaData.subcategorias" :key="grupo.titulo">
              <h4>{{ grupo.titulo }}</h4>
              <a v-for="item in grupo.items" :key="item" @click="irACategoria(categoriaActiva)">{{ item }}</a>
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
import { haySesion, obtenerUsuarioGuardado } from '../Api/cuenta.js';

// El usuario que ya quedó guardado en el navegador al iniciar sesión.
// Arrancamos con este para que, al cambiar de pantalla, el header no
// muestre "Iniciar sesión" por un instante mientras responde /user.
function usuarioInicial() {
  if (esSesionDemo()) return obtenerUsuarioDemo();
  return haySesion() ? obtenerUsuarioGuardado() : null;
}

export default {
  name: 'StoreHeader',
  data() {
    return {
      carrito: useCarritoStore(),
      productos: useProductosStore(),
      logoUrl: logo,
      busqueda: '',
      busquedaAbierta: false,
      categoriasAbiertas: false,
      usuario: usuarioInicial(),
      categoriaActiva: null,
      categoriasMenu: []
    };
  },
  computed: {
    categoriaActivaData() {
      return this.categoriasMenu.find(c => c.id === this.categoriaActiva);
    },
    resultadosBusqueda() {
      const termino = this.busqueda.trim().toLowerCase();
      if (!termino) return [];
      return this.productos.lista
        .filter(producto => {
          const nombre = (producto.name || '').toLowerCase();
          const descripcion = (producto.descripcion || '').toLowerCase();
          const categoria = (producto.categoriaNombre || '').toLowerCase();
          return nombre.includes(termino) || descripcion.includes(termino) || categoria.includes(termino);
        })
        .slice(0, 8);
    }
  },
  mounted() {
    this.productos.cargar();
    this.cargarCategorias();
    this.actualizarUsuario();
    document.addEventListener('click', this.alClickAfuera);
    document.addEventListener('keydown', this.alApretarTecla);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.alClickAfuera);
    document.removeEventListener('keydown', this.alApretarTecla);
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
    // Confirma la sesión con el backend en segundo plano. Solo se borra el
    // usuario si el servidor dice que la sesión ya no vale (401); si es un
    // problema de red, se sigue mostrando el que estaba guardado.
    async actualizarUsuario() {
      if (esSesionDemo() || !haySesion()) return;
      try {
        const response = await api.get('/user');
        this.usuario = response.data;
      } catch (error) {
        if (error.response?.status === 401) this.usuario = null;
      }
    },
    // El menú de categorías se cierra al hacer click fuera de él o con Escape.
    alClickAfuera(evento) {
      if (this.categoriasAbiertas && !this.$refs.categoriasWrap?.contains(evento.target)) {
        this.categoriasAbiertas = false;
      }
    },
    alApretarTecla(evento) {
      if (evento.key === 'Escape') this.categoriasAbiertas = false;
    },
    alPerderFoco() {
      setTimeout(() => { this.busquedaAbierta = false; }, 150);
    },
    buscar() {
      if (!this.busqueda.trim()) return;
      this.busquedaAbierta = true;
      // Si el texto matchea un solo producto, vamos directo a su ficha.
      if (this.resultadosBusqueda.length === 1) {
        this.$router.push({ name: 'producto', params: { id: this.resultadosBusqueda[0].id } });
        this.busqueda = '';
        this.busquedaAbierta = false;
      }
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
