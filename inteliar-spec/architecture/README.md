# INTELIAR ARCHITECTURE REFERENCE (AR)

**Estado:** Ready for Implementation
**Propósito:** La documentación que Claude Code usa **todos los días** para construir Inteliar.

> La Constitución (`../capitulos/`) responde *qué es Inteliar y cómo pensamos*. El Architecture Reference responde *cómo se implementa*. Cada AR es una especificación que un equipo (o un agente IA) podría implementar sin improvisar arquitectura.

---

## Capas de la plataforma

```
┌─ FOUNDATION LAYER ─────────────────────────────────────┐
│  AR-001 Organization   ¿dónde existe todo?             │
│  AR-002 Identity       ¿quién actúa?                    │
│  AR-003 Permission     ¿qué puede hacer cada actor?     │
│  AR-004 Event Bus      ¿cómo se comunican todos?        │
├─ INTELLIGENCE LAYER ───────────────────────────────────┤
│  AR-005 Digital Twin   el estado vivo del negocio       │
│  AR-006 Knowledge Eng. el activo estratégico            │
│  AR-007 Architect      el orquestador de razonamiento   │
│  AR-011 AI Runtime     el SO de inteligencia            │
│  AR-012 Memory         la memoria viva                  │
├─ EXECUTION / BUILD LAYER ──────────────────────────────┤
│  AR-008 Workflow       ejecuta los procesos             │
│  AR-009 Capability     la unidad de construcción        │
│  AR-010 Builder        ensambla software                │
└────────────────────────────────────────────────────────┘
```

## Índice

### Services

| AR | Servicio | Capa | Prioridad | ADRs |
|----|----------|------|-----------|------|
| [AR-001](./AR-001-Organization-Service.md) | Organization Service | Foundation | P0 | AR001 |
| [AR-002](./AR-002-Identity-Service.md) | Identity Service | Foundation | P0 | AR002 |
| [AR-003](./AR-003-Permission-Service.md) | Permission Service | Foundation | P0 | AR003, AR004 |
| [AR-004](./AR-004-Event-Bus.md) | Event Bus | Foundation | P0 | AR005, AR006, AR007 |
| [AR-005](./AR-005-Digital-Twin-Service.md) | Digital Twin Service | Intelligence | P0 | AR008, AR009, AR010 |
| [AR-006](./AR-006-Knowledge-Engine.md) | Knowledge Engine | Intelligence | P0 | AR011, AR012, AR013 |
| [AR-007](./AR-007-Architect-Service.md) | Architect Service | Intelligence | P0 | AR014, AR015, AR016 |
| [AR-008](./AR-008-Workflow-Engine.md) | Workflow Engine | Execution | P0 | AR017, AR018, AR019 |
| [AR-009](./AR-009-Capability-Engine.md) | Capability Engine | Build | P0 | AR020, AR021, AR022 |
| [AR-010](./AR-010-Builder-Engine.md) | Builder Engine | Build | P0 | AR023, AR024, AR025 |
| [AR-011](./AR-011-AI-Runtime.md) | AI Runtime | Intelligence | P0 | AR026, AR027, AR028 |
| [AR-012](./AR-012-Memory-Service.md) | Memory Service | Intelligence | P0 | AR029, AR030, AR031 |

### Composition & Distribution

| AR | Componente | Propósito | ADRs |
|----|-----------|----------|------|
| [AR-014](./AR-014-Capability-Catalog.md) | Capability Catalog | Catálogo oficial de Capabilities | AR035, AR036 |
| [AR-015](./AR-015-Stack-Engine.md) | Stack Engine | Composición de productos | AR037, AR038, AR039 |
| [AR-016](./AR-016-Stack-Studio.md) | Stack Studio | Entorno de diseño visual | AR040, AR041, AR042 |

## Orden de implementación recomendado

```
1. AR-001 Organization   →  raíz, todo depende de ella
2. AR-002 Identity
3. AR-003 Permission
4. AR-004 Event Bus       →  columna vertebral
5. AR-005 Digital Twin
6. AR-006 Knowledge Engine
7. AR-007 Architect
8. AR-011 AI Runtime      →  ningún servicio llama a un LLM sin esto
9. AR-012 Memory
10. AR-008 Workflow
11. AR-009 Capability
12. AR-010 Builder
```

## Stack común

NestJS · PostgreSQL · Redis · NATS JetStream (Kafka en Enterprise) · Neo4j (grafos) · Qdrant (vectores) · Temporal (workflows/tareas largas) · OpenTelemetry · Docker + Kubernetes-ready.

## Contrato transversal (todo AR cumple)

- Multi-tenant: todo request lleva `organization_id`, nunca inferido.
- Comunicación por eventos, no llamadas directas (ADR-AR006).
- Autorización delegada a Permission Service (ADR-AR003).
- IA solo vía AI Runtime (ADR-AR026).
- API REST + GraphQL + SDK + OpenAPI + Eventos + Observabilidad + Auditoría + Tests como Definition of Done.

> Todas las decisiones `ADR-ARXX` están consolidadas en el [ADR Ledger](../adr/README.md).

---

## Pendiente

- **AR-013 — Capability Blueprint:** el plano oficial que toda Capability debe cumplir (propuesto al cierre de AR-012). Estandariza la estructura interna para que cualquier dev/partner/IA cree capacidades con la misma arquitectura.
- **AR-014+** — Deploy Engine, Inteliar Cloud, Billing Engine, Monitoring (Foundation/Operations restantes).

---

*Inteliar Architecture Reference*
