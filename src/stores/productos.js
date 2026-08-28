import { defineStore } from 'pinia';
import api from '../Api/api.js';
import { CATALOGO } from '../catalog.js';

// Arma la URL completa de la imagen del producto. El backend puede
// mandarla de dos formas: ya como URL completa ("imagen_url"), o
// como una ruta relativa dentro del disco público de Laravel
// ("imagen": "productos/foto.jpg") — en ese caso la armamos contra
// el mismo host de la API (sacándole el "/api" del final).
export function obtenerUrlImagen(productoBackend) {
  if (productoBackend.imagen_url) return productoBackend.imagen_url;
  if (productoBackend.imagen) {
    const origen = api.defaults.baseURL.replace(/\/api\/?$/, '');
    return `${origen}/storage/${productoBackend.imagen}`;
  }
  return null;
}

// El backend usa nombres de campo distintos a los que ya usa toda la
// tienda (nombre/precio_venta en vez de name/price). Los normalizamos
// acá, una sola vez, así el resto de los componentes no tiene que
// saber de dónde vino el producto.
function normalizar(productoBackend) {
  return {
    id: String(productoBackend.id),
    name: productoBackend.nombre,
    price: Number(productoBackend.precio_venta),
    stock: productoBackend.stock,
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
