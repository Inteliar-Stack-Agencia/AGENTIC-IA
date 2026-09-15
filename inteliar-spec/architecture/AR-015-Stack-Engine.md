# INTELIAR ARCHITECTURE REFERENCE
## AR-015 — Stack Engine

**Versión:** 1.0 · **Estado:** Strategic Platform Layer · **Prioridad:** P0 (Estratégico)

---

## Objetivo

Implementar el sistema de composición de productos de Inteliar.

Un **Stack** representa un conjunto coherente de Capabilities, Workflows, AI Pods, configuraciones e interfaces para resolver un problema específico.

**El Stack es la unidad oficial de distribución del ecosistema.**

---

## Filosofía

- Una **Capability** resuelve **una necesidad.**
- Un **Stack** resuelve **un negocio completo.**

Ejemplo:

- Capability: "Customers" (gestionar clientes)
- Stack: "Restaurant Stack" (una solución completa para restaurantes, que incluye Customers, POS, Kitchen, Payments, Inventory, etc.)

---

## ¿Qué es un Stack?

Un Stack es una **composición declarativa** de:

- Capabilities (funcionalidades)
- Workflows (procesos)
- AI Pods (especialistas IA)
- Templates (configuraciones preestablecidas)
- Policies (roles, permisos, reglas)
- Integrations (conectores)
- UI Theme (diseño visual)
- Knowledge Pack (industria-específico)

**No contiene código. Contiene decisiones.**

---

## Anatomía de un Stack

```
Stack
├── Manifest                 (definición declarativa)
├── Capabilities             (lista + versiones)
├── Workflows                (procesos preconfigurados)
├── AI Pods                  (especialistas IA recomendados)
├── Templates                (datos de ejemplo)
├── UI Theme                 (identidad visual)
├── Policies                 (roles, permisos, buenas prácticas)
├── Integrations             (conectores preconfigurados)
├── Deployment Profile       (cloud, on-premise, hybrid, edge)
├── Documentation            (guía de inicio, playbooks)
└── Marketplace Metadata     (precio, categoría, rating)
```

---

## Manifest

Todo Stack comienza con un archivo declarativo:

```yaml
# stack.yaml

id: fixly
name: "Fixly Workshop Stack"
version: 1.0.0
description: "Solución completa para talleres de reparación"
industry: workshop
maintainer: "Inteliar"

capabilities:
  - customers
  - repairs
  - invoices
  - payments
  - notifications
  - analytics

workflows:
  - repair-workflow
  - delivery-workflow
  - customer-notification-workflow

ai_pods:
  - support-assistant
  - workshop-advisor

integrations:
  - mercado-pago
  - whatsapp
  - google-calendar

policies:
  roles:
    - workshop-admin
    - technician
    - support
  rbac:
    - resource: repairs
      admin: "*"
      technician: "read,update"

deployment:
  profiles:
    - cloud
    - on-premise
    - hybrid

knowledge_pack:
  industry: workshop
  benchmarks: true
  playbooks: true
```

---

## Tipos de Stack

### Starter Stack

Lo mínimo para comenzar. Capacidades básicas.

Ejemplo: Restaurant Starter

```
Orders → POS → Payments
```

**Propósito:** Entrada rápida de bajo costo.

### Professional Stack

Automatización, IA, integraciones.

Ejemplo: Restaurant Professional

```
Orders
  → Kitchen
  → POS
  → Payments
  → Inventory
  → Analytics
  → AI Recommendations
```

**Propósito:** Negocios medianos que quieren crecer.

### Enterprise Stack

Multi-sucursal, multi-empresa, compliance, SSO.

```
Orders
  → Kitchen
  → POS
  → Payments
  → Inventory
  → Logistics
  → Analytics
  → Advanced AI
  → Compliance
  → SSO
  → Advanced Reporting
```

**Propósito:** Grandes organizaciones, regulación, multi-tenancy.

### Industry Stack

Especializado para una industria. Incluye todas las mejores prácticas.

Ejemplos:

```
Restaurant Stack
Workshop Stack
Veterinary Stack
Municipality Stack
Healthcare Stack
Retail Stack
Logistics Stack
```

---

## Stack Composition

**Builder nunca instala componentes individuales. Instala un Stack.**

Después el usuario puede:

- ✅ Agregar una Capability
- ✅ Instalar un AI Pod adicional
- ✅ Activar un nuevo integrador
- ✅ Agregar un Workflow personalizado
- ✅ Cambiar el tema UI

Pero siempre **comenzando desde un Stack coherente**, no desde cero.

---

## Stack Templates

Un Stack puede tener variantes según tamaño / industria.

Ejemplo: Workshop Stack

```
Workshop Stack
├── Small       (taller de 1-5 técnicos)
├── Medium      (taller de 5-20 técnicos)
└── Enterprise  (multilocal, 100+ técnicos)
```

Cada variante:

- Instala las mismas Capabilities
- Pre-configura workflows diferentes
- Recomienda AI Pods distintos
- Sugiere integraciones específicas

---

## AI Pods

Cada Stack recomienda especialistas IA.

Ejemplo: Repair Stack

```
AI Pods
├── Repair Advisor       (ayuda con reparaciones)
├── Support Assistant    (soporte a clientes)
├── Finance Assistant    (gestión de cobros)
└── Inventory Assistant  (alertas de stock)
```

Cada Pod:

- Tiene un rol específico
- Accede solo a Capabilities necesarias
- Usa tools específicas (AR-011)
- Se comunica con Memory (AR-012)
- Participa en workflows inteligentes (AR-008)

---

## Deployment Profiles

Un Stack puede desplegarse en múltiples entornos:

```
Cloud           (SaaS, Vercel, AWS)
On Premise      (servidor del cliente)
Hybrid          (algunos datos on-premise, algunos cloud)
Edge            (dispositivos IoT + sincronización)
```

El Stack declara qué Capabilities funcionan en cada perfil.

Ejemplo: Healthcare Stack

```
deployments:
  cloud:
    - non-sensitive workflows
    - analytics
  on-premise:
    - patient records (compliance)
    - medical imaging
  edge:
    - appointment sync
    - offline prescriptions
```

---

## Integraciones

El Stack ya sabe qué conectores instalar y preconfigurar.

Ejemplo: Restaurant Stack

```
Integraciones
├── AFIP              (facturación fiscal)
├── Mercado Pago      (pagos)
├── WhatsApp          (pedidos)
└── Google Calendar   (reservas)
```

No hace falta que el usuario busque qué integrar: el Stack lo sabe.

---

## Policies (Roles, Permisos, Reglas)

Un Stack también instala **políticas de negocio** preconfiguradas.

Ejemplo: Repair Stack

```
policies:
  approval_rules:
    - repair_over: 10000
      requires: workshop_manager
    - repair_over: 50000
      requires: owner

  workflows:
    - name: repair-approval
      triggers_when: cost > 10000

  dashboards:
    - name: daily-revenue
      access: owner,manager
    - name: technician-productivity
      access: manager

  kpis:
    - avg-repair-time
    - customer-satisfaction
    - parts-inventory-turnover
```

---

## Knowledge Pack

Todo Stack incluye **conocimiento específico de la industria**.

```
knowledge_pack:
  industry: workshop
  
  playbooks:
    - "How to handle complex repairs"
    - "Customer retention strategies"
    - "Seasonal capacity planning"
  
  benchmarks:
    - "Average repair time by category"
    - "Customer satisfaction targets"
    - "Parts inventory best practices"
  
  templates:
    - "Repair quote template"
    - "Invoice template"
    - "Warranty certificate"
  
  faqs:
    - "How to use the repair estimation tool?"
    - "How to manage parts inventory?"
```

El usuario **no empieza desde cero**. Empieza con buenas prácticas validadas.

---

## Marketplace

El Marketplace deja de vender **aplicaciones monolíticas**.

Ahora vende:

- **Stacks** (soluciones completas)
- **Capabilities** (bloques reutilizables)
- **AI Pods** (especialistas IA)
- **Templates** (configuraciones)
- **Themes** (diseños UI)
- **Knowledge Packs** (industria-específico)

Cada uno se vende por separado o como parte de un Stack.

---

## The Architect

Cuando una empresa conversa con The Architect:

**No recomienda:** "Necesitas instalar Customers + Invoices + Payments + Notifications."

**Recomienda:** "Te recomiendo el Restaurant Stack porque ya trae todo pre-configurado para restaurantes."

**Y explica por qué:**

```
The Architect:
"Para una restaurante, el Stack recomendado es:
  - Restaurant Professional ($X/mes)
  - Incluye: Orders, Kitchen, POS, Payments, Inventory, Analytics
  - Pre-configurado con integraciones locales
  - Con conocimiento de mejores prácticas de la industria
  - Y AI Assistants para soporte y predicción de demanda"
```

---

## Builder

Builder toma un Stack y lo convierte en un proyecto ejecutable:

```
1. Stack seleccionado (Restaurant Stack)
   ↓
2. Capabilities expandidas (descomposición)
   ↓
3. Proyecto creado (estructura de carpetas)
   ↓
4. Código generado (por Builder agents)
   ↓
5. GitHub initializado (repo del cliente)
   ↓
6. Deploy configurado (cloud profile)
```

---

## Versionado

Cada Stack evoluciona sin romper proyectos existentes.

```
stack.yaml

version: 1.0.0   (original)
version: 1.1.0   (nuevas Capabilities, backward compatible)
version: 2.0.0   (breaking changes, cambios automáticos en proyectos)
```

Cuando un Stack se actualiza:

- ✅ Cambios automáticos (non-breaking) se aplican
- 🔔 Cambios breaking requieren confirmación
- 📜 Changelog documentado automáticamente
- 🧪 Tests corre antes de aplicar

---

## Health Score

Todo Stack posee un indicador holístico:

```
Architecture     (¿bien diseñado?)
Dependencies     (¿son estables?)
Security         (¿es seguro?)
AI Readiness     (¿funciona con IA?)
Documentation    (¿está documentado?)
Community Score  (¿se usa? ¿ratings?)
Compatibility    (¿compatible con versiones?)
───────────────────
Overall          (puntuación total 0-100)
```

Un Stack no se publica en el Marketplace si su Health < 70.

---

## API

```
GET    /stacks                           (lista todos)
GET    /stacks?industry=workshop         (filtrar por industria)
GET    /stacks/:id                       (detalles)
GET    /stacks/:id/manifest              (YAML crudo)
GET    /stacks/:id/capabilities          (qué trae)
GET    /stacks/:id/workflows             (procesos)
GET    /stacks/:id/health                (health score)
POST   /stacks/install                   (instalar en un proyecto)
POST   /stacks/:id/simulate              (simular costo + time-to-value)
PUT    /stacks/:id                       (actualizar manifest)
DELETE /stacks/:id/retire                (deprecar)
```

---

## Repository Structure

```
inteliar-spec/
├── stacks/
│   ├── fixly/
│   │   ├── stack.yaml
│   │   ├── manifest.md
│   │   ├── capabilities.yaml
│   │   ├── workflows.yaml
│   │   ├── ai-pods.yaml
│   │   ├── integrations.yaml
│   │   ├── policies.yaml
│   │   ├── knowledge-pack.yaml
│   │   └── deployment-profiles.yaml
│   ├── restaurant/
│   ├── retail/
│   └── municipality/
├── stack-registry.yaml
└── stack-health-report.json
```

---

## Definition of Done

Todo Stack debe incluir:

- ✅ Manifest válido (`stack.yaml`)
- ✅ Blueprint válido (todas las Capabilities cumplen AR-013)
- ✅ Workflow configuration completa
- ✅ AI Pods configurados
- ✅ Integrations documentadas
- ✅ Policies completas
- ✅ Knowledge Pack
- ✅ UI Theme (o uso de Default Design System)
- ✅ Deployment Profiles definidos
- ✅ Tests (Capability integration tests)
- ✅ Documentación completa
- ✅ Health Score ≥ 70
- ✅ Owner asignado
- ✅ Seguridad auditada

---

## 🚨 ADR-AR037 — El Stack es la unidad oficial de distribución

**Estado:** Accepted

Un Stack es la unidad de distribución oficial de Inteliar. No se venden Capabilities individuales; se venden Stacks.

Una empresa **instala un Stack**, no instala decenas de componentes manualmente.

---

## 🚨 ADR-AR038 — Descomposición completa

**Estado:** Accepted

Todo Stack debe poder descomponerse completamente en Capabilities.

No existe lógica oculta o propietaria en el Stack. Todo debe ser reutilizable.

Consecuencia: Un consultor puede coger un Stack existente, descomponerlo, reconfigurar sus Capabilities, y armar un Stack nuevo sin reinventar nada.

---

## ⭐ ADR-AR039 — Stack as Product

**Estado:** Accepted

El Stack es la unidad fundamental de posicionamiento de Inteliar en el mercado.

La competencia vende:

- Un ERP
- Un CRM
- Un POS
- Un software de taller

**Inteliar vende Stacks empresariales vivos.**

Cada Stack:

- ✅ Es una solución completa
- ✅ Está compuesto de Capabilities desacopladas (AR-022)
- ✅ Puede evolucionar sin reescribirse (AR-018)
- ✅ Porque está basado en Workflows (AR-008)
- ✅ Y orquestado por un Architect persistente (AR-016)
- ✅ Soportado por AI Pods (AR-011)
- ✅ Y memoria activa (AR-031)

---

*AR-015 — Stack Engine*
