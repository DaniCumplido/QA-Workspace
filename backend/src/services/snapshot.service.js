const cron = require('node-cron');
const prisma = require('../config/db');

// Se ejecuta todos los días a las 23:59
cron.schedule('59 23 * * *', async () => {
  console.log('--- Generando Snapshots Diarios de QA ---');
  
  try {
    const projects = await prisma.project.findMany();

    for (const project of projects) {
      // Contamos los estados actuales
      const counts = await prisma.testCase.groupBy({
        by: ['status'],
        where: { projectId: project.id },
        _count: { _all: true }
      });

      const stats = {
        PENDING: 0, PASSED: 0, FAILED: 0, RETEST: 0, total: 0
      };

      counts.forEach(c => {
        stats[c.status] = c._count._all;
        stats.total += c._count._all;
      });

      // Guardamos o actualizamos la foto de hoy
      // Usamos el inicio del día para evitar problemas con las horas en el @@unique
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.projectDailySnapshot.upsert({
        where: {
          projectId_date: {
            projectId: project.id,
            date: today
          }
        },
        update: {
          totalTests: stats.total,
          passedTests: stats.PASSED,
          failedTests: stats.FAILED + stats.RETEST, // Agrupamos fallos
          pendingTests: stats.PENDING
        },
        create: {
          projectId: project.id,
          date: today,
          totalTests: stats.total,
          passedTests: stats.PASSED,
          failedTests: stats.FAILED + stats.RETEST,
          pendingTests: stats.PENDING
        }
      });
    }
    console.log('--- Snapshots completados con éxito ---');
  } catch (error) {
    console.error('Error en el cron de snapshots:', error);
  }
});