import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import offlineQueueService from '../services/offlineQueue';

let apiBaseUrl = 'http://192.168.0.2:58824/api'; // Fallback de ejemplo (usar IP/puerto real detectado)

export const updateBaseUrl = async (url) => {
  apiBaseUrl = url.endsWith('/api') ? url : `${url}/api`;
  await AsyncStorage.setItem('server_url', apiBaseUrl);
  client.defaults.baseURL = apiBaseUrl;
};

export const loadSavedUrl = async () => {
  try {
    const savedUrl = await AsyncStorage.getItem('server_url');
    if (savedUrl) {
      apiBaseUrl = savedUrl;
    }
  } catch (e) {
    console.error('Error cargando URL guardada', e);
  }
  return apiBaseUrl;
};

const client = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Interceptor Request
client.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // Ignorar
  }
  return config;
});

// Interceptor Response
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // Lógica de logout podría ir aquí
      return Promise.reject(error);
    }

    if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      const config = error.config;
      if (['post', 'put', 'delete'].includes(config.method) && !config.url.includes('/auth') && !config.url.includes('/init')) {
        await offlineQueueService.addToQueue(config.url, config.method, config.data);
        return Promise.resolve({ data: { success: true, offline: true, message: 'Guardado localmente' } });
      }
    }
    return Promise.reject(error);
  }
);

export default client;
