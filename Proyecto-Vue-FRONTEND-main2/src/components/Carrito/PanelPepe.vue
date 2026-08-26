<template>
  <div class="cart-drawer-overlay" :class="{open: pepe.flagUno}" @click.self="pepe.tapaPepe()">
    <div class="cart-drawer">
      <div class="cart-drawer-header">
        <h3>Carrito</h3>
        <button class="cart-drawer-close" @click="pepe.tapaPepe()">✕</button>
      </div>
      <div class="cart-drawer-items">
        <div class="cart-drawer-empty" v-if="pepe.renglones.length===0">Tu carrito está vacío</div>
        <div class="cart-drawer-item" v-for="cositaX in pepe.renglones" :key="cositaX.product.id">
          <div class="thumb img-placeholder"></div>
          <div class="info">
            <div class="name">{{ cositaX.product.name }}</div>
            <div class="price">{{ elPrecioLoco(cositaX.product.price) }}</div>
            <div class="qty-row">
              <button @click="pepe.tocarNumero(cositaX.product.id, -1)">−</button>
              <span>{{ cositaX.qty }}</span>
              <button @click="pepe.tocarNumero(cositaX.product.id, 1)">+</button>
            </div>
          </div>
          <button class="remove" @click="pepe.sacarCosa(cositaX.product.id)">✕</button>
        </div>
      </div>
      <div class="cart-drawer-footer">
        <div class="cart-drawer-total"><span>Total</span><span>{{ pepe.montonTotalTexto }}</span></div>
        <button class="btn-primary" style="width:100%;" @click="pepe.irAPagarPepe()">Pagar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { usePepeStore } from '../../store/pepeStore.js'
import { plataFormato } from '../../data/varios/cositas.js';

export default {
  name: 'PanelPepe',
  data() {
      return { pepe: usePepeStore() }
  },
  methods: { elPrecioLoco: plataFormato }
};
</script>
