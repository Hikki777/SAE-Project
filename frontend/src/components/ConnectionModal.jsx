import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, RefreshCw, CheckCircle, XCircle, Loader } from 'lucide-react';

/**
 * ConnectionModal - Modal profesional para mostrar estados de conexión
 * Estados: 'connecting' | 'synchronizing' | 'connected' | 'error'
 */
export default function ConnectionModal({ isOpen, status, onClose, onCancel, errorMessage, approvalCheckCount }) {
  useEffect(() => {
    if (!isOpen) return;

    // Reproducir sonidos según el estado
    const playSound = (url) => {
      try {
        const audio = new Audio(url);
        audio.volume = 0.5;
        audio.play().catch(err => console.log('Audio play failed:', err));
      } catch (error) {
        console.log('Audio error:', error);
      }
    };

    switch (status) {
      case 'connecting':
        playSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); // Beep suave
        break;
      case 'synchronizing':
        playSound('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Tono de espera
        break;
      case 'connected':
        playSound('https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'); // Éxito
        break;
      case 'error':
        playSound('https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3'); // Error
        break;
      default:
        break;
    }
  }, [status, isOpen]);

  const getStatusConfig = () => {
    switch (status) {
      case 'connecting':
        return {
          icon: Wifi,
          iconColor: 'text-blue-600',
          bgColor: 'bg-blue-100',
          title: 'Conectando al Servidor...',
          description: 'Verificando conectividad con el servidor maestro',
          showSpinner: true
        };
      case 'synchronizing':
        return {
          icon: RefreshCw,
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          title: 'Sincronizando...',
          description: 'Enviando información del equipo y esperando aprobación',
          showSpinner: true
        };
      case 'waiting-approval':
        return {
          icon: RefreshCw,
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-100',
          title: 'Esperando Aprobación...',
          description: 'El administrador del servidor debe aprobar este equipo para continuar',
          showSpinner: true
        };
      case 'connected':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgColor: 'bg-green-100',
          title: '¡Conexión Establecida!',
          description: 'Equipo aprobado. Redirigiendo al inicio de sesión...',
          showSpinner: false
        };
      case 'error':
        return {
          icon: XCircle,
          iconColor: 'text-red-600',
          bgColor: 'bg-red-100',
          title: 'Error de Conexión',
          description: errorMessage || 'No se pudo conectar al servidor. Verifica la URL e intenta nuevamente.',
          showSpinner: false
        };
      default:
        return {
          icon: Loader,
          iconColor: 'text-gray-600',
          bgColor: 'bg-gray-100',
          title: 'Procesando...',
          description: '',
          showSpinner: true
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-10">
              <div className={`absolute inset-0 ${config.bgColor} ${config.showSpinner ? 'animate-pulse' : ''}`}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: config.showSpinner ? 360 : 0 }}
                transition={{
                  scale: { type: 'spring', stiffness: 200, damping: 15 },
                  rotate: config.showSpinner ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}
                }}
                className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 ${config.iconColor}`}
              >
                <Icon size={40} className={config.showSpinner ? 'animate-pulse' : ''} />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
              >
                {config.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 dark:text-gray-300 mb-6"
              >
                {config.description}
              </motion.p>

              {/* Progress bar for synchronizing and waiting-approval */}
              {(status === 'synchronizing' || status === 'waiting-approval') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6 overflow-hidden"
                >
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className={`h-full ${status === 'waiting-approval' ? 'bg-orange-500' : 'bg-yellow-500'} rounded-full`}
                  ></motion.div>
                </motion.div>
              )}

              {/* Check count for waiting-approval */}
              {status === 'waiting-approval' && approvalCheckCount > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Verificando aprobación... ({approvalCheckCount} intentos)
                </p>
              )}

              {/* Action buttons */}
              {status === 'waiting-approval' && onCancel && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={onCancel}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Cancelar
                </motion.button>
              )}

              {status === 'error' && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onClick={onClose}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Reintentar
                </motion.button>
              )}

              {status === 'connected' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400"
                >
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <span className="text-sm font-medium">Redirigiendo...</span>
                </motion.div>
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-400/20 to-transparent rounded-full blur-2xl"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
