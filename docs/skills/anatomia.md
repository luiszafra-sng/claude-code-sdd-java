# Anatomía

Una skill de Claude Code es un directorio con al menos un `SKILL.md`.
Ese archivo lleva un **frontmatter YAML** que declara identidad y
comportamiento, y un **cuerpo Markdown** con las instrucciones que
Claude aplica al invocarla. El resto de ficheros (scripts, assets,
documentos de referencia) son opcionales y se cargan de forma perezosa.

## Estructura de directorio

```text
~/.claude/skills/summarize-changes/
├── SKILL.md            # obligatorio: frontmatter + instrucciones
├── reference.md        # opcional: referencia lazy-loaded
├── examples.md         # opcional: ejemplos lazy-loaded
└── scripts/
    ├── helper.py       # opcional: script ejecutable
    └── render.sh
```

El slug del directorio (`summarize-changes/`) determina el comando por
defecto (`/summarize-changes`). El campo `name` del frontmatter puede
sobrescribirlo pero por consistencia se recomienda mantenerlos alineados.

## Frontmatter de `SKILL.md`

Todos los campos del frontmatter son opcionales. Aun así, `description`
se considera **recomendado** porque es lo que Claude usa para decidir
la invocación automática.

| Campo | Formato | Notas |
|-------|---------|-------|
| `name` | string | Nombre visible en listados. Por defecto se toma del directorio. |
| `description` | string | Qué hace la skill. Base para la invocación automática por Claude. |
| `when_to_use` | string | Frases o ejemplos que activan la skill (se concatena a `description` en la decisión). |
| `argument-hint` | string | Pista de autocompletado, p.ej. `[issue-number]`. |
| `arguments` | lista o string | Argumentos posicionales con nombre para sustituir `$name` en el cuerpo. |
| `disable-model-invocation` | boolean | `true` = solo el usuario invoca; Claude no la activa. |
| `user-invocable` | boolean | `false` = solo Claude puede invocarla; no admite `/nombre`. |
| `allowed-tools` | lista | Herramientas que la skill puede usar sin pedir permiso. |
| `disallowed-tools` | lista | Herramientas que se retiran del pool mientras la skill está activa. |
| `model` | alias o `inherit` | Modelo específico para la ejecución de la skill. |
| `effort` | `low`/`medium`/`high`/`xhigh`/`max` | Nivel de esfuerzo para la invocación. |
| `context` | `fork` | Ejecuta la skill en subagente aislado sin historial del hilo. |
| `agent` | string | Subagente a usar cuando `context: fork`. |
| `paths` | globs | Restringe la activación a rutas que casen con los patrones. |
| `shell` | `bash` \| `powershell` | Shell para los comandos inyectados en el cuerpo. |
| `hooks` | objeto | Hooks que se registran cuando se invoca. |
| `metadata` | objeto libre | Datos personalizados. |

Los campos sincronizables al ecosistema `claude.ai` / plugins de
marketplace son un subconjunto: `name`, `description`, `license`,
`compatibility`, `metadata`, `allowed-tools`. El resto son
específicos de Claude Code local.

## Triggers y cómo Claude decide invocarla

La documentación oficial reconoce tres mecanismos de invocación:

1. **Directa por el usuario**: escribe `/nombre-skill [argumentos]` en
   el hilo. También admite invocación apilada
   `/skill-a /skill-b arg` con expansión hasta seis skills inline.
2. **Automática por Claude**: en cada turno, las `description` (y
   `when_to_use`) de todas las skills accesibles se cargan en la
   ventana de contexto. Si el prompt del usuario encaja
   semánticamente con alguna descripción, Claude carga el
   `SKILL.md` completo y lo aplica. Bloqueable con
   `disable-model-invocation: true`.
3. **Programática desde plugins o subagentes**: un subagente puede
   preprecargar skills declarándolas en su frontmatter; un plugin
   distribuido las expone bajo `/plugin:skill-name`.

Filtros añadidos por el frontmatter:

- `paths` limita la activación a rutas del proyecto que casen con los
  globs indicados.
- `disable-model-invocation` y `user-invocable` regulan quién puede
  disparar la skill.

Regla útil para redactar descripciones: pensar en las frases que un
usuario escribiría cuando espera que la skill se active. Cuanto más
concretas, mejor decisión toma Claude. Descripciones vagas producen
falsos positivos (Claude carga la skill cuando no toca) o falsos
negativos (no la carga cuando debería).

## Inyección dinámica de contexto

El cuerpo del `SKILL.md` admite comandos inline que se ejecutan antes
de que Claude lea el archivo:

````markdown
## Estado actual del repo

!`git status --short`

## Instrucciones
Analiza el estado anterior y ...
````

El comando `` !`git status --short` `` se ejecuta con `bash` (o
`powershell` si `shell: powershell`) con timeout de 2 minutos y sujeto
a las reglas de permiso de Claude Code. Las skills usan esta capacidad
para grounding en tiempo real sin necesidad de scripts adicionales.

## Ciclo de contenido

Cuando una skill se invoca, el `SKILL.md` renderizado entra al hilo
como un mensaje y **permanece** durante turnos posteriores. Claude no
lo relee. Si vuelve a invocarse con el mismo contenido, Claude recibe
una nota corta en vez de duplicar el mensaje.

Los ficheros auxiliares (`reference.md`, `examples.md`, scripts) NO se
cargan salvo que la skill los referencie explícitamente durante su
ejecución. Es el mecanismo natural para ahorrar tokens cuando hay
material extenso.

## Siguiente paso

Con la anatomía clara, la siguiente pregunta es dónde instalar la
skill y quién puede verla. Continúa en [Alcance](alcance.md).

!!! info "Versión de referencia"
    Documentación consultada el **2026-09-16** contra
    <https://code.claude.com/docs/en/skills>. Los campos y triggers
    listados aquí son los observados en esa fecha; la doc oficial
    puede añadir campos nuevos. Conviene revisarla al menos cada seis
    meses.
