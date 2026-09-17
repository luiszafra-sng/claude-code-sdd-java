# Anatomía

Un agente de Claude Code es un archivo Markdown con dos bloques
diferenciados: un **frontmatter YAML** que declara la identidad y el
alcance operativo, y un **cuerpo Markdown** con el prompt del sistema
que Claude asume al ejecutarlo.

## Estructura mínima

```markdown
---
name: spring-boot-debugger
description: Diagnostica errores en apps Spring Boot 4 + Java 21 y propone diff mínimo con test de reproducción.
model: sonnet
tools: Read, Grep, Glob, Bash, Edit
---

# spring-boot-debugger

Instrucciones detalladas del agente en Markdown libre.
```

El archivo vive en `.claude/agents/` (proyecto) o en
`~/.claude/agents/` (usuario). El slug del archivo (`spring-boot-debugger.md`)
MUST coincidir con el campo `name` del frontmatter.

Sólo `name` y `description` son obligatorios. Todo lo demás (incluido
`memory`) es opcional; ver la tabla de frontmatter para los valores
por defecto de cada campo.

## Frontmatter

| Campo | Obligatorio | Formato | Default | Notas |
|-------|-------------|---------|---------|-------|
| `name` | Sí | kebab-case, único | — | Coincide con el nombre de archivo sin extensión. No admite `:`. |
| `description` | Sí | una línea, ≤160 caracteres | — | Base para el enrutado automático; describe cuándo invocarlo. |
| `model` | Opcional | `haiku`, `sonnet`, `opus`, ID completo o `inherit` | modelo del hilo principal | Alias corto; sobrevive a cambios menores de versión. |
| `tools` | Opcional | CSV de herramientas | pool por defecto que Claude Code otorga a los agentes | Allowlist; subconjunto mínimo suficiente para el prompt. |
| `disallowedTools` | Opcional | CSV de herramientas | ninguna denegación | Denylist para restar del pool heredado. |
| `memory` | Opcional | `user`, `project` o `local` | sin memoria persistente (cada invocación arranca sin estado) | Ver sección propia más abajo. |
| `isolation` | Opcional | `worktree` | sin aislamiento (edita in-place) | Ejecuta al agente en un worktree git efímero. |
| `permissionMode` | Opcional | `default`, `acceptEdits`, `plan`, `bypassPermissions`, ... | `default` | Modo de permisos aplicado al agente. |
| `maxTurns` | Opcional | entero positivo | sin límite explícito | Límite de turnos agénticos antes de parar. |
| `skills` | Opcional | lista | ninguna preprecargada | Skills que se preprecargan en el contexto del agente. |
| `mcpServers` | Opcional | lista | los del hilo principal | Servidores MCP disponibles para el agente. |
| `color` | Opcional | `red`, `blue`, `green`, ... | color automático | Color en la lista de tareas y transcripción. |

Los campos menos frecuentes (`hooks`, `background`, `omitClaudeMd`,
`effort`, `initialPrompt`, `experimental`) están recogidos en la
documentación oficial y aplican para casos avanzados; no los usamos
en la formación.

Si omites `model`, el agente hereda el del hilo principal. Si omites
`tools`, obtiene el conjunto por defecto que Claude Code otorgue a los
agentes en tu instalación, más amplio de lo que el prompt requiere;
declararlas es una buena práctica.

## Prompt del sistema

Todo lo que aparece bajo el frontmatter es el prompt del sistema del
agente. Se recomienda:

- Empezar con un **título H1** que repita el nombre del agente.
- Estructurar el proceso en **pasos numerados** cuando el agente tenga
  un ciclo claro (por ejemplo, diagnosticar → reproducir → fix).
- Describir **edge cases** que Claude debe reconocer: qué hacer si
  falta información, si no reproduce el problema, si el diff rompe otro
  test.
- Cerrar con **criterios de cierre**: cuándo el agente ha terminado y
  cuándo debe pedir intervención humana.

El prompt del sistema no admite variables ni plantillas: es texto plano
que Claude interpreta. Mantén las instrucciones concretas y evita
frases decorativas.

## Herramientas disponibles

El campo `tools` toma una lista CSV de herramientas expuestas por
Claude Code. Las más comunes:

| Herramienta | Uso típico |
|-------------|------------|
| `Read` | Leer archivos del repo. |
| `Write` | Crear archivos nuevos. |
| `Edit` | Modificar archivos existentes con `search/replace`. |
| `Bash` | Ejecutar comandos de shell. |
| `Grep` | Buscar patrones sobre el árbol. |
| `Glob` | Localizar archivos por patrón. |
| `WebFetch` | Descargar contenido HTTP. |
| `Task` | Delegar en otro agente. |

Declarar sólo lo necesario acota el radio de impacto: un agente de
auditoría con `Read, Grep` no puede modificar ni ejecutar procesos, lo
que reduce la superficie de error.

## Memoria persistente del agente

El campo `memory` activa un **almacén persistente por agente** que
sobrevive entre sesiones. Se materializa como un directorio propio
donde el agente puede escribir notas, aprendizajes o estado que quiera
recuperar en futuras invocaciones. No se confunde con el `CLAUDE.md`
ni con el historial de la conversación.

Los tres valores admitidos definen ubicación y ámbito:

| Valor | Ubicación | Cuándo elegirla |
|-------|-----------|-----------------|
| `user` | `~/.claude/agent-memory/<name>/` | Aprendizaje personal cruzado entre proyectos (por ejemplo, un `commit-message-writer` que retiene tu estilo). |
| `project` | `.claude/agent-memory/<name>/` | Memoria compartida con el equipo, versionable en git como cualquier otro artefacto del repo. |
| `local` | `.claude/agent-memory-local/<name>/` | Específica del proyecto pero personal a la máquina; NO se commitea (añádelo a `.gitignore`). |

Ejemplo de activación:

```yaml
---
name: code-reviewer
description: Revisa PRs aplicando las convenciones del equipo.
model: sonnet
tools: Read, Grep
memory: project
---
```

Reglas prácticas:

- Si eliges `project`, revisa el contenido antes de commitearlo: el
  agente puede haber almacenado texto que no debería salir del disco
  local.
- Si eliges `local`, asegúrate de que `.claude/agent-memory-local/`
  está en `.gitignore` para evitar leaks accidentales.
- Si el agente no necesita persistencia, omite el campo. Ese es el
  **valor por defecto**: sin `memory:` no se crea directorio y cada
  invocación arranca sin estado previo.

En este repo, el agente `spring-boot-debugger` **NO** declara `memory`:
cada diagnóstico es autocontenido (stacktrace + código actual) y no
gana valor recordando ejecuciones previas. Un `code-reviewer` o un
`architecture-advisor` sí se beneficiarían de `memory: project`.

## Isolación por worktree

Claude Code puede aislar la ejecución de un agente en un **worktree
git efímero**. En vez de trabajar sobre la copia principal, clona el
repo a un directorio temporal, ejecuta al agente allí y devuelve los
cambios como diff aplicable.

Se activa añadiendo `isolation: worktree` al frontmatter:

```yaml
---
name: security-audit
description: Audita dependencias en busca de CVEs y propone bumps.
model: sonnet
tools: Read, Grep, Bash
isolation: worktree
---
```

Ventajas:

- El estudiante no pierde cambios locales sin commitear si el agente
  se desvía.
- Permite ejecutar agentes potencialmente destructivos con red de
  seguridad.

Contras:

- Añade latencia (clonado inicial) y disco (worktree por invocación).
- Complica el feedback en repos con submódulos o build caches
  compartidas.

En este repo, el agente `spring-boot-debugger` **no** declara
`isolation: worktree`: prioriza feedback rápido sobre la app CRUD y
asume que el estudiante confía en git para revertir. En cambio, un
agente que refactorice masivamente o ejecute migraciones sí debería
usarlo.

## Siguiente paso

Con la anatomía clara, la siguiente decisión es qué modelo elegir y
cómo se combina con la memoria del hilo. Continúa en
[Memoria y modelos](memoria-modelos.md).
