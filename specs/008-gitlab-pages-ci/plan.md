# Implementation Plan: Publicación automática en GitLab Pages (CI/CD con uv)

**Branch**: `008-gitlab-pages-ci` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-gitlab-pages-ci/spec.md`

## Summary

Automatizar la publicación del sitio MkDocs en GitLab Pages usando `uv` como único gestor Python. Aportar dos jobs de GitLab CI (`pages` en `main`, `build-mr` en merge requests filtrados por paths), caché de uv versionada por `uv.lock`, cancelación de pipelines redundantes en `main`, notificación por email por defecto ante fallo, visibilidad Pages **Internal**, badges de pipeline y sitio en README y una guía operativa en `docs/publicacion.md` (fuera de la navegación del sitio). Enfoque técnico: fichero declarativo `.gitlab-ci.yml` con imagen `ghcr.io/astral-sh/uv:python3.12-bookworm-slim`, comandos `uv sync --frozen` + `uv run mkdocs build --strict [--site-dir public]`, artefacto `public/` en Pages y `interruptible: true` a nivel de job.

## Technical Context

**Language/Version**: YAML (GitLab CI schema vigente), Python 3.12 en runtime del pipeline (imagen `ghcr.io/astral-sh/uv:python3.12-bookworm-slim`).

**Primary Dependencies**: GitLab CI/CD, GitLab Pages, `uv` (gestor Python, preinstalado en la imagen), `mkdocs-material` y plugins declarados en `pyproject.toml` con pin exacto (`==`), `uv.lock` versionado.

**Storage**: N/A. Artefacto de build en `public/` publicado por GitLab Pages. Caché de uv en `.uv-cache/` y `~/.cache/uv/`, invalidada por hash de `uv.lock`.

**Testing**: verificación funcional vía ejecución del propio pipeline:
- Build local reproducible: `uv sync --frozen && uv run mkdocs build --strict --site-dir public`.
- Simulación local del job MR (mismo comando sin `--site-dir`).
- Ejecución del pipeline en un MR de prueba (WIP) y observación del filtro por `changes:`.
- Ejecución del pipeline en `main` tras el merge y comprobación de la URL de Pages.

**Target Platform**: instancia GitLab (SaaS o self-hosted) con GitLab Pages habilitado y runners Linux amd64 con executor Docker.

**Project Type**: infraestructura / documentación como producto. Sin código de aplicación en esta feature. Afecta únicamente a `.gitlab-ci.yml`, `README.md`, `docs/publicacion.md`.

**Performance Goals**:
- Build en caliente (caché válida): reducción ≥50% del paso `uv sync --frozen` respecto a build en frío (SC-004).
- Objetivo orientativo de tiempo end-to-end del job `pages` con caché caliente: ≤3 minutos en runner estándar. No es un requisito duro; se documenta para monitorización.

**Constraints**:
- MUST usar exclusivamente `uv` (Principio: `CLAUDE.md` "Gestor Python"; sin `pip`, `venv`, `pipenv`, `poetry`, `conda`).
- MUST fallar ante warnings de MkDocs (`--strict`) y ante desincronía `uv.lock`/`pyproject.toml` (`--frozen`).
- MUST cancelar pipelines redundantes en `main` (`interruptible: true`).
- MUST publicar sitio con visibilidad **Internal**.
- MUST no añadir `docs/publicacion.md` a la navegación de `mkdocs.yml`.
- Trigger del job `build-mr`: sólo si el MR toca `docs/**/*`, `mkdocs.yml`, `pyproject.toml` o `uv.lock`.

**Scale/Scope**: sitio MkDocs Material del repositorio; volumen actual < 100 páginas. Un único proyecto GitLab, una sola URL de Pages. Sin multi-región ni multi-idioma.

## Constitution Check

*GATE: pasar antes de Phase 0. Re-checkear tras Phase 1.*

Aplican los siguientes principios de la constitution 1.1.0:

| Principio | Aplicación en esta feature | Estado |
|-----------|----------------------------|--------|
| I. Documentación como Producto | La feature garantiza publicación automática y bloquea warnings; refuerza calidad y homogeneidad del sitio. `docs/publicacion.md` mantiene tono profesional y directo. | PASS |
| II. Java-Céntrico | No aplica. Feature de infraestructura del sitio; no afecta a ejemplos Java. | N/A |
| III. Toolchain Reproducible (SDKMAN + herramientas Claude) | No introduce herramientas nuevas del entorno Claude. Fija imagen y versión Python (3.12) del pipeline. `uv.lock` reproduce dependencias. `docs/publicacion.md` documenta cómo actualizar dependencias. | PASS |
| IV. SDD como método por defecto | Esta feature atraviesa `/specify` → `/clarify` → `/plan` → `/tasks` → `/implement`. | PASS |
| V. Extensiones Claude Code | No aplica. Feature no toca agentes ni skills. | N/A |
| VI. Publicación Automatizada en GitLab Pages | Objetivo central de la feature. Cumple: `.gitlab-ci.yml` con job `pages`, versiones fijadas (Python 3.12, `uv.lock`), `--strict` bloquea warnings, publica sólo desde `main`. | PASS |

Content & Tooling Constraints:
- `docs/publicacion.md` vive dentro de `docs/` pero NO se incluye en `nav` de `mkdocs.yml` (documentación interna del repo). El resto de la estructura del repo no cambia. **PASS**.
- Idioma español para la nueva página. **PASS**.
- Sin secretos ni credenciales en el pipeline. **PASS**.

Development & Publishing Workflow:
- Feature originada con `/speckit-specify` y trazable en `specs/008-gitlab-pages-ci/`. **PASS**.
- Re-verificación semestral: la imagen `ghcr.io/astral-sh/uv:python3.12-bookworm-slim` y la versión Python 3.12 pertenecen a la categoría "versión de referencia + fecha de verificación". Se documenta en `docs/publicacion.md` con fecha `2026-09-16`. **PASS**.

**Resultado**: sin violaciones. No hay entradas en Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/008-gitlab-pages-ci/
├── plan.md              # Este archivo
├── research.md          # Phase 0 (decisiones técnicas)
├── data-model.md        # Phase 1 (entidades del pipeline)
├── quickstart.md        # Phase 1 (validación end-to-end)
├── contracts/
│   ├── gitlab-ci.contract.md   # Contrato del .gitlab-ci.yml (jobs, reglas, caché)
│   └── readme-badges.contract.md # Contrato de badges en README
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 (`/speckit-tasks`; no lo genera este comando)
```

### Source Code (repository root)

Feature de infraestructura y documentación. Sin árbol de `src/`. Ficheros tocados en la raíz del repo:

```text
claude-code-sdd-java/
├── .gitlab-ci.yml       # NUEVO — pipeline con jobs `pages` y `build-mr`
├── README.md            # MODIFICADO — badges de pipeline y sitio publicado
├── docs/
│   └── publicacion.md   # NUEVO — guía operativa interna (no en nav)
├── mkdocs.yml           # SIN CAMBIOS (`publicacion.md` no se añade a `nav`)
├── pyproject.toml       # SIN CAMBIOS
└── uv.lock              # SIN CAMBIOS
```

**Structure Decision**: feature puramente declarativa. Único fichero nuevo de CI en la raíz (`.gitlab-ci.yml`), una página Markdown interna en `docs/` y modificación puntual del README. No requiere `src/` ni tests unitarios: la validación se realiza mediante la ejecución del propio pipeline sobre un MR de prueba y sobre `main`.

## Complexity Tracking

Sin violaciones que justificar. No aplica.
