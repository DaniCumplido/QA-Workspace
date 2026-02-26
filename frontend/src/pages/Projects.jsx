import { useEffect, useState } from "react";
import api from "../api/client";
import { Table } from "../components/ui/Table";
import { SearchInput } from "../components/ui/SearchInput"; // Asegúrate de importar esto
import { SlideOver } from "../components/ui/SideOver";
import {useSearch} from "../hooks/useSearch";
import {useForm} from "../hooks/useForm";

export default function Projects() {
    const [projects, setProjects] = useState([]); // Cambiado de users a projects
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const response = await api.get("/projects"); // Apuntamos a /projects
                setProjects(response.data);
            } catch (error) {
                console.error("Error al cargar proyectos:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    // Buscamos por el campo "name" del proyecto
    const { search, setSearch, filteredItems: filteredProjects } = useSearch(projects, ["name"]);

    const [open, setOpen] = useState(false);

    // El formulario inicializado con campos de Proyecto
    const {
        formData,
        setFormData,
        errors,
        setErrors,
        handleChange,
        resetForm
    } = useForm({ name: "", description: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        let newErrors = {};

        if (formData.name.trim().length < 3) {
            newErrors.name = "El nombre del proyecto es demasiado corto";
        }
        if (!formData.description.trim()) {
            newErrors.description = "La descripción es obligatoria";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await api.post("/projects", formData);
            setProjects(prev => [...prev, response.data]); // Actualizamos la lista local
            setOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error al guardar el proyecto", error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setErrors({});
        resetForm();
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Proyectos</h1>
                <button
                    onClick={() => setOpen(true)}
                    className="px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700"
                >
                    + Nuevo Proyecto
                </button>
            </div>

            <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre de proyecto..."
            />

            <Table headers={["Nombre", "Descripción", "Estado", "Asignado", "Acciones"]}>
                {loading ? (
                    // ESTADO DE CARGA: Ocupa todas las columnas con un mensaje o spinner
                    <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                                <p className="text-slate-400 animate-pulse">Cargando proyectos...</p>
                            </div>
                        </td>
                    </tr>
                ) : filteredProjects.length === 0 ? (
                    // ESTADO VACÍO: Si no hay proyectos después de cargar
                    <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-slate-500">
                            No se han encontrado proyectos.
                        </td>
                    </tr>
                ) : (
                    // ESTADO CON DATOS: Mapeo normal
                    filteredProjects.map((project) => (
                        <tr key={project.id} className="transition-colors border-t hover:bg-white/5 border-white/5">
                            <td className="px-6 py-4 text-sm font-medium text-white whitespace-nowrap">
                                {project.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400">
                                {project.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-semibold text-blue-400 border rounded-full bg-blue-400/10 border-blue-400/20">
                                    {project.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                                {project.tester?.full_name || "Sin asignar"}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="font-medium text-indigo-400 transition-colors cursor-pointer hover:text-indigo-300">
                                    Entrar
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </Table>

            <SlideOver
                open={open}
                onClose={handleClose}
                onSave={handleSubmit}
                title="Crear Nuevo Proyecto"
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white">Nombre</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full mt-2 text-white rounded-md bg-white/5 border-white/10 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="block w-full mt-2 text-white rounded-md bg-white/5 border-white/10 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
                    </div>
                </div>
            </SlideOver>
        </div>
    );
}