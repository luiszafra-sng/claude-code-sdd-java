# Phase 1 Data Model: Módulo "Setup del entorno"

**Feature**: 002-setup-entorno
**Date**: 2026-09-16

Feature docs-only; no hay bases de datos ni servicios con estado. Este
modelo describe las entidades conceptuales del contenido y sus
relaciones, útiles para razonar sobre estructura, navegación y
verificación.

---

## Entidades

### 1. Módulo de setup (`SetupModule`)

Sección "Setup del entorno" del sitio.

**Atributos**:
- `id` (const): `setup`.
- `title` (string): "Setup del entorno".
- `intro_page` (path): `docs/setup/index.md`.
- `pages` (list<Pagina>): ordenada, 7 entradas.
- `estimated_time_min` (int): 30.
- `supported_os` (list<string>): `["macOS 13+", "Ubuntu 22.04+", "WSL2 sobre Windows 11"]`.
- `canonical_shell` (enum: `bash` | `zsh`): `bash`.
- `equivalence_note` (string): texto único que documenta cómo migrar snippets a Zsh (`~/.bashrc` → `~/.zshrc`).

**Validaciones**:
- `pages` DEBE contener exactamente 7 entradas en este orden: `intro`, `sdkman`, `claude-code`, `rtk`, `caveman`, `codegraph`, `verificacion`.
- `canonical_shell` fijo en `bash` (Clarifications Q1).

### 2. Página de herramienta (`ToolPage`)

Entrada dedicada a una herramienta (SDKMAN, Claude Code, RTK, Caveman,
CodeGraph).

**Atributos**:
- `slug` (string): `sdkman` | `claude-code` | `rtk` | `caveman` | `codegraph`.
- `title` (string): nombre visible (p. ej. "SDKMAN").
- `path` (path): `docs/setup/<slug>.md`.
- `sections` (list<Seccion>): exactamente 5 secciones fijas (ver abajo) más N adicionales opcionales.
- `install_methods` (list<InstallMethod>): al menos 1; para RTK/Caveman/CodeGraph, TODOS los métodos oficiales.
- `reference_block` (ReferenceBlock): versión + fecha de verificación (obligatorio).
- `next_page` (path): siempre apunta a `docs/setup/verificacion.md` (o al menos incluye enlace explícito).
- `prev_page` (path): siempre apunta a `docs/setup/index.md` (o al menos enlace de vuelta).

**Validaciones**:
- Las 5 secciones fijas DEBEN existir en este orden: "Qué es y qué problema resuelve", "Cómo instalar", "Verificación", "Cuándo usarlo", "Gotchas y troubleshooting". FR-003.
- `install_methods.length >= 2` para RTK, Caveman, CodeGraph. FR-004a.
- Todo comando en la sección "Cómo instalar" y "Verificación" DEBE ser copy-paste puro (sin placeholders innecesarios). FR-004.
- `reference_block` presente y con fecha en formato ISO `YYYY-MM-DD`. FR-015.

### 3. Sección estándar (`Seccion`)

**Atributos**:
- `name` (enum): "Qué es y qué problema resuelve" | "Cómo instalar" | "Verificación" | "Cuándo usarlo" | "Gotchas y troubleshooting" | otras (extra opcional).
- `order` (int): 1..5 para las fijas; ≥ 6 para extras.
- `anchor` (string): slug generado por MkDocs para enlaces internos.

### 4. Método de instalación (`InstallMethod`)

**Atributos**:
- `name` (string): p. ej. "Script oficial", "cargo install", "Homebrew", "Binario prebuilt", "Build desde fuentes", "pipx", "npm".
- `command_block` (string, código): bloque bash completo, copy-paste puro.
- `prerequisites` (list<string>): p. ej. `["Rust toolchain"]`, `["Python 3.10+"]`, `["Homebrew"]`, `["ninguno"]`.
- `speed` (enum: `rápida` | `media` | `lenta`).
- `update_ease` (enum: `alta` | `media` | `baja`).
- `recommended_context` (string): breve, p. ej. "máquina personal sin Rust instalado", "entorno CI", "control total y últimos cambios".

**Validaciones**:
- Para páginas RTK / Caveman / CodeGraph: la página DEBE renderizar una tabla comparativa con estas columnas. FR-004a.

### 5. Bloque de referencia (`ReferenceBlock`)

**Atributos**:
- `tool_versions` (map<name, version>): p. ej. `{sdkman: "5.19.0", java: "21.0.4-librca", maven: "3.9.9"}`.
- `verified_at` (date ISO `YYYY-MM-DD`).
- `expires_at` (date ISO): `verified_at + 6 meses`; NO se renderiza, se calcula al validar.

**Validaciones**:
- `verified_at` no puede ser futura respecto a la fecha de build.
- `verified_at` con más de 6 meses de antigüedad bloquea merges que toquen la página (constitution 1.0.2, norma operativa).

### 6. Checklist de verificación (`VerificationChecklist`)

Contenido de `docs/setup/verificacion.md`.

**Atributos**:
- `items` (list<ChecklistItem>): al menos 1 por herramienta (5 mínimo, típicamente 7-10 incluyendo Java, Maven, Claude auth, RTK hook, Caveman activación, CodeGraph índice).

### 7. Item de checklist (`ChecklistItem`)

**Atributos**:
- `label` (string): descripción del check.
- `command` (string): comando bash exacto.
- `expected` (string): salida esperada o criterio de éxito.
- `troubleshoot_link` (link): apunta a subsección de la página relevante.

**Validaciones**:
- Todo item DEBE tener `troubleshoot_link` (100% trazabilidad, SC-003).

### 8. Nota de audiencia (`ShellNote`)

**Atributos**:
- `location` (path): `docs/setup/index.md`.
- `content` (string): párrafo que documenta la equivalencia Bash ↔ Zsh (Clarifications Q1).

**Validaciones**:
- DEBE aparecer una única vez en el módulo, en `docs/setup/index.md`. No se duplica en páginas hijas.

### 9. Página especial `docs/setup/index.md` (`IndexPage`)

Es un tipo especial de página que no sigue la estructura de 5 secciones.

**Atributos**:
- `sections`: propósito, requisitos previos, `ShellNote`, orden recomendado + enlaces a las 6 páginas hijas.
- `estimated_time_min`, `supported_os`, `canonical_shell` heredados de `SetupModule`.

---

## Relaciones

- `SetupModule` 1 — 1 `IndexPage` + 6 `ToolPage` + 1 `VerificationChecklist` (composición ordenada).
- `ToolPage` 1 — 5..N `Seccion` (composición; ≥ 5 fijas).
- `ToolPage` 1 — 1..N `InstallMethod` (composición; ≥ 2 para RTK/Caveman/CodeGraph).
- `ToolPage` 1 — 1 `ReferenceBlock`.
- `VerificationChecklist` 1 — N `ChecklistItem` (composición; N ≥ 7).
- `ChecklistItem` 1 → 1 `Seccion` (referencia por link, no propiedad).
- `IndexPage` 1 — 1 `ShellNote`.

## Transiciones de estado

Ninguna a nivel runtime. A nivel de mantenimiento hay un ciclo por
página:

```text
Publicada → (>6 meses o versión mayor upstream) → Re-verificar → Actualizada
```

`verified_at` es el único estado persistente que evoluciona.

## Materialización

- `SetupModule` + orden de páginas → `mkdocs.yml` (bloque `nav` de "Setup
  del entorno").
- Cada `ToolPage` / `IndexPage` / `VerificationChecklist` → un `.md` bajo
  `docs/setup/`.
- `InstallMethod` y `ReferenceBlock` → bloques Markdown dentro de la
  página correspondiente.
- No hay archivos de metadatos adicionales (front-matter YAML no
  necesario).
