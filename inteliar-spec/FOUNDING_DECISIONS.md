# FOUNDING DECISIONS

**Versión:** 1.0
**Estado:** Vivo — este documento se actualiza, no se reemplaza
**Regla de este documento:** cuando la realidad contradiga algo escrito acá, gana la realidad. Se corrige el documento. Nunca al revés.

---

## Por qué existe este documento

Después de 65+ documentos de visión y una auditoría técnica independiente, apareció la pregunta que importa más que cualquier arquitectura:

> ¿Qué gana cuando la realidad contradice la visión?

**Gana la realidad. Siempre.**

No porque la visión no importe — sino porque la visión existe para explicar la realidad, no para reemplazarla.

Este documento separa lo que ya ganamos el derecho a llamar **principio** (no cambia, pase lo que pase con la tecnología o el mercado) de lo que todavía es **hipótesis** (una idea prometedora que no tocó la realidad todavía).

Todo lo demás que se escribió — BOM, BOML, Digital Twin, Business Graph, Evolution Index, OBMI, Stack Studio, Marketplace completo — vive ahora en una de esas dos categorías, explícitamente.

---

## Principios innegociables

Máximo 10. Estos viven aunque cambien React, NestJS, Claude, GPT o cualquier proveedor de infraestructura. Si algún día uno de estos deja de ser cierto, no se actualiza este documento — se reconoce que el proyecto cambió de tesis.

1. **El software nace del negocio, nunca al revés.** Toda decisión técnica empieza con un problema real de una empresa real, no con una preferencia de stack.

2. **Reutilización antes que creación.** Las Capabilities son la unidad de reutilización de todo el ecosistema. Nunca se construye lo que ya existe y funciona.

3. **El usuario entra hablando con Architect, no con un dashboard.** La conversación es la puerta de entrada, siempre — para el dueño de una PyME y para un desarrollador.

4. **Inteliar es un ecosistema, no un producto cerrado.** Existe un Marketplace donde terceros construyen y distribuyen — la forma exacta que tome ese Marketplace es una hipótesis (ver abajo), pero su existencia como destino no se negocia.

5. **La IA ayuda a comprender y ejecutar; el criterio final en decisiones de impacto económico, legal o estratégico es siempre humano.**

6. **Se extrae antes de diseñar.** El código real que ya factura (Fixly, VendexChat, Inteliar Labels, AgentKit) es la fuente de las primeras Capabilities. No se diseña en el vacío mientras exista una versión real para extraer.

7. **Cuando la realidad contradice la visión, gana la realidad.** Un documento se corrige en cuanto una entrevista, un dato de uso, o un incidente real lo contradice. Ningún documento tiene autoridad sobre la evidencia.

8. **Seguridad, tests y confiabilidad se ganan antes de construir cualquier feature nueva.** No se negocia ni se pospone por presión de roadmap.

9. **Un desarrollador nuevo — humano o IA — debe poder entender el sistema en una hora, no en tres días.** Si hacen falta más de 3 conceptos para escribir la primera Capability, el vocabulario está mal, no el desarrollador.

10. **El código y los datos pertenecen al cliente.** Inteliar nunca retiene por dependencia técnica forzada.

---

## Hipótesis

Todo lo que sigue es una idea con potencial real, ya explorada en profundidad, pero **sin validar con uso real todavía.** Ninguna se elimina — se las etiqueta con honestidad y se revisan cuando haya evidencia, no cuando haya entusiasmo.

**Estados posibles:**
- 🟡 No validada — existe como idea, cero uso real todavía.
- 🟠 En experimentación — ya tiene un sprint del roadmap dedicado a probarla.
- 🟢 Validada por uso real — sobrevivió al contacto con clientes reales, se promueve a principio o a arquitectura estable.
- 🔴 Descartada (por ahora) — se intentó, no se sostiene con la evidencia actual; puede resucitar si cambian las condiciones.

| Hipótesis | Estado | Nota |
|---|---|---|
| **BOM** como formato central del modelo de negocio | 🟡 No validada | Entra en experimentación en Sprint 2 del roadmap (BOM Generator v0) |
| **Digital Twin** como servicio propio (Neo4j, modelo dual) | 🔴 Descartada por ahora | Degradada a "vista derivada del BOM" en la arquitectura propuesta — revive si aparece una necesidad real de consultas de grafo que Postgres no resuelva |
| **Memory Service** como servicio propio separado | 🔴 Descartada por ahora | Degradada a "historial de versiones del BOM" — revive si la complejidad real de memoria organizacional supera lo que el versionado simple resuelve |
| **BOML** como lenguaje de modelado propio | 🟡 No validada | Como formato de serialización interno del BOM, ya en uso implícito; como aspiración de estándar abierto para el mundo, sin validar |
| **Business Graph** (aprendizaje cruzado entre organizaciones) | 🟡 No validada | Requiere volumen real de organizaciones que hoy no existe |
| **Business Evolution Index (BEI)** como métrica principal | 🟡 No validada | Idea fuerte, cero medición real todavía |
| **OBMI** (Open Business Model Initiative — estándar de industria) | 🟡 No validada | La ambición más especulativa del set; revisitar en año 3 con datos de adopción reales, no antes |
| **AI Pods** como producto vendible individualmente | 🟡 No validada | Depende de que existan Capabilities y Architect maduros primero |
| **Stack Studio** (interfaz visual dual Business/Studio Mode) | 🟠 En experimentación | Business Mode entra al roadmap en el mes 13; Studio Mode se pospone hasta haber partners externos reales |
| **Marketplace completo** (5 tipos de activo, certificación, Architecture Review Board) | 🟡 No validada | Su existencia es un principio (#4); su forma final — cuántos tipos de activo, si hace falta certificación — no se decide hasta tener demanda real de terceros |

---

## El primer KPI

No es técnico. No es MRR, usuarios, commits ni Capabilities.

**¿Cuántas empresas entendimos correctamente?**

Una empresa entendida correctamente es una donde el dueño, mirando el modelo que le devolvimos, dice sin que se lo pidamos: *"sí, así funciona mi negocio."* Eso se registra en [`business-research/`](../business-research/), no acá — este documento son las reglas; esa carpeta es la evidencia.

---

## Cómo se usa este documento

- Antes de escribir un documento nuevo de visión, se revisa si lo que se quiere decir ya es una hipótesis de esta lista. Si lo es, se actualiza su estado con evidencia nueva — no se crea un documento nuevo que la reformule con otro nombre.
- Ninguna hipótesis pasa a principio sin evidencia de uso real. Ninguna hipótesis se convierte en infraestructura de producción (un servicio, un datastore nuevo) mientras siga en 🟡.
- Toda idea nueva — un documento, una hipótesis nueva, un pedido de construcción fuera del roadmap activo — pasa primero por [`PROPOSAL_TEMPLATE.md`](./PROPOSAL_TEMPLATE.md). Si no se puede completar en ocho respuestas, la idea no está lista.
- Este documento es más corto que cualquier AR porque esa es la idea: lo que sobrevive de una conversación de horas cabe en una página. El resto son notas de investigación, no verdades.

## Regla del Fundador

Por cada hora escrita en arquitectura, una hora hablando con un negocio real. 1:1, no como aspiración — como límite. El activo más valioso de este proyecto no es ningún documento de esta carpeta: es la capacidad de entender negocios reales, y esa capacidad no se entrena leyendo ni escribiendo — se entrena en conversaciones que este documento no puede tener por vos.

Cada conversación real responde una sola pregunta sobre esta página: ¿confirmó un principio, o le pegó a una hipótesis? Si confirmó un principio, el principio se queda igual — ya estaba fuerte. Si contradijo una hipótesis, esta página se actualiza esa misma semana. Si pasa un mes sin que ninguna fila de la tabla de arriba cambie de estado, no es que todo esté validado — es que nadie salió a hablar con nadie.

## Regla de Evidencia

Con una entrevista no se detectan patrones. Se detecta ruido. Ningún componente de inteligencia colectiva (Business Graph, Knowledge Engine, detección automática de patrones) se implementa antes de tener el volumen que lo justifique.

```
Nivel 1 — Evidencia        (acá estamos)   guardar: entrevista, BOM, validación. Nada de IA.
Nivel 2 — Organización     (20-40 casos)   clasificar por industria. Todavía sin IA.
Nivel 3 — Descubrimiento   (evidencia real) recién ahí: ¿qué patrones se repiten?
Nivel 4 — Knowledge Engine (datos reales)   automatizar lo que el Nivel 3 ya validó a mano.
```

Primero datos. Después hipótesis. Después automatización — nunca al revés.

---

*FOUNDING_DECISIONS — el documento más corto y más importante de todo `inteliar-spec/`.*
