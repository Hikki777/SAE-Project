import React, { useState } from 'react';
import client from '../api/client';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { School, User, Lock, Clock, CheckCircle, MapPin, Mail, Phone, LogOut, Upload, Edit2, Server, Wifi, Globe, Eye, EyeOff, Copy, Download, Users } from 'lucide-react';
import ConnectionModal from './ConnectionModal';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

export default function SetupWizard({ onComplete }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Mode Selection
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
    admin_password: '',
    admin_password_confirm: '',
    admin_cargo: '',
    admin_jornada: '',
    // Logo y Foto (Files)
    logo_base64: null, // Legacy check for preview
    logo_file: null,
    admin_foto_file: null,
    admin_foto_preview: null
  });

  const [logoPreview, setLogoPreview] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  // Estado para múltiples directores
  const [directores, setDirectores] = useState([
    { nombres: '', apellidos: '', cargo: 'Director General', sexo: '', jornada: '', foto_file: null, foto_preview: null }
  ]);

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
      sexo: '',
      jornada: '',
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
          window.location.href = '/login';
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
              window.location.href = '/login';
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
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.admin_email)) {
      toast.error('El formato del email no es válido');
      return;
    }
    
    // Validar contraseñas coinciden
    if (formData.admin_password !== formData.admin_password_confirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud mínima
    if (formData.admin_password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
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
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-900 overflow-auto">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white dark:bg-gray-800 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl"></div>
      </div>

      {/* Contenedor del formulario */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row my-4">
          
          {/* Sidebar */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white p-8 md:w-1/3 flex flex-col justify-between">
            <div>
              <div className="flex flex-col items-center text-center gap-4 mb-8">
                <img src="/logo.png" alt="Logo SAE" className="h-24 object-contain drop-shadow-md" />
                <div>
                  <h1 className="text-2xl font-bold">SAE</h1>
                  <p className="text-sm text-blue-100 mt-1">Sistema de Administración Educativa</p>
                </div>
              </div>
              <p className="text-blue-100 mb-6 text-center text-sm leading-relaxed">
                Gestión Educativa Libre
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
              SAE - Sistema de Administración Educativa v1.0
            </div>
          </div>

          {/* Formulario */}
          <div className="md:w-2/3">
            <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {step === 0 ? 'Modo de Instalación' :
               step === 1 ? 'Datos Institucionales y Directores' :
               step === 2 ? 'Cuenta de Administrador' :
               step === 3 ? 'Confirmación' :
               step === 4 ? '¡Completado!' : ''}
            </h2>

            {/* PASO 0: Selección de Modo */}
            {step === 0 && (
              <div className="space-y-2">
                <p className="text-gray-600 text-sm mb-4">
                  Selecciona cómo deseas configurar este equipo:
                </p>

                {/* Nueva Instalación */}
                <div 
                  onClick={() => setStep(1)}
                  className="border-2 border-blue-100 hover:border-blue-500 rounded-xl p-6 cursor-pointer transition-all hover:bg-blue-50 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <School size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Nueva Instalación (Servidor)</h3>
                      <p className="text-gray-600 text-sm">
                        Configura este equipo como el servidor principal. Aquí se guardarán todos los datos.
                      </p>
                    </div>
                  </div>
                </div>



                {/* Restaurar desde Backup */}
                <div className="border-2 border-purple-100 rounded-xl p-6 bg-purple-50/30 opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-purple-100 p-3 rounded-full text-purple-700">
                      <Upload size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">Restaurar desde Backup</h3>
                      <p className="text-gray-600 text-sm">
                        Reinstala el sistema recuperando datos desde un archivo de respaldo (.bak)
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Selecciona el archivo de backup
                      </label>
                      <input
                        type="file"
                        accept=".bak"
                        disabled
                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Solo archivos .bak generados por el sistema
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled
                      className="w-full bg-gray-300 text-gray-500 font-bold py-2 rounded-lg cursor-not-allowed"
                    >
                      Restaurar Sistema
                    </button>
                    <p className="text-xs text-amber-600 text-center font-medium">
                      ⚠️ Función en desarrollo - Próximamente disponible
                    </p>
                  </div>
                </div>



                {/* Conectar a Servidor Existente */}
                <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-green-100 p-3 rounded-full text-green-700">
                      <Wifi size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Conectar a Existente (Cliente)</h3>
                      <p className="text-gray-600 text-sm">
                        Conecta este equipo a un servidor local en tu red.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleConnect} className="mt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">URL del Servidor</label>
                      <div className="relative">
                        <Server className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="url"
                          value={serverUrl}
                          onChange={(e) => setServerUrl(e.target.value)}
                          placeholder="http://192.168.1.100:5000"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Ingresa la URL del servidor local (ej. http://192.168.1.100:5000).
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={connectionStatus === 'checking' || connectionStatus === 'success'}
                      className={`w-full font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                        connectionStatus === 'success' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {connectionStatus === 'checking' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Conectando...
                        </>
                      ) : connectionStatus === 'success' ? (
                        <>
                          <CheckCircle size={18} />
                          ¡Conectado!
                        </>
                      ) : (
                        'Conectar'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* PASO 1: Institución */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Nombre de la Institución</label>
                    <div className="relative">
                      <School className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        placeholder="Ej: Colegio San José"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Dirección</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        placeholder="Ej: 4ta Calle 10-20 Zona 1"
                      />
                    </div>
                  </div>


                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">País</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="pais"
                        value={formData.pais}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900"
                        placeholder="Guatemala"
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">País configurado por defecto</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Departamento</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="departamento"
                          value={formData.departamento}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          placeholder="Ej: Guatemala"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Municipio</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="municipio"
                          value={formData.municipio}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          placeholder="Ej: Guatemala"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Email Institucional</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          placeholder="contacto@colegio.edu"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Teléfono</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          placeholder="+502 5555 5555"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Entrada</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="time"
                          name="horario_inicio"
                          value={formData.horario_inicio}
                          onChange={handleChange}
                          className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          style={{ colorScheme: 'light' }}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Salida</label>
                      <div className="relative">
                        <LogOut className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="time"
                          name="horario_salida"
                          value={formData.horario_salida}
                          onChange={handleChange}
                          className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          style={{ colorScheme: 'light' }}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Margen (min)</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="number"
                          name="margen_puntualidad_min"
                          value={formData.margen_puntualidad_min}
                          onChange={handleChange}
                          className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Logo Institucional</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer relative group">
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
                             <p className="text-transparent group-hover:text-white font-medium text-sm">Cambiar Logo</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-gray-500 group-hover:text-blue-600 transition-colors">
                          <div className="bg-gray-100 p-3 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
                              <Upload size={24} />
                          </div>
                          <p className="font-medium">Haz clic para subir el logo</p>
                          <p className="text-xs mt-1 text-gray-400">Soporta PNG, JPG</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sección de Directores */}
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Directores de la Institución</h3>
                      <button
                        type="button"
                        onClick={addDirector}
                        disabled={directores.length >= 5}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <User size={16} />
                        Agregar Director
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Agregue los directores de su institución. Estos aparecerán en reportes oficiales.
                    </p>

                    <div className="space-y-4">
                      {directores.map((director, index) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-700">Director {index + 1}</span>
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
                              <label className="block text-xs font-medium text-gray-700 mb-1">Nombres</label>
                              <input
                                type="text"
                                value={director.nombres}
                                onChange={(e) => updateDirector(index, 'nombres', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm"
                                placeholder="Ej: Juan Carlos"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Apellidos</label>
                              <input
                                type="text"
                                value={director.apellidos}
                                onChange={(e) => updateDirector(index, 'apellidos', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm"
                                placeholder="Ej: Pérez López"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Cargo</label>
                              <select
                                value={director.cargo}
                                onChange={(e) => updateDirector(index, 'cargo', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm"
                              >
                                <option value="">Seleccione un cargo...</option>
                                <option value="Director General">Director General</option>
                                <option value="Directora General">Directora General</option>
                                <option value="Director">Director</option>
                                <option value="Directora">Directora</option>
                                <option value="Director Técnico">Director Técnico</option>
                                <option value="Directora Técnica">Directora Técnica</option>
                                <option value="Subdirector">Subdirector</option>
                                <option value="Subdirectora">Subdirectora</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Sexo</label>
                              <select
                                value={director.sexo || ''}
                                onChange={(e) => updateDirector(index, 'sexo', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm"
                              >
                                <option value="">Seleccione...</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Jornada</label>
                              <select
                                value={director.jornada}
                                onChange={(e) => updateDirector(index, 'jornada', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-sm"
                              >
                                <option value="">-</option>
                                <option value="Matutina">Matutina</option>
                                <option value="Vespertina">Vespertina</option>
                                <option value="Nocturna">Nocturna</option>
                                <option value="Semipresencial">Semipresencial</option>
                                <option value="Virtual">Virtual</option>
                                <option value="Fin de Semana (Sábado)">Fin de Semana (Sábado)</option>
                                <option value="Fin de Semana (Domingo)">Fin de Semana (Domingo)</option>
                                <option value="Extendida">Extendida</option>
                              </select>
                            </div>
                            <div className="col-span-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Foto (Opcional)</label>
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                                  {director.foto_preview ? (
                                    <img src={director.foto_preview} alt="Preview" className="w-full h-full object-cover" />
                                  ) : (
                                    <User size={20} className="text-gray-400" />
                                  )}
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleDirectorFotoChange(index, e)}
                                  className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!formData.nombre || !formData.logo_file}
                      className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                      <label className="block text-sm font-medium text-gray-900 mb-1">Nombres</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="admin_nombres"
                          value={formData.admin_nombres}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                          placeholder="Juan"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Apellidos</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="admin_apellidos"
                          value={formData.admin_apellidos}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                          placeholder="Pérez"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Cargo</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-gray-400" size={18} />
                        <select
                          name="admin_cargo"
                          value={formData.admin_cargo}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-900"
                          required
                        >
                          <option value="">Seleccione...</option>
                          <option value="Director">Director(a)</option>
                          <option value="Director General">Director General</option>
                          <option value="Directora General">Directora General</option>
                          <option value="Director Técnico">Director Técnico</option>
                          <option value="Directora Técnica">Directora Técnica</option>
                          <option value="Subdirector">Subdirector(a)</option>
                          <option value="Secretaria">Secretaria(o)</option>
                          <option value="Administrador">Administrador(a)</option>
                          <option value="Coordinador">Coordinador(a)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">Jornada</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                        <select
                          name="admin_jornada"
                          value={formData.admin_jornada}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-900"
                          required
                        >
                          <option value="">Seleccione...</option>
                          <option value="Matutina">Matutina</option>
                          <option value="Vespertina">Vespertina</option>
                          <option value="Nocturna">Nocturna</option>
                          <option value="Semipresencial">Semipresencial</option>
                          <option value="Virtual">Virtual</option>
                          <option value="Fin de Semana (Sábado)">Fin de Semana (Sábado)</option>
                          <option value="Fin de Semana (Domingo)">Fin de Semana (Domingo)</option>
                          <option value="Extendida">Extendida</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-900 mb-1">Foto de Perfil (Opcional)</label>
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {formData.admin_foto_preview ? (
                            <img src={formData.admin_foto_preview} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <User size={24} className="text-gray-400" />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAdminFotoChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Email del Administrador</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="admin_email"
                        value={formData.admin_email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${
                          formData.admin_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.admin_email)
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300'
                        }`}
                        placeholder="admin@colegio.edu"
                        required
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
                    <label className="block text-sm font-medium text-gray-900 mb-1">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="admin_password"
                        value={formData.admin_password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres (mayúsculas, minúsculas, símbolos y números)</p>
                    </div>
                    <PasswordStrengthIndicator password={formData.admin_password} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Confirmar Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type={showPasswordConfirm ? "text" : "password"}
                        name="admin_password_confirm"
                        value={formData.admin_password_confirm}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres (mayúsculas, minúsculas, símbolos y números)</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!formData.admin_email || !formData.admin_password || formData.admin_password !== formData.admin_password_confirm}
                      className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <School size={20} className="text-blue-600" />
                        Datos Institucionales
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <Edit2 size={14} />
                        Editar
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nombre:</span>
                        <span className="font-medium text-gray-900">{formData.nombre}</span>
                      </div>
                      {formData.direccion && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dirección:</span>
                          <span className="font-medium text-gray-900">{formData.direccion}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ubicación:</span>
                        <span className="font-medium text-gray-900">Guatemala - {formData.departamento} - {formData.municipio}</span>
                      </div>
                      {formData.email && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-gray-900">{formData.email}</span>
                        </div>
                      )}
                      {formData.telefono && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Teléfono:</span>
                          <span className="font-medium text-gray-900">{formData.telefono}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Horario:</span>
                        <span className="font-medium text-gray-900">{formData.horario_inicio} - {formData.horario_salida}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Margen:</span>
                        <span className="font-medium text-gray-900">{formData.margen_puntualidad_min} min</span>
                      </div>
                      {logoPreview && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <p className="text-gray-600 text-xs mb-2">Logo:</p>
                          <img src={logoPreview} alt="Logo" className="h-16 object-contain" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Directores Agregados */}
                  {directores.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <Users size={20} className="text-purple-600" />
                          Directores ({directores.length})
                        </h3>
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
                        >
                          <Edit2 size={14} />
                          Editar
                        </button>
                      </div>
                      <div className="space-y-3">
                        {directores.map((director, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 border border-purple-200">
                            <div className="flex items-start gap-3">
                              {director.foto_preview ? (
                                <img 
                                  src={director.foto_preview} 
                                  alt={`Director ${index + 1}`}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-300"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-300">
                                  <User size={24} className="text-purple-600" />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {director.nombres} {director.apellidos}
                                </p>
                                <p className="text-sm text-purple-700 font-medium">
                                  {director.cargo}
                                </p>
                                {director.jornada && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    Jornada: {director.jornada}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Datos del Administrador */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <User size={20} className="text-green-600" />
                        Cuenta de Administrador
                      </h3>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                      >
                        <Edit2 size={14} />
                        Editar
                      </button>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <div className="flex items-start gap-3">
                        {formData.admin_foto_preview ? (
                          <img 
                            src={formData.admin_foto_preview} 
                            alt="Administrador"
                            className="w-12 h-12 rounded-full object-cover border-2 border-green-300"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-300">
                            <User size={24} className="text-green-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {formData.admin_nombres} {formData.admin_apellidos}
                          </p>
                          <p className="text-sm text-green-700 font-medium">
                            {formData.admin_cargo}
                          </p>
                          {formData.admin_jornada && (
                            <p className="text-xs text-gray-600 mt-1">
                              Jornada: {formData.admin_jornada}
                            </p>
                          )}
                          <p className="text-xs text-gray-600 mt-1">
                            Email: {formData.admin_email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg transition-colors"
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          Inicializando...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          Finalizar Setup
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* PASO 4: ÉXITO Y LLAVE MAESTRA */}
              {step === 4 && (
                <div className="space-y-6 text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-4 animate-bounce">
                    <CheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">¡Configuración Completada!</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    El sistema ha sido inicializado con éxito. Por favor, guarda la siguiente información en un lugar seguro.
                  </p>

                  <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Lock size={64} />
                    </div>
                    <p className="text-amber-800 font-bold text-sm mb-2 uppercase tracking-wider">Llave Maestra de Recuperación</p>
                    <div className="flex items-center justify-center gap-4">
                      <code className="bg-white px-6 py-3 rounded-lg border border-amber-300 text-3xl font-black text-amber-900 tracking-[0.2em] shadow-inner select-all">
                        {masterKey || '----------'}
                      </code>
                    </div>
                    <p className="text-amber-700 text-xs mt-4 leading-relaxed">
                      ⚠️ **IMPORTANTE**: Necesitarás esta llave para recuperar el acceso si olvidas la contraseña del Administrador. <br/>
                      No se volverá a mostrar. Guárdala, imprímela o tómale una foto.
                    </p>
                    
                    {/* Botones de Copiar y Descargar */}
                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(masterKey);
                          toast.success('Llave copiada al portapapeles');
                        }}
                        className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <Copy size={18} />
                        Copiar Llave
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
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-xl transition-all transform hover:-translate-y-1 hover:shadow-2xl"
                  >
                    Ir al Inicio de Sesión
                  </button>
                </div>
              )}
            </form>
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
    </div>
  );
}

