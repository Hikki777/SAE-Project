import React, { useState, useEffect } from "react";
import {
  Activity,
  Users,
  QrCode,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Wifi,
  WifiOff,
  Briefcase,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  healthAPI,
  alumnosAPI,
  asistenciasAPI,
  docentesAPI,
  institucionAPI,
  dashboardAPI,
} from "../api/endpoints";
import toast, { Toaster } from "react-hot-toast";
import offlineQueueService from "../services/offlineQueue";
import { CardSkeleton } from "./LoadingSpinner";

export default function Dashboard() {
  const [stats, setStats] = useState({
    status: "unknown",
    alumnos: 0,
    personal: 0,
    qrs: 0,
  });
  const [institucion, setInstitucion] = useState(null);
  const [asistenciasStats, setAsistenciasStats] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estado de red local y cola
  const [isNetworkOnline, setIsNetworkOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    fetchInstitucion();
    fetchStats();
    fetchAsistenciasStats();
    fetchDashboardStats();
    const interval = setInterval(() => {
      fetchStats();
      fetchAsistenciasStats();
      fetchDashboardStats();
    }, 60000); // Actualizar cada minuto
    return () => clearInterval(interval);
  }, []);

  // Monitor de red y cola offline
  useEffect(() => {
    const updateStatus = async () => {
      setIsNetworkOnline(navigator.onLine);
      const count = await offlineQueueService.getPendingCount();
      setPendingSync(count);
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    
    // Intervalo para verificar la cola
    const queueInterval = setInterval(async () => {
      const count = await offlineQueueService.getPendingCount();
      setPendingSync(count);
    }, 2000);

    // Actualizar al montar
    updateStatus();

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      clearInterval(queueInterval);
    };
  }, []);

  const fetchInstitucion = async () => {
    try {
      const response = await institucionAPI.get();
      setInstitucion(response.data);
    } catch (error) {
      console.error("Error fetching institucion:", error);
    }
  };

  const fetchAsistenciasStats = async () => {
    try {
      const response = await asistenciasAPI.stats(7);
      setAsistenciasStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching asistencias stats:", error);
      toast.error("Error al cargar estadísticas de asistencias");
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Usar qrAPI.list para contar QRs reales en BD en lugar de diagnostics
      const [health, alumnos, personalResp] = await Promise.all([
        healthAPI.check().catch(() => ({ data: { status: "error" } })),
        alumnosAPI.list().catch(() => ({ data: { total: 0, alumnos: [] } })),
        docentesAPI.list().catch(() => ({ data: { personal: [] } })),
      ]);

      const newStatus = health.data?.status === "ok" ? "online" : "offline";
      setStats({
        status: newStatus,
        alumnos: alumnos.data?.total || 0,
        personal:
          personalResp.data?.personal?.length ||
          personalResp.data?.docentes?.length ||
          0,
        qrs: 0, // Ya no contamos QRs por diagnóstico de archivos. Podríamos implementar un endpoint de conteo si fuera vital.
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Error al cargar estadísticas del sistema");
      setStats((prev) => ({ ...prev, status: "error" }));
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await dashboardAPI.stats();
      console.log('Dashboard Stats Response:', response.data);
      setDashboardStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Error al cargar estadísticas del sistema");
    }
  };

  /* eslint-disable no-unused-vars */
  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-900/50 p-6 border-l-4 border-${color}-500 hover:shadow-2xl transition-shadow duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold">{label}</p>
          <p className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400 mt-2`}>{value}</p>
        </div>
        <Icon className={`text-${color}-600 dark:text-${color}-500 opacity-40 dark:opacity-30`} size={48} />
      </div>
    </div>
  );
  /* eslint-enable no-unused-vars */

  return (
    <div className="space-y-6">
      {/* Header con nombre e información institucional */}
      {institucion && (
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden ring-1 ring-white/10">
          {/* Fondo decorativo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-overlay filter blur-3xl opacity-50 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-overlay filter blur-3xl opacity-30 -ml-20 -mb-20"></div>

          <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
            <div className="flex items-center gap-6">
              {/* Logo con efecto glass */}
              {institucion.logo_path ? (
                <div className="bg-white p-2 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300 ring-4 ring-white/10 backdrop-blur-md">
                  <img
                    src={
                      institucion.logo_path.startsWith("http")
                        ? institucion.logo_path
                        : (() => {
                            const api = localStorage.getItem('api_url') || import.meta.env.VITE_API_URL || '';
                            const base = api.startsWith('http') ? api.replace(/\/api$/, '').replace(/\/$/, '') : '';
                            return `${base}/uploads/${institucion.logo_path}?t=${Date.now()}`;
                          })()
                    }
                    alt="Logo institucional"
                    className="w-24 h-24 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      console.error("Error cargando logo");
                    }}
                  />
                </div>
              ) : (
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md ring-1 ring-white/20">
                  <Activity className="text-blue-200 w-16 h-16" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                    {institucion.nombre}
                  </h1>
                  {/* Status Badge removed from here */}
                </div>

                {/* Contact Info Acrylic */}
                {(institucion.direccion || institucion.email || institucion.telefono || institucion.pais) && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {institucion.direccion && (
                      <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm text-blue-50 font-medium hover:bg-white/20 transition-all">
                        <span className="opacity-70">📍</span> {institucion.direccion}
                      </span>
                    )}
                    {institucion.email && (
                      <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm text-blue-50 font-medium hover:bg-white/20 transition-all">
                        <span className="opacity-70">✉️</span> {institucion.email}
                      </span>
                    )}
                    {institucion.telefono && (
                      <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm text-blue-50 font-medium hover:bg-white/20 transition-all">
                        <span className="opacity-70">📞</span> {institucion.telefono}
                      </span>
                    )}
                    {institucion.pais && (
                      <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm text-blue-50 font-medium hover:bg-white/20 transition-all">
                        <span className="opacity-70">🌍</span> {institucion.pais}
                      </span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center text-sm text-blue-100/90 mt-4">
                  {/* The version stays the same */}
                  <span className="mr-3">SAE v1.5.0</span>

                  {/* --- PILL START --- */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg transition-all hover:bg-white/20">
                      {/* The green dot with pulse animation */}
                      <span className="relative flex h-2.5 w-2.5">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isNetworkOnline ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isNetworkOnline ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      </span>
                      {/* The text */}
                      <span className="font-medium text-xs text-white">
                        {isNetworkOnline ? "Sistema En Línea" : "Sin Conexión"}
                      </span>
                  </div>
                  {/* --- PILL END --- */}
                </div>
              </div>
            </div>

            {/* Timetable Acrylic Card */}
            <div className="flex flex-col gap-3 bg-black/20 p-5 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl min-w-[200px]">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2 mb-1">
                <span className="text-blue-200 text-sm font-medium">Entrada</span>
                <span className="font-mono text-white font-bold text-lg tracking-wider">
                  {institucion.horario_inicio || "--:--"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2 mb-1">
                <span className="text-blue-200 text-sm font-medium">Salida</span>
                <span className="font-mono text-amber-200 font-bold text-lg tracking-wider">
                  {institucion.horario_salida || "--:--"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="text-blue-200 text-xs font-medium uppercase tracking-wider">Tolerancia</span>
                <span className="bg-blue-500/30 text-blue-100 px-2 py-0.5 rounded text-xs font-bold border border-blue-400/20">
                  {institucion.margen_puntualidad_min} min
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Queue Warning (Only if pending) */}
      {isNetworkOnline && pendingSync > 0 && (
         <div className="flex items-center justify-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg text-yellow-800 dark:text-yellow-200 text-sm font-bold animate-pulse border border-yellow-200 dark:border-yellow-700">
           <Activity size={18} />
           <span>Sincronizando {pendingSync} registros pendientes...</span>
         </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  
        {/* 1. TARJETA ESTADO (Verde) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-emerald-500 flex items-center justify-between transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Estado BD</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
               {stats.status === "online" ? "✓" : "✗"}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* 2. TARJETA ALUMNOS (Azul) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-blue-500 flex items-center justify-between transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Alumnos</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.alumnos}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* 3. TARJETA PERSONAL (Naranja) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-orange-400 flex items-center justify-between transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Personal</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{stats.personal}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 dark:text-orange-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* 4. TARJETA QR (Cian/Turquesa) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-cyan-400 flex items-center justify-between transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">QR Generados</p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{dashboardStats?.qrsGenerados ?? 0}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <QrCode className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Gráficos de Asistencias */}
      {!loading && asistenciasStats && asistenciasStats.porDia && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Líneas - Tendencia */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Tendencia de Asistencias
              </h3>
            </div>
            
            {Object.keys(asistenciasStats.porDia).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={Object.entries(asistenciasStats.porDia).map(
                    ([fecha, data]) => ({
                      fecha: new Date(fecha).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      }),
                      total: data.total,
                      puntuales: data.puntuales,
                      tardes: data.tardes,
                    })
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{paddingTop: '20px'}} />
                  <Line
                    type="natural"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}}
                    activeDot={{r: 6}}
                    name="Total"
                  />
                  <Line
                    type="natural"
                    dataKey="puntuales"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}}
                    name="Puntuales"
                  />
                  <Line
                    type="natural"
                    dataKey="tardes"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff'}}
                    name="Tardes"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <TrendingUp size={48} className="mb-3 opacity-20" />
                <p className="font-medium">No hay datos de asistencia aún</p>
                <p className="text-sm opacity-60">Los registros aparecerán aquí</p>
              </div>
            )}
          </div>

          {/* Gráfico de Barras - Entradas vs Salidas */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Entradas vs Salidas
              </h3>
            </div>

            {Object.keys(asistenciasStats.porDia).length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(asistenciasStats.porDia).map(
                    ([fecha, data]) => ({
                      fecha: new Date(fecha).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      }),
                      entradas: data.entradas,
                      salidas: data.salidas,
                    })
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     cursor={{fill: 'transparent'}}
                  />
                  <Legend wrapperStyle={{paddingTop: '20px'}} />
                  <Bar dataKey="entradas" fill="#10b981" radius={[4, 4, 0, 0]} name="Entradas" />
                  <Bar dataKey="salidas" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Salidas" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <Calendar size={48} className="mb-3 opacity-20" />
                <p className="font-medium">Sin registros de entradas/salidas</p>
                <p className="text-sm opacity-60">Comienza a tomar asistencia</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Nuevos Gráficos - Distribución de Alumnos */}
      {dashboardStats && (
        <>
          {/* Primera fila: Alumnos por Nivel y por Grado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Gráfico: Alumnos por Nivel Académico */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Alumnos por Nivel
                </h3>
              </div>
              {dashboardStats.totales.activos > 0 && dashboardStats.porNivel && 
                (dashboardStats.porNivel.primaria > 0 || dashboardStats.porNivel.basicos > 0 || dashboardStats.porNivel.diversificado > 0) ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Primaria', value: dashboardStats.porNivel.primaria || 0, color: '#3b82f6' },
                          { name: 'Básicos', value: dashboardStats.porNivel.basicos || 0, color: '#10b981' },
                          { name: 'Diversificado', value: dashboardStats.porNivel.diversificado || 0, color: '#f59e0b' },
                        ].filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {[
                          { name: 'Primaria', value: dashboardStats.porNivel.primaria || 0, color: '#3b82f6' },
                          { name: 'Básicos', value: dashboardStats.porNivel.basicos || 0, color: '#10b981' },
                          { name: 'Diversificado', value: dashboardStats.porNivel.diversificado || 0, color: '#f59e0b' },
                        ].filter(item => item.value > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend wrapperStyle={{paddingTop: '20px'}} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total: <span className="font-bold text-gray-900 dark:text-gray-100">{dashboardStats.totales.activos}</span> alumnos activos
                    </p>
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Users size={48} className="mb-3 opacity-20" />
                  <p className="font-medium text-gray-500 dark:text-gray-400">No hay alumnos registrados</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Los datos aparecerán aquí</p>
                </div>
              )}
            </div>

            {/* Gráfico: Alumnos por Grado */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Alumnos por Grado
                </h3>
              </div>
              {dashboardStats.totales.activos > 0 && Object.keys(dashboardStats.porGrado).length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(dashboardStats.porGrado).map(([grado, count]) => ({
                      grado: grado.replace(/\. /g, '.\n'),
                      alumnos: count
                    }))}
                    layout="horizontal"
                    margin={{ top: 5, right: 30, left: 10, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="grado" 
                      type="category" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{fontSize: 11, fill: '#6b7280'}}
                    />
                    <YAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{fill: 'transparent'}}
                    />
                    <Bar dataKey="alumnos" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Alumnos">
                      {
                        Object.entries(dashboardStats.porGrado).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 3 === 0 ? '#3b82f6' : index % 3 === 1 ? '#60a5fa' : '#93c5fd'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <TrendingUp size={48} className="mb-3 opacity-20" />
                  <p className="font-medium text-gray-500 dark:text-gray-400">Sin datos de grados</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Registra alumnos para ver estadísticas</p>
                </div>
              )}
            </div>
          </div>

          {/* Segunda fila: Distribución General (centrado) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Gráfico: Distribución General*/}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Alumnos - Distribución General
                </h3>
              </div>
              {dashboardStats.totales.activos > 0 && dashboardStats.porSexo &&
                (dashboardStats.porSexo.masculino > 0 || dashboardStats.porSexo.femenino > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Masculino', value: dashboardStats.porSexo.masculino, color: '#3b82f6' },
                        { name: 'Femenino', value: dashboardStats.porSexo.femenino, color: '#ec4899' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {[
                        { name: 'Masculino', value: dashboardStats.porSexo.masculino, color: '#3b82f6' },
                        { name: 'Femenino', value: dashboardStats.porSexo.femenino, color: '#ec4899' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Users size={48} className="mb-3 opacity-20" />
                  <p className="font-medium text-gray-500 dark:text-gray-400">No hay datos demográficos</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Los datos aparecerán aquí</p>
                </div>
              )}
            </div>

            {/* Gráfico: Distribución de Personal por Sexo */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Personal - Distribución General
                </h3>
              </div>
              {dashboardStats.personalPorSexo && 
                (dashboardStats.personalPorSexo.masculino > 0 || dashboardStats.personalPorSexo.femenino > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Masculino', value: dashboardStats.personalPorSexo.masculino || 0, color: '#3b82f6' },
                        { name: 'Femenino', value: dashboardStats.personalPorSexo.femenino || 0, color: '#ec4899' },
                      ].filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {[
                        { name: 'Masculino', value: dashboardStats.personalPorSexo.masculino || 0, color: '#3b82f6' },
                        { name: 'Femenino', value: dashboardStats.personalPorSexo.femenino || 0, color: '#ec4899' },
                      ].filter(item => item.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Users size={48} className="mb-3 opacity-20" />
                  <p className="font-medium text-gray-500 dark:text-gray-400">No hay personal registrado</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Los datos aparecerán aquí</p>
                </div>
              )}
            </div>
          </div>

          {/* Tercera fila: Personal por Cargo y Jornadas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Gráfico: Personal por Cargo */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Personal por Cargo
                </h3>
              </div>
              {dashboardStats.personalPorCargo && Object.keys(dashboardStats.personalPorCargo).length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(dashboardStats.personalPorCargo).map(([cargo, count]) => ({
                      cargo,
                      cantidad: count
                    }))}
                    layout="horizontal"
                    margin={{ top: 5, right: 30, left: 10, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="cargo" 
                      type="category" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{fontSize: 11, fill: '#6b7280'}}
                    />
                    <YAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{fill: 'transparent'}}
                    />
                    <Bar dataKey="cantidad" fill="#10b981" radius={[4, 4, 0, 0]} name="Personal">
                      {
                        Object.entries(dashboardStats.personalPorCargo).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 3 === 0 ? '#10b981' : index % 3 === 1 ? '#34d399' : '#6ee7b7'} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Briefcase size={48} className="mb-3 opacity-20" />
                  <p className="font-medium text-gray-500 dark:text-gray-400">Sin datos de cargos</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Registra personal para ver estadísticas</p>
                </div>
              )}
            </div>

            {/* Gráfico: Usuarios por Jornada (Alumnos + Personal) */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                  <Calendar size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Usuarios por Jornada
                </h3>
              </div>
              {(dashboardStats.alumnosPorJornada && Object.keys(dashboardStats.alumnosPorJornada).length > 0) ||
               (dashboardStats.personalPorJornada && Object.keys(dashboardStats.personalPorJornada).length > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={(() => {
                      const jornadas = new Set([
                        ...Object.keys(dashboardStats.alumnosPorJornada || {}),
                        ...Object.keys(dashboardStats.personalPorJornada || {})
                      ]);
                      return Array.from(jornadas).map(jornada => ({
                        jornada,
                        alumnos: dashboardStats.alumnosPorJornada?.[jornada] || 0,
                        personal: dashboardStats.personalPorJornada?.[jornada] || 0
                      }));
                    })()}
                    margin={{ top: 5, right: 30, left: 10, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="jornada" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{fontSize: 11, fill: '#6b7280'}}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{fill: 'transparent'}}
                    />
                    <Legend wrapperStyle={{paddingTop: '20px'}} />
                    <Bar dataKey="alumnos" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Alumnos" />
                    <Bar dataKey="personal" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Personal" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Calendar size={48} className="mb-3 opacity-20" />
                  <p className="font-medium text-gray-500 dark:text-gray-400">Sin datos de jornadas</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Los datos aparecerán aquí</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </div>
  );
}
