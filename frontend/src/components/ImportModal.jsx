/* eslint-disable no-unused-vars */
import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Download, CheckCircle, AlertCircle, Loader2, FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import client from '../api/client';

/**
 * ImportModal — Importación masiva de alumnos o personal desde Excel
 *
 * Props:
 *   isOpen      — boolean
 *   onClose     — () => void
 *   tipo        — 'alumnos' | 'personal'
 *   onSuccess   — () => void  (recargar lista después de importar)
 */
export default function ImportModal({ isOpen, onClose, tipo = 'alumnos', onSuccess }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null); // null | { total, creados, errores, registros }
  const [showErrores, setShowErrores] = useState(false);
  const [showRegistros, setShowRegistros] = useState(false);
  const inputRef = useRef(null);

  const label = tipo === 'alumnos' ? 'Alumnos' : 'Personal';
  const endpoint = `/importar/${tipo}`;
  const plantillaEndpoint = `/importar/plantilla/${tipo}`;

  // ── Drag & Drop ──────────────────────────────────────────────────────────
  const onDragOver = useCallback((e) => { e.preventDefault(); setDragging(true); }, []);
  const onDragLeave = useCallback(() => setDragging(false), []);
  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  }, []);

  const handleFileSelect = (f) => {
    const valid = f.name.endsWith('.xlsx') || f.name.endsWith('.xls');
    if (!valid) {
      toast.error('Solo se aceptan archivos .xlsx o .xls');
      return;
    }
    setFile(f);
    setResultado(null);
  };

  // ── Importar ─────────────────────────────────────────────────────────────
  const handleImportar = async () => {
    if (!file) { toast.error('Selecciona un archivo primero'); return; }
    setLoading(true);
    const toastId = toast.loading(`Importando ${label}...`);

    try {
      const formData = new FormData();
      formData.append('archivo', file);

      const res = await client.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResultado(res.data);

      if (res.data.creados > 0) {
        toast.success(`${res.data.creados} registros importados correctamente`, { id: toastId });
        onSuccess?.();
      } else {
        toast.error('No se importó ningún registro', { id: toastId });
      }
    } catch (error) {
      toast.error('Error: ' + (error.response?.data?.error || error.message), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // ── Descargar plantilla ───────────────────────────────────────────────────
  const handleDescargarPlantilla = async () => {
    const toastId = toast.loading('Descargando plantilla...');
    try {
      const res = await client.get(plantillaEndpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `plantilla_${tipo}_SAE.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Plantilla descargada', { id: toastId });
    } catch (error) {
      toast.error('Error al descargar plantilla', { id: toastId });
    }
  };

  // ── Reset ─────────────────────────────────────────────────────────────────
  const handleClose = () => {
    setFile(null);
    setResultado(null);
    setShowErrores(false);
    setShowRegistros(false);
    onClose();
  };

  if (!isOpen) return null;

  const successRate = resultado ? Math.round((resultado.creados / resultado.total) * 100) : 0;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full my-8 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-600 to-primary-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileSpreadsheet size={22} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Importar {label}</h2>
                <p className="text-xs text-primary-100">Carga masiva desde Excel</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Botón descargar plantilla */}
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">¿Primera vez?</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Descarga la plantilla con los campos requeridos</p>
              </div>
              <button
                onClick={handleDescargarPlantilla}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition whitespace-nowrap"
              >
                <Download size={15} />
                Plantilla Excel
              </button>
            </div>

            {/* Zona de arrastrar / seleccionar archivo */}
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                ${dragging
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.02]'
                  : file
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }
              `}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
              />
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    key="file"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <CheckCircle size={40} className="text-green-500" />
                    <p className="font-semibold text-green-700 dark:text-green-400">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB — Click para cambiar
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <Upload size={40} className={dragging ? 'text-primary-500' : 'text-gray-400'} />
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-300">
                        Arrastra tu archivo aquí
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        o haz clic para seleccionar
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {['.xlsx', '.xls'].map(ext => (
                        <span key={ext} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full font-mono">
                          {ext}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resultado de importación */}
            <AnimatePresence>
              {resultado && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* Resumen */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center border border-gray-200 dark:border-gray-700">
                      <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{resultado.total}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total leídos</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-center border border-green-200 dark:border-green-800">
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">{resultado.creados}</p>
                      <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">Importados</p>
                    </div>
                    <div className={`rounded-xl p-3 text-center border ${resultado.errores.length > 0 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                      <p className={`text-2xl font-bold ${resultado.errores.length > 0 ? 'text-red-700 dark:text-red-400' : 'text-gray-400'}`}>{resultado.errores.length}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Con errores</p>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${successRate}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-center text-gray-500">{successRate}% de registros importados exitosamente</p>

                  {/* Registros exitosos desplegables */}
                  {resultado.registros.length > 0 && (
                    <div className="border border-green-200 dark:border-green-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setShowRegistros(!showRegistros)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition"
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle size={15} />
                          Ver {resultado.registros.length} registro(s) importado(s)
                        </span>
                        {showRegistros ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                      <AnimatePresence>
                        {showRegistros && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="max-h-44 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                              {resultado.registros.map((r, i) => (
                                <div key={i} className="px-4 py-2 flex items-center justify-between text-sm">
                                  <span className="text-gray-700 dark:text-gray-300">{r.nombres} {r.apellidos}</span>
                                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400">{r.carnet}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Errores desplegables */}
                  {resultado.errores.length > 0 && (
                    <div className="border border-red-200 dark:border-red-800 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setShowErrores(!showErrores)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                      >
                        <span className="flex items-center gap-2">
                          <AlertCircle size={15} />
                          Ver {resultado.errores.length} error(es)
                        </span>
                        {showErrores ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                      <AnimatePresence>
                        {showErrores && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="max-h-44 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                              {resultado.errores.map((e, i) => (
                                <div key={i} className="px-4 py-2.5">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded">Fila {e.fila}</span>
                                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{e.datos?.nombres} {e.datos?.apellidos}</span>
                                  </div>
                                  <p className="text-xs text-red-700 dark:text-red-300">{e.error}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Acciones */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2.5 rounded-xl transition"
              >
                {resultado ? 'Cerrar' : 'Cancelar'}
              </button>
              {!resultado && (
                <button
                  type="button"
                  onClick={handleImportar}
                  disabled={!file || loading}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Importando...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Importar {label}
                    </>
                  )}
                </button>
              )}
              {resultado && resultado.creados > 0 && (
                <button
                  type="button"
                  onClick={() => { setFile(null); setResultado(null); setShowErrores(false); setShowRegistros(false); }}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Upload size={16} />
                  Importar otro
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
