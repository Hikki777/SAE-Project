import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, GraduationCap, TrendingUp, AlertTriangle,
  CheckCircle2, X, ChevronDown, ChevronUp, Loader2,
  Users, Calendar, Info, BookOpen, Sparkles
} from 'lucide-react';

/**
 * Modal de Confirmación de Migración de Ciclo Escolar
 * Se muestra cuando el usuario cambia el ciclo escolar y hay alumnos sin migrar
 *
 * Props:
 *  - isOpen: boolean
 *  - onClose: () => void — Cancela todo (no guarda ni migra)
 *  - onSoloGuardar: () => void — Solo actualiza el ciclo, sin migrar
 *  - onMigrarYGuardar: () => void — Ejecuta migración y luego guarda ciclo
 *  - cicloAnterior: number — Año que se deja (ej: 2026)
 *  - cicloNuevo: number — Año nuevo (ej: 2027)
 *  - estadoData: object — Datos del endpoint /api/migracion/estado
 *  - migrandoEnProgreso: boolean — true mientras ejecuta la migración
 */
export default function ModalMigracionCiclo({
  isOpen,
  onClose,
  onSoloGuardar,
  onMigrarYGuardar,
  cicloAnterior,
  cicloNuevo,
  estadoData,
  migrandoEnProgreso
}) {
  const [expandPromo, setExpandPromo] = useState(false);
  const [expandGrad, setExpandGrad] = useState(false);
  const [expandSinRegla, setExpandSinRegla] = useState(false);

  if (!isOpen || !estadoData) return null;

  const {
    totalActivos = 0,
    totalPendientes = 0,
    totalYaMigrados = 0,
    preview = { promociones: [], graduaciones: [], sinRegla: [] },
    resumenPromocion = {}
  } = estadoData;

  const hayPromo = preview.promociones.length > 0;
  const hayGrad = preview.graduaciones.length > 0;
  const haySinRegla = preview.sinRegla.length > 0;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={!migrandoEnProgreso ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col max-h-[90vh]"
          >
            {/* ─── Cabecera con gradiente ─── */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-6 py-5 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar size={22} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Cambio de Ciclo Escolar</h2>
                    <p className="text-blue-100 text-sm mt-0.5">
                      Transición{' '}
                      <span className="font-bold text-white">{cicloAnterior}</span>
                      {' '}<ArrowRight size={12} className="inline" />{' '}
                      <span className="font-bold text-yellow-300">{cicloNuevo}</span>
                    </p>
                  </div>
                </div>
                {!migrandoEnProgreso && (
                  <button
                    onClick={onClose}
                    className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Stats rápidas */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-white">{totalActivos}</p>
                  <p className="text-blue-100 text-xs font-medium mt-0.5">Alumnos activos</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-amber-300">{totalPendientes}</p>
                  <p className="text-blue-100 text-xs font-medium mt-0.5">Sin migrar ({cicloAnterior})</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-green-300">{totalYaMigrados}</p>
                  <p className="text-blue-100 text-xs font-medium mt-0.5">Ya migrados</p>
                </div>
              </div>
            </div>

            {/* ─── Cuerpo scrollable ─── */}
            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">

              {/* Aviso principal — verde si todo migrado, ámbar si hay pendientes */}
              {totalPendientes > 0 ? (
                <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                      Se detectaron {totalPendientes} alumno{totalPendientes !== 1 ? 's' : ''} sin migrar del ciclo {cicloAnterior}
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      Puedes ejecutar la migración ahora o solo cambiar el año. Si omites la migración,
                      podrás hacerla desde <strong>Configuración → Control Académico</strong> en cualquier momento.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <CheckCircle2 size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                      ✅ Migración del ciclo {cicloAnterior} completada
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Todos los {totalActivos} alumnos activos ya tienen su historial registrado para {cicloAnterior}.
                      Puedes cambiar el año con seguridad.
                    </p>
                  </div>
                </div>
              )}

              {/* ─── Sección Promociones ─── */}
              {hayPromo && (
                <div className="border border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandPromo(v => !v)}
                    className="w-full flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <TrendingUp size={16} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-blue-900 dark:text-blue-100 text-sm">
                          Promociones de grado
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 text-xs">
                          {preview.promociones.length} alumno{preview.promociones.length !== 1 ? 's' : ''} subirán de grado
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {preview.promociones.length}
                      </span>
                      {expandPromo ? <ChevronUp size={16} className="text-blue-600" /> : <ChevronDown size={16} className="text-blue-600" />}
                    </div>
                  </button>

                  {/* Resumen de transiciones */}
                  <div className="px-4 py-3 bg-white dark:bg-gray-800/50 border-t border-blue-100 dark:border-blue-900">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(resumenPromocion).map(([key, count]) => (
                        <span
                          key={key}
                          className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 px-2.5 py-1 rounded-full font-medium"
                        >
                          {key} <span className="font-bold">({count})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Lista detallada (expandible) */}
                  <AnimatePresence>
                    {expandPromo && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-blue-100 dark:border-blue-900 max-h-48 overflow-y-auto">
                          {preview.promociones.map((alumno, idx) => (
                            <div
                              key={alumno.id}
                              className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                                idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-blue-50/40 dark:bg-blue-900/10'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                                  <Users size={12} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-[200px]">
                                  {alumno.nombre}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{alumno.gradoActual}</span>
                                <ArrowRight size={12} />
                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-semibold">{alumno.gradoSiguiente}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ─── Sección Graduaciones ─── */}
              {hayGrad && (
                <div className="border border-emerald-200 dark:border-emerald-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandGrad(v => !v)}
                    className="w-full flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <GraduationCap size={16} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-emerald-900 dark:text-emerald-100 text-sm">
                          Graduaciones
                        </p>
                        <p className="text-emerald-600 dark:text-emerald-400 text-xs">
                          {preview.graduaciones.length} alumno{preview.graduaciones.length !== 1 ? 's' : ''} completaron su ciclo
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {preview.graduaciones.length}
                      </span>
                      {expandGrad ? <ChevronUp size={16} className="text-emerald-600" /> : <ChevronDown size={16} className="text-emerald-600" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandGrad && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-emerald-100 dark:border-emerald-900"
                      >
                        <div className="max-h-48 overflow-y-auto">
                          {preview.graduaciones.map((alumno, idx) => (
                            <div
                              key={alumno.id}
                              className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                                idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-emerald-50/40 dark:bg-emerald-900/10'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <GraduationCap size={14} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                <span className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-[200px]">
                                  {alumno.nombre}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 text-right">
                                <div>{alumno.grado}</div>
                                {alumno.carrera && <div className="text-emerald-600 dark:text-emerald-400">{alumno.carrera}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ─── Sección Sin Regla ─── */}
              {haySinRegla && (
                <div className="border border-amber-200 dark:border-amber-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandSinRegla(v => !v)}
                    className="w-full flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                        <BookOpen size={16} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-amber-900 dark:text-amber-100 text-sm">
                          Grados sin regla definida
                        </p>
                        <p className="text-amber-600 dark:text-amber-400 text-xs">
                          {preview.sinRegla.length} alumno{preview.sinRegla.length !== 1 ? 's' : ''} requieren revisión manual
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        {preview.sinRegla.length}
                      </span>
                      {expandSinRegla ? <ChevronUp size={16} className="text-amber-600" /> : <ChevronDown size={16} className="text-amber-600" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandSinRegla && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-amber-100 dark:border-amber-900"
                      >
                        <div className="max-h-48 overflow-y-auto">
                          {preview.sinRegla.map((alumno, idx) => (
                            <div
                              key={alumno.id}
                              className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                                idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-amber-50/40 dark:bg-amber-900/10'
                              }`}
                            >
                              <span className="text-gray-900 dark:text-gray-100 font-medium">{alumno.nombre}</span>
                              <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded">{alumno.grado}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Info adicional solo si hay pendientes y no hay ninguna categoría visible */}
              {!hayPromo && !hayGrad && !haySinRegla && totalPendientes === 0 && totalActivos > 0 && (
                <div className="text-center py-2 text-xs text-gray-400 dark:text-gray-500">
                  No hay acciones de migración adicionales requeridas.
                </div>
              )}

              {/* Nota informativa */}
              <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Info size={14} className="flex-shrink-0 mt-0.5" />
                <p>
                  La migración registrará el historial académico de cada alumno para el ciclo {cicloAnterior}{' '}
                  y promoverá su grado automáticamente. Los graduados pasarán a estado <strong>graduado</strong>.{' '}
                  Esta acción es reversible desde el panel de Control Académico.
                </p>
              </div>
            </div>

            {/* ─── Botones de acción ─── */}
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
              {migrandoEnProgreso ? (
                <div className="flex items-center justify-center gap-3 py-2">
                  <Loader2 size={20} className="animate-spin text-blue-600" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Ejecutando migración del ciclo {cicloAnterior}...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={onSoloGuardar}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-semibold text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    Solo cambiar año
                  </button>
                  {totalPendientes > 0 && (
                    <button
                      onClick={onMigrarYGuardar}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                    >
                      <Sparkles size={16} />
                      Migrar y cambiar año
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
