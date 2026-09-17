# Phase 0 Research: Esqueleto del sitio MkDocs

**Feature**: 001-mkdocs-skeleton
**Date**: 2026-09-16

Todas las `NEEDS CLARIFICATION` de la spec fueron resueltas durante `/speckit-clarify`
(sesión 2026-09-16). Este documento recoge las decisiones técnicas concretas que la
implementación debe seguir, con racional y alternativas descartadas.

---

## 1. Gestor Python

- **Decision**: `uv` (>=0.4) como único gestor. `pyproject.toml` + `uv.lock`
  commiteados. Comandos operativos: `uv sync`, `uv run mkdocs serve`, `uv run mkdocs
  build --strict`, `uv add <pkg>`.
- **Rationale**: velocidad, lockfile determinista, gestión de intérprete integrada,
  soporte nativo de dependency groups. Exigido por el usuario y compatible con el
  Principio VI de la constitution (pipeline futuro con `uv sync --frozen`).
- **Alternatives considered**:
  - `pip` + `venv` + `requirements.txt`: rechazado por falta de lock reproducible sin
    herramientas extra.
  - `poetry`: rechazado por mayor overhead y política del proyecto.
  - `pipenv`: rechazado por mantenimiento irregular.
  - `conda`: excesivo para un sitio Python puro.

## 2. Versión mínima de Python

- **Decision**: `requires-python = ">=3.12"`. `.python-version` pin concreto de la rama
  3.12.x (p. ej. `3.12.7`).
- **Rationale**: aclarada en sesión de clarify. Estable, ampliamente empaquetada,
  cubierta por las imágenes oficiales de `uv`.
- **Alternatives considered**: `>=3.11` (más permisivo, se descarta para evitar cargar
  compatibilidad histórica innecesaria), `>=3.13` (demasiado reciente, algunas distros
  aún sin paquete).

## 3. Dependencias MkDocs (versiones fijadas)

- **Decision**: fijar en `pyproject.toml` (dependency group `docs`) versiones exactas.
  Instalado con `uv add --group docs …` y ajustado a pin exacto (`==`) en la
  implementación:
  - `mkdocs == 1.6.1`
  - `mkdocs-material == 9.7.7`
  - `pymdown-extensions == 12.0.1`
  (El patrón es "pin exacto", nada de `~=` ni `>=`.)
- **Rationale**: reproducibilidad + coherencia con el Principio VI (build `--strict`
  estable a lo largo del tiempo). Los tres son necesarios para las features de
  Markdown requeridas por la spec (superfences, tabbed, highlight, snippets, admonition
  requiere `pymdownx.details`/`admonition` — el segundo lo trae MkDocs core, pero
  `pymdown-extensions` completa el resto).
- **Alternatives considered**: rangos (`^` / `~`) descartados por evitar drift; plugins
  extra (glightbox, mermaid) descartados en esta feature — se añadirán en specs
  posteriores cuando se necesiten.

## 4. Configuración de tema (palette + toggle)

- **Decision**: en `mkdocs.yml`:

  ```yaml
  theme:
    name: material
    language: es
    palette:
      - media: "(prefers-color-scheme)"
        toggle:
          icon: material/brightness-auto
          name: Cambiar a modo claro
      - media: "(prefers-color-scheme: light)"
        scheme: default
        primary: custom
        accent: custom
        toggle:
          icon: material/brightness-7
          name: Cambiar a modo oscuro
      - media: "(prefers-color-scheme: dark)"
        scheme: slate
        primary: custom
        accent: custom
        toggle:
          icon: material/brightness-4
          name: Cambiar a modo automático
  ```

- **Rationale**: cumple la clarificación 4 (default = `prefers-color-scheme`, toggle
  sobrescribe). `primary: custom` + `accent: custom` deja los tokens reales en
  `extra.css` (concentración de la identidad visual, Principio I).
- **Alternatives considered**: paleta predefinida de Material (indigo, teal, etc.):
  descartada porque impide clonar la paleta de la referencia sin CSS custom.

## 5. Tipografías

- **Decision**: `Inter` (títulos + cuerpo) e `IBM Plex Mono` (código), cargadas desde
  Google Fonts vía `mkdocs.yml`:

  ```yaml
  theme:
    font:
      text: Inter
      code: IBM Plex Mono
  ```

- **Rationale**: aclarada en sesión de clarify (Q1). Inter es la sans-serif de
  referencia en interfaces técnicas modernas y ofrece buena legibilidad; IBM Plex Mono
  aporta contraste técnico para snippets.
- **Alternatives considered**:
  - Self-hosting en `docs/assets/fonts/`: se prevé como fallback si en el futuro se
    exige privacidad/offline; no se implementa aquí porque añade complejidad sin
    beneficio inmediato.
  - Space Grotesk + JetBrains Mono / Manrope + Fira Code: descartadas por decisión.

## 6. Identidad visual (paleta + spacing)

- **Decision**: paleta propia (blanco/casi negro, acento cálido tipo naranja Sngular).
  Concretar los hex en `docs/stylesheets/extra.css` con variables:

  ```css
  :root {
    --md-primary-fg-color: #0F1115;
    --md-primary-fg-color--light: #1A1D22;
    --md-primary-fg-color--dark: #000000;
    --md-accent-fg-color: #FF5A1F;
    --md-typeset-color: #16181D;
    --md-default-bg-color: #FAFAF7;
  }
  [data-md-color-scheme="slate"] {
    --md-default-bg-color: #0F1115;
    --md-typeset-color: #ECEDEF;
    --md-primary-fg-color: #ECEDEF;
    --md-accent-fg-color: #FF7A45;
  }
  ```

  Estos hex son un punto de partida verificable en la fase de implementación contra la
  referencia; ajustables antes de mergear siempre que:
  - Se conserve contraste ≥ 4.5:1 texto normal y ≥ 3:1 texto grande / UI (WCAG AA).
  - Todos los tokens sigan viviendo únicamente en `docs/stylesheets/extra.css`.
- **Rationale**: cumple Principios I y FR-017. Concentración de tokens facilita
  iteraciones estéticas sin tocar el resto del sitio.
- **Alternatives considered**: paleta directa Material predefinida (rechazada por no
  parecerse a la referencia), tema totalmente custom fuera de Material (rechazado por
  coste altísimo y por perder features del tema).

## 7. Plugins MkDocs + extensiones Markdown

- **Decision**: sólo lo estrictamente necesario para cubrir las features de la spec:

  ```yaml
  markdown_extensions:
    - admonition
    - attr_list
    - md_in_html
    - pymdownx.details
    - pymdownx.highlight:
        anchor_linenums: true
    - pymdownx.inlinehilite
    - pymdownx.snippets
    - pymdownx.superfences
    - pymdownx.tabbed:
        alternate_style: true
    - toc:
        permalink: true

  theme:
    features:
      - navigation.tabs
      - navigation.sections
      - navigation.top
      - search.suggest
      - content.code.copy
      - content.code.annotate
  ```

- **Rationale**: mapea 1:1 a FR-008 y FR-009. `admonition` + `pymdownx.details`
  cubre bloques `!!! note` de la clarificación 2 sobre placeholders.
- **Alternatives considered**: plugins ricos como `mkdocs-glightbox`, `mkdocs-mermaid2`,
  `mkdocs-git-revision-date-localized-plugin`: fuera de alcance (se añadirán cuando
  algún módulo los necesite).

## 8. Placeholders y home

- **Decision**: cada sección tiene una única página `index.md` con:

  ```markdown
  # {Nombre del módulo}

  Próximamente cubriremos {objetivo alineado con la spec futura correspondiente}.

  !!! note "Contenido en construcción"
      Esta sección se publicará como parte de la spec {N}. Vuelve más adelante.
  ```

  La home `docs/index.md` presenta la formación, audiencia dual, objetivos y mapa con
  enlaces a las siete secciones.

- **Rationale**: cumple FR-002, FR-003 y la clarificación 2. Suficiente para pasar
  `--strict` y para orientar a visitantes tempranos.
- **Alternatives considered**: páginas vacías (rompen `--strict` por links huérfanos),
  sólo H1 (menos informativo), tabla de subpáginas previstas (más mantenimiento).

## 9. Accesibilidad WCAG 2.1 AA

- **Decision**:
  - Contraste ≥ 4.5:1 texto normal, ≥ 3:1 texto grande y componentes UI, en ambos
    temas. Verificar con axe DevTools / Lighthouse antes de mergear.
  - Foco visible: mantener el outline por defecto de MkDocs Material; si `extra.css`
    lo tocase, garantizar `:focus-visible` con `outline` ≥ 2px de color con contraste.
  - Navegación por teclado sin trampas: usar sólo componentes nativos de Material
    (no re-implementar menús a mano).
  - Imágenes: `alt` en `logo.svg` y `favicon.svg`; en placeholders no habrá imágenes
    en esta feature.
  - Jerarquía: `h1` único por página (título del módulo), sin saltos de nivel.
- **Rationale**: FR-017 y SC-007.
- **Alternatives considered**: AAA (demasiado estricto para contraste con acento
  naranja), ninguno (rechazado por conflicto con constitution I).

## 10. Logo y favicon placeholder

- **Decision**: SVG minimalista (círculo o glifo geométrico simple) en
  `docs/assets/logo.svg` y `docs/assets/favicon.svg`, ambos con `role="img"` y `<title>`
  para accesibilidad. Referenciados desde `mkdocs.yml`:

  ```yaml
  theme:
    logo: assets/logo.svg
    favicon: assets/favicon.svg
  ```

- **Rationale**: cumple FR-010 sin bloquear la feature esperando arte final.
- **Alternatives considered**: PNG (peor escalado), sin logo (viola FR-010).

## 11. .gitignore

- **Decision**:

  ```gitignore
  .venv/
  site/
  .uv-cache/
  __pycache__/
  *.pyc
  .DS_Store
  ```

  `uv.lock` NO se ignora. `.python-version` NO se ignora (se commitea).
- **Rationale**: FR-014.
- **Alternatives considered**: ignorar `uv.lock` (rechazado por reproducibilidad).

## 12. Verificación local (proxy de tests)

- **Decision**: dos comandos como puertas de calidad locales antes de commit:
  1. `uv run mkdocs build --strict` — falla con warnings.
  2. Auditoría accesibilidad manual con Lighthouse sobre `site/index.html` y una
     placeholder, en tema claro y oscuro. Aceptación: score ≥ 95 y 0 issues de
     contraste (SC-007).
- **Rationale**: cubre SC-002 y SC-007 sin infra de CI (diferida a spec 8).
- **Alternatives considered**: integrar pytest + `pytest-mkdocs` (over-engineering),
  ninguna verificación (viola Principio VI).

---

## NEEDS CLARIFICATION residuales

Ninguna. Todas las cuestiones abiertas fueron resueltas en la sesión de `/speckit-clarify`
del 2026-09-16.
