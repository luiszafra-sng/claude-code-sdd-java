# Implementation Plan: Módulo "SDD con Speckit"

**Branch**: `005-sdd-speckit-module` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-sdd-speckit-module/spec.md`

## Summary

Módulo formativo publicado bajo `docs/sdd/` con seis páginas (`index`, `flujo`, `caso-guia`, `greenfield`, `brownfield`, `antipatrones`) que enseñan Spec-Driven Development con Speckit aplicado a Java. Caso guía narrativo (búsqueda + filtrado + paginación en `GET /users`) documentado end-to-end como extractos ilustrativos; el alumno reproduce el ciclo en su máquina sobre su copia local de `examples/user-crud-modern/`. La app del repo formativo NO se modifica. Diagrama del ciclo en Mermaid inline. Enfoque técnico: contenido Markdown puro con extensiones MkDocs Material ya presentes + `superfences.custom_fence` para Mermaid + nav actualizada.

## Technical Context

**Language/Version**: Markdown (CommonMark + extensiones MkDocs Material) + YAML (config MkDocs).

**Primary Dependencies**: MkDocs Material (theme), `pymdownx.superfences`, `pymdownx.details`, `admonition`, `attr_list`, `md_in_html`, `pymdownx.tabbed` (ya declaradas en `mkdocs.yml`). Mermaid vía `superfences.custom_fence` (a añadir).

**Storage**: N/A (contenido versionado en git).

**Testing**: `uv run mkdocs build --strict` (gate de publicación). Sin tests unitarios de código: los "tests" son la construcción sin warnings y la revisión editorial contra los FR/SC del spec.

**Target Platform**: sitio estático publicado en GitLab Pages (base URL `/claude-code-sdd-java/`), consumido por navegador moderno con JS habilitado (necesario para Mermaid).

**Project Type**: documentación estática (MkDocs).

**Performance Goals**: N/A a nivel runtime. Build MkDocs completo en <30 s en CI (baseline actual del repo).

**Constraints**:

- Cero warnings en `mkdocs build --strict`.
- Sin CSS en línea; tokens visuales sólo en `docs/stylesheets/extra.css`.
- Cada página que cite versiones de herramientas MUST incluir bloque "versión de referencia + fecha de verificación" (constitution 1.0.2).
- App `examples/user-crud-modern/` y contract `contracts/users-api.yaml` intactos (git diff limpio en esas rutas atribuible al módulo).
- Registro profesional-directo (constitution Principio I).

**Scale/Scope**: 6 páginas Markdown nuevas bajo `docs/sdd/`, 1 diagrama Mermaid, 1 tabla comparativa SDD vs vibe coding, ~10 extractos de artefactos Speckit (spec/plan/tasks/contract/quickstart), actualización de nav en `mkdocs.yml`, ajuste `superfences.custom_fence` para Mermaid.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / Norma | Gate | Estado | Nota |
|---|---|---|---|
| I. Doc como producto (tono profesional-directo) | Registro sin argot ni caricaturas | PASS | Redacción alineada con Principio I; ejemplos "pobre" mantienen tono profesional. |
| I. Tokens visuales centralizados | Sin CSS inline; cambios en `extra.css` | PASS | Plan no introduce CSS inline; sólo se toca `extra.css` si un ajuste visual lo requiere. |
| II. Java-céntrico moderno + legacy | Ejemplos cubren perfil moderno; diferencias legacy documentadas | PASS | Caso guía sobre CRUD moderno; `brownfield.md` cubre legacy con guía separada. |
| III. Toolchain reproducible | Sin instrucciones que asuman JDK/Maven preinstalados | N/A | Módulo no da instrucciones de instalación; enlaza a "Setup del entorno". |
| III. Versión + fecha de verificación semestral | Bloque visible en cada página que cita versiones | PASS | FR-005 obliga bloque; plantilla en `contracts/version-block.md`. |
| IV. SDD por defecto | Este módulo atraviesa el ciclo Speckit | PASS | `/speckit-specify` + `/speckit-clarify` completados; plan actual. |
| IV. Greenfield vs brownfield cubiertos | Páginas explícitas | PASS | `greenfield.md` + `brownfield.md` en FR-011/012. |
| V. Agentes y skills | Documentar sin implementar (aquí) | PASS | Este módulo sólo referencia; implementación real vive en módulos "Agentes" y "Skills". |
| VI. Publicación GitLab Pages | `mkdocs build --strict` sin warnings | PASS | SC-003. |

**Resultado**: sin violaciones. Complexity Tracking vacío.

## Project Structure

### Documentation (this feature)

```text
specs/005-sdd-speckit-module/
├── plan.md              # Este fichero
├── spec.md              # Spec con Clarifications
├── research.md          # Phase 0
├── data-model.md        # Phase 1 (entidades documentales)
├── quickstart.md        # Phase 1 (validación del módulo publicado)
├── contracts/           # Phase 1 (contratos de contenido)
│   ├── page-template.md
│   └── version-block.md
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 (creado por /speckit-tasks)
```

### Source Code (repository root)

```text
docs/
├── sdd/                     # ← Contenido nuevo del módulo
│   ├── index.md             # Qué es SDD + tabla SDD vs vibe coding + encaje Java empresarial
│   ├── flujo.md             # Pasos Speckit (obligatorios/opcionales) + diagrama Mermaid
│   ├── caso-guia.md         # Recorrido end-to-end búsqueda+paginación con extractos
│   ├── greenfield.md        # Speckit en proyecto Java nuevo
│   ├── brownfield.md        # Speckit sobre proyecto Java existente
│   ├── antipatrones.md      # Antipatrones con síntoma/causa/contramedida
│   ├── _snippets/           # Snippets reutilizables por pymdownx.snippets
│   │   ├── version-block.md
│   │   └── enlaces-relacionados.md
│   └── artefactos/          # Anexos con extractos largos (sólo si un extracto excede umbral)
├── assets/
│   └── js/
│       └── mermaid-init.js  # Init del runtime Mermaid (referenciado desde mkdocs.yml)
└── stylesheets/
    └── extra.css            # Ajustes visuales del diagrama si se necesitan

mkdocs.yml                   # Nav ampliada bajo "SDD con Speckit"; superfences custom_fence para mermaid; extra_javascript
examples/user-crud-modern/   # NO se modifica
contracts/users-api.yaml     # NO se modifica
```

**Structure Decision**: contenido puramente documental bajo `docs/sdd/`. Sin `src/` ni `tests/` propios (los "tests" son `mkdocs build --strict` + revisión editorial). Anexos `docs/sdd/artefactos/` opcionales según profundidad de extractos (decisión en `research.md`). Snippets bajo `docs/sdd/_snippets/` reutilizados por `pymdownx.snippets`. Diagrama del ciclo Speckit exclusivamente en Mermaid inline (research §1 descarta SVG). App de ejemplo y contract API intactos.

## Constitution Check — Post-Design (2026-09-16)

Re-evaluación tras `research.md`, `data-model.md`, `contracts/`, `quickstart.md`:

- Decisión de cargar Mermaid desde CDN (research §3): PASS. Versión pinneada (`11.4.0`), verificable semestralmente, sin binarios en el repo. No degrada `--strict` (JS externo se carga en cliente, MkDocs no lo valida). Compatible con Principio III (reproducibilidad).
- `superfences.custom_fence` para Mermaid: PASS. Ajuste local a `mkdocs.yml`, sin dependencia Python nueva; no rompe Principio VI.
- Anexos `docs/sdd/artefactos/` opcionales (research §11): PASS. No introducen contenido no solicitado; sólo se crean si un extracto excede umbral.
- Bloque de versión canónico (contracts/version-block.md): PASS. Refleja literalmente la norma de re-verificación semestral (constitution 1.0.2).

**Resultado post-diseño**: sin violaciones. Complexity Tracking vacío.

## Complexity Tracking

Sin violaciones de la constitution. Sección vacía intencionalmente.
