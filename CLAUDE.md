<!-- Redactado en 2026-09 -->

# CLAUDE.md — Formación Claude Code + SDD (Speckit) para Java

## Contexto

Repositorio de una formación práctica sobre Claude Code y Spec-Driven
Development con Speckit, orientada a Java (proyectos modernos con
Spring Boot 4 + Java 21 y proyectos legacy).

El repositorio publica un sitio MkDocs Material bajo `docs/`, gestiona
Python con `uv` y utiliza Speckit como método de trabajo por defecto
para cualquier feature no trivial. La constitution vive en
`.specify/memory/constitution.md` y es la fuente autorizada de las
reglas del proyecto.

## Convenciones

- **Idioma**: español para el contenido de la formación. Términos
  técnicos y comandos en su idioma original.
- **Tono**: profesional y directo (constitution 1.0.2, Principio I).
  Sin argot ("a saco", "picar código") ni caricaturas.
- **Shell canónica**: Bash. En Zsh cambia sólo el rc (`~/.bashrc` →
  `~/.zshrc`), no los comandos.
- **Estilo Markdown**: bloques de código con lenguaje explícito;
  admonitions `!!! …` para notas, warnings y tips; enlaces relativos
  entre páginas del sitio.
- **Identidad visual**: todos los tokens (colores, tipografía,
  spacing) viven en `docs/stylesheets/extra.css`.

## Comandos habituales

- `uv sync` — sincroniza el entorno Python.
- `uv run mkdocs serve` — levanta el sitio en `http://127.0.0.1:8000`
  (con prefix `/claude-code-sdd-java/` por `site_url`).
- `uv run mkdocs build --strict` — build reproducible; falla ante
  cualquier warning.
- `uv add --group docs <paquete>` — añade una dependencia MkDocs.
- `uv remove --group docs <paquete>` — quita una dependencia MkDocs.
- `.specify/scripts/bash/check-prerequisites.sh --json --paths-only` —
  inspecciona la spec activa.

## Restricciones para Claude Code

Reglas operativas que aplican en cualquier sesión sobre este repo.

- **Flujo Speckit** — MUST respetar el ciclo `specify` → `plan` →
  `tasks` → `implement` para cualquier feature no trivial. NEVER
  modificar código de aplicación o contenido de módulos fuera de una
  spec activa registrada en `.specify/feature.json`.
- **Identidad visual centralizada** — MUST mantener todos los tokens
  visuales en `docs/stylesheets/extra.css`. NEVER duplicar estilos en
  páginas Markdown ni introducir CSS en línea.
- **Gestor Python** — MUST usar `uv` como único gestor Python. NEVER
  invocar `pip`, `venv`, `pipenv`, `poetry` ni `conda` en el flujo
  principal.
- **Pin exacto de dependencias** — MUST fijar dependencias con `==`.
  NEVER usar `~=`, `>=` ni `^` en `pyproject.toml`.
- **Registro de tono** — MUST respetar la constitution 1.0.2
  Principio I (profesional y directo). NEVER argot ni caricaturas
  exageradas en los ejemplos "pobre".
- **Puerta de calidad `--strict`** — MUST superar `uv run mkdocs build
  --strict` sin warnings antes de considerar cerrada cualquier tarea
  que toque `docs/` o `mkdocs.yml`.
- **Minimalismo** — SHOULD priorizar cambios localizados. NEVER
  refactorizar áreas no pedidas explícitamente.
- **Documentación no solicitada** — NEVER crear archivos Markdown
  fuera de la spec activa. Si un cambio implica documentación nueva,
  MUST proponer el archivo antes de crearlo.
- **Confidencialidad** — NEVER commitear credenciales, tokens ni datos
  sensibles de clientes. `.env*` está en `.gitignore` y no se toca.

## Estructura del repositorio

```text
claude-code-sdd-java/
├── mkdocs.yml            # Config del sitio (tema, nav, extensiones)
├── pyproject.toml        # Metadata + dep group docs
├── uv.lock               # Lock reproducible (versionado)
├── .python-version       # Python 3.12 (versionado)
├── CLAUDE.md             # Este archivo
├── docs/                 # Sitio MkDocs Material
│   ├── index.md
│   ├── setup/            # Módulo Setup del entorno (spec 002)
│   ├── claude-md/        # Módulo CLAUDE.md (spec 003)
│   └── stylesheets/
│       └── extra.css     # Tokens visuales únicos
└── .specify/             # Speckit
    ├── memory/
    │   └── constitution.md   # Constitution vigente (1.0.2)
    ├── templates/
    └── extensions.yml
```

## Enlaces

- Constitution vigente: `.specify/memory/constitution.md`.
- Módulo CLAUDE.md del sitio: `docs/claude-md/index.md`.
- Home del sitio: `docs/index.md`.

## Cómo interpretar este archivo

Este `CLAUDE.md` es el ejemplo vivo referenciado desde la página
[Capa proyecto](docs/claude-md/proyecto.md) del sitio. Puede
evolucionar con el repositorio; si detectas divergencias con los
snippets estáticos del módulo, la fuente autorizada es este archivo.
