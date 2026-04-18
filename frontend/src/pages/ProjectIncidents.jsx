import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../api/client";
import ResourcePage from "../components/templates/ResourcePage";
import { SlideOver } from "../components/ui/SideOver";
import { 
  Bug, 
  ShieldAlert, 
  Clock, 
  ChevronRight, 
  FileSearch, 
  Activity, 
  AlertCircle
} from "lucide-react";

export default function ProjectIssues() {
  const { id: projectId } = useParams();
  
  const [tableRefresh, setTableRefresh] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mapeo de estilos según la severidad (traducción de backend: BAJA/MEDIA/ALTA)
  const severityStyles = {
    BAJA: "text-cyan-600 border-cyan-200 bg-cyan-50",
    MEDIA: "text-amber-600 border-amber-200 bg-amber-50",
    ALTA: "text-rose-600 border-rose-200 bg-rose-50 font-bold shadow-sm",
  };

  // Mapeo de estilos según el estado de la incidencia
  const statusStyles = {
    OPEN: "bg-slate-100 text-slate-600 border-slate-200",
    ANALISIS: "bg-indigo-50 text-indigo-600 border-indigo-200",
    RESOLVED: "bg-emerald-50 text-emerald-600 border-emerald-200",
    CLOSED: "bg-slate-800 text-white border-slate-900",
  };

  /**
   * Actualiza el estado o severidad de una incidencia específica.
   * Envía los datos del formulario al endpoint del proyecto.
   */
  const handleUpdateIssue = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      await api.patch(`/projects/${projectId}/issues/${selectedIssue.id}`, data);
      setSelectedIssue(null);
      if (tableRefresh) tableRefresh(); // Recarga la tabla tras el éxito
    } catch (error) {
      alert("Failed to update incident details");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDetail = (issue, refresh) => {
    setSelectedIssue(issue);
    setTableRefresh(() => refresh);
  };

  return (
    <>
      {/* Componente base para listados: gestiona fetch, filtros y paginación */}
      <ResourcePage
        title="Issue Tracker"
        resourceName="Issue"
        endpoint={`/projects/${projectId}/issues`}
        tableHeaders={["Issue Details", "Related Test Case", "Severity", "Status", "Actions"]}
        searchKeys={["title"]}
        canCreate={false} // Las incidencias se crean normalmente desde la ejecución de tests
        renderRow={(issue, refresh) => (
          <tr key={issue.id} className="group border-b border-slate-100 hover:bg-rose-50/30 transition-all">
            <td className="px-6 py-5">
              <div className="flex flex-col gap-1">
                <div className="text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors flex items-center gap-2">
                  <Bug size={14} className="text-rose-500 opacity-70" />
                  {issue.title}
                </div>
                <div className="text-[11px] text-slate-500 font-medium truncate max-w-[300px] italic">
                  {issue.description ? issue.description.substring(0, 60) + "..." : "No description provided"}
                </div>
              </div>
            </td>
            <td className="px-6 py-5">
              <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 inline-flex items-center gap-1.5">
                <FileSearch size={10} />
                {issue.testCase?.title ? issue.testCase.title : "Manual / Unlinked"}
              </div>
            </td>
            <td className="px-6 py-5">
              <span className={`px-2 py-0.5 text-[9px] font-black rounded-full border uppercase tracking-widest ${severityStyles[issue.severity]}`}>
                {issue.severity === 'BAJA' ? 'Low' : issue.severity === 'MEDIA' ? 'Medium' : 'High'}
              </span>
            </td>
            <td className="px-6 py-5">
              <span className={`px-2 py-0.5 text-[9px] font-black rounded-md border uppercase tracking-tighter ${statusStyles[issue.status]}`}>
                {issue.status}
              </span>
            </td>
            <td className="px-6 py-5 text-right">
              <button
                className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors group/btn"
                onClick={() => openDetail(issue, refresh)}
              >
                View Details
                <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </td>
          </tr>
        )}
      />

      {/* Panel lateral para edición rápida y visualización técnica */}
      <SlideOver
        open={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onSave={handleUpdateIssue}
        title="Incident Analysis"
        isSubmitting={isSubmitting}
      >
        {selectedIssue && (
          <div className="space-y-8 mt-4">
            <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Incident Title</label>
                <h3 className="text-xl font-black text-white leading-tight uppercase tracking-tight">
                  {selectedIssue.title}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
                <ShieldAlert size={24} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                <AlertCircle size={12} className="text-indigo-500" />
                Linked Test Case
              </label>
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <p className="text-sm text-indigo-300 font-bold font-mono">
                  {selectedIssue.testCase?.title || "Manual Entry / External Bug"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                <Activity size={12} className="text-indigo-500" />
                Reproduction Steps & Logs
              </label>
              <div className="p-4 bg-black/50 border border-white/5 rounded-2xl font-mono text-[12px] leading-relaxed text-slate-400 min-h-[150px] shadow-inner whitespace-pre-wrap">
                {selectedIssue.description || "No technical steps provided."}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Status</label>
                  <select
                    name="status"
                    defaultValue={selectedIssue.status}
                    className="w-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest p-3 rounded-xl border border-white/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="OPEN">Open</option>
                    <option value="ANALISIS">In Analysis</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Severity</label>
                  <select
                    name="severity"
                    defaultValue={selectedIssue.severity}
                    className="w-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest p-3 rounded-xl border border-white/10 focus:border-rose-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="BAJA">Low</option>
                    <option value="MEDIA">Medium</option>
                    <option value="ALTA">High / Critical</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 py-4 border-t border-white/5">
              <div className="p-2 rounded-full bg-slate-800 text-slate-400">
                <Clock size={12} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Timestamp</p>
                <p className="text-[11px] font-mono text-slate-300">
                  {new Date(selectedIssue.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </SlideOver>
    </>
  );
}