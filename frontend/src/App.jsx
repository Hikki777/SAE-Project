import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Menu, X, LogOut, Home, Settings, BarChart3, Wrench, User, Clock, Users, FileText, Activity, ClipboardList, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './components/ThemeToggle';
import { authAPI } from './api/endpoints';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './components/Dashboard';
import AlumnosPanel from './components/AlumnosPanel';
import PersonalPanel from './components/PersonalPanel';
import AsistenciasPanel from './components/AsistenciasPanel';
import ConfiguracionPanel from './components/ConfiguracionPanel';

import ReportesPanel from './components/ReportesPanel';
import MetricsPanel from './components/MetricsPanel';
import JustificacionesPanel from './components/JustificacionesPanel';

import SetupWizard from './components/SetupWizard';
import LoginPage from './pages/LoginPage';
import client from './api/client';
import offlineQueueService from './services/offlineQueue';
import notificationService from './services/notificationService';
import syncService from './services/syncService';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const [isInitialized, setIsInitialized] = useState(null); // null=loading, false=setup needed, true=ready

  const [institucion, setInstitucion] = useState(null);
  const [pendingEquipmentCount, setPendingEquipmentCount] = useState(0);

  useEffect(() => {
    checkInitialization();
  }, []);

  const checkInitialization = async () => {
    try {
      // Usar endpoint publico/protegido segun sea el caso. 
      // Institucion suele ser publica o requerir token. Si requiere token y no estamos logged in, fallara.
      // Pero /institucion/init es para setup. Asumamos que /api/institucion GET es publico o el usuario tiene token.
      // Si no tiene token, no cargará el logo, lo cual es aceptable hasta el login.
      const res = await client.get('/institucion');
      if (res.data) {
         setInstitucion(res.data); // Guardamos la info de la institución (logo, nombre)
         if (res.data.inicializado) {
            setIsInitialized(true);
         } else {
            setIsInitialized(false);
         }
      } else {
         setIsInitialized(false);
      }
    } catch (error) {
      setIsInitialized(false);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Manejo de conexión y sincronización con retry logic
  useEffect(() => {
    const handleOnline = async () => {
      // Solo mostrar el toast si ya se cargó la app anteriormente (reconexión real)
      if (hasLoadedOnce) {
        toast.success('Conectado al servidor. Sincronizando datos...', { id: 'online-toast' });
      }
      
      // Marcar que la app ya se cargó al menos una vez
      setHasLoadedOnce(true);
      
      // Sincronizar peticiones normales
      const queue = await offlineQueueService.getQueue();
      let processed = 0;
      let failed = 0;
      
      for (const item of queue) {
        try {
          await offlineQueueService.updateRequestStatus(item.id, 'syncing');
          
          await client({
            method: item.method,
            url: item.url,
            data: item.data
          });
          
          await offlineQueueService.removeFromQueue(item.id);
          processed++;
        } catch (error) {
          console.error('Error sincronizando item:', item, error);
          
          // Retry logic con backoff exponencial
          const maxRetries = 3;
          const newRetries = (item.retries || 0) + 1;
          
          if (newRetries >= maxRetries) {
            await offlineQueueService.updateRequestStatus(item.id, 'failed', newRetries);
            failed++;
          } else {
            await offlineQueueService.updateRequestStatus(item.id, 'pending', newRetries);
            // Reintentar después de un delay exponencial
            setTimeout(() => {
              if (navigator.onLine) handleOnline();
            }, Math.pow(2, newRetries) * 1000); // 2s, 4s, 8s
          }
        }
      }
      
      // Sincronizar fotos pendientes
      const photosQueue = await offlineQueueService.getPhotosQueue();
      let photosProcessed = 0;
      let photosFailed = 0;
      
      for (const photo of photosQueue) {
        try {
          await offlineQueueService.updatePhotoStatus(photo.id, 'syncing');
          
          // Convertir Base64 a Blob
          const blob = await fetch(photo.base64).then(r => r.blob());
          const file = new File([blob], photo.fileName, { type: photo.fileType });
          
          // Crear FormData
          const formData = new FormData();
          formData.append('foto', file);
          
          // Subir foto
          const endpoint = photo.personType === 'alumno' 
            ? `/alumnos/${photo.personId}/foto`
            : `/docentes/${photo.personId}/foto`;
            
          await client.post(endpoint, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          await offlineQueueService.removePhotoFromQueue(photo.id);
          photosProcessed++;
        } catch (error) {
          console.error('Error sincronizando foto:', photo, error);
          
          // Retry logic
          const maxRetries = 3;
          const newRetries = (photo.retries || 0) + 1;
          
          if (newRetries >= maxRetries) {
            await offlineQueueService.updatePhotoStatus(photo.id, 'failed', newRetries);
            photosFailed++;
          } else {
            await offlineQueueService.updatePhotoStatus(photo.id, 'pending', newRetries);
            setTimeout(() => {
              if (navigator.onLine) handleOnline();
            }, Math.pow(2, newRetries) * 1000);
          }
        }
      }
      
      // Mostrar resultados
      if (processed > 0 || photosProcessed > 0) {
        const message = [];
        if (processed > 0) message.push(`${processed} registros`);
        if (photosProcessed > 0) message.push(`${photosProcessed} fotos`);
        toast.success(`✅ Sincronizados: ${message.join(' y ')}`);
      }
      
      if (failed > 0 || photosFailed > 0) {
        const failMessage = [];
        if (failed > 0) failMessage.push(`${failed} registros`);
        if (photosFailed > 0) failMessage.push(`${photosFailed} fotos`);
        toast.error(`⚠️ Falló sincronización: ${failMessage.join(' y ')}. Se reintentará.`);
      }
    };

    const handleOffline = () => {
      toast('Modo sin conexión activado', { 
        icon: '📡',
        style: { background: '#333', color: '#fff' }
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Intentar sincronizar al cargar si ya hay internet
    if (navigator.onLine) {
      handleOnline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn && !user) {
      authAPI.getMe()
        .then(({ data }) => setUser(data))
        .catch(() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        });
    }
  }, [isLoggedIn, user]);

  // Iniciar servicio de notificaciones para admins
  useEffect(() => {
    if (isLoggedIn && user && user.rol === 'admin') {
      // Iniciar polling de equipos pendientes
      notificationService.startPolling((count) => {
        setPendingEquipmentCount(count);
      });

      return () => {
        notificationService.stopPolling();
      };
    }
  }, [isLoggedIn, user]);


  const handleLogout = () => {
    // Play logout sound
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
    audio.play().catch(e => console.error('Error playing sound:', e));

    setShowLogoutModal(true);

    setTimeout(() => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUser(null);
      setShowLogoutModal(false);
      window.location.href = '/login';
    }, 2000);
  };

  if (isInitialized === null) {
    return <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">Cargando sistema...</div>;
  }

  const getBaseUrl = () => {
    const api = localStorage.getItem('api_url') || import.meta.env.VITE_API_URL || '';
    if (api.startsWith('http')) {
      return api.replace(/\/api$/, '').replace(/\/$/, '');
    }
    return ''; // Relative path
  };

  const logoUrl = institucion?.logo_path?.startsWith('http') 
    ? institucion.logo_path 
    : institucion?.logo_path 
      ? `${getBaseUrl()}/uploads/${institucion.logo_path}` 
      : null;

  return (
    <ErrorBoundary fallbackMessage="Ha ocurrido un error en la aplicación. Por favor, recarga la página.">
      <Router>
        <Toaster position="top-right" />
        
        <AnimatePresence>
          {showLogoutModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center border-t-8 border-red-500 relative overflow-hidden"
              >
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
                
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 dark:text-red-400 border-2 border-red-100 dark:border-red-800 shadow-inner overflow-hidden">
                  {user?.foto_path ? (
                    <img 
                      src={`${getBaseUrl()}/uploads/${user.foto_path}`} 
                      alt="Perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <LogOut size={48} />
                  )}
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                  ¡Hasta pronto!
                </h2>
                
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-6 leading-relaxed">
                  Gracias por tu trabajo hoy, <br/>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {user?.nombres ? `${user.nombres} ${user.apellidos || ''}` : user?.email?.split('@')[0] || 'Administrador'}
                  </span>
                </p>
                
                <div className="flex items-center justify-center gap-3 text-slate-400 dark:text-slate-500 font-medium bg-slate-50 dark:bg-slate-900/50 py-3 rounded-2xl">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  Cerrando sesión de forma segura...
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:bg-gray-900">
          {isLoggedIn && (
          <aside
            className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-blue-600 to-blue-700 dark:from-slate-900 dark:to-slate-800 text-white transform transition-all duration-300 ease-in-out shadow-xl border-r border-blue-800 dark:border-transparent ${
              sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
            } md:w-20 md:hover:w-64 group overflow-hidden`}
          >
          <div className="p-4 border-b border-blue-800/30 dark:border-slate-700 flex items-center h-16 overflow-hidden">
            <div className="flex items-center gap-4 min-w-max">
              <div className="w-8 flex justify-center flex-shrink-0">
                  <img 
                    src="/logo.png" 
                    alt="Logo" 
                    className="w-8 h-8 object-contain" 
                  />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                <h1 className="text-xs font-bold text-white dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-blue-400 dark:to-emerald-400 truncate max-w-[200px] whitespace-normal leading-tight">
                  Sistema de Administración Educativa - SAE
                </h1>
              </div>
            </div>
          </div>

          <div className="px-3 py-4 border-b border-blue-800/30 dark:border-slate-700/50 overflow-hidden">
             {user && (
               <div className="flex items-center gap-3 min-w-max">
                 <div className="w-12 h-12 flex-shrink-0 relative group/profile">
                    <div className="w-12 h-12 rounded-full bg-blue-500/50 dark:bg-slate-700 border-2 border-blue-400 dark:border-slate-600 flex items-center justify-center text-white dark:text-emerald-400 shadow-lg overflow-hidden transition-all duration-300 group-hover:border-white">
                      {user.foto_path ? (
                        <img 
                          src={`${getBaseUrl()}/uploads/${user.foto_path}`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-blue-600 dark:border-slate-900 rounded-full"></div>
                 </div>
                 <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden">
                    <p className="font-bold text-white dark:text-white text-sm truncate max-w-[140px]">
                      {user.nombres ? `${user.nombres} ${user.apellidos || ''}` : user.email}
                    </p>
                    <p className="text-[10px] font-bold text-blue-200 dark:text-emerald-400 uppercase tracking-tight truncate">
                      {user.cargo || user.rol}
                    </p>
                 </div>
               </div>
             )}
          </div>

          <nav className="p-2 space-y-0.5 flex-1">
            <NavLink to="/" icon={Home} label="Dashboard" />
            <NavLink to="/alumnos" icon={BarChart3} label="Alumnos" />
            <NavLink to="/docentes" icon={Users} label="Personal" />
            <NavLink to="/asistencias" icon={Clock} label="Asistencias" />

            <NavLink to="/reportes" icon={FileText} label="Reportes" />
            <NavLink to="/metricas" icon={Activity} label="Métricas" />
            <NavLink to="/configuracion" icon={Settings} label="Configuración" badge={pendingEquipmentCount} />
          </nav>

          <div className="absolute bottom-16 left-3 right-3 overflow-hidden flex justify-center py-2">
            <ThemeToggle />
          </div>

          <div className="absolute bottom-3 left-3 right-3 overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500/20 hover:bg-red-600 text-red-100 hover:text-white font-medium py-2 px-2 rounded-lg flex items-center gap-2 transition-all duration-300 group/btn min-w-max"
              title="Cerrar Sesión"
            >
              <div className="w-5 flex justify-center flex-shrink-0">
                 <LogOut size={20} />
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-100">Cerrar Sesión</span>
            </button>
          </div>
        </aside>
          )}

        {/* Main Content */}
        <div className={`flex-1 overflow-auto bg-transparent dark:bg-gray-900 transition-all duration-300 ${isLoggedIn ? 'md:ml-20' : ''}`}>
          {/* Mobile Menu - Solo mostrar si está autenticado */}
          {isLoggedIn && (
          <div className="md:hidden bg-gradient-to-r from-blue-600 to-blue-700 dark:bg-slate-900 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
               <img 
                 src={
                   institucion?.logo_path?.startsWith('http') 
                     ? institucion.logo_path 
                     : institucion?.logo_path 
                       ? `${import.meta.env.VITE_API_URL}/uploads/${institucion.logo_path}` 
                       : "/logo.png"
                 } 
                 alt="Logo" 
                 className="w-8 h-8 object-contain" 
               />
               <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 truncate max-w-[200px]">
                  {institucion?.nombre || "SAE"}
               </h1>
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-300 hover:text-white">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          )}

          {/* Close sidebar when clicking outside on mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <main className="p-6 max-w-7xl mx-auto">
            <Routes>
              <Route path="/setup" element={!isInitialized ? <SetupWizard onComplete={() => setIsInitialized(true)} /> : <Navigate to="/login" />} />
              <Route path="/setup-preview" element={<SetupWizard onComplete={() => setIsInitialized(true)} />} />
              <Route path="/login" element={
                !isInitialized ? <Navigate to="/setup" /> :
                isLoggedIn ? <Navigate to="/" /> : <LoginPage />
              } />
              <Route path="/" element={
                !isInitialized ? <Navigate to="/setup" /> :
                isLoggedIn ? <Dashboard /> : <Navigate to="/login" />
              } />
              <Route path="/alumnos" element={isLoggedIn ? <AlumnosPanel /> : <Navigate to="/login" />} />
              <Route path="/docentes" element={isLoggedIn ? <PersonalPanel /> : <Navigate to="/login" />} />
              <Route path="/asistencias" element={isLoggedIn ? <AsistenciasPanel /> : <Navigate to="/login" />} />
              <Route path="/justificaciones" element={isLoggedIn ? <JustificacionesPanel /> : <Navigate to="/login" />} />

              <Route path="/reportes" element={isLoggedIn ? <ReportesPanel /> : <Navigate to="/login" />} />
              <Route path="/metricas" element={isLoggedIn ? <MetricsPanel /> : <Navigate to="/login" />} />
                <Route path="/configuracion" element={isLoggedIn ? <ConfiguracionPanel /> : <Navigate to="/login" />} />

            </Routes>
          </main>
        </div>
      </div>
    </Router>
    </ErrorBoundary>
  );
}

/* eslint-disable no-unused-vars */
function NavLink({ to, icon: Icon, label, badge }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-blue-800/30 dark:hover:bg-slate-700/50 transition-colors font-medium text-white dark:text-slate-300 hover:text-white dark:hover:text-white group/item min-w-max relative"
    >
      <div className="w-8 flex justify-center flex-shrink-0 relative">
        <Icon size={20} />
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap delay-75">
        {label}
      </span>
    </Link>
  );
}
/* eslint-enable no-unused-vars */

export default App;
