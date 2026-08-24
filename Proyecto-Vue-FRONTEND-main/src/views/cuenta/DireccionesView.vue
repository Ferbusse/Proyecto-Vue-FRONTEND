<template>
  <cuenta-shell activo="direcciones" titulo-seccion="Direcciones">
    <div class="cuenta-vacio">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
      <h2>No tenés direcciones guardadas</h2>
      <p>Agregá una dirección para que tus pedidos lleguen más rápido la próxima vez.</p>
      <button type="button" class="cuenta-vacio-cta" @click="avisoDemo('Próximamente')">+ Agregar dirección</button>
    </div>
  </cuenta-shell>
</template>

<script>
import CuentaShell from '../../components/CuentaShell.vue';

export default {
  name: 'DireccionesView',
  components: { CuentaShell },
  methods: {
    avisoDemo(msg) { alert(msg); }
  }
};
</script>
