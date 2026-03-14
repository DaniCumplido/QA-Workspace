import ResourcePage from "../components/templates/ResourcePage";
import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../api/client";
import { SlideOver } from "../components/ui/SideOver";

export default function ProjectIssues() {
  const { id: projectId } = useParams();
  
  // Almacenamos la referencia a la función de refresco del template
  const [tableRefresh, setTableRefresh] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const severityColors = {
    BAJA: "text-blue-400 border-blue-400/20 bg-blue-400/10",
    MEDIA: "text-amber-400 border-amber-400/20 bg-amber-400/10",
    ALTA: "text-red-400 border-red-400/20 bg-red-400/10",
  };

  const statusColors = {
    OPEN: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    ANALISIS: "bg-indigo-500/10 text-indigo-400 border-indigo-400/20",
    RESOLVED: "bg-green-500/10 text-green-400 border-green-400/20",
    CLOSED: "bg-green-500/10 text-green-400 border-green-400/20",
  };

  const handleUpdateIssue = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      await api.patch(
        `/projects/${projectId}/issues/${selectedIssue.id}`,
        data
      );

      setSelectedIssue(null);
      // Ejecutamos el refresh que capturamos del renderRow
      if (tableRefresh) tableRefresh();
    } catch (error) {
      alert("Error al actualizar la incidencia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDetail = (issue, refresh) => {
    setSelectedIssue(issue);
    setTableRefresh(() => refresh); // Capturamos la función de recarga
  };

  return (
    <>
      <ResourcePage
        title="Incidencias"
        resourceName="Incidencia"
        endpoint={`/projects/${projectId}/issues`}
        tableHeaders={[
          "Incidencia",
          "Caso de Prueba",
          "Severidad",
          "Estado",
          "Acciones",
        ]}
        searchKeys={["title"]}
        canCreate={false}
        renderRow={(issue, refresh) => (
          <tr
            key={issue.id}
            className="transition-colors border-t border-white/5 hover:bg-white/5"
          >
            <td className="px-6 py-4">
              <div className="text-sm font-semibold text-slate-200">
                {issue.title}
              </div>
              <div className="text-xs text-slate-500 truncate max-w-[250px]">
                {issue.description || "Sin descripción"}
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-slate-400">
                {issue.testCase?.title || (
                  <span className="italic text-slate-500 text-xs">
                    Manual / General
                  </span>
                )}
              </div>
            </td>
            <td className="px-6 py-4">
              <span
                className={`px-2 py-1 text-[10px] font-bold rounded border ${severityColors[issue.severity]}`}
              >
                {issue.severity}
              </span>
            </td>
            <td className="px-6 py-4">
              <span
                className={`px-2 py-1 text-[10px] font-bold rounded border ${statusColors[issue.status]}`}
              >
                {issue.status}
              </span>
            </td>
            <td className="px-6 py-4 text-right space-x-3">
              <button
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
                onClick={() => openDetail(issue, refresh)}
              >
                Detalle
              </button>
            </td>
          </tr>
        )}
      />

      <SlideOver
        open={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onSave={handleUpdateIssue}
        title="Detalle de Incidencia"
        isSubmitting={isSubmitting}
      >
        {selectedIssue && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase">
                Título
              </label>
              <p className="mt-1 text-lg font-semibold text-white">
                {selectedIssue.title}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase">
                Caso de Prueba Relacionado
              </label>
              <p className="mt-1 text-sm text-indigo-300">
                {selectedIssue.testCase?.title || "N/A"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase">
                Descripción / Evidencia
              </label>
              <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded-md">
                <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                  {selectedIssue.description || "Sin descripción detallada."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-2">
                  Estado
                </label>
                <select
                  name="status"
                  defaultValue={selectedIssue.status}
                  className="w-full p-2 bg-[#1e293b] text-white border border-white/10 rounded-md text-sm outline-none focus:border-indigo-500"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="ANALISIS">ANALISIS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-2">
                  Severidad
                </label>
                <select
                  name="severity"
                  defaultValue={selectedIssue.severity}
                  className="w-full p-2 bg-[#1e293b] text-white border border-white/10 rounded-md text-sm outline-none focus:border-indigo-500"
                >
                  <option value="BAJA">BAJA</option>
                  <option value="MEDIA">MEDIA</option>
                  <option value="ALTA">ALTA</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-[10px] text-gray-500">
                Registrada el:{" "}
                {new Date(selectedIssue.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </SlideOver>
    </>
  );
}