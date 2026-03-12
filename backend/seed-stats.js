const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const project = await prisma.project.findFirst();
  if (!project) return console.log("Crea primero un proyecto en el front");

  const total = 50; // Supongamos 50 tests en total
  const snapshots = [];

  for (let i = 7; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // Simulamos avance progresivo
    const passed = Math.floor((total / 8) * (7 - i)); 
    const failed = Math.floor(Math.random() * 5);

    snapshots.push({
      projectId: project.id,
      date,
      totalTests: total,
      passedTests: passed,
      failedTests: failed,
      pendingTests: total - passed - failed
    });
  }

  // Limpiamos e inyectamos
  await prisma.projectDailySnapshot.deleteMany({ where: { projectId: project.id } });
  await prisma.projectDailySnapshot.createMany({ data: snapshots });

  console.log("🚀 Datos históricos inyectados con éxito");
}

seed();