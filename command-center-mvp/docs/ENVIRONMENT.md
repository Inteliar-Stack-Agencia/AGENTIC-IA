# ENVIRONMENT

Qué sistemas existen, qué puede tocar el agente y qué no. Todo lo de acá está
verificado contra las bases reales, no asumido.

Última verificación: 2026-09-15.

---

## Sistemas

| Sistema | Qué es | Dónde |
|---|---|---|
| **Command Center** | El panel. HTML/CSS/JS plano servido por Cloudflare Pages. | `agentes.inteliarstack.com` |
| **Pages Functions** | El único código server-side propio. Proxies y el intérprete. | `functions/` de este proyecto |
| **VendexChat** | La base de un cliente (Morfi y otras tiendas). No es nuestra. | Supabase `pjrhfbhqdbyoljactdkj` |
| **Inteliar Ops** | Registro operativo propio del agente. | Supabase `xeqbapfjosgchkhqwzsh` (proyecto "Riweb.app", reutilizado) |
| **Anthropic API** | Interpreta lenguaje natural. No accede a datos. | `api.anthropic.com` |

---

## Herramientas disponibles

Todas son Edge Functions de Supabase en el proyecto de VendexChat, **de solo
lectura**, autenticadas con el header `x-agent-key` contra el secret
`AGENT_API_KEY`. Ninguna escribe.

| Herramienta | Devuelve | Filtra por |
|---|---|---|
| `get-company-orders` | Pedidos con sus ítems | tienda, empresa (texto difuso), fechas |
| `get-company-dispatches` | Despachos con sus ítems | tienda, `client_id`, fechas, sin facturar |
| `get-company-invoices` | Facturas emitidas | tienda, `client_id`, fechas, estado |
| `get-expenses` | Gastos con totales por rubro | tienda, proveedor, categoría, fechas |
| `get-company-clients` | Empresas cliente y sus precios | tienda |

**No existe ninguna herramienta de escritura todavía.** La primera será
`create-company-invoice`, y es la que cambia el perfil de riesgo del proyecto
entero (ver `PERMISSIONS.md`).

---

## Fuentes de datos

### VendexChat — `pjrhfbhqdbyoljactdkj`

| Tabla | Filas | Última actividad | Notas |
|---|---|---|---|
| `orders` / `order_items` | 197 / 639 | 15/09 | El `total` del pedido está en **0.00**; el monto real solo vive en los ítems |
| `company_dispatches` / items | 240 / 736 | 13/09 | El dataset más activo. `invoice_id` en null = no facturado |
| `company_invoices` | 30 | 07/09 | Estados: `facturado` \| `pagado` |
| `company_clients` / precios | 11 / 29 | 02/09 | Tiene `iva_rate` y `discount_percentage` por empresa |
| `expenses` / `suppliers` | 88 / 8 | 04/09 | 10 categorías, tipo fijo o variable |
| `production_log` | 1773 | 10/08 | Congelado desde agosto |
| `sales_log` | 455 | 14/08 | Congelado desde agosto |
| `daily_stock_counts` | 260 | 14/08 | Congelado desde agosto |

### Inteliar Ops — `xeqbapfjosgchkhqwzsh`

Proyecto reutilizado ("Riweb.app"). Estaba prácticamente vacío: todas las tablas
en 0 filas salvo `clients` (2) e `inbox_accounts` (1).

| Tabla | Qué guarda |
|---|---|
| `agent_runs` | Una fila por ejecución: entrada, interpretación, modelo usado, ajustes, herramienta, parámetros, estado, resultado, error y duración |
| `agent_feedback` | La señal del operador: si el resultado fue correcto y, si no, qué esperaba |

RLS activado, sin políticas públicas: solo el `service_role` escribe y lee.

**La interpretación la registra el server** (`interpretar.js`), así que ninguna
consulta queda sin rastro. **El resultado lo reporta el navegador**, así que un
run puede quedar en `iniciado` si el browser se cerró a mitad de camino. Eso se
resuelve cuando la orquestación pase al server, que es lo que va a exigir el
proceso de facturación.

---

## Trampas conocidas de los datos

Cosas verificadas que hacen que un número parezca correcto sin serlo:

1. **`orders.total` está en 0.00 en todos los pedidos.** Sumar ese campo da cero.
   El monto sale de `order_items.subtotal`.
2. **Los pedidos casi nunca cambian de estado.** Desde abril: 249 `pending`
   contra 47 `completed` y 31 `confirmed`. Sumar todo junto da un número que
   parece facturación y no lo es.
3. **La misma empresa aparece escrita de varias formas** en `metadata.company_name`:
   "AVSA", "avsa", "Argentina Valores", "Argentina valores", "Argentina Valores S.A".
   `get-company-orders` las une con emparejamiento difuso, pero un error de tipeo
   del operador ("argentina balores") devuelve un subconjunto **sin avisar**.
   Mitigado resolviendo el nombre contra `company_clients` antes de consultar.
4. **Despachos y facturas referencian por `client_id`, no por texto.** Ahí el
   emparejamiento es exacto y este problema no existe.
5. **El descuento se aplica antes del IVA.** Invertir el orden da un total
   plausible y equivocado.

---

## Permisos y credenciales

| Secreto | Dónde vive | Alcance |
|---|---|---|
| `AGENT_API_KEY` | Cloudflare Pages (Producción) + Supabase VendexChat | Lee los datos de **todas** las tiendas, no solo la elegida |
| `ANTHROPIC_API_KEY` | Cloudflare Pages | Solo el intérprete |
| `AGENTES_USER` / `AGENTES_PASS` | Cloudflare Pages | Login del panel |
| `OPS_SERVICE_KEY` | Cloudflare Pages | `service_role` de Inteliar Ops. Escribe el registro — y alcanza también al token de WhatsApp de `inbox_accounts` |

Ninguna llega al navegador. Todas se usan desde Pages Functions.

---

## Limitaciones

- **Sin memoria conversacional.** El registro ya existe, pero el intérprete no lo
  lee: cada mensaje se sigue interpretando aislado.
- **CORS.** Las Edge Functions solo aceptan origins de vendexchat. Por eso todo
  llamado sale del server y no del navegador.
- **Una sola tienda por consulta.** No hay consultas cruzadas entre tiendas.
- **Un solo cliente conectado.** Etiquetar (`vxyayqbenzhxxsoozjks`) tiene datos
  aprovechables —licencias con vencimiento, eventos de usuario— pero todavía no
  está integrado.

---

## Riesgos

| Riesgo | Por qué importa |
|---|---|
| **Alcance de `AGENT_API_KEY`** | Lee todas las tiendas. Un error de `store_id` devuelve datos de otro cliente. |
| **Token de WhatsApp en Inteliar Ops** | `inbox_accounts` guarda un access_token de WhatsApp Business. El `service_role` que use el agente para sus registros también puede leerlo. Separación pendiente. |
| **Primera escritura** | Hasta hoy todo es de lectura y ningún error puede dañar datos. `create-company-invoice` rompe esa garantía. |
| **Facturar dos veces** | Si el proceso corre dos veces sobre el mismo período. La defensa es `invoice_id`, pero hay que verificar que se escribió. |
| **Inyección vía lenguaje natural** | Mitigado: el modelo solo emite un JSON de campos fijos y el filtro por empresa se valida en tres capas independientes. |
| **Datos de un cliente en producción** | VendexChat es la base de un cliente con operación real. No hay ambiente de pruebas. |
