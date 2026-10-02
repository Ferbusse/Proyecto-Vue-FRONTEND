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
    mostrarAvisoGlobal: false,     // aviso de "pago realizado con éxito"
    datosEnvio: null               // datos que el cliente completó en el checkout
  }),

  getters: {
    // una línea por producto en el carrito, con el producto completo + cantidad
    // (el producto sale del store de productos, así el carrito siempre
    // muestra los datos reales, sin importar de dónde vino cada uno).
    // Si un id guardado ya no existe en el catálogo (producto borrado,
    // por ejemplo), se filtra en vez de mostrar una línea rota.
    lineas(state) {
      const productos = useProductosStore();
      return Object.keys(state.items)
        .map(id => ({
          id,
          product: productos.obtenerProducto(id),
          qty: state.items[id]
        }))
        .filter(linea => !!linea.product);
    },
    cantidad(state) {
      // Mientras los productos no cargaron no sabemos cuáles siguen
      // existiendo, así que contamos todo lo guardado.
      if (!useProductosStore().lista.length) {
        return Object.values(state.items).reduce((suma, qty) => suma + qty, 0);
      }
      return this.lineas.reduce((suma, linea) => suma + linea.qty, 0);
    },
    total(state) {
      const productos = useProductosStore();
      return Object.keys(state.items).reduce((suma, id) => {
        const producto = productos.obtenerProducto(id);
        return producto ? suma + state.items[id] * producto.price : suma;
      }, 0);
    },
    totalFormateado() {
      return formatearPrecio(this.total);
    }
  },

  actions: {
    persistir() {
      localStorage.setItem('carrito_items', JSON.stringify(this.items));
    },
    // Devuelve true si lo agregó, false si no pudo (no existe o no hay más stock).
    agregar(id) {
      const producto = useProductosStore().obtenerProducto(id);
      if (!producto) return false;

      const stock = Number(producto.stock);
      const cantidadActual = this.items[id] || 0;

      if (Number.isFinite(stock) && (stock <= 0 || cantidadActual >= stock)) return false;

      this.items[id] = cantidadActual + 1;
      this.persistir();
      return true;
    },
    cambiarCantidad(id, delta) {
      if (!this.items[id]) return;

      const producto = useProductosStore().obtenerProducto(id);
      if (!producto) return;

      const stock = Number(producto.stock);
      if (delta > 0 && Number.isFinite(stock) && this.items[id] >= stock) return;

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

    // Foto del pedido tal como está justo ahora (productos, total, datos
    // de envío y método de pago). Hay que llamarla ANTES de que el pago
    // vacíe el carrito, para poder registrar el pedido en la cuenta.
    armarPedido() {
      const envio = this.datosEnvio || {};
      return {
        items: this.lineas.map(linea => ({
          producto_id: linea.product.id,
          nombre: linea.product.name,
          cantidad: linea.qty,
          precio: linea.product.price
        })),
        total: this.total,
        metodo_pago: this.metodoPagoSeleccionado,
        nombre: `${envio.nombre || ''} ${envio.apellido || ''}`.trim(),
        documento: envio.documento || '',
        telefono: envio.telefono || '',
        email: envio.email || '',
        direccion: envio.direccion || ''
      };
    },

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
