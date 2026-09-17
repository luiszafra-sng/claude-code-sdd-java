# Formación Claude Code + SDD (Speckit) para Java

<!--
  Sustituir <GITLAB_HOST>, <NAMESPACE>, <PROJECT>, <CI_PAGES_URL> por los valores
  reales del proyecto GitLab antes de mergear (ver docs/publicacion.md).
-->
[![Pipeline status](<GITLAB_HOST>/<NAMESPACE>/<PROJECT>/badges/main/pipeline.svg)](<GITLAB_HOST>/<NAMESPACE>/<PROJECT>/-/pipelines?ref=main)
[![Sitio publicado](https://img.shields.io/badge/Pages-online-brightgreen)](<CI_PAGES_URL>)

Sitio de formación en MkDocs Material sobre Claude Code y Spec-Driven
Development con Speckit, orientado a proyectos Java (modernos con Spring
Boot 4 + Java 21 y legacy). Reglas del proyecto en
[`.specify/memory/constitution.md`](.specify/memory/constitution.md).

## Requisitos

- macOS, Linux o WSL2.
- [`uv`](https://docs.astral.sh/uv/) instalado. Verifica con:

  ```bash
  uv --version
  ```

  Windows nativo queda fuera de soporte en esta iteración.

## Instalación

Clona el repo y sincroniza dependencias:

```bash
uv sync
```

`uv` resuelve el intérprete Python según `.python-version` y `requires-python`
en `pyproject.toml`, crea `.venv/` e instala las versiones fijadas en
`uv.lock`.

## Levantar el sitio en local

```bash
uv run mkdocs serve
```

Abre <http://127.0.0.1:8000>. El sitio se recarga en caliente al guardar
cambios en `docs/` o `mkdocs.yml`.

## Validar antes de mergear

```bash
uv run mkdocs build --strict
```

Debe terminar con exit 0 y sin líneas `WARNING`. Cualquier warning se
considera error (`--strict`); no lo suprimas con flags permisivas.

## Añadir una página

1. Crea el archivo Markdown dentro del módulo correspondiente, por ejemplo
   `docs/setup/instalar-sdkman.md`.
2. Registra la nueva página en `mkdocs.yml`, dentro de `nav`, bajo la sección
   apropiada:

   ```yaml
   nav:
     - Setup del entorno:
         - setup/index.md
         - SDKMAN: setup/instalar-sdkman.md
   ```

3. Si `mkdocs serve` está corriendo, la página aparece al guardar. Si no,
   arráncalo.

Si añades un archivo Markdown y NO lo registras en `nav`, `mkdocs build
--strict` fallará (comportamiento esperado, se controla con `validation.nav`
en `mkdocs.yml`).

## Añadir una dependencia

```bash
uv add --group docs <paquete>
```

Ejemplo:

```bash
uv add --group docs mkdocs-glightbox
```

Esto actualiza `pyproject.toml` (dependency group `docs`) y `uv.lock`.
Commitea ambos archivos. Los plugins recién instalados se activan cuando los
añades a `mkdocs.yml` bajo `plugins:` o `markdown_extensions:` según
corresponda.

Para eliminar una dependencia:

```bash
uv remove --group docs <paquete>
```

## Estructura del repositorio

```text
claude-code-sdd-java/
├── mkdocs.yml            # Configuración MkDocs Material (nav, tema, extensiones)
├── pyproject.toml        # Metadata + dependencias (grupo docs)
├── uv.lock               # Lock reproducible de uv (versionado)
├── .python-version       # Versión Python resuelta por uv
├── docs/
│   ├── index.md          # Home
│   ├── stylesheets/      # extra.css con tokens visuales
│   ├── assets/           # Logo, favicon, fuentes
│   └── <módulos>/        # Introducción, Setup, CLAUDE.md, etc.
└── .specify/             # Speckit (constitution, memoria, templates)
```

## Nota sobre el gestor Python

Este repo se ha estandarizado en `uv` como único gestor Python. No se
contemplan `pip`, `venv`, `pipenv`, `poetry` ni `conda` en el flujo
principal. Todas las instrucciones y el pipeline futuro asumen `uv`.
