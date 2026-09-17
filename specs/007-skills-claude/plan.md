# Implementation Plan: Módulo "Skills de Claude Code" (solo documentación)

**Branch**: `007-skills-claude` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-skills-claude/spec.md`

## Summary

Añadir al sitio MkDocs un módulo "Skills" con cinco páginas
(`index`, `anatomia`, `alcance`, `catalogo`, `crear-una`) exclusivamente
documental. NO se materializa ninguna skill en `.claude/skills/`. La
guía `crear-una.md` describe el proceso teórico con ejemplo ilustrativo
sobre el CRUD (scaffolder hipotético) y enlaces cruzados a Agentes y
SDD. Documentación pasa `mkdocs build --strict` y cumple la constitution
v1.1.0 (Principio V con skill propia relajada a SHOULD).

## Technical Context

**Language/Version**: Markdown (docs); toolchain runtime = Python 3.12 (MkDocs).

**Primary Dependencies**: MkDocs Material + plugins declarados en `pyproject.toml`.

**Storage**: Sistema de ficheros; sin persistencia adicional.

**Testing**: `uv run mkdocs build --strict` (docs). No hay artefactos ejecutables adicionales.

**Target Platform**: Sitio estático MkDocs (GitLab Pages).

**Project Type**: Formación — sitio de docs.

**Performance Goals**: Build MkDocs sin warnings.

**Constraints**: Tokens visuales en `docs/stylesheets/extra.css` (Principio I); dependencias fijadas con `==`; español profesional-directo; NO se crea ningún fichero bajo `.claude/skills/` en este feature.

**Scale/Scope**: 5 páginas MD nuevas + entrada en `mkdocs.yml` `nav` + tabla catálogo con 5–8 entradas verificadas.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitución vigente: **v1.1.0**.

| Principio | Aplicación al feature | Estado |
|-----------|-----------------------|--------|
| I. Documentación como Producto (tono profesional-directo, tokens en `extra.css`, ejemplos ejecutables) | 5 páginas MD con tono acordado; snippets y tablas ilustrativas. Sin CSS en línea. | PASS |
| II. Java-Céntrico Moderno + Legacy | El ejemplo ilustrativo usa perfil moderno (Spring Boot 4 + Java 21). Legacy no aplica aquí; se documenta que la técnica sería equivalente en legacy salvo detalles de convención. | PASS |
| III. Toolchain SDKMAN + herramientas documentadas | No introduce herramientas nuevas. Catálogo respeta la norma de fecha de verificación semestral. | PASS |
| IV. SDD por defecto | Feature nace de `/speckit-specify` + `/speckit-clarify`; plan generado por `/speckit-plan`. | PASS |
| V. Extensiones documentadas y ejemplificadas (v1.1.0: agente propio MUST, skill propia SHOULD) | Agente propio ya cubierto en spec 006. Este feature cubre la parte teórica de skills; no materializa skill propia (SHOULD relajado). Assumption y Clarifications lo documentan. | PASS |
| VI. Publicación automatizada GitLab Pages | Cambios pasan por `mkdocs build --strict`; pipeline existente los publica. | PASS |

Sin desviaciones que justificar. Complexity Tracking vacío.

## Project Structure

### Documentation (this feature)

```text
specs/007-skills-claude/
├── plan.md              # Este archivo
├── spec.md              # Especificación (ya generada)
├── research.md          # Fase 0
├── data-model.md        # Fase 1 (entidades documentales)
├── quickstart.md        # Fase 1 (validación end-to-end)
├── contracts/           # Fase 1 (contrato: entrada de catálogo)
│   └── catalog-entry.schema.md
├── checklists/
│   └── requirements.md  # Ya generado por /speckit-specify
└── tasks.md             # Fase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
claude-code-sdd-java/
├── mkdocs.yml                          # + entrada nav para módulo "Skills"
└── docs/
    └── skills/                         # Nuevo módulo de docs
        ├── index.md
        ├── anatomia.md
        ├── alcance.md
        ├── catalogo.md
        └── crear-una.md
```

**Structure Decision**: sin código nuevo bajo `.claude/skills/` ni bajo
`examples/`. Cambios se concentran en `docs/skills/` y `mkdocs.yml`.
Posición del módulo en `nav`: entre "Agentes" y "SDD con Speckit"
(memoria `feedback-nav-order`).

## Complexity Tracking

> Sin violaciones que justificar.
