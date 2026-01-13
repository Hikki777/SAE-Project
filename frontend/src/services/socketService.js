import io from 'socket.io-client';
import client from '../api/client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.serverUrl = null;
    this.equipoId = null;
  }

  /**
   * Conectar al servidor WebSocket
   */
  connect(serverUrl, equipoId) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No hay token para autenticación WebSocket');
      return;
    }

    this.serverUrl = serverUrl;
    this.equipoId = equipoId;

    // Conectar al namespace /client
    this.socket = io(`${serverUrl}/client`, {
      auth: { token, equipoId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 20000
    });

    this.setupEventListeners();
  }

  /**
   * Configurar listeners de eventos
   */
  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Conectado al servidor vía WebSocket');
      this.connected = true;
      
      // Iniciar heartbeat cada 30 segundos
      this.startHeartbeat();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Desconectado del servidor:', reason);
      this.connected = false;
      this.stopHeartbeat();
    });

    this.socket.on('connect_error', (error) => {
      console.error('⚠️ Error de conexión WebSocket:', error.message);
    });

    // Evento: Sincronización requerida
    this.socket.on('sync-required', (data) => {
      console.log('📥 Sincronización requerida:', data);
      this.handleSyncEvent(data);
    });

    // Evento: Estado de aprobación (para clientes en espera)
    this.socket.on('approval-status', (data) => {
      console.log('✅ Estado de aprobación recibido:', data);
      if (data.aprobado) {
        window.dispatchEvent(new CustomEvent('equipment-approved'));
      }
    });
  }

  /**
   * Emitir cambio de datos al servidor
   */
  emitDataChange(type, id, action) {
    if (this.connected && this.socket) {
      this.socket.emit('data-changed', { type, id, action });
      console.log(`📤 Cambio emitido: ${action} ${type} #${id}`);
    }
  }

  /**
   * Manejar evento de sincronización
   */
  async handleSyncEvent(data) {
    const { type, id, action, from } = data;
    
    console.log(`🔄 Sincronizando ${action} de ${type} #${id} desde ${from}`);
    
    // Emitir evento personalizado para que los componentes lo escuchen
    window.dispatchEvent(new CustomEvent('data-sync-required', {
      detail: { type, id, action, from }
    }));
  }

  /**
   * Heartbeat para mantener conexión activa
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.connected && this.socket) {
        this.socket.emit('heartbeat');
      }
    }, 30000); // Cada 30 segundos
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Desconectar del servidor
   */
  disconnect() {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connected = false;
  }

  /**
   * Verificar si está conectado
   */
  isConnected() {
    return this.connected && this.socket && this.socket.connected;
  }
}

// Exportar instancia singleton
export default new SocketService();
