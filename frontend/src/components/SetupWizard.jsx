/* global __APP_VERSION__ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { School, User, Lock, Clock, CheckCircle, MapPin, Mail, Phone, LogOut, LogIn, Upload, Edit2, Server, Wifi, Globe, Eye, EyeOff, Copy, Download, Users, Camera, Network, Info, AlertCircle } from 'lucide-react';
import ConnectionModal from './ConnectionModal';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import GenderAvatar from './GenderAvatar';
import WebcamCaptureModal from './WebcamCaptureModal';

export default function SetupWizard({ onComplete }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Mode Selection
  const [mode, setMode] = useState(null); // 'server' or 'client'
  const [loading, setLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null); // null, 'connecting', 'synchronizing', 'connected', 'error'
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [masterKey, setMasterKey] = useState(null);
  
  // Estados para aprobación de equipo cliente
  const [waitingApproval, setWaitingApproval] = useState(false);
  const [equipoId, setEquipoId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [pollingTimeout, setPollingTimeout] = useState(null);
  const [approvalCheckCount, setApprovalCheckCount] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    horario_inicio: '07:00',
    horario_salida: '13:00',
    margen_puntualidad_min: 5,
    direccion: '',
    pais: 'Guatemala', // Fixed to Guatemala
    departamento: '',
    municipio: '',
    email: '',
    telefono: '',
    // Admin info
    admin_nombres: '',
    admin_apellidos: '',
    admin_email: '',
    admin_username: '',
    admin_password: '',
    admin_password_confirm: '',
    admin_cargo: '',
    admin_jornada: '',
    // Logo y Foto (Files)
    logo_base64: null, // Legacy check for preview
    logo_file: null,
    admin_foto_file: null,
    admin_foto_preview: null,
    ciclo_escolar: new Date().getFullYear()
  });

  const [logoPreview, setLogoPreview] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  // Estado para múltiples directores
  const [directores, setDirectores] = useState([
    { nombres: '', apellidos: '', cargo: 'Director General', jornada: 'Matutina', foto_file: null, foto_preview: null }
  ]);

  const [showWebcam, setShowWebcam] = useState(false);
  const [webcamTarget, setWebcamTarget] = useState({ type: null, index: null }); // type: 'admin' | 'director'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addDirector = () => {
    if (directores.length >= 5) {
      toast.error('Máximo 5 directores permitidos');
      return;
    }
    setDirectores([...directores, { 
      nombres: '', 
      apellidos: '', 
      cargo: 'Director General',
      sexo: 'Masculino',
      jornada: 'Matutina',
      foto_file: null,
      foto_preview: null
    }]);
  };

  const removeDirector = (index) => {
    if (directores.length === 1) {
      toast.error('Debe haber al menos un director');
      return;
    }
    setDirectores(directores.filter((_, i) => i !== index));
  };

  const updateDirector = (index, field, value) => {
    const updated = [...directores];
    updated[index][field] = value;
    setDirectores(updated);
  };

  const handleDirectorFotoChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateDirector(index, 'foto_preview', reader.result);
        updateDirector(index, 'foto_file', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Max 5MB
        toast.error('El archivo es muy grande (Max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData(prev => ({ 
          ...prev, 
          logo_base64: reader.result, // For preview
          logo_file: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdminFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // Max 5MB
        toast.error('El archivo es muy grande (Max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          admin_foto_preview: reader.result,
          admin_foto_file: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setShowConnectionModal(true);
    setConnectionStatus('connecting');
    setConnectionError('');
    
    // Normalizar URL (quitar slash final)
    const url = serverUrl.replace(/\/$/, '');
    
    try {
      // Paso 1: Conectando - Verificar health del servidor
      const healthResponse = await fetch(`${url}/api/health`, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!healthResponse.ok) {
        throw new Error('El servidor no está disponible');
      }

      // Paso 2: Sincronizando - Registrar equipo cliente
      setConnectionStatus('synchronizing');
      
      // Obtener información del equipo
      const deviceInfo = {
        nombre_equipo: window.navigator.userAgent.includes('Windows') ? 'PC-Windows' : 'PC-Cliente',
        ip_address: 'auto', // El servidor detectará la IP
        mac_address: 'auto' // El servidor generará un ID único
      };

      const registerResponse = await fetch(`${url}/api/equipos/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceInfo)
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.error || 'Error al registrar el equipo');
      }

      const registerData = await registerResponse.json();
      
      // Guardar configuración
      localStorage.setItem('api_url', `${url}/api`);
      localStorage.setItem('server_url', url);
      localStorage.setItem('device_id', registerData.equipoId);
      localStorage.setItem('is_client', 'true');
      
      setEquipoId(registerData.equipoId);
      
      // Si ya está aprobado, conectar inmediatamente
      if (registerData.aprobado) {
        setConnectionStatus('connected');
        setTimeout(() => {
          window.location.hash = '/login';
        }, 2000);
      } else {
        // Mostrar modal de espera y comenzar polling
        setConnectionStatus('waiting-approval');
        setWaitingApproval(true);
        setApprovalCheckCount(0);
        startApprovalPolling(registerData.equipoId, url);
      }
      
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus('error');
      setConnectionError(error.message || 'No se pudo conectar al servidor. Verifica la URL y que el servidor esté activo.');
    }
  };

  /**
   * Iniciar polling para verificar aprobación
   */
  const startApprovalPolling = (eqId, serverUrl) => {
    const MAX_WAIT_TIME = 120000; // 2 minutos
    const POLL_INTERVAL = 5000; // 5 segundos
    
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${serverUrl}/api/equipos/check-approval/${eqId}`);
        
        if (response.ok) {
          const data = await response.json();
          setApprovalCheckCount(prev => prev + 1);
          
          if (data.aprobado) {
            // ¡Aprobado! Detener polling y conectar
            clearInterval(interval);
            clearTimeout(timeout);
            setPollingInterval(null);
            setPollingTimeout(null);
            setConnectionStatus('connected');
            setWaitingApproval(false);
            
            toast.success('¡Equipo aprobado! Conectando...');
            
            // Redirigir al login
            setTimeout(() => {
              window.location.hash = '/login';
            }, 1500);
          }
        } else {
          console.error('Error en respuesta de aprobación:', response.status);
        }
      } catch (error) {
        console.error('Error checking approval:', error);
      }
    }, POLL_INTERVAL);
    
    // Timeout de 2 minutos
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPollingInterval(null);
      setPollingTimeout(null);
      setWaitingApproval(false);
      setConnectionStatus('error');
      setConnectionError('Tiempo de espera agotado. El administrador no ha aprobado el equipo. Por favor, contacta al administrador e intenta nuevamente.');
      
      // Limpiar localStorage
      localStorage.removeItem('api_url');
      localStorage.removeItem('server_url');
      localStorage.removeItem('device_id');
      localStorage.removeItem('is_client');
      
      toast.error('Tiempo de espera agotado');
    }, MAX_WAIT_TIME);
    
    setPollingInterval(interval);
    setPollingTimeout(timeout);
  };

  /**
   * Cancelar espera de aprobación
   */
  const cancelApprovalWait = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    if (pollingTimeout) {
      clearTimeout(pollingTimeout);
      setPollingTimeout(null);
    }
    setWaitingApproval(false);
    setConnectionStatus(null);
    setShowConnectionModal(false);
    setApprovalCheckCount(0);
    
    // Limpiar localStorage
    localStorage.removeItem('api_url');
    localStorage.removeItem('server_url');
    localStorage.removeItem('device_id');
    localStorage.removeItem('is_client');
    
    toast.info('Conexión cancelada');
  };

  const handleCloseConnectionModal = () => {
    setShowConnectionModal(false);
    setConnectionStatus(null);
    setConnectionError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called', formData);
    
    // Validar identificador (al menos uno requerido)
    if (!formData.admin_email && !formData.admin_username) {
      toast.error('Se requiere al menos un identificador (Correo o Nombre de Usuario)');
      return;
    }

    // Validar formato de email si se proporciona
    if (formData.admin_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.admin_email)) {
        toast.error('El formato del email no es válido');
        return;
      }
    }
    
    // Validar contraseñas coinciden
    if (formData.admin_password !== formData.admin_password_confirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud mínima
    if (formData.admin_password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // Validar que contenga letras y números (alfanumérico)
    if (!/[a-zA-Z]/.test(formData.admin_password)) {
      toast.error('La contraseña debe contener al menos una letra');
      return;
    }
    
    if (!/\d/.test(formData.admin_password)) {
      toast.error('La contraseña debe contener al menos un número');
      return;
    }

    setLoading(true);
    try {
      const dataToSend = new FormData();
      
      console.log('Packaging data...');
      // Append fields
      Object.keys(formData).forEach(key => {
        // Exclude files, previews, and confirm password
        const excludedKeys = ['logo_file', 'admin_foto_file', 'admin_foto_preview', 'logo_base64', 'admin_password_confirm', 'margen_puntualidad_min'];
        if (!excludedKeys.includes(key)) {
          dataToSend.append(key, formData[key]);
        }
      });

      // Append margin as integer
      dataToSend.append('margen_puntualidad_min', parseInt(formData.margen_puntualidad_min || 5));

      // Append Directors (JSON string) - BEFORE FILES
      console.log('Appending directors...', directores);
      const directorsPayload = directores.map(d => ({
        nombres: d.nombres,
        apellidos: d.apellidos,
        cargo: d.cargo,
        sexo: d.sexo,
        jornada: d.jornada
      }));
      dataToSend.append('directores', JSON.stringify(directorsPayload));

      // Append files
      if (formData.logo_file) {
        console.log('Appending logo...');
        dataToSend.append('logo', formData.logo_file);
      }
      if (formData.admin_foto_file) {
        console.log('Appending admin photo...');
        dataToSend.append('admin_foto', formData.admin_foto_file);
      }

      // Append Director Photos
      directores.forEach((dir, index) => {
         if (dir.foto_file) {
           dataToSend.append(`director_fotos_${index}`, dir.foto_file);
         }
      });

      console.log('Sending request to /institucion/init...');
      const response = await client.post('/institucion/init', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Response received:', response.data);

      toast.success('¡Sistema inicializado correctamente!');
      setMasterKey(response.data.masterRecoveryKey);
      setStep(4); // Move to a dedicated "Success/Key" step
      
    } catch (error) {
      console.error('Submission error:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.detalle || error.message || 'Error al inicializar el sistema';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent overflow-auto text-text-primary bg-grid-pattern dark">
      {/* Fondo decorativo (Technological Texture) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Contenedor del formulario */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-bg-secondary/80 backdrop-blur-xl border border-white/5 rounded-2xl shadow-glow w-full max-w-4xl overflow-hidden flex flex-col md:flex-row my-4">
          
          {/* Sidebar */}
          <div className="bg-bg-tertiary/50 border-r border-white/5 text-text-primary p-8 md:w-1/3 flex flex-col justify-between">
            <div>
              <div className="flex flex-col items-center text-center gap-4 mb-8">
                <img src="./logo.png" alt="Logo SAE" className="h-24 object-contain drop-shadow-md" />
                <div>
                  <h1 className="text-2xl font-bold">SAE</h1>
                  <p className="text-sm text-blue-100 mt-1">Sistema de Administración Educativa</p>
                </div>
              </div>
              <p className="text-blue-100 mb-6 text-center text-sm leading-relaxed">
                Sotfware Open-Source para los Centros Educativos de Guatemala
              </p>
              
              <div className="space-y-4">
                {['Modo de Instalación', 'Institución', 'Administrador', 'Confirmar'].map((label, index) => {
                  const stepNum = index + 1;
                  const isActive = step === index;
                  const isCompleted = step > index;
                  
                  return (
                    <div key={index} className={`flex items-center gap-3 transition-all ${
                      isActive ? 'text-white scale-105' : isCompleted ? 'text-green-300' : 'text-blue-400'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isActive ? 'border-white bg-blue-700 shadow-lg' : 
                        isCompleted ? 'border-green-300 bg-green-500' : 
                        'border-blue-400'
                      }`}>
                        {isCompleted ? <CheckCircle size={16} /> : stepNum}
                      </div>
                      <span className="font-medium">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-xs text-blue-300 mt-8">
              SAE - Sistema de Administración Educativa v{__APP_VERSION__}
            </div>
          </div>

          {/* Formulario */}
          <div className="md:w-2/3">
            <div className="p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              {step === 0 ? 'Modo de Instalación' :
               step === 1 ? 'Datos Institucionales y Directores' :
               step === 2 ? 'Cuenta de Administrador' :
               step === 3 ? 'Confirmación' :
               step === 4 ? '¡Completado!' : ''}
            </h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
            {/* PASO 0: Selección de Modo */}
            {step === 0 && (
              <div className="space-y-2">
                <p className="text-text-secondary text-sm mb-4">
                  Selecciona cómo deseas configurar este equipo:
                </p>

                {/* Nueva Instalación */}
                <div
                  onClick={() => {
                    setMode('server');
                    setStep(1);
                  }}
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all group backdrop-blur-xl relative overflow-hidden ${
                    mode === 'server' 
                    ? 'border-accent bg-accent/5 shadow-glow' 
                    : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`p-3 rounded-xl transition-all ${
                      mode === 'server' ? 'bg-accent text-[#020617]' : 'bg-white/10 text-white group-hover:bg-accent group-hover:text-[#020617]'
                    }`}>
                      <School size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold transition-colors ${mode === 'server' ? 'text-accent' : 'text-text-primary group-hover:text-accent'}`}>Nueva Instalación (Servidor)</h3>
                      <p className="text-text-secondary text-sm">
                        Configura este equipo como el servidor principal. Aquí se guardarán todos los datos.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conectar a Servidor Existente (Cliente) */}
                <div 
                  className={`border-2 rounded-2xl p-8 backdrop-blur-xl transition-all group relative overflow-hidden ${
                    mode === 'client' 
                    ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                    : 'border-white/10 bg-white/5 hover:border-emerald-500/30'
                  }`}
                  onClick={() => setMode('client')}
                >
                  {/* Decoración de fondo */}
                  <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Wifi size={120} className="text-emerald-500" />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-6">
                      <div className={`p-4 rounded-2xl shadow-inner transition-all transform group-hover:rotate-6 ${
                        mode === 'client' ? 'bg-emerald-500 text-[#020617]' : 'bg-white/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-[#020617]'
                      }`}>
                        <Wifi size={32} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-black tracking-tight transition-colors ${mode === 'client' ? 'text-emerald-400' : 'text-text-primary group-hover:text-emerald-400'}`}>Conectar como Equipo Cliente</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          Sincroniza este dispositivo con un servidor central en tu red local.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Info size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">¿Dónde encuentro la URL?</p>
                          <p className="text-xs text-white/70 leading-relaxed">
                            En el servidor principal, ve a <span className="font-semibold text-white">Configuración &gt; Red</span>. 
                            Verás un código QR o la dirección IP que debes ingresar aquí.
                          </p>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleConnect} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-text-primary uppercase tracking-widest mb-2 ml-1">Dirección del Servidor</label>
                        <div className="relative group/input">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/input:text-emerald-400 transition-colors">
                            <Network size={20} />
                          </div>
                          <input
                            type="url"
                            value={serverUrl}
                            onChange={(e) => setServerUrl(e.target.value)}
                            placeholder="http://192.168.1.xxx:58824"
                            className="w-full pl-12 pr-4 py-4 border border-white/10 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 bg-[#020617]/50 text-emerald-400 font-mono text-sm transition-all"
                            required
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-2 ml-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <p className="text-[11px] text-text-muted">Ejemplo: http://192.168.1.50:58824</p>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={connectionStatus === 'connecting' || connectionStatus === 'connected'}
                        className={`w-full font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg transform active:scale-95 ${
                          connectionStatus === 'connected' 
                            ? 'bg-emerald-500 text-[#020617] shadow-emerald-500/20' 
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:text-[#020617] shadow-emerald-500/10 hover:shadow-emerald-500/30'
                        }`}
                      >
                        {connectionStatus === 'connecting' ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                            <span>Buscando Servidor...</span>
                          </>
                        ) : connectionStatus === 'connected' ? (
                          <>
                            <CheckCircle size={22} />
                            <span>¡Conexión Exitosa!</span>
                          </>
                        ) : (
                          <>
                            <LogIn size={20} />
                            <span>Vincular con Servidor</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* PASO 1: Institución */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Nombre de la Institución</label>
                    <div className="relative">
                      <School className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-[#020617] text-text-primary"
                        placeholder="Ej: Colegio San José"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Dirección</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-[#020617] text-text-primary"
                        placeholder="Ej: 4ta Calle 10-20 Zona 1"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">País</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 text-white/30" size={18} />
                      <input
                        type="text"
                        name="pais"
                        value={formData.pais}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg bg-white/5 text-white/50 cursor-default"
                        placeholder="Guatemala"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-white/30 mt-1">País configurado por defecto</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Departamento</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="departamento"
                          value={formData.departamento}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-[#020617] text-text-primary"
                          placeholder="Ej: Guatemala"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Municipio</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="municipio"
                          value={formData.municipio}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-[#020617] text-text-primary"
                          placeholder="Ej: Guatemala"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Email Institucional</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-[#020617] text-text-primary"
                          placeholder="contacto@colegio.edu"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Teléfono</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-[#020617] text-text-primary"
                          placeholder="+502 5555 5555"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Entrada</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="time"
                          name="horario_inicio"
                          value={formData.horario_inicio}
                          onChange={handleChange}
                          className="w-full pl-10 pr-2 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-[#020617] text-text-primary"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Salida</label>
                      <div className="relative">
                        <LogOut className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="time"
                          name="horario_salida"
                          value={formData.horario_salida}
                          onChange={handleChange}
                          className="w-full pl-10 pr-2 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-[#020617] text-text-primary"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Margen (min)</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="number"
                          name="margen_puntualidad_min"
                          value={formData.margen_puntualidad_min}
                          onChange={handleChange}
                          className="w-full pl-10 pr-2 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-[#020617] text-text-primary"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Logo Institucional</label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:bg-accent/5 hover:border-accent/50 transition-all cursor-pointer relative group backdrop-blur-sm bg-white/5">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required={!formData.logo_base64}
                      />
                      {logoPreview ? (
                        <div className="relative">
                          <img src={logoPreview} alt="Preview" className="h-24 mx-auto object-contain drop-shadow-md" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg">
                             <p className="text-transparent group-hover:text-accent font-medium text-sm">Cambiar Logo</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-white/50 group-hover:text-accent transition-colors">
                          <div className="bg-white/10 p-3 rounded-full mb-3 group-hover:bg-accent/10 transition-colors">
                              <Upload size={24} />
                          </div>
                          <p className="font-bold text-sm tracking-wide">Haz clic para subir el logo</p>
                          <p className="text-[10px] mt-1 text-white/30 font-medium">Soporta PNG, JPG</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-text-primary mb-1">Ciclo Escolar</label>
                     <div className="relative">
                       <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                       <input
                         type="number"
                         name="ciclo_escolar"
                         value={formData.ciclo_escolar}
                         onChange={handleChange}
                         className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-[#020617] text-text-primary"
                         min="2020"
                         max="2100"
                         required
                       />
                     </div>
                     <p className="text-xs text-text-muted mt-1">Año del ciclo escolar actual</p>
                  </div>

                  {/* Sección de Directores */}
                  <div className="border-t border-white/10 pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-text-primary">Directores de la Institución</h3>
                      <button
                        type="button"
                        onClick={addDirector}
                        disabled={directores.length >= 5}
                        className="bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-sm"
                      >
                        <User size={16} />
                        Agregar Director
                      </button>
                    </div>
                    
                    <p className="text-sm text-text-secondary mb-4">
                      Agregue los directores de su institución. Estos aparecerán en reportes oficiales.
                    </p>

                    <div className="space-y-4">
                      {directores.map((director, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm shadow-xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-text-primary">Director {index + 1}</span>
                            {directores.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeDirector(index)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-text-primary mb-1">Nombres</label>
                              <input
                                type="text"
                                value={director.nombres}
                                onChange={(e) => updateDirector(index, 'nombres', e.target.value)}
                                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent bg-[#020617] text-text-primary text-sm"
                                placeholder="Ej: Juan Carlos"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-text-primary mb-1">Apellidos</label>
                              <input
                                type="text"
                                value={director.apellidos}
                                onChange={(e) => updateDirector(index, 'apellidos', e.target.value)}
                                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent bg-[#020617] text-text-primary text-sm"
                                placeholder="Ej: Pérez López"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs font-medium text-text-primary mb-1 uppercase tracking-widest">Cargo</label>
                              <select
                                value={director.cargo}
                                onChange={(e) => updateDirector(index, 'cargo', e.target.value)}
                                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent bg-[#020617] text-text-primary text-sm appearance-none cursor-pointer"
                              >
                                <option value="" className="bg-[#0f172a]">Seleccione un cargo...</option>
                                <option value="Director General" className="bg-[#0f172a]">Director General</option>
                                <option value="Directora General" className="bg-[#0f172a]">Directora General</option>
                                <option value="Director" className="bg-[#0f172a]">Director</option>
                                <option value="Directora" className="bg-[#0f172a]">Directora</option>
                                <option value="Director Técnico" className="bg-[#0f172a]">Director Técnico</option>
                                <option value="Directora Técnica" className="bg-[#0f172a]">Directora Técnica</option>
                                <option value="Director Administrativo" className="bg-[#0f172a]">Director Administrativo</option>
                                <option value="Directora Administrativa" className="bg-[#0f172a]">Directora Administrativa</option>
                                <option value="Subdirector" className="bg-[#0f172a]">Subdirector</option>
                                <option value="Subdirectora" className="bg-[#0f172a]">Subdirectora</option>
                                <option value="Subdirector Técnico" className="bg-[#0f172a]">Subdirector Técnico</option>
                                <option value="Subdirectora Técnica" className="bg-[#0f172a]">Subdirectora Técnica</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-text-primary mb-1 uppercase tracking-widest">Sexo</label>
                              <select
                                value={director.sexo || ''}
                                onChange={(e) => updateDirector(index, 'sexo', e.target.value)}
                                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent bg-[#020617] text-text-primary text-sm appearance-none cursor-pointer"
                              >
                                <option value="" className="bg-[#0f172a]">Seleccione...</option>
                                <option value="Masculino" className="bg-[#0f172a]">Masculino</option>
                                <option value="Femenino" className="bg-[#0f172a]">Femenino</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-text-primary mb-1 uppercase tracking-widest">Jornada</label>
                              <select
                                value={director.jornada}
                                onChange={(e) => updateDirector(index, 'jornada', e.target.value)}
                                className="w-full px-3 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent bg-[#020617] text-text-primary text-sm appearance-none cursor-pointer"
                              >
                                <option value="" className="bg-[#0f172a]">-</option>
                                <option value="Matutina" className="bg-[#0f172a]">Matutina</option>
                                <option value="Vespertina" className="bg-[#0f172a]">Vespertina</option>
                                <option value="Nocturna" className="bg-[#0f172a]">Nocturna</option>
                                <option value="Semipresencial" className="bg-[#0f172a]">Semipresencial</option>
                                <option value="Virtual" className="bg-[#0f172a]">Virtual</option>
                                <option value="Fin de Semana (Sábado)" className="bg-[#0f172a]">Fin de Semana (Sábado)</option>
                                <option value="Fin de Semana (Domingo)" className="bg-[#0f172a]">Fin de Semana (Domingo)</option>
                                <option value="Extendida" className="bg-[#0f172a]">Extendida</option>
                              </select>
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs font-medium text-text-primary mb-1">Foto (Opcional)</label>
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center overflow-hidden border-2 border-white/10">
                                  {director.foto_preview ? (
                                    <img src={director.foto_preview} alt="Preview" className="w-full h-full object-cover" />
                                  ) : (
                                    <GenderAvatar sexo={director.sexo} size={30} />
                                  )}
                                </div>
                                <div className="flex gap-2">
                                   <button
                                     type="button"
                                     onClick={() => {
                                       const input = document.createElement('input');
                                       input.type = 'file';
                                       input.accept = 'image/*';
                                       input.onchange = (e) => handleDirectorFotoChange(index, e);
                                       input.click();
                                     }}
                                     className="p-1.5 bg-white/10 border border-white/10 rounded-lg text-text-primary hover:bg-white/20 transition-all flex items-center gap-1.5"
                                     title="Subir archivo"
                                   >
                                      <Upload size={14} />
                                      <span className="text-[10px] font-semibold uppercase tracking-wider">Subir</span>
                                   </button>
                                   <button
                                     type="button"
                                     onClick={() => {
                                       setWebcamTarget({ type: 'director', index });
                                       setShowWebcam(true);
                                     }}
                                     className="p-1.5 bg-accent/10 border border-accent/30 rounded-lg text-accent hover:bg-accent/20 transition-all flex items-center gap-1.5"
                                     title="Tomar foto"
                                   >
                                      <Camera size={14} />
                                      <span className="text-[10px] font-semibold uppercase tracking-wider">Cámara</span>
                                   </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="w-1/3 bg-white/5 hover:bg-white/10 text-text-primary border border-white/10 font-bold py-3 rounded-xl transition-all"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!formData.nombre || !formData.logo_file}
                      className="w-2/3 bg-accent hover:bg-accent-light text-[#020617] font-black py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow hover:shadow-accent/20 transform hover:-translate-y-0.5 active:scale-95"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 2: Administrador */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Nombres</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="admin_nombres"
                          value={formData.admin_nombres}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent bg-white/10 text-white"
                          placeholder="Juan"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Apellidos</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="admin_apellidos"
                          value={formData.admin_apellidos}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent bg-white/10 text-white"
                          placeholder="Pérez"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1 uppercase tracking-widest text-[11px]">Cargo</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-white/30" size={18} />
                        <select
                          name="admin_cargo"
                          value={formData.admin_cargo}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent appearance-none bg-[#020617] text-text-primary font-medium cursor-pointer"
                          required
                        >
                          <option value="" className="bg-[#0f172a]">Seleccione...</option>
                          <option value="Director" className="bg-[#0f172a]">Director</option>
                          <option value="Directora" className="bg-[#0f172a]">Directora</option>
                          <option value="Director General" className="bg-[#0f172a]">Director General</option>
                          <option value="Directora General" className="bg-[#0f172a]">Directora General</option>
                          <option value="Director Técnico" className="bg-[#0f172a]">Director Técnico</option>
                          <option value="Directora Técnica" className="bg-[#0f172a]">Directora Técnica</option>
                          <option value="Director Administrativo" className="bg-[#0f172a]">Director Administrativo</option>
                          <option value="Directora Administrativa" className="bg-[#0f172a]">Directora Administrativa</option>
                          <option value="Subdirector" className="bg-[#0f172a]">Subdirector</option>
                          <option value="Subdirectora" className="bg-[#0f172a]">Subdirectora</option>
                          <option value="Subdirector Técnico" className="bg-[#0f172a]">Subdirector Técnico</option>
                          <option value="Subdirectora Técnica" className="bg-[#0f172a]">Subdirectora Técnica</option>
                          <option value="Docente" className="bg-[#0f172a]">Docente</option>
                          <option value="Secretaria" className="bg-[#0f172a]">Secretaria</option>
                          <option value="Secretario" className="bg-[#0f172a]">Secretario</option>
                          <option value="Operativo" className="bg-[#0f172a]">Operativo</option>
                          <option value="Auxiliar" className="bg-[#0f172a]">Auxiliar</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1 uppercase tracking-widest text-[11px]">Nombre de Usuario</label>
                      <div className="relative">
                        <LogIn className="absolute left-3 top-3 text-white/30" size={18} />
                        <input
                          type="text"
                          name="admin_username"
                          value={formData.admin_username}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent bg-white/10 text-white"
                          placeholder="admin_acceso"
                          required={!formData.admin_email}
                        />
                      </div>
                      <p className="text-[10px] text-text-muted mt-0.5">Identificador único para entrar al sistema</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1 uppercase tracking-widest text-[11px]">Jornada</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 text-white/30" size={18} />
                        <select
                          name="admin_jornada"
                          value={formData.admin_jornada}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent appearance-none bg-[#020617] text-text-primary font-medium cursor-pointer"
                          required
                        >
                          <option value="" className="bg-[#0f172a]">Seleccione...</option>
                          <option value="Matutina" className="bg-[#0f172a]">Matutina</option>
                          <option value="Vespertina" className="bg-[#0f172a]">Vespertina</option>
                          <option value="Nocturna" className="bg-[#0f172a]">Nocturna</option>
                          <option value="Semipresencial" className="bg-[#0f172a]">Semipresencial</option>
                          <option value="Virtual" className="bg-[#0f172a]">Virtual</option>
                          <option value="Fin de Semana (Sábado)" className="bg-[#0f172a]">Fin de Semana (Sábado)</option>
                          <option value="Fin de Semana (Domingo)" className="bg-[#0f172a]">Fin de Semana (Domingo)</option>
                          <option value="Extendida" className="bg-[#0f172a]">Extendida</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-text-primary mb-1">Foto de Perfil (Opcional)</label>
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-bg-tertiary border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {formData.admin_foto_preview ? (
                            <img src={formData.admin_foto_preview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-gray-300"><User size={35} /></div>
                          )}
                        </div>
                        <div className="flex gap-2">
                           <button
                             type="button"
                             onClick={() => {
                               const input = document.createElement('input');
                               input.type = 'file';
                               input.accept = 'image/*';
                               input.onchange = (e) => handleAdminFotoChange(e);
                               input.click();
                             }}
                             className="p-2 bg-white/10 border border-white/10 rounded-lg text-text-primary hover:bg-white/20 transition-all flex items-center gap-2"
                             title="Subir archivo"
                           >
                              <Upload size={16} />
                              <span className="text-xs font-semibold uppercase tracking-wider">Subir</span>
                           </button>
                           <button
                             type="button"
                             onClick={() => {
                               setWebcamTarget({ type: 'admin', index: null });
                               setShowWebcam(true);
                             }}
                             className="p-2 bg-accent/10 border border-accent/30 rounded-lg text-accent hover:bg-accent/20 transition-all flex items-center gap-2"
                             title="Tomar foto"
                           >
                              <Camera size={16} />
                              <span className="text-xs font-semibold uppercase tracking-wider">Cámara</span>
                           </button>
                        </div>
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Email (Opcional)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="admin_email"
                        value={formData.admin_email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent bg-[#020617] text-text-primary ${
                          formData.admin_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.admin_email)
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-white/10'
                        }`}
                        placeholder="admin@ejemplo.com"
                        required={!formData.admin_username}
                      />
                    </div>
                    {formData.admin_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.admin_email) && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <span>⚠️</span>
                        <span>Formato de email inválido (ejemplo: usuario@dominio.com)</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="admin_password"
                        value={formData.admin_password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent bg-[#020617] text-text-primary"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-text-secondary transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <p className="text-xs text-text-muted mt-1">Mínimo 6 caracteres (mayúsculas o números recomendados)</p>
                    </div>
                    <PasswordStrengthIndicator password={formData.admin_password} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">Confirmar Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type={showPasswordConfirm ? "text" : "password"}
                        name="admin_password_confirm"
                        value={formData.admin_password_confirm}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-accent bg-[#020617] text-text-primary"
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-text-secondary transition-colors"
                      >
                        {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <p className="text-xs text-text-muted mt-1">Mínimo 8 caracteres (mayúsculas, minúsculas, símbolos y números)</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 bg-white/5 hover:bg-white/10 text-text-primary border border-white/10 font-bold py-3 rounded-xl transition-all"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={(!formData.admin_email && !formData.admin_username) || !formData.admin_password || formData.admin_password !== formData.admin_password_confirm}
                      className="w-2/3 bg-accent hover:bg-accent-light text-[#020617] font-black py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glow hover:shadow-accent/20 transform hover:-translate-y-0.5 active:scale-95"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 3: Vista Previa */}
              {step === 3 && (
                <div className="space-y-4">
                  {/* Datos Institucionales */}
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <School size={100} className="text-accent" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-accent flex items-center gap-2 text-lg uppercase tracking-wider">
                          <School size={22} />
                          Datos Institucionales
                        </h3>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="bg-accent/10 hover:bg-accent/20 text-accent p-2 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-text-secondary">Nombre:</span>
                          <span className="font-bold text-text-primary">{formData.nombre}</span>
                        </div>
                        {formData.direccion && (
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-text-secondary">Dirección:</span>
                            <span className="font-medium text-text-primary">{formData.direccion}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-text-secondary">Ubicación:</span>
                          <span className="font-medium text-text-primary">Guatemala - {formData.departamento} - {formData.municipio}</span>
                        </div>
                        {formData.email && (
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-text-secondary">Email:</span>
                            <span className="font-medium text-text-primary italic">{formData.email}</span>
                          </div>
                        )}
                        {formData.telefono && (
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-text-secondary">Teléfono:</span>
                            <span className="font-medium text-text-primary">{formData.telefono}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-text-secondary">Horario:</span>
                          <span className="font-medium px-2 py-0.5 bg-accent/10 rounded text-accent">{formData.horario_inicio} - {formData.horario_salida}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-text-secondary">Ciclo Escolar:</span>
                          <span className="font-bold text-accent">{formData.ciclo_escolar}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-text-secondary">Margen:</span>
                          <span className="font-medium text-text-primary">{formData.margen_puntualidad_min} min</span>
                        </div>
                        {logoPreview && (
                          <div className="mt-4 flex items-center gap-4 bg-[#020617]/50 p-3 rounded-xl border border-white/5">
                            <p className="text-white/60 text-xs uppercase tracking-widest font-bold">Logo:</p>
                            <img src={logoPreview} alt="Logo" className="h-12 w-12 object-contain rounded-lg bg-white p-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Directores Agregados */}
                  {directores.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users size={100} className="text-emerald-500" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-emerald-400 flex items-center gap-2 text-lg uppercase tracking-wider">
                            <Users size={22} />
                            Directores ({directores.length})
                          </h3>
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 p-2 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                        <div className="space-y-3">
                          {directores.map((director, index) => (
                            <div key={index} className="bg-[#020617]/40 rounded-xl p-4 border border-white/5 flex items-start gap-4">
                              <div className="relative flex-shrink-0">
                                {director.foto_preview ? (
                                  <img 
                                    src={director.foto_preview} 
                                    alt={`Director ${index + 1}`}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/50"
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border-2 border-emerald-500/30">
                                    <User size={30} className="text-emerald-500" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-text-primary text-lg">
                                  {director.nombres} {director.apellidos}
                                </p>
                                <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                                  {director.cargo}
                                </p>
                                {director.jornada && (
                                  <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                                    <Clock size={12} />
                                    Jornada {director.jornada}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Datos del Administrador */}
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <User size={100} className="text-blue-500" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-blue-400 flex items-center gap-2 text-lg uppercase tracking-wider">
                          <User size={22} />
                          Cuenta de Administrador
                        </h3>
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-2 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                      <div className="bg-[#020617]/40 rounded-xl p-4 border border-white/5 flex items-start gap-4">
                        <div className="relative flex-shrink-0">
                          {formData.admin_foto_preview ? (
                            <img 
                              src={formData.admin_foto_preview} 
                              alt="Administrador"
                              className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/50"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center border-2 border-blue-500/30">
                              <User size={30} className="text-blue-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-text-primary text-lg">
                            {formData.admin_nombres} {formData.admin_apellidos}
                          </p>
                          <p className="text-sm text-blue-400 font-bold uppercase tracking-widest text-[10px]">
                            {formData.admin_cargo}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {formData.admin_username && (
                              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-text-muted">
                                Usuario: <span className="text-text-primary font-bold">{formData.admin_username}</span>
                              </span>
                            )}
                            {formData.admin_email && (
                              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-text-muted">
                                {formData.admin_email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-1/3 bg-white/5 hover:bg-white/10 text-text-primary border border-white/10 font-bold py-3 rounded-xl transition-all"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-[#020617] font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-sm hover:shadow-glow transform hover:-translate-y-0.5 active:scale-95"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#020617]/30 border-t-[#020617]" />
                          <span>Inicializando...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          <span>Finalizar Setup</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

              {/* PASO 4: ÉXITO Y LLAVE MAESTRA */}
              {step === 4 && (
                <div className="space-y-6 text-center py-8">
                  <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-4 border border-emerald-500/20 shadow-glow-sm">
                    <CheckCircle size={56} className="animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tight">¡Configuración Completada!</h3>
                  <p className="text-text-secondary max-w-md mx-auto text-sm">
                    El sistema ha sido inicializado con éxito. Por favor, guarda la siguiente información en un lugar seguro.
                  </p>

                  <div className="bg-[#020617]/80 backdrop-blur-xl border-2 border-amber-500/30 rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Lock size={120} className="text-amber-500" />
                    </div>
                    <p className="text-amber-400 font-bold text-xs mb-4 uppercase tracking-widest">Llave Maestra de Recuperación</p>
                    <div className="flex items-center justify-center gap-4">
                      <code className="bg-white/5 px-8 py-4 rounded-xl border border-amber-500/20 text-4xl font-black text-amber-400 tracking-[0.2em] shadow-inner select-all font-mono">
                        {masterKey || '----------'}
                      </code>
                    </div>
                    <div className="mt-6 flex items-start gap-3 bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
                      <AlertCircle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-amber-200/70 text-xs leading-relaxed text-left">
                        <span className="text-amber-400 font-bold">IMPORTANTE:</span> Necesitarás esta llave para recuperar el acceso si olvidas la contraseña del Administrador.
                        No se volverá a mostrar. Guárdala, imprímela o tómale una foto.
                      </p>
                    </div>
                    
                    {/* Botones de Copiar y Descargar */}
                    <div className="flex gap-4 mt-8">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(masterKey);
                          toast.success('Llave copiada al portapapeles');
                        }}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Copy size={18} className="text-amber-400" />
                        Copiar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const element = document.createElement('a');
                          const content = `LLAVE MAESTRA DE RECUPERACIÓN\n` +
                                        `================================\n\n` +
                                        `Llave: ${masterKey}\n\n` +
                                        `Fecha de creación: ${new Date().toLocaleString('es-GT')}\n\n` +
                                        `IMPORTANTE:\n` +
                                        `- Guarda esta llave en un lugar seguro\n` +
                                        `- Necesitarás esta llave para recuperar el acceso si olvidas la contraseña\n` +
                                        `- No compartas esta llave con nadie\n` +
                                        `- No se volverá a mostrar después de cerrar esta ventana\n\n` +
                                        `Sistema de Administración Educativa (SAE)\n`;
                          const file = new Blob([content], { type: 'text/plain' });
                          element.href = URL.createObjectURL(file);
                          element.download = `llave-maestra-${Date.now()}.txt`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                          toast.success('Llave descargada como archivo .txt');
                        }}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-[#020617] font-black py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-glow-sm"
                      >
                        <Download size={18} />
                        Descargar .txt
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onComplete) onComplete();
                      navigate('/login');
                    }}
                    className="w-full bg-accent hover:bg-accent-light text-[#020617] font-black py-4 rounded-2xl shadow-glow transition-all transform hover:-translate-y-1 active:scale-95"
                  >
                    Ir al Inicio de Sesión
                  </button>
                </div>
              )}
              </motion.div>
            </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
      
      {/* Connection Modal */}
      <ConnectionModal 
        isOpen={showConnectionModal}
        status={connectionStatus}
        onClose={handleCloseConnectionModal}
        onCancel={cancelApprovalWait}
        errorMessage={connectionError}
        approvalCheckCount={approvalCheckCount}
      />
      <WebcamCaptureModal
        isOpen={showWebcam}
        onClose={() => {
          setShowWebcam(false);
          setWebcamTarget({ type: null, index: null });
        }}
        onCapture={(file, preview) => {
          if (webcamTarget.type === 'admin') {
            setFormData(prev => ({
              ...prev,
              admin_foto_file: file,
              admin_foto_preview: preview
            }));
          } else if (webcamTarget.type === 'director' && webcamTarget.index !== null) {
            const updated = [...directores];
            updated[webcamTarget.index].foto_file = file;
            updated[webcamTarget.index].foto_preview = preview;
            setDirectores(updated);
          }
          setShowWebcam(false);
        }}
      />
    </div>
  );
}

