<template>
  <div class="topbar">
    <router-link class="logo" :to="{name:'inicio'}"><img class="logo-img" :src="logoUrl" alt="Zona Móvil"></router-link>
    <div class="search-box" :class="{'show-results': busquedaAbierta}" @focusin="busquedaAbierta=true" @focusout="alPerderFoco">
      <div class="search-row">
        <input class="search-input" type="text" placeholder="¿Que estas buscando hoy?">
        <button class="search-btn">🔍</button>
      </div>
      <div class="search-results">
        <div class="search-result-item" v-for="producto in resultadosBusqueda" :key="producto.id" @click="$router.push({name:'producto', params:{id: producto.id}})">
          <span class="name">{{ producto.name }}</span><span class="price">{{ formatearPrecio(producto.price) }}</span><div class="thumb img-placeholder"></div>
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
            @click="irACategoria"
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
      <a class="contact">Contacto 📞</a>
    </div>
  </div>
</template>

<script>
import logo from '../assets/logo.png';
import { CATALOGO, formatearPrecio } from '../catalog.js';
import { useCarritoStore } from '../stores/carrito.js';
import api from '../Api/api.js';
import { esSesionDemo, obtenerUsuarioDemo } from '../Api/demoAuth.js';

// Grupos de subcategorías genéricos, reutilizados por varias categorías
// (todavía no hay taxonomía real definida).
const dosGrupos = [
  { titulo:'GRUPO A', items:['Subcategoría 1','Subcategoría 2','Subcategoría 3'] },
  { titulo:'GRUPO B', items:['Subcategoría 4','Subcategoría 5','Subcategoría 6'] }
];
const unGrupo = [
  { titulo:'GRUPO A', items:['Subcategoría 1','Subcategoría 2','Subcategoría 3'] }
];

export default {
  name: 'StoreHeader',
  data() {
    return {
      carrito: useCarritoStore(),
      logoUrl: logo,
      busquedaAbierta: false,
      categoriasAbiertas: false,
      usuario: null, // acá guardamos la información del usuario logueado
      resultadosBusqueda: [CATALOGO[2], CATALOGO[7]],
      // Nombres todavía sin definir — placeholders genéricos hasta decidir
      // la taxonomía real de categorías. Ícono genérico (igual para todas)
      // porque tampoco está definida la iconografía final.
      categoriaActiva: 'cat1',
      categoriasMenu: [
        { id:'cat1',  icono:'▪', nombre:'Categoría 1',  subcategorias: dosGrupos },
        { id:'cat2',  icono:'▪', nombre:'Categoría 2',  subcategorias: dosGrupos },
        { id:'cat3',  icono:'▪', nombre:'Categoría 3',  subcategorias: unGrupo },
        { id:'cat4',  icono:'▪', nombre:'Categoría 4',  subcategorias: dosGrupos },
        { id:'cat5',  icono:'▪', nombre:'Categoría 5',  subcategorias: unGrupo },
        { id:'cat6',  icono:'▪', nombre:'Categoría 6',  subcategorias: dosGrupos },
        { id:'cat7',  icono:'▪', nombre:'Categoría 7',  subcategorias: unGrupo },
        { id:'cat8',  icono:'▪', nombre:'Categoría 8',  subcategorias: dosGrupos },
        { id:'cat9',  icono:'▪', nombre:'Categoría 9',  subcategorias: unGrupo },
        { id:'cat10', icono:'▪', nombre:'Categoría 10', subcategorias: dosGrupos },
        { id:'cat11', icono:'▪', nombre:'Categoría 11', subcategorias: dosGrupos },
        { id:'cat12', icono:'▪', nombre:'Categoría 12', subcategorias: unGrupo },
        { id:'cat13', icono:'▪', nombre:'Categoría 13', subcategorias: unGrupo },
        { id:'cat14', icono:'▪', nombre:'Categoría 14', subcategorias: dosGrupos },
        { id:'cat15', icono:'▪', nombre:'Categoría 15', subcategorias: unGrupo },
        { id:'cat16', icono:'▪', nombre:'Categoría 16', subcategorias: dosGrupos },
        { id:'cat17', icono:'▪', nombre:'Categoría 17', subcategorias:[] },
        { id:'cat18', icono:'▪', nombre:'Categoría 18', subcategorias:[] }
      ]
    };
  },
  computed: {
    categoriaActivaData() {
      return this.categoriasMenu.find(c => c.id === this.categoriaActiva);
    }
  },
  async mounted() {
    // si es la sesión de prueba, no hace falta backend: usamos el
    // usuario demo directo
    if (esSesionDemo()) {
      this.usuario = obtenerUsuarioDemo();
      return;
    }
    try {
      // le preguntamos al backend los datos del usuario logueado
      // (si no hay token o no es válido, esto tira error y usuario
      // se queda en null — mostramos "Iniciar sesión / Registrarse")
      const response = await api.get('/user');
      this.usuario = response.data;
    } catch (error) {
      this.usuario = null;
    }
  },
  methods: {
    formatearPrecio,
    alPerderFoco() {
      setTimeout(() => { this.busquedaAbierta = false; }, 150);
    },
    irACategoria() {
      this.categoriasAbiertas = false;
      this.$router.push({ name: 'categoria' });
    }
  }
};
</script>
