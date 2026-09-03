import axios from 'axios';

// Cliente de axios para hablar con el backend (Laravel).
// Manda automáticamente el token guardado en localStorage en cada
// pedido, así no hay que agregarlo a mano en cada llamada.
//
// A propósito NO fijamos un "Content-Type" fijo acá: axios ya elige
// el correcto solo, según qué le mandemos — "application/json" para
// un objeto común, o "multipart/form-data" (con el boundary correcto)
// cuando el body es un FormData, como pasa al subir una imagen de
// producto. Forzarlo a mano rompía justo ese segundo caso: el
// navegador nunca llegaba a mandar el archivo con el formato que
// Laravel espera, así que la imagen se perdía en el camino.
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
