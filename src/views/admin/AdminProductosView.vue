<template>
  <div class="view">
    <admin-topbar></admin-topbar>
    <div class="admin-shell">
      <admin-sidebar active="productos"></admin-sidebar>
      <div class="admin-main">
        <div class="admin-table-wrap">
          <div class="admin-table-tools">
            <div class="icons">
              <button
                type="button"
                :disabled="!seleccionados.length"
                :title="seleccionados.length ? 'Eliminar seleccionados' : 'Seleccioná al menos un producto'"
                @click="eliminarSeleccionados"
              >🗑</button>
              <button
                type="button"
                :disabled="!seleccionados.length"
                :title="seleccionados.length ? 'Duplicar seleccionados' : 'Seleccioná al menos un producto'"
                @click="duplicarSeleccionados"
              >📄</button>
              <button type="button" title="Agregar producto" @click="abrirParaCrear">＋</button>
            </div>
            <div class="select-all">
              <label>
                <input type="checkbox" v-model="todosSeleccionados">
                Seleccionar todos
              </label>
              <span v-if="seleccionados.length" class="select-count">({{ seleccionados.length }} seleccionados)</span>
            </div>
          </div>

          <div class="admin-header-row">
            <div class="administrar-h">Producto</div>
            <div class="col">Valor total (UYU)</div><div class="col">Categoría</div><div class="col">Stock</div><div class="col">ID</div>
          </div>

          <p v-if="cargando" class="producto-vacio" aria-live="polite">Cargando productos…</p>

          <div class="admin-row" v-for="producto in productos" :key="producto.id">
            <a class="administrar" @click="abrirParaEditar(producto)">Administrar</a>
            <div class="col">{{ producto.nombre }}<br>{{ formatearPrecio(producto.precio_venta) }}</div>
            <div class="col">{{ obtenerCategoriaNombre(producto) }}</div>
            <div class="col">{{ producto.stock }}</div>
            <div class="col">{{ producto.id }}</div>
            <div class="thumb img-placeholder">
              <img v-if="obtenerUrlImagen(producto)" :src="obtenerUrlImagen(producto)" :alt="producto.nombre">
            </div>
            <input class="chk" type="checkbox" :value="producto.id" v-model="seleccionados" :aria-label="'Seleccionar ' + producto.nombre">
          </div>

          <p v-if="!cargando && !productos.length && !error" class="producto-vacio">No hay productos registrados.</p>
          <p v-if="error" class="producto-error" aria-live="polite">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar producto, con la misma línea visual que
         los modales de pago del carrito. -->
    <div class="modal-overlay" :class="{open: mostrarFormulario}">
      <div class="modal-box">
        <button class="modal-close" type="button" @click="cerrarFormulario">✕</button>
        <h2>{{ editandoId ? 'Editar producto' : 'Agregar producto' }}</h2>
        <form @submit.prevent="guardarProducto">
          <div class="form-row">
            <div class="form-group">
              <label for="prod-nombre">Nombre</label>
              <input id="prod-nombre" v-model="formulario.nombre" type="text" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="prod-imagen">Imagen del producto</label>
              <div class="imagen-picker">
                <div class="imagen-preview">
                  <img v-if="previewImagen" :src="previewImagen" alt="">
                  <span v-else aria-hidden="true">📷</span>
                </div>
                <div class="imagen-picker-controles">
                  <input id="prod-imagen" type="file" accept="image/*" @change="alElegirImagen">
                  <button v-if="previewImagen" type="button" class="imagen-quitar" @click="quitarImagen">Quitar imagen</button>
                  <p class="imagen-nota">JPG o PNG. Si no elegís nada, se muestra un ícono genérico.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="prod-categoria">Categoría</label>
              <div class="categoria-picker">
                <!-- El select lista todas las categorías existentes en la base.
                     Luego se permite crear otra o borrar la elegida. -->
                <select id="prod-categoria" v-model="formulario.categoria_id" required>
                  <option :value="null" disabled>Seleccionar categoría</option>
                  <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">{{ categoria.nombre }}</option>
                </select>
                <button
                  type="button"
                  class="categoria-nueva-btn"
                  title="Agregar categoría nueva"
                  aria-label="Agregar categoría nueva"
                  @click="mostrarNuevaCategoria = !mostrarNuevaCategoria"
                >＋</button>
                <button
                  type="button"
                  class="categoria-borrar-btn"
                  title="Eliminar categoría seleccionada"
                  aria-label="Eliminar categoría seleccionada"
                  :disabled="!formulario.categoria_id"
                  @click="borrarCategoriaSeleccionada"
                >🗑</button>
              </div>

              <!-- Formulario inline para crear una categoría sin salir del modal -->
              <div v-if="mostrarNuevaCategoria" class="categoria-nueva">
                <input
                  v-model="nombreNuevaCategoria"
                  type="text"
                  placeholder="Nombre de la categoría nueva"
                  @keydown.enter.prevent="crearCategoria"
                >
                <button type="button" @click="crearCategoria" :disabled="creandoCategoria">
                  {{ creandoCategoria ? 'Creando...' : 'Agregar' }}
                </button>
                <button type="button" class="categoria-nueva-cancelar" @click="cancelarNuevaCategoria">Cancelar</button>
              </div>
              <p v-if="errorCategoria" class="auth-error">{{ errorCategoria }}</p>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="prod-precio-venta">Precio de venta</label>
              <input id="prod-precio-venta" v-model.number="formulario.precio_venta" type="number" min="0" step="0.01" required>
            </div>
            <div class="form-group">
              <label for="prod-stock">Stock</label>
              <input id="prod-stock" v-model.number="formulario.stock" type="number" min="0" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="prod-precio-compra">Precio de compra</label>
              <input id="prod-precio-compra" v-model.number="formulario.precio_compra" type="number" min="0" step="0.01">
            </div>
            <div class="form-group">
              <label for="prod-codigo">Código de barras</label>
              <input id="prod-codigo" v-model="formulario.codigo_barras" type="text">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="prod-desc">Descripción</label>
              <textarea id="prod-desc" v-model="formulario.descripcion" rows="3"></textarea>
            </div>
          </div>
          <p v-if="errorFormulario" class="auth-error">{{ errorFormulario }}</p>
          <button class="modal-btn" type="submit" :disabled="guardando">
            {{ guardando ? 'Guardando...' : (editandoId ? 'Guardar cambios' : 'Agregar') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import AdminTopbar from '../../components/AdminTopbar.vue';
import AdminSidebar from '../../components/AdminSidebar.vue';
import api from '../../Api/api.js';
import { formatearPrecio } from '../../catalog.js';
import { obtenerUrlImagen } from '../../stores/productos.js';

const PRODUCTO_VACIO = {
  nombre: '',
  descripcion: '',
  precio_compra: null,
  precio_venta: null,
  stock: 0,
  codigo_barras: '',
  categoria_id: null
};

// El backend a veces manda la categoría de un producto de formas
// distintas según el endpoint (categoria_id suelto, categoria: {...},
// o categorias: [...]). Estas dos funciones prueban todas las formas
// posibles, así "editar" no se rompe si cambia el formato.
function obtenerCategoriaIdDe(producto) {
  if (producto.categoria_id != null) return producto.categoria_id;
  if (producto.categoria?.id != null) return producto.categoria.id;
  if (producto.categorias?.[0]?.id != null) return producto.categorias[0].id;
  return null;
}
function obtenerCategoriaNombreDe(producto) {
  return producto.categoria?.nombre || producto.categorias?.[0]?.nombre || null;
}

export default {
  name: 'AdminProductosView',
  components: { AdminTopbar, AdminSidebar },
  data() {
    return {
      productos: [],
      categorias: [],
      seleccionados: [],

      cargando: false,     // carga inicial de la tabla
      error: '',           // error de la tabla (cargar/eliminar/duplicar)

      mostrarFormulario: false,
      editandoId: null,    // null = creando uno nuevo; si no, id del que se edita
      guardando: false,
      errorFormulario: '',
      formulario: { ...PRODUCTO_VACIO },

      // -- imagen del producto --
      archivoImagen: null,     // el File elegido (null = no se tocó)
      previewImagen: null,     // URL para mostrar la vista previa
      sacarImagenExistente: false, // true = el admin quitó la imagen que ya tenía

      // -- categoría nueva, desde el mismo formulario de producto --
      mostrarNuevaCategoria: false,
      nombreNuevaCategoria: '',
      creandoCategoria: false,
      errorCategoria: ''
    };
  },
  computed: {
    todosSeleccionados: {
      get() {
        return this.productos.length > 0 && this.seleccionados.length === this.productos.length;
      },
      set(marcar) {
        this.seleccionados = marcar ? this.productos.map(p => p.id) : [];
      }
    }
  },
  async mounted() {
    this.cargando = true;
    await Promise.all([this.cargarProductos(), this.cargarCategorias()]);
    this.cargando = false;
  },
  methods: {
    formatearPrecio,
    obtenerUrlImagen,
    obtenerCategoriaNombre(producto) {
      return obtenerCategoriaNombreDe(producto) || 'Sin categoría';
    },

    async cargarProductos() {
      this.error = '';
      try {
        const response = await api.get('/productos');
        this.productos = response.data;
        // sacamos de la selección cualquier id que ya no exista
        this.seleccionados = this.seleccionados.filter(id => this.productos.some(p => p.id === id));
      } catch (requestError) {
        console.error('Error al cargar productos:', requestError);
        this.error = 'No se pudieron cargar los productos.';
      }
    },
    async cargarCategorias() {
      try {
        const response = await api.get('/categorias');
        this.categorias = response.data;
      } catch (requestError) {
        console.error('Error al cargar categorías:', requestError);
        this.error = 'No se pudieron cargar las categorías.';
      }
    },

    // -- imagen --
    alElegirImagen(evento) {
      const archivo = evento.target.files?.[0];
      if (!archivo) return;
      this.archivoImagen = archivo;
      this.sacarImagenExistente = false;
      if (this.previewImagen) URL.revokeObjectURL(this.previewImagen);
      this.previewImagen = URL.createObjectURL(archivo);
    },
    quitarImagen() {
      this.archivoImagen = null;
      this.sacarImagenExistente = true;
      if (this.previewImagen) URL.revokeObjectURL(this.previewImagen);
      this.previewImagen = null;
    },
    limpiarImagenDelFormulario() {
      if (this.previewImagen) URL.revokeObjectURL(this.previewImagen);
      this.archivoImagen = null;
      this.previewImagen = null;
      this.sacarImagenExistente = false;
    },

    // -- categoría nueva --
    cancelarNuevaCategoria() {
      this.mostrarNuevaCategoria = false;
      this.nombreNuevaCategoria = '';
      this.errorCategoria = '';
    },
    async crearCategoria() {
      const nombre = this.nombreNuevaCategoria.trim();
      if (!nombre) { this.errorCategoria = 'Escribí un nombre para la categoría.'; return; }

      this.creandoCategoria = true;
      this.errorCategoria = '';
      try {
        const response = await api.post('/categorias', { nombre });
        const nueva = response.data;
        await this.cargarCategorias();
        // Automáticamente selecciona la categoría recién creada para que el
        // producto quede asociado a ella en el mismo momento.
        this.formulario.categoria_id = nueva?.id ?? this.categorias.find(c => c.nombre === nombre)?.id ?? null;
        this.cancelarNuevaCategoria();
      } catch (requestError) {
        console.error('Error al crear categoría:', requestError);
        this.errorCategoria = requestError.response?.data?.message || 'No se pudo crear la categoría.';
      } finally {
        this.creandoCategoria = false;
      }
    },
    async borrarCategoriaSeleccionada() {
      const categoriaId = this.formulario.categoria_id;
      if (!categoriaId) return;

      const categoria = this.categorias.find(c => c.id === categoriaId);
      if (!categoria) return;

      // Pide confirmación antes de borrar porque la categoría puede estar en uso.
      const confirmado = confirm(`¿Seguro que querés borrar la categoría "${categoria.nombre}"?`);
      if (!confirmado) return;

      this.errorCategoria = '';
      try {
        await api.delete(`/categorias/${categoriaId}`);
        this.formulario.categoria_id = null;
        await this.cargarCategorias();
      } catch (requestError) {
        console.error('Error al borrar categoría:', requestError);
        this.errorCategoria = requestError.response?.data?.message || 'No se pudo borrar la categoría.';
      }
    },

    // -- modal: crear / editar producto --
    abrirParaCrear() {
      this.editandoId = null;
      this.errorFormulario = '';
      this.formulario = { ...PRODUCTO_VACIO };
      this.limpiarImagenDelFormulario();
      this.cancelarNuevaCategoria();
      this.mostrarFormulario = true;
    },
    abrirParaEditar(producto) {
      this.editandoId = producto.id;
      this.errorFormulario = '';
      this.formulario = {
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio_compra: producto.precio_compra,
        precio_venta: producto.precio_venta,
        stock: producto.stock,
        codigo_barras: producto.codigo_barras || '',
        categoria_id: obtenerCategoriaIdDe(producto)
      };
      this.limpiarImagenDelFormulario();
      // si el producto ya tiene una foto, la mostramos como vista previa
      this.previewImagen = obtenerUrlImagen(producto);
      this.cancelarNuevaCategoria();
      this.mostrarFormulario = true;
    },
    cerrarFormulario() {
      this.mostrarFormulario = false;
      this.limpiarImagenDelFormulario();
      this.cancelarNuevaCategoria();
    },
    async guardarProducto() {
      this.guardando = true;
      this.errorFormulario = '';
      try {
        // Mandamos todo como multipart/form-data (necesario para poder
        // adjuntar el archivo de imagen). Los campos de texto van igual
        // que antes, solo cambia cómo se empaquetan.
        const datos = new FormData();
        Object.entries(this.formulario).forEach(([campo, valor]) => {
          datos.append(campo, valor ?? '');
        });
        if (this.archivoImagen) {
          datos.append('imagen', this.archivoImagen);
        } else if (this.sacarImagenExistente) {
          datos.append('quitar_imagen', '1');
        }

        // Ojo: PHP no procesa bien los archivos en pedidos PUT/PATCH
        // con multipart, así que para editar mandamos un POST con
        // "_method=PUT" (la forma en que Laravel espera esto), en vez
        // de un verbo PUT de verdad.
        if (this.editandoId) {
          datos.append('_method', 'PUT');
          await api.post(`/productos/${this.editandoId}`, datos, {
            headers: { 'Content-Type': undefined } // dejamos que el navegador arme el boundary del multipart
          });
        } else {
          await api.post('/productos', datos, {
            headers: { 'Content-Type': undefined }
          });
        }
        this.mostrarFormulario = false;
        this.limpiarImagenDelFormulario();
        await this.cargarProductos();
      } catch (requestError) {
        console.error('Error al guardar:', requestError);
        this.errorFormulario = requestError.response?.data?.message || 'No se pudo guardar el producto.';
      } finally {
        this.guardando = false;
      }
    },

    // -- selección: eliminar / duplicar --
    async eliminarSeleccionados() {
      if (!this.seleccionados.length) return;
      const cantidad = this.seleccionados.length;
      const confirmado = confirm(`¿Eliminar ${cantidad} producto${cantidad > 1 ? 's' : ''}? Esta acción no se puede deshacer.`);
      if (!confirmado) return;

      this.error = '';
      try {
        await Promise.all(this.seleccionados.map(id => api.delete(`/productos/${id}`)));
        this.seleccionados = [];
        await this.cargarProductos();
      } catch (requestError) {
        console.error('Error al eliminar:', requestError);
        this.error = 'No se pudieron eliminar algunos productos.';
      }
    },
    async duplicarSeleccionados() {
      if (!this.seleccionados.length) return;

      this.error = '';
      try {
        const original = this.productos.filter(p => this.seleccionados.includes(p.id));
        await Promise.all(original.map(producto => api.post('/productos', {
          nombre: producto.nombre + ' (copia)',
          descripcion: producto.descripcion || '',
          precio_compra: producto.precio_compra,
          precio_venta: producto.precio_venta,
          stock: producto.stock,
          codigo_barras: '',
          categoria_id: obtenerCategoriaIdDe(producto)
          // la copia sale sin imagen — el admin puede subirle una
          // propia después si quiere una distinta a la del original.
        })));
        this.seleccionados = [];
        await this.cargarProductos();
      } catch (requestError) {
        console.error('Error al duplicar:', requestError);
        this.error = 'No se pudieron duplicar algunos productos.';
      }
    }
  }
};
</script>
