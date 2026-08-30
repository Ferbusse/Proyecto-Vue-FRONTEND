<template>
  <div class="auth-shell">
    <div class="auth-side"></div>
    <div class="auth-card">
      <router-link class="modal-close" :to="{name:'inicio'}">✕</router-link>
      <h1>Iniciar sesión</h1>
      <div class="auth-field"><label>Nombre de usuario:</label><input type="text"></div>
      <div class="auth-field">
        <label>Contraseña:</label>
        <input :type="mostrarClave ? 'text':'password'">
        <button class="toggle-pass" type="button" @click="mostrarClave=!mostrarClave">👁</button>
      </div>
      <a class="auth-forgot">Olvidé mi contraseña</a>
      <button class="auth-submit" @click="$router.push({name:'inicio'})">Ingresar</button>
      <div class="auth-switch">En cambio... <router-link :to="{name:'registro'}">Registrarse</router-link></div>
    </div>
    <div class="auth-side"></div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return { mostrarClave: false };
  }
};
</script>
