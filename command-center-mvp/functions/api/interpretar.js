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
// `obligatorios` y `opcionales` van separados a propósito: cuando los parámetros
// se listaban juntos, el modelo dedujo que "proveedor" era obligatorio para
// gastos y rechazó "qué gastamos este mes", que es una consulta válida.
const HERRAMIENTAS = [
  {
    nombre: "pedidos",
    descripcion: "Pedidos de una empresa cliente: qué pidió cada persona, cuándo, qué productos y por cuánto.",
    disponible: true,
    obligatorios: ["empresa"],
    opcionales: ["desde", "hasta"],
  },
  {
    nombre: "despachos",
    descripcion: "Qué se despachó a cada empresa y cuándo.",
    disponible: false,
    obligatorios: [],
    opcionales: ["empresa", "desde", "hasta"],
  },
  {
    nombre: "facturacion",
    descripcion: "Facturas emitidas por empresa y período.",
    disponible: false,
    obligatorios: [],
    opcionales: ["empresa", "desde", "hasta"],
  },
  {
    nombre: "gastos",
    descripcion: "Gastos y proveedores por período. Sin proveedor, devuelve todos.",
    disponible: false,
    obligatorios: [],
    opcionales: ["proveedor", "desde", "hasta"],
  },
  {
    nombre: "clientes",
    descripcion: "Empresas cliente y sus precios acordados. Sin empresa, las lista todas.",
    disponible: false,
    obligatorios: [],
    opcionales: ["empresa"],
  },
];

const CLIENTES_URL = "https://pjrhfbhqdbyoljactdkj.supabase.co/functions/v1/get-company-clients";

// Trae el catálogo real de empresas de la tienda. Sin esto el modelo adivina el
// nombre: "argentina balores" devuelve los pedidos cargados como "Argentina
// Valores" pero pierde los que dicen "AVSA", y el resultado parece correcto.
//
// Si el catálogo no está disponible (la Edge Function todavía no desplegada, o
// falla), se devuelve null y se interpreta igual — pero el llamador avisa que el
// nombre no se pudo verificar. Seguir en silencio sería volver al mismo error.
async function traerCatalogo(storeId, agentKey) {
  if (!storeId || !agentKey) return null;
  try {
    const res = await fetch(`${CLIENTES_URL}?store_id=${encodeURIComponent(storeId)}`, {
      headers: { "x-agent-key": agentKey },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const nombres = (data.clients || []).map(c => c.name).filter(Boolean);
    return nombres.length ? nombres : null;
  } catch {
    return null;
  }
}

function systemPrompt(hoy, catalogo) {
  return `Sos el ruteador de un panel de operaciones. Convertís un pedido en lenguaje natural en una consulta estructurada.

Hoy es ${hoy} (zona horaria de Argentina).

Herramientas:
${HERRAMIENTAS.map(h => `- ${h.nombre}${h.disponible ? "" : " (NO DISPONIBLE todavía)"}: ${h.descripcion} Obligatorios: ${h.obligatorios.join(", ") || "ninguno"}. Opcionales: ${h.opcionales.join(", ") || "ninguno"}.`).join("\n")}

Respondé SOLO con un objeto JSON, sin texto alrededor, con esta forma:
{"herramienta": "<nombre>", "empresa": "<texto o null>", "desde": "<YYYY-MM-DD o null>", "hasta": "<YYYY-MM-DD o null>", "persona": "<texto o null>", "confianza": "alta|media|baja", "interpretacion": "<una frase>", "ajustes": ["<cada arreglo que hiciste sobre lo que pidió el usuario>"]}

Si no podés determinar la herramienta, devolvé {"herramienta": null, "interpretacion": "<qué necesitás que aclare>"}.

Un parámetro que no es obligatorio nunca se exige: si no está, la herramienta devuelve todo. "Qué gastamos este mes" es una consulta válida sin proveedor.

Reglas de fechas: resolvé expresiones relativas contra la fecha de hoy. "la semana pasada" es de lunes a domingo de la semana anterior, con ambos extremos. "el jueves" sin más es el jueves más reciente ya pasado, un solo día (desde y hasta iguales). "este mes" arranca el día 1 del mes actual. Si el pedido no menciona ninguna fecha, devolvé null en desde y hasta — nunca inventes un rango.

Si el rango viene invertido (desde posterior a hasta), dalo vuelta y anotalo en "ajustes". Todo arreglo que hagas sobre lo que el usuario pidió va en "ajustes": el operador tiene que poder ver qué cambiaste. Si no cambiaste nada, devolvé una lista vacía.

${catalogo
  ? `Empresas cliente registradas en esta tienda:
${catalogo.map(n => `- ${n}`).join("\n")}

Resolvé el nombre que dijo el usuario contra esa lista y devolvé en "empresa" el nombre tal como figura ahí, aunque lo haya escrito mal, incompleto o con otra grafía. Si lo corregiste, anotalo en "ajustes" (por ejemplo: 'busqué "Argentina Valores", entendí que te referías a eso cuando escribiste "argentina balores"').

Si lo que escribió no se parece a ninguna de la lista, devolvé el texto tal cual y anotá en "ajustes" que esa empresa no figura entre las registradas. No la fuerces contra la más parecida si la diferencia es grande: es preferible que no aparezca a que traiga los datos de otra empresa.`
  : `No hay catálogo de empresas disponible en este momento, así que copiá el nombre tal como lo dijo el usuario, sin corregirlo. El emparejamiento difuso lo hace la herramienta.`}

"interpretacion" la lee una persona que opera el panel, no un programador: escribila en una frase corta y concreta. Nunca describas tu propio funcionamiento, ni menciones "herramientas", "parámetros" ni "consultas estructuradas". Si algo no se puede responder, decí qué datos harían falta, en términos del negocio.`;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const json = (body, status) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

  const apiKey = (env.ANTHROPIC_API_KEY || "").trim();
  if (!apiKey) return json({ error: "Falta configurar ANTHROPIC_API_KEY en Cloudflare Pages." }, 500);

  let texto, storeId;
  try {
    ({ texto, storeId } = await request.json());
  } catch {
    return json({ error: "Body inválido." }, 400);
  }
  if (typeof texto !== "string" || !texto.trim()) return json({ error: "Falta el texto a interpretar." }, 400);
  if (texto.length > 1000) return json({ error: "El texto es demasiado largo." }, 400);

  const hoy = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Argentina/Buenos_Aires" });
  const catalogo = await traerCatalogo(storeId, (env.AGENT_API_KEY || "").trim());

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
        system: systemPrompt(hoy, catalogo),
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
    return json({ ...consulta, disponible: false, catalogo: Boolean(catalogo) }, 200);
  }

  return json({ ...consulta, disponible: true, catalogo: Boolean(catalogo) }, 200);
}
