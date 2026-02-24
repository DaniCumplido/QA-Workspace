import { useEffect, useState } from "react"
import api from "../api/client"
import { SearchInput } from "../components/ui/SearchInput";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { SlideOver } from "../components/ui/SideOver";
import { Table } from "../components/ui/Table";

export default function Equipo() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Función asíncrona para obtener datos
        const loadUsers = async () => {
            try {
                const response = await api.get("/users");
                console.log("¿Qué hay en response.data?", response.data); // <-- AÑADE ESTO
                // Axios guarda la respuesta del servidor en la propiedad .data
                setUsers(response.data);
            } catch (error) {
                console.error("Vaya, parece que el backend no responde:", error);
            }
        };

        loadUsers();
    }, []); // El array vacío asegura que solo pida los datos una vez

    const [search, setSearch] = useState("");

    const filteredUsers = users.filter((user) => {
        const term = search.toLowerCase();
        return (
            user.full_name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
        )
    })

    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({ full_name: "", email: "", role: "TESTER" });

    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrors({})
        let newErrors = {};

        // VALIDACIÓN DE NOMBRE
        if (formData.full_name.trim().length < 3) {
            newErrors.full_name = "El nombre debe tener al menos 3 caracteres";
        }

        // VALIDACIÓN DE EMAIL (Regex estándar)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Introduce un correo electrónico válido";
        }

        // Si hay errores, cortamos aquí y los guardamos en el estado
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            // Hacemos post a la api
            const response = await api.post("/users", formData);
            // Guardamos el usr generado en el registro que hicimos
            // Así nos evitamos otra llamada a la api
            setUsers(prev => [...prev, response.data]);
            // Cerramos el aside
            setOpen(false);
            // Limpiamos el form data
            setFormData({ full_name: "", email: "", role: "TESTER" });
            // Limpiamos el array de errores
            setErrors({});
        } catch (error) {
            // Validación del lado del servidor (por si el email ya existe)
            if (error.response?.status === 409) {
                setErrors({ email: "Este correo ya está registrado" });
            } else {
                console.error("Error al guardar", error);
            }
        }
    }

    const handleClose = () => {
        setOpen(false);
        setErrors({});
        setFormData({ full_name: "", email: "", role: "TESTER" });
    };

    return (
        <div className="space-y-4">
            {/* 1. FILA SUPERIOR: TÍTULO Y BOTÓN)*/}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Equipo</h1>
                <button onClick={() => setOpen(true)} className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700">
                    + Invitar Usuario
                </button>
            </div>

            {/* 2. BUSCADOR */}
            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o email..." />

            {/* 3. TABLA */}
            <Table headers={["Nombre", "Email", "Rol"]}>
                {filteredUsers.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                            {user.full_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            {/* Pista: Intenta poner el rol dentro de un <span> con fondo azulito */}
                            <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                                {user.role}
                            </span>
                        </td>
                    </tr>
                ))}
            </Table>

            {/* 4. SideOver (UI de formulario creación usuario) */}
            <SlideOver
                open={open}
                onClose={handleClose}
                onSave={handleSubmit} // Pasamos la función que dispara el API
                title="Invitar usuario"
            >
                {/* Solo los campos, sin botones ni etiquetas <form> adicionales */}
                <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <label htmlFor="name" className="block font-medium text-white text-sm/6">
                            Nombre y apellidos
                        </label>
                        <div className="mt-2">
                            <input
                                required
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                id="full_name"
                                name="full_name"
                                type="text"
                                autoComplete="full_name"
                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                            />
                            {errors.full_name && (
                                <p className="mt-1 text-sm text-red-400">{errors.full_name}</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="email" className="block font-medium text-white text-sm/6">
                            Correo
                        </label>
                        <div className="mt-2">
                            <input
                                required
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="role" className="block font-medium text-white text-sm/6">
                            Rol
                        </label>
                        <div className="grid grid-cols-1 mt-2">
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                id="role"
                                name="role"
                                autoComplete="role-name"
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white/5 py-1.5 pr-8 pl-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 *:bg-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="MANAGER">Manager</option>
                                <option value="TESTER">Tester</option>
                            </select>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="self-center col-start-1 row-start-1 mr-2 text-gray-400 pointer-events-none size-5 justify-self-end sm:size-4"
                            />
                        </div>
                    </div>
                </div>
            </SlideOver>
        </div>
    );
}