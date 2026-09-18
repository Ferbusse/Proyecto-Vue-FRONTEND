import { defineStore } from 'pinia';

function leerFavoritosGuardados() {
  try {
    const guardados = JSON.parse(localStorage.getItem('mis_favoritos') || '[]');
    return Array.isArray(guardados) ? guardados.map(String) : [];
  } catch {
    return [];
  }
}

export const useFavoritosStore = defineStore('favoritos', {
  state: () => ({
    ids: leerFavoritosGuardados()
  }),

  getters: {
    esFavorito: (state) => (id) => state.ids.includes(String(id)),
    cantidad: (state) => state.ids.length
  },

  actions: {
    guardar() {
      localStorage.setItem('mis_favoritos', JSON.stringify(this.ids));
    },
    alternar(id) {
      const idProducto = String(id);
      const posicion = this.ids.indexOf(idProducto);
      if (posicion === -1) this.ids.push(idProducto);
      else this.ids.splice(posicion, 1);
      this.guardar();
    },
    quitar(id) {
      this.ids = this.ids.filter(idGuardado => idGuardado !== String(id));
      this.guardar();
    }
  }
});
