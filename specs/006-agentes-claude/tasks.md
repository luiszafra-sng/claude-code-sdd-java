---

description: "Task list para el feature 006-agentes-claude"
---

# Tasks: Módulo "Agentes de Claude Code" + agente propio

**Input**: Design documents from `/specs/006-agentes-claude/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: no se generan tareas de test unitario porque el feature es documental + configuración de agente. La validación funcional se cubre con `mkdocs build --strict` y la ejecución manual del agente descrita en `quickstart.md`.

**Organization**: dos user stories P1 (docs conceptuales y agente propio + guía). Ambas independientemente entregables tras Setup+Foundational.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelo (fichero distinto, sin dependencias en curso).
- **[Story]**: US1 = docs conceptuales; US2 = agente propio + `crear-uno.md`.
- Rutas absolutas relativas a la raíz del repo `claude-code-sdd-java/`.

## Path Conventions

- Docs: `docs/agentes/*.md`
- Nav: `mkdocs.yml`
- Agente: `.claude/agents/spring-boot-debugger.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: crear estructura mínima que ambos stories necesitan.

- [ ] T001 Crear directorio `docs/agentes/` en la raíz del repo (si no existe).
- [ ] T002 Crear directorio `.claude/agents/` en la raíz del repo (si no existe).
- [ ] T003 Añadir sección `Agentes` al `nav` de `mkdocs.yml`, entre "CLAUDE.md" y "SDD (Speckit)", con las seis entradas: `Introducción` (index), `Anatomía` (anatomia), `Memoria y modelos` (memoria-modelos), `Alcance` (alcance), `Catálogo` (catalogo), `Crear uno` (crear-uno).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: skeleton mínimo para que `mkdocs build` no rompa mientras se rellenan páginas.

**⚠️ CRITICAL**: sin estos ficheros vacíos referenciados en `nav`, `--strict` falla.

- [ ] T004 [P] Crear stub `docs/agentes/index.md` con H1 "Agentes" + placeholder de una línea.
- [ ] T005 [P] Crear stub `docs/agentes/anatomia.md` con H1 "Anatomía".
- [ ] T006 [P] Crear stub `docs/agentes/memoria-modelos.md` con H1 "Memoria y modelos".
- [ ] T007 [P] Crear stub `docs/agentes/alcance.md` con H1 "Alcance".
- [ ] T008 [P] Crear stub `docs/agentes/catalogo.md` con H1 "Catálogo".
- [ ] T009 [P] Crear stub `docs/agentes/crear-uno.md` con H1 "Crear un agente".
- [ ] T010 Ejecutar `uv run mkdocs build --strict` para confirmar que el skeleton + nav no producen warnings.

**Checkpoint**: sitio construye sin warnings; ambos stories pueden avanzar en paralelo.

---

## Phase 3: User Story 1 — Docs conceptuales (Priority: P1) 🎯 MVP

**Goal**: entregar las cinco páginas conceptuales (`index`, `anatomia`, `memoria-modelos`, `alcance`, `catalogo`) que permiten al estudiante entender qué es un agente, cómo se define, cómo elegir modelo, dónde vive y qué reutilizar.

**Independent Test**: `uv run mkdocs serve` + navegación por las cinco páginas comprobando que cada una cumple los acceptance scenarios 1–5 de US1 en `spec.md`.

### Implementación US1

- [ ] T011 [P] [US1] Escribir contenido de `docs/agentes/index.md`: definición de agente, tres casos de uso típicos, comparación tabular agente-vs-skill (columnas: qué es, cuándo se dispara, alcance, ejemplo). Tono profesional-directo (Principio I).
- [ ] T012 [P] [US1] Escribir contenido de `docs/agentes/anatomia.md`: estructura del archivo (frontmatter `name`, `description`, `model`, `tools`), sección de prompt del sistema, catálogo de tools disponibles (Read, Write, Edit, Bash, Grep, Glob, WebFetch, Task, etc.), y sección "Isolación por worktree" con snippet YAML de ejemplo aislado y nota "no aplica al agente `spring-boot-debugger`".
- [ ] T013 [P] [US1] Escribir contenido de `docs/agentes/memoria-modelos.md`: tipos de memoria aplicables al agente (contexto de invocación, memoria persistente del usuario si aplica, referencia a `CLAUDE.md`) + tabla comparativa `haiku | sonnet | opus` con columnas `coste relativo | latencia | uso recomendado`. Incluir bloque "Versión de referencia + fecha de verificación" (constitution 1.0.2 workflow).
- [ ] T014 [P] [US1] Escribir contenido de `docs/agentes/alcance.md`: diferencia `~/.claude/agents/` (usuario) vs `.claude/agents/` (proyecto), tabla de consecuencias (versionado, compartición, precedencia en colisiones), política de git para este repo (agentes del proyecto SÍ se commiten, agentes del usuario NO).
- [ ] T015 [US1] Poblar `docs/agentes/catalogo.md` con tabla `Nombre | Autor | Propósito | Enlace | Verificado (YYYY-MM-DD)`; verificar cada URL con `curl -Is` exigiendo `HTTP/2 200` o `HTTP/1.1 200 OK` antes de commit; 5–8 filas ordenadas alfabéticamente; sin auto-referencia a `spring-boot-debugger`. Contrato en `specs/006-agentes-claude/contracts/catalog-entry.schema.md`.
- [ ] T016 [US1] Ejecutar `uv run mkdocs build --strict` y verificar 0 warnings después de US1.

**Checkpoint**: US1 entregable — un estudiante puede leer las cinco páginas y completar SC-001, SC-002 y SC-003.

---

## Phase 4: User Story 2 — Agente propio + guía (Priority: P1)

**Goal**: publicar el agente `spring-boot-debugger` funcional en `.claude/agents/` y la página `crear-uno.md` que enseña a construir un agente propio usando ese mismo agente como caso guía, incluyendo una transcripción reducida sobre el bug NPE del CRUD.

**Independent Test**: invocar el agente desde Claude Code sobre el bug NPE del CRUD (spec 004) y verificar el ciclo localizar → reproducir → diff → `./mvnw test`. Contrastar con `crear-uno.md`.

### Implementación US2

- [ ] T017 [US2] Crear `.claude/agents/spring-boot-debugger.md` cumpliendo el contrato en `specs/006-agentes-claude/contracts/agent-frontmatter.schema.md`: frontmatter (`name: spring-boot-debugger`, `description: <≤160 chars sobre diagnóstico Spring Boot 4 + Java 21>`, `model: sonnet`, `tools: Read, Grep, Glob, Bash, Edit`) + prompt del sistema con las cuatro secciones obligatorias (localizar stacktrace, reproducir con test, proponer diff mínimo, ejecutar `./mvnw test`). Incluir manejo de los 3 edge cases del contrato (sin build previo, bug ya resuelto, diff que rompe otro test).
- [ ] T018 [US2] Validar frontmatter con `head -n 10 .claude/agents/spring-boot-debugger.md` y confirmar que el orden y valores coinciden con el contrato. Sin campo `isolation`.
- [ ] T019 [US2] Pre-check: verificar que `examples/user-crud-modern` (spec 004) compila con `./mvnw -q -DskipTests package` y reproduce el bug NPE; si no está publicado aún, BLOQUEAR US2 hasta que spec 004 cierre. Luego invocar el agente siguiendo la Validación 4 de `quickstart.md` y capturar transcripción; recortarla a 15–40 líneas ilustrando los 4 pasos.
- [ ] T020 [US2] Escribir contenido de `docs/agentes/crear-uno.md`: paso a paso reproducible para crear un agente propio (elegir slug, definir description, escoger model, listar tools, redactar prompt en 4 pasos, commitear). Anclar cada paso a `spring-boot-debugger` como ejemplo. Incluir transcripción reducida capturada en T019 en un bloque `markdown` fenced. Marcar explícitamente que legacy Java queda fuera de alcance de este ejemplo (Principio II).
- [ ] T021 [US2] Enlazar `crear-uno.md` con `anatomia.md` (frontmatter) y `memoria-modelos.md` (elección de `sonnet`) mediante enlaces relativos.
- [ ] T022 [US2] Ejecutar `uv run mkdocs build --strict` y verificar 0 warnings después de US2.

**Checkpoint**: US2 entregable — SC-005 y SC-006 verificables. Estudiante puede reproducir la guía y usar el agente sobre el CRUD.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: cierre de calidad y verificación end-to-end.

- [ ] T023 Ejecutar todas las validaciones de `specs/006-agentes-claude/quickstart.md` (1 a 6) y anotar resultados en el MR.
- [ ] T023b Verificar FR-010 (agente sin dependencias externas al toolchain): revisar el prompt de `.claude/agents/spring-boot-debugger.md` con `grep -E 'brew|apt|docker|curl -O|wget' .claude/agents/spring-boot-debugger.md` y confirmar que no aparece ningún comando fuera de `./mvnw`, `git` y herramientas de Claude Code.
- [ ] T024 [P] Grep de fuera de alcance: `grep -R -n "skills/" docs/agentes/` MUST no devolver nada; `docs/agentes/crear-uno.md` NO debe contener el fix definitivo del bug del CRUD (revisar manualmente).
- [ ] T025 [P] Revisar tono: pasada manual sobre las seis páginas cazando argot ("a saco", "picar código", etc.) según Principio I; corregir donde aparezca.
- [ ] T026 [P] Verificar que ninguna página de `docs/agentes/` incluye CSS en línea ni tokens visuales duplicados; si algún estilo nuevo hiciera falta, añadirlo SOLO en `docs/stylesheets/extra.css` (Principio I).
- [ ] T027 Marcar `[x]` los items aún pendientes en `specs/006-agentes-claude/checklists/requirements.md` si el review lo confirma; si no, dejar constancia en Notes.
- [ ] T028 Commit final agrupando los cambios: `docs/agentes/*`, `mkdocs.yml`, `.claude/agents/spring-boot-debugger.md`, artefactos de `specs/006-agentes-claude/`. Mensaje describiendo Principio V cubierto.

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): sin dependencias.
- Foundational (Phase 2): depende de Setup; bloquea US1 y US2 porque los stubs deben existir para que `nav` no rompa.
- US1 (Phase 3): depende de Foundational.
- US2 (Phase 4): depende de Foundational. Independiente de US1 en los ficheros que toca; puede solaparse en tiempo.
- Polish (Phase 5): tras US1 + US2.

### User Story Dependencies

- **US1**: independiente. Ficheros: `docs/agentes/{index,anatomia,memoria-modelos,alcance,catalogo}.md`.
- **US2**: independiente. Ficheros: `.claude/agents/spring-boot-debugger.md`, `docs/agentes/crear-uno.md`. Sólo referencia (enlaces) a páginas de US1; no las bloquea.

### Within Each Story

- Contenido de páginas (T011–T015) sin orden interno; todas paralelas.
- US2: T017 → T018 (validar frontmatter) → T019 (capturar transcripción, requiere agente creado) → T020 (usa transcripción) → T021 → T022.

### Parallel Opportunities

- Foundational: T004–T009 en paralelo (ficheros distintos).
- US1: T011–T014 en paralelo; T015 depende de disponer de las URLs verificadas pero no de las otras páginas.
- Polish: T024–T026 en paralelo.

---

## Parallel Example: User Story 1

```bash
# Redacción simultánea de páginas conceptuales (ficheros distintos):
Task: "T011 [US1] Redactar docs/agentes/index.md"
Task: "T012 [US1] Redactar docs/agentes/anatomia.md"
Task: "T013 [US1] Redactar docs/agentes/memoria-modelos.md"
Task: "T014 [US1] Redactar docs/agentes/alcance.md"
```

## Parallel Example: Polish

```bash
Task: "T024 Grep fuera de alcance en docs/agentes/"
Task: "T025 Revisar tono según Principio I"
Task: "T026 Verificar ausencia de CSS en línea"
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Setup (T001–T003) → Foundational (T004–T010).
2. US1 (T011–T016) → **STOP y VALIDATE**: navegar el sitio y confirmar SC-001..SC-003.
3. MVP demostrable con las cinco páginas conceptuales publicadas.

### Incremental Delivery

1. Setup + Foundational → sitio construye.
2. US1 → merge parcial posible; formación cubre teoría de agentes.
3. US2 → merge completo; agente ejemplificado y `crear-uno.md` publicado.
4. Polish → cierre.

### Parallel Team Strategy

- Persona A: US1 (redacción páginas conceptuales, verificación catálogo).
- Persona B: US2 (agente + transcripción + crear-uno).
- Ambos convergen en Polish.

---

## Notes

- Se prohíbe crear archivos Markdown fuera de `docs/agentes/` y del feature dir (CLAUDE.md del repo).
- `.env*` fuera de este feature; sin credenciales.
- Cualquier decisión no cubierta se resuelve consultando la constitution v1.0.2 (Principios I, II, III, V) y el spec 004 (CRUD) como fuente del bug de ejemplo.
- No incluir contenido sobre skills; queda para módulo posterior.
