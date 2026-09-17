# Implementation Plan: Módulo "Agentes de Claude Code" + agente propio

**Branch**: `006-agentes-claude` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-agentes-claude/spec.md`

## Summary

Añadir al sitio MkDocs un módulo "Agentes" con seis páginas (`index`,
`anatomia`, `memoria-modelos`, `alcance`, `catalogo`, `crear-uno`) y
crear el agente propio `spring-boot-debugger` en `.claude/agents/`,
versionado y funcional sobre la app CRUD de ejemplo (spec 004). El
agente diagnostica errores Spring Boot 4 + Java 21 siguiendo el ciclo
localizar stacktrace → test de reproducción → diff mínimo → tests con
`./mvnw test`. Documentación pasa `mkdocs build --strict` y cubre el
Principio V de la constitution (definición, alcance, memoria, modelos,
catálogo, agente propio funcional).

## Technical Context

**Language/Version**: Markdown (docs), YAML front-matter (agente); toolchain runtime = Python 3.12 (MkDocs) + Java 21 (app referenciada).

**Primary Dependencies**: MkDocs Material + plugins ya declarados en `pyproject.toml`; Claude Code CLI para invocación del agente; Maven wrapper del CRUD (spec 004).

**Storage**: Sistema de ficheros; sin persistencia adicional.

**Testing**: `uv run mkdocs build --strict` (docs). Validación funcional del agente = invocación manual sobre bug NPE del CRUD; suite del CRUD ejecutada por el propio agente con `./mvnw test`.

**Target Platform**: Sitio estático MkDocs (GitLab Pages) + Claude Code local (macOS/Linux).

**Project Type**: Formación — sitio de docs + assets Claude Code (`.claude/agents/`).

**Performance Goals**: Build MkDocs sin warnings; agente responde ciclo completo en una sola pasada (SC-005).

**Constraints**: Sin CSS en línea (tokens en `docs/stylesheets/extra.css`); dependencias fijadas con `==`; español profesional-directo (Principio I); agente sin `isolation: worktree` (edición in-place).

**Scale/Scope**: 6 páginas MD nuevas + 1 archivo de agente + entrada en `mkdocs.yml` `nav` + tabla de catálogo con 5–8 entradas.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Aplicación al feature | Estado |
|-----------|-----------------------|--------|
| I. Documentación como Producto (tono profesional-directo, tokens en `extra.css`, ejemplos ejecutables) | Seis páginas MD con tono acordado, snippets ejecutables (frontmatter agente, comando invocación), sin CSS en línea. | PASS |
| II. Java-Céntrico Moderno + Legacy | Agente propio y ejemplos aplican perfil moderno (Spring Boot 4 + Java 21); legacy fuera de alcance de este feature (documentado como "no aplica en este módulo"). | PASS |
| III. Toolchain SDKMAN + herramientas documentadas | Comando `./mvnw test` neutraliza dependencia de Maven local; `memoria-modelos.md` y `catalogo.md` incluyen fecha de verificación semestral. | PASS |
| IV. SDD por defecto | Feature nace de `/speckit-specify` + `/speckit-clarify`; plan generado por `/speckit-plan`. | PASS |
| V. Agentes y skills documentados y ejemplificados | Núcleo del feature: definición, diferencias con skill, alcance usuario/proyecto, memoria, modelos, catálogo curado, agente propio funcional sobre app de ejemplo. | PASS |
| VI. Publicación automatizada GitLab Pages | Cambios pasan por `mkdocs build --strict`; pipeline existente los publica; no requiere modificar `.gitlab-ci.yml`. | PASS |

Sin desviaciones. Complexity Tracking vacío.

## Project Structure

### Documentation (this feature)

```text
specs/006-agentes-claude/
├── plan.md              # Este archivo
├── spec.md              # Especificación (ya generada)
├── research.md          # Fase 0
├── data-model.md        # Fase 1 (entidades documentales)
├── quickstart.md        # Fase 1 (validación end-to-end)
├── contracts/           # Fase 1 (contratos: frontmatter agente + entrada catálogo)
│   ├── agent-frontmatter.schema.md
│   └── catalog-entry.schema.md
├── checklists/
│   └── requirements.md  # Ya generado por /speckit-specify
└── tasks.md             # Fase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
claude-code-sdd-java/
├── mkdocs.yml                          # + entrada nav para módulo "Agentes"
├── docs/
│   └── agentes/                        # Nuevo módulo de docs
│       ├── index.md
│       ├── anatomia.md
│       ├── memoria-modelos.md
│       ├── alcance.md
│       ├── catalogo.md
│       └── crear-uno.md
└── .claude/
    └── agents/
        └── spring-boot-debugger.md    # Agente propio versionado
```

**Structure Decision**: sin código de aplicación nuevo. Cambios se
concentran en `docs/agentes/` (contenido), `mkdocs.yml` (nav) y
`.claude/agents/spring-boot-debugger.md` (agente). Ninguna carpeta de
`examples/` se modifica (fuera de alcance — el fix definitivo del bug
queda como ejercicio guiado en módulo posterior).

## Complexity Tracking

> Sin violaciones que justificar.
