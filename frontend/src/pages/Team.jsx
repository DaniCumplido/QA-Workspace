import ResourcePage from "../components/templates/ResourcePage";
import { ChevronDownIcon } from '@heroicons/react/16/solid';

export default function Team() {
    return (
        <ResourcePage
            title="Team members"
            resourceName="user"
            endpoint="/users"
            tableHeaders={["Name", "Email", "Role"]}
            searchKeys={["full_name", "email"]}
            initialFormValues={{ full_name: "", email: "", role: "TESTER" }}
            
            // Lógica de validación movida aquí
            validate={(data) => {
                let err = {};
                if (data.full_name.trim().length < 3) {
                    err.full_name = "El nombre debe tener al menos 3 caracteres";
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    err.email = "Introduce un correo electrónico válido";
                }
                return err;
            }}

            // Cómo se dibuja cada fila del equipo
            renderRow={(user) => (
                <tr key={user.id} className="transition-colors border-t border-white/5 hover:bg-white/5">
                    <td className="px-6 py-4 text-sm font-medium text-white whitespace-nowrap">
                        {user.full_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                        {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold text-blue-400 uppercase border rounded-full bg-blue-400/10 border-blue-400/20">
                            {user.role}
                        </span>
                    </td>
                </tr>
            )}

            // El contenido del formulario del SideOver
            renderForm={(formData, handleChange, errors) => (
                <div className="grid grid-cols-1 mt-10 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-white">Full name</label>
                        <input
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            type="text"
                            className="block w-full mt-2 rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 outline-white/10 focus:outline-indigo-500 sm:text-sm"
                        />
                        {errors.full_name && <p className="mt-1 text-xs text-red-400">{errors.full_name}</p>}
                    </div>

                    <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-white">Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            className="block w-full mt-2 rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 outline-white/10 focus:outline-indigo-500 sm:text-sm"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                    </div>

                    <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-white">Role</label>
                        <div className="relative mt-2">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full appearance-none rounded-md bg-white/5 py-1.5 pl-3 pr-10 text-white outline-1 outline-white/10 focus:outline-indigo-500 sm:text-sm"
                            >
                                <option className="bg-slate-800" value="ADMIN">Admin</option>
                                <option className="bg-slate-800" value="MANAGER">Manager</option>
                                <option className="bg-slate-800" value="TESTER">Tester</option>
                            </select>
                            <ChevronDownIcon className="absolute text-gray-400 pointer-events-none right-2 top-2 size-5" />
                        </div>
                    </div>
                </div>
            )}
        />
    );
}