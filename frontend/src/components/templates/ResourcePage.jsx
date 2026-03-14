import { useEffect, useState, useCallback } from "react";
import api from "../../api/client";
import { Table } from "../ui/Table";
import { SearchInput } from "../ui/SearchInput";
import { SlideOver } from "../ui/SideOver";
import { useSearch } from "../../hooks/useSearch";
import { useForm } from "../../hooks/useForm";

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

    // 1. Extraemos la lógica de carga para poder reutilizarla
    const fetchData = useCallback(async () => {
        // No ponemos loading(true) aquí para evitar parpadeos molestos 
        // en actualizaciones pequeñas, pero puedes ponerlo si prefieres.
        try {
            const response = await api.get(endpoint);
            setItems(response.data);
        } catch (error) {
            console.error(`Error cargando ${endpoint}:`, error);
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    // Carga inicial
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Lógica de búsqueda
    const { search, setSearch, filteredItems } = useSearch(items, searchKeys);

    // Lógica de formulario
    const { formData, errors, setErrors, handleChange, resetForm } = useForm(initialFormValues);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate ? validate(formData) : {};
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await api.post(endpoint, formData);
            // Tras crear, recargamos todos los datos para asegurar sincronía con el backend
            fetchData(); 
            setOpen(false);
            resetForm();
        } catch (error) {
            console.error("Error al guardar:", error);
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
                <h1 className="text-2xl font-bold text-slate-200">{title}</h1>
                {canCreate && renderForm && (
                    <button
                        onClick={() => setOpen(true)}
                        className="px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg cursor-pointer hover:bg-indigo-700 font-medium"
                    >
                        + Añadir {resourceName}
                    </button>
                )}
            </div>

            <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Buscar ${resourceName}...`}
            />

            <Table headers={tableHeaders}>
                {loading ? (
                    <tr>
                        <td colSpan={tableHeaders.length} className="px-6 py-20 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                                <p className="text-slate-400 animate-pulse">Cargando...</p>
                            </div>
                        </td>
                    </tr>
                ) : filteredItems.length === 0 ? (
                    <tr>
                        <td colSpan={tableHeaders.length} className="px-6 py-20 text-center text-slate-500">
                            No se encontraron {resourceName}s.
                        </td>
                    </tr>
                ) : (
                    /* 2. AQUÍ ESTÁ EL CAMBIO CLAVE: Pasamos fetchData a cada fila */
                    filteredItems.map((item) => renderRow(item, fetchData))
                )}
            </Table>

            {canCreate && renderForm && (
                <SlideOver
                    open={open}
                    onClose={handleClose}
                    onSave={handleSubmit}
                    title={`Nuevo ${resourceName}`}
                >
                    {renderForm(formData, handleChange, errors)}
                </SlideOver>
            )}
        </div>
    );
}