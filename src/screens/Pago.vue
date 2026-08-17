<template>
  <cabeza-tienda></cabeza-tienda>
  <div class="checkout-layout">
    <div class="checkout-form">
      <div class="form-row">
        <div class="form-group"><label>Nombre:</label><input type="text"></div>
        <div class="form-group"><label>Apellido</label><input type="text"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Documento de identidad:</label><input type="text"></div>
        <div class="form-group"><label>Teléfono</label><input type="text"></div>
      </div>
      <div class="form-row"><div class="form-group"><label>Correo Electrónico</label><input type="email"></div></div>
      <div class="form-row"><div class="form-group"><label>Dirección a enviar:</label><input type="text"></div></div>
    </div>
    <div class="checkout-summary">
      <div class="summary-table">
        <div v-if="pepe.renglones.length===0" style="padding:20px; text-align:center; color:#888;">No hay productos en el carrito</div>
        <div class="summary-row" v-for="cositaX in pepe.renglones" :key="cositaX.product.id">
          <div class="qty">{{cositaX.qty}}</div>
          <div class="details">
            <div><div class="product-name" style="text-align:left;">{{cositaX.product.name}}</div><div style="color:var(--azul);">{{plataFormato(cositaX.product.price)}}</div></div>
            <div class="thumb img-placeholder"></div>
          </div>
        </div>
      </div>
      <div class="cart-total" style="border:1px solid var(--azul); border-top:none; padding:16px 20px;">
        <span class="cart-total label" style="cursor:default;">Total</span>
        <span class="amount">{{pepe.montonTotalTexto}}</span>
      </div>
    </div>
  </div>
  <div class="checkout-actions">
    <button class="btn-primary" @click="pepe.seguirCompra()">Continuar</button>
  </div>
</template>

<script>
import CabezaTienda from '../components/ui/CabezaTienda.vue';
import { plataFormato } from '../data/varios/cositas.js';
import { usePepeStore } from '../store/pepeStore.js'

export default {
  name: 'Pago',
  components: { CabezaTienda },
  data() {
    return { pepe: usePepeStore() };
  },
  methods: { plataFormato }
};
</script>
