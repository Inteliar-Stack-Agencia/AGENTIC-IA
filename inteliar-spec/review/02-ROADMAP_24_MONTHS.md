# ROADMAP TÉCNICO — 24 MESES
## Fase 4

**Nota de alcance:** 24 meses ÷ 2 semanas = ~52 sprints. Detallar los 52 uno por uno sería ruido, no señal — nadie plane[a] con esa precisión a 24 meses y quien lo hace termina reescribiendo el roadmap en el mes 3 igual. Detallo con precisión de sprint los primeros 6 meses (Sprint -1 a Sprint 12, donde vivimos hoy y donde cada decisión es cara de revertir), y agrupo los meses 7-24 en objetivos trimestrales con Definition of Done por trimestre. Cuando lleguemos ahí, se desagrega el trimestre siguiente con el mismo nivel de detalle que aquí — no antes, porque para entonces vamos a saber más de lo que sabemos hoy.

---

## Sprint -1 (esta semana, no dos semanas) — Contención

**Esto no es parte del roadmap de Inteliar. Es una interrupción obligatoria antes de empezar cualquier otra cosa.**

- **Objetivo:** cerrar las 6 vulnerabilidades activas en producción identificadas en la auditoría real.
- **Riesgo si no se hace:** exposición de datos de clientes reales pagando, hoy.
- **Dependencias:** ninguna. No requiere ninguna decisión de arquitectura de Inteliar.
- **Resultado esperado:**
  1. Credencial de Supabase rotada y `LEGAL-TEMPLATES` saneado (historial limpio o repo recreado).
  2. Ruta `/admin` de `RIWEB.APP` protegida por sesión real.
  3. API key de Anthropic removida del cliente en `RIWEB.APP`, movida a server-side.
  4. Contraseña admin por defecto eliminada en `whatsapp-agente`; sesión con HttpOnly/Secure/SameSite.
  5. Token de webhook hardcodeado resuelto o decisión explícita de retirar `whatsapp-business-api`.
  6. Escalada de privilegios en `VendexChat-admin` (CR-03) cerrada.
- **Definition of Done:** las 6 issues cerradas con commit propio, sin excepción.

---

## Sprint 0 (semanas 1-2) — Fundación mínima

- **Objetivo:** inicializar `inteliar-stack` con la estructura mínima que la Fase 1 realmente necesita, no la de ES-001 completa.
- **Riesgo:** sobre-diseñar la estructura antes de tener código que la llene (el mismo error de `zeus-core`).
- **Dependencias:** Sprint -1 cerrado.
- **Resultado esperado:**
  - Monorepo con 3 carpetas de primer nivel: `app/` (Architect, Next.js), `lib/` (paquetes compartidos, empezando por `@inteliar/llm-client` extraído de `real-estate-copilot-latam`), `docs/` (esta documentación de visión, congelada).
  - `CLAUDE.md` con la Constitución resumida (referencia a `inteliar-spec/`, no copiada).
  - CI mínimo: lint + build. Sin tests todavía porque no hay lógica que testear.
- **Definition of Done:** `pnpm install && pnpm build` funciona en limpio. Nada más.

---

## Sprint 1 (semanas 3-4) — Architect: la conversación, y nada más

- **Objetivo:** una sola pantalla. "Hola, soy Architect. Contame sobre tu empresa." Sin dashboard, sin login todavía (usar un magic link simple si hace falta persistencia).
- **Riesgo:** la tentación de agregar Builder, Capabilities o Marketplace "ya que estamos". Resistir activamente.
- **Dependencias:** Sprint 0, `@inteliar/llm-client`.
- **Resultado esperado:** conversación funcional de 15-20 minutos que hace las 8 preguntas de Discover (ya definidas en `capitulos/18-Discover-Engine.md`) y termina en un resumen en texto plano.
- **Definition of Done:** 3 conversaciones internas de prueba completas de punta a punta.

---

## Sprint 2 (semanas 5-6) — BOM Generator v0

- **Objetivo:** la conversación produce un archivo BOM real, siguiendo `FOUNDATION-BOM-Specification.md`, simplificado a las secciones que ya importan hoy: Identity, Objectives, Capabilities (detectadas), Processes, Metrics.
- **Riesgo:** intentar implementar las 14 secciones del BOM completo de una vez. No — solo 5.
- **Dependencias:** Sprint 1.
- **Resultado esperado:** el output de la conversación se persiste como YAML versionado (Postgres, no Git todavía — Git-native es una decisión de Fase 2, no de v0).
- **Definition of Done:** poder reabrir un BOM generado y ver el mismo contenido.

---

## Sprint 3 (semanas 7-8) — Reporte profesional

- **Objetivo:** generar un PDF/reporte a partir del BOM: diagnóstico + problemas detectados + 3 recomendaciones concretas.
- **Riesgo:** que el reporte se sienta genérico. Mitigación: usar los procesos reales de Fixly/reparaciones como plantilla de referencia para el primer vertical (Workshop), no un vertical abstracto.
- **Dependencias:** Sprint 2.
- **Resultado esperado:** un PDF descargable, presentable a un dueño de negocio real sin vergüenza.
- **Definition of Done:** al menos 1 miembro del equipo diría "yo pagaría por esto" mirándolo con ojos de cliente.

---

## Sprint 4-5 (semanas 9-12) — Validación con empresas reales

- **Objetivo:** correr la conversación con 20 empresas reales (no internas). Mezcla sugerida: talleres, restaurantes, distribuidoras — dominios donde ya hay conocimiento de dominio real (Fixly, VendexChat).
- **Riesgo:** que el "20 minutos de conversación" resulte ser más fricción que valor para un dueño de PyME no técnico — esta es la hipótesis central sin validar identificada en la revisión.
- **Dependencias:** Sprint 3.
- **Resultado esperado:** 20 conversaciones completas + reporte de cada una.
- **Métrica de éxito explícita (agregada porque el documento original no la tenía):** en al menos 15 de 20 entrevistas, el dueño del negocio dice espontáneamente algo equivalente a *"esto entendió mi negocio mejor que mi contador/consultor"*. Si el número real es menor a 10/20, no se avanza a Sprint 6 — se vuelve a Sprint 1 a rediseñar la conversación.
- **Definition of Done:** el número anterior, medido y documentado, sin maquillar.

---

## Sprint 6-7 (semanas 13-16) — Primera Capability real (extraída, no diseñada)

- **Objetivo:** extraer `customer-management` como la primera Capability siguiendo AR-013 simplificado, a partir del esquema real de Fixly + VendexChat (no diseñada en el vacío — ver `01-PROPOSED_ARCHITECTURE.md §6`).
- **Riesgo:** el mismo de siempre — diseñar de más antes de tener un segundo consumidor real.
- **Dependencias:** validación de Sprint 4-5 aprobada.
- **Resultado esperado:** una Capability instalable, con su propio `domain/`, `api/`, `events/`, sin las 11 capas completas de AR-013 todavía (solo las que el primer caso de uso necesita).
- **Definition of Done:** Fixly (o un clon de prueba) puede usar la Capability extraída en vez de su código original, sin pérdida de funcionalidad.

---

## Sprint 8-9 (semanas 17-20) — Segunda y tercera Capability

- **Objetivo:** `billing` (extraída de Inteliar Labels, la pieza más madura del portafolio) y `repair-management` (extraída de Fixly).
- **Riesgo:** ninguno nuevo — mismo patrón que Sprint 6-7.
- **Dependencias:** Sprint 6-7.
- **Resultado esperado:** con 3 Capabilities reales, recién ahí se revisa si el Capability Blueprint (AR-013) necesita ajustes — se diseña la generalización *mirando* 3 casos reales, no antes.
- **Definition of Done:** un patrón de Capability confirmado por triangulación de 3 ejemplos reales, no por teoría.

---

## Sprint 10-12 (semanas 21-24) — Stack mínimo: Workshop Stack v0

- **Objetivo:** componer las 3 Capabilities en un Stack instalable real (`Workshop Stack`), reemplazando gradualmente al Fixly actual.
- **Riesgo:** intentar migrar todos los clientes de Fixly de golpe. No — un cliente piloto primero.
- **Dependencias:** Sprint 8-9.
- **Resultado esperado:** 1 cliente real de Fixly migrado al nuevo Stack, en paralelo al sistema viejo (sin apagar el viejo todavía).
- **Definition of Done:** el cliente piloto no nota degradación de servicio.

---

## Mes 7-9 (Q3) — Consolidar, no expandir

**Objetivo del trimestre:** con 3 Capabilities + 1 Stack validados, resolver la deuda de coherencia que quedó pendiente desde la Fase de visión — específicamente, cerrar la pregunta BOM/Twin/Memory con código real, no con más prosa.

- Migrar 3-5 clientes reales de Fixly al Workshop Stack (no todos).
- Cerrar la reconciliación BOM/Twin/Memory en la práctica: decidir con evidencia real de uso si hace falta una vista de grafo (Twin) o si Postgres + JSON alcanza.
- Empezar a extraer `messaging` (de `whatsapp-agente`) como cuarta Capability.
- **Definition of Done del trimestre:** al menos un cliente real facturando sobre el nuevo Stack, con soporte activo.

---

## Mes 10-12 (Q4) — Segundo vertical

**Objetivo del trimestre:** validar que el patrón generaliza fuera de Workshop, con un segundo dominio (Restaurant, apalancando conocimiento de VendexChat/Morfi).

- Extraer Capabilities específicas de Restaurant que no existan ya (ej. `orders`, `kitchen`).
- Componer `Restaurant Stack v0`.
- Recién en este punto — con 2 verticales reales — evaluar si el Capability Catalog (AR-014) necesita su forma completa, o si la versión simplificada de Sprint 6-9 alcanza.
- **Definition o Done del trimestre:** 1 cliente real de VendexChat/Morfi migrado o un cliente nuevo de Restaurant adquirido sobre el Stack.

---

## Mes 13-18 (meses 7 a 12 del año 2) — Stack Studio v0 (Business Mode únicamente)

**Objetivo:** construir *solo* el Business Mode de Stack Studio (AR-016) — la conversación con visualización del BOM resultante — no el Studio Mode técnico completo, que se pospone hasta que haya partners externos reales pidiéndolo.

- Interfaz visual para revisar/editar el BOM generado (no Capability Explorer drag-and-drop todavía).
- Cost Simulator básico (estimación de infraestructura, no simulación de evolución todavía).
- **Definition of Done:** un dueño de negocio no técnico puede revisar y ajustar su propio BOM sin ayuda.

---

## Mes 19-24 (meses 13 a 18 del año 2) — Decisión de escala, con datos reales

**Objetivo:** con 2 verticales, ~10-15 Capabilities reales, y datos de uso de 12+ meses, tomar — recién ahí — las decisiones que la visión original quiso tomar en el día 1:

- ¿Se justifica un Event Bus dedicado (Kafka/NATS) por volumen real medido? Decidir con números, no con principio.
- ¿Se justifica Neo4j por consultas de grafo reales pedidas por usuarios? Decidir con casos concretos.
- ¿Vale la pena invertir en Studio Mode técnico completo porque hay 3+ partners externos pidiéndolo?
- ¿El Marketplace tiene sentido porque hay demanda real de terceros construyendo Capabilities, o sigue siendo prematuro?
- **Definition of Done del período:** cada una de estas 4 preguntas respondida con datos de producción, no con la Constitución.

---

## Resumen de la diferencia con el roadmap original

| | Roadmap original (documentos de visión) | Este roadmap |
|---|---|---|
| Primeros 6 meses | Identity, Permission, Workflow, Builder, Marketplace (o, en el pivot final, Architect→BOM→Stack) | Sprint -1 (seguridad) → Architect conversación → validación con 20 empresas reales → 3 Capabilities *extraídas* de código real |
| Cuándo aparece infraestructura pesada | Declarada desde el documento 1 como "stack común" | Solo cuando el volumen real la pida (evaluado explícitamente en mes 19-24) |
| Cuándo aparece Marketplace/Stack Studio completo | Documentado en detalle antes del primer commit | Pospuesto a mes 13+ (Business Mode) y mes 19+ (evaluación de Studio Mode/Marketplace) |
| Criterio de avance entre sprints | Ninguno explícito | Métrica de validación explícita en Sprint 4-5 que puede frenar todo el roadmap si falla |

---

*Continúa en `03-REPOSITORY_AUDIT.md`.*
