# Phase 1 — Data Model: Módulo Skills (solo documentación)

Feature estrictamente documental. Este modelo describe las entidades
documentales que gobiernan la implementación.

## Entidad 1 — `DocsPage`

Página Markdown del sitio MkDocs bajo `docs/skills/`.

| Campo | Tipo | Reglas |
|-------|------|--------|
| `slug` | string (kebab-case) | Nombre del archivo sin `.md`. |
| `title` | string | Se declara vía `nav` en `mkdocs.yml`. |
| `parent_module` | fijo | `Skills`. |
| `admonitions` | opcional | Sintaxis `!!!` para notas/warnings/tips. |
| `code_blocks` | siempre con lenguaje explícito | Ej. `yaml`, `bash`, `markdown`. |
| `internal_links` | relativos | Entre páginas del sitio. |

**Instancias obligatorias**:

| slug | Propósito |
|------|-----------|
| `index` | Definición de skill, cuándo usarla, comparativa mínima skill vs agente. |
| `anatomia` | Estructura de una skill (`SKILL.md`, scripts, assets), triggers, cómo Claude decide invocarla. |
| `alcance` | Usuario vs proyecto, plugins vs skills locales, cómo listar disponibles. |
| `catalogo` | Tabla 5–8 repositorios verificados. |
| `crear-una` | Paso a paso teórico + ejemplo ilustrativo scaffolder CRUD + enlaces cruzados a Agentes y SDD. |

## Entidad 2 — `CatalogEntry`

Fila de la tabla en `docs/skills/catalogo.md`.

| Campo | Tipo | Reglas |
|-------|------|--------|
| `nombre` | string | Título corto del pack o skill. |
| `autor` | string | Persona u organización propietaria del repo. |
| `proposito` | string ≤120 chars | Para qué sirve, sin marketing. |
| `enlace` | URL absoluta | MUST resolver `HTTP 200` en la fecha de verificación. |
| `verificado` | fecha ISO `YYYY-MM-DD` | Última verificación; obliga a re-check semestral. |

**Cardinalidad**: 5 ≤ N ≤ 8.

## Entidad 3 — `NavEntry`

Modificación a `mkdocs.yml`.

| Campo | Valor |
|-------|-------|
| `section` | `Skills` |
| `position` | Entre "Agentes" y "SDD con Speckit". |
| `children` | Cinco entradas alineadas con los `slug` de `DocsPage`. |

## Relaciones

- `NavEntry` enumera exactamente las cinco `DocsPage`.
- `CatalogEntry` vive dentro de `DocsPage(catalogo)`; no existen fuera.
- `DocsPage(crear-una)` referencia a `docs/agentes/index.md` y a
  `docs/sdd/index.md` como enlaces cruzados.

## Reglas de validación derivadas de la spec

- FR-001..FR-007 mapean 1:1 a existencia y contenido de las `DocsPage`.
- FR-006 mapea al contrato `CatalogEntry`.
- FR-008 se valida por inspección: `.claude/skills/` NO debe contener
  nada añadido por este feature.
- FR-009 se valida con `uv run mkdocs build --strict`.
- FR-010 se valida por inspección: no debe aparecer contenido de
  pipeline CI/CD.
