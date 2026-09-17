# SDD con Speckit

**Spec-Driven Development (SDD)** convierte la especificación de una funcionalidad
en el artefacto de trabajo primario. El código, los tests y la documentación se
derivan de la spec, no al revés. **Speckit** es la herramienta que estructura
ese flujo en Claude Code: divide el trabajo en pasos con artefactos versionables
(`spec.md`, `plan.md`, `tasks.md`, contracts, quickstart) y comandos
(`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`) que
llevan un cambio desde el enunciado del problema hasta código integrado.

Este módulo cubre qué es SDD, en qué se diferencia del "vibe coding", por qué
encaja bien en Java empresarial, cuándo no compensa usarlo, y a partir de aquí
te lleva por el ciclo completo, dos escenarios de adopción (greenfield y
brownfield) y los antipatrones más comunes.

## Qué es Spec-Driven Development

SDD no es un método de gestión de proyecto, sino de **construcción de software
asistida por LLM**. Sus tres reglas prácticas:

1. **Antes de código, especificación.** Un cambio no arranca hasta que existe una
   spec versionable que responde: qué debe hacer el sistema, para qué usuario,
   con qué criterios de aceptación medibles.
2. **Antes de implementación, plan.** La spec se traduce a decisiones técnicas
   explícitas (arquitectura, dependencias, contratos, modelo de datos) antes de
   descomponer en tareas.
3. **Antes de merge, trazabilidad.** Cada línea de código responde a una tarea,
   cada tarea a un requisito, cada requisito a una necesidad de usuario.

Speckit materializa estas reglas en artefactos Markdown que viven junto al
código, se revisan como código y evolucionan como código.

## SDD vs vibe coding

"Vibe coding" es el estilo opuesto: pedir a un LLM que resuelva la funcionalidad
directamente, iterando por conversación sin registro estructurado del contrato.
Funciona para spikes, prototipos y exploración; se rompe rápido cuando el
sistema entra en producción, hay más de una persona tocándolo o el LLM tiene
que retomar el hilo tres semanas después.

| Dimensión | SDD (Speckit) | Vibe coding |
|---|---|---|
| **Control** | El humano fija el contrato antes de generar código. | El LLM propone y el humano acepta/rechaza sobre la marcha. |
| **Trazabilidad** | Cada cambio se ancla a spec/plan/tasks versionados. | La conversación es el único registro; se pierde al cerrar la sesión. |
| **Coste de cambio** | Cambios de scope se discuten en la spec antes de tocar código. | Cambios de scope requieren re-generar y re-integrar código ya escrito. |
| **Calidad del output** | Convergente: el LLM tiene contrato claro, produce menos alucinaciones. | Divergente: el LLM improvisa; el resultado depende del turno de conversación. |
| **Encaje con revisiones de PR** | Alto: spec + plan viajan con el diff, revisor sabe qué evaluar. | Bajo: PR llega sin contrato; el revisor infiere intención del diff. |
| **Deuda técnica generada** | Baja: decisiones explícitas quedan registradas y se pueden revisitar. | Alta: decisiones implícitas se descubren tarde, cuando alguien pregunta "¿por qué esto es así?". |
| **Coste inicial** | Alto: escribir spec y plan lleva tiempo antes de ver código. | Bajo: código sale en la primera respuesta del LLM. |
| **Curva de aprendizaje** | Media: exige interiorizar el ciclo Speckit y sus artefactos. | Baja: sabes prompt engineering básico y ya. |

SDD no es "vibe coding con más pasos". Es un flujo con **puntos de decisión
humana** entre cada fase: la spec se revisa antes de planificar, el plan antes
de descomponer en tareas, las tareas antes de implementar. El LLM ejecuta; el
humano decide.

## Por qué SDD encaja en Java empresarial

Java empresarial acumula tres características que se alinean casi de forma
natural con SDD:

- **Contratos REST explícitos.** APIs con OpenAPI, versión mayor, consumidores
  externos. Una spec que define query params, shape de respuesta y códigos de
  error se traduce con muy poca fricción a un `contracts/openapi.yaml` que
  vive en el repo.
- **Tests aguas arriba.** JUnit + MockMvc + Testcontainers son el idioma
  habitual. `tasks.md` puede descomponer la implementación en tareas de test
  antes que de código, encajando con TDD sin fricción.
- **Revisiones humanas obligatorias.** Merge requests con revisor formal,
  auditoría de cumplimiento, cuatro ojos para tocar producción. Speckit alimenta
  al revisor: el PR incluye `spec.md`, `plan.md` y `tasks.md`, y el revisor
  puede evaluar cambios de scope, decisiones técnicas y descomposición antes
  de mirar el diff.

Añade que la mayoría de proyectos Java conviven con **legacy** (código con años
de decisiones acumuladas, sin documentación viva). SDD ofrece una vía honesta
para introducir método sin reescribir: se codifica lo que ya es cierto en la
constitution y se aplica el ciclo a los cambios nuevos, no a lo heredado. Ver
[brownfield.md](brownfield.md) para el detalle.

## Cuándo NO usar SDD

SDD introduce fricción intencional. Compensa cuando esa fricción compra
trazabilidad y calidad. No compensa en estos escenarios:

- **Spikes exploratorios.** Estás probando si una librería sirve, si una
  integración funciona, si un algoritmo escala. El objetivo es aprender y tirar
  el código. Escribir spec y plan es contraproducente; usa una rama efímera y
  toma notas en el commit final.
- **Hotfixes urgentes.** Producción caída, cinco minutos para arreglar, el
  cambio es de una línea. Aplica el fix, documenta el post-mortem, y si el
  hotfix esconde un cambio estructural, abre a posteriori una spec para
  consolidarlo.
- **Prototipos desechables.** Demo para un cliente, POC de fin de semana,
  respuesta rápida a un stakeholder. Speckit sobra; el código se tirará.
- **Cambios de una línea con impacto nulo.** Renombrar una variable, ajustar
  un log, subir un timeout. Un commit basta.
- **Refactors mecánicos guiados por herramienta.** Ejecutar un codemod, un
  `spotless:apply` o una migración de linter. Sin decisiones de diseño, no
  hay spec que redactar.

Criterio de decisión: si al terminar el cambio te costaría explicar en tres
frases **qué hace**, **por qué** y **cómo se verifica**, entonces sí compensa
SDD.

## Cómo seguir este módulo

1. [Flujo Speckit paso a paso](flujo.md) — los pasos del ciclo (obligatorios y
   opcionales), qué produce cada uno, cuándo dispararlos.
2. [Caso guía](caso-guia.md) — recorrido end-to-end del ciclo sobre una
   funcionalidad realista (búsqueda + paginación en `GET /users` del CRUD de
   ejemplo).
3. [Greenfield](greenfield.md) — cómo arrancar un proyecto Java nuevo con
   Speckit.
4. [Brownfield](brownfield.md) — cómo introducir Speckit en un proyecto Java
   existente (moderno y legacy).
5. [Antipatrones](antipatrones.md) — errores frecuentes con síntoma, causa y
   contramedida.

