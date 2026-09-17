---

description: "Task list para el feature 007-skills-claude (solo documentación)"
---

# Tasks: Módulo "Skills de Claude Code" (solo documentación)

**Input**: Design documents from `/specs/007-skills-claude/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: no aplican tests unitarios; feature 100% documental. Validación funcional = `mkdocs build --strict` + inspección de contenido + verificación de URLs del catálogo.

**Organization**: US1 (docs conceptuales P1) + US2 (crear-una P2). Ambas independientemente entregables tras Setup+Foundational.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelo (fichero distinto, sin dependencias en curso).
- **[Story]**: US1 = docs conceptuales; US2 = crear-una + enlaces cruzados.
- Rutas absolutas relativas a la raíz del repo `claude-code-sdd-java/`.

## Path Conventions

- Docs: `docs/skills/*.md`
- Nav: `mkdocs.yml`
- `.claude/skills/`: NO se toca (Constitution v1.1.0 + FR-008).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: preparar el nav y garantizar que la estructura mínima existe.

- [X] T001 Verificar que existe `docs/skills/` en la raíz del repo (ya presente con `index.md` stub de spec 006).
- [X] T002 Actualizar la sección `nav` de `mkdocs.yml`: bloque `Skills` expandido a cinco entradas (`Introducción` → `index.md`, `Anatomía` → `anatomia.md`, `Alcance` → `alcance.md`, `Catálogo` → `catalogo.md`, `Crear una` → `crear-una.md`), ubicado entre "Agentes" y "SDD con Speckit".

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: crear stubs mínimos para que `nav` no rompa `--strict` mientras se redacta.

**⚠️ CRITICAL**: sin estos ficheros el build falla al referenciarlos desde `nav`.

- [X] T003 [P] Crear stub `docs/skills/anatomia.md` con H1 "Anatomía".
- [X] T004 [P] Crear stub `docs/skills/alcance.md` con H1 "Alcance".
- [X] T005 [P] Crear stub `docs/skills/catalogo.md` con H1 "Catálogo".
- [X] T006 [P] Crear stub `docs/skills/crear-una.md` con H1 "Crear una skill".
- [X] T007 Ejecutar `uv run mkdocs build --strict` para confirmar que skeleton + nav no producen warnings.

**Checkpoint**: sitio construye sin warnings; ambos stories pueden avanzar en paralelo.

---

## Phase 3: User Story 1 — Docs conceptuales (Priority: P1) 🎯 MVP

**Goal**: entregar las cuatro páginas conceptuales (`index`, `anatomia`, `alcance`, `catalogo`) que dan al estudiante el modelo mental completo de skills.

**Independent Test**: `uv run mkdocs serve` + navegación por las cuatro páginas comprobando acceptance scenarios 1–4 de US1.

### Implementación US1

- [X] T008 [P] [US1] Reescribir `docs/skills/index.md`: definición de skill, casos de uso típicos, tabla comparativa skill vs agente (mínimo filas "qué es" y "cuándo se dispara"), tono profesional-directo. Sobrescribe el stub actual.
- [X] T009 [P] [US1] Escribir contenido de `docs/skills/anatomia.md`: estructura de una skill (`SKILL.md`, `scripts/`, `assets/`), triggers observados en la doc oficial (documentar los patrones existentes en el momento de redacción sin exigir enumeración exhaustiva; anotar con "según la doc oficial verificada el YYYY-MM-DD"), mecanismo por el que Claude decide invocarla. Fuente autoritativa: `https://code.claude.com/docs/en/skills`. Incluir bloque "verificado el YYYY-MM-DD".
- [X] T010 [P] [US1] Escribir contenido de `docs/skills/alcance.md`: usuario (`~/.claude/skills/`) vs proyecto (`.claude/skills/`), relación con plugins, comando/atajo para listar skills disponibles, precedencia ante colisiones, política del repo (recuerda: este feature NO commitea nada bajo `.claude/skills/`).
- [X] T011 [US1] Poblar `docs/skills/catalogo.md` con tabla `Nombre | Autor | Propósito | Enlace | Verificado (YYYY-MM-DD)`; verificar cada URL con `curl -Is` exigiendo `HTTP/2 200` o `HTTP/1.1 200 OK`; 5–8 filas ordenadas alfabéticamente. Contrato en `specs/007-skills-claude/contracts/catalog-entry.schema.md`. Candidatos iniciales (verificar antes de commit): `anthropics/skills`, `multica-ai/andrej-karpathy-skills`, `hesreallyhim/awesome-claude-code`, `davila7/claude-code-templates`, `revolutionary-git/claude-skills`, + más si son necesarios para llegar a 5 verificados.
- [X] T012 [US1] Ejecutar `uv run mkdocs build --strict` y verificar 0 warnings tras US1.

**Checkpoint**: US1 entregable — estudiante lee las cuatro páginas y cumple SC-001, SC-002, SC-003.

---

## Phase 4: User Story 2 — Crear una skill (guía teórica) (Priority: P2)

**Goal**: publicar `crear-una.md` con paso a paso teórico, ejemplo ilustrativo aplicado al CRUD y enlaces cruzados a Agentes y SDD, dejando explícito que NO se materializa skill en el repo.

**Independent Test**: leer `crear-una.md` y verificar pasos numerados, aviso visible, ejemplo ilustrativo, enlaces cruzados a `docs/agentes/index.md` y `docs/sdd/index.md`. Comprobar por inspección que `.claude/skills/` no contiene nada añadido por este feature.

### Implementación US2

- [X] T013 [US2] Redactar `docs/skills/crear-una.md` con: aviso destacado (admonition `!!! info` o similar) "material didáctico; ninguna skill se materializa en el repo"; pasos numerados (1. elegir slug, 2. redactar `SKILL.md` con descripción + triggers, 3. añadir scripts/assets opcionales, 4. probar en `~/.claude/skills/` o `.claude/skills/`, 5. verificar); ejemplo ilustrativo aplicado al CRUD (scaffolder hipotético para un recurso "Product") con al menos **dos snippets fenced**: uno de `SKILL.md` (frontmatter + descripción) y uno de una plantilla Markdown de recurso (controller o DTO). Sin generar archivos reales.
- [X] T014 [US2] Añadir enlaces cruzados en `docs/skills/crear-una.md`: sección "Cuándo elegir skill vs agente" con enlace a `docs/agentes/index.md#diferencia-agente-vs-skill`; sección "Dónde encaja una skill en el flujo SDD" con enlace a `docs/sdd/index.md`.
- [X] T015 [US2] Verificar que `.claude/skills/` NO contiene ficheros de este feature: `find .claude/skills -type f 2>/dev/null | grep .` debe devolver vacío.
- [X] T016 [US2] Ejecutar `uv run mkdocs build --strict` y verificar 0 warnings tras US2.

**Checkpoint**: US2 entregable — módulo completo, sin skill funcional, cumple SC-002 y FR-007.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: cierre de calidad y verificación end-to-end.

- [X] T017 Ejecutar todas las validaciones de `specs/007-skills-claude/quickstart.md` (1 a 6) y anotar resultados en el MR.
- [X] T018 [P] Grep fuera de alcance: `grep -R -inE "gitlab-ci|github actions|pipeline ci" docs/skills/` MUST no devolver nada (FR-010). Contra-verificación: `find .claude/skills -type f 2>/dev/null | grep .` NO devuelve nada (FR-008).
- [X] T019 [P] Revisar tono según Principio I: pasada manual sobre las cinco páginas cazando argot ("a saco", "picar código", "molar"). Corregir donde aparezca.
- [X] T020 [P] Verificar que ninguna página de `docs/skills/` incluye CSS en línea ni tokens visuales duplicados (`grep -inE "<style|style=\"" docs/skills/*.md` debe devolver vacío).
- [X] T021 Confirmar mención expresa a Constitution v1.1.0 en el MR: agente propio MUST (cubierto por spec 006), skill propia SHOULD (relajada).
- [ ] T022 Commit final agrupando cambios: `docs/skills/*`, `mkdocs.yml`, artefactos de `specs/007-skills-claude/`, y la enmienda `.specify/memory/constitution.md` (v1.1.0). Mensaje: `feat(skills): módulo teórico + constitution v1.1.0 (skill propia SHOULD)`.

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): sin dependencias.
- Foundational (Phase 2): depende de Setup; bloquea US1 y US2.
- US1 (Phase 3): depende de Foundational.
- US2 (Phase 4): depende de Foundational y del contenido mínimo de US1 (necesita enlazar a la comparativa de `index.md`). US2 puede empezar en paralelo pero T014 requiere que T008 haya establecido la ancla.
- Polish (Phase 5): tras US1 + US2.

### User Story Dependencies

- **US1**: independiente. Ficheros: `docs/skills/{index,anatomia,alcance,catalogo}.md`.
- **US2**: casi independiente. Ficheros: `docs/skills/crear-una.md`. Depende blandamente de US1 sólo para el enlace ancla en `index.md` (T008).

### Within Each Story

- Contenido de páginas conceptuales (T008–T010) sin orden interno; paralelos.
- T011 (catálogo) requiere disponer de URLs verificadas antes de escribir.
- US2: T013 → T014 (requiere estructura de T013 y ancla en T008) → T015 → T016.

### Parallel Opportunities

- Foundational: T003–T006 en paralelo.
- US1: T008–T010 en paralelo; T011 en su propio slot.
- Polish: T018–T020 en paralelo.

---

## Parallel Example: User Story 1

```bash
# Redacción simultánea de páginas conceptuales:
Task: "T008 [US1] Reescribir docs/skills/index.md"
Task: "T009 [US1] Redactar docs/skills/anatomia.md"
Task: "T010 [US1] Redactar docs/skills/alcance.md"
```

## Parallel Example: Polish

```bash
Task: "T018 Grep fuera de alcance en docs/skills/ y .claude/skills/"
Task: "T019 Revisar tono según Principio I"
Task: "T020 Verificar ausencia de CSS en línea"
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Setup (T001–T002) → Foundational (T003–T007).
2. US1 (T008–T012) → **STOP y VALIDATE**: navegar sitio y confirmar SC-001..SC-003.
3. MVP demostrable con las cuatro páginas conceptuales publicadas.

### Incremental Delivery

1. Setup + Foundational → sitio construye.
2. US1 → merge parcial posible; formación cubre teoría de skills.
3. US2 → merge completo; guía de creación publicada.
4. Polish → cierre.

### Parallel Team Strategy

- Persona A: US1 (redacción páginas conceptuales, verificación catálogo).
- Persona B: US2 (crear-una + enlaces cruzados) tras T008.
- Ambos convergen en Polish.

---

## Notes

- FR-008: PROHIBIDO crear archivos bajo `.claude/skills/` en este feature.
- FR-010: PROHIBIDO documentar pipeline CI/CD.
- Constitution v1.1.0 vigente durante toda la implementación.
- Cualquier decisión no cubierta se resuelve consultando `plan.md`, `research.md` o la constitution.
