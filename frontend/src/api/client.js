import axios from 'axios';
import toast from 'react-hot-toast';
import offlineQueueService from '../services/offlineQueue';

const getApiUrl = () => {
  // 1. Verificar si Electron inyectó un puerto dinámico en la URL o Hash
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const apiPortParam = urlParams.get('apiPort');
    const hashMatch = window.location.hash.match(/apiPort=(\d+)/);
    const dynPort = apiPortParam || (hashMatch ? hashMatch[1] : null);

    if (dynPort) {
      sessionStorage.setItem('dynamic_api_port', dynPort);
      console.log(`[API Client] Detectado puerto dinámico Electron: ${dynPort}`);
      return `http://localhost:${dynPort}/api`;
    }
    
    // Recuperar de sessionStorage si React Router ya sobrescribió el hash
    const savedDynPort = sessionStorage.getItem('dynamic_api_port');
    if (savedDynPort) {
      return `http://localhost:${savedDynPort}/api`;
    }
  }

  // 2. Intentar usar variable de entorno de Vite (desde .env.development/.env.production)
  if (import.meta.env.VITE_API_URL) {
    console.log('[API Client] Usando VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }

  // 3. Intentar usar URL guardada en localStorage
  let url = localStorage.getItem('api_url');
  
  // FILTRO DE SEGURIDAD: Ignorar URLs de nube antiguas que causan error 404
  if (url && (url.includes('railway.app') || url.includes('herokuapp'))) {
    console.warn('[API Client] Detectada URL legacy (Railway/Heroku), ignorando y limpiando...');
    localStorage.removeItem('api_url');
    url = null;
  }

  if (url) {
    console.log('[API Client] Usando URL guardada:', url);
    return url;
  }

  // 4. En Electron (file://) usar puerto de desarrollo como fallback (Legacy)
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    console.warn('[API Client] Puerto dinámico no encontrado. Usando fallback legacy: 5000');
    return 'http://localhost:5000/api';
  }

  // 5. Default fallback general (Desarrollo Web)
  console.log('[API Client] No se detectó configuración. Usando default (Dev): http://localhost:5000/api');
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();
const BASE_URL = API_URL.replace(/\/api$/, '').replace(/\/$/, '');

console.log('[API Client] API Base URL resuelto como:', API_URL);

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Si estamos enviando archivos (FormData), DEBEMOS eliminar el Content-Type por defecto 
  // ('application/json') para que Axios/Navegador genere automáticamente el header 
  // 'multipart/form-data' con el 'boundary' obligatorio.
  // Usamos una detección más robusta (instanceof o método .append)
  const isFormData = config.data instanceof FormData || 
                     (config.data && typeof config.data.append === 'function');

  if (isFormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Interceptor para manejar errores
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aviso amigable cuando expira la sesión (401)
    // No mostrar si estamos en el login para evitar mensajes confusos
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      const isLoginPage = typeof window !== 'undefined' && (window.location.pathname === '/login' || window.location.hash === '#/login');

      if (!isLoginRequest && !isLoginPage) {
        try {
          toast.dismiss();
          toast.error('Tu sesión ha expirado. Redirigiendo al inicio de sesión…', { duration: 1500 });
        } catch {}
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location.hash = '/login';
        }, 1500);
      }
      return Promise.reject(error);
    }

    // Aviso controlado cuando el backend está offline (sin response) o error de red
    if (!error.response || error.code === 'ERR_NETWORK') {
      const config = error.config;
      
      // Solo encolar métodos que modifican datos (POST, PUT, DELETE) y si no es un intento de auth o init
      if (['post', 'put', 'delete'].includes(config.method) && !config.url.includes('/auth') && !config.url.includes('/init')) {
        offlineQueueService.addToQueue(config.url, config.method, config.data);
        return Promise.resolve({ data: { success: true, offline: true, message: 'Guardado localmente' } });
      }

      if (typeof window !== 'undefined') {
        const key = '__last_network_toast__';
        const now = Date.now();
        const last = Number(sessionStorage.getItem(key) || 0);
        if (now - last > 10000) {
          try {
            toast.error('Modo Offline: Verificando conexión...', { id: 'offline-toast' });
          } catch {}
          sessionStorage.setItem(key, String(now));
        }
      }
    }
    return Promise.reject(error);
  }
);

export { API_URL, BASE_URL };
export default client;
