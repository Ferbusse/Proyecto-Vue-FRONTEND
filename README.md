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

##
## Build para producción

```bash
npm run build
```

Genera la carpeta `dist/` lista para subir a cualquier hosting estático.
