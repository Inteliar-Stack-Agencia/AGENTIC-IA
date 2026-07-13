# INTELIAR ARCHITECTURE REFERENCE
## AR-016 — Stack Studio

**Versión:** 1.0 · **Estado:** Strategic Product · **Prioridad:** P0 (Estratégico)

---

## Objetivo

Construir el entorno oficial de diseño, composición y publicación de soluciones sobre Inteliar.

**Stack Studio es el lugar donde nacen todos los productos.**

No importa si son creados por:

- Inteliar
- Partners
- Empresas
- Desarrolladores
- IA

Todo comienza aquí.

---

## Filosofía

**Hoy construir software significa escribir código.**

**Stack Studio propone otra idea: construir software significa tomar decisiones.**

El código es una consecuencia, no el punto de partida.

---

## El nuevo flujo de desarrollo

### Antes (Modelo tradicional)

```
Idea
  ↓
Programador escribe código
  ↓
Sistema se construye
```

### Con Inteliar (Modelo de diseño empresarial)

```
Idea empresarial
  ↓
Architect toma decisiones
  ↓
Capabilities se seleccionan
  ↓
Stack se compone
  ↓
Builder genera código
  ↓
Sistema se despliega
```

**El código aparece al final, no al principio.**

---

## Dos modos de operación

Stack Studio posee dos interfaces. El usuario alterna automáticamente entre ellas.

### Modo 1: Business Mode

Para personas que **no programan**.

Interfaz minimal:

```
╔════════════════════════════════════════════╗
║                                            ║
║           Hola 👋                          ║
║                                            ║
║       Soy The Architect.                   ║
║                                            ║
║   Cuéntame sobre tu empresa.               ║
║   ¿En qué te puedo ayudar?                 ║
║                                            ║
║   [Entrada de texto libre]                 ║
║                                            ║
╚════════════════════════════════════════════╝
```

**Nada más.** No hay:

- Dashboard
- Menús
- Módulos
- CRM
- ERP
- Diagramas

Solo **conversación**.

Durante esa conversación, The Architect descubre:

- Industria
- Tamaño de la empresa
- Procesos clave
- Problemas específicos
- Objetivos a corto/largo plazo
- Herramientas actuales
- Presupuesto
- Prioridades

Cuando termina, The Architect construye automáticamente:

```
Tu empresa necesita:

✔ Customer Management
✔ Sales
✔ Inventory
✔ Invoices
✔ WhatsApp Integration
✔ Analytics
✔ Repair Management
```

Y pregunta:

```
¿Querés que armemos este Stack?
```

El usuario **nunca tuvo que saber qué era una Capability.**

### Modo 2: Studio Mode

Para desarrolladores, partners, agencias, equipos internos.

Interfaz técnica completa:

```
┌─────────────────────────────────────┐
│  Capability Explorer                │
│  Workflow Designer                  │
│  AI Pod Designer                    │
│  Marketplace                        │
│  GitHub Integration                 │
│  Deploy                             │
│  Observability                      │
└─────────────────────────────────────┘
```

Aquí aparece toda la complejidad:

- Grafo de Capabilities
- Workflow BPMN visual
- Conexión de AI Pods
- Integración Git
- Deployment pipelines
- Monitoring

---

## Cambio automático de modo

Si el usuario demuestra **conocimiento técnico**:

- Comienza en Business Mode
- Usa lenguaje empresarial correctamente
- Entiende Capabilities y Workflows
- Accede a opciones avanzadas

**The Architect cambia automáticamente a Studio Mode.**

Nunca pregunta. Detecta automáticamente.

---

## Capability Explorer

El corazón de Stack Studio.

```
┌─────────────────────────────────────┐
│  Buscar Capability                  │
│    ↓                                │
│  Arrastrar a Canvas                 │
│    ↓                                │
│  Conectar con otras                 │
│    ↓                                │
│  Configurar                         │
│    ↓                                │
│  Simular                            │
│    ↓                                │
│  Deploy                             │
└─────────────────────────────────────┘
```

**No se arrastran pantallas. Se arrastran Capabilities.**

El Capability Explorer:

- ✅ Busca por nombre, industria, tags
- ✅ Muestra dependencias automáticamente
- ✅ Detecta conflictos
- ✅ Sugiere complementos (si arrastras "Sales", sugiere "Customers")
- ✅ Permite drag-and-drop
- ✅ Previsualiza configuración

---

## Stack Canvas

El proyecto completo se visualiza como un **grafo de Capabilities**.

```
┌─────────────┐
│ Customers   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│   Sales     │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Invoices   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Payments   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Analytics   │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Knowledge   │
└─────────────┘
```

Todo conectado.

Cada conexión:

- ✅ Valida que los eventos existan
- ✅ Detecta incompatibilidades de versión
- ✅ Sugiere transformaciones de datos
- ✅ Es editable (puedes crear sub-workflows)

---

## Workflow Designer

No usa BPMN tradicional (diagramas de cajas complejos).

Usa **lenguaje empresarial visual**.

Ejemplo: Repair Workflow

```
CUANDO
  ↓
Una reparación entra
  ↓
LUEGO
  ↓
Asignar técnico disponible
  ↓
ESPERAR
  ↓
Diagnóstico completado
  ↓
PEDIR
  ↓
Aprobación del cliente (si > $1000)
  ↓
FACTURAR
  ↓
Notificar al cliente
```

**Puede editarse:**

- 🖱️ Visualmente (drag-and-drop)
- 💬 Conversando ("Agrega una aprobación cuando el costo sea > $1000")
- 📝 En YAML (para desarrolladores)

---

## AI Pod Designer

Nueva capacidad: diseñar especialistas IA visualmente.

```
┌──────────────────┐
│ Support Pod      │
├──────────────────┤
│ Support Agent    │────┐
│                  │    │
└──────────────────┘    │
                        │
┌──────────────────┐    │
│ Knowledge        │◄───┤  Sources
│ Base             │    │
└──────────────────┘    │
                        │
┌──────────────────┐    │
│ CRM              │◄───┤
│ Integration      │    │
└──────────────────┘    │
                        │
┌──────────────────┐    │
│ WhatsApp         │◄───┤
│ Channel          │    │
└──────────────────┘    │
                        │
┌──────────────────┐    │
│ Escalamiento     │◄───┤
│ Humano           │    │
└──────────────────┘    │
```

El AI Pod Designer permite:

- ✅ Seleccionar Capabilities como fuentes (Knowledge, CRM, etc.)
- ✅ Definir el rol del Pod ("Support Agent", "Finance Assistant")
- ✅ Especificar canales de entrada/salida
- ✅ Configurar escalamiento humano
- ✅ Testear conversaciones
- ✅ Estimar tokens/costos

---

## Cost Simulator

Antes de crear un Stack, responde:

```
┌─────────────────────────────┐
│  Infraestructura            │
│  USD 14/mes                 │
│                             │
│  IA (tokens)                │
│  USD 8/mes                  │
│                             │
│  Storage                    │
│  USD 2/mes                  │
├─────────────────────────────┤
│  TOTAL                      │
│  USD 24/mes                 │
└─────────────────────────────┘
```

Todo estimado, no exacto. Incluye:

- 🖥️ Compute (Cloud, Container, Edge)
- 🧠 IA (tokens × modelo × volumen)
- 💾 Storage (base de datos, archivos, vectores)
- 🌐 Bandwidth
- 📊 Observabilidad

---

## Evolution Simulator

Función estratégica: pregunta al futuro.

```
¿Qué pasa si dentro de un año
duplico mis clientes?

Builder responde:
├── Capabilities a escalar
├── Infrastructure changes
├── Cost increase
├── Performance risks
└── Recommendations
```

Permite planificar:

- Crecimiento esperado
- Cambios de tecnología
- Nuevas Capabilities
- Migraciones

---

## Git Integration

Todo cambio en Stack Studio genera:

- ✅ Commit automático
- ✅ Branch por feature
- ✅ Pull Request con descripción automática
- ✅ Release tags

**Nunca modifica código directamente.** Todo vive en Git del cliente.

Ejemplo:

```
Agregué Inventory → Commit creado
Cambié workflow → Commit creado
Instalé AI Pod → Commit creado
Cambié políticas → Commit creado
```

---

## Claude Mode

Integración fuerte: Claude Code puede abrir Stack Studio como una herramienta (no como chat).

Claude Code puede:

```
Mostrar Capabilities del proyecto
  ↓
Modificar configuración
  ↓
Commit cambios
  ↓
Actualizar documentación
  ↓
Deployar
```

Todo automáticamente.

Ejemplo uso:

```
Usuario: "Claude, agrega Notifications a este Stack"
Claude Code:
  1. Abre Stack Studio
  2. Explorer busca Notifications
  3. Arrastrar a Canvas
  4. Conectar a Customers
  5. Guardar YAML
  6. Commit "Add Notifications capability"
  7. Actualiza README
  8. Responde al usuario con cambios
```

---

## Preview

Cada cambio genera un **Preview en segundos**.

```
Cambio: Agregar Inventory
  ↓
Procesar Blueprint
  ↓
Generar código
  ↓
Instanciar contenedor
  ↓
Deploy demo
  ↓
URL preview disponible
```

El usuario puede testear sin deployar.

---

## Design System

Toda UI del Stack utiliza el **mismo Design System**.

- ✅ Componentes consistentes
- ✅ Temas preconfigurados
- ✅ Responsive automático
- ✅ Accesibilidad validada

Nunca componentes aislados o CSS custom.

---

## Marketplace Integration

Desde Stack Studio, se puede:

- ✅ Instalar nuevas Capabilities
- ✅ Actualizar versiones
- ✅ Comprar AI Pods
- ✅ Agregar Integraciones
- ✅ Publicar el Stack terminado
- ✅ Ver ratings y reviews

---

## Collaboration

Múltiples personas trabajan sobre el mismo Stack:

- ✅ Comments en Capabilities
- ✅ Versiones de cambios
- ✅ Branches paralelos
- ✅ Code review integrado
- ✅ Merge automático de cambios no conflictivos

---

## Explain

Toda decisión arquitectónica puede explicarse:

```
Usuario: ¿Por qué agregaste Inventory?

Builder responde:
Porque:
  - Repair Management depende de Stock
    para conocer disponibilidad de repuestos
  - Logistics depende de Inventory
    para optimizar entregas
  - Analytics lo necesita para reportes
    de rotación
```

---

## Doctor

Analiza automáticamente la arquitectura completa:

```
Doctor diagnostica:
├── Architecture
│   └── "Well designed, no issues"
├── Dependencies
│   └── "All pinned, all stable"
├── Performance
│   └── "P95 < 200ms, OK"
├── Security
│   └── "2 vulnerabilities in PostgreSQL"
├── Cost
│   └── "Can optimize by 30%"
├── IA Readiness
│   └── "All events properly modeled"
└── Recommendations
    ├── "Upgrade PostgreSQL"
    ├── "Add caching layer"
    └── "Consider Workers Edge"
```

---

## Timeline

Toda evolución queda registrada:

```
v1.0 — Initial Stack
      Customers, Sales, Invoices

v1.1 — Add WhatsApp
      Customer Communication

v1.2 — Add Inventory
      Operations Visibility

v2.0 — AI Suite
      Predictions, Recommendations, Support Pod

v2.1 — Advanced Analytics
      BI, Forecasting, KPIs

v3.0 — Multi-location
      Multi-tenant, headquarters sync
```

---

## API

```
POST   /studio/project                (crear nuevo proyecto)
POST   /studio/project/:id/simulate    (simular costo/evolución)
POST   /studio/project/:id/deploy      (deployar a producción)
POST   /studio/project/:id/explain     (explicar una decisión)
POST   /studio/project/:id/preview     (generar preview)
GET    /studio/project/:id             (detalles)
GET    /studio/project/:id/history     (timeline)
PUT    /studio/project/:id/capabilities (actualizar Stack)
```

---

## Stack de Tecnología

```
Frontend
  Next.js 14
  React 19
  React Flow (para grafos)
  Monaco Editor (para YAML)
  TipTap (para texto colaborativo)
  Framer Motion (animaciones)

Backend
  NestJS
  PostgreSQL
  Redis
  GitHub API

Infrastructure
  Cloudflare Workers (preview)
  Vercel (frontend)
  AWS ECS (backend)
```

---

## Repository

```
apps/
└── stack-studio/
    ├── web/              (Next.js frontend)
    ├── api/              (NestJS backend)
    ├── components/       (React components)
    └── lib/
```

---

## Definition of Done

Stack Studio es producción-ready cuando incluye:

- ✅ Business Mode (conversacional)
- ✅ Studio Mode (técnico)
- ✅ Capability Explorer (drag-and-drop)
- ✅ Workflow Designer (visual + conversacional)
- ✅ AI Pod Designer (visual composition)
- ✅ Stack Canvas (grafo interactivo)
- ✅ Cost Simulator
- ✅ Evolution Simulator
- ✅ Git Integration (commits automáticos)
- ✅ Marketplace Integration
- ✅ Claude Code Integration
- ✅ Explain Mode
- ✅ Doctor (diagnostics)
- ✅ Preview (en vivo)
- ✅ Collaboration (múltiples usuarios)
- ✅ Timeline (historial)
- ✅ Tests (E2E, integration)
- ✅ Documentación

---

## 🚨 ADR-AR040 — Dual Interface Requirement

**Estado:** Accepted

Toda solución construida en Inteliar debe poder editarse tanto de forma:

- 💬 Conversacional (lenguaje natural)
- 🖱️ Visual (drag-and-drop, diagramas)

Nunca obligar al usuario a utilizar una única interfaz.

---

## 🚨 ADR-AR041 — Mode Abstraction

**Estado:** Accepted

Business Mode y Studio Mode son **dos vistas del mismo proyecto**, no proyectos distintos.

El usuario alterna entre niveles de abstracción, pero todos se comunican con el mismo modelo subyacente.

Consecuencia: Un cambio hecho en Business Mode aparece automáticamente en Studio Mode. No hay "sincronización"—son el mismo objeto.

---

## ⭐ ADR-AR042 — Inteliar is the Business Design Platform

**Estado:** Accepted

**Esta es la decisión más importante de todo el proyecto.**

Inteliar **no es:**

- ❌ Un framework de desarrollo
- ❌ Un SaaS Builder genérico
- ❌ Un ERP modular
- ❌ Un Marketplace de integraciónes
- ❌ Un workflow engine

Inteliar **es:**

- ✅ **Una Business Design Platform**

Una plataforma donde:

- Diseñar una empresa
- Diseñar su software
- Diseñar su operación
- Diseñar su futuro

Pasan a ser **exactamente el mismo proceso**.

El usuario **no piensa en tecnología.** Piensa en negocio.

The Architect traduce negocio a Capabilities.
Builder traduce Capabilities a código.
Stack Studio traduce decisiones a software ejecutable.

---

## Analogía: Figma del Software Empresarial

Figma revolucionó el diseño de interfaces porque:

- **No pregunta:** "¿Cómo programas un botón?"
- **Pregunta:** "¿Qué quieres diseñar?"

Inteliar hace exactamente lo mismo:

- **No pregunta:** "¿Qué framework usas? ¿Qué ORM? ¿Qué BD?"
- **Pregunta:** "¿Qué empresa quieres construir?"

A partir de esa respuesta:

1. The Architect diseña (conversación Discover)
2. El Digital Twin modela (representación viva)
3. El Knowledge Engine aporta (experiencia del ecosistema)
4. Builder genera (código automático)
5. Stack Studio permite editar (interfaz dual)
6. AI Runtime ejecuta (orquestación de IA)
7. Workflow Engine opera (procesos empresariales)
8. Marketplace distribuye (economía)

**Un ecosistema cerrado donde negocio y software son la misma cosa.**

---

*AR-016 — Stack Studio*
