<template>
  <div class="view">
    <admin-topbar></admin-topbar>
    <div class="admin-shell">
      <admin-sidebar active="banners"></admin-sidebar>
      <div class="admin-main">
        <div class="admin-page-header">
          <h1>Banners archivados</h1>
          <p>Banners que ya no aparecen en el carrusel de inicio ni en el listado normal. Podés restaurarlos o borrarlos definitivamente.</p>
        </div>

        <router-link :to="{name:'admin-banners'}" class="cal-hoy-btn" style="display:inline-block; margin-bottom:16px;">← Volver a Banner de inicio</router-link>

        <div class="admin-table-wrap">
          <div class="admin-header-row">
            <div class="administrar-h">Banner</div>
            <div class="col">Etiqueta</div><div class="col">Orden</div><div class="col">ID</div>
            <div class="thumb-spacer"></div>
          </div>

          <p v-if="cargando" class="producto-vacio" aria-live="polite">Cargando…</p>

          <div class="admin-row" v-for="banner in banners" :key="banner.id">
            <a class="administrar" @click="restaurar(banner)">Restaurar</a>
            <div class="col" v-html="banner.titulo"></div>
            <div class="col">{{ banner.etiqueta || 'Sin etiqueta' }}</div>
            <div class="col">{{ banner.orden }}</div>
            <div class="col">{{ banner.id }}</div>
            <div class="thumb img-placeholder banner-thumb" :style="!obtenerUrlImagenBanner(banner) ? {background: colorDeMuestra(banner.color)} : {}">
              <img v-if="obtenerUrlImagenBanner(banner)" :src="obtenerUrlImagenBanner(banner)" :alt="banner.titulo" @error="$event.target.style.display='none'">
              <span v-else aria-hidden="true">{{ emojiDe(banner.icono) }}</span>
            </div>
          </div>

          <p v-if="!cargando && !banners.length && !error" class="producto-vacio">No hay banners archivados por ahora.</p>
          <p v-if="error" class="producto-error" aria-live="polite">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminTopbar from '../../components/AdminTopbar.vue';
import AdminSidebar from '../../components/AdminSidebar.vue';
import api from '../../Api/api.js';
import { obtenerUrlImagenBanner } from './AdminBannersView.vue';

const COLORES = {
  1: 'linear-gradient(135deg,#14208c 0%,#0f1a70 100%)',
  2: 'linear-gradient(135deg,#1c2bb0 0%,#0c1560 100%)',
  3: 'linear-gradient(135deg,#2437c9 0%,#12197a 100%)',
  4: 'linear-gradient(135deg,#0f1a70 0%,#3346d9 100%)'
};
const EMOJIS = { tag: '🏷️', headphones: '🎧', bolt: '⚡', truck: '🚚' };

export default {
  name: 'AdminBannersArchivadosView',
  components: { AdminTopbar, AdminSidebar },
  data() {
    return {
      banners: [],
      cargando: false,
      error: ''
    };
  },
  async mounted() {
    await this.cargarArchivados();
  },
  methods: {
    obtenerUrlImagenBanner,
    colorDeMuestra(color) {
      return COLORES[color] || COLORES[1];
    },
    emojiDe(icono) {
      return EMOJIS[icono] || '🏷️';
    },
    async cargarArchivados() {
      this.cargando = true;
      this.error = '';
      try {
        const response = await api.get('/admin/banners', { params: { archivados: 1 } });
        this.banners = response.data;
      } catch (requestError) {
        console.error('Error al cargar los banners archivados:', requestError);
        this.error = 'No se pudieron cargar los banners archivados.';
      } finally {
        this.cargando = false;
      }
    },
    async restaurar(banner) {
      this.error = '';
      try {
        await api.put(`/banners/${banner.id}`, { archivado: false });
        await this.cargarArchivados();
      } catch (requestError) {
        console.error('Error al restaurar el banner:', requestError);
        this.error = 'No se pudo restaurar el banner.';
      }
    }
  }
};
</script>

<style scoped>
.banner-thumb{display:flex; align-items:center; justify-content:center; font-size:20px; border-radius:8px;}
</style>
