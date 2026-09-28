# Integración: productos más vendidos (home)

El frontend ya está listo. Falta que el backend exponga **un endpoint**.
Hasta que exista, la sección "Más vendidos" de la home no se muestra (no hay datos falsos).

## Contrato

```
GET /api/mas-vendidos            público, sin autenticación
GET /api/mas-vendidos?limite=6   opcional
```

Respuesta: un **array JSON de productos con el mismo formato que `GET /api/productos`**
(`id`, `nombre`, `precio_venta`, `imagen_url`, `categorias`, ...), ordenado del más
vendido al menos vendido. Sin productos archivados (`archivado = true`).

- Si no hay ventas todavía, devolver `[]` (la sección queda oculta).
- Si el backend usa otra ruta, se cambia en un solo lugar: `src/Api/masVendidos.js` (`RUTA_MAS_VENDIDOS`).
- No hace falta tocar ningún componente Vue.

## Ejemplo de referencia (Laravel)

Registrar la ruta **fuera** del grupo `ghost.auth`, en `routes/api.php`:

```php
Route::get('/mas-vendidos', [ProductoController::class, 'masVendidos']);
```

Y en `ProductoController`:

```php
public function masVendidos(Request $request)
{
    $limite = max(1, min(12, (int) $request->query('limite', 6)));

    // Unidades vendidas por producto (se ignoran las órdenes canceladas).
    $ids = Detalle_Ventas::query()
        ->join('ventas', 'ventas.id', '=', 'detalle__ventas.venta_id')
        ->join('productos', 'productos.id', '=', 'detalle__ventas.producto_id')
        ->where('ventas.estado', '!=', 'cancelado')
        ->where('productos.archivado', false)
        ->groupBy('detalle__ventas.producto_id')
        ->orderByDesc(DB::raw('SUM(detalle__ventas.cantidad)'))
        ->limit($limite)
        ->pluck('detalle__ventas.producto_id')
        ->all();

    $productos = Producto::with('categorias')->whereIn('id', $ids)->get()
        ->sortBy(fn ($p) => array_search($p->id, $ids))
        ->values();

    return response()->json($productos);
}
```

(Necesita `use App\Models\Detalle_Ventas;` y `use Illuminate\Support\Facades\DB;`.)
