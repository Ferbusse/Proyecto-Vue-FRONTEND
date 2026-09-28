// PUNTO DE CONEXIÓN: productos más vendidos (sección de la home).
//
// El frontend ya está listo y espera que el backend exponga:
//
//   GET /api/mas-vendidos            (público, sin autenticación)
//   GET /api/mas-vendidos?limite=6   (opcional: cuántos devolver)
//
// Respuesta esperada: un array JSON de productos con el MISMO formato
// que devuelve GET /api/productos (nombre, precio_venta, imagen_url,
// categorias, etc.), ya ordenados del más vendido al menos vendido y
// sin productos archivados.
//
// Mientras el endpoint no exista (404) o devuelva una lista vacía, la
// sección "Más vendidos" de la home simplemente no se muestra: no se
// inventan datos. Ver INTEGRACION_MAS_VENDIDOS.md para los detalles.
import api from './api.js';
import { normalizar } from '../stores/productos.js';

// Si el backend usa otra ruta, se cambia únicamente acá.
export const RUTA_MAS_VENDIDOS = '/mas-vendidos';

export async function obtenerMasVendidos(limite = 6) {
  try {
    const response = await api.get(RUTA_MAS_VENDIDOS, { params: { limite } });
    const lista = Array.isArray(response.data) ? response.data : [];
    return lista.map(normalizar);
  } catch (error) {
    // 404 = todavía no está implementado en el backend: es esperable.
    if (error.response?.status !== 404) {
      console.warn('No se pudieron cargar los más vendidos:', error);
    }
    return [];
  }
}
