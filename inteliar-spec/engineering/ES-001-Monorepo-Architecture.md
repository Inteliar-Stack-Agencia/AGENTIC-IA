# INTELIAR ENGINEERING STANDARD
## ES-001 — Monorepo Architecture

**Versión:** 1.0 · **Estado:** Mandatory · **Prioridad:** P0

---

## Objetivo

Definir la estructura oficial del repositorio principal de Inteliar.

**Todo desarrollo debe vivir aquí.** No se aceptan repositorios improvisados.

---

## Filosofía

**El repositorio refleja la arquitectura. No al revés.**

Si la arquitectura es limpia, el código también.

---

## Estructura

```
inteliar-stack/

├── apps/                # Aplicaciones visibles
├── services/            # Microservicios
├── capabilities/        # Unidades de negocio
├── stacks/              # Productos
├── agents/              # Agentes individuales
├── pods/                # Composición de agentes
├── workflows/           # Procesos reutilizables
├── integrations/        # Conectores externos
├── packages/            # Librerías compartidas
├── infrastructure/      # Deploy y operación
├── tools/               # Herramientas internas
├── docs/                # Documentación
├── examples/            # Proyectos de ejemplo
├── tests/               # Testing transversal
├── scripts/             # Automatización
├── inteliar.yaml        # Platform manifest
└── .github/             # Actions, templates, bots
```

---

## apps/

**Aplicaciones visibles para el usuario.**

Nunca contienen lógica de negocio. Solo UI.

```
apps/
├── architect/           # The Architect interface
├── stack-studio/        # Studio visual (AR-016)
├── marketplace/         # Marketplace web
├── console/             # Admin console
├── admin/               # Admin panel
├── landing/             # Landing page
└── docs/                # Documentation site
```

Cada app:

- ✅ Next.js / React
- ✅ TypeScript
- ✅ Design System
- ✅ Tests (E2E)

---

## services/

**Los microservicios oficiales de la plataforma.**

Cada uno completamente independiente.

```
services/
├── identity-service/    # AR-002 (quién eres)
├── organization-service/ # AR-001 (dónde existe)
├── permission-service/  # AR-003 (qué haces)
├── event-bus/           # AR-004 (cómo se comunican)
├── digital-twin/        # AR-005 (modelo del negocio)
├── knowledge-engine/    # AR-006 (experiencia ecosistema)
├── memory-service/      # AR-012 (memoria estructurada)
├── architect-service/   # AR-007 (orquestador)
├── workflow-engine/     # AR-008 (ejecución procesos)
├── ai-runtime/          # AR-011 (orquestación IA)
├── builder/             # Builder engine
├── notification/        # Notificaciones
├── billing/             # Facturación
├── deploy/              # Deployment
└── search/              # Búsqueda
```

Cada servicio:

- ✅ NestJS
- ✅ PostgreSQL / Neo4j / Redis (según AR)
- ✅ REST + GraphQL + SDK
- ✅ Tests (Unit + Integration)
- ✅ Observabilidad (OpenTelemetry)

---

## capabilities/

**El corazón de Inteliar.**

Cada Capability implementa AR-013 (Blueprint).

```
capabilities/
├── customer-management/
├── inventory/
├── repairs/
├── payments/
├── invoices/
├── labels/
├── documents/
├── crm/
├── analytics/
├── warehouse/
├── leads/
├── orders/
├── subscriptions/
└── ... (cada una definida en AR-014)
```

Cada Capability:

```
capability-name/
├── manifest.yaml        # Definición
├── domain/              # Modelos de negocio
├── application/         # Casos de uso
├── api/                 # REST, GraphQL, SDK
├── events/              # Qué publica
├── workflows/           # Procesos
├── ai/                  # Tools, prompts
├── ui/                  # Páginas, formularios
├── reports/             # KPIs, exportes
├── docs/                # Documentación
├── tests/               # Unit, Integration, E2E
├── migrations/          # Versionado
└── examples/            # Tutoriales
```

Implementación de AR-013: Capability Blueprint.

---

## stacks/

**Los productos finales de Inteliar.**

No contienen código, solo composición (AR-015).

```
stacks/
├── fixly/               # Workshop Stack
├── restaurant/          # Restaurant Stack
├── retail/              # Retail Stack
├── healthcare/          # Healthcare Stack
├── municipality/        # Municipality Stack
├── distributor/         # Distributor Stack
└── education/           # Education Stack
```

Cada Stack:

```
stack-name/
├── stack.yaml           # Manifest (AR-015)
├── capabilities.yaml    # Qué trae
├── workflows.yaml       # Procesos
├── ai-pods.yaml         # Especialistas
├── integrations.yaml    # Conectores
├── policies.yaml        # Roles, permisos
├── knowledge-pack.yaml  # Industria
├── deployment.yaml      # Perfiles
├── templates/           # Datos de ejemplo
└── docs/                # Guía
```

---

## agents/

**Agentes individuales ejecutados por AI Runtime (AR-011).**

```
agents/
├── architect/           # Diseña soluciones
├── reviewer/            # Revisa código
├── security/            # Audita seguridad
├── finance/             # Asiste finanzas
├── sales/               # Asiste ventas
├── support/             # Soporte a clientes
├── workflow/            # Orquesta procesos
├── builder/             # Genera código
└── documentation/       # Escribe docs
```

Cada agente:

```
agent-name/
├── manifest.yaml        # Definición
├── tools.yaml           # Capabilities expone
├── knowledge.yaml       # Acceso a Knowledge
├── memory.yaml          # Scope de memoria
├── prompts/             # Templates
└── evaluations/         # Cómo medir calidad
```

---

## pods/

**Composición de agentes (AR-011).**

Los Pods nunca contienen lógica. Solo coordinación.

```
pods/
├── developer-pod/       # dev-tool-box
├── support-pod/         # customer support
├── sales-pod/           # ventas y leads
├── marketing-pod/       # marketing & campaigns
├── finance-pod/         # finanzas & tesorería
└── operations-pod/      # operaciones
```

Cada Pod:

```
pod-name/
├── manifest.yaml        # Qué agentes coordina
├── orchestration.yaml   # Cómo colaboran
├── memory.yaml          # Contexto compartido
└── tools/               # Capabilities accesibles
```

---

## workflows/

**Procesos empresariales reutilizables.**

Versionados, declarativos (AR-008).

```
workflows/
├── repair-workflow/
├── invoice-workflow/
├── sales-workflow/
├── onboarding-workflow/
├── deployment-workflow/
├── approval-workflow/
└── inventory-workflow/
```

Cada workflow:

```
workflow-name/
├── manifest.yaml        # Definición
├── states.yaml          # Estados
├── transitions.yaml     # Transiciones
├── tasks/               # Tareas (human/service/ai)
├── compensations.yaml   # Rollback
├── slas.yaml            # Tiempos
└── tests/               # Test cases
```

---

## integrations/

**Conectores con sistemas externos.**

Nunca mezclados con Capabilities.

```
integrations/
├── afip/                # Argentina fiscal
├── mercado-pago/        # Pagos
├── stripe/              # Pagos internacional
├── whatsapp/            # Mensajería
├── shopify/             # Ecommerce
├── tiendanube/          # Ecommerce LatAM
├── google/              # Google Suite
├── slack/               # Comunicación
├── github/              # VCS
└── salesforce/          # CRM empresarial
```

Cada integración:

```
integration-name/
├── manifest.yaml        # Definición
├── auth/                # Autenticación
├── sync/                # Sincronización
├── events/              # Qué dispara
├── tests/               # Validación
└── docs/                # Setup guide
```

---

## packages/

**Librerías compartidas.**

Nunca lógica de negocio.

```
packages/
├── ui/                  # Design System React
├── sdk/                 # SDK oficial
├── types/               # Tipos TypeScript
├── utils/               # Utilidades
├── config/              # Configuración
├── eslint-config/       # ESLint rules
├── tsconfig/            # TypeScript config
└── design-system/       # Design tokens
```

Cada package:

- ✅ Independiente
- ✅ Versionado en npm/pnpm
- ✅ Documentado
- ✅ Tests

---

## infrastructure/

**Todo lo relacionado con despliegue y operación.**

```
infrastructure/
├── docker/              # Dockerfiles
├── terraform/           # Infrastructure as Code
├── kubernetes/          # K8s manifests
├── cloudflare/          # CDN config
├── aws/                 # AWS setup
├── monitoring/          # Observabilidad config
├── grafana/             # Dashboards
└── otel/                # OpenTelemetry setup
```

---

## tools/

**Herramientas internas para desarrollo.**

Nunca contienen lógica de negocio.

```
tools/
├── builder-cli/         # CLI para Builder
├── doctor/              # Diagnóstico de repo
├── migration/           # Herramientas migración
├── benchmark/           # Performance tests
└── generator/           # Generadores de código
```

---

## docs/

**Toda la documentación del proyecto.**

```
docs/
├── adr/                 # ADR Ledger
├── architecture/        # AR-001…AR-042
├── engineering/         # ES-XXX estándares
├── blueprints/          # Capability Blueprints
├── playbooks/           # Guías operacionales
└── decisions/           # Decisiones tomadas
```

---

## examples/

**Proyectos de ejemplo.**

Demuestran cómo usar Inteliar.

```
examples/
├── crm/                 # Sistema CRM completo
├── repair-shop/         # Taller de reparación
├── restaurant/          # Restaurante completo
└── inventory/           # Inventario + Warehouse
```

---

## tests/

**Testing transversal.**

Tests que abarcan múltiples servicios.

```
tests/
├── integration/         # Entre servicios
├── performance/         # Benchmarks
├── contracts/           # Contract testing
├── security/            # Security audits
└── e2e/                 # End to end
```

---

## scripts/

**Automatización interna.**

Nunca contienen lógica de negocio.

```
scripts/
├── setup.sh
├── test.sh
├── build.sh
├── deploy.sh
└── migrate.sh
```

---

## .github/

**GitHub-specific configuration.**

```
.github/
├── workflows/           # CI/CD pipelines
├── templates/           # PR templates, issue templates
├── CODEOWNERS           # Ownership
└── renovate.json        # Dependency updates
```

---

## Convenciones

### Archivos obligatorios

Toda carpeta **principal** debe incluir:

```
README.md              (descripción)
CHANGELOG.md           (historial)
LICENSE                (licencia)
CODEOWNERS             (responsables)
ADR.md                 (decisiones)
manifest.yaml          (definición)
```

---

### Naming

**Todo en kebab-case. Nunca CamelCase.**

```
✅ customer-management
✅ repair-workflow
✅ support-pod

❌ CustomerManagement
❌ RepairWorkflow
❌ SupportPod
```

---

### Lenguaje

**Código:** Inglés (siempre)

**Documentación:** Español o Inglés (o ambos)

```
✅ export class CustomerService
✅ "## Explicación general" (en README.md)
✅ Comentarios en código: inglés
```

---

### Branches

```
main              # Producción estable
develop           # Rama de desarrollo

feature/*         # Nuevas features
fix/*             # Bugfixes
release/*         # Preparación release
hotfix/*          # Fixes urgentes
```

**Nunca ramas personales.** (`carlos-test`, `experimental`, etc.)

---

### Pull Requests

Obligatorios. Siempre.

- Builder puede generarlos automáticamente
- Claude Code puede completarlos
- Pero siempre existen en Git

---

### ADR

**Toda decisión importante → Nueva ADR.**

No comentarios en el código. Las decisiones van en `adr/`.

---

### CODEOWNERS

Toda carpeta principal debe tener responsable:

```
/capabilities/customer-management/   @carlos
/services/identity-service/          @team-core
/apps/stack-studio/                  @team-studio
```

---

## Repository Health

Builder calcula automáticamente:

```
Duplicación de código      (debe ser < 5%)
Violaciones arquitectónicas (debe ser 0)
Cobertura de tests         (debe ser > 80%)
Performance regressions    (debe ser 0)
Complejidad ciclomática    (debe ser < 10)
Costo de infraestructura   (tracking)
```

---

## AI Readiness

Todo directorio debe declarar:

```yaml
ai:
  owner: nombre-del-agente-responsable
  description: "¿Qué hace esta carpeta?"
  tools:
    - capability-1
    - capability-2
  dependencies:
    - service-1
    - package-1
  knowledge:
    - knowledge-domain-1
```

De esta forma, los agentes entienden automáticamente el proyecto.

---

## Documentation First

**Antes del código debe existir:**

- ✅ ADR (decisión)
- ✅ Blueprint (especificación)
- ✅ Contrato (API, eventos)

**Después:** Implementación

---

## Repository Graph

Builder genera automáticamente un grafo visual del repositorio:

```
Capability
  ↓
Service
  ↓
Workflow
  ↓
Agent
  ↓
Pod
  ↓
Stack
```

Visual, siempre actualizado.

---

## inteliar.yaml

**El "ADN" del proyecto.**

Todo agente lee este archivo antes de hacer cambios:

```yaml
platform:
  version: "1.0"
  schema_version: "v1"

architecture:
  model: capabilities          # Unidad de construcción
  organization_first: true     # ADR-026

runtime:
  default: ai-runtime          # AR-011
  builder: enabled             # AR-010
  marketplace: enabled         # AR-014
  architect: enabled           # AR-007
  knowledge_engine: enabled    # AR-006
  digital_twin: enabled        # AR-005
  workflow_engine: enabled     # AR-008

standards:
  language: en                 # Código en inglés
  naming: kebab-case          # customer-management
  testing_minimum: 80%        # Cobertura mínima
  design_system: inteliar-ui  # Componentes

monorepo:
  package_manager: pnpm
  node_version: "20+"
  typescript: "5.0+"

repository:
  main_branch: main
  develop_branch: develop
  branch_format: "feature|fix|release|hotfix/*"
  require_pr: true
  ci_checks:
    - tests
    - lint
    - security
    - architecture
```

---

## 🚨 ADR-ENG001 — Repository as Contract

**Estado:** Accepted

El repositorio es el contrato entre humanos y agentes de IA.

Debe ser igual de comprensible para ambos.

Consecuencia: La estructura del repositorio debe ser tan clara que un agente IA no necesite pedir explicaciones.

---

## 🚨 ADR-ENG002 — Clear Responsibility

**Estado:** Accepted

Todo elemento del repositorio debe responder una pregunta clara:

- `apps/` → ¿Qué ve el usuario?
- `services/` → ¿Qué ejecuta la plataforma?
- `capabilities/` → ¿Qué puede hacer la empresa?
- `stacks/` → ¿Qué producto entregamos?
- `agents/` → ¿Quién realiza el trabajo?
- `pods/` → ¿Cómo colaboran?
- `workflows/` → ¿Cómo opera el negocio?

**Nunca mezclar responsabilidades.**

---

## ⭐ ADR-ENG003 — Platform Manifest

**Estado:** Accepted

Todo monorepo Inteliar debe comenzar con un único manifiesto de plataforma (`inteliar.yaml`).

Ese manifiesto define:

- La versión de la arquitectura
- Los servicios activos
- Las reglas del repositorio
- Los estándares
- Las convenciones
- Las capacidades habilitadas

**No es configuración. Es la identidad del ecosistema.**

---

*ES-001 — Monorepo Architecture*
