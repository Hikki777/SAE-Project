import React, { useState, useEffect } from "react";
import {
  Activity,
  Users,
  QrCode,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  Wifi,
  WifiOff,
  Briefcase,
  Layers,
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
import client, { API_URL, BASE_URL } from "../api/client";
import {
  healthAPI,
  alumnosAPI,
  asistenciasAPI,
  docentesAPI,
  institucionAPI,
  dashboardAPI,
} from "../api/endpoints";
import toast from "react-hot-toast";
import offlineQueueService from "../services/offlineQueue";
import { CardSkeleton } from "./LoadingSpinner";

// Componente para cargar logos con fetch API (solución CORS para Electron)
// Recibe logoPath (ruta relativa) y logoBase64 (fallback si no existe archivo)
function LogoImage({ logoPath, logoBase64 }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        // Tentar cargar logoPath primero
        if (logoPath) {
          // Si es una URL completa, usarla directamente
          if (logoPath.startsWith("http")) {
            setImageSrc(logoPath);
            setIsLoading(false);
            return;
          }

          if (BASE_URL) {
            // Intentar cargar desde servidor usando la base centralizada
            const response = await fetch(`${BASE_URL}/api/uploads/${logoPath}?t=${Date.now()}`, {
              method: "GET",
              credentials: "include",
            });

            if (response.ok) {
              const blob = await response.blob();
              const objectUrl = URL.createObjectURL(blob);
              setImageSrc(objectUrl);
              setIsLoading(false);
              return;
            }
            // Si falla, caer a logoBase64
          }
        }

        // Fallback: usar logoBase64 si existe
        if (logoBase64) {
          setImageSrc(logoBase64);
          setIsLoading(false);
          return;
        }

        // Sin imagen disponible
        setIsLoading(false);
      } catch (error) {
        console.warn("Error loading logo, using fallback:", error);
        // Fallback final: logoBase64
        if (logoBase64) {
          setImageSrc(logoBase64);
        }
        setIsLoading(false);
      }
    };

    loadLogo();

    // Cleanup
    return () => {
      if (imageSrc && imageSrc.startsWith("blob:")) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [logoPath, logoBase64]);

  if (isLoading) {
    return (
      <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md ring-1 ring-white/20 w-24 h-24 animate-pulse" />
    );
  }

  if (!imageSrc) {
    return null;
  }

  return (
    <div className="bg-white p-2 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300 ring-4 ring-white/10 backdrop-blur-md">
      <img
        src={imageSrc}
        alt="Logo institucional"
        className="w-24 h-24 object-contain"
        onError={() => {
          console.error("Error displaying logo");
        }}
      />
    </div>
  );
}

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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Reloj dinámico
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    // Intervalo para verificar la cola
    const queueInterval = setInterval(async () => {
      const count = await offlineQueueService.getPendingCount();
      setPendingSync(count);
    }, 2000);

    // Actualizar al montar
    updateStatus();

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
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
      const data = response.data;
      // Guard: asegurar que los campos usados por Recharts sean objetos planos
      // Un campo null o con prototype raro rompe Object.entries() en recharts
      if (data && typeof data === "object") {
        const safe = {
          ...data,
          porGrado:
            data.porGrado &&
            typeof data.porGrado === "object" &&
            !Array.isArray(data.porGrado)
              ? data.porGrado
              : {},
          porNivel:
            data.porNivel && typeof data.porNivel === "object"
              ? data.porNivel
              : {},
          porSexo:
            data.porSexo && typeof data.porSexo === "object"
              ? data.porSexo
              : { masculino: 0, femenino: 0 },
          personalPorSexo:
            data.personalPorSexo && typeof data.personalPorSexo === "object"
              ? data.personalPorSexo
              : { masculino: 0, femenino: 0 },
          personalPorCargo:
            data.personalPorCargo &&
            typeof data.personalPorCargo === "object" &&
            !Array.isArray(data.personalPorCargo)
              ? data.personalPorCargo
              : {},
          alumnosPorJornada:
            data.alumnosPorJornada &&
            typeof data.alumnosPorJornada === "object" &&
            !Array.isArray(data.alumnosPorJornada)
              ? data.alumnosPorJornada
              : {},
          personalPorJornada:
            data.personalPorJornada &&
            typeof data.personalPorJornada === "object" &&
            !Array.isArray(data.personalPorJornada)
              ? data.personalPorJornada
              : {},
          totales:
            data.totales && typeof data.totales === "object"
              ? data.totales
              : { activos: 0, inactivos: 0 },
        };
        setDashboardStats(safe);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };



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
              {institucion.logo_path || institucion.logo_base64 ? (
                <LogoImage logoPath={institucion.logo_path} logoBase64={institucion.logo_base64} />
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
                {(institucion.direccion ||
                  institucion.email ||
                  institucion.telefono ||
                  institucion.pais) && (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {institucion.direccion && (
                      <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm text-blue-50 font-medium hover:bg-white/20 transition-all">
                        <span className="opacity-70">📍</span>{" "}
                        {institucion.direccion}
                      </span>
                    )}
                    {institucion.email && (
                      <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm text-blue-50 font-medium hover:bg-white/20 transition-all">
                        <span className="opacity-70">✉️</span>{" "}
                        {institucion.email}
                      </span>
                    )}
                    {institucion.telefono && (
                      <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm text-blue-50 font-medium hover:bg-white/20 transition-all">
                        <span className="opacity-70">📞</span>{" "}
                        {institucion.telefono}
                      </span>
                    )}
                    {institucion.pais && (
                      <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm text-blue-50 font-medium hover:bg-white/20 transition-all">
                        <span className="opacity-70">🌍</span>{" "}
                        {institucion.pais}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-4 isolate">
                  {/* Version Badge */}
                  <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm text-blue-50 font-medium hover:bg-white/20 transition-all">
                    <span className="opacity-70">🏷️</span>{" "}
                    SAE v{__APP_VERSION__}
                  </span>

                  {/* Connectivity Badge */}
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm text-blue-50 font-medium hover:bg-white/20 transition-all">
                    {/* Pulsing dot isolated */}
                    <span className="relative flex shrink-0 h-2 w-2 transform-gpu">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 transform-gpu ${isNetworkOnline ? "bg-emerald-400" : "bg-red-400"}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isNetworkOnline ? "bg-emerald-500" : "bg-red-500"}`}></span>
                    </span>
                    <span className="text-white">
                      {isNetworkOnline ? "Sistema En Línea" : "Sin Conexión"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timetable Acrylic Card */}
            <div className="flex flex-col gap-3 bg-black/20 p-5 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl min-w-[200px]">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2 mb-1">
                <span className="text-blue-200 text-sm font-medium">
                  Entrada
                </span>
                <span className="font-mono text-white font-bold text-lg tracking-wider">
                  {institucion.horario_inicio || "--:--"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2 mb-1">
                <span className="text-blue-200 text-sm font-medium">
                  Salida
                </span>
                <span className="font-mono text-amber-200 font-bold text-lg tracking-wider">
                  {institucion.horario_salida || "--:--"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 pt-1">
                <span className="text-blue-200 text-xs font-medium uppercase tracking-wider">
                  Tolerancia
                </span>
                <span className="bg-blue-500/30 text-blue-100 px-2 py-0.5 rounded text-xs font-bold border border-blue-400/20">
                  {institucion.margen_puntualidad_min} min
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Date and Time Card */}
      <div className="bg-bg-secondary/70 backdrop-blur-xl border-white/10 hover:border-accent/50 rounded-2xl transition-all hover:shadow-glow hover:-translate-y-1 group overflow-hidden relative">
        {/* Decorative corner icon */}
        <div className="absolute -right-6 -bottom-6 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-500">
          <Clock size={120} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 relative z-10">
          {/* Left: Date */}
          <div className="flex items-center gap-4 p-5 md:pr-10 md:justify-center">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400 shadow-inner">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-0.5">Fecha Actual</p>
              <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 capitalize">
                {currentTime.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h3>
            </div>
          </div>

          {/* Right: Time */}
          <div className="flex items-center gap-4 p-5 md:pl-10 md:justify-center border-t md:border-t-0 md:border-l border-gray-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10">
            <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-xl text-slate-600 dark:text-slate-300 shadow-inner group-hover:rotate-12 transition-transform order-last md:order-first">
              <Clock size={24} />
            </div>
            <div className="text-left md:text-right flex-1 md:flex-none">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-0.5">Hora del Sistema</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-widest font-mono">
                {currentTime.toLocaleTimeString('es-ES', { 
                  hour: '2-digit', 
                  minute: '2-digit', 
                  second: '2-digit',
                  hour12: true 
                })}
              </h3>
            </div>
          </div>
        </div>
      </div>

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
        <div className="bg-bg-secondary/70 backdrop-blur-xl border-white/10 hover:border-accent/50 rounded-xl p-5 transition-all hover:shadow-glow hover:scale-[1.02] border-l-4 border-emerald-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Estado BD
            </p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.status === "online" ? "✓" : "✗"}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* 2. TARJETA ALUMNOS (Azul) */}
        <div className="bg-bg-secondary/70 backdrop-blur-xl border-white/10 hover:border-accent/50 rounded-xl p-5 transition-all hover:shadow-glow hover:scale-[1.02] border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Alumnos
            </p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.alumnos}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* 3. TARJETA PERSONAL (Naranja) */}
        <div className="bg-bg-secondary/70 backdrop-blur-xl border-white/10 hover:border-accent/50 rounded-xl p-5 transition-all hover:shadow-glow hover:scale-[1.02] border-l-4 border-orange-400 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Personal
            </p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {stats.personal}
            </h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500 dark:text-orange-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* 4. TARJETA QR (Cian/Turquesa) */}
        <div className="bg-bg-secondary/70 backdrop-blur-xl border-white/10 hover:border-accent/50 rounded-xl p-5 transition-all hover:shadow-glow hover:scale-[1.02] border-l-4 border-cyan-400 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              QR Generados
            </p>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {dashboardStats?.qrsGenerados ?? 0}
            </h3>
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
          <div className="bg-bg-secondary/70 backdrop-blur-xl border-white/5 rounded-2xl p-6 relative">
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
                      ausentes: data.ausentes || 0,
                    }),
                  )}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="fecha"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Line
                    type="natural"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#3b82f6",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6 }}
                    name="Total"
                  />
                  <Line
                    type="natural"
                    dataKey="puntuales"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#10b981",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    name="Puntuales"
                  />
                  <Line
                    type="natural"
                    dataKey="tardes"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#ef4444",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    name="Tardes"
                  />
                  <Line
                    type="natural"
                    dataKey="ausentes"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#f97316",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    name="Ausentes"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <TrendingUp size={48} className="mb-3 opacity-20" />
                <p className="font-medium">No hay datos de asistencia aún</p>
                <p className="text-sm opacity-60">
                  Los registros aparecerán aquí
                </p>
              </div>
            )}
          </div>

          {/* Gráfico de Barras - Entradas vs Salidas */}
          <div className="bg-bg-secondary/70 backdrop-blur-xl border-white/5 rounded-2xl p-6 relative">
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
                    }),
                  )}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="fecha"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    cursor={{ fill: "transparent" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} />
                  <Bar isAnimationActive={false}
                    dataKey="entradas"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Entradas"
                  />
                  <Bar isAnimationActive={false}
                    dataKey="salidas"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    name="Salidas"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <Calendar size={48} className="mb-3 opacity-20" />
                <p className="font-medium">Sin registros de entradas/salidas</p>
                <p className="text-sm opacity-60">
                  Comienza a tomar asistencia
                </p>
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
            <div className="bg-bg-secondary/70 backdrop-blur-xl border-white/5 rounded-2xl p-6 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Alumnos por Nivel
                </h3>
              </div>
              {dashboardStats.totales.activos > 0 &&
              dashboardStats.porNivel &&
              (dashboardStats.porNivel.primaria > 0 ||
                dashboardStats.porNivel.basicos > 0 ||
                dashboardStats.porNivel.diversificado > 0) ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie isAnimationActive={false}
                        data={[
                          {
                            name: "Primaria",
                            value: dashboardStats.porNivel.primaria || 0,
                            color: "#3b82f6",
                          },
                          {
                            name: "Básicos",
                            value: dashboardStats.porNivel.basicos || 0,
                            color: "#10b981",
                          },
                          {
                            name: "Diversificado",
                            value: dashboardStats.porNivel.diversificado || 0,
                            color: "#f59e0b",
                          },
                        ].filter((item) => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {[
                          {
                            name: "Primaria",
                            value: dashboardStats.porNivel.primaria || 0,
                            color: "#3b82f6",
                          },
                          {
                            name: "Básicos",
                            value: dashboardStats.porNivel.basicos || 0,
                            color: "#10b981",
                          },
                          {
                            name: "Diversificado",
                            value: dashboardStats.porNivel.diversificado || 0,
                            color: "#f59e0b",
                          },
                        ]
                          .filter((item) => item.value > 0)
                          .map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="white"
                              strokeWidth={2}
                            />
                          ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total:{" "}
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {dashboardStats.totales.activos}
                      </span>{" "}
                      alumnos activos
                    </p>
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Users size={48} className="mb-3 opacity-20" />
                  <p className="font-medium text-gray-500 dark:text-gray-400">
                    No hay alumnos registrados
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Los datos aparecerán aquí
                  </p>
                </div>
              )}
            </div>

            {/* Gráfico: Alumnos por Grado */}
            <div className="bg-bg-secondary/70 backdrop-blur-xl border-white/5 rounded-2xl p-6 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Alumnos por Grado
                </h3>
              </div>
              {dashboardStats.totales.activos > 0 &&
              Object.keys(dashboardStats.porGrado).length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(dashboardStats.porGrado).map(
                      ([grado, count]) => ({
                        grado: grado.replace(/\. /g, ".\n"),
                        alumnos: count,
                      }),
                    )}
                    layout="horizontal"
                    margin={{ top: 5, right: 30, left: 10, bottom: 60 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="grado"
                      type="category"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                    />
                    <YAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      cursor={{ fill: "transparent" }}
                    />
                    <Bar isAnimationActive={false}
                      dataKey="alumnos"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Alumnos"
                    >
                      {Object.entries(dashboardStats.porGrado).map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index % 3 === 0
                                ? "#3b82f6"
                                : index % 3 === 1
                                  ? "#60a5fa"
                                  : "#93c5fd"
                            }
                          />
                        ),
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <TrendingUp size={48} className="mb-3 opacity-20" />
                  <p className="font-medium text-gray-500 dark:text-gray-400">
                    Sin datos de grados
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Registra alumnos para ver estadísticas
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Segunda fila: Distribución General (centrado) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Gráfico: Distribución General*/}
            <div className="bg-bg-secondary/70 backdrop-blur-xl border-white/5 rounded-2xl p-6 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Alumnos - Distribución General
                </h3>
              </div>
              {dashboardStats.totales.activos > 0 &&
              dashboardStats.porSexo &&
              (dashboardStats.porSexo.masculino > 0 ||
                dashboardStats.porSexo.femenino > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie isAnimationActive={false}
                      data={[
                        {
                          name: "Masculino",
                          value: dashboardStats.porSexo.masculino,
                          color: "#3b82f6",
                        },
                        {
                          name: "Femenino",
                          value: dashboardStats.porSexo.femenino,
                          color: "#ec4899",
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {[
                        {
                          name: "Masculino",
                          value: dashboardStats.porSexo.masculino,
                          color: "#3b82f6",
                        },
                        {
                          name: "Femenino",
                          value: dashboardStats.porSexo.femenino,
                          color: "#ec4899",
                        },
                      ].map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="white"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: "20px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Users size={48} className="mb-3 opacity-20" />
                  <p className="font-medium text-gray-500 dark:text-gray-400">
                    No hay datos demográficos
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Los datos aparecerán aquí
                  </p>
                </div>
              )}
            </div>

            {/* Gráfico: Distribución de Personal por Sexo */}
            <div className="bg-bg-secondary/70 backdrop-blur-xl border-white/5 rounded-2xl p-6 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Personal - Distribución General
                </h3>
              </div>
              {dashboardStats.personalPorSexo &&
              (dashboardStats.personalPorSexo.masculino > 0 ||
                dashboardStats.personalPorSexo.femenino > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie isAnimationActive={false}
                      data={[
                        {
                          name: "Masculino",
                          value: dashboardStats.personalPorSexo.masculino || 0,
                          color: "#3b82f6",
                        },
                        {
                          name: "Femenino",
                          value: dashboardStats.personalPorSexo.femenino || 0,
                          color: "#ec4899",
                        },
                      ].filter((item) => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {[
                        {
                          name: "Masculino",
                          value: dashboardStats.personalPorSexo.masculino || 0,
                          color: "#3b82f6",
                        },
                        {
                          name: "Femenino",
                          value: dashboardStats.personalPorSexo.femenino || 0,
                          color: "#ec4899",
                        },
                      ]
                        .filter((item) => item.value > 0)
                        .map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="white"
                            strokeWidth={2}
                          />
                        ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: "20px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Users size={48} className="mb-3 opacity-20" />
                  <p className="font-medium text-gray-500 dark:text-gray-400">
                    No hay personal registrado
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Los datos aparecerán aquí
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tercera fila: Personal por Cargo y Jornadas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Gráfico: Personal por Cargo */}
            <div className="bg-bg-secondary/70 backdrop-blur-xl border-white/5 rounded-2xl p-6 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Personal por Cargo
                </h3>
              </div>
              {dashboardStats.personalPorCargo &&
              Object.keys(dashboardStats.personalPorCargo).length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(dashboardStats.personalPorCargo).map(
                      ([cargo, count]) => ({
                        cargo,
                        cantidad: count,
                      }),
                    )}
                    layout="horizontal"
                    margin={{ top: 5, right: 30, left: 10, bottom: 60 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="cargo"
                      type="category"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                    />
                    <YAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      cursor={{ fill: "transparent" }}
                    />
                    <Bar isAnimationActive={false}
                      dataKey="cantidad"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      name="Personal"
                    >
                      {Object.entries(dashboardStats.personalPorCargo).map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index % 3 === 0
                                ? "#10b981"
                                : index % 3 === 1
                                  ? "#34d399"
                                  : "#6ee7b7"
                            }
                          />
                        ),
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Briefcase size={48} className="mb-3 opacity-20" />
                  <p className="font-medium text-gray-500 dark:text-gray-400">
                    Sin datos de cargos
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Registra personal para ver estadísticas
                  </p>
                </div>
              )}
            </div>

            {/* Gráfico: Usuarios por Jornada (Alumnos + Personal) */}
            <div className="bg-bg-secondary/70 backdrop-blur-xl border-white/5 rounded-2xl p-6 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                  <Calendar size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Usuarios por Jornada
                </h3>
              </div>
              {(dashboardStats.alumnosPorJornada &&
                Object.keys(dashboardStats.alumnosPorJornada).length > 0) ||
              (dashboardStats.personalPorJornada &&
                Object.keys(dashboardStats.personalPorJornada).length > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={(() => {
                      const jornadas = new Set([
                        ...Object.keys(dashboardStats.alumnosPorJornada || {}),
                        ...Object.keys(dashboardStats.personalPorJornada || {}),
                      ]);
                      return Array.from(jornadas).map((jornada) => ({
                        jornada,
                        alumnos:
                          dashboardStats.alumnosPorJornada?.[jornada] || 0,
                        personal:
                          dashboardStats.personalPorJornada?.[jornada] || 0,
                      }));
                    })()}
                    margin={{ top: 5, right: 30, left: 10, bottom: 60 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e7eb"
                    />
                    <XAxis
                      dataKey="jornada"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#9ca3af" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      cursor={{ fill: "transparent" }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
                    <Bar isAnimationActive={false}
                      dataKey="alumnos"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Alumnos"
                    />
                    <Bar isAnimationActive={false}
                      dataKey="personal"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                      name="Personal"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Calendar size={48} className="mb-3 opacity-20" />
                  <p className="font-medium text-gray-500 dark:text-gray-400">
                    Sin datos de jornadas
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Los datos aparecerán aquí
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

    </div>
  );
}
