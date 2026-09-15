# PERMISSIONS

Qué puede hacer el agente solo, qué puede hacer avisando, qué necesita
aprobación y qué no puede hacer nunca.

---

## Estado actual

**Hoy todo el sistema está en NIVEL 1.** Las cinco capacidades son de solo
lectura y no existe ninguna herramienta de escritura. Los niveles 2 a 4
describen el sistema que viene, no el que hay.

Esto no es un detalle: mientras todo sea lectura, ningún error del agente puede
dañar datos. La primera escritura rompe esa garantía, y es el momento en que
este documento pasa de teórico a obligatorio.

---

## NIVEL 1 — Autónomas

Reversibles, sin efecto sobre ningún dato. El agente las ejecuta sin preguntar.

- Consultar pedidos, despachos, facturas, gastos y clientes.
- Traer el catálogo de empresas.
- Interpretar lenguaje natural.
- Calcular totales y agrupaciones sobre datos ya traídos.
- Escribir en su propio registro de ejecución (Inteliar Ops).

> El registro es NIVEL 1 aunque sea una escritura: es data propia del agente, no
> del cliente, y perderla no afecta ninguna operación del negocio.

---

## NIVEL 2 — Autónomas con verificación

El agente puede ejecutarlas solo, pero **debe verificar el resultado y mostrarlo**.
No alcanza con que la operación no tire error.

- Detectar despachos entregados y no facturados.
- Calcular una factura propuesta (sin emitirla).
- Resolver un nombre de empresa contra el catálogo.
- Resolver fechas relativas ("la semana pasada", "el jueves").

**Obligación en este nivel:** todo ajuste que el agente haga sobre lo que pidió
el humano se declara. Un rango dado vuelta, un nombre corregido o una fecha
inferida cambian el resultado; si no se avisan, el número que sale después
parece correcto sin serlo.

---

## NIVEL 3 — Requieren aprobación

Impacto económico, contractual, legal, o comunicación hacia afuera. El agente
**prepara y propone**; un humano decide.

- **Emitir una factura** (`create-company-invoice`).
- Marcar despachos como facturados.
- Registrar un cobro o un pago.
- Modificar precios pactados con una empresa.
- Enviar cualquier comunicación a un cliente final (mail, WhatsApp).
- Cambiar el estado de un pedido o un despacho.

**Cómo se pide la aprobación:** el agente muestra qué va a hacer, con qué datos,
y el resultado de sus verificaciones previas. No pide aprobación en abstracto
("¿emito la factura?") sino concreta ("factura de $X a la empresa Y, compuesta
por estos N despachos, verificada así").

---

## NIVEL 4 — Prohibidas

El agente no las ejecuta nunca, ni con aprobación. Requieren que una persona
las haga a mano, fuera del sistema.

- Borrar o modificar una factura ya emitida.
- Borrar pedidos, despachos, clientes o cualquier registro histórico.
- Cualquier escritura fuera del circuito de facturación.
- Tocar credenciales, secretos o configuración de proyectos.
- Leer o usar el `access_token` de WhatsApp Business guardado en
  `inbox_accounts` del proyecto Inteliar Ops.
- Operar sobre una tienda distinta a la seleccionada.
- Ejecutar SQL arbitrario. Todo pasa por una Edge Function con su propósito
  declarado.

---

## Reglas transversales

1. **Ninguna escritura se reintenta automáticamente.** Un error después de
   escribir puede significar que la operación se completó igual.
2. **Máximo 3 intentos** para errores recuperables de lectura. Después, detenerse.
3. **Nunca ocultar un error.** Preferible una tarea frenada a un resultado
   dudoso presentado como bueno.
4. **Si falta un dato crítico, detenerse.** Nunca asumir un valor por defecto en
   un cálculo económico: un `iva_rate` en null no es 0.
5. **Una regla de NIVEL 3 o 4 no se cambia sin aprobación explícita.** El agente
   puede proponer cambios a este documento; no puede aplicarlos.

---

## Pendiente de resolver

**Alcance de credenciales.** `AGENT_API_KEY` lee los datos de todas las tiendas,
no solo la seleccionada, y el `service_role` de Inteliar Ops alcanza también al
token de WhatsApp de `inbox_accounts`. Ninguna de las dos llega al navegador,
pero la regla de NIVEL 4 sobre ese token hoy es una convención en este documento,
no una restricción técnica. Separarlo de verdad requiere roles con permisos
acotados por tabla.
