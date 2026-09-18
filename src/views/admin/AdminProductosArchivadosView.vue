<template>
  <div class="view">
    <admin-topbar></admin-topbar>
    <div class="admin-shell">
      <admin-sidebar active="productos"></admin-sidebar>
      <div class="admin-main">
        <div class="admin-page-header">
          <h1>Productos archivados</h1>
          <p>Productos que ya no se muestran en la tienda. Podés restaurarlos o borrarlos definitivamente.</p>
        </div>

        <router-link :to="{name:'admin-productos'}" class="cal-hoy-btn" style="display:inline-block; margin-bottom:16px;">← Volver a Productos</router-link>

        <div class="admin-table-wrap">
          <div class="admin-header-row">
            <div class="administrar-h">Producto</div>
            <div class="col">Precio de venta</div><div class="col">Categoría</div><div class="col">Stock</div><div class="col">ID</div>
          </div>

          <p v-if="cargando" class="producto-vacio" aria-live="polite">Cargando…</p>

          <div class="admin-row" v-for="producto in productos" :key="producto.id">
            <a class="administrar" @click="restaurar(producto)">Restaurar</a>
            <div class="col">{{ producto.nombre }}<br>{{ formatearPrecio(producto.precio_venta) }}</div>
            <div class="col">{{ obtenerCategoriaNombre(producto) }}</div>
            <div class="col">{{ producto.stock }}</div>
            <div class="col">{{ producto.id }}</div>
          </div>

          <p v-if="!cargando && !productos.length && !error" class="producto-vacio">No hay productos archivados por ahora.</p>
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
import { formatearPrecio } from '../../catalog.js';

export default {
  name: 'AdminProductosArchivadosView',
  components: { AdminTopbar, AdminSidebar },
  data() {
    return {
      productos: [],
      cargando: false,
      error: ''
    };
  },
  async mounted() {
    await this.cargarArchivados();
  },
  methods: {
    formatearPrecio,
    obtenerCategoriaNombre(producto) {
      const categoria = producto.categorias && producto.categorias[0];
      return categoria ? categoria.nombre : 'Sin categoría';
    },
    async cargarArchivados() {
      this.cargando = true;
      this.error = '';
      try {
        const response = await api.get('/productos', { params: { archivados: 1 } });
        this.productos = response.data;
      } catch (requestError) {
        console.error('Error al cargar productos archivados:', requestError);
        this.error = 'No se pudieron cargar los productos archivados.';
      } finally {
        this.cargando = false;
      }
    },
    async restaurar(producto) {
      this.error = '';
      try {
        await api.put(`/productos/${producto.id}`, { archivado: false });
        await this.cargarArchivados();
      } catch (requestError) {
        console.error('Error al restaurar el producto:', requestError);
        this.error = 'No se pudo restaurar el producto.';
      }
    }
  }
};
</script>
