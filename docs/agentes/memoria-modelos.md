# Memoria y modelos

Un agente combina tres decisiones de contexto: qué **memoria** hereda,
qué **modelo** Claude ejecuta el prompt, y qué **coste/latencia**
implica esa elección. Esta página cubre las tres.

## Tipos de memoria

Un agente en Claude Code convive con varias fuentes de contexto que se
componen en la prompt de sistema en el momento de la invocación:

| Fuente | Origen | Cuándo aplica al agente |
|--------|--------|-------------------------|
| Prompt del agente | Cuerpo del archivo `.claude/agents/<slug>.md`. | Siempre, es su identidad. |
| `CLAUDE.md` de usuario | `~/.claude/CLAUDE.md`. | Se antepone al prompt del agente si existe. |
| `CLAUDE.md` de proyecto | `CLAUDE.md` en la raíz del repo. | Se compone a continuación; gana ante contradicciones. |
| Memoria de sesión | Turnos previos del hilo principal. | Sólo si el agente NO aísla contexto. Por defecto, los agentes arrancan sin este historial. |
| Memoria persistente del usuario | Sistema de ficheros bajo `~/.claude/projects/*/memory/` (si el usuario la usa). | Se aplica si Claude Code decide consultarla; puede saltarse en agentes con `tools` restringidas. |
| Memoria persistente del agente (`memory:`) | Directorio dedicado según el ámbito declarado: `~/.claude/agent-memory/<name>/` (user), `.claude/agent-memory/<name>/` (project) o `.claude/agent-memory-local/<name>/` (local). | Se activa sólo si el frontmatter declara `memory`. Sobrevive entre sesiones; ver detalle en [Anatomía → Memoria persistente del agente](anatomia.md#memoria-persistente-del-agente). |

Reglas útiles:

- Un agente NO es una extensión del hilo. Empieza cada invocación con
  su prompt como sistema y el mensaje del usuario como primer turno.
  Si necesitas que herede historial, se lo pasa el hilo principal
  explícitamente.
- Los `CLAUDE.md` (usuario + proyecto) sí se componen; por eso las
  reglas ahí escritas afectan al agente sin necesidad de duplicarlas.
- La memoria persistente es útil para preferencias estables ("este
  usuario prefiere fragmentos cortos", "el proyecto usa Java 21"). No
  la utilices como store transaccional del agente.

## Elección de modelo

Claude Code expone tres familias mediante alias cortos:

| Alias | Perfil | Coste relativo | Latencia | Uso recomendado en agentes |
|-------|--------|----------------|----------|----------------------------|
| `haiku` | Rápido, económico, contexto medio. | Bajo | Baja (~ms/token) | Clasificación, extracción, tareas repetitivas de baja ambigüedad (etiquetar issues, filtrar logs, formatear). |
| `sonnet` | Equilibrado; razonamiento sólido con coste moderado. | Medio | Media | Diagnóstico dirigido, generación de código con contexto claro, revisión de PRs. Baseline para la mayoría de agentes. |
| `opus` | Máxima capacidad de razonamiento y planificación larga. | Alto | Alta | Refactors amplios, diseño arquitectónico, resolución de bugs con múltiples hipótesis abiertas, agentes que deben planificar antes de actuar. |

Recomendación por defecto: **empieza en `sonnet`**. Baja a `haiku` si
mides que la tarea no requiere razonamiento (etiquetar, resumir, buscar
patrones) y sube a `opus` sólo si observas que Sonnet se queda corto
tras varias iteraciones.

El agente `spring-boot-debugger` de este repo usa `sonnet`: el ciclo
localizar → reproducir → diff → tests encaja con su perfil sin
justificar el coste de `opus`.

## Coste y latencia — heurística práctica

- **Coste**: proporcional a los tokens de entrada + salida. Un prompt
  largo con `opus` puede costar un orden de magnitud más que el mismo
  prompt con `haiku`. Fija `model:` explícito para evitar sorpresas
  cuando el hilo principal use otro.
- **Latencia**: Haiku responde en el orden de milisegundos por token;
  Opus tarda visiblemente más. En agentes interactivos (autocompleción,
  correcciones rápidas) prefiere Haiku o Sonnet.
- **Consistencia**: modelos más grandes tienden a producir salidas más
  estables entre ejecuciones cuando el prompt es complejo; a cambio,
  invierten más tiempo/tokens antes de responder.

Para experimentar sin quemar tokens: prototipa con `sonnet`, mide con
tu caso real (medias de 5 ejecuciones), y decide bump/downgrade según
la mejora observada.

## Siguiente paso

Elegido el modelo, hay que decidir dónde vive el agente: sólo para ti
o para todo el equipo que trabaje sobre el repo. Continúa en
[Alcance](alcance.md).

!!! info "Versión de referencia"
    Modelos verificados el **2026-09-16** contra la documentación
    oficial de Claude Code: familia Claude 4.x con alias cortos
    `haiku`, `sonnet` y `opus`. Revisar cada 6 meses conforme al
    workflow de la constitution v1.0.2.
