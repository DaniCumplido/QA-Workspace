import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import Dashboard from "../components/templates/Dashboard";

export default function ProjectDashboardPage() {
  const { id } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDashboard = async () => {
      try {
        const response = await api.get(`/projects/${id}/dashboard`);
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [id]);

  return <Dashboard stats={dashboardData?.stats} data={dashboardData?.data} />;
}
