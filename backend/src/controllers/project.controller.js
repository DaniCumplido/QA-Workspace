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

module.exports = { createProject, getAllProjects };
