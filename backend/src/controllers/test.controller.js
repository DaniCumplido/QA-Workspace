const prisma = require("../config/db");

const createTest = async (req, res) => {
  const { title, steps, expected } = req.body;
  const { projectId } = req.params;

  if (!title || !steps || !expected) {
    return res.status(400).json({
      message: "El título, los pasos y el resultado esperado son obligatorios",
    });
  }

  try {
    const test = await prisma.testCase.create({
      data: {
        title,
        steps,
        expected,
        project: {
          connect: { id: projectId },
        },
      },
    });

    return res.status(201).json(test);
  } catch (error) {
    console.error("DEBUG DB ERROR:", error);
    return res.status(500).json({ message: "Error interno al crear el test" });
  }
};

const getAllProjectTests = async (req, res) => {
  const { projectId } = req.params;

  try {
    if (!projectId) {
      return res.status(400).json({ message: "Falta el projectId en la URL" });
    }

    const tests = await prisma.testCase.findMany({
      where: { projectId: projectId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(tests);
  } catch (error) {
    console.error("GET TESTS ERROR:", error);
    res.status(500).json({ message: "Error de base de datos" });
  }
};

const updateTestStatus = async (req, res) => {
  const { testId } = req.params;
  const { status } = req.body;

  try {
    const updatedTest = await prisma.testCase.update({
      where: { id: testId },
      data: { status },
    });

    // LOGICA EXTRA: Si el estado es FAILED, podrías crear la incidencia aquí automáticamente

    res.status(200).json(updatedTest);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar estado" });
  }
};

module.exports = {
  getAllProjectTests,
  createTest,
  updateTestStatus,
};
