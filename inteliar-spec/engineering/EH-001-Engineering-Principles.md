# INTELIAR ENGINEERING HANDBOOK
## EH-001 — Engineering Principles

**Versión:** 1.0 · **Estado:** Mandatory · **Aplica a:** Humanos, Claude Code, AI Pods, Partners

---

## Introducción

Este documento define los **principios fundamentales de ingeniería de Inteliar**.

**Toda decisión técnica debe poder justificarse utilizando estos principios.**

Si una implementación contradice alguno de ellos, la implementación está equivocada. No el principio.

---

## PRINCIPIO 1 — Business First

**Todo desarrollo comienza por un problema de negocio. Nunca por una tecnología.**

### ❌ Incorrecto
"Vamos a usar React 19 con suspense."

### ✅ Correcto
"Un taller necesita generar presupuestos 80% más rápido. Usamos React porque la interfaz debe ser interactiva en tiempo real."

---

## PRINCIPIO 2 — Capability First

**Toda nueva funcionalidad pertenece a una Capability. Nunca a una aplicación, pantalla o microservicio.**

### Pregunta obligatoria
¿Qué Capability representa esto?

### ❌ Incorrecto
"Agregar un dashboard."

### ✅ Correcto
"Agregar Analytics Capability con reportes de repairs completados por técnico."

---

## PRINCIPIO 3 — Reuse Before Create

**Antes de crear código nuevo, Builder y Claude Code deben responder: ¿Existe algo reutilizable?**

### Orden obligatorio
1. ✅ Reutilizar
2. ✅ Extender
3. ✅ Componer
4. ✅ Crear (último recurso)

**Nunca al revés.**

---

## PRINCIPIO 4 — Event Driven

**Toda acción importante genera eventos. Nunca cambios silenciosos.**

### ❌ Incorrecto
```javascript
customer.update({ name: 'Nuevo nombre' });
// Nadie se entera
```

### ✅ Correcto
```javascript
customer.update({ name: 'Nuevo nombre' });
// Event: CustomerUpdated emitido
// Otros servicios reaccionan automáticamente
```

---

## PRINCIPIO 5 — Explain Everything

**Toda decisión importante debe poder explicarse.**

### ❌ Incorrecto
"Se eligió PostgreSQL."

### ✅ Correcto
"Se eligió PostgreSQL porque necesitamos consistencia transaccional ACID, soporte para consultas complejas de reportes, y relaciones entre tablas que son fundamentales para el Digital Twin."

Builder debe poder explicar **por qué** se eligió cada tecnología, cada Capability, cada integración.

---

## PRINCIPIO 6 — AI Native

**La IA no es un agregado.**

### Pregunta obligatoria
Para toda Capability:

- ¿Qué herramientas expone?
- ¿Qué contexto necesita?
- ¿Qué tareas puede delegar?

Si no puede responder: **la Capability no está terminada.**

---

## PRINCIPIO 7 — Human Override

**Toda decisión importante puede ser revisada por un humano.**

Nunca IA sin supervisión cuando exista impacto económico, legal o estratégico.

### Ejemplo
- ✅ IA genera propuesta de precio → Revisión humana → Se aprueba o rechaza
- ❌ IA ejecuta transferencia bancaria → Sin revisión

---

## PRINCIPIO 8 — Observable by Default

**Todo produce: logs, eventos, métricas, tracing.**

No existen procesos invisibles en Inteliar.

### Obligatorio
- 📊 Métricas de negocio (customers creados, invoices pagadas)
- 📈 Métricas técnicas (latencia, errores, CPU)
- 📝 Logs estructurados (qué sucedió, dónde, cuándo)
- 🔗 Tracing distribuido (una solicitud a través de todos los servicios)

---

## PRINCIPIO 9 — Documentation First

**Antes de escribir código debe existir:**

1. ✅ ADR (decisión)
2. ✅ Blueprint (especificación)
3. ✅ Contrato (API, eventos)
4. ✅ Arquitectura

**Después:** Código

---

## PRINCIPIO 10 — Tests are Product

**Los tests no verifican el software. Forman parte del software.**

### Toda Capability incluye
- 🧪 Unit Tests (lógica individual)
- 🔗 Integration Tests (entre servicios)
- 📋 Contract Tests (APIs, eventos)
- ⚡ Performance Tests (SLA compliance)
- 🤖 AI Evaluation Tests (respuestas de IA)

---

## PRINCIPIO 11 — Version Everything

**Todo posee versión.**

- APIs (v1, v2, v3)
- Eventos (CustomerCreated.v1, CustomerCreated.v2)
- Workflows (repair-flow.v1, repair-flow.v2)
- Prompts (architect.repair-estimation.v1)
- AI Pods (support-pod.v1, support-pod.v2)
- Capabilities (customer-management.1.0.0)
- Stacks (fixly-stack.1.0.0, fixly-stack.2.0.0)
- Blueprints (solution-design.v3)

**Nunca sobrescribir. Siempre evolucionar.**

---

## PRINCIPIO 12 — Security by Design

**La seguridad nunca es un módulo adicional. Forma parte de la arquitectura.**

Todo recurso consulta **Permission Service**. Siempre.

### Incorrecto
```javascript
if (user.role === 'admin') {
  // acceso
}
```

### Correcto
```javascript
const permitted = await permissionService.canAccess(
  user_id, 
  resource, 
  action, 
  organization_id
);
```

---

## PRINCIPIO 13 — Stateless Services

**Los servicios son reemplazables. El estado vive donde corresponde.**

Nunca dentro del proceso.

### Incorrecto
```javascript
// State guardado en la instancia del servicio
this.sessionData = { userId: 123 };
```

### Correcto
```javascript
// State en base de datos o cache distribuido
await redis.set(`session:${sessionId}`, sessionData);
```

---

## PRINCIPIO 14 — One Source of Truth

**Cada dato posee un único dueño.**

```
Usuarios          → Identity Service
Permisos          → Permission Service
Organizaciones    → Organization Service
Procesos          → Workflow Engine
Decisiones        → Digital Twin
Conocimiento      → Knowledge Engine
Memoria           → Memory Service
```

**Nunca duplicar.**

---

## PRINCIPIO 15 — Build for Evolution

**No optimizamos para hoy. Optimizamos para los próximos diez años.**

Toda decisión debe responder:

> ¿Esto seguirá funcionando cuando existan 10.000 Capabilities?

### Ejemplo
No usar enumeraciones hardcodeadas en el código. Usar datos.

```javascript
// Incorrecto (no escala)
if (status === 'PENDING' || status === 'ACTIVE' || status === 'ARCHIVED') {
  // ...
}

// Correcto (escala a 10.000 estados)
const validStatuses = await capabilityService.getValidStatuses('repairs');
if (validStatuses.includes(status)) {
  // ...
}
```

---

## PRINCIPIO 16 — Architecture Before Framework

**Nunca elegir primero una tecnología.**

**Primero:** Arquitectura  
**Después:** Implementación

### Ejemplo
- ❌ "Usemos Kubernetes"
- ✅ "La aplicación necesita escalabilidad horizontal y orquestación automática, implementamos con Kubernetes"

---

## PRINCIPIO 17 — Context Over Memory

**Los modelos IA no necesitan recordar todo. Necesitan recibir el contexto correcto.**

AI Runtime construye el contexto. No el desarrollador.

### Responsabilidad
- 🤖 Desarrollador → expone datos limpios (eventos, database)
- 🧠 AI Runtime → construye contexto relevante
- 💭 LLM → razona con contexto bien armado

---

## PRINCIPIO 18 — Software is Knowledge

**Cada implementación genera conocimiento.**

Si una implementación termina y el Knowledge Engine no aprendió nada: perdimos una oportunidad.

### Ejemplo
Implementar "Repair Estimation Tool" no solo resuelve un problema puntual. Genera conocimiento:

- "Para estimar reparaciones, los técnicos consideran X, Y, Z"
- "El 80% de las reparaciones de frenos cuesta entre $50-$150"
- "El lead time promedio es 2 días"

Ese conocimiento se captura, valida, y se distribuye.

---

## PRINCIPIO 19 — Platform Thinking

**No construir soluciones aisladas. Siempre preguntarse:**

> ¿Esto puede reutilizarse en otra empresa?

Si la respuesta es "no", probablemente es una customización, no una Capability.

---

## PRINCIPIO 20 — Product over Project

**Inteliar no desarrolla proyectos. Construye productos reutilizables.**

Toda excepción debe justificarse.

### Incorrecto
"Necesitamos un feature específico para una empresa."
→ Código customizado, no reutilizable

### Correcto
"Necesitamos un feature específico."
→ Se diseña como Capability reutilizable
→ Se instala en el Stack de esa empresa
→ Otros pueden usarla después

---

## Regla para Claude Code

Antes de implementar cualquier tarea deberá responder internamente:

```
¿Existe una Capability?
      ↓ (sí) → usarla
      ↓ (no)
¿Existe un Workflow?
      ↓ (sí) → usarlo
      ↓ (no)
¿Existe un Evento?
      ↓ (sí) → usarlo
      ↓ (no)
¿Existe un Blueprint?
      ↓ (sí) → implementar según blueprint
      ↓ (no)
¿Existe una ADR?
      ↓ (sí) → seguir la ADR
      ↓ (no)
¿Existe una implementación reutilizable?
      ↓ (sí) → reutilizarla
      ↓ (no) → crear nueva, documentar, compartir
```

**Si alguna respuesta es "Sí": reutilizar.**

---

## Definition of Done Global

**Ninguna tarea puede cerrarse si falta alguno de estos puntos:**

- ✅ Arquitectura (¿cómo encaja en la plataforma?)
- ✅ Documentación (README, API, ejemplos)
- ✅ Tests (unit, integration, contract, performance)
- ✅ Observabilidad (logs, métricas, tracing)
- ✅ Seguridad (auditoría, permisos)
- ✅ Eventos (qué publica, qué consume)
- ✅ API (REST, GraphQL, SDK)
- ✅ AI Tools (si aplica; qué expone a The Architect)
- ✅ Permisos (cómo controla acceso)
- ✅ ADR actualizada (decisiones registradas)

Si falta uno: la tarea **no está terminada.**

---

## 🚨 ADR-EH001 — Ecosystem First

**Estado:** Accepted

Todo cambio debe mejorar el **ecosistema completo**, no solamente el proyecto actual.

Consecuencia: Decisions que optimizan para un cliente pero rompen la plataforma se **rechazan**.

---

## 🚨 ADR-EH002 — Code Ownership

**Estado:** Accepted

El código es un activo compartido.

- ❌ Nunca pertenece a un desarrollador individual
- ❌ Nunca pertenece a un agente IA
- ✅ Pertenece al ecosistema

Consecuencia: Decisiones sobre código siempre se toman pensando en el largo plazo y el impacto sobre otros.

---

## ⭐ ADR-EH003 — The Inteliar Method

**Estado:** Accepted

**La decisión más importante de toda la arquitectura.**

Inteliar **no debe depender de una tecnología.**  
Inteliar **debe depender de un método.**

Ese método es invariable:

```
Problema de negocio
      ↓
   Discover
      ↓
  Architect
      ↓
 Digital Twin
      ↓
Knowledge Engine
      ↓
  Capability
      ↓
   Workflow
      ↓
    Stack
      ↓
   Builder
      ↓
    GitHub
      ↓
   Deploy
      ↓
 Observability
      ↓
  Aprendizaje
      ↓
Knowledge Engine
      ↓ (ciclo cerrado)
```

**Es un ciclo cerrado.**

- Cada implementación mejora la siguiente
- Cada empresa fortalece la plataforma
- Cada Capability enriquece el ecosistema
- El sistema aprende sistemáticamente a construir mejores empresas

**Ahí está el verdadero diferencial competitivo.**

No es el Builder.  
No es la IA.  
No es el Marketplace.

Es que **Inteliar aprende sistemáticamente.**

---

*EH-001 — Engineering Principles*
