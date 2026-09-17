# Implementation Plan: Módulo "Setup del entorno"

**Branch**: `002-setup-entorno` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-setup-entorno/spec.md`

## Summary

Publicar el módulo "Setup del entorno" bajo `docs/setup/` con siete páginas
(`index.md`, `sdkman.md`, `claude-code.md`, `rtk.md`, `caveman.md`,
`codegraph.md`, `verificacion.md`) que permiten a un participante dejar
operativo su entorno de Claude en menos de 30 minutos, con comandos
copy-paste, una shell canónica (Bash) con nota de equivalencia Zsh, JDK
Liberica vía SDKMAN, autenticación Claude Code dual (OAuth + API key con
criterios), documentación exhaustiva de métodos de instalación para RTK,
Caveman y CodeGraph, y bloque "versión de referencia + fecha de
verificación" por página siguiendo la política semestral de la constitution
1.0.2.

Enfoque técnico: sólo contenido Markdown + `mkdocs.yml`. Sin código
aplicación. Cada página respeta la estructura fija de cinco secciones
(FR-003) para permitir aterrizaje directo. La verificación se hace vía
`uv run mkdocs build --strict`, revisión manual del checklist final, y
cronómetro sobre una máquina limpia.

## Technical Context

**Language/Version**: Markdown (CommonMark + extensiones PyMdown) sobre
MkDocs Material. Sin lenguaje de aplicación.

**Primary Dependencies**: dependencias ya declaradas en `pyproject.toml`
(grupo `docs`) por la spec 001: `mkdocs`, `mkdocs-material`,
`pymdown-extensions`. Sin dependencias nuevas.

**Storage**: N/A. Sitio estático.

**Testing**: sin suite de código. Verificación por:
- `uv run mkdocs build --strict` (heredado del Principio VI).
- Revisión manual del checklist de `verificacion.md`.
- Test cronometrado (SC-001) sobre máquina limpia.
- Revisión de tono 5/5 contra Principio I de la constitution (SC-004).

**Target Platform**: sitio estático servido en local (`uv run mkdocs
serve`) y — en spec futura 8 — publicado en GitLab Pages. La audiencia del
contenido: macOS 13+, Ubuntu 22.04+, WSL2 sobre Windows 11.

**Project Type**: docs-only. Añade contenido bajo `docs/setup/`, sin `src/`
ni `tests/`.

**Performance Goals**: build `mkdocs build --strict` sigue en < 30 s con
las nuevas páginas. Sitio en runtime irrelevante (HTML estático).

**Constraints**:
- Bash como shell canónica para todos los snippets (Clarifications Q1).
- Autenticación Claude Code documentada en dos vías (OAuth + API key) con
  criterios explícitos (Clarifications Q2).
- JDK **BellSoft Liberica** `21.0.4-librca` como valor por defecto en
  SDKMAN (Clarifications Q3).
- Métodos de instalación **exhaustivos** para RTK, Caveman, CodeGraph, con
  tabla comparativa (Clarifications Q4).
- Bloque **versión + fecha de verificación** obligatorio en cada página de
  herramienta; re-verificación semestral (Clarifications Q5, constitution
  1.0.2).
- Registro profesional-directo (constitution 1.0.1 Principio I).
- Comandos copy-paste puros (FR-004).
- `--strict` sin warnings (Principio VI heredado).

**Scale/Scope**: 7 páginas nuevas Markdown; estimación ≤ 1500 líneas
totales. Sin nuevos assets binarios (screenshots opcionales quedan como
`TODO(asset)` según FR-014).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution 1.0.2 vigente.

| Principio | Aplica | Estado | Notas |
|-----------|--------|--------|-------|
| I. Documentación como Producto | Sí | PASS | Registro profesional-directo (spec FR-013). Tokens visuales heredados de spec 001. |
| II. Java-Céntrico, Doble Tipología | Sí (parcial) | PASS | SDKMAN + Liberica preparan el terreno para specs 4 y 5. La app CRUD queda referenciada como enlace pendiente en `codegraph.md`. |
| III. Toolchain Reproducible vía SDKMAN | Sí | PASS | Este módulo es literalmente la puerta de entrada al Principio III: SDKMAN + JDK Liberica + Maven documentados con comandos exactos. Herramientas Claude Code / RTK / Caveman / CodeGraph también documentadas con qué hace / instalar / verificar / cuándo usar / gotchas. |
| IV. SDD por defecto | Sí | PASS | Este propio ciclo (specify → clarify → plan → tasks → implement) valida el principio. |
| V. Agentes / Skills | No | N/A | Fuera de alcance de este módulo. Diferido a specs 6 y 7. |
| VI. Publicación automatizada GitLab Pages | Sí | PASS-con-nota | CI/CD diferido a spec 8. `--strict` sigue exigido. |

**Norma operativa "Re-verificación semestral"** (Development & Publishing
Workflow, constitution 1.0.2): CUBIERTA por FR-015. Cada página de
herramienta llevará bloque "versión + fecha" y estará sujeta a la política
de refresco semestral.

Complexity Tracking: sin violaciones.

**Post-Design re-check (después de Phase 1)**: PASS mantenido. `research.md`,
`data-model.md` y `quickstart.md` no introducen dependencias ni cambian
alcance.

## Project Structure

### Documentation (this feature)

```text
specs/002-setup-entorno/
├── plan.md                       # Este archivo
├── spec.md                       # Especificación funcional
├── research.md                   # Phase 0
├── data-model.md                 # Phase 1
├── quickstart.md                 # Phase 1
├── contracts/                    # N/A (contenido puro, sin APIs)
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
claude-code-sdd-java/
├── mkdocs.yml                    # Actualizar nav de "Setup del entorno" con 7 hijos
└── docs/
    └── setup/
        ├── index.md              # Reemplazar placeholder actual
        ├── sdkman.md             # Nuevo
        ├── claude-code.md        # Nuevo
        ├── rtk.md                # Nuevo
        ├── caveman.md            # Nuevo
        ├── codegraph.md          # Nuevo
        └── verificacion.md       # Nuevo
```

**Structure Decision**: sólo contenido Markdown + un único cambio en
`mkdocs.yml` (nav de la sección "Setup del entorno" pasa de `setup/index.md`
plano a estructura anidada con 7 páginas). Ningún directorio nuevo fuera de
`docs/setup/`. `docs/assets/fonts/` y `docs/stylesheets/extra.css` sin
cambios en esta feature.

## Complexity Tracking

Sin violaciones. Tabla vacía intencionalmente.
