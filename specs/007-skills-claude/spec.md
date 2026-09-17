# Feature Specification: Módulo "Skills de Claude Code" (solo documentación)

**Feature Branch**: `007-skills-claude`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Módulo 'Skills de Claude Code' en `docs/skills/` (index, anatomía, alcance, catálogo, crear-una) exclusivamente documental. No se crea ninguna skill propia. Fuera de alcance: pipeline CI/CD y cualquier skill funcional versionada. Referencia constitution: Principio V."

## Clarifications

### Session 2026-09-16

- Q: ¿Se debe incluir una skill propia funcional versionada en `.claude/skills/`? → A: No. El módulo es solo documentación teórica; ninguna skill se materializa en el repo. `crear-una.md` explica el proceso con un ejemplo ilustrativo sin fichero commiteado.
- Q: ¿Cómo se resuelve el choque con el Principio V (constitution v1.0.2) que exigía "una skill propia" como MUST? → A: Enmendar constitution a v1.1.0 (bump MINOR); Principio V relaja la parte de skill de MUST a SHOULD. Agente propio sigue siendo MUST.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Estudiante entiende qué es una skill y cuándo usarla (Priority: P1)

Un estudiante que ya ha completado el módulo Agentes abre el sitio de la formación y navega al módulo "Skills". Lee la página inicial y sale sabiendo qué es una skill, cuándo conviene invocarla, y en qué se diferencia prácticamente de un agente (skill = capacidad invocable / recurso de referencia; agente = ejecutor autónomo con contexto propio). Continúa por anatomía, alcance y catálogo para completar su modelo mental.

**Why this priority**: Principio V exige definición precisa, diferencias con agentes, alcance de instalación y catálogo curado. Este bloque conceptual es el núcleo del feature.

**Independent Test**: navegar el sitio con `uv run mkdocs serve` y comprobar que las cuatro páginas conceptuales (`index`, `anatomia`, `alcance`, `catalogo`) existen, aparecen en el `nav`, contienen los apartados exigidos y se renderizan sin warnings con `mkdocs build --strict`.

**Acceptance Scenarios**:

1. **Given** el sitio construido, **When** el usuario abre `Skills → Introducción`, **Then** encuentra definición de skill, casos de uso típicos y comparación explícita con agente (dos filas mínimas: qué es, cuándo dispara).
2. **Given** el sitio construido, **When** el usuario abre `Skills → Anatomía`, **Then** encuentra la estructura de una skill (`SKILL.md`, scripts, assets), la sección de triggers y una explicación de cómo Claude decide invocarla.
3. **Given** el sitio construido, **When** el usuario abre `Skills → Alcance`, **Then** encuentra la diferencia entre skills de usuario (`~/.claude/skills/`) y de proyecto (`.claude/skills/`), la relación con plugins y el comando/atajo para listar las skills disponibles.
4. **Given** el sitio construido, **When** el usuario abre `Skills → Catálogo`, **Then** encuentra entre 5 y 8 entradas curadas con enlace, autor, propósito y fecha de verificación, todas accesibles en el momento de redacción.

---

### User Story 2 - Estudiante aprende a crear una skill leyendo la guía teórica (Priority: P2)

El estudiante entra en `Skills → Crear una` y lee un paso a paso teórico que describe cómo construiría una skill propia orientada al CRUD (por ejemplo, un scaffolder de endpoints para Spring Boot). La página no exige que el estudiante materialice la skill: describe la estructura, los triggers y un ejemplo ilustrativo de invocación. Los estudiantes que quieran materializarla lo harán como ejercicio propio, fuera del repo.

**Why this priority**: cierra el módulo con una guía práctica accionable sin comprometer scope. Baja a P2 porque no requiere entregable ejecutable en el repo.

**Independent Test**: `crear-una.md` renderiza correctamente, incluye pasos numerados, un ejemplo ilustrativo de invocación sobre el CRUD y enlaces cruzados a Agentes y SDD.

**Acceptance Scenarios**:

1. **Given** el sitio construido, **When** el usuario abre `Skills → Crear una`, **Then** encuentra pasos numerados (elegir slug, redactar `SKILL.md`, definir triggers, incluir assets/scripts opcionales, verificar) y un ejemplo ilustrativo aplicado al CRUD.
2. **Given** la página `crear-una.md`, **When** el usuario la lee, **Then** encuentra enlaces cruzados a los módulos Agentes (comparación / cuándo elegir uno u otro) y SDD (dónde encaja una skill dentro del flujo Speckit).
3. **Given** el repo clonado, **When** se lista `.claude/skills/`, **Then** el directorio NO contiene ninguna skill propia versionada de este feature (queda como ejercicio del estudiante).

---

### Edge Cases

- Colisión de nombre entre skill de usuario y de proyecto: la página `alcance.md` MUST explicar cuál prevalece y cómo diagnosticarlo.
- Un enlace del catálogo deja de existir tras la publicación: la página MUST indicar la fecha de verificación de cada entrada para retirarla en la revisión semestral.
- El ejemplo ilustrativo de `crear-una.md` referencia archivos que no se generan realmente: la página MUST dejar claro que es una ilustración teórica y no un entregable ejecutable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sitio MkDocs MUST incluir un módulo "Skills" bajo `docs/skills/` con cinco páginas: `index.md`, `anatomia.md`, `alcance.md`, `catalogo.md`, `crear-una.md`.
- **FR-002**: `mkdocs.yml` MUST enlazar el nuevo módulo en la sección `nav` con títulos en español, ubicado entre "Agentes" y "SDD con Speckit".
- **FR-003**: `index.md` MUST responder qué es una skill, cuándo usarla y en qué se diferencia prácticamente de un agente (skill = capacidad invocable / recurso de referencia; agente = ejecutor autónomo con contexto propio), con una tabla comparativa mínima (qué es, cuándo se dispara).
- **FR-004**: `anatomia.md` MUST documentar la estructura de una skill (`SKILL.md`, scripts, assets), los triggers admitidos y el mecanismo por el que Claude decide invocarla.
- **FR-005**: `alcance.md` MUST distinguir skills de usuario (`~/.claude/skills/`) y de proyecto (`.claude/skills/`), la relación con plugins vs skills locales y cómo listar las skills disponibles.
- **FR-006**: `catalogo.md` MUST listar entre 5 y 8 repositorios de skills reutilizables en formato tabla con columnas `Nombre | Autor | Propósito | Enlace | Verificado (YYYY-MM-DD)`. Cada entrada MUST haberse verificado accesible antes de publicarse.
- **FR-007**: `crear-una.md` MUST contener un paso a paso teórico para crear una skill propia, con un ejemplo ilustrativo aplicado al CRUD (por ejemplo, scaffolder de endpoints) y enlaces cruzados a los módulos "Agentes" y "SDD con Speckit". La página MUST indicar explícitamente que es material didáctico y que ninguna skill se materializa en el repo.
- **FR-008**: El repo NO debe contener ningún directorio ni fichero bajo `.claude/skills/` como resultado de este feature. Cualquier skill propia queda como ejercicio del estudiante fuera del repo.
- **FR-009**: El módulo MUST superar `uv run mkdocs build --strict` sin warnings.
- **FR-010**: El módulo NO debe incluir contenido sobre pipeline CI/CD; queda explícitamente fuera de alcance.

### Key Entities

- **Página de módulo**: unidad Markdown bajo `docs/skills/`, con front-matter mínimo, enlazada en `nav`, tono profesional-directo (Principio I).
- **Entrada de catálogo**: registro con `nombre`, `enlace`, `autor`, `propósito`, `fecha de verificación`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El estudiante localiza las cinco páginas del módulo desde el índice del sitio en un tiempo razonable (métrica cualitativa; se valida por revisión visual del `nav` renderizado, no por instrumentación).
- **SC-002**: Tras leer `index.md` y `anatomia.md`, el estudiante puede describir sin ayuda la diferencia skill vs agente y al menos dos elementos de la estructura de una skill (`SKILL.md`, triggers, plantillas/assets).
- **SC-003**: El 100% de las entradas de `catalogo.md` publicadas están accesibles en la fecha de verificación indicada.
- **SC-004**: `uv run mkdocs build --strict` finaliza sin warnings tras cerrar la implementación.

## Assumptions

- La app CRUD de referencia (spec 004) existe en `examples/user-crud-modern/` y sirve como contexto de los ejemplos ilustrativos.
- Los estudiantes tienen Claude Code instalado y han completado el módulo Agentes.
- El listado del `catalogo.md` se re-verifica al menos cada 6 meses siguiendo la norma del workflow de la constitution.
- La creación real de una skill propia queda como ejercicio del estudiante y NO forma parte de este feature.
- Constitution v1.1.0 (Principio V): agente propio sigue como MUST (cubierto por spec 006), skill propia baja a SHOULD. Este feature respeta la constitution vigente sin exigir skill funcional versionada. Una spec futura podrá abordar la skill propia si el mantenedor lo prioriza.
