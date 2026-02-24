import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Equipo from "./pages/Equipo";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PADRE: El Layout envuelve a los hijos */}
        <Route element={<MainLayout />}>
          <Route path="/equipo" element={<Equipo />} />
          <Route path="/" element={<Navigate to="/equipo" replace />} />
        </Route>

        {/* RUTAS FUERA DEL LAYOUT */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;