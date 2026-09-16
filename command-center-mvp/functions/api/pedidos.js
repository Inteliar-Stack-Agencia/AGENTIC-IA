// Proxy server-side hacia la Edge Function get-company-orders (repo
// VendexChat-admin, proyecto pjrhfbhqdbyoljactdkj).
//
// Existe por dos razones, las dos bloqueantes si el navegador llamara directo:
//
// 1. CORS: la Edge Function solo acepta origins de vendexchat (admin.vendexchat.app,
//    vendexchat.app, localhost:5173). Desde acá el navegador rechazaría la respuesta.
//    Este fetch sale del server de Cloudflare, no de un browser, así que no aplica.
// 2. La clave: x-agent-key da lectura sobre los pedidos de todas las tiendas. Antes
//    se tipeaba en la UI y quedaba en localStorage — cualquiera con la pantalla
//    abierta podía leerla. Ahora vive solo acá, como secreto de Pages.
//
// El _middleware.js de Basic Auth corre antes que esto, así que el endpoint queda
// detrás del mismo login que el resto del panel.

const EDGE_FUNCTION_URL = "https://pjrhfbhqdbyoljactdkj.supabase.co/functions/v1/get-company-orders";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function onRequestGet(context) {
  const { request, env } = context;

  const json = (body, status) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  // .trim() porque el valor se pega a mano en el dashboard y un espacio o salto de
  // línea al final da un 401 idéntico al de una clave equivocada.
  const agentKey = (env.AGENT_API_KEY || "").trim();
  if (!agentKey) {
    return json({ error: "Falta configurar AGENT_API_KEY en Cloudflare Pages." }, 500);
  }

  const url = new URL(request.url);
  const storeId = url.searchParams.get("store_id") || "";
  const companyName = (url.searchParams.get("company_name") || "").trim();
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  if (!UUID_RE.test(storeId)) return json({ error: "store_id inválido o faltante." }, 400);
  if (from && !DATE_RE.test(from)) return json({ error: "from debe ser YYYY-MM-DD." }, 400);
  if (to && !DATE_RE.test(to)) return json({ error: "to debe ser YYYY-MM-DD." }, 400);

  // company_name es opcional: sin ella, trae todos los pedidos de la tienda en el
  // rango, sin filtrar por empresa.
  const params = new URLSearchParams({ store_id: storeId, limit: "200" });
  if (companyName) params.set("company_name", companyName);
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  let res;
  try {
    res = await fetch(`${EDGE_FUNCTION_URL}?${params.toString()}`, {
      headers: { "x-agent-key": agentKey },
    });
  } catch (err) {
    return json({ error: `No se pudo conectar con la herramienta: ${err.message}` }, 502);
  }

  const body = await res.text();
  if (!res.ok) {
    let detail = body;
    try {
      detail = JSON.parse(body).error || body;
    } catch {
      // la Edge Function puede devolver texto plano en errores de infraestructura
    }
    return json({ error: `get-company-orders respondió ${res.status}: ${detail}` }, res.status);
  }

  return new Response(body, { status: 200, headers: { "Content-Type": "application/json" } });
}
