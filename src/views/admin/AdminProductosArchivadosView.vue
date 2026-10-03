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

        <router-link :to="{name:'admin-productos'}" class="admin-btn admin-btn-neutro" style="margin-bottom:16px;">← Volver a Productos</router-link>

        <div class="admin-table-wrap">
          <div class="admin-header-row">
            <div class="administrar-h" aria-hidden="true"></div>
            <col-ordenable class="col" clave="nombre" :orden="orden" @ordenar="ordenarPor">Producto</col-ordenable>
            <col-ordenable class="col" clave="precio" :orden="orden" @ordenar="ordenarPor">Precio (UYU)</col-ordenable>
            <col-ordenable class="col" clave="categoria" :orden="orden" @ordenar="ordenarPor">Categoría</col-ordenable>
            <col-ordenable class="col" clave="stock" :orden="orden" @ordenar="ordenarPor">Stock</col-ordenable>
            <col-ordenable class="col" clave="id" :orden="orden" @ordenar="ordenarPor">ID</col-ordenable>
          </div>

          <p v-if="cargando" class="producto-vacio" aria-live="polite">Cargando…</p>

          <div class="admin-row" v-for="producto in productosOrdenados" :key="producto.id">
            <div class="administrar"><button type="button" class="admin-btn admin-btn-restaurar" @click="restaurar(producto)"><span aria-hidden="true">↺</span> Restaurar</button></div>
            <div class="col">{{ producto.nombre }}</div>
            <div class="col">{{ formatearPrecio(producto.precio_venta) }}</div>
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
import ColOrdenable from '../../components/ColOrdenable.vue';
import { alternarOrden, ordenarLista } from '../../utils/ordenamiento.js';

// Qué valor se compara al ordenar por cada columna de la tabla.
const VALORES_ORDEN = {
  nombre: producto => producto.nombre,
  precio: producto => Number(producto.precio_venta),
  categoria: producto => producto.categorias?.[0]?.nombre || null,
  stock: producto => Number(producto.stock),
  id: producto => Number(producto.id)
};

export default {
  name: 'AdminProductosArchivadosView',
  components: { AdminTopbar, AdminSidebar, ColOrdenable },
  data() {
    return {
      productos: [],
      orden: { clave: null, direccion: 'asc' },
      cargando: false,
      error: ''
    };
  },
  computed: {
    productosOrdenados() {
      return ordenarLista(this.productos, this.orden, VALORES_ORDEN);
    }
  },
  async mounted() {
    await this.cargarArchivados();
  },
  methods: {
    formatearPrecio,
    ordenarPor(clave) {
      this.orden = alternarOrden(this.orden, clave);
    },
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
