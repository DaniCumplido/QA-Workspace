import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import Dashboard from "../components/templates/Dashboard";

/**
 * Página de Dashboard del Proyecto: Actúa como contenedor lógico (Smart Component).
 * Se encarga de obtener el ID de la URL y recuperar las estadísticas específicas del proyecto.
 */
export default function ProjectDashboardPage() {
  const { id } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si no hay ID en los parámetros, abortamos la carga
    if (!id) return;

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        // Llamada a la API para obtener métricas y datos históricos del proyecto
        const response = await api.get(`/projects/${id}/dashboard`);
        setDashboardData(response.data);
      } catch (error) {
        // Log de error en consola si falla la sincronización
        console.error("Error loading project dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [id]);

  // Pasamos las métricas (stats) y los datos de gráficos (data) al componente visual Dashboard
  return (
    <Dashboard 
      stats={dashboardData?.stats} 
      data={dashboardData?.data} 
      isLoading={loading} 
    />
  );
}