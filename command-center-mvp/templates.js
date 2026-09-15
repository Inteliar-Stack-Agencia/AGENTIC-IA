// templates.js — funciones puras de render. Reciben datos ya calculados por app.js
// y devuelven HTML string. No leen ni modifican estado, no hacen fetch.

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function money(n) {
  return "$" + Number(n || 0).toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function initials(nombre) {
  return nombre.slice(0, 2).toUpperCase();
}

// ── Nav ──────────────────────────────────────────────────────────────
function renderNav(screens, activeScreen, badges) {
  return screens.map(s => `
    <button class="nav-item ${s.id === activeScreen ? "active" : ""}" data-action="goto" data-screen="${s.id}">
      <span class="dot"></span>
      <span class="label">${escapeHtml(s.label)}</span>
      ${badges[s.id] ? `<span class="badge">${badges[s.id]}</span>` : ""}
    </button>
  `).join("");
}

// ── Mando (orbital) ──────────────────────────────────────────────────
function renderMando(state, STATUS_META) {
  const nodesHtml = state.agents.map(a => {
    const meta = STATUS_META[a.status];
    return `
    <div class="agent-node" data-code="${a.code}" style="left:0;top:0;">
      <button class="agent-btn dir-normal" data-action="open-agent" data-code="${a.code}">
        <div class="agent-avatar-wrap">
          <div class="agent-halo"></div>
          <div class="agent-ring-bg"></div>
          <div class="agent-avatar" style="border-color:${meta.color}">${initials(a.nombre)}</div>
          <div class="agent-status-dot-wrap"><div class="agent-status-dot" style="background:${meta.color}"></div></div>
        </div>
        <div class="agent-label">
          <div class="agent-code">${a.code}${a.real ? " ●" : ""}</div>
          <div class="agent-client">${escapeHtml(a.cliente || "—")}</div>
        </div>
      </button>
      ${state.hoveredAgent === a.code ? renderTooltip(a, meta) : ""}
    </div>`;
  }).join("");

  return `
  <div class="mando-grid">
    <div class="stage-section">
      <div class="stage" id="stage">
        <svg class="orbit-lines" id="orbitLines"></svg>
        ${nodesHtml}
        <div class="core-halo"><div class="core-halo-ring"></div></div>
        <div class="core-node">
          <div class="core-label">Núcleo</div>
          <div class="core-title">INTELIAR</div>
          <div class="core-bar"></div>
          <div class="core-desc">Orquestador de tareas</div>
          <div class="core-stats">
            <div><div class="core-stat-val">${state.agents.filter(a => a.status === "trabajando").length}</div><div class="core-stat-lbl">Activos</div></div>
            <div><div class="core-stat-val">${state.approvals.length}</div><div class="core-stat-lbl">Pend.</div></div>
            <div><div class="core-stat-val">${state.agents.filter(a => a.real).length}</div><div class="core-stat-lbl">Reales</div></div>
          </div>
        </div>
        <div class="legend">
          <div class="legend-item"><span class="legend-dot" style="background:${STATUS_META.trabajando.color}"></span>Trabajando</div>
          <div class="legend-item"><span class="legend-dot" style="background:${STATUS_META.aprobacion.color}"></span>Aprobación</div>
          <div class="legend-item"><span class="legend-dot" style="background:${STATUS_META.programado.color}"></span>Programado</div>
          <div class="legend-item"><span class="legend-dot" style="background:${STATUS_META.pausado.color}"></span>Pausado</div>
          <div class="legend-item"><span class="legend-dot" style="background:${STATUS_META.error.color}"></span>Error</div>
        </div>
      </div>
      <div class="dispatch-panel">
        <div class="dispatch-head">
          <div class="dispatch-title">Despachar tarea al núcleo</div>
          <div class="dispatch-rule"></div>
        </div>
        <div class="chat-scroll" id="chatScroll">
          ${state.chat.map(renderChatRow).join("") || `<div class="chat-row"><div class="chat-who">NÚCLEO</div><div class="chat-body"><div class="chat-text">Escribí una tarea, por ejemplo: "pedidos de Argentina Valores desde 10/09/2026".</div></div></div>`}
        </div>
        <div class="dispatch-input-row">
          <input class="dispatch-input" id="dispatchInput" placeholder="Escribí una tarea..." value="${escapeHtml(state.draftText || "")}" />
          <button class="dispatch-send" data-action="send-dispatch">Enviar</button>
        </div>
      </div>
    </div>
    <div class="mando-aside">
      <div class="aside-head">Aprobaciones<span class="count">${state.approvals.length}</span></div>
      <div class="approvals-scroll">
        ${state.approvals.length ? state.approvals.map(renderApprovalItem).join("") : `<div class="approval-item"><div class="approval-text">Sin aprobaciones pendientes.</div></div>`}
      </div>
      <div class="aside-head">Actividad reciente</div>
      <div class="feed-scroll">
        ${state.feed.slice(0, 30).map(renderFeedItem).join("") || `<div class="feed-item"><div class="feed-line"><div class="feed-time"></div><div class="feed-text">Sin actividad todavía.</div></div></div>`}
      </div>
    </div>
  </div>`;
}

function renderTooltip(a, meta) {
  return `
  <div class="agent-tooltip below">
    <div class="tt-head"><div class="tt-code">${a.code}</div><div class="tt-status" style="color:${meta.color}">${meta.label}</div></div>
    <div class="tt-role">${escapeHtml(a.rol)}</div>
    <div class="tt-step">${escapeHtml(a.tarea || "Sin tarea asignada")}${a.paso ? " — " + escapeHtml(a.paso) : ""}</div>
    <div class="tt-bar-track"><div class="tt-bar-fill" style="width:${a.progress || 0}%;background:${meta.color}"></div></div>
    <div class="tt-hint">Click para ver ficha completa</div>
  </div>`;
}

function renderChatRow(m) {
  return `
  <div class="chat-row">
    <div class="chat-who">${escapeHtml(m.who)}</div>
    <div class="chat-body">
      <div class="chat-text">${escapeHtml(m.text)}</div>
      <div class="chat-meta">${m.time}</div>
    </div>
  </div>`;
}

function renderApprovalItem(ap) {
  return `
  <div class="approval-item">
    <div class="approval-row">
      <div class="approval-agent">${ap.agent}</div>
      <div class="approval-client">${escapeHtml(ap.cliente)}</div>
      <div class="approval-time">${ap.time}</div>
    </div>
    <div class="approval-text">${escapeHtml(ap.texto)}</div>
    <div class="approval-rule">${escapeHtml(ap.regla)}</div>
    <div class="approval-actions">
      <button class="btn-approve" data-action="decide-approval" data-id="${ap.id}" data-decision="approve">Aprobar</button>
      <button class="btn-reject" data-action="decide-approval" data-id="${ap.id}" data-decision="reject">Rechazar</button>
    </div>
  </div>`;
}

function renderFeedItem(f) {
  return `
  <div class="feed-item">
    <div class="feed-head"><span class="feed-dot" style="background:${f.color}"></span><span class="feed-agent">${f.agent}</span><span class="feed-client">${escapeHtml(f.cliente || "")}</span></div>
    <div class="feed-line"><div class="feed-time">${f.time}</div><div class="feed-text">${escapeHtml(f.text)}</div></div>
  </div>`;
}

// ── Ficha de agente ──────────────────────────────────────────────────
function renderAgente(a, meta, STORES) {
  return `
  <div class="agente-grid">
    <div class="agente-main">
      <button class="back-btn" data-action="goto" data-screen="mando">← Volver al centro de mando</button>
      <div class="agente-header">
        <div class="agente-avatar-lg" style="border-color:${meta.color}">${initials(a.nombre)}</div>
        <div>
          <div class="agente-name-row">
            <h2>${a.nombre}</h2>
            <div class="status-pill"><span class="dot" style="background:${meta.color}"></span><span class="lbl">${meta.label}</span></div>
            ${a.real ? `<span class="real-badge">● capacidad real</span>` : ""}
          </div>
          <div class="agente-role">${escapeHtml(a.rol)}</div>
          <div class="agente-actions">
            ${a.status === "pausado"
              ? `<button class="btn-accent" data-action="resume-agent" data-code="${a.code}">Reanudar</button>`
              : `<button class="btn-ghost" data-action="pause-agent" data-code="${a.code}">Pausar</button>`}
          </div>
        </div>
      </div>

      <div class="metrics-row">
        <div class="metric-cell"><div class="metric-lbl">Cliente</div><div class="metric-val">${escapeHtml(a.cliente || "—")}</div></div>
        <div class="metric-cell"><div class="metric-lbl">Progreso</div><div class="metric-val">${a.progress || 0}%</div></div>
        <div class="metric-cell"><div class="metric-lbl">Herramientas</div><div class="metric-val">${a.tools.length}</div></div>
        <div class="metric-cell"><div class="metric-lbl">Tipo</div><div class="metric-val">${a.real ? "Real" : "Simulado"}</div></div>
        <div class="metric-cell"><div class="metric-lbl">Tareas hoy</div><div class="metric-val">${a.log.length}</div></div>
      </div>

      <div class="section-head"><div class="lbl">Tarea actual</div><div class="rule"></div></div>
      <div class="task-box">
        <div class="task-title">${escapeHtml(a.tarea || "Sin tarea asignada")}</div>
        <div class="task-bar-track"><div class="task-bar-fill" style="width:${a.progress || 0}%;background:${meta.color}"></div></div>
        <div class="task-meta-row"><span>${escapeHtml(a.paso || "—")}</span><span>${meta.label}</span></div>
      </div>

      ${a.real ? renderPedidosConfig(STORES) : ""}
      ${a.lastResult ? renderResultBox(a.lastResult) : ""}
    </div>
    <div class="agente-aside">
      <div class="aside-head">Registro de actividad</div>
      <div class="log-scroll">
        ${a.log.length ? a.log.slice().reverse().map(l => `<div class="log-row"><div class="log-time">${l.time}</div><div class="log-text">${escapeHtml(l.text)}</div></div>`).join("") : `<div class="log-row"><div class="log-time"></div><div class="log-text">Sin registros todavía.</div></div>`}
      </div>
      <div class="tools-box">
        <div class="tools-title">Herramientas asignadas</div>
        <div class="tools-wrap">
          ${a.tools.length ? a.tools.map(t => `<span class="tool-chip ${a.real ? "" : "disabled"}">${escapeHtml(t)}</span>`).join("") : `<span class="tool-chip disabled">Ninguna asignada</span>`}
        </div>
      </div>
    </div>
  </div>`;
}

function renderPedidosConfig(STORES) {
  return `
  <div class="section-head"><div class="lbl">Configuración de la herramienta</div><div class="rule"></div></div>
  <div class="config-bar" style="border:2px solid var(--line);padding:14px;">
    <span class="lbl">Tienda</span>
    <select id="cfgStore" data-action="set-store">
      ${STORES.map(s => `<option value="${s.id}">${escapeHtml(s.nombre)}</option>`).join("")}
    </select>
    <span class="lbl" style="margin-left:auto">Clave del agente: en el server (Cloudflare), no en el navegador</span>
  </div>`;
}

function renderResultBox(r) {
  return `
  <div class="result-box">
    <div class="result-title">Último resultado real — ${escapeHtml(r.companyName)}</div>
    <div class="result-row"><span>Pedidos encontrados</span><span>${r.count}</span></div>
    <div class="result-row"><span>Líneas de producto</span><span>${r.rows.length}</span></div>
    <div class="result-row"><span>Total</span><span>${money(r.totalGeneral)}</span></div>
    <div class="result-actions">
      <button class="btn-ghost" data-action="download-excel">Descargar Excel</button>
    </div>
  </div>`;
}

// ── Aprobaciones (pantalla completa) ────────────────────────────────
function renderAprobaciones(state) {
  return `
  <div class="aprob-page">
    <div class="aprob-banner">
      <div>
        <div class="aprob-banner-title">Aprobaciones</div>
        <p class="aprob-banner-desc">Tareas que un empleado digital dejó esperando una decisión humana antes de seguir. Esto es simulado excepto cuando el empleado tiene una capacidad real asignada.</p>
      </div>
      <div class="aprob-stats">
        <div><div class="aprob-stat-val">${state.approvals.length}</div><div class="aprob-stat-lbl">Pendientes</div></div>
      </div>
    </div>
    <div class="aprob-cards">
      ${state.approvals.length ? state.approvals.map(ap => `
        <div class="aprob-card">
          <div class="approval-row"><div class="approval-agent">${ap.agent}</div><div class="approval-client">${escapeHtml(ap.cliente)}</div><div class="approval-time">${ap.time}</div></div>
          <div class="aprob-detail">${escapeHtml(ap.texto)}</div>
          <div class="approval-rule">${escapeHtml(ap.regla)}</div>
          <div class="approval-actions">
            <button class="btn-approve" data-action="decide-approval" data-id="${ap.id}" data-decision="approve">Aprobar</button>
            <button class="btn-reject" data-action="decide-approval" data-id="${ap.id}" data-decision="reject">Rechazar</button>
          </div>
        </div>`).join("") : `<div class="empty-box">No hay aprobaciones pendientes.</div>`}
    </div>
  </div>`;
}

// ── Actividad ────────────────────────────────────────────────────────
function renderActividad(state) {
  return `
  <div class="actividad-page">
    <div class="act-head-row"><div>Hora</div><div>Empleado</div><div>Acción</div><div>Cliente</div><div>Resultado</div></div>
    ${state.feed.length ? state.feed.map(f => `
      <div class="act-row">
        <div class="act-time">${f.time}</div>
        <div class="act-agent">${f.agent}</div>
        <div class="act-action">${escapeHtml(f.text)}</div>
        <div class="act-client">${escapeHtml(f.cliente || "—")}</div>
        <div class="act-result" style="color:${f.color}">${f.resultLabel}</div>
      </div>`).join("") : `<div class="empty-box">Sin actividad registrada todavía.</div>`}
  </div>`;
}

// ── Programadas ──────────────────────────────────────────────────────
function renderProgramadas(state, AGENT_CODES) {
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  return `
  <div class="prog-page">
    <div class="week-grid">
      ${dias.map((d, i) => `
        <div class="day-col">
          <div class="day-head"><span class="day-name">${d}</span></div>
          ${state.scheduled.filter(s => s.day === i).map(s => `
            <div class="day-item">
              <div class="day-item-time">${s.time}</div>
              <div class="day-item-title">${escapeHtml(s.title)}</div>
              <div class="day-item-agent">${s.agent}</div>
            </div>`).join("") || ""}
        </div>`).join("")}
    </div>
    <div class="prog-form">
      <div class="field-label">Empleado
        <select class="field-input" id="progAgent">${AGENT_CODES.map(c => `<option value="${c}">${c}</option>`).join("")}</select>
      </div>
      <div class="field-row">
        <label class="field-label">Día
          <select class="field-input" id="progDay">${dias.map((d, i) => `<option value="${i}">${d}</option>`).join("")}</select>
        </label>
        <label class="field-label">Hora
          <input class="field-input" type="time" id="progTime" value="09:00" />
        </label>
      </div>
      <label class="field-label">Tarea
        <input class="field-input" type="text" id="progTitle" placeholder="Ej: seguimiento a leads fríos" />
      </label>
      <button class="btn-accent" data-action="add-scheduled">Programar</button>
    </div>
  </div>`;
}

// ── Contratar ────────────────────────────────────────────────────────
function renderContratar(state) {
  const roles = ["Cobranzas", "Atención telefónica", "Inventario", "Compras", "Redes sociales"];
  const perms = [
    { key: "leer", nombre: "Leer datos", nota: "Puede consultar información existente (pedidos, stock, clientes)." },
    { key: "escribir", nombre: "Escribir datos", nota: "Puede crear o modificar registros." },
    { key: "mensajes", nombre: "Enviar mensajes", nota: "Puede responder por WhatsApp/email en nombre de la tienda." },
    { key: "pagos", nombre: "Ejecutar pagos", nota: "Puede mover dinero — requiere máxima supervisión." },
  ];
  const autonomy = [
    { key: "supervisado", nombre: "Supervisado", nota: "Cada acción pasa por aprobación humana." },
    { key: "semi", nombre: "Semi-autónomo", nota: "Aprobación solo para acciones sensibles." },
    { key: "autonomo", nombre: "Autónomo", nota: "Actúa solo, reporta después." },
  ];
  const h = state.hireForm;
  return `
  <div class="contratar-page">
    <div>
      <div class="contratar-intro">
        <h2>Contratar empleado digital</h2>
        <p>Esta pantalla es una simulación de diseño: define nombre, permisos y nivel de autonomía, pero en esta etapa no crea un empleado con capacidad real — solo PEDIDOS está conectado a una herramienta real hoy.</p>
      </div>
      <div class="contratar-form-row">
        <label class="field-label">Rol
          <select class="field-input" id="hireRole">${roles.map(r => `<option ${h.role === r ? "selected" : ""}>${r}</option>`).join("")}</select>
        </label>
        <label class="field-label">Cliente asignado
          <input class="field-input" id="hireClient" type="text" value="${escapeHtml(h.client)}" placeholder="Ej: Morfi La Plata" />
        </label>
      </div>
      <div class="section-head"><div class="lbl">Permisos</div><div class="rule"></div></div>
      <div class="perm-grid">
        ${perms.map(p => `
          <button class="perm-item" data-action="toggle-perm" data-key="${p.key}">
            <span class="perm-box ${h.perms.includes(p.key) ? "on" : ""}"></span>
            <span><span class="perm-name">${p.nombre}</span><br/><span class="perm-note">${p.nota}</span></span>
          </button>`).join("")}
      </div>
      <div class="section-head"><div class="lbl">Nivel de autonomía</div><div class="rule"></div></div>
      <div class="autonomy-row">
        ${autonomy.map(o => `
          <button class="autonomy-opt ${h.autonomy === o.key ? "on" : ""}" data-action="set-autonomy" data-key="${o.key}">
            <span class="nm">${o.nombre}</span><span class="nt">${o.nota}</span>
          </button>`).join("")}
      </div>
      <div style="margin-top:20px;"><button class="btn-accent" data-action="submit-hire">Crear empleado (simulado)</button></div>
    </div>
    <div class="preview-card">
      <div class="preview-label">Vista previa</div>
      <div class="preview-avatar">${initials(h.role || "??")}</div>
      <div class="preview-row"><span>Rol</span><span>${escapeHtml(h.role)}</span></div>
      <div class="preview-row"><span>Cliente</span><span>${escapeHtml(h.client || "—")}</span></div>
      <div class="preview-row"><span>Permisos</span><span>${h.perms.length}</span></div>
      <div class="preview-row"><span>Autonomía</span><span>${h.autonomy}</span></div>
      <div class="preview-status">Al confirmar queda como tarjeta simulada, sin herramienta real conectada.</div>
    </div>
  </div>`;
}
