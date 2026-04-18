import ResourcePage from "../components/templates/ResourcePage";
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { UserPlus } from "lucide-react";

/**
 * Team Management Component
 * Maneja la visualización de la lista de usuarios y la creación de nuevos miembros
 * con estilos diferenciados por rol jerárquico.
 */
export default function Team() {
    // Estilos visuales dinámicos basados en el rol del sistema
    const roleStyles = {
        ADMIN: "text-rose-400 bg-rose-400/5 border-rose-400/20 shadow-[0_0_15px_rgba(251,113,133,0.1)]",
        MANAGER: "text-indigo-400 bg-indigo-400/5 border-indigo-400/20 shadow-[0_0_15px_rgba(129,140,248,0.1)]",
        TESTER: "text-emerald-400 bg-emerald-400/5 border-emerald-400/20 shadow-[0_0_15px_rgba(52,211,153,0.1)]",
    };

    return (
        <ResourcePage
            title="Team Management"
            resourceName="Member"
            endpoint="/users"
            tableHeaders={["User Identity", "Email Address", "System Role"]}
            searchKeys={["full_name", "email"]}
            initialFormValues={{ full_name: "", email: "", role: "TESTER" }}

            validate={(data) => {
                let err = {};
                if (data.full_name.trim().length < 3) {
                    err.full_name = "Full name must be at least 3 characters";
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    err.email = "Please provide a valid corporate email";
                }
                return err;
            }}

            renderRow={(user) => (
                <tr key={user.id} className="group transition-all border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                            {/* Avatar generado dinámicamente con las iniciales */}
                            <div className="w-9 h-9 rounded-xl bg-white/[0.03] backdrop-blur-md flex items-center justify-center border border-white/10 text-indigo-400 font-black text-[10px] tracking-tighter shadow-inner">
                                {user.full_name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {user.full_name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">
                                    UUID: {user.id.substring(0, 8)}
                                </span>
                            </div>
                        </div>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                        <span className="font-mono text-[11px] text-slate-800 group-hover:text-slate-500 transition-colors">
                            {user.email}
                        </span>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border uppercase transition-all duration-300 ${roleStyles[user.role] || "text-slate-400 border-slate-400/20"}`}>
                            <span className="w-1 h-1 rounded-full bg-current mr-2 animate-pulse"></span>
                            {user.role}
                        </span>
                    </td>
                </tr>
            )}

            renderForm={(formData, handleChange, errors) => (
                <div className="space-y-8">
                    {/* Header informativo del SlideOver */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 mb-8">
                        <div className="p-2 bg-indigo-500 rounded-lg">
                            <UserPlus className="text-white" size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">Add Team Member</h4>
                            <p className="text-[10px] text-indigo-400/60 font-medium">Create a new user account and assign system permissions</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Input: Nombre Completo */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                                    Full Name
                                </label>
                                <input
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter full name"
                                    className="block w-full rounded-xl bg-black/20 border border-white/5 px-4 py-3.5 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all sm:text-sm font-medium"
                                />
                                {errors.full_name && <p className="text-[10px] font-bold text-rose-500 uppercase italic ml-1">{errors.full_name}</p>}
                            </div>

                            {/* Input: Correo Electrónico */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                                    Email Address
                                </label>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="user@qalab.io"
                                    className="block w-full rounded-xl bg-black/20 border border-white/5 px-4 py-3.5 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all sm:text-sm font-medium"
                                />
                                {errors.email && <p className="text-[10px] font-bold text-rose-500 uppercase italic ml-1">{errors.email}</p>}
                            </div>

                            {/* Select: Rol del Usuario */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                                    Account Role
                                </label>
                                <div className="relative">
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full appearance-none rounded-xl bg-black/20 border border-white/5 px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500/50 transition-all sm:text-sm font-bold uppercase tracking-widest cursor-pointer"
                                    >
                                        <option className="bg-[#0F1423]" value="ADMIN">Administrator</option>
                                        <option className="bg-[#0F1423]" value="MANAGER">Project Manager</option>
                                        <option className="bg-[#0F1423]" value="TESTER">QA Engineer</option>
                                    </select>
                                    <ChevronDownIcon className="absolute text-slate-500 pointer-events-none right-4 top-4 size-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        />
    );
}