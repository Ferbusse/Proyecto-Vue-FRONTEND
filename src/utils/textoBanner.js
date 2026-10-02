// Textos opcionales de los banners (título, subtítulo y texto chico).
//
// El backend exige que "titulo" (y "etiqueta" al editar) lleguen como
// texto no vacío, y Laravel convierte los vacíos en null. Para que el
// admin pueda dejarlos en blanco sin tocar el backend, un campo vacío
// se guarda como un espacio HTML (&nbsp;), que no se ve. Estas
// funciones hacen la conversión en ambos sentidos.
export const TEXTO_VACIO = '&nbsp;';

// Texto listo para mostrar o para cargar en el formulario ('' si está en blanco).
export function limpiarTexto(valor) {
  if (valor === null || valor === undefined) return '';
  const texto = String(valor).trim();
  return texto === TEXTO_VACIO ? '' : texto;
}

// Texto listo para mandar al backend (nunca vacío).
export function textoParaEnviar(valor) {
  return String(valor ?? '').trim() || TEXTO_VACIO;
}
