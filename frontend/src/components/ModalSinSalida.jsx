import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, CheckCircle2 } from 'lucide-react';
import client from '../api/client';
import toast from 'react-hot-toast';

export default function ModalSinSalida({ personas, fecha, onCerrar, onActualizar }) {
  const [procesando, setProcesando] = useState(false);
  const [personasProcesadas, setPersonasProcesadas] = useState(new Set());

  const handleMarcarSalida = async (persona) => {
    try {
      const data = {
        tipo_evento: 'salida',
        origen: 'Manual - Sin Salida',
        timestamp: new Date().toISOString()
      };

      if (persona.tipo === 'alumno') {
        data.alumno_id = persona.id;
      } else {
        data.personal_id = persona.id;
      }

      await client.post('/asistencias', data);
      
      setPersonasProcesadas(prev => new Set([...prev, persona.id]));
      toast.success(`✅ Salida registrada para ${persona.nombres}`);
      
      if (onActualizar) {
        onActualizar();
      }
    } catch (error) {
      console.error('Error registrando salida:', error);
      
      if (error.response?.status === 409) {
        toast.error(`⚠️ ${persona.nombres} ya tiene salida registrada`);
        setPersonasProcesadas(prev => new Set([...prev, persona.id]));
      } else {
        toast.error('Error: ' + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleMarcarTodas = async () => {
    setProcesando(true);
    
    const pendientes = personas.filter(p => !personasProcesadas.has(p.id));
    
    for (const persona of pendientes) {
      await handleMarcarSalida(persona);
      // Pequeña pausa para no saturar
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setProcesando(false);
    toast.success('✅ Todas las salidas registradas');
    
    setTimeout(() => {
      onCerrar();
    }, 1000);
  };

  const personasPendientes = personas.filter(p => !personasProcesadas.has(p.id));

  return createPortal(
    <div 
      className="modal-overlay"
      onClick={onCerrar}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <LogOut className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Personas sin Salida Registrada
                </h3>
                <p className="text-orange-100 text-sm">
                  {personasPendientes.length} de {personas.length} pendientes
                </p>
              </div>
            </div>
            <button
              onClick={onCerrar}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition"
              aria-label="Cerrar"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Info Banner */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 mb-4 rounded">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              ⚠️ Las siguientes personas registraron <strong>entrada</strong> pero no <strong>salida</strong> el día {new Date(fecha).toLocaleDateString('es-ES')}.
            </p>
          </div>

          {/* Lista de personas */}
          <div className="space-y-2">
            <AnimatePresence>
              {personas.map((persona) => {
                const procesada = personasProcesadas.has(persona.id);
                
                return (
                  <motion.div
                    key={persona.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 ${procesada ? 'opacity-50' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex-shrink-0">
                      {(() => {
                        const fotoUrl = persona.foto_path ? `/uploads/${persona.foto_path}` : null;
                        
                        return fotoUrl ? (
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
                            <div 
                              className="text-2xl flex items-center justify-center w-full h-full"
                              style={{ display: 'none' }}
                            >
                              {persona.tipo === 'alumno' ? '👨‍🎓' : '👨‍🏫'}
                            </div>
                          </>
                        ) : (
                          <div className="text-2xl flex items-center justify-center w-full h-full">
                            {persona.tipo === 'alumno' ? '👨‍🎓' : '👨‍🏫'}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {persona.nombres} {persona.apellidos}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {persona.tipo === 'alumno' 
                          ? `${persona.grado} ${persona.seccion || ''} - ${persona.carnet}` 
                          : `${persona.cargo} - ${persona.carnet}`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {persona.jornada}
                      </p>
                    </div>

                    {/* Botón */}
                    {procesada ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 flex-shrink-0">
                        <CheckCircle2 size={20} />
                        <span className="text-sm font-medium hidden sm:inline">Registrada</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMarcarSalida(persona)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition flex-shrink-0"
                      >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Marcar Salida</span>
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCerrar}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition"
            >
              Cerrar
            </button>
            {personasPendientes.length > 0 && (
              <button
                onClick={handleMarcarTodas}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition"
                disabled={procesando}
              >
                {procesando ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Marcar Todas ({personasPendientes.length})
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* Keyboard hint */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
            Presiona <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Esc</kbd> para cerrar
          </p>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
