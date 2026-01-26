/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, UserCheck, UserX, Search, Calendar, TrendingUp, QrCode, Camera, CameraOff, XCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import client from '../api/client';
import QrScanner from 'qr-scanner';
import { TableSkeleton } from './LoadingSpinner';
import ModalSinSalida from './ModalSinSalida';

// Usamos el cliente API compartido (con baseURL '/api' e interceptor JWT)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

export default function AsistenciasPanel() {
  const navigate = useNavigate();
      const [showAusentesModal, setShowAusentesModal] = useState(false);
      const [excusaInput, setExcusaInput] = useState('');
      const [personaExcusa, setPersonaExcusa] = useState(null);
      const [excusas, setExcusas] = useState([]);
    const [tomaIniciada, setTomaIniciada] = useState(false);
    const [horaInternet, setHoraInternet] = useState('');
  const [asistenciasHoy, setAsistenciasHoy] = useState([]);
  const [ausentes, setAusentes] = useState([]);
  const [mostrarModalSinSalida, setMostrarModalSinSalida] = useState(false);
  const [personasSinSalida, setPersonasSinSalida] = useState([]);
  const [stats, setStats] = useState(null);
  const [alumnos, setAlumnos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [tipoPersona, setTipoPersona] = useState('alumno');
  const [selectedAlumno, setSelectedAlumno] = useState('');
  const [selectedDocente, setSelectedDocente] = useState('');
  const [tipoEvento, setTipoEvento] = useState('entrada');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [scanMessage, setScanMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [detectedCargo, setDetectedCargo] = useState('Docente'); // Estado para mostrar cargo específico (Directora, etc.) // Estado para controlar sugerencias
  const [mostrarAusentes, setMostrarAusentes] = useState(false); // Toggle para mostrar ausentes en historial
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const scannerActiveRef = useRef(false);
  const isProcessingRef = useRef(false);
  const lastScannedQRRef = useRef('');
  const processingTimeoutRef = useRef(null);

  // Sonido de error sintetizado (Mejorado: onda cuadrada tipo 'buzzer')
  const playErrorSound = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      
      // Asegurar que el contexto esté activo
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square'; // Más audible para errores
      osc.frequency.setValueAtTime(330, ctx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.4);
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }, []);

  // Optimización: Filtrar listas con useMemo para evitar re-cálculos innecesarios
  const alumnosFiltrados = useMemo(() => {
    if (!searchTerm) return alumnos;
    const term = searchTerm.toLowerCase();
    return alumnos.filter(a => 
      a.nombres.toLowerCase().includes(term) ||
      a.apellidos.toLowerCase().includes(term) ||
      a.carnet.toLowerCase().includes(term)
    );
  }, [alumnos, searchTerm]);

  const docentesFiltrados = useMemo(() => {
    if (!searchTerm) return docentes;
    const term = searchTerm.toLowerCase();
    return docentes.filter(d => 
      d.nombres.toLowerCase().includes(term) ||
      d.apellidos.toLowerCase().includes(term) ||
      d.carnet.toLowerCase().includes(term)
    );
  }, [docentes, searchTerm]);

  // Helper function to get user photo URL
  const getUserPhotoUrl = useCallback((tipo, carnet, personaObj = null) => {
    // 1. Prioridad: Objeto persona con foto_path
    if (personaObj && personaObj.foto_path) {
         return personaObj.foto_path.startsWith('http') 
            ? personaObj.foto_path 
            : `${BASE_URL}/uploads/${personaObj.foto_path}`;
    }

    if (!carnet) return null;
    
    // Limpiar carnet de espacios accidentales
    const cleanCarnet = String(carnet).trim();
    
    // Determinar el directorio según el tipo
    let directory = '';
    let prefix = '';
    
    if (tipo === 'alumno' || tipo === 'Alumno') {
      directory = 'alumnos';
      prefix = 'alumno';
    } else {
      // Para personal, determinar subdirectorio por prefijo de carnet
      if (cleanCarnet.startsWith('DIR-') || cleanCarnet.startsWith('SDIR-')) {
        directory = 'directores';
        prefix = 'director';
      } else if (cleanCarnet.startsWith('D-')) {
        directory = 'docentes';
        prefix = 'docentes';
      } else {
        directory = 'personal';
        prefix = 'personal';
      }
    }
    
    // Construir URL: /uploads/{directory}/{prefix}_{carnet}.png
    // Asegurar que no haya espacios en la URL generada
    return `/uploads/${directory}/${prefix}_${cleanCarnet}.png`;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Evitar llamadas sin token; el interceptor también redirige en 401
      toast.error('Sesión no iniciada. Inicia sesión para continuar.');
      window.location.href = '/login';
      return;
    }

    fetchAsistenciasHoy();
    fetchAlumnos();
    fetchDocentes();
    // Obtener excusas del día
    import('../api/excusas').then(({ excusasAPI }) => {
      excusasAPI.list({ fecha: new Date().toISOString().slice(0, 10) })
        .then(res => setExcusas(res.data.excusas || []))
        .catch(() => setExcusas([]));
    });

    // Obtener hora de internet
    fetch('https://worldtimeapi.org/api/timezone/America/El_Salvador')
      .then(res => res.json())
      .then(data => {
        if (data && data.datetime) {
          const fecha = new Date(data.datetime);
          setHoraInternet(fecha.toLocaleString('es-ES'));
        }
      })
      .catch(err => {
        console.warn('⚠️ No se pudo obtener hora de internet, usando local:', err.message);
        // Fallback silencioso a hora local si es necesario, aunque setHoraInternet ya tiene valor inicial vacío
      });
    
    return () => {
      stopScanner();
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  const fetchAsistenciasHoy = async () => {
    setLoading(true);
    try {
      // Calcular inicio y fin del día local en formato ISO para enviar al backend
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      
      const response = await client.get('/asistencias', {
        params: {
          desde: start.toISOString(),
          hasta: end.toISOString(),
          limit: 100 // Obtener suficientes registros del día
        }
      });
      
      const asistencias = response.data.asistencias || [];
      setAsistenciasHoy(asistencias);
      
      // Obtener ausentes del día
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const fechaHoy = `${year}-${month}-${day}`;
        
        console.log('🔍 Fetching ausentes para fecha:', fechaHoy);
        
        const ausentesResponse = await client.get('/asistencias/ausentes', {
          params: { fecha: fechaHoy }
        });
        
        const ausentesData = ausentesResponse.data.ausentes || [];
        console.log('✅ Ausentes obtenidos:', ausentesData.length, ausentesData);
        setAusentes(ausentesData);
      } catch (err) {
        console.error('❌ Error fetching ausentes:', err);
        setAusentes([]);
      }
      
      // Calcular stats localmente si el endpoint general no los devuelve pre-calculados
      const stats = {
        total: asistencias.length,
        entradas: asistencias.filter(a => a.tipo_evento === 'entrada').length,
        salidas: asistencias.filter(a => a.tipo_evento === 'salida').length,
        puntuales: asistencias.filter(a => a.estado_puntualidad === 'puntual').length,
        tardes: asistencias.filter(a => a.estado_puntualidad === 'tarde').length
      };
      setStats(stats);
      
    } catch (error) {
      console.error('Error fetching asistencias:', error);
      toast.error('Error al cargar asistencias: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchAlumnos = async () => {
    try {
      const response = await client.get('/alumnos');
      setAlumnos(response.data.alumnos || []);
    } catch (error) {
      console.error('Error fetching alumnos:', error);
      toast.error('Error al cargar alumnos');
    }
  };

  const fetchDocentes = async () => {
    try {
      const response = await client.get('/docentes');
      setDocentes(response.data.personal || response.data.docentes || []);
    } catch (error) {
      console.error('Error fetching docentes:', error);
      toast.error('Error al cargar docentes');
    }
  };

  // Función para reproducir sonido de beep tipo escáner (optimizada con useCallback)
  const playBeepSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configurar el sonido tipo beep de supermercado
      oscillator.frequency.value = 2800; // Frecuencia alta para beep
      oscillator.type = 'square'; // Onda cuadrada para sonido más nítido
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio no disponible:', error);
    }
  }, []);

  const handleFinalizarTomaAsistencias = async () => {
    try {
      // Llamar al endpoint para detectar ausentes
      const response = await client.get('/asistencias/ausentes');
      const { ausentes, total } = response.data;

      if (total === 0) {
        toast.success('✅ ¡Excelente! Todos presentes hoy.');
        setTomaIniciada(false);
        return;
      }

      // Guardar ausentes en sessionStorage
      sessionStorage.setItem('ausentes_revision', JSON.stringify(ausentes));
      sessionStorage.setItem('fecha_revision', new Date().toISOString());

      // Redirigir al panel de justificaciones en modo revisión
      toast.success(`📋 ${total} ausente${total !== 1 ? 's' : ''} detectado${total !== 1 ? 's' : ''}. Redirigiendo...`);
      
      setTimeout(() => {
        navigate('/justificaciones?modo=revision');
      }, 1000);
    } catch (error) {
      console.error('Error detectando ausentes:', error);
      toast.error('Error al detectar ausentes: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleFinalizarTomaSalidas = async () => {
    try {
      // Llamar al endpoint para detectar personas sin salida
      const response = await client.get('/asistencias/sin-salida');
      const { sinSalida, total } = response.data;

      if (total === 0) {
        toast.success('✅ ¡Perfecto! Todos marcaron salida.');
        setTomaIniciada(false);
        return;
      }

      // Mostrar modal con personas sin salida
      setPersonasSinSalida(sinSalida);
      setMostrarModalSinSalida(true);
      // Modal ya muestra el contador visualmente, no necesitamos toast
    } catch (error) {
      console.error('Error detectando personas sin salida:', error);
      toast.error('Error al detectar salidas faltantes: ' + (error.response?.data?.error || error.message));
    }
  };


  const handleRegistrarAsistencia = async (e) => {
    e.preventDefault();
    if (isProcessingRef.current) return;
    
    const personaId = tipoPersona === 'alumno' ? selectedAlumno : selectedDocente;
    
    console.log('🔍 Debug registro:', {
      tipoPersona,
      selectedAlumno,
      selectedDocente,
      personaId,
      tipoEvento
    });
    
    if (!personaId) {
      toast.error(`Selecciona un ${tipoPersona}`);
      return;
    }

    isProcessingRef.current = true;

    // Backup para rollback
    const previousAsistencias = [...asistenciasHoy];
    let personaData = null;

    try {
      // Buscar datos completos de la persona ANTES de la llamada API
      console.log('🔍 Buscando datos para modal de registro manual...');
      
      if (tipoPersona === 'alumno') {
        const alumno = alumnos.find(a => a.id === parseInt(selectedAlumno));
        console.log('👨‍🎓 Alumno encontrado:', alumno);
        
        // Validar que el alumno esté activo
        if (!alumno) {
          toast.error('Alumno no encontrado');
          return;
        }
        if (alumno.estado === 'inactivo' || alumno.estado === 'baja') {
          toast.error(`⚠️ El alumno ${alumno.nombres} ${alumno.apellidos} está INACTIVO. No se puede registrar asistencia.`);
          return;
        }
        personaData = {
          tipo: 'Alumno',
          nombres: alumno?.nombre || alumno?.nombres || 'Desconocido',
          apellidos: alumno?.apellido || alumno?.apellidos || '',
          carnet: alumno?.carnet || `ID: ${selectedAlumno}`,
          grado: alumno?.grado || 'N/A',
          seccion: alumno?.seccion || 'N/A',
          foto_url: getUserPhotoUrl('alumno', alumno?.carnet, alumno)
        };
      } else {
        const docente = docentes.find(d => d.id === parseInt(selectedDocente));
        console.log('👨‍🏫 Personal encontrado:', docente);
        
        // Validar que el personal esté activo
        if (!docente) {
          toast.error('Personal no encontrado');
          return;
        }
        if (docente.estado === 'inactivo' || docente.estado === 'baja') {
          toast.error(`⚠️ El personal ${docente.nombres} ${docente.apellidos} está INACTIVO. No se puede registrar asistencia.`);
          return;
        }
        
        personaData = {
          tipo: docente?.cargo || 'Personal', 
          nombres: docente?.nombre || docente?.nombres || 'Desconocido', // Estandarizado a plural (DB)
          apellidos: docente?.apellido || docente?.apellidos || '',
          carnet: docente?.carnet || `ID: ${selectedDocente}`,
          cargo: docente?.cargo || 'N/A',
          departamento: docente?.departamento || 'N/A',
          foto_url: getUserPhotoUrl('personal', docente?.carnet, docente)
        };
      }

      // Crear asistencia optimista
      const optimisticAsistencia = {
        id: Date.now(), // ID temporal
        tipo_evento: tipoEvento,
        origen: 'Manual',
        created_at: new Date().toISOString(),
        alumno_id: tipoPersona === 'alumno' ? parseInt(selectedAlumno) : null,
        docente_id: tipoPersona === 'docente' ? parseInt(selectedDocente) : null,
        alumno: tipoPersona === 'alumno' ? personaData : null,
        docente: tipoPersona === 'docente' ? personaData : null
      };

      // Llamada API asíncrona
      const requestData = {
        tipo_evento: tipoEvento,
        origen: 'Manual'
      };

      // Solo enviar el campo que corresponde (no enviar null ni strings vacíos)
      if (tipoPersona === 'alumno' && optimisticAsistencia.alumno_id) {
        requestData.alumno_id = optimisticAsistencia.alumno_id;
      } else if (tipoPersona === 'docente' && optimisticAsistencia.docente_id) {
        requestData.personal_id = optimisticAsistencia.docente_id;
      }

      console.log('📤 Enviando:', requestData);

      const response = await client.post('/asistencias', requestData);

      // Si llegamos aquí, fue exitoso. AHORA mostramos el modal.
      
      // Actualizar UI con ID real
      setAsistenciasHoy(prev => [
        { ...optimisticAsistencia, id: response.data.id }, 
        ...prev
      ]);
      
      // Limpiar formulario
      setSelectedAlumno('');
      setSelectedDocente('');
      setSearchTerm('');

      // Mostrar modal DE ÉXITO
      setModalData({
        ...personaData,
        tipoEvento: tipoEvento === 'entrada' ? 'ENTRADA' : 'SALIDA',
        hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        isError: false
      });
      setShowModal(true);

      // Reproducir sonido de confirmación
      playBeepSound();

      // Cerrar modal automáticamente después de 3 segundos
      setTimeout(() => {
        setShowModal(false);
      }, 3000);

      toast.success('Asistencia registrada exitosamente');
      fetchAsistenciasHoy(); // Sincronizar con backend

    } catch (error) {
      // Rollback UI (quitar la asistencia optimista)
      setAsistenciasHoy(previousAsistencias);
      
      console.error('❌ Error registro manual:', error);

      if (error.response?.status === 409) {
        // ERROR DE DUPLICADO -> Mostrar Modal de Error
        const { registroExistente } = error.response.data;
        
        setModalData({
          ...personaData,
          tipoEvento: tipoEvento === 'entrada' ? 'ENTRADA' : 'SALIDA',
          hora: registroExistente?.hora || 'N/A',
          isError: true,
          errorMessage: `Esta persona ya registró su ${tipoEvento} hoy a las ${registroExistente?.hora || '??:??'}.`
        });

        setShowModal(true);
        playErrorSound(); // Reproducir sonido de error
        
        // Cerrar modal automáticamente
        setTimeout(() => {
          setShowModal(false);
        }, 4000);

      } else {
        toast.error('Error: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      isProcessingRef.current = false;
    }
  };

  // Efecto para inicializar el escáner QrScanner
  useEffect(() => {
    let mounted = true;

    const initScanner = async () => {
        if (scannerActive && tomaIniciada) {
            console.log('🎥 Iniciando QrScanner (Nimus)...');
            
            // Esperar ref
            if (!videoRef.current) {
                console.warn("⚠️ Elemento video no disponible aún");
                return;
            }

            try {
                // 1. Obtener stream MANUALMENTE para forzar HD (720p mínimo)
                // QrScanner a veces acepta lo que le da el navegador (480p), aquí exigimos calidad.
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 1280 }, // 720p es suficiente y más rápido de procesar
                        height: { ideal: 720 }
                    }
                });

                // Asignar stream al video antes de que QrScanner lo tome
                videoRef.current.srcObject = stream;
                // Esperar un toque a que cargue metadata (necesario para que QrScanner lea dimensiones)
                await new Promise(r => videoRef.current.onloadedmetadata = r);
                videoRef.current.play();

                // 2. Instanciar QrScanner sobre el video ya activo
                if (!scannerRef.current) {
                    scannerRef.current = new QrScanner(
                        videoRef.current,
                        (result) => {
                            if (!mounted) return;
                            // Corrección: Validar explícitamente si viene como objeto detallado
                            let text = result;
                            if (result && typeof result === 'object' && 'data' in result) {
                                text = result.data;
                            }
                            
                            // Ignorar lecturas vacías
                            if (!text || typeof text !== 'string') return;
                            
                            handleQRScanSuccess(text);
                        },
                        {
                            maxScansPerSecond: 10, // 10 scans/seg es suficiente y satura menos
                            returnDetailedScanResult: true,
                            highlightScanRegion: true,
                            highlightCodeOutline: true,
                            // Permitir inversión (útil para QRs con fondo oscuro o iluminación rara)
                            inversionAttempts: 'attemptBoth', 
                            // Escanear TODO el video (más seguro que calcular región manual)
                            calculateScanRegion: undefined, 
                            alsoTryWithoutScanRegion: true
                        }
                    );
                }

                // Iniciar (QrScanner usará el video que ya le 'preparamos')
                await scannerRef.current.start();
                
                console.log('✅ QrScanner iniciado en HD');
                if (mounted) setScanMessage('✅ Cámara activa en HD. Nitidez máxima.');

            } catch (err) {
                console.error("❌ Error iniciando QrScanner HD:", err);
                if (mounted) {
                    setScanMessage(`❌ Error de cámara: ${err.message || err}`);
                    setScannerActive(false);
                }
            }
        } else {
            // Detener si no activo
            if (scannerRef.current) {
                scannerRef.current.stop();
                // No destruimos la instancia para reusarla rápido, solo paramos el stream
            }
            setScanMessage('');
        }
    };

    initScanner();

    return () => {
        mounted = false;
        // Limpieza real al desmontar componente
        if (scannerRef.current) {
            scannerRef.current.stop();
            scannerRef.current.destroy();
            scannerRef.current = null;
        }
    };
  }, [scannerActive, tomaIniciada]);

  // ------------------------------------------------------------------
  // SOPORTE PARA ESCÁNER USB (Modo Teclado HID)
  // ------------------------------------------------------------------
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleGlobalKeyDown = (e) => {
        // Ignorar si el foco está en un input normal (salvo si parece un escaneo muy rápido)
        // Pero para máxima compatibilidad, mejor capturamos todo lo que parezca JSON de QR
        
        const currentTime = Date.now();
        const gap = currentTime - lastKeyTime;

        // Si pasa mucho tiempo entre teclas (>100ms), reseteamos buffer (asumimos tipeo manual lento)
        if (gap > 100) {
            buffer = '';
        }
        
        lastKeyTime = currentTime;

        if (e.key === 'Enter') {
            // Intentar procesar buffer
            if (buffer.trim().startsWith('{') && buffer.trim().endsWith('}')) {
                try {
                    // Validar si es nuestro JSON
                     const parsed = JSON.parse(buffer);
                     if (parsed.tipo && parsed.id) {
                         // Es un QR válido!
                         console.log('🔫 Escáner USB detectado:', parsed);
                         handleQRScanSuccess(buffer);
                         
                         // Prevenir submit de formularios si estabamos en un input
                         e.preventDefault();
                         e.stopPropagation();
                         
                         // Limpiar inputs si se escribió algo
                         if (document.activeElement && document.activeElement.tagName === 'INPUT') {
                             document.activeElement.value = '';
                             setSearchTerm(''); // Limpiar nuestra búsqueda manual también
                         }
                     }
                } catch (err) {
                    // No es JSON válido, ignorar
                }
            }
            buffer = ''; // Reset post-enter
        } else if (e.key.length === 1) {
            // Acumular caracteres imprimibles
            buffer += e.key;
        }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [tomaIniciada]); // Dependencia necesaria para que handleQRScanSuccess funcione si cambia

  // Wrapper para el éxito del escaneo para evitar bucles
  const handleQRScanSuccess = useCallback((decodedText) => {
        if (isProcessingRef.current || lastScannedQRRef.current === decodedText) return;
        
        isProcessingRef.current = true;
        lastScannedQRRef.current = decodedText;
        setScanMessage('✅ Procesando QR...');
        
        if (navigator.vibrate) navigator.vibrate(200);

        handleQRScan(decodedText)
            .catch(err => setScanMessage('❌ Error: ' + err.message))
            .finally(() => {
                setTimeout(() => {
                    isProcessingRef.current = false;
                    lastScannedQRRef.current = '';
                }, 3000);
            });
  }, [alumnos, docentes, tipoEvento]); // Dependencias importantes para que handleQRScan tenga datos frescos

  // Ya no necesitamos startScanner explícito complejado, solo el toggle
  const toggleScanner = () => {
      setScannerActive(prev => !prev);
  };

  /* FUNCIÓN COMENTADA TEMPORALMENTE
  const startScannerOLD = async () => {
    console.log('🎥 Iniciando escáner QR con jsQR...');
    
    try {
      setScannerActive(true);
      scannerActiveRef.current = true;
      setScanMessage('Solicitando acceso a la cámara...');
      
      // Configuración de cámara
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('✅ Stream de cámara obtenido');
      
      streamRef.current = stream;
      
      if (!videoRef.current) {
        throw new Error('Video element no disponible');
      }
      
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute('playsinline', 'true');
      videoRef.current.setAttribute('autoplay', 'true');
      
      // Esperar a que el video esté listo
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout')), 5000);
        
        videoRef.current.onloadedmetadata = () => {
          clearTimeout(timeout);
          console.log('✅ Video listo:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
          videoRef.current.play().then(resolve).catch(reject);
        };
      });
      
      setScanMessage('✅ Cámara activa. Coloca el QR frente a la cámara...');
      
      // Inicializar escaneo con jsQR
      let scanAttempts = 0;
      let lastScanTime = 0;
      
      // Función de escaneo con jsQR
      const scanFrame = async () => {
        if (!videoRef.current || !canvasRef.current || !scannerActiveRef.current) {
          return;
        }
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
          return;
        }
        
        try {
          scanAttempts++;
          
          // Configurar canvas con dimensiones exactas del video
          const width = video.videoWidth;
          const height = video.videoHeight;
          
          if (width === 0 || height === 0) return;
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          // Dibujar frame actual
          ctx.drawImage(video, 0, 0, width, height);
          
          // Log cada 30 intentos
          if (scanAttempts % 30 === 0) {
            console.log(`🔍 Intento ${scanAttempts} - ${width}x${height}`);
          }
          
          // Intentar decodificar desde el canvas
          try {
            const result = await codeReader.decodeFromCanvas(canvas);
            
            if (result && result.getText()) {
              isProcessing = true;
              const now = Date.now();
              
              // Debounce: evitar lecturas duplicadas
              if (now - lastScanTime < 3000) {
                isProcessing = false;
                return;
              }
              
              lastScanTime = now;
              const qrData = result.getText();
              
              console.log('🎉🎉🎉 ¡QR DETECTADO! 🎉🎉🎉');
              console.log('📱 Intento #:', scanAttempts);
              console.log('📱 Contenido:', qrData);
              console.log('� Formato:', result.getBarcodeFormat());
              
              setScanMessage('✅ ¡QR DETECTADO! Procesando...');
              
              // Vibrar si está disponible
              if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
              }
              
              // Procesar el QR
              try {
                await handleQRScan(qrData);
                setScanMessage('✅ ¡Registro exitoso! Listo para escanear otro...');
              } catch (err) {
                console.error('❌ Error procesando:', err);
                setScanMessage(`❌ Error: ${err.message}`);
              }
              
              // Pausa de 2 segundos antes de continuar
              await new Promise(resolve => setTimeout(resolve, 2000));
              setScanMessage('✅ Cámara activa. Coloca el QR frente a la cámara...');
              isProcessing = false;
            }
          } catch (decodeError) {
            // Ignorar NotFoundException (es normal cuando no hay QR)
            if (decodeError.name !== 'NotFoundException') {
              if (scanAttempts % 100 === 0) {
                console.warn('⚠️ Decode warning:', decodeError.name);
              }
            }
          }
        } catch (error) {
          console.error('❌ Error en scanFrame:', error);
        }
      };
      
      // Iniciar escaneo cada 150ms (más agresivo)
      console.log('🚀 Iniciando escaneo cada 150ms');
      scanIntervalRef.current = setInterval(scanFrame, 150);
      
      console.log('✅ Escáner QR iniciado correctamente');
      
    } catch (error) {
      console.error('❌ Error iniciando escáner:', error);
      setScanMessage(`❌ Error: ${error.message}`);
      stopScanner();
      
      if (error.name === 'NotAllowedError') {
        alert('⚠️ Permisos de cámara denegados. Permite el acceso a la cámara.');
      } else if (error.name === 'NotFoundError') {
        alert('⚠️ No se encontró cámara. Verifica tu webcam.');
      }
    }
  };
  */ // FIN DEL COMENTARIO

  // stopScanner eliminado - el useEffect maneja la limpieza automáticamente al cambiar scannerActive
  const stopScanner = () => {
    console.log('🛑 Detener escaneo solicitado');
    setScannerActive(false);
  };
  
  /* FUNCIÓN STOP COMENTADA
  const stopScannerOLD = () => {
    console.log('🛑 Deteniendo escáner...');
    
    // Detener el intervalo de escaneo
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
      console.log('✅ Intervalo de escaneo detenido');
    }
    
    // Limpiar el lector
    if (codeReaderRef.current) {
      codeReaderRef.current = null;
      console.log('✅ CodeReader limpiado');
    }
    
    // Detener todos los tracks del stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('✅ Track detenido:', track.kind, track.label);
      });
      streamRef.current = null;
    }
    
    // Limpiar el video element
    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => {
          track.stop();
          console.log('✅ Track del video detenido:', track.kind);
        });
      }
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
    
    setScannerActive(false);
    scannerActiveRef.current = false; // Actualizar la ref también
    setScanMessage('');
    console.log('✅ Escáner detenido completamente');
  };
  */ // FIN DEL COMENTARIO stopScannerOLD

  const handleQRScan = async (qrData) => {
    let parsedData = null;
    let personaData = null;

    try {
      console.log('🔍 handleQRScan recibido:', qrData);
      
      // Parsear QR JSON: {"tipo":"alumno","id":1,"carnet":"A001"}
      try {
        parsedData = JSON.parse(qrData);
        console.log('✅ QR parseado:', parsedData);
      } catch (e) {
        console.log('⚠️ No es JSON, intentando formato antiguo...');
        // Intentar formato antiguo: ALUMNO-{id} o DOCENTE-{id}
        const alumnoMatch = qrData.match(/ALUMNO-(\d+)/);
        const docenteMatch = qrData.match(/DOCENTE-(\d+)/);
        
        if (alumnoMatch) {
          parsedData = { tipo: 'alumno', id: parseInt(alumnoMatch[1]) };
        } else if (docenteMatch) {
          parsedData = { tipo: 'docente', id: parseInt(docenteMatch[1]) };
        } else {
          console.error('❌ Formato de QR no reconocido');
          setScanMessage('❌ QR inválido');
          return;
        }
      }

      if (!parsedData.tipo || !parsedData.id) {
        console.error('❌ Datos incompletos:', parsedData);
        setScanMessage('❌ QR incompleto');
        return;
      }

      // PRE-CALCULO: Buscar datos de la persona ANTES de enviar
      if (parsedData.tipo === 'alumno') {
        const alumno = alumnos.find(a => a.id === parseInt(parsedData.id));
        if (!alumno) {
          toast.error('Alumno no encontrado');
          setScanMessage('❌ Alumno no encontrado');
          return;
        }
        if (alumno.estado === 'inactivo' || alumno.estado === 'baja') {
          toast.error(`⚠️ El alumno ${alumno.nombres} ${alumno.apellidos} está INACTIVO`);
          setScanMessage(`❌ Usuario INACTIVO: ${alumno.nombres}`);
          return;
        }
        personaData = {
          tipo: 'Alumno',
          nombres: alumno?.nombre || alumno?.nombres || 'Desconocido',
          apellidos: alumno?.apellido || alumno?.apellidos || '',
          carnet: alumno?.carnet || parsedData.carnet || `ID: ${parsedData.id}`,
          grado: alumno?.grado || 'N/A',
          seccion: alumno?.seccion || 'N/A',
          foto_url: getUserPhotoUrl('alumno', alumno?.carnet, alumno)
        };
      } else {
        const docente = docentes.find(d => d.id === parseInt(parsedData.id));
        if (!docente) {
          toast.error('Docente no encontrado');
          setScanMessage('❌ Docente no encontrado');
          return;
        }
        if (docente.estado === 'inactivo' || docente.estado === 'baja') {
          toast.error(`⚠️ El docente ${docente.nombres} ${docente.apellidos} está INACTIVO`);
          setScanMessage(`❌ Usuario INACTIVO: ${docente.nombres}`);
          return;
        }
        personaData = {
          tipo: docente?.cargo || 'Docente',
          nombres: docente?.nombre || docente?.nombres || 'Desconocido',
          apellidos: docente?.apellido || docente?.apellidos || '',
          carnet: docente?.carnet || parsedData.carnet || `ID: ${parsedData.id}`,
          cargo: docente?.cargo || 'N/A',
          departamento: docente?.departamento || 'N/A',
          foto_url: getUserPhotoUrl('personal', docente?.carnet, docente)
        };
      }

      const requestData = {
        tipo_evento: tipoEvento,
        origen: 'QR'
      };

      if (parsedData.tipo === 'alumno') {
        requestData.alumno_id = parseInt(parsedData.id);
      } else if (parsedData.tipo === 'docente' || parsedData.tipo === 'personal') {
        requestData.personal_id = parseInt(parsedData.id);
      } else {
        console.error('❌ Tipo desconocido:', parsedData.tipo);
        return;
      }
      
      console.log('📤 Enviando a backend:', requestData);
      
      // ENVIAR REQUEST
      const response = await client.post('/asistencias', requestData);
      console.log('✅ Respuesta del servidor:', response.data);

      // ÉXITO
      playBeepSound();

      // Mostrar modal ÉXITO
      setModalData({
        ...personaData,
        tipoEvento: tipoEvento === 'entrada' ? 'ENTRADA' : 'SALIDA',
        hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        isError: false
      });
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
      }, 3000);

      setScanMessage(`✅ ${tipoEvento === 'entrada' ? 'Entrada' : 'Salida'} registrada - ${parsedData.carnet || `ID: ${parsedData.id}`}`);
      
      setTimeout(() => setScanMessage('✅ Cámara lista. Escaneando códigos QR...'), 2000);
      fetchAsistenciasHoy();

    } catch (error) {
      setShowModal(false); 
      console.error('❌ Error en handleQRScan:', error);

      if (error.response?.status === 409) {
        // DUPLICADO: Mostrar Modal de Error
        const { registroExistente } = error.response.data;
        
        // Si tenemos los datos de la persona (deberíamos tenerlos por el pre-cálculo)
        if (personaData) {
            setModalData({
                ...personaData,
                tipoEvento: tipoEvento === 'entrada' ? 'ENTRADA' : 'SALIDA',
                hora: registroExistente?.hora || 'N/A',
                isError: true,
                errorMessage: `Esta persona ya registró su ${tipoEvento} hoy a las ${registroExistente?.hora || '??:??'}.`
            });
            setShowModal(true);
            playErrorSound();
            setTimeout(() => { setShowModal(false); }, 4000); // Un poco más de tiempo para leer error
        } else {
            // Fallback si no hay personaData
             const tipoEventoTexto = tipoEvento === 'entrada' ? 'entrada' : 'salida';
             toast.error(
              `⚠️ Ya registró ${tipoEventoTexto} hoy a las ${registroExistente?.hora || 'N/A'}`,
              { duration: 5000 }
            );
        }
        
        setScanMessage(`❌ DUPLICADO: Ya registrada`);
      } else {
        setScanMessage('❌ Error: ' + (error.response?.data?.error || error.message));
        toast.error('Error procesando QR');
      }
      
      setTimeout(() => setScanMessage('✅ Cámara lista. Escaneando códigos QR...'), 3000);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  // Formatear fecha con ceros a la izquierda (25/01/2026)
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Título del panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <Clock className="text-blue-600" size={36} />
          Panel de Asistencias
        </h2>
        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Calendar size={18} className="text-blue-500" />
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </motion.div>

      {/* Estadísticas del Día */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <StatCard
            icon={<TrendingUp />}
            title="Total Registros"
            value={stats.total || 0}
            color="bg-blue-500"
          />
          <StatCard
            icon={<UserCheck />}
            title="Entradas"
            value={stats.entradas || 0}
            color="bg-green-500"
          />
          <StatCard
            icon={<UserX />}
            title="Salidas"
            value={stats.salidas || 0}
            color="bg-orange-500"
          />
          <StatCard
            icon={<Clock />}
            title="Puntuales"
            value={stats.puntuales || 0}
            color="bg-purple-500"
          />
          <StatCard
            icon={<Clock />}
            title="Tarde"
            value={stats.tardes || 0}
            color="bg-red-500"
          />
          <StatCard
            icon={<UserX />}
            title="Ausentes"
            value={(() => {
              // Calcular ausentes correctamente
              if (asistenciasHoy.length === 0) return 0;
              
              const asistidos = new Set([
                ...asistenciasHoy.map(a => a.alumno_id),
                ...asistenciasHoy.map(a => a.docente_id),
                ...asistenciasHoy.map(a => a.personal_id)
              ]);
              const totalPersonas = [...alumnos, ...docentes].filter(p => p.id).length;
              const ausentes = [...alumnos, ...docentes].filter(p => !asistidos.has(p.id)).length;
              return ausentes;
            })()}
            color="bg-gray-500 text-white"
          />
        </div>
      )}

      {/* Botón de iniciar/finalizar centrado a la izquierda, debajo del dashboard y encima de escanear QR */}
      <div className="flex items-center justify-between mb-4">
        <div>
          {!tomaIniciada ? (
            <button
              className="min-w-[220px] text-lg bg-green-600 hover:bg-green-700 font-bold py-3 px-6 rounded-xl shadow transition text-white"
              onClick={() => {
                setTomaIniciada(true);
                setScannerActive(false);
                setScanMessage('');
              }}
            >
              Iniciar toma de asistencias
            </button>
          ) : (
            <button
              className="min-w-[220px] text-lg bg-orange-600 hover:bg-orange-700 font-bold py-3 px-6 rounded-xl shadow transition text-white"
              onClick={tipoEvento === 'entrada' ? handleFinalizarTomaAsistencias : handleFinalizarTomaSalidas}
            >
              {tipoEvento === 'entrada' ? 'Finalizar toma de asistencias' : 'Finalizar toma de salidas'}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTipoEvento('entrada')}
            className={`min-w-[120px] text-lg font-bold px-4 py-2 rounded-xl shadow transition-colors ${
              tipoEvento === 'entrada'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${!tomaIniciada ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!tomaIniciada}
          >
            Entrada
          </button>
          <button
            type="button"
            onClick={() => setTipoEvento('salida')}
            className={`min-w-[120px] text-lg font-bold px-4 py-2 rounded-xl shadow transition-colors ${
              tipoEvento === 'salida'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } ${!tomaIniciada ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!tomaIniciada}
          >
            Salida
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch ${!tomaIniciada ? 'pointer-events-none opacity-50' : ''}`}> 
        {/* Columna Izquierda: ESCÁNER QR */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <QrCode className="text-blue-600" size={24} />
              Escanear QR
            </h3>
            <button
               className={`text-sm px-3 py-1 rounded-lg transition font-medium ${scannerActive ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400'}`}
               onClick={toggleScanner}
               disabled={!tomaIniciada}
            >
              {scannerActive ? 'Desactivar' : 'Activar'}
            </button>
          </div>

          {/* CONTENEDOR DE VIDEO: h-80 (320px) fijo, w-full */}
          {/* Condicional de fondo: Negro si activo, Gris suave si inactivo */}
          <div className={`relative w-full h-80 rounded-xl overflow-hidden flex items-center justify-center ${scannerActive ? 'bg-black' : 'bg-gray-100 dark:bg-gray-700'}`}>
            
            {scannerActive && tomaIniciada ? (
                /* Video nativo para qr-scanner */
                <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover"
                    muted 
                    playsInline
                />
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <QrCode size={60} className="mb-4 opacity-50" />
                    <p className="font-medium text-sm">Cámara desactivada</p>
                </div>
            )}
            
            {/* Overlay nativo de qr-scanner se maneja internamente o es invisible */}
          </div>
          
          {/* Texto de ayuda opcional debajo del video */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
            {scannerActive ? 'Coloca el código QR dentro del marco' : 'Presiona \"Activar\" para iniciar el escaneo'}
          </p>

        </motion.div>

        {/* Columna Derecha: Registro Manual */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full"
        >
          <div className="mb-5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <UserCheck className="text-green-600" size={24} />
                Registro Manual
            </h3>
          </div>

          <form onSubmit={handleRegistrarAsistencia} className="flex flex-col gap-5">
            {/* Tipo detectado automáticamente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo Detectado
              </label>
              <div className={`w-full border rounded-lg px-4 py-3 font-semibold text-center text-lg transition-colors ${
                tipoPersona === 'alumno' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700' 
                  : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
              }`}>
                {tipoPersona === 'alumno' ? '🎓 Alumno' : `👨‍🏫 ${detectedCargo || 'Docente'}`}
              </div>
            </div>

            {/* Input Búsqueda */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                <Search size={16} className="inline mr-1" />
                Carnet o Nombre (detecta automáticamente)
              </label>
              <input
                type="text"
                placeholder="Ej: 2023-001..."
                value={searchTerm}
                onChange={(e) => {
                  const term = e.target.value;
                  setSearchTerm(term);
                  
                  if (term.trim() === '') {
                    setSelectedAlumno('');
                    setSelectedDocente('');
                    setShowSuggestions(false);
                  } else {
                    setShowSuggestions(true);
                  }
                  
                  // Auto-detectar tipo buscando en ambas listas
                  if (term.length > 0) {
                    const foundAlumno = alumnos.find(a =>
                      a.nombres.toLowerCase().includes(term.toLowerCase()) ||
                      a.apellidos.toLowerCase().includes(term.toLowerCase()) ||
                      a.carnet.toLowerCase().includes(term.toLowerCase())
                    );
                    
                    const foundDocente = docentes.find(d =>
                      d.nombres.toLowerCase().includes(term.toLowerCase()) ||
                      d.apellidos.toLowerCase().includes(term.toLowerCase()) ||
                      d.carnet.toLowerCase().includes(term.toLowerCase())
                    );

                    // Priorizar por orden de aparición
                    if (foundAlumno && !foundDocente) {
                      setTipoPersona('alumno');
                    } else if (foundDocente && !foundAlumno) {
                      setTipoPersona('docente');
                      setDetectedCargo(foundDocente.cargo || 'Docente'); // Actualizar cargo detectado
                    }
                  }
                }}
                className="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition dark:text-white"
              />
              
              {searchTerm && showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 z-50 shadow-xl">
                  {/* Mostrar resultados combinados (optimizado con useMemo) */}
                  {/* Alumnos */}
                  {alumnosFiltrados.map((alumno) => (
                      <button
                        key={`alumno-${alumno.id}`}
                        type="button"
                        onClick={() => {
                          setTipoPersona('alumno');
                          setSelectedAlumno(alumno.id);
                          setSelectedDocente('');
                          setSearchTerm(`${alumno.nombres} ${alumno.apellidos} (${alumno.carnet})`);
                          setShowSuggestions(false); // Ocultar sugerencias al seleccionar
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition border-l-4 border-blue-500"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-blue-600">🎓 ALUMNO</span>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{alumno.nombres} {alumno.apellidos}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {alumno.carnet} - {alumno.grado} - {alumno.jornada}
                        </div>
                      </button>
                    ))}
                  
                  {/* Docentes (optimizado con useMemo) */}
                  {docentesFiltrados.map((docente) => (
                      <button
                        key={`docente-${docente.id}`}
                        type="button"
                        onClick={() => {
                          setTipoPersona('docente');
                          setSelectedDocente(docente.id);
                          setSelectedAlumno('');
                          setSearchTerm(`${docente.nombres} ${docente.apellidos} (${docente.carnet})`);
                          setShowSuggestions(false);
                          setDetectedCargo(docente.cargo || 'Docente'); // Fijar cargo al seleccionar
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/30 transition border-l-4 border-green-500"
                      >
                      <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-green-600">
                            👨‍🏫 {docente.cargo ? docente.cargo.toUpperCase() : 'DOCENTE'}
                          </span>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{docente.nombres} {docente.apellidos}</div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {docente.carnet} - {docente.jornada}
                        </div>
                      </button>
                    ))}
                  
                  {/* Sin resultados */}
                  {alumnos.filter(a =>
                      a.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      a.carnet.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length === 0 &&
                    docentes.filter(d =>
                      d.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      d.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      d.carnet.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length === 0 && (
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      No se encontraron resultados
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-bold shadow-md shadow-emerald-200 dark:shadow-none transition active:scale-95 ${(!tomaIniciada || (!selectedAlumno && !selectedDocente)) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!tomaIniciada || (!selectedAlumno && !selectedDocente)}
            >
              Registrar {tipoEvento === 'entrada' ? 'Entrada' : 'Salida'}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Asistencias del Día - Historial Unificado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Clock className="text-blue-600" size={24} />
            Asistencias de Hoy
          </h3>
          <div className="flex gap-2 items-center">
            {/* Toggle para mostrar ausentes */}
            {asistenciasHoy.length > 0 && (
              <button
                onClick={() => setMostrarAusentes(!mostrarAusentes)}
                className={`text-sm px-3 py-1.5 rounded-lg font-medium transition ${
                  mostrarAusentes
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {mostrarAusentes ? '✓ Mostrando Ausentes' : 'Mostrar Ausentes'}
              </button>
            )}
            <button
              onClick={fetchAsistenciasHoy}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Actualizar
            </button>
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={5} columns={10} />
        ) : (asistenciasHoy.length === 0) ? (
          <div className="text-center py-8 text-gray-500">
            No hay asistencias registradas hoy
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="text-left px-3 py-2 text-gray-700 dark:text-gray-300">Fecha</th>
                  <th className="text-left px-3 py-2 text-gray-700 dark:text-gray-300">Hora</th>
                  <th className="text-left px-3 py-2 text-gray-700 dark:text-gray-300">Carnet</th>
                  <th className="text-left px-3 py-2 text-gray-700 dark:text-gray-300">Nombre Completo</th>
                  <th className="text-center px-3 py-2 text-gray-700 dark:text-gray-300">Tipo / Grado</th>
                  <th className="text-center px-3 py-2 text-gray-700 dark:text-gray-300">Sección</th>
                  <th className="text-center px-3 py-2 text-gray-700 dark:text-gray-300">Jornada</th>
                  <th className="text-center px-3 py-2 text-gray-700 dark:text-gray-300">Evento</th>
                  <th className="text-center px-3 py-2 text-gray-700 dark:text-gray-300">Origen</th>
                  <th className="text-center px-3 py-2 text-gray-700 dark:text-gray-300">Estado</th>
                </tr>
              </thead>
              <tbody>
                {/* Asistencias registradas */}
                {asistenciasHoy.map((asistencia) => {
                  const persona = asistencia.alumno || asistencia.docente || asistencia.personal;
                  const esAlumno = !!asistencia.alumno;
                  const tipoYGrado = esAlumno 
                    ? { tipo: 'Alumno', detalle: persona?.grado }
                    : { tipo: 'Personal', detalle: persona?.cargo || 'Personal' };
                  
                  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '-';
                  
                  return (
                    <motion.tr
                      key={asistencia.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                    >
                      <td className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                        {formatDate(asistencia.timestamp || asistencia.created_at)}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">
                        {formatTime(asistencia.timestamp || asistencia.created_at)}
                      </td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-400 font-medium">
                        {persona?.carnet}
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                        {persona?.nombres || persona?.nombre} {persona?.apellidos || persona?.apellido}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            esAlumno
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}>
                            {tipoYGrado.tipo}
                          </span>
                          {tipoYGrado.detalle && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              {tipoYGrado.detalle}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center font-bold text-gray-700 dark:text-gray-300">
                        {esAlumno ? (persona?.seccion || '-') : '-'}
                      </td>
                      <td className="px-3 py-2 text-center font-medium text-gray-700 dark:text-gray-300">
                        {capitalize(persona?.jornada || 'Matutina')}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          asistencia.tipo_evento === 'entrada'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                        }`}>
                          {asistencia.tipo_evento === 'entrada' ? 'ENTRADA' : 'SALIDA'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          asistencia.origen === 'QR'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {asistencia.origen === 'QR' ? '📱 QR' : '✍️ Manual'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        {asistencia.tipo_evento === 'salida' ? (
                          <span className="text-gray-400 font-bold">-</span>
                        ) : asistencia.estado_puntualidad && (
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            asistencia.estado_puntualidad === 'puntual'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {asistencia.estado_puntualidad === 'puntual' ? '✓ Puntual' : '⚠ Tarde'}
                          </span>
                        )}
                      </td>
                    </motion.tr>
                    );
                  })}
                
                  {/* Ausentes - Solo mostrar si hay asistencias Y toggle activado */}
                  {mostrarAusentes && asistenciasHoy.length > 0 && (() => {
                    // Calcular ausentes
                    const asistidosIds = new Set([
                      ...asistenciasHoy.map(a => a.alumno_id),
                      ...asistenciasHoy.map(a => a.personal_id)
                    ]);
                    const todos = [...alumnos, ...docentes];
                    const ausentes = todos.filter(p => p && p.id && !asistidosIds.has(p.id));

                    return ausentes.map((persona) => {
                      const esAlumno = alumnos.some(a => a.id === persona.id);
                      const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '-';

                      return (
                        <motion.tr
                          key={`ausente-${persona.id}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition bg-red-50/30 dark:bg-red-900/10"
                        >
                          <td className="px-3 py-2 font-medium text-gray-500 dark:text-gray-400">
                            {formatDate(new Date())}
                          </td>
                          <td className="px-3 py-2 font-medium text-gray-500 dark:text-gray-400">
                            -
                          </td>
                          <td className="px-3 py-2 text-gray-600 dark:text-gray-400 font-medium">
                            {persona.carnet}
                          </td>
                          <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">
                            {persona.nombres} {persona.apellidos}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex flex-col items-center gap-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                esAlumno
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }`}>
                                {esAlumno ? 'Alumno' : 'Personal'}
                              </span>
                              {(persona.grado || persona.cargo) && (
                                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                  {persona.grado || persona.cargo}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-center font-bold text-gray-700 dark:text-gray-300">
                            {esAlumno ? (persona.seccion || '-') : '-'}
                          </td>
                          <td className="px-3 py-2 text-center font-medium text-gray-700 dark:text-gray-300">
                            {capitalize(persona.jornada || 'Matutina')}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                              AUSENTE
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className="text-gray-400 font-bold">-</span>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className="text-gray-400 font-bold">-</span>
                          </td>
                        </motion.tr>
                      );
                    });
                  })()}
                </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Modal de confirmación de asistencia */}
      {showModal && modalData && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icono de éxito y foto de usuario */}
            <div className="flex flex-col items-center mb-6">
              {/* Badge de tipo de evento */}
              <div className={`mb-4 px-4 py-2 rounded-full ${
                modalData.isError 
                  ? 'bg-red-100 text-red-700'
                  : (modalData.tipoEvento === 'ENTRADA' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700')
              }`}>
                <span className="text-sm font-bold flex items-center gap-2">
                  {modalData.isError ? (
                    <><XCircle size={18} /> YA REGISTRADO</>
                  ) : modalData.tipoEvento === 'ENTRADA' ? (
                    <><UserCheck size={18} /> ENTRADA</>
                  ) : (
                    <><UserX size={18} /> SALIDA</>
                  )}
                </span>
              </div>

              {/* Foto del usuario */}
              <div className="relative mb-4">
                <div className={`w-32 h-32 rounded-full overflow-hidden border-4 shadow-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${
                  modalData.isError ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-600'
                }`}>
                  {modalData.foto_url ? (
                    <img 
                      src={modalData.foto_url} 
                      alt={`${modalData.nombres} ${modalData.apellidos}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback a emoji si la imagen no carga
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-full flex items-center justify-center text-6xl"
                    style={{ display: modalData.foto_url ? 'none' : 'flex' }}
                  >
                    {modalData.tipo === 'Alumno' ? '👨‍🎓' : '👨‍🏫'}
                  </div>
                </div>
                {/* Indicador de éxito/error */}
                <div className={`absolute -bottom-2 -right-2 rounded-full p-2 ${
                  modalData.isError 
                    ? 'bg-red-500' 
                    : (modalData.tipoEvento === 'ENTRADA' ? 'bg-green-500' : 'bg-orange-500')
                }`}>
                  {modalData.isError ? (
                    <XCircle className="text-white w-6 h-6" />
                  ) : (
                    <UserCheck className="text-white w-6 h-6" />
                  )}
                </div>
              </div>
            </div>

            {/* Información de la persona */}
            <div className="space-y-3 text-center mb-6">
              {/* Nombre completo */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {modalData.nombres || modalData.nombre} {modalData.apellidos || modalData.apellido}
                </h3>
              </div>

              {/* Carnet */}
              <div className="flex items-center justify-center gap-2">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-mono font-semibold text-sm">
                  {modalData.carnet}
                </span>
              </div>

              {/* Tipo y detalles específicos */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                {modalData.grado ? (
                  // Para alumnos
                  <div className="flex justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 dark:text-gray-400">Grado:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{modalData.grado}</span>
                    </div>
                    {modalData.seccion && modalData.seccion !== 'N/A' && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 dark:text-gray-400">Sección:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{modalData.seccion}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  // Para personal
                  <div className="flex flex-col items-center gap-1 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 dark:text-gray-400">Cargo:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{modalData.cargo || modalData.tipo}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Hora de registro o MEnsaje Error */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                {modalData.isError ? (
                  <div className="animate-pulse">
                    <p className="text-red-500 text-sm font-bold uppercase tracking-wider mb-1">
                      REGISTRO PREVIO DETECTADO
                    </p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {modalData.errorMessage || `Ya marcó a las ${modalData.hora}`}
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Hora de registro</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{modalData.hora}</p>
                  </>
                )}
              </div>
            </div>

            {/* Botón de cerrar */}
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>,
        document.body
      )}

      {/* Modal de Personas Sin Salida */}
      {mostrarModalSinSalida && (
        <ModalSinSalida
          personas={personasSinSalida}
          fecha={new Date().toISOString().split('T')[0]}
          onCerrar={() => {
            setMostrarModalSinSalida(false);
            setTomaIniciada(false);
          }}
          onActualizar={fetchAsistenciasHoy}
        />
      )}

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {/* Modal de Ausentes al finalizar */}
      {showAusentesModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header Modal */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <UserX className="text-orange-500" />
                Resumen de Inasistencias
              </h3>
              <button
                onClick={() => setShowAusentesModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Content Modal */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  ℹ️ Revise la lista de personas que no registraron su asistencia hoy. Puede ingresar una justificación si corresponde.
                </p>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Persona</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tipo/Grado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Justificación</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {(() => {
                        const asistidosIds = new Set([
                          ...asistenciasHoy.map(a => a.alumno_id),
                          ...asistenciasHoy.map(a => a.docente_id),
                          ...asistenciasHoy.map(a => a.personal_id)
                        ]);
                        const todos = [...alumnos, ...docentes];
                        const ausentes = todos.filter(p => !asistidosIds.has(p.id));
                        
                        if (ausentes.length === 0) {
                          return (
                            <tr>
                              <td colSpan="3" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                <UserCheck className="mx-auto mb-2 text-green-500" size={24} />
                                ¡Excelente! Todos han registrado asistencia hoy.
                              </td>
                            </tr>
                          );
                        }

                        return ausentes.map((persona) => (
                          <tr key={persona.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {persona.nombres} {persona.apellidos}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                {persona.carnet}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              {persona.grado || persona.cargo || 'Personal'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                placeholder="Escribir justificación..."
                                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                                onChange={(e) => {
                                  // Aquí podríamos guardar en un estado local temporal 'justificaciones' 
                                  // setJustificaciones(prev => ({...prev, [persona.id]: e.target.value}))
                                }}
                              />
                            </td>
                          </tr>
                        ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900/50">
              <button
                onClick={() => setShowAusentesModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-lg transition font-medium shadow-sm"
              >
                Volver
              </button>
              <button
                onClick={() => {
                  setShowAusentesModal(false);
                  window.location.href = '/reportes?tab=justificaciones';
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium shadow-md hover:translate-y-0.5"
              >
                Justificar Ausencias
              </button>
              <button
                onClick={() => {
                  setTomaIniciada(false);
                  setScannerActive(false);
                  setScanMessage('');
                  setShowAusentesModal(false);
                  toast.success('Toma de asistencias finalizada correctamente');
                }}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition font-bold shadow-lg hover:translate-y-0.5"
              >
                Confirmar y Finalizar
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${color} text-white rounded-lg shadow-lg p-6`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </motion.div>
  );
}

