import client from '../api/client';
import socketService from './socketService';
import offlineQueueService from './offlineQueue';
import toast from 'react-hot-toast';

class SyncService {
  constructor() {
    this.lastSyncTimestamp = null;
    this.syncInterval = null;
    this.isSyncing = false;
    this.isClient = localStorage.getItem('is_client') === 'true';
  }

  /**
   * Iniciar servicio de sincronización
   */
  async start() {
    if (!this.isClient) {
      console.log('[SYNC] Modo servidor - sincronización deshabilitada');
      return;
    }

    console.log('[SYNC] Iniciando servicio de sincronización');
    
    // Sincronización inicial
    await this.initialSync();
    
    // Sincronización incremental cada 30 segundos
    this.syncInterval = setInterval(() => {
      this.incrementalSync();
    }, 30000);

    // Escuchar eventos de sincronización desde WebSocket
    this.setupSyncListeners();
  }

  /**
   * Sincronización inicial completa
   */
  async initialSync() {
    if (this.isSyncing) return;

    this.isSyncing = true;
    const toastId = toast.loading('Sincronizando datos...');

    try {
      console.log('[SYNC] Iniciando sincronización inicial');
      const response = await client.get('/sync/initial');
      const { data, timestamp } = response.data;

      // Guardar datos en localStorage (o IndexedDB para mejor rendimiento)
      localStorage.setItem('sync_data', JSON.stringify(data));
      localStorage.setItem('last_sync', timestamp);
      this.lastSyncTimestamp = timestamp;

      toast.success('Datos sincronizados', { id: toastId });
      console.log('[SYNC] Sincronización inicial completada');
      
      // Emitir evento para que los componentes actualicen
      window.dispatchEvent(new CustomEvent('data-synced', { detail: data }));
    } catch (error) {
      console.error('[SYNC] Error en sincronización inicial:', error);
      toast.error('Error sincronizando datos', { id: toastId });
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Sincronización incremental (cambios desde último sync)
   */
  async incrementalSync() {
    if (this.isSyncing || !this.lastSyncTimestamp) return;

    this.isSyncing = true;

    try {
      console.log('[SYNC] Sincronización incremental desde', this.lastSyncTimestamp);
      const response = await client.get('/sync/incremental', {
        params: { since: this.lastSyncTimestamp }
      });

      const { changes, timestamp, counts } = response.data;
      
      // Si hay cambios, actualizar datos locales
      if (Object.values(counts).some(count => count > 0)) {
        this.applyIncrementalChanges(changes);
        this.lastSyncTimestamp = timestamp;
        localStorage.setItem('last_sync', timestamp);
        
        console.log('[SYNC] Cambios aplicados:', counts);
        
        // Emitir evento
        window.dispatchEvent(new CustomEvent('data-updated', { detail: changes }));
      }
    } catch (error) {
      console.error('[SYNC] Error en sincronización incremental:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Aplicar cambios incrementales a datos locales
   */
  applyIncrementalChanges(changes) {
    const syncData = JSON.parse(localStorage.getItem('sync_data') || '{}');
    
    // Actualizar cada tipo de dato
    ['alumnos', 'personal', 'asistencias', 'excusas'].forEach(type => {
      if (changes[type] && changes[type].length > 0) {
        changes[type].forEach(item => {
          const index = syncData[type]?.findIndex(existing => existing.id === item.id);
          if (index >= 0) {
            // Actualizar existente
            syncData[type][index] = item;
          } else {
            // Agregar nuevo
            if (!syncData[type]) syncData[type] = [];
            syncData[type].push(item);
          }
        });
      }
    });

    localStorage.setItem('sync_data', JSON.stringify(syncData));
  }

  /**
   * Enviar cambios locales al servidor
   */
  async pushChanges(changes) {
    if (!this.isClient) return;

    try {
      const equipoId = localStorage.getItem('device_id');
      const response = await client.post('/sync/push', {
        changes,
        equipoId
      });

      const { success, errors, conflicts } = response.data;

      if (conflicts.length > 0) {
        console.warn('[SYNC] Conflictos detectados:', conflicts);
        toast('Algunos cambios tienen conflictos', { icon: '⚠️' });
      }

      if (errors.length > 0) {
        console.error('[SYNC] Errores al sincronizar:', errors);
        toast.error(`${errors.length} cambios fallaron`);
      }

      if (success.length > 0) {
        console.log('[SYNC] Cambios enviados exitosamente:', success.length);
      }

      return response.data;
    } catch (error) {
      console.error('[SYNC] Error enviando cambios:', error);
      toast.error('Error sincronizando cambios');
      throw error;
    }
  }

  /**
   * Configurar listeners de WebSocket para sincronización
   */
  setupSyncListeners() {
    window.addEventListener('data-sync-required', (event) => {
      const { type, id, action, from } = event.detail;
      console.log(`[SYNC] Sincronización requerida: ${action} ${type} #${id} desde ${from}`);
      
      // Realizar sincronización incremental inmediata
      this.incrementalSync();
    });
  }

  /**
   * Detener servicio de sincronización
   */
  stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    console.log('[SYNC] Servicio de sincronización detenido');
  }

  /**
   * Obtener datos sincronizados
   */
  getSyncedData() {
    const data = localStorage.getItem('sync_data');
    return data ? JSON.parse(data) : null;
  }

  /**
   * Forzar sincronización manual
   */
  async forceSync() {
    await this.initialSync();
  }
}

// Exportar instancia singleton
export default new SyncService();
