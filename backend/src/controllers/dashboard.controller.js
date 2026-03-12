const prisma = require("../config/db");

const getProjectDashboard = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        snapshots: { orderBy: { date: "asc" } },
        testCases: true,
      },
    });

    if (!project)
      return res.status(404).json({ message: "Proyecto no encontrado" });

    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculamos el techo de la gráfica (el valor más alto entre snapshots o tests actuales)
    const maxTestsInHistory = Math.max(
      project.testCases.length,
      ...project.snapshots.map((s) => s.totalTests),
      1, // Evitar división por cero
    );

    const totalDuration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    const chartData = [];
    let currentCursor = new Date(start);

    while (currentCursor <= end) {
      const dateStr = currentCursor.toISOString().split("T")[0];

      // Buscar snapshot del día
      let snap = project.snapshots.find(
        (s) => s.date.toISOString().split("T")[0] === dateStr,
      );

      // Si es hoy y no hay snapshot, usamos datos en tiempo real
      if (!snap && dateStr === today.toISOString().split("T")[0]) {
        snap = {
          totalTests: project.testCases.length,
          passedTests: project.testCases.filter((t) => t.status === "PASSED")
            .length,
          failedTests: project.testCases.filter(
            (t) => t.status === "FAILED" || t.status === "RETEST",
          ).length,
        };
      }

      // Cálculo de la diagonal (Baseline)
      const daysSinceStart = (currentCursor - start) / (1000 * 60 * 60 * 24);
      const previsto = Math.round(
        (maxTestsInHistory / totalDuration) * daysSinceStart,
      );

      const isFuture = currentCursor > today;

      chartData.push({
        date: currentCursor.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
        }),
        total: isFuture ? null : snap?.totalTests || 0,
        passed: isFuture ? null : snap?.passedTests || 0,
        failed: isFuture ? null : snap?.failedTests || 0,
        previsto: Math.min(maxTestsInHistory, Math.max(0, previsto)),
      });

      currentCursor.setDate(currentCursor.getDate() + 1);
    }

    res.json({
      projectName: project.name,
      stats: {
        total: project.testCases.length,
        passed: project.testCases.filter((t) => t.status === "PASSED").length,
        failed: project.testCases.filter(
          (t) => t.status === "FAILED" || t.status === "RETEST",
        ).length,
        pending: project.testCases.filter((t) => t.status === "PENDING").length,
      },
      data: chartData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al generar dashboard" });
  }
};

module.exports = { getProjectDashboard };
