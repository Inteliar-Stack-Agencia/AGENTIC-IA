# AGENTIC.IA — CLAUDE.md

Marca independiente de InteliarStack. Landing page para vender agentes IA autónomos.
Deploy objetivo: Vercel. Sin backend propio por ahora.

## Stack

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | Vite + React 18 + TypeScript | Ship rápido, tipado, ecosistema |
| Estilos | Tailwind CSS v4 | Sin config file, CSS variables nativas |
| Animaciones | Framer Motion v12 | Scroll parallax, stagger, spring |
| 3D Hero | @react-three/fiber + drei + three | Hero cinematográfico con GLSL shader |
| Post-processing | @react-three/postprocessing | Bloom, Vignette, Noise sobre el 3D |
| Base de datos | Supabase | Guardar leads del formulario de contacto |
| Deploy | Vercel | GitHub integration, CDN global |

**Tailwind v4 gotcha:** `shadow-cyan-500/10` genera sombra negra por defecto.
Usar siempre `style={{ boxShadow: 'rgba(0,255,255,...)' }}` inline para colores.

**Framer Motion v12 gotcha:** El tipo `Easing` no acepta arrays en `Variants`.
Tipar los objetos de variantes como `any` para evitar el error de TypeScript.

## Arquitectura

```
src/
├── App.tsx                  # Layout principal, todas las secciones
├── main.tsx                 # Entry point
├── index.css                # Tailwind + keyframes globales
├── lib/
│   └── supabase.ts          # Cliente Supabase (usa env vars)
└── components/
    ├── NeuralNetwork3D.tsx  # Hero 3D — Canvas R3F con GLSL plasma shader
    ├── DemoSection.tsx      # Demo simulada interactiva (sin backend)
    ├── ContactModal.tsx     # Modal de contacto → inserta en tabla leads
    └── HeroParticles.tsx    # [legacy, no usado actualmente]
```

Flujo de datos:
1. Usuario hace click en CTA → abre `ContactModal`
2. `ContactModal` hace `supabase.from('leads').insert(...)` 
3. Los datos quedan en la tabla `leads` de Supabase

## Variables de entorno

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxxxxxxxxxxx
```

Ver `.env.example` en la raíz. Crear `.env` local (no commitear).
En Vercel: Settings → Environment Variables.

## Base de datos (Supabase)

Tabla `leads`:
```sql
create table leads (
  id          uuid default gen_random_uuid() primary key,
  created_at  timestamptz default now(),
  name        text not null,
  email       text not null,
  plan        text,
  message     text
);
alter table leads enable row level security;
create policy "allow insert" on leads for insert with check (true);
```

## URLs

| Entorno | URL |
|---------|-----|
| Dev local | http://localhost:5173 |
| Producción | pendiente (Vercel, dominio sin definir) |

## Secciones de la landing (en orden)

1. Hero — 3D neural network + texto con parallax
2. ¿Qué es un agente IA? — comparativa chatbot vs agente
3. Flujos de trabajo — 4 tarjetas de tipos de agente
4. Demo interactiva — simulación de 4 pasos (sin backend)
5. Beneficios — 5 tarjetas
6. Casos de uso — 4 industrias
7. Pricing — Starter $29 / Pro $99 / Enterprise Custom
8. Footer — InteliarStack

## Bugs conocidos / pendientes

- **ContactModal sin `.env`:** Si no hay variables de entorno, el insert falla silenciosamente. El usuario ve error "Error al enviar". Solución: crear `.env` con credenciales Supabase.
- **HeroParticles.tsx:** Archivo legacy, no está en uso. Se puede borrar si se quiere limpiar.
- **Bundle Three.js:** `NeuralNetwork3D` pesa ~1MB sin gzip. Es lazy loaded, no bloquea First Paint. Aceptado conscientemente por el hero cinematográfico.
- **Mobile 3D:** El canvas R3F en dispositivos lentos puede tener bajo FPS. Pendiente: fallback a CSS animation en mobile.
- **Supabase pendiente de conectar:** El proyecto Supabase aún no está creado. Ver sección BD arriba para el SQL de la tabla.

## Conexión con otros proyectos

Este proyecto se conectará a otro proyecto de InteliarStack (a definir) para centralizar la gestión de leads y agentes. El punto de integración será la tabla `leads` de Supabase o un endpoint compartido.
