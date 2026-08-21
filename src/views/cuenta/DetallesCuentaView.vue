<template>
  <cuenta-shell activo="detalles" titulo-seccion="Detalles de la cuenta">
    <div v-if="usuario" class="cuenta-detalles-form">
      <div class="form-group">
        <label for="detalles-nombre">Nombre</label>
        <input id="detalles-nombre" type="text" :value="usuario.name" disabled>
      </div>
      <div class="form-group">
        <label for="detalles-email">Correo electrónico</label>
        <input id="detalles-email" type="email" :value="usuario.email" disabled>
      </div>
      <div class="form-group">
        <label for="detalles-clave">Contraseña</label>
        <input id="detalles-clave" type="password" value="••••••••" disabled>
      </div>
      <p class="cuenta-detalles-nota">Por ahora estos datos son solo de lectura — todavía no se pueden editar.</p>
      <button type="button" class="btn-primary" @click="avisoDemo('Próximamente')">Guardar cambios</button>
    </div>
    <p v-else aria-live="polite">Cargando datos de tu cuenta…</p>
  </cuenta-shell>
</template>

<script>
import CuentaShell from '../../components/CuentaShell.vue';
import api from '../../Api/api.js';
import { esSesionDemo, obtenerUsuarioDemo } from '../../Api/demoAuth.js';

export default {
  name: 'DetallesCuentaView',
  components: { CuentaShell },
  data() {
    return { usuario: null };
  },
  async mounted() {
    if (esSesionDemo()) {
      this.usuario = obtenerUsuarioDemo();
      return;
    }
    try {
      const response = await api.get('/user');
      this.usuario = response.data;
    } catch (error) {
      this.$router.push({ name: 'login' });
    }
  },
  methods: {
    avisoDemo(msg) { alert(msg); }
  }
};
</script>
