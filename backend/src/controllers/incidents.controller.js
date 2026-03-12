const prisma = require("../config/db");

const createIssue = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, severity, testCaseId } = req.body;

  try {
    // Usamos transacción: O se hacen las dos, o no se hace ninguna
    // Si el segundo falla, se hace rollback de la primera petición digamos
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear la incidencia
      const newIssue = await tx.issue.create({
        data: { 
          title, 
          description, 
          severity, 
          testCaseId, 
          projectId 
        },
      });

      // 2. Actualizar el test a FAILED
      await tx.testCase.update({
        where: { id: testCaseId },
        data: { status: "FAILED" },
      });

      return newIssue;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("DEBUG DB ERROR:", error);
    
    // Error específico si el testId no existe o ya tiene una incidencia (si pusiste @unique)
    if (error.code === 'P2002') {
       return res.status(400).json({ message: "Este caso de prueba ya tiene una incidencia asociada" });
    }

    return res.status(500).json({
      message: "Error interno al procesar la incidencia",
    });
  }
};

const getAllIssues = async (req, res) => {
  const { projectId } = req.params;

  try {
    const issues = await prisma.issue.findMany({
      where: { projectId },
      // Bonus: Incluimos el título del test relacionado para que la UI sea más útil
      include: {
        testCase: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(issues);
  } catch (error) {
    console.error("DEBUG DB ERROR:", error);
    return res.status(500).json({
      message: "Error interno al procesar las incidencias",
    });
  }
};

const updateIssue = async (req, res) => {
  // 1. Extraemos issueId (debe coincidir con el nombre en tu router: :issueId)
  const { issueId } = req.params; 
  const { status, severity, title, description } = req.body;

  try {
    // 2. Usar issueId, no 'id'
    const currentIssue = await prisma.issue.findUnique({ 
      where: { id: issueId } 
    });

    if (!currentIssue) {
      return res.status(404).json({ message: "Incidencia no encontrada" });
    }

    // --- LÓGICA DE MÁQUINA DE ESTADOS ---
    if (status && status !== currentIssue.status) {
      const flow = ["OPEN", "ANALISIS", "RESOLVED", "CLOSED"];
      const currentIndex = flow.indexOf(currentIssue.status);
      const nextIndex = flow.indexOf(status);
      const distance = Math.abs(nextIndex - currentIndex);

      if (distance > 1) {
        return res.status(400).json({ 
          message: `Movimiento no permitido de ${currentIssue.status} a ${status}` 
        });
      }
    }

    // --- ACTUALIZACIÓN ---
    const updatedIssue = await prisma.$transaction(async (tx) => {
      const issue = await tx.issue.update({
        where: { id: issueId }, // Usar issueId aquí también
        data: {
          status: status || currentIssue.status,
          severity: severity || currentIssue.severity,
          title: title || currentIssue.title,
          description: description || currentIssue.description,
        },
      });

      if (status === "CLOSED") {
        await tx.testCase.update({
          where: { id: issue.testCaseId },
          data: { status: "RETEST" }
        });
      }
      return issue;
    });

    return res.status(200).json(updatedIssue);
  } catch (error) {
    console.error("ERROR AL ACTUALIZAR ISSUE:", error);
    return res.status(500).json({ message: "Error interno al actualizar" });
  }
};

module.exports = { createIssue, getAllIssues, updateIssue };