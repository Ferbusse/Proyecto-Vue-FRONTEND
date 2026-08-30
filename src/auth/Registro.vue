<template>
  <div class="auth-shell">
    <div class="auth-side"></div>
    <div class="auth-card">
      <router-link class="modal-close" :to="{name:'inicio'}">✕</router-link>
      <h1>Registrarse</h1>
      <div class="auth-field"><label>Correo electrónico:*</label><input type="email"></div>
      <div class="auth-field"><label>Nombre de usuario:*</label><input type="text"></div>
      <div class="auth-field">
        <label>Contraseña:*</label>
        <input :type="mostrarClaveUno ? 'text':'password'">
        <button class="toggle-pass" type="button" @click="mostrarClaveUno=!mostrarClaveUno">👁</button>
      </div>
      <div class="auth-field">
        <label>Repetir contraseña:*</label>
        <input :type="mostrarClaveDos ? 'text':'password'">
        <button class="toggle-pass" type="button" @click="mostrarClaveDos=!mostrarClaveDos">👁</button>
      </div>
      <button class="auth-submit" @click="$router.push({name:'login'})">Ingresar</button>
      <div class="auth-switch">En cambio... <router-link :to="{name:'login'}">Iniciar Sesión</router-link></div>
    </div>
    <div class="auth-side"></div>
  </div>
</template>

<script>
export default {
  name: 'Registro',
  data() {
    return { mostrarClaveUno: false, mostrarClaveDos: false };
  }
};
</script>
