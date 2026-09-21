# Tasks: Fecha de revisión por página sin texto genérico del generador

**Input**: Design documents from `specs/009-footer-personalizado/`

**Prerequisites**: plan.md ✓ | spec.md ✓ | research.md ✓ | data-model.md ✓ | quickstart.md ✓

**Status**: Completed (con rediseño durante implementación — ver nota abajo)

> **Nota de rediseño**: Las fases 3–5 del plan original contemplaban un footer personalizado con logo de Sngular (`overrides/partials/footer.html` + clases `.sng-footer*`). Durante la implementación se decidió pivotar a la solución nativa de Material for MkDocs (fecha al final del artículo via `<aside class="md-source-file">`). Las tareas de la fase de rediseño recogen el estado final real del proyecto.

---

## Phase 1: Setup (Infraestructura compartida)

- [X] T001 Instalar `mkdocs-git-revision-date-localized-plugin` con `uv add --group docs mkdocs-git-revision-date-localized-plugin`, obtener versión resuelta de `uv.lock`, y fijar la entrada en `pyproject.toml` como `mkdocs-git-revision-date-localized-plugin==1.6.0` (cumple FR-005)
- [X] ~~T002 [P] Crear directorio `overrides/partials/` en la raíz del repositorio~~ *(revertido junto con el footer custom)*
- [X] T003 Ejecutar `uv sync` para regenerar `uv.lock` con la dependencia pinada y verificar que el entorno no tiene conflictos

**Checkpoint**: Dependencia instalada y pinada con `==`.

---

## Phase 2: Foundational (Prerrequisitos bloqueantes)

- [X] ~~T004 Añadir `custom_dir: overrides` bajo la clave `theme:` en `mkdocs.yml`~~ *(revertido: git no trackea directorios vacíos → fallo en CI; `custom_dir` eliminado de `mkdocs.yml`)*
- [X] T005 Añadir plugin `git-revision-date-localized` en `mkdocs.yml` con opciones: `enable_creation_date: false`, `locale: es`, `type: date`, `fallback_to_build_date: true` — **nota**: `type: date` (no `long`) usa `babel.dates.format_date(format="long", locale="es")` internamente
- [X] T006 Ejecutar `uv run mkdocs build --strict` y verificar cero warnings con configuración base

**Checkpoint**: `mkdocs.yml` configurado; build pasa sin warnings.

---

## Phase 3: Implementación inicial (parcialmente revertida)

> Las tareas T007–T016 implementaron el footer custom con logo. Posteriormente se revertieron en favor del mecanismo nativo de Material (Phase 4).

- [X] ~~T007 [US1] Copiar `footer.html` base de Material a `overrides/partials/footer.html` y adaptar estructura~~ *(revertido)*
- [X] ~~T008 [US1] Añadir `<img>` del logo dentro del `<div class="sng-footer">`~~ *(revertido)*
- [X] ~~T009 [US1] Añadir clases `.sng-footer` y `.sng-footer__logo` en `docs/stylesheets/extra.css`~~ *(revertido)*
- [X] ~~T010 [US2] Añadir fecha en el template del footer con guard `{% if page and page.meta and page.meta.git_revision_date_localized %}`~~ *(revertido)*
- [X] ~~T011 [US2] Añadir clase `.sng-footer__date` en `docs/stylesheets/extra.css`~~ *(revertido)*
- [X] ~~T012 [US3] Añadir media query responsive en `docs/stylesheets/extra.css`~~ *(revertido)*
- [X] T013 Corregir `generator: false` en `mkdocs.yml`: mover de `theme.generator` a `extra.generator` (el template de Material comprueba `config.extra.generator`, no `config.theme.generator`)

---

## Phase 4: Rediseño — solución nativa de Material (estado final)

- [X] T014 Eliminar `overrides/partials/footer.html` (pivotar a fecha inline nativa de Material via `partials/source-file.html`)
- [X] T015 Eliminar clases `.sng-footer`, `.sng-footer__logo`, `.sng-footer__date` y la media query responsive de `docs/stylesheets/extra.css`
- [X] T016 Añadir `.md-source-file { text-align: right }` en `docs/stylesheets/extra.css` para alinear la fecha nativa a la derecha del área de contenido
- [X] T017 Ejecutar `uv run mkdocs build --strict` y verificar: (a) cero warnings; (b) `grep -r "Made with Material" site/` sin resultados

**Checkpoint**: Fecha inline visible a la derecha al final del contenido; "Made with Material" ausente; build limpio.

---

## Phase 5: Polish y validación cruzada

- [X] T018 Verificar FR-005 final: `cat pyproject.toml | grep "git-revision-date"` muestra pin exacto con `==`
- [X] T019 Ejecutar `uv run mkdocs build --strict` como validación final (cero warnings = SC-003 pasa)
- [X] T020 Verificar `grep -r "Made with Material" site/` devuelve 0 resultados (SC-004)
- [X] T021 Documentar en el backlog de spec 008 (GitLab CI) que el pipeline debe incluir el nuevo plugin en su entorno de build (`specs/008-gitlab-pages-ci/notes.md`)

---

## Dependencies & Execution Order

- **Phase 1**: Sin dependencias
- **Phase 2**: Depende de Phase 1 completa
- **Phase 3**: Depende de Phase 2 — tareas de footer custom (revertidas)
- **Phase 4**: Depende de Phase 3 — rediseño hacia solución nativa
- **Phase 5**: Depende de Phase 4 completa
