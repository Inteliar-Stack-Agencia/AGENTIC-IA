# INTELIAR ARCHITECTURE REFERENCE
## AR-003 — Permission Service

**Versión:** 1.0 · **Estado:** Ready for Implementation · **Prioridad:** P0

---

## Objetivo

Centralizar **toda** la autorización de Inteliar. Responde una sola pregunta:

> ¿Puede este **actor** realizar esta **acción** sobre este **recurso** en este **contexto**?

**Filosofía:** Identity autentica · Organization contextualiza · Permission autoriza. Nunca mezclarlos.

## Responsabilidades

Roles, Policies, Permissions, Authorization, Resource Access, Context Rules, Feature Access, Delegations.
**No administra:** usuarios, sesiones, login, organizaciones, billing, marketplace.

## Modelo híbrido (RBAC + ABAC + Policy)

RBAC solo no alcanza cuando conviven personas, agentes, APIs, workflows y AI Pods. Inteliar usa:

```
RBAC (roles) + ABAC (atributos) + Policy Engine (reglas dinámicas)
```

```
Permission: id, name, description, resource, action, scope
  → customer.read, customer.create, inventory.adjust, invoice.approve, workflow.execute
Resource:   resource, owner, organization, classification, visibility, status
```

**Roles** son solo agrupadores, nunca contienen lógica: Administrator, Manager, Operator, Viewer, Architect, Developer, Support, Finance.

**Scope:** `Self → Team → Department → Organization → Global`.

**Policies** (la verdadera inteligencia): ej. *"Puede aprobar facturas SI monto < USD 5.000 Y pertenece a Finanzas Y la factura es de su Organización"* — no resoluble solo con RBAC.

## Contexto y políticas especiales

- **Context:** horario laboral, ubicación, dispositivo, país, organización, proceso, estado del recurso.
- **Delegaciones:** temporales (ej: manager delega a supervisor 7 días, expira automáticamente).
- **AI Permissions:** los agentes tienen permisos (ej: Support Agent puede leer/crear/cerrar tickets; no puede eliminar clientes ni acceder a secretos).
- **API Permissions:** identidad propia, no heredan permisos humanos.
- **Workflow Permissions:** ejecutan permisos de servicio, nunca del usuario.
- **Time / Geo / Approval Policies:** horarios de aprobación, país/VPN, doble/triple aprobación, firma digital.

## Authorization Engine

```
Actor → Resource → Action → Context → Policy → Decision
```

Nunca por comparación simple.

## Explainability

Cuando una autorización falla, no responde `403 Forbidden`. Responde:

```
No podés aprobar esta factura porque:
 • supera tu límite de aprobación
 • requiere un Manager
 • pertenece a otra sucursal
```

## Feature Access

Los planes usan Permission Service (ej: Free no puede usar AI Pods, Enterprise sí). Sin duplicar lógica.

## Eventos

`PermissionGranted · PermissionRevoked · RoleCreated · RoleUpdated · PolicyCreated · PolicyChanged · AuthorizationDenied · DelegationCreated · DelegationExpired`

## API y SDK

```
POST /authorize · /roles · /permissions · /policies · /delegations
```

SDK en todos los lenguajes usa la misma llamada, nunca implementan permisos locales:

```
authorize(actor, action, resource, context)
```

**Cache:** decisiones cacheables pero siempre invalidables.
**Auditoría:** quién, qué quiso hacer, resultado, regla aplicada, tiempo, motivo.
**Performance:** objetivo `<10ms`.

## Dependencias

Consume Identity y Organization. No consume ningún otro servicio.

## Stack

NestJS · PostgreSQL · Redis · Open Policy Agent (OPA) como motor de evaluación · OpenTelemetry.
**Repository:** `services/permission-service/`

## Definition of Done

RBAC · ABAC · Policy Engine · Delegaciones · API · SDK · Auditoría · Explainability · Observabilidad · Tests.

---

## 🚨 ADR-AR003 — Ningún servicio implementa permisos internamente

Todos consultan Permission Service. Siempre.

## ⭐ ADR-AR004 — Authorization as Data

Las reglas de autorización son **datos, no código**. Las políticas son objetos versionados:

```yaml
policy:
  id: approve_invoice
  when: { amount: "<5000", department: finance, organization: current }
  allow: { role: [manager, finance_admin] }
```

Permite modificarlas sin desplegar código, auditarlas, versionarlas, probarlas automáticamente, exportarlas entre organizaciones. Una empresa evoluciona sus políticas de seguridad como evoluciona sus procesos, sin depender de un desarrollador.

> **Foundation Layer** (con AR-001/002): Organization = *¿dónde existe todo?* · Identity = *¿quién interactúa?* · Permission = *¿qué puede hacer cada actor?*

---

*AR-003 — Permission Service*
