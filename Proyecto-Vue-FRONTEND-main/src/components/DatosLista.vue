<template>
  <div class="datos-section">
    <p v-if="store.cargando" class="loading">Cargando datos...</p>
    <p v-if="store.error" class="error">Error al cargar los datos: {{ store.error }}</p>
    <ul v-if="!store.cargando && store.datos.length > 0" class="datos-list">
      <li v-for="item in store.datos" :key="item.id" class="datos-item">
        {{ item.nombre }}
      </li>
    </ul>
    <p v-else-if="!store.cargando && store.datos.length === 0" class="empty">No hay datos disponibles</p>
  </div>
</template>

<script setup>
import { useMisStores } from '../stores/Mistores.js';
import { onMounted } from 'vue';

const store = useMisStores();

// Cargar datos cuando el componente se monta
onMounted(() => {
  store.obtenerDatos();
});
</script>

<style scoped>
.datos-section {
  padding: 20px;
  margin: 20px 0;
}

.datos-list {
  list-style: none;
  padding: 0;
}

.datos-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.loading {
  color: #007bff;
  font-weight: bold;
}

.error {
  color: red;
  font-weight: bold;
}

.empty {
  color: gray;
  font-style: italic;
}
</style>
