import { createRouter, createWebHistory } from 'vue-router';
import { esSesionAdmin } from './Api/demoAuth.js';

import InicioView from './views/InicioView.vue';
import CategoriaView from './views/CategoriaView.vue';
import ProductoView from './views/ProductoView.vue';
import CheckoutView from './views/CheckoutView.vue';
import LoginView from './views/LoginView.vue';
import RegistroView from './views/RegistroView.vue';
import VerificarCodigoView from './views/VerificarCodigoView.vue';
import PerfilView from './views/PerfilView.vue';
import PedidosView from './views/cuenta/PedidosView.vue';
import DireccionesView from './views/cuenta/DireccionesView.vue';
import DetallesCuentaView from './views/cuenta/DetallesCuentaView.vue';
import WishlistView from './views/cuenta/WishlistView.vue';
import AdminPanelView from './views/admin/AdminPanelView.vue';
import AdminProductosView from './views/admin/AdminProductosView.vue';
import AdminProductosArchivadosView from './views/admin/AdminProductosArchivadosView.vue';
import AdminEmpleadosView from './views/admin/AdminEmpleadosView.vue';
import AdminOrdenesView from './views/admin/AdminOrdenesView.vue';
import AdminAnaliticasView from './views/admin/AdminAnaliticasView.vue';
import AdminCalendarioView from './views/admin/AdminCalendarioView.vue';
import AdminEnviosView from './views/admin/AdminEnviosView.vue';
import AdminBannersView from './views/admin/AdminBannersView.vue';
import AdminBannersArchivadosView from './views/admin/AdminBannersArchivadosView.vue';

const router = createRouter({
  history: createWebHistory(),
  // vuelve siempre arriba de la página al cambiar de ruta
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    { path: '/', name: 'inicio', component: InicioView },
    { path: '/categoria', name: 'categoria', component: CategoriaView },
    { path: '/producto/:id', name: 'producto', component: ProductoView, props: true },
    { path: '/checkout', name: 'checkout', component: CheckoutView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/registro', name: 'registro', component: RegistroView },
    { path: '/registro/verificar-codigo', name: 'registro-verificar', component: VerificarCodigoView },
    { path: '/perfil', name: 'perfil', component: PerfilView },
    { path: '/perfil/pedidos', name: 'cuenta-pedidos', component: PedidosView },
    { path: '/perfil/direcciones', name: 'cuenta-direcciones', component: DireccionesView },
    { path: '/perfil/detalles', name: 'cuenta-detalles', component: DetallesCuentaView },
    { path: '/perfil/wishlist', name: 'cuenta-wishlist', component: WishlistView },
    { path: '/admin', name: 'admin-panel', component: AdminPanelView },
    { path: '/admin/productos', name: 'admin-productos', component: AdminProductosView },
    { path: '/admin/productos/archivados', name: 'admin-productos-archivados', component: AdminProductosArchivadosView },
    { path: '/admin/empleados', name: 'admin-empleados', component: AdminEmpleadosView },
    { path: '/admin/ordenes', name: 'admin-ordenes', component: AdminOrdenesView },
    { path: '/admin/analiticas', name: 'admin-analiticas', component: AdminAnaliticasView },
    { path: '/admin/calendario', name: 'admin-calendario', component: AdminCalendarioView },
    { path: '/admin/envios', name: 'admin-envios', component: AdminEnviosView },
    { path: '/admin/banners', name: 'admin-banners', component: AdminBannersView },
    { path: '/admin/banners/archivados', name: 'admin-banners-archivados', component: AdminBannersArchivadosView }
  ]
});

// Todas las pantallas de "Mi cuenta" (/perfil y sus subpáginas) necesitan
// haber iniciado sesión. Lo chequeamos acá, una sola vez, en vez de
// repetir la lógica en cada vista.
router.beforeEach((to) => {
  const requiereSesion = to.path === '/perfil' || to.path.startsWith('/perfil/');
  const requiereAdmin = to.path === '/admin' || to.path.startsWith('/admin/');

  if (requiereSesion && !localStorage.getItem('auth_token')) {
    return { name: 'login' };
  }

  if (requiereAdmin && !esSesionAdmin()) {
    return { name: 'login' };
  }
});

export default router;
