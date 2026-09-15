# THE INTELIAR CONSTITUTION
## Libro II — Product · Capítulo 20 — Organization System

**Versión:** 1.0 · **Estado:** Core Architecture · **Prioridad:** Crítica

---

## Objetivo

Definir el modelo organizacional de Inteliar. Toda la plataforma gira alrededor de un concepto: no usuarios, no proyectos, no empresas — **Organizaciones**.

> **Principio fundamental:** toda información dentro de Inteliar pertenece a una Organización. Nunca a un usuario, un desarrollador o un proyecto.

## ¿Qué es una Organización?

Cualquier entidad que opera sobre Inteliar: empresa, startup, ONG, municipio, universidad, estudio jurídico, cadena de sucursales, persona física, agencia. Todo es una Organización.

> No diseñamos software para empresas. Diseñamos software para organizaciones — porque una organización puede ser mucho más que una empresa.

## Anatomía

```
Organization → Business Units → Departments → Teams → Projects → Members
```

- **Business Units:** una organización puede tener múltiples unidades de negocio (ej: un grupo con Morfi, Fixly, Distribuidora, Constructora). Todas bajo la misma organización, pero **cada una con su propio Digital Twin**.
- **Departments:** Ventas, Compras, Administración, Producción, Marketing, IT, RRHH. No obligatorios.
- **Teams:** cada departamento posee equipos (ej: Marketing → Ads, Contenido, Diseño, Automatización).
- **Members:** no necesariamente empleados. Puede ser empleado, consultor, proveedor, partner, cliente, **IA, agente**. Los agentes también son miembros.

### Human Members
Nombre, rol, permisos, equipo, historial, conocimiento, actividad.

### AI Members
Los agentes aparecen como miembros (ej: *Support Agent · Activo · resolvió 143 tickets · disponibilidad 24/7*). La organización entiende que forman parte del equipo.

## Organizations as Graph

Una organización nunca se representa solo con tablas. Se representa como un grafo:

```
Empresa → Área → Proceso → Persona → Sistema → Información → Objetivo
```

Eso permite entender relaciones.

## Multi / Cross Organization

- Un usuario puede pertenecer a varias organizaciones con distintos permisos.
- Una agencia puede administrar varias empresas sin mezclar datos ni duplicar usuarios.

## Propiedades de la Organización

- **Memory:** cada organización posee memoria propia. Nunca comparte información privada, pero sí conocimiento validado.
- **Timeline:** toda la historia queda registrada (creación, nueva sucursal, nuevo ERP, nueva automatización, nueva integración, nuevo AI Pod).
- **Health:** indicadores no solo financieros — Madurez Digital, Automatización, IA, Procesos, Conocimiento, Escalabilidad, Seguridad.
- **Goals:** cada organización define objetivos; todo proyecto se relaciona con un objetivo.
- **Policies:** horarios, aprobaciones, compliance, seguridad, accesos. Pertenecen a la organización, no a los módulos.
- **Context:** cuando un agente trabaja, nunca recibe todo — solo contexto, objetivos, permisos, proceso. Reduce costos, mejora precisión.
- **Knowledge:** el Knowledge Engine organiza conocimiento por organización e identifica patrones comunes sin exponer información privada.
- **Templates:** una organización puede convertirse en Template (ej: una cadena gastronómica optimiza 3 años y convierte su experiencia en Template). No copian datos: copian conocimiento.

## Organization Lifecycle

```
Created → Discover → Digital Twin → Implementation → Operation →
Optimization → Expansion → Continuous Evolution
```

Una organización nunca está "terminada".

## Ownership y Multi-Tenant

Toda organización es propietaria de su código, datos, documentación, configuración, historial y Digital Twin. **Inteliar administra, no posee.** Todo Inteliar es multi-tenant con aislamiento completo: cada organización es un universo independiente.

## Federation & Network

Las organizaciones pueden colaborar (Proveedor → Distribuidora → Transportista → Cliente), cada una manteniendo su organización, colaborando mediante **permisos temporales**, sin compartir sistemas completos. En el futuro pueden formar redes (franquicia, cámara empresarial, universidad con sedes, holding) manteniendo autonomía y compartiendo ciertos procesos.

---

## 🚨 ADR-026 — La Organización es la unidad principal
Todo lo demás deriva de ella. No existen proyectos, usuarios ni agentes sin organización.

## 🚨 ADR-027 — Toda decisión debe responder a una Organización
Antes de crear cualquier entidad nueva: *¿a qué Organización pertenece?* Si no se puede responder, el modelo está mal diseñado.

> Ver el [ADR Ledger](../adr/README.md) para el registro formal de ambos.

---

## ⭐ Digital Organization (no "tenant")

Casi todos los sistemas trabajan con el concepto técnico de *tenant*, invisible para el cliente. Inteliar debería trabajar con el concepto de **Digital Organization**: no un tenant, sino una organización viva con identidad, historia, conocimiento, procesos, objetivos, IA, agentes y evolución. El usuario nunca habla de "multi-tenant". Habla de su organización. Y toda la plataforma piensa igual.

---

*Fin del Capítulo 20 — Organization System*
