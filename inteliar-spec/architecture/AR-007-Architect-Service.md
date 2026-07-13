# INTELIAR ARCHITECTURE REFERENCE
## AR-007 — Architect Service

**Versión:** 1.0 · **Estado:** Core Intelligence Service · **Prioridad:** P0 (Crítico)

---

## Objetivo

El motor de razonamiento de Inteliar. Transforma una conversación en una arquitectura empresarial. **No responde preguntas: diseña soluciones.**

> **Decisión clave:** The Architect **NO es un agente**. Es un **orquestador**. Detrás trabajan decenas de agentes especializados. El usuario jamás lo nota. Un LLM responde; The Architect comprende.

Cuando alguien dice "necesito un CRM", un chatbot responde "perfecto". The Architect responde "contame cómo trabajan hoy" — porque sabe que probablemente el problema no sea un CRM.

Responde: *¿cuál es la mejor evolución posible para esta organización?* No escribe código, no instala módulos, no hace deploy. Diseña.

## Arquitectura

```
Architect Service
├── Conversation Engine   ├── Recommendation Engine  ├── Decision Engine
├── Context Engine        ├── Planning Engine         ├── Explanation Engine
├── Discovery Engine      ├── Delegation Engine
├── Business Analyzer     ├── Capability Analyzer
```

**Flujo real:** Usuario → Conversation → Context → Digital Twin → Knowledge Engine → Especialistas → Decision Engine → Architect → Respuesta. **El LLM es solo una pieza, nunca la principal.**

## Motores

- **Conversation Engine:** conduce la conversación con un objetivo (Descubrir → Comprender → Diseñar → Validar → Proponer). Nunca improvisa.
- **Context Engine:** construye el contexto; nunca envía toda la empresa al modelo. Selecciona procesos, capacidades, métricas, objetivos, historial, restricciones relevantes. Reduce costos y mejora precisión.
- **Discovery Engine:** detecta industria, modelo de negocio, problemas, madurez, objetivos, herramientas actuales.
- **Business Analyzer:** construye un diagnóstico (duplicación de datos, stock manual, facturación lenta…). Nunca habla todavía de software.
- **Capability Analyzer:** transforma necesidades en Capabilities (control de reparaciones → Repair Management).
- **Recommendation Engine:** no recomienda módulos, recomienda decisiones ("no implementaría inventario todavía; primero resolvería el flujo comercial").
- **Planning Engine:** genera roadmap, prioridades, estimaciones, dependencias, riesgos.
- **Decision Engine:** el verdadero razonamiento. Recibe de Twin, Knowledge, Eventos, Objetivos, Industria, Costos, Políticas y genera una decisión.
- **Explanation Engine:** toda recomendación debe explicarse ("te recomiendo esto porque…"). Transparencia obligatoria.
- **Delegation Engine:** The Architect nunca hace todo; delega en especialistas (Business, Finance, Security, UX, Cost…). Todo transparente.

**Especialistas iniciales:** Business, Technology, Security, Finance, Data, UX, AI, Infrastructure, Compliance, Operations.

## Modelos de IA

Nunca depende de un único modelo: Claude, GPT, Gemini, DeepSeek, modelos propios. **Model Router** elige según la tarea (conversación larga → Claude; clasificación → modelo pequeño; embeddings → modelo específico; código → Claude Code).

- **Prompt Registry:** los prompts no viven en el código; se cargan dinámicamente, versionados, auditados, evaluados.
- **Herramientas:** el Architect usa herramientas, nunca conocimiento embebido (Digital Twin, Knowledge, Marketplace, Simulation, Builder, Billing, Search, Calendar, Deploy, Analytics).

## Thinking Pipeline

```
Pregunta → Contexto → Consulta Twin → Consulta Knowledge → Consulta Especialistas
→ Genera Hipótesis → Evalúa → Explica → Responde
```

Nunca improvisa. Antes de recomendar puede **simular** (consulta Simulation Engine, no responde de memoria).

## Confidence y escalamiento

Toda respuesta tiene Confidence Score (97% validado / 61% hipótesis / 38% necesito más info). Nunca aparenta certeza absoluta. Ante baja confianza, conflicto, cuestiones legales o decisiones críticas → **escala a un humano automáticamente**. Nunca inventa.

## API / Eventos

```
POST /architect/chat · /discover · /recommend · /simulate     GET /architect/roadmap
```

`ArchitectStarted · DiscoveryCompleted · RecommendationGenerated · SimulationRequested · CapabilityDetected · RoadmapCreated · HumanEscalationRequested`

## Persistencia

No guarda conversaciones (viven en Memory Service). Solo consume contexto.

## Stack

Orquestador: NestJS · Workflow interno: Temporal · LLM Router propio · Prompt Registry · Redis · PostgreSQL · OpenTelemetry.
**Repository:** `services/architect-service/`

## Definition of Done

Conversation Engine · Discovery · Context Engine · Recommendation Engine · Delegation · Simulation · API · SDK · Observabilidad · Tests.

---

## 🚨 ADR-AR014 — El Architect nunca consulta directamente una base de datos

Siempre consulta servicios especializados. Mantiene una única fuente de verdad.

## 🚨 ADR-AR015 — The Architect no es un LLM

Es un sistema distribuido de razonamiento. Los modelos de IA son reemplazables; la arquitectura no.

## ⭐ ADR-AR016 — One Organization, One Architect

Cada organización posee un Architect **persistente**: conoce su Digital Twin, recuerda decisiones anteriores, entiende los objetivos estratégicos, mantiene continuidad. No es un chat temporal — es un colaborador permanente. El cliente deja de hablar con "una IA" y empieza a hablar con **el arquitecto de su empresa**.

> **Intelligence Layer** (con AR-005/006): Digital Twin + Knowledge Engine + Architect.

---

*AR-007 — Architect Service*
