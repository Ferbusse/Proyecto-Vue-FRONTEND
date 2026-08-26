import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Categoria from '../screens/Categoria.vue';
import ProductoDetalle from '../pages/ProductoDetalle.vue'
import Pago from '../screens/Pago.vue';
import Login from '../auth/Login.vue'
import Registro from '../auth/Registro.vue'
import Dashboard from '../admin_stuff/paneles/Dashboard.vue'
import Productos from '../admin_stuff/paneles/Productos.vue'
import Empleados from '../admin_stuff/paneles/Empleados.vue'
import Ordenes from '../admin_stuff/paneles/Ordenes.vue'
import Analiticas from '../admin_stuff/paneles/Analiticas.vue'

const elCaminito = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    { path: '/',                 name: 'inicio',          component: Home },
    { path: '/categoria',        name: 'categoria',       component: Categoria },
    { path: '/producto/:id',     name: 'producto',        component: ProductoDetalle, props: true },
    { path: '/checkout',         name: 'checkout',        component: Pago },
    { path: '/login',            name: 'login',           component: Login },
    { path: '/registro',         name: 'registro',        component: Registro },
    { path: '/admin',            name: 'admin-panel',     component: Dashboard },
    { path: '/admin/productos',  name: 'admin-productos', component: Productos },
    { path: '/admin/empleados',  name: 'admin-empleados', component: Empleados },
    { path: '/admin/ordenes',    name: 'admin-ordenes',   component: Ordenes },
    { path: '/admin/analiticas', name: 'admin-analiticas',component: Analiticas }
  ]
})

export default elCaminito
