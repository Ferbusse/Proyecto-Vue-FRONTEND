import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router.js';
import './style.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);

// Se monta cuando el router ya resolvió la ruta inicial; si no, App.vue
// cree estar en "/" un instante y monta el carrito también en /admin.
router.isReady().then(() => {
  const root = document.querySelector('#app');
  root.replaceChildren();
  app.mount(root);
});
