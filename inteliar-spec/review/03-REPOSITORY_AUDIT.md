# REPOSITORY AUDIT
## Fase 5 — Desde dónde empezamos realmente

**Fuente primaria:** auditoría técnica completa de los 17 repositorios de `Inteliar-Stack-Agencia`, realizada 2026-07-11 por lectura directa de código (sin ejecución, sin modificaciones). Este documento no repite esa auditoría — la resume y la traduce a decisiones de arquitectura para el roadmap de `02-ROADMAP_24_MONTHS.md`. El informe completo original vive en el histórico de esta organización; lo que sigue es la síntesis accionable.

**Por qué este documento importa más que cualquier AR:** ningún documento de la Constitución (AR-001 a AR-016) hace referencia a esta auditoría. Se diseñaron 16 servicios y un lenguaje de modelado propio sin mirar una sola vez el código que ya existe, ya genera ingresos, y ya tiene usuarios reales. Este documento cierra esa brecha.

---

## 1. Qué existe realmente

17 repos en `Inteliar-Stack-Agencia` (5 adicionales bajo la cuenta personal `Oskelias` quedaron fuera de alcance de la auditoría original — **pendiente explícito**, no resuelto en este documento).

**Hallazgo central:** 5 productos reales, cero plataforma compartida. Cada uno resolvió el mismo conjunto de problemas (auth, cliente Supabase, pagos, cliente de LLM, UI kit) por separado, sin compartir una línea de código entre sí.

| Repo | Producto | Madurez real |
|---|---|---|
| `FIXLY-APP` | SaaS de talleres de reparación | MVP avanzado, clientes reales |
| `VendexChat-admin` | Back-office de tiendas online | Producción activa |
| `VendexChat-front` | Storefronts + pedidos por WhatsApp | Producción, multi-cliente real |
| `Inteliar-Labels` | Diseño/impresión de etiquetas térmicas | Producción con billing real — **el más maduro del portafolio** |
| `RIWEB.APP` | Auditoría web + CRM de bots WhatsApp | MVP con brecha de auth crítica |
| `Calcularweb` | Portal de calculadoras monetizado con ads | Producción, bajo riesgo |
| `whatsapp-agente` | Bots de WhatsApp con IA ("AgentKit") | MVP en producción, auth admin débil |
| `google-ads-mcp-server` | Servidor MCP para Google Ads | Prototipo sólido |
| `real-estate-copilot-latam` | Copiloto comercial inmobiliario | MVP funcional — **mejor patrón de IA del portafolio** |
| `LEGAL-TEMPLATES` | Plantillas legales | **Credencial de producción expuesta por error** |
| `openclaw-railway-template` | Wrapper de deploy (fork de terceros) | Infra de terceros, bien adaptada |
| `zeus-core` | Por nombre sugiere el "core" que buscamos | **No funcional** — transcripciones de chat abandonadas |
| `whatsapp-business-api` | Dashboard WhatsApp Cloud API (fork) | Fork sin adaptar |
| `compliant-real-estate-chatbot` | Investigación de Zillow (fork) | Fork intacto, sin commits propios |
| `ai-construction-estimator` | Estimador de costos vía BIM/CAD | Solo README, sin código |
| `demo-repository` | Repo de bienvenida autogenerado | Descartable |
| `AGENTIC-IA` | Landing de agentes IA (este repo) | Pre-lanzamiento |

---

## 2. Todo lo reutilizable

| Componente | Origen | Estado |
|---|---|---|
| Cliente LLM multi-proveedor (gobernanza anti-alucinación: el LLM nunca es fuente de verdad, siempre redacta sobre un resultado ya calculado, con fallback) | `real-estate-copilot-latam/src/llm/llm_client.py` | Falta completar proveedor Anthropic (hoy stub) |
| Sistema de billing/licencias (webhooks HMAC reales de Stripe y MercadoPago, license keys, activación de dispositivo, audit log) | `Inteliar-Labels` | Listo, es la pieza más madura del portafolio |
| Adaptador de proveedores de mensajería (interfaz común Whapi/Meta/Twilio) | `whatsapp-agente/agent/providers/base.py` | Listo conceptualmente, requiere endurecer auth del admin primero |
| Kit de componentes UI (Radix/shadcn, incluye calendar/carousel/chart/command/drawer/form/menubar) | `vendexchat-front/src/components/ui/*` + `Inteliar-Labels` | Listo — mismo linaje, fusión mecánica |
| Cliente Supabase SSR + middleware de auth | `Inteliar-Labels (lib/supabase/{client,server}.ts, proxy.ts)` | Listo como plantilla de referencia |
| Webhooks de pago con verificación HMAC | `Inteliar-Labels` | Listo, ejemplo más correcto del portafolio |
| Plantillas legales (GDPR/CCPA/LGPD/Ley 25.326) | `LEGAL-TEMPLATES` (subcarpeta real, no el contenido mezclado por error) | Listo, extraer a repo propio |
| Patrón de herramientas MCP (un archivo por herramienta, validación zod, defaults conservadores) | `google-ads-mcp-server` | Listo como molde para integraciones futuras |
| Rate limiter sobre Supabase | `Inteliar-Labels/lib/rate-limit.ts` | Listo, portable directo |
| Patrón "config por tenant en un archivo" (nace de un incidente real de producción) | `vendexchat-front/src/shop/config/storeConfig.ts` | Listo, documentar la regla al adoptarlo |

## 3. Todo lo que puede migrarse (con arreglos primero)

- Middleware de auth+tenant+CORS de Fixly (`functions/api/_middleware.ts`) — el patrón es correcto, pero **no verifica la firma del JWT** (solo expiración). Arreglar antes de generalizar.
- Adaptador de mensajería de `whatsapp-agente` — listo conceptualmente, pero requiere sacar la contraseña admin por defecto y la sesión en texto plano antes de que sea la base de una Capability compartida.

## 4. Todo lo descartable

- `zeus-core` — sin código funcional (transcripciones de chat de IA sin editar, `package.json` mal nombrado, `.gitignore` con carácter unicode invisible que rompe git). **Archivar, no migrar.**
- `demo-repository` — repo de bienvenida autogenerado por GitHub. Archivar.
- `ai-construction-estimator` — solo README aspiracional, cero código. Decidir explícitamente: eliminar o marcar claramente como "idea, no proyecto" para no distorsionar el inventario.
- `compliant-real-estate-chatbot` — fork intacto de una investigación de Zillow sin un solo commit propio. Mismo tratamiento.

## 5. Todo lo que conviene reescribir

- **`whatsapp-business-api`** (fork de terceros en Go, sin adaptar, sin auth en ningún endpoint propio) — decidir entre migrar sus capacidades útiles al adaptador ya existente de `whatsapp-agente`, o retirarlo directamente. No mantener dos stacks de WhatsApp que no se hablan entre sí.
- El contenido mezclado por error en `LEGAL-TEMPLATES` (una versión temprana de "Fixly Taller" completa, con `.env.local` commiteado) — no se reescribe, se elimina del historial del repo después de rotar la credencial expuesta.

## 6. Todo lo que puede convertirse en Capability (AR-013 simplificado)

Esta es la traducción directa de la sección "reutilizable" a unidades de Capability, siguiendo el orden de extracción propuesto en `01-PROPOSED_ARCHITECTURE.md §6`:

| Capability | Fuente real | Reemplaza |
|---|---|---|
| `@inteliar/supabase-client` | `Inteliar-Labels` (patrón SSR) | 4 reimplementaciones independientes del cliente Supabase |
| `@inteliar/ui` | `vendexchat-front` + `Inteliar-Labels` | 2 kits Radix/shadcn casi idénticos + 1 kit custom en VendexChat-admin |
| `@inteliar/ai-client` | `real-estate-copilot-latam` | 3 formas distintas de llamar a un LLM (1 correcta, 2 inseguras client-side) |
| `@inteliar/messaging` | `whatsapp-agente` | 2 stacks de WhatsApp sin relación entre sí |
| `@inteliar/billing` | `Inteliar-Labels` | 3 integraciones independientes de MercadoPago/Stripe |
| `@inteliar/legal-templates` | `LEGAL-TEMPLATES` (subcarpeta real) | Documentos legales redactados ad hoc por producto |
| `@inteliar/security-checklist` | Fusión de `CONCERNS.md` (Fixly) + `SECURITY-AUDIT.md` (VendexChat) | 3 documentos de auditoría de seguridad casi idénticos escritos por separado |
| `customer-management` | Esquema de Fixly + VendexChat unificado | — (primera Capability de negocio, no de infraestructura) |
| `repair-management` | Fixly | — |

**Nota importante:** las primeras seis filas son *librerías de infraestructura compartida*, no Capabilities de negocio en el sentido de AR-013. Son el `@inteliar/*` que cualquier Capability de negocio va a consumir. Solo las dos últimas son Capabilities de negocio en el sentido estricto del catálogo (AR-014).

---

## 7. Problemas encontrados, por severidad (referencia rápida — detalle completo en la auditoría original)

**Crítico:**
1. Credencial productiva de Supabase commiteada en `LEGAL-TEMPLATES` (URL + clave anónima reales).
2. Ruta `/admin` sin autenticación en `RIWEB.APP`, con RLS que da CRUD completo a cualquier usuario autenticado.
3. API key de Anthropic manejada en el navegador (`RIWEB.APP`), visible en devtools.

**Alto:**
4. Auth de panel admin trivialmente bypasseable en `whatsapp-agente` (contraseña default, sesión en texto plano) y en `whatsapp-business-api` (token de webhook hardcodeado, endpoints sin auth).
5. JWT sin verificación de firma + rate limiter no persistente en Fixly.
6. Escalada de privilegios documentada y sin resolver en `VendexChat-admin` (CR-03) + API key de Groq expuesta en el bundle del cliente (BA-03).

**Estructural:**
7. Cero tests automatizados en los cinco productos activos. Ninguna suite corre en CI antes de deploy.
8. Cuatro reimplementaciones independientes del cliente Supabase.

**Higiene:**
9. `zeus-core` sin código funcional pese a su nombre.
10. Ruido de portafolio (`ai-construction-estimator`, `compliant-real-estate-chatbot`, `demo-repository`) reportado como "en desarrollo" sería engañoso hacia afuera.

---

## 8. Lo que esto significa para el roadmap

Todo lo anterior ya está incorporado en `02-ROADMAP_24_MONTHS.md`:

- **Sprint -1** existe únicamente por los hallazgos Crítico + Alto de la sección 7.
- **Sprint 6-9** (primeras Capabilities) usan la tabla de la sección 6 como única fuente — no se diseña ninguna Capability nueva hasta agotar esta lista.
- El **pendiente explícito** de auditar los 5 repos de la cuenta `Oskelias` (`FIXLY-BACKEND`, `LandingFixly`, `Fixlylanding`, `webbusquedas`, `morfi-viandas-landing`) sigue abierto — es razonable esperar que contengan versiones previas de Fixly o de clientes de VendexChat (Morfi Viandas es tenant real de VendexChat-front) que podrían cambiar el orden de extracción propuesto arriba. **Recomendación: repetir esta auditoría sobre esa cuenta antes de fijar el Sprint 6-9 en piedra.**

---

*Continúa en `04-DECISION.md`.*
