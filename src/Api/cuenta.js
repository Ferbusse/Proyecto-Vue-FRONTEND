// Servicio de "Mi cuenta": direcciones, pedidos y datos del usuario.
//
// Cada función intenta primero el backend. Si el endpoint todavía no
// existe (404/405/501) o el servidor no responde, direcciones y pedidos
// siguen funcionando guardándose en este navegador (localStorage,
// separado por usuario), y la función avisa con `local: true` para que
// la pantalla lo pueda mostrar. En cuanto el backend implemente los
// endpoints, se usan solos, sin cambiar nada acá ni en las pantallas.
//
// Los datos del perfil y la contraseña NO tienen modo local: tienen que
// guardarse de verdad en el servidor, así que si falta el endpoint se
// devuelve un error claro.
//
// Endpoints esperados:
//   GET/POST /direcciones · PUT/DELETE /direcciones/{id}
//   GET /mis-pedidos · POST /pedidos
//   PUT /user · PUT /user/password
import api from './api.js';
import { esSesionDemo } from './demoAuth.js';
import { parsearFecha } from '../utils/fechas.js';

const SIN_ENDPOINT = [404, 405, 501];

// true si el error significa "el backend todavía no tiene esto"
// (no existe la ruta, o no hay servidor al que llegar).
function backendNoDisponible(error) {
  return !error.response || SIN_ENDPOINT.includes(error.response.status);
}

export function obtenerUsuarioGuardado() {
  try {
    return JSON.parse(localStorage.getItem('auth_user') || 'null');
  } catch {
    return null;
  }
}

export function haySesion() {
  return !!localStorage.getItem('auth_token');
}

// -- almacenamiento local (por usuario) --
function claveLocal(nombre) {
  const usuario = obtenerUsuarioGuardado() || {};
  return `cuenta:${usuario.email || usuario.id || 'anonimo'}:${nombre}`;
}
function leerLocal(nombre) {
  try {
    const lista = JSON.parse(localStorage.getItem(claveLocal(nombre)) || '[]');
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}
function escribirLocal(nombre, lista) {
  try {
    localStorage.setItem(claveLocal(nombre), JSON.stringify(lista));
  } catch (error) {
    console.error('No se pudo guardar en el navegador:', error);
  }
}
function nuevoIdLocal() {
  return 'L' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Ejecuta la llamada al backend; si no está disponible, usa la versión local.
async function conRespaldo(llamarBackend, usarLocal) {
  if (esSesionDemo()) return { datos: usarLocal(), local: true };
  try {
    return { datos: await llamarBackend(), local: false };
  } catch (error) {
    if (!backendNoDisponible(error)) throw error;
    return { datos: usarLocal(), local: true };
  }
}

// Mensaje legible a partir de un error de axios (incluye errores de validación de Laravel).
export function mensajeDeError(error, porDefecto) {
  const datos = error.response?.data;
  const primerError = datos?.errors && Object.values(datos.errors)[0]?.[0];
  return primerError || datos?.message || porDefecto;
}

// ====================== DIRECCIONES ======================
// Forma: { id, etiqueta, direccion, ciudad, departamento, telefono, principal }
function normalizarDireccion(d) {
  return {
    id: d.id,
    etiqueta: d.etiqueta || d.alias || d.nombre || '',
    direccion: d.direccion || d.calle || '',
    ciudad: d.ciudad || '',
    departamento: d.departamento || '',
    telefono: d.telefono || '',
    principal: !!d.principal
  };
}

export async function listarDirecciones() {
  return conRespaldo(
    async () => (await api.get('/direcciones')).data.map(normalizarDireccion),
    () => leerLocal('direcciones')
  );
}

// Crea (sin id) o edita (con id) una dirección.
export async function guardarDireccion(datos) {
  const cuerpo = {
    etiqueta: datos.etiqueta,
    direccion: datos.direccion,
    ciudad: datos.ciudad,
    departamento: datos.departamento,
    telefono: datos.telefono,
    principal: !!datos.principal
  };
  return conRespaldo(
    async () => {
      const respuesta = datos.id
        ? await api.put(`/direcciones/${datos.id}`, cuerpo)
        : await api.post('/direcciones', cuerpo);
      return normalizarDireccion(respuesta.data?.data || respuesta.data);
    },
    () => {
      let lista = leerLocal('direcciones');
      const nueva = { ...cuerpo, id: datos.id || nuevoIdLocal() };
      // la primera dirección guardada es la principal; y solo una puede serlo
      if (!lista.length) nueva.principal = true;
      if (nueva.principal) lista = lista.map(d => ({ ...d, principal: false }));
      lista = datos.id ? lista.map(d => (d.id === datos.id ? nueva : d)) : [...lista, nueva];
      escribirLocal('direcciones', lista);
      return nueva;
    }
  );
}

export async function borrarDireccion(id) {
  return conRespaldo(
    async () => { await api.delete(`/direcciones/${id}`); return true; },
    () => {
      let lista = leerLocal('direcciones').filter(d => d.id !== id);
      // si se borró la principal, la primera que quede pasa a serlo
      if (lista.length && !lista.some(d => d.principal)) lista[0] = { ...lista[0], principal: true };
      escribirLocal('direcciones', lista);
      return true;
    }
  );
}

// ====================== PEDIDOS ======================
// Forma: { id, fecha, estado, total, metodo_pago, direccion, items: [{ nombre, cantidad, precio }] }
function normalizarPedido(p) {
  const items = p.items || p.detalles || p.productos || [];
  return {
    id: p.id,
    fecha: p.fecha || p.created_at || null,
    estado: p.estado || 'pendiente',
    total: Number(p.total ?? p.monto_total ?? 0),
    metodo_pago: p.metodo_pago || p.metodo || '',
    direccion: p.direccion || p.direccion_envio || '',
    items: items.map(i => ({
      nombre: i.nombre || i.producto?.nombre || 'Producto',
      cantidad: Number(i.cantidad || i.qty || 1),
      precio: Number(i.precio ?? i.precio_unitario ?? i.producto?.precio_venta ?? 0)
    }))
  };
}

export async function listarPedidos() {
  const { datos, local } = await conRespaldo(
    async () => (await api.get('/mis-pedidos')).data.map(normalizarPedido),
    () => leerLocal('pedidos').map(normalizarPedido)
  );
  // más nuevos primero
  return { datos: [...datos].sort((a, b) => (parsearFecha(b.fecha)?.getTime() ?? 0) - (parsearFecha(a.fecha)?.getTime() ?? 0)), local };
}

// Registra un pedido al terminar el pago. `pedido` sale de
// carrito.armarPedido(). Se usa "sin esperar": si falla, no debe romper
// el final de la compra.
export async function crearPedido(pedido) {
  if (!haySesion()) return null; // las compras como invitado no quedan en una cuenta
  const cuerpo = {
    items: pedido.items.map(i => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
    metodo_pago: pedido.metodo_pago,
    direccion_envio: pedido.direccion,
    telefono: pedido.telefono,
    nombre: pedido.nombre,
    email: pedido.email,
    documento: pedido.documento
  };
  return conRespaldo(
    async () => normalizarPedido((await api.post('/pedidos', cuerpo)).data?.data || {}),
    () => {
      const local = {
        id: nuevoIdLocal(),
        fecha: new Date().toISOString(),
        estado: 'pendiente',
        total: pedido.total,
        metodo_pago: pedido.metodo_pago,
        direccion: pedido.direccion,
        items: pedido.items.map(i => ({ nombre: i.nombre, cantidad: i.cantidad, precio: i.precio }))
      };
      escribirLocal('pedidos', [...leerLocal('pedidos'), local]);
      return local;
    }
  );
}

// ====================== DATOS DE LA CUENTA ======================
function sinEditarError() {
  const error = new Error('El servidor todavía no permite editar los datos de la cuenta.');
  return error;
}

// Guarda nombre, correo y teléfono. Devuelve el usuario actualizado.
export async function actualizarPerfil(datos) {
  try {
    const respuesta = await api.put('/user', { name: datos.name, email: datos.email, telefono: datos.telefono });
    const usuario = respuesta.data?.data || respuesta.data?.user || respuesta.data;
    // actualizamos la copia local de la sesión para que el resto de la tienda vea el cambio
    const guardado = obtenerUsuarioGuardado() || {};
    localStorage.setItem('auth_user', JSON.stringify({ ...guardado, name: usuario.name ?? datos.name, email: usuario.email ?? datos.email, telefono: usuario.telefono ?? datos.telefono }));
    return usuario;
  } catch (error) {
    if (error.response && SIN_ENDPOINT.includes(error.response.status)) throw sinEditarError();
    if (!error.response) throw new Error('No se pudo conectar con el servidor.');
    throw new Error(mensajeDeError(error, 'No se pudieron guardar los cambios.'));
  }
}

export async function cambiarClave({ actual, nueva, confirmacion }) {
  try {
    await api.put('/user/password', {
      current_password: actual,
      password: nueva,
      password_confirmation: confirmacion
    });
  } catch (error) {
    if (error.response && SIN_ENDPOINT.includes(error.response.status)) throw sinEditarError();
    if (!error.response) throw new Error('No se pudo conectar con el servidor.');
    throw new Error(mensajeDeError(error, 'No se pudo cambiar la contraseña.'));
  }
}
