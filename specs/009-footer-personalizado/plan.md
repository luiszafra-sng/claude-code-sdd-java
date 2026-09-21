# Implementation Plan: Fecha de revisión por página sin texto genérico del generador

**Branch**: `009-footer-personalizado` | **Date**: 2026-09-21 | **Spec**: [spec.md](spec.md)

**Status**: Implemented

## Summary

Añadir la fecha del último commit git al final del contenido de cada página (mecanismo nativo de Material for MkDocs), alineada a la derecha, en formato español largo. Eliminar el texto "Made with Material for MkDocs" mediante la opción `extra.generator: false` de MkDocs.

**Decisión de diseño**: El planteamiento inicial contemplaba un footer custom con logo de Sngular (`overrides/partials/footer.html`). Se descartó durante la implementación en favor del mecanismo nativo de Material (`<aside class="md-source-file">`), que muestra la fecha dentro del contenido del artículo y deja claro que pertenece a esa página concreta.

## Technical Context

**Language/Version**: Python 3.12 (`.python-version` en raíz)

**Primary Dependencies**:
- `mkdocs==1.6.1` (existente)
- `mkdocs-material==9.7.7` (existente)
- `mkdocs-git-revision-date-localized-plugin==1.6.0` (añadido)

**Storage**: N/A — sitio estático; el historial git actúa como fuente de metadatos de fecha.

**Testing**: `uv run mkdocs build --strict` (cero warnings = criterio de aceptación)

**Target Platform**: Sitio estático publicado en GitHub Pages / GitLab Pages

**Project Type**: Documentación estática (MkDocs Material)

**Performance Goals**: Sin regresión de tiempo de build apreciable (el plugin puede elevar el build de ~0,5 s a ~2 s en repos con historial extenso, aceptable aquí).

**Constraints**:
- Todos los estilos en `docs/stylesheets/extra.css` (Principio I, constitution)
- Dependencias con `==` en `pyproject.toml` gestionadas con `uv`
- Sin CSS inline
- Sin override de templates de Material

## Constitution Check

| Principio | Estado | Notas |
|-----------|--------|-------|
| I — Identidad visual centralizada | **PASS** | Ajuste de alineación en `extra.css`; sin CSS en templates |
| I — Tono y contenido | **N/A** | No se modifica contenido formativo |
| III — Toolchain reproducible | **PASS** | Dependencia nueva fijada con `==`; gestionada con `uv` |
| IV — Flujo Speckit | **PASS** | Esta spec sigue el flujo completo |
| VI — GitLab Pages | **FLAG** | El plugin requiere historial git en CI. Coordinado con spec 008. |

## Project Structure

### Documentation (this feature)

```text
specs/009-footer-personalizado/
├── plan.md              # Este archivo
├── research.md          # Decisiones técnicas
├── data-model.md        # Flujo de metadatos git → template
├── quickstart.md        # Guía de validación end-to-end
└── tasks.md             # Plan de tareas ejecutado
```

### Source Code (cambios aplicados)

```text
mkdocs.yml                   # plugin git-revision-date-localized + extra.generator: false
pyproject.toml               # mkdocs-git-revision-date-localized-plugin==1.6.0
uv.lock                      # Actualizado por uv sync
docs/
└── stylesheets/
    └── extra.css            # .md-source-file { text-align: right }
```

**No creados** (descartados durante implementación):
- `overrides/partials/footer.html` — se usó el footer nativo de Material
- Clases CSS `.sng-footer*` — no requeridas sin footer custom
