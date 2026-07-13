# INTELIAR — Architectural Decision Records (ADR Ledger)

**Versión:** 2.0
**Propósito:** Registro único de todas las decisiones arquitectónicas de Inteliar.

> Este es el documento que Claude Code, GPT y cualquier agente IA deben consultar **antes** de escribir código. Si una decisión de código no puede rastrearse a un ADR de esta lista, o falta un ADR, o la decisión está mal.

---

## Namespaces de ADR

El proyecto tiene tres autores en paralelo (capítulos, reconciliaciones, architecture reference). Para que sus numeraciones nunca colisionen, cada tipo de decisión vive en su propio namespace:

| Namespace | Significado | Quién lo incrementa |
|-----------|-------------|---------------------|
| `ADR-0XX` | Decisiones de plataforma, atadas a un capítulo de la Constitución | El autor de capítulos (secuencia narrativa) |
| `ADR-RXX` | Reconciliaciones / enmiendas que resuelven contradicciones **entre** capítulos | Revisión arquitectónica |
| `ADR-ARXX` | Decisiones atadas a un documento del Architecture Reference | El autor del AR correspondiente |

> Regla: **no reutilizar un número dentro de un namespace.** El namespace `ADR-0XX` sigue la secuencia narrativa; el próximo ADR de plataforma es 028.

---

## Índice — Plataforma (`ADR-0XX`)

| ADR | Título | Estado | Capítulo |
|-----|--------|--------|----------|
| 015 | El Marketplace es el sistema económico de Inteliar | Accepted | 13 |
| 016 | Todo proyecto debe poseer un Digital Twin | Accepted | 14 |
| 017 | El Digital Twin es la fuente de verdad **del negocio** | Amended → R01 | 14 |
| 018 | Inteliar es un Business Operating System | Accepted | 15 |
| 019 | El activo principal de ingeniería es la arquitectura | Accepted | 16 |
| 020 | Todo proyecto nuevo debe fortalecer la Platform | Accepted | 16 |
| 021 | La métrica principal es el % de reutilización | Accepted | 16 |
| 022 | Inteliar nunca retiene clientes por dependencia técnica | Accepted | 17 |
| 023 | Inteliar es Git Native | Accepted | 17 |
| 024 | Todo proyecto comienza con Discover | Accepted | 18 |
| 025 | Discover First: primero comprensión, después software | Accepted | 18 |
| 026 | La Organización es la unidad principal de Inteliar | Accepted | 20 |
| 027 | Toda decisión debe responder a una Organización | Accepted | 20 |

## Índice — Reconciliaciones (`ADR-RXX`)

| ADR | Título | Estado | Reconcilia |
|-----|--------|--------|-----------|
| R01 | Fuente de verdad en capas (Git = sistema, Twin = negocio) | Accepted | 017 ↔ 023 |
| R02 | El Digital Twin vive en el repositorio del cliente | Accepted | Cap 14 ↔ 022 |

## Índice — Architecture Reference (`ADR-ARXX`)

| ADR | Título | Documento |
|-----|--------|-----------|
| AR001 | Organization Service es el servicio raíz | AR-001 |
| AR002 | Identity nunca conoce permisos ni organizaciones | AR-002 |
| AR003 | Ningún servicio implementa permisos internamente | AR-003 |
| AR004 | Authorization as Data (las reglas son datos, no código) | AR-003 |
| AR005 | Todo cambio relevante genera un evento | AR-004 |
| AR006 | Los servicios no se conocen entre sí (solo eventos) | AR-004 |
| AR007 | Business Events son ciudadanos de primera clase | AR-004 |
| AR008 | El Digital Twin es un modelo derivado, no transaccional | AR-005 |
| AR009 | Todo agente consulta primero el Twin | AR-005 |
| AR010 | Twin Dual Model (Operational + Strategic) | AR-005 |
| AR011 | El Knowledge Engine nunca aprende directo del usuario | AR-006 |
| AR012 | Todo conocimiento es versionado | AR-006 |
| AR013 | Inteliar genera conocimiento, no solo lo almacena | AR-006 |
| AR014 | The Architect nunca consulta una base de datos directa | AR-007 |
| AR015 | The Architect no es un LLM, es razonamiento distribuido | AR-007 |
| AR016 | One Organization, One Architect (persistente) | AR-007 |
| AR017 | Todo proceso empresarial se ejecuta en Workflow Engine | AR-008 |
| AR018 | Los Workflows son configuración, no programación | AR-008 |
| AR019 | Goal-Oriented Workflows (Standard/Adaptive/Autonomous) | AR-008 |
| AR020 | La Capability es la unidad mínima de negocio | AR-009 |
| AR021 | No se aceptan funcionalidades huérfanas | AR-009 |
| AR022 | Capabilities over Applications | AR-009 |
| AR023 | Builder reutiliza antes de crear | AR-010 |
| AR024 | El código pertenece al cliente, no a la herramienta | AR-010 |
| AR025 | Builder es un Director de Orquesta (orquesta agentes) | AR-010 |
| AR026 | Ningún servicio invoca directamente un modelo de IA | AR-011 |
| AR027 | Los modelos son reemplazables; la inteligencia no | AR-011 |
| AR028 | Cognitive Resource Management | AR-011 |
| AR029 | Memory no es historial, es contexto estructurado | AR-012 |
| AR030 | Toda memoria debe tener un propósito | AR-012 |
| AR031 | Active Memory (memoria proactiva) | AR-012 |
| AR035 | El Capability Catalog es la fuente oficial | AR-014 |
| AR036 | Universal Capability Language (UCL) | AR-014 |
| AR037 | El Stack es la unidad oficial de distribución | AR-015 |
| AR038 | Todo Stack debe poder descomponerse completamente | AR-015 |
| AR039 | Stack as Product | AR-015 |
| AR040 | Dual Interface Requirement | AR-016 |
| AR041 | Mode Abstraction | AR-016 |
| AR042 | Inteliar is the Business Design Platform | AR-016 |

> Todos aceptados (`Accepted`). El texto completo de cada uno vive en su documento AR.

## Índice — Engineering Standards (`ADR-ENGXX`)

| ADR | Título | Documento |
|-----|--------|-----------|
| ENG001 | Repository as Contract | ES-001 |
| ENG002 | Clear Responsibility | ES-001 |
| ENG003 | Platform Manifest | ES-001 |

> Estándares de engineering que establecen cómo se organiza y desarrolla la plataforma.

## Índice — Engineering Handbook (`ADR-EHXX`)

| ADR | Título | Documento |
|-----|--------|-----------|
| EH001 | Ecosystem First | EH-001 |
| EH002 | Code Ownership | EH-001 |
| EH003 | The Inteliar Method | EH-001 |

> Principios de ingeniería que guían todas las decisiones técnicas.

---

## ADR-026 — La Organización es la unidad principal de Inteliar

**Estado:** Accepted · **Capítulo:** 20

Todo lo demás deriva de la Organización. No existen proyectos, usuarios ni agentes sin organización. Toda información pertenece a una Organización, nunca a un usuario, desarrollador o proyecto.

## ADR-027 — Toda decisión debe responder a una Organización

**Estado:** Accepted · **Capítulo:** 20

Antes de crear cualquier entidad nueva hay que responder: *¿a qué Organización pertenece?* Si no se puede responder, el modelo está mal diseñado. Inteliar no administra usuarios ni bases de datos: administra organizaciones vivas.

---

## ADR-R01 — Fuente de verdad en capas

**Estado:** Accepted
**Reconcilia:** ADR-017 (Cap 14) ↔ ADR-023 y Cap 16 ("Git es la verdad")

### Contexto
Volumen 1 declaró **dos** fuentes únicas de verdad: el Digital Twin (Cap 14 / ADR-017) y Git (Cap 16 / ADR-023). Tomadas literalmente, se contradicen. Un agente IA no sabría a cuál obedecer en un conflicto.

### Decisión
No hay una fuente única. Hay **dos capas con dominios disjuntos**:

```
GIT — verdad del SISTEMA          DIGITAL TWIN — verdad del NEGOCIO
código, esquema, config, ADRs,    procesos, personas, objetivos,
Blueprint y el propio Twin file.  relaciones, reglas, madurez.
"¿qué está construido?"           "¿cómo funciona la empresa?"
```

Resolución de conflictos:
- Preguntas sobre **el software** → Git manda.
- Preguntas sobre **el negocio** → el Twin manda.
- El Twin describe algo que el código no implementa → **es un requerimiento** (entra a Design como gap), no un conflicto.
- El código hace algo que el Twin no refleja → **bug de modelo**: el Twin debe actualizarse.

### Consecuencia
ADR-017 queda enmendado (Twin = verdad del negocio). Cap 16 queda enmendado ("Git es la verdad" = del sistema). Cero ambigüedad para agentes IA.

---

## ADR-R02 — El Digital Twin vive en el repositorio del cliente

**Estado:** Accepted
**Reconcilia:** Cap 14 ("el Twin es el verdadero producto") ↔ Cap 17 / ADR-022 (sin lock-in)

### Contexto
Si el activo más valioso (el Twin) vive dentro de Inteliar, hay lock-in sobre lo más importante y la promesa de Cap 17 es hueca.

### Decisión
El Twin vive en el repo del cliente, versionado:

```
github.com/{cliente}/proyecto/.inteliar/
├── twin.yaml          # el modelo de negocio
├── twin.history/      # snapshots por versión
└── blueprint.yaml     # el Solution Blueprint (Cap 19)
```

Inteliar lee y actualiza el Twin vía PR (ADR-023), pero no lo retiene. Si el cliente se va, se lo lleva completo.

```
Cliente se lleva:              Inteliar retiene (no transferible):
✓ Código, Twin, Blueprint      ✗ Knowledge Engine (patrones agregados)
✓ ADRs del proyecto, Datos     ✗ The Architect, Agentes, Cloud, Marketplace
```

### Consecuencia
El moat de Inteliar **no es** el Twin del cliente: es el Knowledge Engine + The Architect. La promesa de no lock-in (ADR-022) queda verdadera y completa.

---

## Tensiones resueltas

| Contradicción detectada | Resuelta por |
|-------------------------|--------------|
| Dos "fuentes únicas de verdad" (Git vs Twin) | ADR-R01 |
| Twin como activo central vs promesa de no lock-in | ADR-R02 |
| Colisión de numeración ADR-026/027 (capítulo vs reconciliación) | Namespaces (`RXX`) |

---

## Tensiones aún abiertas (para Volúmenes/Libros siguientes)

1. **Modelo de precios concreto** — ADR-018 define fuentes de ingreso; faltan números.
2. **Escalabilidad de The Architect** — ¿contexto global o aislado por organización?
3. **Privacidad del Knowledge Engine** — consentimiento y anonimización con que absorbe patrones sin exponer datos entre organizaciones.
4. **Coherencia de Caps 1–13** — escritos pre-BOS; pasada pendiente.

---

*ADR Ledger — Inteliar Master Specification / The Inteliar Constitution*
