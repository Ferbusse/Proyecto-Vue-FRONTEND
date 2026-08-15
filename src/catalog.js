// Catálogo de productos de ejemplo (precios en pesos uruguayos).
export const CATALOGO = [
  { id: 'p1',  name: 'Funda de Silicona',            price: 390 },
  { id: 'p2',  name: 'Cargador Rápido 20W',          price: 890 },
  { id: 'p3',  name: 'Auriculares Inalámbricos i12', price: 1590 },
  { id: 'p4',  name: 'Cable USB-C 2M',               price: 350 },
  { id: 'p5',  name: 'Protector de Pantalla',        price: 290 },
  { id: 'p6',  name: 'Power Bank 10000mAh',          price: 1990 },
  { id: 'p7',  name: 'Soporte para Auto',            price: 650 },
  { id: 'p8',  name: 'Parlante Bluetooth Mini',      price: 2190 },
  { id: 'p9',  name: 'Mouse Inalámbrico',            price: 790 },
  { id: 'p10', name: 'Teclado Bluetooth',            price: 1450 },
  { id: 'p11', name: 'Smartwatch Deportivo',         price: 3490 },
  { id: 'p12', name: 'Memoria MicroSD 64GB',         price: 690 }
];

// Busca un producto por id; si no existe, devuelve el primero como
// respaldo (para no romper la pantalla de detalle).
export function obtenerProducto(id) {
  return CATALOGO.find(producto => producto.id === id) || CATALOGO[0];
}

// Da formato a un número como precio en pesos uruguayos, ej: 890.00$ UYU
export function formatearPrecio(n) {
  return n.toFixed(2) + '$ UYU';
}

// Divide un arreglo en grupos de "size" elementos.
// Se usa para armar las filas de 3 productos en la home.
export function dividirEnGrupos(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
