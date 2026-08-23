# Zona Móvil — Prototipo Vue

Proyecto Vite + Vue 3 con el prototipo de Zona Móvil, con **Vue Router** (rutas
reales por página) y **Pinia** (estado del carrito y el pago).

## Requisitos
- Node.js 18 o superior (https://nodejs.org)

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí la URL que te muestra la terminal (normalmente http://localhost:5173).

## Rutas

| Ruta                  | Vista                              |
|------------------------|-------------------------------------|
| `/`                    | Inicio                             |
| `/categoria`            | Listado de categoría               |
| `/producto/:id`         | Detalle de producto                |
| `/checkout`             | Finalizar compra                   |
| `/login`                | Iniciar sesión                     |
| `/registro`             | Registrarse                        |
| `/admin`                | Panel principal                    |
| `/admin/productos`      | Productos                          |
| `/admin/empleados`      | Empleados                          |
| `/admin/ordenes`        | Órdenes                            |
| `/admin/analiticas`     | Analíticas                         |

## Estructura

```
zona-movil-vue/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js              # punto de entrada: registra Pinia y el router
    ├── router.js            # todas las rutas de la app
    ├── App.vue              # shell mínimo: <router-view>, carrito y modales
    ├── style.css            # todos los estilos
    ├── catalog.js           # catálogo de productos y helpers (precios en UYU)
    ├── stores/
    │   └── carrito.js        # estado global del carrito y el flujo de pago (Pinia)
    ├── assets/
    │   └── logo.png           # logo real de Zona Móvil
    ├── components/
    │   ├── StoreHeader.vue     # header + mega menú de categorías
    │   ├── AdminTopbar.vue
    │   ├── AdminSidebar.vue
    │   ├── ProductCard.vue
    │   ├── CatCard.vue
    │   ├── BannerSlider.vue
    │   ├── CartDrawer.vue      # panel deslizante del carrito
    │   └── PaymentModals.vue   # modales de método de pago y tarjeta
    └── views/
        ├── InicioView.vue
        ├── CategoriaView.vue
        ├── ProductoView.vue
        ├── CheckoutView.vue
        ├── LoginView.vue
        ├── RegistroView.vue
        └── admin/
            ├── AdminPanelView.vue
            ├── AdminProductosView.vue
            ├── AdminEmpleadosView.vue
            ├── AdminOrdenesView.vue
            └── AdminAnaliticasView.vue
```

## Dónde vive cada cosa ahora

- **Navegación**: antes era `estado.pantalla` a mano; ahora son rutas reales
  (`this.$router.push(...)` o `<router-link>`). El botón "atrás" del navegador
  ya funciona, y cada producto tiene su propia URL (`/producto/p3`).
- **Carrito y pago**: antes vivían en `App.vue` con `provide()`/`inject()`;
  ahora es el store de Pinia `useCarritoStore()` en `src/stores/carrito.js`.
  Cualquier componente lo importa y lo usa directo, sin pasarlo a mano.
- **Favorito / mostrar contraseña / filtros de categoría**: se quedaron como
  estado local de cada vista (no van en Pinia) porque son cosas que solo le
  importan a esa pantalla puntual — es el patrón recomendado: estado
  compartido → Pinia, estado de una sola pantalla → `data()` local.
- **Login / Registro / Perfil**: ya están conectados a un backend real vía
  `src/Api/api.js` (axios), que espera un backend **Laravel** corriendo en
  `http://localhost:8000/api`. El token se guarda en `localStorage` y se
  manda solo en cada pedido. `StoreHeader.vue` chequea al montar si hay un
  usuario logueado (`GET /user`) y muestra su nombre en vez de "Iniciar
  sesión / Registrarse" si lo hay.

## Backend

Este repo asume un backend Laravel corriendo aparte en el puerto 8000, con
al menos estas rutas:

- `POST /api/usuarios/login`
- `POST /api/usuarios/registro`
- `GET /api/user`
- `POST /api/logout`

Si el equipo terminó usando otra cosa (Express, etc.), hay que actualizar
`src/Api/api.js` (la `baseURL`) y los nombres de ruta en `LoginView.vue`,
`RegistroView.vue` y `PerfilView.vue` para que coincidan.

## Build para producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para subir a cualquier hosting estático.
