<template>
  <cuenta-shell activo="direcciones" titulo-seccion="Direcciones">
    <p v-if="cargando" aria-live="polite">Cargando direcciones…</p>

    <template v-else>
      <p v-if="error" class="producto-error" aria-live="polite">{{ error }}</p>
      <p v-if="local && direcciones.length" class="cuenta-nota-local">Tus direcciones se guardan solo en este navegador por ahora.</p>

      <div v-if="!direcciones.length" class="cuenta-vacio">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>
        <h2>No tenés direcciones guardadas</h2>
        <p>Agregá una dirección para que tus pedidos lleguen más rápido la próxima vez.</p>
        <button type="button" class="cuenta-vacio-cta" @click="abrirParaCrear">+ Agregar dirección</button>
      </div>

      <div v-else>
        <div class="cuenta-barra">
          <button type="button" class="cuenta-vacio-cta" @click="abrirParaCrear">+ Agregar dirección</button>
        </div>
        <ul class="direcciones-lista">
          <li v-for="direccion in direcciones" :key="direccion.id" class="direccion-card" :class="{principal: direccion.principal}">
            <div class="direccion-info">
              <strong>{{ direccion.etiqueta || 'Dirección' }}</strong>
              <span v-if="direccion.principal" class="direccion-badge">Principal</span>
              <p>{{ direccion.direccion }}</p>
              <p class="direccion-detalle">{{ [direccion.ciudad, direccion.departamento].filter(Boolean).join(', ') }}</p>
              <p v-if="direccion.telefono" class="direccion-detalle">Tel: {{ direccion.telefono }}</p>
            </div>
            <div class="direccion-acciones">
              <button v-if="!direccion.principal" type="button" @click="hacerPrincipal(direccion)">Hacer principal</button>
              <button type="button" @click="abrirParaEditar(direccion)">Editar</button>
              <button type="button" class="peligro" @click="eliminar(direccion)">Eliminar</button>
            </div>
          </li>
        </ul>
      </div>
    </template>

    <div class="modal-overlay" :class="{open: mostrarFormulario}">
      <div class="modal-box">
        <button class="modal-close" type="button" @click="cerrarFormulario">✕</button>
        <h2>{{ formulario.id ? 'Editar dirección' : 'Agregar dirección' }}</h2>
        <form @submit.prevent="guardar">
          <div class="form-row">
            <div class="form-group">
              <label for="dir-etiqueta">Nombre <span class="texto-atenuado">(opcional)</span></label>
              <input id="dir-etiqueta" v-model.trim="formulario.etiqueta" type="text" maxlength="60" placeholder="Ej: Casa, Trabajo">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="dir-direccion">Dirección</label>
              <input id="dir-direccion" v-model.trim="formulario.direccion" type="text" maxlength="255" placeholder="Calle, número, apto." required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="dir-ciudad">Ciudad</label>
              <input id="dir-ciudad" v-model.trim="formulario.ciudad" type="text" maxlength="100" required>
            </div>
            <div class="form-group">
              <label for="dir-departamento">Departamento</label>
              <input id="dir-departamento" v-model.trim="formulario.departamento" type="text" maxlength="100" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="dir-telefono">Teléfono de contacto <span class="texto-atenuado">(opcional)</span></label>
              <input id="dir-telefono" v-model.trim="formulario.telefono" type="tel" maxlength="30">
            </div>
          </div>
          <label class="check-label"><input v-model="formulario.principal" type="checkbox"> Usar como dirección principal</label>
          <p v-if="errorFormulario" class="auth-error">{{ errorFormulario }}</p>
          <button class="modal-btn" type="submit" :disabled="guardando">{{ guardando ? 'Guardando...' : 'Guardar' }}</button>
        </form>
      </div>
    </div>
  </cuenta-shell>
</template>

<script>
import CuentaShell from '../../components/CuentaShell.vue';
import { listarDirecciones, guardarDireccion, borrarDireccion, mensajeDeError } from '../../Api/cuenta.js';

const DIRECCION_VACIA = { id: null, etiqueta: '', direccion: '', ciudad: '', departamento: '', telefono: '', principal: false };

export default {
  name: 'DireccionesView',
  components: { CuentaShell },
  data() {
    return {
      direcciones: [],
      local: false,
      cargando: true,
      error: '',
      mostrarFormulario: false,
      guardando: false,
      errorFormulario: '',
      formulario: { ...DIRECCION_VACIA }
    };
  },
  async mounted() {
    await this.cargar();
    this.cargando = false;
  },
  methods: {
    async cargar() {
      this.error = '';
      try {
        const { datos, local } = await listarDirecciones();
        this.direcciones = datos;
        this.local = local;
      } catch (error) {
        console.error('Error al cargar direcciones:', error);
        this.error = mensajeDeError(error, 'No se pudieron cargar tus direcciones.');
      }
    },
    abrirParaCrear() {
      this.errorFormulario = '';
      this.formulario = { ...DIRECCION_VACIA, principal: !this.direcciones.length };
      this.mostrarFormulario = true;
    },
    abrirParaEditar(direccion) {
      this.errorFormulario = '';
      this.formulario = { ...direccion };
      this.mostrarFormulario = true;
    },
    cerrarFormulario() {
      this.mostrarFormulario = false;
    },
    async guardar() {
      this.guardando = true;
      this.errorFormulario = '';
      try {
        await guardarDireccion(this.formulario);
        this.mostrarFormulario = false;
        await this.cargar();
      } catch (error) {
        console.error('Error al guardar la dirección:', error);
        this.errorFormulario = mensajeDeError(error, 'No se pudo guardar la dirección.');
      } finally {
        this.guardando = false;
      }
    },
    async hacerPrincipal(direccion) {
      this.error = '';
      try {
        await guardarDireccion({ ...direccion, principal: true });
        await this.cargar();
      } catch (error) {
        console.error('Error al cambiar la dirección principal:', error);
        this.error = mensajeDeError(error, 'No se pudo cambiar la dirección principal.');
      }
    },
    async eliminar(direccion) {
      if (!confirm(`¿Eliminar la dirección "${direccion.etiqueta || direccion.direccion}"?`)) return;
      this.error = '';
      try {
        await borrarDireccion(direccion.id);
        await this.cargar();
      } catch (error) {
        console.error('Error al eliminar la dirección:', error);
        this.error = mensajeDeError(error, 'No se pudo eliminar la dirección.');
      }
    }
  }
};
</script>
