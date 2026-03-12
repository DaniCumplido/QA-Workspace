import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import MainLayout from "./layouts/MainLayout";
import Team from "./pages/Team";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectLayout from "./layouts/ProjectLayout";
import ProjectIncidents from "./pages/ProjectIncidents";
import ProjectTests from "./pages/ProjectTests";
import ProjectDashboard from "./pages/ProjectDashboard";

// Componente para proteger rutas (R01F02-T01)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white">Cargando sesión...</div>
      </div>
    );
  }

  // 1. Si ni siquiera está logueado, al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si hay roles definidos y el usuario NO tiene uno de ellos, al dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.error("No tienes permisos para acceder a este recurso");
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Proveedor de contexto global */}
      <BrowserRouter>
        <Routes>
          {/* RUTAS PRIVADAS (Requieren login) */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectLayout />}>
              <Route path="dashboard" element={<ProjectDashboard />} />
              <Route path="tests" element={<ProjectTests />} />
              <Route path="incidents" element={<ProjectIncidents />} />
            </Route>

            <Route
              path="/team"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Team />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* RUTAS PÚBLICAS */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Catch-all: si la ruta no existe */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
