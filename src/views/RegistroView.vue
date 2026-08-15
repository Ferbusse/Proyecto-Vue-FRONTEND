<template>
  <div class="auth-shell">
    <div class="auth-side"></div>
    <div class="auth-card">
      <router-link class="modal-close" :to="{name:'inicio'}">✕</router-link>
      <h1>Registrarse</h1>
      <div class="auth-field"><label>Correo Electrónico:*</label><input type="email"></div>
      <div class="auth-field"><label>Nombre de usuario:*</label><input type="text"></div>
      <div class="auth-field">
        <label>Contraseña:*</label>
        <input :type="verClave1 ? 'text':'password'">
        <button class="toggle-pass" type="button" @click="verClave1=!verClave1">👁</button>
      </div>
      <div class="auth-field">
        <label>Repetir Contraseña:*</label>
        <input :type="verClave2 ? 'text':'password'">
        <button class="toggle-pass" type="button" @click="verClave2=!verClave2">👁</button>
      </div>
      <button class="auth-submit" @click="$router.push({name:'login'})">Ingresar</button>
      <div class="auth-switch">En cambio... <router-link :to="{name:'login'}">Iniciar Sesión</router-link></div>
    </div>
    <div class="auth-side"></div>
  </div>
</template>

<script>
export default {
  name: 'RegistroView',
  data() {
    return { verClave1: false, verClave2: false };
  }
};
</script>
