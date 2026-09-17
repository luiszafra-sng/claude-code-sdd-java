# Implementation Plan: Esqueleto del sitio MkDocs de la formación

**Branch**: `001-mkdocs-skeleton` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-mkdocs-skeleton/spec.md`

## Summary

Montar el esqueleto navegable del sitio MkDocs Material de la formación, gestionado con
`uv`, con siete secciones placeholder, identidad visual propia definida en `extra.css`
(Inter + IBM Plex Mono, paleta acorde, claro/oscuro con `prefers-color-scheme`),
accesibilidad WCAG 2.1 AA como objetivo declarado, y build `--strict` limpia desde el
primer commit. Sin CI/CD ni contenido real de módulos en esta fase.

Enfoque técnico: repositorio Python "docs-only" con `pyproject.toml` + `uv.lock`,
`mkdocs.yml` centralizando configuración, `docs/stylesheets/extra.css` concentrando
todos los tokens visuales, un logo/favicon SVG placeholder, y siete páginas placeholder
homogéneas (H1 + párrafo + admonition).

## Technical Context

**Language/Version**: Python `>=3.12` (fijado en `pyproject.toml` + `.python-version`).

**Primary Dependencies**: `mkdocs`, `mkdocs-material`, `pymdown-extensions`. Todo Python
puro; sin dependencias nativas.

**Storage**: N/A (sitio estático generado; sin persistencia).

**Testing**: sin suite de código. Verificación por comandos: `uv run mkdocs build
--strict` (exit 0, sin `WARNING`), inspección manual de navegación y alternancia de
tema, y auditoría de accesibilidad automatizada (Lighthouse o axe DevTools) sobre
`site/` construido localmente.

**Target Platform**: sitio estático servido en local vía `uv run mkdocs serve`
(`http://127.0.0.1:8000`). Entornos: macOS, Linux, WSL2. Windows nativo fuera de
alcance.

**Project Type**: docs-only (sitio de documentación estático). No hay `src/` de
aplicación en esta feature.

**Performance Goals**: build `mkdocs build --strict` < 30 s en máquina de desarrollo
razonable con el esqueleto (≈10 páginas). No aplican objetivos de latencia en runtime
por ser HTML/CSS/JS estático.

**Constraints**:
- `uv` como único gestor Python en el flujo principal (no `pip`/`venv`/`poetry`).
- `uv run mkdocs build --strict` sin warnings desde el primer commit.
- Toda la identidad visual centralizada en `docs/stylesheets/extra.css`.
- WCAG 2.1 AA como objetivo declarado en ambos temas (contraste, foco, teclado, `alt`,
  jerarquía de headings).
- Español en UI/contenido; comandos y términos técnicos en su idioma original.

**Scale/Scope**: 7 secciones placeholder + 1 home. Estimación del esqueleto:
≤ 10 páginas Markdown, ≤ 500 líneas de configuración/CSS, ≤ 5 dependencias Python.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Aplica | Estado | Notas |
|-----------|--------|--------|-------|
| I. Documentación como Producto | Sí | PASS | Tema `mkdocs-material`, español, tokens visuales en `docs/stylesheets/extra.css`, doble audiencia enunciada en la home. |
| II. Java-Céntrico, Doble Tipología | Sí (indirecto) | PASS | Sección "App de ejemplo (Spring Boot 4)" ya reservada en la navegación; contenido llega en spec 3. |
| III. Toolchain Reproducible vía SDKMAN | Sí (parcial) | PASS | Este feature no usa Java; SDKMAN aplica desde spec 2/3. Aquí `uv` cumple el equivalente (versiones fijadas, lock commiteado). |
| IV. Spec-Driven Development por defecto | Sí | PASS | Este propio ciclo (`specify` → `clarify` → `plan` → `tasks` → `implement`) valida el principio. |
| V. Agentes/Skills documentados | No | N/A | Fuera de alcance de este feature. |
| VI. Publicación automatizada GitLab Pages | Sí | PASS-con-nota | CI/CD explícitamente diferido a spec 8; este feature deja el sitio listo para que la spec 8 sólo añada el pipeline. `--strict` obligatorio desde el primer commit ya asegura la puerta de calidad. |

Content & Tooling Constraints: estructura de repo con `docs/` para docs. Sin secretos.
Idioma español. Todo alineado. Sin violaciones que justificar.

**Post-Design re-check (después de Phase 1)**: se mantiene PASS en todos los principios;
`research.md`, `data-model.md` y `quickstart.md` no introducen dependencias nuevas ni
cambian el alcance.

## Project Structure

### Documentation (this feature)

```text
specs/001-mkdocs-skeleton/
├── plan.md                       # Este archivo
├── spec.md                       # Especificación funcional
├── research.md                   # Phase 0 (este comando)
├── data-model.md                 # Phase 1 (este comando)
├── quickstart.md                 # Phase 1 (este comando)
├── contracts/                    # N/A para esta feature (sitio estático)
└── checklists/
    └── requirements.md           # Checklist de calidad de la spec
```

### Source Code (repository root)

```text
claude-code-sdd-java/
├── mkdocs.yml                    # Configuración MkDocs Material (tema, palette, nav, plugins)
├── pyproject.toml                # Metadata + deps (grupo docs) + requires-python
├── uv.lock                       # Lock reproducible de uv (commiteado)
├── .python-version               # Versión Python concreta gestionada por uv
├── .gitignore                    # Ignora .venv/, site/, .uv-cache/; NO ignora uv.lock
├── README.md                     # Instalación (uv), levantar, build, añadir páginas/deps
└── docs/
    ├── index.md                  # Home (presentación + audiencia dual + mapa de módulos)
    ├── introduccion/
    │   └── index.md              # Placeholder "Introducción"
    ├── setup/
    │   └── index.md              # Placeholder "Setup del entorno"
    ├── claude-md/
    │   └── index.md              # Placeholder "CLAUDE.md"
    ├── app-ejemplo/
    │   └── index.md              # Placeholder "App de ejemplo (Spring Boot 4)"
    ├── sdd/
    │   └── index.md              # Placeholder "SDD con Speckit"
    ├── agentes/
    │   └── index.md              # Placeholder "Agentes"
    ├── skills/
    │   └── index.md              # Placeholder "Skills"
    ├── stylesheets/
    │   └── extra.css             # Tokens visuales únicos (paleta, tipografía, spacing)
    └── assets/
        ├── logo.svg              # Placeholder SVG
        ├── favicon.svg           # Placeholder SVG
        └── fonts/                # Vacío en esta feature (Google Fonts vía CDN)
```

**Structure Decision**: proyecto docs-only. Sin `src/` ni `tests/` de aplicación. Toda
la lógica reside en configuración (`mkdocs.yml`) y contenido (`docs/`). El proyecto
Python es envoltura mínima para orquestar `mkdocs` con `uv`. Las carpetas `examples/`
y `.claude/` mencionadas en la constitution NO se crean todavía; llegan con specs
posteriores.

## Complexity Tracking

Sin violaciones. Tabla vacía intencionalmente.
