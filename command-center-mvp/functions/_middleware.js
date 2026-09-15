// Pages Function: corre antes de servir cualquier archivo estático de este
// proyecto (para todos los dominios que tenga conectados: *.pages.dev y
// agentes.inteliarstack.com). Uso interno, no dominio público — sin
// credenciales válidas, ni siquiera se sirve el HTML.
//
// AGENTES_USER / AGENTES_PASS se configuran como secretos en el dashboard de
// Cloudflare Pages (Settings → Variables and Secrets), nunca en el repo.

export async function onRequest(context) {
  const { request, env } = context;
  const expectedUser = env.AGENTES_USER;
  const expectedPass = env.AGENTES_PASS;

  if (!expectedUser || !expectedPass) {
    return new Response('Falta configurar AGENTES_USER / AGENTES_PASS', { status: 500 });
  }

  const authHeader = request.headers.get('Authorization') || '';
  const [scheme, encoded] = authHeader.split(' ');

  if (scheme === 'Basic' && encoded) {
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(':');
    const user = decoded.slice(0, separatorIndex);
    const pass = decoded.slice(separatorIndex + 1);

    if (user === expectedUser && pass === expectedPass) {
      return context.next();
    }
  }

  return new Response('Acceso restringido', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Inteliar Agentes"' },
  });
}
