<template>
  <div class="view">
    <admin-topbar></admin-topbar>
    <div class="admin-shell">
      <admin-sidebar active="ordenes"></admin-sidebar>
      <div class="admin-main">
        <div class="admin-page-header">
          <h1>Órdenes</h1>
          <p>Pedidos de clientes y su estado actual.</p>
        </div>

        <div class="stat-cards">
          <div class="stat-card" v-for="resumen in resumenPorEstado" :key="resumen.estado">
            <div class="top">
              <div class="ic" :style="{background: estilosEstado[resumen.estado].fondo, color: estilosEstado[resumen.estado].color}">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>
              </div>
              <div><div class="label">{{ estilosEstado[resumen.estado].etiqueta }}</div><div class="value">{{ resumen.cantidad }}</div></div>
            </div>
          </div>
        </div>

        <div class="admin-table-wrap">
          <div class="admin-table-tools">
            <div class="icons">
              <button
                type="button"
                :disabled="!seleccionados.length"
                :title="seleccionados.length ? 'Eliminar seleccionadas' : 'Seleccioná al menos una orden'"
                @click="eliminarSeleccionadas"
              >🗑</button>
              <button type="button" title="Actualizar" @click="cargarOrdenes">⟳</button>
            </div>
            <div class="select-all">
              <label>
                <input type="checkbox" v-model="todasSeleccionadas">
                Seleccionar todas
              </label>
              <span v-if="seleccionados.length" class="select-count">({{ seleccionados.length }} seleccionadas)</span>
            </div>
          </div>

          <div class="admin-header-row">
            <div class="administrar-h">Orden</div>
            <div class="col">Cliente</div><div class="col">Fecha</div><div class="col">Total (UYU)</div><div class="col">Estado</div>
          </div>

          <p v-if="cargando" class="producto-vacio" aria-live="polite">Cargando órdenes…</p>

          <div class="admin-row" v-for="orden in ordenes" :key="orden.id">
            <a class="administrar" @click="abrirDetalle(orden)">Administrar</a>
            <div class="col">{{ orden.cliente }}</div>
            <div class="col">{{ orden.fecha }}</div>
            <div class="col">{{ formatearPrecio(orden.total) }}</div>
            <div class="col"><span class="estado-badge" :style="{background: estilosEstado[orden.estado].fondo, color: estilosEstado[orden.estado].color}">{{ estilosEstado[orden.estado].etiqueta }}</span></div>
            <input class="chk" type="checkbox" :value="orden.id" v-model="seleccionados" :aria-label="'Seleccionar orden ' + orden.id">
          </div>

          <p v-if="!cargando && !ordenes.length && !error" class="producto-vacio">No hay órdenes registradas.</p>
          <p v-if="error" class="producto-error" aria-live="polite">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Modal de detalle: ver los ítems de la orden y cambiar su estado -->
    <div class="modal-overlay" :class="{open: mostrarDetalle}">
      <div class="modal-box" v-if="ordenActiva">
        <button class="modal-close" type="button" @click="cerrarDetalle">✕</button>
        <h2>Orden #{{ ordenActiva.id }}</h2>

        <div class="orden-detalle-info">
          <p><strong>Cliente:</strong> {{ ordenActiva.cliente }}</p>
          <p><strong>Fecha:</strong> {{ ordenActiva.fecha }}</p>
          <p><strong>Total:</strong> {{ formatearPrecio(ordenActiva.total) }}</p>
        </div>

        <div v-if="ordenActiva.items.length" class="orden-detalle-items">
          <div class="orden-item-row" v-for="item in ordenActiva.items" :key="item.nombre + item.cantidad">
            <span>{{ item.cantidad }}×</span>
            <span class="orden-item-nombre">{{ item.nombre }}</span>
          </div>
        </div>
        <p v-else class="producto-vacio">Esta orden no tiene el detalle de productos disponible.</p>

        <div class="form-row">
          <div class="form-group">
            <label for="orden-estado">Estado</label>
            <select id="orden-estado" v-model="estadoSeleccionado">
              <option v-for="(datos, clave) in estilosEstado" :key="clave" :value="clave">{{ datos.etiqueta }}</option>
            </select>
          </div>
        </div>
        <p v-if="errorDetalle" class="auth-error">{{ errorDetalle }}</p>
        <button class="modal-btn" type="button" :disabled="guardandoEstado" @click="guardarEstado">
          {{ guardandoEstado ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AdminTopbar from '../../components/AdminTopbar.vue';
import AdminSidebar from '../../components/AdminSidebar.vue';
import api from '../../Api/api.js';
import { formatearPrecio } from '../../catalog.js';

// Colores y etiquetas de cada estado posible de una orden.
const ESTILOS_ESTADO = {
  pendiente:   { etiqueta: 'Pendiente',   fondo: '#fff3da', color: '#b3791a' },
  en_proceso:  { etiqueta: 'En proceso',  fondo: '#e7f0ff', color: '#2451e0' },
  enviado:     { etiqueta: 'Enviado',     fondo: '#f2e9ff', color: '#7638c9' },
  completado:  { etiqueta: 'Completado',  fondo: '#e6f8ec', color: '#1f8a44' },
  cancelado:   { etiqueta: 'Cancelado',   fondo: '#fde8e8', color: '#d3423e' }
};

// El backend puede mandar los campos de la orden con nombres distintos
// según cómo lo haya armado cada uno — probamos varias formas posibles
// para cada dato, así esta pantalla no se rompe si el formato real
// difiere un poco de lo que asumimos acá.
function normalizarOrden(ordenBackend) {
  const cliente = ordenBackend.cliente || ordenBackend.usuario?.name || ordenBackend.nombre_cliente || 'Sin datos';
  const fechaCruda = ordenBackend.fecha || ordenBackend.created_at || ordenBackend.fecha_creacion;
  const total = Number(ordenBackend.total ?? ordenBackend.monto_total ?? 0);
  const estado = ESTILOS_ESTADO[ordenBackend.estado] ? ordenBackend.estado : (ESTILOS_ESTADO[ordenBackend.status] ? ordenBackend.status : 'pendiente');
  const itemsCrudos = ordenBackend.items || ordenBackend.detalles || ordenBackend.productos || [];

  return {
    id: ordenBackend.id,
    cliente,
    fecha: fechaCruda ? new Date(fechaCruda).toLocaleDateString('es-UY') : '—',
    total,
    estado,
    items: itemsCrudos.map(item => ({
      nombre: item.nombre || item.producto?.nombre || 'Producto',
      cantidad: item.cantidad || item.qty || 1
    }))
  };
}

export default {
  name: 'AdminOrdenesView',
  components: { AdminTopbar, AdminSidebar },
  data() {
    return {
      ordenes: [],
      seleccionados: [],
      cargando: false,
      error: '',
      estilosEstado: ESTILOS_ESTADO,

      mostrarDetalle: false,
      ordenActiva: null,
      estadoSeleccionado: 'pendiente',
      guardandoEstado: false,
      errorDetalle: ''
    };
  },
  computed: {
    todasSeleccionadas: {
      get() {
        return this.ordenes.length > 0 && this.seleccionados.length === this.ordenes.length;
      },
      set(marcar) {
        this.seleccionados = marcar ? this.ordenes.map(o => o.id) : [];
      }
    },
    resumenPorEstado() {
      return Object.keys(ESTILOS_ESTADO).map(estado => ({
        estado,
        cantidad: this.ordenes.filter(o => o.estado === estado).length
      }));
    }
  },
  async mounted() {
    await this.cargarOrdenes();
  },
  methods: {
    formatearPrecio,
    async cargarOrdenes() {
      this.cargando = true;
      this.error = '';
      try {
        const response = await api.get('/ordenes');
        this.ordenes = (response.data || []).map(normalizarOrden);
        this.seleccionados = this.seleccionados.filter(id => this.ordenes.some(o => o.id === id));
      } catch (requestError) {
        console.error('Error al cargar órdenes:', requestError);
        this.error = 'No se pudieron cargar las órdenes.';
      } finally {
        this.cargando = false;
      }
    },
    abrirDetalle(orden) {
      this.ordenActiva = orden;
      this.estadoSeleccionado = orden.estado;
      this.errorDetalle = '';
      this.mostrarDetalle = true;
    },
    cerrarDetalle() {
      this.mostrarDetalle = false;
      this.ordenActiva = null;
    },
    async guardarEstado() {
      this.guardandoEstado = true;
      this.errorDetalle = '';
      try {
        await api.put(`/ordenes/${this.ordenActiva.id}`, { estado: this.estadoSeleccionado });
        this.mostrarDetalle = false;
        await this.cargarOrdenes();
      } catch (requestError) {
        console.error('Error al actualizar el estado:', requestError);
        this.errorDetalle = requestError.response?.data?.message || 'No se pudo actualizar el estado.';
      } finally {
        this.guardandoEstado = false;
      }
    },
    async eliminarSeleccionadas() {
      if (!this.seleccionados.length) return;
      const cantidad = this.seleccionados.length;
      const confirmado = confirm(`¿Eliminar ${cantidad} orden${cantidad > 1 ? 'es' : ''}? Esta acción no se puede deshacer.`);
      if (!confirmado) return;

      this.error = '';
      try {
        await Promise.all(this.seleccionados.map(id => api.delete(`/ordenes/${id}`)));
        this.seleccionados = [];
        await this.cargarOrdenes();
      } catch (requestError) {
        console.error('Error al eliminar:', requestError);
        this.error = 'No se pudieron eliminar algunas órdenes.';
      }
    }
  }
};
</script>
