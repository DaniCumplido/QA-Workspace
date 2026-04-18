import { useForm } from "../hooks/useForm";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Introduce un correo electrónico válido";
        }

        if (!formData.password || formData.password.length > 30) {
            newErrors.password = "Máximo 30 caracteres permitidos";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const exists = await api.get(`/users/${formData.email}`);
            if (!exists) return;

            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password
            });

            if (error) throw error;

            if (data.user && data.user.identities && data.user.identities.length === 0) {
                setErrors({ email: "Este correo ya está registrado." });
                return;
            }

            alert("¡Registro completado! Revisa tu email.");
            navigate("/");
        } catch (error) {
            if (error.response?.status === 404) {
                setErrors({ auth: "Acceso denegado: No estás en la lista de invitados." });
            } else {
                setErrors({ auth: error.message || "Fallo en la comunicación con el servidor" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden bg-[#0B0F1A] px-6 py-12 lg:px-8">
            {/* ELEMENTOS DE FONDO (GLOWS) */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full"></div>

            <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
                {/* LOGO Y TÍTULO */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-6">
                        <ShieldCheck className="text-white w-10 h-10" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-center text-white uppercase italic">
                        QA<span className="text-indigo-500">WORKSPACE</span> <span className="text-slate-500">Access</span>
                    </h2>
                    <p className="mt-2 text-sm text-slate-500 font-bold tracking-widest uppercase opacity-70">
                        Secure Environment v1.0
                    </p>
                </div>

                {/* TARJETA DE FORMULARIO (GLASSMOPHISM) */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {errors.auth && (
                            <div className="p-4 text-xs font-bold tracking-wide text-rose-400 border border-rose-500/20 bg-rose-500/10 rounded-2xl animate-pulse">
                                ERR_AUTH: {errors.auth}
                            </div>
                        )}

                        {/* CAMPO EMAIL */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                <Mail size={14} className="text-indigo-500" />
                                Credential ID
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                className="block w-full rounded-2xl bg-black/20 border border-white/5 px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all sm:text-sm"
                            />
                            {errors.email && <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider ml-1">{errors.email}</p>}
                        </div>

                        {/* CAMPO PASSWORD */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                                <Lock size={14} className="text-indigo-500" />
                                Security Code
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                className="block w-full rounded-2xl bg-black/20 border border-white/5 px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all sm:text-sm"
                            />
                            {errors.password && <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider ml-1">{errors.password}</p>}
                        </div>

                        {/* BOTÓN DE ACCIÓN */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Initialize Session
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Already authorized?{' '}
                            <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors underline-offset-4 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-10 text-center text-[10px] text-slate-600 font-bold tracking-widest uppercase">
                    &copy; 2026 QAWORKSPACE - Intelligence Testing Systems
                </p>
            </div>
        </div>
    );
}