# Contract — `.gitlab-ci.yml`

**Feature**: 008-gitlab-pages-ci
**Fecha**: 2026-09-16

Contrato del fichero `.gitlab-ci.yml` que la implementación MUST cumplir. No incluye código de aplicación; define estructura, campos obligatorios y campos prohibidos.

## Estructura obligatoria (top-level)

- `image`: MUST ser `ghcr.io/astral-sh/uv:python3.12-bookworm-slim`.
- `variables`: MUST declarar al menos:
  - `DEFAULT_BRANCH: "main"`
  - `UV_CACHE_DIR: "${CI_PROJECT_DIR}/.uv-cache"`
  - `UV_LINK_MODE: "copy"`
- `stages`: MUST incluir `build` y `deploy` (en ese orden).
- `cache`: MUST declarar globalmente:
  - `key.files: ["uv.lock"]`
  - `paths: [".uv-cache/", "$HOME/.cache/uv/"]`
- Jobs obligatorios: `build-mr`, `pages`.

## Job `build-mr`

- MUST usar `stage: build`.
- MUST fijar `interruptible: true`.
- MUST fijar `rules` con exactamente un elemento cuyo predicado sea:
  - `if: '$CI_PIPELINE_SOURCE == "merge_request_event"'`
  - `changes: ["docs/**/*", "mkdocs.yml", "pyproject.toml", "uv.lock"]`
- MUST ejecutar en `script`, en este orden:
  1. `uv sync --frozen`
  2. `uv run mkdocs build --strict`
- MUST NOT declarar `artifacts`.
- MUST NOT invocar `pip`, `python -m venv`, `poetry`, `pipenv`, `conda`.

## Job `pages`

- MUST llamarse literalmente `pages`.
- MUST usar `stage: deploy`.
- MUST fijar `interruptible: true`.
- MUST fijar `rules` con exactamente un elemento cuyo predicado sea:
  - `if: '$CI_COMMIT_BRANCH == $DEFAULT_BRANCH'`
- MUST ejecutar en `script`, en este orden:
  1. `uv sync --frozen`
  2. `uv run mkdocs build --strict --site-dir public`
- MUST declarar `artifacts.paths: ["public"]`.
- SHOULD declarar `artifacts.expire_in: "1 week"`.
- SHOULD declarar `environment: { name: "pages", url: "$CI_PAGES_URL" }`.
- MUST NOT invocar `pip`, `python -m venv`, `poetry`, `pipenv`, `conda`.

## Reglas transversales

- El fichero MUST parsear correctamente con el validador de GitLab CI Lint.
- El texto `main` NO MUST aparecer en el YAML fuera de `variables.DEFAULT_BRANCH`. Toda referencia MUST usar `$DEFAULT_BRANCH`.
- El fichero NO MUST contener `only:` o `except:` (sintaxis legacy).
- El fichero NO MUST introducir variables secretas ni credenciales.

## Verificación

- CI Lint de GitLab (`Repository → CI/CD → Editor → Lint`).
- Grep local:
  - `grep -nE '\b(pip|venv|poetry|pipenv|conda)\b' .gitlab-ci.yml` → **sin resultados**.
  - `grep -n '\"main\"' .gitlab-ci.yml` → **1 resultado**, en la línea de `DEFAULT_BRANCH`.
- Ejecución en pipeline real: al menos un pipeline de `main` en verde y un pipeline de MR (con y sin cambios en `docs/`) que demuestre trigger/skip.
