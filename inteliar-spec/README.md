# INTELIAR MASTER SPECIFICATION (IMS)

**Versión:** 1.0  
**Estado:** Draft  
**Propósito:** Documento maestro de arquitectura, visión y desarrollo de Inteliar Platform  
**Última actualización:** 2026-07-13  
**Audiencia:** Ingenieros, CTOs, Product Leads, Agentes IA, Partners

---

## 📍 Estado actual del repositorio

> La Tabla de Contenidos de abajo es el **plan completo** del IMS. Lo que ya está escrito y versionado en este repo es:

| Ubicación | Contenido |
|-----------|-----------|
| [`capitulos/`](./capitulos/) | **Volumen 1 — Foundation:** Caps 14–19 (Digital Twin, BOS, Engineering Principles, Open Platform, Discover, Design) |
| [`capitulos/README.md`](./capitulos/README.md) | Índice del Volumen 1 y su arco |
| [`adr/README.md`](./adr/README.md) | **ADR Ledger** — decisiones 015–027, incluidas las reconciliaciones ADR-026 y ADR-027 |

Pendiente: traer los capítulos 1–13 (redactados en sesión previa) y hacer la pasada de coherencia pre-BOS. Ver pendientes en el índice del Volumen 1.

---

## ¿Qué es este documento?

Este no es un PRD. No es una estrategia de negocio. No es un roadmap.

**Es la constitución de Inteliar.**

Cada decisión de arquitectura, cada línea de código, cada feature, cada integración debe poder rastrearse hasta un principio en este documento.

Si algo que hacemos no está justificado aquí, o redefinimos el documento o redefinimos la decisión. No ambas.

---

## Para quién es esto

### Para Ingenieros
Este es tu manual. Cuando tengas dudas sobre cómo construir algo, vuelve aquí. La respuesta está en algún lado.

### Para CTOs
Este es tu blueprint. La arquitectura está completamente definida. No hay espacio para interpretación.

### Para Agentes IA (Claude, GPT, etc)
Este es tu contexto permanente. Cuando escribas código para Inteliar, tienes que poder justificar cada decisión con una sección de este documento.

### Para Partners
Este es el contrato. Si quieres construir con Inteliar, esto te dice exactamente cómo.

---

## Tabla de Contenidos

### **PARTE I — LA EMPRESA**
Quiénes somos, por qué existimos, qué problema resolvemos

| Cap | Título | Propósito |
|-----|--------|----------|
| 01 | Carta del Fundador | Por qué nació Inteliar |
| 02 | El Problema | Por qué el software empresarial está roto |
| 03 | Filosofía | Cómo pensamos |
| 04 | Visión | Qué somos en 2035 |
| 05 | Lo que NO somos | Límites claros |
| 06 | Lo que SÍ somos | Definición precisa |

### **PARTE II — PRODUCTO**
Qué es Inteliar, cómo se usa, cómo se vende

| Cap | Título | Propósito |
|-----|--------|----------|
| 07 | Inteliar Platform | El Core |
| 08 | Inteliar Stack | Cómo se construye un SaaS |
| 09 | Builder Experience | Herramientas para desarrolladores |
| 10 | Business Experience | Herramientas para empresas |
| 11 | The Architect | El motor central (IA) |
| 12 | Digital Twin | Modelo vivo del negocio |

### **PARTE III — ARQUITECTURA**
Cómo se construye técnicamente

| Cap | Título | Propósito |
|-----|--------|----------|
| 13 | Capabilities | La unidad fundamental |
| 14 | Modules | Cómo se diseña un módulo |
| 15 | Agents | Todos los agentes del sistema |
| 16 | Workflows | Motor de procesos |
| 17 | Knowledge Engine | La memoria de Inteliar |
| 18 | AI Layer | LLM, prompts, contexto |
| 19 | Marketplace | Templates, agentes, integraciones |

### **PARTE IV — ENGINEERING**
Estándares de código y operación

| Cap | Título | Propósito |
|-----|--------|----------|
| 20 | Monorepo | Estructura del repo |
| 21 | Packages | Librerías compartidas |
| 22 | Apps | Aplicaciones del ecosistema |
| 23 | Services | Microservicios |
| 24 | SDK | Cómo construyen terceros |
| 25 | APIs | Contratos públicos |
| 26 | Eventos | Sistema de mensajería |
| 27 | Seguridad | Autenticación, autorización, encriptación |
| 28 | Multi Tenant | Aislamiento de datos |
| 29 | Billing | Sistema de cobros |
| 30 | Testing | Estándares de calidad |
| 31 | CI/CD | Pipeline de deployment |

### **PARTE V — NEGOCIO**
Modelo comercial y go-to-market

| Cap | Título | Propósito |
|-----|--------|----------|
| 32 | Modelo de Negocio | Cómo ganamos dinero |
| 33 | Partners | Programa de partners |
| 34 | Enterprise | Venta enterprise y soporte |
| 35 | Pricing | Estructura de precios |
| 36 | Roadmap | Qué viene después |

### **PARTE VI — IMPLEMENTACIÓN**
De aquí a la realidad

| Cap | Título | Propósito |
|-----|--------|----------|
| 37 | Estrategia de Migración | De 5 productos a 1 plataforma |
| 38 | Migración Fixly | Plan específico |
| 39 | Migración Labels | Plan específico |
| 40 | Migración VendexChat | Plan específico |
| 41 | Deuda Técnica | Qué hay que arreglar primero |
| 42 | Backlog | Trabajo próximo |

### **PARTE VII — APÉNDICES**
Referencias y anexos

| Cap | Título | Propósito |
|-----|--------|----------|
| 43 | Auditoría Técnica | Hallazgos base |
| 44 | ADRs | Architectural Decision Records |
| 45 | Diagramas | Visualizaciones clave |
| 46 | Glosario | Definiciones precisas |
| 47 | Estándares | Código, naming, convenciones |

---

## Cómo leer este documento

### Si tienes 15 minutos
Lee: **00 → 06** (Parte I)  
Entenderás por qué existe Inteliar.

### Si tienes 1 hora
Lee: **00 → 12** (Partes I + II)  
Entenderás qué es Inteliar y cómo se usa.

### Si vas a escribir código
Lee todo, pero enfócate en: **13 → 31** (Partes III + IV)  
Ahí están los estándares que debes seguir.

### Si eres ejecutivo/CEO
Lee: **00 → 06 → 32 → 36** (empresa + negocio)  
Entenderás la estrategia.

### Si eres partner/tercero
Lee: **06 → 09 → 19 → 24 → 25** (producto, marketplace, SDK, APIs)  
Así construyes con nosotros.

---

## Convenciones de este documento

### Colores de severidad
```
🔴 CRÍTICO  — No se puede ignorar
🟠 IMPORTANTE — Debe cumplirse
🟡 RECOMENDADO — Mejor práctica
🟢 OPCIONAL — Si aplica
```

### Cajas de contexto
```
┌─ DECISION
│ Decisión tomada y por qué
└─

┌─ EJEMPLO
│ Caso de uso concreto
└─

┌─ DIAGRAM
│ Visualización clave
└─
```

### Niveles de profundidad
- **Overview:** qué es, para qué sirve
- **Deep Dive:** cómo funciona internamente
- **Implementation:** cómo se usa/codifica

---

## Lectura recomendada antes de empezar

1. **[01 - Carta del Fundador](./01-Carta-del-Fundador.md)** — Por qué existe esto
2. **[02 - El Problema](./02-El-Problema.md)** — Qué estamos resolviendo
3. **[03 - Filosofía](./03-Filosofia.md)** — Cómo pensamos

---

## Versiones y cambios

Este documento es vivo. Evoluciona con Inteliar.

**Versión 1.0 (Actual):** Draft — en construcción  
**Próxima actualización:** 2026-08-13

Cambios importantes van en:  
[CHANGELOG.md](./CHANGELOG.md)

---

## Cómo contribuir a este documento

Si encontrás un error, una inconsistencia, o algo que no está claro:

1. Abre un issue en GitHub
2. Referencia el capítulo específico
3. Propone una mejora

Este documento es tan importante como el código. Mantengámoslo actualizado.

---

**Inteliar Master Specification**  
*Documento maestro de arquitectura, visión y desarrollo*  
*Escrito para 100 ingenieros, usable por cualquier IA*
