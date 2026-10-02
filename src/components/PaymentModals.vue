<template>
  <div class="modal-overlay" :class="{open: carrito.modalPago}">
    <div class="modal-box modal-box-pago-metodo">
      <button class="modal-close" @click="carrito.modalPago=false">✕</button>
      <pago-pasos :paso-actual="2"></pago-pasos>
      <h2 class="pago-metodo-titulo">¿Cómo querés pagar?</h2>

      <div class="pago-metodo-grid">
        <button
          v-for="opcion in tarjetas"
          :key="opcion.valor"
          type="button"
          class="pago-metodo-tarjeta"
          :class="[opcion.valor, {selected: carrito.metodoPagoSeleccionado===opcion.valor}]"
          @click="carrito.metodoPagoSeleccionado=opcion.valor"
        >
          <span class="pago-metodo-check" aria-hidden="true">✓</span>
          <span class="pago-metodo-chip" aria-hidden="true"></span>
          <span class="pago-metodo-marca">{{ opcion.etiqueta }}</span>
        </button>
      </div>

      <button
        type="button"
        class="pago-metodo-banco"
        :class="{selected: carrito.metodoPagoSeleccionado==='bank'}"
        @click="carrito.metodoPagoSeleccionado='bank'"
      >
        <span class="pago-metodo-banco-icono" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 10l9-6 9 6"/><path d="M5 10v9M9.5 10v9M14.5 10v9M19 10v9"/><path d="M3 19h18"/></svg>
        </span>
        <span class="pago-metodo-banco-texto">
          <strong>Transferencia bancaria</strong>
          <small>Te mandamos los datos por correo</small>
        </span>
        <span class="pago-metodo-check" aria-hidden="true">✓</span>
      </button>

      <button class="modal-btn" @click="continuar">Continuar</button>
      <button class="modal-help" @click="avisoDemo('Un asesor te contactará en breve')">Necesito ayuda</button>
    </div>
  </div>

  <div class="modal-overlay" :class="{open: carrito.modalTarjeta}">
    <div class="modal-box modal-box-ancho">
      <button class="modal-close" @click="carrito.modalTarjeta=false">✕</button>
      <h2>Tarjeta</h2>

      <div class="tarjeta-visual" :class="'tarjeta-visual-' + (carrito.metodoPagoSeleccionado || 'generica')">
        <div class="tarjeta-visual-top">
          <span class="tarjeta-chip" aria-hidden="true"></span>
          <span class="tarjeta-marca">{{ etiquetaMarca }}</span>
        </div>
        <div class="tarjeta-numero">{{ numeroFormateado }}</div>
        <div class="tarjeta-visual-bottom">
          <div>
            <span class="tarjeta-mini-label">Titular</span>
            <div class="tarjeta-nombre">{{ nombreEnTarjeta }}</div>
          </div>
          <div>
            <span class="tarjeta-mini-label">Vence</span>
            <div class="tarjeta-vencimiento">{{ formularioTarjeta.mesAno || 'MM/AA' }}</div>
          </div>
        </div>
      </div>

      <div class="card-form-row">
        <div class="fg" style="flex:2;"><label>Número de la Tarjeta:</label><input v-model="formularioTarjeta.numero" type="text" inputmode="numeric" maxlength="16" placeholder="0000 0000 0000 0000"></div>
        <div class="visa-badge">{{ etiquetaMarca }}</div>
      </div>
      <div class="card-form-row">
        <div class="fg"><label>Mes/Año:</label><input v-model="formularioTarjeta.mesAno" type="text" placeholder="MM/AA" maxlength="5"></div>
        <div class="fg"><label>CVV:</label><input v-model="formularioTarjeta.cvv" type="text" inputmode="numeric" maxlength="4" placeholder="123"></div>
      </div>
      <div class="card-form-row">
        <div class="fg"><label>Nombre completo:</label><input v-model="formularioTarjeta.nombre" type="text"></div>
        <div class="fg"><label>Apellido:</label><input v-model="formularioTarjeta.apellido" type="text"></div>
      </div>
      <div class="card-form-row">
        <div class="fg"><label>Documento de identidad:</label><input type="text"></div>
        <div class="fg"><label>Teléfono:</label><input type="text"></div>
      </div>
      <div class="card-form-row"><div class="fg"><label>Correo Electrónico:</label><input type="email"></div></div>
      <div class="card-form-row"><div class="fg"><label>Dirección:</label><input type="text"></div></div>
      <p v-if="errorTarjeta" class="auth-error">{{ errorTarjeta }}</p>
      <button class="modal-btn" @click="finalizar">Finalizar pago</button>
      <button class="modal-help" @click="avisoDemo('Un asesor te contactará en breve')">Necesito ayuda</button>
    </div>
  </div>
</template>

<script>
import { useCarritoStore } from '../stores/carrito.js';
import PagoPasos from './PagoPasos.vue';
import { crearPedido } from '../Api/cuenta.js';

export default {
  name: 'PaymentModals',
  components: { PagoPasos },
  data() {
    return {
      carrito: useCarritoStore(),
      tarjetas: [
        { valor: 'visa', etiqueta: 'VISA' },
        { valor: 'mc', etiqueta: 'MasterCard' },
        { valor: 'oca', etiqueta: 'OCA' }
      ],
      // solo alimentan la tarjeta visual de arriba — el envío del
      // pago sigue funcionando exactamente igual que antes
      formularioTarjeta: {
        numero: '',
        mesAno: '',
        cvv: '',
        nombre: '',
        apellido: ''
      },
      errorTarjeta: ''
    };
  },
  computed: {
    etiquetaMarca() {
      const marcas = { visa: 'VISA', mc: 'MasterCard', oca: 'OCA' };
      return marcas[this.carrito.metodoPagoSeleccionado] || 'TARJETA';
    },
    numeroFormateado() {
      const digitos = (this.formularioTarjeta.numero || '').replace(/\D/g, '').padEnd(16, '•').slice(0, 16);
      return digitos.match(/.{1,4}/g).join('  ');
    },
    nombreEnTarjeta() {
      const nombre = `${this.formularioTarjeta.nombre} ${this.formularioTarjeta.apellido}`.trim();
      return nombre ? nombre.toUpperCase() : 'NOMBRE APELLIDO';
    }
  },
  methods: {
    avisoDemo(msg) { alert(msg); },
    // Guarda el pedido en la cuenta del cliente. No espera la respuesta ni
    // frena el final de la compra: si falla, solo queda en la consola.
    registrarPedido(pedido) {
      if (!pedido || !pedido.items.length) return;
      crearPedido(pedido).catch(error => console.error('No se pudo registrar el pedido:', error));
    },
    continuar() {
      // la foto del pedido se toma antes de que el pago vacíe el carrito
      const pedido = this.carrito.metodoPagoSeleccionado ? this.carrito.armarPedido() : null;
      const resultado = this.carrito.continuarPago();
      if (resultado === 'transferencia') {
        this.registrarPedido(pedido);
        this.$router.push({ name: 'inicio' });
      }
      // si resultado === 'tarjeta', el modal de tarjeta ya se abrió solo
    },
    finalizar() {
      // Antes se podía tocar "Finalizar pago" con la tarjeta
      // completamente vacía. La validación acá es básica (es un pago
      // simulado, no se cobra nada de verdad) pero al menos evita eso.
      const digitos = (this.formularioTarjeta.numero || '').replace(/\D/g, '');
      if (digitos.length < 16 || !this.formularioTarjeta.mesAno || !this.formularioTarjeta.cvv || !this.formularioTarjeta.nombre || !this.formularioTarjeta.apellido) {
        this.errorTarjeta = 'Completá todos los datos de la tarjeta antes de continuar.';
        return;
      }
      this.errorTarjeta = '';
      this.registrarPedido(this.carrito.armarPedido());
      this.carrito.finalizarPago(() => {
        this.$router.push({ name: 'inicio' });
      });
    }
  }
};
</script>
