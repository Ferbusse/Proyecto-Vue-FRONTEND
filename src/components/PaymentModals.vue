<template>
  <div class="modal-overlay" :class="{open: carrito.modalPago}">
    <div class="modal-box">
      <button class="modal-close" @click="carrito.modalPago=false">✕</button>
      <h2>Elija su método<br>de pago</h2>
      <div class="pay-options">
        <button class="pay-card visa" :class="{selected: carrito.metodoPagoSeleccionado==='visa'}" @click="carrito.metodoPagoSeleccionado='visa'">VISA</button>
        <button class="pay-card mc" :class="{selected: carrito.metodoPagoSeleccionado==='mc'}" @click="carrito.metodoPagoSeleccionado='mc'">MasterCard</button>
        <button class="pay-card oca" :class="{selected: carrito.metodoPagoSeleccionado==='oca'}" @click="carrito.metodoPagoSeleccionado='oca'">OCA</button>
      </div>
      <button class="bank-transfer" :class="{selected: carrito.metodoPagoSeleccionado==='bank'}" @click="carrito.metodoPagoSeleccionado='bank'">Transferencia<br>bancaria</button>
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
      <button class="modal-btn" @click="finalizar">Finalizar pago</button>
      <button class="modal-help" @click="avisoDemo('Un asesor te contactará en breve')">Necesito ayuda</button>
    </div>
  </div>
</template>

<script>
import { useCarritoStore } from '../stores/carrito.js';

export default {
  name: 'PaymentModals',
  data() {
    return {
      carrito: useCarritoStore(),
      // solo alimentan la tarjeta visual de arriba — el envío del
      // pago sigue funcionando exactamente igual que antes
      formularioTarjeta: {
        numero: '',
        mesAno: '',
        cvv: '',
        nombre: '',
        apellido: ''
      }
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
    continuar() {
      const resultado = this.carrito.continuarPago();
      if (resultado === 'transferencia') {
        this.$router.push({ name: 'inicio' });
      }
      // si resultado === 'tarjeta', el modal de tarjeta ya se abrió solo
    },
    finalizar() {
      this.carrito.finalizarPago(() => {
        this.$router.push({ name: 'inicio' });
      });
    }
  }
};
</script>
