import { useForm } from "../hooks/useForm";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client"

export default function Register() {
    const navigate = useNavigate();
    const { formData, errors, setErrors, loading, setLoading, handleChange } = useForm({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        let newErrors = {};

        // 1. VALIDACIÓN DE EMAIL
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Introduce un correo electrónico válido";
        }

        // 2. VALIDACIÓN DE CONTRASEÑA
        // Evitamos inyecciones de SQL y forzamos una contraseña segura
        if (!formData.password || formData.password.length > 30) {
            newErrors.password = "Las contraseñas no tienen más de 30 caracteres";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            // Aquí la llamada al backend para validar el registro
            const exists = await api.get(`/users/${formData.email}`)
            if (!exists) return;
            // Aquí el inicio de sesión tras el registro
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password
            });

            if (error) throw error;

            // OJO AQUÍ: Supabase a veces no da error pero el user ya existe (si hay confirmación email)
            // Comprobamos si nos ha devuelto identidades vacías
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                setErrors({ email: "Este correo ya está registrado y confirmado." });
                return;
            }

            alert("¡Registro completado! Revisa tu email para confirmar.");
            navigate("/");
        } catch (error) {
            if (error.response?.status === 404) {
                setErrors({ auth: "Este email no está en la lista de invitados." });
            } else {
                setErrors({ auth: error.message || "Error al registrarse" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center min-h-screen px-6 py-12 bg-gray-900 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="QA Workplace"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    className="w-auto h-10 mx-auto"
                />
                <h2 className="mt-10 text-2xl font-bold tracking-tight text-center text-white">
                    Register your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Alerta de error de autenticación global */}
                    {errors.auth && (
                        <div className="p-3 text-sm text-red-400 border rounded-md border-red-500/50 bg-red-500/10">
                            {errors.auth}
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-100">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                name="email" value={formData.email} onChange={handleChange}
                                id="email"
                                type="email"
                                required
                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 outline-white/10 focus:outline-indigo-500 sm:text-sm"
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-100">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                name="password" value={formData.password} onChange={handleChange}
                                id="password"
                                type="password"
                                required
                                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-white outline-1 outline-white/10 focus:outline-indigo-500 sm:text-sm"
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-indigo-500 disabled:opacity-50"
                    >
                        {loading ? "Registrando..." : "Login In"}
                    </button>
                </form>

                <p className="mt-10 text-sm text-center text-gray-400">
                    Not a member?{' '}
                    <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    )
}