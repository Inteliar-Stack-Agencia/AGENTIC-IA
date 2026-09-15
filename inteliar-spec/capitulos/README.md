# VOLUMEN 1 — FOUNDATION

**Estado:** Draft cerrado (con pendientes de coherencia)
**Última actualización:** 2026-07-13

Este volumen establece qué es Inteliar, cómo piensa y cómo se construye. Es el fundamento sobre el que se apoyan los volúmenes siguientes.

---

## Capítulos de este volumen

| Cap | Título | Estado | Rol |
|-----|--------|--------|-----|
| 14 | [Digital Twin](./14-Digital-Twin.md) | ✅ | El modelo vivo del negocio (kernel del BOS) |
| 15 | [Business Operating System](./15-Business-Operating-System.md) | ✅ | La definición estratégica de Inteliar |
| 16 | [Engineering Principles](./16-Engineering-Principles.md) | ✅ | La constitución técnica |
| 17 | [Open Platform Architecture](./17-Open-Platform-Architecture.md) | ✅ | Propiedad, Git Native, sin lock-in |
| 18 | [Discover Engine](./18-Discover-Engine.md) | ✅ | La puerta de entrada: comprender antes de construir |
| 19 | [Design Stage](./19-Design-Stage.md) | ✅ | Convertir comprensión en arquitectura ejecutable |
| 19b | [The Inteliar Manifesto](./19b-The-Inteliar-Manifesto.md) | ✅ | Libro I — la cultura y filosofía (leer **primero**) |
| 20 | [Organization System](./20-Organization-System.md) | ✅ | Libro II — la Organización como unidad principal |

> **Numeración:** el Cap 19 (Design Stage, línea de ingeniería) y el Cap 19b (Manifesto, línea fundacional) comparten número por venir de dos hilos de escritura paralelos. El Manifesto es material de **Libro I** y debe leerse antes que todo lo técnico.
>
> Los capítulos 1–13 fueron redactados en una sesión previa y todavía no están en este repositorio. Ver *Pendientes* abajo.

> **Track paralelo — Architecture Reference:** a partir de aquí el proyecto abrió un segundo hilo, el [Architecture Reference](../architecture/) (`AR-001`…`AR-012`), con especificaciones **implementables** de cada servicio. La Constitución dice *qué/por qué*; el AR dice *cómo se construye*.

---

## El arco del volumen

```
Por qué          → Qué es              → Cómo se construye        → Cómo entra una empresa
(Problema,         (BOS, Platform,       (Engineering Principles,   (Discover → Design)
 Filosofía)        Digital Twin)         Open Platform)
```

Al terminar el volumen, la definición de Inteliar quedó fijada:

> **Un Business Operating System.** No vende software: diseña, construye y hace evolucionar el sistema operativo de una empresa, a través de cinco etapas — **Discover → Design → Build → Operate → Evolve**.

---

## El ciclo de vida (columna vertebral)

```
1. Discover  (Cap 18)  — comprender la empresa
2. Design    (Cap 19)  — diseñar la solución (Blueprint ejecutable)
3. Build               — construir con Builder
4. Operate             — operar el negocio
5. Evolve              — mejorar continuamente
        ↑
   el Digital Twin (Cap 14) conecta las cinco etapas
```

---

## Decisiones arquitectónicas (ADRs)

Todas las decisiones del volumen están consolidadas en el **[ADR Ledger](../adr/README.md)** (015–027), incluyendo las dos reconciliaciones que resuelven contradicciones internas del volumen:

- **ADR-026** — Fuente de verdad en capas (Git = sistema, Twin = negocio).
- **ADR-027** — El Digital Twin vive en el repo del cliente (sin lock-in real).

---

## Pendientes de este volumen

> 🟠 Trabajo necesario antes de considerar el Volumen 1 "publicable".

1. **Capítulos 1–13** — traerlos al repositorio (texto íntegro está en ChatGPT / sesión previa).
2. **Pasada de coherencia sobre 1–13** — fueron escritos bajo la tesis pre-BOS ("construí tu SaaS"). Deben hablar en lenguaje de BOS y de las 5 etapas, coherentes con Caps 15 y 18.
3. **Renumeración** — la numeración 14–19 viene del orden de escritura; al integrar 1–13 hay que decidir la numeración final del volumen.

Las tensiones que **exceden** este volumen (precios, escalabilidad del Architect, privacidad del Knowledge Engine) están registradas al final del [ADR Ledger](../adr/README.md) para Volumen 2.

---

*Volumen 1 — Foundation · Inteliar Master Specification*
