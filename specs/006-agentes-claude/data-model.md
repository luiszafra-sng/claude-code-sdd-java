# Phase 1 — Data Model: Módulo Agentes + agente propio

El feature no manipula datos de aplicación; entrega artefactos
documentales y de configuración. Este modelo describe las entidades
"documentales" que gobiernan la implementación.

## Entidad 1 — `AgentDefinition`

Representa el archivo Markdown en `.claude/agents/` que define un
agente de Claude Code.

**Ubicación**: `.claude/agents/<slug>.md`.

| Campo (frontmatter) | Tipo | Reglas |
|---------------------|------|--------|
| `name` | string (kebab-case, único) | MUST coincidir con el nombre del archivo sin extensión. |
| `description` | string (una línea, ≤160 chars) | Describe cuándo invocar al agente; base para el enrutado automático. |
| `model` | enum: `haiku` \| `sonnet` \| `opus` | Alias corto, NO ID de versión. |
| `tools` | lista CSV | Subconjunto declarado y suficiente para el prompt. |
| `isolation` | opcional | Si presente, único valor válido: `worktree`. |

**Cuerpo (prompt del sistema)**: Markdown libre. Para el agente
`spring-boot-debugger`, MUST cubrir los cuatro pasos: localizar
stacktrace → test de reproducción → diff mínimo → tests con `./mvnw test`.

**Instancia obligatoria**: `spring-boot-debugger`
- `name`: `spring-boot-debugger`
- `model`: `sonnet`
- `tools`: `Read, Grep, Glob, Bash, Edit`
- `isolation`: ausente.

## Entidad 2 — `DocsPage`

Representa una página Markdown del sitio MkDocs bajo `docs/agentes/`.

| Campo | Tipo | Reglas |
|-------|------|--------|
| `slug` | string (kebab-case) | Nombre del archivo sin `.md`. |
| `title` | string | Se declara vía `nav` en `mkdocs.yml`, no en el body. |
| `parent_module` | fijo | `Agentes`. |
| `admonitions` | opcional | Sintaxis `!!!` para notas/warnings/tips. |
| `code_blocks` | siempre con lenguaje explícito | Ej. `yaml`, `bash`, `markdown`. |
| `internal_links` | relativos | Entre páginas del sitio. |

**Instancias obligatorias** (una por página):

| slug | Propósito |
|------|-----------|
| `index` | Definición, cuándo usar, comparación agente vs skill. |
| `anatomia` | Frontmatter, prompt del sistema, tools, isolación worktree. |
| `memoria-modelos` | Tipos de memoria + Opus/Sonnet/Haiku (coste, latencia). |
| `alcance` | Usuario vs proyecto, versionado, colisiones. |
| `catalogo` | Tabla de 5–8 repos verificados. |
| `crear-uno` | Paso a paso + transcripción reducida sobre el CRUD. |

## Entidad 3 — `CatalogEntry`

Fila de la tabla en `docs/agentes/catalogo.md`.

| Campo | Tipo | Reglas |
|-------|------|--------|
| `nombre` | string | Título corto del agente/pack. |
| `autor` | string | Persona u organización propietaria del repo. |
| `proposito` | string ≤120 chars | Para qué sirve, sin marketing. |
| `enlace` | URL absoluta | MUST resolver `HTTP 200` en la fecha de verificación. |
| `verificado` | fecha ISO `YYYY-MM-DD` | Última verificación; obliga a re-check semestral. |

**Cardinalidad**: 5 ≤ N ≤ 8.

## Entidad 4 — `NavEntry`

Modificación a `mkdocs.yml`.

| Campo | Valor |
|-------|-------|
| `section` | `Agentes` |
| `position` | Entre "CLAUDE.md" y "SDD (Speckit)". |
| `children` | Seis entradas alineadas con los `slug` de las `DocsPage`. |

## Relaciones

- `DocsPage(crear-uno)` referencia a `AgentDefinition(spring-boot-debugger)` como caso guía y a la spec (`spec.md`) como fuente.
- `NavEntry` enumera exactamente las seis `DocsPage`.
- `CatalogEntry` vive dentro de `DocsPage(catalogo)`; no existen fuera.

## Reglas de validación derivadas de la spec

- FR-001..FR-008 mapean 1:1 a existencia y contenido de las `DocsPage`.
- FR-009..FR-011 mapean a la `AgentDefinition` y a la transcripción
  incluida en `DocsPage(crear-uno)`.
- FR-012 se valida con `uv run mkdocs build --strict`.
- FR-013 se valida por inspección: no debe aparecer `skills/` ni fix del bug.
