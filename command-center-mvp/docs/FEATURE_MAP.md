# FEATURE MAP

Cómo se conectan las piezas y por dónde pasa una tarea desde que se escribe
hasta que devuelve un resultado.

---

## El sistema hoy

```
OPERADOR (navegador, detrás de Basic Auth)
    │  escribe en lenguaje natural
    ▼
COMMAND CENTER  ── app.js ── tools.js ── única capa de conexión
    │
    ▼
/api/interpretar ────────────────┐
    │                            │ trae el catálogo de empresas
    │                            ▼
    │                     get-company-clients
    │                            │
    │  ◀── nombres reales ───────┘
    ▼
ANTHROPIC (Haiku)
    │  devuelve SOLO un JSON: {herramienta, empresa, desde, hasta, ajustes}
    │  NUNCA accede a datos
    ▼
RESOLUCIÓN DE ID  (código, no modelo)
    │  nombre canónico → client_id exacto
    ▼
/api/{pedidos|despachos|facturacion|gastos|clientes}
    │  server-side, con x-agent-key
    ▼
EDGE FUNCTION (Supabase VendexChat)
    │  Service Role + scoping por store_id a mano
    ▼
POSTGRES
    │
    ▼
RESULTADO → panel + log del agente + feed de actividad
```

**Dónde está cada frontera de confianza:**

- El navegador no tiene ninguna credencial. Solo habla con `/api/*` del mismo origen.
- El modelo no tiene acceso a datos. Solo traduce texto a un JSON de campos fijos.
- El `client_id` lo resuelve el código contra el catálogo, no el modelo: un id
  inventado traería datos de otra empresa.
- La Edge Function no confía en RLS: filtra por `store_id` a mano en cada query.

---

## Los cinco puestos y sus datos

```
                        NÚCLEO (intérprete + ruteo)
                                  │
      ┌──────────┬────────────────┼────────────────┬──────────┐
      ▼          ▼                ▼                ▼          ▼
   PEDIDOS   DESPACHOS      FACTURACIÓN         GASTOS    CLIENTES
      │          │                │                │          │
   orders   company_          company_         expenses   company_
   + items  dispatches        invoices         + supp.    clients
                                                          + precios
```

Cada uno responde una pregunta distinta del mismo negocio:

- **PEDIDOS** — qué pidió cada persona de cada empresa.
- **DESPACHOS** — qué se entregó realmente, y qué de eso no se facturó.
- **FACTURACIÓN** — qué se facturó, qué se cobró, qué falta cobrar.
- **GASTOS** — en qué se va la plata, por rubro y por proveedor.
- **CLIENTES** — a quién le vendemos y a qué precio.

---

## El primer proceso autónomo

Facturación de despachos entregados y no cobrados. Es el único flujo que
atraviesa varios puestos y termina en una acción, no en un informe.

```
DISPARADOR (operador o programado)
    │
    ▼
CLIENTES ──────────► iva_rate, discount_percentage de la empresa
    │
    ▼
DESPACHOS ─────────► despachos con invoice_id = null, del período
    │
    ├─ ¿hay alguno? ── NO ──► informa "nada para facturar" y termina
    │
    ▼ SÍ
CÁLCULO
    subtotal = Σ items
    descuento = subtotal × discount_percentage
    base = subtotal − descuento
    iva = base × iva_rate
    total = base + iva
    │
    ▼
VERIFICACIÓN INDEPENDIENTE
    recalcula desde los ítems por otro camino y compara
    │
    ├─ no coinciden ──► DETENER · reportar discrepancia · no proponer nada
    │
    ▼ coinciden
PROPUESTA (no emitida)
    │
    ▼
╔═══════════════════════════════╗
║  APROBACIÓN HUMANA — NIVEL 3  ║
╚═══════════════════════════════╝
    │
    ├─ rechazada ──► registra el motivo y termina
    │
    ▼ aprobada
create-company-invoice        ◄── la primera escritura del sistema
    │
    ▼
VERIFICACIÓN POSTERIOR
    releer la factura creada y comparar contra lo aprobado
    comprobar que los despachos quedaron con invoice_id
    │
    ├─ no coincide ──► ALERTA: se escribió algo distinto a lo aprobado
    │
    ▼
INFORME + REGISTRO en Inteliar Ops
```

Las dos verificaciones son distintas a propósito: la primera comprueba que el
cálculo esté bien **antes** de mostrarlo; la segunda, que lo que quedó en la base
sea lo que se aprobó. Hoy no tenemos ninguna de las dos porque no escribimos nada.

---

## Qué falta para que este mapa sea real

| Pieza | Estado |
|---|---|
| Las 5 consultas de lectura | ✅ funcionando |
| Intérprete de lenguaje natural | ✅ funcionando |
| Catálogo para resolver nombres | ✅ funcionando |
| Detector de despachos sin facturar | por construir (solo lectura) |
| Cálculo + verificación independiente | por construir |
| Registro de ejecuciones | por construir — bloquea todo lo demás |
| `create-company-invoice` | por construir — **requiere aprobación explícita** |
| Memoria conversacional | por construir |
