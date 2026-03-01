import ResourcePage from "../components/templates/ResourcePage";
import { useNavigate, useParams } from "react-router-dom";

export default function ProjectIncidents() {
    const navigate = useNavigate();
    const { id: projectId } = useParams();

    return (
        <ResourcePage
            title="Incidencias"
            resourceName="Incidencia"
            endpoint={`/projects/${projectId}/incidents`}
            canCreate={false} // <--- Esto oculta el botón de "Añadir" y el SlideOver
            tableHeaders={["Nombre", "Estado", "Severidad", "Acciones"]}
            searchKeys={["name"]}
            renderRow={(incident) => (
                <tr key={incident.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-white">
                        {incident.name}
                    </td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold text-blue-400 border rounded-full bg-blue-400/10 border-blue-400/20">
                            {incident.status}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`text-sm ${incident.severity === 'CRITICAL' ? 'text-red-400' : 'text-gray-400'
                            }`}>
                            {incident.severity}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button
                            onClick={() => navigate(`/incidents/${incident.id}`)}
                            className="font-medium text-indigo-400 hover:text-indigo-300"
                        >
                            Detalle
                        </button>
                    </td>
                </tr>
            )}
        />
    );
}