/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, LogIn, GraduationCap, Mail, Lock, CheckCircle2, XCircle, Eye, EyeOff, Info } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { authAPI } from '../api/endpoints';

const API_URL = localStorage.getItem('api_url') || import.meta.env.VITE_API_URL || '/api';
const BASE_URL = API_URL.startsWith('http') ? API_URL.replace(/\/api$/, '').replace(/\/$/, '') : '';

// Sound effects
const playSound = (type) => {
  const sounds = {
    success: 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3',
    error: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3'
  };
  const audio = new Audio(sounds[type]);
  audio.play().catch(e => console.error('Error playing sound:', e));
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState('info'); // 'info' o 'form'
  const [submitted, setSubmitted] = useState(false);
  const [recoveryData, setRecoveryData] = useState({ email: '', masterKey: '', newPassword: '' });
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (!email || !password) return;

    setLoading(true);
    setError(null);
    setSubmitted(true);
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido');
      setLoading(false);
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 3000);
      return;
    }

    try {
      const { data } = await authAPI.login(email, password);
      if (data?.accessToken) {
        setLoggedInUser(data.user);
        playSound('success');
        setShowSuccessModal(true);
        localStorage.setItem('token', data.accessToken);
        
        // Wait for animation before redirect
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (err) {
      playSound('error');
      const msg = err.response?.data?.error || err.message || 'Error al iniciar sesión';
      setError(msg);
      setShowErrorModal(true);
      // Auto close error modal after 3 seconds
      setTimeout(() => setShowErrorModal(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async (e) => {
    e.preventDefault();
    setRecoveryLoading(true);
    
    try {
      await authAPI.resetAdmin(recoveryData.email, recoveryData.masterKey, recoveryData.newPassword);
      toast.success('¡Contraseña restablecida con éxito!');
      setRecoveryMode('info');
      setShowRecoveryModal(false);
      setRecoveryData({ email: '', masterKey: '', newPassword: '' });
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al restablecer contraseña';
      toast.error(msg);
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Modals Overlay */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border-t-8 border-green-500"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 overflow-hidden border-2 border-green-200">
                {loggedInUser?.foto_path ? (
                  <img 
                    src={`${BASE_URL}/uploads/${loggedInUser.foto_path}`} 
                    alt="User" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <CheckCircle2 size={48} />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido!</h2>
              <p className="text-gray-600 text-lg mb-4">
                Hola, <span className="font-bold text-blue-600">
                  {loggedInUser?.nombres ? `${loggedInUser.nombres} ${loggedInUser.apellidos || ''}` : loggedInUser?.email.split('@')[0]}
                </span>
              </p>
              <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                Accediendo al sistema...
              </div>
            </motion.div>
          </motion.div>
        )}

        {showErrorModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center border-t-8 border-red-500"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <XCircle size={40} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error de Acceso</h2>
              <p className="text-gray-600">{error === 'Credenciales inválidas' ? 'Email o contraseña incorrectos' : error}</p>
            </motion.div>
          </motion.div>
        )}

        {showRecoveryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full border-t-8 border-blue-500 relative"
            >
              <button 
                onClick={() => setShowRecoveryModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XCircle size={24} />
              </button>

              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                <Info size={40} />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                {recoveryMode === 'info' ? '¿Olvidaste tu contraseña?' : 'Recuperar Administrador'}
              </h2>
              
              {recoveryMode === 'info' ? (
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-50 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">1</div>
                    <p><span className="font-bold text-gray-900 dark:text-white">Personal Operativo:</span> Contacta al Administrador del sistema para restablecer tu clave.</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-50 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold shrink-0">2</div>
                    <div>
                      <p><span className="font-bold text-gray-900 dark:text-white">Administradores:</span> Inicia el proceso usando tu Llave Maestra de Recuperación.</p>
                      <button 
                         onClick={() => setRecoveryMode('form')}
                         className="mt-4 w-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold py-2 rounded-lg border border-blue-100 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all flex items-center justify-center gap-2"
                      >
                         <Lock size={16} />
                         Usar Llave Maestra
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRecovery} className="space-y-4">
                   <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Email del Admin</label>
                     <input 
                       type="email"
                       required
                       value={recoveryData.email}
                       onChange={(e) => setRecoveryData({...recoveryData, email: e.target.value})}
                       className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                       placeholder="admin@ejemplo.com"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Llave Maestra (12 chars)</label>
                     <input 
                       type="text"
                       required
                       maxLength={12}
                       value={recoveryData.masterKey}
                       onChange={(e) => setRecoveryData({...recoveryData, masterKey: e.target.value.toUpperCase()})}
                       className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white font-mono tracking-widest"
                       placeholder="ABC123XYZ000"
                     />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Nueva Contraseña</label>
                     <input 
                       type="password"
                       required
                       minLength={8}
                       value={recoveryData.newPassword}
                       onChange={(e) => setRecoveryData({...recoveryData, newPassword: e.target.value})}
                       className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                       placeholder="••••••••"
                     />
                   </div>

                   <div className="flex gap-3 pt-2">
                     <button
                       type="button"
                       onClick={() => setRecoveryMode('info')}
                       className="w-1/3 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 font-bold py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-all"
                     >
                       Volver
                     </button>
                     <button
                       type="submit"
                       disabled={recoveryLoading}
                       className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                     >
                       {recoveryLoading ? 'Procesando...' : 'Restablecer'}
                     </button>
                   </div>
                </form>
              )}

              {recoveryMode === 'info' && (
                <button
                  onClick={() => setShowRecoveryModal(false)}
                  className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Entendido
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      <div className="absolute -bottom-8 -left-8 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div className="absolute -top-8 left-1/3 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full relative z-10 border border-white/20"
      >
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="mb-6 relative inline-block">
            <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full"></div>
            <div className="relative bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <img src="/logo.png" alt="Logo SAE" className="h-16 w-16 mx-auto object-contain" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">SAE</h1>
            <p className="text-gray-500 font-medium">Sistema de Administración Educativa</p>
            <p className="text-gray-400 text-sm mt-1">Gestión Educativa Libre</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} className="text-gray-400 group-focus-within:text-inherit" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 bg-white border ${submitted && !email ? 'border-red-500 ring-4 ring-red-500/10' : 'border-gray-200'} rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400 shadow-sm`}
                placeholder="admin@test.edu"
                required
              />
            </div>
            {submitted && !email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">Ingresa un correo válido</p>}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Contraseña</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} className="text-gray-400 group-focus-within:text-inherit" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-11 pr-12 py-3 bg-white border ${submitted && !password ? 'border-red-500 ring-4 ring-red-500/10' : 'border-gray-200'} rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400 shadow-sm`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {submitted && !password && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">La contraseña es requerida</p>}
            
            <div className="text-right mt-2 flex justify-end">
              <button 
                type="button"
                onClick={() => setShowRecoveryModal(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-all"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || showSuccessModal}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transform select-none"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Cargando...</span>
              </div>
            ) : (
              <>
                <LogIn size={20} />
                <span>Iniciar Sesión</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
