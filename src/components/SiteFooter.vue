<template>
  <footer class="site-footer">
    <div class="site-footer-cols">
      <div class="site-footer-col">
        <h4>Zona Móvil</h4>
        <p class="site-footer-disclaimer">
          Los precios y promociones publicados están sujetos a cambios sin
          previo aviso. Las imágenes son ilustrativas y pueden no
          corresponder exactamente al producto entregado.
        </p>
      </div>

      <div class="site-footer-col">
        <h4>Contacto</h4>
        <ul>
          <li><a href="https://wa.me/59892286855" target="_blank" rel="noopener noreferrer">WhatsApp: 092 286 855</a></li>
          <li><a href="mailto:contacto@zonamovil.com">contacto@zonamovil.com</a></li>
          <li><a href="https://instagram.com/zonamovilmelo" target="_blank" rel="noopener noreferrer">@zonamovilmelo</a></li>
        </ul>
      </div>

      <div class="site-footer-col">
        <h4>Ubicación</h4>
        <address>
          Miguel Barreiro 1423<br>
          Melo, Cerro Largo
        </address>
        <p class="site-footer-horario">Lun. a vier. 9:00-19:00 · Sáb. 9:00-13:00</p>
      </div>
    </div>

    <div class="site-footer-bottom">
      <span>© {{ anioActual }} Zona Móvil — todos los derechos reservados</span>
      <!-- Solo se muestra este atajo para la sesión demo. Para usuarios normales
           queda oculto para no dejar un acceso administrativo visible en la home. -->
      <router-link v-if="conAccesoAdmin && esSesionDemo()" class="admin-link" :to="{name:'admin-panel'}">Panel Administrador →</router-link>
    </div>
  </footer>
</template>

<script>
import { esSesionDemo } from '../Api/demoAuth.js';

export default {
  name: 'SiteFooter',
  props: {
    // el link al panel de administrador solo se muestra en la home,
    // no hace falta repetirlo en todas las pantallas
    conAccesoAdmin: { type: Boolean, default: false }
  },
  data() {
    return { anioActual: new Date().getFullYear(), esSesionDemo };
  }
};
</script>
