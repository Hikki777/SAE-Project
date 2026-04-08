import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, AlertCircle, Check, X, Eye, Calendar, User, Filter,
  UserX, Clock, ChevronDown, ChevronUp, FileDown, FileSpreadsheet,
  Search, ChevronLeft, ChevronRight, Users, Upload, ClipboardList
} from 'lucide-react';
import client from '../api/client';
import toast, { Toaster } from 'react-hot-toast';
import { generateJustificacionesPDF, generateJustificacionesExcel } from '../utils/reportGenerator';
import RevisionRapidaView from './RevisionRapidaView';
import ModalJustificacionRapida from './ModalJustificacionRapida';
import { useSearchParams, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

export default function JustificacionesPanel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isModoRevision = searchParams.get('modo') === 'revision';
  const [ausentesRevision, setAusentesRevision] = useState(() => {
    if (isModoRevision) {
      const almacenados = sessionStorage.getItem('ausentes_revision');
      return almacenados ? JSON.parse(almacenados) : [];
    }
    return [];
  });
  const [excusas, setExcusas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    ausentesHoy: 0,
    ausentesSemana: 0,
    ausentesMes: 0,
    pendientes: 0,
    aprobadas: 0,
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
  const [personaJustificar, setPersonaJustificar] = useState(null);
  const [inicializado, setInicializado] = useState(false);

  // Ausentes sin justificar hoy
  const [ausentesHoySinJustificar, setAusentesHoySinJustificar] = useState([]);
  const [personaAJustificar, setPersonaAJustificar] = useState(null);
  const [showModalJustificarAusente, setShowModalJustificarAusente] = useState(false);

  // Estado para personas (no se usan en carga pero se declaran para evitar error)
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

  // Cargar datos cuando cambien los filtros o al inicializar
  useEffect(() => {
    if (inicializado && !isModoRevision) {
      cargarDatos();
    }
  }, [filtros.estado, filtros.busqueda, filtros.rol, filtros.fechaInicio, filtros.fechaFin, inicializado]);

  // Refrescar al volver del Kanban
  useEffect(() => {
    if (inicializado && !isModoRevision) {
      cargarDatos();
    }
  }, [isModoRevision]);

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
    cargarPersonas();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
      if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
      if (filtros.rol === 'alumno') params.append('personaTipo', 'alumno');
      if (filtros.rol === 'personal') params.append('personaTipo', 'personal');

      const urlFinal = `/excusas?${params.toString()}`;
      console.log('📡 Llamando API:', urlFinal);

      const [response, statsRes, ausentesRes] = await Promise.all([
        client.get(urlFinal),
        client.get('/excusas'),
        client.get('/asistencias/ausentes').catch(() => ({ data: { ausentes: [], total: 0 } }))
      ]);
      const tableData = response.data.excusas || [];
      const globalData = statsRes.data.excusas || [];
      const verdaderosAusentesHoy = ausentesRes.data.total || 0;
      const ausentesRaw = ausentesRes.data.ausentes || [];

      console.log(`✓ Datos recibidos: Tabla(${tableData.length}) Global(${globalData.length})`);
      
      calcularEstadisticas(globalData, verdaderosAusentesHoy);
      
      let excusasParaMostrar = tableData;
      if (filtros.estado) {
        excusasParaMostrar = tableData.filter(e => e.estado === filtros.estado);
      }
      setExcusas(excusasParaMostrar);

      // ── Calcular ausentes sin justificar hoy ──────────────────────────────
      const hoy = new Date();
      const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}-${String(hoy.getDate()).padStart(2,'0')}`;
      const excusasDeHoy = globalData.filter(e => {
        if (!e.fecha_ausencia) return false;
        const d = new Date(e.fecha_ausencia);
        const s = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
        return s === hoyStr;
      });
      const ausentesSinJustificar = ausentesRaw.filter(persona => {
        return !excusasDeHoy.some(e => {
          if (persona.tipo === 'alumno' && e.alumno_id === persona.id) return true;
          if (persona.tipo === 'personal' && e.personal_id === persona.id) return true;
          return false;
        });
      });
      setAusentesHoySinJustificar(ausentesSinJustificar);
      // ─────────────────────────────────────────────────────────────────────

    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      toast.error('Error al cargar justificaciones');
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (excusasData, verdaderosAusentesHoy = 0) => {
    // Helper para normalizar fechas ignorando zona horaria
    // Convierte la fecha a medianoche del día local
    const normalizarFecha = (fechaStr) => {
      const fecha = new Date(fechaStr);
      // Extraemos los valores de acuerdo a la cadena original UTC para que la zona horaria local no cambie de día
      return new Date(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate(), 0, 0, 0, 0);
    };

    const hoy = new Date();
    const hoyNormalizado = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0, 0);
    
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);
    const hace7DiasNormalizado = new Date(hace7Dias.getFullYear(), hace7Dias.getMonth(), hace7Dias.getDate(), 0, 0, 0, 0);
    
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1, 0, 0, 0, 0);

    // Contar ausentes para cada período
    const ausentesSemana = excusasData.filter(e => {
      const fechaNormalizada = normalizarFecha(e.fecha_ausencia);
      return fechaNormalizada >= hace7DiasNormalizado && fechaNormalizada <= hoyNormalizado;
    }).length;

    const ausentesMes = excusasData.filter(e => {
      const fechaNormalizada = normalizarFecha(e.fecha_ausencia);
      return fechaNormalizada >= inicioMes && fechaNormalizada <= hoyNormalizado;
    }).length;

    const stats = {
      ausentesHoy: verdaderosAusentesHoy,
      ausentesSemana,
      ausentesMes,
      pendientes: excusasData.filter(e => e.estado === 'pendiente').length,
      aprobadas: excusasData.filter(e => e.estado === 'aprobada').length,
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

  const handleVerAusentes = async () => {
    try {
      const response = await client.get('/asistencias/ausentes');
      const { ausentes, total } = response.data;
      
      if (total === 0) {
        toast.success('¡Todos presentes hoy!', { icon: '✅' });
        return;
      }
      
      // Obtener excusas actualizadas para saber si ya están justificados
      const excusasRes = await client.get('/excusas');
      const todasExcusas = excusasRes.data.excusas || [];
      const hoyStr = new Date().toISOString().split('T')[0];
      
      const excusasDeHoy = todasExcusas.filter(e => {
        if (!e.fecha_ausencia) return false;
        const eStr = new Date(e.fecha_ausencia).toISOString().split('T')[0];
        return eStr === hoyStr;
      });

      const ausentesNoJustificados = (ausentes || []).filter(persona => {
        return !excusasDeHoy.some(e => {
           if (persona.tipo === 'alumno' && e.alumno_id === persona.id) return true;
           if (persona.tipo === 'personal' && e.personal_id === persona.id) return true;
           return false;
        });
      });

      if (ausentesNoJustificados.length === 0) {
        toast.success('¡Todas las ausencias de hoy ya están justificadas!', { icon: '✅' });
        return;
      }
      
      navigate('?modo=revision');
    } catch (error) {
      console.error('Error obteniendo ausentes:', error);
      toast.error('Error al obtener la lista de ausentes');
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

  const getFechaLocalString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (isModoRevision) {
    return (
      <RevisionRapidaView 
        ausentesIniciales={ausentesRevision} 
        fecha={getFechaLocalString()} 
        onVolver={() => {
          sessionStorage.removeItem('ausentes_revision');
          sessionStorage.removeItem('fecha_revision');
          navigate('/justificaciones');
        }} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="text-red-600" size={28} />
            Gestión de Justificaciones
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Revisa, aprueba o rechaza los motivos de ausencia recibidos.
          </p>
        </div>
        <button
          onClick={handleVerAusentes}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          <UserX size={20} />
          Ver Ausentes para Justificar
        </button>
      </div>

      {/* ═══ Sección: Ausentes sin justificar HOY ═══ */}
      {ausentesHoySinJustificar.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList size={20} className="text-amber-600 dark:text-amber-400" />
            <h2 className="text-base font-bold text-amber-900 dark:text-amber-200">
              Ausentes sin justificar hoy ({ausentesHoySinJustificar.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ausentesHoySinJustificar.map(persona => (
              <div
                key={`${persona.tipo}-${persona.id}`}
                className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-700 p-3 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {persona.foto_path ? (
                    <img
                      src={persona.foto_path.startsWith('http') ? persona.foto_path : `${BASE_URL}/uploads/${persona.foto_path}`}
                      alt={persona.nombres}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display='none'; }}
                    />
                  ) : (
                    <span className="text-lg">{persona.tipo === 'alumno' ? '👨‍🎓' : '👨‍🏫'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                    {persona.nombres} {persona.apellidos}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {persona.tipo === 'alumno'
                      ? `${persona.grado || ''} ${persona.seccion || ''}`.trim()
                      : persona.cargo || 'Personal'}
                  </p>
                  <span className="text-xs font-mono text-blue-600 dark:text-blue-400">{persona.carnet}</span>
                </div>
                <button
                  onClick={() => { setPersonaAJustificar(persona); setShowModalJustificarAusente(true); }}
                  className="flex-shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition"
                >
                  Justificar
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon="📋" label="Ausentes Hoy" value={stats.ausentesHoy} color="red" />
        <StatCard icon="📅" label="Recibidas Semana" value={stats.ausentesSemana} color="blue" />
        <StatCard icon="📆" label="Recibidas Mes" value={stats.ausentesMes} color="teal" />
        <StatCard icon="⏳" label="Pendientes" value={stats.pendientes} color="orange" />
        <StatCard icon="✔" label="Aprobadas" value={stats.aprobadas} color="green" />
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
                  fechaInicio: '', 
                  fechaFin: '', 
                  rangoRapido: 'todos'
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
        {mostrarModalJustificar && personaJustificar && (
          <ModalDetalles 
            persona={personaJustificar} 
            excusa={excusaSeleccionada}
            onClose={() => { setMostrarModalJustificar(false); cargarDatos(); }}
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

      {/* Modal justificar ausente desde panel tradicional */}
      {showModalJustificarAusente && personaAJustificar && (
        <ModalJustificacionRapida
          persona={personaAJustificar}
          fecha={getFechaLocalString()}
          onGuardar={() => {
            setShowModalJustificarAusente(false);
            setPersonaAJustificar(null);
            cargarDatos();
          }}
          onCancelar={() => {
            setShowModalJustificarAusente(false);
            setPersonaAJustificar(null);
          }}
        />
      )}

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
            <p className="font-bold text-gray-700 dark:text-gray-200 text-sm">
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
        // El parent recarga datos cuando cierra el modal
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
        // El parent recarga datos cuando cierra el modal
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al rechazar');
    } finally {
      setCargandoAccion(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
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
                   href={`${BASE_URL}/uploads/${excusa.documento_url}`} 
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
