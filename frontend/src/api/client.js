import axios from 'axios';
import toast from 'react-hot-toast';
import offlineQueueService from '../services/offlineQueue';

const getApiUrl = () => {
  // 1. Intentar usar variable de entorno de Vite (desde .env.development/.env.production)
  if (import.meta.env.VITE_API_URL) {
    console.log('[API Client] Usando VITE_API_URL:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }

  // 2. Intentar usar URL guardada en localStorage
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

  // 3. En Electron (file://) usar http://localhost:5000/api
  if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    console.log('[API Client] Detectado Electron (file://), usando http://localhost:5000/api');
    return 'http://localhost:5000/api';
  }

  // 4. En desarrollo con Vite (http://localhost:5173) usar backend en 5000
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173') {
    console.log('[API Client] Detectado Vite dev, usando http://localhost:5000/api');
    return 'http://localhost:5000/api';
  }

  // 5. Default fallback
  console.log('[API Client] Usando default fallback: http://localhost:5000/api');
  return 'http://localhost:5000/api';
};

const API_BASE = getApiUrl();
console.log('[API Client] API Base URL resuelto como:', API_BASE);

const client = axios.create({
  baseURL: API_BASE,
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
      const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';

      if (!isLoginRequest && !isLoginPage) {
        try {
          toast.dismiss();
          toast.error('Tu sesión ha expirado. Redirigiendo al inicio de sesión…', { duration: 1500 });
        } catch {}
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location.href = '/login';
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

export default client;
