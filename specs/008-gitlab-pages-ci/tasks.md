---

description: "Task list template for feature implementation"
---

# Tasks: Publicación automática en GitLab Pages (CI/CD con uv)

**Input**: Design documents from `/specs/008-gitlab-pages-ci/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: no se piden tests unitarios. La validación es funcional vía pipeline y `quickstart.md`.

**Organization**: agrupadas por user story para permitir implementación y validación independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizable (fichero distinto, sin dependencias con tareas incompletas).
- **[Story]**: user story asociada (US1, US2, US3, US4).
- Cada tarea incluye ruta absoluta del fichero afectado.

## Path Conventions

Feature de infraestructura y documentación. Sin `src/`. Ficheros tocados:

- `/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/.gitlab-ci.yml` (nuevo).
- `/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/README.md` (existente, se le añade cabecera de badges).
- `/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/docs/publicacion.md` (nuevo).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: preparar contexto y valores concretos del proyecto GitLab antes de tocar ficheros.

- [ ] T001 Recuperar los valores reales del proyecto GitLab (`GITLAB_HOST`, `NAMESPACE`, `PROJECT`, valor esperado de `$CI_PAGES_URL`) consultando `Project → Settings → General` y `Project → Deploy → Pages`. Persistirlos directamente en el commit de implementación:
  - En T015: sustituir los placeholders `<GITLAB_HOST>`, `<NAMESPACE>`, `<PROJECT>`, `<CI_PAGES_URL>` del `README.md` por los valores reales.
  - En T018: incluir la URL literal de Pages en la sección "Revisar el sitio publicado" de `docs/publicacion.md`.

  NO commitear tokens ni URLs con credenciales.
- [X] T002 Verificar en local que `uv sync --frozen` y `uv run mkdocs build --strict --site-dir public` completan sin error en la raíz `/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/`. Anotar duración del primer y segundo `uv sync --frozen` como línea base para SC-004. NO modificar `pyproject.toml` ni `uv.lock`.
- [X] T003 [P] Confirmar que `/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/mkdocs.yml` NO referencia `publicacion.md` en `nav` (validación pre-cambio). No modificar el fichero.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: crear el esqueleto compartido de `.gitlab-ci.yml` (imagen, variables, stages, caché global). Ambos jobs (`pages` y `build-mr`) dependen de este esqueleto.

**⚠️ CRITICAL**: sin este esqueleto no pueden añadirse ni US1 ni US2.

- [X] T004 Crear el fichero `/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/.gitlab-ci.yml` con la estructura top-level exigida por `contracts/gitlab-ci.contract.md`:
  - `image: ghcr.io/astral-sh/uv:python3.12-bookworm-slim`
  - `variables:` con `DEFAULT_BRANCH: "main"`, `UV_CACHE_DIR: "${CI_PROJECT_DIR}/.uv-cache"`, `UV_LINK_MODE: "copy"`
  - `stages: [build, deploy]`
  - `cache:` global con `key.files: ["uv.lock"]` y `paths: [".uv-cache/", "$HOME/.cache/uv/"]`
  - Sin jobs todavía.

  Verificar con `Repository → CI/CD → Editor → Lint` (o `glab ci lint` si disponible) que el YAML parsea aunque no tenga jobs (usar `workflow:` mínimo si el linter lo exige provisionalmente; retirarlo antes de merge si no aporta valor).

**Checkpoint**: base compartida lista. US1 y US2 pueden implementarse. US3 y US4 no dependen de este archivo y pueden comenzarse en paralelo si hay capacidad.

---

## Phase 3: User Story 1 - Publicación automática en `main` (Priority: P1) 🎯 MVP

**Goal**: al mergear cambios a `main`, el sitio MkDocs se publica automáticamente en GitLab Pages con visibilidad Internal.

**Independent Test**: mergear un cambio visible en `docs/` a `main`, observar el job `pages` en verde y verificar que el sitio publicado en `$CI_PAGES_URL` refleja el cambio (Escenario 3 de `quickstart.md`).

### Implementation for User Story 1

- [X] T005 [US1] Añadir al `/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/.gitlab-ci.yml` el job `pages` según `contracts/gitlab-ci.contract.md`:
  - `stage: deploy`
  - `interruptible: true`
  - `rules:` con `if: '$CI_COMMIT_BRANCH == $DEFAULT_BRANCH'`
  - `script:`
    - `uv sync --frozen`
    - `uv run mkdocs build --strict --site-dir public`
  - `artifacts.paths: ["public"]`
  - `artifacts.expire_in: "1 week"`
  - `environment: { name: "pages", url: "$CI_PAGES_URL" }`
- [ ] T006 [US1] Configurar en `Project → Settings → Pages → Access control` la visibilidad **Internal** (paso one-off en la UI de GitLab). Anotar la fecha del cambio.
- [ ] T007 [US1] Activar en `Project → Settings → CI/CD → General pipelines` la opción **Auto-cancel redundant pipelines** para complementar `interruptible: true` (Escenario 5, FR-015).
- [ ] T008 [US1] Validar T005 con GitLab CI Lint. Corregir cualquier error de sintaxis antes de continuar.
- [ ] T009 [US1] Ejecutar Escenarios 1 (parte de publicación), 3 y 4 de `quickstart.md` sobre una rama de prueba mergeada a `main` para confirmar publicación automática y visibilidad Internal.

**Checkpoint**: US1 fully functional. MVP entregado — el sitio se publica automáticamente desde `main`.

---

## Phase 4: User Story 2 - Validación en cada merge request (Priority: P1)

**Goal**: cada MR que toque `docs/**`, `mkdocs.yml`, `pyproject.toml` o `uv.lock` compila el sitio con `--strict`; el resto de MRs omite la build.

**Independent Test**: abrir un MR con cambio trivial en `docs/index.md`, comprobar que `build-mr` corre y pasa; introducir un enlace roto y comprobar fallo; abrir un MR fuera del filtro (por ejemplo `examples/`) y comprobar que el job se salta (Escenarios 1 y 2 de `quickstart.md`).

### Implementation for User Story 2

- [X] T010 [US2] Añadir al `/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/.gitlab-ci.yml` el job `build-mr` según `contracts/gitlab-ci.contract.md`:
  - `stage: build`
  - `interruptible: true`
  - `rules:` con un elemento:
    - `if: '$CI_PIPELINE_SOURCE == "merge_request_event"'`
    - `changes: ["docs/**/*", "mkdocs.yml", "pyproject.toml", "uv.lock"]`
  - `script:`
    - `uv sync --frozen`
    - `uv run mkdocs build --strict`
  - Sin `artifacts`.
- [ ] T011 [US2] Validar T010 con GitLab CI Lint. Corregir errores.
- [ ] T012 [US2] Ejecutar Escenario 1 completo (`quickstart.md`): MR con cambio en `docs/`, build en verde; introducir warning intencionado, verificar fallo; revertir.
- [ ] T013 [US2] Ejecutar Escenario 2 (`quickstart.md`): MR fuera del filtro (`examples/**`), verificar `skipped` del job `build-mr`.
- [X] T014 [US2] Verificar que `.gitlab-ci.yml` cumple restricciones transversales del contrato:
  - `grep -nE '\b(pip|venv|poetry|pipenv|conda)\b' /Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/.gitlab-ci.yml` sin resultados.
  - `grep -n '"main"' /Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/.gitlab-ci.yml` con un único resultado (línea `DEFAULT_BRANCH`).
  - `grep -nE '^\s*(only|except):' /Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/.gitlab-ci.yml` sin resultados.
  - `grep -n 'ghcr.io/astral-sh/uv:python3.12-bookworm-slim' /Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/.gitlab-ci.yml` con al menos 1 resultado (FR-002).
  - `grep -nE 'files:\s*\[\s*"?uv\.lock"?\s*\]' /Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/.gitlab-ci.yml` con 1 resultado (FR-007, clave de caché correcta).

**Checkpoint**: US1 y US2 operativas. Pipeline completo funcional. Publicación y calidad de MR cubiertas.

---

## Phase 5: User Story 3 - Badges de estado en README (Priority: P2)

**Goal**: el README muestra estado de pipeline `main` y enlace al sitio publicado.

**Independent Test**: abrir el README renderizado en GitLab y verificar los dos badges y sus enlaces (Escenario 7 de `quickstart.md`).

### Implementation for User Story 3

- [X] T015 [P] [US3] Editar `/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/README.md` insertando, inmediatamente tras el título de primer nivel, el bloque de badges definido en `contracts/readme-badges.contract.md`:
  - Badge de pipeline: `[![Pipeline status](<GITLAB_HOST>/<NAMESPACE>/<PROJECT>/badges/main/pipeline.svg)](<GITLAB_HOST>/<NAMESPACE>/<PROJECT>/-/pipelines?ref=main)`
  - Badge de sitio: `[![Sitio publicado](https://img.shields.io/badge/Pages-online-brightgreen)](<CI_PAGES_URL>)`
  Sustituir placeholders con los valores anotados en T001.
- [ ] T016 [US3] Verificar renderizado del README en la UI de GitLab: ambos badges visibles y clicables (Escenario 7 puntos 1–2).
- [ ] T017 [US3] (Verificación en pipeline real, opcional durante integración final) Provocar temporalmente un fallo controlado del pipeline `main` en una rama de test y confirmar que el badge cambia a rojo tras <5 min; restaurar (Escenario 7 puntos 3–5).

**Checkpoint**: US3 operativa. Visitantes del repo ven estado y URL del sitio.

---

## Phase 6: User Story 4 - Documentación operativa (Priority: P2)

**Goal**: `docs/publicacion.md` cubre operación del pipeline sin aparecer en el sitio publicado.

**Independent Test**: contribuidor sigue sólo `docs/publicacion.md` y consigue forzar rebuild, localizar la URL publicada, y actualizar dependencias localmente (User Story 4 y SC-005).

### Implementation for User Story 4

- [X] T018 [P] [US4] Crear `/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/docs/publicacion.md` con las secciones exigidas por `data-model.md` entidad 6:
  1. Nota inicial: "Documentación interna del repositorio. No forma parte del sitio publicado" (HTML comment o admonition `!!! note`).
  2. Cómo funciona el pipeline (jobs `pages` y `build-mr`, imagen, `--frozen`, `--strict`, caché por `uv.lock`, `interruptible`).
  3. Forzar rebuild (UI: `Pipelines → Run pipeline` o `Retry` sobre el último pipeline de `main`).
  4. Revisar el sitio publicado (`Project → Deploy → Pages`, variable `$CI_PAGES_URL`).
  5. Cambiar la rama de publicación (editar únicamente `variables.DEFAULT_BRANCH` en `.gitlab-ci.yml`).
  6. Actualizar dependencias localmente:
     ```bash
     uv lock --upgrade
     git add uv.lock
     git commit -m "chore(deps): actualizar uv.lock"
     git push
     ```
  7. Notificaciones de fallo (`User Settings → Notifications`, comportamiento por defecto de GitLab).
  8. Visibilidad Pages (`Project → Settings → Pages → Access control` en Internal).
  9. Bloque "Versión de referencia + fecha de verificación":
     - Imagen `ghcr.io/astral-sh/uv:python3.12-bookworm-slim` — verificado 2026-09-16.
     - Python 3.12 — verificado 2026-09-16.

  Tono profesional y directo (constitution 1.1.0 Principio I). Español.
- [X] T019 [US4] Verificar que `/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/mkdocs.yml` sigue sin listar `publicacion.md` en `nav` (FR-011). Ejecutar `uv run mkdocs build --strict` desde la raíz: el build debe pasar sin warnings pese a existir la nueva página fuera del `nav` (validar comportamiento; si MkDocs emite warning "unlisted page", añadir `not_in_nav: - publicacion.md` en `mkdocs.yml` como excepción mínima). Verificar además que la sección "Versión de referencia + fecha de verificación" de `docs/publicacion.md` contiene literalmente `2026-09-16` y ambas líneas exigidas (imagen `ghcr.io/astral-sh/uv:python3.12-bookworm-slim` y Python 3.12) — norma de re-verificación semestral de la constitution 1.1.0. **Nota implementación**: MkDocs 1.6 acepta `not_in_nav` como opción top-level (no bajo `validation.nav`); ajuste aplicado en `mkdocs.yml`. Bloque de versión verificado en `docs/publicacion.md`.
- [ ] T020 [US4] Piloto de contribuidor nuevo: pedir a alguien que siga únicamente `docs/publicacion.md` y complete forzar rebuild + localizar URL en <5 min (SC-005). Registrar el tiempo en las notas de la sesión.

**Checkpoint**: US4 operativa. Documentación operativa completa y aislada del sitio publicado.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: validaciones end-to-end del conjunto y cierre de puntos transversales.

- [ ] T021 Ejecutar Escenario 5 (concurrencia) de `quickstart.md`: dos commits rápidos a `main`, verificar cancelación del primer pipeline y publicación del segundo.
- [ ] T022 Ejecutar Escenario 6 (caché) de `quickstart.md`: contrastar duración de `uv sync --frozen` en frío vs. caliente. Confirmar reducción ≥50% (SC-004). Registrar cifras en el MR de cierre.
- [ ] T023 Ejecutar Escenario 8 (rotación de rama) de `quickstart.md`: cambiar temporalmente `DEFAULT_BRANCH` a `release`, empujar a esa rama, verificar disparo, revertir.
- [X] T024 [P] Revisar `README.md` y `docs/publicacion.md` para asegurar tono profesional y directo, sin argot (constitution Principio I). Corregir si aplica.
- [X] T025 [P] Ejecutar `uv run mkdocs build --strict` final desde la raíz. La build debe pasar sin warnings. Documentar el hash del commit y la fecha en el MR.
- [ ] T026 Verificar SC-003 en pipeline real: crear rama de test, introducir cambio incompatible entre `pyproject.toml` y `uv.lock` (por ejemplo modificar una dependencia sin regenerar el lock), abrir MR y confirmar que el job `build-mr` falla explícitamente en el paso `uv sync --frozen` antes de intentar `mkdocs build`. Registrar el log del fallo en el MR. Revertir la rama de test.
- [ ] T027 Verificar SC-007 en pipeline real: provocar un fallo controlado en un pipeline de `main` (por ejemplo, mergear temporalmente un warning de MkDocs desde una rama con acceso Maintainer) y confirmar que al menos un Maintainer y un committer reciben el email de notificación por defecto de GitLab. Registrar evidencia (captura o header del email) en el MR de cierre. Restaurar `main`.
- [ ] T028 Marcar la spec 008 como completada: cerrar la sección `Status` en `spec.md` (pasar a `Ready to merge`) y actualizar `.specify/feature.json` sólo si el flujo lo requiere en el proyecto.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias. Puede iniciarse inmediatamente.
- **Foundational (Phase 2)**: depende de Setup. Bloquea US1 y US2.
- **US1 (Phase 3)**: depende de Foundational.
- **US2 (Phase 4)**: depende de Foundational. Modifica el mismo fichero que US1 (`.gitlab-ci.yml`), por lo que MUST ejecutarse en serie con US1 (secuencial: US1 → US2, o US2 → US1). No paralelizable con US1.
- **US3 (Phase 5)**: independiente del pipeline. Modifica `README.md`. Puede correr en paralelo con US1, US2 y US4 (sin conflicto de ficheros).
- **US4 (Phase 6)**: independiente del pipeline. Modifica `docs/publicacion.md` (y potencialmente `mkdocs.yml` sólo si aparece el warning "unlisted page"). Paralelizable con US1, US2 y US3.
- **Polish (Phase 7)**: depende de todas las anteriores.

### Within Each User Story

- Sin capa de modelos ni servicios (feature declarativa).
- En US1 y US2, la edición del YAML precede a las validaciones con CI Lint y con pipelines reales.
- En US4, la creación del contenido precede a la validación `mkdocs build --strict`.

### Parallel Opportunities

- T003 puede correr en paralelo con T001 y T002.
- US3 (T015–T017) y US4 (T018–T020) son paralelizables entre sí y con US1/US2 porque tocan ficheros distintos.
- T024 y T025 en polish pueden ejecutarse en paralelo.

---

## Parallel Example: US3 y US4 en paralelo con US1

```bash
# Mientras Dev A avanza US1 sobre .gitlab-ci.yml:
Task Dev A: "Añadir job pages en /Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/.gitlab-ci.yml (T005)"

# Dev B puede simultáneamente:
Task Dev B: "Editar README con badges en /Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/README.md (T015)"

# Dev C puede simultáneamente:
Task Dev C: "Crear /Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/docs/publicacion.md (T018)"
```

---

## Implementation Strategy

### MVP First (US1 solo)

1. Phase 1: Setup (T001–T003).
2. Phase 2: Foundational (T004).
3. Phase 3: US1 (T005–T009).
4. **STOP y VALIDAR**: sitio publicado desde `main`. MVP entregado.

### Incremental Delivery

1. Setup + Foundational → base lista.
2. US1 → publicación operativa (MVP).
3. US2 → puerta de calidad en MRs.
4. US3 → visibilidad en README.
5. US4 → mantenibilidad operativa.
6. Polish → validaciones cruzadas (concurrencia, caché, rotación de rama).

### Team Strategy

Con dos o tres personas:

1. Todos participan en Setup + Foundational.
2. Persona A: US1 → US2 (secuencial sobre `.gitlab-ci.yml`).
3. Persona B: US3 (README).
4. Persona C: US4 (docs/publicacion.md).
5. Convergencia en Polish.

---

## Notes

- [P] = ficheros distintos, sin dependencias con tareas incompletas.
- Feature sin `src/` ni tests unitarios; la validación es funcional vía pipeline y `quickstart.md`.
- Los pasos que requieren UI de GitLab (T006, T007, T009, T012, T013, T016, T017, T020, T021, T022, T023, T026, T027) no son automatizables desde el commit; realizarlos manualmente y registrar evidencia en el MR.
- Commit después de cada tarea o grupo lógico dentro de la misma story.
- No commitear tokens, URLs con credenciales ni datos sensibles.
