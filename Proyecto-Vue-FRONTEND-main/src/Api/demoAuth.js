// Cuenta de prueba para poder entrar al sitio sin tener el backend
// levantado (útil para trabajar en el frontend en paralelo).
//
// Si el email/contraseña coinciden con esto, LoginView NO llama a la
// API real — guarda un usuario "de mentira" directo en localStorage.
// StoreHeader y PerfilView, al chequear la sesión, primero miran si es
// esta sesión demo antes de intentar preguntarle al backend.

export const EMAIL_DEMO = 'demo@zonamovil.com';
export const CLAVE_DEMO = 'demo1234';
const TOKEN_DEMO = 'token-demo-sin-backend';

const USUARIO_DEMO = {
  name: 'Usuario Demo',
  email: EMAIL_DEMO
};

export function intentarLoginDemo(email, password) {
  if (email !== EMAIL_DEMO || password !== CLAVE_DEMO) return false;
  localStorage.setItem('auth_token', TOKEN_DEMO);
  localStorage.setItem('auth_user', JSON.stringify(USUARIO_DEMO));
  return true;
}

export function esSesionDemo() {
  return localStorage.getItem('auth_token') === TOKEN_DEMO;
}

export function obtenerUsuarioDemo() {
  return USUARIO_DEMO;
}
