<template>
  <div class="fab-social" :class="{open: abierto}" @keydown.esc="cerrar">
    <div class="fab-social-links">
      <a
        href="https://wa.me/59892286855"
        target="_blank"
        rel="noopener noreferrer"
        class="fab-icon fab-whatsapp"
        aria-label="Escribinos por WhatsApp (se abre en una pestaña nueva)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.6 6.3A8.9 8.9 0 0 0 12 4a8.96 8.96 0 0 0-7.8 13.4L3 21l3.7-1.2A9 9 0 0 0 12 21a9 9 0 0 0 9-9c0-2.4-1-4.7-2.6-6.4zM12 19.5a7.4 7.4 0 0 1-3.8-1l-.3-.2-2.6.8.9-2.5-.2-.3A7.5 7.5 0 1 1 19.5 12a7.5 7.5 0 0 1-7.5 7.5zm4.1-5.6c-.2-.1-1.3-.7-1.5-.7-.2-.1-.4-.1-.5.1-.2.2-.6.7-.7.9-.1.1-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4.1-.1 0-.3 0-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.5c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.1 1.6 2.5 3.9 3.5.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z"/></svg>
      </a>
      <a
        href="https://instagram.com/zonamovilmelo"
        target="_blank"
        rel="noopener noreferrer"
        class="fab-icon fab-instagram"
        aria-label="Seguinos en Instagram (se abre en una pestaña nueva)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1"/></svg>
      </a>
    </div>

    <button
      type="button"
      class="fab-main"
      :aria-expanded="abierto"
      aria-label="Contactanos por redes sociales"
      @click="abierto = !abierto"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3.6-.8L3 20l1-5.3a8.4 8.4 0 0 1-.9-3.8A8.4 8.4 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5z"/></svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'FloatingSocial',
  data() {
    return { abierto: false };
  },
  mounted() {
    document.addEventListener('click', this.alClickearAfuera);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.alClickearAfuera);
  },
  methods: {
    cerrar() { this.abierto = false; },
    alClickearAfuera(evento) {
      if (!this.$el.contains(evento.target)) this.abierto = false;
    }
  }
};
</script>
