🚀 QA Workspace - Sistema de Gestión de Pruebas
Este proyecto es una plataforma integral para la gestión del ciclo de vida de pruebas de software, que permite el seguimiento de proyectos, casos de prueba e incidencias en tiempo real.

🛠️ Requisitos Previos
segúrate de tener instalado en tu sistema:

Node.js (Versión 18 o superior recomendada)
npm (Viene incluido con Node.js)

⚙️ Instalación y Puesta en Marcha
Sigue estos pasos para levantar el entorno local:

1. Configuración del Backend
El servidor gestiona la API, la autenticación y la conexión con la base de datos a través de Prisma.

# Entrar al directorio del servidor
cd backend

# Instalar dependencias
npm install

# Generar el cliente de Prisma
npx prisma generate

# Iniciar el servidor en modo desarrollo
npm run dev

Nota: El servidor se ejecutará normalmente en http://localhost:3000

2. Configuración del Frontend
La interfaz está desarrollada con React, Vite y Tailwind CSS.

# Entrar al directorio de la interfaz
cd frontend

# Instalar dependencias
npm install

# Iniciar la aplicación
npm run dev

Nota: La aplicación abrirá un puerto (normalmente http://localhost:5173)

🏗️ Estructura del Proyecto
/backend: API REST construida con Express y Prisma ORM.

prisma/: Esquema de la base de datos.

src/routes/: Definición de endpoints.

/frontend: Aplicación Single Page (SPA).

src/components/: Componentes genéricos reutilizables.

src/pages/: Vistas principales.

🔑 Credenciales de Acceso:

Admin: danicumplido04@gmail.com / 123456

Manager: manager@gmail.com / 123456

Tester: tester@gmail.com / 123456

📝 Notas de Entrega
Datos de Prueba: Se ha pre-configurado un proyecto llamado "TEST" con información cargada para facilitar la evaluación inmediata del Dashboard y las tablas de dicho proyecto.

Funcionalidades Implementadas:

Sistema de autenticación con control de acceso por roles (RBAC).

Gestión completa de Proyectos, Pruebas e Incidencias.

Generación automática de Incidencias al marcar un test como "FAILED".

Dashboard interactivo por proyecto.

Estado del Desarrollo: El proyecto se encuentra en una fase funcional avanzada. Actualmente, el flujo principal de trabajo (Happy Path) está 90% operativo, dejando los retoques estéticos y sistemas secundarios (AuditLog) para la fase final de pulido.

💡 Próximos Pasos:

Implementación de Dashboard global (Cross-project)

Sistema de auditoría (AuditLog) para trazabilidad de cambios
