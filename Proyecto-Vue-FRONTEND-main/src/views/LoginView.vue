<template>
  <div class="auth-shell">
    <div class="auth-side"></div>
    <div class="auth-card">
      <router-link class="modal-close" :to="{name:'inicio'}">✕</router-link>
      <h1>Inicio Sesión</h1>
      <form @submit.prevent="iniciarSesion">
      <div class="auth-field"><label>Correo electrónico:</label><input v-model="form.email" type="email" required></div>
      <div class="auth-field">
        <label>Contraseña:</label>
        <input v-model="form.password" :type="verClave ? 'text':'password'" required>
        <button class="toggle-pass" type="button" @click="verClave=!verClave">👁</button>
      </div>
      <a class="auth-forgot">Olvidé mi contraseña</a>
      <p v-if="error" class="auth-error">{{ error }}</p>
      <button class="auth-submit" type="submit" :disabled="cargando">{{ cargando ? 'Ingresando...' : 'Ingresar' }}</button>
      </form>
      <div class="auth-switch">En cambio... <router-link :to="{name:'registro'}">Registrarse</router-link></div>
    </div>
    <div class="auth-side"></div>
  </div>
</template>

<script>
import apiClient from '../Api/api.js';

export default {
  name: 'LoginView',
  data() {
    return {
      verClave: false,
      cargando: false,
      error: '',
      form: { email: '', password: '' }
    };
  },
  methods: {
    async iniciarSesion() {
      this.error = '';
      this.cargando = true;
      try {
        const response = await apiClient.post('/usuarios/login', this.form);
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('auth_user', JSON.stringify(response.data.data));
        await this.$router.push({ name: 'inicio' });
      } catch (error) {
        this.error = error.response?.data?.message || 'No se pudo iniciar sesión.';
      } finally {
        this.cargando = false;
      }
    }
  }
};
</script>
