<template>
  <cuenta-shell activo="pedidos" titulo-seccion="Pedidos">
    <div class="cuenta-vacio">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/></svg>
      <h2>Todavía no tenés pedidos</h2>
      <p>Cuando compres algo, vas a poder ver el estado de tus pedidos acá.</p>
      <router-link class="cuenta-vacio-cta" :to="{name:'categoria'}">Ir a comprar</router-link>
    </div>
  </cuenta-shell>
</template>

<script>
import CuentaShell from '../../components/CuentaShell.vue';

export default {
  name: 'PedidosView',
  components: { CuentaShell }
};
</script>
