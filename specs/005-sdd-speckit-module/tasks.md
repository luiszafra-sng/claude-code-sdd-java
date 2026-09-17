---

description: "Task list for feature 005-sdd-speckit-module"
---

# Tasks: Módulo "SDD con Speckit"

**Input**: Design documents from `/specs/005-sdd-speckit-module/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: no aplica en sentido código-fuente. La "prueba" es `uv run mkdocs build --strict` + revisión editorial por escenario de `quickstart.md`. Se incluyen tareas de validación específicas por historia.

**Organization**: tareas agrupadas por historia para permitir entrega incremental (MVP = US1 + US2 sobre `index.md` + `flujo.md` + `caso-guia.md`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: puede ejecutarse en paralelo (fichero distinto, sin dependencias pendientes).
- **[Story]**: US1/US2/US3/US4 según spec.md. Setup y Polish sin label.
- Rutas de fichero absolutas o relativas a la raíz del repo.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: preparar la infraestructura común del módulo (nav, extensiones MkDocs, esqueleto de carpeta).

- [X] T001 Crear directorio `docs/sdd/` y stubs vacíos con encabezado H1 para las seis páginas: `docs/sdd/index.md`, `docs/sdd/flujo.md`, `docs/sdd/caso-guia.md`, `docs/sdd/greenfield.md`, `docs/sdd/brownfield.md`, `docs/sdd/antipatrones.md`.
- [X] T002 Actualizar `mkdocs.yml`: reemplazar la entrada `- SDD con Speckit: sdd/index.md` por bloque anidado con las seis páginas en el orden `index → flujo → caso-guia → greenfield → brownfield → antipatrones`. Mantener posición actual (después de "App de ejemplo", antes de "Agentes").
- [X] T003 Actualizar `mkdocs.yml`: extender `pymdownx.superfences` con `custom_fences` para `mermaid` (`class: mermaid`, `format: !!python/name:pymdownx.superfences.fence_code_format`) según research §2.
- [X] T004 Añadir a `mkdocs.yml` la clave `extra_javascript` con el runtime Mermaid pinneado a `https://unpkg.com/mermaid@11.4.0/dist/mermaid.min.js` y un script inline mínimo (`docs/assets/js/mermaid-init.js`) que llame `mermaid.initialize({ startOnLoad: true });` (research §3). Crear `docs/assets/js/mermaid-init.js`.
- [X] T005 Ejecutar `uv run mkdocs build --strict` para verificar que la nav ampliada y el custom_fence no rompen el build antes de escribir contenido.

**Checkpoint**: sitio compila `--strict` con nav ampliada y Mermaid habilitado.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: activos compartidos por todas las páginas (plantilla de bloque de versión, chequeo de scope, base editorial).

**CRITICAL**: sin esta fase, ninguna página cumple `page-template.md`.

- [X] T006 [P] Redactar plantilla de bloque de versión reutilizable (snippet) en `docs/sdd/_snippets/version-block.md` siguiendo `contracts/version-block.md`. Nota: usar `pymdownx.snippets` (ya activo) para reutilizar sin duplicar.
- [X] T007 [P] Redactar plantilla de sección "Enlaces relacionados" en `docs/sdd/_snippets/enlaces-relacionados.md` (encabezado H2 + lista vacía) para reutilizar en las seis páginas.
- [X] T008 Crear registro de "cross-links esperados por página" en `specs/005-sdd-speckit-module/notes-crosslinks.md` (matriz página × módulo destino) para guiar T-US*-crosslinks.
- [X] T009 Añadir gate de scope al README del PR (o `.specify/notes/scope-gate.md`): comando `git diff --stat examples/ contracts/` esperado vacío, según SC-006 y quickstart §4.

**Checkpoint**: snippets reutilizables listos; matriz de cross-links y gate de scope documentados.

---

## Phase 3: User Story 1 — Recorrer el ciclo Speckit end-to-end (Priority: P1) MVP

**Goal**: publicar `index.md`, `flujo.md` y `caso-guia.md` con contenido completo para que el alumno entienda SDD, el ciclo Speckit y el caso guía en su lectura.

**Independent Test**: quickstart §7 (contrato de página) sobre `index.md`, `flujo.md`, `caso-guia.md` + quickstart §1 (build strict) + quickstart §3 (Mermaid renderiza).

### Implementation for User Story 1

- [X] T010 [P] [US1] Redactar `docs/sdd/index.md` con las cinco secciones H2 de `contracts/page-template.md` (Qué es SDD, SDD vs vibe coding, Por qué SDD encaja en Java empresarial, Cuándo NO usar SDD, Enlaces relacionados). Tabla comparativa con 8 filas según research §8. Sin bloque de versión (esta página no cita versiones puntuales).
- [X] T011 [US1] Redactar `docs/sdd/flujo.md` con las secciones obligatorias de `contracts/page-template.md`. Incluir diagrama Mermaid `flowchart LR` según research §9 (aristas sólidas obligatorios, discontinuas opcionales, bucle `converge → specify`). Incluir bloque de versión de referencia (Speckit + Mermaid + MkDocs Material) por snippet.
- [X] T012 [US1] Redactar `docs/sdd/flujo.md` — subsecciones H3 por cada uno de los 9 pasos Speckit (`specify`, `plan`, `tasks`, `implement`, `constitution`, `clarify`, `analyze`, `checklist`, `converge`) con **Qué produce**, **Inputs necesarios** y **Cuándo dispararlo** (para opcionales). Incluir extracto ilustrativo del caso guía por paso (referencia cruzada a `caso-guia.md` cuando el extracto es largo).
- [X] T013 [US1] Redactar `docs/sdd/caso-guia.md` — secciones "Contexto del ejercicio" y "Aviso — extractos ilustrativos" (declaración FR-010 explícita). Enlazar a `../app-ejemplo/index.md` y `../setup/index.md`. Insertar bloque "Versión de referencia" (Speckit + Claude Code + JDK 21 + Maven 3.9.x + fecha `2026-09-16`) usando snippet `_snippets/version-block.md` para cumplir FR-005 / constitution 1.0.2.
- [X] T014 [US1] Redactar `docs/sdd/caso-guia.md` — sección "Prompt inicial para /speckit-specify" con bloque de código copiable en Markdown.
- [X] T015 [US1] Redactar `docs/sdd/caso-guia.md` — sección "Clarifications propuestas" con subsecciones H3 por pregunta (sensibilidad `nameContains`, semántica AND/OR, orden por defecto, tamaño máximo de página, shape del envelope, política unknown params, `size=0`/`page` negativo). Cada H3 con **Respuesta recomendada oficial**, **Justificación**, **Alternativas rechazadas** (Q3 clarification).
- [X] T016 [US1] Redactar `docs/sdd/caso-guia.md` — secciones "Extracto de plan.md", "Extracto de tasks.md" (5–8 tareas), "Extracto del contract" (query params + schema `PagedUserResponse`), "Salida esperada de /speckit-implement", "Verificación" (`./mvnw test` y `curl`). Aplicar umbral de 40 líneas (research §4): extractos largos van a `docs/sdd/artefactos/`.
- [ ] T017 [US1] Si algún extracto de T016 excede 40 líneas, crear los anexos correspondientes bajo `docs/sdd/artefactos/<paso>-<slug>.md` y actualizar `mkdocs.yml` con las sub-entradas nav de los anexos (research §11).
- [X] T018 [P] [US1] Añadir sección "Enlaces relacionados" al pie de `docs/sdd/index.md`, `docs/sdd/flujo.md`, `docs/sdd/caso-guia.md` usando snippet `_snippets/enlaces-relacionados.md` y la matriz de `notes-crosslinks.md`.
- [X] T019 [US1] Ejecutar quickstart escenarios 1, 2, 3, 5, 6, 7 sobre las tres páginas. Registrar resultados en `specs/005-sdd-speckit-module/notes-validation-us1.md`. Corregir cualquier warning.

**Checkpoint**: MVP publicable. Alumno puede leer index → flujo → caso-guia y comprender ciclo + ejercicio.

---

## Phase 4: User Story 2 — Reproducir el ciclo en su máquina (Priority: P1)

**Goal**: garantizar que `caso-guia.md` sea suficiente para que un alumno con Speckit instalado reproduzca el ciclo sobre su copia local de `user-crud-modern` sin apoyo externo.

**Independent Test**: quickstart §8 (spot check reproducibilidad) ejecutado por un revisor externo al autor.

### Implementation for User Story 2

- [X] T020 [US2] Añadir en `docs/sdd/caso-guia.md` sección/subsección "Cómo reproducir esto en tu máquina" con checklist de prerequisitos (Claude Code, Speckit, JDK 21 vía SDKMAN, copia local de `user-crud-modern`) enlazando a `../setup/index.md` y `../app-ejemplo/index.md`.
- [X] T021 [US2] Verificar que todos los bloques de prompt en `caso-guia.md` son 100 % copiables (sin placeholders `<...>` sin resolver, sin ediciones estructurales). Incluir botón de copia MkDocs (ya activo por `content.code.copy`).
- [X] T022 [US2] Añadir bloque copiable con comandos de verificación al final de cada paso Speckit relevante en `caso-guia.md`: `./mvnw test`, `curl "http://localhost:8080/users?nameContains=an&page=0&size=10"` etc. Respuesta esperada JSON en bloque adyacente.
- [ ] T023 [US2] Ejecutar quickstart escenario 8 con un revisor que no haya escrito el módulo. Cronometrar el recorrido de principio a fin y registrar en `specs/005-sdd-speckit-module/notes-validation-us2.md`: tiempo total (SC-002 exige ≤90 min), divergencias estructurales encontradas y correcciones aplicadas.

**Checkpoint**: alumno externo reproduce el caso guía siguiendo sólo lo publicado. SC-002 verificable.

---

## Phase 5: User Story 3 — Aplicar SDD en greenfield y brownfield (Priority: P2)

**Goal**: publicar `greenfield.md` y `brownfield.md` con guías accionables para proyecto Java nuevo y para proyecto existente moderno/legacy.

**Independent Test**: lector puede extraer checklist accionable de cada página; quickstart §1 y §7 sobre ambas páginas.

### Implementation for User Story 3

- [X] T024 [P] [US3] Redactar `docs/sdd/greenfield.md` con las seis secciones H2 obligatorias (`Punto de partida`, `Constitution mínima`, `CLAUDE.md inicial`, `Cuándo crear agentes específicos`, `Orden recomendado de specs`, `Enlaces relacionados`). Incluir ejemplos concretos de `CLAUDE.md` y constitution mínima como bloques de código Markdown.
- [X] T025 [P] [US3] Redactar `docs/sdd/brownfield.md` con las siete secciones H2 obligatorias (`Punto de partida`, `Indexar con CodeGraph`, `CLAUDE.md que refleja convenciones actuales`, `Constitution descriptiva no aspiracional`, `Cuándo conviene un agente por dominio del legacy`, `Primera spec sobre código heredado`, `Enlaces relacionados`). Usar `user-crud-modern` como referencia narrativa: la feature de búsqueda + paginación se presenta como caso brownfield.
- [X] T026 [P] [US3] Añadir bloque de versión de referencia en `greenfield.md` y `brownfield.md` cuando citen versiones (Claude Code, CodeGraph, Speckit) según snippet `_snippets/version-block.md`.
- [X] T027 [US3] Añadir sección "Enlaces relacionados" en ambas páginas según snippet + matriz `notes-crosslinks.md`.
- [X] T028 [US3] Ejecutar quickstart §1, §6, §7 sobre ambas páginas. Registrar en `specs/005-sdd-speckit-module/notes-validation-us3.md`.

**Checkpoint**: guías greenfield y brownfield accionables. US3 completa.

---

## Phase 6: User Story 4 — Antipatrones (Priority: P3)

**Goal**: publicar `antipatrones.md` con al menos 10 antipatrones (síntoma / causa / contramedida).

**Independent Test**: quickstart §9 + revisión estructural sobre `antipatrones.md`.

### Implementation for User Story 4

- [X] T029 [P] [US4] Redactar `docs/sdd/antipatrones.md` con sección "Cómo leer esta página" + al menos 10 subsecciones H3 (specs vagas, tasks sin AC, saltarse el plan, editar código sin spec, `/speckit-clarify` cosmético, `plan.md` que dicta código, `/speckit-analyze` ignorado, `/speckit-converge` como coartada, prompts con solución preescrita, tests escritos post-implement). Cada H3 con bloques `**Síntoma**`, `**Causa**`, `**Contramedida**`.
- [X] T030 [US4] Añadir sección "Enlaces relacionados" al pie según snippet + matriz.
- [ ] T031 [US4] Ejecutar quickstart §7 y §9 (revisor lee y anota antipatrón cometido antes + contramedida aplicable). Cronometrar la lectura completa de `index.md → flujo.md → caso-guia.md` (SC-001 exige ≤45 min) y registrar en `specs/005-sdd-speckit-module/notes-validation-us4.md` tiempo, antipatrón identificado y contramedida propuesta.

**Checkpoint**: US4 completa. Refuerzo para practicantes disponible.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: verificaciones globales, limpieza, cumplimiento de SC.

- [X] T032 Ejecutar `uv run mkdocs build --strict` final. Cero warnings (SC-003).
- [X] T033 Ejecutar `git diff --stat examples/ contracts/` sobre el conjunto del commit — salida vacía (SC-006). Ejecutar además `find examples/user-crud-modern/.specify -type f 2>/dev/null` y `find examples/user-crud-modern/specs -type f 2>/dev/null` — ambas vacías, para verificar FR-015 (no se ha introducido ciclo Speckit ejecutable dentro de la app).
- [X] T034 Verificar bloques de versión: `grep -R '"Versión de referencia"' docs/sdd/` — cada resultado con fecha ≤ 6 meses respecto a la fecha de merge (SC-004).
- [ ] T035 [P] Revisión editorial global: registro de tono profesional-directo (Principio I), sin argot ni caricaturas. Registrar en `specs/005-sdd-speckit-module/notes-editorial.md`.
- [X] T036 [P] Revisión de cross-links global: cada página del módulo contiene sección "Enlaces relacionados" o justifica su ausencia en revisión (FR-004).
- [X] T037 Actualizar `mkdocs.yml` si algún reordenamiento nav resultó tras T017. Re-ejecutar `mkdocs build --strict`.
- [X] T038 Consolidar notas de validación (T019, T023, T028, T031, T035, T036) en `specs/005-sdd-speckit-module/notes-validation-final.md`.
- [X] T039 Redactar checklist de PR (Constitution respetada: I, II, IV, V referenciados; principios NO tocados: III, VI cumplidos por baseline) para adjuntar al merge request. Salida: `specs/005-sdd-speckit-module/pr-checklist.md`.

**Checkpoint**: todos los SC verificables. Módulo listo para merge.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias. T001–T005 secuencial (T002 depende de T001; T003 y T004 pueden solaparse; T005 al final).
- **Foundational (Phase 2)**: depende de Phase 1. T006/T007/T008 en paralelo. T009 en paralelo.
- **US1 (Phase 3)**: depende de Phase 2. Bloque MVP.
- **US2 (Phase 4)**: depende de US1 (edita `caso-guia.md` que US1 crea).
- **US3 (Phase 5)**: depende de Phase 2. Independiente de US1/US2.
- **US4 (Phase 6)**: depende de Phase 2. Independiente de US1/US2/US3.
- **Polish (Phase 7)**: depende de que las US en alcance del release estén completas.

### User Story Dependencies

- **US1 → US2**: US2 edita `caso-guia.md` creada por US1.
- **US1 vs US3 vs US4**: independientes tras Foundational; pueden solaparse por autor distinto.

### Within Each User Story

- Contenido antes de "Enlaces relacionados" y bloque de versión.
- Cuerpo antes de validación quickstart.
- Anexos (T017) sólo si algún extracto excede umbral.

### Parallel Opportunities

- T006, T007 en paralelo (snippets distintos).
- T010 (index) y T024/T025 (greenfield/brownfield) y T029 (antipatrones) en paralelo si distintos autores tras Foundational.
- T018 en paralelo cuando T010–T017 completas.
- T035, T036 en paralelo en Polish.

---

## Parallel Example: kickoff post-Foundational

```bash
# Tras completar Phase 2, tres autores pueden avanzar en paralelo:
Autor A: T010 → T011 → T012 → T013…T019 (US1, ruta crítica MVP)
Autor B: T024 → T026 → T027 → T028 (US3, greenfield)
Autor C: T025 → T026 → T027 → T028 (US3, brownfield)
Autor D: T029 → T030 → T031 (US4)

# US2 arranca cuando US1 llega al menos a T016 (caso-guia.md con extractos)
Autor A: T020 → T021 → T022 → T023
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Phase 1 Setup + Phase 2 Foundational.
2. Phase 3 US1 completa (index + flujo + caso-guia base).
3. Phase 4 US2 (reproducibilidad para el alumno).
4. **STOP y VALIDATE** con quickstart §1, §2, §3, §7, §8.
5. Publicar MVP: alumno entiende SDD, sigue el flujo y reproduce el caso guía.

### Incremental Delivery

1. MVP (US1 + US2) → merge.
2. US3 (greenfield + brownfield) → merge separado.
3. US4 (antipatrones) → merge separado.
4. Polish final → cerrar release del módulo.

### Parallel Team Strategy

- Un autor lleva la ruta crítica (US1 → US2).
- En paralelo, otro autor cubre US3.
- Un tercero cubre US4.
- Revisor externo aplica quickstart §8 sobre el MVP.

---

## Notes

- No hay código fuente ni tests unitarios. "Tests" = `mkdocs build --strict` + quickstart escenarios + revisión editorial.
- App `examples/user-crud-modern/` intacta en todo momento; T033 lo verifica.
- Extractos ilustrativos conservan escaffold en inglés de los templates Speckit (research §5); contenido en español.
- Umbral de 40 líneas para decidir inline vs anexo (research §4); revisar al escribir T016.
- Cada commit conserva un scope: no mezclar Phase 2 con Phase 3, no mezclar US distintas.
