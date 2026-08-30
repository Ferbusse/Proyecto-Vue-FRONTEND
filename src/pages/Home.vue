<template>
  <cabeza-tienda></cabeza-tienda>
  <slider1></slider1>
  <div class="quick-links">
    <button class="tile" @click="$router.push({name:'categoria'})">CATEGORÍA<br>PRODUCTO</button>
    <button class="tile" @click="$router.push({name:'categoria'})">CATEGORÍA<br>PRODUCTO</button>
    <button class="tile" @click="$router.push({name:'categoria'})">SERVICIO</button>
    <button class="tile" @click="$router.push({name:'categoria'})">SERVICIO</button>
  </div>
  <div class="products-wrap">
    <div class="product-row" v-for="(pilaX,jX) in pilonesInicio" :key="jX">
      <tarjeta-cosa v-for="cositaX in pilaX" :key="cositaX.id" :cosa="cositaX"></tarjeta-cosa>
    </div>
  </div>
  <div class="continua">(continua con ofertas etc)</div>
  <footer class="site-footer">
    DISCLAIMERS, CONTACTO, UBICACIÓN, ETC.
    <!-- Este atajo solo se muestra en sesión demo; para el resto queda oculto. -->
    <router-link v-if="esSesionDemo()" class="admin-link" :to="{name:'admin-panel'}">Panel Administrador →</router-link>
  </footer>
</template>

<script>
import CabezaTienda from '../components/ui/CabezaTienda.vue';
import Slider1 from '../components/ui/Slider1.vue'
import TarjetaCosa from '../components/tarjetas/TarjetaCosa.vue';
import { LISTA_COSAS, partirEnPilas } from '../data/varios/cositas.js'
import { esSesionDemo } from '../Api/demoAuth.js';

export default {
  name: 'Home',
  components: { CabezaTienda, Slider1, TarjetaCosa },
  data() {
    return { esSesionDemo };
  },
  computed: {
    pilonesInicio() { return partirEnPilas(LISTA_COSAS.slice(0, 9), 3); }
  }
};
</script>
