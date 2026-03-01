import ResourcePage from "../components/templates/ResourcePage";
import {useNavigate} from "react-router-dom"
import { useAuth } from "../hooks/useAuth";

export default function Projects() {

    const navigate = useNavigate();

    const { user } = useAuth();
    const hasPermission = user.role === "ADMIN" || user.role === "MANAGER";

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
            renderRow={(project) => (
                <tr key={project.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-black">{project.name}</td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold text-blue-400 border rounded-full bg-blue-400/10 border-blue-400/20">
                            {project.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-black">
                        {project.tester?.full_name || "Sin asignar"}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="font-medium text-indigo-400 hover:text-indigo-300"
                        >
                            Entrar
                        </button>
                    </td>
                </tr>
            )}
            renderForm={(formData, handleChange, errors) => (
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-white">Nombre</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 text-white rounded bg-white/5 border-white/10 focus:outline-indigo-500"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="text-sm text-white">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-2 text-white rounded bg-white/5 border-white/10 focus:outline-indigo-500"
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
                    </div>
                </div>
            )}
            canCreate= {hasPermission}
        />
    );
}