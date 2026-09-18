<template>
  <div class="view">
    <admin-topbar></admin-topbar>
    <div class="admin-shell">
      <admin-sidebar active="analiticas"></admin-sidebar>
      <div class="admin-main">
        <div class="admin-page-header">
          <h1>Analíticas</h1>
          <p>Resumen general de tu tienda.</p>
        </div>

        <div class="stat-cards">
          <div class="stat-card">
            <div class="top">
              <div class="ic" style="background:#e7f0ff; color:#2451e0;">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><text x="12" y="17" text-anchor="middle" font-size="15" font-weight="800" fill="currentColor">$</text></svg>
              </div>
              <!-- Estos indicadores muestran el resumen calculado por el backend. -->
              <div><div class="label">Ventas totales</div><div class="value">{{ formatearPrecio(resumen.ventas_totales) }}</div></div>
            </div>
            <div class="delta"><span>Periodo: {{ periodo }}</span></div>
          </div>
          <div class="stat-card">
            <div class="top">
              <div class="ic" style="background:#e6f8ec; color:#1f8a44;">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
              </div>
              <div><div class="label">Órdenes</div><div class="value">{{ resumen.ordenes }}</div></div>
            </div>
            <div class="delta"><span>Ventas registradas</span></div>
          </div>
          <div class="stat-card">
            <div class="top">
              <div class="ic" style="background:#fff3da; color:#b3791a;">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 21c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7"/></svg>
              </div>
              <div><div class="label">Clientes nuevos</div><div class="value">{{ resumen.clientes_nuevos }}</div></div>
            </div>
            <div class="delta"><span>Altas del periodo</span></div>
          </div>
          <div class="stat-card">
            <div class="top">
              <div class="ic" style="background:#f2e9ff; color:#7638c9;">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="3.5" y="12" width="4" height="8" rx="1"/><rect x="10" y="7" width="4" height="13" rx="1"/><rect x="16.5" y="3" width="4" height="17" rx="1"/></svg>
              </div>
              <div><div class="label">Ticket promedio</div><div class="value">{{ formatearPrecio(resumen.ticket_promedio) }}</div></div>
            </div>
            <div class="delta"><span>Por orden</span></div>
          </div>
        </div>

        <div class="analytics-grid">
          <div class="panel">
            <h4>Ventas y Órdenes</h4>
            <p v-if="cargando" class="producto-vacio">Cargando analíticas…</p>
            <p v-else-if="error" class="producto-error">{{ error }}</p>
            <p v-else-if="!datosDiarios.some(dia => dia.ventas || dia.ordenes)" class="producto-vacio">No hay ventas registradas para graficar.</p>
            <!-- El gráfico solo se renderiza después de cargar los datos de la API. -->
            <div v-else style="position: relative; height: 250px; width: 100%;">
              <BarChart :data="datosGrafico" :options="opcionesGrafico" />
            </div>
          </div>
          <div class="panel">
            <h4>Ventas por categoría</h4>
            <div class="donut-row">
              <div class="donut" :style="{background: donutGradiente}">
                <div class="donut-hole"></div>
              </div>
              <div class="legend">
                <div class="legend-item" v-for="categoriaItem in ventasCategoria" :key="categoriaItem.etiqueta">
                  <span><span class="dot" :style="{background:categoriaItem.color}"></span>{{categoriaItem.etiqueta}}</span><b>{{categoriaItem.porcentaje}}%</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lower-grid">
          <div class="panel">
            <h4>Productos más vendidos</h4>
            <table class="mini-table">
              <thead>
                <tr><th>Producto</th><th>Unidades</th><th>Ventas</th></tr>
              </thead>
              <tbody>
                <tr v-for="producto in productosMasVendidos" :key="producto.nombre"><td>{{producto.nombre}}</td><td>{{producto.unidades}}</td><td>{{formatearPrecio(producto.ventas)}}</td></tr>
                <tr v-if="!productosMasVendidos.length"><td colspan="3" class="producto-vacio">No hay ventas de productos registradas.</td></tr>
              </tbody>
            </table>
            <router-link class="link-more" :to="{name:'admin-productos'}">Ver todos los productos ›</router-link>
          </div>
          <div class="panel">
            <h4>Resumen</h4>
            <!-- Si la API falla, se informa el problema sin ocultar toda la pantalla. -->
            <div v-if="error" class="producto-error">{{ error }}</div>
            <div class="resumen-row">
              <span class="resumen-icon"><svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/></svg></span>
              <span class="resumen-label">Visitantes</span>
              <span class="d up">1.245 ↑16.2%</span>
            </div>
            <div class="resumen-row">
              <span class="resumen-icon"><svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12l5 5L20 6"/></svg></span>
              <span class="resumen-label">Tasa de conversión</span>
              <span class="d up">2.4% ↑8.7%</span>
            </div>
            <div class="resumen-row">
              <span class="resumen-icon"><svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L21 7H6"/></svg></span>
              <span class="resumen-label">Carritos abandonados</span>
              <span class="d down">7 ↓5.3%</span>
            </div>
            <a class="link-more" @click="avisoDemo('Reporte completo (demo)')">Ver reporte completo ›</a>
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

// vue-chartjs dibuja el gráfico combinado de ventas y órdenes.
import { Bar } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  LineController,
  LineElement,
  PointElement,
  CategoryScale, 
  LinearScale 
} from 'chart.js';

// Se registran los controladores de línea y barras antes de crear el gráfico.
ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  LineController,
  LineElement, 
  PointElement, 
  CategoryScale, 
  LinearScale
);

export default {
  name: 'AdminAnaliticasView',
  // Registramos el componente de Chart.js con un alias
  components: { AdminTopbar, AdminSidebar, BarChart: Bar }, 
  data() {
    return {
      cargando: false,
      error: '',
      resumen: { ventas_totales: 0, ordenes: 0, clientes_nuevos: 0, ticket_promedio: 0 },
      periodo: 'últimos 30 días',
      datosDiarios: [],
      categorias: [],
      productos: [],
      // Las series empiezan vacías y se completan con la respuesta del backend.
      datosGrafico: {
        labels: [],
        datasets: [
          {
            type: 'line',
            label: 'Ventas ($)',
            data: [],
            borderColor: '#14208c',
            backgroundColor: '#14208c',
            borderWidth: 2,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            type: 'bar',
            label: 'Órdenes',
            data: [],
            backgroundColor: 'rgba(36, 81, 224, 0.2)',
            borderColor: '#2451e0',
            borderWidth: 1,
            yAxisID: 'y1'
          }
        ]
      },
      // El gráfico usa un eje para dinero y otro para cantidad de órdenes.
      opcionesGrafico: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Ventas en $' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { display: true, text: 'Nº Órdenes' },
            grid: {
              drawOnChartArea: false // Evita que las líneas de fondo se crucen
            }
          }
        }
      }
    };
  },
  computed: {
    ventasCategoria() {
      const colores = ['#14208c', '#2e9e4f', '#f0b429', '#8b5cf6', '#9aa3b2'];
      return this.categorias.map((categoria, indice) => ({ ...categoria, color: colores[indice % colores.length] }));
    },
    donutGradiente() {
      let acumulado = 0;
      const tramos = this.ventasCategoria.map(c => {
        const desde = acumulado;
        acumulado += c.porcentaje;
        return `${c.color} ${desde}% ${acumulado}%`;
      });
      return `conic-gradient(${tramos.join(', ')})`;
    },
    productosMasVendidos() {
      return this.productos;
    }
  },
  async mounted() {
    await this.cargarAnaliticas();
  },
  methods: {
    formatearPrecio(valor) {
      return new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU', maximumFractionDigits: 0 }).format(Number(valor) || 0);
    },
    async cargarAnaliticas() {
      // Carga todas las métricas en una sola petición para mantener la vista sincronizada.
      this.cargando = true;
      this.error = '';
      try {
        const response = await api.get('/analiticas');
        const datos = response.data;
        this.resumen = datos.resumen;
        this.datosDiarios = datos.grafico || [];
        this.categorias = datos.categorias || [];
        this.productos = datos.productos || [];
        // Convertimos la respuesta en las etiquetas y series que espera Chart.js.
        this.datosGrafico = {
          ...this.datosGrafico,
          labels: this.datosDiarios.map(dia => dia.etiqueta),
          datasets: [
            { ...this.datosGrafico.datasets[0], data: this.datosDiarios.map(dia => dia.ventas) },
            { ...this.datosGrafico.datasets[1], data: this.datosDiarios.map(dia => dia.ordenes) }
          ]
        };
        this.periodo = `${datos.periodo.inicio} a ${datos.periodo.fin}`;
      } catch (requestError) {
        console.error('Error al cargar analíticas:', requestError);
        if (requestError.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          this.error = 'Tu sesión expiró. Iniciá sesión nuevamente para ver las analíticas.';
          return;
        }
        this.error = requestError.response?.data?.message || 'No se pudieron cargar las analíticas.';
      } finally {
        this.cargando = false;
      }
    },
    avisoDemo(msg) { alert(msg); }
  }
};
</script>
