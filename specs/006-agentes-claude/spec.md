# Feature Specification: Módulo "Agentes de Claude Code" + agente propio

**Feature Branch**: `006-agentes-claude`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Módulo 'Agentes de Claude Code' en `docs/agentes/` (index, anatomía, memoria y modelos, alcance, catálogo, crear-uno) más agente propio `.claude/agents/spring-boot-debugger.md` orientado a diagnosticar apps Spring Boot 4 + Java 21 sobre el CRUD de ejemplo. Fuera de alcance: skills y fix definitivo del bug. Referencia constitution: Principio V."

## Clarifications

### Session 2026-09-16

- Q: Qué valor concreto debe llevar el campo `model:` en el frontmatter de `.claude/agents/spring-boot-debugger.md`? → A: Alias corto `sonnet` (portable ante rev de versiones).
- Q: El agente `spring-boot-debugger` debe declarar isolación por worktree en su frontmatter? → A: No; la capacidad se explica en `anatomia.md`, el agente edita in-place.
- Q: Qué comando exacto debe invocar el agente para ejecutar tests del CRUD? → A: `./mvnw test` (Maven wrapper del proyecto).
- Q: Cómo debe mostrarse la fecha de verificación de cada entrada de `catalogo.md`? → A: Tabla con columna `Verificado` (YYYY-MM-DD) por fila.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Estudiante entiende qué es un agente y cuándo usarlo (Priority: P1)

Un estudiante que ya ha completado el módulo CLAUDE.md abre el sitio de formación y navega al nuevo módulo "Agentes". Lee la página inicial y sale sabiendo qué es un agente de Claude Code, cuándo conviene invocarlo, y en qué se diferencia de una skill. A continuación consulta anatomía, alcance, memoria/modelos y catálogo para completar su modelo mental.

**Why this priority**: sin este bloque conceptual la formación no cumple el Principio V (definición precisa, diferencias, alcance, memoria, catálogo). Es el pilar teórico del módulo.

**Independent Test**: se navega el sitio publicado localmente (`uv run mkdocs serve`) y se comprueba que las cinco páginas conceptuales (`index`, `anatomia`, `memoria-modelos`, `alcance`, `catalogo`) existen, aparecen en el `nav`, contienen los apartados exigidos y se renderizan sin warnings con `mkdocs build --strict`.

**Acceptance Scenarios**:

1. **Given** el sitio construido, **When** el usuario abre `Agentes → Introducción`, **Then** encuentra definición de agente, casos de uso típicos y comparación explícita con skill.
2. **Given** el sitio construido, **When** el usuario abre `Agentes → Anatomía`, **Then** encuentra la estructura del archivo del agente (frontmatter `name`, `description`, `model`, `tools`), el prompt del sistema, cómo se declaran herramientas y qué significa la isolación por worktree.
3. **Given** el sitio construido, **When** el usuario abre `Agentes → Memoria y modelos`, **Then** encuentra los tipos de memoria disponibles y una guía comparativa Opus vs Sonnet vs Haiku con criterios de coste y latencia.
4. **Given** el sitio construido, **When** el usuario abre `Agentes → Alcance`, **Then** encuentra la diferencia entre agentes de usuario (`~/.claude/agents/`) y de proyecto (`.claude/agents/`), consecuencias operativas y política de versionado en git.
5. **Given** el sitio construido, **When** el usuario abre `Agentes → Catálogo`, **Then** encuentra al menos 5 entradas curadas con enlace, autor y para qué sirve, cada una verificada como existente en el momento de redacción.

---

### User Story 2 - Estudiante crea su propio agente siguiendo la guía y usa el agente propio del repo (Priority: P1)

El estudiante entra en `Agentes → Crear uno` y sigue el paso a paso para construir un agente propio. Como referencia usa el agente `spring-boot-debugger` incluido en `.claude/agents/`, lo invoca contra la app CRUD de ejemplo (con su bug intencionado) y observa cómo el agente localiza el stacktrace, propone un test de reproducción y sugiere un diff mínimo.

**Why this priority**: Principio V exige al menos un agente propio funcional aplicado a la app de ejemplo. Sin este flujo práctico, el módulo queda teórico.

**Independent Test**: se lanza el agente `spring-boot-debugger` en el repo sobre la app CRUD, se comprueba que responde con la secuencia esperada (localización → test de reproducción → diff propuesto → ejecución de tests) y que la página `crear-uno.md` documenta cada paso con la misma spec del agente construido.

**Acceptance Scenarios**:

1. **Given** el repo clonado, **When** se lista `.claude/agents/`, **Then** aparece `spring-boot-debugger.md` con frontmatter válido (`name`, `description`, `model: sonnet`, `tools: Read, Grep, Glob, Bash, Edit`).
2. **Given** el agente instalado y la app CRUD con el bug de NPE, **When** el estudiante invoca al agente sobre el error, **Then** el agente localiza el stacktrace, propone un test que reproduce el fallo, sugiere un diff mínimo y ejecuta la suite de tests antes de dar por cerrada su intervención.
3. **Given** la página `crear-uno.md`, **When** el estudiante la lee, **Then** encuentra un paso a paso alineado con la spec del agente construido y una transcripción reducida de la invocación real sobre el bug del CRUD.

---

### Edge Cases

- Un enlace del `catalogo.md` deja de existir tras la publicación: la página MUST indicar la fecha de verificación de cada entrada para poder retirarla en la revisión semestral (constitution, re-verificación semestral).
- El estudiante ejecuta el agente sin haber configurado el proyecto Java: el prompt del sistema del agente MUST detectar la ausencia de compilación previa y pedirla antes de proponer cambios.
- El bug intencionado del CRUD ya está resuelto en la rama local del estudiante: el agente MUST reconocer que no hay reproducción y no proponer diff.
- Colisión de nombres entre un agente de usuario y uno de proyecto: la página `alcance.md` MUST explicar cuál prevalece y cómo diagnosticarlo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sitio MkDocs MUST incluir un módulo "Agentes" bajo `docs/agentes/` con seis páginas: `index.md`, `anatomia.md`, `memoria-modelos.md`, `alcance.md`, `catalogo.md`, `crear-uno.md`.
- **FR-002**: `mkdocs.yml` MUST enlazar el nuevo módulo en la sección `nav` con títulos en español coherentes con el resto de la formación.
- **FR-003**: `index.md` MUST responder qué es un agente, cuándo usarlo y en qué se diferencia de una skill, con al menos un ejemplo comparativo agente-vs-skill.
- **FR-004**: `anatomia.md` MUST documentar el frontmatter (`name`, `description`, `model`, `tools`), la sección de prompt del sistema, el listado de herramientas disponibles y la isolación por worktree (concepto y snippet ilustrativo; NO se aplica al agente `spring-boot-debugger`).
- **FR-005**: `memoria-modelos.md` MUST cubrir los tipos de memoria aplicables al agente y una guía comparativa entre modelos Opus, Sonnet y Haiku con criterios de coste y latencia.
- **FR-006**: `alcance.md` MUST distinguir agentes de usuario (`~/.claude/agents/`) y de proyecto (`.claude/agents/`), enumerar consecuencias (versionado, compartición, precedencia) y la política de git para el repo.
- **FR-007**: `catalogo.md` MUST listar entre 5 y 8 repositorios de agentes reutilizables en formato tabla con columnas `Nombre`, `Autor`, `Propósito`, `Enlace`, `Verificado` (fecha ISO `YYYY-MM-DD` por fila). Cada entrada MUST haberse verificado accesible antes de publicarse.
- **FR-008**: `crear-uno.md` MUST contener un paso a paso reproducible para crear un agente propio, usando como caso guía el agente `spring-boot-debugger` construido en este mismo módulo, e incluir una transcripción reducida de su invocación real sobre el bug del CRUD.
- **FR-009**: El repo MUST incluir el archivo `.claude/agents/spring-boot-debugger.md` versionado en git, con frontmatter (`name`, `description` (una línea, ≤160 caracteres), `model: sonnet` — alias corto, no ID de versión concreto, `tools: Read, Grep, Glob, Bash, Edit`) y un prompt del sistema que instruya al agente a: (1) localizar el stacktrace del error, (2) proponer y ejecutar un test que reproduzca el fallo, (3) proponer un diff mínimo, (4) ejecutar la suite de tests con `./mvnw test` antes de dar por cerrada su intervención.
- **FR-010**: El agente `spring-boot-debugger` MUST estar operativo al ser invocado desde Claude Code en este repo, sin dependencias externas al toolchain declarado (JDK/Maven vía SDKMAN).
- **FR-011**: La documentación MUST incluir al menos un ejemplo de uso real del agente sobre el bug de NPE en la creación de usuario del CRUD, con una transcripción reducida (entre 15 y 40 líneas) presente en `crear-uno.md`.
- **FR-012**: El módulo MUST superar `uv run mkdocs build --strict` sin warnings.
- **FR-013**: El módulo NO debe incluir contenido sobre skills ni el fix definitivo del bug del CRUD; ambos quedan explícitamente fuera de alcance.

### Key Entities

- **Página de módulo**: unidad Markdown bajo `docs/agentes/` con front-matter mínimo, enlazada en `nav`, escrita en tono profesional y directo (Principio I).
- **Agente propio (`spring-boot-debugger`)**: archivo Markdown con frontmatter y prompt del sistema, versionado en `.claude/agents/`, invocable por Claude Code.
- **Entrada de catálogo**: registro con `nombre`, `enlace`, `autor`, `propósito`, `fecha de verificación`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El estudiante localiza en menos de 2 minutos las seis páginas del módulo desde el índice del sitio.
- **SC-002**: Tras leer `index.md` y `anatomia.md`, el estudiante puede describir sin ayuda al menos cuatro campos del frontmatter de un agente y la diferencia agente-vs-skill.
- **SC-003**: El 100% de las entradas de `catalogo.md` publicadas están accesibles en la fecha de verificación indicada.
- **SC-004**: `uv run mkdocs build --strict` finaliza sin warnings tras cerrar la implementación.
- **SC-005**: En una sesión de prueba, el agente `spring-boot-debugger` completa el ciclo (localizar stacktrace → test de reproducción → diff propuesto → tests ejecutados) sobre el bug del CRUD en una sola pasada, sin necesidad de prompts extra del estudiante.

## Assumptions

- La app CRUD de referencia (spec 004) ya existe en `examples/` con el bug de NPE intencionado y una suite de tests mínima.
- Los estudiantes tienen ya instalado Claude Code y han completado el módulo CLAUDE.md.
- El toolchain Java (JDK 21 + Maven) se gestiona vía SDKMAN según constitution, Principio III.
- Los modelos referenciados (Opus, Sonnet, Haiku) siguen disponibles en Claude Code en la fecha de publicación; la página `memoria-modelos.md` incluye fecha de verificación por la norma semestral de la constitution.
- El listado del `catalogo.md` se re-verifica al menos cada 6 meses siguiendo la misma norma que las páginas de `docs/setup/`.
- El fix del bug del CRUD queda como ejercicio guiado en otro módulo; este módulo sólo lo usa como caso de demostración del agente.
- La métrica "tiempo del estudiante para reproducir `crear-uno.md`" queda como observación post-piloto (encuesta a asistentes), no como criterio buildable de este feature.
