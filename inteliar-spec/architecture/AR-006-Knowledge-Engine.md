# INTELIAR ARCHITECTURE REFERENCE
## AR-006 — Knowledge Engine Service

**Versión:** 1.0 · **Estado:** Core Strategic Service · **Prioridad:** P0 (Activo Estratégico)

---

## Objetivo

El motor que captura, organiza, relaciona, valida y distribuye el conocimiento del ecosistema. No almacena documentos: **construye inteligencia reutilizable.**

> Pueden copiar Builder, módulos, agentes, UI, incluso parte del BOS. No pueden copiar diez años de conocimiento acumulado.

Responde: *¿qué sabemos sobre este problema y qué aprendimos anteriormente?* Nunca genera código ni ejecuta procesos.

## Arquitectura

```
Knowledge Engine
├── Knowledge Graph    ├── Recommendation Engine  ├── Search Engine
├── Pattern Detector   ├── Benchmark Engine        ├── Embedding Engine
├── Learning Pipeline  ├── Industry Engine          └── Knowledge API
├── Validation Engine
```

## Tipos de conocimiento

- **Business:** cómo funciona un negocio (taller, restaurante, distribuidora, clínica, municipalidad).
- **Process:** patrones operativos (ingreso → diagnóstico → presupuesto → producción → entrega → cobro).
- **Capability:** qué capacidades aparecen juntas (Clientes → Ventas → Facturación → Cobros → Reportes).
- **Technical:** arquitecturas, integraciones, buenas prácticas, errores frecuentes.
- **AI:** prompts, herramientas, workflows, agentes, resultados, evaluaciones.
- **Industry:** cada industria evoluciona su conocimiento propio.

## Modelo

```
KnowledgeObject: id, type, title, description, industry, confidence,
                 status, created_at, updated_at, source, relationships, references
```

Toda la información forma un único **grafo** (nunca listas, siempre relaciones).

## Confidence Score

Todo conocimiento tiene confianza (ej: 98% validado con 4.382 implementaciones vs 42% experimental con 5). El Architect lo usa antes de recomendar.

**Sources:** Discover, Implementaciones, Partners, Arquitectos Humanos, Agentes, Analytics, Marketplace, Eventos, Documentación.

## Nunca aprende automáticamente

No todo lo observado se convierte en conocimiento. Siempre hay pipeline:

```
Evento → Observación → Hipótesis → Validación →
Knowledge Candidate → Revisión → Knowledge Graph
```

**Validación:** evidencia estadística, revisión humana, múltiples implementaciones, pruebas automáticas.

## Motores

- **Pattern Detector:** procesos repetidos, automatizaciones exitosas, combinaciones frecuentes, errores comunes, cuellos de botella.
- **Recommendation Engine:** nunca por popularidad, siempre por contexto (una distribuidora LATAM de 25 empleados → Inventory/Warehouse/Picking/Barcode, no Hotel Template).
- **Benchmark Engine:** *¿cómo trabajan empresas similares?* Nunca datos privados, solo patrones agregados.
- **Industry Packs:** cada industria genera un paquete (Workshop Pack → KPIs, procesos, workflows, capacidades, automatizaciones, AI Pods).
- **Playbooks:** guías paso a paso (ej: "Abrir una nueva sucursal" → pasos, riesgos, KPIs).
- **Search:** nunca busca palabras, busca significado (embeddings + Knowledge Graph + contexto + industria + Digital Twin).
- **Embedding Engine:** todos los objetos generan embeddings — no solo documentos, también procesos, capacidades, decisiones, eventos.

## Knowledge ≠ Memory

Memory = empresa específica. Knowledge = patrones reutilizables. Nunca mezclar.

## Integraciones

- **Architect:** Usuario → Digital Twin → Knowledge → Architect → Respuesta (nunca directo al LLM).
- **Builder:** consulta arquitecturas, buenas prácticas, dependencias — no inventa.
- **Marketplace:** ordena resultados usando conocimiento, no solo descargas.

## API / Eventos

```
GET /knowledge/search · /object/:id · /patterns · /recommendations · /benchmarks · /playbooks
```

`KnowledgeCreated · KnowledgeValidated · PatternDetected · RecommendationGenerated · BenchmarkUpdated · IndustryPackPublished`

## Stack

Graph: Neo4j · Vector: Qdrant · Metadata: PostgreSQL · Embeddings: OpenAI-compatible / BGE / Nomic · Object Storage.
**Performance:** búsquedas `<300ms`, recomendaciones `<1s`.
**Repository:** `services/knowledge-engine/`

## Definition of Done

Knowledge Graph · Search · Embeddings · Recommendation Engine · Pattern Detector · Benchmark · API · GraphQL · SDK · Tests · Auditoría · Observabilidad.

---

## 🚨 ADR-AR011 — Nunca aprende directamente del usuario

Aprende únicamente mediante conocimiento validado. Evita contaminación, sesgos accidentales y degradación.

## 🚨 ADR-AR012 — Todo conocimiento es versionado

Nunca se sobrescribe. Siempre evoluciona.

## ⭐ ADR-AR013 — Inteliar debe generar conocimiento, no solo almacenarlo

El Knowledge Engine no funciona como una biblioteca, sino como un **científico**: además de almacenar, **genera hipótesis**.

```
420 distribuidoras que automatizaron picking → redujeron 28% los errores de despacho
→ hipótesis: "correlación fuerte entre automatización de picking y reducción de errores logísticos"
→ validación → si se confirma → conocimiento oficial
```

Inteliar no solo aprende: **descubre** conocimiento nuevo. El objetivo no es ser la mayor base de datos, sino el mejor sistema para descubrir cómo funcionan mejor las empresas — un **laboratorio mundial de conocimiento empresarial** (Business Research Platform). Cada empresa contribuye, de forma anónima y agregada, a descubrir mejores formas de trabajar.

---

*AR-006 — Knowledge Engine Service*
