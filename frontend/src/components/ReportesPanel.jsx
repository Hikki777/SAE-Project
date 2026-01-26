import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Filter, FileSpreadsheet, Users, TrendingUp, Clock, Award, CreditCard, User, Search, Loader, FileCheck, Construction } from 'lucide-react';
import client from '../api/client';
import { exportAttendancePDF } from '../utils/exportPdf';
import { exportAttendanceExcel } from '../utils/exportExcel';
import { generateJustificacionesPDF, generateJustificacionesExcel } from '../utils/reportGenerator';
import { documentosAPI } from '../api/endpoints';
import JustificacionesPanel from './JustificacionesPanel';
import toast from 'react-hot-toast';

import { buildAttendanceReport } from '../utils/reportBuilder';

export default function ReportesPanel({ initialTab = 'asistencias' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Tab 1: Asistencias
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    personaTipo: '',
    grado: '',
    tipoEvento: ''
  });
  const [generando, setGenerando] = useState(false);
  const [grados, setGrados] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Tab 2: Documentos
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('constancia');
  const [generandoDoc, setGenerandoDoc] = useState(false);

  // Tab 3: Carnets
  const [personal, setPersonal] = useState([]);
  const [alumnoCarnet, setAlumnoCarnet] = useState('');
  const [personalCarnet, setPersonalCarnet] = useState('');
  const [generandoCarnet, setGenerandoCarnet] = useState(false);

  // EFECTO DE CARGA INICIAL
  useEffect(() => {
    fetchAlumnos();
    fetchPersonal();
    
    // Configurar fechas por defecto (Hoy)
    const hoy = new Date();
    // const haceUnMes = new Date(); // Legacy
    // haceUnMes.setMonth(haceUnMes.getMonth() - 1);
    
    const getLocalISOString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const fechaHoyLocal = getLocalISOString(hoy);
    
    setFiltros(prev => ({
      ...prev,
      fechaInicio: fechaHoyLocal,
      fechaFin: fechaHoyLocal
    }));
  }, []);

  // EFECTO: Actualizar vista previa cuando cambien los filtros
  useEffect(() => {
     const timer = setTimeout(() => {
         if (activeTab === 'asistencias' && filtros.fechaInicio && filtros.fechaFin) {
             handlePreview();
         }
     }, 600);
     return () => clearTimeout(timer);
  }, [filtros, activeTab]);

  const handlePreview = async () => {
      setIsLoadingPreview(true);
      try {
        const filtrosLimpios = Object.fromEntries(
            Object.entries(filtros).filter(([, v]) => v !== '')
        );
        // Usamos el endpoint /pdf existente para evitar problemas si el backend no se reinició
        // Este endpoint devuelve el mismo JSON que necesitamos
        const response = await client.post('/reportes/pdf', filtrosLimpios);
        
        // Usar el builder para consistencia con PDF/Excel
        const reportStruct = buildAttendanceReport(response.data);
        setPreviewData(reportStruct);
      } catch (error) {
          console.error("Error fetching preview", error);
          toast.error("Error cargando vista previa");
      } finally {
          setIsLoadingPreview(false);
      }
  };

  const fetchAlumnos = async () => {
    try {
      const response = await client.get('/alumnos');
      const alumnosData = response.data.alumnos || [];
      setAlumnos(alumnosData);
      const gradosUnicos = [...new Set(alumnosData.map(a => a.grado))].filter(Boolean);
      setGrados(gradosUnicos);
    } catch (error) {
      console.error('Error fetching alumnos:', error);
    }
  };

  const fetchPersonal = async () => {
    try {
      const response = await client.get('/docentes');
      setPersonal(response.data.personal || response.data.docentes || []);
    } catch (error) {
      console.error('Error fetching personal:', error);
    }
  };

  const handleGenerarReporte = async (formato) => {
    setGenerando(true);
    try {
      const filtrosLimpios = Object.fromEntries(
        Object.entries(filtros).filter(([, v]) => v !== '')
      );
      
      const response = await client.post(
        `/reportes/${formato}`,
        filtrosLimpios
      );
      
      const data = response.data;
      
      if (formato === 'pdf') {
        await exportAttendancePDF(data);
      } else {
        await exportAttendanceExcel(data);
      }
      
      toast.success('Reporte generado exitosamente');
    } catch (error) {
      console.error('Error generando reporte:', error);
      toast.error(`Error al generar el reporte: ${error.response?.data?.error || error.message}`);
    } finally {
      setGenerando(false);
    }
  };

  const limpiarFiltros = () => {
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);
    
    const getLocalISOString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    setFiltros({
      fechaInicio: getLocalISOString(haceUnMes),
      fechaFin: getLocalISOString(hoy),
      personaTipo: '',
      grado: '',
      tipoEvento: ''
    });
  };

  const establecerRangoRapido = (dias) => {
    const hoy = new Date();
    const getLocalISOString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (dias === 0) {
        const hoyStr = getLocalISOString(hoy);
        setFiltros(prev => ({ ...prev, fechaInicio: hoyStr, fechaFin: hoyStr }));
        return;
    }

    const inicio = new Date();
    inicio.setDate(inicio.getDate() - dias);
    setFiltros(prev => ({
      ...prev,
      fechaInicio: getLocalISOString(inicio),
      fechaFin: getLocalISOString(hoy)
    }));
  };

  // Handlers Tab 2 & 3 simplified for brevity as logic is unchanged
  const handleGenerarDocumento = async () => {
    if (!alumnoSeleccionado) { toast.error('Selecciona un estudiante'); return; }
    setGenerandoDoc(true);
    try {
      let response;
      if (tipoDocumento === 'constancia') {
        response = await documentosAPI.generarConstanciaInscripcion(alumnoSeleccionado);
      } else if (tipoDocumento === 'carta') {
        response = await documentosAPI.generarCartaConducta(alumnoSeleccionado);
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${tipoDocumento}_${alumnoSeleccionado}_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Documento generado exitosamente');
    } catch (error) {
      console.error('Error generando documento:', error);
      toast.error('Error al generar el documento');
    } finally {
      setGenerandoDoc(false);
    }
  };

  const handleGenerarCarnetAlumno = async () => {
    if (!alumnoCarnet) { toast.error('Selecciona un estudiante'); return; }
    setGenerandoCarnet(true);
    try {
      const response = await documentosAPI.generarCarnetAlumno(alumnoCarnet);
      const link = document.createElement('a');
      link.href = `${import.meta.env.VITE_API_URL}${response.data.data.url}`;
      link.setAttribute('download', response.data.data.filename);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Carnet generado exitosamente');
    } catch (error) {
      console.error('Error generando carnet:', error);
      toast.error('Error al generar el carnet');
    } finally {
      setGenerandoCarnet(false);
    }
  };

  const handleGenerarCarnetPersonal = async () => {
    if (!personalCarnet) { toast.error('Selecciona un miembro del personal'); return; }
    setGenerandoCarnet(true);
    try {
      const response = await documentosAPI.generarCarnetPersonal(personalCarnet);
      const link = document.createElement('a');
      link.href = `${import.meta.env.VITE_API_URL}${response.data.data.url}`;
      link.setAttribute('download', response.data.data.filename);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Carnet generado exitosamente');
    } catch (error) {
      console.error('Error generando carnet:', error);
      toast.error('Error al generar el carnet');
    } finally {
      setGenerandoCarnet(false);
    }
  };

  const tabs = [
    { id: 'asistencias', label: 'Reportes de Asistencia', icon: FileText },
    { id: 'justificaciones', label: 'Justificaciones', icon: FileCheck },
    { id: 'documentos', label: 'Documentos Oficiales', icon: Award },
    { id: 'carnets', label: 'Carnets', icon: CreditCard }
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Reportes y Documentos</h2>
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)?.icon, { className: "text-blue-600" })}
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {activeTab === 'asistencias' && 'Genera reportes detallados de asistencia en PDF y Excel.'}
            {activeTab === 'justificaciones' && 'Gestiona las justificaciones y excusas de alumnos y personal.'}
            {activeTab === 'documentos' && 'Genera documentos oficiales como constancias y certificados.'}
            {activeTab === 'carnets' && 'Diseña y exporta carnets institucionales listos para imprimir.'}
          </p>
        </header>

        {activeTab === 'justificaciones' && <JustificacionesPanel />}

        {/* TAB 1: ASISTENCIAS */}
        {activeTab === 'asistencias' && (
            <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="text-blue-600 w-5 h-5" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Filtros</h2>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rangos rápidos:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                      { label: 'Hoy', days: 0 },
                      { label: 'Últimos 7 días', days: 7 },
                      { label: 'Últimos 15 días', days: 15 },
                      { label: 'Último mes', days: 30 },
                      { label: 'Últimos 3 meses', days: 90 },
                  ].map((r) => (
                      <button
                        key={r.label}
                        onClick={() => establecerRangoRapido(r.days)}
                        className={`px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm transition
                            ${r.days === 0 ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-200'}`}
                      >
                        {r.label}
                      </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />Fecha Inicio
                  </label>
                  <input type="date" value={filtros.fechaInicio} onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />Fecha Fin
                  </label>
                  <input type="date" value={filtros.fechaFin} onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Users className="inline w-4 h-4 mr-1" />Tipo de Persona
                  </label>
                  <select value={filtros.personaTipo} onChange={(e) => setFiltros({ ...filtros, personaTipo: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500">
                    <option value="">Todos</option>
                    <option value="alumno">Alumnos</option>
                    <option value="docente">Personal/Docentes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <TrendingUp className="inline w-4 h-4 mr-1" />Grado
                  </label>
                  <select value={filtros.grado} onChange={(e) => setFiltros({ ...filtros, grado: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500">
                    <option value="">Todos</option>
                    {grados.map(grado => <option key={grado} value={grado}>{grado}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />Tipo de Evento
                  </label>
                  <select value={filtros.tipoEvento} onChange={(e) => setFiltros({ ...filtros, tipoEvento: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500">
                    <option value="">Todos</option>
                    <option value="entrada">Entradas</option>
                    <option value="salida">Salidas</option>
                    <option value="ausente">Solo Ausentes</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <button onClick={handlePreview} className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition" title="Actualizar Vista Previa">
                    <Search className="w-5 h-5" />
                  </button>
                  <button onClick={limpiarFiltros} className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition">
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                <Download className="inline w-5 h-5 mr-2" />Generar Reporte
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => handleGenerarReporte('pdf')} disabled={generando}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition ${generando ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:scale-105'}`}>
                  <FileText className="w-6 h-6" />
                  <div className="text-left"><div className="font-semibold text-lg">Descargar PDF</div><div className="text-sm opacity-90">Formato profesional para impresión</div></div>
                </button>
                <button onClick={() => handleGenerarReporte('excel')} disabled={generando}
                  className={`flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition ${generando ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:scale-105'}`}>
                  <FileSpreadsheet className="w-6 h-6" />
                  <div className="text-left"><div className="font-semibold text-lg">Descargar Excel</div><div className="text-sm opacity-90">Para análisis y edición de datos</div></div>
                </button>
              </div>
              {generando && (
                <div className="mt-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Generando reporte, por favor espera...</p>
                </div>
              )}
            </div>

            {/* VISTA PREVIA */}
            {isLoadingPreview ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6 flex justify-center py-12">
                   <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : previewData && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6 overflow-hidden">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-green-600" />
                        Vista Previa
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            ({previewData.filas.length} registros encontrados)
                        </span>
                    </h2>
                    <div className="overflow-x-auto max-h-[400px]">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300 sticky top-0">
                                <tr>
                                    <th className="px-4 py-3">Fecha</th>
                                    <th className="px-4 py-3">Hora</th>
                                    <th className="px-4 py-3">Carnet</th>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Tipo</th>
                                    <th className="px-4 py-3">Sección</th>
                                    <th className="px-4 py-3">Evento</th>
                                    <th className="px-4 py-3">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.filas.length > 0 ? previewData.filas.map((fila, idx) => (
                                    <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="px-4 py-3">{fila.fecha}</td>
                                        <td className="px-4 py-3">{fila.hora}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{fila.carnet}</td>
                                        <td className="px-4 py-3">{fila.nombre}</td>
                                        <td className="px-4 py-3 flex flex-col"><span>{fila.tipo}</span><span className="text-xs text-gray-400">{fila.grado}</span></td>
                                        <td className="px-4 py-3">{fila.seccion}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${fila.evento === 'Entrada' ? 'bg-green-100 text-green-800' : fila.evento === 'Salida' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {fila.evento}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`font-bold ${fila.estado === 'Tarde' ? 'text-red-600' : fila.estado === 'Ausente' ? 'text-red-500 bg-red-50 px-2 py-0.5 rounded' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {fila.estado}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-500">No se encontraron registros con los filtros seleccionados.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            </div>
        )}

        {/* Placeholders for tabs 3 & 4 */}
        {(activeTab === 'documentos' || activeTab === 'carnets') && (
          <div className="flex flex-col items-center justify-center h-[400px] text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
             <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full mb-6">
               <Construction className="w-16 h-16 text-blue-600 dark:text-blue-400" />
             </div>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Próximamente, función en desarrollo</h3>
             <p className="text-gray-500 dark:text-gray-400 max-w-md text-lg">Esta funcionalidad estará disponible en futuras actualizaciones.</p>
          </div>
        )}
      </div>
    </div>
  );
}
