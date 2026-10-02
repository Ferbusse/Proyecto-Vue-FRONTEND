// Ordenamiento de tablas del admin.
//
// Cada tabla guarda un estado { clave, direccion }. Al clickear un
// encabezado se avanza: ascendente → descendente → sin orden (vuelve
// al orden original que mandó el backend).
export function alternarOrden(actual, clave) {
  if (actual.clave !== clave) return { clave, direccion: 'asc' };
  if (actual.direccion === 'asc') return { clave, direccion: 'desc' };
  return { clave: null, direccion: 'asc' };
}

const COMPARADOR_TEXTO = new Intl.Collator('es', { sensitivity: 'base', numeric: true });

function estaVacio(valor) {
  return valor === null || valor === undefined || valor === '' || (typeof valor === 'number' && Number.isNaN(valor));
}

// Devuelve una copia ordenada de "lista" (no modifica la original).
// "valores" asocia cada clave de columna con una función que, dado un
// elemento, devuelve el valor a comparar (número, texto o fecha en ms).
// Los valores vacíos van siempre al final, sin importar la dirección.
export function ordenarLista(lista, orden, valores) {
  const obtener = valores[orden.clave];
  if (!orden.clave || !obtener) return lista;

  const factor = orden.direccion === 'desc' ? -1 : 1;
  return [...lista].sort((a, b) => {
    const va = obtener(a);
    const vb = obtener(b);
    const aVacio = estaVacio(va);
    const bVacio = estaVacio(vb);
    if (aVacio && bVacio) return 0;
    if (aVacio) return 1;
    if (bVacio) return -1;

    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * factor;
    return COMPARADOR_TEXTO.compare(String(va), String(vb)) * factor;
  });
}
