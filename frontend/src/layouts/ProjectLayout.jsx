import { Outlet, useParams, Link } from "react-router-dom";
import ProjectTabs from "../components/ui/ProjectTabs";
import { ChevronRight, Folder, Hash, Calendar } from "lucide-react";

export default function ProjectLayout() {
    // Obtenemos el ID del proyecto directamente desde la URL
    const { id } = useParams();

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            
            {/* Cabecera del Proyecto: Contenedor con efecto de desenfoque y cristal (backdrop-blur) */}
            <div className="relative p-8 overflow-hidden bg-[#161B2B]/40 border border-white/5 rounded-[2rem] backdrop-blur-md shadow-2xl">
                
                {/* Elemento decorativo de fondo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex-1 min-w-0">
                        
                        {/* Sistema de migas de pan (Breadcrumb) estilizado */}
                        <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
                            <Link to="/projects" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                                <Folder size={12} />
                                Projects
                            </Link>
                            <ChevronRight size={14} className="text-slate-700" />
                            <span className="flex items-center gap-1 text-indigo-500/80">
                                <Hash size={12} />
                                {id.substring(0, 8)}
                            </span>
                        </nav>

                        {/* Título de la sección de detalles */}
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl sm:text-4xl font-black text-white leading-none tracking-tighter uppercase italic">
                                <span className="text-indigo-500">Project</span> Details
                            </h2>
                        </div>

                        {/* Metadatos rápidos: Fecha de creación e ID completo */}
                        <div className="flex items-center gap-6 mt-4 text-slate-400">
                            <div className="flex items-center gap-2 text-xs font-medium">
                                <Calendar size={14} className="text-indigo-400" />
                                <span>Created: 18 Apr 2026</span>
                            </div>
                            <div className="h-1 w-1 bg-slate-700 rounded-full"></div>
                            <div className="text-xs font-medium italic">
                                ID: <span className="text-slate-200">{id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sistema de pestañas para navegación interna (Tests, Issues, Dashboard, etc.) */}
            <div className="relative px-2">
                <ProjectTabs />
            </div>

            {/* Área de renderizado dinámica: Aquí se cargan las sub-rutas del proyecto */}
            <div className="bg-[#161B2B]/20 border border-white/5 rounded-[2rem] p-1 shadow-inner">
                <div className="p-2">
                   <Outlet />
                </div>
            </div>
        </div>
    );
}