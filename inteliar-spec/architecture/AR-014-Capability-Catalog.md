# INTELIAR ARCHITECTURE REFERENCE
## AR-014 — Capability Catalog

**Versión:** 1.0 · **Estado:** Living Document · **Prioridad:** P0 (Estratégico)

---

## Objetivo

Definir el catálogo oficial de Capabilities de Inteliar.

Toda nueva funcionalidad deberá pertenecer a una Capability existente o justificar la creación de una nueva.

Este documento será la referencia oficial para:

- Builder
- Architect  
- Marketplace
- Knowledge Engine
- Claude Code
- Partners

---

## Filosofía

**No organizamos software. Organizamos el negocio.**

Las categorías representan capacidades empresariales, no tecnologías.

---

## Estructura

```
Capabilities
├── Foundation       (la base del BOS)
├── Platform         (capacidades compartidas)
├── Commercial       (clientes y ventas)
├── Operations       (operación diaria)
├── Finance          (gestión económica)
├── Communication    (comunicación)
├── Documents        (gestión de documentos)
├── Analytics        (información)
├── Intelligence     (la capa diferencial)
├── Marketplace      (economía del ecosistema)
├── Integrations     (conectores)
└── Industry         (paquetes de conocimiento por industria)
```

---

## Foundation

La base inmutable del BOS. Nunca dependen del negocio.

```
Organizations       Identity            Permissions
Users               Teams               Departments
Business Units      Audit               Settings
Feature Flags
```

**Propósito:** Infraestructura de multi-tenant, seguridad, gobernanza.

---

## Platform

Capacidades compartidas que toda aplicación usa.

```
Workflow            Events              Notifications
Files               Storage             Search
Reporting           Billing             Deploy
Monitoring          Scheduling          Secrets
API Gateway
```

**Propósito:** Columna vertebral técnica. Sin esto, nada funciona.

---

## Commercial

Todo lo relacionado con clientes y ventas.

```
Customers           CRM                 Leads
Sales               Quotes              Orders
Contracts           Subscriptions       Pricing
POS                 Ecommerce
```

**Propósito:** Captar, gestionar y retener clientes.

---

## Operations

Operación diaria. Varía según industria.

```
Inventory           Warehouse           Repairs
Manufacturing       Purchasing          Suppliers
Logistics           Fleet               Maintenance
Production          Labels              Quality
```

**Propósito:** Ejecutar el negocio día a día.

---

## Finance

Gestión económica y tesorería.

```
Invoices            Payments            Accounting
Taxes               Treasury            Expenses
Collections         Budgets             Forecast
Cashflow
```

**Propósito:** Control financiero y cumplimiento.

---

## Communication

Canales y medios de comunicación.

```
WhatsApp            Email               SMS
Notifications       Chat                Calls
Video               Campaigns
```

**Propósito:** Conectar con clientes, usuarios, partners.

---

## Documents

Todo documento empresarial.

```
Files               Templates           PDF
OCR                 Contracts           Signatures
Knowledge Docs      Scanned Documents
```

**Propósito:** Gestionar la información no estructurada.

---

## Analytics

Información, insights, toma de decisiones.

```
Dashboards          KPIs                Reports
Metrics             Forecast            BI
Exports
```

**Propósito:** Convertir datos en decisiones.

---

## Intelligence

La capa diferencial de Inteliar. Capacidades cognitivas.

```
Architect           Knowledge           Predictions
Recommendations     AI Agents           AI Pods
Automation          Optimization        Classification
Semantic Search     Document Understanding
```

**Propósito:** Automatizar decisiones, aprender patrones, mejorar continuamente.

---

## Marketplace

Economía del ecosistema Inteliar.

```
Capabilities        Templates           Partners
Plugins             Industry Packs      Themes
Licenses            Reviews             Revenue Sharing
```

**Propósito:** Distribución, monetización, crecimiento viral.

---

## Integrations

Conectores con sistemas externos.

```
Mercado Pago        Stripe              AFIP
Google              Meta                Shopify
Tiendanube          Slack               GitHub
Cloudflare          AWS                 SAP
Salesforce
```

**Propósito:** Conectar Inteliar con el ecosistema existente.

---

## Industry

Paquetes de conocimiento especializados. No son funcionalidades: son configuraciones + Capabilities + Workflows + AI específicas de una industria.

```
Workshop            Restaurant          Retail
Healthcare          Construction        Logistics
Municipality        Education           Legal
Veterinary          Manufacturing
```

**Propósito:** Acelerar el time-to-value en industrias específicas.

Cada uno instala: Capabilities, Workflows, AI Pods, Templates, KPIs, Policies.

---

## Capability Levels

### Core

Obligatorias. Sin ellas, la plataforma no existe.

```
Identity            Organization        Workflow
Events              Users
```

### Standard

Utilizadas por la mayoría de proyectos.

```
Customers           Invoices            Inventory
Notifications       Payments
```

### Specialized

Solo algunas industrias o casos de uso.

```
Repairs             Medical Records     Reservations
Fleet               Manufacturing
```

### Intelligence

Capacidades cognitivas. Transforman datos en decisiones.

```
Prediction          Optimization        Recommendations
AI Agents           Classification      Semantic Search
```

---

## Capability Relationships

No existen aisladas. Ejemplo:

```
Sales
  ↓
Customers
  ↓
Inventory
  ↓
Invoices
  ↓
Payments
  ↓
Analytics
```

**Builder utiliza estas relaciones automáticamente** durante la instalación de un Stack.

---

## Capability Matrix

Cada Capability declara:

```
- Business Value (Alto / Medio / Bajo)
- Complexity (Low / Medium / High)
- Dependencies (lista de Capabilities)
- Industry Coverage (qué industrias la usan)
- AI Support (¿expone tools a The Architect?)
- Workflow Support (¿ejecuta workflows?)
- API (REST / GraphQL / SDK)
- UI (¿tiene interfaz?)
- Reports (¿genera reportes?)
- Marketplace (¿se distribuye separately?)
- Tests (cobertura %)
```

---

## Health Score

Cada Capability recibe un indicador holístico:

```
Architecture      (0-100)    ¿está bien diseñada?
Tests             (0-100)    ¿tiene test coverage?
Performance       (0-100)    ¿es rápida?
Documentation     (0-100)    ¿está documentada?
Usage             (0-100)    ¿se usa?
Incidents         (0-100)    ¿es estable?
Security          (0-100)    ¿es segura?
───────────────────
Overall           (0-100)    puntuación total
```

Una Capability no entra al Marketplace si su Health Score < 70.

---

## Lifecycle

```
Idea → Research → Draft → Experimental → Stable → Enterprise → Deprecated → Archive
```

**Definition of Done:** Una Capability entra al catálogo únicamente cuando cumple:

- ✅ Blueprint completo (AR-013)
- ✅ ADR aprobada
- ✅ Tests (cobertura mínima 80%)
- ✅ Marketplace Ready
- ✅ Documentación completa (README, API, examples, tutorials)
- ✅ Health Score ≥ 70
- ✅ Owner asignado
- ✅ Vulnerabilidades auditadas

---

## Ownership

Toda Capability debe tener:

```
Owner               (responsable final)
Maintainers         (equipo que mantiene)
Reviewers           (validación arquitectónica)
Architect           (consultor de The Architect)
Documentation Owner (responsable de docs)
```

**Regla:** Nunca huérfanas. Si nadie es responsable, la Capability se depreca.

---

## Capability Registry

Todas se registran en un registro único:

```
catalog/
├── capability-registry.yaml     (índice de todas)
├── capabilities/
│   ├── customers/
│   ├── invoices/
│   ├── repairs/
│   └── ... (todas las demás)
└── health-report.json           (scores actualizados)
```

---

## Builder Rules

- **Nunca crea una nueva Capability si existe una compatible.**
- **Debe justificar cualquier nueva creación** en un ADR.
- **Siempre reutiliza primero.**

---

## Architect Rules

The Architect recomienda:

- ✅ **Capabilities**
- ❌ Tablas
- ❌ Microservicios
- ❌ Frameworks genéricos

El Architect es agnóstico a la implementación técnica pero experto en composición de Capabilities.

---

## Marketplace Rules

- Todo lo distribuible **debe pertenecer a una Capability.**
- No existen "plugins huérfanos."
- Toda venta en el Marketplace es una Capability, AI Pod, Template o Integration.

---

## Knowledge Rules

- Todo conocimiento **se clasifica por Capability.**
- No por aplicación.
- No por industria.
- Por dominio funcional.

Ejemplo: "Repair Scheduling" pertenece a la Capability "Repairs", no a "Fixly".

---

## API

```
GET    /catalog/capabilities              (lista todas)
GET    /catalog/capabilities/:id          (detalles)
GET    /catalog/capabilities/:id/deps     (dependencias)
GET    /catalog/capabilities/:id/health   (health score)
POST   /catalog/capabilities              (crear nueva — requiere ADR)
PUT    /catalog/capabilities/:id          (actualizar)
DELETE /catalog/capabilities/:id/archive  (deprecar)
```

---

## Repository Structure

```
inteliar-spec/
├── catalog/
│   ├── capability-registry.yaml
│   ├── capabilities.md               (este documento)
│   └── industry-packs.md
├── capabilities/
│   ├── customers/
│   ├── invoices/
│   ├── repairs/
│   └── ... (una carpeta por Capability)
├── stacks/                            (AR-015)
├── architecture/
└── adr/
```

---

## 🚨 ADR-AR035 — El Capability Catalog es la fuente oficial

**Estado:** Accepted

El Capability Catalog de Inteliar define explícitamente todas las Capabilities que existen en el ecosistema.

Ninguna funcionalidad puede existir fuera del catálogo. Si una funcionalidad no es una Capability ni forma parte de una, el proyecto está mal diseñado.

---

## ⭐ ADR-AR036 — Universal Capability Language (UCL)

**Estado:** Accepted

Inteliar define un lenguaje propio basado en Capabilities.

Todo se traduce a ese lenguaje:

- El usuario habla de **problemas empresariales**
- The Architect los interpreta como **Capabilities y Workflows**
- Builder ensambla **Capabilities** en un proyecto
- Claude Code implementa **Capabilities** según AR-013
- Marketplace distribuye **Capabilities**
- Knowledge Engine aprende por **Capability**

Todos hablan exactamente el mismo idioma.

Consecuencia: No hay ambigüedad. Un "Customer Management" significa lo mismo para el cliente, el arquitecto, el desarrollador y la IA.

---

*AR-014 — Capability Catalog*
