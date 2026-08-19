import { defineStore } from 'pinia'
import apiClient from '@/Api/api.js'

export const useMisStores = defineStore('misStores', {
    state: () => ({ 
        datos: [],
        cargando: false,
        error: null
    }),

    actions: {
        //Ejemplo de petición GET a la API para obtener datos
        async obtenerDatos() {
            this.cargando = true
            this.error = null
            try {
                const response = await apiClient.get('/test')
                this.datos = response.data //axios guarda la respuesta en .data
            } catch (error) {
                this.error = error
            } finally {
                this.cargando = false
            }
        },
        async enviarDatos(Nuevodato) {
            try {
                const response = await apiClient.post('/datos', Nuevodato)
                this.datos.push(response.data) //axios guarda la respuesta en .data
            } catch (error) {
                console.error('Error al enviar datos:', error)
            }
        }
    }
})