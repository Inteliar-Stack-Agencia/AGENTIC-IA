# INTELIAR — Architectural Decision Records (ADR Ledger)

**Versión:** 1.0
**Alcance:** ADRs de plataforma (015–027)
**Propósito:** Registro único de todas las decisiones arquitectónicas de Inteliar.

> Este es el documento que Claude Code, GPT y cualquier agente IA deben consultar **antes** de escribir código. Si una decisión de código no puede rastrearse a un ADR de esta lista, o falta un ADR, o la decisión está mal.

---

## Cómo leer un ADR

```
Estado:    Accepted | Superseded | Proposed
Contexto:  Qué problema forzó la decisión
Decisión:  Qué se decidió (imperativo)
Consecuencia: Qué implica, qué se gana, qué se resigna
```

---

## Índice

| ADR | Título | Estado | Capítulo |
|-----|--------|--------|----------|
| 015 | El Marketplace es el sistema económico de Inteliar | Accepted | 13 |
| 016 | Todo proyecto debe poseer un Digital Twin | Accepted | 14 |
| 017 | El Digital Twin es la fuente de verdad **del negocio** | Amended | 14 → 026 |
| 018 | Inteliar es un Business Operating System | Accepted | 15 |
| 019 | El activo principal de ingeniería es la arquitectura | Accepted | 16 |
| 020 | Todo proyecto nuevo debe fortalecer la Platform | Accepted | 16 |
| 021 | La métrica principal es el % de reutilización | Accepted | 16 |
| 022 | Inteliar nunca retiene clientes por dependencia técnica | Accepted | 17 |
| 023 | Inteliar es Git Native | Accepted | 17 |
| 024 | Todo proyecto comienza con Discover | Accepted | 18 |
| 025 | Discover First: primero comprensión, después software | Accepted | 18 |
| **026** | **Fuente de verdad en capas (Git + Twin)** | **Accepted** | **reconciliación** |
| **027** | **El Digital Twin vive en el repositorio del cliente** | **Accepted** | **reconciliación** |

---

## ADR-026 — Fuente de verdad en capas

**Estado:** Accepted
**Reconcilia:** ADR-017 (Cap 14) ↔ ADR-023 y Cap 16 ("Git es la verdad")

### Contexto

Volumen 1 declaró, en distintos capítulos, **dos** fuentes únicas de verdad:

- Cap 14 / ADR-017: *"El Digital Twin es la fuente única de verdad."*
- Cap 16 y Cap 17 / ADR-023: *"Git es la verdad."*

Ambas afirmaciones son absolutas y, tomadas literalmente, se contradicen. Un agente IA que deba resolver un conflicto entre lo que dice el Twin y lo que dice el código no sabría a cuál obedecer.

### Decisión

No hay una fuente de verdad única. Hay **dos capas de verdad, con dominios disjuntos**:

```
┌─────────────────────────────────────────────┐
│  GIT — verdad del SISTEMA                     │
│  Código, esquema, configuración, ADRs,        │
│  el propio Blueprint y el propio Twin file.   │
│  Responde: "¿qué está construido?"            │
├─────────────────────────────────────────────┤
│  DIGITAL TWIN — verdad del NEGOCIO            │
│  Procesos, personas, objetivos, relaciones,   │
│  reglas, madurez, evolución.                  │
│  Responde: "¿cómo funciona la empresa?"       │
└─────────────────────────────────────────────┘
```

Regla de resolución de conflictos:

- Preguntas sobre **el software** → Git manda.
- Preguntas sobre **el negocio** → el Twin manda.
- Cuando el Twin describe una realidad que el código todavía no implementa, **eso no es un conflicto: es un requerimiento** (entra a Design como gap).
- Cuando el código hace algo que el Twin no refleja, **eso sí es un bug de modelo**: el Twin debe actualizarse (Discover continuo, Cap 14).

### Consecuencia

- ADR-017 queda **enmendado**: el Twin es la fuente de verdad *del negocio*, no del sistema.
- Cap 16 queda enmendado: "Git es la verdad" se refiere a la verdad *del sistema*.
- Ambos artefactos son versionados y viven en Git (ver ADR-027), por lo que Git contiene físicamente al Twin, pero el Twin es la autoridad *semántica* sobre el dominio de negocio.
- Se gana: cero ambigüedad para agentes IA. Se resigna: la elegancia de una frase única de marketing ("una sola verdad"). Vale la pena.

---

## ADR-027 — El Digital Twin vive en el repositorio del cliente

**Estado:** Accepted
**Reconcilia:** Cap 14 ("el Twin es el verdadero producto") ↔ Cap 17 / ADR-022 (sin vendor lock-in)

### Contexto

Cap 14 afirma que el Digital Twin es *"el verdadero producto"* y el activo más valioso.
Cap 17 promete que el cliente puede irse cuando quiera, sin lock-in, porque el código vive en su Git.

Tensión: si el activo más valioso (el Twin) vive **dentro de Inteliar**, entonces sí existe lock-in sobre lo más importante, y la promesa de Cap 17 es parcialmente hueca. Había que decidir dónde vive el Twin.

### Decisión

El Digital Twin vive en el **repositorio del cliente**, como artefacto versionado:

```
github.com/{cliente}/proyecto/
└── .inteliar/
    ├── twin.yaml            # el modelo de negocio, versionado
    ├── twin.history/        # snapshots por versión (Twin Versioning, Cap 14)
    └── blueprint.yaml       # el Solution Blueprint (Cap 19)
```

Inteliar **no retiene el Twin**. Lo lee, lo actualiza (vía PR, como cualquier otro cambio, ADR-023) y razona sobre él. Si el cliente se va, se lleva su Twin completo.

Lo que Inteliar **sí retiene** es distinto y no transferible:

```
Cliente se lleva:              Inteliar retiene:
─────────────────              ─────────────────────────────
✓ Código                       ✗ Knowledge Engine (patrones agregados)
✓ Digital Twin                 ✗ The Architect (el motor de razonamiento)
✓ Blueprint                    ✗ Agentes entrenados sobre el ecosistema
✓ ADRs del proyecto            ✗ Marketplace, Cloud, Monitoring
✓ Datos                        ✗ La inteligencia que mejora con cada Discover
```

### Consecuencia

- El moat de Inteliar **no es** el Twin del cliente (ese es del cliente). El moat es el **Knowledge Engine** y **The Architect**: la inteligencia agregada que ningún cliente individual se puede llevar porque no es suya, es del ecosistema.
- Esto hace la promesa de Cap 17 **verdadera y completa**: no hay lock-in ni siquiera sobre el activo más valioso del cliente.
- Refuerza ADR-022: la permanencia es por valor (Architect + Knowledge mejoran cada mes), nunca por retención de datos.
- Cap 14 queda enmendado: el Twin es el verdadero producto *para el cliente*, pero el verdadero **activo de Inteliar** es la inteligencia que opera sobre miles de Twins.

---

## Tensiones resueltas — resumen

| Contradicción detectada en Vol. 1 | Resuelta por |
|-----------------------------------|--------------|
| Dos "fuentes únicas de verdad" (Git vs Twin) | ADR-026 |
| Twin como activo central vs promesa de no lock-in | ADR-027 |

---

## Tensiones aún abiertas (para Volumen 2)

> 🟡 Estas no se resuelven en Volumen 1. Se registran para no perderlas.

1. **Modelo de precios concreto** — ADR-018 define múltiples fuentes de ingreso, pero faltan números (suscripción, tokens, revenue share %). Requiere ADR en Vol. 2 (Operations).
2. **Escalabilidad de The Architect** — ¿un contexto global o aislado por organización? Impacta privacidad y latencia. Requiere ADR técnico.
3. **Privacidad del Knowledge Engine** — ADR-027 dice que Inteliar aprende del ecosistema; falta definir el consentimiento y la anonimización con los que el Knowledge Engine absorbe patrones sin exponer datos de un cliente a otro.
4. **Coherencia de Caps 1–13** — fueron escritos bajo la tesis pre-BOS. Necesitan una pasada para hablar en lenguaje de BOS y de las 5 etapas.

---

*ADR Ledger — Inteliar Master Specification*
*Mantener actualizado es tan importante como el código.*
