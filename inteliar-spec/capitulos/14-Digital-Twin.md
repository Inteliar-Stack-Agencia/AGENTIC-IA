# INTELIAR MASTER SPECIFICATION
## Capítulo 14 — Digital Twin

**Versión:** 1.0
**Estado:** Core Architecture
**Prioridad:** Crítica

---

## Objetivo

Definir el modelo digital que representa una empresa dentro de Inteliar.

Todo proyecto comienza creando un Digital Twin. Nunca escribiendo código. Nunca instalando módulos.

---

## Definición

El Digital Twin es la representación viva de una empresa.

No representa solamente sus datos. Representa cómo funciona. Cómo decide. Cómo vende. Cómo compra. Cómo produce. Cómo se comunica. Cómo evoluciona.

Es el cerebro operativo de toda la plataforma.

---

## Filosofía

Hoy un software conoce:
- usuarios
- productos
- clientes

Inteliar debe conocer:
- **la empresa.**

Esa diferencia cambia absolutamente todo.

---

## El Twin no es una Base de Datos

Un error muy común sería pensar que el Digital Twin es un conjunto de tablas. No.

Es un **modelo semántico**. Contiene relaciones, objetivos, procesos, roles, dependencias, conocimiento e historia.

---

## ¿Qué representa? — Las ocho dimensiones

Toda empresa queda modelada mediante ocho dimensiones.

### 1. Organización

```
Empresa
  ↓
Sucursales
  ↓
Áreas
  ↓
Equipos
  ↓
Personas
```

### 2. Personas
No solamente empleados. También: clientes, proveedores, socios, transportistas, contactos, usuarios.

### 3. Procesos
Cada proceso tiene: inicio, fin, objetivo, entradas, salidas, responsables, automatizaciones, KPIs.

### 4. Información
Qué datos existen. Quién los modifica. Quién depende de ellos. Dónde nacen. Dónde terminan.

### 5. Tecnología
Software actual, Excel, WhatsApp, APIs, ERP, CRM, infraestructura, integraciones.

### 6. Conocimiento
Cómo trabaja **realmente** esa empresa. No cómo debería trabajar.

### 7. Objetivos
Reducir tiempos, vender más, automatizar, reducir errores, escalar. Cada decisión se relaciona con un objetivo.

### 8. Evolución
Cómo cambió la empresa. Qué decisiones tomó. Qué funcionó. Qué se descartó. Todo queda registrado.

---

## Construcción del Twin

El Twin nunca se crea manualmente. Se construye mediante múltiples fuentes.

```
Conversación + Documentos + Bases de datos + Excel +
Software existente + APIs + Observación
        ↓
   Digital Twin
```

---

## Descubrimiento Continuo

El Twin nunca termina. Cada interacción puede modificarlo.

```
Nueva sucursal   → Twin actualizado
Nuevo proceso    → Twin actualizado
Nuevo empleado   → Twin actualizado
Nueva integración → Twin actualizado
```

---

## Estado Vivo

El Twin siempre responde a: *¿Cómo funciona hoy esta empresa?* — no a cómo funcionaba cuando se implementó.

---

## Relación con The Architect

The Architect nunca habla directamente con los módulos. Siempre consulta el Twin.

```
Usuario → Architect → Digital Twin → Knowledge Engine → Capabilities → Platform
```

## Relación con Builder
Builder tampoco construye desde cero. Importa el Twin y genera la arquitectura.

## Relación con los Agentes
Todos los agentes trabajan sobre el mismo Twin. Nunca crean modelos propios.

## El Twin es Compartido
Business, Builder, Partners, Architect, Agentes: todos utilizan exactamente el mismo modelo.

---

## Simulación

El Twin permite simular cambios antes de implementarlos.

```
Agregar una sucursal    → ¿Qué cambia?
Duplicar empleados      → ¿Qué cambia?
Cambiar flujo de compras → ¿Qué procesos impacta?
Agregar IA              → ¿Cuánto tiempo se ahorra?
```

## Impact Analysis

Antes de modificar cualquier proceso, Inteliar responde qué se afecta: Compras, Stock, Facturación, Reportes, Costos, Permisos. Todo automáticamente.

## Business Health

El Twin calcula constantemente: madurez, automatización, complejidad, dependencias, riesgos, crecimiento. No analiza solamente software. Analiza empresas.

---

## Timeline

Todo cambio queda registrado.

```
Empresa
  ↓ Se agregó Inventario
  ↓ Se automatizó Compras
  ↓ Se creó nueva sucursal
  ↓ Se integró WhatsApp
  ↓ Se agregó IA
```

## Twin API
Toda la plataforma consulta. No existen modelos paralelos.

## Twin Versioning
Cada modificación crea una nueva versión. Podemos responder: *¿cómo era esta empresa hace un año?*

## Twin Diff
Dos versiones pueden compararse.

```
              Antes    Ahora
Procesos manuales  12      3
Herramientas        8      2
Empleados admin.   15      8
```

## Twin Score
Cada empresa posee un indicador no financiero, arquitectónico: Digital Maturity, Automation, Knowledge, AI Adoption, Scalability, Security, Observability, Integration.

## Benchmark
El Twin puede compararse contra empresas similares. Nunca mostrando datos privados. Solo patrones.

---

## Gemelos Sectoriales

El Knowledge Engine puede construir Twin de Talleres, Restaurantes, Constructoras, Clínicas. No de una empresa: de una industria.

### Twin Marketplace — Industry Twins

```
Restaurant Twin
  ↓ ya conoce:
Cocina, Mozos, Delivery, Caja, Compras, Producción, Stock, KPIs.
```

Cuando una empresa gastronómica llega, no empieza desde cero. Parte desde un Twin especializado.

---

## 🚨 ADR-016
Todo proyecto dentro de Inteliar debe poseer un Digital Twin. Sin Twin, no existe proyecto.

## 🚨 ADR-017 — El Digital Twin es la fuente de verdad del negocio
> **Nota (ver ADR-R01):** este ADR fue enmendado. El Twin es la fuente de verdad *del negocio*, no del sistema. La verdad del sistema (código, esquema) vive en Git.

Queda establecido que:
- Los módulos representan capacidades.
- Los agentes ejecutan trabajo.
- The Architect diseña.
- **El Digital Twin representa la realidad de la empresa.**

Toda decisión importante debe derivarse del Twin. Nunca de configuraciones aisladas, reglas hardcodeadas ni intuiciones.

---

## ⭐ Nota del Arquitecto

Windows administra una computadora. Android administra un teléfono. iOS administra un iPhone. **Inteliar administra una empresa.**

- El Digital Twin es el equivalente al *kernel*.
- Los módulos son las aplicaciones.
- Los agentes son los procesos en ejecución.
- The Architect es el planificador.
- El Knowledge Engine es la memoria de largo plazo.
- El Marketplace es la tienda de aplicaciones.
- Los Partners son los fabricantes.

Los SaaS que hoy imaginamos (Fixly, Labels, VendexChat) pasan a ser simplemente **distribuciones** construidas sobre ese sistema operativo.

📌 Inteliar es un **Business Operating System (BOS)**.

---

*Fin del Capítulo 14 — Digital Twin*
