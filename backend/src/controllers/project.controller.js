const prisma = require("../config/db");

const createProject = async (req, res) => {
  // 1. Extraemos las fechas del body
  const { name, description, startDate, endDate } = req.body;

  // 2. Validación ampliada
  if (!name || !description || !startDate || !endDate) {
    return res.status(400).json({
      message: "Todos los campos son obligatorios: Nombre, descripción, fecha inicio y fin",
    });
  }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        // Convertimos a objeto Date para que Prisma/PostgreSQL no den problemas
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      },
    });

    return res.status(201).json(project);
  } catch (error) {
    console.error("DEBUG DB ERROR:", error);

    // Error específico por si las fechas tienen formato inválido
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Ya existe un proyecto con ese nombre" });
    }

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

const assignTester = async (req, res) => {
  try {
    const { id } = req.params; // ID del proyecto
    const { testerId } = req.body; // ID del tester (puede ser null para desasignar)

    // Validar que el proyecto existe
    const projectExists = await prisma.project.findUnique({ where: { id } });
    if (!projectExists) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    // Actualizar el proyecto
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        testerId: testerId || null,
      },
      include: {
        tester: true, // Devolvemos el tester actualizado para el frontend
      },
    });

    res.json({
      message: "Tester asignado correctamente",
      project: updatedProject,
    });
  } catch (error) {
    console.error("ASSIGN_TESTER_ERROR:", error);
    res.status(500).json({ message: "Error al asignar el tester al proyecto" });
  }
};

module.exports = { createProject, getAllProjects, updateProjectStatus, assignTester };
