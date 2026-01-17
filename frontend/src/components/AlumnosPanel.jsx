/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Plus, Edit, Trash2, Download, Search, Filter, X, User, QrCode, BookOpen, Sun, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { alumnosAPI, qrAPI, institucionAPI } from '../api/endpoints';
import { TableSkeleton } from './LoadingSpinner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', ''); // http://localhost:5000


export default function AlumnosPanel() {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrado, setFilterGrado] = useState('');
  const [filterJornada, setFilterJornada] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterCarrera, setFilterCarrera] = useState('');
  const [filterEspecialidad, setFilterEspecialidad] = useState('');
  const [institucion, setInstitucion] = useState(null);
  const [posiblesGrados, setPosiblesGrados] = useState([]);

  const [formData, setFormData] = useState({
    carnet: '',
    nombres: '',
    apellidos: '',
    grado: '',
    carrera: '',
    especialidad: '',
    jornada: '',
    sexo: '',
    foto: null,
    preview: null
  });

  // Sistema híbrido de carnets
  const [carnetMode, setCarnetMode] = useState('auto');
  const [suggestedCarnet, setSuggestedCarnet] = useState('');
  const [carnetValidation, setCarnetValidation] = useState({ valid: true, error: null });

  // Estados para reasignación de carnet
  const [showReasignarModal, setShowReasignarModal] = useState(false);
  const [nuevoCarnet, setNuevoCarnet] = useState('');
  const [reasignandoCarnet, setReasignandoCarnet] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [alumnosRes, instRes] = await Promise.all([
        alumnosAPI.list(),
        institucionAPI.get().catch(e => ({ data: {} }))
      ]);
      setAlumnos(alumnosRes.data.alumnos || []);
      setInstitucion(instRes.data);
      generarGrados(instRes.data?.pais);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const generarGrados = (pais) => {
    let grados = [
      '1ro. Primaria', '2do. Primaria', '3ro. Primaria', '4to. Primaria', '5to. Primaria', '6to. Primaria',
      '1ro. Básico', '2do. Básico', '3ro. Básico',
      '4to. Diversificado', '5to. Diversificado', '6to. Diversificado'
    ];
    // Aquí se podría personalizar más según el país si fuera necesario
    setPosiblesGrados(grados);
  };

  // Fetch next carnet preview
  const fetchNextCarnet = async () => {
    try {
      const response = await axios.get(`${API_URL}/alumnos/next-carnet`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setSuggestedCarnet(response.data.carnet);
      if (carnetMode === 'auto' && !editingAlumno) {
        setFormData(prev => ({ ...prev, carnet: response.data.carnet }));
      }
    } catch (error) {
      console.error('Error fetching next carnet:', error);
    }
  };

  // Validate manual carnet
  const validateManualCarnet = async (carnet) => {
    if (!carnet) {
      setCarnetValidation({ valid: true, error: null });
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/alumnos/validate-carnet`,
        { carnet, excludeId: editingAlumno?.id },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      setCarnetValidation(response.data);
    } catch (error) {
      setCarnetValidation({ valid: false, error: 'Error validando carnet' });
    }
  };

  // Effect para cargar carnet sugerido cuando se abre el modal o cambia a modo auto
  useEffect(() => {
    if (showModal && !editingAlumno && carnetMode === 'auto') {
      fetchNextCarnet();
    }
  }, [showModal, editingAlumno, carnetMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(editingAlumno ? 'Actualizando alumno...' : 'Creando alumno...');
    
    try {
      let alumnoId;
      
      // 1. Crear o Actualizar datos básicos
      if (editingAlumno) {
        // En update, eliminamos la foto del payload JSON, se maneja aparte
        const { foto, preview, ...dataToSend } = formData;
        await alumnosAPI.update(editingAlumno.id, dataToSend);
        alumnoId = editingAlumno.id;
        toast.success('Datos actualizados', { id: toastId });
      } else {
        const { foto, preview, ...dataToSend } = formData;
        // Agregar carnetMode al payload
        const res = await alumnosAPI.create({ ...dataToSend, carnetMode });
        alumnoId = res.data.id;
        toast.success('Alumno creado', { id: toastId });
      }

      // 2. Subir Foto si existe y es un archivo nuevo
      if (formData.foto instanceof File) {
        const fotoData = new FormData();
        fotoData.append('foto', formData.foto);
        
        // Usar axios directamente para multipart
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/alumnos/${alumnoId}/foto`, fotoData, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' 
            }
        });
      }
      
      // Mostrar mensaje final
      toast.success(editingAlumno ? 'Alumno actualizado exitosamente' : 'Alumno creado exitosamente', { id: toastId });
      
      setShowModal(false);
      setEditingAlumno(null);
      setFormData({ carnet: '', nombres: '', apellidos: '', grado: '', especialidad: '', jornada: '', sexo: '', foto: null, preview: null });
      setCarnetMode('auto');
      setSuggestedCarnet('');
      setCarnetValidation({ valid: true, error: null });
      fetchData(); // Recargar todo
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Error: ' + (error.response?.data?.error || error.message), { id: toastId });
    }
  };

  const handleEdit = (alumno) => {
    setEditingAlumno(alumno);
    setFormData({
      carnet: alumno.carnet,
      nombres: alumno.nombres,
      apellidos: alumno.apellidos,
      grado: alumno.grado || '',
      carrera: alumno.carrera || '', // Fix: Cargar carrera
      especialidad: alumno.especialidad || '',
      jornada: alumno.jornada || '',
      sexo: alumno.sexo || '',
      foto: null,
      preview: alumno.foto_path ? (alumno.foto_path.startsWith('http') ? alumno.foto_path : `${BASE_URL}/uploads/${alumno.foto_path}`) : null
    });
    setCarnetMode('manual'); // En edición siempre es manual
    setShowModal(true);
  };

  const handleReasignarCarnet = async () => {
    if (!nuevoCarnet.trim()) {
      toast.error('Ingresa un carnet válido');
      return;
    }

    if (!carnetValidation.valid) {
      toast.error('El carnet ingresado no es válido o ya existe');
      return;
    }

    const toastId = toast.loading('Reasignando carnet...');
    setReasignandoCarnet(true);

    try {
      // 1. Actualizar el carnet
      await alumnosAPI.update(editingAlumno.id, { carnet: nuevoCarnet });
      
      // 2. Regenerar QR automáticamente
      try {
        await axios.post(
          `${API_URL}/alumnos/${editingAlumno.id}/regenerar-qr`,
          {},
          { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
        );
        toast.success('Carnet reasignado y QR regenerado', { id: toastId });
      } catch (qrError) {
        console.warn('Error regenerando QR:', qrError);
        toast.success('Carnet reasignado (QR pendiente)', { id: toastId });
      }

      // 3. Actualizar el alumno en edición
      setEditingAlumno({ ...editingAlumno, carnet: nuevoCarnet });
      setFormData({ ...formData, carnet: nuevoCarnet });
      
      // 4. Cerrar modal y recargar datos
      setShowReasignarModal(false);
      setNuevoCarnet('');
      setCarnetValidation({ valid: true, error: null });
      fetchData();
    } catch (error) {
      console.error('Error reasignando carnet:', error);
      toast.error('Error: ' + (error.response?.data?.error || error.message), { id: toastId });
    } finally {
      setReasignandoCarnet(false);
    }
  };

  const handleToggleEstado = async (id, estadoActual, nombre) => {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo';
    const toastId = toast.loading(`Cambiando estado a ${nuevoEstado}...`);
    
    try {
      await alumnosAPI.update(id, { estado: nuevoEstado });
      toast.success(`${nombre} ahora está ${nuevoEstado}`, { id: toastId });
      fetchData();
    } catch (error) {
      toast.error('Error: ' + (error.response?.data||error.message), { id: toastId });
    }
  };

  const handleDelete = async (id, nombre) => {
    if (!confirm(`¿Eliminar a ${nombre}?`)) return;
    const toastId = toast.loading('Eliminando alumno...');
    
    try {
      await alumnosAPI.delete(id);
      toast.success(`${nombre} eliminado exitosamente`, { id: toastId });
      setAlumnos(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      toast.error('Error: ' + (error.response?.data?.error || error.message), { id: toastId });
    }
  };

  const handleDownloadQR = async (id, carnet) => {
    try {
      const response = await qrAPI.download(id);
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-${carnet}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Error al descargar QR: ' + error.message);
    }
  };

  const [qrModalData, setQrModalData] = useState(null);

  const handleViewQR = async (id) => {
    try {
      const response = await qrAPI.download(id);
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      setQrModalData(url);
    } catch (error) {
      toast.error('Error al ver QR: ' + error.message);
    }
  };

  const handleDownloadQRsMasivo = async () => {
    const toastId = toast.loading('Generando códigos QR...');
    try {
      // Importar JSZip dinámicamente
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Filtrar alumnos según los filtros activos
      const alumnosADescargar = filteredAlumnos.filter(a => a.codigos_qr?.[0]);
      
      if (alumnosADescargar.length === 0) {
        toast.error('No hay códigos QR para descargar', { id: toastId });
        return;
      }
      
      // Descargar todos los QRs
      for (const alumno of alumnosADescargar) {
        try {
          const response = await qrAPI.download(alumno.codigos_qr[0].id);
          zip.file(`qr-${alumno.carnet}.png`, response.data);
        } catch (error) {
          console.error(`Error descargando QR de ${alumno.carnet}:`, error);
        }
      }
      
      // Generar y descargar el ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      const gradoNombre = filterGrado || 'todos';
      a.download = `qr-${gradoNombre.replace(/\s+/g, '-')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success(`${alumnosADescargar.length} códigos QR descargados`, { id: toastId });
    } catch (error) {
      toast.error('Error al generar ZIP: ' + error.message, { id: toastId });
    }
  };

  // Filtros
  const filteredAlumnos = alumnos.filter(a => {
    const matchSearch = 
      a.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.carnet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGrado = !filterGrado || a.grado === filterGrado;
    const matchJornada = !filterJornada || a.jornada === filterJornada;
    const matchEstado = !filterEstado || a.estado === filterEstado;
    const matchCarrera = !filterCarrera || (a.carrera && a.carrera.toLowerCase().includes(filterCarrera.toLowerCase()));
    const matchEspecialidad = !filterEspecialidad || (a.especialidad && a.especialidad.toLowerCase().includes(filterEspecialidad.toLowerCase()));
    return matchSearch && matchGrado && matchJornada && matchEstado && matchCarrera && matchEspecialidad;
  });

  const gradosUnicos = [...new Set(alumnos.map(a => a.grado))].sort();
  const jornadasUnicas = [...new Set(alumnos.map(a => a.jornada).filter(Boolean))];
  const carrerasUnicas = [...new Set(alumnos.map(a => a.carrera).filter(Boolean))].sort();
  const especialidadesUnicas = [...new Set(alumnos.map(a => a.especialidad).filter(Boolean))].sort();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <GraduationCap className="text-primary-600 dark:text-primary-400" size={32} />
          Alumnos
        </h2>
        <button
          onClick={() => {
            setEditingAlumno(null);
            setFormData({ carnet: '', nombres: '', apellidos: '', grado: '', especialidad: '', jornada: '', sexo: '', foto: null, preview: null });
            setShowModal(true);
          }}
          className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-bold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Nuevo Alumno</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-4 border border-gray-200 dark:border-gray-700"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Search size={16} />
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre o carnet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <BookOpen size={16} />
              Grado
            </label>
            <select
              value={filterGrado}
              onChange={(e) => setFilterGrado(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="">Todos</option>
              {gradosUnicos.map((grado) => (
                <option key={grado} value={grado}>{grado}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Sun size={16} />
              Jornada
            </label>
            <select
              value={filterJornada}
              onChange={(e) => setFilterJornada(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="">Todas</option>
              {jornadasUnicas.map((jornada) => (
                <option key={jornada} value={jornada}>{jornada}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Filter size={16} />
              Estado
            </label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Briefcase size={16} />
              Carrera
            </label>
            <select
              value={filterCarrera}
              onChange={(e) => setFilterCarrera(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="">Todas</option>
              {carrerasUnicas.map((carrera) => (
                <option key={carrera} value={carrera}>{carrera}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <BookOpen size={16} />
              Especialidad
            </label>
            <select
              value={filterEspecialidad}
              onChange={(e) => setFilterEspecialidad(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100"
            >
              <option value="">Todas</option>
              {especialidadesUnicas.map((especialidad) => (
                <option key={especialidad} value={especialidad}>{especialidad}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleDownloadQRsMasivo}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-medium"
              title="Descargar QRs filtrados en ZIP"
            >
              <Download size={18} />
              Descargar QRs
            </button>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium text-center">
              {filteredAlumnos.length} de {alumnos.length} alumno(s)
            </div>
          </div>
        </div>
      </motion.div>

      {/* Table/Cards */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {loading ? (
          <TableSkeleton rows={5} columns={7} />
        ) : filteredAlumnos.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <User size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>No hay alumnos registrados</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-600 dark:bg-primary-700 text-white">
                  <tr>
                    <th className="px-2 py-3 text-center text-xs font-semibold w-12">No.</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold w-24">Carnet</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold">Nombre Completo</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold w-28">Grado</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold w-40">Carrera</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold w-48">Especialidad</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold w-28">Jornada</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold w-20">Estado</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold w-28">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAlumnos.map((alumno, index) => (
                    <motion.tr
                      key={alumno.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-2 py-3 text-center">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className="font-mono text-sm font-bold text-primary-600 dark:text-primary-400">
                          {alumno.carnet}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                            {alumno.foto_path ? (
                              <img 
                                src={alumno.foto_path.startsWith('http') ? alumno.foto_path : `${BASE_URL}/uploads/${alumno.foto_path}`}
                                alt={`${alumno.nombres} ${alumno.apellidos}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                <User size={20} />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col justify-center">
                            <span className="font-medium text-gray-900 dark:text-gray-100 leading-snug">
                              {alumno.nombres}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-gray-100 leading-snug">
                              {alumno.apellidos}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                        {alumno.grado}
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400">
                        {alumno.carrera || '-'}
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-600 dark:text-gray-400 max-w-[200px]">
                        <span className="line-clamp-2" title={alumno.especialidad}>
                          {alumno.especialidad || '-'}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-xs text-gray-600 dark:text-gray-400">
                        {alumno.jornada}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          alumno.estado === 'activo'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {alumno.estado}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleViewQR(alumno.codigos_qr?.[0]?.id)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition"
                            title="Ver QR"
                            disabled={!alumno.codigos_qr?.[0]}
                          >
                            <QrCode size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleEstado(alumno.id, alumno.estado, `${alumno.nombres} ${alumno.apellidos}`)}
                            className={`p-1.5 rounded-lg transition ${
                              alumno.estado === 'activo'
                                ? 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                            }`}
                            title={alumno.estado === 'activo' ? 'Desactivar' : 'Activar'}
                          >
                            {alumno.estado === 'activo' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                          </button>
                          <button
                            onClick={() => handleEdit(alumno)}
                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(alumno.id, `${alumno.nombres} ${alumno.apellidos}`)}
                            className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {filteredAlumnos.map((alumno, index) => (
                <motion.div
                  key={alumno.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-bold text-gray-500 dark:text-gray-400">#{index + 1}</span>
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                        {alumno.foto_path ? (
                          <img 
                            src={alumno.foto_path.startsWith('http') ? alumno.foto_path : `${BASE_URL}/uploads/${alumno.foto_path}`}
                            alt={`${alumno.nombres} ${alumno.apellidos}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <User size={24} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">{alumno.nombres} {alumno.apellidos}</div>
                        <div className="text-sm text-blue-600 font-mono font-semibold">{alumno.carnet}</div>
                        {alumno.especialidad && (
                          <div className="text-xs text-gray-600 mt-1">
                            {alumno.especialidad}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      alumno.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {alumno.estado}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} />
                      {alumno.grado}
                    </span>
                    {alumno.jornada && (
                      <span className="flex items-center gap-1 text-gray-900 font-medium">
                        <Sun size={14} />
                        {alumno.jornada}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleEstado(alumno.id, alumno.estado, `${alumno.nombres} ${alumno.apellidos}`)}
                      className={`p-2 rounded-lg transition ${
                        alumno.estado === 'activo'
                          ? 'text-orange-600 hover:bg-orange-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={alumno.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    >
                      {alumno.estado === 'activo' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    {alumno.codigos_qr?.[0] && (
                      <button
                        onClick={() => handleDownloadQR(alumno.codigos_qr[0].id, alumno.carnet)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition"
                      >
                        <Download size={16} />
                        QR
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(alumno)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(alumno.id, `${alumno.nombres} ${alumno.apellidos}`)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-lg flex items-center justify-center transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Modal */}
      {showModal && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-6 max-w-lg w-full shadow-2xl my-8 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {editingAlumno ? 'Editar Alumno' : 'Nuevo Alumno'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
               <div className="flex flex-col items-center mb-4">
                  <div className="relative w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-400 dark:border-gray-500 mb-2 hover:border-primary-500 dark:hover:border-primary-400 transition-colors">
                    {formData.preview ? (
                      <img src={formData.preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} className="text-gray-400 dark:text-gray-500" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({
                            ...formData,
                            foto: file,
                            preview: URL.createObjectURL(file)
                          });
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Toca para subir foto</span>
              </div>

              {/* Modo de Carnet - Solo visible al crear */}
              {!editingAlumno && (
                <div className="col-span-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Modo de Carnet</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={carnetMode === 'auto'}
                        onChange={() => {
                          setCarnetMode('auto');
                          setFormData({ ...formData, carnet: suggestedCarnet });
                          setCarnetValidation({ valid: true, error: null });
                        }}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Automático</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={carnetMode === 'manual'}
                        onChange={() => {
                          setCarnetMode('manual');
                          setFormData({ ...formData, carnet: '' });
                        }}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Manual</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Carnet *</label>
                  {editingAlumno ? (
                    // Modo edición: carnet bloqueado con botón de reasignación
                    <div className="space-y-2">
                      <div className="w-full bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 flex items-center justify-between">
                        <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{formData.carnet}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">🔒 Bloqueado</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setNuevoCarnet(formData.carnet);
                          setShowReasignarModal(true);
                        }}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition font-medium"
                      >
                        ⚠️ Reasignar Carnet
                      </button>
                    </div>
                  ) : carnetMode === 'auto' ? (
                    // Modo creación automático
                    <div className="w-full bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg px-4 py-2.5 flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-700 dark:text-blue-300">{suggestedCarnet || 'Cargando...'}</span>
                      <span className="text-xs text-blue-600 dark:text-blue-400">Auto</span>
                    </div>
                  ) : (
                    // Modo creación manual
                    <div>
                      <input
                        type="text"
                        required
                        value={formData.carnet}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, carnet: value });
                          validateManualCarnet(value);
                        }}
                        className={`w-full bg-white dark:bg-gray-700 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                          carnetValidation.valid ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'
                        }`}
                        placeholder="A-2026001"
                      />
                      {!carnetValidation.valid && (
                        <p className="text-xs text-red-600 mt-1">{carnetValidation.error}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Formato: A-YYYYNNN</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grado *</label>
                   <select
                    required
                    value={formData.grado}
                    onChange={(e) => setFormData({ ...formData, grado: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                  >
                    <option value="">-</option>
                    {posiblesGrados.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombres}
                    onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sexo</label>
                  <select
                    value={formData.sexo}
                    onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                  >
                    <option value="">-</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jornada</label>
                  <select
                    value={formData.jornada}
                    onChange={(e) => setFormData({ ...formData, jornada: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                  >
                    <option value="">-</option>
                    <option value="Matutina">Matutina</option>
                    <option value="Vespertina">Vespertina</option>
                    <option value="Nocturna">Nocturna</option>
                    <option value="Semipresencial">Semipresencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Fin de Semana (Sábado)">Fin de Semana (Sábado)</option>
                    <option value="Fin de Semana (Domingo)">Fin de Semana (Domingo)</option>
                  </select>
                </div>
              </div>


               {/* Campos carrera/especialidad solo visibles para Diversificado */}
               {formData.grado && formData.grado.includes('Diversificado') && (
                 <>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Carrera</label>
                     <input
                       type="text"
                       value={formData.carrera}
                       onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                       className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                       placeholder="Bachillerato en Computación"
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Especialidad</label>
                     <input
                       type="text"
                       value={formData.especialidad}
                       onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
                       className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                       placeholder="Dibujo Técnico"
                     />
                   </div>
                 </>
               )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 font-bold py-2.5 rounded-lg transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-bold py-2.5 rounded-lg transition"
                  >
                    {editingAlumno ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 99999
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Modal de visualización de QR */}
      {qrModalData && createPortal(
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100000]"
          onClick={() => setQrModalData(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Código QR</h3>
              <button
                onClick={() => setQrModalData(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex justify-center">
              <img src={qrModalData} alt="Código QR" className="max-w-full h-auto" />
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Modal de Reasignación de Carnet */}
      {showReasignarModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                ⚠️ Reasignar Carnet
              </h3>
              <button
                onClick={() => {
                  setShowReasignarModal(false);
                  setNuevoCarnet('');
                  setCarnetValidation({ valid: true, error: null });
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                🚨 <strong>Advertencia:</strong> Reasignar el carnet actualizará todos los registros asociados y regenerará el código QR automáticamente.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Carnet Actual
              </label>
              <div className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5">
                <span className="font-mono font-bold text-gray-600 dark:text-gray-400">{formData.carnet}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nuevo Carnet *
              </label>
              <input
                type="text"
                value={nuevoCarnet}
                onChange={(e) => {
                  const value = e.target.value;
                  setNuevoCarnet(value);
                  validateManualCarnet(value);
                }}
                className={`w-full bg-white dark:bg-gray-700 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 ${
                  carnetValidation.valid ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'
                }`}
                placeholder="A-2026001"
                autoFocus
              />
              {!carnetValidation.valid && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  ❌ {carnetValidation.error}
                </p>
              )}
              {carnetValidation.valid && nuevoCarnet && nuevoCarnet !== formData.carnet && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  ✅ Carnet disponible
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Formato: A-YYYYNNN</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowReasignarModal(false);
                  setNuevoCarnet('');
                  setCarnetValidation({ valid: true, error: null });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2.5 px-4 rounded-lg transition"
                disabled={reasignandoCarnet}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleReasignarCarnet}
                disabled={reasignandoCarnet || !carnetValidation.valid || !nuevoCarnet || nuevoCarnet === formData.carnet}
                className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                {reasignandoCarnet ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Reasignando...
                  </>
                ) : (
                  <>
                    ✅ Confirmar Reasignación
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
