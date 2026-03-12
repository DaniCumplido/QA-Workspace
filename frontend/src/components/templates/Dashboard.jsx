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
} from "recharts";

export default function Dashboard({ data, stats }) {
  if (!stats || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 animate-pulse font-medium">
          Cargando métricas...
        </p>
      </div>
    );
  }

  const processedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      pending:
        item.total === null
          ? null
          : Math.max(0, item.total - (item.passed + item.failed)),
    }));
  }, [data]);

  const maxValue = useMemo(() => {
    const maxInChart = Math.max(
      ...data.map((d) => Math.max(d.total || 0, d.previsto || 0)),
    );
    return Math.max(maxInChart, stats.total) + 5;
  }, [data, stats.total]);

  const todayStr = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="p-6 space-y-8 bg-[#0f172a] min-h-screen text-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Pruebas"
          value={stats.total}
          color="border-slate-500"
        />
        <StatCard
          title="Pasadas (OK)"
          value={stats.passed}
          color="border-green-500"
          textColor="text-green-400"
        />
        <StatCard
          title="Fallidas (KO)"
          value={stats.failed}
          color="border-red-500"
          textColor="text-red-400"
        />
        <StatCard
          title="Pendientes"
          value={stats.pending}
          color="border-amber-500"
          textColor="text-amber-400"
        />
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-white/10 shadow-2xl">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-xl font-bold text-white">
              Seguimiento de Ejecución
            </h2>
            <p className="text-sm text-slate-400">
              Progreso real vs Planificación teórica (Baseline)
            </p>
          </div>
          <div className="text-right text-xs text-slate-500 font-mono">
            {data[0]?.date} — {data[data.length - 1]?.date}
          </div>
        </div>

        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={processedData}
              margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, maxValue]}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                filterNull={true}
              />
              <Legend verticalAlign="top" height={50} />

              <ReferenceLine
                x={todayStr}
                stroke="#6366f1"
                strokeDasharray="3 3"
                label={{
                  value: "Hoy",
                  position: "top",
                  fill: "#6366f1",
                  fontSize: 11,
                }}
              />

              <Bar
                dataKey="passed"
                stackId="a"
                fill="#22c55e"
                name="Ejecutado OK"
                barSize={20}
              />
              <Bar
                dataKey="failed"
                stackId="a"
                fill="#ef4444"
                name="Ejecutado KO"
              />
              <Bar
                dataKey="pending"
                stackId="a"
                fill="#334155"
                name="Restante"
                radius={[4, 4, 0, 0]}
              />

              <Line
                type="linear"
                dataKey="previsto"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={false}
                name="Planificación (Deseado)"
                strokeDasharray="8 4"
              />

              <Line
                type="monotone"
                dataKey="passed"
                stroke="#10b981"
                strokeWidth={4}
                connectNulls={false}
                dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                name="Tendencia Real"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, textColor = "text-white" }) {
  return (
    <div
      className={`bg-slate-800/40 p-5 rounded-xl border-t-4 ${color} backdrop-blur-sm shadow-inner transition-transform hover:scale-[1.02]`}
    >
      <p className="text-slate-500 text-xs uppercase tracking-wider font-bold">
        {title}
      </p>
      <p className={`text-3xl font-black mt-1 ${textColor}`}>{value ?? 0}</p>
    </div>
  );
}
