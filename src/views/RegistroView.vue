<template>
  <div class="auth-shell">
    <div class="auth-side"></div>
    <div class="auth-card">
      <router-link class="modal-close" :to="{name:'inicio'}">✕</router-link>
      <h1>Registrarse</h1>
      <form @submit.prevent="continuar">
      <div class="auth-field">
        <label>Correo electrónico:*</label>
        <input v-model="form.email" type="email" autocomplete="email" required>
      </div>
      <div class="auth-field">
        <label>Nombre de usuario:*</label>
        <input v-model="form.name" type="text" autocomplete="username" required>
      </div>
      <div class="auth-field">
        <label>Contraseña:*</label>
        <input v-model="form.password" :type="verClave1 ? 'text':'password'" minlength="6" autocomplete="new-password" required>
        <button class="toggle-pass" :class="{activo: verClave1}" type="button" :aria-pressed="verClave1" :aria-label="verClave1 ? 'Ocultar contraseña' : 'Mostrar contraseña'" :title="verClave1 ? 'Ocultar contraseña' : 'Mostrar contraseña'" @click="verClave1=!verClave1">👁️</button>
      </div>
      <div class="auth-field">
        <label>Repetir contraseña:*</label>
        <input v-model="form.password_confirmation" :type="verClave2 ? 'text':'password'" minlength="6" autocomplete="new-password" required>
        <button class="toggle-pass" :class="{activo: verClave2}" type="button" :aria-pressed="verClave2" :aria-label="verClave2 ? 'Ocultar contraseña' : 'Mostrar contraseña'" :title="verClave2 ? 'Ocultar contraseña' : 'Mostrar contraseña'" @click="verClave2=!verClave2">👁️</button>
      </div>

      <p v-if="error" class="auth-error">{{ error }}</p>
      <button class="auth-submit" type="submit" :disabled="cargando">{{ cargando ? 'Enviando código...' : 'Registrarse' }}</button>
      </form>
      <div class="auth-switch">En cambio... <router-link :to="{name:'login'}">Iniciar Sesión</router-link></div>
    </div>
    <div class="auth-side"></div>
  </div>
</template>

<script>
import apiClient from '../Api/api.js';
import { useRegistroStore } from '../stores/registro.js';

export default {
  name: 'RegistroView',
  data() {
    return {
      verClave1: false,
      verClave2: false,
      cargando: false,
      error: '',
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    };
  },
  mounted() {
    // Si el usuario ya había llegado a la pantalla del código y volvió
    // para atrás, le repoblamos lo que había tipeado en vez de
    // hacerlo empezar de cero (la contraseña la volvemos a pedir por
    // las dudas, así que esa no se restaura).
    const pendientes = useRegistroStore().datosPendientes;
    if (pendientes) {
      this.form.name = pendientes.name;
      this.form.email = pendientes.email;
    }
  },
  methods: {
    // Valida los datos, pide que se mande el código por mail y pasa
    // a la pantalla donde se ingresa.
    async continuar() {
      this.error = '';

      if (this.form.password !== this.form.password_confirmation) {
        this.error = 'Las contraseñas no coinciden.';
        return;
      }

      this.cargando = true;
      try {
        await apiClient.post('/verification/send', { email: this.form.email });

        useRegistroStore().guardarDatosPendientes({ ...this.form });
        await this.$router.push({ name: 'registro-verificar' });
      } catch (error) {
        const mensajeError = error.response?.data?.message;
        const errores = error.response?.data?.errors;
        this.error = errores ? Object.values(errores).flat()[0] : (mensajeError || 'Hubo un error al solicitar el código.');
      } finally {
        this.cargando = false;
      }
    }
  }
};
</script>
