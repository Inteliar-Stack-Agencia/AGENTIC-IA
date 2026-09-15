# DECISIÓN FINAL
## Fase 6 — Las 10 preguntas, sin cobertura diplomática

---

### 1. ¿Vale la pena construir Inteliar?

Sí, pero no la que está escrita hoy en 65 documentos. Vale la pena la tesis (business-first, BOM como artefacto central, Capability como unidad de reutilización, event-driven a largo plazo). No vale la pena, todavía, la implementación de 16 microservicios con 6 datastores especializados cada uno. La versión que vale la pena construir es la de `01-PROPOSED_ARCHITECTURE.md` y `02-ROADMAP_24_MONTHS.md`: la misma visión, con la mitad de los conceptos y una fracción de la infraestructura, ganándose cada pieza con evidencia real antes de construirla.

### 2. ¿Qué probabilidades reales tiene de convertirse en una plataforma importante?

Más altas de lo habitual, por una razón específica y no obvia: **ya existe negocio real detrás.** No es una idea en una servilleta — son 5 productos con clientes pagando, conocimiento de dominio genuino (talleres, tiendas online, etiquetado, WhatsApp comercial) y una auditoría honesta de su propia deuda técnica. Eso es más de lo que tiene la mayoría de los proyectos que sí levantan financiamiento. El riesgo no es de mercado ni de visión — es de **secuenciación**: si el próximo año se sigue invirtiendo en documentar 2035 en vez de extraer y validar lo que ya existe, la probabilidad cae en picada. Con la secuenciación de este roadmap, la probabilidad es genuinamente buena.

### 3. ¿Cuáles son los mayores riesgos?

En orden:
1. **Seguir escribiendo visión en vez de código** — el patrón de los últimos documentos (cada uno "el más importante de todos") es una señal de que escribir sobre Inteliar se volvió más gratificante que construirla.
2. **Sobre-invertir en infraestructura antes de ingresos** — el "stack común" de 6 datastores es una manera cara de fracasar lentamente.
3. **Nunca cerrar la reconciliación BOM/Twin/Memory** — un modelo del negocio con tres candidatos a fuente de verdad es peor que no tener modelo.
4. **Que la hipótesis central (conversación libre > wizard estructurado) sea falsa** para el dueño de PyME real, y que nadie la mida hasta haber construido Builder, Marketplace y Stack Studio alrededor de ella.
5. **Los 6 hallazgos de seguridad activos** — riesgo reputacional/legal inmediato, independiente de cualquier decisión de arquitectura.

### 4. ¿Cuál es el mayor activo?

No es el código, no es la IA, no es ningún AR. **Es que ya existe conocimiento de dominio validado por clientes reales pagando** (cómo funciona un taller, cómo funciona una tienda online con WhatsApp, cómo funciona el negocio de etiquetado térmico) más el instinto — visible en el propio código, no en los documentos — de construir simple cuando el objetivo es concreto. La prueba está en la propia auditoría: el mejor código de IA de todo el portafolio es el más simple, no el más ambicioso.

### 5. ¿Qué eliminarías inmediatamente?

De la documentación (no del pensamiento, que puede volver más adelante con evidencia): BOML como aspiración de estándar abierto, OBMI, Marketplace con 5 tipos de activo, niveles de certificación de partners, Health Score/Lifecycle de 8 estados para un catálogo con cero Capabilities, "Cognitive Resource Management" como sistema, y el mandato de ADR para toda decisión.

Del código/infraestructura: cualquier plan de adoptar Neo4j, Kafka/NATS, Temporal o Kubernetes antes de tener el volumen real que los justifique.

### 6. ¿Qué construirías primero?

Exactamente lo que el cierre de la conversación de visión ya identificó bien: la conversación de Architect, sola, sin nada alrededor. Con una corrección: antes de escribir la primera línea, cerrar los 6 hallazgos de seguridad de Sprint -1, porque hay clientes reales expuestos hoy y eso no espera a ninguna decisión de producto.

### 7. ¿Cuál sería el primer commit?

```
fix: rotate exposed Supabase credentials and close /admin auth gap

- Rotate Supabase URL/anon key in LEGAL-TEMPLATES, clean history
- Protect RIWEB.APP /admin route with real session check
- Move Anthropic API key server-side in RIWEB.APP

This is not part of the Inteliar roadmap. It closes active
production vulnerabilities affecting real paying customers,
found during the repository audit (2026-07-11).
```

No `feat: initialize inteliar-stack`. Ese viene después, en Sprint 0, y para entonces ya no es el primer commit — es el segundo.

### 8. Si fueras CTO del proyecto, ¿cómo organizarías el equipo?

Hoy, con el tamaño real del equipo (una persona + agentes IA), no organizaría "roles" al estilo enterprise (Platform Team, Capability Partners, Stack Builders, Industry Experts, AI Contributors, Integration Partners — los 6 tipos del Ecosystem Manifesto). Eso es una organización para cuando haya 50 personas. Hoy:

- **Vos:** Product Architect + la única persona que puede validar con clientes reales (eso no lo puede hacer ningún agente).
- **Un Claude Code (Lead Engineer):** ejecuta el roadmap, no lo rediseña sin ADR.
- **Esta conversación (Chief Architect / sparring):** cuestiona antes de construir, como en este mismo documento.

La estructura de "Platform Team / Capability Partners / Stack Builders / ..." se arma cuando exista la primera contratación real, no antes — diseñarla hoy es lo mismo error que diseñar el Health Score de Capabilities antes de tener una.

### 9. ¿Qué NO deberíamos construir nunca (o al menos no en los próximos 24 meses)?

Un Architecture Review Board para aprobar partners que no existen. Una certificación de "Enterprise Partner" para un ecosistema con cero partners. Un lenguaje de modelado empresarial universal (BOML/OBMI) compitiendo por ser el próximo HTML antes de que un solo cliente externo haya usado el BOM una vez. Un Marketplace de 5 tipos de activos antes de tener 1 Capability vendible. Kubernetes.

### 10. ¿Cuál es la decisión más importante que debemos tomar antes de escribir código?

No es una decisión de arquitectura. Es esta: **¿estamos dispuestos a dejar que las próximas 20 conversaciones con dueños de negocios reales cambien el diseño, incluso si contradicen algo que ya escribimos?**

Todo el patrón de los últimos 65 documentos — cada uno reescribiendo o reencuadrando al anterior sin cerrarlo — muestra que la organización sabe iterar sobre ideas. Lo que todavía no demostró es que sepa iterar sobre **evidencia externa real** de la misma forma. Esa es la única decisión que importa antes de Sprint 1: la próxima vez que una entrevista real contradiga un documento de esta Constitución, ¿gana la entrevista o gana el documento?

Si la respuesta es "la entrevista", el proyecto tiene una probabilidad real de éxito. Si la respuesta termina siendo "el documento", esto se convierte en el mejor plan de negocio jamás escrito que nadie llegó a construir.

---

*Fin de la revisión. Fases 1-6 completas en `00-ARCHITECTURE_REVIEW.md`, `01-PROPOSED_ARCHITECTURE.md`, `02-ROADMAP_24_MONTHS.md`, `03-REPOSITORY_AUDIT.md`, `04-DECISION.md`.*
