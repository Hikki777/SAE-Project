import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, AlertCircle, Check, X, Eye, Calendar, User, Filter,
  UserX, Clock, ChevronDown, ChevronUp, FileDown, FileSpreadsheet,
  Search, ChevronLeft, ChevronRight, Users, Plus, Upload
} from 'lucide-react';
import client from '../api/client';
import toast, { Toaster } from 'react-hot-toast';
import { generateJustificacionesPDF, generateJustificacionesExcel } from '../utils/reportGenerator';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

export default function JustificacionesPanel() {
  const [excusas, setExcusas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ausentesHoy: 0,
    ausentesSemana: 0,
    ausentesMes: 0,
    pendientes: 0,
    rechazadas: 0
  });

  // Filtros
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: '',
    rol: '',
    fechaInicio: '',
    fechaFin: '',
    rangoRapido: 'hoy'
  });
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  // Modales
  const [excusaSeleccionada, setExcusaSeleccionada] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [mostrarModalRechazo, setMostrarModalRechazo] = useState(false);
  const [mostrarModalJustificar, setMostrarModalJustificar] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [personaJustificar, setPersonaJustificar] = useState(null);
  const [inicializado, setInicializado] = useState(false);
  
  // Estado del modal crear justificación
  const [formCrear, setFormCrear] = useState({
    tipo: 'alumno',
    persona_id: '',
    motivo: '',
    descripcion: '',
    fecha_ausencia: '',
    archivo: null
  });
  const [cargandoCrear, setCargandoCrear] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [personal, setPersonal] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    if (!inicializado) {
      const hoy = new Date();
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      setFiltros(prev => ({
        ...prev,
        rangoRapido: 'hoy',
        fechaInicio: formatDate(hoy),
        fechaFin: formatDate(hoy)
      }));
      setInicializado(true);
    }
  }, []);

  // Cargar datos cuando cambien los filtros
  useEffect(() => {
    if (inicializado) {
      cargarDatos();
    }
  }, [filtros.estado, filtros.busqueda, filtros.rol, filtros.fechaInicio, filtros.fechaFin]);

  // Cargar lista de alumnos y personal
  useEffect(() => {
    const cargarPersonas = async () => {
      try {
        const [alumnosRes, personalRes] = await Promise.all([
          client.get('/alumnos'),
          client.get('/personal')
        ]);
        setAlumnos(alumnosRes.data.alumnos || []);
        setPersonal(personalRes.data.personal || []);
      } catch (error) {
        console.error('Error cargando personas:', error);
      }
    };
    
    if (mostrarModalCrear) {
      cargarPersonas();
    }
  }, [mostrarModalCrear]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      // NO incluir estado en la búsqueda para estadísticas - las estadísticas deben ser globales
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
      if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
      
      // Filtros opcionales de rol
      if (filtros.rol === 'alumno') params.append('personaTipo', 'alumno');
      if (filtros.rol === 'personal') params.append('personaTipo', 'personal');

      const urlFinal = `/excusas?${params.toString()}`;
      console.log('📡 Llamando API:', urlFinal);

      // Obtener datos sin filtro de estado para las estadísticas
      const response = await client.get(urlFinal);
      const excusasData = response.data.excusas || [];

      console.log(`✓ Datos recibidos: ${excusasData.length} excusas`);
      
      // Calcular estadísticas globales sobre todos los datos
      calcularEstadisticas(excusasData);
      
      // Si hay filtro de estado, filtrar localmente para la tabla
      let excusasParaMostrar = excusasData;
      if (filtros.estado) {
        console.log(`🔽 Filtrando por estado: ${filtros.estado}`);
        excusasParaMostrar = excusasData.filter(e => e.estado === filtros.estado);
      }
      
      setExcusas(excusasParaMostrar);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      toast.error('Error al cargar justificaciones');
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (excusasData) => {
    // Helper para normalizar fechas ignorando zona horaria
    // Convierte la fecha a medianoche del día local
    const normalizarFecha = (fechaStr) => {
      const fecha = new Date(fechaStr);
      // Usar hora local, no UTC
      return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0, 0);
    };

    const hoy = new Date();
    const hoyNormalizado = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0, 0);
    
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);
    const hace7DiasNormalizado = new Date(hace7Dias.getFullYear(), hace7Dias.getMonth(), hace7Dias.getDate(), 0, 0, 0, 0);
    
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1, 0, 0, 0, 0);

    // Contar ausentes para cada período
    const ausentesHoy = excusasData.filter(e => {
      const fechaNormalizada = normalizarFecha(e.fecha_ausencia);
      return fechaNormalizada.getTime() === hoyNormalizado.getTime();
    }).length;

    const ausentesSemana = excusasData.filter(e => {
      const fechaNormalizada = normalizarFecha(e.fecha_ausencia);
      return fechaNormalizada >= hace7DiasNormalizado && fechaNormalizada <= hoyNormalizado;
    }).length;

    const ausentesMes = excusasData.filter(e => {
      const fechaNormalizada = normalizarFecha(e.fecha_ausencia);
      return fechaNormalizada >= inicioMes && fechaNormalizada <= hoyNormalizado;
    }).length;

    const stats = {
      ausentesHoy,
      ausentesSemana,
      ausentesMes,
      pendientes: excusasData.filter(e => e.estado === 'pendiente').length,
      rechazadas: excusasData.filter(e => e.estado === 'rechazada').length
    };

    console.log('📊 Estadísticas calculadas:', {
      totalExcusas: excusasData.length,
      hoy: hoyNormalizado.toLocaleDateString('es-ES'),
      hace7Dias: hace7DiasNormalizado.toLocaleDateString('es-ES'),
      inicioMes: inicioMes.toLocaleDateString('es-ES'),
      stats,
      muestraDatos: excusasData.slice(0, 2).map(e => ({
        id: e.id,
        fecha_ausencia: e.fecha_ausencia,
        fecha_normalizada: normalizarFecha(e.fecha_ausencia).toLocaleDateString('es-ES'),
        motivo: e.motivo,
        estado: e.estado
      }))
    });

    setStats(stats);
  };

  const handleRangoRapido = (rango) => {
    const hoy = new Date();
    
    // YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    let inicio, fin;
    fin = formatDate(hoy);

    switch (rango) {
      case 'hoy':
        inicio = fin;
        break;
      case 'semana':
        const hace7 = new Date();
        hace7.setDate(hoy.getDate() - 7);
        inicio = formatDate(hace7);
        break;
      case 'mes':
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        inicio = formatDate(inicioMes);
        break;
      default:
        return; 
    }

    setFiltros(prev => ({
      ...prev,
      rangoRapido: rango,
      fechaInicio: inicio,
      fechaFin: fin
    }));
  };

  const handleAprobar = async (excusaId) => {
    try {
      await client.put(`/excusas/${excusaId}`, { estado: 'aprobada' });
      toast.success('✓ Justificación aprobada');
      cargarDatos();
    } catch (error) {
      console.error('Error aprobando:', error);
      toast.error('Error al aprobar');
    }
  };

  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) {
      toast.error('Debes proporcionar un motivo');
      return;
    }
    try {
      await client.put(`/excusas/${excusaSeleccionada.id}`, { 
        estado: 'rechazada',
        observaciones: motivoRechazo
      });
      toast.success('✗ Justificación rechazada');
      setMostrarModalRechazo(false);
      setExcusaSeleccionada(null);
      setMotivoRechazo('');
      cargarDatos();
    } catch (error) {
      console.error('Error rechazando:', error);
      toast.error('Error al rechazar');
    }
  };

  const handleCrearJustificacion = async (e) => {
    e.preventDefault();
    
    if (!formCrear.persona_id || !formCrear.motivo || !formCrear.fecha_ausencia) {
      toast.error('Completa los campos requeridos');
      return;
    }

    setCargandoCrear(true);
    try {
      const formData = new FormData();
      formData.append('tipo', formCrear.tipo);
      formData.append(formCrear.tipo === 'alumno' ? 'alumno_id' : 'personal_id', formCrear.persona_id);
      formData.append('motivo', formCrear.motivo);
      formData.append('descripcion', formCrear.descripcion);
      formData.append('fecha_ausencia', formCrear.fecha_ausencia);
      
      if (formCrear.archivo) {
        formData.append('archivo', formCrear.archivo);
      }

      const response = await client.post('/excusas', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        toast.success('✓ Justificación registrada correctamente');
        setMostrarModalCrear(false);
        setFormCrear({
          tipo: 'alumno',
          persona_id: '',
          motivo: '',
          descripcion: '',
          fecha_ausencia: '',
          archivo: null
        });
        cargarDatos();
      }
    } catch (error) {
      console.error('Error creando justificación:', error);
      const mensaje = error.response?.data?.error || error.message;
      toast.error(mensaje);
    } finally {
      setCargandoCrear(false);
    }
  };

  const handleExportarPDF = async () => {
    try {
      const institucionRes = await client.get('/institucion');
      const institucion = institucionRes.data;
      
      await generateJustificacionesPDF({
        excusas: excusasFiltradas,
        institucion,
        stats: {
          total: excusasFiltradas.length,
          pendientes: excusasFiltradas.filter(e => e.estado === 'pendiente').length,
          aprobadas: excusasFiltradas.filter(e => e.estado === 'aprobada').length,
          rechazadas: excusasFiltradas.filter(e => e.estado === 'rechazada').length
        },
        filtrosGenerated: { ...filtros }
      });
      toast.success('PDF generado correctamente');
    } catch (error) {
      console.error('Error PDF:', error);
      toast.error('Error al generar PDF');
    }
  };

  const handleExportarExcel = async () => {
    try {
      const institucionRes = await client.get('/institucion');
      const institucion = institucionRes.data;

      await generateJustificacionesExcel({
        excusas: excusasFiltradas,
        institucion,
        stats: {
          total: excusasFiltradas.length,
          pendientes: excusasFiltradas.filter(e => e.estado === 'pendiente').length,
          aprobadas: excusasFiltradas.filter(e => e.estado === 'aprobada').length,
          rechazadas: excusasFiltradas.filter(e => e.estado === 'rechazada').length
        },
        filtrosGenerated: { ...filtros }
      });
      toast.success('Excel generado correctamente');
    } catch (error) {
      console.error('Error Excel:', error);
      toast.error('Error al generar Excel');
    }
  };

  const formatFechaDisplay = (fecha) => {
    if (!fecha) return '';
    // Ajustar zona horaria si viene como UTC
    const d = new Date(fecha);
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  // Filtrado final en cliente (por búsqueda texto y detalles)
  const excusasFiltradas = excusas.filter(e => {
    if (filtros.rol && filtros.rol !== '') {
      if (filtros.rol === 'alumno' && !e.alumno) return false;
      if (filtros.rol === 'personal' && !e.personal) return false;
    }
    const persona = e.alumno || e.personal;
    // Búsqueda texto
    if (filtros.busqueda) {
      const term = filtros.busqueda.toLowerCase();
      const nombre = `${persona?.nombres} ${persona?.apellidos}`.toLowerCase();
      const carnet = (persona?.carnet || '').toLowerCase();
      if (!nombre.includes(term) && !carnet.includes(term)) return false;
    }
    return true;
  });

  const totalPaginas = Math.ceil(excusasFiltradas.length / itemsPorPagina);
  const indiceInicio = (paginaActual - 1) * itemsPorPagina;
  const excusasPaginadas = excusasFiltradas.slice(indiceInicio, indiceInicio + itemsPorPagina);

  return (
    <div className="space-y-6">
      {/* Header con Botón Crear */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Justificaciones</h1>
        <button
          onClick={() => setMostrarModalCrear(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-md"
        >
          <Plus size={18} />
          Registrar Justificación
        </button>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon="📋" label="Ausentes Hoy" value={stats.ausentesHoy} color="blue" />
        <StatCard icon="📅" label="Semana" value={stats.ausentesSemana} color="blue" />
        <StatCard icon="📆" label="Mes" value={stats.ausentesMes} color="teal" />
        <StatCard icon="⏳" label="Pendientes" value={stats.pendientes} color="orange" />
        <StatCard icon="✗" label="Rechazadas" value={stats.rechazadas} color="red" />
      </div>

      {/* Sección de Filtros - Estilo Unificado */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-red-600 w-5 h-5" />
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-200">Filtros</h2>
        </div>

        {/* Rangos Rápidos */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rangos rápidos:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'hoy', label: 'Hoy' },
              { id: 'semana', label: 'Últimos 7 días' },
              { id: 'mes', label: 'Último mes' }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => handleRangoRapido(r.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  filtros.rangoRapido === r.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value, rangoRapido: 'custom' })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />Fecha Fin
            </label>
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value, rangoRapido: 'custom' })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Users className="inline w-4 h-4 mr-1" />Tipo de Persona
            </label>
            <select
              value={filtros.rol}
              onChange={(e) => setFiltros({ ...filtros, rol: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Todos</option>
              <option value="alumno">Alumnos</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <AlertCircle className="inline w-4 h-4 mr-1" />Estado
            </label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Todos los Estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobada">Aprobadas</option>
              <option value="rechazada">Rechazadas</option>
            </select>
          </div>
        </div>

        {/* Búsqueda y Botones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Search className="inline w-4 h-4 mr-1" />Buscar por nombre/carnet
              </label>
              <input
                type="text"
                placeholder="Ingresa nombre o carnet..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="flex gap-2 items-end">
            <button
              onClick={() => {
                const hoy = new Date();
                const formatDate = (date) => {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  return `${year}-${month}-${day}`;
                };
                const hoyFormato = formatDate(hoy);
                setFiltros({
                  busqueda: '', 
                  estado: '', 
                  rol: '', 
                  fechaInicio: hoyFormato, 
                  fechaFin: hoyFormato, 
                  rangoRapido: 'hoy'
                });
                setPaginaActual(1);
              }}
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition"
            >
              Limpiar Filtros
            </button>
            <button
              onClick={cargarDatos}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition flex items-center gap-2"
            >
              <Search size={16} /> Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Botones de Descarga */}
      <div className="flex gap-3">
        <button
          onClick={handleExportarPDF}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition shadow-md"
        >
          <FileDown size={18} />
          Descargar PDF
        </button>
        <button
          onClick={handleExportarExcel}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition shadow-md"
        >
          <FileSpreadsheet size={18} />
          Descargar Excel
        </button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="loader" /></div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Persona</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Jornada</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Motivo de Ausencia</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Fecha</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Estado</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {excusasPaginadas.map(excusa => (
                <FilaJustificacion 
                  key={excusa.id} 
                  excusa={excusa}
                  onAprobar={handleAprobar}
                  onRechazar={(exc) => {
                    setExcusaSeleccionada(exc);
                    setMostrarModalRechazo(true);
                  }}
                  onVerDetalles={(exc) => {
                    setPersonaJustificar(exc.alumno || exc.personal);
                    setExcusaSeleccionada(exc);
                    setMostrarModalJustificar(true);
                  }}
                />
              ))}
            </tbody>
          </table>
          
          {excusasFiltradas.length === 0 && (
             <div className="text-center py-12 text-gray-500">No se encontraron registros.</div>
          )}

          {/* Paginador */}
          {totalPaginas > 1 && (
             <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
               <span className="text-sm text-gray-600">
                  Página {paginaActual} de {totalPaginas}
               </span>
               <div className="flex gap-1">
                 <button 
                    disabled={paginaActual === 1}
                    onClick={() => setPaginaActual(p => p - 1)}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                 >
                    <ChevronLeft size={20} />
                 </button>
                 <button 
                    disabled={paginaActual === totalPaginas}
                    onClick={() => setPaginaActual(p => p + 1)}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
                 >
                    <ChevronRight size={20} />
                 </button>
               </div>
             </div>
          )}
        </div>
      )}

      {/* Modales */}
      <AnimatePresence>
        {mostrarModalCrear && (
          <ModalCrearJustificacion
            open={mostrarModalCrear}
            onClose={() => setMostrarModalCrear(false)}
            onSubmit={handleCrearJustificacion}
            form={formCrear}
            setForm={setFormCrear}
            alumnos={alumnos}
            personal={personal}
            cargando={cargandoCrear}
          />
        )}
        {mostrarModalJustificar && personaJustificar && (
          <ModalDetalles 
            persona={personaJustificar} 
            excusa={excusaSeleccionada}
            onClose={() => setMostrarModalJustificar(false)}
            formatFecha={formatFechaDisplay}
            baseUrl={BASE_URL}
          />
        )}
        {mostrarModalRechazo && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
                <h3 className="font-bold text-lg mb-4">Rechazar Justificación</h3>
                <textarea 
                  className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
                  rows={3}
                  placeholder="Motivo del rechazo..."
                  value={motivoRechazo}
                  onChange={e => setMotivoRechazo(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                   <button onClick={() => setMostrarModalRechazo(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded">Cancelar</button>
                   <button onClick={handleRechazar} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Rechazar</button>
                </div>
             </div>
           </div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" />
    </div>
  );
}

// Subcomponentes
function StatCard({ icon, label, value, color }) {
  const colors = {
     blue: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20',
     teal: 'border-l-teal-500 bg-teal-50 dark:bg-teal-900/20',
     orange: 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20',
     red: 'border-l-red-500 bg-red-50 dark:bg-red-900/20'
  };
  return (
    <div className={`p-4 rounded-xl shadow-sm border-l-4 ${colors[color] || 'bg-white'} dark:border-gray-700`}>
       <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{value}</p>
          </div>
          <span className="text-3xl">{icon}</span>
       </div>
    </div>
  );
}

function FilaJustificacion({ excusa, onAprobar, onRechazar, onVerDetalles }) {
  const persona = excusa.alumno || excusa.personal;
  const esAlumno = !!excusa.alumno;
  
  // Foto
  const [imgError, setImgError] = useState(false);
  const fotoUrl = !imgError && persona?.foto_path 
     ? (persona.foto_path.startsWith('http') ? persona.foto_path : `http://localhost:5000/uploads/${persona.foto_path}`)
     : null;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
      {/* Persona con Foto y Carnet */}
      <td className="px-4 py-3">
        <div className="flex items-start gap-3">
          {/* Foto más compacta */}
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden flex items-center justify-center flex-shrink-0 mt-0.5">
            {fotoUrl ? (
              <img src={fotoUrl} onError={() => setImgError(true)} className="w-full h-full object-cover" alt={persona?.nombres}/>
            ) : (
              <span className="text-sm">{esAlumno ? '👨‍🎓' : '👨‍🏫'}</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
              {persona?.nombres || 'N/A'}
            </p>
            <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
              {persona?.apellidos || 'N/A'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
              {esAlumno 
                ? `${persona?.grado || ''} ${persona?.seccion || ''}`.trim()
                : persona?.cargo || 'Personal'}
            </p>
            {/* Carnet mostrado prominentemente */}
            <p className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 mt-0.5 bg-blue-50 dark:bg-blue-900/30 inline-block px-2 py-0.5 rounded">
              {persona?.carnet || 'N/A'}
            </p>
          </div>
        </div>
      </td>

      {/* Jornada */}
      <td className="px-4 py-3 text-center">
        <span className={`px-2 py-1 rounded text-xs font-semibold
          ${persona?.jornada === 'Matutina' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'}
        `}>
          {persona?.jornada || 'N/A'}
        </span>
      </td>

      {/* Motivo de Ausencia */}
      <td className="px-4 py-3">
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{excusa.motivo}</p>
        {excusa.descripcion && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{excusa.descripcion}</p>
        )}
      </td>

      {/* Fecha */}
      <td className="px-4 py-3 text-center">
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
          {new Date(excusa.fecha_ausencia).toLocaleDateString('es-ES', { 
            weekday: 'short', 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit' 
          })}
        </p>
      </td>

      {/* Estado */}
      <td className="px-4 py-3 text-center">
        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap inline-block
          ${excusa.estado === 'aprobada' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
            excusa.estado === 'rechazada' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
            'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'}
        `}>
          {excusa.estado.charAt(0).toUpperCase() + excusa.estado.slice(1)}
        </span>
      </td>

      {/* Acciones */}
      <td className="px-4 py-3">
        <div className="flex justify-center gap-1">
          {excusa.estado === 'pendiente' && (
            <>
              <button 
                onClick={() => onAprobar(excusa.id)} 
                title="Aprobar"
                className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition"
              >
                <Check size={20} />
              </button>
              <button 
                onClick={() => onRechazar(excusa)}
                title="Rechazar"
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </>
          )}
          <button 
            onClick={() => onVerDetalles(excusa)}
            title="Ver detalles"
            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
          >
            <Eye size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ModalDetalles({ persona, excusa, onClose, formatFecha, baseUrl }) {
  const [imgError, setImgError] = useState(false);
  const [cargandoAccion, setCargandoAccion] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [mostrarFormRechazo, setMostrarFormRechazo] = useState(false);
  
  const fotoUrl = !imgError && persona?.foto_path 
    ? (persona.foto_path.startsWith('http') ? persona.foto_path : `http://localhost:5000/uploads/${persona.foto_path}`)
    : null;

  const handleAprobar = async () => {
    setCargandoAccion(true);
    try {
      await client.put(`/excusas/${excusa.id}`, { estado: 'aprobada' });
      toast.success('✓ Justificación aprobada');
      setTimeout(() => {
        onClose();
        // Recargar datos
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al aprobar');
    } finally {
      setCargandoAccion(false);
    }
  };

  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) {
      toast.error('Debes proporcionar un motivo');
      return;
    }
    setCargandoAccion(true);
    try {
      await client.put(`/excusas/${excusa.id}`, { 
        estado: 'rechazada',
        observaciones: motivoRechazo
      });
      toast.success('✗ Justificación rechazada');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al rechazar');
    } finally {
      setCargandoAccion(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
         {/* Header */}
         <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Eye size={24} className="text-blue-600" />
              Detalles de Justificación
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
              <X size={24}/>
            </button>
         </div>

         <div className="p-6 space-y-6">
           {/* Información de la Persona */}
           <div className="flex items-center gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
              {/* Foto */}
              <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md">
                {fotoUrl ? (
                  <img 
                    src={fotoUrl} 
                    onError={() => setImgError(true)} 
                    className="w-full h-full object-cover"
                    alt={persona?.nombres}
                  />
                ) : (
                  <div className="text-4xl">👤</div>
                )}
              </div>
              
              {/* Datos */}
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">{persona?.nombres} {persona?.apellidos}</h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {persona?.grado ? `${persona.grado} ${persona.seccion || ''}` : persona?.cargo}
                </p>
                <p className="text-sm font-mono font-bold text-white bg-blue-600 dark:bg-blue-700 inline-block px-3 py-1 rounded mt-2">
                  Carnet: {persona?.carnet}
                </p>
              </div>
           </div>

           {/* Información de Ausencia */}
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Fecha de Ausencia</label>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-2">
                  {formatFecha(excusa.fecha_ausencia)}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400">Estado</label>
                <div className="mt-2">
                  <span className={`px-3 py-2 rounded-full text-sm font-bold inline-block
                    ${excusa.estado === 'aprobada' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                      excusa.estado === 'rechazada' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'}
                  `}>
                    {excusa.estado.charAt(0).toUpperCase() + excusa.estado.slice(1)}
                  </span>
                </div>
              </div>
           </div>

           {/* Motivo */}
           <div>
              <label className="text-sm font-bold text-gray-500 dark:text-gray-400 block mb-2">Motivo de Ausencia</label>
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <p className="text-gray-900 dark:text-gray-100 font-medium">{excusa.motivo}</p>
              </div>
           </div>
           
           {/* Descripción si existe */}
           {excusa.descripcion && (
              <div>
                 <label className="text-sm font-bold text-gray-500 dark:text-gray-400 block mb-2">Descripción</label>
                 <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                   <p className="text-gray-900 dark:text-gray-100">{excusa.descripcion}</p>
                 </div>
              </div>
           )}

           {/* Evidencia si existe */}
           {excusa.documento_url && (
              <div>
                 <label className="text-sm font-bold text-gray-500 dark:text-gray-400 block mb-2">Evidencia Adjunta</label>
                 <a 
                   href={`http://localhost:5000/uploads/${excusa.documento_url}`} 
                   target="_blank" 
                   rel="noreferrer"
                   className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition"
                 >
                   <FileText size={18}/> 
                   <span className="font-medium">Ver Documento</span>
                 </a>
              </div>
           )}

           {/* Observaciones si fueron rechazadas */}
           {excusa.estado === 'rechazada' && excusa.observaciones && (
              <div>
                 <label className="text-sm font-bold text-red-600 dark:text-red-400 block mb-2">Motivo del Rechazo</label>
                 <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                   <p className="text-red-900 dark:text-red-200">{excusa.observaciones}</p>
                 </div>
              </div>
           )}

           {/* Formulario de Rechazo si está pendiente */}
           {excusa.estado === 'pendiente' && mostrarFormRechazo && (
             <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
               <label className="text-sm font-bold text-red-600 dark:text-red-400 block mb-2">Motivo del Rechazo</label>
               <textarea
                 value={motivoRechazo}
                 onChange={(e) => setMotivoRechazo(e.target.value)}
                 placeholder="Explica por qué se rechaza esta justificación..."
                 className="w-full border border-red-300 dark:border-red-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                 rows={3}
               />
             </div>
           )}

           {/* Botones de Acción */}
           <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 flex-wrap">
             {excusa.estado === 'pendiente' && (
               <>
                 {!mostrarFormRechazo ? (
                   <>
                     <button 
                       onClick={handleAprobar}
                       disabled={cargandoAccion}
                       className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
                     >
                       <Check size={18} />
                       Aprobar
                     </button>
                     <button 
                       onClick={() => setMostrarFormRechazo(true)}
                       disabled={cargandoAccion}
                       className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
                     >
                       <X size={18} />
                       Rechazar
                     </button>
                   </>
                 ) : (
                   <>
                     <button 
                       onClick={() => setMostrarFormRechazo(false)}
                       disabled={cargandoAccion}
                       className="flex-1 px-4 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition disabled:opacity-50"
                     >
                       Cancelar
                     </button>
                     <button 
                       onClick={handleRechazar}
                       disabled={cargandoAccion || !motivoRechazo.trim()}
                       className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
                     >
                       {cargandoAccion ? (
                         <>
                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                           Rechazando...
                         </>
                       ) : (
                         <>
                           <X size={18} />
                           Confirmar Rechazo
                         </>
                       )}
                     </button>
                   </>
                 )}
               </>
             )}
             <button 
               onClick={onClose}
               className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
             >
               Cerrar
             </button>
           </div>
         </div>
      </motion.div>
    </div>
  );
}

// Estilos adicionales para inputs
const inputStyle = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100";

function ModalCrearJustificacion({ open, onClose, onSubmit, form, setForm, alumnos, personal, cargando }) {
  const personasDisponibles = form.tipo === 'alumno' ? alumnos : personal;
  
  const getNombrePersona = (persona) => {
    return `${persona.nombres} ${persona.apellidos}` + (persona.carnet ? ` (${persona.carnet})` : '');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Plus className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Registrar Justificación</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Tipo de Persona */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Tipo de Persona
            </label>
            <select
              value={form.tipo}
              onChange={(e) => setForm({ ...form, tipo: e.target.value, persona_id: '' })}
              className={inputStyle}
            >
              <option value="alumno">Alumno/a</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          {/* Persona */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <User className="inline w-4 h-4 mr-1" />
              Selecciona la Persona *
            </label>
            <select
              value={form.persona_id}
              onChange={(e) => setForm({ ...form, persona_id: e.target.value })}
              className={inputStyle}
              required
            >
              <option value="">-- Selecciona una persona --</option>
              {personasDisponibles.map(persona => (
                <option key={persona.id} value={persona.id}>
                  {getNombrePersona(persona)}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha de Ausencia */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Fecha de Ausencia *
            </label>
            <input
              type="date"
              value={form.fecha_ausencia}
              onChange={(e) => setForm({ ...form, fecha_ausencia: e.target.value })}
              className={inputStyle}
              required
            />
          </div>

          {/* Motivo */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <AlertCircle className="inline w-4 h-4 mr-1" />
              Motivo de Ausencia *
            </label>
            <input
              type="text"
              placeholder="Ej: Cita médica, Enfermedad, etc."
              value={form.motivo}
              onChange={(e) => setForm({ ...form, motivo: e.target.value })}
              className={inputStyle}
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Descripción (Opcional)
            </label>
            <textarea
              placeholder="Agrega más detalles sobre la justificación..."
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className={`${inputStyle} resize-none`}
              rows={3}
            />
          </div>

          {/* Archivo Adjunto */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Upload className="inline w-4 h-4 mr-1" />
              Archivo Adjunto (PDF o Imagen - Máx 5MB)
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setForm({ ...form, archivo: e.target.files?.[0] || null })}
                className="hidden"
                id="archivo-input"
              />
              <label htmlFor="archivo-input" className="cursor-pointer block">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {form.archivo ? form.archivo.name : 'Click para seleccionar archivo'}
                </p>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={cargando}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {cargando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Registrar Justificación
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
