# PROPOSED ARCHITECTURE
## Fase 3 — Mi versión, comparada con la original

**Principio de esta propuesta:** no cambio la tesis (business-first, reutilización, event-driven eventualmente). Cambio el *orden*, el *número de conceptos*, y el *momento* en que cada pieza se gana el derecho a existir. Todo lo que elimino de "ahora" vuelve más adelante, cuando haya evidencia — no lo estoy descartando para siempre.

---

## 1. Un solo modelo, no tres

### Original
Digital Twin (AR-005) + BOM (Foundation) + Organization Memory (AR-012) compiten por ser "el modelo del negocio."

### Propuesta
**Un solo artefacto: el BOM.** Es el YAML versionado en Git del cliente (`/.inteliar/bom.yaml`), tal como lo define `FOUNDATION-BOM-Specification.md`. Todo lo demás es una *vista* o una *función* de ese artefacto, no una entidad separada:

- **"Digital Twin"** deja de ser un servicio con Neo4j propio y pasa a ser **la proyección en grafo del BOM** — una vista de solo lectura, generada bajo demanda, no una fuente de verdad paralela. Si mañana no se necesita graph traversal, no existe ni ese costo operativo.
- **"Organization Memory"** deja de ser un concepto propio y pasa a ser **el historial de versiones del BOM + un log de eventos** (`bom.history/`, ya definido en el propio `ADR-R02`). No hace falta un servicio de Memory separado para esto en el año 1.
- Lo único que sí sigue siendo distinto: memoria de **conversación** (efímera, por sesión) — eso no es memoria de negocio y no debería competir por el mismo nombre.

**Justificación del cambio:** hoy nadie puede responder "¿dónde vive el proceso de reparación de un cliente?" en menos de tres lecturas cruzadas. Con un solo artefacto, la respuesta siempre es la misma: en el BOM.

---

## 2. Nueve conceptos → tres

### Original
Capability, Stack, BOM, BOML, Pod, Agent, Workflow, Knowledge Pack, Industry Pack.

### Propuesta

```
BOM          → qué es y qué quiere una empresa (el modelo)
Capability   → un bloque de funcionalidad reutilizable (la implementación)
Stack        → una combinación de Capabilities distribuible (el producto)
```

Todo lo demás se reabsorbe:

- **AI Pods / Agents** → ya están definidos dentro de la capa `ai/` de cada Capability en el propio AR-013. No necesitan ser un cuarto concepto de primer nivel; son una propiedad de la Capability, no un par de ella.
- **Workflow** → se mantiene, pero como una propiedad de la Capability o del Stack (`workflows/` ya existe dentro de AR-013), no como categoría independiente en el catálogo de nivel superior.
- **Knowledge Pack / Industry Pack** → se convierten en **variantes de Stack** (`fixly-stack.yaml` con un flag `industry: workshop` que trae conocimiento embebido), no en un cuarto tipo de activo del Marketplace.
- **BOML (el lenguaje)** → se congela como *formato de serialización* del BOM (YAML con schema), no como una aspiración de estándar abierto tipo HTML. Esa ambición puede resucitar en el año 3, con datos reales de adopción, no antes.

**Justificación:** un ingeniero nuevo — humano o IA — debe poder escribir su primera Capability después de aprender 3 palabras, no 9.

---

## 3. Infraestructura: empezar con lo que ya funciona, no con lo que "eventualmente hará falta"

### Original
Stack común declarado para cada servicio: NestJS + PostgreSQL + Redis + NATS/Kafka + Neo4j + Qdrant + Temporal + OpenTelemetry + Kubernetes.

### Propuesta

**Fase 0-1 (meses 1-6):** Postgres + un edge function runtime (Cloudflare Workers o Supabase Edge Functions) + una cola simple (Postgres LISTEN/NOTIFY o una tabla de outbox). Sin Kubernetes. Sin Neo4j. Sin Kafka. Sin Temporal.

Esto no es una concesión — es alinear la arquitectura con lo que **ya demostró funcionar** en los 5 productos reales de la organización, todos corriendo sobre Supabase + Cloudflare con clientes pagando.

**Cuándo se justifica cada pieza "grande":**

| Componente | Se agrega cuando... |
|---|---|
| Neo4j (graph) | Alguien pide una consulta de grafo real que Postgres con CTEs recursivas ya no resuelve bien (miles de relaciones cruzadas, no cientos). |
| Kafka/NATS (event bus dedicado) | El volumen de eventos supera lo que un outbox pattern sobre Postgres puede sostener con latencia aceptable — no antes. |
| Temporal (orquestación de workflows de larga duración) | Existan procesos que realmente crucen días/semanas con estado — no para un "repair flow" de 3 días que un cron + tabla de estado resuelve. |
| Qdrant (vectores dedicados) | pgvector sobre Postgres deje de alcanzar en volumen o latencia — Postgres con pgvector cubre la inmensa mayoría de casos de RAG hasta cientos de miles de documentos. |
| Kubernetes | Exista más de un servicio que necesite escalar independientemente con carga real — no antes. |

**Justificación:** cada pieza de la lista "común" es una decisión operativa cara (on-call, backup, versión, seguridad) que hoy no tiene tráfico que la justifique. Se paga cuando se necesita, no antes.

---

## 4. AI: un cliente simple, no un Runtime de seis capas

### Original
AI Runtime obligatorio con Model Router, Cost Optimizer, Safety Engine, Evaluation Engine, y Cognitive Resource Management, para *todo* servicio.

### Propuesta

**Fase 0-1:** un único paquete, `@inteliar/llm-client` (que ya existe como prototipo en `real-estate-copilot-latam`, según la auditoría real): multi-proveedor, server-side siempre, con fallback determinístico si el LLM falla o alucina. Nada de contexto/tiempo/atención como "recursos cognitivos gestionados" todavía — eso se diseña *mirando* 3+ AI Pods reales en producción, no antes.

**Se mantiene el principio, no la implementación:** "ningún servicio pega una API key en el cliente" (esto ya es una regla ganada por dolor real — está en la auditoría, `RIWEB.APP` lo hizo mal). Eso sí se adopta desde el día 1, porque ya cobró una víctima real.

**Justificación:** el mejor código de IA que existe hoy en toda la organización es el más simple de los cinco (`llm_client.py`), precisamente porque resuelve un problema concreto sin capas especulativas. Construimos sobre lo que ya funcionó, no sobre lo que todavía es una idea de PowerPoint.

---

## 5. Gobernanza: ADR para decisiones irreversibles, no para todo

### Original
"Toda decisión importante → nueva ADR" (EH-001, ADR-EH002) sin distinción de tamaño ni reversibilidad. Architecture Review Board para aprobar Capabilities de un catálogo que hoy tiene cero.

### Propuesta

ADR obligatoria solo para decisiones **caras de revertir**: elegir un datastore nuevo, cambiar el formato del BOM, romper compatibilidad de una API pública, adoptar/eliminar un proveedor de IA. Decisiones reversibles (agregar un campo, ajustar una regla de negocio, cambiar una copy) no necesitan ADR — necesitan un buen commit message.

Architecture Review Board: se pospone hasta que haya **al menos 3 partners externos** proponiendo Capabilities. Antes de eso, sos vos y un agente revisando — no hace falta un comité para aprobarte a vos mismo.

**Justificación:** proceso pesado antes de que haya volumen que lo justifique frena la velocidad exactamente en el momento (pre-PMF) en que la velocidad es el recurso más escaso.

---

## 6. Extraer, no diseñar en el vacío

### Original
Las Capabilities (Customer Management, Repair Management, Label Management...) se diseñan desde cero, con AR-013 como blueprint teórico.

### Propuesta

La propia auditoría de los 17 repos ya identificó qué extraer y de dónde, con nombres concretos:

| Capability propuesta | Se extrae de (código real, ya en producción) |
|---|---|
| `customer-management` | Esquema de clientes de Fixly + VendexChat (unificar) |
| `billing` | Sistema de licencias/webhooks HMAC de **Inteliar Labels** (la pieza más madura del portafolio, según la auditoría) |
| `messaging` | Adaptador de proveedores de `whatsapp-agente` (`agent/providers/base.py`) |
| `ai-client` | `real-estate-copilot-latam/llm_client.py`, completando el proveedor Anthropic |
| `ui-kit` | Fusión de los kits Radix/shadcn de `vendexchat-front` + `Inteliar-Labels` |
| `auth-tenancy` | Middleware de Fixly, corregido (hoy no verifica firma JWT) + modelo RLS de VendexChat |

**Ninguna Capability nueva se diseña en una pizarra hasta agotar esta lista.** Esto no es una preferencia estética — es la recomendación explícita de la propia auditoría real (§7): *"el Core debería nacer extrayendo, no diseñando en el vacío"*, con `zeus-core` como evidencia viva de qué pasa cuando se hace al revés (un repo que se llamaba literalmente "core" y terminó siendo transcripciones de chat abandonadas).

---

## 7. Comparación resumen

| Dimensión | Original | Propuesta |
|---|---|---|
| Modelo del negocio | 3 conceptos (Twin, BOM, Memory) sin reconciliar | 1 concepto (BOM); Twin y Memory son vistas/derivados |
| Unidades de composición | 9 | 3 (BOM, Capability, Stack) |
| Infraestructura día 1 | 6+ datastores especializados por servicio | Postgres + edge functions + outbox |
| Capa de IA | Runtime de 6 subsistemas obligatorio | Un cliente multi-proveedor simple, server-side |
| Gobernanza | ADR para toda decisión + ARB desde el día 1 | ADR solo para lo irreversible; ARB cuando haya 3+ partners |
| Origen de las primeras Capabilities | Diseñadas desde cero contra un blueprint teórico | Extraídas de código real ya en producción (auditoría §6-8) |
| Seguridad | No mencionada frente a los hallazgos reales | Sprint -1: cerrar las 6 vulnerabilidades activas antes de cualquier feature nueva |
| Ambición de estándar abierto (BOML/OBMI) | Presente desde el documento 1 | Congelada como idea; se revisita en año 3 con datos de adopción reales |

---

## 8. Lo que NO cambio

- La tesis business-first / BOM como artefacto central: correcta, se mantiene.
- Capability como unidad de reutilización: correcta, se mantiene, solo se simplifica cuándo y cómo se cataloga.
- Event-driven entre servicios: correcto como principio de largo plazo — se difiere la *implementación* (Kafka/NATS) hasta que el volumen lo pida, no se descarta el principio.
- El MVP definido en el cierre de la conversación (Architect conversation → BOM → PDF → validación con 20 empresas reales): esto ya estaba bien pensado y se adopta sin cambios, con una métrica de éxito explícita agregada en el roadmap.

---

*Continúa en `02-ROADMAP_24_MONTHS.md`.*
