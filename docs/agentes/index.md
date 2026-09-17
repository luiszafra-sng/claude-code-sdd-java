# Agentes

Los **agentes** de Claude Code son perfiles de trabajo especializados
que Claude Code puede activar dentro de una sesión para atender un
tipo concreto de tarea. Este módulo explica qué son, cuándo conviene
usarlos, cómo se definen, dónde viven y cuál es la diferencia con las
**skills**. Termina con un catálogo curado de agentes reutilizables y
una guía paso a paso para construir uno propio orientado a la app CRUD
de ejemplo.

## Qué es un agente

Un agente es un archivo Markdown con **frontmatter YAML** que declara
un nombre, una descripción, un modelo Claude y un subconjunto de
herramientas disponibles. El cuerpo del archivo contiene el **prompt
del sistema**: instrucciones dedicadas que Claude asume cuando el
agente entra en juego.

Cuando el agente se invoca, Claude Code:

1. Aísla el contexto: el agente arranca con su prompt propio y sin la
   memoria conversacional del turno anterior.
2. Restringe las herramientas: sólo puede usar las declaradas en
   `tools`.
3. Puede aplicar el modelo declarado (`haiku`, `sonnet`, `opus`),
   independiente del modelo activo en el hilo principal.

Un agente no es un subproceso opaco: Claude Code invoca al agente,
espera su resultado y lo devuelve al hilo principal como un mensaje.
El hilo principal decide qué hacer con la respuesta.

## Cuándo usarlo

Considera un agente cuando se cumpla al menos una de estas condiciones:

- La tarea es **repetible** y aparece con frecuencia (auditoría de
  seguridad, generación de tests, diagnóstico de errores Spring Boot).
- Necesita un **prompt del sistema estable**, distinto del que usas
  para la conversación general.
- Conviene **restringir herramientas** para reducir el radio de
  impacto (por ejemplo, un agente de revisión sólo con `Read` y
  `Grep`).
- Interesa **elegir modelo distinto** por coste o latencia (Haiku
  para clasificación rápida, Opus para razonamiento largo).

No uses un agente cuando la tarea sea puntual, cuando dependa del
contexto de la conversación actual o cuando cualquier prompt ad hoc
resuelva sin necesidad de fijar comportamiento.

## Diferencia agente vs skill

Agentes y skills son dos mecanismos de extensión distintos y
compatibles. La confusión habitual es tratarlos como sinónimos.

| Dimensión | Agente | Skill |
|-----------|--------|-------|
| Qué es | Perfil de trabajo con prompt propio, herramientas y modelo declarados. | Capacidad reutilizable expuesta como comando o pieza de contexto. |
| Cuándo se dispara | Cuando el usuario o Claude Code invocan al agente explícitamente por su nombre. | Cuando la conversación matchea un patrón definido en la skill (comando `/nombre`, palabra clave, contexto). |
| Alcance | Aísla su propio contexto y toolset. | Se ejecuta dentro del contexto del hilo principal. |
| Modelo | Puede fijar `model:` propio. | Hereda el modelo del hilo. |
| Ejemplo | `spring-boot-debugger` diagnostica errores de la app CRUD. | `/format-java` formatea el archivo abierto. |

Regla útil: si necesitas **prompt del sistema propio** y **modelo/tools
independientes**, es un agente. Si necesitas **un atajo reutilizable**
que aporte contexto o ejecute algo dentro del hilo, es una skill.

## Mapa del módulo

- [Anatomía](anatomia.md) — estructura del archivo del agente,
  frontmatter, prompt, herramientas y worktree.
- [Memoria y modelos](memoria-modelos.md) — tipos de memoria y guía
  Opus / Sonnet / Haiku.
- [Alcance](alcance.md) — agentes de usuario vs proyecto,
  consecuencias y versionado en git.
- [Catálogo](catalogo.md) — repositorios verificados de agentes
  reutilizables.
- [Crear uno](crear-uno.md) — paso a paso para construir un agente
  propio; caso guía `spring-boot-debugger` sobre el bug del CRUD.

[← Volver a la home del sitio](../index.md)
