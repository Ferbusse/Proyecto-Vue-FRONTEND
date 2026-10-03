// El backend manda las fechas de las órdenes sin hora ("2026-10-01").
// new Date("2026-10-01") las toma como medianoche UTC, y en Uruguay
// (UTC-3) eso cae el día anterior a las 21hs. Acá las fechas sin hora
// se leen como fecha local.
export function parsearFecha(valor) {
  if (!valor) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) return new Date(`${valor}T00:00:00`);
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

// Fecha corta para mostrar (ej: 1/10/2026), o "—" si no hay.
export function formatearFecha(valor) {
  const fecha = parsearFecha(valor);
  return fecha ? fecha.toLocaleDateString('es-UY') : '—';
}
