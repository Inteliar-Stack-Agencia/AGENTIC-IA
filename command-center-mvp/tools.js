// tools.js — capa de herramientas reales.
// Cada capacidad real del sistema (hoy solo PEDIDOS) se agrega acá como una entrada
// nueva en TOOLS, sin tocar app.js ni templates.js. Nada en este archivo simula nada:
// si falla, falla de verdad (red, CORS, 401, etc.) y el error sube tal cual.

const SUPABASE_FUNCTIONS_URL = "https://pjrhfbhqdbyoljactdkj.supabase.co/functions/v1";

const STORES = [
  { id: "c6bdba04-6b9c-4762-981e-3314164e4a66", nombre: "Morfi Viandas CABA" },
  { id: "205ccbd8-b51b-4304-a080-f4ea948cc4c2", nombre: "Morfi La Plata" },
  { id: "a03c7916-6239-4904-863d-32cb11164cf6", nombre: "Morfi Empresas" },
  { id: "b04bdc13-2862-437b-a276-050155e895ef", nombre: "Gaucho Natural Pet" },
];

const TOOLS = {
  pedidos: {
    key: "get-company-orders",
    async call({ storeId, companyName, from, to, agentKey }) {
      if (!agentKey) throw new Error("Falta la clave del agente (x-agent-key).");
      if (!storeId) throw new Error("Falta elegir la tienda.");
      if (!companyName) throw new Error("Falta el nombre de la empresa.");

      const params = new URLSearchParams({ store_id: storeId, company_name: companyName, limit: "200" });
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/get-company-orders?${params.toString()}`, {
        headers: { "x-agent-key": agentKey },
      });
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
