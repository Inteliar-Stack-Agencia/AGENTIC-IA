// Cierra un registro con el resultado de la ejecución, y recibe la señal de
// "esto estuvo mal" del operador.
//
// LIMITACIÓN CONOCIDA: el resultado lo reporta el navegador, así que el registro
// de la ejecución depende de que el cliente lo mande. La interpretación sí la
// escribe el server por su cuenta (ver interpretar.js), así que una consulta
// nunca queda sin rastro — pero puede quedar en 'iniciado' si el navegador se
// cerró a mitad de camino.
//
// Esto se resuelve del todo cuando la orquestación pase al server, que es lo que
// va a exigir el proceso de facturación: sus verificaciones no pueden depender
// de lo que el cliente decida informar. Ver docs/PROCESS.md.

import { cerrarRun, guardarFeedback, opsConfigurado } from "./_ops.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ESTADOS = ["ok", "error", "sin_herramienta", "no_interpretado"];

export async function onRequestPost(context) {
  const { request, env } = context;

  const json = (body, status) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

  if (!opsConfigurado(env)) {
    return json({ error: "Falta configurar OPS_SERVICE_KEY en Cloudflare Pages." }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body inválido." }, 400);
  }

  const { run_id: runId, tipo } = body;
  if (!UUID_RE.test(runId || "")) return json({ error: "run_id inválido o faltante." }, 400);

  if (tipo === "feedback") {
    if (typeof body.correcto !== "boolean") {
      return json({ error: "Falta indicar si el resultado fue correcto." }, 400);
    }
    try {
      await guardarFeedback(env, {
        runId,
        correcto: body.correcto,
        comentario: typeof body.comentario === "string" ? body.comentario.slice(0, 2000) : null,
      });
    } catch (err) {
      return json({ error: err.message }, 502);
    }
    return json({ ok: true }, 200);
  }

  if (!ESTADOS.includes(body.estado)) {
    return json({ error: `estado debe ser uno de: ${ESTADOS.join(", ")}` }, 400);
  }

  await cerrarRun(env, runId, {
    estado: body.estado,
    resultado_resumen: typeof body.resumen === "string" ? body.resumen.slice(0, 2000) : null,
    filas: Number.isFinite(body.filas) ? body.filas : null,
    error: typeof body.error === "string" ? body.error.slice(0, 2000) : null,
    duracion_ms: Number.isFinite(body.duracion_ms) ? body.duracion_ms : null,
    parametros: body.parametros ?? null,
  });

  return json({ ok: true }, 200);
}
