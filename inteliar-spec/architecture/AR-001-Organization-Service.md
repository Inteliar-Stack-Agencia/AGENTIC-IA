# INTELIAR ARCHITECTURE REFERENCE
## AR-001 — Organization Service

**Versión:** 1.0 · **Estado:** Ready for Implementation · **Prioridad:** P0

---

## Objetivo

El servicio central de Organizaciones. Es el **primero** que debe existir en Inteliar; todo lo demás depende de él. No existe ningún recurso fuera de una Organización.

## Responsabilidades

Administra exclusivamente: Organizaciones, Business Units, Equipos, Departamentos, Membresías, Contexto, Ownership.

**No administra:** usuarios, autenticación, permisos (eso pertenece a Identity y Permission Services).

## Arquitectura

```
Organization Service
├── Organization API   ├── Business Unit API   ├── Invitation API
├── Membership API     ├── Department API       ├── Audit API
├── Team API           └── Events
```

## Modelo de datos

```
Organization: id, slug, name, legal_name, tax_id, country, timezone,
              language, currency, status, settings, created_at, updated_at
BusinessUnit: id, organization_id, name, description, status
Department:   id, organization_id, business_unit_id, name, parent_department, manager
Team:         id, organization_id, department_id, name, description
Membership:   id, organization_id, user_id, role, status, joined_at, last_active
```

**IDs:** UUID con prefijo, nunca incrementales → `org_`, `team_`, `dept_`, `unit_`, `member_` (ej: `org_01HVW...`).

**Estados:** `Draft → Active → Suspended → Archived → Deleted`. Nunca borrar físicamente.

## Eventos (públicos en el Event Bus)

`OrganizationCreated · OrganizationUpdated · OrganizationArchived · OrganizationDeleted · OrganizationSettingsChanged · BusinessUnitCreated · DepartmentCreated · TeamCreated · MemberInvited · MemberJoined · MemberRemoved`

## API (REST)

```
POST/GET/PATCH/DELETE  /organizations[/:id]
POST/GET/PATCH/DELETE  /organizations/:id/business-units
POST/GET/PATCH/DELETE  /teams
POST/GET/PATCH/DELETE  /departments
POST                   /organizations/:id/invitations
POST                   /organizations/:id/members
DELETE                 /members/:id
```

**GraphQL:** `organization(id){ name teams departments members businessUnits settings }`
**SDK:** Node, Python, Go, REST, GraphQL, CLI — todos usan exactamente la misma API.

## Organization Context (obligatorio)

Todo request debe llevar `organization_id`. Nunca inferirlo, nunca asumirlo.

**Middleware:** `Resolve Organization → Validate Membership → Resolve Context → Continue`

## Configuración por organización

Idioma, Zona Horaria, Moneda, Formato Fecha/Número, Logo, Brand, Dominios (sin límite, ej: `empresa.inteliar.app`, `erp.empresa.com`), Integraciones.

**Multi Región:** cada organización declara región (US / EU / LATAM / APAC).
**Feature Flags:** AI Beta, Workflow V2, Builder Experimental, Marketplace Preview.
**Límites:** Free = 1 org · Pro = 10 · Enterprise = ilimitadas.

## Seguridad

Nunca devolver datos de otra organización. Nunca permitir consultas cruzadas. Todo filtro es **obligatorio**, no opcional.

## Auditoría y Observabilidad

Toda acción registra: quién, qué, cuándo, desde dónde, resultado, tiempo. Health endpoint, Metrics, Tracing, Structured Logs, OpenTelemetry — obligatorio.

## Dependencias

Organization Service **nunca conoce** Billing, Permissions, Identity, Marketplace, Deploy. Toda dependencia es mediante eventos.

## Stack

Node.js (LTS) · NestJS · Prisma · PostgreSQL · Redis · NATS (Kafka en Enterprise) · OpenTelemetry · JWT/OIDC (consumido de Identity) · Docker + Kubernetes-ready.

**Repository:** `services/organization-service/`

## KPIs del servicio

Tiempo de creación de organizaciones, tiempo de respuesta por endpoint, organizaciones activas, equipos/departamentos por organización, errores por operación, disponibilidad (objetivo 99.9%+).

## Definition of Done

API REST · GraphQL · SDK · Eventos · Tests · OpenAPI · Documentación · Observabilidad · Auditoría.

---

## 🚨 ADR-AR001 — Organization Service es el servicio raíz

Si este servicio cambia su contrato, todos los demás deben revisar su compatibilidad. No se permiten cambios incompatibles sin una nueva versión mayor.

---

*AR-001 — Organization Service*
