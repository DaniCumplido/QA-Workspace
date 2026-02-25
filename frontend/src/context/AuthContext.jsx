import { createContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import api from "../api/client";

// OJO: Sin el "export" aquí
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          const res = await api.get(`/users/${session.user.email}`);
          setUser({ ...session.user, ...res.data });
        } catch (e) {
          setUser(session.user);
          console.error(e)
        }
      }
      setLoading(false);
    };

    getUserProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        setLoading(false); // No hay nada que cargar
      } else {
        // IMPORTANTE: Antes de buscar el perfil, volvemos a poner loading en true
        setLoading(true);
        getUserProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Exportamos el contexto de forma interna para el hook que crearemos abajo
export { AuthContext };