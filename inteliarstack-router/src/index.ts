/**
 * inteliarstack.com — Path Router Worker
 *
 * inteliarstack.com sigue apuntando a lo que ya apuntaba (hoy, Vercel/Architect).
 * Este Worker solo intercepta un prefijo fijo:
 *
 *   inteliarstack.com/agentes*  →  proxea a AGENTES_ORIGIN (Cloudflare Pages
 *                                   con command-center-mvp/, sin build)
 *
 * Todo lo demás pasa sin tocar al origin normal de la zona. A diferencia de
 * vendexchat-domain-proxy, acá no hay tenants dinámicos ni lookup a Supabase:
 * es un solo mapeo de prefijo fijo, así que no hace falta esa capa.
 */

export interface Env {
  AGENTES_ORIGIN: string // ej: https://inteliar-agentes.pages.dev
}

const AGENTES_PREFIX = '/agentes'

async function proxyTo(targetUrl: string, request: Request): Promise<Response> {
  const proxyRequest = new Request(targetUrl, {
    method: request.method,
    headers: (() => {
      const h = new Headers(request.headers)
      h.delete('host')
      return h
    })(),
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    redirect: 'follow',
  })

  const response = await fetch(proxyRequest)
  const newHeaders = new Headers(response.headers)
  newHeaders.delete('x-frame-options')

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === AGENTES_PREFIX || url.pathname.startsWith(`${AGENTES_PREFIX}/`)) {
      const remaining = url.pathname.slice(AGENTES_PREFIX.length) || '/'
      const base = env.AGENTES_ORIGIN.replace(/\/$/, '')
      const targetUrl = `${base}${remaining}${url.search}`

      try {
        return await proxyTo(targetUrl, request)
      } catch (err) {
        console.error('[inteliarstack-router] Error proxying /agentes:', err)
        return new Response('Error al conectar con /agentes', { status: 502 })
      }
    }

    // Cualquier otro path: pasa directo al origin real de la zona (no tocamos nada).
    return fetch(request)
  },
}
