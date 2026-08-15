import { defineStore } from 'pinia';
import { obtenerProducto, formatearPrecio } from '../catalog.js';
import router from '../router';

// Store de Pinia: todo lo relacionado al carrito y al flujo de pago
// (antes vivía como estado global manual en App.vue, compartido con
// provide()/inject()). Ahora cualquier componente lo usa así:
//
//   import { useCarritoStore } from '../stores/carrito';
//   const carrito = useCarritoStore();
//
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
    pagarDesdeCarrito() {
      if (this.cantidad === 0) { alert('Tu carrito está vacío'); return; }
      this.abierto = false;
      router.push({ name: 'checkout' });
    },
    continuarCompra() {
      if (this.cantidad === 0) { alert('Tu carrito está vacío'); return; }
      this.metodoPagoSeleccionado = null;
      this.modalPago = true;
    },
    continuarPago() {
      if (!this.metodoPagoSeleccionado) { alert('Por favor seleccione un método de pago'); return; }
      this.modalPago = false;
      if (this.metodoPagoSeleccionado === 'bank') {
        alert('Te enviamos las instrucciones de transferencia bancaria a tu correo.');
        this.vaciar();
        router.push({ name: 'inicio' });
      } else {
        this.modalTarjeta = true;
      }
    },
    finalizarPago() {
      this.modalTarjeta = false;
      this.vaciar();
      this.mostrarAvisoGlobal = true;
      setTimeout(() => {
        this.mostrarAvisoGlobal = false;
        router.push({ name: 'inicio' });
      }, 1600);
    }
  }
});
