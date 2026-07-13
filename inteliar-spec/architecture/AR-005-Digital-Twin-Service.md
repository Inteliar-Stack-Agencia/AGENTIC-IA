# INTELIAR ARCHITECTURE REFERENCE
## AR-005 — Digital Twin Service

**Versión:** 1.0 · **Estado:** Core Service · **Prioridad:** P0 (Crítico)

---

## Objetivo

El servicio que representa el **estado vivo** de una organización. No es una copia de la base de datos: es una representación inteligente del funcionamiento de la empresa. Toda decisión estratégica consulta primero el Digital Twin.

Responde una sola pregunta: **¿cómo funciona esta organización hoy?** No responde quién inició sesión, qué permisos tiene, ni cómo es la base de datos.

## Componentes

```
Digital Twin
├── Organization Model   ├── Business Metrics    ├── Simulation Engine
├── Process Model        ├── Relationship Engine  └── Snapshot Engine
├── Capability Graph     ├── Timeline
├── Knowledge Graph
```

```
DigitalTwin: id, organization_id, version, status, created_at, updated_at,
             confidence_score, health_score
```

## Grafos del negocio

- **Organización:** Empresa → Sucursales → Departamentos → Equipos → Personas. Nunca duplicados; todo referencia Organization Service.
- **Process Graph:** procesos como grafo (Cliente → Consulta → Presupuesto → Aprobación → Trabajo → Entrega → Factura → Cobro), sin importar qué sistema los ejecute.
- **Capability Graph:** cada Capability instalada es un nodo que conoce su estado, uso, madurez, dependencias.
- **Relationship Graph:** relaciones del negocio (no SQL): Cliente → Compra → Producto → Proveedor → Factura → Pago → Entrega.

## Métricas y salud

- **Business Metrics:** tiempos promedio (venta, reparación, entrega), automatización, IA utilizada, errores, cuellos de botella, KPIs.
- **Business Health:** Automation, Knowledge, AI Adoption, Scalability, Security, Overall (%).
- **Confidence Score:** no toda info tiene la misma confianza (ej: Inventario 98% importado de ERP vs Objetivos 61% de conversación). El Architect sabe cuándo volver a preguntar.

## Historia y simulación

- **Timeline:** todo cambio genera una nueva versión (v12 → nueva sucursal → v13...). Nunca sobrescribir.
- **Snapshot Engine:** responder *¿cómo era la empresa hace seis meses?*
- **Diff Engine:** comparar dos versiones (antes 12 procesos manuales → ahora 5).
- **Simulation Engine (estratégico):** ¿qué pasa si abrimos una sucursal / duplicamos ventas / automatizamos compras / integramos Mercado Libre? Antes de implementar.

## Inputs / Outputs

- **Inputs:** Conversation, Event Bus, Knowledge Engine, Builder, Marketplace, APIs, Workflows, Analytics. Nunca desde un único lugar.
- **Outputs:** alimenta Architect, Builder, Knowledge Engine, Monitoring, Business Dashboard, AI Agents.

## API

```
GET /digital-twin · /processes · /capabilities · /health · /simulation
POST /digital-twin/snapshot · /digital-twin/compare
```

**GraphQL:** `digitalTwin{ organization health processes capabilities timeline metrics }`

## Eventos

`DigitalTwinCreated · DigitalTwinUpdated · BusinessHealthChanged · CapabilityDetected · ProcessDetected · SimulationCompleted · TwinVersionCreated`

## Consistencia

El Twin nunca escribe directamente en otros servicios. Consume eventos, construye un modelo, publica resultados. Toda modificación ocurre vía Event Bus, nunca llamadas directas.

## Persistencia

```
PostgreSQL → estado     Neo4j → grafo
Object Storage → snapshots    Redis → consultas frecuentes
```

**¿Por qué Neo4j?** La mayoría de las relaciones (procesos, dependencias, organizaciones, knowledge, capabilities) son grafos. Preguntas como *"¿qué procesos dependen indirectamente de Compras?"* se responden naturalmente en un grafo y en milisegundos.

## Integraciones

- **Knowledge Engine:** consulta patrones, benchmarks, industry packs, buenas prácticas — nunca los modifica.
- **Architect:** toda conversación va Usuario → Architect → Digital Twin → Respuesta (no directo al LLM).
- **Builder:** no pregunta qué tablas crear; pregunta qué representa el Twin y genera la arquitectura.

## Performance

Consulta `<100ms` · Simulación `<5s`. Preparado para millones de nodos.
**Repository:** `services/digital-twin-service/`

## Definition of Done

Graph Model · Timeline · Snapshots · Diff · Simulation · Health · API · GraphQL · SDK · Eventos · Tests · Auditoría.

---

## 🚨 ADR-AR008 — El Twin es un modelo derivado

Nunca reemplaza los datos transaccionales. Optimizado para comprender el negocio, no para almacenar operaciones.

## 🚨 ADR-AR009 — Todo agente consulta primero el Twin

Nunca consulta múltiples servicios para reconstruir el contexto. El Twin ya hizo ese trabajo.

## ⭐ ADR-AR010 — Twin Dual Model

Cada organización tiene **dos** Twins conceptuales:

- **Operational Twin** — estado actual: procesos reales, eventos, métricas.
- **Strategic Twin** — hacia dónde quiere ir: objetivos, roadmap, escenarios, simulaciones, hipótesis.

```
Hoy: 2 sucursales, 15 empleados, 50 pedidos/día
Objetivo: 5 sucursales, 40 empleados, 300 pedidos/día
```

The Architect trabaja constantemente reduciendo la distancia entre ambos. El Twin deja de ser una herramienta de observación y se convierte en una de **planificación**.

---

*AR-005 — Digital Twin Service*
