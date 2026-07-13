# INTELIAR MASTER SPECIFICATION
## Capítulo 17 — Open Platform Architecture

**Versión:** 1.0
**Estado:** Core Architecture
**Prioridad:** Máxima

---

## Objetivo

Definir el modelo de propiedad, ejecución y evolución de los proyectos construidos sobre Inteliar.

## Filosofía

El software pertenece al cliente. No a Inteliar. Inteliar nunca debe convertirse en una plataforma donde el cliente quede encerrado.

> Nuestro objetivo no es generar dependencia. Es convertirnos en la mejor plataforma para desarrollar y operar software.

---

## El problema actual

```
Cliente → Construye → La plataforma guarda todo → Si quiere irse... debe empezar de nuevo.
```

Ese modelo genera dependencia. Y la dependencia genera desconfianza.

## Nuestra decisión

Todo proyecto pertenece al cliente. Siempre.

```
Cliente → Repositorio GitHub → Builder Engine → Inteliar Platform → Deploy → Producción
```

El repositorio vive donde el cliente decida: GitHub, GitLab, Azure DevOps, servidor privado. No importa.

---

## El código nunca vive encerrado

Inteliar nunca será el único lugar donde existe el proyecto. Siempre existirá un repositorio independiente.

**Builder no guarda código.** Builder interpreta, analiza, genera, refactoriza, documenta, publica. Pero el código vive en Git.

### Beneficios

- **Propiedad:** el cliente siempre posee el código.
- **Libertad:** puede abandonar Inteliar, continuar, contratar otra empresa.
- **Transparencia:** nada oculto, todo versionado.
- **Compatibilidad:** Claude Code, Cursor, VS Code, JetBrains, GitHub Actions funcionan naturalmente.

## Git como fuente de verdad

Toda modificación termina en Git, no importa si proviene de Builder, Architect, Claude, Cursor, CLI, API o Partner.

```
Git → Truth (del sistema — ver ADR-026)
```

---

## Builder Engine

Builder no es un editor. Es un **motor**. Puede usarse desde múltiples clientes:

```
Builder Engine
├── Web
├── CLI
├── SDK
├── VS Code
├── Cursor
├── Claude Code
├── API
└── GitHub
```

Todos hablan con el mismo motor.

### Claude Code
No es un competidor: es un **cliente** de Builder. Puede preguntar *¿qué Capability instalar? ¿qué módulo usar? ¿qué ADR aplica? ¿qué estándar seguir?* Builder responde, Claude implementa. Cursor y VS Code, exactamente igual.

### CLI
```
inteliar create
inteliar architect
inteliar analyze
inteliar install
inteliar deploy
inteliar publish
inteliar doctor
inteliar upgrade
```

### API
Toda acción debe poder realizarse vía API. Nunca solamente desde la web.

### GitHub App

Inteliar debería tener una GitHub App oficial capaz de: analizar repositorios, detectar módulos, sugerir mejoras, actualizar dependencias, crear ADR, generar documentación, abrir Pull Requests, publicar módulos. Todo automáticamente.

---

## Repositorios

Cada organización puede tener un repositorio, varios, monorepo o multi-repo. Builder soporta ambos modelos.

```
github.com/empresa
├── fixly
├── labels
├── erp
├── crm
├── portal
├── mobile
└── shared
```

## Multi Workspace
Una agencia puede conectar 100 organizaciones, 300 repositorios, 200 clientes. Todo desde una única consola.

---

## Sin Vendor Lock-in

Si mañana el cliente decide dejar Inteliar, puede hacerlo. Su código sigue existiendo. Su Git sigue existiendo. Su negocio sigue funcionando.

*¿Entonces por qué seguiría pagando?* Porque Inteliar aporta: Knowledge Engine, Architect, Deploy, Cloud, Marketplace, AI Pods, Monitoring, Billing. No por obligación. Por valor.

## Inteliar Cloud
La nube también es opcional. Puede desplegar en AWS, Cloudflare, Azure, Google, servidor propio, VPS, Kubernetes, Vercel, Railway, Fly.

## Deploy Engine
```
Repositorio → Pipeline → Infraestructura → Producción
```
No obliga un proveedor.

## Importación
Cualquier proyecto puede conectarse: Laravel, Next.js, Node, Nest, Go, Python, .NET, Java, PHP, Rails. Builder analiza, propone, migra. No obliga a reescribir.

## Exportación
Todo proyecto puede salir sin perder código, datos, configuración ni documentación.

---

## 🚨 ADR-022
Inteliar nunca retendrá a un cliente mediante dependencia tecnológica. La permanencia debe producirse porque la plataforma aporta valor continuo. Nunca porque salir resulte difícil.

## 🚨 ADR-023 — Inteliar es Git Native
Inteliar no inventará un sistema de versionado, ni un editor propietario, ni un formato propio de proyectos. Git ya resolvió ese problema. Construimos encima, no al costado.

> **Complemento (ADR-027):** el Digital Twin y el Blueprint también viven en Git, en el repo del cliente, bajo `.inteliar/`.

---

## La economía cambia

El negocio deja de ser *hospedar código* y pasa a ser *operar inteligencia*.

El cliente podría alojar su proyecto en cualquier lugar, pero seguirá utilizando Architect, Knowledge, Marketplace, Agents, Cloud, Monitoring. Porque eso sería mucho más costoso de reemplazar.

---

## ⭐ La idea más importante

Inteliar no debería ser un IDE. Ni siquiera un Builder. Debería ser una **capa de inteligencia sobre el ecosistema de desarrollo existente.**

No competir con GitHub, VS Code, Cursor, Claude Code, Vercel, Docker. Sino potenciarlos.

```
Abrís Claude Code:
"Necesito agregar un módulo de logística."
        ↓
Architect analiza → Knowledge Engine responde → Builder genera →
Git crea el PR → Deploy actualiza staging → QA Agent prueba →
Review Agent revisa → Merge.
```

Todo sin salir de tu flujo habitual.

## 📌 Reflexión final

Ya no competimos por reemplazar herramientas. Competimos por ser **la inteligencia que conecta todas las herramientas.** Esa estrategia es mucho más sólida a largo plazo que un ecosistema cerrado.

---

*Fin del Capítulo 17 — Open Platform Architecture*
