# Phase 1 Data Model: Esqueleto del sitio MkDocs

**Feature**: 001-mkdocs-skeleton
**Date**: 2026-09-16

Este feature es un sitio estático de documentación; no hay base de datos ni servicios
con estado. El "modelo de datos" describe las entidades conceptuales del sitio y sus
relaciones, útiles para razonar sobre navegación, i18n, tokens visuales y
placeholders.

---

## Entidades

### 1. Sitio (`Site`)

Raíz de la formación.

**Atributos**:
- `title` (string): "Formación Claude Code + SDD (Speckit) para Java"
- `language` (string): `es`
- `repo_url` (string, opcional): URL del repositorio (se rellena cuando exista).
- `default_theme` (enum: `auto`): resolución inicial vía `prefers-color-scheme`.
- `logo_ref` (path): `assets/logo.svg`
- `favicon_ref` (path): `assets/favicon.svg`
- `stylesheet_refs` (list<path>): `[stylesheets/extra.css]`
- `nav` (list<Modulo>): ordenada; ver relación abajo.

**Validaciones**:
- `nav` DEBE contener exactamente siete `Modulo` en el orden definido por FR-002.
- `stylesheet_refs` DEBE listar `docs/stylesheets/extra.css` como único CSS custom.

### 2. Módulo (`Modulo`)

Sección de nivel superior en la navegación.

**Atributos**:
- `id` (slug, único): p.ej. `introduccion`, `setup`, `claude-md`, `app-ejemplo`,
  `sdd`, `agentes`, `skills`.
- `title` (string): nombre visible (ver FR-002).
- `path` (path): p.ej. `docs/{id}/index.md`.
- `future_spec_ref` (string): identificador de la spec futura que rellenará el módulo
  (para la frase "próximamente cubriremos X").
- `order` (int 1..7): posición en la navegación.
- `pages` (list<Pagina>): en esta feature siempre una única página placeholder.

**Validaciones**:
- `title` no vacío.
- `order` único entre módulos y respeta la secuencia declarada.
- Debe existir al menos una `Pagina` navegable.

**Tabla de instancias (fija en esta feature)**:

| order | id             | title                              | path                         | future_spec_ref |
|------:|----------------|------------------------------------|------------------------------|-----------------|
| 1     | introduccion   | Introducción                       | docs/introduccion/index.md   | (esta spec)     |
| 2     | setup          | Setup del entorno                  | docs/setup/index.md          | spec 2          |
| 3     | claude-md      | CLAUDE.md                          | docs/claude-md/index.md      | spec 3          |
| 4     | app-ejemplo    | App de ejemplo (Spring Boot 4)     | docs/app-ejemplo/index.md    | spec 4          |
| 5     | sdd            | SDD con Speckit                    | docs/sdd/index.md            | spec 5          |
| 6     | agentes        | Agentes                            | docs/agentes/index.md        | spec 6          |
| 7     | skills         | Skills                             | docs/skills/index.md         | spec 7          |

### 3. Página (`Pagina`)

Documento Markdown individual.

**Atributos**:
- `path` (path)
- `title` (string)
- `role` (enum: `home` | `placeholder`)
- `body_shape` (enum: `intro-full` | `placeholder-basic`)

**Validaciones**:
- Toda `Pagina` con `role = placeholder` DEBE tener `body_shape = placeholder-basic`
  y contener: un H1, un párrafo introductorio y una admonition
  `!!! note "Contenido en construcción"` (FR-002).
- La única `Pagina` con `role = home` (`docs/index.md`) DEBE incluir presentación,
  audiencia dual, objetivos y mapa de módulos con enlaces (FR-003).
- Toda `Pagina` DEBE quedar referenciada en `Site.nav` o ser la home (evitar huérfanas
  bajo `--strict`).

### 4. Tema visual (`ThemeTokens`)

Conjunto de variables CSS que definen la identidad del sitio.

**Atributos**:
- `scheme` (enum: `default` | `slate`)
- `primary_fg_color` (color hex, requiere contraste válido)
- `accent_fg_color` (color hex)
- `default_bg_color` (color hex)
- `typeset_color` (color hex)
- `font_text` (string): `Inter`
- `font_code` (string): `IBM Plex Mono`
- `type_scale` (map<string, size>): overrides de tamaño/ritmo si aplican.

**Validaciones**:
- Debe existir exactamente una instancia por cada `scheme` en `extra.css`.
- Cada pareja (texto, fondo) DEBE cumplir contraste WCAG AA (≥ 4.5:1 normal / ≥ 3:1
  grande).

### 5. Entorno Python (`PythonEnv`)

Entorno virtual gestionado por `uv`, descrito por `pyproject.toml` + `uv.lock`.

**Atributos**:
- `requires_python` (string): `>=3.12`
- `python_version_pin` (string): valor de `.python-version`.
- `dependency_group` (string): `docs`.
- `dependencies` (map<name, version_exact>): `{mkdocs: 1.6.1, mkdocs-material:
  9.5.42, pymdown-extensions: 10.11.2}` (versiones concretas ajustadas en
  implementación al último estable).

**Validaciones**:
- Todas las versiones fijadas exactamente (sin `~=`, `>=`, `^`).
- `uv.lock` presente y coherente con `pyproject.toml`.
- No existe `requirements.txt` ni `Pipfile` ni `poetry.lock` en el repo.

---

## Relaciones

- `Site` 1 — 7 `Modulo` (composición ordenada).
- `Modulo` 1 — 1..n `Pagina` (en esta feature siempre 1).
- `Site` 1 — 1..n `ThemeTokens` (uno por `scheme`).
- `Site` 1 — 1 `PythonEnv` (raíz).

## Transiciones de estado

Ninguna entidad tiene lifecycle relevante para esta feature (el sitio se compila desde
cero cada vez, sin persistencia).

## Notas de diseño

- El "modelo" es intencionadamente ligero: prácticamente se materializa como
  `mkdocs.yml` (Site + nav), archivos `.md` en `docs/` (Modulos + Paginas),
  `extra.css` (ThemeTokens) y `pyproject.toml`/`uv.lock` (PythonEnv). No hay clases,
  ORMs ni migraciones.
- Cambios futuros (specs 2–7) reemplazarán las páginas placeholder por contenido real
  y podrán añadir sub-páginas dentro de cada `Modulo`. La estructura de navegación de
  primer nivel es un contrato estable a partir de esta feature.
