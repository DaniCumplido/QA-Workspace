import { Outlet, useParams } from "react-router-dom";
import ProjectTabs from "../components/ui/ProjectTabs";

export default function ProjectLayout() {
    const { id } = useParams();

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="flex items-center space-x-2 text-sm text-gray-400">
                            <li>Proyectos</li>
                            <li><svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" />
                            </svg></li>
                            <li className="font-medium text-white">#{id}</li>
                        </ol>
                    </nav>
                    <h2 className="mt-2 text-2xl font-bold leading-7 text-black sm:truncate sm:text-3xl">
                        Nombre del Proyecto
                    </h2>
                </div>
            </div>

            <ProjectTabs />

            <div className="mt-6">
                <Outlet />
            </div>
        </div>
    );
}