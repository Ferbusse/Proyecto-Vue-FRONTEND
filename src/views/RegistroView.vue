<template>
  <div class="auth-shell">
    <div class="auth-side"></div>
    <div class="auth-card">
      <router-link class="modal-close" :to="{name:'inicio'}">✕</router-link>
      <h1>Registrarse</h1>
      <form @submit.prevent="registrar">
      <div class="auth-field">
        <label>Correo electrónico:*</label>
        <input v-model="form.email" type="email" required>
      </div>
      <div class="auth-field">
        <label>Nombre de usuario:*</label>
        <input v-model="form.name" type="text" required>
      </div>
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

      <!-- Sección del Código de verificación -->
      <div class="auth-field">
        <label>Código de verificación:*</label>
        
        <!-- Botón para solicitar el código -->
        <button type="button" class="link-reenviar" style="margin-bottom: 10px;" @click="solicitarCodigo" :disabled="enviandoCodigo">
          {{ enviandoCodigo ? 'Enviando...' : 'Obtener código al correo' }}
        </button>

        <p v-if="mensajeExito" style="color: green; font-size: 14px; margin-bottom: 5px;">{{ mensajeExito }}</p>

        <div class="auth-codigo-cajas">
          <input
            v-for="(digito, indice) in codigoVerificacion"
            :key="indice"
            :ref="'codigoInput' + indice"
            v-model="codigoVerificacion[indice]"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="auth-codigo-caja"
            @input="alEscribirDigito(indice, $event)"
            @keydown.backspace="alBorrarDigito(indice, $event)"
          >
        </div>
      </div>

      <p v-if="error" class="auth-error">{{ error }}</p>
      <button class="auth-submit" type="submit" :disabled="cargando">{{ cargando ? 'Registrando...' : 'Registrarse' }}</button>
      </form>
      <div class="auth-switch">En cambio... <router-link :to="{name:'login'}">Iniciar Sesión</router-link></div>
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
      enviandoCodigo: false,
      error: '',
      mensajeExito: '',
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      codigoVerificacion: ['', '', '', '', '', '']
    };
  },
  methods: {
    alEscribirDigito(indice, evento) {
      const valor = evento.target.value.replace(/\D/g, '').slice(0, 1);
      this.codigoVerificacion[indice] = valor;
      if (valor && indice < this.codigoVerificacion.length - 1) {
        this.$refs['codigoInput' + (indice + 1)]?.[0]?.focus();
      }
    },
    alBorrarDigito(indice, evento) {
      if (!this.codigoVerificacion[indice] && indice > 0) {
        this.$refs['codigoInput' + (indice - 1)]?.[0]?.focus();
      }
    },

    // 1. Método para pedir el código a Laravel
    async solicitarCodigo() {
      this.error = '';
      this.mensajeExito = '';

      if (!this.form.email) {
        this.error = 'Por favor, ingresa tu correo electrónico primero para enviarte el código.';
        return;
      }

      this.enviandoCodigo = true;
      try {
        await apiClient.post('/verification/send', { email: this.form.email });
        this.mensajeExito = 'Código enviado. Revisa tu consola (laravel.log).';
      } catch (error) {
        this.error = error.response?.data?.message || 'Hubo un error al solicitar el código.';
      } finally {
        this.enviandoCodigo = false;
      }
    },

    // 2. Método para verificar y luego registrar
    async registrar() {
      this.error = '';
      this.mensajeExito = '';

      if (this.form.password !== this.form.password_confirmation) {
        this.error = 'Las contraseñas no coinciden.';
        return;
      }

      // Unir los 6 casilleros en un solo string (ej: "123456")
      const codigoCompleto = this.codigoVerificacion.join('');
      if (codigoCompleto.length !== 6) {
        this.error = 'Debes ingresar el código de 6 dígitos completo.';
        return;
      }

      this.cargando = true;
      try {
        // PASO A: Verificar el código con Laravel
        await apiClient.post('/verification/verify', {
          email: this.form.email,
          code: codigoCompleto
        });

        // PASO B: Si la verificación fue exitosa, procedemos a registrar al usuario
        const response = await apiClient.post('/usuarios/registro', this.form);
        
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('auth_user', JSON.stringify(response.data.data));
        
        await this.$router.push({ name: 'inicio' });
        
      } catch (error) {
        // Atrapa errores tanto de la validación del código como del registro
        const mensajeError = error.response?.data?.message;
        const errores = error.response?.data?.errors;
        
        if (errores) {
          this.error = Object.values(errores).flat()[0];
        } else {
          this.error = mensajeError || 'Error al procesar la solicitud.';
        }
      } finally {
        this.cargando = false;
      }
    }
  }
};
</script>