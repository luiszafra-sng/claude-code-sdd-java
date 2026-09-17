# Quickstart — Validación end-to-end de la publicación GitLab Pages

**Feature**: 008-gitlab-pages-ci
**Fecha**: 2026-09-16

Escenarios ejecutables para demostrar que la feature funciona. No incluye el contenido completo del `.gitlab-ci.yml`, del README ni de `docs/publicacion.md`; sus contratos están en `contracts/` y su detalle estructural en `data-model.md`.

## Prerrequisitos

- Repo con `pyproject.toml` y `uv.lock` versionados (ya existentes).
- Proyecto GitLab con Pages habilitado.
- Runners GitLab Docker Linux amd64 disponibles.
- Permisos de Maintainer para tocar Settings → Pages.
- `uv` instalado localmente (misma versión mayor que la imagen del pipeline).

## Setup one-off (fuera del pipeline)

1. `Project → Settings → Pages → Access control` → seleccionar **Internal**.
2. `Project → Settings → CI/CD → General pipelines` → activar **Auto-cancel redundant pipelines**.
3. `Project → Settings → CI/CD → General pipelines` → dejar la protección de rama `main` con "Push allowed" para Maintainers.
4. Confirmar que `Project → Settings → Integrations` no altera notificaciones por defecto (fallo de pipeline dispara email).

## Validación local (previa al pipeline)

Reproduce en local exactamente lo que ejecuta el pipeline.

```bash
uv sync --frozen
uv run mkdocs build --strict --site-dir public
```

Resultado esperado:

- `uv sync --frozen` termina en 0. Si `uv.lock` está desincronizado con `pyproject.toml`, falla explícitamente. **Esto es la validación local de SC-003.**
- `uv run mkdocs build --strict --site-dir public` genera `public/index.html`. Cualquier warning aborta con código no cero. **Validación local de SC-002.**

## Escenario 1 — MR con cambios en `docs/`

Objetivo: US2 (job `build-mr` valida y bloquea si hay warnings).

1. Crear rama `test/gitlab-ci-mr` con un cambio trivial en `docs/index.md`.
2. Abrir MR contra `main`.
3. Comprobar en la UI de GitLab que se dispara sólo el job `build-mr` (no el job `pages`).
4. Verificar que el job termina en verde.
5. Introducir un warning intencionado (por ejemplo `[link roto](noexiste.md)`), pushear.
6. Verificar que el job `build-mr` termina en fallo y el MR queda bloqueado.
7. Revertir el warning; el pipeline vuelve a verde.

## Escenario 2 — MR fuera de `docs/`

Objetivo: acceptance scenario US2 #2 (job omitido).

1. Crear rama `test/gitlab-ci-outside-docs` con un cambio en `examples/` o cualquier fichero fuera del filtro.
2. Abrir MR contra `main`.
3. Comprobar que el pipeline NO ejecuta `build-mr` (aparece como `skipped` o no aparece).

## Escenario 3 — Merge a `main` y publicación

Objetivo: US1 (publicación automática).

1. Mergear un MR con cambios en `docs/` a `main`.
2. Comprobar que se dispara el job `pages` en el stage `deploy`.
3. Esperar a que termine en verde.
4. Abrir la URL de Pages (`Project → Deploy → Pages` o `$CI_PAGES_URL`).
5. Verificar que el contenido publicado refleja los cambios mergeados.

## Escenario 4 — Visibilidad Internal

Objetivo: FR-014.

1. Con sesión válida en la instancia GitLab: abrir la URL de Pages → carga el sitio.
2. Sin sesión (ventana privada / logout): abrir la URL → GitLab redirige a login.
3. Con usuario invitado externo (si aplica): tras login, el acceso queda denegado.

## Escenario 5 — Concurrencia y cancelación

Objetivo: FR-015 (interruptible).

1. Empujar dos commits consecutivos a `main` con < 30 s de diferencia.
2. Comprobar que el pipeline del primer commit se marca `canceled`.
3. Comprobar que el pipeline del segundo commit termina en verde y publica.

## Escenario 6 — Caché de uv

Objetivo: FR-007 y SC-004.

1. Primera ejecución del pipeline tras cambio en `uv.lock`: anotar duración de `uv sync --frozen`.
2. Segunda ejecución sin cambios en `uv.lock`: anotar duración de `uv sync --frozen`.
3. Verificar que la segunda duración es ≤50% de la primera.
4. Modificar una dependencia en `pyproject.toml`, ejecutar `uv lock --upgrade <paquete>` y commit del lock; verificar que la siguiente ejecución vuelve a "frío" (cambia la clave `files: [uv.lock]`).

## Escenario 7 — Badges y notificaciones

Objetivo: FR-009, FR-016, SC-006, SC-007.

1. Abrir el README en GitLab.
2. Verificar los dos badges (pipeline `main`, sitio publicado) y sus enlaces.
3. Provocar un fallo en `main` (por ejemplo, dejar un warning tras merge accidental — usar rama de prueba con acceso Maintainer).
4. Verificar que el badge de pipeline se pone rojo.
5. Verificar que Maintainers y committers reciben email de GitLab notificando el fallo.
6. Restaurar `main` a un estado limpio.

## Escenario 8 — Rotación de rama de publicación

Objetivo: FR-013.

1. Editar en `.gitlab-ci.yml` el valor de `variables.DEFAULT_BRANCH` de `"main"` a `"release"`.
2. Confirmar que ningún otro punto del YAML menciona el nombre anterior.
3. Empujar un cambio a la nueva rama `release`.
4. Comprobar que el job `pages` se dispara ahora sobre `release` y no sobre `main`.
5. Revertir el cambio.

## Éxito global

La feature se considera validada cuando los 8 escenarios pasan en el orden anterior sobre el proyecto real, y el checklist `checklists/requirements.md` sigue con todos los items en verde.
