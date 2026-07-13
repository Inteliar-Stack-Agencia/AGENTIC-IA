# BUSINESS RESEARCH

**Qué es esto:** el activo más difícil de copiar de todo Inteliar, y el único que no puede escribir un agente de IA por sí solo.

Sin código. Sin arquitectura. Solo evidencia: entrevistas, observaciones, patrones, contradicciones y aprendizajes de negocios reales.

Este repositorio existe por la Regla del Fundador en [`inteliar-spec/FOUNDING_DECISIONS.md`](../inteliar-spec/FOUNDING_DECISIONS.md): por cada hora de arquitectura, una hora hablando con un negocio real. Esta carpeta es donde vive el resultado de esas horas.

---

## El KPI que mide esta carpeta

**¿Cuántas empresas entendimos correctamente?**

No usuarios. No MRR. No Capabilities. Una empresa entendida correctamente es una donde el dueño, mirando el modelo que le devolvimos, dice sin que se lo pidamos: *"sí, así funciona mi negocio."*

Cada entrevista de esta carpeta es un intento de sumar una empresa a ese conteo — o de aprender por qué todavía no.

---

## Estructura

```
business-research/
├── INTERVIEW_TEMPLATE.md      ← copiar para cada entrevista nueva
├── industries/
│   ├── talleres/       (celulares, autos, motos, computadoras, electrodomésticos)
│   ├── gastronomia/    (restaurante, cafetería, viandas, delivery, food truck)
│   ├── retail/         (librería, ferretería, indumentaria, electrónica, mayoristas/distribuidoras)
│   ├── salud/          (veterinaria, odontología, consultorio)
│   └── servicios/      (estudio contable, abogado, agencia de marketing, inmobiliaria)
└── patterns/           ← vacío a propósito, ver patterns/README.md
```

Cada carpeta de industria contiene una entrevista por archivo (`YYYY-MM-DD-nombre-empresa.md`), usando `INTERVIEW_TEMPLATE.md` como base. Ninguna carpeta tiene contenido todavía — son destinos, no ejemplos.

## Objetivo actual: 100 entrevistas

20 por cada una de las 5 categorías de arriba. No para vender — para aprender qué tienen en común, qué cambia según el tamaño, qué software usan, y qué Capabilities aparecen siempre. Ahí es donde nacen las primeras Capabilities oficiales — después de ver el patrón repetirse en entrevistas reales, no antes.

Si una categoría nueva aparece con fuerza (por ejemplo, ninguna de las 5 encaja bien), se agrega — pero recién cuando haya 2-3 entrevistas reales que no entren en ninguna, no antes de empezar.

---

## Regla de esta carpeta

Cada entrevista real responde una sola pregunta contra `FOUNDING_DECISIONS.md`: **¿confirmó un principio, o le pegó a una hipótesis?**

- Si confirmó un principio, no pasa nada acá — el principio ya estaba fuerte, se anota igual como evidencia acumulada.
- Si contradijo una hipótesis, la fila correspondiente en la tabla de `FOUNDING_DECISIONS.md` se actualiza esa misma semana, citando la entrevista.

Nada se escribe acá para quedar bien. Una entrevista que muestra que una hipótesis falló vale más que diez que la confirman sin fricción.

---

*Ver también: [`FOUNDING_DECISIONS.md`](../inteliar-spec/FOUNDING_DECISIONS.md) · [`PROPOSAL_TEMPLATE.md`](../inteliar-spec/PROPOSAL_TEMPLATE.md)*
