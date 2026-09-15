// app.js — estado central, ruteo del Núcleo vía intérprete, y la única
// integración de datos real:
// PEDIDOS ejecutando get-company-orders. Nada se simula: los empleados sin
// herramienta conectada lo dicen y no hacen nada. tools.js expone STORES y TOOLS;
// templates.js expone las funciones render*.

const STATUS_META = {
  trabajando: { label: "Trabajando", color: "#ec3013", ring: 1, anim: true },
  aprobacion: { label: "Esperando aprobación", color: "#e8b93a", ring: 1, anim: false },
  error: { label: "Error", color: "#e14b4b", ring: 1, anim: false },
  programado: { label: "Programado", color: "#4a9de0", ring: 2, anim: false },
  pausado: { label: "Pausado", color: "#8a8584", ring: 2, anim: false },
  inactivo: { label: "Inactivo", color: "#4a4645", ring: 3, anim: false },
  completado: { label: "Completado", color: "#6fd67a", ring: 1, anim: false },
};

const SCREENS = [
  { id: "mando", label: "Centro de mando" },
  { id: "aprobaciones", label: "Aprobaciones", badgeKey: "approvals" },
  { id: "actividad", label: "Actividad" },
  { id: "programadas", label: "Programadas" },
  { id: "contratar", label: "Contratar" },
];

function nowLabel() {
  return new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// ── Estado ──────────────────────────────────────────────────────────
// Nada de lo que se ve acá está inventado. No hay tareas de ejemplo, ni
// aprobaciones pendientes de mentira, ni actividad simulada: todo lo que
// aparezca en pantalla salió de una ejecución real.
//
// PEDIDOS es la única capacidad real. Los otros son puestos previstos sin
// herramienta conectada — se muestran para saber qué falta, pero no simulan
// trabajo: si se les despacha una tarea, lo dicen y no hacen nada.
const state = {
  screen: "mando",
  hoveredAgent: null,
  draftText: "",
  chat: [],
  feed: [],
  approvals: [],
  scheduled: [],
  hireForm: { role: "Cobranzas", client: "", perms: ["leer"], autonomy: "supervisado" },
  // La clave del agente ya no vive acá: la usa el server en functions/api/pedidos.js.
  config: {
    storeId: localStorage.getItem("cc_store_id") || STORES[0].id,
  },
  // Los 5 puestos salen de un relevamiento de la base: son las únicas áreas con
  // datos reales detrás. MARKETING, RRHH, LEGAL y SOPORTE se eliminaron porque no
  // tienen ninguna tabla que los respalde (bot_feedback y bot_pending_actions
  // están vacías) — no se pueden volver reales, solo simular.
  //
  // `pendiente` nombra la Edge Function que falta construir para ese puesto. No es
  // una aspiración vaga: es el próximo trabajo concreto, contra datos que existen.
  agents: [
    { code: "PEDIDOS", nombre: "Pedidos", rol: "Pedidos por empresa, persona y fecha", datos: "orders · 197 filas", cliente: storeName(localStorage.getItem("cc_store_id") || STORES[0].id), status: "inactivo", progress: 0, tarea: null, paso: null, tools: ["get-company-orders"], pendiente: null, real: true, log: [], lastResult: null },
    { code: "DESPACHOS", nombre: "Despachos", rol: "Qué se despachó a cada empresa y cuándo", datos: "company_dispatches · 240 filas, última el 13/09", cliente: "—", status: "inactivo", progress: 0, tarea: null, paso: null, tools: [], pendiente: "get-company-dispatches", real: false, log: [], lastResult: null },
    { code: "FACTURACION", nombre: "Facturación", rol: "Facturas emitidas por empresa y período", datos: "company_invoices · 30 filas, última el 07/09", cliente: "—", status: "inactivo", progress: 0, tarea: null, paso: null, tools: [], pendiente: "get-company-invoices", real: false, log: [], lastResult: null },
    { code: "GASTOS", nombre: "Gastos", rol: "Gastos y proveedores por período", datos: "expenses · 88 filas · suppliers · 8", cliente: "—", status: "inactivo", progress: 0, tarea: null, paso: null, tools: [], pendiente: "get-expenses", real: false, log: [], lastResult: null },
    { code: "CLIENTES", nombre: "Clientes", rol: "Empresas cliente y sus precios acordados", datos: "company_clients · 11 · company_client_prices · 29", cliente: "—", status: "inactivo", progress: 0, tarea: null, paso: null, tools: [], pendiente: "get-company-clients", real: false, log: [], lastResult: null },
  ],
};

function getAgent(code) { return state.agents.find(a => a.code === code); }

// ── Chat / feed / logs ───────────────────────────────────────────────
function addChat(who, text) {
  state.chat.push({ who, text, time: nowLabel() });
}

function pushLog(agent, text) {
  agent.log.push({ text, time: nowLabel() });
}

function pushFeed(agent, text, kind) {
  const color = kind === "error" ? STATUS_META.error.color : kind === "ok" ? STATUS_META.completado.color : STATUS_META.trabajando.color;
  state.feed.unshift({ agent: agent.code, cliente: agent.cliente, text, time: nowLabel(), color, resultLabel: kind === "error" ? "ERROR" : kind === "ok" ? "OK" : "EN CURSO" });
}

let toastTimer = null;
function showToast(text, sub) {
  const el = document.getElementById("toast");
  document.getElementById("toastText").textContent = text;
  document.getElementById("toastSub").textContent = sub || "";
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 4500);
}

// ── La única tarea real: PEDIDOS → get-company-orders ────────────────
function buildPedidosResult(data, companyName) {
  const rows = [];
  for (const o of data.orders || []) {
    for (const item of o.items || []) {
      rows.push({
        pedido: o.order_number, empleado: (o.customer_name || "").trim(), empresa: o.company_name || "",
        fecha_iso: o.created_at, estado: o.status, producto: item.product_name, cantidad: item.quantity,
        precio_unit: item.unit_price, subtotal: item.subtotal,
      });
    }
  }
  const totalGeneral = rows.reduce((s, r) => s + (r.subtotal || 0), 0);

  // El monto por estado se informa aparte: un pedido `pending` no es plata
  // cobrada, y sumarlo junto con los completados da un número que parece
  // facturación y no lo es.
  const porEstado = {};
  for (const o of data.orders || []) {
    const estado = o.status || "sin estado";
    if (!porEstado[estado]) porEstado[estado] = { pedidos: 0, monto: 0 };
    porEstado[estado].pedidos += 1;
    porEstado[estado].monto += (o.items || []).reduce((s, it) => s + (it.subtotal || 0), 0);
  }

  return { companyName: data.company_name || companyName, count: data.count || 0, rows, totalGeneral, porEstado };
}

async function runPedidosTask(agent, consulta) {
  const companyName = consulta.empresa;
  const from = consulta.desde || null;
  const to = consulta.hasta || null;

  agent.status = "trabajando";
  agent.progress = 15;
  agent.tarea = `Consultando pedidos de ${companyName}`;
  agent.paso = "Llamando a get-company-orders...";
  pushLog(agent, `Consultando get-company-orders (empresa: "${companyName}"${from ? `, desde ${from}` : ""}${to ? `, hasta ${to}` : ""}).`);
  render();

  try {
    const data = await TOOLS.pedidos.call({ storeId: state.config.storeId, companyName, from, to });
    const result = buildPedidosResult(data, companyName);
    agent.progress = 100;
    agent.status = "completado";
    agent.lastResult = result;
    agent.paso = `Completado — ${result.count} pedido(s)`;
    pushLog(agent, `${result.count} pedido(s) encontrados para "${result.companyName}". Total ${money(result.totalGeneral)}.`);
    pushFeed(agent, `Encontró ${result.count} pedido(s) de ${result.companyName} (${money(result.totalGeneral)}).`, "ok");
    const desglose = Object.entries(result.porEstado)
      .map(([estado, v]) => `${v.pedidos} ${estado} (${money(v.monto)})`)
      .join(", ");
    addChat("PEDIDOS", `Encontré ${result.count} pedido(s) de ${result.companyName}${from ? " desde " + from : ""} en ${storeName(state.config.storeId)}, por ${money(result.totalGeneral)}. Por estado: ${desglose}. Podés ver el detalle y descargar el Excel en su ficha.`);
    showToast("PEDIDOS completó la tarea", `${result.count} pedidos de ${result.companyName}`);
    setTimeout(() => {
      if (agent.status === "completado") { agent.status = "inactivo"; agent.progress = 0; render(); }
    }, 7000);
  } catch (err) {
    agent.status = "error";
    agent.paso = `Error: ${err.message}`;
    pushLog(agent, `Error: ${err.message}`);
    pushFeed(agent, `Error consultando pedidos: ${err.message}`, "error");
    addChat("PEDIDOS", `Hubo un error real consultando la herramienta: ${err.message}`);
  }
}

function storeName(id) {
  const s = STORES.find(x => x.id === id);
  return s ? s.nombre : "—";
}

// PEDIDOS consulta la tienda que esté elegida en el selector, no una fija. Si el
// cliente que muestra la ficha no se sincroniza, el panel puede decir una tienda
// mientras la consulta sale contra otra — y los números parecerían de quien no son.
function syncRealAgentClient() {
  const pedidos = getAgent("PEDIDOS");
  if (pedidos) pedidos.cliente = storeName(state.config.storeId);
}

// ── Despacho de tareas ───────────────────────────────────────────────
// Cada herramienta del intérprete corresponde a un empleado.
const HERRAMIENTA_A_AGENTE = {
  pedidos: "PEDIDOS",
  despachos: "DESPACHOS",
  facturacion: "FACTURACION",
  gastos: "GASTOS",
  clientes: "CLIENTES",
};

async function handleDispatch(text) {
  text = text.trim();
  if (!text) return;
  addChat("Vos", text);
  state.draftText = "";
  render();

  let consulta;
  try {
    consulta = await TOOLS.interpretar.call({ texto: text });
  } catch (err) {
    addChat("NÚCLEO", `No pude interpretar el pedido: ${err.message}`);
    render();
    return;
  }

  const code = HERRAMIENTA_A_AGENTE[consulta.herramienta];
  if (!code) {
    addChat("NÚCLEO", consulta.interpretacion || "No identifiqué a qué empleado corresponde este pedido.");
    render();
    return;
  }

  const agent = getAgent(code);
  if (!agent.real) {
    addChat(code, `Entendí el pedido (${consulta.interpretacion}), pero todavía no puedo ejecutarlo: me falta la herramienta "${agent.pendiente}". Los datos existen (${agent.datos}), pero la Edge Function que los expone no está construida. No lo simulo.`);
    render();
    return;
  }

  if (!consulta.empresa) {
    addChat(code, "Entendí que querés consultar pedidos, pero no identifiqué de qué empresa. Decime el nombre y lo busco.");
    render();
    return;
  }

  // Cuando el modelo no está seguro, se muestra qué entendió antes de ejecutar:
  // así un error de interpretación se ve en el chat y no queda escondido atrás
  // de un resultado que parece correcto.
  if (consulta.confianza === "baja") {
    addChat(code, `Interpreté: ${consulta.interpretacion}. Si no es lo que pediste, reformulalo.`);
  }

  await runPedidosTask(agent, consulta);
  render();
}

// ── Layout orbital (posiciona los nodos alrededor del núcleo) ────────
// NODE_HALF_W/H son el medio ancho y alto que ocupa un nodo (avatar + etiqueta):
// el radio máximo se calcula restándolos para que ningún nodo quede cortado por
// el borde del stage, en vez de usar radios fijos que se salen en pantallas chicas.
const NODE_HALF_W = 66, NODE_HALF_H = 62, STAGE_PAD = 18;
let orbitAngle = 0;

function layoutOrbits() {
  const stage = document.getElementById("stage");
  if (!stage) return;
  const rect = stage.getBoundingClientRect();
  const cx = rect.width / 2, cy = rect.height / 2;
  const rMax = Math.max(120, Math.min(
    rect.width / 2 - NODE_HALF_W - STAGE_PAD,
    rect.height / 2 - NODE_HALF_H - STAGE_PAD,
  ));
  const RADII = { 1: rMax * 0.74, 2: rMax * 0.87, 3: rMax };

  const byRing = { 1: [], 2: [], 3: [] };
  state.agents.forEach(a => byRing[STATUS_META[a.status].ring].push(a));

  // Antes cada anillo repartía sus ángulos por separado (empezando siempre
  // arriba), así que agentes de anillos distintos terminaban en la misma
  // dirección y sus nodos se superponían. Ahora se intercalan los anillos
  // y se reparte un único ángulo por agente entre los 9 — nunca dos agentes
  // comparten ni quedan cerca en dirección, sin importar en qué anillo estén.
  const ordered = [];
  const maxLen = Math.max(byRing[1].length, byRing[2].length, byRing[3].length);
  for (let i = 0; i < maxLen; i++) {
    for (const ring of [1, 2, 3]) {
      if (byRing[ring][i]) ordered.push(byRing[ring][i]);
    }
  }

  const positions = {};
  const n = ordered.length;
  ordered.forEach((a, i) => {
    const ring = STATUS_META[a.status].ring;
    const angle = -Math.PI / 2 + orbitAngle + (i * 2 * Math.PI) / Math.max(n, 1);
    positions[a.code] = {
      x: cx + RADII[ring] * Math.cos(angle),
      y: cy + RADII[ring] * Math.sin(angle),
      below: Math.sin(angle) < -0.05,
    };
  });

  document.querySelectorAll(".agent-node").forEach(node => {
    const code = node.dataset.code;
    const p = positions[code];
    if (!p) return;
    node.style.left = p.x + "px";
    node.style.top = p.y + "px";
    // En la mitad de arriba la etiqueta va arriba del avatar y en la de abajo,
    // abajo — así el texto siempre queda del lado de afuera de la órbita.
    const btn = node.querySelector(".agent-btn");
    if (btn) {
      btn.classList.toggle("dir-reverse", p.below);
      btn.classList.toggle("dir-normal", !p.below);
    }
  });

  const svg = document.getElementById("orbitLines");
  if (svg) {
    // Se rearma solo cuando cambia el contenido (render nuevo). En los ticks de
    // rotación se mueven los atributos: si reasignara innerHTML 11 veces por
    // segundo, la animación dashFlow de las líneas arrancaría de cero cada vez.
    if (!svg.dataset.built) {
      svg.innerHTML = [
        ...[1, 2, 3].map(r => `<circle class="orbit-guide" data-ring="${r}" fill="none" stroke="rgba(243,242,242,.14)" stroke-width="1" stroke-dasharray="2 5"/>`),
        ...state.agents.map(a => {
          const meta = STATUS_META[a.status];
          return `<line data-code="${a.code}" stroke="${meta.color}" stroke-width="1.5" stroke-dasharray="4 6" opacity="${meta.anim ? 0.85 : 0.3}" ${meta.anim ? 'style="animation: dashFlow 1s linear infinite"' : ""}/>`;
        }),
      ].join("");
      svg.dataset.built = "1";
    }
    svg.querySelectorAll("circle.orbit-guide").forEach(c => {
      c.setAttribute("cx", cx);
      c.setAttribute("cy", cy);
      c.setAttribute("r", RADII[c.dataset.ring]);
    });
    svg.querySelectorAll("line[data-code]").forEach(line => {
      const p = positions[line.dataset.code];
      if (!p) return;
      line.setAttribute("x1", cx);
      line.setAttribute("y1", cy);
      line.setAttribute("x2", p.x);
      line.setAttribute("y2", p.y);
    });
  }
}

// ── Excel (mismo formato que empleado-digital-mvp) ───────────────────
function downloadExcel(agent) {
  const r = agent.lastResult;
  if (!r || !r.rows.length) return;
  const wb = XLSX.utils.book_new();
  const detalle = [
    ["Pedido", "Empleado", "Empresa", "Fecha", "Estado", "Producto", "Cantidad", "Precio unit.", "Subtotal"],
    ...r.rows.map(x => [`#${x.pedido}`, x.empleado, x.empresa, x.fecha_iso, x.estado, x.producto, x.cantidad, x.precio_unit, x.subtotal]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(detalle), "Detalle");

  const buildResumen = (key, label) => {
    const groups = new Map();
    for (const row of r.rows) {
      const k = row[key] || "(sin dato)";
      if (!groups.has(k)) groups.set(k, { cantidad: 0, subtotal: 0 });
      const g = groups.get(k);
      g.cantidad += row.cantidad; g.subtotal += row.subtotal;
    }
    const sorted = [...groups.entries()].sort((a, b) => b[1].cantidad - a[1].cantidad);
    return XLSX.utils.aoa_to_sheet([[label, "Cantidad", "Subtotal"], ...sorted.map(([k, g]) => [k, g.cantidad, g.subtotal])]);
  };
  XLSX.utils.book_append_sheet(wb, buildResumen("producto", "Producto"), "Resumen por producto");
  XLSX.utils.book_append_sheet(wb, buildResumen("empleado", "Empleado"), "Resumen por empleado");

  const empresa = r.companyName.replace(/[^a-z0-9]+/gi, "_");
  XLSX.writeFile(wb, `${empresa}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// ── Render principal ──────────────────────────────────────────────────
let selectedAgentCode = null;

function render() {
  syncRealAgentClient();
  document.getElementById("screenTitle").textContent = selectedAgentCode
    ? getAgent(selectedAgentCode).nombre.toUpperCase()
    : SCREENS.find(s => s.id === state.screen).label.toUpperCase();
  document.getElementById("screenSub").textContent = selectedAgentCode ? "Ficha de empleado digital" : "Vista general";

  document.getElementById("navItems").innerHTML = renderNav(SCREENS, state.screen, { aprobaciones: state.approvals.length || "" });
  document.getElementById("statEmpresas").textContent = new Set(state.agents.map(a => a.cliente).filter(c => c && c !== "—")).size;
  document.getElementById("statAgentes").textContent = state.agents.length;
  document.getElementById("statReales").textContent = `${state.agents.filter(a => a.real).length} / ${state.agents.length}`;

  const mount = document.getElementById("screen-mount");
  if (selectedAgentCode) {
    mount.innerHTML = renderAgente(getAgent(selectedAgentCode), STATUS_META[getAgent(selectedAgentCode).status], STORES);
    const cfgStore = document.getElementById("cfgStore");
    if (cfgStore) cfgStore.value = state.config.storeId;
  } else if (state.screen === "mando") {
    mount.innerHTML = renderMando(state, STATUS_META);
    layoutOrbits();
    const input = document.getElementById("dispatchInput");
    if (input) { input.focus(); input.selectionStart = input.selectionEnd = input.value.length; }
    const scroll = document.getElementById("chatScroll");
    if (scroll) scroll.scrollTop = scroll.scrollHeight;
  } else if (state.screen === "aprobaciones") {
    mount.innerHTML = renderAprobaciones(state);
  } else if (state.screen === "actividad") {
    mount.innerHTML = renderActividad(state);
  } else if (state.screen === "programadas") {
    mount.innerHTML = renderProgramadas(state, state.agents.map(a => a.code));
  } else if (state.screen === "contratar") {
    mount.innerHTML = renderContratar(state);
  }
}

// ── Eventos (delegados desde #app, no se reatan en cada render) ─────
document.getElementById("app").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const action = btn.dataset.action;

  if (action === "goto") { selectedAgentCode = null; state.hoveredAgent = null; state.screen = btn.dataset.screen; render(); }
  else if (action === "open-agent") { selectedAgentCode = btn.dataset.code; state.hoveredAgent = null; render(); }
  else if (action === "send-dispatch") { const input = document.getElementById("dispatchInput"); handleDispatch(input.value); }
  else if (action === "decide-approval") {
    const ap = state.approvals.find(a => a.id === btn.dataset.id);
    if (!ap) return;
    state.approvals = state.approvals.filter(a => a.id !== ap.id);
    const agent = getAgent(ap.agent);
    if (btn.dataset.decision === "approve") {
      pushFeed(agent, `Aprobado: ${ap.texto}`, "ok");
      if (agent) { agent.status = "inactivo"; agent.progress = 0; agent.paso = "Aprobado por el usuario"; }
      showToast("Aprobación confirmada", ap.agent);
    } else {
      pushFeed(agent, `Rechazado: ${ap.texto}`, "error");
      if (agent) { agent.status = "pausado"; agent.paso = "Rechazado por el usuario"; }
      showToast("Aprobación rechazada", ap.agent);
    }
    render();
  }
  else if (action === "pause-agent") { const a = getAgent(btn.dataset.code); a.status = "pausado"; a.paso = "Pausado por el usuario"; render(); }
  else if (action === "resume-agent") { const a = getAgent(btn.dataset.code); a.status = "inactivo"; a.paso = "Reanudado"; render(); }
  else if (action === "download-excel") { downloadExcel(getAgent(selectedAgentCode)); }
  else if (action === "add-scheduled") {
    const agent = document.getElementById("progAgent").value;
    const day = Number(document.getElementById("progDay").value);
    const time = document.getElementById("progTime").value;
    const title = document.getElementById("progTitle").value.trim();
    if (title) { state.scheduled.push({ day, time, title, agent }); showToast("Tarea programada", `${agent} · ${title}`); render(); }
  }
  else if (action === "toggle-perm") {
    const k = btn.dataset.key;
    const i = state.hireForm.perms.indexOf(k);
    if (i >= 0) state.hireForm.perms.splice(i, 1); else state.hireForm.perms.push(k);
    render();
  }
  else if (action === "set-autonomy") { state.hireForm.autonomy = btn.dataset.key; render(); }
  else if (action === "submit-hire") { showToast("Simulación", "Contratar aún no crea un empleado con capacidad real."); }
});

document.getElementById("app").addEventListener("mouseover", (e) => {
  const node = e.target.closest(".agent-node");
  if (node && state.hoveredAgent !== node.dataset.code) { state.hoveredAgent = node.dataset.code; render(); }
});
document.getElementById("app").addEventListener("mouseout", (e) => {
  const node = e.target.closest(".agent-node");
  if (node && !node.contains(e.relatedTarget)) { state.hoveredAgent = null; render(); }
});

document.getElementById("app").addEventListener("keydown", (e) => {
  if (e.target.id === "dispatchInput" && e.key === "Enter") handleDispatch(e.target.value);
});
document.getElementById("app").addEventListener("input", (e) => {
  if (e.target.id === "dispatchInput") state.draftText = e.target.value;
  if (e.target.id === "hireClient") state.hireForm.client = e.target.value;
});
document.getElementById("app").addEventListener("change", (e) => {
  if (e.target.id === "cfgStore") { state.config.storeId = e.target.value; localStorage.setItem("cc_store_id", e.target.value); render(); }
  if (e.target.id === "hireRole") { state.hireForm.role = e.target.value; render(); }
});

setInterval(() => {
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = nowLabel();
}, 1000);

// Rotación lenta de la órbita (~6 minutos por vuelta). Solo reposiciona los
// nodos, no re-renderiza: si rearmara el HTML perdería el foco del input de
// despacho y el scroll del chat en cada tick.
setInterval(() => {
  if (state.screen !== "mando" || selectedAgentCode) return;
  orbitAngle = (orbitAngle + 0.0016) % (Math.PI * 2);
  layoutOrbits();
}, 90);

window.addEventListener("resize", () => {
  if (state.screen === "mando" && !selectedAgentCode) layoutOrbits();
});

render();
