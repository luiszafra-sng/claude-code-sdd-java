# Feature Specification: Publicación automática en GitLab Pages (CI/CD con uv)

**Feature Branch**: `008-gitlab-pages-ci`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Publicación GitLab Pages (CI/CD) — actualizado para uv. Añade pipeline de publicación del sitio MkDocs usando uv como gestor Python, con job `pages` en rama principal, job `build-mr` para merge requests, caché de uv, badges en README y documentación en `docs/publicacion.md`."

## Clarifications

### Session 2026-09-16

- Q: ¿Qué visibilidad debe tener el sitio publicado en GitLab Pages (Public, Internal, Private)? → A: Internal — sólo usuarios autenticados en la instancia GitLab.
- Q: ¿Cuál es el nombre exacto de la rama principal que dispara el job `pages`? → A: `main`.
- Q: ¿Cuándo debe dispararse el job `build-mr` en un merge request? → A: Sólo cuando el MR toca `docs/**`, `mkdocs.yml`, `pyproject.toml` o `uv.lock`.
- Q: ¿Cómo se gestiona la concurrencia cuando llega un nuevo commit a `main` con un pipeline anterior aún en ejecución? → A: Cancelar redundantes (interruptible); sólo termina el pipeline del último commit.
- Q: ¿Debe notificarse activamente ante fallo del pipeline de `main`? → A: Email por defecto de GitLab a mantenedores/committers; no se integran Slack ni MS Teams.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Publicación automática al integrar cambios en la rama principal (Priority: P1)

Como mantenedor de la formación, cuando integro cambios en la rama principal, el sitio MkDocs se compila y publica automáticamente en GitLab Pages sin intervención manual, garantizando que la versión publicada siempre refleja lo integrado.

**Why this priority**: Es el objetivo central de la feature y satisface el Principio VI de la constitution (publicación automatizada, no manual). Sin este flujo la formación se desactualiza y pierde credibilidad.

**Independent Test**: Realizar un merge a la rama principal con un cambio visible en `docs/` y comprobar que el pipeline se dispara, el job `pages` termina en verde y la página publicada en GitLab Pages muestra el cambio.

**Acceptance Scenarios**:

1. **Given** commit en rama principal que modifica `docs/`, **When** el pipeline se ejecuta, **Then** el job `pages` sincroniza dependencias con `uv sync --frozen`, compila con `uv run mkdocs build --strict --site-dir public` y publica `public/` como artefacto de GitLab Pages.
2. **Given** el sitio publicado tras un pipeline en verde, **When** el usuario accede a la URL de GitLab Pages del proyecto, **Then** ve el contenido actualizado sin pasos manuales adicionales.
3. **Given** commit en rama no principal, **When** el pipeline se ejecuta, **Then** el job `pages` NO se ejecuta.

---

### User Story 2 - Validación del sitio en cada merge request (Priority: P1)

Como revisor de un merge request, quiero que el pipeline compile el sitio con `--strict` antes de aprobar, para bloquear cambios que rompan la build o introduzcan warnings de MkDocs.

**Why this priority**: Es la puerta de calidad que impide publicar contenido roto. La constitution (Principio VI) exige fallar ante warnings; sin este job los defectos llegarían a la rama principal.

**Independent Test**: Abrir un merge request con un warning intencionado de MkDocs (por ejemplo, enlace roto) y verificar que el job `build-mr` falla y bloquea el merge; corregir el warning y verificar que el job pasa a verde.

**Acceptance Scenarios**:

1. **Given** merge request que modifica `docs/**/*`, `mkdocs.yml`, `pyproject.toml` o `uv.lock`, **When** el pipeline se ejecuta, **Then** el job `build-mr` ejecuta `uv sync --frozen` seguido de `uv run mkdocs build --strict` sin publicar artefactos.
2. **Given** merge request que NO toca ninguno de esos paths (por ejemplo cambios sólo en `examples/`), **When** el pipeline se ejecuta, **Then** el job `build-mr` se omite.
3. **Given** el sitio contiene un warning de MkDocs, **When** el job `build-mr` se ejecuta, **Then** el job termina en fallo y el merge queda bloqueado.
4. **Given** `uv.lock` desincronizado respecto a `pyproject.toml`, **When** el job ejecuta `uv sync --frozen`, **Then** el job falla explícitamente antes de intentar la build.

---

### User Story 3 - Feedback visible del estado y URL del sitio en el README (Priority: P2)

Como visitante del repositorio, cuando abro el README quiero ver de un vistazo si el último pipeline pasó y acceder al sitio publicado con un clic.

**Why this priority**: Reduce fricción para nuevos usuarios y refuerza la confianza. No bloquea el flujo de publicación, por lo que es P2.

**Independent Test**: Abrir el README renderizado en GitLab y comprobar que el badge de pipeline refleja el estado real y que el badge/enlace de página apunta a la URL publicada.

**Acceptance Scenarios**:

1. **Given** README renderizado, **When** el usuario lo abre, **Then** ve un badge del estado del pipeline y un badge o enlace a la página publicada.
2. **Given** el pipeline principal en fallo, **When** el usuario recarga el README, **Then** el badge de pipeline aparece en rojo.

---

### User Story 4 - Documentación operativa del pipeline (Priority: P2)

Como contribuidor nuevo, quiero una página `docs/publicacion.md` en el repositorio que me explique cómo funciona el pipeline, cómo forzar un rebuild, cómo revisar el sitio publicado, cómo cambiar la rama de publicación y cómo actualizar dependencias con `uv lock --upgrade` y commitear el lock.

**Why this priority**: Reduce sobrecarga de mantenimiento y evita conocimiento tribal. Es P2 porque el pipeline puede operar sin ella, pero su ausencia degrada la mantenibilidad rápidamente.

**Independent Test**: Un contribuidor que nunca haya visto el proyecto sigue únicamente `docs/publicacion.md` y consigue: (a) forzar un rebuild, (b) localizar la URL publicada, (c) actualizar dependencias localmente sin ayuda.

**Acceptance Scenarios**:

1. **Given** un contribuidor nuevo, **When** abre `docs/publicacion.md`, **Then** encuentra secciones explícitas sobre: funcionamiento del pipeline, forzar rebuild, revisar el sitio publicado, cambiar la rama de publicación, y actualizar dependencias con `uv lock --upgrade` + commit del lock.
2. **Given** la página `docs/publicacion.md`, **When** el mantenedor revisa `mkdocs.yml`, **Then** confirma que la página NO se ha añadido a la navegación del sitio (documentación interna del repo, no del sitio publicado).

---

### Edge Cases

- `uv.lock` desincronizado con `pyproject.toml`: `uv sync --frozen` MUST fallar el job y no intentar la build.
- Warning nuevo de MkDocs (enlace roto, plugin obsoleto): `mkdocs build --strict` MUST fallar el job y bloquear la publicación.
- Cambio simultáneo en `uv.lock` y en `docs/`: el pipeline MUST usar el `uv.lock` del commit evaluado, sin fallback a versiones distintas.
- Primera ejecución en un runner sin caché: el pipeline MUST completar correctamente aunque más lento; ejecuciones posteriores con el mismo `uv.lock` MUST reutilizar caché.
- Cambio de rama de publicación (por ejemplo, `main` → `release`): el mantenedor MUST poder cambiarla editando un único punto documentado y sin tocar la lógica de los jobs.
- Dos commits consecutivos rápidos a `main`: el pipeline del primero MUST cancelarse en cuanto arranque el del segundo; sólo se publica el resultado del segundo commit.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El repositorio MUST contener un `.gitlab-ci.yml` en la raíz que defina, como mínimo, los jobs `pages` y `build-mr`.
- **FR-002**: Ambos jobs MUST usar la imagen `ghcr.io/astral-sh/uv:python3.12-bookworm-slim`. Cualquier imagen sustituta MUST cumplir simultáneamente: publicada por Astral (`ghcr.io/astral-sh/uv`), tag no `latest`, Python 3.12.x, `uv` con versión ≥ la declarada en `uv.lock` del repositorio.
- **FR-003**: Ambos jobs MUST ejecutar `uv sync --frozen` como paso previo a cualquier build; el job MUST fallar si `uv.lock` no está en sync con `pyproject.toml`.
- **FR-004**: El job `pages` MUST ejecutar `uv run mkdocs build --strict --site-dir public` y publicar el directorio `public/` como artefacto de GitLab Pages.
- **FR-005**: El job `pages` MUST ejecutarse únicamente cuando el pipeline se dispara sobre la rama `main` del repositorio.
- **FR-006**: El job `build-mr` MUST ejecutar `uv run mkdocs build --strict` sin publicar artefactos. MUST ejecutarse en pipelines de merge request únicamente cuando el MR incluye cambios en al menos uno de: `docs/**/*`, `mkdocs.yml`, `pyproject.toml`, `uv.lock`. En MRs que no toquen ninguno de esos paths, el job MUST omitirse.
- **FR-007**: El pipeline MUST declarar caché de uv incluyendo los paths `.uv-cache/` y `~/.cache/uv/`, con clave basada en el archivo `uv.lock` (`key: files: [uv.lock]`).
- **FR-008**: Cualquier warning emitido por MkDocs durante el build MUST provocar fallo del job (comportamiento nativo de `--strict`).
- **FR-009**: El `README` MUST incluir en su cabecera dos badges enlazados: (a) badge de estado del pipeline de la rama `main` con enlace a la lista de pipelines filtrada por `main`, y (b) badge de acceso al sitio publicado con enlace a la URL de GitLab Pages del proyecto. Detalle en `contracts/readme-badges.contract.md`.
- **FR-010**: El repositorio MUST incluir la página `docs/publicacion.md` con secciones que cubran: funcionamiento del pipeline, forzar rebuild, revisar el sitio publicado, cambiar la rama de publicación, y actualizar dependencias localmente con `uv lock --upgrade` seguido de commit del lock.
- **FR-011**: `docs/publicacion.md` MUST NOT añadirse a la navegación de `mkdocs.yml`; permanece como documentación interna del repositorio.
- **FR-012**: El pipeline MUST usar exclusivamente `uv` como gestor Python. El `.gitlab-ci.yml` MUST NOT invocar `pip`, `venv`, `pipenv`, `poetry` ni `conda`.
- **FR-013**: La rama de publicación (por defecto `main`) MUST estar definida en un único punto del `.gitlab-ci.yml` de forma que su cambio requiera editar sólo esa referencia.
- **FR-014**: El sitio publicado en GitLab Pages MUST configurarse con visibilidad **Internal**, de forma que sólo usuarios autenticados en la instancia GitLab puedan acceder.
- **FR-015**: El pipeline MUST cancelar automáticamente cualquier ejecución previa aún en curso sobre `main` cuando llega un nuevo commit a `main` (jobs marcados como interrumpibles), de modo que sólo se publique el resultado del commit más reciente.
- **FR-016**: Ante fallo del pipeline en `main`, GitLab MUST notificar por email a mantenedores y committers usando la configuración de notificaciones por defecto de la plataforma. NO se integran canales externos (Slack, MS Teams) en esta feature.

### Key Entities

- **Pipeline GitLab CI**: definición declarativa en `.gitlab-ci.yml` con jobs, imagen base, caché y reglas de disparo.
- **Job `pages`**: unidad de ejecución que construye y publica el sitio como artefacto de GitLab Pages desde la rama principal.
- **Job `build-mr`**: unidad de ejecución que valida el build en merge requests sin publicar.
- **Caché de uv**: conjunto de directorios (`.uv-cache/`, `~/.cache/uv/`) reutilizado entre ejecuciones y versionado por `uv.lock`.
- **Artefacto de Pages**: contenido del directorio `public/` publicado por GitLab Pages.
- **Documentación operativa (`docs/publicacion.md`)**: página interna del repositorio con instrucciones de operación del pipeline.
- **README**: puerta de entrada del repositorio, con badges de estado del pipeline y de la página publicada.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los merges a la rama principal que modifican `docs/` producen un sitio publicado en GitLab Pages sin intervención manual.
- **SC-002**: El 100% de los merge requests que introducen warnings de MkDocs son bloqueados por el pipeline antes de mergear.
- **SC-003**: El 100% de los pipelines en los que `uv.lock` está desincronizado con `pyproject.toml` fallan explícitamente en el paso de sincronización y no llegan a compilar.
- **SC-004**: Con caché caliente (mismo `uv.lock` que la ejecución previa), el tiempo del paso de sincronización de dependencias del job `build-mr` se reduce al menos un 50% respecto a la primera ejecución sin caché.
- **SC-005**: Un contribuidor nuevo, siguiendo únicamente `docs/publicacion.md`, consigue forzar un rebuild y localizar la URL publicada en menos de 5 minutos.
- **SC-006**: El README muestra en todo momento el estado real del último pipeline de la rama principal y un enlace funcional al sitio publicado.
- **SC-007**: El 100% de los fallos del pipeline de `main` generan una notificación por email a mantenedores y committers a través de la configuración por defecto de GitLab.

## Assumptions

- El repositorio se aloja en una instancia de GitLab (SaaS o self-hosted) con GitLab Pages habilitado para el proyecto.
- Existen runners de GitLab compatibles con imágenes Docker Linux amd64 capaces de ejecutar `ghcr.io/astral-sh/uv:python3.12-bookworm-slim`.
- La rama principal del proyecto es `main` (confirmado en clarificación). El cambio de esta rama se contempla como escenario operativo documentado, no como valor por defecto.
- El proyecto ya declara `pyproject.toml` con un `uv.lock` versionado, tal como impone `CLAUDE.md` y la constitution vigente.
- Dominios personalizados quedan fuera de alcance. La visibilidad **Internal** (definida en FR-014) apoya el control de acceso mediante autenticación estándar de la instancia GitLab; configuración avanzada de autenticación queda fuera de alcance.
- La página `docs/publicacion.md` es documentación operativa interna del repositorio; no forma parte del sitio publicado ni se enlaza desde `mkdocs.yml` en esta feature.
- La imagen `ghcr.io/astral-sh/uv:python3.12-bookworm-slim` se considera estable durante la vida de la spec; su actualización se gestiona con la re-verificación semestral prevista en la constitution.
