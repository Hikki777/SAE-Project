import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, AlertCircle, Check, X, Eye, Calendar, User, Filter,
  UserX, Clock, ChevronDown, ChevronUp, FileDown, FileSpreadsheet,
  Search, ChevronLeft, ChevronRight
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

  useEffect(() => {
    // Inicializar rango hoy si no hay fechas
    if (!filtros.fechaInicio && !filtros.fechaFin) {
      handleRangoRapido('hoy');
    } else {
      cargarDatos();
    }
  }, [filtros]); 

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);
      if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
      // Filtros opcionales de rol
      if (filtros.rol === 'alumno') params.append('personaTipo', 'alumno');
      if (filtros.rol === 'personal') params.append('personaTipo', 'personal');

      const response = await client.get(`/excusas?${params.toString()}`);
      const excusasData = response.data.excusas || [];
      setExcusas(excusasData);
      calcularEstadisticas(excusasData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar justificaciones');
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (excusasData) => {
    const hoy = new Date();
    const hace7Dias = new Date();
    hace7Dias.setDate(hoy.getDate() - 7);
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    const stats = {
      ausentesHoy: excusasData.filter(e => {
        const fecha = new Date(e.fecha_ausencia);
        return fecha.toDateString() === hoy.toDateString();
      }).length,
      ausentesSemana: excusasData.filter(e => {
        const fecha = new Date(e.fecha_ausencia);
        return fecha >= hace7Dias;
      }).length,
      ausentesMes: excusasData.filter(e => {
        const fecha = new Date(e.fecha_ausencia);
        return fecha >= inicioMes;
      }).length,
      pendientes: excusasData.filter(e => e.estado === 'pendiente').length,
      rechazadas: excusasData.filter(e => e.estado === 'rechazada').length
    };
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
        // personalizada o pendientes, no cambiamos fechas aqui
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon="📋" label="Ausentes Hoy" value={stats.ausentesHoy} color="blue" />
        <StatCard icon="📅" label="Semana" value={stats.ausentesSemana} color="blue" />
        <StatCard icon="📆" label="Mes" value={stats.ausentesMes} color="teal" />
        <StatCard icon="⏳" label="Pendientes" value={stats.pendientes} color="orange" />
        <StatCard icon="✗" label="Rechazadas" value={stats.rechazadas} color="red" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex gap-2">
            {[
              { id: 'hoy', label: 'Hoy' },
              { id: 'semana', label: 'Semana' },
              { id: 'mes', label: 'Mes' }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => handleRangoRapido(r.id)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filtros.rangoRapido === r.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={handleExportarPDF} className="btn-export">
              <FileDown size={16} /> PDF
            </button>
            <button onClick={handleExportarExcel} className="btn-export">
              <FileSpreadsheet size={16} /> Excel
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Calendar size={20} className="text-blue-600" />
            <span className="font-medium text-sm">
               {filtros.fechaInicio} — {filtros.fechaFin}
            </span>
          </div>
          <button
            onClick={() => {
              setFiltros({
                busqueda: '', estado: '', rol: '', fechaInicio: '', fechaFin: '', rangoRapido: ''
              });
              handleRangoRapido('hoy'); // Reset a hoy
            }}
            className="text-sm text-blue-600 hover:underline"
          >
            Restablecer Filtros
          </button>
          <button
             onClick={cargarDatos}
             className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Search size={16} /> Actualizar
          </button>
        </div>
      </div>

      {/* Filtros Avanzados */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition"
        >
          <span className="font-medium flex items-center gap-2">
            <Filter size={18} /> Filtros Avanzados
          </span>
          {mostrarFiltrosAvanzados ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {mostrarFiltrosAvanzados && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-gray-200">
            <input
              type="text"
              placeholder="Buscar por nombre/carnet..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
              className="input-field"
            />
            <select
              value={filtros.rol}
              onChange={(e) => setFiltros({ ...filtros, rol: e.target.value })}
              className="input-field"
            >
              <option value="">Todos los Roles</option>
              <option value="alumno">Alumnos</option>
              <option value="personal">Personal</option>
            </select>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
              className="input-field"
            >
              <option value="">Todos los Estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobada">Aprobadas</option>
              <option value="rechazada">Rechazadas</option>
            </select>
            <div className="flex gap-2">
                <input 
                  type="date" 
                  value={filtros.fechaInicio}
                  onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value, rangoRapido: 'custom'})}
                  className="input-field"
                />
            </div>
          </div>
        )}
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="loader" /></div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Persona</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Carnet</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Jornada</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Rol</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Motivo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Estado</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
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
     blue: 'border-l-blue-500 bg-blue-50',
     teal: 'border-l-teal-500 bg-teal-50',
     orange: 'border-l-orange-500 bg-orange-50',
     red: 'border-l-red-500 bg-red-50'
  };
  return (
    <div className={`p-4 rounded-xl shadow-sm border-l-4 ${colors[color] || 'bg-white'}`}>
       <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <span className="text-2xl">{icon}</span>
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
    <tr className="hover:bg-gray-50 border-b last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {fotoUrl ? (
                <img src={fotoUrl} onError={() => setImgError(true)} className="w-full h-full object-cover"/>
              ) : (
                <span className="text-xl">{esAlumno ? '👨‍🎓' : '👨‍🏫'}</span>
              )}
           </div>
           <div>
              <p className="font-medium text-gray-900">{persona?.nombres} {persona?.apellidos}</p>
              <p className="text-xs text-gray-500">
                 {esAlumno 
                   ? `${persona?.grado || ''} ${persona?.seccion || ''}` 
                   : persona?.cargo || 'Docente'}
              </p>
           </div>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
         <span className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded" style={{fontFamily: '"Hack Nerd Font Mono", monospace'}}>
            {persona?.carnet || 'N/A'}
         </span>
      </td>
      <td className="px-4 py-3 text-center">
         <span className={`px-2 py-1 rounded text-xs font-semibold
            ${persona?.jornada === 'Matutina' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}
         `}>
            {persona?.jornada || 'N/A'}
         </span>
      </td>
      <td className="px-4 py-3 text-center">
         <span className={`px-2 py-1 rounded-full text-xs 
            ${esAlumno ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
            {esAlumno ? 'Alumno' : 'Personal'}
         </span>
      </td>
      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate" title={excusa.motivo}>
         {excusa.motivo}
      </td>
      <td className="px-4 py-3 text-center">
         <span className={`px-2 py-1 rounded-full text-xs font-bold
            ${excusa.estado === 'aprobada' ? 'bg-green-100 text-green-800' : 
              excusa.estado === 'rechazada' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}
         `}>
            {excusa.estado.charAt(0).toUpperCase() + excusa.estado.slice(1)}
         </span>
      </td>
      <td className="px-4 py-3">
         <div className="flex justify-center gap-2">
            {excusa.estado === 'pendiente' && (
              <>
                <button onClick={() => onAprobar(excusa.id)} className="p-1 text-green-600 hover:bg-green-100 rounded">
                  <Check size={18} />
                </button>
                <button onClick={() => onRechazar(excusa)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                  <X size={18} />
                </button>
              </>
            )}
            <button onClick={() => onVerDetalles(excusa)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
               <Eye size={18} />
            </button>
         </div>
      </td>
    </tr>
  );
}

function ModalDetalles({ persona, excusa, onClose, formatFecha, baseUrl }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
         <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h3 className="text-xl font-bold">Detalles de Justificación</h3>
            <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-gray-600"/></button>
         </div>

         <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
               {persona.foto_path ? (
                 <img src={persona.foto_path.startsWith('http') ? persona.foto_path : `http://localhost:5000/uploads/${persona.foto_path}`} className="w-full h-full object-cover"/>
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
               )}
            </div>
            <div>
               <h4 className="text-lg font-bold">{persona.nombres} {persona.apellidos}</h4>
               <p className="text-gray-600">{persona.grado || persona.cargo}</p>
               <p className="text-sm font-mono mt-1">Carnet: {persona.carnet}</p>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
               <label className="text-sm font-bold text-gray-500">Fecha Ausencia</label>
               <p className="text-lg">{formatFecha(excusa.fecha_ausencia)}</p>
            </div>
            <div>
               <label className="text-sm font-bold text-gray-500">Estado</label>
               <div>
                 <span className={`px-3 py-1 rounded-full text-sm font-bold
                    ${excusa.estado === 'aprobada' ? 'bg-green-100 text-green-800' : 
                      excusa.estado === 'rechazada' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}
                 `}>
                    {excusa.estado.toUpperCase()}
                 </span>
               </div>
            </div>
         </div>

         <div className="mb-6">
            <label className="text-sm font-bold text-gray-500">Motivo</label>
            <p className="bg-gray-50 p-3 rounded-lg mt-1 border">{excusa.motivo}</p>
         </div>
         
         {excusa.descripcion && (
            <div className="mb-6">
               <label className="text-sm font-bold text-gray-500">Descripción</label>
               <p className="text-gray-700 mt-1">{excusa.descripcion}</p>
            </div>
         )}

         {excusa.archivo_path && (
            <div className="mb-6">
               <label className="text-sm font-bold text-gray-500">Evidencia Adjunta</label>
               <a 
                 href={`http://localhost:5000/uploads/${excusa.archivo_path}`} 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex items-center gap-2 text-blue-600 hover:underline mt-1"
               >
                 <FileText size={16}/> Ver Documento
               </a>
            </div>
         )}

         <div className="flex justify-end pt-4 border-t">
            <button onClick={onClose} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">Cerrar</button>
         </div>
      </div>
    </div>
  );
}

// Estilos adicionales para inputs
const inputStyle = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700";
