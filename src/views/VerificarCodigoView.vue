<template>
  <div class="auth-shell">
    <div class="auth-side"></div>
    <div class="auth-card">
      <router-link class="modal-close" :to="{name:'registro'}">✕</router-link>
      <h1>Verificá tu correo</h1>
      <p class="auth-codigo-intro">
        Te enviamos un código de 6 dígitos a <strong>{{ email }}</strong>. Ingresalo para terminar de crear tu cuenta.
      </p>

      <form @submit.prevent="confirmar">
        <div class="auth-field">
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
              @paste="alPegarCodigo($event)"
            >
          </div>
        </div>

        <button type="button" class="link-reenviar" @click="reenviarCodigo" :disabled="reenviando">
          {{ reenviando ? 'Reenviando...' : 'Reenviar código' }}
        </button>
        <p v-if="mensajeExito" style="color: green; font-size: 14px; margin: 8px 0 0;">{{ mensajeExito }}</p>

        <p v-if="error" class="auth-error">{{ error }}</p>
        <button class="auth-submit" type="submit" :disabled="cargando">{{ cargando ? 'Creando cuenta...' : 'Confirmar y crear cuenta' }}</button>
      </form>

      <div class="auth-switch"><router-link :to="{name:'registro'}">← Volver y corregir mis datos</router-link></div>
    </div>
    <div class="auth-side"></div>
  </div>
</template>

<script>
import apiClient from '../Api/api.js';
import { useRegistroStore } from '../stores/registro.js';

export default {
  name: 'VerificarCodigoView',
  data() {
    return {
      cargando: false,
      reenviando: false,
      error: '',
      mensajeExito: '',
      codigoVerificacion: ['', '', '', '', '', '']
    };
  },
  computed: {
    // Los datos completos del formulario (incluida la contraseña) viven
    // en el store, no en esta vista.
    datosPendientes() {
      return useRegistroStore().datosPendientes;
    },
    email() {
      return this.datosPendientes?.email || '';
    }
  },
  mounted() {
    // Es una vista propia con su URL, así que hay que contemplar que
    // alguien llegue directo (recargando la página, con el link
    // guardado, etc.) sin haber pasado por /registro. En ese caso no
    // tenemos ni el email ni la contraseña, así que no hay nada que
    // verificar: lo mandamos de vuelta a empezar.
    if (!this.datosPendientes) {
      this.$router.replace({ name: 'registro' });
      return;
    }
    this.$nextTick(() => this.$refs.codigoInput0?.[0]?.focus());
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
    // Al pegar un código completo (por ejemplo copiado del mail), lo
    // repartimos entero entre las 6 casillas en vez de dejar que el
    // navegador solo pegue el primer dígito en la casilla enfocada.
    alPegarCodigo(evento) {
      evento.preventDefault();
      const textoPegado = (evento.clipboardData || window.clipboardData)?.getData('text') || '';
      const digitos = textoPegado.replace(/\D/g, '').slice(0, this.codigoVerificacion.length).split('');
      if (!digitos.length) return;

      for (let i = 0; i < this.codigoVerificacion.length; i++) {
        this.codigoVerificacion[i] = digitos[i] || '';
      }

      this.$nextTick(() => {
        // enfocamos la última casilla completada (o la siguiente vacía,
        // si pegaron menos de 6 dígitos)
        const indiceAEnfocar = Math.min(digitos.length, this.codigoVerificacion.length - 1);
        this.$refs['codigoInput' + indiceAEnfocar]?.[0]?.focus();
      });
    },
    async reenviarCodigo() {
      this.error = '';
      this.mensajeExito = '';
      this.reenviando = true;
      try {
        await apiClient.post('/verification/send', { email: this.email });
        this.mensajeExito = 'Te reenviamos el código. Puede tardar unos segundos en llegar.';
      } catch (error) {
        this.error = error.response?.data?.message || 'No se pudo reenviar el código.';
      } finally {
        this.reenviando = false;
      }
    },
    async confirmar() {
      this.error = '';
      this.mensajeExito = '';

      const codigoCompleto = this.codigoVerificacion.join('');
      if (codigoCompleto.length !== 6) {
        this.error = 'Ingresá el código de 6 dígitos completo.';
        return;
      }

      this.cargando = true;
      try {
        // PASO A: Verificar el código con Laravel.
        await apiClient.post('/verification/verify', {
          email: this.email,
          code: codigoCompleto
        });

        // PASO B: Si el código es correcto, ahí sí creamos la cuenta
        // con los datos que quedaron guardados desde /registro.
        const response = await apiClient.post('/usuarios/registro', this.datosPendientes);

        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('auth_user', JSON.stringify(response.data.data));

        useRegistroStore().limpiar();
        await this.$router.push({ name: 'inicio' });
      } catch (error) {
        const mensajeError = error.response?.data?.message;
        const errores = error.response?.data?.errors;
        this.error = errores ? Object.values(errores).flat()[0] : (mensajeError || 'Error al procesar la solicitud.');
      } finally {
        this.cargando = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-codigo-intro{font-size:14px; opacity:.85; margin:0 0 18px; line-height:1.5;}
</style>
