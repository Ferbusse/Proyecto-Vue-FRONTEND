<template>
  <div class="view">
    <admin-topbar></admin-topbar>
    <div class="admin-shell">
      <admin-sidebar active="calendario"></admin-sidebar>
      <div class="admin-main">
        <div class="admin-page-header">
          <h1>Calendario</h1>
          <p>Órdenes agrupadas por fecha.</p>
        </div>

        <p v-if="cargando" class="producto-vacio">Cargando órdenes…</p>
        <p v-else-if="error" class="producto-error">{{ error }}</p>

        <template v-else>
          <div class="cal-card">
            <div class="cal-card-header">
              <div class="cal-mes-nav">
                <button type="button" class="cal-nav-btn" @click="mesAnterior" aria-label="Mes anterior">‹</button>
                <h3>{{ etiquetaMes }}</h3>
                <button type="button" class="cal-nav-btn" @click="mesSiguiente" aria-label="Mes siguiente">›</button>
              </div>
              <button type="button" class="cal-hoy-btn" @click="irAHoy">Hoy</button>
            </div>

            <div class="calendario-grid">
              <div class="calendario-encabezado" v-for="dia in nombresDias" :key="dia">{{ dia }}</div>
              <div
                v-for="(celda, indice) in celdasDelMes"
                :key="indice"
                class="calendario-celda"
                :class="{
                  'sin-mes': !celda,
                  'con-ordenes': celda && celda.ordenes.length,
                  'es-hoy': celda && celda.fecha === fechaHoyIso,
                  seleccionada: celda && celda.fecha === diaSeleccionado
                }"
                @click="celda && celda.ordenes.length && seleccionarDia(celda.fecha)"
              >
                <template v-if="celda">
                  <span class="calendario-numero">{{ celda.numero }}</span>
                  <span v-if="celda.ordenes.length" class="calendario-resumen">
                    <span class="calendario-badge">{{ celda.ordenes.length }}</span>
                    <span class="calendario-monto">{{ formatearPrecioCorto(celda.total) }}</span>
                  </span>
                </template>
              </div>
            </div>

            <div class="cal-leyenda">
              <span><i class="cal-dot es-hoy"></i> Hoy</span>
              <span><i class="cal-dot con-ordenes"></i> Con órdenes</span>
            </div>
          </div>

          <div class="cal-detalle" v-if="diaSeleccionado">
            <div class="cal-detalle-header">
              <h4>Órdenes del {{ diaSeleccionadoLegible }}</h4>
              <button type="button" class="cal-cerrar-btn" @click="diaSeleccionado = null">✕</button>
            </div>
            <div class="cal-detalle-item" v-for="orden in ordenesDelDiaSeleccionado" :key="orden.id">
              <div class="cal-detalle-cliente">
                <strong>{{ orden.cliente }}</strong>
                <span class="estado-badge" :style="estiloEstado(orden.estado)">{{ orden.estado }}</span>
              </div>
              <div class="cal-detalle-total">{{ formatearPrecio(orden.total) }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import AdminTopbar from '../../components/AdminTopbar.vue';
import AdminSidebar from '../../components/AdminSidebar.vue';
import api from '../../Api/api.js';
import { formatearPrecio } from '../../catalog.js';

const COLORES_ESTADO = {
  pendiente: { background: '#fff3da', color: '#b3791a' },
  en_proceso: { background: '#e7f0ff', color: '#2451e0' },
  enviado: { background: '#f2e9ff', color: '#7638c9' },
  completado: { background: '#e6f8ec', color: '#1f8a44' },
  cancelado: { background: '#fde8e8', color: '#d3423e' }
};

function aFechaIso(fecha) {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default {
  name: 'AdminCalendarioView',
  components: { AdminTopbar, AdminSidebar },
  data() {
    const hoy = new Date();
    return {
      ordenes: [],
      cargando: false,
      error: '',
      anioMostrado: hoy.getFullYear(),
      mesMostrado: hoy.getMonth(), // 0-11
      diaSeleccionado: null,
      fechaHoyIso: aFechaIso(hoy),
      nombresDias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    };
  },
  computed: {
    etiquetaMes() {
      const nombre = new Date(this.anioMostrado, this.mesMostrado, 1).toLocaleDateString('es-UY', { month: 'long', year: 'numeric' });
      return nombre.charAt(0).toUpperCase() + nombre.slice(1);
    },
    ordenesPorFecha() {
      const mapa = {};
      this.ordenes.forEach(orden => {
        if (!orden.fecha) return;
        (mapa[orden.fecha] = mapa[orden.fecha] || []).push(orden);
      });
      return mapa;
    },
    celdasDelMes() {
      const primerDia = new Date(this.anioMostrado, this.mesMostrado, 1);
      const cantidadDias = new Date(this.anioMostrado, this.mesMostrado + 1, 0).getDate();
      // getDay() da 0=domingo..6=sábado; lo convertimos para que la semana arranque en lunes.
      const offset = (primerDia.getDay() + 6) % 7;

      const celdas = Array.from({ length: offset }, () => null);
      for (let dia = 1; dia <= cantidadDias; dia++) {
        const fecha = `${this.anioMostrado}-${String(this.mesMostrado + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        const ordenesDelDia = this.ordenesPorFecha[fecha] || [];
        celdas.push({
          numero: dia,
          fecha,
          ordenes: ordenesDelDia,
          total: ordenesDelDia.reduce((suma, o) => suma + (o.total || 0), 0)
        });
      }
      return celdas;
    },
    diaSeleccionadoLegible() {
      if (!this.diaSeleccionado) return '';
      return new Date(this.diaSeleccionado + 'T00:00:00').toLocaleDateString('es-UY', { day: 'numeric', month: 'long' });
    },
    ordenesDelDiaSeleccionado() {
      return this.ordenesPorFecha[this.diaSeleccionado] || [];
    }
  },
  async mounted() {
    await this.cargarOrdenes();
  },
  methods: {
    formatearPrecio,
    formatearPrecioCorto(valor) {
      if (!valor) return '';
      if (valor >= 1000) return `${Math.round(valor / 1000)}k`;
      return String(Math.round(valor));
    },
    estiloEstado(estado) {
      return COLORES_ESTADO[estado] || COLORES_ESTADO.pendiente;
    },
    async cargarOrdenes() {
      this.cargando = true;
      this.error = '';
      try {
        const response = await api.get('/ordenes');
        this.ordenes = response.data || [];
      } catch (requestError) {
        console.error('Error al cargar el calendario:', requestError);
        this.error = 'No se pudo cargar el calendario de órdenes.';
      } finally {
        this.cargando = false;
      }
    },
    seleccionarDia(fecha) {
      this.diaSeleccionado = this.diaSeleccionado === fecha ? null : fecha;
    },
    irAHoy() {
      const hoy = new Date();
      this.anioMostrado = hoy.getFullYear();
      this.mesMostrado = hoy.getMonth();
      this.diaSeleccionado = null;
    },
    mesAnterior() {
      this.diaSeleccionado = null;
      if (this.mesMostrado === 0) { this.mesMostrado = 11; this.anioMostrado--; }
      else this.mesMostrado--;
    },
    mesSiguiente() {
      this.diaSeleccionado = null;
      if (this.mesMostrado === 11) { this.mesMostrado = 0; this.anioMostrado++; }
      else this.mesMostrado++;
    }
  }
};
</script>
