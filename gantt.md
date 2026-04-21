# Cronograma de Proyecto: QA Workspace

```mermaid
gantt
    dateFormat  YYYY-MM-DD
    title Cronograma de Desarrollo - QA Workspace
    
    axisFormat %d-%m
    todayMarker stroke-width:3px,stroke:#6366f1,opacity:0.8

    section Hitos Oficiales
    Anteproyecto (Tutor)              :milestone, m1, 2026-02-22, 0d
    Entrega 50% Desarrollo            :milestone, m2, 2026-03-15, 0d
    Entrega 85% Desarrollo            :milestone, m3, 2026-04-05, 0d
    Entrega Final (PROD + Docs)       :milestone, m4, 2026-05-03, 0d

    section Fase 0: Planificación
    Definición y Anteproyecto         :done, p1, 2026-02-14, 2026-02-22

    section F1: R01 (Auth y RBAC)
    DB: Profile y Supabase Auth       :done, r1_1, 2026-02-23, 4d
    UI: Login y Registro              :done, r1_2, after r1_1, 4d
    Backend: Middleware y RBAC        :done, r1_3, after r1_2, 4d

    section F2: R02 y R03 (Core)
    R02: DB y UI Proyectos            :done, r2_1, 2026-03-05, 4d
    R02: Reglas de Cierre y FSM       :done, r2_2, after r2_1, 3d
    R03: Interfaz y Endpoints Tests   :done, r3_1, after r2_2, 3d
    R03: Automatización de Fallos     :done, r3_2, after r3_1, 2d

    section F3: R04 (Incidencias)
    DB y UI: Issue Tracking           :done, r4_1, 2026-03-17, 5d
    Trigger Automático (Re-test)      :done, r4_2, after r4_1, 4d

    section F4: R05 y R06 (Analítica)
    R05: KPIs y Cronjob (Snapshot)    :done, r5_1, 2026-03-26, 6d
    R06: Dashboard Global             :done, r6_1, after r5_1, 5d

    section F5: Cierre y Despliegue
    Ajustes y Refactor (99% Dev)      :done, c1, 2026-04-06, 14d
    Despliegue PROD                   :active, c2, 2026-04-20, 5d
    Documentación (Falta 35%)         :active, c3, 2026-04-10, 2026-05-03
