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

        <router-link :to="{name:'admin-banners'}" class="admin-btn admin-btn-neutro" style="margin-bottom:16px;">← Volver a Banner de inicio</router-link>

        <div class="admin-table-wrap">
          <div class="admin-header-row">
            <div class="administrar-h" aria-hidden="true"></div>
            <col-ordenable class="col" clave="banner" :orden="orden" @ordenar="ordenarPor">Banner</col-ordenable>
            <col-ordenable class="col" clave="orden" :orden="orden" @ordenar="ordenarPor">Orden</col-ordenable>
            <col-ordenable class="col" clave="id" :orden="orden" @ordenar="ordenarPor">ID</col-ordenable>
            <div class="thumb-spacer"></div>
          </div>

          <p v-if="cargando" class="producto-vacio" aria-live="polite">Cargando…</p>

          <div class="admin-row" v-for="banner in bannersOrdenados" :key="banner.id">
            <div class="administrar"><button type="button" class="admin-btn admin-btn-restaurar" @click="restaurar(banner)"><span aria-hidden="true">↺</span> Restaurar</button></div>
            <div class="col" v-if="tituloLimpio(banner)" v-html="tituloLimpio(banner)"></div>
            <div class="col texto-atenuado" v-else>Banner #{{ banner.id }}</div>
            <div class="col">{{ banner.orden }}</div>
            <div class="col">{{ banner.id }}</div>
            <div class="thumb img-placeholder banner-thumb" :style="!obtenerUrlImagenBanner(banner) ? {background: colorDeMuestra(banner.color)} : {}">
              <img v-if="obtenerUrlImagenBanner(banner)" :src="obtenerUrlImagenBanner(banner)" :alt="banner.titulo || ('Banner #' + banner.id)" @error="$event.target.style.display='none'">
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
import ColOrdenable from '../../components/ColOrdenable.vue';
import { alternarOrden, ordenarLista } from '../../utils/ordenamiento.js';
import { limpiarTexto, htmlSeguro } from '../../utils/textoBanner.js';

const COLORES = {
  1: 'linear-gradient(135deg,#14208c 0%,#0f1a70 100%)',
  2: 'linear-gradient(135deg,#1c2bb0 0%,#0c1560 100%)',
  3: 'linear-gradient(135deg,#2437c9 0%,#12197a 100%)',
  4: 'linear-gradient(135deg,#0f1a70 0%,#3346d9 100%)'
};
const EMOJIS = { tag: '🏷️', headphones: '🎧', bolt: '⚡', truck: '🚚' };

// Qué valor se compara al ordenar por cada columna de la tabla.
const VALORES_ORDEN = {
  banner: banner => limpiarTexto(banner.titulo).replace(/<[^>]*>/g, '') || 'Banner #' + banner.id,
  orden: banner => Number(banner.orden),
  id: banner => Number(banner.id)
};

export default {
  name: 'AdminBannersArchivadosView',
  components: { AdminTopbar, AdminSidebar, ColOrdenable },
  data() {
    return {
      banners: [],
      orden: { clave: null, direccion: 'asc' },
      cargando: false,
      error: ''
    };
  },
  computed: {
    bannersOrdenados() {
      return ordenarLista(this.banners, this.orden, VALORES_ORDEN);
    }
  },
  async mounted() {
    await this.cargarArchivados();
  },
  methods: {
    obtenerUrlImagenBanner,
    tituloLimpio(banner) {
      return htmlSeguro(limpiarTexto(banner.titulo));
    },
    ordenarPor(clave) {
      this.orden = alternarOrden(this.orden, clave);
    },
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
