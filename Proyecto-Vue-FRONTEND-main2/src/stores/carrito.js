import { defineStore } from 'pinia';
import { obtenerProducto, formatearPrecio } from '../catalog.js';

// Store de Pinia: todo lo relacionado al carrito y al flujo de pago
// (antes vivía como estado global manual en App.vue, compartido con
// provide()/inject()). Ahora cualquier componente lo usa así:
//
//   import { useCarritoStore } from '../stores/carrito';
//   const carrito = useCarritoStore();
//
// A propósito el store NO importa el router: si lo hiciera, se forma
// una dependencia circular (router → vistas → componentes → store →
// router de nuevo), que en Vite puede romper la app justo al navegar.
// Por eso las acciones de pago devuelven un resultado, y quien las
// llama (el componente) es el que decide navegar con $router.
export const useCarritoStore = defineStore('carrito', {
  state: () => ({
    items: {},                    // { idProducto: cantidad }
    abierto: false,               // panel deslizante del carrito
    modalPago: false,
    modalTarjeta: false,
    metodoPagoSeleccionado: null,
    mostrarAvisoGlobal: false      // aviso de "pago realizado con éxito"
  }),

  getters: {
    // una línea por producto en el carrito, con el producto completo + cantidad
    lineas(state) {
      return Object.keys(state.items).map(id => ({
        product: obtenerProducto(id),
        qty: state.items[id]
      }));
    },
    cantidad(state) {
      return Object.values(state.items).reduce((suma, qty) => suma + qty, 0);
    },
    total(state) {
      return Object.keys(state.items).reduce(
        (suma, id) => suma + state.items[id] * obtenerProducto(id).price,
        0
      );
    },
    totalFormateado() {
      return formatearPrecio(this.total);
    }
  },

  actions: {
    agregar(id) {
      this.items[id] = (this.items[id] || 0) + 1;
    },
    cambiarCantidad(id, delta) {
      if (!this.items[id]) return;
      this.items[id] += delta;
      if (this.items[id] <= 0) delete this.items[id];
    },
    quitar(id) {
      delete this.items[id];
    },
    vaciar() {
      this.items = {};
    },
    abrir() { this.abierto = true; },
    cerrar() { this.abierto = false; },

    // -- flujo de pago --
    // Devuelve true si el componente que llamó debe navegar a /checkout.
    pagarDesdeCarrito() {
      if (this.cantidad === 0) { alert('Tu carrito está vacío'); return false; }
      this.abierto = false;
      return true;
    },
    // Abre el modal de método de pago. Devuelve true/false según pudo o no.
    continuarCompra() {
      if (this.cantidad === 0) { alert('Tu carrito está vacío'); return false; }
      this.metodoPagoSeleccionado = null;
      this.modalPago = true;
      return true;
    },
    // Devuelve 'transferencia' si hay que volver al inicio, 'tarjeta' si
    // hay que quedarse (se abrió el modal de tarjeta), o null si faltó
    // elegir método.
    continuarPago() {
      if (!this.metodoPagoSeleccionado) { alert('Por favor seleccione un método de pago'); return null; }
      this.modalPago = false;
      if (this.metodoPagoSeleccionado === 'bank') {
        alert('Te enviamos las instrucciones de transferencia bancaria a tu correo.');
        this.vaciar();
        return 'transferencia';
      }
      this.modalTarjeta = true;
      return 'tarjeta';
    },
    // Recibe un callback que el componente ejecuta para volver al inicio
    // una vez que se terminó de mostrar el aviso de éxito.
    finalizarPago(alTerminar) {
      this.modalTarjeta = false;
      this.vaciar();
      this.mostrarAvisoGlobal = true;
      setTimeout(() => {
        this.mostrarAvisoGlobal = false;
        if (alTerminar) alTerminar();
      }, 1600);
    }
  }
});
