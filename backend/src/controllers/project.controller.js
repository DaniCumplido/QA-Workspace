const prisma = require("../config/db");

const createProject = async (req, res) => {
  const { name, description } = req.body;

  // 1. Validación temprana
  if (!name || !description) {
    return res.status(400).json({
      message: "Nombre y descripción son obligatorios",
    });
  }

  try {
    const project = await prisma.project.create({
      data: { name, description },
    });

    // 2. Éxito: Usamos .json() en lugar de .send() para ser consistentes
    return res.status(201).json(project);
  } catch (error) {
    // 3. Debug interno (se ve en la consola), pero el cliente no
    console.error("DEBUG DB ERROR:", error);

    return res.status(500).json({
      message: "Error interno al procesar el proyecto",
    });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const proyectos = await prisma.project.findMany({
      include: {
        tester: {
          select: { full_name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(proyectos);
  } catch (error) {
    console.error("DEBUG DB ERROR:", error);

    return res.status(500).json({
      message: "Error interno al procesar el proyecto",
    });
  }
};

const updateProjectStatus = async (req, res) => {
  const { projectId } = req.params; // O 'id', según tu router
  const { status: nextStatus } = req.body;

  try {
    // 1. Buscamos el proyecto con sus tests e incidencias para validar
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        testCases: true,
        issues: true,
      },
    });

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    // 2. Validar flujo de estados (RECIBIDO -> EN_CURSO -> CERRADO)
    const statusOrder = { RECIBIDO: 1, EN_CURSO: 2, CERRADO: 3 };
    const currentWeight = statusOrder[project.status];
    const nextWeight = statusOrder[nextStatus];

    // Evitar retroceder (opcional, depende de tu flujo) o saltar estados
    if (nextWeight < currentWeight) {
        return res.status(400).json({ message: "No se puede retroceder el estado del proyecto." });
    }
    
    if (nextWeight > currentWeight + 1) {
      return res.status(400).json({ 
        message: `Flujo inválido. No puedes pasar de ${project.status} a ${nextStatus} directamente.` 
      });
    }

    // 3. REGLA DE ORO: Validación para CIERRE
    if (nextStatus === "CERRADO") {
      // Buscamos tests que no hayan pasado (FAILED o RETEST)
      const pendingTests = project.testCases.filter(
        (t) => t.status === "FAILED" || t.status === "RETEST"
      );

      // Buscamos incidencias que no estén cerradas
      const activeIssues = project.issues.filter(
        (i) => i.status !== "CLOSED"
      );

      if (pendingTests.length > 0 || activeIssues.length > 0) {
        return res.status(400).json({
          message: "No se puede cerrar el proyecto.",
          errors: {
            failedTests: pendingTests.length,
            openIssues: activeIssues.length
          },
          suggestion: "Asegúrate de que todos los tests sean PASSED y las incidencias estén CLOSED."
        });
      }
    }

    // 4. Actualización final
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { status: nextStatus },
    });

    res.json({
      message: `Proyecto actualizado a ${nextStatus}`,
      project: updatedProject
    });

  } catch (error) {
    console.error("Error en updateProjectStatus:", error);
    res.status(500).json({ message: "Error interno del servidor al actualizar estado" });
  }
};

module.exports = { createProject, getAllProjects, updateProjectStatus };
