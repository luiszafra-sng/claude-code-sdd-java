# Catálogo

Selección curada de repositorios públicos con agentes de Claude Code
reutilizables. Cada entrada se verificó accesible (HTTP 200) contra la
URL indicada en la columna `Verificado`. La lista se re-verifica cada
seis meses conforme al workflow de la constitution v1.0.2.

!!! tip "Cómo usar el catálogo"
    Ninguna entrada se instala automáticamente al clonar este repo.
    Para reutilizar un agente concreto, copia el archivo `.md`
    correspondiente a `~/.claude/agents/` (uso personal) o a
    `.claude/agents/` de tu proyecto (compartido con el equipo). Ver
    [Alcance](alcance.md) para las implicaciones.

| Nombre | Autor | Propósito | Enlace | Verificado |
|--------|-------|-----------|--------|------------|
| awesome-claude-code | hesreallyhim | Awesome list general de recursos para Claude Code (agentes, skills, plantillas, prompts). | <https://github.com/hesreallyhim/awesome-claude-code> | 2026-09-16 |
| awesome-claude-code-subagents | VoltAgent | Colección de más de 160 subagentes clasificados por dominio (backend, infra, seguridad, datos, ML). | <https://github.com/VoltAgent/awesome-claude-code-subagents> | 2026-09-16 |
| claude-agents | iannuttall | Set compacto de agentes generales pensados como plantilla base para personalizar. | <https://github.com/iannuttall/claude-agents> | 2026-09-16 |
| claude-code-sub-agents | dl-ezo | Pack de subagentes con enfoque en flujos de desarrollo full-stack y devops. | <https://github.com/dl-ezo/claude-code-sub-agents> | 2026-09-16 |
| claude-code-subagents | 0xfurai | Colección de subagentes especializados con instrucciones detalladas por rol técnico. | <https://github.com/0xfurai/claude-code-subagents> | 2026-09-16 |
| agents (marketplace) | wshobson | Marketplace de plugins con más de 200 agentes distribuibles vía Claude Code plugins. | <https://github.com/wshobson/agents> | 2026-09-16 |
| sub-agents | webdevtodayjason | Set orientado a desarrollo web moderno; útil como comparativa de estructura y prompts. | <https://github.com/webdevtodayjason/sub-agents> | 2026-09-16 |

## Criterios de inclusión

Un repositorio entra en el catálogo si cumple todo lo siguiente:

- Contiene agentes en formato `.claude/agents/*.md` o equivalente
  compatible con Claude Code.
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

Con la teoría cubierta y los referentes a mano, pasa a
[Crear uno](crear-uno.md) para construir tu primer agente propio
usando `spring-boot-debugger` como caso guía.
