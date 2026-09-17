# Phase 0 · Research — Módulo "SDD con Speckit"

**Feature**: `005-sdd-speckit-module`
**Date**: 2026-09-16

Este documento consolida decisiones técnicas y editoriales necesarias para ejecutar el plan sin ambigüedades. Cada bloque tiene formato Decision / Rationale / Alternatives considered.

---

## 1. Renderizado del diagrama Mermaid

- **Decision**: usar Mermaid inline en Markdown con bloque `~~~mermaid` (o code fence estándar) y configurar `pymdownx.superfences.custom_fences` en `mkdocs.yml` para el lenguaje `mermaid`. Cargar el runtime Mermaid oficial (CDN `unpkg.com/mermaid`) vía `extra_javascript` con `mermaid.initialize({ startOnLoad: true })`.
- **Rationale**: alineado con Clarifications Q2. Texto plano, editable en PR, sin binarios, sin plugin extra (superfences ya está declarado). Compatible con `mkdocs build --strict`.
- **Alternatives considered**:
  - `mkdocs-mermaid2-plugin`: añade dependencia Python nueva; no aporta valor sobre superfences custom_fence.
  - SVG exportado: rompe editabilidad en PR y requiere pipeline de generación.

## 2. Configuración concreta del custom_fence

- **Decision**: en `mkdocs.yml`, extender la entrada actual `pymdownx.superfences` con:

  ```yaml
  - pymdownx.superfences:
      custom_fences:
        - name: mermaid
          class: mermaid
          format: !!python/name:pymdownx.superfences.fence_code_format
  ```

  Añadir bloque `extra_javascript` con el runtime Mermaid pinneado a versión conocida.
- **Rationale**: patrón oficial documentado por MkDocs Material y pymdownx. La class `mermaid` es la que el runtime detecta por defecto.
- **Alternatives considered**: dejar el bloque como `text` y post-procesar en el cliente — frágil y no idiomático.

## 3. Versión pinneada del runtime Mermaid

- **Decision**: Mermaid `11.4.0` (verificado 2026-09-16, última mayor estable). Cargar desde `https://unpkg.com/mermaid@11.4.0/dist/mermaid.min.js`. Registrar bloque "versión de referencia + fecha de verificación" en `docs/sdd/flujo.md` (la página que embebe el diagrama) según constitution 1.0.2.
- **Rationale**: fija comportamiento reproducible; permite re-verificación semestral trivial.
- **Alternatives considered**:
  - `mermaid@latest`: rompe reproducibilidad, imposible verificar semestralmente.
  - Empaquetar Mermaid localmente en `docs/assets/js/`: aumenta tamaño del repo sin beneficio para una CDN pública fiable.

## 4. Profundidad de extractos en `caso-guia.md`

- **Decision**: extractos "medianos" incrustados directamente en `caso-guia.md` (5-40 líneas cada uno, suficientes para ilustrar estructura del artefacto). Los extractos que superen 40 líneas se mueven a un anexo bajo `docs/sdd/artefactos/` y se enlazan desde `caso-guia.md`. Cada extracto conserva la escaffold real del template Speckit (encabezados y estructura de secciones) rellenada con el contenido específico del caso guía.
- **Rationale**: legibilidad de la página principal + fidelidad estructural para el alumno. 40 líneas es umbral razonable antes de que un fragmento rompa el flujo narrativo.
- **Alternatives considered**:
  - Extractos mínimos (5 líneas): pierden fidelidad; el alumno no reconoce estructura real.
  - Artefactos completos inline: página inmanejable (>1500 líneas).

## 5. Idioma de los extractos

- **Decision**: extractos rellenan la escaffold en inglés de los templates Speckit tal como llegan del proyecto (`# Feature Specification`, `## User Scenarios & Testing *(mandatory)*`, etc.) con contenido en español. Refleja exactamente lo que el alumno verá al ejecutar Speckit en su máquina.
- **Rationale**: coherencia con la realidad del alumno; no traducir la scaffold evita divergencia entre extracto y ejecución local.
- **Alternatives considered**: traducir la scaffold — genera divergencia y confunde al alumno cuando la ejecución real no la traduce.

## 6. Cross-links entre módulos

- **Decision**: enlaces relativos entre páginas del sitio (`../claude-md/index.md`, `../app-ejemplo/index.md`, etc.) usando la convención ya presente en el repo. Cada página del módulo incluye al pie una sección "Enlaces relacionados" con los cross-links exigidos por FR-004 filtrados por relevancia (no obligar los 5 enlaces en las 6 páginas).
- **Rationale**: enlaces relativos evitan hardcodear el `site_url` y sobreviven a cambios de base URL. Sección al pie mantiene la lectura principal limpia.
- **Alternatives considered**:
  - Enlaces absolutos con `site_url`: frágiles bajo cambio de dominio.
  - Enlaces embebidos en el cuerpo sin sección al pie: aumenta ruido y no garantiza cobertura.

## 7. Bloque "versión de referencia + fecha de verificación"

- **Decision**: admonition tipo `!!! info "Versión de referencia"` con dos líneas: versión de la herramienta y fecha de verificación (`YYYY-MM-DD`). Plantilla canónica en `contracts/version-block.md`. Se aplica en cualquier página que cite Claude Code, Speckit, MkDocs Material, Mermaid, Java, Spring Boot, SDKMAN, CodeGraph, RTK o Caveman.
- **Rationale**: consistente con constitution 1.0.2; admonition ya soportado sin plugin extra; formato de fecha ISO permite auditar re-verificación semestral automáticamente.
- **Alternatives considered**:
  - Nota al pie: menos visible, incumple espíritu de la norma (bloque VISIBLE).
  - Frontmatter YAML: no lo renderiza el theme por defecto.

## 8. Estructura de la tabla SDD vs vibe coding

- **Decision**: tabla Markdown con columnas `Dimensión`, `SDD`, `Vibe coding`. Filas: control, trazabilidad, coste de cambio, calidad del output, encaje con revisiones de PR, deuda técnica generada, coste inicial, curva de aprendizaje.
- **Rationale**: cubre las dimensiones exigidas por FR-007 + dos adicionales (coste inicial, curva de aprendizaje) que dan tono honesto (SDD no es gratis).
- **Alternatives considered**: prosa comparativa — menos escaneable, pierde valor de referencia rápida.

## 9. Diagrama del ciclo Speckit (Mermaid)

- **Decision**: `flowchart LR` con nodos por comando Speckit y aristas indicando obligatorio (línea sólida) vs opcional (línea discontinua). Bucle explícito `converge → specify` para representar iteración. Nodo terminal `implement` con arista opcional a `converge`.
- **Rationale**: `flowchart LR` es el formato Mermaid mejor soportado y más legible en pantalla ancha; distinción sólido/discontinuo transmite la clasificación obligatorio/opcional exigida por FR-008.
- **Alternatives considered**:
  - `stateDiagram-v2`: implica máquina de estados formal, semántica incorrecta.
  - `sequenceDiagram`: pierde la noción de pasos condicionales.

## 10. Nav de MkDocs

- **Decision**: reemplazar la entrada actual `- SDD con Speckit: sdd/index.md` por un bloque anidado con las seis páginas del módulo, en el orden `index → flujo → caso-guia → greenfield → brownfield → antipatrones`. Posición sin cambios (después de "App de ejemplo", antes de "Agentes").
- **Rationale**: orden pedagógico (concepto → flujo → aplicación práctica → escenarios extremos → errores comunes). Posición actual respeta la secuencia formativa ya establecida.
- **Alternatives considered**:
  - Antipatrones al principio: contraproducente, exige familiaridad con el flujo.
  - Caso guía antes de flujo: alumno pierde referencia estructural.

## 11. Anexos `docs/sdd/artefactos/`

- **Decision**: crear la carpeta sólo si al menos un extracto excede el umbral de 40 líneas. Nomenclatura: `docs/sdd/artefactos/<paso>-<slug>.md` (por ejemplo `plan-decisiones-tecnicas.md`). Cada anexo es una página MkDocs y se declara en `nav` como sub-entrada del módulo.
- **Rationale**: evita crear estructura vacía; mantiene nav ligera cuando no aporta.
- **Alternatives considered**: incluir siempre la carpeta — ruido innecesario.

## 12. Validación editorial del módulo

- **Decision**: dos gates automatizables + una revisión manual.
  1. `uv run mkdocs build --strict` sin warnings.
  2. `git diff --stat examples/ contracts/` vacío en el commit final (SC-006).
  3. Revisión manual del autor contra los FR y SC del spec, registrada como checklist en el PR.
- **Rationale**: cubre las tres capas exigidas (build, alcance, contenido) sin introducir tooling nuevo.
- **Alternatives considered**: linter Markdown adicional (Vale, markdownlint) — fuera de alcance de este módulo; se propone como spec futura si se decide adoptarlo.

---

**Status**: sin `NEEDS CLARIFICATION` pendientes. Listo para Phase 1.
