import { NavLink, useParams, useNavigate } from "react-router-dom";
import {
    ChartBarIcon,
    ClipboardDocumentCheckIcon,
    BugAntIcon
} from '@heroicons/react/20/solid';

const tabs = [
    { name: 'Resumen', href: '', icon: ChartBarIcon, end: true },
    { name: 'Test Cases', href: 'tests', icon: ClipboardDocumentCheckIcon },
    { name: 'Incidencias', href: 'incidents', icon: BugAntIcon },
];

export default function ProjectTabs() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div>
            {/* Vista Móvil: Un select que cambia la ruta */}
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">Selecciona una pestaña</label>
                <select
                    id="tabs"
                    onChange={(e) => navigate(e.target.value)}
                    className="block w-full py-2 pl-3 pr-10 text-white rounded-md border-white/10 bg-white/5 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                >
                    {tabs.map((tab) => (
                        <option key={tab.name} value={tab.href}>{tab.name}</option>
                    ))}
                </select>
            </div>

            {/* Vista Escritorio: Los tabs de la imagen */}
            <div className="hidden sm:block">
                <div className="border-b border-white/10">
                    <nav className="flex -mb-px space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <NavLink
                                key={tab.name}
                                to={tab.href}
                                end={tab.end}
                                className={({ isActive }) => `
                  group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium transition-colors
                  ${isActive
                                        ? 'border-indigo-400 text-indigo-400'
                                        : 'border-transparent text-gray-400 hover:border-white/20 hover:text-gray-300'}
                `}
                            >
                                <tab.icon
                                    className={`-ml-0.5 mr-2 h-5 w-5 transition-colors`}
                                    aria-hidden="true"
                                />
                                <span>{tab.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
}