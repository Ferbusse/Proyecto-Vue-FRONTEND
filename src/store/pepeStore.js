import { defineStore } from 'pinia';
import { buscarCosa, plataFormato } from '../data/varios/cositas.js'
import elCaminito from '../nav/rutas.js';

// esto era carrito.js, ahora es pepeStore porque si
export const usePepeStore = defineStore('pepe', {
  state: () => ({
      bolsa: {},
    flagUno: false,
    flagDos: false,
    flagTres: false,
    cosaMetodo: null,
        banderaFinal: false
  }),

  getters: {
    renglones(state) {
      return Object.keys(state.bolsa).map(function (pepeId) {
        return { product: buscarCosa(pepeId), qty: state.bolsa[pepeId] };
      });
    },
    numeroCosas(state) {
      return Object.values(state.bolsa).reduce((acu, q) => acu + q, 0)
    },
    montonTotal(state) {
      let acu = 0;
      for (const pepeId of Object.keys(state.bolsa)) {
        acu = acu + state.bolsa[pepeId] * buscarCosa(pepeId).price;
      }
      return acu;
    },
    montonTotalTexto() {
      return plataFormato(this.montonTotal);
    }
  },

  actions: {
    meterCosa(pepeId) {
      this.bolsa[pepeId] = (this.bolsa[pepeId] || 0) + 1;
    },
    tocarNumero(pepeId, delta) {
      if (!this.bolsa[pepeId]) return;
      this.bolsa[pepeId] += delta;
      if (this.bolsa[pepeId] <= 0) delete this.bolsa[pepeId];
    },
    sacarCosa(pepeId) { delete this.bolsa[pepeId]; },
    limpiarTodo() { this.bolsa = {}; },
    destaparPepe() { this.flagUno = true },
    tapaPepe()     { this.flagUno = false },

    irAPagarPepe() {
      if (this.numeroCosas === 0) { alert('Tu carrito está vacío'); return; }
      this.flagUno = false;
      elCaminito.push({ name: 'checkout' });
    },
    seguirCompra() {
      if (this.numeroCosas === 0) { alert('Tu carrito está vacío'); return; }
      this.cosaMetodo = null;
      this.flagDos = true;
    },
    seguirPago() {
      if (!this.cosaMetodo) { alert('Por favor seleccione un método de pago'); return; }
      this.flagDos = false;
      if (this.cosaMetodo === 'bank') {
        alert('Te enviamos las instrucciones de transferencia bancaria a tu correo.');
        this.limpiarTodo();
        elCaminito.push({ name: 'inicio' });
      } else {
        this.flagTres = true;
      }
    },
    cerrarTrato() {
      this.flagTres = false;
      this.limpiarTodo();
      this.banderaFinal = true;
      setTimeout(() => {
        this.banderaFinal = false;
        elCaminito.push({ name: 'inicio' });
      }, 1600);
    }
  }
});
