<template>
  <div class="view">
    <admin-topbar></admin-topbar>
    <div class="admin-shell">
      <admin-sidebar active="finanzas"></admin-sidebar>
      <div class="admin-main">
        <div class="admin-page-header">
          <h1>Finanzas</h1>
          <p>Ingresos, costo de mercadería vendida y margen, últimos 30 días con ventas.</p>
        </div>

        <div class="stat-cards">
          <div class="stat-card">
            <div class="top">
              <div class="ic" style="background:#e6f8ec; color:#1f8a44;">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19V9M12 19V5M20 19v-7"/></svg>
              </div>
              <div><div class="label">Ingresos</div><div class="value">{{ formatearPrecio(resumen.ingresos) }}</div></div>
            </div>
            <div class="delta" v-if="periodo"><span>Periodo: {{ periodo }}</span></div>
          </div>
          <div class="stat-card">
            <div class="top">
              <div class="ic" style="background:#fdeceb; color:#c0392b;">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
              </div>
              <div><div class="label">Costo de mercadería</div><div class="value">{{ formatearPrecio(resumen.costos) }}</div></div>
            </div>
            <div class="delta"><span>Según precio de compra</span></div>
          </div>
          <div class="stat-card">
            <div class="top">
              <div class="ic" style="background:#e7f0ff; color:#2451e0;">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="3.5" y="12" width="4" height="8" rx="1"/><rect x="10" y="7" width="4" height="13" rx="1"/><rect x="16.5" y="3" width="4" height="17" rx="1"/></svg>
              </div>
              <div><div class="label">Margen bruto</div><div class="value">{{ formatearPrecio(resumen.margen) }}</div></div>
            </div>
            <div class="delta" :class="resumen.margen >= 0 ? 'up' : 'down'"><span>{{ resumen.margen_pct }}% sobre ingresos</span></div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-card-header">
            <h3>Margen por día</h3>
            <span class="chart-card-sub">Últimos 14 días · verde ganancia, rojo pérdida</span>
          </div>
          <p v-if="cargando" class="producto-vacio">Cargando…</p>
          <p v-else-if="error" class="producto-error">{{ error }}</p>
          <p v-else-if="!grafico.length" class="producto-vacio">Todavía no hay ventas para calcular el margen.</p>
          <div v-else class="bar-chart bar-chart-compacto">
            <div class="bar-col" v-for="dia in barrasMargen" :key="dia.etiqueta">
              <div class="bar" :style="{height: dia.altura + '%', background: dia.margen >= 0 ? 'linear-gradient(180deg, #3bc06a 0%, #1f8a44 100%)' : 'linear-gradient(180deg, #ef6f65 0%, #c0392b 100%)'}" :title="formatearPrecio(dia.margen)"></div>
              <div class="bar-label">{{ dia.etiqueta }}</div>
            </div>
          </div>
        </div>

        <div class="admin-table-wrap" v-if="categorias.length">
          <div class="admin-table-tools"><div class="select-all"><span class="select-count">Margen por categoría</span></div></div>
          <div class="admin-header-row">
            <div class="administrar-h">Categoría</div>
            <div class="col">Ingresos</div><div class="col">Margen</div>
          </div>
          <div class="admin-row" v-for="categoria in categorias" :key="categoria.etiqueta">
            <div class="administrar">{{ categoria.etiqueta }}</div>
            <div class="col">{{ formatearPrecio(categoria.ingresos) }}</div>
            <div class="col">{{ formatearPrecio(categoria.margen) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminTopbar from '../../components/AdminTopbar.vue';
import AdminSidebar from '../../components/AdminSidebar.vue';
import api from '../../Api/api.js';
import { formatearPrecio } from '../../catalog.js';

export default {
  name: 'AdminFinanzasView',
  components: { AdminTopbar, AdminSidebar },
  data() {
    return {
      cargando: true,
      error: '',
      periodo: '',
      resumen: { ingresos: 0, costos: 0, margen: 0, margen_pct: 0 },
      grafico: [],
      categorias: []
    };
  },
  computed: {
    barrasMargen() {
      // El resumen de arriba cubre los 30 días completos, pero mostrar 30
      // barras angostas en este gráfico simple se vuelve ilegible. Acá
      // recortamos a los últimos 14 días para que se pueda leer bien.
      const ultimos = this.grafico.slice(-14);
      const maximo = Math.max(1, ...ultimos.map(dia => Math.abs(dia.margen || 0)));
      return ultimos.map(dia => ({
        etiqueta: dia.etiqueta,
        margen: dia.margen || 0,
        altura: Math.max(4, Math.round((Math.abs(dia.margen || 0) / maximo) * 100))
      }));
    }
  },
  async mounted() {
    try {
      const response = await api.get('/analiticas/finanzas');
      this.resumen = response.data.resumen;
      this.grafico = response.data.grafico || [];
      this.categorias = response.data.categorias || [];
      this.periodo = `${response.data.periodo.inicio} a ${response.data.periodo.fin}`;
    } catch (requestError) {
      console.error('Error al cargar finanzas:', requestError);
      this.error = 'No se pudo cargar el resumen financiero.';
    } finally {
      this.cargando = false;
    }
  },
  methods: {
    formatearPrecio
  }
};
</script>
