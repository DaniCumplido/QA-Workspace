import React, { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from "recharts";
import { Activity, CheckCircle2, XCircle, Clock, Zap } from "lucide-react";

export default function Dashboard({ data, stats }) {
  // Estado de carga: Si no hay estadísticas o datos, muestra un spinner estilizado
  if (!stats || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full"></div>
          <div className="absolute top-0 w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] animate-pulse">
          Syncing Quality Metrics...
        </p>
      </div>
    );
  }

  // Procesamiento de datos: Calculamos los tests pendientes para el gráfico apilado
  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      pending:
        item.total === null
          ? null
          : Math.max(0, item.total - (item.passed + item.failed)),
    }));
  }, [data]);

  // Cálculo del eje Y: Determinamos el valor máximo para que el gráfico no se corte
  const maxValue = useMemo(() => {
    const maxInChart = Math.max(
      ...data.map((d) => Math.max(d.total || 0, d.previsto || 0)),
    );
    return Math.max(maxInChart, stats.total) + 10;
  }, [data, stats.total]);

  // Formateo de la fecha actual para la línea de referencia "Today"
  const todayStr = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      {/* Encabezado de la Sección */}
      <div className="flex items-center gap-3 mb-2">
        <Zap className="text-indigo-500 fill-indigo-500/20" size={20} />
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
          Quality <span className="text-indigo-500">Analytics</span>
        </h1>
      </div>

      {/* Rejilla de KPIs: Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tests"
          value={stats.total}
          icon={<Activity size={18} />}
          gradient="from-slate-500/10 to-transparent"
          border="border-slate-500/30"
          textColor="text-white"
        />
        <StatCard
          title="Passed (OK)"
          value={stats.passed}
          icon={<CheckCircle2 size={18} />}
          gradient="from-emerald-500/10 to-transparent"
          border="border-emerald-500/30"
          textColor="text-emerald-400"
        />
        <StatCard
          title="Failed (KO)"
          value={stats.failed}
          icon={<XCircle size={18} />}
          gradient="from-rose-500/10 to-transparent"
          border="border-rose-500/30"
          textColor="text-rose-400"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<Clock size={18} />}
          gradient="from-amber-500/10 to-transparent"
          border="border-amber-500/30"
          textColor="text-amber-400"
        />
      </div>

      {/* Contenedor del Gráfico Mixto (Barras + Líneas) */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[2rem] blur-xl opacity-50 transition duration-1000 group-hover:opacity-100"></div>
        
        <div className="relative bg-[#161B2B]/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-2xl">
          <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">
                Burndown & Trends
              </h2>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">
                Execution Tracking
              </h3>
            </div>
            <div className="px-4 py-2 bg-black/30 rounded-full border border-white/5 font-mono text-[10px] text-slate-500">
              PERIOD: <span className="text-indigo-400">{data[0]?.date}</span> — <span className="text-indigo-400">{data[data.length - 1]?.date}</span>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={processedData}
                margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
              >
                <defs>
                  <linearGradient id="colorPassed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="bold" 
                  tickLine={false} 
                  axisLine={false} 
                  dy={15} 
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="bold" 
                  tickLine={false} 
                  axisLine={false} 
                  domain={[0, maxValue]} 
                />

                <Tooltip
                  cursor={{ stroke: '#ffffff10', strokeWidth: 2 }}
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}
                  itemStyle={{ padding: "2px 0" }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right"
                  height={50}
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{value}</span>}
                />

                {/* Marcador visual para el día de hoy */}
                <ReferenceLine
                  x={todayStr}
                  stroke="#6366f1"
                  strokeWidth={2}
                  strokeDasharray="10 5"
                />

                {/* Barras Apiladas (Passed, Failed, Queue) */}
                <Bar dataKey="passed" stackId="a" fill="#10b981" name="Success" barSize={12} />
                <Bar dataKey="failed" stackId="a" fill="#f43f5e" name="Failed" barSize={12} />
                <Bar dataKey="pending" stackId="a" fill="#ffffff08" name="Queue" barSize={12} radius={[4, 4, 0, 0]} />

                {/* Área y Línea de Tendencia Real vs Prevista */}
                <Area type="monotone" dataKey="passed" stroke="none" fill="url(#colorPassed)" />

                <Line
                  type="monotone"
                  dataKey="previsto"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Baseline"
                  opacity={0.5}
                />

                <Line
                  type="monotone"
                  dataKey="passed"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 3, stroke: "#0F172A" }}
                  activeDot={{ r: 6, fill: "#10b981", strokeWidth: 0 }}
                  name="Real Trend"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Sub-componente para las tarjetas de métricas (KPIs)
 */
function StatCard({ title, value, icon, gradient, border, textColor }) {
  return (
    <div className={`relative group overflow-hidden bg-[#161B2B]/40 backdrop-blur-md p-6 rounded-[1.5rem] border ${border} transition-all duration-300 hover:-translate-y-1 hover:bg-[#161B2B]/60`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50`}></div>
      <div className="relative flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            {title}
          </p>
          <p className={`text-4xl font-black tracking-tighter ${textColor}`}>
            {value ?? 0}
          </p>
        </div>
        <div className={`p-2 rounded-xl bg-white/5 border border-white/5 ${textColor} opacity-80 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );
}