import ResourcePage from "../components/templates/ResourcePage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/client";

export default function Projects() {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    // Solo ADMIN y MANAGER pueden crear proyectos o cambiar estados
    const hasPermission = user.role === "ADMIN" || user.role === "MANAGER";

    const handleStatusUpdate = async (projectId, newStatus, refresh) => {
        try {
            await api.patch(`/projects/${projectId}/status`, { status: newStatus });
            alert(`Estado actualizado a ${newStatus}`);
            if (refresh) refresh(); // Recarga la tabla para ver el cambio reflejado
        } catch (error) {
            const msg = error.response?.data?.message || "Error al actualizar estado";
            alert("⚠️ " + msg);
            if (refresh) refresh(); // Refrescamos para revertir el select al valor real de la DB
        }
    };

    return (
        <ResourcePage
            title="PROJECTS"
            resourceName="proyecto"
            endpoint="/projects"
            tableHeaders={["Nombre", "Estado", "Asignado", "Acciones"]}
            searchKeys={["name"]}
            initialFormValues={{ name: "", description: "" }}
            validate={(data) => {
                let err = {};
                if (data.name.length < 3) err.name = "Nombre demasiado corto";
                if (!data.description) err.description = "Descripción obligatoria";
                return err;
            }}
            renderRow={(project, refresh) => (
                <tr key={project.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200">{project.name}</td>
                    <td className="px-6 py-4">
                        <select
                            disabled={!hasPermission}
                            value={project.status}
                            onChange={(e) => handleStatusUpdate(project.id, e.target.value, refresh)}
                            className={`text-xs font-bold py-1.5 px-3 rounded-lg bg-[#1e293b] border cursor-pointer focus:outline-none transition-all
                                ${project.status === 'CERRADO' ? 'border-indigo-500 text-indigo-400' : 
                                  project.status === 'EN_CURSO' ? 'border-green-500 text-green-400' : 
                                  'border-slate-500 text-slate-400'} 
                                disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <option value="RECIBIDO">RECIBIDO</option>
                            <option value="EN_CURSO">EN CURSO</option>
                            <option value="CERRADO">CERRADO</option>
                        </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                        {project.tester?.full_name || "Sin asignar"}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="px-4 py-2 text-sm font-semibold text-indigo-400 transition-colors bg-indigo-400/10 rounded-lg hover:bg-indigo-400/20"
                        >
                            Entrar
                        </button>
                    </td>
                </tr>
            )}
            renderForm={(formData, handleChange, errors) => (
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-300">Nombre</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2.5 mt-1 text-white rounded-lg bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-300">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-2.5 mt-1 text-white rounded-lg bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none"
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
                    </div>
                </div>
            )}
            canCreate={hasPermission}
        />
    );
}