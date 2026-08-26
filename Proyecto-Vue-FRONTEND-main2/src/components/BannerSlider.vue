<template>
  <div class="banner-slider" @mouseenter="detener" @mouseleave="reproducir">
    <button class="arrow left" @click="anteriorManual">‹</button>
    <div class="banner-track" :style="{transform: 'translateX(-' + (indice*100) + '%)'}">
      <div class="banner" :class="diapositiva.clase" v-for="(diapositiva, i) in diapositivas" :key="i">
        <div class="banner-text">
          <p class="eyebrow">{{ diapositiva.etiqueta }}</p>
          <h1 v-html="diapositiva.titulo"></h1>
          <p>{{ diapositiva.subtitulo }}</p>
        </div>
        <svg class="banner-icon" viewBox="0 0 100 100" v-if="diapositiva.icono==='tag'">
          <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.08)"/>
          <path d="M30 20h30a6 6 0 0 1 6 6v48a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6z" fill="#fff" opacity=".95"/>
          <rect x="30" y="30" width="30" height="38" fill="#14208c"/>
          <circle cx="45" cy="72" r="3" fill="#14208c"/>
          <path d="M68 40 L80 40 L74 52 L82 52 L64 72 L69 56 L61 56 Z" fill="#ffd166"/>
        </svg>
        <svg class="banner-icon" viewBox="0 0 100 100" v-else-if="diapositiva.icono==='headphones'">
          <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.08)"/>
          <path d="M25 55v-8a25 25 0 0 1 50 0v8" stroke="#fff" stroke-width="5" fill="none"/>
          <rect x="17" y="52" width="14" height="24" rx="6" fill="#fff"/>
          <rect x="69" y="52" width="14" height="24" rx="6" fill="#fff"/>
          <circle cx="24" cy="64" r="3" fill="#14208c"/>
          <circle cx="76" cy="64" r="3" fill="#14208c"/>
        </svg>
        <svg class="banner-icon" viewBox="0 0 100 100" v-else-if="diapositiva.icono==='bolt'">
          <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.08)"/>
          <rect x="36" y="16" width="28" height="68" rx="6" fill="#fff"/>
          <rect x="40" y="24" width="20" height="44" fill="#14208c"/>
          <path d="M53 30 L43 52 L50 52 L47 66 L60 44 L52 44 Z" fill="#ffd166"/>
        </svg>
        <svg class="banner-icon" viewBox="0 0 100 100" v-else-if="diapositiva.icono==='truck'">
          <circle cx="50" cy="50" r="46" fill="rgba(255,255,255,.08)"/>
          <rect x="14" y="42" width="46" height="26" rx="3" fill="#fff"/>
          <path d="M60 50h14l10 10v8H60z" fill="#fff"/>
          <circle cx="32" cy="72" r="7" fill="#14208c"/><circle cx="76" cy="72" r="7" fill="#14208c"/>
          <circle cx="32" cy="72" r="3" fill="#fff"/><circle cx="76" cy="72" r="3" fill="#fff"/>
        </svg>
      </div>
    </div>
    <button class="arrow right" @click="siguienteManual">›</button>
    <div class="banner-dots">
      <button v-for="(diapositiva, i) in diapositivas" :key="i" :class="{active: i===indice}" @click="puntoManual(i)"></button>
    </div>
  </div>
</template>

<script>
// Carrusel del banner: cambia de diapositiva sola cada 4.2s y se puede
// controlar con las flechas o los puntos. Se pausa mientras el mouse
// está encima.
export default {
  name: 'BannerSlider',
  data() {
    return {
      indice: 0,
      temporizador: null,
      diapositivas: [
        { clase: 'banner-slide-1', icono: 'tag',        etiqueta: 'OFERTA DE LA SEMANA',   titulo: 'Hasta 40% OFF<br>en fundas y cargadores', subtitulo: 'Renová tus accesorios al mejor precio de la zona.' },
        { clase: 'banner-slide-2', icono: 'headphones', etiqueta: 'NUEVO INGRESO',         titulo: 'Auriculares<br>inalámbricos',             subtitulo: 'Sonido envolvente, batería de larga duración.' },
        { clase: 'banner-slide-3', icono: 'bolt',        etiqueta: 'CALIDAD GARANTIZADA',   titulo: 'Carga rápida<br>para tu celular',         subtitulo: 'Cargadores originales con garantía de 12 meses.' },
        { clase: 'banner-slide-4', icono: 'truck',       etiqueta: 'ENVÍOS A TODO EL PAÍS', titulo: 'Recibí tu pedido<br>en 24-48hs',          subtitulo: 'Comprá online y seguí tu envío en tiempo real.' }
      ]
    };
  },
  mounted() {
    this.reproducir();
  },
  beforeUnmount() {
    clearInterval(this.temporizador);
  },
  methods: {
    // mueve el carrusel a la diapositiva "i", dando la vuelta al llegar al final
    irA(i) {
      this.indice = (i + this.diapositivas.length) % this.diapositivas.length;
    },
    siguiente() { this.irA(this.indice + 1); },
    anterior() { this.irA(this.indice - 1); },
    reproducir() { this.temporizador = setInterval(this.siguiente, 4200); },
    detener() { clearInterval(this.temporizador); },
    // acciones manuales: reinician el autoplay para no cortarlo a mitad de camino
    anteriorManual() { this.anterior(); this.detener(); this.reproducir(); },
    siguienteManual() { this.siguiente(); this.detener(); this.reproducir(); },
    puntoManual(i) { this.irA(i); this.detener(); this.reproducir(); }
  }
};
</script>
