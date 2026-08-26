import axios from 'axios';

// Cliente de axios para hablar con el backend (Laravel).
// Manda automáticamente el token guardado en localStorage en cada
// pedido, así no hay que agregarlo a mano en cada llamada.
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
