---

description: "Task list — Esqueleto del sitio MkDocs de la formación"
---

# Tasks: Esqueleto del sitio MkDocs de la formación

**Input**: Design documents from `specs/001-mkdocs-skeleton/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: No hay test tasks. El sitio es estático docs-only; la verificación se hace vía `mkdocs build --strict` y auditoría manual de accesibilidad, no vía suite pytest/etc.

**Organization**: Tareas agrupadas por user story. US1/US2 son P1 (MVP + puerta de calidad); US3 es P2 (flujo contribuidor).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede correr en paralelo (archivos distintos, sin dependencias).
- **[Story]**: US1 / US2 / US3.
- Rutas absolutas relativas al repo root (`/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/`).

## Path Conventions

Proyecto docs-only. Archivos clave en la raíz: `mkdocs.yml`, `pyproject.toml`, `uv.lock`, `.python-version`, `.gitignore`, `README.md`. Contenido bajo `docs/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: bootstrap del proyecto Python con `uv` y estructura mínima del repo.

- [X] T001 Crear `.gitignore` en la raíz con: `.venv/`, `site/`, `.uv-cache/`, `__pycache__/`, `*.pyc`, `.DS_Store`. NO añadir `uv.lock` ni `.python-version`.
- [X] T002 Crear `pyproject.toml` en la raíz con `[project]` (name = `claude-code-sdd-java-docs`, version = `0.1.0`, description en español, `requires-python = ">=3.12"`, license = MIT o similar), sin dependencias todavía (se añaden en Phase 2).
- [X] T003 Crear `.python-version` en la raíz con una versión concreta de la rama 3.12.x (p. ej. `3.12.7`).
- [X] T004 Ejecutar `uv sync` desde la raíz para generar `uv.lock` y `.venv/`. Verificar que `uv.lock` queda commiteable.

**Checkpoint**: proyecto Python con uv listo; sin MkDocs aún.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: dependencias MkDocs fijadas + estructura de carpetas del sitio. Sin esto, ninguna US arranca.

**⚠️ CRITICAL**: bloquea US1, US2, US3.

- [X] T005 Instalar dependencias MkDocs bajo dependency group `docs` con `uv add --group docs mkdocs==1.6.1 mkdocs-material==9.5.42 pymdown-extensions==10.11.2` (ajustar a última patch estable disponible al ejecutar; PIN EXACTO, sin `~=`/`>=`/`^`). Confirmar que aparecen en `[dependency-groups] docs` (o equivalente) de `pyproject.toml` y que `uv.lock` se actualiza. Alinear con `research.md` §3.
- [X] T006 Crear estructura de carpetas del sitio: `docs/`, `docs/stylesheets/`, `docs/assets/`, `docs/assets/fonts/`, y las 7 carpetas de módulo `docs/introduccion/`, `docs/setup/`, `docs/claude-md/`, `docs/app-ejemplo/`, `docs/sdd/`, `docs/agentes/`, `docs/skills/`. Dejar `docs/assets/fonts/` vacía con un `.gitkeep`.

**Checkpoint**: dependencias + árbol de carpetas listos.

---

## Phase 3: User Story 1 — Levantar el sitio en local (Priority: P1) 🎯 MVP

**Goal**: cualquiera clona el repo, ejecuta `uv sync && uv run mkdocs serve` y ve el sitio en `http://127.0.0.1:8000` con identidad visual aplicada, 7 secciones navegables, toggle claro/oscuro funcionando y default guiado por `prefers-color-scheme`.

**Independent Test**: en máquina limpia con `uv` instalado, tras `uv sync` y `uv run mkdocs serve`, el sitio queda accesible en `http://127.0.0.1:8000`, muestra la home + 7 pestañas, y el toggle claro/oscuro alterna la paleta sin errores en consola del navegador.

### Implementation for User Story 1

- [X] T007 [US1] Crear `mkdocs.yml` en la raíz con:
  - `site_name`, `site_description`, `site_url` (dejar placeholder), `docs_dir: docs`.
  - `theme`: `name: material`, `language: es`, `logo: assets/logo.svg`, `favicon: assets/favicon.svg`, `font: {text: Inter, code: IBM Plex Mono}`.
  - `theme.features`: `navigation.tabs`, `navigation.sections`, `navigation.top`, `search.suggest`, `content.code.copy`, `content.code.annotate`.
  - `theme.palette`: tres entradas — `media: "(prefers-color-scheme)"` con toggle `brightness-auto` (nombre "Cambiar a modo claro"), `media: "(prefers-color-scheme: light)"` con `scheme: default`, `primary: custom`, `accent: custom`, toggle `brightness-7`, y `media: "(prefers-color-scheme: dark)"` con `scheme: slate`, `primary: custom`, `accent: custom`, toggle `brightness-4`.
  - `extra_css: [stylesheets/extra.css]`.
  - `markdown_extensions`: `admonition`, `attr_list`, `md_in_html`, `pymdownx.details`, `pymdownx.highlight` (con `anchor_linenums: true`), `pymdownx.inlinehilite`, `pymdownx.snippets`, `pymdownx.superfences`, `pymdownx.tabbed` (con `alternate_style: true`), `toc` (con `permalink: true`).
  - `nav`: en el orden fijado por FR-002 (Introducción, Setup del entorno, CLAUDE.md, App de ejemplo (Spring Boot 4), SDD con Speckit, Agentes, Skills), cada entrada apuntando al `index.md` del módulo correspondiente. Home en primera línea sin etiqueta explícita.
- [X] T008 [P] [US1] Crear `docs/stylesheets/extra.css` con:
  - Bloque `:root` con variables MkDocs Material (`--md-primary-fg-color`, `--md-primary-fg-color--light`, `--md-primary-fg-color--dark`, `--md-accent-fg-color`, `--md-typeset-color`, `--md-default-bg-color`) usando los hex de partida definidos en `research.md` sección 6.
  - Bloque `[data-md-color-scheme="slate"]` con overrides oscuros equivalentes.
  - Ajustes de tipografía: `--md-text-font: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;` y `--md-code-font: "IBM Plex Mono", "SFMono-Regular", monospace;`.
  - Ajustes mínimos de ritmo tipográfico (line-height base 1.6, tamaños de heading progresivos) para acercarse a la referencia.
  - Comentario cabecero indicando "Todos los tokens visuales del sitio viven aquí (Principio I)".
- [X] T009 [P] [US1] Crear `docs/assets/logo.svg` placeholder: SVG minimalista (círculo o glifo geométrico) 64x64, con `role="img"` y `<title>Formación Claude Code + SDD</title>`.
- [X] T010 [P] [US1] Crear `docs/assets/favicon.svg` placeholder: variante compacta del logo, 32x32, con `<title>` y viewBox correcto.
- [X] T011 [P] [US1] Escribir `docs/index.md` (home) con: H1 "Formación Claude Code + SDD (Speckit) para Java", párrafo de presentación en tono informal-correcto, subsección "Para quién es esta formación" cubriendo la audiencia dual (básico + avanzado), subsección "Objetivos" con lista bullet, y subsección "Mapa de módulos" con enlaces a las siete secciones (`introduccion/`, `setup/`, `claude-md/`, `app-ejemplo/`, `sdd/`, `agentes/`, `skills/`).
- [X] T012 [P] [US1] Escribir `docs/introduccion/index.md` placeholder: H1 "Introducción", párrafo "próximamente cubriremos el contexto de la formación, cómo está estructurada y cómo aprovecharla según tu nivel", admonition `!!! note "Contenido en construcción"` indicando que se completa como parte de esta misma spec.
- [X] T013 [P] [US1] Escribir `docs/setup/index.md` placeholder análogo, referenciando "próximamente cubriremos la instalación de Claude Code, RTK, Caveman, CodeGraph y SDKMAN" y admonition apuntando a la spec 2.
- [X] T014 [P] [US1] Escribir `docs/claude-md/index.md` placeholder: "próximamente cubriremos qué es `CLAUDE.md`, capas usuario/proyecto y buenas prácticas", admonition → spec 3.
- [X] T015 [P] [US1] Escribir `docs/app-ejemplo/index.md` placeholder: "próximamente cubriremos un CRUD Spring Boot 4 + Java 21 con H2 y un bug reproducible", admonition → spec 4.
- [X] T016 [P] [US1] Escribir `docs/sdd/index.md` placeholder: "próximamente cubriremos SDD con Speckit, greenfield vs brownfield, y aplicación al CRUD", admonition → spec 5.
- [X] T017 [P] [US1] Escribir `docs/agentes/index.md` placeholder: "próximamente cubriremos agentes de Claude Code, memoria, modelos y un agente propio para la app de ejemplo", admonition → spec 6.
- [X] T018 [P] [US1] Escribir `docs/skills/index.md` placeholder: "próximamente cubriremos skills, alcance usuario/proyecto y una skill propia sobre la app", admonition → spec 7.
- [X] T019 [US1] Verificar en local con `uv run mkdocs serve`: sin `WARNING`, sin `ERROR`, home accesible en `http://127.0.0.1:8000`, siete pestañas en el orden correcto, cada pestaña carga su placeholder, toggle claro/oscuro alterna paleta, y con DevTools → Rendering → `prefers-color-scheme` cambiado el default se ajusta al reload. Consola del navegador sin errores.

**Checkpoint**: sitio operativo en local con identidad visual y navegación completas.

---

## Phase 4: User Story 2 — Build estricta lista para publicar (Priority: P1)

**Goal**: cualquier contribuidor puede correr `uv run mkdocs build --strict` y obtener build limpia, sin warnings, con `site/` generado. Puerta de calidad exigida por Principio VI y SC-002.

**Independent Test**: tras `uv sync`, `uv run mkdocs build --strict` termina con exit 0 y sin líneas `WARNING`; `site/index.html` existe; cada placeholder aparece renderizada en `site/`.

### Implementation for User Story 2

- [X] T020 [US2] Ejecutar `uv run mkdocs build --strict` desde la raíz. Confirmar exit code 0 y ausencia de líneas `WARNING` en stdout/stderr. Si aparece cualquier warning (páginas huérfanas, enlaces rotos, extensiones mal configuradas), corregirlo en `mkdocs.yml` o en la página afectada hasta pasar limpio. No suprimir warnings vía flags permisivas.
- [X] T021 [US2] Sanity de `site/`: `test -f site/index.html && test -f site/introduccion/index.html && test -f site/setup/index.html && test -f site/claude-md/index.html && test -f site/app-ejemplo/index.html && test -f site/sdd/index.html && test -f site/agentes/index.html && test -f site/skills/index.html`. Comprobar además con `grep -R "Contenido en construcción" site/ | wc -l` que el número es ≥ 7.
- [X] T021b [US2] Validar escenario negativo de US2 (spec Acceptance Scenario 2): crear `docs/setup/_orphan.md` con contenido mínimo (`# Huérfana`) SIN añadirla al `nav` de `mkdocs.yml`. Ejecutar `uv run mkdocs build --strict`. Confirmar que el comando falla con exit code != 0 y que la salida identifica el archivo como no incluido en `nav` (mensaje del tipo `not included in the "nav" configuration`). A continuación **eliminar** `docs/setup/_orphan.md` y volver a ejecutar `uv run mkdocs build --strict` para confirmar que la build vuelve a verde. No debe quedar rastro del archivo en el repo tras la tarea.

**Checkpoint**: build reproducible y limpia (happy + negativo); sitio listo para pipeline futuro (spec 8) sin necesidad de cambios adicionales.

---

## Phase 5: User Story 3 — Contribuidor añade página y dependencia (Priority: P2)

**Goal**: alguien sin conocimiento previo del repo puede añadir una página nueva a un módulo y una dependencia MkDocs usando sólo `uv`, guiado únicamente por el `README.md`.

**Independent Test**: siguiendo únicamente el README, un contribuidor añade `docs/setup/prueba.md` + entrada en `nav`, la ve publicada en `mkdocs serve`; y ejecuta `uv add mkdocs-glightbox` sin recurrir a `pip`/`venv`.

### Implementation for User Story 3

- [X] T022 [US3] Escribir `README.md` en la raíz en español, tono informal-correcto, con secciones:
  - "Qué es este repo" (una línea + enlace a la constitution).
  - "Requisitos" (macOS/Linux/WSL2, `uv` con enlace a `https://docs.astral.sh/uv/`).
  - "Instalación" (`uv sync`).
  - "Levantar el sitio en local" (`uv run mkdocs serve` → `http://127.0.0.1:8000`).
  - "Validar antes de mergear" (`uv run mkdocs build --strict`).
  - "Añadir una página" (crear `docs/{modulo}/nombre.md`, registrar en `nav` de `mkdocs.yml`, reload).
  - "Añadir una dependencia" (`uv add <paquete>`, commitea `pyproject.toml` + `uv.lock`).
  - Nota final: "Este repo se ha estandarizado en `uv` como gestor Python; no se contemplan `pip`, `venv`, `pipenv`, `poetry` ni `conda` en el flujo principal".
- [X] T023 [US3] Validar el flujo "añadir página": crear `docs/setup/_prueba.md` de prueba (empezando por `_` para dejarla al final visualmente), registrarla en `nav`, `uv run mkdocs serve`, verificar aparición en navegación, y a continuación **eliminarla** junto con su entrada en `nav` antes de finalizar la tarea. Confirmar que `uv run mkdocs build --strict` sigue en verde tras la limpieza.
- [X] T024 [US3] Validar el flujo "añadir dependencia": ejecutar `uv add mkdocs-glightbox` sólo como validación, confirmar que aparece en `pyproject.toml` y `uv.lock`, y a continuación ejecutar `uv remove mkdocs-glightbox` para dejar el estado limpio. Confirmar que `pyproject.toml` y `uv.lock` quedan como antes (diff vacío frente al HEAD) y que `uv run mkdocs build --strict` sigue verde.

**Checkpoint**: flujo contribuidor totalmente documentado y probado.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: cumplir SC-004 (coherencia visual interna) y SC-007 (accesibilidad automatizada) y ejecutar los escenarios de `quickstart.md` como sanity final.

- [ ] T025 Auditoría visual interna: revisar la home y una placeholder en tema claro y oscuro; ajustar únicamente `docs/stylesheets/extra.css` (paleta, escalas tipográficas, spacing) hasta que al menos 4 de 5 revisores internos consideren coherente la identidad visual (SC-004). No tocar `mkdocs.yml` ni Markdown en esta tarea.
- [ ] T026 Auditoría accesibilidad con Lighthouse en `http://127.0.0.1:8000/` y en una placeholder cualquiera, en tema claro y en tema oscuro. Aceptación: score "Accessibility" ≥ 95 y 0 issues de contraste WCAG 2.1 AA en las cuatro combinaciones. Si algún check falla, ajustar sólo `docs/stylesheets/extra.css` y re-medir.
- [ ] T027 [P] Verificar manualmente `alt` en logo y favicon SVG (`<title>` presentes), foco visible en enlaces del nav (tab por teclado), y jerarquía de headings (un único `h1` por página) usando DevTools Accessibility tree.
- [X] T028 Ejecutar los 6 escenarios de `specs/001-mkdocs-skeleton/quickstart.md` de arriba a abajo en una sesión limpia (`.venv` recreada con `uv sync`). Marcar la Definition of Done local del quickstart. Cualquier falla obliga a corregir la tarea correspondiente y re-ejecutar.
- [X] T029 Build final: `uv run mkdocs build --strict` una vez más en verde. Confirmar que el árbol final del repo coincide con la estructura declarada en `plan.md` sección "Source Code".

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: requiere Setup completo. Bloquea US1, US2, US3.
- **US1 (Phase 3)**: requiere Foundational.
- **US2 (Phase 4)**: requiere US1 completa (necesita `mkdocs.yml` + contenido para probar `--strict`).
- **US3 (Phase 5)**: requiere US1 completa (necesita el sitio operativo para validar añadir página/dep). US3 puede hacerse en paralelo con US2 si hay dos personas: US2 valida build, US3 valida flujo contribuidor.
- **Polish (Phase 6)**: requiere US1, US2 y US3 completas.

### User Story Dependencies

- **US1 (P1)**: independiente entre US.
- **US2 (P1)**: sólo depende de US1 (necesita contenido para hacer `build --strict`).
- **US3 (P2)**: depende de US1 (README documenta lo que US1 dejó operativo).

### Within Each Story

- Dentro de US1: T007 (`mkdocs.yml`) debe existir antes de T019 (verificación). T008–T018 son todas [P] entre sí (archivos distintos).
- Dentro de US2: T020 debe pasar antes de T021 y T021b. T021b limpia sus artefactos (`docs/setup/_orphan.md`) antes de finalizar.
- Dentro de US3: T022 antes de T023/T024; T023 y T024 son [P] entre sí en árboles distintos (aunque tocan `pyproject.toml`/`uv.lock`, se revierten al final; secuenciar si no se confía en el revert).

### Parallel Opportunities

- Phase 1 y Phase 2 son mayormente secuenciales (uv necesita pyproject).
- En US1: T008–T018 son 11 tareas paralelizables (CSS, dos SVG, home + 7 placeholders).
- Phase 6: T025, T026, T027 pueden ejecutarse por distintos revisores en paralelo antes de T028/T029.

---

## Parallel Example: User Story 1

```bash
# En paralelo tras T007 (mkdocs.yml):
Task: "Crear docs/stylesheets/extra.css con tokens (T008)"
Task: "Crear docs/assets/logo.svg placeholder (T009)"
Task: "Crear docs/assets/favicon.svg placeholder (T010)"
Task: "Escribir docs/index.md home (T011)"
Task: "Escribir docs/introduccion/index.md placeholder (T012)"
Task: "Escribir docs/setup/index.md placeholder (T013)"
Task: "Escribir docs/claude-md/index.md placeholder (T014)"
Task: "Escribir docs/app-ejemplo/index.md placeholder (T015)"
Task: "Escribir docs/sdd/index.md placeholder (T016)"
Task: "Escribir docs/agentes/index.md placeholder (T017)"
Task: "Escribir docs/skills/index.md placeholder (T018)"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Phase 1 Setup (T001–T004).
2. Phase 2 Foundational (T005–T006).
3. Phase 3 US1 (T007–T019) → sitio operativo.
4. Phase 4 US2 (T020–T021) → build reproducible.
5. **STOP y VALIDAR**: sitio y build listos, MVP publicable en local.

### Incremental Delivery

1. Setup + Foundational.
2. US1 → validación local → demo interno ("mira el skeleton").
3. US2 → build en verde → listo para pipeline futuro (spec 8).
4. US3 → README completo → cualquiera del equipo puede colaborar solo.
5. Polish → identidad visual pulida + accesibilidad auditada.

### Parallel Team Strategy

- Persona A: Phase 1 + 2 + T007 (`mkdocs.yml`).
- Personas A, B, C: paralelo en T008–T018 tras T007.
- Persona A: T019 + Phase 4 (US2).
- Persona B: Phase 5 (US3, T022–T024) tras T019.
- Todas: Phase 6 (revisión visual + accesibilidad).

---

## Notes

- [P] = archivos distintos, sin dependencias.
- Ninguna tarea toca `examples/` ni `.claude/` (fuera de alcance).
- No hay test tasks: la verificación es `mkdocs build --strict` + Lighthouse + inspección manual.
- Commit por checkpoint (fin de fase) o por grupo lógico. No amender commits ya publicados.
- SC-004 (equivalencia visual) se afina en T025 y puede requerir varias iteraciones sobre `docs/stylesheets/extra.css`; no bloquear US1/US2 por ello.
- SC-007 (accesibilidad Lighthouse ≥ 95) se valida en T026 y sólo debería obligar a tocar `extra.css`.
