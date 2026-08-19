<template>
    <div class="perfil-container">
        <h1>Perfil</h1>

        <div v-if="usuario" class="perfil-card">
            <p><strong>Nombre:</strong> {{ usuario.name }}</p>
            <p><strong>Correo:</strong> {{ usuario.email }}</p>
            
            <!-- Botón para cerrar sesión -->
            <button @click="cerrarSesion">Cerrar sesión</button>
        </div>

        <div v-else>
           <p>Cargando datos del perfil</p>
        </div>
    </div>
</template>

    <script>
import api from '@/Api/api.js';

export default {
    name: 'PerfilView',
    data(){
        return {
            usuario: null
        };
    },
    async mounted(){
        try {
            const response = await api.get('/user');
            this.usuario = response.data;
        } catch (error) {
           this.$router.push({ name: 'login' });
        }
    },
    methods: {
        formatearFecha(fecha) {
            return new Date(fecha).toLocaleDateString('es-UY'); // Formatea la fecha en formato local de Uruguay
        },
        async cerrarSesion() {
            try {
                await api.post('/logout');
                this.$router.push({ name: 'login' });
                // Recargar la página para limpiar el estado de la aplicación
                window.location.reload();
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        }
    }
};
</script>