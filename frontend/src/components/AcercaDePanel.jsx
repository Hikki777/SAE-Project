import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Info, ExternalLink, Github, CheckCircle2, AlertTriangle, RefreshCw, Cpu, Database, Mail } from 'lucide-react';
// La versión se inyecta dinámicamente mediante la constante global __APP_VERSION__ configurada en vite.config.js

const AcercaDePanel = () => {
  const [latestVersion, setLatestVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);

  const currentVersion = __APP_VERSION__;
  const author = "Kevin Pérez (Hikki777)";
  const repo = "Hikki777/SAE-Project";

  useEffect(() => {
    checkLatestVersion();
  }, []);

  const checkLatestVersion = async () => {
    setIsLoading(true);
    setErrorInfo(null);
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
      if (!response.ok) throw new Error('Error al conectar con GitHub');
      const data = await response.json();
      
      // Limpiar v de "v1.1.3" si existe
      const version = data.tag_name ? data.tag_name.replace(/^v/, '') : null;
      setLatestVersion(version);
    } catch (err) {
      console.error("Error comprobando actualización:", err);
      setErrorInfo(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función simple para comparar versiones (ej. "1.1.2" vs "1.1.3")
  const isUpToDate = () => {
    if (!latestVersion) return null;
    return currentVersion === latestVersion || currentVersion > latestVersion;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <div className="flex items-center gap-3 mb-8">
        <Info className="text-blue-600" size={32} />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Acerca del Sistema</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tarjeta de Versión */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <RefreshCw size={20} className="text-blue-500" /> 
            Estado de Versión
          </h3>
          
          <div className="flex flex-col items-center justify-center py-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl mb-6">
            <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wider">Versión Instalada</p>
            <p className="text-5xl font-black text-gray-900 dark:text-white">{currentVersion}</p>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
                <RefreshCw className="animate-spin" size={20} />
                <span className="font-medium text-sm">Comprobando actualizaciones...</span>
              </div>
            ) : errorInfo ? (
               <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
                <AlertTriangle size={20} />
                <span className="font-medium text-sm">No se pudo comprobar la última versión.</span>
              </div>
            ) : isUpToDate() ? (
              <div className="flex items-start gap-3 p-4 bg-green-50 justify-between dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex gap-3">
                  <CheckCircle2 className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-green-800 dark:text-green-400 text-sm">Sistema Actualizado</p>
                    <p className="text-xs text-green-700 dark:text-green-500">Posees la última versión estable oficial ({latestVersion}).</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                <div className="flex gap-3">
                  <AlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-yellow-800 dark:text-yellow-400 text-sm">Nueva versión disponible</p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-500">
                      La versión <strong>{latestVersion}</strong> está disponible para descargar.
                    </p>
                  </div>
                </div>
                <a 
                  href={`https://github.com/${repo}/releases`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <ExternalLink size={16} />
                  Ver Notas de Lanzamiento
                </a>
              </div>
            )}
            
            <button 
              onClick={checkLatestVersion}
              disabled={isLoading}
              className="w-full mt-2 text-sm text-gray-500 hover:text-blue-600 font-medium py-2 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
              Reintentar comprobación
            </button>
          </div>
        </div>

        {/* Tarjeta de Detalles del Sistema y Autor */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 flex flex-col">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2 border-b dark:border-gray-700 pb-3">
            <Cpu size={20} className="text-indigo-500" /> 
            Información del Software
          </h3>
          
          <div className="flex-1 space-y-4 text-sm mt-2">
            <div>
              <p className="font-bold text-gray-800 dark:text-gray-200">SAE - Sistema de Administración Educativa</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                Plataforma integral de gestión educativa de código abierto diseñada para instituciones de Guatemala.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Motor Web</p>
                <div className="flex items-center gap-1 mt-1 font-medium text-gray-800 dark:text-gray-200">
                  <CheckCircle2 size={14} className="text-indigo-500" /> React + Vite
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Base de Datos</p>
                <div className="flex items-center gap-1 mt-1 font-medium text-gray-800 dark:text-gray-200">
                  <Database size={14} className="text-emerald-500" /> Prisma ORM + SQLite
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t dark:border-gray-700">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Autor y Desarrollo</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{author}</p>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">LCT DIARIO Software</p>
              </div>
              <div className="flex gap-2">
                <a href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors">
                  <Github size={18} />
                </a>
                <a href="mailto:kevinprz777@gmail.com" className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors">
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Este sistema es de código abierto. Visita el repositorio oficial para reportar errores o solicitar nuevas funcionalidades.
        </p>
      </div>
    </motion.div>
  );
};

export default AcercaDePanel;
