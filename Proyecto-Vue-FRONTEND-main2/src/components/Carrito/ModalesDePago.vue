<template>
  <div class="modal-overlay" :class="{open: pepe.flagDos}">
    <div class="modal-box">
      <button class="modal-close" @click="pepe.flagDos=false">✕</button>
      <h2>Eliga su metodo<br>de pago</h2>
      <div class="pay-options">
        <button class="pay-card visa" :class="{selected: pepe.cosaMetodo==='visa'}" @click="pepe.cosaMetodo='visa'">VISA</button>
        <button class="pay-card mc" :class="{selected: pepe.cosaMetodo==='mc'}" @click="pepe.cosaMetodo='mc'">MasterCard</button>
        <button class="pay-card oca" :class="{selected: pepe.cosaMetodo==='oca'}" @click="pepe.cosaMetodo='oca'">OCA</button>
      </div>
      <button class="bank-transfer" :class="{selected: pepe.cosaMetodo==='bank'}" @click="pepe.cosaMetodo='bank'">Transferencia<br>bancaria</button>
      <button class="modal-btn" @click="pepe.seguirPago()">Continuar</button>
      <button class="modal-help" @click="gritarCosa('Un asesor te contactará en breve')">Necesito ayuda</button>
    </div>
  </div>

  <div class="modal-overlay" :class="{open: pepe.flagTres}">
    <div class="modal-box">
      <button class="modal-close" @click="pepe.flagTres=false">✕</button>
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
      <button class="modal-btn" @click="pepe.cerrarTrato()">Finalizar pago</button>
      <button class="modal-help" @click="gritarCosa('Un asesor te contactará en breve')">Necesito ayuda</button>
    </div>
  </div>
</template>

<script>
import { usePepeStore } from '../../store/pepeStore.js';

export default {
  name: 'ModalesDePago',
  data() {
    return { pepe: usePepeStore() };
  },
  methods: {
    gritarCosa(mensajeRaro) { alert(mensajeRaro) }
  }
};
</script>
