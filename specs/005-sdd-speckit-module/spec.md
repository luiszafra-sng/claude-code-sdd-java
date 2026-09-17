# Feature Specification: Módulo "SDD con Speckit"

**Feature Branch**: `005-sdd-speckit-module`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Crear el módulo 'SDD con Speckit' bajo `docs/sdd/`. Contenido puramente formativo: explicar qué es SDD, el ciclo Speckit paso a paso, cómo aplicarlo en greenfield y brownfield, y antipatrones. El caso guía es un ejercicio ilustrativo (añadir búsqueda + filtrado + paginación al `GET /users` del CRUD moderno) que se documenta en detalle para que el alumno lo ejecute en su máquina. No se modifica la app `examples/user-crud-modern/`, ni sus tests, ni el contract OpenAPI, ni se genera código real como parte de este módulo."

## Clarifications

### Session 2026-09-16

- Q: ¿Dónde deben vivir los artefactos Speckit del caso guía (`spec.md`, `plan.md`, `tasks.md`, `contracts/`)? → A: Ni en `specs/` del repo formativo ni en `examples/user-crud-modern/`. El caso guía es material didáctico, no un ciclo Speckit ejecutable dentro del repo. Los artefactos se muestran como extractos ilustrativos embebidos en `docs/sdd/caso-guia.md` (y anexos en `docs/sdd/artefactos/` si conviene por longitud). El alumno reproduce el ciclo en su propia máquina siguiendo las instrucciones publicadas. La app `examples/user-crud-modern/` no se modifica; el contract, los tests y el bug NPE siguen intactos.
- Q: ¿Qué formato para el diagrama del ciclo Speckit (FR-003)? → A: Mermaid inline en Markdown, renderizado en cliente por MkDocs Material vía `pymdownx.superfences` (configurar `custom_fence` para mermaid si aún no lo está). Sin binarios en el repo, editable en PR como texto plano, sin dependencia extra que rompa `--strict`.
- Q: ¿Cómo se presentan los defaults del caso guía (AND, case-insensitive, `createdAt,desc`, size 20/max 100, ignorar unknown params)? → A: Como recomendación oficial del módulo con justificación explícita, acompañada de las alternativas rechazadas y su razonamiento. Enseña juicio SDD, no sólo mecánica. Alumno reproduce resultado canónico y puede divergir con criterio en su `/speckit-clarify` local.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Recorrer el ciclo Speckit end-to-end con un caso realista (Priority: P1)

Un profesional que sigue la formación abre el módulo "SDD con Speckit", entiende qué es Spec-Driven Development y en qué se diferencia de "vibe coding", recorre los pasos del ciclo (`constitution` → `specify` → `clarify` → `plan` → `tasks` → `analyze` → `checklist` → `implement` → `converge`) sabiendo cuáles son obligatorios y cuáles opcionales, y sigue paso a paso el caso guía documentado (añadir búsqueda + filtrado + paginación al `GET /users` del CRUD moderno) leyendo los extractos ilustrativos de cada artefacto.

**Why this priority**: Es el corazón del módulo. Sin recorrido end-to-end sobre un caso representativo, el alumno no interioriza el flujo ni justifica su valor.

**Independent Test**: Un lector con la formación abierta puede leer `docs/sdd/index.md` + `docs/sdd/flujo.md` + `docs/sdd/caso-guia.md` y describir con sus palabras qué produce cada paso Speckit y por qué se aplica.

**Acceptance Scenarios**:

1. **Given** el sitio publicado, **When** el alumno navega a "SDD con Speckit", **Then** encuentra las páginas `index.md`, `flujo.md`, `caso-guia.md`, `greenfield.md`, `brownfield.md`, `antipatrones.md` en la nav y una explicación clara de la diferencia entre SDD y vibe coding.
2. **Given** `docs/sdd/flujo.md`, **When** el alumno consulta cada paso, **Then** ve qué produce, qué inputs necesita y un extracto ilustrativo del artefacto aplicado al caso guía.
3. **Given** `docs/sdd/caso-guia.md`, **When** el alumno sigue el recorrido, **Then** puede copiar los prompts de cada paso y las Clarifications propuestas con su justificación.

---

### User Story 2 - Reproducir el ciclo en su propia máquina (Priority: P1)

Un profesional que ha leído el módulo abre una copia local de la app `examples/user-crud-modern/` (o cualquier proyecto Java equivalente), instala Speckit siguiendo la guía y ejecuta el ciclo completo del caso guía en su entorno: lanza `/speckit-specify`, `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement` y comprueba los artefactos generados. La ejecución sucede en su máquina, no en el repositorio formativo.

**Why this priority**: SDD sólo se interioriza practicándolo. El módulo debe darle todo lo necesario para reproducirlo sin ambigüedad.

**Independent Test**: Un lector puede seguir las instrucciones de `docs/sdd/caso-guia.md` sobre su propia copia de la app y llegar a artefactos Speckit consistentes con los extractos publicados.

**Acceptance Scenarios**:

1. **Given** el módulo publicado, **When** el alumno lee los prompts documentados, **Then** puede copiarlos y pegarlos en su terminal Claude Code sin ediciones estructurales.
2. **Given** el alumno ha ejecutado el ciclo en su máquina, **When** compara sus artefactos con los extractos publicados, **Then** encuentra la misma estructura (secciones, tipo de contenido, orden de pasos) aunque el detalle varíe.
3. **Given** el módulo publicado, **When** el alumno consulta cómo verificar el resultado, **Then** encuentra los comandos exactos (`./mvnw test`, `curl` con distintos filtros) y la respuesta esperada, todo en formato copiable.

---

### User Story 3 - Aplicar SDD en greenfield y brownfield con Java (Priority: P2)

Un profesional que arranca un proyecto Java nuevo (o que hereda un legacy) tiene una guía concreta de cómo introducir Speckit: qué meter en `CLAUDE.md`, cómo redactar la constitution mínima, cuándo crear agentes específicos, orden recomendado de specs (setup → dominio central → integraciones → operaciones), y en brownfield: cómo indexar con CodeGraph, cómo escribir una constitution que codifique lo que ya es cierto y cómo escribir la primera spec sobre código heredado.

**Why this priority**: Sin esta guía el flujo se percibe sólo aplicable a proyectos nuevos. La constitution (Principio IV) exige cubrir explícitamente ambos escenarios.

**Independent Test**: Un lector puede leer `docs/sdd/greenfield.md` y `docs/sdd/brownfield.md` y extraer una checklist accionable para su próximo proyecto Java.

**Acceptance Scenarios**:

1. **Given** `greenfield.md`, **When** el alumno lo lee, **Then** encuentra un orden recomendado de specs y ejemplos de contenido inicial para `CLAUDE.md` y constitution.
2. **Given** `brownfield.md`, **When** el alumno lo lee, **Then** encuentra los pasos concretos para introducir Speckit sobre un proyecto existente, usando `user-crud-modern` como referencia narrativa (la feature de búsqueda es una adición brownfield sobre un CRUD ya existente).

---

### User Story 4 - Reconocer y evitar antipatrones frecuentes (Priority: P3)

Un profesional que ya ha usado Speckit una vez consulta `docs/sdd/antipatrones.md` para reconocer y evitar errores típicos (specs vagas, tasks sin criterio de aceptación, saltarse el plan, `/speckit-clarify` con preguntas cosméticas, `/speckit-analyze` ignorado, `/speckit-converge` como coartada, etc.).

**Why this priority**: Refuerzo para practicantes. Aporta valor cuando el flujo básico ya está interiorizado.

**Independent Test**: El lector puede identificar en el listado de antipatrones al menos uno que ha cometido antes y ver la contramedida propuesta.

**Acceptance Scenarios**:

1. **Given** `antipatrones.md`, **When** el alumno lo consulta, **Then** cada antipatrón incluye síntoma, causa y contramedida concreta.

---

### Edge Cases

- **Divergencia entre extractos publicados y ejecución real del alumno**: los extractos son ilustrativos; el módulo lo declara explícitamente y explica que Claude puede generar variaciones estructurales equivalentes.
- **Alumno sin Speckit instalado**: `docs/sdd/index.md` o `flujo.md` MUST enlazar al módulo "Setup del entorno" para la instalación.
- **Alumno sin app clonada**: `caso-guia.md` MUST enlazar al módulo "App de ejemplo" para la puesta en marcha.
- **Cambios upstream en Speckit**: los extractos deben poder actualizarse sin tocar código real (viven en Markdown).

## Requirements *(mandatory)*

### Functional Requirements

**Estructura y publicación**

- **FR-001**: El módulo MUST publicarse bajo `docs/sdd/` con las páginas `index.md`, `flujo.md`, `caso-guia.md`, `greenfield.md`, `brownfield.md`, `antipatrones.md` y aparecer en `mkdocs.yml` bajo una entrada de nav "SDD con Speckit".
- **FR-002**: `uv run mkdocs build --strict` MUST pasar sin warnings tras las adiciones.
- **FR-003**: El módulo MUST incluir un diagrama del ciclo Speckit en Mermaid inline dentro del Markdown correspondiente (renderizado en cliente por MkDocs Material vía `pymdownx.superfences`), sin CSS en línea; cualquier ajuste visual MUST vivir en `docs/stylesheets/extra.css`. Si `mkdocs.yml` no tiene aún el `custom_fence` para `mermaid`, MUST añadirse como parte de este módulo.
- **FR-004**: El módulo MUST incluir enlaces cruzados a los módulos "CLAUDE.md", "App de ejemplo", "Agentes", "Skills" y "Setup del entorno".
- **FR-005**: Cada página que cite una versión de herramienta MUST incluir un bloque visible con "versión de referencia + fecha de verificación" conforme a la constitution 1.0.2.
- **FR-006**: El contenido MUST respetar el registro profesional y directo del Principio I (sin argot ni caricaturas).

**Contenido por página**

- **FR-007**: `index.md` MUST explicar qué es Spec-Driven Development, incluir una tabla comparativa SDD vs vibe coding con al menos las dimensiones control, trazabilidad, coste de cambio, calidad del output, encaje con revisiones de PR y deuda técnica generada, y motivar por qué SDD encaja en Java empresarial (contratos REST, tests aguas arriba, revisiones humanas).
- **FR-007b**: `index.md` MUST incluir una sección "Cuándo NO usar SDD" que enumere escenarios donde el flujo introduce más fricción que valor (spikes exploratorios, hotfixes urgentes, prototipos desechables) y ofrezca criterios de decisión.
- **FR-008**: `flujo.md` MUST listar los pasos Speckit en orden marcando obligatorios (`specify`, `plan`, `tasks`, `implement`) vs opcionales (`constitution`, `clarify`, `analyze`, `checklist`, `converge`); para cada paso MUST documentar qué produce, qué inputs necesita y un extracto ilustrativo aplicado al caso guía.
- **FR-009**: `caso-guia.md` MUST contener el recorrido narrativo end-to-end del caso guía con: prompt inicial copiable, preguntas de `/speckit-clarify` con respuesta recomendada oficial + justificación + alternativas rechazadas (sensibilidad a mayúsculas en `nameContains`, semántica AND/OR de los filtros, orden por defecto, tamaño máximo de página, shape del envelope, política de query params desconocidos, comportamiento con `size=0` o `page` negativo), extracto de `plan.md` con las decisiones técnicas, extracto de `tasks.md` (5–8 tareas), extracto del contract actualizado (nuevos query params + schema `PagedUserResponse`), salida esperada de `/speckit-implement` y comandos `curl` de verificación.
- **FR-010**: `caso-guia.md` MUST declarar explícitamente que los artefactos publicados son ilustrativos y que el alumno los reproduce ejecutando Speckit en su propia máquina sobre su copia local de `examples/user-crud-modern/` (u otro proyecto Java equivalente).
- **FR-011**: `greenfield.md` MUST describir cómo arrancar un proyecto Java nuevo con Speckit: contenido inicial de `CLAUDE.md`, constitution mínima, cuándo crear agentes, orden recomendado de specs (setup → dominio central → integraciones → operaciones).
- **FR-012**: `brownfield.md` MUST describir cómo introducir Speckit en un proyecto Java existente (moderno y legacy), usando `user-crud-modern` como referencia narrativa: indexar con CodeGraph, redactar `CLAUDE.md` reflejando convenciones actuales, escribir una constitution descriptiva (no aspiracional), cuándo crear un agente por dominio del legacy, cómo escribir la primera spec sobre código heredado.
- **FR-013**: `antipatrones.md` MUST cubrir al menos los antipatrones listados (specs vagas, tasks sin AC, saltarse el plan, editar código sin spec, `/speckit-clarify` cosmético, `plan.md` que dicta código, `/speckit-analyze` ignorado, `/speckit-converge` como coartada, prompts con solución preescrita, tests escritos post-implement) con síntoma, causa y contramedida por cada uno.

**Restricciones globales**

- **FR-014**: La app `examples/user-crud-modern/` NO se modifica en este módulo: ni código, ni tests, ni `contracts/users-api.yaml`, ni `docs/app-ejemplo/index.md`, ni el bug NPE del `POST /users`.
- **FR-015**: Este módulo NO genera artefactos Speckit ejecutables sobre la app de ejemplo dentro del repositorio formativo; los artefactos aparecen sólo como extractos ilustrativos en las páginas del módulo (y, si conviene por longitud, en anexos bajo `docs/sdd/artefactos/`).

### Key Entities *(include if feature involves data)*

- **Página del módulo**: unidad de contenido publicable bajo `docs/sdd/`. Atributos: título, secciones obligatorias según FR, enlaces cruzados, bloque de versión + fecha (si aplica).
- **Extracto ilustrativo de artefacto Speckit**: fragmento de `spec.md`, `plan.md`, `tasks.md`, `contract` u otro artefacto del caso guía, embebido en la documentación como bloque de código Markdown. No se ejecuta, no vive bajo `specs/` del repo formativo, no altera la app de ejemplo.
- **Caso guía**: ejercicio narrado end-to-end sobre búsqueda + filtrado + paginación en `GET /users`. Sirve de hilo conductor para ilustrar cada paso del ciclo Speckit.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un alumno que no conoce Speckit puede recorrer el módulo completo (`index` → `flujo` → `caso-guia`) y describir con sus palabras qué produce cada paso en menos de 45 minutos.
- **SC-002**: Un alumno con Claude Code y Speckit instalados puede reproducir el ciclo del caso guía sobre su propia copia de la app siguiendo únicamente lo publicado, sin necesitar apoyo externo, en menos de 90 minutos.
- **SC-003**: `uv run mkdocs build --strict` produce cero warnings sobre las páginas nuevas del módulo.
- **SC-004**: El 100 % de las páginas del módulo que citan versiones de herramientas externas incluyen bloque "versión de referencia + fecha de verificación" con fecha ≤ 6 meses en el momento del merge.
- **SC-005**: Al menos un alumno de prueba identifica correctamente, tras leer `antipatrones.md`, un antipatrón que ha cometido antes y la contramedida propuesta.
- **SC-006**: La app `examples/user-crud-modern/` no presenta ningún cambio (git diff limpio) atribuible a este módulo.

## Assumptions

- El módulo es pedagógico: documenta el flujo Speckit y un caso guía para que el alumno lo ejecute en su máquina. No implementa la feature de búsqueda + paginación en la app ni genera artefactos ejecutables en el repositorio formativo.
- Los extractos publicados en `docs/sdd/` son ilustrativos; el alumno puede obtener variaciones estructuralmente equivalentes al ejecutar Speckit en su entorno.
- El alumno tiene (o instala siguiendo el módulo "Setup del entorno") Claude Code, Speckit, JDK/Maven vía SDKMAN y una copia local de `examples/user-crud-modern/`. Si el alumno prefiere aplicar el caso guía sobre otro proyecto, este MUST cumplir el mínimo: Spring Boot 3 o 4 con Java 17+, endpoint REST tipo `GET /users` (o equivalente) que devuelva una colección paginable, persistencia relacional accesible por Spring Data (JPA/H2/PostgreSQL) y build Maven o Gradle reproducible. Fuera de ese mínimo, los extractos publicados dejan de ser referencia estructural fiable.
- Semántica por defecto entre filtros propuesta en el caso guía: **AND**; `nameContains` **case-insensitive**; orden por defecto `createdAt,desc`; tamaño de página por defecto `20`, máximo `100`; query params desconocidos **ignorados**. Estos valores se documentan como propuesta razonable que el alumno confirma o modifica al ejecutar `/speckit-clarify` en su máquina.
- Los agentes y skills sugeridos en `greenfield.md` y `brownfield.md` NO se implementan aquí; sus implementaciones reales viven en los módulos "Agentes" y "Skills".
- Autenticación, autorización, rate limiting, exportación y notificaciones quedan fuera de alcance.
- La constitution vigente (1.0.2) no cambia con este módulo; sólo se referencia.
