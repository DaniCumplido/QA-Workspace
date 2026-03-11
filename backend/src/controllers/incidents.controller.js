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

module.exports = { createIssue, getAllIssues };