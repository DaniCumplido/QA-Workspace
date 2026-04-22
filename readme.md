# 🚀 QA Workspace - Sistema de Gestión de Pruebas

**QA Workspace** es una plataforma integral diseñada para gestionar el ciclo de vida de pruebas de software. Permite el seguimiento centralizado de proyectos, la ejecución de casos de prueba y la gestión de incidencias en tiempo real, todo bajo un sistema robusto de control de acceso basado en roles (RBAC).

---

## 🛠️ Stack Tecnológico

* **Frontend:** React, Vite, Tailwind CSS, Lucide React (Iconografía).
* **Backend:** Node.js, Express, Prisma ORM.
* **Base de Datos & Auth:** Supabase (PostgreSQL).
* **Despliegue:** Render.

---

## 🏗️ Metodología de Desarrollo

El proyecto se ha construido siguiendo un enfoque **Bottom-Up (de la base hacia arriba)** y un desarrollo lineal adaptado a un entorno unipersonal:

1.  **Arquitectura y Seguridad:** Implementación inicial de la base de datos y el sistema de autenticación/permisos.
2.  **Desarrollo Vertical:** Construcción módulo a módulo (Back + Front) para garantizar la integridad de los datos.
3.  **Analítica:** Implementación de gráficos una vez consolidada la captura de datos reales.
4.  **Uniformidad UI:** Fase final de diseño de interfaz para asegurar una estética coherente en toda la plataforma.

---

## ⚙️ Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/qa-workspace.git](https://github.com/tu-usuario/qa-workspace.git)
cd qa-workspace
```

###  2. Configuración del Backend
El servidor gestiona la API, la autenticación y la conexión con Prisma.Bashcd backend
```bash
npm install
npx prisma generate
npm run dev
```

Nota: El servidor se ejecutará en http://localhost:30003. 

###  3. Configuración del Frontend
Interfaz SPA reactiva desarrollada con Vite.Bashcd ../frontend
```bash
npm install
npm run dev
```

Nota: La aplicación estará disponible en http://localhost:5173

## 🔑 Credenciales de Acceso (Entorno de Evaluación)
Para facilitar la revisión de los diferentes niveles de permisos, se han configurado los siguientes perfiles:
```bash
Rol Email Password 
Admin -- danicumplido04@gmail.com -- 123456
Manager -- manager@gmail.com -- 123456
Tester -- tester@gmail.com -- 123456
```

## 📊 Estado del Desarrollo
Actualmente, el flujo principal de trabajo (Happy Path) está operativo al 95%.
✅ RBAC: Control de acceso funcional por roles.
✅ Gestión Core: CRUD completo de Proyectos, Pruebas e Incidencias.
✅ Automatización: Generación automática de incidencias al detectar fallos en tests.
✅ Analytics: Dashboards interactivos con métricas reales por proyecto y dashboard global (Cross-project) y 
⏳ En desarrollo: sistema de auditoría (AuditLog).

## 📁 Estructura del ProyectoPlaintext├── backend/
```bash
│   ├── prisma/          # Esquema de base de datos y migraciones
│   └── src/
│       ├── routes/      # Definición de endpoints de la API
│       └── middlewares/ # Seguridad y validación JWT
└── frontend/
    └── src/
        ├── components/  # Componentes UI reutilizables
        ├── pages/       # Vistas principales de la aplicación
        └── hooks/       # Lógica de consumo de API personalizada
```
        
## 📝 Notas de Entrega
Se recomienda evaluar el proyecto utilizando el proyecto pre-configurado llamado "Implementación Devoluciones Parciales" o el proyecto llamado "Nuevo Programa Cashbacks", los cuales contienen datos históricos cargados para visualizar correctamente la potencia de los gráficos y las tablas de analítica.
