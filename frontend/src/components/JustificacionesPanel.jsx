import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, AlertCircle, Check, X, Eye, Calendar, User, Filter,
  UserX, Clock, ChevronDown, ChevronUp, FileDown, FileSpreadsheet,
  Search, ChevronLeft, ChevronRight, Users
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
  const [personaJustificar, setPersonaJustificar] = useState(null);
  const [inicializado, setInicializado] = useState(false);

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
             <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                <h3 className="font-bold text-lg mb-4">Rechazar Justificación</h3>
                <textarea 
                  className="w-full border rounded p-2 mb-4" 
                  rows={3}
                  placeholder="Motivo del rechazo..."
                  value={motivoRechazo}
                  onChange={e => setMotivoRechazo(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                   <button onClick={() => setMostrarModalRechazo(false)} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                   <button onClick={handleRechazar} className="px-4 py-2 bg-red-600 text-white rounded">Rechazar</button>
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
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Foto más grande y mejor visualizada */}
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden flex items-center justify-center flex-shrink-0">
            {fotoUrl ? (
              <img src={fotoUrl} onError={() => setImgError(true)} className="w-full h-full object-cover" alt={persona?.nombres}/>
            ) : (
              <span className="text-lg">{esAlumno ? '👨‍🎓' : '👨‍🏫'}</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{persona?.nombres} {persona?.apellidos}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {esAlumno 
                ? `${persona?.grado || ''} ${persona?.seccion || ''}`.trim()
                : persona?.cargo || 'Personal'}
            </p>
            {/* Carnet mostrado prominentemente */}
            <p className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 mt-1 bg-blue-50 dark:bg-blue-900/30 inline-block px-2 py-1 rounded">
              Carnet: {persona?.carnet || 'N/A'}
            </p>
          </div>
        </div>
      </td>

      {/* Jornada */}
      <td className="px-6 py-4 text-center">
        <span className={`px-3 py-1 rounded text-xs font-semibold
          ${persona?.jornada === 'Matutina' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'}
        `}>
          {persona?.jornada || 'N/A'}
        </span>
      </td>

      {/* Motivo de Ausencia */}
      <td className="px-6 py-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{excusa.motivo}</p>
        {excusa.descripcion && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{excusa.descripcion}</p>
        )}
      </td>

      {/* Fecha */}
      <td className="px-6 py-4 text-center">
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
      <td className="px-6 py-4 text-center">
        <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap
          ${excusa.estado === 'aprobada' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
            excusa.estado === 'rechazada' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
            'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'}
        `}>
          {excusa.estado.charAt(0).toUpperCase() + excusa.estado.slice(1)}
        </span>
      </td>

      {/* Acciones */}
      <td className="px-6 py-4">
        <div className="flex justify-center gap-2">
          {excusa.estado === 'pendiente' && (
            <>
              <button 
                onClick={() => onAprobar(excusa.id)} 
                title="Aprobar"
                className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition"
              >
                <Check size={18} />
              </button>
              <button 
                onClick={() => onRechazar(excusa)}
                title="Rechazar"
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </>
          )}
          <button 
            onClick={() => onVerDetalles(excusa)}
            title="Ver detalles"
            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition"
          >
            <Eye size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ModalDetalles({ persona, excusa, onClose, formatFecha, baseUrl }) {
  const [imgError, setImgError] = useState(false);
  
  const fotoUrl = !imgError && persona?.foto_path 
    ? (persona.foto_path.startsWith('http') ? persona.foto_path : `http://localhost:5000/uploads/${persona.foto_path}`)
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
         {/* Header */}
         <div className="flex justify-between items-center mb-6 border-b dark:border-gray-700 pb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Detalles de Justificación</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X size={24}/>
            </button>
         </div>

         {/* Información de la Persona */}
         <div className="flex items-center gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl mb-6">
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
         <div className="grid grid-cols-2 gap-4 mb-6">
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
         <div className="mb-6">
            <label className="text-sm font-bold text-gray-500 dark:text-gray-400 block mb-2">Motivo de Ausencia</label>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-gray-900 dark:text-gray-100 font-medium">{excusa.motivo}</p>
            </div>
         </div>
         
         {/* Descripción si existe */}
         {excusa.descripcion && (
            <div className="mb-6">
               <label className="text-sm font-bold text-gray-500 dark:text-gray-400 block mb-2">Descripción</label>
               <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                 <p className="text-gray-900 dark:text-gray-100">{excusa.descripcion}</p>
               </div>
            </div>
         )}

         {/* Evidencia si existe */}
         {excusa.documento_url && (
            <div className="mb-6">
               <label className="text-sm font-bold text-gray-500 dark:text-gray-400 block mb-2">Evidencia Adjunta</label>
               <a 
                 href={`http://localhost:5000/uploads/${excusa.documento_url}`} 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
               >
                 <FileText size={18}/> 
                 <span className="font-medium">Ver Documento</span>
               </a>
            </div>
         )}

         {/* Observaciones si fueron rechazadas */}
         {excusa.estado === 'rechazada' && excusa.observaciones && (
            <div className="mb-6">
               <label className="text-sm font-bold text-red-600 dark:text-red-400 block mb-2">Motivo del Rechazo</label>
               <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                 <p className="text-red-900 dark:text-red-200">{excusa.observaciones}</p>
               </div>
            </div>
         )}

         {/* Footer */}
         <div className="flex justify-end pt-6 border-t dark:border-gray-700">
            <button 
              onClick={onClose} 
              className="px-6 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 font-medium transition"
            >
              Cerrar
            </button>
         </div>
      </div>
    </div>
  );
}

// Estilos adicionales para inputs
const inputStyle = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700";
