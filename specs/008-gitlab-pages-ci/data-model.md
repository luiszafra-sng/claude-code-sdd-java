# Phase 1 — Data Model: Publicación GitLab Pages con uv

**Feature**: 008-gitlab-pages-ci
**Fecha**: 2026-09-16

No hay dominio de negocio ni persistencia. Las "entidades" son artefactos declarativos del pipeline y de la infraestructura de publicación. Se documentan como estructuras con atributos, invariantes y transiciones de estado.

## Entidades

### 1. Pipeline

Declaración global en `.gitlab-ci.yml`.

| Campo | Tipo | Descripción | Valor / Restricción |
|-------|------|-------------|---------------------|
| `image` | string | Imagen base común a todos los jobs | `ghcr.io/astral-sh/uv:python3.12-bookworm-slim` |
| `variables.DEFAULT_BRANCH` | string | Rama de publicación (único punto de cambio) | `"main"` |
| `variables.UV_CACHE_DIR` | string | Directorio local de caché uv | `"${CI_PROJECT_DIR}/.uv-cache"` |
| `variables.UV_LINK_MODE` | string | Modo de enlace uv en CI | `"copy"` (evita hardlinks entre FS) |
| `cache.key.files` | list[string] | Ficheros que invalidan la caché | `["uv.lock"]` |
| `cache.paths` | list[string] | Directorios cacheados | `[".uv-cache/", "$HOME/.cache/uv/"]` |
| `stages` | list[string] | Etapas del pipeline | `["build", "deploy"]` |

**Invariantes**:
- `DEFAULT_BRANCH` es la ÚNICA referencia textual de la rama principal en el YAML.
- `cache.key.files` MUST incluir `uv.lock` y sólo `uv.lock`.
- Ningún job MUST invocar `pip`, `venv`, `poetry`, `pipenv`, `conda` (grep negativo).

### 2. Job `build-mr`

Compila el sitio en merge requests. No publica.

| Campo | Tipo | Valor / Restricción |
|-------|------|---------------------|
| `stage` | string | `build` |
| `interruptible` | bool | `true` |
| `rules[0].if` | expresión | `'$CI_PIPELINE_SOURCE == "merge_request_event"'` |
| `rules[0].changes` | list[string] | `["docs/**/*", "mkdocs.yml", "pyproject.toml", "uv.lock"]` |
| `script[0]` | comando | `uv sync --frozen` |
| `script[1]` | comando | `uv run mkdocs build --strict` |
| `artifacts` | – | AUSENTE (no publica) |

**Transiciones de estado**:
- `created → pending → running → (success | failed | canceled | skipped)`.
- `skipped` cuando `rules.changes` no coincide con ficheros modificados.
- `failed` si `uv sync --frozen` detecta desincronía o si `--strict` emite warnings.

### 3. Job `pages`

Compila y publica el sitio en GitLab Pages desde `main`.

| Campo | Tipo | Valor / Restricción |
|-------|------|---------------------|
| `stage` | string | `deploy` |
| `interruptible` | bool | `true` |
| `rules[0].if` | expresión | `'$CI_COMMIT_BRANCH == $DEFAULT_BRANCH'` |
| `script[0]` | comando | `uv sync --frozen` |
| `script[1]` | comando | `uv run mkdocs build --strict --site-dir public` |
| `artifacts.paths` | list[string] | `["public"]` |
| `artifacts.expire_in` | string | `"1 week"` (limpieza del artefacto histórico) |
| `environment.name` | string | `"pages"` |
| `environment.url` | string | `"$CI_PAGES_URL"` |

**Invariantes**:
- El job MUST llamarse literalmente `pages` (contrato reservado de GitLab).
- El directorio artefacto MUST ser `public/` (contrato reservado de GitLab Pages).

**Transiciones de estado**:
- `created → pending → running → (success | failed | canceled)`.
- Al `success`, GitLab publica automáticamente `public/` en `$CI_PAGES_URL`.
- Un pipeline posterior en `main` cancela el anterior en curso (`interruptible: true` + auto-cancel del proyecto).

### 4. Artefacto Pages

Salida binaria del job `pages`.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `path` | ruta | `public/` (relativo al workspace del job) |
| `contenido` | HTML/CSS/JS | Salida de `mkdocs build` con `site_url` configurado en `mkdocs.yml` |
| `visibilidad` | enum | `Internal` (configurado en Settings → Pages → Access control) |
| `URL` | URL | Provista por GitLab en `$CI_PAGES_URL`; documentada en README y `docs/publicacion.md` |

### 5. Caché uv

Recurso reutilizable entre ejecuciones.

| Campo | Tipo | Valor |
|-------|------|-------|
| `paths` | list[string] | `[".uv-cache/", "$HOME/.cache/uv/"]` |
| `key.files` | list[string] | `["uv.lock"]` |
| `policy` | enum | `"pull-push"` (por defecto) |

**Ciclo de vida**:
- Caché HIT cuando `sha256(uv.lock)` coincide con la clave existente en el runner.
- Caché MISS cuando `uv.lock` cambia o cuando el runner no tiene la clave; el pipeline crea o actualiza la entrada al finalizar.

### 6. Página `docs/publicacion.md`

Documento operativo del repositorio.

| Sección obligatoria | Contenido mínimo |
|---------------------|------------------|
| Cómo funciona el pipeline | Jobs `pages` y `build-mr`, imagen, `--frozen`, `--strict`, caché, concurrencia. |
| Forzar rebuild | Instrucción desde UI de GitLab (Pipelines → Run pipeline o Retry). |
| Revisar el sitio publicado | URL de Pages, cómo obtenerla (`$CI_PAGES_URL` / Settings → Pages). |
| Cambiar la rama de publicación | Edición única de `variables.DEFAULT_BRANCH` en `.gitlab-ci.yml`. |
| Actualizar dependencias localmente | `uv lock --upgrade` + `git add uv.lock` + commit + push. |
| Notificaciones de fallo | Verificar `Project → Settings → Members` / notificaciones por email. |
| Visibilidad | Nota de que Pages está Internal; cómo cambiarla desde Settings. |
| Versión de referencia + fecha | Imagen, Python 3.12, fecha `2026-09-16`. |

**Invariantes**:
- La página NO aparece en `nav` de `mkdocs.yml`.
- Un comentario inicial (HTML comment o admonition) MUST indicar "Documentación interna del repo. No forma parte del sitio publicado".

### 7. README badges

Fragmento en la cabecera del README.

| Badge | Fuente | Enlace |
|-------|--------|--------|
| Pipeline `main` | `<GITLAB_HOST>/<NAMESPACE>/<PROJECT>/badges/main/pipeline.svg` | `<GITLAB_HOST>/<NAMESPACE>/<PROJECT>/-/pipelines?ref=main` |
| Página publicada | shields.io badge estático (label "Pages", message "online") o badge de GitLab Pages | `$CI_PAGES_URL` (URL literal renderizada) |

## Diagrama de flujo (texto)

```
Commit → push → GitLab CI evalúa reglas:
  ├─ Branch = main
  │   └─ pipeline: build (—) → deploy (job `pages`)
  │       ├─ uv sync --frozen
  │       ├─ uv run mkdocs build --strict --site-dir public
  │       ├─ Artefacto public/
  │       └─ Publicación en $CI_PAGES_URL (visibilidad Internal)
  ├─ Merge Request event
  │   └─ if changes ∈ {docs/**/*, mkdocs.yml, pyproject.toml, uv.lock}
  │       └─ pipeline: build (job `build-mr`)
  │           ├─ uv sync --frozen
  │           └─ uv run mkdocs build --strict
  └─ Otro caso → sin jobs
```
