# inteliarstack-router

Worker de Cloudflare que hace que `inteliarstack.com/agentes` sirva el Command
Center MVP (`command-center-mvp/`, HTML/CSS/JS plano, sin build), sin tocar lo
que hoy ya responde en `inteliarstack.com` (Vercel / Architect).

Mismo patrón que `vendexchat-domain-proxy` (repo `VendexChat-admin`), pero sin
la capa de tenants dinámicos — acá el mapeo es un solo prefijo fijo (`/agentes`
→ un origin), no hace falta consultar Supabase por request.

## Por qué esto y no un rewrite de Vercel

`inteliarstack.com` resuelve a IPs de Cloudflare (172.67.x.x / 104.21.x.x), o
sea la zona ya está en Cloudflare con el proxy naranja activado — delante de
lo que sea que tenga como origin (Vercel). Eso hace que un Worker con una ruta
sobre esta zona sea el punto correcto para interceptar `/agentes` antes de que
la request llegue a Vercel, sin depender de que Architect y el Command Center
compartan el mismo proyecto de Vercel.

## Setup (una sola vez, requiere tu cuenta de Cloudflare — no la tengo yo)

**1. Desplegar `command-center-mvp/` en Cloudflare Pages** (el origin al que
apunta este Worker):

- Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
- Repo: `Inteliar-Stack-Agencia/AGENTIC-IA`
- Root directory: `command-center-mvp`
- Build command: (vacío — no hay build, es HTML/CSS/JS plano)
- Output directory: `/`
- Deploy. Te va a dar una URL tipo `https://inteliar-agentes.pages.dev` (o el
  nombre que le pongas al proyecto).

**2. Completar `AGENTES_ORIGIN` en `wrangler.toml`** con esa URL real.

**3. Deployar este Worker:**

```bash
cd inteliarstack-router
npm install
npx wrangler login          # una vez, abre el browser
npx wrangler deploy
```

**4. Agregar la ruta en el Dashboard** (no se puede declarar en `wrangler.toml`
porque `inteliarstack.com` es una zona que no administra este repo):

- Workers & Pages → `inteliarstack-router` → Settings → Triggers → Add route
- Route: `inteliarstack.com/*`
- Zone: `inteliarstack.com`

**5. Probar:** `inteliarstack.com/agentes` tiene que mostrar el Command
Center. `inteliarstack.com/` (o cualquier otra ruta) tiene que seguir andando
exactamente igual que antes — el Worker le hace pass-through sin modificar
nada.

## Si el día de mañana se agrega otra sección con su propio prefijo

Se agrega un `if` más en `src/index.ts`, mismo patrón — no hace falta un
Worker nuevo por cada prefijo.
