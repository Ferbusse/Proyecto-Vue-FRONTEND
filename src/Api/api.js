import axios from 'axios';

// Cliente de axios para hablar con el backend (Laravel).
// Manda automáticamente el token guardado en localStorage en cada
// pedido, así no hay que agregarlo a mano en cada llamada.
//
// No se fija un "Content-Type": axios elige solo "application/json" para
// un objeto común o "multipart/form-data" (con el boundary correcto)
// para un FormData, que es lo que se usa al subir imágenes.
const apiClient = axios.create({
  // La URL del backend se puede cambiar con VITE_API_URL (ver .env.example);
  // si no está definida, usa el Laravel local de siempre.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
