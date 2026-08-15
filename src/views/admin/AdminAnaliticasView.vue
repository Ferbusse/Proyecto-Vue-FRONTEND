<template>
  <admin-topbar></admin-topbar>
  <div class="admin-shell">
    <admin-sidebar active="analiticas"></admin-sidebar>
    <div class="admin-main">
      <h2 style="color:#222; margin:0 0 2px;">Analíticas</h2>
      <p style="color:#888; margin:0 0 18px; font-size:14px;">Resumen general de tu tienda</p>

      <div class="stat-cards">
        <div class="stat-card"><div class="top"><div class="ic" style="background:#e7f0ff;">💲</div><div><div class="label">Ventas totales</div><div class="value">$118.910</div></div></div><div class="delta">↑ 18.6% vs. 24 Jun - 30 Jun</div></div>
        <div class="stat-card"><div class="top"><div class="ic" style="background:#e6f8ec;">🛍</div><div><div class="label">Ordenes</div><div class="value">24</div></div></div><div class="delta">↑ 14.3% vs. 24 Jun - 30 Jun</div></div>
        <div class="stat-card"><div class="top"><div class="ic" style="background:#fff3da;">👤</div><div><div class="label">Clientes nuevos</div><div class="value">12</div></div></div><div class="delta">↑ 9.1% vs. 24 Jun - 30 Jun</div></div>
        <div class="stat-card"><div class="top"><div class="ic" style="background:#f2e9ff;">📊</div><div><div class="label">Ticket promedio</div><div class="value">$4.955</div></div></div><div class="delta">↑ 12.7% vs. 24 Jun - 30 Jun</div></div>
      </div>

      <div class="analytics-grid">
        <div class="panel">
          <h4>Ventas</h4>
          <svg viewBox="0 0 560 220" width="100%" height="220">
            <polyline fill="rgba(20,32,140,0.12)" stroke="none" points="10,170 90,140 170,155 250,95 330,175 410,110 490,70 550,190 550,210 10,210"></polyline>
            <polyline fill="none" stroke="#14208c" stroke-width="3" points="10,170 90,140 170,155 250,95 330,175 410,110 490,70 550,190"></polyline>
            <circle v-for="punto in puntosVentas" :key="punto.x" :cx="punto.x" :cy="punto.y" r="4" fill="#14208c"></circle>
          </svg>
          <div style="display:flex; justify-content:space-between; font-size:11px; color:#888;">
            <span v-for="dia in ['1 Jul','2 Jul','3 Jul','4 Jul','5 Jul','6 Jul','7 Jul','8 Jul']" :key="dia">{{dia}}</span>
          </div>
        </div>
        <div class="panel">
          <h4>Ventas por categoría</h4>
          <div style="display:flex; align-items:center; gap:20px;">
            <div style="width:120px;height:120px;border-radius:50%;background:conic-gradient(#14208c 0% 35%, #2e9e4f 35% 60%, #f0b429 60% 80%, #8b5cf6 80% 90%, #ccc 90% 100%); position:relative; flex-shrink:0;">
              <div style="position:absolute; inset:26px; background:#fff; border-radius:50%;"></div>
            </div>
            <div style="flex:1;">
              <div class="legend-item" v-for="categoriaItem in ventasCategoria" :key="categoriaItem.etiqueta"><span><span class="dot" :style="{background:categoriaItem.color}"></span>{{categoriaItem.etiqueta}}</span><b>{{categoriaItem.porcentaje}}%</b></div>
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
          <router-link class="link-more" :to="{name:'admin-productos'}">Ver todos los productos</router-link>
        </div>
        <div class="panel">
          <h4>Resumen</h4>
          <div class="resumen-row"><span>👥 Visitantes</span><span class="d up">1.245 ↑16.2%</span></div>
          <div class="resumen-row"><span>✔ Tasa de conversión</span><span class="d up">2.4% ↑8.7%</span></div>
          <div class="resumen-row"><span>🛒 Carritos abandonados</span><span class="d down">7 ↓-5.3%</span></div>
          <a class="link-more" @click="avisoDemo('Reporte completo (demo)')">Ver reporte completo</a>
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
