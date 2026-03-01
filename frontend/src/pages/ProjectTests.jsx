import ResourcePage from "../components/templates/ResourcePage";
import { useNavigate, useParams } from "react-router-dom";

export default function ProjectTests() {
    const navigate = useNavigate();
    const { id: projectId } = useParams();

    return (
        <ResourcePage
            title="Pruebas"
            resourceName="Prueba"
            endpoint={`/projects/${projectId}/tests`}
            tableHeaders={["Nombre", "Estado", "Acciones"]}
            searchKeys={["name"]}
            initialFormValues={{ name: "", steps: "", expected: "" }}
            validate={(data) => {
                let err = {}
                if (data.name.length < 3) err.name = "Nombre demasiado corto"
                if (data.name.length > 70) err.name = "Nombre demasiado largo"
                if (!data.steps) err.steps = "Pasos obligatorio"
                if (!data.expected) err.expected = "Resultado esperado obligatorio"
                return err;
            }}
            renderRow={(test) => (
                <tr key={test.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-white">{test.name}</td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-semibold text-blue-400 border rounded-full bg-blue-400/10 border-blue-400/20">
                            {test.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button
                            onClick={() => navigate(`/projects/${test.id}`)}
                            className="font-medium text-indigo-400 hover:text-indigo-300"
                        >
                            Detalle
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
                        <label className="text-sm text-white">Pasos</label>
                        <textarea
                            name="steps"
                            value={formData.steps}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-2 text-white rounded bg-white/5 border-white/10 focus:outline-indigo-500"
                        />
                        {errors.steps && <p className="mt-1 text-xs text-red-400">{errors.steps}</p>}
                    </div>
                    <div>
                        <label className="text-sm text-white">Resultado esperado</label>
                        <textarea
                            name="expected"
                            value={formData.expected}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-2 text-white rounded bg-white/5 border-white/10 focus:outline-indigo-500"
                        />
                        {errors.expected && <p className="mt-1 text-xs text-red-400">{errors.expected}</p>}
                    </div>
                </div>
            )}
        />
    )
}