# INTELIAR FOUNDATION
## BOM Specification — Business Operating Model

**Versión:** 1.0  
**Estado:** Canonical Model  
**Prioridad:** Máxima  
**Audiencia:** Architects, Builders, Developers, AI

---

## Objetivo

Definir el formato oficial que representa una organización dentro de Inteliar.

**Este documento reemplaza cualquier documento funcional tradicional.**

No existen PRDs.  
No existen BRDs.  
No existen relevamientos.  

Existe un **BOM**.

---

## Filosofía

Un BOM no describe software.

**Un BOM describe una empresa.**

Y cualquier representación puede generarse desde él:

- ✅ Software
- ✅ Documentación
- ✅ Organigrama
- ✅ Workflows
- ✅ APIs
- ✅ Capabilities
- ✅ KPIs
- ✅ Manuales de capacitación
- ✅ Simulaciones
- ✅ AI Pods
- ✅ Roadmaps técnicos
- ✅ Integraciones

**Todo sale del mismo modelo.**

---

## Anatomía del BOM

```yaml
BusinessOperatingModel:
  ├── Identity              (Quién eres)
  ├── Vision                (Qué quieres lograr)
  ├── Objectives            (Objetivos estratégicos)
  ├── BusinessModel         (Cómo ganas dinero)
  ├── Organization          (Cómo te organizas)
  ├── Capabilities          (Qué sabes hacer)
  ├── Processes             (Cómo trabajas)
  ├── Rules                 (Cómo tomas decisiones)
  ├── Data                  (Qué información administras)
  ├── Integrations          (Qué conectas)
  ├── AI                    (Cómo trabaja la IA)
  ├── Metrics               (Cómo mides éxito)
  ├── Roadmap               (Cómo quieres evolucionar)
  └── Evolution             (Qué aprendiste)
```

---

## 1. IDENTITY

**Quién es la organización.**

```yaml
identity:
  name: "Acme Repairs"
  industry: "Automotive Repair"
  country: "Argentina"
  region: "Buenos Aires"
  size: "Medium"               # Small, Medium, Large, Enterprise
  employees: 25
  locations: 3
  website: "www.acmerepairs.ar"
  founded: 2010
  description: "Taller de reparaciones automotrices especializado"
  
  legal:
    type: "SRL"               # Corporation type
    tax_id: "30-12345678-9"
    industry_code: "4520"     # ISIC code
```

---

## 2. VISION

**Qué quiere lograr la organización.**

```yaml
vision:
  purpose: |
    Ser el taller de confianza para reparaciones complejas
    en la región metropolitana.
    
  mission: |
    Proporcionar reparaciones de calidad con máxima transparencia
    al cliente y eficiencia operativa.
    
  strategic_vision: |
    En 5 años, ser referencia en la ciudad para reparaciones
    de transmisiones y motores.
    
  values:
    - name: "Confianza"
      description: "Transparencia total con el cliente"
    - name: "Calidad"
      description: "No aceptamos defectos"
    - name: "Eficiencia"
      description: "Máxima productividad"
```

---

## 3. OBJECTIVES

**Objetivos estratégicos y cómo medirlos.**

```yaml
objectives:
  - id: "revenue_growth"
    name: "Crecer ingresos 30% anual"
    metric: "ARR"
    target: 500000
    baseline: 380000
    timeline: "12 months"
    owner: "Owner"
    
  - id: "customer_satisfaction"
    name: "Alcanzar 95% satisfacción"
    metric: "NPS"
    target: 95
    baseline: 78
    timeline: "6 months"
    owner: "Operations Manager"
    
  - id: "automation"
    name: "Automatizar 60% de procesos administrativos"
    metric: "% de procesos automáticos"
    target: 60
    baseline: 20
    timeline: "12 months"
    owner: "Operations Manager"
```

---

## 4. BUSINESS MODEL

**Cómo gana dinero.**

```yaml
business_model:
  revenue_streams:
    - name: "Labor"
      description: "Mano de obra por reparación"
      unit: "Hora"
      price: 150
      volume_model: "Variable"
      
    - name: "Parts Markup"
      description: "Margen sobre repuestos"
      percentage: 25
      
    - name: "Diagnostics"
      description: "Fee de diagnóstico"
      fixed: 5000
      waived_if: "Se realiza reparación"
  
  channels:
    - name: "Walk-in"
      description: "Clientes que llegan al taller"
      contribution: 60
      
    - name: "Referrals"
      description: "Recomendaciones"
      contribution: 30
      
    - name: "Insurance"
      description: "Por compañías de seguros"
      contribution: 10
  
  customer_segments:
    - name: "Individual"
      percentage: 70
      avg_ticket: 8000
      frequency: "2-3 veces año"
      
    - name: "Fleet"
      percentage: 20
      avg_ticket: 50000
      frequency: "Monthly"
      
    - name: "Insurance"
      percentage: 10
      avg_ticket: 15000
      frequency: "Variable"
```

---

## 5. ORGANIZATION

**Cómo está organizada.**

```yaml
organization:
  departments:
    - name: "Operations"
      manager: "Juan"
      purpose: "Ejecutar reparaciones"
      teams:
        - name: "Technicians"
          size: 15
          skills:
            - "Transmissions"
            - "Engines"
            - "Electrical"
            
        - name: "Reception"
          size: 2
          skills:
            - "Customer service"
            - "Scheduling"
    
    - name: "Management"
      manager: "Owner"
      purpose: "Dirección y estrategia"
      teams:
        - name: "Admin"
          size: 2
          responsibilities:
            - "Billing"
            - "HR"
            - "Compliance"
    
    - name: "Sales"
      manager: "Carlos"
      purpose: "Atraer clientes"
      teams:
        - name: "Sales Team"
          size: 2
          channels:
            - "Corporate relationships"
            - "Insurance partnerships"
```

---

## 6. CAPABILITIES

**Qué sabe hacer la organización.**

No son módulos de software. Son **capacidades empresariales**.

```yaml
capabilities:
  - id: "customer_management"
    name: "Customer Management"
    description: "Gestionar información de clientes"
    owned_by: "Operations"
    critical: true
    current_tool: "WhatsApp + Spreadsheet"
    pain_points:
      - "No hay historial"
      - "No se rastrea comunicación"
      - "Datos inconsistentes"
    
  - id: "repair_management"
    name: "Repair Management"
    description: "Gestionar reparaciones de inicio a fin"
    owned_by: "Operations"
    critical: true
    workflow:
      - "Reception: intake form"
      - "Tech: diagnosis"
      - "Manager: approval"
      - "Tech: repair"
      - "QA: test"
      - "Billing: invoice"
    
  - id: "inventory"
    name: "Inventory Management"
    description: "Gestionar repuestos y materiales"
    owned_by: "Operations"
    critical: true
    current_tool: "Manual spreadsheet"
    pain_points:
      - "Ruptura de stock frecuente"
      - "No hay previsiones"
      - "Compras sin orden"
    
  - id: "billing"
    name: "Billing & Payments"
    description: "Facturación y cobros"
    owned_by: "Admin"
    critical: true
    current_tool: "Manual + Mercado Pago"
    pain_points:
      - "Demoras en cobro"
      - "Sin seguimiento de mora"
      - "Sin automatización"
    
  - id: "analytics"
    name: "Analytics & Reporting"
    description: "Reporte de desempeño"
    owned_by: "Management"
    critical: false
    current_tool: "Manual queries"
    needs:
      - "Revenue por técnico"
      - "Productivity metrics"
      - "Customer satisfaction trending"
```

---

## 7. PROCESSES

**Cómo trabaja la organización.**

No son procesos de TI. Son **procesos empresariales**.

```yaml
processes:
  - id: "repair_flow"
    name: "Repair Process"
    description: "De cliente que llega a cliente que se va"
    steps:
      1. Customer arrives
         actor: "Reception"
         input: "Vehicle + problem description"
      
      2. Create intake form
         actor: "Reception"
         tool: "Form"
         output: "Repair ticket"
      
      3. Diagnosis
         actor: "Technician"
         time: "2-4 hours"
         output: "Diagnosis report"
      
      4. Quote approval
         actor: "Manager"
         rule: "If cost > $5000 require customer approval"
         output: "Quote"
      
      5. Repair
         actor: "Technician"
         time: "Variable"
         output: "Repaired vehicle"
      
      6. QA testing
         actor: "QA Tech"
         verification: "Vehicle functions correctly"
         output: "QA pass/fail"
      
      7. Billing
         actor: "Admin"
         input: "Labor + parts + overhead"
         output: "Invoice"
      
      8. Payment
         actor: "Customer"
         methods: "Cash, Card, Transfer"
         output: "Receipt"
    
    sla:
      - "Diagnosis: 4 hours from intake"
      - "Repair: 3 days from approval"
      - "Customer notified: Daily updates"
    
    bottlenecks:
      - "Diagnosis takes too long (manual)"
      - "Approval requires owner (always absent)"
      - "No predictable timeline"
      - "Parts waiting (no tracking)"
```

---

## 8. RULES

**Cómo toma decisiones la organización.**

Reglas operacionales y políticas.

```yaml
rules:
  approval_rules:
    - rule_id: "approval_1000"
      when: "Repair cost > $1000"
      then: "Require customer verbal/written approval"
      owner: "Manager"
      
    - rule_id: "approval_5000"
      when: "Repair cost > $5000"
      then: "Require customer approval + owner sign-off"
      owner: "Owner"
      
    - rule_id: "warranty"
      when: "Repair completed"
      then: "Provide 3-month warranty on labor"
      
  pricing_rules:
    - rule_id: "discount_fleet"
      when: "Customer is fleet (monthly volume > $30k)"
      then: "Apply 15% discount on labor"
      
    - rule_id: "parts_margin"
      when: "Parts purchased"
      then: "Add 25% markup"
  
  availability_rules:
    - rule_id: "holiday_closed"
      when: "Argentine holidays"
      then: "Closed (no appointments)"
      
    - rule_id: "hours_open"
      monday_to_friday: "08:00-18:00"
      saturday: "09:00-13:00"
      sunday: "Closed"
```

---

## 9. DATA

**Qué información administra la organización.**

Conceptos, no tablas de base de datos.

```yaml
data_entities:
  - name: "Customer"
    attributes:
      - name: phone
      - name: email
      - name: address
      - name: vehicle_make
      - name: vehicle_model
      - name: vehicle_plate
      - name: repair_history
      - name: credit_limit
    source_of_truth: "Repair tickets"
    
  - name: "Repair"
    attributes:
      - name: intake_date
      - name: vehicle
      - name: problem_description
      - name: diagnosis
      - name: estimated_cost
      - name: actual_cost
      - name: technician_assigned
      - name: start_date
      - name: completion_date
      - name: parts_used
      - name: labor_hours
      - name: invoice_number
    
  - name: "Invoice"
    attributes:
      - name: invoice_number
      - name: repair_id
      - name: customer
      - name: amount
      - name: due_date
      - name: payment_date
      - name: payment_method
      - name: status
    
  - name: "Parts"
    attributes:
      - name: part_name
      - name: supplier
      - name: cost
      - name: selling_price
      - name: stock_quantity
      - name: reorder_point
      - name: last_purchase_date
    
  - name: "Technician"
    attributes:
      - name: name
      - name: skills
      - name: hourly_rate
      - name: availability
      - name: repairs_completed
      - name: quality_score
```

---

## 10. INTEGRATIONS

**Qué necesita conectar con sistemas externos.**

```yaml
integrations:
  - system: "WhatsApp"
    purpose: "Customer communication"
    flow: "Repair status updates"
    frequency: "Real-time"
    criticality: "High"
    
  - system: "Mercado Pago"
    purpose: "Payment processing"
    flow: "Invoice → Payment collection"
    frequency: "On-demand"
    criticality: "High"
    
  - system: "AFIP"
    purpose: "Tax compliance"
    flow: "Invoice generation → Tax reporting"
    frequency: "Monthly"
    criticality: "Critical"
    
  - system: "Google Calendar"
    purpose: "Appointment scheduling"
    flow: "Repair booking → Calendar"
    frequency: "Real-time"
    criticality: "Medium"
    
  - system: "Shopify (future)"
    purpose: "Parts e-commerce"
    flow: "Customer orders parts online"
    frequency: "On-demand"
    criticality: "Low"
```

---

## 11. AI

**Cómo trabaja la IA en la organización.**

```yaml
ai_pods:
  - name: "Support Pod"
    description: "Ayuda a clientes"
    responsibilities:
      - "Answer FAQs"
      - "Schedule appointments"
      - "Provide repair updates"
    access_to:
      - "Customer data"
      - "Repair status"
      - "FAQ knowledge base"
    escalation: "To reception human"
    
  - name: "Operations Pod"
    description: "Optimiza operaciones"
    responsibilities:
      - "Diagnose problems (suggest solutions)"
      - "Predict repair duration"
      - "Recommend parts needed"
      - "Optimize technician assignment"
    access_to:
      - "Repair history"
      - "Technician skills"
      - "Parts availability"
      - "Vehicle databases"
    escalation: "To technician for final decision"
    
  - name: "Finance Pod"
    description: "Gestiona finanzas"
    responsibilities:
      - "Track receivables"
      - "Predict cash flow"
      - "Optimize pricing"
      - "Identify non-paying customers"
    access_to:
      - "Invoice data"
      - "Payment history"
      - "Cost data"
    escalation: "To owner for decisions"
```

---

## 12. METRICS

**Cómo mide la organización su éxito.**

```yaml
metrics:
  operational:
    - name: "Repairs completed per month"
      target: 80
      current: 65
      owner: "Operations Manager"
      
    - name: "Average time to repair"
      target: "3 days"
      current: "5 days"
      owner: "Operations Manager"
      
    - name: "First-time-fix rate"
      target: 95%
      current: 88%
      owner: "Lead Technician"
      
    - name: "Technician utilization"
      target: 85%
      current: 72%
      owner: "Operations Manager"
  
  financial:
    - name: "Monthly revenue"
      target: 40000
      current: 32000
      owner: "Owner"
      
    - name: "Gross margin"
      target: 60%
      current: 52%
      owner: "Owner"
      
    - name: "Days sales outstanding (DSO)"
      target: 15
      current: 35
      owner: "Admin"
      
    - name: "Customer lifetime value"
      target: 50000
      current: 32000
      owner: "Owner"
  
  customer:
    - name: "NPS (Net Promoter Score)"
      target: 80
      current: 65
      owner: "Operations Manager"
      
    - name: "Customer retention rate"
      target: 85%
      current: 72%
      owner: "Owner"
      
    - name: "Repeat customer %"
      target: 70%
      current: 55%
      owner: "Operations Manager"
```

---

## 13. ROADMAP

**Cómo quiere evolucionar la organización.**

```yaml
roadmap:
  quarter_1:
    - objective: "Reduce diagnosis time by 50%"
      initiative: "Implement repair management system"
      owner: "Operations Manager"
      success_metric: "Diagnosis < 2 hours"
      
    - objective: "Improve payment collection"
      initiative: "Implement automated invoicing and reminders"
      owner: "Admin"
      success_metric: "DSO < 20 days"
  
  quarter_2_3:
    - objective: "Launch online booking"
      initiative: "Build customer portal"
      owner: "Owner"
      success_metric: "30% of bookings online"
      
    - objective: "Expand fleet business"
      initiative: "Implement fleet management features"
      owner: "Sales"
      success_metric: "$50k MRR from fleet"
  
  year_2:
    - objective: "Open second location"
      initiative: "Replicate model to new location"
      owner: "Owner"
      success_metric: "New location at 80% capacity"
```

---

## 14. EVOLUTION

**Qué aprendió la organización, qué cambió, qué descartó.**

```yaml
evolution:
  version: 1
  created_date: "2025-01-15"
  
  changes:
    - date: "2025-01-20"
      version: 1.1
      change: "Added Analytics Capability"
      reason: "Need better visibility into operations"
      impact: "Can now track KPIs daily"
      
    - date: "2025-02-10"
      version: 1.2
      change: "Modified approval rule (cost > $3000)"
      reason: "Too many approvals blocking flow"
      impact: "Faster decision making"
      
    - date: "2025-03-01"
      version: 1.3
      change: "Integrated WhatsApp for customer updates"
      reason: "Customers expect instant communication"
      impact: "NPS increased 10 points"
  
  lessons_learned:
    - lesson: "Manual processes don't scale"
      date: "2025-02-01"
      
    - lesson: "Customer communication is critical"
      date: "2025-02-28"
      
    - lesson: "Technician skills vary widely"
      date: "2025-03-15"
  
  future_considerations:
    - "Need predictive maintenance for repeat customers"
    - "Could offer preventive service packages"
    - "Mobile app for technicians would improve efficiency"
```

---

## El BOM es Ejecutable

El BOM no es un documento estático.

**Es un modelo ejecutable.**

### Builder puede leer el BOM

Y generar:

```
- Base de datos (desde Data entities)
- APIs (desde Capabilities)
- Workflows (desde Processes)
- UI (desde Capabilities)
- Business logic (desde Rules)
```

### The Architect puede modificar el BOM

```
- Suggest process optimizations
- Recommend new Capabilities
- Identify bottlenecks
- Propose integrations
```

### Digital Twin puede simular el BOM

```
- "What if we double technicians?"
- "What if we extend hours?"
- "What if we add new service line?"
```

### Workflow Engine ejecuta el BOM

Los procesos definidos se convierten en workflows automáticos.

---

## El BOM Tiene Versiones

No es inmutable.

```yaml
v1.0    # Initial model
   ↓
v1.1    # Added Analytics Capability
   ↓
v1.2    # Modified approval rules
   ↓
v1.3    # Integrated WhatsApp
   ↓
v2.0    # Major redesign (new process)
```

Cada versión es auditable.

---

## El BOM Vive en Git

El BOM es un archivo YAML versionado en Git.

```
github.com/customer/workshop/.inteliar/
├── bom.yaml              # El BOM oficial
├── bom.schema.json       # Validación
├── bom.history/
│   ├── v1.0.yaml
│   ├── v1.1.yaml
│   ├── v1.2.yaml
│   └── v1.3.yaml
└── generated/             # Salidas generadas
    ├── software/
    ├── documentation/
    ├── workflows/
    └── capabilities/
```

---

## El BOM es el Activo Principal

**No el código.**  
**No la aplicación.**  
**No el Stack.**

El cliente se lleva el BOM.

Si cambia de proveedor: se lleva su modelo completo.

Sin lock-in. Solo el modelo vive en Inteliar (Knowledge Engine).

---

## El BOM Reemplaza Documentación Tradicional

Ya no necesitas:

- ❌ PRD (Product Requirements Document)
- ❌ BRD (Business Requirements Document)
- ❌ Functional Specification
- ❌ Technical Architecture Document
- ❌ Deployment Plan
- ❌ Runbook

**Todo está en el BOM.**

---

## Conclusión

El BOM es el corazón de Inteliar.

- Es el primer artefacto
- Es el central artefacto
- Es el artefacto que permanece

Todo lo demás se genera desde él.

**Un BOM bien construido es el activo digital más valioso de una empresa.**

---

*FOUNDATION — BOM Specification*
