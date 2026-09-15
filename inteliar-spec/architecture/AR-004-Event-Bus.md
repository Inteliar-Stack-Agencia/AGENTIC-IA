# INTELIAR ARCHITECTURE REFERENCE
## AR-004 — Event Bus

**Versión:** 1.0 · **Estado:** Ready for Implementation · **Prioridad:** P0

---

## Objetivo

La columna vertebral de comunicación de Inteliar. **Todo** cambio genera eventos. No existen cambios silenciosos.

**Filosofía:** los servicios no se conocen, colaboran. Nunca llaman directamente a otro servicio cuando un evento puede resolverlo.

## Principio fundamental

Todo hecho importante genera un evento — sea iniciado por usuario, agente IA, workflow, API, Builder, Marketplace o CLI.

Un evento representa **algo que ocurrió**, nunca algo que queremos que ocurra:

```
✓ CustomerCreated   (hecho)
✗ CreateCustomer    (comando)
```

## Arquitectura

```
Application → Event Bus → Subscribers → Actions     (nunca Service A → B → C directo)

Event Bus
├── Publisher   ├── Retry Engine        ├── Replay Engine
├── Router      ├── Dead Letter Queue    └── Monitoring
├── Subscribers ├── Event Store
```

## Estructura del evento (contrato único)

```
event: id, name, version, organization_id, actor, source,
       timestamp, correlation_id, causation_id, payload, metadata
```

**Naming:** `Entity + Past Tense` → `OrderCreated`, `InvoiceApproved`, `InventoryAdjusted`, `WorkflowExecuted`, `DeploymentFinished`. Nunca `CreateInvoice`, `DoDeploy`.

**Versioning:** los eventos nunca cambian, se versionan (`CustomerCreated v1 → v2`). Nunca modificar contratos existentes.

## Categorías

- **Business:** `CustomerCreated`, `InvoicePaid`, `OrderCompleted`
- **Platform:** `UserLoggedIn`, `OrganizationCreated`, `ModuleInstalled`
- **AI:** `AgentStarted`, `AgentCompleted`, `PromptExecuted`
- **Builder:** `BuildStarted`, `DeployFinished`, `TestsPassed`
- **Marketplace:** `ModulePublished`, `ModuleInstalled`, `RatingAdded`

## Capacidades clave

- **Event Store:** todos los eventos quedan registrados (no solo los importantes) → auditoría, replay, analytics, debugging.
- **Replay:** reconstruir una organización/workflow/automatización reproduciendo eventos.
- **Subscribers:** cada servicio declara qué eventos consume, sin conocer quién los produjo.
- **Retry Engine:** `5s → 30s → 2min → 10min → DLQ`. Nunca se pierde.
- **Dead Letter Queue:** eventos imposibles de procesar esperan intervención, nunca desaparecen.
- **Correlation ID:** eventos relacionados comparten uno → reconstruir un proceso completo.
- **Causation ID:** cada evento conoce qué evento lo originó → toda la cadena.
- **Schema Registry:** todos los contratos, versionados, documentados, auditados.

## Seguridad y visibilidad

Cada evento firmado, validado, versionado, auditado. Nunca modificar payloads.
- **Privados:** solo internos (ej: `BillingTokenGenerated`).
- **Públicos:** disponibles vía SDK (ej: `CustomerCreated`).

## API y SDK

```
POST /events · GET /events · GET /events/:id · GET /replay
```

SDK en todos los lenguajes: `publish(event)`.

## Stack y performance

Broker: **NATS JetStream** (Kafka en Enterprise) · Event Store: PostgreSQL · OpenTelemetry.
**Objetivo:** 100.000 eventos/segundo, escalable horizontalmente.
**Repository:** `services/event-bus/`

## Definition of Done

Publisher · Subscriber · Replay · DLQ · Retry · Monitoring · Tracing · Schema Registry · SDK · OpenAPI · Tests.

---

## 🚨 ADR-AR005 — Todo cambio relevante genera un evento

No existen cambios silenciosos.

## 🚨 ADR-AR006 — Los servicios no se conocen entre sí

Se comunican exclusivamente mediante eventos. Las excepciones deben documentarse con una ADR específica.

## ⭐ ADR-AR007 — Business Events son ciudadanos de primera clase

Además de eventos técnicos, Inteliar introduce **Business Events** — hitos reales del negocio:

```
Primer Cliente · Primera Venta · Primer Empleado · Nueva Sucursal ·
Meta Mensual Alcanzada · Cliente Perdido · Producto Más Vendido ·
Tiempo Medio de Reparación Bajó · Rentabilidad Superó 30%
```

Alimentan directamente al Digital Twin y al Knowledge Engine. The Architect entiende la evolución de una empresa no solo por cambios en la base de datos, sino por hitos reales. El Event Bus deja de ser solo infraestructura: se convierte en **la línea de tiempo viva del Business Operating System**.

> **Foundation Layer completo:** Organization (dónde vive todo) · Identity (quién actúa) · Permissions (qué puede hacer) · Event Bus (cómo se comunican todos).

---

*AR-004 — Event Bus*
