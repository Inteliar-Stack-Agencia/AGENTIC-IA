# INTELIAR ARCHITECTURE REFERENCE
## AR-002 — Identity Service

**Versión:** 1.0 · **Estado:** Ready for Implementation · **Prioridad:** P0

---

## Objetivo

El servicio responsable de la identidad. Responde **una sola pregunta: ¿quién sos?** No responde qué podés hacer, a qué organización pertenecés ni qué permisos tenés. Administra identidades. Nada más.

## Responsabilidades

Usuarios, Login, Registro, OAuth, OIDC, MFA, Passwordless, Sesiones, Tokens, Dispositivos, Verificación de email, Recuperación de cuenta.

**No administra:** Roles, Permisos, Organizaciones, Billing, Marketplace, Builder.

## Arquitectura

```
Identity Service
├── Authentication API   ├── MFA API        ├── Verification API
├── User API             ├── Device API      └── Events
├── Session API          ├── Token API
├── OAuth API
```

## Modelo

```
User: id, email, username, display_name, avatar, locale, timezone, status, created_at, updated_at
Session: id, user_id, device, browser, ip, country, created_at, expires_at, last_activity
```

**Métodos de autenticación (coexisten):** Password, Google, Microsoft, GitHub, Apple, Magic Link, Passkey, SAML, OIDC.
**Estados:** `Pending → Active → Suspended → Blocked → Deleted`. Nunca borrar físicamente.

## Capacidades

- **Dispositivos:** cada usuario administra sus dispositivos y puede cerrar sesiones remotamente.
- **Tokens:** Access, Refresh, API, CLI, Personal Access, Service — cada uno con políticas distintas.
- **Passkeys:** compatibilidad completa con WebAuthn. Objetivo: eliminar gradualmente contraseñas.
- **MFA:** Authenticator App, SMS (opcional), Email, Passkey, Hardware Key, Enterprise Policy.
- **OAuth Providers:** Google, Microsoft, GitHub, Apple, GitLab, LinkedIn, Slack, Facebook, Discord, OIDC genérico.
- **Enterprise:** Azure AD, Okta, Auth0, Keycloak, Ping Identity, SAML 2.0, OIDC.
- **Invitaciones:** no crean usuario; crean un vínculo pendiente que el usuario acepta luego.
- **Recuperación:** nunca enviamos contraseñas. Siempre Magic Link o Reset Token.

## Eventos

`UserCreated · UserActivated · UserUpdated · UserDeleted · UserLoggedIn · UserLoggedOut · PasswordChanged · PasskeyAdded · SessionCreated · SessionExpired · MFAEnabled · MFADisabled`

## API

```
POST /auth/login · /auth/logout · /auth/register · /auth/refresh
POST /auth/password/reset · /auth/magic-link
GET/PATCH/DELETE /me
GET/DELETE /sessions[/:id]
GET /oauth/{google|github|microsoft}
```

**GraphQL:** `me{ id email displayName sessions devices }`

## JWT

Los Access Tokens contienen únicamente: `user_id, session_id, issuer, audience, expires`. **Nunca** roles, permisos ni organizaciones (eso cambia demasiado; se resuelve dinámicamente).

## Seguridad

- **Password Hash:** Argon2id. Nunca bcrypt, nunca SHA.
- **Rate Limit:** login, registro, reset password, magic link — siempre protegidos.
- **Password Policy:** configurable por organización (longitud, complejidad, expiración, historial).
- **Passwordless:** objetivo estratégico — que la mayoría nunca escriba una contraseña.

## Dependencias

Identity **no consulta** ningún servicio. Solo emite eventos. Lo consumen Organization, Permission, Billing, Builder, Marketplace. Identity no consume ninguno.

## Stack

NestJS · PostgreSQL · Redis · JWT + OIDC · WebAuthn · OpenTelemetry · Docker.
**SLA objetivo:** 99.99% — nunca debe ser cuello de botella.
**Repository:** `services/identity-service/`

## Definition of Done

Password Login · Passwordless · OAuth · OIDC · Passkeys · MFA · Session Management · Device Management · API · GraphQL · SDK · Eventos · Auditoría · OpenAPI · Tests.

---

## 🚨 ADR-AR002 — Identity nunca conoce permisos ni organizaciones

Identity responde solamente *¿quién es este usuario?* Nada más.

## 🚀 Decisión de arquitectura — Separación en tres servicios

```
Identity Service      → ¿Quién sos?
Organization Service  → ¿Dónde trabajás?
Permission Service    → ¿Qué podés hacer?
```

Tres servicios completamente independientes. Permite: un consultor en 40 organizaciones; un desarrollador administrando cientos de clientes; un agente de IA que existe sin iniciar sesión; una API que actúa en nombre de una organización sin representar a un humano. Más complejo al inicio, mucho más escalable a millones de usuarios.

---

*AR-002 — Identity Service*
