import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { excusasAPI, alumnosAPI, docentesAPI } from '../api/endpoints';
import { FileText, Plus, Check, X, Eye, Calendar, User, Filter } from 'lucide-react';
import RevisionRapidaView from './RevisionRapidaView';
import './JustificacionesPanel.css';

const ExcusasPanel = () => {
  const [excusas, setExcusas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    personaTipo: '',
    estado: '',
    fechaInicio: '',
    fechaFin: '',
    busqueda: ''
  });
  
  const [modalCrear, setModalCrear] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [modalAccion, setModalAccion] = useState(null); // { tipo: 'aprobar'|'rechazar', excusa }
  
  const [alumnos, setAlumnos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  
  // Estados para modo revisión rápida
  const [modoRevision, setModoRevision] = useState(false);
  const [ausentesRevision, setAusentesRevision] = useState([]);
  const [fechaRevision, setFechaRevision] = useState(null);
  
  const [formData, setFormData] = useState({
    persona_tipo: 'alumno',
    alumno_id: '',
    personal_id: '',
    fecha_ausencia: '',
    motivo: '',
    descripcion: '',
    documento_url: ''
  });

  // Detectar modo de revisión desde URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('modo') === 'revision') {
      const ausentes = JSON.parse(sessionStorage.getItem('ausentes_revision') || '[]');
      const fecha = sessionStorage.getItem('fecha_revision') || new Date().toISOString();
      
      if (ausentes.length > 0) {
        setModoRevision(true);
        setAusentesRevision(ausentes);
        setFechaRevision(fecha);
      }
    }
  }, []);

  // Cargar listas de personas solo al montar
  useEffect(() => {
    cargarPersonas();
  }, []);

  // Cargar excusas con debouncing para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      cargarExcusas();
    }, filtros.busqueda ? 500 : 0); // Esperar 500ms si hay texto, si no cargar inmediato

    return () => clearTimeout(timer);
  }, [filtros.personaTipo, filtros.estado, filtros.fechaInicio, filtros.fechaFin, filtros.busqueda]);

  const cargarExcusas = async () => {
    try {
      setLoading(true);
      const response = await excusasAPI.list(filtros);
      setExcusas(response.data.excusas || response.data);
    } catch (error) {
      console.error('Error cargando excusas:', error);
      alert('Error al cargar excusas');
    } finally {
      setLoading(false);
    }
  };

  const cargarPersonas = async () => {
    try {
      const [alumnosRes, docentesRes] = await Promise.all([
        alumnosAPI.list(),
        docentesAPI.list()
      ]);
      setAlumnos(alumnosRes.data.alumnos || alumnosRes.data);
      setDocentes(docentesRes.data.docentes || docentesRes.data);
    } catch (error) {
      console.error('Error cargando personas:', error);
    }
  };



  const handleAprobar = async (excusa) => {
    if (!window.confirm(`¿Aprobar excusa de ${getNombrePersona(excusa)}?`)) {
      return;
    }

    try {
      await excusasAPI.update(excusa.id, { estado: 'aprobada' });
      alert('Excusa aprobada');
      cargarExcusas();
    } catch (error) {
      console.error('Error aprobando excusa:', error);
      alert('Error al aprobar excusa');
    }
  };

  const handleRechazar = async (excusa, observaciones) => {
    try {
      await excusasAPI.update(excusa.id, { 
        estado: 'rechazada',
        observaciones 
      });
      alert('Excusa rechazada');
      setModalAccion(null);
      cargarExcusas();
    } catch (error) {
      console.error('Error rechazando excusa:', error);
      alert('Error al rechazar excusa');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta excusa?')) {
      return;
    }

    try {
      await excusasAPI.delete(id);
      alert('Excusa eliminada');
      cargarExcusas();
    } catch (error) {
      console.error('Error eliminando excusa:', error);
      alert('Error al eliminar excusa');
    }
  };

  const getNombrePersona = (excusa) => {
    if (excusa.alumno) {
      return `${excusa.alumno.nombres} ${excusa.alumno.apellidos}`;
    } else if (excusa.personal) {
      return `${excusa.personal.nombres} ${excusa.personal.apellidos}`;
    }
    return 'N/A';
  };

  const resetForm = () => {
    setFormData({
      persona_tipo: 'alumno',
      alumno_id: '',
      personal_id: '',
      fecha_ausencia: '',
      motivo: '',
      descripcion: '',
      documento_url: '',
      archivo: null
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, archivo: e.target.files[0] });
    }
  };

  const handleCrearExcusa = async (e) => {
    e.preventDefault();
    
    if (!formData.fecha_ausencia || !formData.motivo) {
      alert('Fecha y motivo son obligatorios');
      return;
    }

    if (formData.persona_tipo === 'alumno' && !formData.alumno_id) {
      alert('Selecciona un alumno');
      return;
    }

    if (formData.persona_tipo === 'personal' && !formData.personal_id) {
      alert('Selecciona un miembro del personal');
      return;
    }

    const data = new FormData();
    data.append('persona_tipo', formData.persona_tipo);
    data.append('motivo', formData.motivo);
    data.append('fecha_ausencia', formData.fecha_ausencia);
    if (formData.alumno_id) data.append('alumno_id', formData.alumno_id);
    if (formData.personal_id) data.append('personal_id', formData.personal_id);
    if (formData.descripcion) data.append('descripcion', formData.descripcion);
    if (formData.archivo) data.append('archivo', formData.archivo);

    try {
      await excusasAPI.create(data);
      alert('Justificación registrada exitosamente');
      setModalCrear(false);
      resetForm();
      cargarExcusas();
    } catch (error) {
      console.error('Error creando justificación:', error);
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoBadgeClass = (estado) => {
    switch (estado) {
      case 'aprobada': return 'badge-success';
      case 'rechazada': return 'badge-danger';
      case 'pendiente': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  const handleQuickRange = (range) => {
    const today = new Date();
    // Ajustar a la zona horaria local para evitar saltos de día por UTC
    const offset = today.getTimezoneOffset() * 60000;
    const localToday = new Date(today - offset);
    const todayStr = localToday.toISOString().split('T')[0];

    switch (range) {
      case 'Hoy':
        setFiltros({ ...filtros, fechaInicio: todayStr, fechaFin: todayStr });
        break;
      case 'Últimos 7 días':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        const localSevenDays = new Date(sevenDaysAgo - offset);
        setFiltros({ ...filtros, fechaInicio: localSevenDays.toISOString().split('T')[0], fechaFin: todayStr });
        break;
      case 'Este mes':
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const localFirstDay = new Date(firstDayOfMonth - offset);
        setFiltros({ ...filtros, fechaInicio: localFirstDay.toISOString().split('T')[0], fechaFin: todayStr });
        break;
      case 'Pendientes':
        setFiltros({ ...filtros, estado: 'pendiente' });
        break;
      default:
        break;
    }
  };

  const handleVolverAAsistencias = () => {
    // Limpiar sessionStorage
    sessionStorage.removeItem('ausentes_revision');
    sessionStorage.removeItem('fecha_revision');
    
    // Redirigir a asistencias
    window.location.hash = '#/asistencias';
  };

  // Si está en modo revisión, mostrar vista especial
  if (modoRevision) {
    return (
      <RevisionRapidaView
        ausentesIniciales={ausentesRevision}
        fecha={fechaRevision}
        onVolver={handleVolverAAsistencias}
      />
    );
  }

  // Vista tradicional de gestión de excusas
  return (
    <div className="excusas-panel">
      {/* Header */}
      <div className="panel-header">
        <div className="header-left">
          <FileText size={32} />
          <div>
            <h2>Gestión de Excusas</h2>
            <p>Administra las justificaciones de ausencias</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setModalCrear(true)}>
          <Plus size={20} />
          Nueva Excusa
        </button>
      </div>

      {/* --- BLOQUE PRINCIPAL: FILTROS Y BÚSQUEDA --- */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-100 dark:border-gray-700">
        
        {/* Encabezado del bloque */}
        <div className="flex items-center gap-2 mb-6">
          <Filter className="text-blue-600" size={20} />
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Filtros de Búsqueda</h3>
        </div>

        {/* 1. RANGOS RÁPIDOS */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Rangos Rápidos</p>
          <div className="flex flex-wrap gap-2">
            {['Hoy', 'Últimos 7 días', 'Este mes', 'Pendientes'].map((rango) => (
              <button 
                key={rango}
                type="button"
                onClick={() => handleQuickRange(rango)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
                  (rango === 'Pendientes' && filtros.estado === 'pendiente')
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-gray-300 hover:text-blue-600 border-gray-200 dark:border-gray-600 hover:border-blue-200'
                }`}
              >
                {rango}
              </button>
            ))}
          </div>
        </div>

        {/* 2. GRID DE INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          
          {/* Input: Buscar Alumno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar Persona</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Nombre o Carnet..." 
                value={filtros.busqueda}
                onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              />
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Input: Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
            <select 
              value={filtros.estado}
              onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
              className="w-full py-2.5 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600 dark:text-gray-300"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">⏳ Pendiente</option>
              <option value="aprobada">✅ Aprobada</option>
              <option value="rechazada">❌ Rechazada</option>
            </select>
          </div>

          {/* Input: Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Desde</label>
            <input 
              type="date" 
              value={filtros.fechaInicio}
              onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
              className="w-full py-2.5 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600 dark:text-gray-300"
            />
          </div>

           {/* Input: Fecha Fin */}
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hasta</label>
            <input 
              type="date" 
              value={filtros.fechaFin}
              onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
              className="w-full py-2.5 px-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600 dark:text-gray-300"
            />
          </div>

        </div>

        {/* 3. BOTONES DE ACCIÓN */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            type="button"
            onClick={() => setFiltros({ personaTipo: '', estado: '', fechaInicio: '', fechaFin: '', busqueda: '' })}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium px-4 py-2 transition"
          >
            Limpiar Filtros
          </button>
          <button 
            type="button"
            onClick={() => cargarExcusas()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <Filter size={18} />
            Filtrar Resultados
          </button>
        </div>

      </div>

      {/* Tabla de Excusas */}
      {loading ? (
        <div className="loading">Cargando excusas...</div>
      ) : excusas.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} />
          <p>No hay excusas registradas</p>
          <button className="btn-primary" onClick={() => setModalCrear(true)}>
            Crear Primera Excusa
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="excusas-table">
            <thead>
              <tr>
                <th>Fecha Ausencia</th>
                <th>Persona</th>
                <th>Tipo</th>
                <th>Motivo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {excusas.map((excusa) => (
                <tr key={excusa.id}>
                  <td>{formatFecha(excusa.fecha_ausencia)}</td>
                  <td>
                    <div className="persona-info">
                      <User size={16} />
                      {getNombrePersona(excusa)}
                    </div>
                  </td>
                  <td>
                    <span className={`tipo-badge ${excusa.persona_tipo}`}>
                      {excusa.persona_tipo}
                    </span>
                  </td>
                  <td className="motivo-cell">{excusa.motivo}</td>
                  <td>
                    <span className={`badge ${getEstadoBadgeClass(excusa.estado)}`}>
                      {excusa.estado}
                    </span>
                  </td>
                  <td>
                    <div className="acciones">
                      <button 
                        className="btn-icon"
                        onClick={() => setModalDetalle(excusa)}
                        title="Ver detalles"
                      >
                        <Eye size={18} />
                      </button>
                      
                      {excusa.estado === 'pendiente' && (
                        <>
                          <button 
                            className="btn-icon btn-success"
                            onClick={() => handleAprobar(excusa)}
                            title="Aprobar"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            className="btn-icon btn-danger"
                            onClick={() => setModalAccion({ tipo: 'rechazar', excusa })}
                            title="Rechazar"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      
                      <button 
                        className="btn-icon btn-danger"
                        onClick={() => handleEliminar(excusa.id)}
                        title="Eliminar"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Crear Excusa */}
      {modalCrear && createPortal(
        <div className="modal-overlay" onClick={() => setModalCrear(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nueva Excusa</h3>
              <button onClick={() => setModalCrear(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleCrearExcusa}>
              <div className="form-group">
                <label>Tipo de Persona *</label>
                <select 
                  value={formData.persona_tipo}
                  onChange={(e) => setFormData({ ...formData, persona_tipo: e.target.value, alumno_id: '', personal_id: '' })}
                  required
                >
                  <option value="alumno">Alumno</option>
                  <option value="personal">Personal</option>
                </select>
              </div>

              {formData.persona_tipo === 'alumno' ? (
                <div className="form-group">
                  <label>Alumno *</label>
                  <select 
                    value={formData.alumno_id}
                    onChange={(e) => setFormData({ ...formData, alumno_id: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar alumno...</option>
                    {alumnos.map(alumno => (
                      <option key={alumno.id} value={alumno.id}>
                        {alumno.nombres} {alumno.apellidos} - {alumno.carnet}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label>Personal *</label>
                  <select 
                    value={formData.personal_id}
                    onChange={(e) => setFormData({ ...formData, personal_id: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar personal...</option>
                    {docentes.map(docente => (
                      <option key={docente.id} value={docente.id}>
                        {docente.nombres} {docente.apellidos} - {docente.cargo}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Fecha de Ausencia *</label>
                <input 
                  type="date"
                  value={formData.fecha_ausencia}
                  onChange={(e) => setFormData({ ...formData, fecha_ausencia: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Motivo *</label>
                <select 
                  value={formData.motivo}
                  onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                  required
                >
                  <option value="">Seleccionar motivo...</option>
                  <option value="Enfermedad">Enfermedad</option>
                  <option value="Cita médica">Cita médica</option>
                  <option value="Asunto familiar">Asunto familiar</option>
                  <option value="Emergencia">Emergencia</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea 
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Detalles adicionales..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Evidencia (PDF o Imagen)</label>
                <input 
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <small>Opcional. Máx 5MB.</small>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setModalCrear(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Excusa
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Detalle */}
      {modalDetalle && createPortal(
        <div className="modal-overlay" onClick={() => setModalDetalle(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detalles de la Excusa</h3>
              <button onClick={() => setModalDetalle(null)}>&times;</button>
            </div>
            
            <div className="detalle-content">
              <div className="detalle-row">
                <strong>Persona:</strong>
                <span>{getNombrePersona(modalDetalle)}</span>
              </div>
              <div className="detalle-row">
                <strong>Tipo:</strong>
                <span className={`tipo-badge ${modalDetalle.persona_tipo}`}>
                  {modalDetalle.persona_tipo}
                </span>
              </div>
              <div className="detalle-row">
                <strong>Fecha de Ausencia:</strong>
                <span>{formatFecha(modalDetalle.fecha_ausencia)}</span>
              </div>
              <div className="detalle-row">
                <strong>Motivo:</strong>
                <span>{modalDetalle.motivo}</span>
              </div>
              <div className="detalle-row">
                <strong>Estado:</strong>
                <span className={`badge ${getEstadoBadgeClass(modalDetalle.estado)}`}>
                  {modalDetalle.estado}
                </span>
              </div>
              {modalDetalle.descripcion && (
                <div className="detalle-row">
                  <strong>Descripción:</strong>
                  <p>{modalDetalle.descripcion}</p>
                </div>
              )}
              {modalDetalle.documento_url && (
                <div className="detalle-row">
                  <strong>Documento:</strong>
                  <a href={modalDetalle.documento_url} target="_blank" rel="noopener noreferrer">
                    Ver documento
                  </a>
                </div>
              )}
              {modalDetalle.observaciones && (
                <div className="detalle-row">
                  <strong>Observaciones:</strong>
                  <p>{modalDetalle.observaciones}</p>
                </div>
              )}
              <div className="detalle-row">
                <strong>Creada:</strong>
                <span>{formatFecha(modalDetalle.creado_en)}</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setModalDetalle(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Rechazar */}
      {modalAccion && modalAccion.tipo === 'rechazar' && createPortal(
        <div className="modal-overlay" onClick={() => setModalAccion(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Rechazar Excusa</h3>
              <button onClick={() => setModalAccion(null)}>&times;</button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const observaciones = e.target.observaciones.value;
              handleRechazar(modalAccion.excusa, observaciones);
            }}>
              <div className="form-group">
                <label>Motivo del Rechazo</label>
                <textarea 
                  name="observaciones"
                  placeholder="Explica por qué se rechaza esta excusa..."
                  rows="4"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setModalAccion(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-danger">
                  Rechazar Excusa
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ExcusasPanel;
