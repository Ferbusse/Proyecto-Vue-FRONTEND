// Búsqueda de productos por texto, compartida por el buscador del
// encabezado y el catálogo (/categoria?buscar=...).
//
// - No distingue mayúsculas ni tildes ("rapido" encuentra "Rápido").
// - Cada palabra escrita tiene que aparecer en el producto, en cualquier
//   orden ("20w cargador" encuentra "Cargador Rápido 20W").
// - Las palabras se comparan por el comienzo ("carg" encuentra
//   "Cargador"), así una letra suelta no trae medio catálogo.
// - Los resultados vienen ordenados por relevancia: primero lo que
//   coincide en el nombre, después en la categoría y al final en la
//   descripción.

function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function palabras(texto) {
  return normalizar(texto).split(/[^a-z0-9]+/).filter(Boolean);
}

// Puntaje de una palabra buscada dentro de un producto (0 = no aparece).
function puntajeTermino(termino, producto) {
  let mejor = 0;
  for (const p of producto.nombre) {
    if (p === termino) mejor = Math.max(mejor, 10);
    else if (p.startsWith(termino)) mejor = Math.max(mejor, 7);
  }
  // dentro de una palabra del nombre (ej: "fono" en "auriculares-telefono"),
  // solo con 3 letras o más para no traer cualquier cosa
  if (!mejor && termino.length >= 3 && producto.nombreTexto.includes(termino)) mejor = 4;
  if (!mejor && producto.categoria.some(p => p.startsWith(termino))) mejor = 3;
  if (!mejor && termino.length >= 3 && producto.descripcion.some(p => p.startsWith(termino))) mejor = 1;
  return mejor;
}

// Devuelve los productos que coinciden con "texto", del más al menos relevante.
export function buscarProductos(lista, texto) {
  const terminos = palabras(texto);
  if (!terminos.length) return [];
  const consulta = normalizar(texto);

  return lista
    .map(item => {
      const producto = {
        nombre: palabras(item.name),
        nombreTexto: normalizar(item.name),
        categoria: palabras(item.categoriaNombre),
        descripcion: palabras(item.descripcion)
      };
      let puntaje = 0;
      for (const termino of terminos) {
        const p = puntajeTermino(termino, producto);
        if (!p) return null; // falta una de las palabras: no coincide
        puntaje += p;
      }
      // extra si el nombre empieza exactamente con lo que se escribió
      if (producto.nombreTexto.startsWith(consulta)) puntaje += 5;
      return { item, puntaje };
    })
    .filter(Boolean)
    .sort((a, b) => b.puntaje - a.puntaje || String(a.item.name).localeCompare(String(b.item.name), 'es'))
    .map(r => r.item);
}
