import client from '../api/client';
import toast from 'react-hot-toast';
import soundService from './soundService';

class NotificationService {
  constructor() {
    this.pollingInterval = null;
    this.lastPendingCount = 0;
    this.isPolling = false;
  }

  /**
   * Iniciar polling de notificaciones
   */
  startPolling(onUpdate) {
    if (this.isPolling) return;
    
    this.isPolling = true;
    
    // Verificar inmediatamente
    this.checkPendingEquipment(onUpdate);
    
    // Luego cada 10 segundos
    this.pollingInterval = setInterval(() => {
      this.checkPendingEquipment(onUpdate);
    }, 10000);
    
    console.log('📡 Servicio de notificaciones iniciado');
  }

  /**
   * Verificar equipos pendientes
   */
  async checkPendingEquipment(onUpdate) {
    // Si no hay token, no intentar peticiones (evita 401 innecesarios)
    if (!localStorage.getItem('token')) return;

    try {
      const response = await client.get('/equipos/pending-count');
      const { count } = response.data;
      
      // Si hay nuevos equipos pendientes, notificar
      if (count > this.lastPendingCount && this.lastPendingCount !== 0) {
        const newCount = count - this.lastPendingCount;
        this.showNewEquipmentNotification(newCount);
      }
      
      this.lastPendingCount = count;
      
      // Llamar callback con el conteo actualizado
      if (onUpdate) {
        onUpdate(count);
      }
    } catch (error) {
      // Silencioso - no molestar al usuario con errores de polling
      console.error('Error checking pending equipment:', error);
    }
  }

  /**
   * Mostrar notificación de nuevo equipo
   */
  showNewEquipmentNotification(count) {
    const message = count === 1 
      ? '🖥️ Nuevo equipo solicitando acceso'
      : `🖥️ ${count} nuevos equipos solicitando acceso`;
    
    toast(message, {
      icon: '🔔',
      duration: 5000,
      style: {
        background: '#3b82f6',
        color: '#fff',
        fontWeight: 'bold'
      },
      onClick: () => {
        // Navegar a configuración cuando se hace clic
        window.location.hash = '/configuracion';
      }
    });
    
    // Reproducir sonido de notificación
    this.playNotificationSound();
  }

  /**
   * Reproducir sonido de notificación
   */
  playNotificationSound() {
    soundService.notification();
  }

  /**
   * Detener polling
   */
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
    console.log('📡 Servicio de notificaciones detenido');
  }

  /**
   * Resetear contador (cuando el admin revisa los equipos)
   */
  resetCount() {
    this.lastPendingCount = 0;
  }
}

// Exportar instancia singleton
export default new NotificationService();
