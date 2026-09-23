import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router.js';
import './style.css';

const app = createApp(App);
app.use(createPinia());
app.use(router);

const root = document.querySelector('#app');
root.replaceChildren();
app.mount(root);
