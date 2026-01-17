import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, SkipForward, CheckCircle2, AlertCircle, User } from 'lucide-react';
import toast from 'react-hot-toast';
import CardAusente from './CardAusente';
import ModalJustificacionRapida from './ModalJustificacionRapida';
import './RevisionRapida.css';

export default function RevisionRapidaView({ ausentesIniciales, fecha, onVolver }) {
  const [pendientes, setPendientes] = useState(ausentesIniciales);
  const [revisados, setRevisados] = useState([]);
  const [personaActual, setPersonaActual] = useState(null);
  const [mostrarConfetti, setMostrarConfetti] = useState(false);

  const totalAusentes = ausentesIniciales.length;
  const progreso = Math.round((revisados.length / totalAusentes) * 100);

  useEffect(() => {
    // Confetti al completar todos
    if (pendientes.length === 0 && totalAusentes > 0) {
      setMostrarConfetti(true);
      toast.success('🎉 ¡Revisión completada!');
      setTimeout(() => setMostrarConfetti(false), 3000);
    }
  }, [pendientes.length, totalAusentes]);

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
    if (window.confirm('¿Seguro que deseas omitir la revisión? Podrás justificar las ausencias después desde el panel tradicional.')) {
      onVolver();
    }
  };

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
                  <User size={48} className="text-gray-300" />
                  <p className="text-gray-400 dark:text-gray-500">
                    Se llenarán conforme se procesen
                  </p>
                </motion.div>
              ) : (
                revisados.map((persona) => (
                  <motion.div
                    key={persona.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="card-revisado"
                  >
                    <div className="card-header">
                      <div className="persona-icon">
                        {persona.tipo === 'alumno' ? '👨‍🎓' : '👨‍🏫'}
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
                ))
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
    </div>
  );
}
