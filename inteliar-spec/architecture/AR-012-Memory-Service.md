# INTELIAR ARCHITECTURE REFERENCE
## AR-012 — Memory Service

**Versión:** 1.0 · **Estado:** Core Intelligence Layer · **Prioridad:** P0 (Estratégico)

---

## Objetivo

El sistema oficial de memoria. Toda interacción, decisión, aprendizaje y contexto persistente pasa por aquí.

> **Memory no es Chat History. Tampoco es RAG.** Es una memoria viva. Las personas no recuerdan conversaciones: recuerdan contexto, relaciones, experiencias. Inteliar debe funcionar igual.

Responde: *¿qué necesita recordar Inteliar para tomar una mejor decisión hoy?* No todo merece recordarse — recordar demasiado también es un problema.

## Arquitectura — no existe una única memoria

```
Memory Service
├── Working Memory       ├── Episodic Memory      ├── Memory Consolidation
├── Conversation Memory  ├── Semantic Memory       └── Memory API
├── Organization Memory  ├── Memory Index
├── User / Agent Memory  ├── Memory Retrieval
├── Project Memory
```

Toda memoria tiene propósito; no se mezclan conceptos:

- **Working Memory:** vive solo durante una ejecución (pregunta → contexto → respuesta → se elimina). Nunca persiste.
- **Conversation Memory:** la conversación actual; puede resumirse/archivarse.
- **User Memory:** preferencias, idioma, forma de trabajar, configuraciones. Nunca info sensible innecesaria.
- **Organization Memory:** decisiones, procesos, objetivos, restricciones, historia, conocimiento específico. **La más importante.**
- **Agent Memory:** cada agente recuerda lo suyo (Support Agent conoce tickets/errores/clientes habituales, no finanzas si no corresponde).
- **Project Memory:** cada implementación genera memoria (Fixly → arquitectura, decisiones, problemas, migraciones).
- **Episodic Memory:** eventos y experiencias ("el cliente rechazó la propuesta → se simplificó el flujo → funcionó").
- **Semantic Memory:** conocimiento estable — pertenece al Knowledge Engine, no a una empresa.

## Qué recordar

Solo: Decisiones, Preferencias, Objetivos, Restricciones, Patrones, Errores, Aprendizajes, Contexto. Nunca ruido.

```
Memory: id, type, scope, owner, confidence, importance,
        created_at, expires_at, last_used, embedding, relationships
```

- **Scope:** `Session → Conversation → Project → Organization → Global`. Nunca mezclarlos.
- **Importance:** `Critical / High / Medium / Low / Disposable` (las descartables se eliminan).
- **Expiration:** no toda memoria es permanente (oferta válida 30 días → eliminar).

## Consolidation Engine (inspirado en el cerebro)

Cuando baja la actividad, el sistema resume, fusiona, descarta, relaciona:

```
100 conversaciones → 12 decisiones → 4 patrones → 1 aprendizaje importante
```

El aprendizaje permanece; las conversaciones se archivan.

## Retrieval

Nunca busca por palabras. Busca por contexto, objetivo, organización, actor, proceso, embeddings, knowledge:

```
Pregunta → Context Builder → Memory Search → Ranking → Compression → Architect
```

**Ranking** por recencia, importancia, frecuencia, confianza, relevancia.

## Relaciones

- **Knowledge:** Memory = empresa específica; Knowledge = patrón reutilizable. Nunca mezclar.
- **Digital Twin:** el Twin consulta Memory para entender decisiones pasadas; Memory consulta el Twin para contexto.
- **Architect:** toda conversación comienza Architect → Memory → Twin → Knowledge → Respuesta.

## API / Eventos

```
GET /memory/search · /memory/context     POST /memory/store · /update · /delete · /consolidate
```

`MemoryCreated · MemoryUpdated · MemoryExpired · MemoryRetrieved · MemoryMerged · MemoryArchived · MemoryConsolidated`

## Privacy (innegociable)

Toda memoria pertenece a una organización. **Nunca** puede usarse para responder sobre otra organización. El Knowledge Engine solo recibe patrones previamente anonimizados y validados.

## Stack / Performance

NestJS · PostgreSQL (metadata) · Redis (working memory) · Qdrant (embeddings) · Object Storage · OpenTelemetry.
**Objetivo:** búsqueda `<150ms`, consolidación asíncrona.
**Repository:** `services/memory-service/`

## Definition of Done

Working / Conversation / Organization / Agent Memory · Memory Retrieval · Consolidation · API · SDK · Observabilidad · Auditoría · Tests.

---

## 🚨 ADR-AR029 — Memory no es historial

Es contexto estructurado. Las conversaciones son una fuente de memoria, no la memoria en sí.

## 🚨 ADR-AR030 — Toda memoria debe tener un propósito

Si una memoria nunca vuelve a usarse y no aporta contexto futuro, debe poder archivarse o eliminarse. El crecimiento infinito de la memoria degrada la calidad del razonamiento.

## ⭐ ADR-AR031 — Active Memory

La memoria no solo responde consultas: observa el contexto y **propone** recuerdos relevantes cuando pueden mejorar una decisión (ej: "hace ocho meses descartamos una arquitectura similar porque no soportaba múltiples depósitos"). No interrumpe constantemente — solo cuando confianza y relevancia superan un umbral configurable. La memoria pasa de servicio pasivo a **colaborador activo**.

---

*AR-012 — Memory Service*
