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
              <div><div class="label">Ventas totales</div><div class="value">$118.910</div></div>
            </div>
            <div class="delta up">↑ 18.6% <span>vs. 24 Jun - 30 Jun</span></div>
          </div>
          <div class="stat-card">
            <div class="top">
              <div class="ic" style="background:#e6f8ec; color:#1f8a44;">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
              </div>
              <div><div class="label">Ordenes</div><div class="value">24</div></div>
            </div>
            <div class="delta up">↑ 14.3% <span>vs. 24 Jun - 30 Jun</span></div>
          </div>
          <div class="stat-card">
            <div class="top">
              <div class="ic" style="background:#fff3da; color:#b3791a;">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 21c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7"/></svg>
              </div>
              <div><div class="label">Clientes nuevos</div><div class="value">12</div></div>
            </div>
            <div class="delta up">↑ 9.1% <span>vs. 24 Jun - 30 Jun</span></div>
          </div>
          <div class="stat-card">
            <div class="top">
              <div class="ic" style="background:#f2e9ff; color:#7638c9;">
                <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="3.5" y="12" width="4" height="8" rx="1"/><rect x="10" y="7" width="4" height="13" rx="1"/><rect x="16.5" y="3" width="4" height="17" rx="1"/></svg>
              </div>
              <div><div class="label">Ticket promedio</div><div class="value">$4.955</div></div>
            </div>
            <div class="delta up">↑ 12.7% <span>vs. 24 Jun - 30 Jun</span></div>
          </div>
        </div>

        <div class="analytics-grid">
          <div class="panel">
            <h4>Ventas</h4>
            <svg viewBox="0 0 560 220" width="100%" height="220">
              <polyline fill="rgba(20,32,140,0.12)" stroke="none" points="10,170 90,140 170,155 250,95 330,175 410,110 490,70 550,190 550,210 10,210"></polyline>
              <polyline fill="none" stroke="#14208c" stroke-width="3" points="10,170 90,140 170,155 250,95 330,175 410,110 490,70 550,190"></polyline>
              <circle v-for="punto in puntosVentas" :key="punto.x" :cx="punto.x" :cy="punto.y" r="4" fill="#14208c"></circle>
            </svg>
            <div class="panel-x-axis">
              <span v-for="dia in ['1 Jul','2 Jul','3 Jul','4 Jul','5 Jul','6 Jul','7 Jul','8 Jul']" :key="dia">{{dia}}</span>
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
                <tr v-for="producto in productosMasVendidos" :key="producto.name"><td>{{producto.icono}} {{producto.name}}</td><td>{{producto.unidades}}</td><td>{{producto.ventas}}</td></tr>
              </tbody>
            </table>
            <router-link class="link-more" :to="{name:'admin-productos'}">Ver todos los productos ›</router-link>
          </div>
          <div class="panel">
            <h4>Resumen</h4>
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

export default {
  name: 'AdminAnaliticasView',
  components: { AdminTopbar, AdminSidebar },
  computed: {
    puntosVentas() {
      const xs = [10,90,170,250,330,410,490,550], ys = [170,140,155,95,175,110,70,190];
      return xs.map((x, i) => ({ x, y: ys[i] }));
    },
    ventasCategoria() {
      return [
        {etiqueta:'Accesorios', porcentaje:35, color:'#14208c'},
        {etiqueta:'Cargadores', porcentaje:25, color:'#2e9e4f'},
        {etiqueta:'Auriculares', porcentaje:20, color:'#f0b429'},
        {etiqueta:'Fundas', porcentaje:10, color:'#8b5cf6'},
        {etiqueta:'Otros', porcentaje:10, color:'#ccc'}
      ];
    },
    // arma el conic-gradient de la dona a partir de ventasCategoria,
    // en vez de tenerlo escrito a mano y desincronizado de los datos
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
      return [
        {icono:'🎧', name:'Auriculares Inalámbricos i12', unidades:18, ventas:'$17.980'},
        {icono:'🔌', name:'Cargador Rápido 20W', unidades:15, ventas:'$14.970'},
        {icono:'⚪', name:'Cable USB-C 2M', unidades:12, ventas:'$5.988'}
      ];
    }
  },
  methods: {
    avisoDemo(msg) { alert(msg); }
  }
};
</script>
