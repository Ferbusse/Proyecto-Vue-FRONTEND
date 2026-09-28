import { defineStore } from 'pinia';
import { formatearPrecio } from '../catalog.js';
import { useProductosStore } from './productos.js';

function leerCarritoGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem('carrito_items') || '{}');
    return guardado && typeof guardado === 'object' ? guardado : {};
  } catch {
    return {};
  }
}

// Búsqueda estricta: devuelve el producto solo si existe en el listado.
// (obtenerProducto del store de productos cae al primer producto cuando
// no encuentra el id, lo cual sirve para la ficha de producto pero acá
// mostraría en el carrito un producto que la persona nunca agregó.)
function buscarProducto(productos, id) {
  return productos.lista.find(p => p.id === String(id)) || null;
}

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
    items: leerCarritoGuardado(), // { idProducto: cantidad }
    abierto: false,               // panel deslizante del carrito
    modalPago: false,
    modalTarjeta: false,
    metodoPagoSeleccionado: null,
    mostrarAvisoGlobal: false      // aviso de "pago realizado con éxito"
  }),

  getters: {
    // una línea por producto en el carrito, con el producto completo + cantidad
    // (el producto sale del store de productos, así el carrito siempre
    // muestra los datos reales, sin importar de dónde vino cada uno).
    //
    // Se ignoran los ids guardados que ya no corresponden a un producto
    // que exista (por ejemplo si se regeneró la base, se archivó o borró
    // el producto, o el listado todavía no terminó de cargar). Antes esos
    // ids devolvían "undefined" y rompían toda la pantalla al leer
    // ".price" o ".id".
    lineas(state) {
      const productos = useProductosStore();
      return Object.keys(state.items)
        .map(id => ({ product: buscarProducto(productos, id), qty: state.items[id] }))
        .filter(linea => linea.product);
    },
    cantidad() {
      return this.lineas.reduce((suma, linea) => suma + linea.qty, 0);
    },
    total() {
      return this.lineas.reduce((suma, linea) => suma + linea.qty * linea.product.price, 0);
    },
    totalFormateado() {
      return formatearPrecio(this.total);
    }
  },

  actions: {
    persistir() {
      localStorage.setItem('carrito_items', JSON.stringify(this.items));
    },
    agregar(id) {
      this.items[id] = (this.items[id] || 0) + 1;
      this.persistir();
    },
    cambiarCantidad(id, delta) {
      if (!this.items[id]) return;
      this.items[id] += delta;
      if (this.items[id] <= 0) delete this.items[id];
      this.persistir();
    },
    quitar(id) {
      delete this.items[id];
      this.persistir();
    },
    vaciar() {
      this.items = {};
      this.persistir();
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
