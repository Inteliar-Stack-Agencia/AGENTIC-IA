# BUSINESS RESEARCH

**El laboratorio de Inteliar.** No una carpeta de entrevistas — la colección de Business Discovery Sessions que valida y hace crecer a Architect. El activo más difícil de copiar de todo el proyecto, y el único que no puede escribir un agente de IA por sí solo.

Sin código. Sin arquitectura. Solo evidencia: sesiones de descubrimiento, validación, aprendizajes y (más adelante, cuando haya volumen real) patrones de negocios reales.

Este repositorio existe por la Regla del Fundador en [`inteliar-spec/FOUNDING_DECISIONS.md`](../inteliar-spec/FOUNDING_DECISIONS.md): por cada hora de arquitectura, una hora hablando con un negocio real. Esta carpeta es donde vive el resultado de esas horas.

---

## Los cuatro niveles (ver `FOUNDING_DECISIONS.md § Regla de Evidencia`)

| Nivel | Nombre | Pregunta que responde | Quién evalúa |
|---|---|---|---|
| 1 | **Foundational Cases** | ¿Architect reconstruyó correctamente un negocio cuya respuesta ya conocemos? | El fundador (tiene el ground truth) |
| 2 | **External Validation** | ¿El dueño dijo espontáneamente "sí, así funciona mi empresa"? | El cliente (su reacción es el dato) |
| 3 | **Industry Validation** | Con suficientes sesiones: ¿qué patrones se repiten entre negocios independientes? | Se compara entre sesiones, no dentro de una sola |
| 4 | **Predictive Validation** | ¿Architect puede anticipar un problema antes de que el dueño lo mencione, y acierta? | Requiere Nivel 3 ya validado — no antes |

Hoy estamos en el Nivel 1, arrancando el Nivel 2. Los Niveles 3 y 4 no se construyen todavía — ver `patterns/README.md` y `FOUNDING_DECISIONS.md`.

**Regla dura:** los niveles no se mezclan al contar evidencia. Una sesión de Nivel 1 nunca cuenta para la métrica de reconocimiento espontáneo del Nivel 2.

---

## Las dos métricas de cada sesión

No solo "¿reconoció el modelo?" (Accuracy). También: **¿qué descubrió Architect que la persona no había mencionado al principio?** (Discovery). Un buen consultor no solo escucha — también encuentra lo que la otra persona no sabía que tenía que contar. Ver `DISCOVERY_SESSION_TEMPLATE.md`.

El umbral de avance del roadmap sigue siendo el mismo (`inteliar-spec/review/02-ROADMAP_24_MONTHS.md`): 15 de 20 sesiones de Nivel 2 con Accuracy alta detienen o continúan el plan. Accuracy y Discovery son la evidencia detallada detrás de ese número, no un reemplazo.

---

## Estructura

```
business-research/
├── DISCOVERY_SESSION_TEMPLATE.md  ← copiar para cada sesión nueva
├── case-studies/                  ← Nivel 1 — Foundational Cases
│                                     (ver case-studies/README.md)
├── industries/                    ← Nivel 2 — External Validation
│   ├── talleres/       (celulares, autos, motos, computadoras, electrodomésticos)
│   ├── gastronomia/    (restaurante, cafetería, viandas, delivery, food truck)
│   ├── retail/         (librería, ferretería, indumentaria, electrónica, mayoristas/distribuidoras)
│   ├── salud/          (veterinaria, odontología, consultorio)
│   └── servicios/      (estudio contable, abogado, agencia de marketing, inmobiliaria)
└── patterns/           ← Nivel 3/4, vacío a propósito, ver patterns/README.md
```

Cada carpeta contiene una sesión por archivo (`YYYY-MM-DD-nombre-empresa.md`), usando `DISCOVERY_SESSION_TEMPLATE.md` como base. Ninguna carpeta tiene contenido todavía — son destinos, no ejemplos.

## Punto de partida: 3 casos fundacionales + 100 sesiones externas

Antes de salir a buscar desconocidos: 3 Foundational Cases que el fundador ya conoce en profundidad — Mundo Electrónico (Repair), Morfi Viandas (Order/Production/Delivery), Punto Pickit (Logistics). Sirven para probar si Architect pregunta bien, no para validar mercado.

Después: 100 External Validation, 20 por cada una de las 5 categorías de `industries/`. No para vender — para aprender qué tienen en común, qué cambia según el tamaño, qué software usan, y qué Capabilities aparecen siempre. Ahí nacen las primeras Capabilities oficiales — después de ver el patrón repetirse en sesiones reales e independientes, no antes.

Si una categoría nueva aparece con fuerza (por ejemplo, ninguna de las 5 encaja bien), se agrega — pero recién cuando haya 2-3 sesiones reales que no entren en ninguna, no antes de empezar.

---

## Regla de esta carpeta

Cada sesión real responde una sola pregunta contra `FOUNDING_DECISIONS.md`: **¿confirmó un principio, o le pegó a una hipótesis?**

- Si confirmó un principio, no pasa nada acá — el principio ya estaba fuerte, se anota igual como evidencia acumulada.
- Si contradijo una hipótesis, la fila correspondiente en la tabla de `FOUNDING_DECISIONS.md` se actualiza esa misma semana, citando la sesión.

Nada se escribe acá para quedar bien. Una sesión que muestra que una hipótesis falló vale más que diez que la confirman sin fricción.

**Y el conocimiento nunca se da por bueno solo porque salió de un Foundational Case.** Solo lo validado en Nivel 2 (empresas externas) pasa a considerarse conocimiento reutilizable — eso evita que Architect aprenda los sesgos propios del fundador disfrazados de patrones de industria.

---

*Ver también: [`FOUNDING_DECISIONS.md`](../inteliar-spec/FOUNDING_DECISIONS.md) · [`PROPOSAL_TEMPLATE.md`](../inteliar-spec/PROPOSAL_TEMPLATE.md)*
