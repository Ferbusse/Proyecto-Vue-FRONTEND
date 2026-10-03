// Aplica la misma acción (borrar, archivar...) a varios ids en paralelo
// y espera a que terminen todas, aunque alguna falle: así las que
// salieron bien quedan aplicadas y la tabla se puede recargar igual.
//
// Devuelve los ids que fallaron (vacío si salió todo bien).
export async function aplicarEnLote(ids, accion) {
  const resultados = await Promise.allSettled(ids.map(id => accion(id)));
  const fallidos = [];
  resultados.forEach((resultado, i) => {
    if (resultado.status === 'rejected') {
      console.error(`Falló la acción para el id ${ids[i]}:`, resultado.reason);
      fallidos.push(ids[i]);
    }
  });
  return fallidos;
}
