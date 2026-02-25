import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div>
            <div className="mb-3">
                <h1>Hola, {user?.full_name || "Usuario"}</h1>
                {user.role === 'ADMIN' ? <p>Panel de Administración</p> : <p>Panel de Usuario</p>}
            </div>
            <ul className="space-y-1">
                <li><Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
                    Register
                </Link></li>
                <li><Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
                    Login
                </Link></li>
                <li><Link to="/equipo" className="font-semibold text-indigo-400 hover:text-indigo-300">
                    Equipo
                </Link></li>
            </ul>
        </div>
    );
}