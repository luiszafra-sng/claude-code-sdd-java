# Implementation Plan: Módulo "CLAUDE.md: usuario y proyecto"

**Branch**: `003-claude-md` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-claude-md/spec.md`

## Summary

Publicar el módulo "CLAUDE.md" bajo `docs/claude-md/` con cinco páginas
Markdown (`index.md`, `usuario.md`, `proyecto.md`, `buenas-practicas.md`,
`antipatrones.md`), incorporar un `CLAUDE.md` vivo en la raíz del
repositorio como cuarto snippet, y dejar el módulo cruzado con Setup
(spec 002) y con el futuro SDD (spec 5). Registro profesional-directo
(constitution 1.0.2 Principio I). Sin dependencias nuevas.

Decisiones clave (Clarifications 2026-09-16):
- Precedencia entre capas: ambas se componen; **proyecto gana** ante
  contradicción.
- `CLAUDE.md` vivo en la raíz obligatorio; enlazado desde `proyecto.md`.
- Comparativa "Antes / Después / Qué cambió" con H3 canónicos y ≥3
  diferencias explicadas.
- Snippet legacy = Spring Boot 2.7 + Java 8 (`javax.*`, Maven, sin
  features modernas de JVM).
- Longitud recomendada: 200 líneas útiles como techo orientativo, 500
  líneas totales como aviso duro.

## Technical Context

**Language/Version**: Markdown (CommonMark + PyMdown Extensions) sobre
MkDocs Material.

**Primary Dependencies**: heredadas de spec 001 (`mkdocs==1.6.1`,
`mkdocs-material==9.7.7`, `pymdown-extensions==12.0.1`). Sin dependencias
nuevas.

**Storage**: N/A (sitio estático + un archivo `CLAUDE.md` en raíz).

**Testing**: sin suite de código. Verificación por:
- `uv run mkdocs build --strict`.
- Auditorías `grep` sobre estructura fija de páginas.
- Revisión manual de tono y comparativa antes/después.
- Cronómetros manuales (SC-001, SC-002, SC-006) con muestra reducida
  admitida como soft-gate.

**Target Platform**: sitio estático local; publicación futura vía spec
8.

**Project Type**: docs-only + archivo de configuración de Claude Code
(`CLAUDE.md` en raíz, texto plano Markdown).

**Performance Goals**: build `--strict` sigue < 30 s. Runtime irrelevante.

**Constraints**:
- Registro profesional-directo (constitution 1.0.2 Principio I).
- Bash canónica heredada de spec 002 (afecta si algún ejemplo incluye
  comandos shell — poco frecuente en este módulo).
- `--strict` sin warnings.
- No introducir dependencias MkDocs adicionales.
- Estructura fija por página (índice → usuario → proyecto → buenas
  prácticas → antipatrones).

**Scale/Scope**: 5 páginas Markdown + 1 archivo `CLAUDE.md` en raíz.
Estimación ≤ 1 200 líneas totales (páginas del sitio) + ~ 150 líneas del
`CLAUDE.md` vivo (por debajo del techo orientativo de 200 líneas útiles
que el propio módulo recomienda — coherencia interna).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution 1.0.2 vigente.

| Principio | Aplica | Estado | Notas |
|-----------|--------|--------|-------|
| I. Documentación como Producto | Sí | PASS | Tono profesional-directo; tokens visuales heredados de spec 001; estructura homogénea por página. |
| II. Java-Céntrico, Doble Tipología | Sí | PASS | FR-004 exige dos snippets: Spring Boot 4 + Java 21 (moderno) y Spring Boot 2.7 + Java 8 (legacy). Cubre el mandato de doble tipología. |
| III. Toolchain Reproducible vía SDKMAN | Sí (indirecto) | PASS | Los snippets referencian SDKMAN + Liberica en las convenciones del proyecto Java; el módulo no lo re-documenta (cubierto por spec 002). |
| IV. SDD por defecto | Sí | PASS | Este propio ciclo (specify → clarify → plan → tasks → implement) valida el principio. |
| V. Agentes / Skills | No | N/A | Fuera de alcance. Diferido a specs 6 y 7. |
| VI. Publicación automatizada GitLab Pages | Sí | PASS-con-nota | CI/CD diferido a spec 8. `--strict` sigue exigido. |

**Norma operativa "Re-verificación semestral"** (Development & Publishing
Workflow, constitution 1.0.2): no aplica directamente porque este
módulo no declara versiones de herramientas externas más allá de los
snippets, que llevan sello `Redactado en 2026-09` (FR-014). Si en el
futuro el módulo pasa a documentar comportamiento observado de Claude
Code sobre precedencia u otras funciones específicas de versión, se
añadirá el bloque "Verificado el …" y se sujeta a la política.

Complexity Tracking: sin violaciones.

**Post-Design re-check (después de Phase 1)**: PASS mantenido.
`research.md`, `data-model.md` y `quickstart.md` no introducen
dependencias ni cambian alcance.

## Project Structure

### Documentation (this feature)

```text
specs/003-claude-md/
├── plan.md                       # Este archivo
├── spec.md                       # Especificación funcional
├── research.md                   # Phase 0
├── data-model.md                 # Phase 1
├── quickstart.md                 # Phase 1
├── contracts/                    # N/A (contenido puro, sin APIs)
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
claude-code-sdd-java/
├── CLAUDE.md                     # Nuevo — snippet vivo del repo (FR-008a)
├── mkdocs.yml                    # Actualizar nav de "CLAUDE.md" con 5 hijos
└── docs/
    └── claude-md/
        ├── index.md              # Reemplazar placeholder actual
        ├── usuario.md            # Nuevo
        ├── proyecto.md           # Nuevo
        ├── buenas-practicas.md   # Nuevo
        └── antipatrones.md       # Nuevo
```

**Structure Decision**: docs-only + un único archivo nuevo en la raíz
(`CLAUDE.md`). Ningún directorio nuevo fuera de `docs/claude-md/`.
`docs/stylesheets/`, `docs/assets/`, `docs/setup/` sin cambios en esta
feature (sólo `docs/setup/index.md` recibirá una línea de enlace hacia
`docs/claude-md/index.md` — FR-009).

## Complexity Tracking

Sin violaciones. Tabla vacía intencionalmente.
