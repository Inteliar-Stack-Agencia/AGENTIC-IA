# INTELIAR MASTER SPECIFICATION
## Capítulo 16 — Engineering Principles

**Versión:** 1.0
**Estado:** Engineering Constitution
**Prioridad:** Máxima

---

## Objetivo

Definir las reglas inquebrantables de ingeniería. No son recomendaciones: son decisiones arquitectónicas.

Toda Pull Request deberá respetarlas. Todo agente IA deberá respetarlas. Todo Partner deberá respetarlas.

## Filosofía

La velocidad nunca puede destruir la arquitectura. La IA permite escribir código muy rápido; precisamente por eso necesitamos reglas mucho más estrictas.

> Nuestro objetivo no es escribir más código. Es escribir cada vez **menos** código nuevo.

---

## Los seis principios

### Primer Principio — Todo debe ser reutilizable
Antes de escribir una línea: *¿esto puede servirle a otro proyecto?* Si la respuesta es sí, no pertenece al producto. Pertenece a Platform.

### Segundo Principio — Nunca duplicar
Está prohibido implementar dos veces: Autenticación, Billing, Permisos, Notificaciones, Storage, Usuarios, IA, Analytics, Deploy. Si ya existe, se mejora. No se vuelve a crear.

### Tercer Principio — La plataforma primero
```
Platform → Capability → Module → Template → Solution
```
Nunca al revés.

### Cuarto Principio — La configuración reemplaza al código
Antes de programar: *¿puede resolverse mediante configuración?* Si la respuesta es sí, no se programa.

### Quinto Principio — Los productos son consumidores
Fixly, Labels, VendexChat, ERP, CRM nunca crean infraestructura. La consumen.

### Sexto Principio — La IA no toma decisiones arquitectónicas sola
Puede proponer, analizar, implementar. Pero las ADR importantes requieren revisión humana.

---

## La Pirámide de Desarrollo

```
Problema → Architect → Digital Twin → Capability → Module → Platform → Builder → Deploy
```

Nunca comienza escribiendo código.

---

## Estructura Oficial (monorepo)

```
inteliar/
├── apps/            productos finales
├── packages/        código reutilizable
├── services/        servicios independientes
├── modules/         implementaciones de negocio
├── templates/       configuraciones iniciales
├── agents/          agentes oficiales
├── knowledge/       conocimiento versionado (no código)
├── sdk/             herramientas para terceros
├── docs/            toda especificación
├── infrastructure/
└── tools/
```

No existen repositorios aislados. Todo nace aquí.

### apps/
Productos finales. Nunca contienen lógica compartida.
`builder · business · admin · website · partner · marketplace`

### packages/
Código reutilizable.
`ui · auth · billing · events · permissions · database · analytics · notifications · storage · ai · forms · reports · workflow`

### services/
Servicios independientes.
`architect · knowledge · deploy · billing · gateway · monitoring · search · memory`

### modules/
Implementaciones de negocio.
`customers · inventory · sales · purchases · payments · repairs · labels · appointments`

### templates/
`restaurant · workshop · clinic · construction · retail · municipality`

### agents/
`architect · sales · developer · qa · reviewer · inventory · finance · support`

### knowledge/
Todo el conocimiento versionado. No código.

### docs/
Toda especificación vive aquí. Nunca en Notion, nunca en chats. **Git es la verdad.**
> **Nota (ver ADR-026):** "Git es la verdad" se refiere a la verdad del *sistema* (código, esquema, docs). La verdad del *negocio* vive en el Digital Twin.

---

## Convenciones

**Convención mínima:** todo tiene README, Tests, Changelog, ADR relacionadas, Documentación, Ejemplos.

**Naming:** nunca `Utils`, `Helpers`, `Misc`, `Common`, `Etc`. Todo nombre describe una responsabilidad.

**Commits:** todo commit responde *¿por qué?*, no solamente *¿qué?*.

**Pull Requests:** toda PR responde Problema, Decisión, Impacto, Compatibilidad, ADR relacionada, Tests.

**Feature Flags:** toda funcionalidad nueva, feature flag. Siempre.

**Observabilidad:** todo servicio expone Logs, Eventos, Métricas, Health, Tracing. No existen cajas negras.

**Eventos:** nunca dependencias directas. Todo mediante eventos.

**APIs:** API First. Todo servicio debe poder usarse desde Web, CLI, SDK, Builder, Agentes, Partners.

---

## Testing (pirámide)

```
Unit → Integration → Contract → E2E → AI Evaluation
```

## AI Development Rules

Claude Code, GPT, Cursor no escriben código libremente. Primero consultan IMS, ADR, Knowledge. Luego implementan.

## Refactoring
Reescribir: no. Extraer: sí.

## Debt
Toda deuda técnica debe registrarse. Nunca ocultarse.

## ADR
Toda decisión importante, un ADR. Siempre.

## Documentación
Se escribe antes, durante y después. Nunca solamente al final.

## Roadmap
Toda tarea pertenece a un Objetivo, una Capability, un ADR. No existen tareas aisladas.

---

## Métrica principal de Ingeniería

No medir líneas de código. Medir **porcentaje reutilizado**. Si cada proyecto escribe menos código nuevo, la plataforma está mejorando.

---

## 🚨 ADR-019
El activo principal de ingeniería no es el código. Es la arquitectura. El código cambia. La arquitectura permanece.

## 🚨 ADR-020
Todo proyecto nuevo debe fortalecer la plataforma. Si un proyecto solo resuelve un cliente y no mejora Platform, estamos construyendo una software factory, no Inteliar.

---

## La Regla del 80%

Cuando aparezca un nuevo proyecto, nunca empezamos desde cero.

```
80% ya existe
20% se desarrolla específicamente
```

No importa si es un ERP, un POS, un CRM, un WMS, un TMS, un sistema de turnos. Si algún proyecto necesita escribir el 80% desde cero, **no falló el proyecto: falló Inteliar Platform.**

---

## ⭐ ADR-021 — La métrica más importante de toda la empresa

No medir: líneas de código, cantidad de módulos, cantidad de clientes, cantidad de desarrolladores.

Medir esto:

> **¿Qué porcentaje de un nuevo proyecto puede construirse reutilizando conocimiento, capacidades, módulos y agentes existentes?**

Ese porcentaje debe aumentar año tras año. Cuando una empresa pueda crear un sistema complejo reutilizando el 95% del ecosistema y desarrollando solo el 5% restante, Inteliar habrá cumplido su misión.

---

## 📌 Nota — reestructuración del IMS en volúmenes

El IMS mezcla visión, estrategia, producto, ingeniería, UX y negocio. Estructura propuesta:

```
VOLUMEN I   — FOUNDATION       (visión, filosofía, historia)
VOLUMEN II  — PRODUCT          (BOS, Platform, Builder, Business)
VOLUMEN III — ENGINEERING      (Stack, Capabilities, Modules, Agents, APIs)
VOLUMEN IV  — OPERATIONS       (Marketplace, Partners, Billing, Cloud)
VOLUMEN V   — IMPLEMENTATION   (Roadmap, ADR, Auditoría, Migración)
```

Así el IMS se convierte en una biblioteca de arquitectura, donde Claude Code abre directamente el volumen que necesita según la tarea.

---

*Fin del Capítulo 16 — Engineering Principles*
