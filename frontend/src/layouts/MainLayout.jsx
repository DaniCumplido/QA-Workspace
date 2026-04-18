import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { 
    LayoutDashboard, 
    Briefcase, 
    Users, 
    LogOut, 
    ChevronRight,
    Search,
    Bell
} from "lucide-react";

function MainLayout() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Gestión del cierre de sesión mediante Supabase Auth
    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error.message);
        }
    };

    // Definición de los elementos de navegación. Se añade "Team" solo si el rol es ADMIN
    const navItems = [
        { to: "/", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { to: "/projects", label: "Projects", icon: <Briefcase size={20} /> },
        ...(user?.role === "ADMIN" ? [{ to: "/team", label: "Team", icon: <Users size={20} /> }] : []),
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#0B0F1A] text-slate-300 font-sans">
            
            {/* Barra de navegación superior fija */}
            <header className="h-20 px-8 flex items-center justify-between bg-[#0B0F1A]/80 backdrop-blur-xl border-b border-white/5 fixed top-0 w-full z-[100]">
                <div className="flex items-center gap-12">
                    {/* Branding de la aplicación */}
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-black text-white tracking-tighter">
                            QA<span className="text-indigo-500">WORKSPACE</span>
                        </h2>
                    </div>

                    {/* Barra de búsqueda global */}
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search system..." 
                            className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 w-64 transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Centro de notificaciones */}
                    <button className="relative text-slate-400 hover:text-white transition-colors">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0B0F1A]"></span>
                    </button>

                    <div className="h-8 w-px bg-white/10"></div>

                    {/* Información del perfil de usuario actual */}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-white leading-none">{user?.full_name || 'User'}</p>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-80">{user?.role || 'Guest'}</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                            {user?.full_name?.charAt(0) || 'U'}
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenedor principal para Sidebar y Contenido Dinámico */}
            <div className="flex flex-1 pt-20">
                
                {/* Menú lateral de navegación con posición fija */}
                <aside className="w-64 border-r border-white/5 bg-[#0F1423] fixed left-0 bottom-0 top-20 flex flex-col z-40">
                    <nav className="flex-1 px-4 py-8 overflow-y-auto">
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        className={({ isActive }) => `
                                            flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                                            ${isActive 
                                                ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                                                : "hover:bg-white/5 text-slate-400 hover:text-slate-200"}
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <span className="font-bold text-sm">{item.label}</span>
                                        </div>
                                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Sección inferior del Sidebar para acciones globales */}
                    <div className="p-4 border-t border-white/5 bg-black/20">
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all font-bold uppercase tracking-[0.2em] text-[10px] group"
                        >
                            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform duration-300" />
                            <span>System Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Área de renderizado de las rutas secundarias (Outlet) */}
                <main className="flex-1 ml-64 p-8 min-h-[calc(100vh-80px)]">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default MainLayout;