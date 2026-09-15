# Command Center — MVP

Prototipo del centro de mando de Inteliar Stack: un núcleo orquestador, cinco
empleados digitales orbitando por estado, y despacho de tareas en lenguaje natural.

HTML/CSS/JS plano, sin build ni framework. Se abre con doble click en `index.html`
para desarrollo, y en producción lo sirve Cloudflare Pages tal cual.

## Qué es real y qué no

Los 5 puestos salieron de un relevamiento de la base: son las únicas áreas con datos
reales detrás. Los 5 están conectados a una Edge Function del proyecto
`pjrhfbhqdbyoljactdkj`, todas de solo lectura.

| Empleado | Herramienta | Datos |
|---|---|---|
| PEDIDOS | `get-company-orders` | `orders` + `order_items` |
| DESPACHOS | `get-company-dispatches` | `company_dispatches` + items |
| FACTURACIÓN | `get-company-invoices` | `company_invoices` |
| GASTOS | `get-expenses` | `expenses` + `suppliers` |
| CLIENTES | `get-company-clients` | `company_clients` + precios |

MARKETING, RRHH, LEGAL y SOPORTE se eliminaron: no hay ninguna tabla que los
respalde, así que no había forma de volverlos reales, solo simularlos.

No se marca un empleado como real hasta que su herramienta devuelva datos de verdad,
y un puesto sin herramienta no simula trabajo: si se le despacha una tarea, lo dice.

## Deploy

- **Proyecto:** Cloudflare Pages `command-center-mvp` (conectado a este repo, rama `main`)
- **Directorio raíz:** `command-center-mvp` · **Build command:** ninguno · **Output:** `/`
- **Dominio:** `agentes.inteliarstack.com`

`inteliarstack.com` (la raíz) es otro proyecto distinto (`inteliarstack-web`) y no se
toca. Se usó un subdominio y no la subruta `/agentes` porque un dominio personalizado
de Cloudflare tiene prioridad sobre cualquier Worker route externo para todo el
hostname, sin importar el path.

### Secretos (Cloudflare Pages → Configuración → Variables y secretos, entorno Producción)

| Nombre | Qué es |
|---|---|
| `AGENTES_USER` / `AGENTES_PASS` | Usuario y contraseña del panel. Los define quien administra el panel. |
| `AGENT_API_KEY` | El secreto que ya existía en Supabase (`AGENT_API_KEY` del proyecto `pjrhfbhqdbyoljactdkj`). Tiene que coincidir exacto o la Edge Function devuelve 401. |
| `ANTHROPIC_API_KEY` | Para el intérprete de lenguaje natural. Sin esto el panel no entiende nada de lo que se le escribe. |

Pages enlaza las variables **en el momento del deploy**: si se agrega o cambia un
secreto, hay que redesplegar (o pushear) para que las Functions lo vean.

## Arquitectura de las herramientas reales

Cada capacidad real es una Edge Function de Supabase, solo-lectura, autenticada con un
secreto compartido (`x-agent-key`) y no con sesión de usuario — un agente externo no
tiene login de Supabase. Adentro, la función usa la Service Role Key y hace el scoping
por tienda a mano en la query, sin depender de RLS.

Del lado del Command Center hay **una sola capa de conexión**, `tools.js`. Ningún
empleado sabe hacer `fetch` por su cuenta:

```js
TOOLS.pedidos.call({ storeId, companyName, from, to })
```

Agregar una capacidad nueva (facturación, despachos, lo que sea) es: una entrada nueva
en `TOOLS`, su Pages Function en `functions/api/`, y marcarle `real: true` + su lista
de `tools` al empleado. El router, el render y el resto del sistema no se tocan.

### Por qué el llamado sale del server y no del navegador

`functions/api/pedidos.js` es un proxy: el browser llama a `/api/pedidos` (mismo
origen) y el server de Cloudflare llama a la Edge Function. Dos razones, las dos
bloqueantes si el navegador llamara directo:

1. **CORS.** `get-company-orders` solo acepta `admin.vendexchat.app`,
   `vendexchat.app` y `localhost:5173`. Desde `agentes.inteliarstack.com` el preflight
   falla (el header `x-agent-key` es custom, siempre lo dispara) y el GET real nunca
   sale.
2. **El alcance de la clave.** `x-agent-key` lee los pedidos de *todas* las tiendas,
   no solo la seleccionada. En el navegador quedaba en `localStorage`, legible por
   cualquiera con la pantalla abierta.

El `_middleware.js` de Basic Auth corre antes que cualquier Function, así que
`/api/*` queda detrás del mismo login que el panel.

## Estructura

```
command-center-mvp/
├── index.html                  # markup base: nav, header, mount de pantalla, toast
├── style.css                   # todo el estilo
├── app.js                      # estado, ruteo de pantallas, layout orbital, tareas
├── templates.js                # funciones puras de render (HTML string)
├── tools.js                    # única capa de conexión a herramientas reales
├── functions/                  # Cloudflare Pages Functions (corren en el server)
│   ├── _middleware.js          # Basic Auth para todo el sitio
│   └── api/
│       ├── interpretar.js      # lenguaje natural → consulta estructurada
│       ├── pedidos.js          # proxy a get-company-orders
│       ├── despachos.js        # proxy a get-company-dispatches
│       ├── facturacion.js      # proxy a get-company-invoices
│       ├── gastos.js           # proxy a get-expenses
│       └── clientes.js         # proxy a get-company-clients
└── docs/
    ├── ENVIRONMENT.md          # qué existe, qué se puede tocar, qué trampas tienen los datos
    ├── FEATURE_MAP.md          # cómo se conectan las piezas
    ├── PROCESS.md              # el primer proceso autónomo: facturación de despachos
    └── PERMISSIONS.md          # los 4 niveles de acción
```

## El siguiente paso

Las cinco capacidades son de **solo lectura**: el ciclo real hoy es observar e
informar. El primer proceso que ejecuta y verifica —facturación de despachos
entregados— está diseñado en `docs/PROCESS.md` y todavía no implementado.
