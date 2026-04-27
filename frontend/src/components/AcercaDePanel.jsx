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
import { Card } from './ui/Card';
import { Button } from './ui/Button';

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
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative min-h-screen overflow-hidden py-6 sm:py-12 px-4 dark:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
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
            <div className="absolute inset-0 bg-blue-600 blur-[40px] opacity-20 animate-pulse" />
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
            {/* Version Badge using glassmorphism Card */}
            <Card noPadding className="flex items-center gap-2 px-6 py-2.5 rounded-2xl shadow-md border-opacity-50">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Versión</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{currentVersion}</span>
            </Card>

            {/* Update Status integrated */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 font-bold text-sm shadow-sm"
                >
                  <RefreshCw className="animate-spin" size={18} />
                  Buscando mejoras...
                </motion.div>
              ) : isUpToDate() ? (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 font-bold text-sm shadow-emerald-500/10 shadow-lg"
                >
                  <CheckCircle2 size={18} />
                  Sistema Actualizado
                </motion.div>
              ) : errorInfo ? (
                <Button variant="secondary" onClick={checkLatestVersion} icon={AlertTriangle} className="rounded-2xl px-6">
                  Status Desconocido
                </Button>
              ) : (
                <motion.a
                  href={`https://github.com/${repo}/releases`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Button variant="warning" icon={Zap} className="rounded-2xl px-6">
                    Nueva Versión v{latestVersion}
                  </Button>
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
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
            <Card className="h-full flex flex-col p-8 rounded-3xl relative z-10">
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
                <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <span className="text-xs font-bold text-gray-500 uppercase">Licencia</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">GNU GPL v3.0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                  <span className="text-xs font-bold text-gray-500 uppercase">Repositorio</span>
                  <a href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-bold hover:text-blue-600 transition-colors">
                    GitHub <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Author Card */}
          <motion.div variants={itemVariants} className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
            <Card className="h-full flex flex-col items-center text-center p-8 rounded-3xl relative z-10">
              <div className="w-24 h-24 mb-6 relative">
                 <div className="absolute inset-0 bg-blue-600/20 blur-2xl rounded-full" />
                 <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden border-2 border-white/20 dark:border-gray-700">
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
                  className="flex"
                >
                   <Button variant="secondary" icon={Github} className="w-full">
                     GitHub
                   </Button>
                </a>
                <a 
                  href="mailto:kevinprz777@gmail.com"
                  className="flex"
                >
                   <Button variant="primary" icon={Mail} className="w-full">
                     Contacto
                   </Button>
                </a>
              </div>
            </Card>
          </motion.div>

        </div>

        {/* --- FOOTER ATRIBUCIÓN --- */}
        <motion.div variants={itemVariants} className="mt-24 pb-16">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Info Box */}
            <Card noPadding className="bg-blue-50/80 dark:bg-blue-900/20 border-l-4 border-l-blue-400 p-6 rounded-2xl shadow-sm transition-all hover:shadow-md border-r-0 border-y-0 text-left">
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
            </Card>
            
            {/* Sistema Status & Attribution Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
              
              {/* Time Sync Capsule */}
              <Card noPadding className="flex items-center gap-3 px-4 py-2 rounded-2xl group">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
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
              </Card>

              {/* Copyright & Author Capsule */}
              <Card noPadding className="flex items-center gap-3 px-4 py-2 rounded-2xl group">
                <div className="p-1 bg-indigo-100/50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
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
              </Card>

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
  <Card animate={false} className="p-4 text-center group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
    <div className="mb-3 text-2xl flex justify-center transform group-hover:scale-110 transition-transform text-current">
      {icon}
    </div>
    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-0.5">{name}</h4>
    <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-tighter">{desc}</p>
  </Card>
);

const UserAvatar = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" fill="white" fillOpacity="0.1"/>
    <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" fill="white" stroke="white" strokeWidth="1.5"/>
    <path d="M6 19C6 16.5 8.5 15 12 15C15.5 15 18 16.5 18 19" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default AcercaDePanel;
