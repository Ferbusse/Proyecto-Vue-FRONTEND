<template>
  <div class="topbar">
    <router-link class="logo" :to="{name:'inicio'}"><img class="logo-img" :src="pepeImg" alt="Zona Móvil"></router-link>
    <div class="search-box" :class="{'show-results': flagBusca}" @focusin="flagBusca=true" @focusout="cuandoSeVa">
      <div class="search-row">
        <input class="search-input" type="text" placeholder="¿Que estas buscando hoy?">
        <button class="search-btn">🔍</button>
      </div>
      <div class="search-results">
        <div class="search-result-item" v-for="cositaX in cosasEncontradas" :key="cositaX.id" @click="$router.push({name:'producto', params:{id: cositaX.id}})">
          <span class="name">{{ cositaX.name }}</span><span class="price">{{ plataFormato(cositaX.price) }}</span><div class="thumb img-placeholder"></div>
        </div>
      </div>
    </div>
    <div class="account">
      <div class="user-icon">👤</div>
      <div class="links">
        <router-link :to="{name:'login'}">Iniciar sesión</router-link>
        <router-link :to="{name:'registro'}">Registrarse</router-link>
      </div>
    </div>
  </div>
  <div class="navbar">
    <div class="categorias-wrap" :class="{open: flagMenu}">
      <button class="categorias-btn" @click="flagMenu = !flagMenu"><span class="bars">≡</span> CATEGORÍAS ▾</button>
      <div class="mega-menu">
        <div class="mega-menu-list">
          <div
            class="mega-menu-item"
            v-for="catX in listaMenu"
            :key="catX.id"
            :class="{active: catElegida===catX.id}"
            @mouseenter="catElegida = catX.id"
            @click="mandarCategoria"
          >
            <span class="mm-icon">{{ catX.icono }}</span>
            <span class="mm-label">{{ catX.nombre }}</span>
            <span class="mm-chevron" v-if="catX.subcategorias.length">›</span>
          </div>
        </div>
        <div class="mega-menu-panel" v-if="catElegidaData && catElegidaData.subcategorias.length">
          <div class="mega-menu-panel-cols">
            <div class="mm-col" v-for="grupoX in catElegidaData.subcategorias" :key="grupoX.titulo">
              <h4>{{ grupoX.titulo }}</h4>
              <a v-for="itemZ in grupoX.items" :key="itemZ" @click="mandarCategoria">{{ itemZ }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nav-right">
      <a class="cart-link" @click="pepe.destaparPepe()">
        <div class="cart-icon">🛒<span class="badge">{{ pepe.numeroCosas }}</span></div>CARRITO<br><span>{{ pepe.montonTotalTexto }}</span>
      </a>
      <a class="contact">Contacto 📞</a>
    </div>
  </div>
</template>

<script>
import pepeImg from '../../recursos/imgs/logo.png';
import { LISTA_COSAS, plataFormato } from '../../data/varios/cositas.js'
import { usePepeStore } from '../../store/pepeStore.js';

// grupos de subcategorías genéricos reciclados, todavia sin taxonomia real
const dosGrupos = [
  { titulo:'GRUPO A', items:['Subcategoría 1','Subcategoría 2','Subcategoría 3'] },
  { titulo:'GRUPO B', items:['Subcategoría 4','Subcategoría 5','Subcategoría 6'] }
]
const unGrupo = [
  { titulo:'GRUPO A', items:['Subcategoría 1','Subcategoría 2','Subcategoría 3'] }
];

export default {
  name: 'CabezaTienda',
  data() {
    return {
      pepe: usePepeStore(),
      pepeImg,
      flagBusca: false,
      flagMenu: false,
      cosasEncontradas: [LISTA_COSAS[2], LISTA_COSAS[7]],
      catElegida: 'cat1',
      listaMenu: [
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
    catElegidaData() {
      return this.listaMenu.find(c => c.id === this.catElegida)
    }
  },
  methods: {
    plataFormato,
    cuandoSeVa() {
      setTimeout(() => { this.flagBusca = false; }, 150);
    },
    mandarCategoria() {
      this.flagMenu = false;
      this.$router.push({ name: 'categoria' });
    }
  }
};
</script>
