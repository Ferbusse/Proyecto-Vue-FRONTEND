<template>
  <top-bar-admin></top-bar-admin>
  <div class="admin-shell">
    <barra-lateral cual-es="productos"></barra-lateral>
    <div class="admin-main">
      <div class="admin-table-wrap">
        <div class="admin-table-tools">
          <div class="icons">
            <button type="button" @click="mostrarFormulario = !mostrarFormulario">＋</button>
          </div>
          <div class="select-all">Seleccionar todos <input type="checkbox"></div>
        </div>

        <form v-if="mostrarFormulario" class="producto-form" @submit.prevent="guardarProducto">
          <div class="producto-form-grid">
            <input v-model="nuevoProducto.nombre" placeholder="Nombre" type="text" required />
            <select v-model="nuevoProducto.categoria_id" required>
              <option :value="null" disabled>Seleccionar categoría</option>
              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">{{ categoria.nombre }}</option>
            </select>
            <input v-model.number="nuevoProducto.precio_venta" placeholder="Precio de venta" type="number" min="0" step="0.01" required />
            <input v-model.number="nuevoProducto.stock" placeholder="Stock" type="number" min="0" required />
            <input v-model.number="nuevoProducto.precio_compra" placeholder="Precio de compra" type="number" min="0" step="0.01" />
            <input v-model="nuevoProducto.codigo_barras" placeholder="Código de barras" type="text" />
            <textarea v-model="nuevoProducto.descripcion" placeholder="Descripción"></textarea>
          </div>
          <div class="producto-form-actions">
            <button type="submit" :disabled="cargando">{{ cargando ? 'Guardando...' : 'Agregar producto' }}</button>
            <button type="button" @click="mostrarFormulario = false">Cancelar</button>
          </div>
        </form>

        <div class="admin-header-row">
          <div class="administrar-h">Producto</div>
          <div class="col">Precio (UYU)</div><div class="col">Categoría</div><div class="col">Stock</div><div class="col">ID</div>
        </div>
        <div v-if="error" class="producto-error">{{ error }}</div>
        <div v-for="producto in productos" :key="producto.id" class="admin-row">
          <a class="administrar">Administrar</a>
          <div class="col">{{ producto.nombre }}</div>
          <div class="col">{{ producto.precio_venta }}$ UYU</div>
          <div class="col">{{ producto.categorias?.[0]?.nombre || 'Sin categoría' }}</div>
          <div class="col">{{ producto.stock }}</div>
          <div class="col">{{ producto.id }}</div>
          <div class="thumb img-placeholder"></div>
          <input class="chk" type="checkbox">
        </div>
        <div v-if="!cargando && !productos.length && !error" class="producto-vacio">No hay productos registrados.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '@/Api/api';
import TopBarAdmin from '../TopBarAdmin.vue';
import BarraLateral from '../BarraLateral.vue';

const productos = ref([]);
const categorias = ref([]);
const mostrarFormulario = ref(false);
const cargando = ref(false);
const error = ref('');
const nuevoProducto = ref({
  nombre: '',
  descripcion: '',
  precio_compra: null,
  precio_venta: null,
  stock: 0,
  codigo_barras: '',
  categoria_id: null
});

const cargarCategorias = async () => {
  try {
    const response = await api.get('/categorias');
    categorias.value = response.data;
  } catch (requestError) {
    console.error('Error al cargar categorías:', requestError);
    error.value = 'No se pudieron cargar las categorías.';
  }
};

const cargarProductos = async () => {
  error.value = '';
  try {
    const response = await api.get('/productos');
    productos.value = response.data;
  } catch (requestError) {
    console.error('Error al cargar productos:', requestError);
    error.value = 'No se pudieron cargar los productos.';
  }
};

const guardarProducto = async () => {
  cargando.value = true;
  error.value = '';
  try {
    await api.post('/productos', nuevoProducto.value);
    nuevoProducto.value = { nombre: '', descripcion: '', precio_compra: null, precio_venta: null, stock: 0, codigo_barras: '', categoria_id: null };
    mostrarFormulario.value = false;
    await cargarProductos();
  } catch (requestError) {
    console.error('Error al guardar producto:', requestError);
    error.value = requestError.response?.data?.message || 'No se pudo guardar el producto.';
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  cargarProductos();
  cargarCategorias();
});
</script>
