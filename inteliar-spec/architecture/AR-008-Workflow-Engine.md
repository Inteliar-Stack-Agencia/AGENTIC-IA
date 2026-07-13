# INTELIAR ARCHITECTURE REFERENCE
## AR-008 — Workflow Engine

**Versión:** 1.0 · **Estado:** Core Execution Layer · **Prioridad:** P0 (Crítico)

---

## Objetivo

El motor universal de procesos. Todo proceso empresarial (Ventas, Compras, Taller, Producción, RRHH, Logística, IA, Builder, Marketplace) vive aquí. No workflows tipo Zapier: **procesos completos de negocio.**

> Una empresa no funciona mediante pantallas, funciona mediante procesos. Las pantallas son interfaz; el Workflow Engine ejecuta el negocio.

Responde: *¿cuál es el próximo paso de este proceso?* Coordina — no administra usuarios, no toma decisiones estratégicas, no ejecuta IA.

## Arquitectura

```
Workflow Engine
├── Workflow Runtime  ├── Rule Engine       ├── Compensation Engine
├── State Machine     ├── Event Listener     └── Workflow API
├── Task Engine       ├── Scheduler
├── Approval Engine   ├── Retry Manager
```

```
Workflow: id, organization_id, name, description, version, status, trigger, steps, variables, created_at, updated_at
Step:     id, workflow_id, type, name, conditions, inputs, outputs, timeout, retry, next
```

## Tipos de Step

`Human Task · Service Task · AI Task · Approval · Condition · Loop · Delay · Notification · Webhook · Script · Sub Workflow · Manual Decision`. Todo es un Step.

**Ejemplo (reparación):** Equipo recibido → Diagnóstico → Presupuesto → Cliente aprueba → Reparación → Control de calidad → Entrega → Factura → Pago → Finalizado. El motor conoce exactamente dónde está cada reparación.

## Estados y State Machine

`Created → Running → Waiting → Paused → Completed → Cancelled → Failed`. Nunca estados ambiguos. Toda transición debe ser válida (no puede pasar de Created a Completed sin ejecutar pasos).

## Capacidades

- **Variables:** contexto por workflow (customer, device, priority, technician, estimated_cost, deadline). No variables globales.
- **Triggers:** Evento, API, Manual, Cron, Webhook, Architect, AI Agent.
- **Condiciones:** `IF budget > 500 → Approval ELSE Continue`.
- **Human Tasks:** asignar, esperar respuesta, continuar.
- **AI Tasks:** clasificar correo, resumir documento, generar presupuesto, analizar riesgo.
- **Approval Engine:** uno/dos/tres niveles, paralela, secuencial, quórum, firma digital.
- **Retry:** `attempts: 5, strategy: exponential`.
- **Compensation:** si falla, deshace pasos (factura creada → pago rechazado → cancelar factura → liberar stock → notificar).
- **Sub Workflows:** un workflow llama a otro (Venta → Facturación → Despacho → Cobro), cada uno independiente.
- **SLA:** cada paso define tiempo esperado, máximo, escalamiento, notificaciones.
- **Scheduler:** esperar horas/días/semanas/fechas sin bloquear procesos.

## Historia y simulación

- **Observabilidad:** estado, tiempo, responsable, costo, eventos, errores, historial.
- **Timeline:** cada ejecución registrada (09:00 pedido → 09:03 aprobado → 09:15 factura → 09:16 stock).
- **Simulación:** ejecutar sin afectar producción.
- **Versionado:** nunca modificar un workflow activo; se crea v2. Las ejecuciones anteriores siguen en v1.

## Integraciones

- **Architect:** genera workflows desde conversaciones (usuario describe → Architect diseña → solicita aprobación → publica).
- **Builder:** convierte workflow → código → configuración → deploy.
- **Event Bus:** escucha y genera eventos, nunca polling.
- **Permission Service:** cada Step consulta permisos, nunca ejecuta acciones prohibidas.
- **Digital Twin:** cada workflow modifica el estado operativo; el Twin aprende.

## API / Stack

```
POST /workflows · /workflows/:id/run · /simulate     GET /workflows · /executions
```

Persistencia: PostgreSQL (definiciones) · Redis (estado activo) · Object Storage (logs) · Event Store (historial).
Stack: Temporal · NestJS · PostgreSQL · Redis · OpenTelemetry. **Objetivo:** 10.000 workflows concurrentes.
**Repository:** `services/workflow-engine/`

## Definition of Done

Runtime · State Machine · Scheduler · Approval Engine · Compensation · Simulation · API · SDK · Versionado · Observabilidad · Tests.

---

## 🚨 ADR-AR017 — Todo proceso empresarial se ejecuta mediante Workflow Engine

No se permiten procesos críticos implementados únicamente en código imperativo.

## 🚨 ADR-AR018 — Los Workflows son configuración, no programación

La lógica de negocio debe representarse mediante una definición declarativa y versionada.

## ⭐ ADR-AR019 — Goal-Oriented Workflows

Tres niveles de workflow:

1. **Standard** — procesos lineales (alta de cliente, facturación, compras).
2. **Adaptive** — consulta al Architect durante la ejecución (un cliente rechaza un presupuesto; el flujo no está predefinido, el Architect propone el siguiente paso).
3. **Autonomous** — tiene objetivos, no pasos fijos (objetivo: "resolver el reclamo"; el sistema decide qué agente usar, qué herramientas ejecutar, cuándo escalar).

El Workflow Engine evoluciona de un motor BPM tradicional a un **Goal Execution Engine**: la IA no solo automatiza tareas, coordina el trabajo para cumplir resultados de negocio.

> Con este servicio, Inteliar no solo comprende empresas: también puede **operarlas**.

---

*AR-008 — Workflow Engine*
