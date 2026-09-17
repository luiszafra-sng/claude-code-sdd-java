# Skills

Las **skills** de Claude Code son capacidades reutilizables — típicamente
un `SKILL.md` con instrucciones y opcionalmente scripts o assets — que
Claude invoca cuando la conversación encaja con la descripción de la
skill o cuando el usuario la llama explícitamente con `/nombre-skill`.
Este módulo explica qué son, cuándo usarlas, cómo se estructuran, dónde
viven y ofrece un catálogo curado y una guía para construir la tuya
propia.

## Qué es una skill

Una skill es un directorio bajo `~/.claude/skills/<slug>/` (usuario) o
`.claude/skills/<slug>/` (proyecto) que contiene, como mínimo, un
`SKILL.md`. Ese archivo lleva un **frontmatter YAML** con la descripción
que Claude consulta para decidir si invocarla, más un cuerpo Markdown
con las instrucciones que Claude asume cuando la ejecuta.

Puede acompañarse de:

- Archivos de referencia (`reference.md`, `examples.md`) cargados de
  forma perezosa cuando la skill se invoca.
- Scripts ejecutables bajo `scripts/` que Claude puede lanzar durante
  la invocación.
- Assets (imágenes, plantillas, snippets) que la skill referencia.

## Cuándo usarla

Considera una skill cuando:

- Repites un mismo tipo de instrucción con parámetros distintos (por
  ejemplo, "genera controller REST para el recurso X").
- Necesitas exponer una capacidad invocable con `/comando` desde
  cualquier hilo, sin fijar prompt del sistema propio.
- Quieres empaquetar **contexto de referencia** (documentos, plantillas)
  que Claude cargará sólo cuando haga falta, ahorrando tokens.
- Te interesa que Claude decida automáticamente cuándo activarla en
  función de la descripción.

No uses una skill cuando la tarea exija prompt del sistema propio,
modelo distinto o tools restringidas: para eso está el agente.

## Diferencia práctica skill vs agente

Skill y agente son mecanismos complementarios. Confundirlos suele
llevar a soluciones sobre-ingeniadas.

| Dimensión | Skill | Agente |
|-----------|-------|--------|
| Qué es | Capacidad invocable / recurso de referencia empaquetado como `SKILL.md` (+ scripts / assets opcionales). | Ejecutor autónomo con contexto propio: prompt del sistema, modelo y tools declaradas. |
| Cuándo se dispara | Con `/nombre-skill` o cuando la descripción encaja con la conversación (invocación automática por Claude). | Cuando el usuario o Claude Code lo invocan explícitamente por su `name`. |
| Contexto | Su contenido se inyecta en el hilo actual y queda visible. | Arranca en un contexto propio; no ve el historial salvo que el hilo se lo pase. |
| Modelo | Hereda el modelo del hilo (salvo override explícito en la propia skill). | Puede fijar `model:` propio. |
| Casos típicos | Comandos reutilizables, plantillas, atajos, referencias cargadas bajo demanda. | Perfiles de trabajo especializados (revisor, depurador, refactor). |
| Ejemplo en la formación | Guía teórica de scaffolder de endpoints para el CRUD (esta página). | `spring-boot-debugger` en `.claude/agents/`. |

Regla útil: si necesitas **empaquetar contexto o comandos reutilizables**
es una skill; si necesitas **un perfil de trabajo aislado con reglas
propias** es un agente. Se combinan sin conflicto: un agente puede
depender de skills preprecargadas.

## Mapa del módulo

- [Anatomía](anatomia.md) — estructura de una skill, frontmatter,
  triggers y cómo Claude decide invocarla.
- [Alcance](alcance.md) — usuario vs proyecto, plugins y cómo listar
  las skills disponibles.
- [Catálogo](catalogo.md) — repositorios verificados con skills
  reutilizables.
- [Crear una](crear-una.md) — paso a paso para construir una skill
  propia con ejemplo aplicado al CRUD.

[← Volver a la home del sitio](../index.md)
