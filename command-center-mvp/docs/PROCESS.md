# PROCESS — Facturación de despachos entregados

El primer proceso autónomo del sistema. Uno solo, hecho bien, antes de agregar
cualquier otro.

---

## Por qué este

- **Es plata, no un informe.** Un despacho con `invoice_id` en null es mercadería
  entregada que no se cobró.
- **Se puede verificar por un camino independiente.** El total de la factura se
  recalcula desde los ítems de los despachos, sin usar el cálculo que la generó.
- **Tiene una frontera de aprobación evidente.** Emitir una factura es NIVEL 3.
- **Los datos están vivos:** 240 despachos, el último el 13/09.
- **Es acotado:** una tienda, una empresa, un período.

Se descartaron: licencias vencidas de Etiquetar (solo 8 filas, no alcanza para
aprender sobre confiabilidad) y pedidos colgados en `pending` (el problema no es
del agente sino que el circuito de estados no se usa; automatizar encima de un
proceso que la gente no sigue es construir sobre arena).

---

## Objetivo

Dado una tienda, una empresa y un período: detectar todo lo entregado y no
facturado, calcular la factura correspondiente, verificarla, proponerla, y —solo
con aprobación humana— emitirla y confirmar que quedó bien emitida.

---

## Entradas

| Entrada | Origen | Obligatoria |
|---|---|---|
| `store_id` | Selector del panel | Sí |
| `client_id` | Resuelto contra el catálogo | Sí — sin id no se factura |
| `desde` / `hasta` | Intérprete o formulario | Sí — nunca un período abierto |

**Regla dura:** este proceso nunca corre sin empresa ni sin período. Las
consultas de lectura admiten "todo el histórico"; una facturación, no.

---

## Herramientas

| Paso | Herramienta | Tipo |
|---|---|---|
| Datos fiscales de la empresa | `get-company-clients` | lectura |
| Despachos sin facturar | `get-company-dispatches` (`sin_facturar=true`) | lectura |
| Facturas ya emitidas del período | `get-company-invoices` | lectura |
| Emisión | `create-company-invoice` | **escritura — no existe todavía** |

---

## Pasos

1. **Resolver la empresa.** Si el nombre no está en el catálogo, detenerse. No
   se factura a una empresa que no se pudo identificar.
2. **Traer los datos fiscales:** `discount_percentage` e `iva_rate`.
3. **Traer los despachos** del período con `invoice_id` null.
4. **Si no hay ninguno:** informar y terminar. No proponer una factura vacía.
5. **Comprobar solapamiento:** traer las facturas del período. Si ya hay una que
   cubre estas fechas, detenerse y reportarlo.
6. **Calcular**, en este orden exacto:
   ```
   subtotal  = Σ (items.subtotal)      ← NUNCA del campo total del despacho
   descuento = subtotal × discount_percentage / 100
   base      = subtotal − descuento
   iva       = base × iva_rate / 100
   total     = base + iva
   ```
7. **Verificar** (ver abajo). Si falla, detenerse.
8. **Proponer** la factura con el detalle de qué despachos la componen.
9. **Esperar aprobación humana.** Sin aprobación no se emite. Nunca.
10. **Emitir** con `create-company-invoice`.
11. **Verificar lo emitido.** Releer la factura y los despachos.
12. **Registrar** la ejecución completa en Inteliar Ops.

---

## Verificación

### Antes de proponer

| Control | Criterio |
|---|---|
| Suma independiente | Recalcular el subtotal desde los ítems por otro camino. Debe coincidir al centavo. |
| Orden del cálculo | El descuento va **antes** del IVA. Invertirlo da un total plausible y equivocado. |
| Campo de origen | El subtotal sale de los ítems, nunca de `total`. En `orders` ese campo está en 0.00 y no hay garantía de que en despachos sea confiable. |
| Período cerrado | `desde` y `hasta` presentes y `desde` ≤ `hasta`. |
| Sin solapamiento | Ninguna factura previa cubre el mismo período para esa empresa. |
| Empresa identificada | Hay `client_id`, no solo un nombre escrito. |

Si cualquiera falla: **detener y reportar**. No corregir en silencio.

### Después de emitir

| Control | Criterio |
|---|---|
| La factura existe | Releerla por id y comparar total, subtotal e IVA contra lo aprobado. |
| Los despachos quedaron marcados | Todos los incluidos deben tener el `invoice_id` de la factura nueva. |
| No se creó de más | Ninguna factura adicional para esa empresa en ese período. |

Si la verificación posterior falla, el estado es **inconsistente**: se escribió
algo distinto a lo aprobado. Eso no se reintenta automáticamente — se alerta.

---

## Excepciones

| Situación | Qué hace el agente |
|---|---|
| Empresa no está en el catálogo | Se detiene. No factura sin id. |
| Sin despachos pendientes | Informa "nada para facturar". No es un error. |
| Ya existe factura del período | Se detiene y reporta cuál. |
| El recálculo no coincide | Se detiene y muestra ambos números. |
| Un despacho sin ítems | Se detiene: un despacho sin detalle no se puede facturar. |
| `discount_percentage` o `iva_rate` en null | Se detiene. No asume 0. |
| La Edge Function falla | Reintenta hasta 3 veces. Después se detiene. |
| La escritura falla | **No reintenta.** Puede haberse escrito parcialmente. Alerta. |

---

## Cuándo pedir intervención humana

Siempre, para emitir. Y además:

- cuando cualquier verificación previa falla;
- cuando hay solapamiento con una factura existente;
- cuando la verificación posterior no coincide;
- después de 3 intentos fallidos en una operación recuperable;
- cuando falta cualquier dato fiscal.

---

## Límite de reintentos

Máximo **3 intentos automáticos**, y solo para errores recuperables de lectura
(red, timeout, 5xx). Las escrituras no se reintentan nunca automáticamente: un
error después de escribir puede significar que la factura se creó igual.

---

## Registro

Cada corrida deja en Inteliar Ops: entrada, plan, herramientas usadas,
despachos considerados, cálculo, resultado de cada verificación, decisión
humana, resultado final y errores. Suficiente para reconstruir qué pasó sin
tener que adivinar.
