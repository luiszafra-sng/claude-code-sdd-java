# Catálogo

Selección curada de repositorios públicos con skills de Claude Code
reutilizables o directamente inspirables. Cada entrada se verificó
accesible (HTTP 200) contra la URL indicada en la columna
`Verificado`. La lista se re-verifica al menos cada seis meses.

!!! tip "Cómo usar el catálogo"
    Copia la skill que te interese a `~/.claude/skills/<slug>/`
    (personal) o a `.claude/skills/<slug>/` de tu proyecto
    (compartido con el equipo). Consulta las implicaciones en
    [Alcance](alcance.md). Ninguna entrada se instala automáticamente
    al clonar este repo.

| Nombre | Autor | Propósito | Enlace | Verificado |
|--------|-------|-----------|--------|------------|
| agents (marketplace) | wshobson | Marketplace de plugins mixto (skills, agentes, comandos) con más de doscientas entradas por dominio. | <https://github.com/wshobson/agents> | 2026-09-16 |
| andrej-karpathy-skills | multica-ai | Skills replicando el estilo de trabajo de Andrej Karpathy; buen punto de partida para skills didácticas. | <https://github.com/multica-ai/andrej-karpathy-skills> | 2026-09-16 |
| awesome-claude-code | hesreallyhim | Awesome list de recursos para Claude Code (skills, agentes, prompts, plantillas); punto de entrada al ecosistema. | <https://github.com/hesreallyhim/awesome-claude-code> | 2026-09-16 |
| claude-code-templates | davila7 | Plantillas y skills reutilizables para distintos stacks de desarrollo. | <https://github.com/davila7/claude-code-templates> | 2026-09-16 |
| commands | wshobson | Colección de comandos/skills breves centrados en flujos de git, revisión y refactor. | <https://github.com/wshobson/commands> | 2026-09-16 |
| skills (oficial) | anthropics | Repositorio oficial de Anthropic con skills de referencia y ejemplos productivos. | <https://github.com/anthropics/skills> | 2026-09-16 |
| SuperClaude Framework | SuperClaude-Org | Framework que empaqueta skills y comandos con estructura homogénea; útil como referencia de arquitectura. | <https://github.com/SuperClaude-Org/SuperClaude_Framework> | 2026-09-16 |
| superpowers | obra | Pack de skills orientadas a productividad diaria; buen ejemplo de descripciones bien redactadas. | <https://github.com/obra/superpowers> | 2026-09-16 |

## Criterios de inclusión

Un repositorio entra en el catálogo si cumple todo lo siguiente:

- Contiene skills en formato `SKILL.md` (o equivalente compatible con
  Claude Code) o material claramente reutilizable como skill.
- Está publicado bajo un dominio público accesible sin credenciales.
- Su descripción es suficiente para entender el uso sin abrir el
  código.
- Se mantiene activo (última actualización razonable) o tiene
  suficiente contenido de referencia aunque esté congelado.

## Cómo reportar una entrada rota

Si al verificar semestralmente una entrada devuelve HTTP ≠ 200 o el
propósito ya no aplica, retírala de la tabla en el mismo MR que la
detecte y documenta el motivo en la descripción. No se admite dejar
entradas muertas con nota "revisar".

## Siguiente paso

Con teoría y referentes a mano, pasa a
[Crear una](crear-una.md) para ver el proceso teórico paso a paso con
ejemplo aplicado al CRUD.
