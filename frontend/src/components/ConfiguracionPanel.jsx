/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Home, Settings, BarChart3, Wrench, User, Clock, Users, FileText, Activity, ClipboardList, LogIn, Camera, Plus, Trash2, Save, XCircle, CheckCircle, Upload, Download, FileArchive, AlertOctagon, AlertCircle, RefreshCcw, Server, Lock, RotateCcw, Edit, FolderOpen, Building2, Timer } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = localStorage.getItem('api_url') || import.meta.env.VITE_API_URL || '/api';
const BASE_URL = API_URL.startsWith('http') ? API_URL.replace(/\/api$/, '').replace(/\/$/, '') : '';
const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- SUBCOMPONENT: Settings Sidebar ---
const SettingsSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'institucion', label: 'Institucional', icon: Building2 },
    { id: 'usuarios', label: 'Gestión de Usuarios', icon: Users },
    { id: 'equipos', label: 'Red / Equipos', icon: Server },
    { id: 'academico', label: 'Control Académico', icon: FileText }, // New Tab
    { id: 'sistema', label: 'Sistema y Reset', icon: Trash2 }, // Reusing icon or similar
  ];

  return (
    <div className="md:w-64 flex-shrink-0">
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400'} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

// --- SUBCOMPONENT: Institucion Settings ---
const InstitucionSettings = ({ formData, setFormData, logoPreview, handleLogoChange, handleSubmit, saving, directores, loadingDirectores, onAddDirector, onEditDirector, onDeleteDirector }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-8"
  >
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Building2 size={24} className="text-blue-600" />
        Información General
      </h3>
      <p className="text-sm text-gray-500 mt-1">Configura los datos principales de tu centro educativo.</p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Básica */}
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre de la Institución *
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Colegio San José"
            />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5 relative group">
              <span className="text-blue-600 font-bold">Ciclo Escolar</span>
              <AlertCircle size={14} className="text-amber-500 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                Esto define el prefijo de los carnets (Ej: A-2026...)
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </label>
            <input
              type="number"
              required
              min="2000"
              max="2100"
              value={formData.ciclo_escolar}
              onChange={(e) => setFormData({ ...formData, ciclo_escolar: parseInt(e.target.value) })}
              className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2.5 text-blue-900 dark:text-blue-100 font-bold text-center focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dirección
          </label>
          <input
            type="text"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Calle, número, colonia, ciudad"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">País</label>
            <input
              type="text"
              value={formData.pais}
              onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Departamento/Estado</label>
            <input
              type="text"
              value={formData.departamento}
              onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-md font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Upload size={20} className="text-blue-600" />
          Logo Institucional
        </h4>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {logoPreview && (
            <div className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
              <img src={logoPreview} alt="Logo" className="w-32 h-32 object-contain" />
            </div>
          )}
          <div className="flex-1 w-full">
            <input
              id="logo-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleLogoChange}
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300 dark:hover:file:bg-blue-900/50"
            />
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <AlertCircle size={12} />
              Máx 10MB. Al guardar, los códigos QR se regenerarán con el nuevo logo.
            </p>
          </div>
        </div>
      </div>

      {/* Horarios */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h4 className="text-md font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Clock size={20} className="text-blue-600" />
          Horarios y Puntualidad
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
              <LogIn size={16} className="text-green-600 dark:text-green-400" />
              Entrada
            </label>
            <input
              type="time"
              required
              value={formData.horario_inicio}
              onChange={(e) => setFormData({ ...formData, horario_inicio: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
              <LogOut size={16} className="text-orange-600 dark:text-orange-400" />
              Salida
            </label>
            <input
              type="time"
              required
              value={formData.horario_salida}
              onChange={(e) => setFormData({ ...formData, horario_salida: e.target.value })}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
              <Timer size={16} className="text-blue-600 dark:text-blue-400" />
              Tolerancia (min)
            </label>
            <input
              type="number"
              min="0"
              max="60"
              value={formData.margen_puntualidad_min}
              onChange={(e) => setFormData({ ...formData, margen_puntualidad_min: parseInt(e.target.value) })}
              className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </form>

    {/* Gestión de Directores */}
    <DirectoresList 
      directores={directores}
      loading={loadingDirectores}
      onAdd={onAddDirector}
      onEdit={onEditDirector}
      onDelete={onDeleteDirector}
    />
  </motion.div>
);

// --- SUBCOMPONENT: Directores List ---
const DirectoresList = ({ directores, loading, onAdd, onEdit, onDelete }) => (
  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
    <div className="flex items-center justify-between mb-4">
      <h4 className="text-md font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Users size={20} className="text-blue-600" />
        Equipo Directivo
      </h4>
      <button
        onClick={onAdd}
        className="text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1.5 font-medium"
      >
        <Plus size={16} />
        Añadir Director
      </button>
    </div>

    {loading ? (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    ) : directores.length === 0 ? (
      <div className="bg-gray-50 dark:bg-gray-900/30 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center">
        <Users size={32} className="mx-auto text-gray-400 mb-2 opacity-50" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">No se han registrado directores aún.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {directores.map((director) => (
          <div 
            key={director.id}
            className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200"
          >
            <div className="relative">
              {director.foto_path ? (
                <img 
                  src={`${BASE_URL}/uploads/${director.foto_path}`}
                  alt={director.nombres}
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-100 dark:border-blue-900"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-100 dark:border-blue-900">
                  <User size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-gray-900 dark:text-gray-100 truncate">
                {director.nombres} {director.apellidos}
              </h5>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                {director.cargo}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded">
                  {director.jornada}
                </span>
                <span className="text-[10px] font-mono text-gray-400">
                  {director.carnet}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(director)}
                className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title="Editar"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => onDelete(director.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// --- SUBCOMPONENT: Director Modal ---
const DirectorModal = ({ isOpen, onClose, director, onSave, saving }) => {
  const [localData, setLocalData] = React.useState({
    nombres: '',
    apellidos: '',
    cargo: 'Director',
    sexo: 'Masculino',
    jornada: 'Matutina'
  });
  const [foto, setFoto] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (director) {
      setLocalData({
        nombres: director.nombres || '',
        apellidos: director.apellidos || '',
        cargo: director.cargo || 'Director',
        sexo: director.sexo || 'Masculino',
        jornada: director.jornada || 'Matutina'
      });
      setPreview(director.foto_path ? `${BASE_URL}/uploads/${director.foto_path}` : null);
    } else {
      setLocalData({
        nombres: '',
        apellidos: '',
        cargo: 'Director',
        sexo: 'Masculino',
        jornada: 'Matutina'
      });
      setPreview(null);
    }
    setFoto(null);
  }, [director, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localData, foto);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">
              {director ? 'Editar Director' : 'Nuevo Director'}
            </h3>
            <p className="text-blue-100 text-sm opacity-90">
              Completa la información del directivo
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Foto */}
          <div className="flex flex-col items-center gap-3">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors group overflow-hidden"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera size={32} className="text-gray-400" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={20} className="text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setFoto(file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
              accept="image/*"
            />
            <span className="text-xs text-gray-500">Foto de perfil</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombres *</label>
              <input
                type="text"
                required
                value={localData.nombres}
                onChange={(e) => setLocalData({ ...localData, nombres: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Nombres"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Apellidos *</label>
              <input
                type="text"
                required
                value={localData.apellidos}
                onChange={(e) => setLocalData({ ...localData, apellidos: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Apellidos"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cargo *</label>
              <select
                required
                value={localData.cargo}
                onChange={(e) => setLocalData({ ...localData, cargo: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              >
                <option value="Director">Director</option>
                <option value="Directora">Directora</option>
                <option value="Director General">Director General</option>
                <option value="Directora General">Directora General</option>
                <option value="Subdirector">Subdirector</option>
                <option value="Subdirectora">Subdirectora</option>
              </select>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sexo *</label>
              <select
                required
                value={localData.sexo}
                onChange={(e) => setLocalData({ ...localData, sexo: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Jornada *</label>
              <select
                required
                value={localData.jornada}
                onChange={(e) => setLocalData({ ...localData, jornada: e.target.value })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              >
                <option value="Matutina">Matutina</option>
                <option value="Vespertina">Vespertina</option>
                <option value="Nocturna">Nocturna</option>
                <option value="Extendida">Extendida</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <Save size={20} />
              )}
              {director ? 'Guardar Cambios' : 'Crear Director'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

// --- SUBCOMPONENT: Usuario Settings ---
const UsuarioSettings = ({ usuarios, loadingUsers, showUserModal, setShowUserModal, newUser, setNewUser, handleCreateUser, handleDeleteUser, fetchUsuarios, handlePhotoUpload, handleNewUserPhotoChange }) => {
  const fileInputRef = React.useRef(null);
  const [uploadingUserId, setUploadingUserId] = React.useState(null);

  const onCameraClick = (userId) => {
    setUploadingUserId(userId);
    fileInputRef.current.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file && uploadingUserId) {
      handlePhotoUpload(uploadingUserId, file);
    }
    e.target.value = ''; // Reset
  };

  return (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6"
  >
    {/* Hidden File Input */}
    <input 
      type="file" 
      ref={fileInputRef} 
      className="hidden" 
      accept="image/*"
      onChange={onFileChange} 
    />

    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Users size={24} className="text-blue-600" />
          Gestión de Usuarios
        </h3>
        <p className="text-sm text-gray-500 mt-1">Control de acceso y roles para administradores y operadores.</p>
      </div>
      <button
        onClick={() => setShowUserModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
      >
        <Plus size={16} />
        Crear Usuario
      </button>
    </div>

    {/* Tabla Usuarios */}
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">Usuario</th>
            <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">Rol</th>
            <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">Cargo</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {usuarios.length > 0 ? (
            usuarios.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative group/avatar cursor-pointer" onClick={() => onCameraClick(user.id)}>
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-gray-600">
                        {user.foto_path ? (
                          <img 
                            src={`${BASE_URL}/uploads/${user.foto_path}?t=${Date.now()}`} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500 font-bold text-xs">{user.nombres?.[0]}{user.apellidos?.[0]}</span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                         <Camera size={16} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{user.nombres} {user.apellidos}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    user.rol === 'admin' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  }`}>
                    {user.rol === 'admin' ? 'Administrador' : 'Operador'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {user.cargo || '-'}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => {
                      setNewUser({
                        ...user,
                        password: '' // No cargar password actual por seguridad
                      });
                      setShowUserModal(true);
                      setIsEditingUser(true);
                      setEditingUserId(user.id);
                    }}
                    className="text-blue-500 hover:text-blue-700 p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                    title="Editar Usuario"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Eliminar Usuario"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                {loadingUsers ? 'Cargando usuarios...' : 'No hay usuarios registrados.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>


  </motion.div>
  );
};

// --- SUBCOMPONENT: Equipo Settings ---
const EquipoSettings = ({ equipos, loading, onApprove, onDelete, serverInfo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6"
    >
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Server size={24} className="text-blue-600" />
            Gestión de Equipos y Red
          </h3>
          <p className="text-sm text-gray-500 mt-1">Administra los dispositivos que pueden acceder al sistema en la red interna.</p>
        </div>
      </div>

      {/* Info Servidor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl">
          <h4 className="text-blue-900 dark:text-blue-200 font-bold flex items-center gap-2 mb-2">
            <Building2 size={18} />
            Información del Servidor
          </h4>
          <div className="space-y-1">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold">Hostname:</span> {serverInfo?.hostname}
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold">IPs Locales:</span> {serverInfo?.ips?.join(', ')}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 italic">
              Use estas IPs para configurar los clientes en la misma red.
            </p>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-xl">
          <h4 className="text-green-900 dark:text-green-200 font-bold flex items-center gap-2 mb-2">
            <AlertCircle size={18} />
            Estado de Seguridad
          </h4>
          <p className="text-sm text-green-800 dark:text-green-300">
            {equipos.some(e => e.aprobado) 
              ? '✅ Control de acceso IP activado.' 
              : '⚠️ Todos los equipos pueden conectar (Modo Setup).'}
          </p>
          <p className="text-xs text-green-700 dark:text-green-400 mt-1">
            Al aprobar el primer equipo, el acceso se restringirá solo a los aprobados.
          </p>
        </div>
      </div>

      {/* Tabla Equipos */}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">Dispositivo</th>
              <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">IP / OS</th>
              <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">Estado</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {equipos.length > 0 ? (
              equipos.map((eq) => (
                <tr key={eq.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                  !eq.aprobado ? 'bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500' : ''
                }`}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{eq.nombre || 'PC sin nombre'}</div>
                    <div className="text-xs text-gray-500">{eq.hostname || 'Desconocido'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900 dark:text-gray-100">{eq.ip}</div>
                    <div className="text-xs text-gray-500">{eq.os || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      eq.aprobado 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {eq.aprobado ? 'Aprobado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => onApprove(eq.id, !eq.aprobado)}
                      className={`p-1.5 rounded-md transition-colors ${
                        eq.aprobado 
                          ? 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20' 
                          : 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                      title={eq.aprobado ? 'Revocar Acceso' : 'Aprobar Equipo'}
                    >
                      {eq.aprobado ? <LogOut size={16} /> : <Save size={16} />}
                    </button>
                    <button
                      onClick={() => onDelete(eq.id)}
                      className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  {loading ? 'Cargando equipos...' : 'No hay equipos registrados.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// --- SUBCOMPONENT: Control Academico Settings ---
const ControlAcademicoSettings = () => {
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [confirmMigration, setConfirmMigration] = useState(false);
  const [anioObjetivo, setAnioObjetivo] = useState(new Date().getFullYear() + 1);

  const handleGenerarPreview = async () => {
    setLoading(true);
    try {
      const response = await client.get(`/migracion/preview?anio=${anioObjetivo}`);
      setPreviewData(response.data.preview);
      toast.success('Vista previa generada');
    } catch (error) {
      console.error(error);
      toast.error('Error generando vista previa');
    } finally {
      setLoading(false);
    }
  };

  const handleEjecutarMigracion = async () => {
    if (!confirmMigration) return;
    setExecuting(true);
    try {
      const response = await client.post('/migracion/fin-de-anio', { anioEscolar: anioObjetivo });
      const { resultados } = response.data;
      
      let msg = `Migración completada. ${resultados.promovidos.length} promovidos`;
      if (resultados.graduados.length > 0) msg += `, ${resultados.graduados.length} graduados`;
      
      toast.success(msg, { duration: 6000 });
      setPreviewData(null);
      setConfirmMigration(false);
    } catch (error) {
      console.error(error);
      toast.error('Error en migración: ' + (error.response?.data?.error || error.message));
    } finally {
      setExecuting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6"
    >
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FileText size={24} className="text-blue-600" />
          Control Académico y Migración
        </h3>
        <p className="text-sm text-gray-500 mt-1">Gestión de fin de año, promoción de grados y graduaciones.</p>
      </div>

      {/* Panel de Control */}
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-4 flex items-center gap-2">
          <Activity size={20} />
          Migración de Fin de Año
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-300 mb-6">
          Esta herramienta mueve a todos los alumnos activos a su siguiente grado correspondiente según las reglas académicas.
          Los alumnos de último grado serán marcados como graduados.
        </p>

        <div className="flex items-end gap-4">
          <div>
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
               Año Escolar Destino
             </label>
             <input 
               type="number" 
               className="w-32 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-3 py-2"
               value={anioObjetivo}
               onChange={(e) => setAnioObjetivo(parseInt(e.target.value))}
             />
          </div>
          <button
            onClick={handleGenerarPreview}
            disabled={loading || executing}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" /> : <ClipboardList size={18} />}
            Generar Vista Previa
          </button>
        </div>
      </div>

      {/* Resultados Preview */}
      {previewData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Promociones */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h5 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <Users size={18} className="text-green-600" />
                Promociones ({Object.values(previewData.promociones).reduce((acc, curr) => acc + curr.length, 0)})
              </h5>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {Object.entries(previewData.promociones).map(([cambio, alumnos]) => (
                  <div key={cambio} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">
                      {cambio}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {alumnos.length} alumnos
                    </div>
                  </div>
                ))}
                {Object.keys(previewData.promociones).length === 0 && (
                  <p className="text-sm text-gray-400 italic">No hay promociones registradas.</p>
                )}
              </div>
            </div>

            {/* Graduaciones */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h5 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                <FileText size={18} className="text-purple-600" />
                Graduandos ({previewData.graduaciones.length})
              </h5>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {previewData.graduaciones.map((graduado) => (
                  <div key={graduado.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                     <div>
                       <div className="font-medium text-gray-800 dark:text-gray-200">{graduado.nombre}</div>
                       <div className="text-xs text-gray-500">{graduado.carrera || graduado.grado}</div>
                     </div>
                     <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-bold">
                       Graduado
                     </span>
                  </div>
                ))}
                 {previewData.graduaciones.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No hay graduandos este ciclo.</p>
                )}
              </div>
            </div>
          </div>

          {/* Zona de Confirmación */}
          <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-700 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <input 
                type="checkbox" 
                id="confirmMigration" 
                checked={confirmMigration}
                onChange={(e) => setConfirmMigration(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="confirmMigration" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                Confirmo que he revisado la vista previa y deseo ejecutar la migración definitiva.
              </label>
            </div>

            <button
              onClick={handleEjecutarMigracion}
              disabled={!confirmMigration || executing}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {executing ? (
                 <>
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                   Procesando Migración...
                 </>
              ) : (
                 <>
                   <Server size={20} />
                   Ejecutar Migración de Fin de Año
                 </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">
              Se creará un registro en el historial académico de cada alumno procesado.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const SistemaSettings = ({ currentUser }) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [resetting, setResetting] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  
  // Backup/Restore states
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [backupPassword, setBackupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [creatingBackup, setCreatingBackup] = useState(false);
  const [restoringBackup, setRestoringBackup] = useState(false);
  const [showCreatingModal, setShowCreatingModal] = useState(false); // Modal de carga
  const [showRestoreModal, setShowRestoreModal] = useState(false); // Modal de restauración
  const [restorePassword, setRestorePassword] = useState('');
  const [selectedBackupFile, setSelectedBackupFile] = useState(null);
  
  const fileInputRef = useRef(null); // Ref para el input de archivo

  const isAdmin = currentUser?.rol === 'admin';

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const response = await client.get('/metrics');
      setSystemInfo(response.data);
    } catch (error) {
      console.error('Error fetching system info:', error);
    }
  };

  // Detectar SO del cliente con versión específica
  const getClientOS = () => {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    
    // Windows - Detectar versión y edición específica
    if (userAgent.indexOf('Win') !== -1 || platform.indexOf('Win') !== -1) {
      let windowsVersion = 'Windows';
      let windowsEdition = '';
      
      // Detectar versión base
      if (userAgent.indexOf('Windows NT 10.0') !== -1) {
        windowsVersion = 'Windows 11'; // Asumimos Windows 11 para NT 10.0 moderno
        
        // Intentar detectar edición específica del userAgent
        // Algunas ediciones especiales pueden aparecer en el userAgent
        if (userAgent.indexOf('IoT') !== -1) {
          windowsEdition = ' IoT';
        }
        if (userAgent.indexOf('Enterprise') !== -1) {
          windowsEdition += ' Enterprise';
        }
        if (userAgent.indexOf('LTSC') !== -1 || userAgent.indexOf('LTSB') !== -1) {
          windowsEdition += ' LTSC';
        }
        
        // Si no se detectó edición específica, intentar con User-Agent Client Hints
        if (!windowsEdition && navigator.userAgentData) {
          // Esta API moderna puede dar más información
          navigator.userAgentData.getHighEntropyValues(['platformVersion', 'model'])
            .then(ua => {
              // Aquí podríamos obtener más detalles, pero es asíncrono
              console.log('User-Agent Data:', ua);
            })
            .catch(() => {});
        }
        
        return windowsVersion + windowsEdition || windowsVersion;
      }
      if (userAgent.indexOf('Windows NT 6.3') !== -1) return 'Windows 8.1';
      if (userAgent.indexOf('Windows NT 6.2') !== -1) return 'Windows 8';
      if (userAgent.indexOf('Windows NT 6.1') !== -1) return 'Windows 7';
      if (userAgent.indexOf('Windows NT 6.0') !== -1) return 'Windows Vista';
      return 'Windows';
    }
    
    // macOS - Detectar versión
    if (userAgent.indexOf('Mac') !== -1 || platform.indexOf('Mac') !== -1) {
      // Intentar extraer versión de macOS
      const macMatch = userAgent.match(/Mac OS X (\d+)[._](\d+)([._](\d+))?/);
      if (macMatch) {
        const major = parseInt(macMatch[1]);
        const minor = parseInt(macMatch[2]);
        
        // Mapear versiones a nombres
        const macVersions = {
          '10.15': 'macOS Catalina',
          '10.16': 'macOS Big Sur',
          '11': 'macOS Big Sur',
          '12': 'macOS Monterey',
          '13': 'macOS Ventura',
          '14': 'macOS Sonoma',
          '15': 'macOS Sequoia'
        };
        
        const versionKey = major >= 11 ? `${major}` : `${major}.${minor}`;
        return macVersions[versionKey] || `macOS ${major}.${minor}`;
      }
      return 'macOS';
    }
    
    // Linux - Intentar detectar distribución
    if (userAgent.indexOf('Linux') !== -1 && userAgent.indexOf('Android') === -1) {
      if (userAgent.indexOf('Ubuntu') !== -1) return 'Ubuntu Linux';
      if (userAgent.indexOf('Fedora') !== -1) return 'Fedora Linux';
      if (userAgent.indexOf('Debian') !== -1) return 'Debian Linux';
      if (userAgent.indexOf('Mint') !== -1) return 'Linux Mint';
      return 'Linux';
    }
    
    // Móviles
    if (userAgent.indexOf('Android') !== -1) {
      const androidMatch = userAgent.match(/Android (\d+(\.\d+)?)/);
      return androidMatch ? `Android ${androidMatch[1]}` : 'Android';
    }
    
    if (userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) {
      const iosMatch = userAgent.match(/OS (\d+)[._](\d+)/);
      return iosMatch ? `iOS ${iosMatch[1]}.${iosMatch[2]}` : 'iOS';
    }
    
    return 'Desconocido';
  };

  // Crear backup cifrado
  const handleCrearBackup = () => {
    setShowBackupModal(true);
  };

  const confirmarCrearBackup = async () => {
    if (backupPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    if (backupPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    setShowBackupModal(false);
    setBackupPassword('');
    setConfirmPassword('');
    setShowCreatingModal(true); // Mostrar modal de "Procesando"

    try {
      const response = await client.post('/backup/create', 
        { 
          password: backupPassword,
          confirmPassword: confirmPassword 
        },
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sistema-backup-${new Date().toISOString().split('.')[0].replace(/:/g, '-')}.bak`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast.success('✅ Backup creado correctamente');
      toast('💾 Guarda la contraseña en un lugar seguro', { 
        duration: 5000,
        icon: '⚠️' 
      });
      
    } catch (error) {
      console.error(error);
      let errorMsg = 'Error al crear backup';
      
      // Si la respuesta es un Blob (porque esperabamos archivo), hay que leerlo
      if (error.response?.data instanceof Blob) {
         try {
           const blobText = await error.response.data.text();
           const errorJson = JSON.parse(blobText);
           errorMsg = errorJson.error || errorMsg;
         } catch (e) {
           console.error('Error parsing blob error:', e);
         }
      } else {
         errorMsg = error.response?.data?.error || error.message || errorMsg;
      }
      
      toast.error(errorMsg);
    } finally {
      setCreatingBackup(false);
      setShowCreatingModal(false); // Ocultar modal al finalizar
    }
  };

  // Restaurar backup
  // Restaurar backup - Paso 1: Selección de archivo
  const handleRestaurarBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar extensión
    if (!file.name.endsWith('.bak')) {
      toast.error('❌ Archivo inválido. Debe ser un archivo .bak');
      e.target.value = '';
      return;
    }

    setSelectedBackupFile(file);
    setShowRestoreModal(true);
    // Resetear input para permitir seleccionar el mismo archivo si falla
    e.target.value = '';
  };

  // Restaurar backup - Paso 2: Confirmación con contraseña
  const handleConfirmRestore = async () => {
    if (!restorePassword) {
      toast.error('Ingrese la contraseña del backup');
      return;
    }

    if (!clickedConfirmRestore) {
        setClickedConfirmRestore(true);
        // Pequeño timeout para evitar doble click accidental
        setTimeout(() => setClickedConfirmRestore(false), 2000);
    }
    
    setRestoringBackup(true);
    const formData = new FormData();
    formData.append('backup', selectedBackupFile);
    formData.append('password', restorePassword);
    
    try {
      const response = await client.post('/backup/restore', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('✅ Sistema restaurado correctamente');
      toast('🔄 Reiniciando servidor...', { duration: 3000 });
      setShowRestoreModal(false);
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (error) {
      console.error('Error restaurando:', error);
      let errorMsg = 'Error al restaurar backup';
      
      if (error.response?.status === 401) {
        errorMsg = '❌ Contraseña incorrecta';
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else {
        errorMsg = error.message || errorMsg;
      }

      toast.error(errorMsg);
    } finally {
      setRestoringBackup(false);
    }
  };

  const [clickedConfirmRestore, setClickedConfirmRestore] = useState(false);

  // Factory Reset
  const handleFactoryReset = async () => {
    
    if (!masterKeyInput) {
       toast.error('Ingrese la Clave Maestra');
       return;
    }
    
    // Abrir modal de confirmación final
    setShowResetConfirmModal(true);
  };

  const executeFactoryReset = async () => {
    setResetting(true);
    try {
      await client.post('/admin/reset-factory', { masterKey: masterKeyInput });
      toast.success('Sistema restablecido correctamente. Recargando...');
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/setup';
      }, 2000);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || error.message;
      if (error.response?.status === 401) {
        toast.error('❌ Clave Maestra Incorrecta');
      } else {
        toast.error('Error al resetear: ' + errorMsg);
      }
      setResetting(false);
      setShowResetConfirmModal(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Información del Sistema */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
          <Server size={24} className="text-blue-600" />
          Información del Sistema
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Versión</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">SAE v1.5.0</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tu Dispositivo</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{getClientOS()}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Sistema operativo del cliente</p>
          </div>
          
          {systemInfo && (
            <>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Uptime</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.floor(systemInfo.uptime.hours)}h {Math.floor((systemInfo.uptime.hours % 1) * 60)}m
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Base de Datos</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {systemInfo.database.alumnos + systemInfo.database.personal} registros
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {systemInfo.database.alumnos} alumnos, {systemInfo.database.personal} personal
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Plataforma Servidor</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {systemInfo.system.platform}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">SQLite local</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Memoria Usada</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {systemInfo.system.memoryUsage.rss}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>ℹ️ Información:</strong> El sistema está funcionando correctamente. 
            La base de datos está en SQLite local para mejor rendimiento.
          </p>
        </div>
      </div>

      {/* Backup y Restauración */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
          <FileArchive size={24} className="text-green-600" />
          Backup y Restauración
        </h3>
        
        {!isAdmin ? (
          <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-amber-800 dark:text-amber-300 font-bold mb-2">
                  Acceso Restringido - Solo Administradores
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
                  Las funciones de backup y restauración están reservadas exclusivamente para usuarios con rol de <strong>Administrador</strong>.
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500">
                  Si necesitas crear un respaldo o restaurar el sistema, contacta a un administrador (Director, Subdirector o Administrador).
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Crear Backup */}
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
              <h4 className="text-emerald-800 dark:text-emerald-400 font-bold flex items-center gap-2 mb-2">
                <Download size={24} className="text-emerald-600 dark:text-emerald-500" />
                Crear Backup del Sistema
              </h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
                Genera un archivo cifrado (.bak) con todos los datos del sistema: base de datos, fotos, QRs y configuración.
              </p>
              <button
                onClick={handleCrearBackup}
                disabled={creatingBackup}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <Download size={18} />
                {creatingBackup ? 'Iniciando...' : 'Crear Backup Cifrado'}
              </button>
            </div>

            {/* Restaurar Backup */}
            <div className="bg-orange-50 dark:bg-orange-900/10 border-2 border-orange-200 dark:border-orange-800 rounded-lg p-6">
              <h4 className="text-orange-800 dark:text-orange-400 font-bold flex items-center gap-2 mb-2">
                <Upload size={24} className="text-orange-600 dark:text-orange-500" />
                Restaurar desde Backup
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-6">
                Selecciona un archivo <strong>.bak</strong> para restaurar el sistema completo. Se te pedirá la contraseña del archivo.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".bak"
                  onChange={handleRestaurarBackup}
                  className="hidden" 
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={restoringBackup}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {restoringBackup ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Restaurando...
                    </>
                  ) : (
                    <>
                      <FolderOpen size={18} />
                      Seleccionar Archivo .bak
                    </>
                  )}
                </button>

                {restoringBackup && (
                   <span className="text-sm text-orange-700 font-medium animate-pulse">
                     Por favor espere, procesando restauración...
                   </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Factory Reset */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
           <AlertOctagon size={24} className="text-red-600" />
           Zona de Peligro
        </h3>

        {!isAdmin ? (
          <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h4 className="text-amber-800 dark:text-amber-300 font-bold mb-2">
                  Acceso Restringido - Solo Administradores
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
                  El restablecimiento de fábrica es una operación crítica reservada exclusivamente para usuarios con rol de <strong>Administrador</strong>.
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500">
                  Esta función elimina permanentemente todos los datos del sistema. Solo los administradores pueden realizar esta acción.
                </p>
              </div>
            </div>
          </div>
        ) : (
           <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-6">
             <h4 className="text-red-800 dark:text-red-300 font-bold flex items-center gap-2 mb-2">
               <Trash2 size={20} />
               Restablecimiento de Fábrica
             </h4>
             <p className="text-sm text-red-700 dark:text-red-400 mb-4">
               Esta acción eliminará permanentemente todos los registros de asistencias, datos de alumnos y personal docente. 
               La configuración institucional y los usuarios administradores se mantendrán. 
               <span className="font-bold underline ml-1">Esta acción no se puede deshacer.</span>
             </p>

            <div className="border-t border-red-200 dark:border-red-800/50 pt-4">
                {!confirmReset ? (
                <button
                    onClick={() => {
                       setConfirmReset(true);
                       setMasterKeyInput('');
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
                >
                    <AlertOctagon size={18} />
                    Iniciar Proceso de Reset
                </button>
                ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                    ⚠️ Confirmación requerida
                    </p>
                    <label className="block text-xs font-medium text-red-700 dark:text-red-300 mb-1">
                      Ingrese su Clave Maestra de Recuperación para confirmar:
                    </label>
                    <input
                      type="password"
                      value={masterKeyInput}
                      onChange={(e) => setMasterKeyInput(e.target.value)}
                      placeholder="Ingrese Clave Maestra"
                      className="w-full px-3 py-2 border-2 border-red-300 dark:border-red-700 rounded-lg focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white mb-2"
                      autoFocus
                    />
                    
                    <div className="flex gap-3">
                        <button
                        onClick={() => {
                           setConfirmReset(false);
                           setMasterKeyInput('');
                        }}
                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                        Cancelar
                        </button>
                        <button
                        onClick={handleFactoryReset}
                        disabled={resetting || !masterKeyInput}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                        {resetting ? (
                            <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                            Procesando...
                            </>
                        ) : (
                            <>
                            <Trash2 size={18} />
                            Confirmar Reset
                            </>
                        )}
                        </button>
                    </div>
                </div>
                 )}
            </div>
           </div>
        )}
      </div>

      {/* Modal Crear Backup */}
      {showBackupModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Crear Backup del Sistema
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contraseña del Backup
                </label>
                <input
                  type="password"
                  value={backupPassword}
                  onChange={(e) => setBackupPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  placeholder="Repite la contraseña"
                  minLength={8}
                />
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ <strong>Importante:</strong> Guarda esta contraseña en un lugar seguro. 
                  La necesitarás para restaurar el backup.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowBackupModal(false);
                  setBackupPassword('');
                  setConfirmPassword('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarCrearBackup}
                disabled={creatingBackup || !backupPassword || !confirmPassword}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear Backup
              </button>
            </div>
          </motion.div>
        </div>,
        document.body // Agregamos document.body para evitar el error de Portal
      )}

      {/* Modal RESTAURAR BACKUP (Nuevo) */}
      {showRestoreModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Upload size={24} className="text-orange-600" />
              Restaurar Sistema
            </h3>

            {!restoringBackup ? (
              <div className="space-y-4">
                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Archivo seleccionado:
                  </p>
                  <p className="text-base font-bold text-orange-700 dark:text-orange-400 break-all">
                    {selectedBackupFile?.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedBackupFile?.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contraseña del Backup
                  </label>
                  <input
                    type="password"
                    value={restorePassword}
                    onChange={(e) => setRestorePassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    placeholder="Ingresa la contraseña para descifrar"
                    autoFocus
                  />
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-3">
                  <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                    ⚠️ ADVERTENCIA: Esta acción reemplazará TODOS los datos actuales del sistema. No se puede deshacer.
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowRestoreModal(false);
                      setRestorePassword('');
                      setSelectedBackupFile(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmRestore}
                    disabled={!restorePassword}
                    className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
                  >
                    Restaurar Ahora
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                 <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
                 </div>
                 <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Restaurando Base de Datos...</h4>
                 <p className="text-sm text-gray-500 mb-4">Verificando integridad y descifrando archivos.</p>
                 <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mx-auto max-w-[200px]">
                    <div className="bg-orange-500 h-2 rounded-full animate-progress-indeterminate"></div>
                 </div>
              </div>
            )}
          </motion.div>
        </div>,
        document.body
      )}

      {/* Modal PROCESANDO BACKUP (Nuevo) */}
      {showCreatingModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-sm w-full shadow-2xl text-center"
          >
            <div className="relative w-20 h-20 mx-auto mb-6">
               <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
               <Download className="absolute inset-0 m-auto text-emerald-600" size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Generando Backup
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Por favor espere mientras el sistema cifra y comprime todos los datos. <br/>
              <span className="font-semibold text-emerald-600">Esto puede tomar unos momentos...</span>
            </p>

            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
               <div className="bg-emerald-600 h-2.5 rounded-full animate-pulse w-full"></div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Modal Confirmación Reset Final */}
      {showResetConfirmModal && createPortal(
        <div className="fixed inset-0 bg-red-900/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full shadow-2xl border-4 border-red-600"
          >
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-full mb-4 animate-pulse">
                <AlertOctagon size={48} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-black text-red-700 dark:text-red-400 uppercase tracking-wide">
                ⚠️ Última Advertencia ⚠️
              </h3>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 mb-8 border border-red-200 dark:border-red-800">
              <p className="text-gray-800 dark:text-gray-200 font-medium mb-4">
                Esta acción es <span className="font-bold text-red-600 underline">IRREVERSIBLE</span>.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                Se eliminarán permanentemente:
              </p>
              <ul className="text-left text-sm space-y-2 text-gray-800 dark:text-gray-200 list-disc pl-8 font-semibold">
                <li>Todos los datos de alumnos</li>
                <li>Todo el personal y directivos</li>
                <li>Registros de asistencias completos</li>
                <li>Códigos QR asignados</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 px-6 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-bold text-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={executeFactoryReset}
                disabled={resetting}
                className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-lg shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                {resetting ? (
                   <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                   <>
                     <Trash2 size={24} />
                     BORRAR TODO
                   </>
                )}
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export default function ConfiguracionPanel() {
  const [activeTab, setActiveTab] = useState('institucion');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    horario_inicio: '',
    horario_salida: '',
    margen_puntualidad_min: 5,
    direccion: '',
    email: '',
    telefono: '',
    pais: '',
    departamento: ''
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoBase64, setLogoBase64] = useState(null);

  // Users State
  const [usuarios, setUsuarios] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    nombres: '',
    apellidos: '',
    cargo: '',
    jornada: '',
    rol: 'operador',
    foto_file: null,
    foto_preview: null
  });
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Equipos / Red State
  const [equipos, setEquipos] = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);
  const [serverInfo, setServerInfo] = useState(null);

  // Directores State
  const [directores, setDirectores] = useState([]);
  const [loadingDirectores, setLoadingDirectores] = useState(false);
  const [showDirectorModal, setShowDirectorModal] = useState(false);
  const [editingDirector, setEditingDirector] = useState(null);
  const [newDirector, setNewDirector] = useState({
    carnet: '',
    nombres: '',
    apellidos: '',
    cargo: 'Director',
    sexo: 'Masculino',
    jornada: 'Matutina',
    foto_file: null,
    foto_preview: null
  });

  useEffect(() => {
    fetchConfig();
    fetchUsuarios();
    fetchCurrentUser();
    fetchEquipos();
    fetchServerInfo();
    fetchDirectores();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await client.get('/auth/me');
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchUsuarios = async () => {
    setLoadingUsers(true);
    try {
      const response = await client.get('/usuarios');
      setUsuarios(response.data.usuarios || []);
    } catch (error) {
      console.warn('Error fetching usuarios:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchDirectores = async () => {
    setLoadingDirectores(true);
    try {
      const response = await client.get('/docentes');
      // Filtrar directores por cargo
      const allPersonal = response.data.personal || [];
      const filtered = allPersonal.filter(p => 
        p.cargo.toLowerCase().includes('director') || 
        p.cargo.toLowerCase().includes('directora') ||
        p.cargo.toLowerCase().includes('subdirector') ||
        p.cargo.toLowerCase().includes('subdirectora')
      );
      setDirectores(filtered);
    } catch (error) {
      console.error('Error fetching directores:', error);
    } finally {
      setLoadingDirectores(false);
    }
  };

  const handleSaveDirector = async (directorData, fotoFile) => {
    setSaving(true);
    const toastId = toast.loading(editingDirector ? 'Actualizando director...' : 'Creando director...');
    try {
      const data = new FormData();
      Object.entries(directorData).forEach(([key, value]) => {
        data.append(key, value);
      });
      
      if (!editingDirector) {
        // Generar carnet sugerido temporal si es manual, o dejar que el backend lo maneje
        // Dado que unificamos DIR, podemos usar una lógica simple o carnetMode
        data.append('carnetMode', 'auto');
        data.append('estado', 'activo');
      }

      if (fotoFile) {
        data.append('foto', fotoFile);
      }

      if (editingDirector) {
        await client.put(`/docentes/${editingDirector.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Director actualizado con éxito', { id: toastId });
      } else {
        await client.post('/docentes', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Director creado con éxito', { id: toastId });
      }

      setShowDirectorModal(false);
      setEditingDirector(null);
      fetchDirectores();
    } catch (error) {
      console.error('Error saving director:', error);
      toast.error('Error al guardar director: ' + (error.response?.data?.error || error.message), { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDirector = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar a este director? El registro se eliminará de la lista de personal.')) return;
    
    const toastId = toast.loading('Eliminando director...');
    try {
      await client.delete(`/docentes/${id}`);
      toast.success('Director eliminado', { id: toastId });
      fetchDirectores();
    } catch (error) {
      console.error('Error deleting director:', error);
      toast.error('Error al eliminar director', { id: toastId });
    }
  };

  const handleNewUserPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewUser({
          ...newUser,
          foto_file: file,
          foto_preview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateUser = async () => {
    if (isEditingUser) return handleUpdateUser();

    try {
      const formData = new FormData();
      formData.append('email', newUser.email);
      formData.append('password', newUser.password);
      formData.append('nombres', newUser.nombres);
      formData.append('apellidos', newUser.apellidos);
      formData.append('cargo', newUser.cargo);
      formData.append('jornada', newUser.jornada);
      formData.append('rol', newUser.rol);
      
      if (newUser.foto_file) {
        formData.append('foto', newUser.foto_file);
      }

      await client.post('/usuarios', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Usuario creado exitosamente');
      closeUserModal();
      fetchUsuarios();
    } catch (error) {
      toast.error('Error al crear usuario: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUpdateUser = async () => {
    try {
      await client.put(`/usuarios/${editingUserId}`, newUser);
      toast.success('Usuario actualizado correctamente');
      closeUserModal();
      fetchUsuarios();
    } catch (error) {
      toast.error('Error al actualizar: ' + (error.response?.data?.error || error.message));
    }
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setIsEditingUser(false);
    setEditingUserId(null);
    setNewUser({ 
      email: '', 
      password: '', 
      nombres: '', 
      apellidos: '', 
      cargo: '', 
      jornada: '', 
      rol: 'operador',
      foto_file: null,
      foto_preview: null
    });
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;
    try {
      await client.delete(`/usuarios/${id}`);
      toast.success('Usuario eliminado');
      fetchUsuarios();
    } catch (error) {
      toast.error('Error al eliminar usuario: ' + (error.response?.data?.error || error.message));
    }
  };

  const handlePhotoUpload = async (userId, file) => {
    const formData = new FormData();
    formData.append('foto', file);

    const toastId = toast.loading('Subiendo foto...');
    try {
      await client.post(`/usuarios/${userId}/foto`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Foto actualizada', { id: toastId });
      fetchUsuarios();
      
      // Si es el usuario actual, actualizar contexto si es necesario
      if (currentUser && currentUser.id === userId) {
        fetchCurrentUser();
      }
    } catch (error) {
      console.error(error);
      toast.error('Error subiendo foto', { id: toastId });
    }
  };

  // Network / Equipos Handlers
  const fetchEquipos = async () => {
    setLoadingEquipos(true);
    try {
      const response = await client.get('/equipos');
      setEquipos(response.data);
    } catch (error) {
      console.error('Error fetching equipos:', error);
    } finally {
      setLoadingEquipos(false);
    }
  };

  const fetchServerInfo = async () => {
    try {
      const response = await client.get('/equipos/server-info');
      setServerInfo(response.data);
    } catch (error) {
      console.error('Error fetching server info:', error);
    }
  };

  const handleApproveEquipo = async (id, aprobado) => {
    try {
      await client.put(`/equipos/${id}/approve`, { aprobado });
      toast.success(aprobado ? 'Equipo aprobado' : 'Acceso revocado');
      fetchEquipos();
    } catch (error) {
      toast.error('Error al actualizar equipo');
    }
  };

  const handleDeleteEquipo = async (id) => {
    if (!window.confirm('¿Eliminar este equipo? Deberá registrarse nuevamente si intenta conectar.')) return;
    try {
      await client.delete(`/equipos/${id}`);
      toast.success('Equipo eliminado');
      fetchEquipos();
    } catch (error) {
      toast.error('Error al eliminar equipo');
    }
  };

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await client.get('/institucion');
      const data = response.data;
      setFormData({
        nombre: data.nombre || '',
        horario_inicio: data.horario_inicio || '',
        horario_salida: data.horario_salida || '',
        margen_puntualidad_min: data.margen_puntualidad_min || 5,
        direccion: data.direccion || '',
        email: data.email || '',
        telefono: data.telefono || '',
        pais: data.pais || '',
        departamento: data.departamento || '',
        ciclo_escolar: data.ciclo_escolar || new Date().getFullYear()
      });
      
      if (data.logo_path) {
        const logoUrl = data.logo_path.startsWith('http') 
          ? data.logo_path 
          : `${BASE_URL}/uploads/${data.logo_path}?t=${Date.now()}`;
        setLogoPreview(logoUrl);
      }
    } catch (error) {
      console.error('Error fetching institucion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('El logo debe pesar menos de 10MB');
      return;
    }

    if (!file.type.match(/image\/(png|jpg|jpeg)/)) {
      toast.error('Solo se permiten imágenes PNG, JPG o JPEG');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setLogoBase64(base64);
      setLogoPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSend = new FormData();
      
      // Añadir campos de texto
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          dataToSend.append(key, formData[key]);
        }
      });

      // Añadir archivo de logo si existe
      const fileInput = document.getElementById('logo-upload');
      if (fileInput && fileInput.files[0]) {
        dataToSend.append('logo', fileInput.files[0]);
      }

      await client.put('/institucion', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Configuración guardada correctamente');
      setLogoBase64(null); // Limpiar base64 después de subir
      fetchConfig(); // Recargar para ver el nuevo logo
    } catch (error) {
      toast.error('Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <Settings className="text-blue-600" size={36} />
          Configuración Global
        </h2>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <div className="flex-1 min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'institucion' && (
              <InstitucionSettings 
                key="institucion"
                formData={formData} 
                setFormData={setFormData}
                logoPreview={logoPreview}
                handleLogoChange={handleLogoChange}
                handleSubmit={handleSubmit}
                saving={saving}
                directores={directores}
                loadingDirectores={loadingDirectores}
                onAddDirector={() => {
                  setEditingDirector(null);
                  setShowDirectorModal(true);
                }}
                onEditDirector={(director) => {
                  setEditingDirector(director);
                  setShowDirectorModal(true);
                }}
                onDeleteDirector={handleDeleteDirector}
              />
            )}
            {activeTab === 'usuarios' && (
              <UsuarioSettings 
                key="usuarios"
                usuarios={usuarios}
                loadingUsers={loadingUsers}
                showUserModal={showUserModal}
                setShowUserModal={setShowUserModal}
                newUser={newUser}
                setNewUser={setNewUser}
                handleCreateUser={handleCreateUser}
                handleDeleteUser={handleDeleteUser}
                fetchUsuarios={fetchUsuarios}
                handlePhotoUpload={handlePhotoUpload}
                handleNewUserPhotoChange={handleNewUserPhotoChange}
                setIsEditingUser={setIsEditingUser}
                setEditingUserId={setEditingUserId}
              />
            )}
            {activeTab === 'equipos' && (
              <EquipoSettings 
                key="equipos"
                equipos={equipos}
                loading={loadingEquipos}
                onApprove={handleApproveEquipo}
                onDelete={handleDeleteEquipo}
                serverInfo={serverInfo}
              />
            )}
            {activeTab === 'academico' && (
              <ControlAcademicoSettings key="academico" />
            )}
            {activeTab === 'sistema' && (
              <SistemaSettings key="sistema" currentUser={currentUser} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal Crear Usuario (Portal) */}
      {showUserModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {isEditingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button onClick={closeUserModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Foto del Usuario */}
              <div className="flex flex-col items-center gap-1 mb-1">
                <div className="relative group/avatar-new">
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                    {newUser.foto_preview ? (
                      <img src={newUser.foto_preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={28} className="text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewUserPhotoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover/avatar-new:opacity-100 transition-opacity pointer-events-none">
                    <Plus size={18} className="text-white" />
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Foto de Perfil</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Nombres</label>
                  <input
                    type="text"
                    value={newUser.nombres}
                    onChange={e => setNewUser({...newUser, nombres: e.target.value})}
                    className="w-full px-3 py-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Apellidos</label>
                  <input
                    type="text"
                    value={newUser.apellidos}
                    onChange={e => setNewUser({...newUser, apellidos: e.target.value})}
                    className="w-full px-3 py-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Contraseña</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-3 py-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Cargo</label>
                  <select
                    value={newUser.cargo}
                    onChange={e => setNewUser({...newUser, cargo: e.target.value})}
                    className="w-full px-3 py-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="Director">Director(a)</option>
                    <option value="Subdirector">Subdirector(a)</option>
                    <option value="Secretaria">Secretaria(o)</option>
                    <option value="Administrador">Administrador(a)</option>
                    <option value="Coordinador">Coordinador(a)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-300">Jornada</label>
                  <select
                    value={newUser.jornada}
                    onChange={e => setNewUser({...newUser, jornada: e.target.value})}
                    className="w-full px-3 py-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
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
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Rol</label>
                <select
                  value={newUser.rol}
                  onChange={e => setNewUser({...newUser, rol: e.target.value})}
                  className="w-full px-3 py-1.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                >
                  <option value="operador">Operador (Básico)</option>
                  <option value="admin">Administrador (Total)</option>
                </select>
              </div>
            </div>

            <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
              <button
                onClick={closeUserModal}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                disabled={!newUser.email || (!isEditingUser && !newUser.password)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
              >
                {isEditingUser ? 'Guardar Cambios' : 'Crear Usuario'}
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
      <DirectorModal 
        isOpen={showDirectorModal}
        onClose={() => setShowDirectorModal(false)}
        director={editingDirector}
        saving={saving}
      />
    </div>
  );
}
