import { createRouter, createWebHistory } from 'vue-router';

import InicioView from './views/InicioView.vue';
import CategoriaView from './views/CategoriaView.vue';
import ProductoView from './views/ProductoView.vue';
import CheckoutView from './views/CheckoutView.vue';
import LoginView from './views/LoginView.vue';
import RegistroView from './views/RegistroView.vue';
import AdminPanelView from './views/admin/AdminPanelView.vue';
import AdminProductosView from './views/admin/AdminProductosView.vue';
import AdminEmpleadosView from './views/admin/AdminEmpleadosView.vue';
import AdminOrdenesView from './views/admin/AdminOrdenesView.vue';
import AdminAnaliticasView from './views/admin/AdminAnaliticasView.vue';

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
    { path: '/admin', name: 'admin-panel', component: AdminPanelView },
    { path: '/admin/productos', name: 'admin-productos', component: AdminProductosView },
    { path: '/admin/empleados', name: 'admin-empleados', component: AdminEmpleadosView },
    { path: '/admin/ordenes', name: 'admin-ordenes', component: AdminOrdenesView },
    { path: '/admin/analiticas', name: 'admin-analiticas', component: AdminAnaliticasView }
  ]
});

export default router;
