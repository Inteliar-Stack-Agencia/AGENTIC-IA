# INTELIAR ARCHITECTURE REFERENCE
## AR-009 — Capability Engine

**Versión:** 1.0 · **Estado:** Core Platform Service · **Prioridad:** P0

---

## Objetivo

Implementar el sistema de Capabilities. Una **Capability** representa una capacidad completa del negocio. No es un módulo, ni una pantalla, ni una API: es una **unidad funcional reutilizable**.

> Las empresas no compran módulos, compran capacidades. Nadie dice "necesito una tabla Customers"; dicen "necesito administrar clientes". Eso es una Capability.

## Definición y anatomía

Una Capability combina: modelo de negocio, procesos, interfaz, API, eventos, automatizaciones, agentes, conocimiento. Todo junto.

```
Capability
├── Domain Model  ├── Events       ├── Reports
├── UI            ├── AI Agents     ├── Integrations
├── API           ├── Permissions   └── Documentation
├── Workflows     ├── Templates
```

**Ejemplo — Customer Management:** no es `customers table`, es Customer + CRUD + Búsqueda + Historial + Notas + Documentos + Workflow + Automatizaciones + Reportes + IA + API + Eventos. Todo forma una sola Capability.

**Catálogo inicial:** Customer Management, Inventory, Sales, Purchasing, Invoices, Payments, Repairs, Appointments, Warehouse, Manufacturing, HR, CRM, POS, Labels, Documents, Notifications, Analytics, Knowledge, AI, Users.

```
Capability: id, name, version, owner, category, dependencies, status,
            documentation, interfaces, events, permissions
```

## Propiedades

- **Dependencias:** declaradas, nunca ocultas (Invoices → Customers, Products, Taxes, Payments).
- **Interfaces:** toda Capability expone REST, GraphQL, SDK, CLI, UI Components, Events. No existen Capabilities cerradas.
- **UI:** publica pantallas, widgets, formularios, tablas, dashboards — no dependen de una app específica.
- **API:** pública, versionada, documentada.
- **Eventos:** ej. `CustomerCreated/Updated/Deleted/Merged`.
- **Workflows:** cada Capability aporta procesos.
- **AI:** publica herramientas para IA (`createCustomer()`, `findCustomer()`, `mergeCustomer()`, `recommendCustomers()`) que The Architect utiliza.
- **Reports:** expone KPIs, métricas, indicadores (datos, no dashboards rígidos).
- **Integraciones:** declaradas (Mercado Pago, AFIP, WhatsApp, Google Calendar, Stripe).
- **Extensiones:** Repair → Warranty / Insurance / Quality Control Extension.
- **Feature Flags:** versiones Beta, Experimental, Enterprise.

## Ecosistema

- **Marketplace:** toda Capability puede publicarse (no hace falta una app completa).
- **Builder:** nunca crea CRUD; pregunta qué Capability necesitás y ensambla.
- **Architect:** recomienda Capabilities, no módulos.
- **Knowledge Engine:** indexa conocimiento por Capability, no solo por industria.

## Score / Lifecycle / Versionado

- **Capability Score:** Madurez, Adopción, Cobertura, Performance, Documentación, Tests, Popularidad, Health.
- **Lifecycle:** `Draft → Experimental → Stable → Enterprise → Deprecated → Archived`.
- **Versionado:** nunca romper compatibilidad; v1/v2/v3 coexisten.
- **Testing:** Unit, Integration, Contract, E2E, AI Evaluation, Performance.
- **Packaging:** distribuible — instalar, actualizar, desinstalar sin afectar el resto.

## Persistencia

La Capability **no posee base de datos propia**. Define contratos; cada servicio implementa su almacenamiento.

## API / SDK

```
GET /capabilities · /capabilities/:id
POST /capabilities/install · /update · /remove
```

`capability.install() · enable() · disable() · health() · update()`
**Repository:** `capabilities/{customer-management,inventory,sales,repairs,payments}/`

Internamente una Capability puede usar distintas tecnologías, pero hacia afuera siempre expone los mismos contratos definidos por Inteliar.

## Definition of Done

Modelo de dominio · API · Eventos · UI · Workflows · Permisos · Documentación · Tests · SDK · Herramientas para IA · Métricas. Incompleta si falta alguno.

---

## 🚨 ADR-AR020 — La Capability es la unidad mínima de negocio

No los módulos, no las pantallas, no las tablas.

## 🚨 ADR-AR021 — No se aceptan funcionalidades huérfanas

Toda nueva funcionalidad pertenece a una Capability existente o justifica una nueva.

## ⭐ ADR-AR022 — Capabilities over Applications

Las aplicaciones dejan de ser el centro; el centro son las Capabilities. Una app (Fixly, Labels, cualquier SaaS futuro) no es más que una **composición de Capabilities**. Consecuencia: Builder arma apps ensamblando Capabilities · Marketplace las distribuye · Architect las recomienda · Knowledge Engine aprende sobre ellas · Workflow Engine ejecuta procesos entre ellas. Todo el ecosistema habla el mismo idioma.

### Tres niveles de Capability
- **Core:** Customers, Identity, Payments, Inventory.
- **Business:** Repair Management, Restaurant Orders, Fleet Management, Medical Records.
- **Intelligence:** Prediction, Recommendation, Document Understanding, Fraud Detection, Demand Forecasting, Optimization.

### Propuesta — Module deja de ser unidad principal
El concepto de **Module** puede seguir existiendo como implementación técnica interna, pero hacia el usuario, el Marketplace y el Architect solo existe un concepto: **Capability**. Un dueño de negocio entiende "Gestión de Clientes", no "Módulo Customer". La plataforma habla el idioma de las empresas, no el de los desarrolladores.

> **Nota de coherencia:** esto refina los capítulos de la Constitución que usaban "Module" como unidad — pendiente de armonizar en la pasada de coherencia.

---

*AR-009 — Capability Engine*
