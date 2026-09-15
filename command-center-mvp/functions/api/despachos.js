// Proxy server-side hacia la Edge Function get-company-dispatches.
// Mismas razones que functions/api/pedidos.js: la Edge Function no acepta este
// origin por CORS, y x-agent-key no puede vivir en el navegador.

const EDGE_FUNCTION_URL = "https://pjrhfbhqdbyoljactdkj.supabase.co/functions/v1/get-company-dispatches";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Solo estos parámetros se reenvían: lo que llegue de más se descarta en vez de
// pasar a la Edge Function sin mirar.
const PERMITIDOS = ["client_id", "from", "to", "sin_facturar", "limit"];

export async function onRequestGet(context) {
  const { request, env } = context;

  const json = (body, status) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

  const agentKey = (env.AGENT_API_KEY || "").trim();
  if (!agentKey) return json({ error: "Falta configurar AGENT_API_KEY en Cloudflare Pages." }, 500);

  const url = new URL(request.url);
  const storeId = url.searchParams.get("store_id") || "";
  if (!UUID_RE.test(storeId)) return json({ error: "store_id inválido o faltante." }, 400);

  const params = new URLSearchParams({ store_id: storeId });
  for (const nombre of PERMITIDOS) {
    const valor = url.searchParams.get(nombre);
    if (!valor) continue;
    if ((nombre === "from" || nombre === "to") && !DATE_RE.test(valor)) {
      return json({ error: `${nombre} debe ser YYYY-MM-DD.` }, 400);
    }
    if (nombre.endsWith("_id") && !UUID_RE.test(valor)) {
      return json({ error: `${nombre} inválido.` }, 400);
    }
    params.set(nombre, valor);
  }

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
    return json({ error: `get-company-dispatches respondió ${res.status}: ${detail}` }, res.status);
  }

  return new Response(body, { status: 200, headers: { "Content-Type": "application/json" } });
}
