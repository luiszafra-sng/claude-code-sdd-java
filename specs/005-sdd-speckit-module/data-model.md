# Phase 1 · Data Model — Módulo "SDD con Speckit"

**Feature**: `005-sdd-speckit-module`
**Date**: 2026-09-16

Módulo puramente documental. No hay entidades runtime. Este modelo cataloga las entidades editoriales que estructuran el contenido y sus relaciones.

## Entidades

### Página del módulo

Unidad publicable bajo `docs/sdd/`.

| Campo | Tipo | Reglas |
|---|---|---|
| `path` | ruta relativa | Bajo `docs/sdd/`, extensión `.md`, nombre en kebab-case ASCII. |
| `title` | string | Encabezado H1 al principio del fichero. Sin emojis. |
| `sections` | lista ordenada de H2 | Fijadas por el contrato de página aplicable (ver `contracts/page-template.md`). |
| `cross_links` | lista de rutas relativas | Sección "Enlaces relacionados" al pie, opcional pero recomendada según FR-004. |
| `version_block` | admonition (opcional) | Obligatorio si la página cita versiones de herramientas externas (FR-005). |
| `nav_position` | entero | Determinado por el orden en `mkdocs.yml`. |

**Instancias en este feature**: `index.md`, `flujo.md`, `caso-guia.md`, `greenfield.md`, `brownfield.md`, `antipatrones.md`.

### Extracto ilustrativo de artefacto Speckit

Fragmento embebido de `spec.md`, `plan.md`, `tasks.md`, `contract`, `research.md`, `data-model.md`, `quickstart.md` del caso guía.

| Campo | Tipo | Reglas |
|---|---|---|
| `artefacto` | enum | `spec` \| `plan` \| `tasks` \| `contract` \| `research` \| `data-model` \| `quickstart`. |
| `paso_speckit` | enum | Comando Speckit que lo produce: `constitution` \| `specify` \| `clarify` \| `plan` \| `tasks` \| `analyze` \| `checklist` \| `implement` \| `converge`. |
| `contenido` | bloque de código Markdown | Escaffold en inglés (tal como llega del template) + contenido en español (research.md §5). |
| `longitud` | entero (líneas) | Si >40, se traslada a anexo bajo `docs/sdd/artefactos/` (research.md §4). |
| `ubicación` | ruta relativa | `caso-guia.md` (inline) o `docs/sdd/artefactos/<paso>-<slug>.md` (anexo). |

**Relación**: cada extracto se asocia a un único `paso_speckit` y a un único `artefacto`. Un `caso-guia.md` referencia N extractos.

### Bloque "versión de referencia + fecha de verificación"

Admonition que fija versión de una herramienta externa citada.

| Campo | Tipo | Reglas |
|---|---|---|
| `herramienta` | string | Nombre canónico (Claude Code, Speckit, MkDocs Material, Mermaid, Java, Spring Boot, SDKMAN, CodeGraph, RTK, Caveman). |
| `version` | string | Formato semver o etiqueta oficial. |
| `fecha_verificacion` | date (`YYYY-MM-DD`) | Cuándo se verificó por última vez. Bloquea merge si >6 meses (constitution 1.0.2). |
| `formato` | admonition | `!!! info "Versión de referencia"` (research.md §7). |

**Contrato**: `contracts/version-block.md`.

### Diagrama del ciclo Speckit

Un único diagrama Mermaid embebido en `flujo.md`.

| Campo | Tipo | Reglas |
|---|---|---|
| `formato` | string | `flowchart LR` (research.md §9). |
| `nodos` | lista | Un nodo por comando Speckit. |
| `aristas_solidas` | lista | Pasos obligatorios. |
| `aristas_discontinuas` | lista | Pasos opcionales. |
| `bucle` | arista | `converge → specify` para representar iteración. |

### Cross-link

Enlace relativo entre página del módulo y otra página del sitio.

| Campo | Tipo | Reglas |
|---|---|---|
| `origen` | ruta relativa dentro de `docs/sdd/` | Página del módulo. |
| `destino` | ruta relativa | Página en `docs/{claude-md,app-ejemplo,agentes,skills,setup}/`. |
| `contexto` | string | Frase breve que motiva el link. |
| `ubicación` | enum | `inline` \| `enlaces-relacionados`. |

## Relaciones

```text
Página ── contiene ── 0..1 Bloque de versión
Página ── contiene ── 0..N Cross-link
caso-guia.md ── referencia ── 1..N Extracto ilustrativo
flujo.md ── contiene ── 1 Diagrama del ciclo Speckit
Extracto (si longitud>40) ── vive en ── docs/sdd/artefactos/<paso>-<slug>.md
```

## Ciclo de vida editorial

1. **Draft**: autor redacta la página siguiendo `contracts/page-template.md`.
2. **Build check**: `uv run mkdocs build --strict` sin warnings.
3. **Scope check**: `git diff --stat examples/ contracts/` vacío (SC-006).
4. **Review**: revisor coteja contra FR y SC del spec.
5. **Merge**: publicado por pipeline GitLab Pages.
6. **Re-verificación semestral**: actualizar `fecha_verificacion` en cada bloque de versión; si cambió la versión upstream, actualizar también `version`.
