<template>
  <div class="view">
    <admin-topbar></admin-topbar>
    <div class="admin-shell">
      <admin-sidebar active="banners"></admin-sidebar>
      <div class="admin-main">
        <div class="admin-page-header">
          <h1>Banner de inicio</h1>
          <p>Las diapositivas que rotan arriba de la página principal, en el orden en que aparecen.</p>
        </div>

        <div class="admin-table-wrap">
          <div class="admin-table-tools">
            <div class="icons">
              <button
                type="button"
                :disabled="!seleccionados.length"
                :title="seleccionados.length ? 'Agregar seleccionados al carrusel' : 'Seleccioná al menos un banner'"
                @click="agregarAlCarruselSeleccionados"
              >👁</button>
              <button
                type="button"
                :disabled="!seleccionados.length"
                :title="seleccionados.length ? 'Eliminar seleccionados' : 'Seleccioná al menos un banner'"
                @click="eliminarSeleccionados"
              >🗑</button>
              <button
                type="button"
                :disabled="!seleccionados.length"
                :title="seleccionados.length ? 'Archivar seleccionados' : 'Seleccioná al menos un banner'"
                @click="archivarSeleccionados"
              >🗄</button>
              <button type="button" title="Agregar banner" @click="abrirParaCrear">＋</button>
            </div>
            <div class="select-all">
              <label>
                <input type="checkbox" v-model="todosSeleccionados">
                Seleccionar todos
              </label>
              <span v-if="seleccionados.length" class="select-count">({{ seleccionados.length }} seleccionados)</span>
              <router-link :to="{name:'admin-banners-archivados'}" class="cal-hoy-btn" style="margin-left:14px;">Ver archivados</router-link>
            </div>
          </div>

          <div class="admin-header-row">
            <div class="administrar-h">Banner</div>
            <div class="col">Etiqueta</div><div class="col">Estado</div><div class="col">Orden</div>
            <div class="thumb-spacer"></div><div class="chk-spacer"></div>
          </div>

          <p v-if="cargando" class="producto-vacio" aria-live="polite">Cargando banners…</p>

          <div class="admin-row" v-for="(banner, i) in banners" :key="banner.id">
            <a class="administrar" @click="abrirParaEditar(banner)">Administrar</a>
            <div class="col" v-html="banner.titulo"></div>
            <div class="col">{{ banner.etiqueta || 'Sin etiqueta' }}</div>
            <div class="col"><span class="estado-badge" :style="estiloEstado(banner.activo)">{{ banner.activo ? 'En el carrusel' : 'Oculto' }}</span></div>
            <div class="col orden-col">
              {{ banner.orden }}
              <span class="orden-flechas">
                <button type="button" title="Subir" :disabled="i === 0" @click="moverOrden(banner, -1)">▲</button>
                <button type="button" title="Bajar" :disabled="i === banners.length - 1" @click="moverOrden(banner, 1)">▼</button>
              </span>
            </div>
            <div class="thumb img-placeholder banner-thumb" :style="!obtenerUrlImagenBanner(banner) ? {background: colorDeMuestra(banner.color)} : {}">
              <img v-if="obtenerUrlImagenBanner(banner)" :src="obtenerUrlImagenBanner(banner)" :alt="banner.titulo" @error="$event.target.style.display='none'">
              <span v-else aria-hidden="true">{{ emojiDe(banner.icono) }}</span>
            </div>
            <input class="chk" type="checkbox" :value="banner.id" v-model="seleccionados" :aria-label="'Seleccionar ' + banner.titulo">
          </div>

          <p v-if="!cargando && !banners.length && !error" class="producto-vacio">Todavía no hay banners cargados.</p>
          <p v-if="error" class="producto-error" aria-live="polite">{{ error }}</p>
        </div>
      </div>
    </div>

    <div class="modal-overlay" :class="{open: mostrarFormulario}">
      <div class="modal-box">
        <button class="modal-close" type="button" @click="cerrarFormulario">✕</button>
        <h2>{{ editandoId ? 'Editar banner' : 'Agregar banner' }}</h2>
        <form @submit.prevent="guardarBanner">
          <div class="form-row">
            <div class="form-group">
              <label for="ban-imagen">Imagen de fondo (opcional)</label>
              <div class="imagen-picker">
                <div class="imagen-preview">
                  <img v-if="previewImagen" :src="previewImagen" alt="" @error="$event.target.style.display='none'">
                  <span v-else aria-hidden="true">🖼️</span>
                </div>
                <div class="imagen-picker-controles">
                  <input id="ban-imagen" type="file" accept="image/*" @change="alElegirImagen">
                  <button v-if="previewImagen" type="button" class="imagen-quitar" @click="quitarImagen">Quitar imagen</button>
                  <p class="imagen-nota">Si no cargás una imagen, el banner se muestra con el color e ícono de abajo. Se optimiza automáticamente.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="ban-etiqueta">Etiqueta (arriba del título)</label>
              <input id="ban-etiqueta" v-model="formulario.etiqueta" type="text" placeholder="Ej: OFERTA DE LA SEMANA">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="ban-titulo">Título</label>
              <input id="ban-titulo" v-model="formulario.titulo" type="text" placeholder="Ej: Hasta 40% OFF" required>
              <p class="imagen-nota">Se puede usar &lt;br&gt; para forzar un salto de línea, igual que en los banners actuales.</p>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="ban-subtitulo">Subtítulo</label>
              <input id="ban-subtitulo" v-model="formulario.subtitulo" type="text">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="ban-icono">Ícono (si no hay imagen)</label>
              <select id="ban-icono" v-model="formulario.icono">
                <option value="tag">🏷️ Etiqueta / oferta</option>
                <option value="headphones">🎧 Auriculares</option>
                <option value="bolt">⚡ Carga rápida</option>
                <option value="truck">🚚 Envíos</option>
              </select>
            </div>
            <div class="form-group">
              <label for="ban-color">Color de fondo (si no hay imagen)</label>
              <select id="ban-color" v-model.number="formulario.color">
                <option :value="1">Azul 1</option>
                <option :value="2">Azul 2</option>
                <option :value="3">Azul 3</option>
                <option :value="4">Azul 4</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="check-label"><input type="checkbox" v-model="formulario.activo"> Mostrar en el carrusel</label>
            </div>
          </div>
          <p v-if="errorFormulario" class="auth-error">{{ errorFormulario }}</p>
          <button class="modal-btn" type="submit" :disabled="guardando">
            {{ guardando ? 'Guardando...' : (editandoId ? 'Guardar cambios' : 'Agregar') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import AdminTopbar from '../../components/AdminTopbar.vue';
import AdminSidebar from '../../components/AdminSidebar.vue';
import api from '../../Api/api.js';

const BANNER_VACIO = { etiqueta: '', titulo: '', subtitulo: '', icono: 'tag', color: 1, activo: true };

// Mismos degradés que .banner-slide-1..4 en style.css, para que la
// muestra de color en la tabla del admin coincida con lo que se ve en
// el carrusel real (cuando el banner no tiene imagen propia).
const COLORES = {
  1: 'linear-gradient(135deg,#14208c 0%,#0f1a70 100%)',
  2: 'linear-gradient(135deg,#1c2bb0 0%,#0c1560 100%)',
  3: 'linear-gradient(135deg,#2437c9 0%,#12197a 100%)',
  4: 'linear-gradient(135deg,#0f1a70 0%,#3346d9 100%)'
};

const EMOJIS = { tag: '🏷️', headphones: '🎧', bolt: '⚡', truck: '🚚' };

// Arma la URL completa de la imagen del banner (misma lógica que se usa
// para las fotos de producto): el backend guarda solo la ruta relativa
// dentro del disco público de Laravel.
export function obtenerUrlImagenBanner(banner) {
  if (!banner || !banner.imagen) return null;
  if (/^https?:\/\//i.test(banner.imagen)) return banner.imagen;
  const origen = api.defaults.baseURL.replace(/\/api\/?$/, '');
  return `${origen}/storage/${banner.imagen.replace(/^\/+/, '')}`;
}

export default {
  name: 'AdminBannersView',
  components: { AdminTopbar, AdminSidebar },
  data() {
    return {
      banners: [],
      seleccionados: [],

      cargando: false,
      error: '',

      mostrarFormulario: false,
      editandoId: null,
      guardando: false,
      errorFormulario: '',
      formulario: { ...BANNER_VACIO },

      archivoImagen: null,
      previewImagen: null,
      sacarImagenExistente: false
    };
  },
  computed: {
    todosSeleccionados: {
      get() {
        return this.banners.length > 0 && this.seleccionados.length === this.banners.length;
      },
      set(marcar) {
        this.seleccionados = marcar ? this.banners.map(b => b.id) : [];
      }
    }
  },
  async mounted() {
    this.cargando = true;
    await this.cargarBanners();
    this.cargando = false;
  },
  methods: {
    obtenerUrlImagenBanner,
    estiloEstado(activo) {
      return activo
        ? { background: '#e6f8ec', color: '#1f8a44' }
        : { background: '#fdeceb', color: '#c0392b' };
    },
    colorDeMuestra(color) {
      return COLORES[color] || COLORES[1];
    },
    emojiDe(icono) {
      return EMOJIS[icono] || '🏷️';
    },
    async cargarBanners() {
      this.error = '';
      try {
        // El listado de admin trae también los banners ocultos (no
        // activos), a diferencia de /banners (que usa el carrusel
        // público). Los archivados quedan afuera de acá, tienen su
        // propia pantalla.
        const response = await api.get('/admin/banners');
        this.banners = response.data;
        this.seleccionados = this.seleccionados.filter(id => this.banners.some(b => b.id === id));
      } catch (requestError) {
        console.error('Error al cargar los banners:', requestError);
        this.error = 'No se pudieron cargar los banners.';
      }
    },

    // -- imagen (mismo patrón que en productos) --
    async alElegirImagen(evento) {
      const archivo = evento.target.files?.[0];
      if (!archivo) return;

      try {
        const imagenOptimizada = await this.optimizarImagen(archivo);
        this.archivoImagen = imagenOptimizada;
        this.sacarImagenExistente = false;
        if (this.previewImagen) URL.revokeObjectURL(this.previewImagen);
        this.previewImagen = URL.createObjectURL(imagenOptimizada);
      } catch (error) {
        console.error('No se pudo optimizar la imagen:', error);
        this.archivoImagen = archivo;
        this.sacarImagenExistente = false;
        if (this.previewImagen) URL.revokeObjectURL(this.previewImagen);
        this.previewImagen = URL.createObjectURL(archivo);
      }
    },
    optimizarImagen(archivo) {
      const MAX_DIMENSION = 1920;
      const CALIDAD = 0.82;

      return new Promise((resolve, reject) => {
        const imagen = new Image();
        const url = URL.createObjectURL(archivo);
        imagen.onload = () => {
          URL.revokeObjectURL(url);
          const escala = Math.min(1, MAX_DIMENSION / Math.max(imagen.width, imagen.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(imagen.width * escala));
          canvas.height = Math.max(1, Math.round(imagen.height * escala));
          canvas.getContext('2d').drawImage(imagen, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('El navegador no pudo comprimir la imagen.'));
              return;
            }
            resolve(new File([blob], `${archivo.name.replace(/\.[^.]+$/, '')}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', CALIDAD);
        };
        imagen.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('El archivo no es una imagen válida.'));
        };
        imagen.src = url;
      });
    },
    quitarImagen() {
      this.archivoImagen = null;
      this.sacarImagenExistente = true;
      if (this.previewImagen) URL.revokeObjectURL(this.previewImagen);
      this.previewImagen = null;
    },
    limpiarImagenDelFormulario() {
      if (this.previewImagen) URL.revokeObjectURL(this.previewImagen);
      this.archivoImagen = null;
      this.previewImagen = null;
      this.sacarImagenExistente = false;
    },

    abrirParaCrear() {
      this.editandoId = null;
      this.errorFormulario = '';
      this.formulario = { ...BANNER_VACIO };
      this.limpiarImagenDelFormulario();
      this.mostrarFormulario = true;
    },
    abrirParaEditar(banner) {
      this.editandoId = banner.id;
      this.errorFormulario = '';
      this.formulario = {
        etiqueta: banner.etiqueta || '',
        titulo: banner.titulo,
        subtitulo: banner.subtitulo || '',
        icono: banner.icono,
        color: banner.color,
        activo: !!banner.activo
      };
      this.limpiarImagenDelFormulario();
      // si el banner ya tiene una imagen, la mostramos como vista previa
      this.previewImagen = obtenerUrlImagenBanner(banner);
      this.mostrarFormulario = true;
    },
    cerrarFormulario() {
      this.mostrarFormulario = false;
      this.limpiarImagenDelFormulario();
    },
    async guardarBanner() {
      this.guardando = true;
      this.errorFormulario = '';
      try {
        // Igual que en productos: mandamos multipart/form-data para poder
        // adjuntar la imagen. Los booleanos van como '1'/'0': si dejáramos
        // que FormData los convierta solo, "true"/"false" como texto se
        // guardarían mal en la columna (MySQL los interpreta como 0).
        const datos = new FormData();
        Object.entries(this.formulario).forEach(([campo, valor]) => {
          if (typeof valor === 'boolean') {
            datos.append(campo, valor ? '1' : '0');
          } else {
            datos.append(campo, valor ?? '');
          }
        });
        if (this.archivoImagen) {
          datos.append('imagen', this.archivoImagen);
        } else if (this.sacarImagenExistente) {
          datos.append('quitar_imagen', '1');
        }

        if (this.editandoId) {
          // PHP no procesa bien archivos en pedidos PUT/PATCH con
          // multipart, así que editamos con POST + "_method=PUT".
          datos.append('_method', 'PUT');
          await api.post(`/banners/${this.editandoId}`, datos);
        } else {
          await api.post('/banners', datos);
        }
        this.mostrarFormulario = false;
        this.limpiarImagenDelFormulario();
        await this.cargarBanners();
      } catch (requestError) {
        console.error('Error al guardar el banner:', requestError);
        this.errorFormulario = requestError.response?.data?.message || 'No se pudo guardar el banner.';
      } finally {
        this.guardando = false;
      }
    },

    // Intercambia el orden del banner con el de arriba (-1) o el de
    // abajo (+1). Los dos PUT van en paralelo y después se recarga la
    // lista, así la tabla siempre refleja lo que quedó guardado.
    async moverOrden(banner, direccion) {
      const i = this.banners.findIndex(b => b.id === banner.id);
      const j = i + direccion;
      if (j < 0 || j >= this.banners.length) return;
      const vecino = this.banners[j];

      this.error = '';
      try {
        await Promise.all([
          api.put(`/banners/${banner.id}`, { orden: vecino.orden }),
          api.put(`/banners/${vecino.id}`, { orden: banner.orden })
        ]);
        await this.cargarBanners();
      } catch (requestError) {
        console.error('Error al reordenar los banners:', requestError);
        this.error = 'No se pudo cambiar el orden de los banners.';
      }
    },

    // -- selección: agregar al carrusel / eliminar / archivar --
    async agregarAlCarruselSeleccionados() {
      if (!this.seleccionados.length) return;

      this.error = '';
      try {
        // Marca de una todos los banners tildados como visibles en el
        // carrusel de inicio, sin tener que entrar a editarlos uno por
        // uno.
        await Promise.all(this.seleccionados.map(id => api.put(`/banners/${id}`, { activo: true })));
        this.seleccionados = [];
        await this.cargarBanners();
      } catch (requestError) {
        console.error('Error al agregar al carrusel:', requestError);
        this.error = 'No se pudieron agregar al carrusel algunos banners.';
      }
    },
    async eliminarSeleccionados() {
      if (!this.seleccionados.length) return;
      const cantidad = this.seleccionados.length;
      const confirmado = confirm(`¿Eliminar ${cantidad} banner${cantidad > 1 ? 's' : ''}? Esta acción no se puede deshacer.`);
      if (!confirmado) return;

      this.error = '';
      try {
        await Promise.all(this.seleccionados.map(id => api.delete(`/banners/${id}`)));
        this.seleccionados = [];
        await this.cargarBanners();
      } catch (requestError) {
        console.error('Error al eliminar banners:', requestError);
        this.error = 'No se pudieron eliminar algunos banners.';
      }
    },
    async archivarSeleccionados() {
      if (!this.seleccionados.length) return;

      this.error = '';
      try {
        // Un banner archivado sale del carrusel y de este listado, pero
        // sigue existiendo: se puede restaurar desde "Banners archivados".
        await Promise.all(this.seleccionados.map(id => api.put(`/banners/${id}`, { archivado: true })));
        this.seleccionados = [];
        await this.cargarBanners();
      } catch (requestError) {
        console.error('Error al archivar:', requestError);
        this.error = 'No se pudieron archivar algunos banners.';
      }
    }
  }
};
</script>

<style scoped>
.banner-thumb{display:flex; align-items:center; justify-content:center; font-size:20px; border-radius:8px;}
.orden-col{display:flex; align-items:center; gap:8px;}
.orden-flechas{display:flex; flex-direction:column; line-height:1;}
.orden-flechas button{border:none; background:none; cursor:pointer; padding:0 4px; font-size:10px; color:#666;}
.orden-flechas button:disabled{opacity:.3; cursor:default;}
</style>
