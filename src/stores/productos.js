import { defineStore } from 'pinia';
import api from '../Api/api.js';
import { CATALOGO } from '../catalog.js';

// Arma la URL completa de la imagen del producto. Probamos varios
// nombres de campo posibles, porque no sabemos con certeza cuál usa
// el backend real:
// - ya como URL completa: imagen_url, foto_url, image_url
// - o como ruta relativa dentro del disco público de Laravel
//   (ej: "productos/foto.jpg"), en cualquiera de estos campos:
//   imagen, foto, image, ruta_imagen
// Si viene una ruta relativa, la completamos contra el mismo host de
// la API (sacándole el "/api" del final) más "/storage/", que es
// donde Laravel sirve los archivos subidos por defecto.
export function obtenerUrlImagen(productoBackend) {
  const urlCompleta = productoBackend.imagen_url || productoBackend.foto_url || productoBackend.image_url;
  if (urlCompleta) return urlCompleta;

  const rutaRelativa = productoBackend.imagen || productoBackend.foto || productoBackend.image || productoBackend.ruta_imagen;
  if (rutaRelativa) {
    // si ya viene con http/https, no hace falta armar nada
    if (/^https?:\/\//i.test(rutaRelativa)) return rutaRelativa;
    const origen = api.defaults.baseURL.replace(/\/api\/?$/, '');
    return `${origen}/storage/${rutaRelativa}`;
  }
  return null;
}

// El backend usa nombres de campo distintos a los que ya usa toda la
// tienda (nombre/precio_venta en vez de name/price). Los normalizamos
// acá, una sola vez, así el resto de los componentes no tiene que
// saber de dónde vino el producto.
function normalizar(productoBackend) {
  // Normalizamos la categoría del backend para que el filtro del catálogo
  // pueda compararla con la categoría seleccionada por el usuario.
  const categorias = Array.isArray(productoBackend.categorias) ? productoBackend.categorias : [];
  const categoriaIds = categorias.map(categoria => String(categoria.id));
  const categoriaId = productoBackend.categoria_id != null ? String(productoBackend.categoria_id) : (categoriaIds[0] ?? null);

  return {
    id: String(productoBackend.id),
    name: productoBackend.nombre,
    price: Number(productoBackend.precio_venta),
    stock: productoBackend.stock,
    categoriaId,
    categoriaIds,
    categoriaNombre: categorias[0]?.nombre || null,
    imagenUrl: obtenerUrlImagen(productoBackend)
    // "icono" queda sin definir a propósito: si el producto no tiene
    // foto propia, el placeholder con ícono genérico se muestra solo
    // (ver ProductCard/CatCard).
  };
}

export const useProductosStore = defineStore('productos', {
  state: () => ({
    lista: [],
    cargando: false,
    cargado: false,
    usandoCatalogoDemo: false
  }),
  getters: {
    obtenerProducto: (state) => (id) => {
      return state.lista.find(p => p.id === String(id)) || state.lista[0];
    }
  },
  actions: {
    // Trae los productos reales del backend. Si todavía no hay
    // ninguno cargado (o el backend no está levantado), usa el
    // catálogo de ejemplo como respaldo para que la tienda no se vea
    // vacía mientras se prueba el frontend.
    async cargar() {
      if (this.cargado || this.cargando) return;
      this.cargando = true;
      try {
        const response = await api.get('/productos');
        const reales = (response.data || []).map(normalizar);
        if (reales.length) {
          this.lista = reales;
          this.usandoCatalogoDemo = false;
        } else {
          this.lista = CATALOGO;
          this.usandoCatalogoDemo = true;
        }
      } catch (error) {
        console.error('No se pudieron cargar los productos del backend, uso el catálogo de ejemplo:', error);
        this.lista = CATALOGO;
        this.usandoCatalogoDemo = true;
      } finally {
        this.cargando = false;
        this.cargado = true;
      }
    }
  }
});
