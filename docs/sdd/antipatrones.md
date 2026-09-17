# Antipatrones del flujo Speckit

Speckit da estructura, pero no impide malos usos. Esta página lista los
antipatrones más frecuentes observados en equipos que adoptan SDD, con
síntoma, causa raíz y contramedida. No pretende ser exhaustiva: si
encuentras uno nuevo, añádelo aquí en una spec dedicada.

## Cómo leer esta página

Cada antipatrón sigue el mismo formato:

- **Síntoma**: qué observas en los artefactos o en el flujo del equipo.
- **Causa**: por qué aparece (raíz, no efecto).
- **Contramedida**: qué hacer para revertirlo.

Léela después de haber ejecutado al menos un ciclo Speckit completo; sin
esa referencia, algunos antipatrones sonarán abstractos.

## Spec vaga

**Síntoma**: `spec.md` con adjetivos sin métrica ("rápido", "escalable",
"intuitivo"), user stories sin acceptance scenarios verificables, edge cases
como "manejar errores adecuadamente".

**Causa**: se disparó `/speckit-specify` con un prompt corto ("añadir
búsqueda") sin describir necesidad, restricciones ni criterios de éxito. El
LLM completó los huecos con placeholders genéricos.

**Contramedida**: reescribe el prompt describiendo necesidad, actor,
restricciones (retro-compatibilidad, contratos existentes, políticas) y
criterios de éxito medibles. Dispara `/speckit-clarify` para forzar
concreción en las decisiones que quedaron abstractas. Rechaza pasar al plan
mientras existan `[NEEDS CLARIFICATION]` o SCs no medibles.

## Tareas sin criterio de aceptación

**Síntoma**: `tasks.md` con líneas del tipo "Implementar UserService" o
"Añadir validación", sin ruta de fichero, sin criterio de "cuándo se
considera hecha".

**Causa**: `/speckit-tasks` ejecutado sobre un `plan.md` que no fijó
decisiones concretas, o revisor humano que aprobó las tareas sin criterio
propio.

**Contramedida**: enriquece cada tarea con **ruta de fichero absoluta o
relativa** y una acción verbal específica. Añade en revisión el "definition
of done" a nivel de fase (no de tarea individual). Cuando una tarea tiene
que ser genérica ("polish"), explicita qué se pule y contra qué se mide.

## Saltarse el plan

**Síntoma**: se pasa de `/speckit-specify` a `/speckit-implement` sin
`plan.md` ni `tasks.md`. Speckit incluso lo permite si no aplicas gates.

**Causa**: percepción de que "el plan es papeleo" para features "pequeñas".

**Contramedida**: aunque la feature sea pequeña, un plan de 20 líneas y una
lista de 4 tareas es más barato que descubrir en el implement que hay 3
decisiones técnicas sin tomar. Si la feature es tan trivial que ni siquiera
justifica plan/tasks, probablemente **no justifica Speckit**: aplica el fix
directo y documéntalo en el commit (ver [Cuándo NO usar SDD](index.md#cuando-no-usar-sdd)).

## Editar código sin spec

**Síntoma**: cambios en `src/` que no responden a ninguna tarea en `tasks.md`
de ninguna spec activa. Aparecen en el diff sin trazabilidad.

**Causa**: se acostumbra al equipo a "un pequeño arreglo mientras estaba por
ahí". Sin freno, el proyecto vuelve al vibe coding con Speckit decorativo.

**Contramedida**: los merge requests que introduzcan cambios en `src/` sin
FR/tarea asociada quedan bloqueados hasta que exista spec y task, o hasta
que el cambio se justifique explícitamente como hotfix/exploración
declarada. Añade al `CLAUDE.md` del proyecto la línea
"NEVER modificar código de aplicación fuera de una spec activa".

## `/speckit-clarify` cosmético

**Síntoma**: la sección `Clarifications` del spec contiene preguntas sobre
nombres de variables, orden estético de tablas, o preferencias personales
del reviewer. No hay preguntas que impacten arquitectura, contrato o UX.

**Causa**: el comando se disparó por rutina, no por ambigüedad real. O el
revisor confunde revisión de estilo con clarificación de spec.

**Contramedida**: si al ejecutar `/speckit-clarify` no aparece ninguna
pregunta que cambie arquitectura, contrato, tests o alcance, **no lo
ejecutes**. La regla del comando es máximo 5 preguntas que materialmente
importen. Cero preguntas relevantes es una respuesta válida: pasa a
`/speckit-plan`.

## `plan.md` que dicta código

**Síntoma**: `plan.md` incluye pseudocódigo detallado, firmas exactas de
métodos, contenido literal de tests. Ocupa 800 líneas y se parece más a un
draft de PR que a un plan.

**Causa**: confusión entre "plan" e "implementación anticipada". El autor
quiere quitarse la ambigüedad… escribiendo el código en Markdown.

**Contramedida**: `plan.md` fija **decisiones de arquitectura** (qué patrón,
qué librería, qué modelo de datos) y **restricciones** (rendimiento,
compatibilidad, seguridad). El código concreto lo produce
`/speckit-implement`. Si necesitas anclar una firma para un contrato
externo, va en `contracts/`, no en `plan.md`. Regla práctica: si un
`plan.md` supera 300 líneas, sospecha.

## `/speckit-analyze` ignorado

**Síntoma**: se ejecuta `/speckit-analyze`, aparecen findings de coverage
gaps o inconsistencias, y se pasa directo a `/speckit-implement` "porque
ya llevamos tarde".

**Causa**: `analyze` se percibe como sugerencia, no como gate. El equipo
descubre en producción los gaps que `analyze` había señalado.

**Contramedida**: adopta la política "cero findings HIGH o superior antes
de implement". Los MEDIUM se documentan en el PR con justificación. Los
LOW pueden diferirse. Si `analyze` no se ejecuta, se documenta por qué
(features triviales, tiempo de gate justificado). Los findings ignorados
sistemáticamente son deuda técnica escondida.

## `/speckit-converge` como coartada

**Síntoma**: el equipo modifica código sin spec previa y después dispara
`/speckit-converge` esperando que "detecte" el trabajo hecho y lo formalice
como tarea a posteriori.

**Causa**: uso inverso del comando. `converge` compara **spec → código** para
detectar trabajo pendiente; no legitima código sin spec.

**Contramedida**: si detectas que hay código sin spec, la respuesta correcta
es **abrir una spec retroactiva** que describa lo que se hizo y por qué,
y añadir el gap como deuda a resolver. `converge` sigue siendo útil para
detectar gaps reales; deja de serlo si se usa como sello de aprobación
posthoc.

## Prompt con solución preescrita

**Síntoma**: el prompt de `/speckit-specify` incluye stack, patrones,
librerías y hasta rutas de fichero. Por ejemplo: "crear
`UserSearchController.java` que use `JpaSpecificationExecutor` y devuelva
`Page<UserDto>`".

**Causa**: el autor confunde spec con implementación. Cortocircuita
`/speckit-plan` metiendo decisiones técnicas en la spec.

**Contramedida**: el prompt de specify describe **necesidad y restricciones**,
no solución. "El endpoint acepta filtros por email y nombre" es spec; "usar
`JpaSpecificationExecutor`" es plan. Si aparecen decisiones técnicas en la
spec, extráelas a `plan.md` en Phase 0 de decisiones. Ver el prompt
recomendado en [caso-guia.md](caso-guia.md#prompt-inicial-para-speckit-specify).

## Tests escritos después del `implement`

**Síntoma**: `tasks.md` no incluye tareas de test explícitas. Los tests
aparecen "cuando queda tiempo", generalmente en un PR de polish separado.

**Causa**: percepción de que Speckit no requiere TDD (correcta), extrapolada
a "los tests son opcionales" (incorrecta).

**Contramedida**: incluye tareas de test explícitas en `tasks.md`, ya sea
antes (TDD) o intercaladas con la implementación. Las tareas de test tienen
la misma prioridad que las de código; si el equipo no las ejecuta, el
release no cierra. En Java, MockMvc + Testcontainers ofrecen el mejor
compromiso coste/valor; usarlos por convención evita el debate por feature.

## Constitution que nadie ha leído

**Síntoma**: `Constitution Check` en `plan.md` pasa "por defecto" con
"PASS" en todas las filas, sin nota. Nadie del equipo sabe qué principios
contiene la constitution.

**Causa**: la constitution existe como fichero pero no se ha convertido en
práctica. Los `Constitution Check` se rellenan como formulario.

**Contramedida**: revisa la constitution en la primera reunión de cada
sprint (o su equivalente). Cuando un `Constitution Check` marque un
principio como PASS, exige nota explicativa (aunque sea una línea). En
brownfield, si la constitution es aspiracional, cámbiala a descriptiva
(ver [brownfield.md](brownfield.md#constitution-descriptiva-no-aspiracional)).

## Enlaces relacionados

- [Flujo Speckit paso a paso](flujo.md) — dónde encaja cada antipatrón.
- [Caso guía](caso-guia.md) — ejemplo positivo end-to-end.
- [Brownfield](brownfield.md) — antipatrones específicos de adopción legacy.
- [CLAUDE.md](../claude-md/index.md) — capa proyecto que previene varios
  antipatrones desde la raíz.
