// tools.js — capa de herramientas reales.
// Cada capacidad real del sistema (hoy solo PEDIDOS) se agrega acá como una entrada
// nueva en TOOLS, sin tocar app.js ni templates.js. Nada en este archivo simula nada:
// si falla, falla de verdad (red, 401, 502, etc.) y el error sube tal cual.
//
// El llamado va contra /api/* — Pages Functions de este mismo proyecto — y no contra
// Supabase directo: la Edge Function no acepta este origin por CORS, y su clave
// (x-agent-key) no puede estar en el navegador. Ver functions/api/pedidos.js.

const STORES = [
  { id: "c6bdba04-6b9c-4762-981e-3314164e4a66", nombre: "Morfi Viandas CABA" },
  { id: "205ccbd8-b51b-4304-a080-f4ea948cc4c2", nombre: "Morfi La Plata" },
  { id: "a03c7916-6239-4904-863d-32cb11164cf6", nombre: "Morfi Empresas" },
  { id: "b04bdc13-2862-437b-a276-050155e895ef", nombre: "Gaucho Natural Pet" },
];

const TOOLS = {
  // No consulta datos: traduce lenguaje natural a una consulta estructurada.
  // Ver functions/api/interpretar.js.
  interpretar: {
    key: "interpretar",
    async call({ texto, storeId }) {
      const res = await fetch("/api/interpretar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, storeId }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Respuesta inválida del intérprete (HTTP ${res.status}).`);
      }
      if (!res.ok) throw new Error(data.error || `Error HTTP ${res.status}`);
      return data;
    },
  },

  clientes: {
    key: "get-company-clients",
    async call({ storeId, incluirInactivas }) {
      if (!storeId) throw new Error("Falta elegir la tienda.");

      const params = new URLSearchParams({ store_id: storeId });
      if (incluirInactivas) params.set("include_inactive", "true");

      const res = await fetch(`/api/clientes?${params.toString()}`);
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Respuesta inválida del servidor (HTTP ${res.status}).`);
      }
      if (!res.ok) throw new Error(data.error || `Error HTTP ${res.status}`);
      return data;
    },
  },

  pedidos: {
    key: "get-company-orders",
    async call({ storeId, companyName, from, to }) {
      if (!storeId) throw new Error("Falta elegir la tienda.");
      if (!companyName) throw new Error("Falta el nombre de la empresa.");

      const params = new URLSearchParams({ store_id: storeId, company_name: companyName });
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const res = await fetch(`/api/pedidos?${params.toString()}`);
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(`Respuesta inválida del servidor (HTTP ${res.status}).`);
      }
      if (!res.ok) throw new Error(data.error || `Error HTTP ${res.status}`);
      return data;
    },
  },
};
