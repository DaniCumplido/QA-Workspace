import { Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router";

function MainLayout() {
    const { user } = useAuth();

    return (
        <div className="flex min-h-screen">
            {/* SIDEBAR */}
            <aside className="w-64 p-6 text-white bg-gray-900">
                <h2 className="mb-8 text-2xl font-bold">QA Workspace</h2>
                <nav>
                    <ul className="space-y-4">
                        <li className="text-slate-300">
                            <Link to="/" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                Dashboard
                            </Link>
                        </li>
                        <li className="text-slate-300">
                            <Link to="/projects" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                Proyectos
                            </Link>
                        </li>
                        {user?.role === "ADMIN" && (
                            <li className="text-slate-300">
                                <Link to="/team" className="font-semibold text-indigo-400 hover:text-indigo-300">
                                    Equipo
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </aside>

            {/* CONTENIDO DERECHA */}
            <div className="flex flex-col flex-1">
                {/* HEADER */}
                <header className="flex items-center justify-end h-16 px-8 bg-white border-b">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-600"><span>{user?.full_name} ({user?.role})</span></span>
                        <div className="w-8 h-8 bg-blue-100 rounded-full"></div>
                    </div>
                </header>

                {/* PÁGINA DINÁMICA */}
                <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout;