import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, SkipForward, CheckCircle2, AlertCircle, User, SkipBack } from 'lucide-react';
import GenderAvatar from './GenderAvatar';
import toast from 'react-hot-toast';
import CardAusente from './CardAusente';
import ModalJustificacionRapida from './ModalJustificacionRapida';
import client from '../api/client';
import './RevisionRapida.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

export default function RevisionRapidaView({ fecha, onVolver }) {
  const [pendientes, setPendientes] = useState([]);
  const [revisados, setRevisados] = useState([]);
  const [personaActual, setPersonaActual] = useState(null);
  const [mostrarConfetti, setMostrarConfetti] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalAusentes, setTotalAusentes] = useState(0);
  const [showConfirmOmitir, setShowConfirmOmitir] = useState(false);

  useEffect(() => {
    const fetchAusentes = async () => {
      try {
        const [ausentesRes, excusasRes] = await Promise.all([
          client.get('/asistencias/ausentes'),
          client.get('/excusas')
        ]);
        
        const { ausentes } = ausentesRes.data;
        const todasExcusas = excusasRes.data.excusas || [];
        
        // Obtener fecha local de hoy para filtrar las excusas solo de hoy
        const hoy = new Date();
        const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
        
        const excusasDeHoy = todasExcusas.filter(e => {
          if (!e.fecha_ausencia) return false;
          // Normalizar formato de fecha desde UTC a YYYY-MM-DD local
          const fechaAbs = new Date(e.fecha_ausencia);
          const eStr = `${fechaAbs.getUTCFullYear()}-${String(fechaAbs.getUTCMonth() + 1).padStart(2, '0')}-${String(fechaAbs.getUTCDate()).padStart(2, '0')}`;
          return eStr === hoyStr;
        });

        // Filtrar aquellos que ya tienen justificación para HOY
        const ausentesNoJustificados = (ausentes || []).filter(persona => {
          return !excusasDeHoy.some(e => {
             if (persona.tipo === 'alumno' && e.alumno_id === persona.id) return true;
             if (persona.tipo === 'personal' && e.personal_id === persona.id) return true;
             return false;
          });
        });

        setPendientes(ausentesNoJustificados);
        setTotalAusentes(ausentesNoJustificados.length);
      } catch (error) {
        console.error('Error loading ausentes in Kanban:', error);
        toast.error('Error al cargar ausentes');
      } finally {
        setLoading(false);
      }
    };
    fetchAusentes();
  }, []);

  const progreso = totalAusentes === 0 ? 0 : Math.round((revisados.length / totalAusentes) * 100);

  useEffect(() => {
    // Confetti al completar todos
    if (pendientes.length === 0 && revisados.length > 0 && totalAusentes > 0) {
      setMostrarConfetti(true);
      toast.success('🎉 ¡Revisión completada!');
      setTimeout(() => setMostrarConfetti(false), 3000);
    }
  }, [pendientes.length, revisados.length, totalAusentes]);

  const handleJustificar = (persona) => {
    setPersonaActual(persona);
  };

  const handleOmitir = (persona) => {
    moverARevisados(persona, 'omitido');
    toast('⏭️ Marcado para revisar después', { icon: '📝' });
  };

  const moverARevisados = (persona, estadoRevision) => {
    setPendientes(prev => prev.filter(p => p.id !== persona.id));
    setRevisados(prev => [...prev, { ...persona, estadoRevision }]);
  };

  const handleGuardarJustificacion = (persona) => {
    moverARevisados(persona, 'justificado');
    setPersonaActual(null);
    
    // Si quedan pendientes, mostrar el siguiente
    const siguientePendiente = pendientes.find(p => p.id !== persona.id);
    if (siguientePendiente) {
      setTimeout(() => setPersonaActual(siguientePendiente), 300);
    }
  };

  const handleOmitirRevision = () => {
    setShowConfirmOmitir(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-blue-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 font-medium">Cargando ausentes...</span>
      </div>
    );
  }

  return (
    <div className="revision-rapida-container">
      {/* Confetti Effect */}
      {mostrarConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="revision-header">
        <div className="header-top">
          <div className="header-left">
            <AlertCircle className="text-blue-600" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Revisión de Ausencias - {new Date(fecha).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                ⚠️ {totalAusentes} persona{totalAusentes !== 1 ? 's' : ''} no marcaron asistencia hoy
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button
              onClick={onVolver}
              className="btn-secondary flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Volver a Asistencias
            </button>
            <button
              onClick={handleOmitirRevision}
              className="btn-outline flex items-center gap-2"
            >
              <SkipForward size={18} />
              Omitir Revisión
            </button>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="progress-section">
          <div className="progress-info">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Progreso: {revisados.length} de {totalAusentes} revisados
            </span>
            <span className="text-sm font-bold text-blue-600">
              {progreso}%
            </span>
          </div>
          <div className="progress-bar-container">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progreso}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Grid Kanban */}
      <div className="kanban-grid">
        {/* Columna Pendientes */}
        <div className="kanban-column">
          <div className="column-header pendientes">
            <AlertCircle size={20} />
            <h3>PENDIENTES DE REVISAR ({pendientes.length})</h3>
          </div>
          <div className="cards-container">
            <AnimatePresence>
              {pendientes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="empty-state-small"
                >
                  <CheckCircle2 size={48} className="text-green-500" />
                  <p className="text-gray-600 dark:text-gray-400">
                    ¡Todos revisados!
                  </p>
                </motion.div>
              ) : (
                pendientes.map((persona) => (
                  <CardAusente
                    key={persona.id}
                    persona={persona}
                    onJustificar={handleJustificar}
                    onOmitir={handleOmitir}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Columna Revisados */}
        <div className="kanban-column">
          <div className="column-header revisados">
            <CheckCircle2 size={20} />
            <h3>✅ REVISADOS ({revisados.length})</h3>
          </div>
          <div className="cards-container">
            <AnimatePresence>
              {revisados.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="empty-state-small"
                >
                  <GenderAvatar size={48} className="text-gray-300" />
                  <p className="text-gray-400 dark:text-gray-500">
                    Se llenarán conforme se procesen
                  </p>
                </motion.div>
              ) : (
                revisados.map((persona) => {
                  const getFotoUrl = () => {
                    if (persona.foto_path) {
                      return persona.foto_path.startsWith('http') 
                        ? persona.foto_path 
                        : `${BASE_URL}/uploads/${persona.foto_path}`;
                    }
                    if (!persona.carnet) return null;
                    const cleanCarnet = String(persona.carnet).trim();
                    const tipo = persona.tipo;
                    
                    let directory = '';
                    let prefix = '';
                    
                    if (tipo === 'alumno' || tipo === 'Alumno') {
                      directory = 'alumnos';
                      prefix = 'alumno';
                    } else {
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
                    return `${BASE_URL}/uploads/${directory}/${prefix}_${cleanCarnet}.png`;
                  };

                  const fotoUrl = getFotoUrl();
                  
                  return (
                    <motion.div
                      key={persona.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="card-revisado"
                    >
                      <div className="card-header">
                        <div className="persona-avatar-small w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 relative">
                          {fotoUrl ? (
                            <>
                              <img 
                                src={fotoUrl} 
                                alt={`${persona.nombres} ${persona.apellidos}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling.style.display = 'flex';
                                }}
                              />
                                {persona.sexo ? (
                                  <GenderAvatar sexo={persona.sexo} size={40} />
                                ) : (
                                  persona.tipo === 'alumno' ? '👨‍🎓' : '👨‍🏫'
                                )}
                            </>
                          ) : (
                            <GenderAvatar sexo={persona.sexo} size={40} />
                          )}
                        </div>
                        <div className="badge-estado">
                        {persona.estadoRevision === 'justificado' ? (
                          <span className="badge badge-success">✅ Justificado</span>
                        ) : (
                          <span className="badge badge-info">⏭️ Omitido</span>
                        )}
                      </div>
                    </div>
                    <h4 className="persona-nombre">
                      {persona.nombres} {persona.apellidos}
                    </h4>
                    <p className="persona-detalle">
                      {persona.tipo === 'alumno' 
                        ? `${persona.grado} ${persona.seccion || ''}` 
                        : persona.cargo}
                    </p>
                    <p className="persona-carnet">{persona.carnet}</p>
                  </motion.div>
                );
              })
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal de Justificación */}
      {personaActual && (
        <ModalJustificacionRapida
          persona={personaActual}
          fecha={fecha}
          onGuardar={handleGuardarJustificacion}
          onCancelar={() => setPersonaActual(null)}
        />
      )}

      {/* Modal Confirmar Omitir Revisión */}
      {showConfirmOmitir && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10001] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full overflow-hidden"
            >
              {/* Franja colorida superior */}
              <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400" />
              <div className="p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <SkipForward size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">¿Omitir revisión?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Podrás justificar las ausencias después desde el panel tradicional de justificaciones.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmOmitir(false)}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-semibold transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => { setShowConfirmOmitir(false); onVolver(); }}
                    className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition"
                  >
                    Sí, omitir
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
