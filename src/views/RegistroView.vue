<template>
  <div class="auth-shell">
    <div class="auth-side"></div>
    <div class="auth-card">
      <router-link class="modal-close" :to="{name:'inicio'}">✕</router-link>
      <h1>Registrarse</h1>
      <form @submit.prevent="registrar">
      <div class="auth-field"><label>Correo electrónico:*</label><input v-model="form.email" type="email" required></div>
      <div class="auth-field"><label>Nombre de usuario:*</label><input v-model="form.name" type="text" required></div>
      <div class="auth-field">
        <label>Contraseña:*</label>
        <input v-model="form.password" :type="verClave1 ? 'text':'password'" minlength="6" required>
        <button class="toggle-pass" type="button" @click="verClave1=!verClave1">👁</button>
      </div>
      <div class="auth-field">
        <label>Repetir contraseña:*</label>
        <input v-model="form.password_confirmation" :type="verClave2 ? 'text':'password'" minlength="6" required>
        <button class="toggle-pass" type="button" @click="verClave2=!verClave2">👁</button>
      </div>
      <p v-if="error" class="auth-error">{{ error }}</p>
      <button class="auth-submit" type="submit" :disabled="cargando">{{ cargando ? 'Registrando...' : 'Registrarse' }}</button>
      </form>
      <div class="auth-switch">En cambio... <router-link :to="{name:'inicio'}">Iniciar Sesión</router-link></div>
    </div>
    <div class="auth-side"></div>
  </div>
</template>

<script>
import apiClient from '../Api/api.js';

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
  methods: {
    async registrar() {
      this.error = '';
      if (this.form.password !== this.form.password_confirmation) {
        this.error = 'Las contraseñas no coinciden.';
        return;
      }

      this.cargando = true;
      try {
        const response = await apiClient.post('/usuarios/registro', this.form);
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('auth_user', JSON.stringify(response.data.data));
        await this.$router.push({ name: 'inicio' });
      } catch (error) {
        const errores = error.response?.data?.errors;
        this.error = errores
          ? Object.values(errores).flat()[0]
          : 'No se pudo crear el usuario. Comprueba que Laravel esté ejecutándose.';
      } finally {
        this.cargando = false;
      }
    }
  }
};
</script>
