import { useEffect, useState } from "react"
import api from "../api/client"
import { SearchInput } from "../components/ui/SearchInput";

function Equipo() {
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

    return (
        <div className="space-y-4">
            {/* 1. FILA SUPERIOR: TÍTULO Y BOTÓN (Requisito R01T03)*/}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Equipo</h1>
                <button className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                    + Invitar Usuario
                </button>
            </div>

            {/* 2. BUSCADOR (Requisito R01T03) */}
            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre o email..."/>

            {/* 3. CONTENEDOR DE LA TABLA (Requisito R01T03)*/}
            <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nombre</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Rol</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* AQUÍ TIENES QUE HACER EL MAP */}
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
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Equipo;