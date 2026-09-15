// Intérprete de lenguaje natural: convierte "qué se le despachó a AVSA la semana
// pasada" en una consulta estructurada que las herramientas pueden ejecutar.
//
// El modelo NUNCA toca los datos. Solo produce el JSON de la consulta; después
// la ejecuta la herramienta correspondiente, que sigue siendo determinística y
// de solo lectura. Si el modelo alucina una empresa o una fecha, se ve en el
// JSON antes de que nada consulte la base.
//
// El modelo se elige POR TAREA, no uno global: cada entrada de MODELOS declara
// cuál necesita. Hoy hay una sola tarea (interpretar), y alcanza el modelo más
// rápido y barato porque es texto → JSON. Cuando aparezca una tarea distinta
// (redactar el resumen de un reclamo, por ejemplo), se agrega su línea con el
// modelo que esa tarea pida.

const MODELOS = {
  interpretar: "claude-haiku-4-5-20251001",
};

// Catálogo que ve el modelo. Agregar una herramienta acá es lo único que hace
// falta para que pueda rutearse — el resto del sistema no cambia.
const HERRAMIENTAS = [
  {
    nombre: "pedidos",
    descripcion: "Pedidos de una empresa cliente: qué pidió cada persona, cuándo, qué productos y por cuánto.",
    disponible: true,
    parametros: ["empresa (obligatorio)", "desde (YYYY-MM-DD)", "hasta (YYYY-MM-DD)"],
  },
  {
    nombre: "despachos",
    descripcion: "Qué se despachó a cada empresa y cuándo.",
    disponible: false,
    parametros: ["empresa", "desde", "hasta"],
  },
  {
    nombre: "facturacion",
    descripcion: "Facturas emitidas por empresa y período.",
    disponible: false,
    parametros: ["empresa", "desde", "hasta"],
  },
  {
    nombre: "gastos",
    descripcion: "Gastos y proveedores por período.",
    disponible: false,
    parametros: ["proveedor", "desde", "hasta"],
  },
  {
    nombre: "clientes",
    descripcion: "Empresas cliente y sus precios acordados.",
    disponible: false,
    parametros: ["empresa"],
  },
];

function systemPrompt(hoy) {
  return `Sos el ruteador de un panel de operaciones. Convertís un pedido en lenguaje natural en una consulta estructurada. No respondés preguntas ni consultás datos: solo traducís.

Hoy es ${hoy} (zona horaria de Argentina).

Herramientas:
${HERRAMIENTAS.map(h => `- ${h.nombre}${h.disponible ? "" : " (NO DISPONIBLE todavía)"}: ${h.descripcion} Parámetros: ${h.parametros.join(", ")}.`).join("\n")}

Respondé SOLO con un objeto JSON, sin texto alrededor, con esta forma:
{"herramienta": "<nombre>", "empresa": "<texto o null>", "desde": "<YYYY-MM-DD o null>", "hasta": "<YYYY-MM-DD o null>", "persona": "<texto o null>", "confianza": "alta|media|baja", "interpretacion": "<una frase explicando qué entendiste>"}

Si no podés determinar la herramienta, devolvé {"herramienta": null, "interpretacion": "<qué falta para poder resolverlo>"}.

Reglas de fechas: resolvé expresiones relativas contra la fecha de hoy. "la semana pasada" es de lunes a domingo de la semana anterior. "el jueves" sin más es el jueves más reciente ya pasado. "este mes" arranca el día 1 del mes actual. Si el pedido no menciona ninguna fecha, devolvé null en desde y hasta — nunca inventes un rango.

Nunca corrijas ni completes el nombre de una empresa: copiá lo que dijo el usuario. El emparejamiento difuso lo hace la herramienta.`;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const json = (body, status) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

  const apiKey = (env.ANTHROPIC_API_KEY || "").trim();
  if (!apiKey) return json({ error: "Falta configurar ANTHROPIC_API_KEY en Cloudflare Pages." }, 500);

  let texto;
  try {
    ({ texto } = await request.json());
  } catch {
    return json({ error: "Body inválido." }, 400);
  }
  if (typeof texto !== "string" || !texto.trim()) return json({ error: "Falta el texto a interpretar." }, 400);
  if (texto.length > 1000) return json({ error: "El texto es demasiado largo." }, 400);

  const hoy = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" });

  let res;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODELOS.interpretar,
        max_tokens: 400,
        system: systemPrompt(hoy),
        messages: [{ role: "user", content: texto }],
      }),
    });
  } catch (err) {
    return json({ error: `No se pudo conectar con el modelo: ${err.message}` }, 502);
  }

  const raw = await res.text();
  if (!res.ok) {
    let detalle = raw;
    try {
      detalle = JSON.parse(raw).error?.message || raw;
    } catch {
      // la API puede devolver texto plano ante errores de infraestructura
    }
    return json({ error: `El modelo respondió ${res.status}: ${detalle}` }, 502);
  }

  let consulta;
  try {
    const salida = JSON.parse(raw).content?.[0]?.text ?? "";
    // El modelo a veces envuelve el JSON en un bloque de código pese a la instrucción.
    consulta = JSON.parse(salida.replace(/^```(?:json)?\s*|\s*```$/g, "").trim());
  } catch {
    return json({ error: "El modelo no devolvió un JSON interpretable." }, 502);
  }

  const herramienta = HERRAMIENTAS.find(h => h.nombre === consulta.herramienta);
  if (consulta.herramienta && !herramienta) {
    return json({ error: `El modelo pidió una herramienta que no existe: ${consulta.herramienta}` }, 502);
  }
  if (herramienta && !herramienta.disponible) {
    return json({ ...consulta, disponible: false }, 200);
  }

  return json({ ...consulta, disponible: true }, 200);
}
