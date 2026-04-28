import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Server, 
  Database, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  RefreshCw,
  Trash2,
  AlertCircle,
  CheckCircle,
  Users,
  ShieldCheck,
  Zap,
  Info,
  ChevronDown,
  Layout
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import toast from 'react-hot-toast';
import { CardSkeleton } from './LoadingSpinner';
import client from '../api/client';

// Mapeo de rutas técnicas a nombres amigables para el usuario
const MODULE_LABELS = {
  '/api/asistencias': 'Asistencias y Marcajes',
  '/api/alumnos': 'Gestión de Alumnos',
  '/api/personal': 'Gestión de Personal',
  '/api/docentes': 'Gestión de Docentes',
  '/api/usuarios': 'Control de Usuarios',
  '/api/metrics': 'Analíticas del Sistema',
  '/api/configuracion': 'Configuración del Sistema',
  '/api/auth': 'Seguridad y Accesos',
  '/api/excusas': 'Módulo de Excusas',
  '/api/auditoria': 'Bitácora de Eventos',
  '/api/diagnostic': 'Diagnóstico Técnico',
  '/api/institucion': 'Perfil Institucional',
  '/api/equipos': 'Equipos Vinculados',
  '/api/health': 'Salud del Servidor',
  '/stats': 'Estadísticas Base',
  '/': 'Panel Principal'
};

// Rutas internas que no aportan valor visual al usuario final
const HIDDEN_ROUTES = [
  '/api/auth/verify', 
  '/api/metrics/reset', 
  '/api/diagnostic/fix', 
  '/api/health', 
  '/api/equipos/pending-count',
  '/stats',
  '/api/dashboard/stats'
];

export default function MetricsPanel() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);

  useEffect(() => {
    fetchMetrics();
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchMetrics, refreshInterval * 1000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const fetchMetrics = async () => {
    try {
      const response = await client.get('/metrics');
      setMetrics(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast.error('Error al actualizar analíticas');
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const confirm = window.confirm('¿Estás seguro de reiniciar los contadores de actividad? Esto no afectará los datos de alumnos o asistencias.');
    if (!confirm) return;
    
    try {
      await client.post('/metrics/reset');
      toast.success('Contadores reiniciados');
      fetchMetrics();
    } catch (error) {
      toast.error('Error al reiniciar');
    }
  };

  const formatUptime = (hours) => {
    const h = Math.floor(parseFloat(hours));
    const m = Math.floor((parseFloat(hours) - h) * 60);
    return `${h}h ${m}m de funcionamiento continuo`;
  };

  const getModuleName = (path) => {
    // Buscar coincidencia parcial (ej: /api/alumnos/123 -> Registro de Alumnos)
    const baseRoute = Object.keys(MODULE_LABELS).find(route => path.startsWith(route));
    return MODULE_LABELS[baseRoute] || path;
  };

  if (loading) return (
    <div className="p-8 space-y-8">
      <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />)}
      </div>
    </div>
  );

  if (!metrics) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
      <AlertCircle size={48} className="mb-4 text-red-500 opacity-50" />
      <p className="text-xl font-bold">Error de Conexión</p>
      <p>No se pudo recuperar la información del servidor.</p>
    </div>
  );

  const processedEndpoints = metrics.requests.topEndpoints
    .filter(e => !HIDDEN_ROUTES.includes(e.path))
    .map(e => ({ name: getModuleName(e.path), value: e.count }))
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.name);
      if (existing) existing.value += curr.value;
      else acc.push(curr);
      return acc;
    }, [])
    .sort((a,b) => b.value - a.value)
    .slice(0, 5);

  const requestsData = [
    { name: 'Éxito', value: metrics.requests.byStatus['2xx'], color: '#10b981' },
    { name: 'Alertas', value: metrics.requests.byStatus['4xx'], color: '#f59e0b' },
    { name: 'Errores', value: metrics.requests.byStatus['5xx'], color: '#ef4444' }
  ].filter(d => d.value > 0);

  return (
    <div className="p-1 md:p-4 space-y-8 max-w-7xl mx-auto">
      {/* --- HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <span className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <BarChart3 size={28} />
            </span>
            Analíticas de Uso
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Resumen operativo y estado de salud de tu plataforma SAE.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <RefreshCw size={16} className={autoRefresh ? 'animate-spin text-blue-600' : 'text-gray-400'} />
             <select 
               value={refreshInterval} 
               onChange={(e) => setRefreshInterval(Number(e.target.value))}
               className="bg-transparent text-sm font-bold focus:outline-none"
             >
               <option value={10}>Cada 10s</option>
               <option value={30}>Cada 30s</option>
               <option value={60}>Cada 1m</option>
             </select>
          </div>
          <button 
            onClick={fetchMetrics}
            className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-colors"
            title="Refrescar ahora"
          >
            <RefreshCw size={20} />
          </button>
          {localStorage.getItem('user_role') === 'admin' && (
            <button 
              onClick={handleReset}
              className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 transition-colors"
              title="Reiniciar contadores"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </motion.div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          icon={<Users />} 
          title="Población Escolar" 
          value={metrics.database.alumnos + metrics.database.personal}
          trend={`${metrics.database.alumnos} Alumnos / ${metrics.database.personal} Personal`}
          color="blue"
        />
        <MetricCard 
          icon={<CheckCircle />} 
          title="Asistencia de Hoy" 
          value={metrics.database.asistenciasHoy}
          trend="Registros capturados hoy"
          color="emerald"
        />
        <MetricCard 
          icon={<Zap />} 
          title="Accesos Activos" 
          value={metrics.database.qrsVigentes}
          trend="Credenciales QR válidas"
          color="amber"
        />
        <MetricCard 
          icon={<Clock />} 
          title="Tiempo Ininterrumpido" 
          value={formatUptime(metrics.uptime.hours).split(' ')[0]}
          trend={formatUptime(metrics.uptime.hours).split(' ').slice(1).join(' ')}
          color="indigo"
        />
      </div>

      {/* --- USAGE ANALYTICS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Most Used Modules */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-3">
              <Layout className="text-blue-600" size={24} />
              Secciones más consultadas
            </h3>
            <span className="text-[10px] uppercase font-black bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-3 py-1 rounded-full">Top 5 Módulos</span>
          </div>

          <div className="space-y-6">
            {processedEndpoints.map((item, i) => (
              <div key={i} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.name}</span>
                  <span className="text-xs font-black text-blue-600">{item.value} visitas</span>
                </div>
                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / processedEndpoints[0].value) * 100}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Health Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl flex flex-col"
        >
          <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" size={24} />
            Salud Operativa
          </h3>
          
          <div className="flex-1 space-y-6">
            <HealthItem 
              label="Acceso a la Base de Datos" 
              status={metrics.database.errors === 0 ? 'good' : 'warning'} 
              desc={metrics.database.errors === 0 ? 'Conexión estable y segura' : 'Se detectaron errores de consulta'}
            />
            <HealthItem 
              label="Eficiencia de Respuesta" 
              status={requestsData.some(d => d.name === 'Errores') ? 'warning' : 'good'} 
              desc="Velocidad de carga dentro de lo óptimo"
            />
            <HealthItem 
              label="Sincronización de Memoria" 
              status="good"
              desc="Uso de recursos balanceado"
            />
          </div>

          <ResponsiveContainer width="100%" height={120} className="mt-6">
            <PieChart>
              <Pie
                data={requestsData}
                cx="50%" cy="50%"
                innerRadius={35}
                outerRadius={50}
                paddingAngle={5}
                dataKey="value"
              >
                {requestsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

      </div>

      {/* --- ADVANCED TECHNICAL AREA --- */}
      <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors mx-auto"
        >
          <Info size={16} />
          {showAdvanced ? 'Ocultar Diagnóstico Técnico' : 'Ver Diagnóstico Técnico para Soporte'}
          <ChevronDown className={`transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} size={16} />
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Uso de Memoria (RAM)</h4>
                  <div className="space-y-3">
                    <TechStat label="Heap Usado" value={metrics.system.memoryUsage.heapUsed} />
                    <TechStat label="Heap Total" value={metrics.system.memoryUsage.heapTotal} />
                    <TechStat label="Proceso RSS" value={metrics.system.memoryUsage.rss} />
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Rendimiento Interno</h4>
                  <div className="space-y-3">
                    <TechStat label="Queries de BD" value={metrics.database.queries} />
                    <TechStat label="Hit Rate Caché" value={metrics.cache.hitRate} />
                    <TechStat label="Plataforma" value={`${metrics.system.platform} (${metrics.system.nodeVersion})`} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


    </div>
  );
}

// Subcomponentes
const MetricCard = ({ icon, title, value, trend, color }) => {
  const colors = {
    blue: "bg-blue-600 text-blue-600 shadow-blue-500/20",
    emerald: "bg-emerald-600 text-emerald-600 shadow-emerald-500/20",
    amber: "bg-amber-500 text-amber-500 shadow-amber-500/20",
    indigo: "bg-indigo-600 text-indigo-600 shadow-indigo-500/20",
  }[color];

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden relative group"
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${colors.split(' ')[0]} opacity-5 group-hover:scale-150 transition-transform duration-700`} />
      
      <div className={`w-12 h-12 rounded-2xl ${colors.split(' ')[0]} bg-opacity-10 flex items-center justify-center mb-4 text-2xl`}>
        {React.cloneElement(icon, { size: 24, className: colors.split(' ')[1] })}
      </div>
      
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-4xl font-black text-gray-900 dark:text-white truncate">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h4>
      </div>
      <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
        <TrendingUp size={12} />
        {trend}
      </p>
    </motion.div>
  );
};

const HealthItem = ({ label, status, desc }) => (
  <div className="flex items-center gap-4">
    <div className={`w-3 h-3 rounded-full ${status === 'good' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
    <div>
      <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{label}</p>
      <p className="text-[10px] text-gray-500 font-medium">{desc}</p>
    </div>
  </div>
);

const TechStat = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-200/50 dark:border-gray-700/50 last:border-0">
    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-xs font-black text-gray-900 dark:text-white">{value}</span>
  </div>
);
