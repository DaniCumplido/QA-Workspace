// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Equipo from "./pages/Equipo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTA PADRE: El Layout envuelve a los hijos */}
        <Route element={<MainLayout />}>
          <Route path="/equipo" element={<Equipo />} />
          {/* Aquí irán Proyectos, Dashboard, etc. */}
          <Route path="/" element={<Navigate to="/equipo" replace />} />
        </Route>

        {/* RUTAS FUERA DEL LAYOUT (Como el Login) */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;