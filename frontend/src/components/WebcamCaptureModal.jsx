import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RotateCcw, Check, SwitchCamera, AlertCircle } from 'lucide-react';

/**
 * WebcamCaptureModal
 * Props:
 *   isOpen   {boolean} - whether the modal is visible
 *   onClose  {function} - called when user cancels
 *   onCapture {function(file: File, previewUrl: string)} - called with the captured photo
 *   accentColor {string} - optional Tailwind color for the capture button (default: 'primary')
 */
export default function WebcamCaptureModal({ isOpen, onClose, onCapture, accentColor = 'primary' }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [captured, setCaptured] = useState(null); // data URL of captured photo
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Enumerate cameras
  const loadDevices = useCallback(async () => {
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      const cameras = all.filter((d) => d.kind === 'videoinput');
      setDevices(cameras);
      if (cameras.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(cameras[0].deviceId);
      }
    } catch {
      // Ignore enumeration errors
    }
  }, [selectedDeviceId]);

  // Start camera stream
  const startStream = useCallback(async (deviceId) => {
    // Stop any existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setError(null);
    setIsLoading(true);
    try {
      const constraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // En lugar de intentar adjuntar el stream aquí de forma manual,
      // usamos un callback ref (handleVideoRef) que se dispara
      // en cuanto React monta el <video> (después del spinner de isLoading).

      // Enumerar dispositivos DESPUÉS de tener permiso (labels solo disponibles tras permiso)
      await loadDevices();
    } catch (err) {
      console.error('[Webcam] getUserMedia error:', err.name, err.message);
      if (err.name === 'NotAllowedError') {
        setError('Permiso de cámara denegado. Verifica los permisos de la aplicación.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No se encontró ninguna cámara disponible en este dispositivo.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('La cámara está siendo usada por otra aplicación. Ciérrala e intenta de nuevo.');
      } else {
        setError('No se pudo acceder a la cámara: ' + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadDevices]);

  // Stop stream helper
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Callback ref para el <video>. Garantiza que el srcObject se asigne
  // justo en el instante en que React monta el elemento en el DOM.
  const handleVideoRef = useCallback((node) => {
    videoRef.current = node;
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      node.play().catch(err => console.warn('[Webcam] auto-play prevent:', err));
    }
  }, []);

  // Open/close effect
  useEffect(() => {
    if (isOpen) {
      setCaptured(null);
      setError(null);
      startStream(selectedDeviceId || '');
    } else {
      stopStream();
      setCaptured(null);
    }
    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Device change effect
  useEffect(() => {
    if (isOpen && selectedDeviceId && !captured) {
      startStream(selectedDeviceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeviceId]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    // Draw mirrored (natural selfie look)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCaptured(dataUrl);
    stopStream();
  };

  const handleRetake = () => {
    setCaptured(null);
    startStream(selectedDeviceId);
  };

  const handleConfirm = () => {
    if (!captured) return;
    // Convert dataURL → Blob → File
    const byteString = atob(captured.split(',')[1]);
    const mimeString = 'image/jpeg';
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const file = new File([blob], `webcam_${Date.now()}.jpg`, { type: mimeString });
    onCapture(file, captured);
    onClose();
  };

  const handleClose = () => {
    stopStream();
    setCaptured(null);
    onClose();
  };

  const btnBase =
    accentColor === 'success'
      ? 'bg-success hover:bg-success-dark dark:bg-success-light dark:hover:bg-success'
      : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600';

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Camera size={20} className="text-primary-500 dark:text-primary-400" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Tomar foto</h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition rounded-lg p-1"
            >
              <X size={22} />
            </button>
          </div>

          {/* Camera selector */}
          {devices.length > 1 && (
            <div className="px-5 pt-3 flex items-center gap-2">
              <SwitchCamera size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {devices.map((d, i) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label || `Cámara ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Viewport */}
          <div className="relative mx-5 mt-3 mb-4 rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            {error ? (
              <div className="flex flex-col items-center gap-3 p-6 text-center">
                <AlertCircle size={40} className="text-red-400" />
                <p className="text-sm text-red-300">{error}</p>
                <button
                  onClick={() => startStream(selectedDeviceId)}
                  className="text-xs text-blue-400 underline hover:text-blue-300"
                >
                  Reintentar
                </button>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                <p className="text-white/70 text-sm">Iniciando cámara...</p>
              </div>
            ) : captured ? (
              <img src={captured} alt="Foto capturada" className="w-full h-full object-cover" />
            ) : (
              <>
                {/* Mirror transform on the live video */}
                <video
                  ref={handleVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                  onLoadedMetadata={(e) => e.target.play().catch(() => {})}
                  onCanPlay={(e) => e.target.play().catch(() => {})}
                />
                {/* Guide circle overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-40 h-40 rounded-full border-2 border-white/40 border-dashed" />
                </div>
              </>
            )}
          </div>

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Actions */}
          <div className="px-5 pb-5 flex gap-3">
            {captured ? (
              <>
                <button
                  onClick={handleRetake}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2.5 rounded-xl transition"
                >
                  <RotateCcw size={18} />
                  Repetir
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 flex items-center justify-center gap-2 ${btnBase} text-white font-semibold py-2.5 rounded-xl transition`}
                >
                  <Check size={18} />
                  Usar foto
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2.5 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCapture}
                  disabled={!!error || isLoading}
                  className={`flex-1 flex items-center justify-center gap-2 ${btnBase} text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Camera size={18} />
                  Capturar
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
