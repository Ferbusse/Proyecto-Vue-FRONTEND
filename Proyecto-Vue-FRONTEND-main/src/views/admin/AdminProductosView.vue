<template>
  <div class="view">
    <admin-topbar></admin-topbar>
    <div class="admin-shell">
      <admin-sidebar active="productos"></admin-sidebar>
      <div class="admin-main">
        <div class="admin-table-wrap">
          <div class="admin-table-tools">
            <div class="icons">
              <button @click="avisoDemo('Eliminar seleccionados')">🗑</button>
              <button @click="avisoDemo('Duplicar')">📄</button>
              
              <button @click="mostrarFormulario=true">＋</button>

            </div>

            <!-- AÑADIDO: formulario real con los campos requeridos por Laravel. -->
            <div v-if="mostrarFormulario" class="producto-form">
              <h3>Agregar producto</h3>
              <div class="producto-form-grid">
                <input v-model="nuevoProducto.nombre" placeholder="Nombre" type="text" required />
                <!-- AÑADIDO: selector de categorías cargadas desde la base de datos. -->
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
                <button @click="guardarProductos" :disabled="cargando">{{ cargando ? 'Guardando...' : 'Agregar' }}</button>
                <button type="button" @click="mostrarFormulario=false">Cancelar</button>
              </div>
            </div>

            <div class="select-all">Seleccionar todos <input type="checkbox"></div>
          </div>

          <div class="admin-header-row">
            <div class="administrar-h">Producto</div>
            <div class="col">Valor total (UYU)</div><div class="col">Categoría</div><div class="col">Stock</div><div class="col">ID</div>
          </div>
          <div class="admin-row" v-for="producto in productos" :key="producto.id">
            <a class="administrar" @click="avisoDemo('Editar producto (demo)')">Administrar</a>
            <div class="col">{{ producto.nombre }}<br>{{ producto.precio_venta }}$ UYU</div>
            <div class="col">{{ producto.categorias?.[0]?.nombre || 'Sin categoría' }}</div>
            <div class="col">{{ producto.stock }}</div>
            <div class="col">{{ producto.id }}</div>
            <div class="thumb img-placeholder"></div>
            <input class="chk" type="checkbox">
          </div>
          <!-- AÑADIDO: estados visibles de carga, error y lista vacía. -->
          <div v-if="!cargando && !productos.length && !error" class="producto-vacio">No hay productos registrados.</div>
          <div v-if="error" class="producto-error">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/Api/api';
import AdminTopbar from '../../components/AdminTopbar.vue';
import AdminSidebar from '../../components/AdminSidebar.vue';

const productos = ref([]);
// AÑADIDO: categorías disponibles para el selector.
const categorias = ref([]);
const mostrarFormulario = ref(false);
const cargando = ref(false);
// AÑADIDO: mensaje del backend para mostrar el error real.
const error = ref('');
// AÑADIDO: estructura compatible con la tabla productos y su categoría.
const nuevoProducto = ref({
  nombre: '',
  descripcion: '',
  precio_compra: null,
  precio_venta: null,
  stock: 0,
  codigo_barras: '',
  categoria_id: null
});

const cargarProductos = async () => {
  // AÑADIDO: carga los productos persistidos en la base de datos.
  error.value = '';
  try {
    const response = await api.get('/productos');
    productos.value = response.data;
  } catch (requestError) {
    console.error('Error al cargar productos:', requestError);
    error.value = 'No se pudieron cargar los productos.';
  }
};

const cargarCategorias = async () => {
  // AÑADIDO: carga las categorías persistidas para poder seleccionarlas.
  try {
    const response = await api.get('/categorias');
    categorias.value = response.data;
  } catch (requestError) {
    console.error('Error al cargar categorías:', requestError);
    error.value = 'No se pudieron cargar las categorías.';
  }
};

const guardarProductos = async ()=>{
  // AÑADIDO: envía el producto y su categoria_id al backend.
  cargando.value = true;
  error.value = '';
  try {
     await api.post('/productos', nuevoProducto.value);
    mostrarFormulario.value = false;
    nuevoProducto.value = { nombre: '', descripcion: '', precio_compra: null, precio_venta: null, stock: 0, codigo_barras: '', categoria_id: null };
     await cargarProductos();
  } catch (requestError) {
    console.error('Error al guardar:', requestError);
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

