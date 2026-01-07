import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Filter, FileSpreadsheet, Users, TrendingUp, Clock, Award, CreditCard, User, Search, Loader, FileCheck } from 'lucide-react';
import client from '../api/client';
import { generatePDF, generateExcel } from '../utils/reportGenerator';
import { documentosAPI } from '../api/endpoints';
import JustificacionesPanel from './JustificacionesPanel';
import toast from 'react-hot-toast';

export default function ReportesPanel({ initialTab = 'asistencias' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Tab 1: Asistencias (existing)
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    personaTipo: '',
    grado: '',
    tipoEvento: ''
  });
  const [generando, setGenerando] = useState(false);
  const [grados, setGrados] = useState([]);

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

  useEffect(() => {
    fetchAlumnos();
    fetchPersonal();
    
    // Establecer fechas por defecto (último mes)
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);
    
    setFiltros(prev => ({
      ...prev,
      fechaInicio: haceUnMes.toISOString().split('T')[0],
      fechaFin: hoy.toISOString().split('T')[0]
    }));
  }, []);

  const fetchAlumnos = async () => {
    try {
      const response = await client.get('/alumnos');
      const alumnosData = response.data.alumnos || [];
      setAlumnos(alumnosData);
      
      // Extraer grados únicos
      const gradosUnicos = [...new Set(alumnosData.map(a => a.grado))].filter(Boolean);
      setGrados(gradosUnicos);
    } catch (error) {
      console.error('Error fetching alumnos:', error);
    }
  };

  const fetchPersonal = async () => {
    try {
      const response = await client.get('/personal');
      setPersonal(response.data.personal || []);
    } catch (error) {
      console.error('Error fetching personal:', error);
    }
  };

  // Tab 1 handlers
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
        await generatePDF(data);
      } else {
        await generateExcel(data);
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
    
    setFiltros({
      fechaInicio: haceUnMes.toISOString().split('T')[0],
      fechaFin: hoy.toISOString().split('T')[0],
      personaTipo: '',
      grado: '',
      tipoEvento: ''
    });
  };

  const establecerRangoRapido = (dias) => {
    const hoy = new Date();
    const inicio = new Date();
    inicio.setDate(inicio.getDate() - dias);
    
    setFiltros(prev => ({
      ...prev,
      fechaInicio: inicio.toISOString().split('T')[0],
      fechaFin: hoy.toISOString().split('T')[0]
    }));
  };

  // Tab 2 handlers
  const handleGenerarDocumento = async () => {
    if (!alumnoSeleccionado) {
      toast.error('Selecciona un estudiante');
      return;
    }

    setGenerandoDoc(true);
    
    try {
      let response;
      
      if (tipoDocumento === 'constancia') {
        response = await documentosAPI.generarConstanciaInscripcion(alumnoSeleccionado);
      } else if (tipoDocumento === 'carta') {
        response = await documentosAPI.generarCartaConducta(alumnoSeleccionado);
      }

      // Download blob
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

  // Tab 3 handlers
  const handleGenerarCarnetAlumno = async () => {
    if (!alumnoCarnet) {
      toast.error('Selecciona un estudiante');
      return;
    }

    setGenerandoCarnet(true);
    
    try {
      const response = await documentosAPI.generarCarnetAlumno(alumnoCarnet);
      
      // Download image
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
    if (!personalCarnet) {
      toast.error('Selecciona un miembro del personal');
      return;
    }

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

        {activeTab === 'justificaciones' && (
          <JustificacionesPanel />
        )}

        {/* TAB 1: ASISTENCIAS */}
        {activeTab === 'asistencias' && (
            <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="text-blue-600 w-5 h-5" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Filtros</h2>
              </div>

              {/* Rangos rápidos */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rangos rápidos:
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => establecerRangoRapido(7)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg text-sm transition"
                  >
                    Últimos 7 días
                  </button>
                  <button
                    onClick={() => establecerRangoRapido(15)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-lg text-sm transition"
                  >
                    Últimos 15 días
                  </button>
                  <button
                    onClick={() => establecerRangoRapido(30)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-lg text-sm transition"
                  >
                    Último mes
                  </button>
                  <button
                    onClick={() => establecerRangoRapido(90)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-lg text-sm transition"
                  >
                    Últimos 3 meses
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Fecha Inicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaInicio}
                    onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Fecha Fin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaFin}
                    onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tipo de Persona */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Users className="inline w-4 h-4 mr-1" />
                    Tipo de Persona
                  </label>
                  <select
                    value={filtros.personaTipo}
                    onChange={(e) => setFiltros({ ...filtros, personaTipo: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos</option>
                    <option value="alumno">Alumnos</option>
                    <option value="docente">Personal/Docentes</option>
                  </select>
                </div>

                {/* Grado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <TrendingUp className="inline w-4 h-4 mr-1" />
                    Grado
                  </label>
                  <select
                    value={filtros.grado}
                    onChange={(e) => setFiltros({ ...filtros, grado: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos</option>
                    {grados.map(grado => (
                      <option key={grado} value={grado}>{grado}</option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Evento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Tipo de Evento
                  </label>
                  <select
                    value={filtros.tipoEvento}
                    onChange={(e) => setFiltros({ ...filtros, tipoEvento: e.target.value })}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Todos</option>
                    <option value="entrada">Entradas</option>
                    <option value="salida">Salidas</option>
                  </select>
                </div>

                {/* Botón limpiar */}
                <div className="flex items-end">
                  <button
                    onClick={limpiarFiltros}
                    className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition"
                  >
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>

            {/* Botones de descarga */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                <Download className="inline w-5 h-5 mr-2" />
                Generar Reporte
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PDF */}
                <button
                  onClick={() => handleGenerarReporte('pdf')}
                  disabled={generando}
                  className={`
                    flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition
                    ${generando 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:scale-105'
                    }
                  `}
                >
                  <FileText className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold text-lg">Descargar PDF</div>
                    <div className="text-sm opacity-90">Formato profesional para impresión</div>
                  </div>
                </button>

                {/* Excel */}
                <button
                  onClick={() => handleGenerarReporte('excel')}
                  disabled={generando}
                  className={`
                    flex items-center justify-center gap-3 px-6 py-4 rounded-lg transition
                    ${generando 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:scale-105'
                    }
                  `}
                >
                  <FileSpreadsheet className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-semibold text-lg">Descargar Excel</div>
                    <div className="text-sm opacity-90">Para análisis y edición de datos</div>
                  </div>
                </button>
              </div>

              {generando && (
                <div className="mt-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Generando reporte, por favor espera...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTOS */}
        {activeTab === 'documentos' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="space-y-4">
                {/* Selector de Alumno */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="inline w-4 h-4 mr-1" />
                    Seleccionar Estudiante
                  </label>
                  <select
                    value={alumnoSeleccionado}
                    onChange={(e) => setAlumnoSeleccionado(e.target.value)}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Selecciona un estudiante --</option>
                    {alumnos.map(alumno => (
                      <option key={alumno.id} value={alumno.id}>
                        {alumno.nombres} {alumno.apellidos} - {alumno.carnet} ({alumno.grado})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tipo de Documento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Tipo de Documento
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => setTipoDocumento('constancia')}
                      className={`p-4 rounded-lg border-2 transition ${
                        tipoDocumento === 'constancia'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 dark:text-gray-100">📄 Constancia de Inscripción</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Certifica inscripción actual</div>
                    </button>

                    <button
                      onClick={() => setTipoDocumento('carta')}
                      className={`p-4 rounded-lg border-2 transition ${
                        tipoDocumento === 'carta'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                      }`}
                    >
                      <div className="font-semibold text-gray-900 dark:text-gray-100">📜 Carta de Buena Conducta</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Certifica comportamiento</div>
                    </button>
                  </div>
                </div>

                {/* Botón Generar */}
                <button
                  onClick={handleGenerarDocumento}
                  disabled={generandoDoc || !alumnoSeleccionado}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {generandoDoc ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      Generar Documento
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Info sobre Certificado de Estudios */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Award className="text-amber-600 dark:text-amber-400 w-5 h-5 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-900 dark:text-amber-100">Certificado de Estudios</h3>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                    Esta función estará disponible en la próxima actualización. Estamos trabajando en mejorar el formato y los datos incluidos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CARNETS */}
        {activeTab === 'carnets' && (
          <div className="space-y-6">
            {/* Carnets de Alumnos */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <CreditCard className="text-blue-600" size={24} />
                Carnets de Estudiantes
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Seleccionar Estudiante
                  </label>
                  <select
                    value={alumnoCarnet}
                    onChange={(e) => setAlumnoCarnet(e.target.value)}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Selecciona un estudiante --</option>
                    {alumnos.map(alumno => (
                      <option key={alumno.id} value={alumno.id}>
                        {alumno.nombres} {alumno.apellidos} - {alumno.carnet}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleGenerarCarnetAlumno}
                  disabled={generandoCarnet || !alumnoCarnet}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {generandoCarnet ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      Generar Carnet
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Carnets de Personal */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <CreditCard className="text-green-600" size={24} />
                Carnets de Personal
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Seleccionar Personal
                  </label>
                  <select
                    value={personalCarnet}
                    onChange={(e) => setPersonalCarnet(e.target.value)}
                    className="w-full bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">-- Selecciona un miembro del personal --</option>
                    {personal.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nombres} {p.apellidos} - {p.cargo}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleGenerarCarnetPersonal}
                  disabled={generandoCarnet || !personalCarnet}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {generandoCarnet ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      Generar Carnet
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <CreditCard className="text-blue-600 dark:text-blue-400 w-5 h-5 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-900 dark:text-blue-100">Especificaciones Técnicas</h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 mt-1 space-y-1">
                    <li>• <strong>Formato:</strong> PNG de alta calidad</li>
                    <li>• <strong>Dimensiones:</strong> 1011×638 píxeles (CR80 estándar)</li>
                    <li>• <strong>Resolución:</strong> 300 DPI</li>
                    <li>• <strong>Listo para:</strong> Impresión en PVC en centros especializados</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
