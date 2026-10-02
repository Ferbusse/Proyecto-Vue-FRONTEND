<template>
  <div
    class="col-ordenable"
    :class="{ activa: activa }"
    role="columnheader"
    tabindex="0"
    :aria-sort="ariaSort"
    @click="$emit('ordenar', clave)"
    @keydown.enter.prevent="$emit('ordenar', clave)"
    @keydown.space.prevent="$emit('ordenar', clave)"
  >
    <slot></slot><span class="orden-indicador" aria-hidden="true">{{ indicador }}</span>
  </div>
</template>

<script>
// Encabezado de columna clickeable para las tablas del admin.
// Uso: <col-ordenable class="col" clave="nombre" :orden="orden" @ordenar="ordenarPor">Nombre</col-ordenable>
// La clase "col" (o "administrar-h") la pasa quien lo usa, para
// conservar el ancho que ya tenía cada columna.
export default {
  name: 'ColOrdenable',
  props: {
    clave: { type: String, required: true },
    orden: { type: Object, required: true }
  },
  emits: ['ordenar'],
  computed: {
    activa() {
      return this.orden.clave === this.clave;
    },
    indicador() {
      if (!this.activa) return '↕';
      return this.orden.direccion === 'asc' ? '▲' : '▼';
    },
    ariaSort() {
      if (!this.activa) return 'none';
      return this.orden.direccion === 'asc' ? 'ascending' : 'descending';
    }
  }
};
</script>
