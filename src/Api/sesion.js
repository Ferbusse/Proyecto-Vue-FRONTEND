import api from './api.js';
import { esSesionDemo } from './demoAuth.js';

// Cierra la sesión (real o demo) y manda a /login.
// La usan tanto el botón del sidebar de "Mi cuenta" como la tarjeta
// "Salir" del escritorio — así la lógica vive en un solo lugar.
export async function cerrarSesion(router) {
  if (!esSesionDemo()) {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  router.push({ name: 'login' });
}
