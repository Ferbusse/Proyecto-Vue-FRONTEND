// Aplica la misma acción (borrar, archivar...) a varios ids en paralelo
// y espera a que terminen TODAS, aunque alguna falle. Con Promise.all,
// si fallaba una se cortaba todo: las demás sí se habían aplicado en el
// servidor, pero la tabla no se recargaba y quedaba mostrando datos viejos.
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
