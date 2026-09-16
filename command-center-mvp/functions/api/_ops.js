// Escritura al registro operativo (Inteliar Ops, proyecto xeqbapfjosgchkhqwzsh).
//
// Datos del agente, no de los clientes: qué se preguntó, qué entendió, qué
// ejecutó y en qué se equivocó. Los datos de negocio siguen viviendo en la base
// de cada cliente.
//
// Regla: registrar nunca puede romper una consulta. Si el registro falla, se
// loguea y se sigue — que el operador no pueda trabajar porque no se pudo
// guardar la traza sería peor que perder la traza.

const OPS_URL = "https://xeqbapfjosgchkhqwzsh.supabase.co/rest/v1";

function headers(env, extra = {}) {
  const key = (env.OPS_SERVICE_KEY || "").trim();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export function opsConfigurado(env) {
  return Boolean((env.OPS_SERVICE_KEY || "").trim());
}

// Crea el registro y devuelve su id, para que quien ejecute después pueda
// completarlo con el resultado. Devuelve null si no se pudo: el id ausente hace
// que los pasos siguientes simplemente no registren, sin romper nada.
export async function abrirRun(env, datos) {
  if (!opsConfigurado(env)) return null;
  try {
    const res = await fetch(`${OPS_URL}/agent_runs`, {
      method: "POST",
      headers: headers(env, { Prefer: "return=representation" }),
      body: JSON.stringify(datos),
    });
    if (!res.ok) {
      console.error("[ops] No se pudo abrir el run:", res.status, await res.text());
      return null;
    }
    const [fila] = await res.json();
    return fila?.id ?? null;
  } catch (err) {
    console.error("[ops] Error abriendo el run:", err.message);
    return null;
  }
}

export async function cerrarRun(env, runId, datos) {
  if (!runId || !opsConfigurado(env)) return;
  try {
    const res = await fetch(`${OPS_URL}/agent_runs?id=eq.${encodeURIComponent(runId)}`, {
      method: "PATCH",
      headers: headers(env, { Prefer: "return=minimal" }),
      body: JSON.stringify(datos),
    });
    if (!res.ok) console.error("[ops] No se pudo cerrar el run:", res.status, await res.text());
  } catch (err) {
    console.error("[ops] Error cerrando el run:", err.message);
  }
}

export async function guardarFeedback(env, { runId, correcto, comentario }) {
  if (!opsConfigurado(env)) throw new Error("Falta configurar OPS_SERVICE_KEY en Cloudflare Pages.");
  const res = await fetch(`${OPS_URL}/agent_feedback`, {
    method: "POST",
    headers: headers(env, { Prefer: "return=minimal" }),
    body: JSON.stringify({ run_id: runId, correcto, comentario: comentario || null }),
  });
  if (!res.ok) throw new Error(`No se pudo guardar el feedback: ${res.status} ${await res.text()}`);
}
