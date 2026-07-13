# INTELIAR MASTER SPECIFICATION
## Capítulo 19 — Design Stage

**Versión:** 1.0
**Estado:** Core Architecture
**Prioridad:** Máxima
**Depende de:** Cap 18 (Discover Engine), Cap 14 (Digital Twin), Cap 16 (Engineering Principles)
**Alimenta a:** Build Stage, Builder Engine

---

## Objetivo

Definir la etapa que convierte **comprensión** en **arquitectura ejecutable**.

Discover produce entendimiento. Design produce un plan que Builder puede construir sin ambigüedad.

Design es el puente entre las dos preguntas:

```
Discover responde:  ¿Qué necesita esta empresa?
Design responde:    ¿Cómo se construye exactamente?
```

Si al terminar Design todavía hay decisiones arquitectónicas abiertas, Design no terminó.

---

## Filosofía

Discover no puede producir código porque todavía no decidió nada técnico.
Build no puede empezar porque todavía no sabe qué construir.

Design es donde se toman **todas** las decisiones técnicas, y donde se aplica el principio más importante de Inteliar:

> **Regla del 80% (ADR-021):** antes de diseñar algo nuevo, Design debe demostrar que el 80% ya existe en el ecosistema. Lo nuevo se justifica, no se asume.

Design no dibuja una solución ideal desde cero.
Design **ensambla** una solución con lo que ya existe y aísla lo mínimo que hay que crear.

---

## Qué recibe de Discover

Design nunca empieza en blanco. Recibe los ocho artefactos del capítulo anterior:

| Input | Origen | Uso en Design |
|-------|--------|---------------|
| Business Profile | Discover | Contexto general |
| Digital Twin | Discover / Cap 14 | Fuente de verdad del negocio |
| Capability Map | Discover | Qué capacidades existen y en qué estado |
| Friction Map | Discover | Qué priorizar primero |
| Opportunity Map | Discover | Qué automatizar, ROI estimado |
| Digital Maturity | Discover | Cuánta ambición técnica soporta hoy |
| AI Readiness | Discover | Qué agentes son viables ya |
| Roadmap preliminar | Discover | Orden de implementación |

Design **no vuelve a preguntar** lo que Discover ya respondió. Consulta el Twin.

---

## Qué produce Design

El entregable de Design es **un solo artefacto formal**: el **Solution Blueprint**.

El Solution Blueprint contiene ocho secciones:

```
Solution Blueprint
│
├── 1. Solution Architecture   Diagrama de componentes
├── 2. Capability Selection    Qué capacidades activar
├── 3. Reuse Analysis          80% existente / 20% nuevo
├── 4. Module Plan             Qué módulos, en qué orden
├── 5. Data Model              Entidades, relaciones, ownership
├── 6. Agent Roster            Qué agentes, qué hacen
├── 7. Integration Map         Conexiones a sistemas externos
└── 8. Deployment Topology     Dónde corre cada cosa
```

Más una estimación económica y de tiempo derivada de las ocho secciones.

---

## El proceso de Design (pipeline)

Design es determinístico en su estructura, aunque The Architect razone dentro de cada paso.

```
1. Load Twin
        ↓
2. Map Capabilities → Requirements
        ↓
3. Reuse Analysis (80% rule)
        ↓
4. Gap Design (el 20% nuevo)
        ↓
5. Data Model resolution
        ↓
6. Agent selection
        ↓
7. Integration planning
        ↓
8. Deployment topology
        ↓
9. Estimation
        ↓
10. Human approval gate
        ↓
Solution Blueprint (firmado)
```

Ningún paso puede saltearse. El paso 10 es obligatorio (ver *Human-in-the-loop*).

---

## Paso 3 — Reuse Analysis (el corazón de Design)

Este es el paso que diferencia a Inteliar de cualquier generador de código.

Por cada requerimiento del negocio, The Architect clasifica en tres categorías:

```
REQUERIMIENTO
     │
     ├── EXISTE      → capability/module ya está en el ecosistema
     │                 acción: instalar
     │
     ├── ADAPTABLE   → existe algo cercano, requiere configuración
     │                 acción: instalar + configurar
     │
     └── NUEVO       → no existe nada reutilizable
                       acción: diseñar (requiere justificación)
```

### Ejemplo real — Taller mecánico

```
Requerimiento                  Clasificación   Fuente
─────────────────────────────  ──────────────  ─────────────────────
Gestión de clientes            EXISTE          modules/customers
Órdenes de reparación          ADAPTABLE       modules/repairs (config)
Inventario de repuestos        EXISTE          modules/inventory
Facturación                    EXISTE          modules/payments
Turnos de taller               ADAPTABLE       modules/appointments
Diagnóstico asistido por IA    NUEVO           requiere diseño
Historial por vehículo         NUEVO           requiere diseño
```

Resultado del análisis:

```
EXISTE      → 3 requerimientos   (43%)
ADAPTABLE   → 2 requerimientos   (29%)
NUEVO       → 2 requerimientos   (28%)

Reutilización total: 72%
Desarrollo nuevo:    28%
```

> 🟠 **Regla de escalación:** si la reutilización cae por debajo del 60%, Design debe abrir un ADR explicando por qué. Un proyecto con 28% nuevo es aceptable. Un proyecto con 70% nuevo significa que **falta capability en Platform** (ADR-020), no que el proyecto sea especial.

Cada requerimiento `NUEVO` que aparece repetidamente en distintos Discover es una **señal de que Platform necesita una nueva capability**. Design reporta esto al Knowledge Engine.

---

## Paso 5 — Data Model resolution

Design produce el modelo de datos formal, respetando el **ownership** definido en el Twin.

Regla de ownership (deriva de Cap 16, sexto principio y del Twin):

> Cada entidad tiene **un solo módulo dueño**. Los demás la referencian, nunca la duplican.

Ejemplo:

```
Entidad        Dueño (owner)        Referenciada por
─────────────  ───────────────────  ──────────────────────────
Customer       modules/customers    repairs, payments, appointments
Vehicle        modules/repairs      appointments, diagnostics
Part           modules/inventory    repairs, payments
Invoice        modules/payments     —
Appointment    modules/appointments repairs
```

Cada entidad se documenta con:

```yaml
entity: Vehicle
owner: modules/repairs
fields:
  - id: uuid (pk)
  - customer_id: uuid (fk → customers.Customer)
  - plate: string (unique)
  - brand: string
  - model: string
  - year: int
events_emitted:
  - vehicle.created
  - vehicle.updated
referenced_by:
  - modules/appointments (read-only)
  - modules/diagnostics (read-only)
```

Ninguna entidad `NUEVA` puede duplicar campos que otra entidad ya posee (segundo principio, Cap 16). Design valida esto automáticamente contra el Twin.

---

## Paso 6 — Agent Roster

Design selecciona qué agentes operarán el sistema, **filtrados por AI Readiness**.

Si Discover reportó AI Readiness bajo, Design no propone agentes autónomos: propone agentes **asistivos** (sugieren, no ejecutan) hasta que la empresa madure.

```
AI Readiness   Modo de agente propuesto
────────────   ──────────────────────────────────
< 30%          Asistivo (sugiere, humano ejecuta)
30% – 70%      Semi-autónomo (ejecuta con aprobación)
> 70%          Autónomo (ejecuta y reporta)
```

Ejemplo (taller, AI Readiness 40%):

```
Agente          Rol                          Modo
──────────────  ───────────────────────────  ──────────────
Diagnostics     Sugiere fallas probables     Asistivo
Inventory       Alerta de stock bajo         Semi-autónomo
Support         Responde consultas cliente   Semi-autónomo
Finance         Concilia pagos               Semi-autónomo
```

Cada agente se ancla a una capability y a los eventos que consume/emite (Cap 15, Agent System).

---

## Paso 8 — Deployment Topology

Coherente con Cap 17 (Open Platform), Design **no impone** proveedor. Produce una topología abstracta y una recomendación:

```yaml
deployment:
  repository: github.com/{cliente}/taller     # vive en el cliente
  strategy: monorepo
  runtime_recommendation: vercel               # recomendación, no obligación
  alternatives: [aws, railway, fly, self-hosted]
  services:
    - name: web
      type: frontend
    - name: api
      type: backend
    - name: diagnostics-agent
      type: worker
  data:
    provider_recommendation: supabase
    twin_location: repository                   # ver ADR-R02
```

El cliente puede sobreescribir cualquier recomendación. Design nunca genera lock-in (ADR-022).

---

## El Solution Blueprint (artefacto formal)

El output de Design es un archivo versionado que vive en el repo del cliente (coherente con ADR-023, Git Native):

```yaml
# inteliar.blueprint.yaml
version: 1.0
project: taller-lopez
generated_from: discover://taller-lopez/2026-07-13
twin_ref: twin://taller-lopez@v3

capabilities:
  - customers    { source: existing,  action: install }
  - inventory    { source: existing,  action: install }
  - payments     { source: existing,  action: install }
  - repairs      { source: existing,  action: install+configure }
  - appointments { source: existing,  action: install+configure }
  - diagnostics  { source: new,       action: design, adr: ADR-T01 }
  - vehicles     { source: new,       action: design, adr: ADR-T02 }

reuse:
  existing: 72%
  new: 28%

agents:
  - diagnostics { mode: assistive }
  - inventory   { mode: semi-autonomous }
  - support     { mode: semi-autonomous }
  - finance     { mode: semi-autonomous }

estimation:
  reused_effort: 72%
  new_effort_hours: 96
  timeline_weeks: 3
  monthly_platform_cost_usd: 240
  estimated_hours_saved_weekly: 22   # del Opportunity Map

approvals:
  architect_ai: signed
  human_reviewer: pending
```

Este archivo **es** el contrato entre Design y Build. Builder lo lee y construye exactamente eso.

---

## Simulación antes de construir

Design aprovecha el Impact Analysis del Twin (Cap 14). Antes de aprobar el Blueprint, se puede simular:

```
¿Qué pasa si agrego el módulo de diagnóstico con IA?
        ↓
Twin simula:
  - Nuevos procesos: 2
  - Procesos impactados: recepción, presupuesto
  - Datos nuevos: historial por vehículo
  - Ahorro estimado: +8 h/semana
  - Riesgo: dependencia de calidad de datos históricos
```

Todo antes de escribir una línea. Esto es lo que ningún generador de código puede hacer: **razonar sobre las consecuencias** porque tiene el Twin.

---

## Human-in-the-loop (Paso 10)

Coherente con el sexto principio de ingeniería (Cap 16: *la IA no toma decisiones arquitectónicas sola*):

> 🔴 **CRÍTICO:** ningún Solution Blueprint pasa a Build sin firma humana.

The Architect puede diseñar el 100% del Blueprint. Pero un arquitecto humano (del cliente, de Inteliar, o un Partner) debe aprobarlo. La firma queda registrada en el Blueprint y en el Twin (versionado).

Qué revisa el humano:
- ¿La clasificación EXISTE/ADAPTABLE/NUEVO es correcta?
- ¿Los `NUEVO` están realmente justificados?
- ¿El data model respeta ownership?
- ¿Los agentes tienen el modo correcto según la madurez real?
- ¿La estimación es creíble?

---

## Design → Build handoff

El handoff es un contrato explícito, no una transferencia ambigua:

```
Design entrega:          inteliar.blueprint.yaml (firmado)
                                    ↓
Builder recibe:          el blueprint como única instrucción
                                    ↓
Builder ejecuta:         install → configure → generate → PR
                                    ↓
Git registra:            un PR por cada capability del blueprint
```

Builder **nunca** improvisa. Si el Blueprint dice `diagnostics: new`, Builder genera scaffolding para diseño nuevo. Si dice `customers: install`, Builder instala el módulo existente. Cero interpretación.

---

## Governance del Design

| Regla | Enforcement |
|-------|-------------|
| Todo Blueprint referencia un Twin versionado | Validación automática |
| Reutilización < 60% requiere ADR | CI check |
| Toda entidad tiene un solo owner | Validación automática contra Twin |
| Todo `NUEVO` recurrente se reporta a Knowledge | Automático |
| Ningún Blueprint sin firma humana pasa a Build | Gate obligatorio |

---

## Relación con el ciclo de vida (Cap 18)

Design es la segunda de las cinco etapas:

```
Discover → [DESIGN] → Build → Operate → Evolve
   ↑                                        │
   └────────────── el Twin conecta ─────────┘
```

En **Evolve**, cuando la empresa cambia, se ejecuta un **nuevo Design** (un Blueprint incremental), no un rediseño desde cero. El Twin ya tiene todo el contexto.

---

## 🚨 ADR-T (los ADRs específicos del proyecto)

Design es donde nacen los ADRs específicos de cada proyecto (distintos de los ADRs de plataforma 015–027). Cada requerimiento `NUEVO` genera un ADR local en el repo del cliente:

```
github.com/{cliente}/taller/docs/adr/
├── ADR-T01-diagnostics-engine.md
└── ADR-T02-vehicle-history.md
```

Así el conocimiento arquitectónico del proyecto vive **con el proyecto**, no en Inteliar (coherente con ADR-023).

---

## ⭐ Nota del arquitecto

Discover fue el capítulo que cambió *cuándo* aparece el software (al final, no al principio).

Design es el capítulo que cambia *cuánto* software se escribe.

En cualquier consultora tradicional, "diseño de solución" significa un PowerPoint con cajas. En Inteliar, Design produce un artefacto **ejecutable**: el Blueprint no describe la solución, **es** la solución en su forma declarativa. Build solo lo materializa.

Y hay algo más profundo. Cada vez que Design clasifica un requerimiento como `NUEVO`, está diciendo una de dos cosas:

1. Este negocio es genuinamente único en ese punto, o
2. **Platform todavía no aprendió a resolver esto.**

La mayoría de las veces es la opción 2. Por eso el verdadero producto de Design no es el Blueprint del cliente: es la **lista de cosas que Platform todavía no sabe hacer**. Esa lista, acumulada sobre miles de Discover, es el roadmap real de Inteliar.

Design no solo diseña software para un cliente.
Diseña, involuntariamente, el futuro de la plataforma.

---

*Fin del Capítulo 19 — Design Stage*
*Volumen 1 — Foundation*
