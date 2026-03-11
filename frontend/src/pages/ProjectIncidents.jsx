import ResourcePage from "../components/templates/ResourcePage";
import { useParams } from "react-router-dom";
import api from "../api/client";

export default function ProjectIssues() {
  const { id: projectId } = useParams();

  const severityColors = {
    BAJA: "text-blue-400 border-blue-400/20 bg-blue-400/10",
    MEDIA: "text-amber-400 border-amber-400/20 bg-amber-400/10",
    ALTA: "text-red-400 border-red-400/20 bg-red-400/10",
  };

  const statusColors = {
    OPEN: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    ANALISIS: "bg-indigo-500/10 text-indigo-400 border-indigo-400/20",
    RESOLVED: "bg-green-500/10 text-green-400 border-green-500/20",
    CLOSED: "bg-white/5 text-white/40 border-white/10",
  };

  return (
    <ResourcePage
      title="Incidencias"
      resourceName="Incidencia"
      endpoint={`/projects/${projectId}/issues`}
      tableHeaders={["Incidencia", "Caso de Prueba", "Severidad", "Estado", "Acciones"]}
      searchKeys={["title"]}
      canCreate={false} // Reforzamos que no se cree desde aquí
      renderRow={(issue) => (
        <tr key={issue.id} className="transition-colors border-t border-white/5 hover:bg-white/5">
          <td className="px-6 py-4">
            {/* Cambiado a text-black para que se vea igual que en la tabla de Pruebas */}
            <div className="text-sm font-semibold text-black">{issue.title}</div>
            {/* Descripción más sutil abajo */}
            <div className="text-xs text-slate-500 truncate max-w-[250px]">
              {issue.description || "Sin descripción"}
            </div>
          </td>
          <td className="px-6 py-4">
            <div className="text-sm text-slate-600">
              {issue.testCase?.title || (
                <span className="italic text-slate-400 text-xs">Manual / General</span>
              )}
            </div>
          </td>
          <td className="px-6 py-4">
            <span className={`px-2 py-1 text-[10px] font-bold rounded border ${severityColors[issue.severity]}`}>
              {issue.severity}
            </span>
          </td>
          <td className="px-6 py-4">
            <span className={`px-2 py-1 text-[10px] font-bold rounded border ${statusColors[issue.status]}`}>
              {issue.status}
            </span>
          </td>
          <td className="px-6 py-4 text-right space-x-3">
            <button 
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              onClick={() => alert("Próximamente: Detalle")}
            >
              Detalle
            </button>
          </td>
        </tr>
      )}
    />
  );
}