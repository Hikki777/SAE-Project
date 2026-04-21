import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  ExternalLink, 
  Github, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Cpu, 
  Database, 
  Mail, 
  Layers, 
  Zap, 
  Shield, 
  Sparkles, 
  Code,
  Globe,
  Binary
} from 'lucide-react';

// La versión se inyecta dinámicamente mediante la constante global __APP_VERSION__ configurada en vite.config.js
const currentVersion = __APP_VERSION__;
const author = "Kevin Pérez (Hikki777)";
const repo = "Hikki777/SAE-Project";

const AcercaDePanel = () => {
  const [latestVersion, setLatestVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState(null);

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
      const version = data.tag_name ? data.tag_name.replace(/^v/, '') : null;
      setLatestVersion(version);
    } catch (err) {
      console.error("Error comprobando actualización:", err);
      setErrorInfo(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isUpToDate = () => {
    if (!latestVersion) return null;
    return currentVersion === latestVersion || currentVersion > latestVersion;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative min-h-screen overflow-hidden py-12 px-4 dark:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto"
      >
        {/* --- HERO SECTION --- */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-block relative mb-6">
            <div className="absolute inset-0 bg-blue-600 blur-[40px] opacity-20 animate-pulse"></div>
            <img 
              src="./logo.png" 
              alt="SAE Logo" 
              className="relative w-24 h-24 mx-auto object-contain drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 dark:from-blue-400 dark:via-indigo-300 dark:to-blue-400 animate-gradient-x">
            SAE - Project
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 font-medium">
            Sistema de Administración Educativa integral, diseñado para potenciar la eficiencia administrativa con tecnología de vanguardia.
          </p>

          <div className="flex flex-wrap justify-center gap-4 items-center">
            {/* Version Badge */}
            <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-6 py-2.5 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Versión</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{currentVersion}</span>
            </div>

            {/* Update Status integrated */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 font-bold text-sm"
                >
                  <RefreshCw className="animate-spin" size={18} />
                  Buscando mejoras...
                </motion.div>
              ) : isUpToDate() ? (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 font-bold text-sm shadow-lg shadow-emerald-500/10"
                >
                  <CheckCircle2 size={18} />
                  Sistema Actualizado
                </motion.div>
              ) : errorInfo ? (
                <motion.button
                  onClick={checkLatestVersion}
                  className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <AlertTriangle size={18} />
                  Status Desconocido
                </motion.button>
              ) : (
                <motion.a
                  href={`https://github.com/${repo}/releases`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                   <Zap size={18} fill="currentColor" />
                   Nueva Versión v{latestVersion}
                </motion.a>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* --- TECH STACK GRID --- */}
        <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <Layers className="text-indigo-500" size={24} />
            Stack Tecnológico
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
             <TechCard icon={<Code className="text-blue-500" />} name="React" desc="UI Library" />
             <TechCard icon={<Zap className="text-yellow-500" />} name="Vite" desc="Build Tool" />
             <TechCard icon={<Database className="text-emerald-500" />} name="Prisma" desc="ORM Engine" />
             <TechCard icon={<Binary className="text-slate-500" />} name="SQLite" desc="Database" />
             <TechCard icon={<Sparkles className="text-pink-500" />} name="Tailwind" desc="Modern CSS" />
             <TechCard icon={<Shield className="text-indigo-500" />} name="Framer" desc="Animations" />
          </div>
        </motion.div>

        {/* --- DETAILS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Software Info Card */}
          <motion.div variants={itemVariants} className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl border border-white/20 dark:border-gray-700 shadow-xl h-full flex flex-col">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                  <Cpu size={24} />
                </div>
                Detalles del Software
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Plataforma de código abierto diseñada para transformar la gestión de centros educativos mediante procesos automatizados, seguridad de datos y una experiencia de usuario optimizada para Guatemala.
              </p>

              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <span className="text-xs font-bold text-gray-500 uppercase">Licencia</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">GNU GPL v3.0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <span className="text-xs font-bold text-gray-500 uppercase">Repositorio</span>
                  <a href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-bold hover:text-blue-600 transition-colors">
                    GitHub <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Author Card */}
          <motion.div variants={itemVariants} className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white dark:bg-gray-800 p-8 rounded-3xl border border-white/20 dark:border-gray-700 shadow-xl h-full flex flex-col items-center text-center">
              <div className="w-24 h-24 mb-6 relative">
                 <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full"></div>
                 <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden border-2 border-white dark:border-gray-700">
                   <UserAvatar size={48} />
                 </div>
              </div>

              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Autor & Desarrollador</span>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8">Hikki777</h3>

              <div className="grid grid-cols-2 gap-3 w-full">
                <a 
                  href={`https://github.com/${repo.split('/')[0]}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                >
                   <Github size={18} />
                   GitHub
                </a>
                <a 
                  href="mailto:kevinprz777@gmail.com"
                  className="flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-3 rounded-2xl font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all"
                >
                   <Mail size={18} />
                   Contacto
                </a>
              </div>
            </div>
          </motion.div>

        </div>

        {/* --- FOOTER ATRIBUCIÓN --- */}
        <motion.div variants={itemVariants} className="mt-24 pb-16">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Info Box Estilo Métricas */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-6 rounded-2xl shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
                  <Info size={24} />
                </div>
                <div className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                  <p className="font-bold mb-2 text-base flex items-center gap-2">
                    Aviso Legal y Responsabilidad
                  </p>
                  <p className="opacity-90 font-medium">
                    SAE - Proyecto es una plataforma interna de código abierto diseñada para apoyar a las instituciones educativas con herramientas intuitivas de gestión y automatización de asistencias. Bajo la licencia GNU GPL v3.0, fomentamos la transparencia y colaboración, siendo responsabilidad de la institución su gestión técnica y el resguardo seguro de su información.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Sistema Status & Attribution Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              
              {/* Time Sync Capsule */}
              <div className="flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:bg-white dark:hover:bg-gray-800">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </div>
                <span className="text-[10px] uppercase font-black tracking-widest text-gray-500 dark:text-gray-400">
                  Network Time Sync:
                </span>
                <a 
                  href="https://time.now/developer" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[10px] font-black text-blue-600 dark:text-blue-400 hover:scale-105 transition-transform"
                >
                  Time.now API
                </a>
              </div>

              {/* Copyright & Author Capsule */}
              <div className="flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm group">
                <div className="p-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                  <Binary size={10} />
                </div>
                <div className="flex flex-col items-end">
                   <p className="text-[9px] font-black text-gray-500 dark:text-gray-400 tracking-widest uppercase">
                    © {new Date().getFullYear()} SAE-Project
                  </p>
                  <p className="text-[8px] text-gray-400 dark:text-gray-500 font-bold">
                    Developed by {author}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Internal Custom CSS for animations */}
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Helper Components
const TechCard = ({ icon, name, desc }) => (
  <div className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700 p-4 rounded-2xl text-center hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="mb-3 text-2xl flex justify-center transform group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-0.5">{name}</h4>
    <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-tighter">{desc}</p>
  </div>
);

const UserAvatar = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="white" fillOpacity="0.1"/>
    <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" fill="white" stroke="white" strokeWidth="1.5"/>
    <path d="M6 19C6 16.5 8.5 15 12 15C15.5 15 18 16.5 18 19" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default AcercaDePanel;
