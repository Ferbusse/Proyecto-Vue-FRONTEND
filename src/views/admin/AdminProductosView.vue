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
                class="admin-btn admin-btn-borrar"
                :disabled="!seleccionados.length"
                :title="seleccionados.length ? 'Eliminar seleccionados' : 'Seleccioná al menos un producto'"
                @click="eliminarSeleccionados"
              ><span aria-hidden="true">🗑</span> Borrar</button>
              <button
                type="button"
                class="admin-btn admin-btn-archivar"
                :disabled="!seleccionados.length"
                :title="seleccionados.length ? 'Archivar seleccionados' : 'Seleccioná al menos un producto'"
                @click="archivarSeleccionados"
              ><span aria-hidden="true">🗄</span> Archivar</button>
              <button type="button" class="admin-btn admin-btn-agregar" title="Agregar producto" @click="abrirParaCrear"><span aria-hidden="true">+</span> Añadir</button>
            </div>
            <div class="select-all">
              <label>
                <input type="checkbox" v-model="todosSeleccionados">
                Seleccionar todos
              </label>
              <span v-if="seleccionados.length" class="select-count">({{ seleccionados.length }} seleccionados)</span>
              <input v-model.trim="busqueda" class="admin-search-input" type="search" placeholder="Buscar producto..." aria-label="Buscar producto">
              <select v-model="filtroCategoria" class="admin-filter-select" aria-label="Filtrar productos por categoría">
                <option value="">Todas las categorías</option>
                <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">{{ categoria.nombre }}</option>
                <option value="sin">Sin categoría</option>
              </select>
              <router-link :to="{name:'admin-productos-archivados'}" class="admin-btn admin-btn-neutro" style="margin-left:14px;"><span aria-hidden="true">🗄</span> Ver archivados</router-link>
            </div>
          </div>

          <div class="admin-table-scroll">
            <div class="admin-header-row">
              <col-ordenable class="administrar-h" clave="nombre" :orden="orden" @ordenar="ordenarPor">Producto</col-ordenable>
              <col-ordenable class="col" clave="precio" :orden="orden" @ordenar="ordenarPor">Valor total (UYU)</col-ordenable>
              <col-ordenable class="col" clave="categoria" :orden="orden" @ordenar="ordenarPor">Categoría</col-ordenable>
              <col-ordenable class="col" clave="stock" :orden="orden" @ordenar="ordenarPor">Stock</col-ordenable>
              <col-ordenable class="col" clave="id" :orden="orden" @ordenar="ordenarPor">ID</col-ordenable>
              <div class="thumb-spacer"></div><div class="chk-spacer"></div>
            </div>

            <p v-if="cargando" class="producto-vacio" aria-live="polite">Cargando productos…</p>

            <div class="admin-row" v-for="producto in productosOrdenados" :key="producto.id">
              <a class="administrar" @click="abrirParaEditar(producto)">Administrar</a>
              <div class="col">{{ producto.nombre }}<br>{{ formatearPrecio(producto.precio_venta) }}</div>
              <div class="col">{{ obtenerCategoriaNombre(producto) }}</div>
              <div class="col">{{ producto.stock }}</div>
              <div class="col">{{ producto.id }}</div>
              <div class="thumb img-placeholder">
                <img v-if="obtenerUrlImagen(producto)" :src="obtenerUrlImagen(producto)" :alt="producto.nombre" @error="$event.target.style.display='none'">
              </div>
              <input class="chk" type="checkbox" :value="producto.id" v-model="seleccionados" :aria-label="'Seleccionar ' + producto.nombre">
            </div>
          </div>

          <p v-if="!cargando && !productosFiltrados.length && !error" class="producto-vacio">No hay productos que coincidan con la búsqueda o el filtro.</p>
          <p v-if="error" class="producto-error" aria-live="polite">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar producto -->
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
                  <img v-if="previewImagen" :src="previewImagen" alt="" @error="$event.target.style.display='none'">
                  <span v-else aria-hidden="true">📷</span>
                </div>
                <div class="imagen-picker-controles">
                  <input id="prod-imagen" type="file" accept="image/*" @change="alElegirImagen">
                  <button v-if="previewImagen" type="button" class="imagen-quitar" @click="quitarImagen">Quitar imagen</button>
                  <p class="imagen-nota">JPG, PNG o WEBP. Se recorta automáticamente a un cuadrado de 800×800px (centrado), igual que se muestra en la tienda.</p>
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
                ><span aria-hidden="true">+</span> Añadir</button>
                <button
                  type="button"
                  class="categoria-borrar-btn"
                  title="Eliminar categoría seleccionada"
                  aria-label="Eliminar categoría seleccionada"
                  :disabled="!formulario.categoria_id"
                  @click="borrarCategoriaSeleccionada"
                ><span aria-hidden="true">🗑</span> Borrar</button>
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
                  {{ creandoCategoria ? 'Creando...' : '+ Añadir' }}
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
import { aplicarEnLote } from '../../utils/lote.js';
import { formatearPrecio } from '../../catalog.js';
import { obtenerUrlImagen } from '../../stores/productos.js';
import ColOrdenable from '../../components/ColOrdenable.vue';
import { alternarOrden, ordenarLista } from '../../utils/ordenamiento.js';

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
// Todos los ids de categoría de un producto (puede tener más de una),
// como texto, para poder compararlos con el valor del filtro.
function obtenerCategoriaIdsDe(producto) {
  const ids = [];
  if (producto.categoria_id != null) ids.push(producto.categoria_id);
  if (producto.categoria?.id != null) ids.push(producto.categoria.id);
  (producto.categorias || []).forEach(categoria => {
    if (categoria?.id != null) ids.push(categoria.id);
  });
  return ids.map(String);
}

// Qué valor se compara al ordenar por cada columna de la tabla.
const VALORES_ORDEN = {
  nombre: producto => producto.nombre,
  precio: producto => Number(producto.precio_venta),
  categoria: producto => obtenerCategoriaNombreDe(producto),
  stock: producto => Number(producto.stock),
  id: producto => Number(producto.id)
};

export default {
  name: 'AdminProductosView',
  components: { AdminTopbar, AdminSidebar, ColOrdenable },
  data() {
    return {
      productos: [],
      busqueda: '',
      filtroCategoria: '',  // '' = todas, 'sin' = sin categoría, o el id de una categoría
      orden: { clave: null, direccion: 'asc' },
      categorias: [],
      seleccionados: [],

      cargando: false,     // carga inicial de la tabla
      error: '',           // error de la tabla (cargar/eliminar/archivar)

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
    productosFiltrados() {
      const texto = this.busqueda.toLowerCase();

      return this.productos.filter(producto => {
        const coincideTexto = !texto || [
          producto.nombre,
          producto.id,
          producto.codigo_barras,
          obtenerCategoriaNombreDe(producto)
        ].join(' ').toLowerCase().includes(texto);

        const idsCategoria = obtenerCategoriaIdsDe(producto);
        const coincideCategoria = this.filtroCategoria === ''
          || (this.filtroCategoria === 'sin' ? idsCategoria.length === 0 : idsCategoria.includes(String(this.filtroCategoria)));

        return coincideTexto && coincideCategoria;
      });
    },
    productosOrdenados() {
      return ordenarLista(this.productosFiltrados, this.orden, VALORES_ORDEN);
    },
    todosSeleccionados: {
      get() {
        return this.productosFiltrados.length > 0 && this.productosFiltrados.every(producto => this.seleccionados.includes(producto.id));
      },
      set(marcar) {
        const idsVisibles = this.productosFiltrados.map(producto => producto.id);
        this.seleccionados = marcar
          ? [...new Set([...this.seleccionados, ...idsVisibles])]
          : this.seleccionados.filter(id => !idsVisibles.includes(id));
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
    ordenarPor(clave) {
      this.orden = alternarOrden(this.orden, clave);
    },
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
        // si la categoría filtrada se borró, volvemos a mostrar todas
        if (this.filtroCategoria !== '' && this.filtroCategoria !== 'sin'
            && !this.categorias.some(c => String(c.id) === String(this.filtroCategoria))) {
          this.filtroCategoria = '';
        }
      } catch (requestError) {
        console.error('Error al cargar categorías:', requestError);
        this.error = 'No se pudieron cargar las categorías.';
      }
    },

    // -- imagen --
    async alElegirImagen(evento) {
      const archivo = evento.target.files?.[0];
      if (!archivo) return;

      try {
        const imagenOptimizada = await this.optimizarImagen(archivo);
        this.archivoImagen = imagenOptimizada;
        this.sacarImagenExistente = false;
        if (this.previewImagen) URL.revokeObjectURL(this.previewImagen);
        this.previewImagen = URL.createObjectURL(imagenOptimizada);
      } catch (error) {
        console.error('No se pudo optimizar la imagen:', error);
        this.archivoImagen = archivo;
        this.sacarImagenExistente = false;
        if (this.previewImagen) URL.revokeObjectURL(this.previewImagen);
        this.previewImagen = URL.createObjectURL(archivo);
      }
    },
    optimizarImagen(archivo) {
      // Todas las fotos de producto se muestran recortadas como
      // cuadrado en todos lados (tarjetas, carrito, ficha de
      // producto: todas usan aspect-ratio 1/1 + object-fit cover), así
      // que el archivo que se guarda queda directamente en ese mismo
      // tamaño fijo, en vez de subir la imagen con su forma original
      // y confiar en que el CSS la recorte al mostrarla.
      const TAMANO = 800; // px de lado, la imagen final siempre es 800×800
      const CALIDAD = 0.85;

      return new Promise((resolve, reject) => {
        const imagen = new Image();
        const url = URL.createObjectURL(archivo);
        imagen.onload = () => {
          URL.revokeObjectURL(url);
          const canvas = document.createElement('canvas');
          canvas.width = TAMANO;
          canvas.height = TAMANO;

          // Recorte tipo "cover": escala la imagen para que cubra todo
          // el cuadrado y centra lo que sobra, en vez de estirarla o
          // dejar bordes vacíos.
          const escala = Math.max(TAMANO / imagen.width, TAMANO / imagen.height);
          const anchoEscalado = imagen.width * escala;
          const altoEscalado = imagen.height * escala;
          const desplazoX = (TAMANO - anchoEscalado) / 2;
          const desplazoY = (TAMANO - altoEscalado) / 2;

          canvas.getContext('2d').drawImage(imagen, desplazoX, desplazoY, anchoEscalado, altoEscalado);
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('El navegador no pudo comprimir la imagen.'));
              return;
            }
            resolve(new File([blob], `${archivo.name.replace(/\.[^.]+$/, '')}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', CALIDAD);
        };
        imagen.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('El archivo no es una imagen válida.'));
        };
        imagen.src = url;
      });
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
        // adjuntar el archivo de imagen).
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
          await api.post(`/productos/${this.editandoId}`, datos);
        } else {
          await api.post('/productos', datos);
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

    // -- selección: eliminar / archivar --
    async eliminarSeleccionados() {
      if (!this.seleccionados.length) return;
      const cantidad = this.seleccionados.length;
      const confirmado = confirm(`¿Eliminar ${cantidad} producto${cantidad > 1 ? 's' : ''}? Esta acción no se puede deshacer.`);
      if (!confirmado) return;

      this.error = '';
      const fallidos = await aplicarEnLote(this.seleccionados, id => api.delete(`/productos/${id}`));
      // los que fallaron quedan seleccionados, para poder reintentar
      this.seleccionados = fallidos;
      await this.cargarProductos();
      if (fallidos.length) this.error = 'No se pudieron eliminar algunos productos.';
    },
    async archivarSeleccionados() {
      if (!this.seleccionados.length) return;

      this.error = '';
      // Un producto archivado deja de aparecer en la tienda y en este
      // listado, pero sigue existiendo (se puede restaurar desde
      // "Productos archivados"). Por eso no se borra, solo se marca.
      const fallidos = await aplicarEnLote(this.seleccionados, id => api.put(`/productos/${id}`, { archivado: true }));
      // los que fallaron quedan seleccionados, para poder reintentar
      this.seleccionados = fallidos;
      await this.cargarProductos();
      if (fallidos.length) this.error = 'No se pudieron archivar algunos productos.';
    }
  }
};
</script>
