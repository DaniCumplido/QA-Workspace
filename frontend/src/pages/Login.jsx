import { useForm } from "../hooks/useForm";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const { formData, errors, setErrors, loading, setLoading, handleChange } = useForm({
        email: '',
        password: ''
    });

    /**
     * Manejador del envío del formulario.
     * Incluye validación local de email y longitud de contraseña antes de consultar Supabase.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        let newErrors = {};

        // Validación de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email address";
        }

        // Validación de seguridad básica
        if (!formData.password || formData.password.length > 30) {
            newErrors.password = "Maximum 30 characters allowed";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            // Intento de autenticación con Supabase
            const { error } = await supabase.auth.signInWithPassword(formData);
            if (error) throw error;
            navigate("/");
        } catch (error) {
            console.error("Auth Error:", error);
            setErrors({ auth: "Access credentials denied" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden bg-[#0B0F1A] px-6 py-12 lg:px-8">
            
            {/* GRADIENTES DE FONDO (DNA CYBER) */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>

            <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
                
                {/* CABECERA: LOGO & STATUS */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-6 group transition-transform hover:scale-110">
                        <LogIn className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-center text-white uppercase italic">
                        QA<span className="text-indigo-500">WORKSPACE</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">
                            System Authorization Required
                        </p>
                    </div>
                </div>

                {/* TARJETA DE LOGIN */}
                <div className="bg-[#161B2B]/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    {/* Línea de escaneo decorativa */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Alerta de error de autenticación */}
                        {errors.auth && (
                            <div className="p-4 text-[10px] font-black tracking-widest text-rose-400 border border-rose-500/20 bg-rose-500/5 rounded-2xl uppercase italic">
                                [ACCESS_DENIED]: {errors.auth}
                            </div>
                        )}

                        {/* Campo: Identidad de Usuario (Email) */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                                <Mail size={12} className="text-indigo-500" />
                                User Identity
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="analyst@qalab.io"
                                className="block w-full rounded-2xl bg-black/40 border border-white/5 px-4 py-3.5 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all sm:text-sm font-medium"
                            />
                            {errors.email && <p className="text-[10px] font-bold text-rose-500 uppercase italic ml-1">{errors.email}</p>}
                        </div>

                        {/* Campo: Token de Acceso (Password) */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    <Lock size={12} className="text-indigo-500" />
                                    Access Token
                                </label>
                                <a href="#" className="text-[10px] font-bold text-indigo-500/60 hover:text-indigo-400 uppercase tracking-tighter transition-colors">Forgot?</a>
                            </div>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                className="block w-full rounded-2xl bg-black/40 border border-white/5 px-4 py-3.5 text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all sm:text-sm font-medium"
                            />
                            {errors.password && <p className="text-[10px] font-bold text-rose-500 uppercase italic ml-1">{errors.password}</p>}
                        </div>

                        {/* Botón de Acción */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center items-center gap-3 rounded-2xl bg-indigo-600 px-4 py-4 text-xs font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.97] transition-all disabled:opacity-50 overflow-hidden"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Authorize Access
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                            {/* Brillo dinámico al pasar el ratón */}
                            <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000"></div>
                        </button>
                    </form>

                    {/* Link para registro */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
                        <p className="text-xs text-slate-500 font-medium">
                            Unauthorized personnel?{' '}
                            <Link to="/register" className="text-white font-black hover:text-indigo-400 transition-colors tracking-tighter italic uppercase ml-1">
                                Get Identity
                            </Link>
                        </p>
                    </div>
                </div>

                {/* FOOTER INFO: Capa de seguridad */}
                <div className="mt-10 flex flex-col items-center gap-2 opacity-30">
                    <ShieldCheck size={20} className="text-slate-500" />
                    <p className="text-center text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">
                        Encrypted Data Transmission Layer
                    </p>
                </div>
            </div>
        </div>
    );
}