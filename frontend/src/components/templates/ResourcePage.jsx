import { useEffect, useState, useCallback } from "react";
import api from "../../api/client";
import { Table } from "../ui/Table";
import { SearchInput } from "../ui/SearchInput";
import { SlideOver } from "../ui/SideOver";
import { useSearch } from "../../hooks/useSearch";
import { useForm } from "../../hooks/useForm";
import { Plus, Database, AlertCircle, Loader2 } from "lucide-react";

/**
 * Componente genérico para gestionar páginas de recursos (Proyectos, Tests, etc.)
 * Centraliza la lógica de carga, búsqueda, listado y creación.
 */
export default function ResourcePage({
    title,
    endpoint,
    resourceName,
    tableHeaders,
    searchKeys,
    initialFormValues = {},
    validate = () => ({}),
    renderRow,
    renderForm,
    canCreate = true
}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // Función para obtener los datos del servidor basándose en el endpoint propocionado
    const fetchData = useCallback(async () => {
        try {
            const response = await api.get(endpoint);
            setItems(response.data);
        } catch (error) {
            console.error(`Error loading ${endpoint}:`, error);
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Hooks personalizados para manejar la lógica de búsqueda y el estado del formulario
    const { search, setSearch, filteredItems } = useSearch(items, searchKeys);
    const { formData, errors, setErrors, handleChange, resetForm } = useForm(initialFormValues);

    // Maneja el envío del formulario para crear un nuevo recurso
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación local antes de enviar a la API
        const newErrors = validate ? validate(formData) : {};
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await api.post(endpoint, formData);
            fetchData(); // Refresca la lista tras la creación
            setOpen(false);
            resetForm();
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    // Limpia el estado al cerrar el panel lateral (SlideOver)
    const handleClose = () => {
        setOpen(false);
        setErrors({});
        resetForm();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Header: Título y botón de acción principal */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Database size={16} className="text-indigo-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">System Resource</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                        {title}
                    </h1>
                </div>

                {canCreate && renderForm && (
                    <button
                        onClick={() => setOpen(true)}
                        className="group relative flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                        Add {resourceName}
                    </button>
                )}
            </div>

            {/* Barra de búsqueda dinámica */}
            <div className="p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm text-slate-800">
                <SearchInput
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`Filter ${resourceName} by ${searchKeys.join(', ')}...`}
                />
            </div>

            {/* Listado principal de datos */}
            <div className="bg-[#161B2B]/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
                <Table headers={tableHeaders}>
                    {loading ? (
                        /* Estado de carga: Skeleton o Spinner */
                        <tr>
                            <td colSpan={tableHeaders.length} className="px-6 py-32 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 size={40} className="text-indigo-500 animate-spin opacity-50" />
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 animate-pulse">Syncing Database...</p>
                                </div>
                            </td>
                        </tr>
                    ) : filteredItems.length === 0 ? (
                        /* Estado vacío: Sin resultados */
                        <tr>
                            <td colSpan={tableHeaders.length} className="px-6 py-32 text-center">
                                <div className="flex flex-col items-center gap-3 opacity-40">
                                    <AlertCircle size={48} className="text-slate-600" />
                                    <p className="text-sm font-medium text-slate-500">
                                        No {resourceName} records found.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        /* Renderizado dinámico de filas proporcionado por el componente padre */
                        filteredItems.map((item) => renderRow(item, fetchData))
                    )}
                </Table>
            </div>

            {/* Panel lateral para la creación de recursos */}
            {canCreate && renderForm && (
                <SlideOver
                    open={open}
                    onClose={handleClose}
                    onSave={handleSubmit}
                    className="top-20 h-[calc(100vh-5rem)] z-[90]"
                    title={
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <Plus size={20} className="text-indigo-500" />
                            </div>
                            <span className="font-black italic uppercase tracking-tight">New {resourceName}</span>
                        </div>
                    }
                >
                    <div className="mt-8">
                        {renderForm(formData, handleChange, errors)}
                    </div>
                </SlideOver>
            )}
        </div>
    );
}