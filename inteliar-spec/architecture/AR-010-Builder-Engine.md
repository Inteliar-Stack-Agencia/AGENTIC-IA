# INTELIAR ARCHITECTURE REFERENCE
## AR-010 — Builder Engine

**Versión:** 1.0 · **Estado:** Core Platform Builder · **Prioridad:** P0 (Estratégico)

---

## Objetivo

El motor de construcción. Transforma conocimiento, capacidades y decisiones en software ejecutable. No genera proyectos desde cero: construye a partir del ecosistema existente.

> Builder no es Low-Code, no es No-Code, no es un generador de CRUD. Es un **ensamblador de capacidades**. Nunca pregunta "¿qué tablas querés crear?", pregunta "¿qué problema querés resolver?"

Responde: *¿cómo implementamos esta solución utilizando el ecosistema Inteliar?*

## Arquitectura

```
Builder Engine
├── Project Generator     ├── AI Composer              ├── Test Generator
├── Capability Composer   ├── Infrastructure Composer   └── Deployment Generator
├── UI Composer           ├── Documentation Generator
├── API Composer          
├── Workflow Composer
```

**Flujo:** Discover → Architect → Digital Twin → Capability Map → Builder → Proyecto → Git → Deploy. Nunca empieza desde código.

- **Entradas:** Digital Twin, Capabilities, Workflows, Knowledge, Objetivos, Restricciones, Preferencias Técnicas, Arquitectura.
- **Salidas:** Repositorio, API, UI, Workflows, Configuración, Tests, Documentación, CI/CD, Infraestructura.

## El Builder no inventa

Toda decisión debe justificarse ("Se eligió Customer Management porque: la empresa administra clientes; ya existe una Capability estable; reduce tiempo de desarrollo; es compatible con el resto"). Toda decisión debe ser explicable.

## Composers

- **Project Generator:** estructura inicial siempre igual (`apps/ capabilities/ services/ docs/ tests/ infra/ .github/`).
- **Capability Composer:** selecciona, instala, configura, relaciona. Nunca duplica.
- **UI Composer:** usa componentes oficiales del Design System, nunca HTML libre.
- **API Composer:** REST, GraphQL, SDK, OpenAPI, Eventos — automáticamente.
- **Workflow Composer:** instala workflows existentes, genera nuevos solo si es necesario. Nunca reimplementa procesos resueltos.
- **AI Composer:** configura herramientas, agentes, prompts, memoria, políticas.
- **Infrastructure Composer:** decide Docker/Cloudflare/AWS/Vercel/Railway/Kubernetes según la arquitectura, no según preferencias personales.
- **Documentation Generator:** README, ADR, diagramas, OpenAPI, eventos, arquitectura. No existe software sin documentación.
- **Test Generator:** Unit, Integration, Contract, E2E, Performance, AI Evaluation — desde el primer día.

## Git-Native

Builder nunca guarda proyectos, siempre trabaja sobre Git: GitHub → Builder → Pull Request → Review → Merge.

## Clientes (mismo motor)

- **Claude Code / Cursor:** usan Builder como herramienta; nunca implementan directamente si Builder ya sabe construirlo.
- **VS Code Extension:** Agregar/Actualizar Capability, Generar Workflow, Analizar Proyecto, Crear ADR, Actualizar Arquitectura.
- **CLI:** `inteliar new · add capability customer · add workflow repairs · doctor · architect · generate docs · update`.

## Herramientas propias

- **Builder Doctor:** analiza un proyecto y detecta duplicación, capabilities desactualizadas, workflows sin tests, APIs sin documentación, permisos inconsistentes. No solo construye: mejora.
- **Builder Upgrade:** actualiza proyectos automáticamente; detecta breaking changes, dependencias, migraciones, riesgos; genera PRs. Nunca modifica producción directamente.
- **Project Health:** Architecture, Reuse, Coverage, Performance, Security, Documentation, Knowledge, Overall Score.
- **Dry Run:** simula toda generación sin modificar código.
- **Explain Mode:** responde *¿por qué generaste esta arquitectura?* Cada decisión tiene trazabilidad.

## API / Stack

```
POST /builder/project · /analyze · /generate · /upgrade · /doctor     GET /builder/health
```

No guarda estado permanente; trabaja sobre Git, Knowledge Engine, Digital Twin, Capability Registry.
Stack: NestJS · TypeScript · AST Engine (ts-morph) · Git SDK · OpenTelemetry · Temporal.
**Performance:** proyecto inicial `<2min`, agregar Capability `<30s`, actualizar `<1min`.
**Repository:** `services/builder-engine/`

## Definition of Done

Project Generator · Capability Composer · UI/API/Workflow Composer · Documentation Generator · Test Generator · Git Integration · CLI · VS Code · Claude Integration · Doctor · Upgrade · Dry Run · Explain Mode.

---

## 🚨 ADR-AR023 — Reutilizar antes de crear

Builder nunca genera código si ya existe una implementación reutilizable. Primero reutiliza, después adapta, y recién al final crea.

## 🚨 ADR-AR024 — El código pertenece al cliente, no a la herramienta

Todo proyecto generado por Builder debe poder ser entendido por un desarrollador sin usar Builder.

## ⭐ ADR-AR025 — Builder es un Director de Orquesta

Builder deja de ser un generador monolítico y pasa a ser un **orquestador de agentes especializados**:

```
Architect → Builder → UI Specialist → Backend Specialist → Workflow Specialist
→ Security Specialist → QA Specialist → Documentation Specialist → Git Specialist → PR listo
```

Cada agente domina un área (UI, Backend, Infraestructura, Seguridad, Testing, Documentación, Migraciones) y evoluciona de forma independiente. Builder asegura que todos trabajen con la misma arquitectura, estándares y objetivo.

> **Los tres pilares que hacen único a Inteliar:** Architect (comprende y diseña) · Digital Twin + Knowledge Engine (entienden y aprenden) · Builder (convierte comprensión en software).

---

*AR-010 — Builder Engine*
