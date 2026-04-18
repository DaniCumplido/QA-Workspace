import { useEffect, useState } from "react";
import ResourcePage from "../components/templates/ResourcePage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/client";
import {
    Folder,
    Calendar,
    AlignLeft,
    UserCheck,
    ArrowRight,
    Target
} from "lucide-react";

/**
 * Project Management Page: Permite listar, crear y asignar proyectos.
 * Incluye lógica de permisos basada en roles (ADMIN/MANAGER para gestión, TESTER para visualización).
 */
export default function Projects() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [testers, setTesters] = useState([]);

    // Verificación de nivel de acceso para operaciones de escritura/asignación
    const hasPermission = user.role === "ADMIN" || user.role === "MANAGER";

    useEffect(() => {
        async function fetchTesters() {
            try {
                const res = await api.get("/users");
                // Filtrar solo usuarios con rol de tester para el dropdown de asignación
                const onlyTesters = res.data.filter(u => u.role === "TESTER");
                setTesters(onlyTesters);
            } catch (err) {
                console.error("Error fetching testers pool:", err);
            }
        }
        if (hasPermission) fetchTesters();
    }, [hasPermission]);

    const handleStatusUpdate = async (projectId, newStatus, refresh) => {
        try {
            await api.patch(`/projects/${projectId}/status`, { status: newStatus });
            if (refresh) refresh();
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to update status";
            alert("⚠️ " + msg);
            if (refresh) refresh();
        }
    };

    const handleAssignTester = async (projectId, testerId, refresh) => {
        try {
            await api.patch(`/projects/${projectId}/assign`, { testerId });
            if (refresh) refresh();
        } catch (error) {
            alert("⚠️ Error assigning lead tester");
            if (refresh) refresh();
        }
    };

    return (
        <ResourcePage
            title="Project Management"
            resourceName="Project"
            endpoint="/projects"
            tableHeaders={["Identification", "Lifecycle Status", "Test Lead", "Operations"]}
            searchKeys={["name"]}
            initialFormValues={{
                name: "",
                description: "",
                startDate: "",
                endDate: ""
            }}
            validate={(data) => {
                let err = {};
                if (data.name.length < 3) err.name = "Project identity too short";
                if (!data.description) err.description = "Mission scope is required";
                if (!data.startDate) err.startDate = "Deployment date required";
                if (!data.endDate) err.endDate = "Completion date required";
                if (data.startDate && data.endDate && data.startDate > data.endDate) {
                    err.endDate = "Chronology violation: End date precedes Start date";
                }
                return err;
            }}
            renderRow={(project, refresh) => (
                <tr key={project.id} className="group border-b border-slate-100 hover:bg-slate-50 transition-all">
                    <td className="px-6 py-5">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                {project.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">
                                ID: {project.id.split('-')[0]}...
                            </span>
                        </div>
                    </td>
                    <td className="px-6 py-5">
                        <select
                            disabled={!hasPermission}
                            value={project.status}
                            onChange={(e) => handleStatusUpdate(project.id, e.target.value, refresh)}
                            className={`text-[10px] font-black tracking-widest py-1 px-3 rounded-lg bg-white border transition-all focus:outline-none shadow-sm
                                ${project.status === 'CERRADO' ? 'border-rose-200 text-rose-600 bg-rose-50' :
                                    project.status === 'EN_CURSO' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' :
                                        'border-indigo-200 text-indigo-600 bg-indigo-50'} 
                                disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <option value="RECIBIDO">RECEIVED</option>
                            <option value="EN_CURSO">IN PROGRESS</option>
                            <option value="CERRADO">CLOSED</option>
                        </select>
                    </td>

                    <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                            {hasPermission ? (
                                <div className="relative flex items-center">
                                    <UserCheck size={14} className="absolute left-0 text-indigo-500" />
                                    <select
                                        value={project.testerId || ""}
                                        onChange={(e) => handleAssignTester(project.id, e.target.value, refresh)}
                                        className="pl-5 bg-transparent text-xs font-bold text-slate-600 border-b border-slate-200 focus:border-indigo-500 focus:outline-none cursor-pointer hover:text-indigo-600 transition-colors"
                                    >
                                        <option value="">Unassigned</option>
                                        {testers.map(t => (
                                            <option key={t.id} value={t.id}>
                                                {t.full_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <span className="text-xs font-bold text-slate-500 italic">
                                    {project.tester?.full_name || "Unassigned"}
                                </span>
                            )}
                        </div>
                    </td>

                    <td className="px-6 py-5 text-right">
                        <button
                            onClick={() => navigate(`/projects/${project.id}/tests`)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all group/btn shadow-sm"
                        >
                            Run Tests
                            <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </td>
                </tr>
            )}
            renderForm={(formData, handleChange, errors) => (
                <div className="space-y-7 mt-8">
                    <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex gap-3 items-center">
                        <Folder className="text-indigo-400" size={18} />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                            Environment Configuration Protocol
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                                <Target size={12} className="text-indigo-500" />
                                Project Designation
                            </label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                type="text"
                                placeholder="e.g., API Regression Suite 2.0"
                                className="block w-full rounded-xl bg-black/30 border border-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all text-sm font-medium"
                            />
                            {errors.name && <p className="text-[10px] font-bold text-rose-500 uppercase italic ml-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                                    <Calendar size={12} className="text-indigo-500" />
                                    Launch Date
                                </label>
                                <input
                                    name="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl bg-black/30 border border-white/5 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all text-sm [color-scheme:dark]"
                                />
                                {errors.startDate && <p className="text-[10px] font-bold text-rose-500 uppercase italic ml-1">{errors.startDate}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                                    <Calendar size={12} className="text-indigo-500" />
                                    Deadline
                                </label>
                                <input
                                    name="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl bg-black/30 border border-white/5 px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all text-sm [color-scheme:dark]"
                                />
                                {errors.endDate && <p className="text-[10px] font-bold text-rose-500 uppercase italic ml-1">{errors.endDate}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                                <AlignLeft size={12} className="text-indigo-500" />
                                Technical Scope & Objectives
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Outline the testing scope, target environments, and mission objectives..."
                                className="block w-full rounded-xl bg-black/30 border border-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all text-sm font-medium resize-none"
                            />
                            {errors.description && <p className="text-[10px] font-bold text-rose-500 uppercase italic ml-1">{errors.description}</p>}
                        </div>
                    </div>
                </div>
            )}
            canCreate={hasPermission}
        />
    );
}