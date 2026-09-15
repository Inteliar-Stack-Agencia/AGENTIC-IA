# ARCHITECTURE REVIEW
## Fase 1 (Auditoría) + Fase 2 (Challenge) + Ejercicio Blank Slate

**Autor:** Chief Software Engineer (rol asignado)
**Fecha:** 2026-07-13
**Método:** Lectura completa de los 65+ documentos en `inteliar-spec/` (Constitución, Architecture Reference AR-001→AR-016, Engineering Standards/Handbook, ADR Ledger, Strategy, Manifesto, Roadmap) cruzada con la auditoría técnica real de los 17 repositorios de la organización (`/tmp/.../inteliar-audit.html`, 2026-07-11).
**Regla seguida:** no intenté demostrar que la arquitectura es buena. Intenté romperla.

---

## 0. El hallazgo que condiciona todo lo demás

Antes de entrar en fortalezas y debilidades, hay un hecho que tiene que decirse primero porque cambia cómo hay que leer el resto de este documento:

**Los 65 documentos de visión y la auditoría de los 17 repos reales fueron producidos en la misma organización, casi en la misma semana, y nunca se cruzaron entre sí.**

La auditoría real dice, literalmente: *"cinco productos reales, cero plataforma compartida"*, *"zeus-core no contiene código funcional"*, *"cero tests automatizados en los cinco productos activos"*, *"credenciales productivas de Supabase commiteadas"*, *"ruta /admin sin autenticación"*, *"API key de Anthropic manejada en el navegador"*.

La Constitución, escrita en paralelo, diseña 16 microservicios (Neo4j, NATS/Kafka, Temporal, Qdrant), un lenguaje de modelado propio (BOML), una fundación de estándar abierto (OBMI), un Marketplace con 5 tipos de activos, niveles de certificación de partners, y un roadmap a 2035 — sin mencionar en ningún lugar que existen Fixly, VendexChat, Inteliar Labels y AgentKit con clientes pagando **hoy**, ni que uno de esos repos tiene una credencial de producción expuesta en Git **hoy mismo**.

Esto no es un detalle. Es el síntoma más grave de todo el proyecto: **se diseñó una plataforma para 2035 sin abrir la carpeta que contiene el negocio de 2026.** Todo lo que sigue hay que leerlo con ese contexto: la arquitectura puede ser conceptualmente sólida y aun así estar resolviendo el problema equivocado en el orden equivocado.

---

## 1. Fortalezas reales (no cortesía)

Hay que decir esto también, porque descartar todo sería tan deshonesto como aprobar todo.

1. **El giro "Business-first, no Software-first" es genuinamente diferenciador.** La mayoría de los pitches de "SaaS con IA" son wrappers de un CRUD con un chat pegado. La tesis de que el software debe nacer de un modelo del negocio, no al revés, es correcta y es más difícil de replicar que una feature.

2. **Capability como unidad de reutilización (AR-009, AR-013) es una idea probada**, no inventada. Es, en esencia, lo mismo a lo que llegaron Salesforce (objects + automation), Shopify (Admin API resources) y SAP (BAPIs) después de años de dolor. Empezar por ahí en vez de llegar ahí en el año 8 es una ventaja real.
3. **Event-driven entre servicios (AR-004, ADR-AR005/006) es la decisión aburrida y correcta.** No hay nada que objetar ahí en principio.
4. **El giro final de la conversación (el mensaje que dice "Etapa 2 — Validación") es, para mí, la mejor decisión de todo el documento.** Reconocer que el MVP es *la conversación de Architect*, no Builder, no Identity, no Marketplace — y que Fixly/Labels/Morfi son *datos de entrenamiento*, no productos a vender — es exactamente el instinto correcto. El problema es que llegó en el documento 65, no en el documento 1.
5. **La disciplina de gobernanza (ADR con 3 namespaces, ledger único) es inusual para un proyecto sin una sola línea de producto.** Eso vale algo, aunque más adelante voy a argumentar que hoy sobra.

---

## 2. Debilidades — de mayor a menor severidad

### 2.1 Tres especificaciones distintas compiten por ser "el modelo central del negocio"

- **Digital Twin (AR-005):** "el Twin es la fuente de verdad del negocio" (ADR-R01, ADR-AR008-010).
- **BOM (FOUNDATION-BOM-Specification):** "el BOM es el artefacto principal... más importante que el código, el Stack o la Capability."
- **Organization Memory (AR-012):** "decisiones, procesos, objetivos, restricciones, historia... la memoria más importante."

Estas tres cosas describen, en distintas palabras, *lo mismo*: el estado modelado de una organización. Nunca se declaró cuál subsume a cuál. `ADR-R01` sigue vigente y sin enmendar mientras el Manifiesto BOM afirma una jerarquía distinta sin tocarlo. Si le doy este set de documentos a un ingeniero nuevo hoy, no puede responder "¿dónde vive el proceso de reparación de un cliente?" sin adivinar.

**Esto no es un matiz. Es la pregunta arquitectónica más importante sin responder de todo el proyecto**, porque justamente el BOM/Twin es lo que el propio proyecto declaró como el activo más valioso.

### 2.2 Inflación de superlativos — "esta es la decisión más importante" aparece 6+ veces

ADR-AR042, ADR-EH003, el Manifiesto BOM, el Ecosystem Manifesto, y The Flywheel *cada uno* se autodeclara como "la decisión más importante de todo el proyecto" o "el descubrimiento que cambia todo". Cuando todo es lo más importante, no hay señal de prioridad para quien tiene que decidir qué construir el lunes. Esto es consistente con un patrón real: cada documento se escribió en el entusiasmo del momento sin volver a leer — ni reconciliar — el anterior.

### 2.3 Se diseñó para 10.000 Capabilities antes de tener una

El Principio 15 (EH-001) dice explícitamente: *"¿Esto seguirá funcionando cuando existan 10.000 Capabilities?"* como pregunta obligatoria antes de cualquier decisión. ES-001 define 16 carpetas de primer nivel en el monorepo. AR-014 define Health Score, Lifecycle de 8 estados, Capability Matrix, y un Architecture Review Board — para un catálogo que hoy tiene **cero** Capabilities implementadas.

Esto es sobre-ingeniería de manual: diseñar la gobernanza de escala antes de validar que el problema que se va a escalar existe. Ninguna de las empresas que se citan como referencia (Stripe, Linear, Vercel, Shopify) publicó su Architecture Review Board antes de su primer cliente.

### 2.4 El stack de infraestructura "común" es una fantasía de 2030 aplicada a un producto de 2026

AR común declara: NestJS · PostgreSQL · Redis · NATS JetStream/Kafka · Neo4j · Qdrant · Temporal · OpenTelemetry · Kubernetes-ready — para **cada uno** de los 12+ servicios.

La auditoría real dice que los 5 productos con clientes pagando corren sobre Supabase + Cloudflare Functions, sin Kubernetes, sin Kafka, sin Neo4j, y **así y todo generan ingresos**. Proponer 6 datastores especializados por servicio antes del primer usuario de pago de Inteliar no es "construir para el futuro" — es deuda operativa contraída antes de tener ingresos para pagarla, y contradice directamente el principio 15 aplicado con criterio (evolución sí, pero *después* de validar, no antes).

### 2.5 El "AI Runtime obligatorio para todo" es una abstracción prematura sobre una primitiva que todavía cambia cada 3 meses

AR-011 exige que ningún servicio llame a un LLM directamente — todo pasa por Model Router, Cost Optimizer, Safety Engine, Evaluation Engine, y "Cognitive Resource Management" (contexto, tiempo, atención, memoria, razonamiento como recursos gestionados). Es una idea elegante. También es exactamente el tipo de abstracción que OpenAI, Anthropic y Google todavía no han estabilizado en sus propias APIs (la Responses API de OpenAI es de 2025; Anthropic sigue iterando tool_use casi cada release). Construir una capa de gestión "cognitiva" universal antes de tener 3 casos de uso reales en producción es Second System Syndrome de manual.

Dato que lo confirma: el mejor patrón de IA de *todo* el portafolio real (`real-estate-copilot-latam/llm_client.py`) es bueno precisamente porque es simple — un cliente multi-proveedor con fallback determinístico, sin ninguna de las seis capas de AR-011.

### 2.6 Contradicción explícita sin resolver: ¿qué vendemos?

- ADR-AR037 (AR-015, mismo día): *"El Stack es la unidad oficial de distribución de Inteliar."*
- MANIFESTO-BOM (documento posterior): *"No deberíamos vender Stacks. Deberíamos vender la creación del BOM."*

Ninguno de los dos ADRs fue enmendado ni deprecado. Ambos están "Accepted" en el ledger. Un ingeniero que abra el ADR Ledger hoy encuentra dos respuestas incompatibles a "¿qué es la unidad que facturamos?"

### 2.7 "Módulo" vs "Capability" — la deuda de coherencia que el propio proyecto se prometió pagar y nunca pagó

`capitulos/README.md` lo dice con todas las letras en la sección "Pendientes": *coherencia sobre 1-13, pendiente*. `AR-009` propone reemplazar "Module" por "Capability". Cap 16 sigue usando "módulos" como unidad de carpeta. Nadie volvió a cerrarlo. Es un ejemplo pequeño pero es evidencia de un patrón: el proyecto genera "pendientes de coherencia" en cada capítulo y ninguno se cierra, porque siempre aparece un documento nuevo más entusiasmante que hacer antes.

### 2.8 Vulnerabilidades reales, en producción, hoy — mientras se escribían 65 documentos sobre 2035

Esto no es una crítica de arquitectura. Es una crítica de secuenciación y de qué se considera "urgente":

- Credencial de Supabase de producción commiteada en Git (`LEGAL-TEMPLATES`), expuesta ahora mismo.
- Ruta `/admin` sin autenticación en `RIWEB.APP`, con RLS que da CRUD completo a cualquier usuario autenticado.
- API key de Anthropic manejada en el navegador (`RIWEB.APP`), visible en devtools.
- Contraseña admin por defecto (`admin123`) y sesión en texto plano en `whatsapp-agente`.
- JWT sin verificación de firma en `Fixly`.
- Escalada de privilegios documentada y sin resolver en `VendexChat-admin`.

Estas seis cosas afectan a clientes reales pagando **hoy**. Ninguna requiere una decisión de arquitectura de Inteliar para resolverse — requieren una tarde de trabajo cada una. El hecho de que el proyecto haya producido 65 documentos sobre BOML y Business Evolution Index antes de que alguien escribiera "rotar esta credencial" es la señal más clara de que la energía de diseño se dirigió al lugar equivocado.

### 2.9 Falta el capítulo de números

`Cap 35 — Pricing` figura como "pendiente" en el ledger desde el principio. Sin embargo, STRATEGY.md, MANIFESTO-BOM, y Ecosystem Manifesto hacen afirmaciones de modelo de negocio (revenue share del 30%, tiers "Evolution/Growth/Scale/Autonomous", 8 fuentes de ingreso) sin un solo número validado con un cliente real. Todo el edificio de negocio está en prosa, no en un modelo.

### 2.10 Vocabulario: 9 unidades de composición antes del primer commit

Capability, Stack, BOM, BOML, Pod, Agent, Workflow, Knowledge Pack, Industry Pack. Un desarrollador nuevo — humano o IA — tiene que internalizar 9 conceptos y sus relaciones antes de poder escribir la primera Capability. Ninguna plataforma citada como referencia (Stripe, Linear, Vercel, Shopify) exige más de 2-3 conceptos para el primer "hola mundo".

---

## 3. Riesgos

**Técnicos:**
- 6 datastores especializados por servicio, sin tráfico, sin equipo de ops, es una superficie de fallo y costo que no se puede justificar antes de ingresos.
- Foundation layer "solo eventos, nunca llamadas directas" aplicado literalmente a Identity/Organization/Permission genera un problema real: una verificación de permiso ("¿puede este usuario ver este registro?") es intrínsecamente una lectura síncrona. Ningún documento explica cómo se garantiza *read-your-own-writes* entre 3 servicios desacoplados por eventos para el caso más básico de todos: un chequeo de autorización.
- Cero tests en los 5 productos reales + "Tests are Product" como Principio 10 — la brecha entre principio y práctica no tiene plan de cierre.

**De negocio:**
- Documentation-driven development: 65 documentos y cero conversaciones con clientes reales documentadas en el mismo repositorio.
- El propietario del taller/restaurante real está pagando hoy con productos que tienen huecos de seguridad activos — ese riesgo reputacional/legal es más urgente que cualquier decisión sobre BOML.

**De producto:**
- Tres candidatos a "el modelo central" (BOM/Twin/Memory) sin resolver puede confundir a quien implemente incluso el MVP más simple (¿el BOM Generator del Sprint 2 escribe en el Twin, en Memory, o en un BOM nuevo?).

**De adopción:**
- La hipótesis central no validada: que una conversación libre con "Architect" es menos fricción que un wizard estructurado para un dueño de PyME no técnico. Es plausible, pero hoy es una hipótesis, no un hecho — y el propio cierre de la conversación (Etapa 2) lo reconoce correctamente.

---

## 4. Fase 2 — Challenge: ¿qué NO harían Stripe, Linear, Vercel, Shopify, Cursor, OpenAI, Cloudflare?

| Empresa | Lo que nunca haría Inteliar-como-está-documentado |
|---|---|
| **Stripe** | Nunca habría diseñado Identity + Organization + Permission + Event Bus + Twin + Memory + Knowledge + Workflow + Builder + Marketplace *antes* de un primer endpoint que un desarrollador externo pudiera integrar en 10 minutos. Stripe ganó con 7 líneas de integración, no con una plataforma completa. |
| **Linear** | Nunca aceptaría 9 unidades de composición ni "Policies/Rules" configurables por default — Linear gana por opiniones fuertes y cero configuración. El "core loop" (crear issue → triage → resolver) se pulió durante meses antes de agregar una sola feature adyacente. Inteliar todavía no tiene un core loop pulido y ya tiene Marketplace, Certificación y Stack Studio "Modo Business/Studio". |
| **Vercel** | El monorepo de 16 carpetas + ADR obligatoria por cambio + AI Runtime de 6 capas es lo opuesto de "deploy en un comando". Vercel obsesiona con reducir configuración, no con institucionalizarla. |
| **Shopify** | Construyó su ecosistema de afuera hacia adentro: primero comerciantes reales, después temas, después apps, después Shopify Plus (enterprise), años después. Nunca publicó un "Ecosystem Manifesto" con 5 niveles de partner antes del primer comerciante. El orden importa: se gana el ecosistema, no se decreta. |
| **Cursor** | Ganó por *insertarse* en el flujo de trabajo existente (fork de VS Code) en vez de inventar un paradigma nuevo. El análogo correcto para Inteliar sería insertarse donde el negocio ya vive (WhatsApp, Excel, el ERP que ya usan) en vez de pedirle al dueño de un taller que adopte un concepto nuevo ("tu BOM") el día 1. |
| **OpenAI** | Ship un número muy chico de primitivas (Chat Completions, ahora Responses API) e itera en público. Sería el primero en objetar que "Cognitive Resource Management" es una abstracción sobre primitivas de IA que la propia industria todavía no estabilizó. |
| **Cloudflare** | Vive obsesionado con simplicidad y "consumo, no infraestructura" (Workers, KV, D1). Preguntaría: "¿esto puede correr con 2 primitivas en vez de 6?" frente a Postgres+Neo4j+Redis+Qdrant+NATS+Temporal declarados como stack común de cada servicio.

**El hilo común de las siete:** ninguna publicó una constitución de 10 años ni una arquitectura completa antes de un v1 feo, angosto, que no escalaba, y que el uso real les enseñó a generalizar. Inteliar hizo exactamente lo opuesto: generalizó antes de tener un v1.

---

## 5. Ejercicio Blank Slate — 2026, sin conocer Inteliar

Si tuviera que fundar hoy una empresa que cambie el software empresarial usando IA, sin ninguna restricción ni conocimiento previo de este documento:

**Lo que construiría:** un producto angosto tipo "analista de negocio con IA" — más cerca de "Notion AI para PyMEs" o "un contador senior en 20 minutos" que de una plataforma. Una sola conversación, un solo output (un diagnóstico + 3 recomendaciones concretas), un precio bajo y recurrente ($30-50/mes), validable en semanas.

**Lo que NO haría:** microservicios, event bus, múltiples datastores. Empezaría con Postgres + una función edge + una llamada a un LLM — exactamente lo que ya hacen Fixly, Labels y VendexChat en la vida real, y que ya genera ingresos. Es una señal fuerte: el instinto de los equipos reales, sin la presión de "diseñar una plataforma", ya es pragmático y correcto.

**Comparación con Inteliar:**

- **Coinciden:** el enfoque business-first, la idea de reutilización antes de crear, el que los eventos son la forma correcta de desacoplar servicios *cuando existan varios servicios*, y que "Capability" es una buena unidad de empaquetado *una vez que existan 5+ dominios reales que generalizar*.
- **Falta:** conceptualmente, nada — la visión es más completa que la de la mayoría de startups con financiamiento. El problema nunca fue de imaginación.
- **Sobra (ahora, no para siempre):** BOML como estándar abierto, OBMI, Stack Studio "Modo Studio" completo, niveles de certificación, Neo4j/Kafka/Temporal, Marketplace con 5 tipos de activo. Todo esto es real para 2028-2030, no para Sprint 0-6.
- **Cambiaría ya:** fusionar BOM/Twin/Memory en un solo concepto con un solo dueño; borrar "Cognitive Resource Management" hasta tener 3 AI Pods reales corriendo; reemplazar el monorepo de 16 carpetas por 3 (`app/`, `lib/`, `docs/`) hasta que exista un segundo servicio real que justifique más; y — esto es lo más importante — abrir la carpeta `/workspace` con los 17 repos reales *antes* de escribir el próximo documento de visión.

---

*Fin de Fase 1 + Fase 2. Continúa en `01-PROPOSED_ARCHITECTURE.md`.*
