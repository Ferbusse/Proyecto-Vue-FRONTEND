<template>
  <cabeza-tienda></cabeza-tienda>
  <div class="product-detail">
    <div class="pd-image img-placeholder"></div>
    <div class="pd-info">
      <h1>{{ cosaActual.name }}</h1>
      <h4 style="color:var(--azul); font-size:24px; font-weight:800; margin:4px 0 14px;">{{ plataFormato(cosaActual.price) }}</h4>
      <h4>Especificaciones</h4>
      <div class="spec-table"><div class="c1"></div><div class="c2"></div></div>
      <button class="wishlist" :class="{active: meGusta}" @click="meGusta=!meGusta">
        <span class="heart">♥</span> Añadir a deseados
      </button>
      <br>
      <button class="btn-primary" @click="meterAlCarro">Añadir al carrito</button>
    </div>
  </div>
  <div class="pd-desc">
    <h4>Descripcion:</h4>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. laborum</p>
    <div class="pd-related">
      <h4>Talvez te interese...</h4>
      <div class="products-wrap" style="margin:14px 0;">
        <div class="product-row" style="border-bottom:none;">
          <tarjeta-cosa v-for="cositaX in otrasCosas" :key="cositaX.id" :cosa="cositaX"></tarjeta-cosa>
        </div>
      </div>
    </div>
  </div>
  <footer class="site-footer">DISCLAIMERS, CONTACTO, UBICACIÓN, ETC.</footer>
  <div class="toast" :class="{show: flagAviso}">Añadido al carrito ✓</div>
</template>

<script>
import CabezaTienda from '../components/ui/CabezaTienda.vue'
import TarjetaCosa from '../components/tarjetas/TarjetaCosa.vue';
import { LISTA_COSAS, buscarCosa, plataFormato } from '../data/varios/cositas.js';
import { usePepeStore } from '../store/pepeStore.js'

export default {
  name: 'ProductoDetalle',
  components: { CabezaTienda, TarjetaCosa },
  // "id" llega como prop porque en las rutas pusimos props:true
  props: ['id'],
  data() {
    return {
      pepe: usePepeStore(),
      meGusta: false,
      flagAviso: false
    };
  },
  computed: {
    cosaActual() { return buscarCosa(this.id); },
    otrasCosas() { return [LISTA_COSAS[3], LISTA_COSAS[6], LISTA_COSAS[9]]; }
  },
  methods: {
    plataFormato,
    meterAlCarro() {
      this.pepe.meterCosa(this.id);
      this.flagAviso = true;
      setTimeout(() => { this.flagAviso = false; }, 1800);
    }
  }
};
</script>
