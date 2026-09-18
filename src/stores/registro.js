import { defineStore } from 'pinia';

// Store de Pinia chiquito que solo existe para pasarle los datos del
// formulario de registro (nombre, email, contraseña) a la pantalla del
// código de verificación, que es una vista aparte con su propia URL.
//
// A propósito NO se guarda en localStorage/sessionStorage: son datos
// sensibles (la contraseña en texto plano) que solo hacen falta
// mientras dura el flujo de registro en esta misma pestaña, así que
// alcanza con tenerlos en memoria. Si el usuario recarga la página o
// entra directo a la URL del código, se pierden a propósito y la
// vista del código lo manda de vuelta a /registro.
export const useRegistroStore = defineStore('registro', {
  state: () => ({
    datosPendientes: null // { name, email, password, password_confirmation } | null
  }),
  actions: {
    guardarDatosPendientes(datos) {
      this.datosPendientes = { ...datos };
    },
    limpiar() {
      this.datosPendientes = null;
    }
  }
});
