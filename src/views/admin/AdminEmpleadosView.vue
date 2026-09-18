<template>
  <div class="view">
    <admin-topbar></admin-topbar>
    <div class="admin-shell">
      <admin-sidebar active="empleados"></admin-sidebar>
      <div class="admin-main">
        <div class="admin-page-header">
          <h1>Empleados</h1>
          <p>El equipo que trabaja en la tienda.</p>
        </div>

        <div class="admin-table-wrap">
          <div class="admin-table-tools">
            <div class="icons">
              <button
                type="button"
                :disabled="!seleccionados.length"
                :title="seleccionados.length ? 'Eliminar seleccionados' : 'Seleccioná al menos un empleado'"
                @click="eliminarSeleccionados"
              >🗑</button>
              <button type="button" title="Agregar empleado" @click="abrirParaCrear">＋</button>
            </div>
            <div class="select-all">
              <label>
                <input type="checkbox" v-model="todosSeleccionados">
                Seleccionar todos
              </label>
              <span v-if="seleccionados.length" class="select-count">({{ seleccionados.length }} seleccionados)</span>
            </div>
          </div>

          <div class="admin-header-row">
            <div class="administrar-h">Empleado</div>
            <div class="col">Puesto</div><div class="col">Contacto</div><div class="col">Estado</div><div class="col">ID</div>
            <div class="chk-spacer"></div>
          </div>

          <p v-if="cargando" class="producto-vacio" aria-live="polite">Cargando empleados…</p>

          <div class="admin-row" v-for="empleado in empleados" :key="empleado.id">
            <a class="administrar" @click="abrirParaEditar(empleado)">Administrar</a>
            <div class="col">{{ empleado.nombre }}</div>
            <div class="col">{{ empleado.puesto }}</div>
            <div class="col">{{ empleado.email || 'Sin datos' }}<br>{{ empleado.telefono || '' }}</div>
            <div class="col"><span class="estado-badge" :style="estiloEstado(empleado.activo)">{{ empleado.activo ? 'Activo' : 'Inactivo' }}</span></div>
            <div class="col">{{ empleado.id }}</div>
            <input class="chk" type="checkbox" :value="empleado.id" v-model="seleccionados" :aria-label="'Seleccionar ' + empleado.nombre">
          </div>

          <p v-if="!cargando && !empleados.length && !error" class="producto-vacio">No hay empleados registrados.</p>
          <p v-if="error" class="producto-error" aria-live="polite">{{ error }}</p>
        </div>
      </div>
    </div>

    <div class="modal-overlay" :class="{open: mostrarFormulario}">
      <div class="modal-box">
        <button class="modal-close" type="button" @click="cerrarFormulario">✕</button>
        <h2>{{ editandoId ? 'Editar empleado' : 'Agregar empleado' }}</h2>
        <form @submit.prevent="guardarEmpleado">
          <div class="form-row">
            <div class="form-group">
              <label for="emp-nombre">Nombre</label>
              <input id="emp-nombre" v-model="formulario.nombre" type="text" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="emp-puesto">Puesto</label>
              <input id="emp-puesto" v-model="formulario.puesto" type="text" placeholder="Ej: Vendedor" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="emp-email">Email</label>
              <input id="emp-email" v-model="formulario.email" type="email">
            </div>
            <div class="form-group">
              <label for="emp-telefono">Teléfono</label>
              <input id="emp-telefono" v-model="formulario.telefono" type="text">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="check-label"><input type="checkbox" v-model="formulario.activo"> Empleado activo</label>
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

const EMPLEADO_VACIO = { nombre: '', puesto: '', email: '', telefono: '', activo: true };

export default {
  name: 'AdminEmpleadosView',
  components: { AdminTopbar, AdminSidebar },
  data() {
    return {
      empleados: [],
      seleccionados: [],

      cargando: false,
      error: '',

      mostrarFormulario: false,
      editandoId: null,
      guardando: false,
      errorFormulario: '',
      formulario: { ...EMPLEADO_VACIO }
    };
  },
  computed: {
    todosSeleccionados: {
      get() {
        return this.empleados.length > 0 && this.seleccionados.length === this.empleados.length;
      },
      set(marcar) {
        this.seleccionados = marcar ? this.empleados.map(e => e.id) : [];
      }
    }
  },
  async mounted() {
    this.cargando = true;
    await this.cargarEmpleados();
    this.cargando = false;
  },
  methods: {
    estiloEstado(activo) {
      return activo
        ? { background: '#e6f8ec', color: '#1f8a44' }
        : { background: '#fdeceb', color: '#c0392b' };
    },
    async cargarEmpleados() {
      this.error = '';
      try {
        const response = await api.get('/empleados');
        this.empleados = response.data;
        this.seleccionados = this.seleccionados.filter(id => this.empleados.some(e => e.id === id));
      } catch (requestError) {
        console.error('Error al cargar empleados:', requestError);
        this.error = 'No se pudieron cargar los empleados.';
      }
    },
    abrirParaCrear() {
      this.editandoId = null;
      this.errorFormulario = '';
      this.formulario = { ...EMPLEADO_VACIO };
      this.mostrarFormulario = true;
    },
    abrirParaEditar(empleado) {
      this.editandoId = empleado.id;
      this.errorFormulario = '';
      this.formulario = {
        nombre: empleado.nombre,
        puesto: empleado.puesto,
        email: empleado.email || '',
        telefono: empleado.telefono || '',
        activo: !!empleado.activo
      };
      this.mostrarFormulario = true;
    },
    cerrarFormulario() {
      this.mostrarFormulario = false;
    },
    async guardarEmpleado() {
      this.guardando = true;
      this.errorFormulario = '';
      try {
        if (this.editandoId) {
          await api.put(`/empleados/${this.editandoId}`, this.formulario);
        } else {
          await api.post('/empleados', this.formulario);
        }
        this.mostrarFormulario = false;
        await this.cargarEmpleados();
      } catch (requestError) {
        console.error('Error al guardar empleado:', requestError);
        this.errorFormulario = requestError.response?.data?.message || 'No se pudo guardar el empleado.';
      } finally {
        this.guardando = false;
      }
    },
    async eliminarSeleccionados() {
      if (!this.seleccionados.length) return;
      const cantidad = this.seleccionados.length;
      const confirmado = confirm(`¿Eliminar ${cantidad} empleado${cantidad > 1 ? 's' : ''}? Esta acción no se puede deshacer.`);
      if (!confirmado) return;

      this.error = '';
      try {
        await Promise.all(this.seleccionados.map(id => api.delete(`/empleados/${id}`)));
        this.seleccionados = [];
        await this.cargarEmpleados();
      } catch (requestError) {
        console.error('Error al eliminar empleados:', requestError);
        this.error = 'No se pudieron eliminar algunos empleados.';
      }
    }
  }
};
</script>
