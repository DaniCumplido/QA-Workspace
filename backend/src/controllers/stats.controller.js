const prisma = require("../config/db");

const getGlobalStats = async (req, res) => {
  try {
    const { id: userId, role } = req.user;

    // Filtro de pertenencia: Si es TESTER, solo sus proyectos. Si es ADMIN/MANAGER, todo.
    const projectFilter = role === "TESTER" ? { testerId: userId } : {};
    
    // 1. Proyectos Activos
    const activeProjects = await prisma.project.count({
      where: { ...projectFilter, status: "EN_CURSO" },
    });

    // 2. Métricas de Test Cases
    const testStats = await prisma.testCase.groupBy({
      by: ["status"],
      where: { project: projectFilter },
      _count: true,
    });

    const totalTests = testStats.reduce((acc, curr) => acc + curr._count, 0);
    const passedTests = testStats.find((t) => t.status === "PASSED")?._count || 0;
    const pendingTests = testStats
      .filter((t) => ["PENDING", "RETEST"].includes(t.status))
      .reduce((acc, curr) => acc + curr._count, 0);

    const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    // 3. Incidencias (Issues)
    // Para el Tester, buscamos issues de SUS proyectos que no estén cerradas
    const issueStats = await prisma.issue.groupBy({
      by: ["severity", "status"],
      where: { 
        project: projectFilter,
        status: { not: "CLOSED" } 
      },
      _count: true,
    });

    const criticalIssues = issueStats
      .filter((i) => i.severity === "ALTA")
      .reduce((acc, curr) => acc + curr._count, 0);

    // Específico para Tester: ¿Cuántas están "RESOLVED" esperando su validación?
    const readyForRetest = issueStats
      .filter((i) => i.status === "RESOLVED")
      .reduce((acc, curr) => acc + curr._count, 0);

    // 4. Histórico (Snapshots)
    const history = await prisma.projectDailySnapshot.findMany({
      where: {
        project: projectFilter,
        date: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
      },
      orderBy: { date: "asc" },
    });

    const chartData = history.reduce((acc, curr) => {
      const dateStr = curr.date.toISOString().split("T")[0];
      if (!acc[dateStr]) {
        acc[dateStr] = { date: dateStr, passed: 0, failed: 0, pending: 0 };
      }
      acc[dateStr].passed += curr.passedTests;
      acc[dateStr].failed += curr.failedTests;
      acc[dateStr].pending += curr.pendingTests;
      return acc;
    }, {});

    res.json({
      activeProjects,
      successRate,
      criticalIssues,
      pendingTests,
      readyForRetest, // KPI extra para el Tester
      severityDist: issueStats.reduce((acc, curr) => {
        const existing = acc.find(item => item.severity === curr.severity);
        if (existing) { existing._count += curr._count; }
        else { acc.push({ severity: curr.severity, _count: curr._count }); }
        return acc;
      }, []),
      history: Object.values(chartData),
    });
  } catch (error) {
    console.error("STATS_ERROR:", error);
    res.status(500).json({ message: "Error al generar estadísticas" });
  }
};

module.exports = { getGlobalStats };