<template>
  <div class="modal-overlay" :class="{open: carrito.modalPago}">
    <div class="modal-box">
      <button class="modal-close" @click="carrito.modalPago=false">✕</button>
      <h2>Eliga su metodo<br>de pago</h2>
      <div class="pay-options">
        <button class="pay-card visa" :class="{selected: carrito.metodoPagoSeleccionado==='visa'}" @click="carrito.metodoPagoSeleccionado='visa'">VISA</button>
        <button class="pay-card mc" :class="{selected: carrito.metodoPagoSeleccionado==='mc'}" @click="carrito.metodoPagoSeleccionado='mc'">MasterCard</button>
        <button class="pay-card oca" :class="{selected: carrito.metodoPagoSeleccionado==='oca'}" @click="carrito.metodoPagoSeleccionado='oca'">OCA</button>
      </div>
      <button class="bank-transfer" :class="{selected: carrito.metodoPagoSeleccionado==='bank'}" @click="carrito.metodoPagoSeleccionado='bank'">Transferencia<br>bancaria</button>
      <button class="modal-btn" @click="carrito.continuarPago()">Continuar</button>
      <button class="modal-help" @click="avisoDemo('Un asesor te contactará en breve')">Necesito ayuda</button>
    </div>
  </div>

  <div class="modal-overlay" :class="{open: carrito.modalTarjeta}">
    <div class="modal-box">
      <button class="modal-close" @click="carrito.modalTarjeta=false">✕</button>
      <h2>Tarjeta</h2>
      <div class="card-form-row">
        <div class="fg" style="flex:2;"><label>Numero de la Tarjeta:</label><input type="text"></div>
        <div class="visa-badge">VISA</div>
      </div>
      <div class="card-form-row">
        <div class="fg"><label>Mes/Año:</label><input type="text"></div>
        <div class="fg"><label>CVV:</label><input type="text"></div>
      </div>
      <div class="card-form-row">
        <div class="fg"><label>Nombre completo:</label><input type="text"></div>
        <div class="fg"><label>Apellido:</label><input type="text"></div>
      </div>
      <div class="card-form-row">
        <div class="fg"><label>Documento de identidad:</label><input type="text"></div>
        <div class="fg"><label>Teléfono:</label><input type="text"></div>
      </div>
      <div class="card-form-row"><div class="fg"><label>Correo Electrónico:</label><input type="email"></div></div>
      <div class="card-form-row"><div class="fg"><label>Dirección:</label><input type="text"></div></div>
      <button class="modal-btn" @click="carrito.finalizarPago()">Finalizar pago</button>
      <button class="modal-help" @click="avisoDemo('Un asesor te contactará en breve')">Necesito ayuda</button>
    </div>
  </div>
</template>

<script>
import { useCarritoStore } from '../stores/carrito.js';

export default {
  name: 'PaymentModals',
  data() {
    return { carrito: useCarritoStore() };
  },
  methods: {
    avisoDemo(msg) { alert(msg); }
  }
};
</script>
