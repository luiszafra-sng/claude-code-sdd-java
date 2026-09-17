# Alcance

Una skill puede vivir en varias ubicaciones. La elección determina
quién la ve, cómo se distribuye y qué pasa cuando dos skills con el
mismo nombre coexisten.

## Ubicaciones reconocidas por Claude Code

| Ubicación | Ruta | Ámbito |
|-----------|------|--------|
| Usuario | `~/.claude/skills/<slug>/SKILL.md` | Todas tus sesiones locales, en cualquier repo. No se sincroniza automáticamente entre máquinas. |
| Proyecto | `.claude/skills/<slug>/SKILL.md` | Cualquier sesión abierta dentro del repo. Se commitea y se comparte con el equipo. |
| Subproyecto | `<subdir>/.claude/skills/<slug>/SKILL.md` | Sesiones abiertas en `<subdir>` o por debajo. Útil en monorepos. |
| Enterprise | `.claude/skills/` gestionado por administración | Todos los usuarios de la organización. |
| Directorio extra | Ruta pasada con `--add-dir` | Sólo esa sesión concreta. |
| Plugin | `<plugin>/skills/<slug>/SKILL.md` | Distribución centralizada; invocación como `/plugin:slug`. |
| `claude.ai` sync | Skills sincronizadas desde tu cuenta | Sesiones cloud; local sólo si activas `CLAUDE_CODE_SYNC_SKILLS=1`. |

## Cuándo elegir cada ámbito

- **Usuario (`~/.claude/skills/`)**: preferencias personales que quieres
  arrastrar entre proyectos (por ejemplo, un `commit-message-writer`
  que aplica tu estilo). No aparece en el repo; el resto del equipo
  no la ve ni la reproduce.
- **Proyecto (`.claude/skills/`)**: skills específicas del proyecto y
  compartidas por el equipo. Se commitean y se revisan en MR como
  cualquier otro fichero. Es el ámbito habitual cuando la skill
  depende de la convención del repo.
- **Subproyecto**: cuando una skill sólo tiene sentido dentro de un
  módulo concreto de un monorepo.
- **Plugin**: cuando quieres distribuir la skill a varios repos con
  versionado propio. Los plugins la exponen bajo namespace propio
  (`/nombre-plugin:slug`).

## Skills locales vs plugins

Un plugin es un empaquetado que puede contener skills, agentes, hooks
y comandos, distribuido como una unidad. La skill "local" es un
directorio suelto bajo `.claude/skills/`. Diferencias operativas:

| Aspecto | Skill local | Plugin |
|---------|-------------|--------|
| Instalación | Copiar el directorio o clonar el repo. | `claude plugin install <repo>` (o mecanismo equivalente). |
| Namespace | `/nombre` directo. | `/nombre-plugin:slug`. |
| Actualización | Manual: `git pull` o copia. | Comando del plugin manager. |
| Coexistencia | Puede colisionar con otras skills del mismo nombre. | Namespace evita colisiones. |
| Casos típicos | Skills del repo compartidas con el equipo. | Skills distribuidas a varios repos con versión propia. |

Como regla práctica, opta por **skill local** (usuario o proyecto)
cuando quieras iterar rápido; empaquétala como **plugin** cuando
necesites distribuirla a varios repos con versión propia.

## Cómo listar las skills disponibles

Claude Code expone las skills conocidas al inicio de la sesión. Desde
el hilo puedes:

- Escribir `/` para ver el menú de comandos disponibles, que incluye
  las skills invocables.
- Consultar `~/.claude/skills/` y `.claude/skills/` con `ls` para ver
  las que ya tienes instaladas.
- Preguntar directamente en el hilo ("¿qué skills tengo disponibles?");
  Claude conoce las descripciones ya cargadas en el contexto de sesión.

## Precedencia ante colisiones

Si `~/.claude/skills/foo/` y `.claude/skills/foo/` existen a la vez, la
del proyecto gana. La razón es la misma que en `CLAUDE.md`: el proyecto
es más específico y suele encarnar la decisión del equipo.

Diagnóstico rápido de colisiones:

```bash
ls ~/.claude/skills/
ls .claude/skills/
```

Si un slug aparece en ambas, renombra la variante que no aporte o
elimínala. Deja siempre una única definición autoritativa.

## Recomendación práctica

- Empieza en `~/.claude/skills/` para probar la skill sin afectar al
  resto del equipo.
- Cuando la skill sea estable y aporte al proyecto, muévela a
  `.claude/skills/` del repo para compartirla.
- Reserva los plugins para skills que quieras distribuir a más de un
  repo con versionado propio.

## Siguiente paso

Antes de construir una skill propia, revisa el
[catálogo](catalogo.md) para reutilizar o inspirarte en las que ya
existen.
