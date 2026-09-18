// GHOST DEMO: estas credenciales se autentican en Laravel y reciben un
// token temporal. El backend no crea registros para este perfil.

export const EMAIL_DEMO = 'demo@zonamovil.com';
export const CLAVE_DEMO = 'demo1234';

export function intentarLoginDemo(email, password) {
  return email === EMAIL_DEMO && password === CLAVE_DEMO;
}

export function esSesionDemo() {
  try {
    return JSON.parse(localStorage.getItem('auth_user') || '{}').ghost === true;
  } catch {
    return false;
  }
}

// A diferencia de esSesionDemo(), esta también es true para un dueño real
// (no fantasma) que inició sesión de verdad. Es la que hay que usar para
// decidir si se puede entrar al panel de administración.
export function esSesionAdmin() {
  try {
    const usuario = JSON.parse(localStorage.getItem('auth_user') || '{}');
    return usuario.ghost === true || usuario.role === 'dueño';
  } catch {
    return false;
  }
}

export function obtenerUsuarioDemo() {
  return { name: 'Usuario Demo', email: EMAIL_DEMO, ghost: true };
}
