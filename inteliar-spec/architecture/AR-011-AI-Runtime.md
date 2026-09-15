# INTELIAR ARCHITECTURE REFERENCE
## AR-011 — AI Runtime

**Versión:** 1.0 · **Estado:** Core AI Platform · **Prioridad:** P0 (Estratégico)

---

## Objetivo

El sistema operativo de IA de Inteliar. Administra todo lo relacionado con IA (Architect, AI Pods, Agentes, Automatizaciones, Builder, Chat, Clasificación, Análisis). Todo pasa por AI Runtime.

> La IA no es una funcionalidad, es infraestructura. Así como existe una base de datos, existe un AI Runtime. La mayoría de los SaaS agregan un chatbot; nosotros construimos un sistema donde la IA es **ciudadano de primera clase**.

Responde: *¿cómo ejecutamos inteligencia de la forma más eficiente, segura y económica posible?* No diseña, no construye, no conversa. **Ejecuta inteligencia.**

## Arquitectura

```
AI Runtime
├── Model Router      ├── Context Builder    ├── Model Registry
├── Agent Runtime     ├── Cost Optimizer      ├── Token Manager
├── Tool Runtime      ├── Evaluation Engine    └── Runtime API
├── Memory Runtime    ├── Safety Engine
├── Prompt Runtime
```

> **Regla:** ningún servicio habla directamente con OpenAI, Claude o Gemini. Hablan con AI Runtime. Siempre.

## Motores

- **Model Router:** selecciona el mejor modelo según costo, velocidad, precisión, contexto, disponibilidad (clasificar email → modelo pequeño; arquitectura → Claude; código → Claude Code; OCR → Vision; resumen → GPT). El desarrollador nunca decide, el Runtime sí.
- **Model Registry:** Claude, GPT, Gemini, Mistral, DeepSeek, Llama, Qwen, modelos locales — cada uno con capacidades, costo, ventana de contexto, latencia, estado.
- **Fallback:** Claude → GPT → Gemini → Modelo Local. Nunca interrumpir al usuario.
- **Token Manager:** calcula tokens, costo, latencia, cache, presupuesto.
- **Cost Optimizer:** antes de ejecutar, ¿existe forma más barata? (modelo pequeño en vez de Claude → ahorro 95%).
- **Context Builder:** nunca envía toda la organización, solo lo necesario (Digital Twin, Memory, Knowledge, Workflow, Objetivo).
- **Prompt Runtime:** los prompts son recursos versionados, no strings (`id, version, owner, status, variables, tools, evaluation`).
- **Tool Runtime:** toda IA usa herramientas, nunca responde solo desde el modelo (Buscar Cliente, Consultar Stock, Emitir Factura, Actualizar Workflow, Consultar Knowledge). Tool Registry: nombre, descripción, permisos, costo, tiempo, input, output, versiones.
- **Agent Runtime:** ejecuta agentes sin saber qué hacen; solo administra ciclo de vida (`Created → Running → Waiting → Paused → Completed → Cancelled → Failed`).
- **Memory Runtime:** Working / Long Term / Conversation / Organization Memory — todo separado.
- **Safety Engine:** validación → políticas → permisos → PII → compliance → riesgo.
- **Evaluation Engine:** toda respuesta importante se evalúa (grounding, consistencia, hallucination, costo, tiempo, score).

## Ejecución

- **AI Sessions:** `session, organization, actor, goal, context, memory, model, cost, duration`.
- **AI Jobs:** tareas largas se convierten en Jobs (analizar 20.000 documentos → Job → notificación → resultado).
- **Streaming:** todo modelo soporta streaming, cancelación, reanudación.
- **Semantic Cache:** si dos respuestas son iguales, no ejecutar de nuevo.
- **Multi Agent:** coordina Architect → Security → Finance → Developer → Reviewer → Architect.
- **AI Pods:** viven aquí (no en Architect ni Builder). AI Runtime administra recursos, estado, comunicación, escalado.

## API / Eventos

```
POST /runtime/chat · /agent · /job · /evaluate · /tool     GET /runtime/models · /costs
```

`ModelSelected · ToolExecuted · PromptExecuted · AgentStarted · AgentCompleted · EvaluationFinished · BudgetExceeded · FallbackActivated`

## Stack / Performance

NestJS · LangGraph (orquestación) · LiteLLM o router propio · Redis · PostgreSQL · OpenTelemetry · Qdrant.
Persistencia: PostgreSQL (metadata) · Redis (cache) · Qdrant (embeddings) · Object Storage (artifacts).
**Objetivo:** Model Selection `<10ms`, Context Build `<50ms`, Tool Routing `<20ms`.
**Repository:** `services/ai-runtime/`

## Definition of Done

Model Router · Agent Runtime · Tool Runtime · Prompt Runtime · Context Builder · Cost Optimizer · Safety Engine · Evaluation Engine · API · SDK · Observabilidad · Tests.

---

## 🚨 ADR-AR026 — Ningún servicio invoca directamente un modelo

Toda interacción pasa por AI Runtime. Siempre.

## 🚨 ADR-AR027 — Los modelos son reemplazables

La inteligencia de Inteliar reside en el contexto, las herramientas, el Digital Twin, el Knowledge Engine y la orquestación. Nunca en un proveedor específico.

## ⭐ ADR-AR028 — Cognitive Resource Management

AI Runtime no administra únicamente modelos, sino **recursos cognitivos**: modelos, herramientas, memorias, prompts, agentes, conocimiento, simulaciones, evaluaciones y un **presupuesto cognitivo**. Cada tarea consume presupuesto no solo de dinero, sino de contexto, tiempo, atención, memoria y capacidad de razonamiento. El Runtime optimiza qué modelo usar, cuántos agentes lanzar, cuánto contexto enviar, cuándo consultar el Knowledge Engine y cuándo pedir ayuda a un humano. La inteligencia deja de depender del modelo: depende de **cómo se administra el razonamiento**.

---

*AR-011 — AI Runtime*
