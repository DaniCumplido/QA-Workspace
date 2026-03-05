import ResourcePage from "../components/templates/ResourcePage";
import { useParams } from "react-router-dom";
import { useState } from "react";
import api from "../api/client";

export default function ProjectTests() {
    const { id: projectId } = useParams();
    // 1. Creamos un contador para forzar el refresco
    const [refreshSignal, setRefreshSignal] = useState(0);

    const handleStatusChange = async (testId, newStatus) => {
        try {
            await api.patch(`/projects/${projectId}/tests/${testId}`, {
                status: newStatus
            });

            // 2. En lugar de intentar actualizar un estado que no le pertenece,
            // sumamos 1 al contador. Esto hará que ResourcePage se vuelva a montar
            // y ejecute su useEffect de carga automáticamente.
            setRefreshSignal(prev => prev + 1);
            
        } catch (error) {
            alert("Error al actualizar el estado");
        }
    };

    return (
        <ResourcePage
            // 3. LA CLAVE: Al cambiar la key, React reinicia el componente
            key={refreshSignal} 
            title="Pruebas"
            resourceName="Prueba"
            endpoint={`/projects/${projectId}/tests`}
            // ... resto de tus props se mantienen igual
            tableHeaders={["Nombre", "Estado", "Acciones"]}
            searchKeys={["title"]}
            initialFormValues={{ title: "", steps: "", expected: "" }}
            validate={(data) => {
                let err = {}
                if (data.title.length < 3) err.title = "Nombre demasiado corto"
                if (!data.steps) err.steps = "Pasos obligatorio"
                if (!data.expected) err.expected = "Resultado esperado obligatorio"
                return err;
            }}
            renderRow={(test) => (
                <tr key={test.id} className="transition-colors border-t border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-black">{test.title}</td>
                    <td className="px-6 py-4">
                        <select
                            value={test.status}
                            onChange={(e) => handleStatusChange(test.id, e.target.value)}
                            className={`px-2 py-1 text-xs font-semibold rounded-full border bg-transparent cursor-pointer focus:outline-none ${
                                test.status === 'PASSED' ? 'text-green-400 border-green-400/20 bg-green-400/10' :
                                test.status === 'FAILED' ? 'text-red-400 border-red-400/20 bg-red-400/10' :
                                'text-blue-400 border-blue-400/20 bg-blue-400/10'
                            }`}
                        >
                            <option value="PENDING" className="text-blue-400 bg-gray-900">PENDING</option>
                            <option value="PASSED" className="text-green-400 bg-gray-900">PASSED</option>
                            <option value="FAILED" className="text-red-400 bg-gray-900">FAILED</option>
                        </select>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3.5">
                        <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                            Detalle
                        </button>
                        <button className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                            Editar
                        </button>
                    </td>
                </tr>
            )}
            renderForm={(formData, handleChange, errors) => (
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-white">Titulo</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 text-white rounded bg-white/5 border-white/10 focus:outline-indigo-500"
                        />
                        {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
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