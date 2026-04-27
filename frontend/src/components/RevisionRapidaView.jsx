import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, SkipForward, CheckCircle2, AlertCircle, User, SkipBack } from 'lucide-react';
import GenderAvatar from './GenderAvatar';
import toast from 'react-hot-toast';
import CardAusente from './CardAusente';
import ModalJustificacionRapida from './ModalJustificacionRapida';
import client, { API_URL, BASE_URL } from '../api/client';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PageHeader } from './ui/PageHeader';
import { Badge } from './ui/Badge';

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
    <div className="flex flex-col h-full bg-gray-50/30 dark:bg-gray-900/10 p-2 sm:p-6 rounded-3xl relative">
      {/* Confetti Effect using absolute divs since CSS is gone */}
      {mostrarConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -50, x: Math.random() * window.innerWidth, rotate: 0 }}
              animate={{ 
                y: window.innerHeight + 50, 
                rotate: 360,
                x: Math.random() * window.innerWidth 
              }}
              transition={{ duration: 2 + Math.random() * 2, ease: "linear" }}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 4)]
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <PageHeader 
        title={
          <span className="flex items-center gap-2">
            Revisión Rápida
            <span className="text-gray-400 font-medium text-lg hidden sm:inline-block">
              {new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </span>
        }
        icon={AlertCircle}
      >
        <Button variant="secondary" onClick={onVolver} icon={ArrowLeft} className="w-full sm:w-auto">
          Volver
        </Button>
        <Button variant="outline" onClick={handleOmitirRevision} icon={SkipForward} className="w-full sm:w-auto">
          Omitir Todo
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-4 py-3 rounded-xl font-medium mb-6 animate-pulse border border-blue-100 dark:border-blue-800">
        <AlertCircle size={20} />
        ⚠️ {totalAusentes} persona{totalAusentes !== 1 ? 's' : ''} no marcaron asistencia hoy
      </div>

      {/* Progress Card */}
      <Card className="mb-6 p-4 sm:p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            Progreso: {revisados.length} de {totalAusentes} revisados
          </span>
          <span className="text-sm font-black text-blue-600 dark:text-blue-400">
            {progreso}%
          </span>
        </div>
        <div className="h-3 w-full bg-blue-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-inner"
            initial={{ width: 0 }}
            animate={{ width: `${progreso}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </Card>

      {/* Grid Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pb-8">
        {/* Columna Pendientes */}
        <Card className="flex flex-col max-h-[800px] border-amber-200/50 dark:border-amber-900/30 overflow-hidden p-0 shadow-lg" noPadding animate={false}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-amber-50/80 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-900/50">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertCircle size={20} className="fill-amber-100 dark:fill-amber-900" />
              <h3 className="font-bold uppercase tracking-wide">Pendientes</h3>
            </div>
            <Badge variant="warning">{pendientes.length}</Badge>
          </div>
          
          {/* Listado */}
          <div className="overflow-y-auto flex-1 p-4 bg-gray-50/30 dark:bg-black/10 space-y-4" style={{ minHeight: '300px' }}>
            <AnimatePresence>
              {pendientes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-12 text-center h-full"
                >
                  <CheckCircle2 size={48} className="text-green-500 mb-4 opacity-50" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">¡Todos revisados!</p>
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
        </Card>

        {/* Columna Revisados */}
        <Card className="flex flex-col max-h-[800px] border-emerald-200/50 dark:border-emerald-900/30 overflow-hidden p-0 shadow-lg" noPadding animate={false}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-emerald-50/80 dark:bg-emerald-900/20 border-b border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={20} className="fill-emerald-100 dark:fill-emerald-900" />
              <h3 className="font-bold uppercase tracking-wide">Revisados</h3>
            </div>
            <Badge variant="success">{revisados.length}</Badge>
          </div>
          
          {/* Listado */}
          <div className="overflow-y-auto flex-1 p-4 bg-gray-50/30 dark:bg-black/10 space-y-4" style={{ minHeight: '300px' }}>
            <AnimatePresence>
              {revisados.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-12 text-center h-full"
                >
                  <GenderAvatar size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-gray-400 dark:text-gray-500 font-medium">Se llenarán conforme se procesen</p>
                </motion.div>
              ) : (
                revisados.map((persona) => {
                  const getFotoUrl = () => {
                    if (persona.foto_path) {
                      return persona.foto_path.startsWith('http') 
                        ? persona.foto_path 
                        : `${BASE_URL}/api/uploads/${persona.foto_path}`;
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
                    return `${BASE_URL}/api/uploads/${directory}/${prefix}_${cleanCarnet}.png`;
                  };

                  const fotoUrl = getFotoUrl();
                  
                  return (
                    <motion.div
                      key={persona.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 relative shadow-sm">
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
                                  <GenderAvatar sexo={persona.sexo} size={48} />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full">{persona.tipo === 'alumno' ? '👨‍🎓' : '👨‍🏫'}</div>
                                )}
                            </>
                          ) : (
                            <GenderAvatar sexo={persona.sexo} size={48} />
                          )}
                        </div>
                        <div>
                           <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                             {persona.nombres} {persona.apellidos}
                           </h4>
                           <p className="text-xs text-gray-500 dark:text-gray-400">
                             {persona.tipo === 'alumno' 
                               ? `${persona.grado} ${persona.seccion || ''}` 
                               : persona.cargo}
                           </p>
                           <p className="text-xs text-gray-400 font-mono mt-0.5">{persona.carnet}</p>
                        </div>
                      </div>
                      <div>
                        {persona.estadoRevision === 'justificado' ? (
                          <Badge variant="success" className="px-3">✅ Justificado</Badge>
                        ) : (
                          <Badge variant="info" className="px-3 text-gray-600 bg-gray-100 dark:bg-gray-700">⏭️ Omitido</Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </Card>
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[10001] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full"
            >
              <Card noPadding className="overflow-hidden">
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
                  <div className="flex gap-3 mt-8">
                    <Button
                      variant="secondary"
                      onClick={() => setShowConfirmOmitir(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => { setShowConfirmOmitir(false); onVolver(); }}
                      className="flex-1"
                    >
                      Sí, omitir
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
