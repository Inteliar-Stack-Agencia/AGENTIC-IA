# INTELIAR FOUNDATION
## BOML — Business Operating Modeling Language

**Versión:** 0.1  
**Estado:** Draft Standard  
**Objetivo:** Create a universal language for describing any business

---

## Executive Summary

Propusimos crear un **lenguaje universal** para describir cualquier empresa del mundo.

**BOML:** Business Operating Modeling Language

Así como existe:

- HTTP para la web
- SQL para bases de datos
- HTML para documentos
- OpenAPI para APIs
- BPMN para procesos

Inteliar propone **BOML** para empresas.

---

## El Problema Que Resuelve

Hoy una empresa existe repartida entre múltiples formatos:

- 📄 Documentos Word (narrativo)
- 📊 Hojas Excel (datos sin contexto)
- 🖼️ Diagramas Visio (estáticos)
- 💼 ERPs (fragmentado)
- 👥 CRMs (solo clientes)
- 📋 Manuales (procedimientos desactualizados)
- 🧠 Conocimiento de empleados (volátil)

**No existe un formato universal.**

BOML propone exactamente eso.

---

## La Visión

Así como HTML es el lenguaje universal de la web, y cualquier navegador lo entiende, **BOML sería el lenguaje universal de las empresas.**

Y cualquier herramienta lo podría leer:

```
Claude Code
    ↓
Cursor
    ↓
GitHub Copilot
    ↓
SAP, Odoo, ERPNext
    ↓
n8n, Make, Zapier
    ↓
Inteliar
```

Todos hablan BOML.

---

## Ejemplo Mínimo

```boml
# Workshop Operating Model
organization "Fixly Workshop"
  industry "Automotive Repair"
  size "Small"
  location "Buenos Aires"
  employees 25

# Que hacemos
capability CustomerManagement
  provides "Manage customer information and history"

capability RepairManagement
  provides "Execute repair workflows"

capability Inventory
  provides "Track parts and supplies"

capability Invoicing
  provides "Generate and track invoices"

# Como lo hacemos
workflow RepairFlow
  step 1: receive_device
  step 2: diagnose
  step 3: request_approval
    rule: IF cost > $500 THEN require_manager_approval
  step 4: repair
  step 5: quality_check
  step 6: invoice
  step 7: delivery

# Conexiones externas
integration WhatsApp
  for "Customer notifications"

integration MercadoPago
  for "Payment processing"

# IA
pod SupportPod
  agent Support
    responsibilities "Answer FAQs, schedule"
  agent Finance
    responsibilities "Track payments"

# Lo que importa
metric AverageRepairTime
  target "3 days"
  current "5 days"

metric CustomerSatisfaction
  target "95"
  current "78"

goal "Reduce repair time to 3 days"
goal "Increase customer satisfaction to 95"
```

---

## Características de BOML

### 1. Declarativo

**Nunca describe cómo.** Describe **qué existe.**

```boml
# Correcto: qué existe
capability Inventory
  provides "Manage parts"

# Incorrecto: cómo implementar
database Parts {
  id PRIMARY KEY
  name VARCHAR(100)
  ...
}
```

### 2. Ejecutable

- Builder puede leerlo y generar código
- Architect puede modificarlo y proponer mejoras
- Workflow Engine puede ejecutar los procesos
- Digital Twin puede simularlo

**No es solo documentación. Es un modelo vivo.**

### 3. Versionable

Git entiende BOML perfectamente.

```
v1.0   Original model
  ↓
v1.1   Added Analytics capability
  ↓
v1.2   Modified approval rules
  ↓
v2.0   Major redesign
```

### 4. Portable

Una empresa puede:

```
$ export-boml
→ workshop.boml

$ import-boml workshop.boml
→ Instantanea en otra plataforma
```

Sin lock-in. El modelo viaja.

### 5. Legible

Legible para:

- 👤 Humanos (directivos, propietarios)
- 🤖 IA (Claude, GPT, Architect)
- 💻 Máquinas (Builder, parsers)

---

## Componentes de BOML

```
Organization          (Identidad)
  ├── Metadata
  ├── Goals            (Qué quiere lograr)
  ├── Capabilities     (Qué sabe hacer)
  ├── Processes        (Cómo trabaja)
  ├── Rules            (Cómo decide)
  ├── Actors           (Quién lo hace)
  ├── Resources        (Qué tiene)
  ├── Data             (Qué information)
  ├── Integrations     (Qué conecta)
  ├── AI               (Cómo automatiza)
  ├── Metrics          (Cómo mide)
  └── Evolution        (Qué aprendió)
```

---

## Sintaxis de BOML

### Organization

```boml
organization "Name"
  industry "Industry"
  size "Small|Medium|Large|Enterprise"
  country "Country"
  employees 25
  locations 3
  website "url"
```

### Capability

```boml
capability CapabilityName
  describes "What this capability does"
  provides "Main outputs"
  requires [Dependency1, Dependency2]
  owned_by Department
  criticality "Critical|High|Medium|Low"
  pain_points
    - "Issue 1"
    - "Issue 2"
```

### Process

```boml
process ProcessName
  goal "What this process achieves"
  steps
    1: StepOne
       actor "Who"
       time "Expected duration"
    2: StepTwo
       actor "Who"
       condition "When"
       rule "Apply this rule"
    3: StepThree
       actor "Who"
       output "What comes out"
  sla "Constraint"
```

### Rule

```boml
rule ApprovalRule
  condition "repair_cost > 500"
  action "Require manager approval"
  consequence "Delays execution"
  exception "Owner can override"
```

### Metric

```boml
metric MetricName
  measures "What"
  target 95
  current 78
  unit "%"
  owner "Person"
  frequency "Weekly"
```

### Goal

```boml
goal GoalName
  target "Specific outcome"
  metric MetricName
  timeline "3 months"
  owner "Person"
  depends_on [Capability1, Capability2]
```

### AI Pod

```boml
pod PodName
  purpose "What it does"
  agents [Agent1, Agent2]
  responsibilities
    - "Task 1"
    - "Task 2"
  access_to [Capability1, Capability2]
  escalation_to "Human role"
```

---

## Validación de BOML

BOML tiene un schema JSON que valida:

- ✅ Sintaxis correcta
- ✅ Referencias válidas (no Capabilities fantasma)
- ✅ Dependencias resueltas
- ✅ Ciclos detectados
- ✅ Completitud (required fields)

```bash
$ validate workshop.boml
→ ✓ Valid BOML
→ 5 capabilities defined
→ 3 processes
→ 0 warnings
```

---

## Traducción de BOML

BOML se puede convertir a:

```
BOML
  ↓
Software (código, database, API)
  ↓
Documentation (process manual, training)
  ↓
Diagrams (flowcharts, org charts)
  ↓
Workflows (executable processes)
  ↓
Tests (validations)
  ↓
Anything
```

Porque BOML es la **source of truth**.

---

## El Marketplace de BOMLs

Si BOML es estándar:

Las empresas pueden publicar sus modelos:

```
Restaurant.boml     → Cualquier restaurante lo reutiliza
Workshop.boml       → Cualquier taller lo reutiliza
Retail.boml         → Cualquier retailer lo reutiliza
Healthcare.boml     → Cualquier clínica lo reutiliza
```

**Esto es conocimiento ejecutable.** No solo documentación.

---

## El Cambio Fundamental

### Hoy

```
Software → Empresa lo adapta
```

### Con BOML

```
Empresa describe su BOML
  → Herramientas lo leen
    → Software se genera
```

El BOML es central. No el software.

---

## Quién Usa BOML

### The Architect

Lee el BOML, propone mejoras.

```
"Tu repair workflow tiene un bottleneck aquí.
Sugiero agregar parallel processing."
```

### Builder

Lee el BOML, genera código.

```
$ builder create --from workshop.boml
→ Generated repo with all capabilities
```

### Stack Studio

Edita visualmente el BOML.

```
Drag capability → BOML actualizado automáticamente
```

### Claude Code

Interpreta BOML para decisiones.

```
"Based on this BOML, here's my implementation plan."
```

### Any Other Tool

Si implementa BOML parsing:

```
Zapier lee BOML → Genera automatizaciones
n8n lee BOML → Genera workflows
OpenAI interpreta BOML → Mejor contexto
```

---

## El Estándar Abierto: Open Business Model Initiative (OBMI)

La verdadera ambición es que BOML no sea propiedad de Inteliar.

Debería convertirse en un **estándar abierto.**

### Open Business Model Initiative (OBMI)

Una fundación/grupo de trabajo que mantiene:

- **BOML** — Business Operating Modeling Language
- **Capability Schema** — Estándar para capacidades
- **Process Schema** — Estándar para workflows
- **AI Pod Schema** — Estándar para agentes
- **Business Graph Schema** — Relaciones empresariales

### Participantes Potenciales

```
Inteliar (initiator)
  ↓
SAP, Odoo, ERPNext (ERP vendors)
  ↓
Zapier, Make, n8n (automation)
  ↓
GitHub, Figma (development tools)
  ↓
OpenAI, Anthropic (AI companies)
  ↓
Enterprise customers (implementers)
```

Todos contribuyen.

Todos se benefician.

---

## Por Qué Esto Es Estratégico

### Para Inteliar

```
En lugar de:
  "Vender software empresarial"

Podríamos:
  "Definir el lenguaje empresarial del futuro"
```

Eso es mucho más poderoso.

### Para el Ecosistema

Si BOML se convierte en estándar:

- AI entiende empresas mejor
- Herramientas interoperan automáticamente
- Empresas no quedan bloqueadas
- Knowledge se acumula globally

---

## La Visión de Largo Plazo

Año 2030:

```
Un desarrollador usa BOML cada día.
No necesariamente Inteliar.
Pero BOML.

Porque es el estándar.

Así como usan HTTP.
O HTML.
O SQL.
```

Inteliar no es solo Inteliar.

Es quien definió el lenguaje que todos usan.

---

## Conclusión

BOML es más que un formato.

Es una **reinvención** de cómo describimos empresas.

Y si tiene éxito, Inteliar no será recordada como "la plataforma".

Será recordada como **"quien definió el lenguaje del software empresarial."**

Exactamente lo que hizo:

- Tim Berners-Lee con HTTP
- Donald Knuth con algorithms
- Jean-Claude Lévy con XML
- Tony Hoare con compilers

---

*FOUNDATION — BOML Specification*
