/**
 * soundService.js
 * Servicio de sonidos local usando Web Audio API.
 * No requiere archivos externos ni internet.
 * Funciona en Electron producción y en modo offline.
 */

class SoundService {
  constructor() {
    this._ctx = null;
  }

  _getCtx() {
    if (!this._ctx) {
      try {
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch {
        return null;
      }
    }
    return this._ctx;
  }

  /**
   * Reproduce un tono sintético.
   * @param {number[]} freqs     - Array de frecuencias (Hz) a reproducir en secuencia
   * @param {number}   duration  - Duración de cada tono (segundos)
   * @param {'sine'|'square'|'sawtooth'|'triangle'} type - Tipo de onda
   * @param {number}   volume    - Volumen 0-1
   */
  _beep(freqs, duration = 0.12, type = 'sine', volume = 0.25) {
    const ctx = this._getCtx();
    if (!ctx) return;

    // Algunos navegadores requieren reanudar el contexto tras interacción del usuario
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    let startTime = ctx.currentTime;
    freqs.forEach((freq) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, startTime);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

      startTime += duration;
    });
  }

  /** Login exitoso — acorde ascendente brillante */
  success() {
    this._beep([523, 659, 784], 0.13, 'sine', 0.22);
  }

  /** Error / acceso denegado — tono descendente corto */
  error() {
    this._beep([440, 330], 0.15, 'square', 0.18);
  }

  /** Notificación / alerta — doble ping */
  notification() {
    this._beep([880, 880], 0.1, 'sine', 0.2);
  }

  /** Cierre de sesión — tono descendente suave */
  logout() {
    this._beep([659, 523, 392], 0.12, 'sine', 0.18);
  }

  /** Conectando — beep suave único */
  connecting() {
    this._beep([440], 0.2, 'sine', 0.15);
  }

  /** Sincronizando — dos tonos suaves */
  synchronizing() {
    this._beep([523, 523], 0.15, 'sine', 0.12);
  }

  /** Conexión establecida — acorde de éxito */
  connected() {
    this._beep([523, 659, 784, 1047], 0.1, 'sine', 0.2);
  }
}

export default new SoundService();
