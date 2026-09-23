<template>
  <!-- El pago es una secuencia real de 3 pasos, así que un indicador
       numerado tiene sentido acá (a diferencia de usarlo como
       decoración en contenido que no es realmente secuencial). -->
  <ol class="pago-pasos" aria-label="Progreso de la compra">
    <li
      v-for="paso in pasos"
      :key="paso.numero"
      class="pago-paso"
      :class="{
        completo: paso.numero < pasoActual,
        activo: paso.numero === pasoActual
      }"
    >
      <span class="pago-paso-marca" aria-hidden="true">
        <span v-if="paso.numero < pasoActual">✓</span>
        <span v-else>{{ paso.numero }}</span>
      </span>
      <span class="pago-paso-texto">{{ paso.texto }}</span>
    </li>
  </ol>
</template>

<script>
export default {
  name: 'PagoPasos',
  props: {
    // 1 = completando los datos de envío, 2 = eligiendo método de
    // pago, 3 = cargando la tarjeta.
    pasoActual: { type: Number, required: true }
  },
  data() {
    return {
      pasos: [
        { numero: 1, texto: 'Datos de envío' },
        { numero: 2, texto: 'Método de pago' },
        { numero: 3, texto: 'Tarjeta' }
      ]
    };
  }
};
</script>
