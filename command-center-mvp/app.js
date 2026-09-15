// app.js — estado central, ruteo Núcleo → empleado, y la única integración real
// de esta etapa: PEDIDOS ejecutando get-company-orders. Todo lo demás es simulado
// a propósito (ver plan). tools.js expone STORES y TOOLS; templates.js expone
// las funciones render*.

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

// ── Estado de los 9 empleados ───────────────────────────────────────
// PEDIDOS es la única capacidad real de esta etapa. CAJA queda reservado
// para facturación/finanzas a futuro (no se le asigna PEDIDOS ni ninguna
// otra herramienta todavía). Los otros 7 son mocks visuales, igual que en
// el prototipo original.
const state = {
  screen: "mando",
  hoveredAgent: null,
  draftText: "",
  chat: [],
  feed: [],
  approvals: [
    {
      id: "ap1", agent: "MARKETING", cliente: "Morfi Viandas CABA",
      texto: "Aprobar copy de campaña de fin de semana antes de publicar en Instagram.",
      regla: "Requiere aprobación humana: contenido público", time: nowLabel(),
    },
  ],
  scheduled: [
    { day: 0, time: "09:00", title: "Seguimiento a leads fríos", agent: "VENTAS" },
    { day: 2, time: "14:00", title: "Publicar aviso de búsqueda", agent: "RRHH" },
  ],
  hireForm: { role: "Cobranzas", client: "", perms: ["leer"], autonomy: "supervisado" },
  config: {
    storeId: localStorage.getItem("cc_store_id") || STORES[2].id,
    agentKey: localStorage.getItem("cc_agent_key") || "",
  },
  agents: [
    { code: "PEDIDOS", nombre: "Pedidos", rol: "Consulta y análisis de pedidos por empresa (get-company-orders)", cliente: "Morfi Empresas", status: "inactivo", progress: 0, tarea: null, paso: null, tools: ["get-company-orders"], real: true, log: [], lastResult: null },
    { code: "CAJA", nombre: "Caja", rol: "Reservado — futuras capacidades de facturación y finanzas", cliente: "—", status: "inactivo", progress: 0, tarea: null, paso: null, tools: [], real: false, log: [], lastResult: null },
    { code: "SOPORTE", nombre: "Soporte", rol: "Atención por WhatsApp y resolución de consultas", cliente: "Gaucho Natural Pet", status: "trabajando", progress: 62, tarea: "Respondiendo consultas de stock", paso: "Redactando respuesta 4/7", tools: ["whatsapp-api (mock)"], real: false, log: [], lastResult: null },
    { code: "MARKETING", nombre: "Marketing", rol: "Campañas y contenido en redes", cliente: "Morfi Viandas CABA", status: "aprobacion", progress: 100, tarea: "Campaña de fin de semana", paso: "Esperando aprobación de copy", tools: ["meta-ads (mock)"], real: false, log: [], lastResult: null },
    { code: "VENTAS", nombre: "Ventas", rol: "Seguimiento comercial y cotizaciones", cliente: "Morfi La Plata", status: "programado", progress: 0, tarea: "Enviar seguimiento a leads fríos", paso: "Programado para mañana 09:00", tools: ["crm (mock)"], real: false, log: [], lastResult: null },
    { code: "RRHH", nombre: "RRHH", rol: "Reclutamiento y onboarding", cliente: "Inteliar Stack", status: "pausado", progress: 35, tarea: "Búsqueda de repartidor CABA", paso: "Pausado por el usuario", tools: ["ats (mock)"], real: false, log: [], lastResult: null },
    { code: "LEGAL", nombre: "Legal", rol: "Contratos y compliance", cliente: "—", status: "inactivo", progress: 0, tarea: null, paso: null, tools: ["docs (mock)"], real: false, log: [], lastResult: null },
    { code: "DATOS", nombre: "Datos", rol: "Analítica e informes internos", cliente: "Morfi Empresas", status: "trabajando", progress: 28, tarea: "Armando informe semanal de ventas", paso: "Cruzando datos de Cierre de Stock", tools: ["sql (mock)"], real: false, log: [], lastResult: null },
    { code: "OPS", nombre: "Ops", rol: "Operaciones y logística de despacho", cliente: "Morfi Viandas CABA", status: "error", progress: 0, tarea: "Sincronizar rutas de reparto", paso: "Error: token de mapa vencido", tools: ["maps-api (mock)"], real: false, log: [], lastResult: null },
  ],
};

function getAgent(code) { return state.agents.find(a => a.code === code); }

// ── Ruteo por palabras clave (mismo patrón que ROUTES del prototipo) ─
const ROUTES = [
  ["PEDIDOS", ["pedido", "pedidos", "compra", "compras", "orden", "ordenes", "órdenes", "factura", "facturas", "empresa"]],
  ["CAJA", ["caja", "cobranza", "cobro", "pago", "pagos", "finanzas", "facturacion", "facturación"]],
  ["SOPORTE", ["whatsapp", "consulta", "soporte", "reclamo"]],
  ["MARKETING", ["campaña", "campana", "marketing", "redes", "instagram", "publicidad"]],
  ["VENTAS", ["venta", "ventas", "lead", "leads", "cotizacion", "cotización"]],
  ["RRHH", ["rrhh", "recursos humanos", "reclutamiento", "busqueda", "búsqueda", "contratar personal"]],
  ["LEGAL", ["contrato", "legal", "compliance", "terminos", "términos"]],
  ["DATOS", ["informe", "reporte", "analitica", "analítica", "dashboard"]],
  ["OPS", ["despacho", "logistica", "logística", "ruta", "reparto", "entrega"]],
];

function normalize(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function routeTask(text) {
  const t = normalize(text);
  for (const [code, keywords] of ROUTES) {
    if (keywords.some(k => t.includes(normalize(k)))) return code;
  }
  return null;
}

// ── Parseo simple de "pedidos de <empresa> desde <fecha> hasta <fecha>" ──
// Heurística para la demo del chat, no NLP real: la búsqueda por formulario
// (como en empleado-digital-mvp) sigue siendo la vía confiable.
function toISO(d, m, y) {
  if (y.length === 2) y = "20" + y;
  return `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function parseOrderQuery(text) {
  const dateRe = /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/g;
  const dates = [...text.matchAll(dateRe)].map(m => toISO(m[1], m[2], m[3]));
  const clean = text
    .replace(dateRe, " ")
    .replace(/\b(pedidos?|traeme|necesito|quiero|consulta|consultar|dame|de|del|desde|hasta|entre|el|la|los|las|facturas?|compras?|ordenes|órdenes|y)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return { companyName: clean, from: dates[0] || null, to: dates[1] || null };
}

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
  return { companyName: data.company_name || companyName, count: data.count || 0, rows, totalGeneral };
}

async function runPedidosTask(agent, text) {
  const { companyName, from, to } = parseOrderQuery(text);
  if (!companyName) {
    addChat("PEDIDOS", 'No pude identificar la empresa. Probá: "pedidos de Argentina Valores desde 10/09/2026".');
    return;
  }
  if (!state.config.agentKey) {
    addChat("PEDIDOS", "Falta la clave del agente (x-agent-key). Abrí la ficha de PEDIDOS y pegala en Configuración.");
    return;
  }

  agent.status = "trabajando";
  agent.progress = 15;
  agent.tarea = `Consultando pedidos de ${companyName}`;
  agent.paso = "Llamando a get-company-orders...";
  pushLog(agent, `Consultando get-company-orders (empresa: "${companyName}"${from ? `, desde ${from}` : ""}${to ? `, hasta ${to}` : ""}).`);
  render();

  try {
    const data = await TOOLS.pedidos.call({ storeId: state.config.storeId, companyName, from, to, agentKey: state.config.agentKey });
    const result = buildPedidosResult(data, companyName);
    agent.progress = 100;
    agent.status = "completado";
    agent.lastResult = result;
    agent.paso = `Completado — ${result.count} pedido(s)`;
    pushLog(agent, `${result.count} pedido(s) encontrados para "${result.companyName}". Total ${money(result.totalGeneral)}.`);
    pushFeed(agent, `Encontró ${result.count} pedido(s) de ${result.companyName} (${money(result.totalGeneral)}).`, "ok");
    addChat("PEDIDOS", `Encontré ${result.count} pedido(s) de ${result.companyName}${from ? " desde " + from : ""}. Total: ${money(result.totalGeneral)}. Podés ver el detalle y descargar el Excel en su ficha.`);
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

// ── Tareas mock (los otros 7 empleados, y CAJA sin herramienta) ─────
function runMockTask(agent, text) {
  agent.status = "trabajando";
  agent.progress = 5;
  agent.tarea = text.length > 70 ? text.slice(0, 70) + "…" : text;
  agent.paso = "Procesando (simulado)...";
  pushLog(agent, `Tomó la tarea: "${text}".`);
  addChat(agent.code, `Tomé la tarea. Este empleado todavía no tiene una herramienta real conectada — esto es una simulación de comportamiento, no una acción de verdad.`);

  setTimeout(() => {
    agent.progress = 100;
    agent.status = "completado";
    agent.paso = "Completado (simulado)";
    pushLog(agent, "Tarea completada (simulada).");
    pushFeed(agent, `Completó (simulado): ${agent.tarea}`, "ok");
    render();
    setTimeout(() => {
      if (agent.status === "completado") { agent.status = "inactivo"; agent.progress = 0; render(); }
    }, 5000);
  }, 3500);
}

async function handleDispatch(text) {
  text = text.trim();
  if (!text) return;
  addChat("Vos", text);
  state.draftText = "";

  const code = routeTask(text);
  if (!code) {
    addChat("NÚCLEO", 'No identifiqué a qué empleado corresponde. Probá mencionar "pedidos", "campaña", "soporte", "informe", etc.');
    render();
    return;
  }

  const agent = getAgent(code);
  if (code === "CAJA") {
    addChat("CAJA", "Todavía no tengo ninguna herramienta real asignada en esta etapa — quedo reservado para futuras capacidades de facturación y finanzas.");
    render();
    return;
  }

  render();
  if (agent.real) {
    await runPedidosTask(agent, text);
  } else {
    runMockTask(agent, text);
  }
  render();
}

// ── Layout orbital (posiciona los 9 nodos alrededor del núcleo) ─────
function layoutOrbits() {
  const stage = document.getElementById("stage");
  if (!stage) return;
  const rect = stage.getBoundingClientRect();
  const cx = rect.width / 2, cy = rect.height / 2;
  const base = Math.min(rect.width, rect.height) / 2;
  const RADII = { 1: Math.max(120, base * 0.42), 2: Math.max(190, base * 0.65), 3: Math.max(250, base * 0.86) };

  const byRing = { 1: [], 2: [], 3: [] };
  state.agents.forEach(a => byRing[STATUS_META[a.status].ring].push(a));

  const positions = {};
  for (const ring of [1, 2, 3]) {
    const arr = byRing[ring];
    const n = arr.length;
    arr.forEach((a, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / Math.max(n, 1) + ring * 0.15;
      positions[a.code] = { x: cx + RADII[ring] * Math.cos(angle), y: cy + RADII[ring] * Math.sin(angle) };
    });
  }

  document.querySelectorAll(".agent-node").forEach(node => {
    const code = node.dataset.code;
    const p = positions[code];
    if (p) { node.style.left = p.x + "px"; node.style.top = p.y + "px"; }
  });

  const svg = document.getElementById("orbitLines");
  if (svg) {
    svg.innerHTML = state.agents.map(a => {
      const p = positions[a.code];
      const meta = STATUS_META[a.status];
      if (!p) return "";
      return `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" stroke="${meta.color}" stroke-width="1.5" stroke-dasharray="4 6" opacity="${meta.anim ? 0.85 : 0.3}" ${meta.anim ? 'style="animation: dashFlow 1s linear infinite"' : ""}/>`;
    }).join("");
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
  document.getElementById("screenTitle").textContent = selectedAgentCode
    ? getAgent(selectedAgentCode).nombre.toUpperCase()
    : SCREENS.find(s => s.id === state.screen).label.toUpperCase();
  document.getElementById("screenSub").textContent = selectedAgentCode ? "Ficha de empleado digital" : "Vista general";

  document.getElementById("navItems").innerHTML = renderNav(SCREENS, state.screen, { aprobaciones: state.approvals.length || "" });
  document.getElementById("statEmpresas").textContent = new Set(state.agents.map(a => a.cliente).filter(c => c && c !== "—")).size;
  document.getElementById("statAgentes").textContent = state.agents.length;

  const mount = document.getElementById("screen-mount");
  if (selectedAgentCode) {
    mount.innerHTML = renderAgente(getAgent(selectedAgentCode), STATUS_META[getAgent(selectedAgentCode).status], STORES);
    const cfgStore = document.getElementById("cfgStore");
    if (cfgStore) cfgStore.value = state.config.storeId;
    const cfgKey = document.getElementById("cfgAgentKey");
    if (cfgKey) cfgKey.value = state.config.agentKey;
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
  if (e.target.id === "cfgStore") { state.config.storeId = e.target.value; localStorage.setItem("cc_store_id", e.target.value); }
  if (e.target.id === "cfgAgentKey") { state.config.agentKey = e.target.value; localStorage.setItem("cc_agent_key", e.target.value); }
  if (e.target.id === "hireRole") { state.hireForm.role = e.target.value; render(); }
});

// Reloj + pequeño "aliento" del núcleo para que las tareas en curso se sientan vivas
setInterval(() => {
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = nowLabel();
  if (state.screen === "mando" && !selectedAgentCode) {
    let changed = false;
    state.agents.forEach(a => {
      if (a.status === "trabajando" && a.progress < 95 && a.code !== "PEDIDOS") {
        a.progress = Math.min(95, a.progress + Math.floor(Math.random() * 6));
        changed = true;
      }
    });
    if (changed) render();
  }
}, 4000);

render();
