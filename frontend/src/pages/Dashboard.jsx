import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/client";
import { Link } from "react-router-dom";
import {
    Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, Area, AreaChart
} from "recharts";
import { 
    Activity, ShieldAlert, CheckCircle, Clock, 
    UserPlus, FolderKanban, AlertCircle, TrendingUp 
} from "lucide-react";

// Mapeo de colores para los niveles de severidad
const COLORS = { ALTA: "#f43f5e", MEDIA: "#f59e0b", BAJA: "#10b981" };

export default function Dashboard() {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    // Carga de métricas globales desde el backend
    useEffect(() => {
        async function loadDashboard() {
            try {
                const res = await api.get("/stats/global");
                setMetrics(res.data);
            } catch (err) {
                console.error("Error loading dashboard", err);
            } finally {
                setLoading(false);
            }
        }
        loadDashboard();
    }, []);

    // Estado de carga con spinner y animación de pulso
    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Syncing System...</p>
        </div>
    );

    // Formateo de datos para el gráfico circular de severidad
    const severityData = metrics?.severityDist?.map(item => ({
        name: item.severity, value: item._count
    })) || [];

    return (
        <div className="space-y-8 pb-10 animate-in fade-in duration-700">
            
            {/* HEADER: Título dinámico según el rol del usuario */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                        {user.role === 'TESTER' ? 'Command' : 'Global'}<span className="text-indigo-500">Center</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                            {user.role === 'TESTER'
                                ? `Operator: ${user.full_name} / Sector: Testing`
                                : 'Admin Mode / Full Access'}
                        </p>
                    </div>
                </div>
                
                {/* ACCIONES: Registro de miembros (solo admin) y lista de proyectos */}
                <div className="flex gap-3">
                    {user.role === 'ADMIN' && (
                        <Link to="/team" className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-white/5">
                            <UserPlus size={16} />
                            Add Member
                        </Link>
                    )}
                    <Link to="/projects" className="flex items-center gap-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-indigo-600/20 transition-all">
                        <FolderKanban size={16} />
                        Projects
                    </Link>
                </div>
            </div>

            {/* GRID DE KPIs: Resumen numérico de métricas clave */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CardKPI title={user.role === 'TESTER' ? "Assigned" : "Active"} value={metrics?.activeProjects} color="text-white" icon={<Activity size={20}/>} />
                <CardKPI title="Success Rate" value={`${metrics?.successRate}%`} color="text-emerald-400" icon={<CheckCircle size={20}/>} />
                <CardKPI title="Critical Bugs" value={metrics?.criticalIssues} color="text-rose-500" icon={<ShieldAlert size={20}/>} />
                <CardKPI title="Queue" value={metrics?.pendingTests} color="text-amber-500" icon={<Clock size={20}/>} />
            </div>

            {/* BANNER DE ACCIÓN: Aviso de incidencias listas para re-test (solo testers) */}
            {user.role === 'TESTER' && metrics?.readyForRetest > 0 && (
                <div className="relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors"></div>
                    <div className="relative border border-emerald-500/20 p-5 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-500 text-black p-3 rounded-2xl shadow-lg shadow-emerald-500/20">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h4 className="text-emerald-400 font-black uppercase text-xs tracking-[0.2em]">Retest Pending</h4>
                                <p className="text-slate-300 text-sm mt-1 font-medium">
                                    There are <span className="text-white font-bold">{metrics.readyForRetest} incidents</span> ready for verification.
                                </p>
                            </div>
                        </div>
                        <Link to="/incidencias" className="px-6 py-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black rounded-xl text-xs font-black uppercase transition-all border border-emerald-500/20">
                            Start Verification →
                        </Link>
                    </div>
                </div>
            )}

            {/* SECCIÓN DE GRÁFICOS: Evolución histórica y distribución de riesgos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Gráfico de Área: Evolución de tests pasados vs fallidos */}
                <div className="lg:col-span-2 bg-[#161B2B]/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-white font-black uppercase italic tracking-tighter flex items-center gap-2">
                                <TrendingUp size={18} className="text-indigo-500" />
                                Execution Flow
                            </h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Pass vs. Fail Trend</p>
                        </div>
                    </div>
                    
                    <div className="h-[320px] w-full">
                        {metrics.history?.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={metrics.history}>
                                    <defs>
                                        <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="date" stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#475569" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="passed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPass)" />
                                    <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-600 font-black uppercase text-[10px] tracking-[0.3em]">No Data Stream</div>
                        )}
                    </div>
                </div>

                {/* Gráfico de Donut: Distribución de bugs por severidad */}
                <div className="bg-[#161B2B]/40 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md">
                    <h3 className="text-white font-black uppercase italic tracking-tighter mb-8">Risk Distribution</h3>
                    <div className="h-[320px] w-full">
                        {severityData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={severityData}
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {severityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#334155"} className="hover:opacity-80 transition-opacity outline-none" />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }} 
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{value}</span>} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-600 font-black uppercase text-[10px] tracking-[0.3em]">Clean System</div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

/**
 * Sub-componente para las tarjetas de KPI
 */
function CardKPI({ title, value, color, icon }) {
    return (
        <div className="group bg-[#161B2B]/40 border border-white/5 p-6 rounded-[2rem] hover:bg-indigo-600/5 hover:border-indigo-500/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">{title}</p>
                <div className={`${color} opacity-40 group-hover:opacity-100 transition-opacity`}>
                    {icon}
                </div>
            </div>
            <p className={`text-5xl font-black tracking-tighter ${color} drop-shadow-sm`}>{value || 0}</p>
        </div>
    );
}