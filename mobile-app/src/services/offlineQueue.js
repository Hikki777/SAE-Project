import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const QUEUE_KEY = '@offline_queue';

class OfflineQueueService {
  constructor() {
    this.queue = [];
    this.isSyncing = false;
    this.baseURL = null;
  }

  async setBaseURL(url) {
    this.baseURL = url.endsWith('/api') ? url : `${url}/api`;
  }

  async loadQueue() {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading offline queue', e);
    }
  }

  async saveQueue() {
    try {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.error('Error saving offline queue', e);
    }
  }

  async addToQueue(url, method, data) {
    await this.loadQueue();
    // Prevenir duplicados de asistencias repetidas
    if (url.includes('/asistencias/scan')) {
      const isDuplicate = this.queue.some(item => 
        item.url === url && 
        item.data?.carnet === data?.carnet &&
        item.data?.action === data?.action
      );
      if (isDuplicate) return;
    }

    this.queue.push({
      id: Date.now().toString(),
      url,
      method,
      data,
      timestamp: new Date().toISOString()
    });
    
    await this.saveQueue();
    return this.queue.length;
  }

  async getQueue() {
    await this.loadQueue();
    return this.queue;
  }

  async getQueueCount() {
    await this.loadQueue();
    return this.queue.length;
  }

  async syncQueue() {
    if (this.isSyncing || this.queue.length === 0) return;
    
    this.isSyncing = true;
    let syncedCount = 0;
    
    try {
      const token = await AsyncStorage.getItem('token');
      if (!this.baseURL) {
        this.baseURL = await AsyncStorage.getItem('server_url');
      }

      const currentQueue = [...this.queue];
      
      for (const item of currentQueue) {
        try {
          await axios({
            url: `${this.baseURL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
            method: item.method,
            data: item.data,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 5000
          });
          
          this.queue = this.queue.filter(q => q.id !== item.id);
          syncedCount++;
          await this.saveQueue(); // Guardar progreso parcial
        } catch (error) {
          if (!error.response) { // Network error, stop syncing
             break;
          }
          // Si es error de validación (400), descartar petición para evitar bucle infinito
          if (error.response?.status === 400 || error.response?.status === 404) {
             this.queue = this.queue.filter(q => q.id !== item.id);
             await this.saveQueue();
          }
        }
      }
    } catch (e) {
      console.error('Fatal sync error:', e);
    } finally {
      this.isSyncing = false;
    }
    
    return syncedCount;
  }

  async clearQueue() {
    this.queue = [];
    await AsyncStorage.removeItem(QUEUE_KEY);
  }
}

export default new OfflineQueueService();
