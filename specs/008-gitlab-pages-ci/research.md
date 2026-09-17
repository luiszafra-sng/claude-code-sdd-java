# Phase 0 — Research: Publicación GitLab Pages con uv

**Feature**: 008-gitlab-pages-ci
**Fecha**: 2026-09-16

Este documento consolida las decisiones técnicas necesarias para materializar el `.gitlab-ci.yml` y la documentación operativa. Cada bloque sigue el formato: **Decisión / Rationale / Alternativas consideradas**.

## R1. Imagen base del pipeline

- **Decisión**: usar `ghcr.io/astral-sh/uv:python3.12-bookworm-slim` como imagen para ambos jobs (`pages` y `build-mr`).
- **Rationale**: imagen oficial de Astral con `uv` preinstalado y Python 3.12; evita paso de instalación adicional y asegura compatibilidad exacta entre CI y `pyproject.toml`. Variante `slim` reduce cold-start.
- **Alternativas consideradas**:
  - `python:3.12-slim` + `pip install uv`: introduce paso extra y desvía del contrato "sólo uv"; deriva versión de uv.
  - `ghcr.io/astral-sh/uv:latest`: no fija Python; posible drift entre entornos.
  - Imagen custom en registry interno: overhead de mantenimiento innecesario para esta fase.

## R2. Sincronización de dependencias

- **Decisión**: `uv sync --frozen` como primer paso de cada job.
- **Rationale**: `--frozen` falla si `uv.lock` no coincide con `pyproject.toml`; garantiza reproducibilidad y detecta lock desactualizado en CI antes de compilar (SC-003, FR-003).
- **Alternativas consideradas**:
  - `uv sync` (sin `--frozen`): actualiza lock silenciosamente; rompe reproducibilidad.
  - `uv pip sync requirements.txt`: exige mantener otro artefacto redundante; violaría el modelo `pyproject.toml`+`uv.lock`.

## R3. Estrategia de caché

- **Decisión**: bloque `cache:` global con `key: files: [uv.lock]` y `paths: [.uv-cache/, ~/.cache/uv/]`; establecer `UV_CACHE_DIR: "${CI_PROJECT_DIR}/.uv-cache"` como variable de job para forzar la caché local restaurable por GitLab.
- **Rationale**: `key: files: [uv.lock]` invalida la caché sólo cuando cambia el lock, cumpliendo FR-007 y SC-004. `~/.cache/uv/` cubre metadatos y descargas del propio uv aunque el runner mueva `HOME`; `.uv-cache/` cubre el hardlink store dentro del workspace.
- **Alternativas consideradas**:
  - `key: ${CI_COMMIT_REF_SLUG}`: caché por rama; provoca fallos cruzados y no invalida al cambiar lock.
  - Sin caché: cumple funcionalmente pero incumple SC-004 (reducción ≥50%).
  - Caché sólo de `~/.cache/uv/`: insuficiente si el runner restaura `HOME` limpio entre jobs.

## R4. Trigger del job `pages`

- **Decisión**: reglas `if: '$CI_COMMIT_BRANCH == $DEFAULT_BRANCH'` con `DEFAULT_BRANCH: "main"` declarado en `variables:`.
- **Rationale**: FR-005 exige ejecución sólo en `main`. Concentrar el nombre de la rama en una variable satisface FR-013 (cambio en un único punto).
- **Alternativas consideradas**:
  - `only: main`: sintaxis legacy; menos expresiva.
  - `rules: - if: $CI_DEFAULT_BRANCH` combinado con `$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH`: válido, pero acopla al nombre configurado en GitLab; con variable local el cambio operativo es explícito y trazable en el YAML.

## R5. Trigger del job `build-mr`

- **Decisión**: `rules:` con `if: '$CI_PIPELINE_SOURCE == "merge_request_event"'` y `changes: [docs/**/*, mkdocs.yml, pyproject.toml, uv.lock]`.
- **Rationale**: Clarificación Q3: sólo compilar cuando el MR toca ficheros que afectan la build. Reduce coste y latencia en MRs de otras áreas (por ejemplo `examples/` Java).
- **Alternativas consideradas**:
  - Sin `changes:`: dispara siempre; encarece pipelines de `examples/`.
  - Filtrar sólo por `docs/**`: dejaría fuera cambios de dependencias o de `mkdocs.yml` que también afectan la build.

## R6. Concurrencia en `main`

- **Decisión**: marcar los jobs como `interruptible: true` y activar "Auto-cancel redundant pipelines" a nivel de proyecto (documentado en `docs/publicacion.md`).
- **Rationale**: Clarificación Q4. Evita que un pipeline lento sobrescriba la publicación de un commit más reciente y libera runner.
- **Alternativas consideradas**:
  - `resource_group: pages`: serializa; garantiza orden pero no cancela el obsoleto (SC no cubierto, más tiempo total).
  - No gestionar concurrencia: riesgo de publicar versión antigua.

## R7. Publicación en GitLab Pages

- **Decisión**: job denominado literalmente `pages` (nombre reservado por GitLab) con `artifacts: paths: [public]` y `--site-dir public` en la build.
- **Rationale**: GitLab publica automáticamente el artefacto `public/` cuando el job se llama `pages`. Evita step manual de despliegue.
- **Alternativas consideradas**:
  - Job con otro nombre + `pages: deploy`: requiere feature más reciente y añade complejidad sin beneficio.
  - Copiar a bucket externo: fuera de alcance (excluye Principio VI).

## R8. Visibilidad Pages

- **Decisión**: aplicar visibilidad **Internal** en la configuración del proyecto (Settings → Pages → Access control). Documentar el ajuste en `docs/publicacion.md` como paso operativo one-off.
- **Rationale**: Clarificación Q1. GitLab controla visibilidad de Pages a nivel de proyecto (Access Control), no vía `.gitlab-ci.yml`.
- **Alternativas consideradas**:
  - Public: rechazado por clarificación.
  - Private: bloquea a lectores autenticados sin membresía, incompatible con audiencia amplia de la formación.

## R9. Notificación de fallo

- **Decisión**: apoyarse en la notificación por email por defecto de GitLab (Maintainer/Committer). Documentar en `docs/publicacion.md` cómo verificarla en `User Settings → Notifications` y a nivel de proyecto.
- **Rationale**: Clarificación Q5. Sin integraciones externas; sin secretos que gestionar.
- **Alternativas consideradas**:
  - Webhook Slack/MS Teams: fuera de alcance; introduce secretos y mantenimiento.
  - Ninguna notificación: rechazada; oculta fallos y degrada Principio VI.

## R10. Badges en README

- **Decisión**: dos badges en la cabecera del `README.md`:
  1. Pipeline status: `<CI_PAGES_HOST_URL>` no aplica al pipeline; usar la URL canónica `<GITLAB_HOST>/<NAMESPACE>/<PROJECT>/badges/main/pipeline.svg` enlazando al pipeline de la rama `main`.
  2. Página publicada: badge shields.io o badge de GitLab (`.../-/pages`); enlace a la URL Pages del proyecto.
- **Rationale**: FR-009 y SC-006. Ambos badges quedan siempre visibles en el rendering de GitLab; no requieren tokens.
- **Alternativas consideradas**:
  - Único badge combinado: cubre menos información; el estado Pages no siempre coincide con el último pipeline.
  - Badges sólo en el sitio publicado: no cumple FR-009 (README).

## R11. Página `docs/publicacion.md`

- **Decisión**: crear página en `docs/publicacion.md` con secciones: Cómo funciona el pipeline, Forzar rebuild, Revisar el sitio publicado, Cambiar la rama de publicación, Actualizar dependencias localmente. NO añadir a `nav` de `mkdocs.yml`; se detalla el motivo en un comentario inicial de la página.
- **Rationale**: FR-010, FR-011. La página es documentación interna del repo; su exclusión de `nav` evita que se publique como parte del sitio formativo.
- **Alternativas consideradas**:
  - Ubicar la página en la raíz (`PUBLICACION.md`): no aprovecha el linter Markdown ni el estilo del resto de `docs/`.
  - Añadirla al sitio: contradice FR-011 y ensucia la navegación de la formación.

## R12. Interacción con `--strict` y warnings

- **Decisión**: no configurar `strict` en `mkdocs.yml`; pasar `--strict` únicamente desde CI. Documentar que ejecuciones locales `uv run mkdocs serve` no fallan por warnings, pero `uv run mkdocs build --strict` sí.
- **Rationale**: mantiene developer experience local ágil y garantiza calidad en la puerta de CI (FR-008, SC-002).
- **Alternativas consideradas**:
  - `strict: true` en `mkdocs.yml`: rompe `mkdocs serve` en cambios en progreso; degrada iteración local.

## R13. Versión de referencia y re-verificación semestral

- **Decisión**: incluir en `docs/publicacion.md` un bloque "versión de referencia + fecha de verificación" para la imagen y Python:
  - `ghcr.io/astral-sh/uv:python3.12-bookworm-slim` — verificado 2026-09-16.
  - Python 3.12 — verificado 2026-09-16.
- **Rationale**: cumple la norma de re-verificación semestral de la constitution (1.1.0).
- **Alternativas consideradas**: omitir bloque → bloquearía merges al vencer el plazo; no viable.

## Resumen de resolución de NEEDS CLARIFICATION

Ninguno pendiente. Las cinco clarificaciones registradas en `spec.md` (visibilidad, rama, filtro `build-mr`, concurrencia, notificación) están reflejadas arriba con decisión firme.
