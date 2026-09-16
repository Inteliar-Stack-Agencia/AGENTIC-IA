// Lista de tiendas de VendexChat. Copia server-side de la misma lista que vive
// en tools.js (STORES) — no se pueden compartir directo porque tools.js corre
// en el navegador como script plano y esto corre como Pages Function (módulo
// ES). Si se agrega o renombra una tienda, actualizar las dos.
// `claves` son las palabras que, si aparecen en el texto, identifican esa
// tienda. Deterministico y no vía modelo a propósito: son solo 4 opciones fijas
// (no un catálogo que crece como el de empresas), así que resolverlas a mano es
// más simple e igual de confiable que pedírselo al modelo — y queda auditable
// sin depender de qué entendió la IA.
//
// "la plata" nunca va sola ni siquiera como frase: "necesito la plata para
// pagarle a un proveedor" contiene "la plata" y no tiene nada que ver con la
// sucursal (plata = dinero en español rioplatense). Solo dispara detrás de una
// preposición de lugar ("en la plata", "de la plata"), que es como se nombra un
// lugar y no como se pide dinero.
export const STORES = [
  { id: "c6bdba04-6b9c-4762-981e-3314164e4a66", nombre: "Morfi Viandas CABA", claves: ["caba"] },
  { id: "205ccbd8-b51b-4304-a080-f4ea948cc4c2", nombre: "Morfi La Plata", claves: ["en la plata", "de la plata", "morfi la plata"] },
  { id: "a03c7916-6239-4904-863d-32cb11164cf6", nombre: "Morfi Empresas", claves: ["empresas"] },
  { id: "b04bdc13-2862-437b-a276-050155e895ef", nombre: "Gaucho Natural Pet", claves: ["gaucho", "natural pet", "mascota"] },
];

export function storeName(id) {
  return STORES.find(s => s.id === id)?.nombre ?? null;
}

// Devuelve la tienda mencionada en el texto, o null si no menciona ninguna. Si
// no menciona ninguna, el llamador sigue usando la que esté seleccionada en el
// panel — nunca se inventa una sucursal por defecto.
export function detectarTienda(texto) {
  const t = texto.toLowerCase();
  return STORES.find(s => s.claves.some(k => t.includes(k))) ?? null;
}
