# Notas de integración

## Dependencia de spec 009 (footer personalizado)

La spec 009 añade `mkdocs-git-revision-date-localized-plugin==1.6.0` a `pyproject.toml`.
El pipeline de GitLab CI/CD debe asegurarse de que esta dependencia esté disponible en
el entorno de build (se instala automáticamente con `uv sync` si el `uv.lock` está
correctamente versionado).

**Requisito**: el job `pages` debe ejecutar `uv sync` antes de `mkdocs build --strict`
para incluir el nuevo plugin. Si el pipeline instala dependencias con `pip install -r`
directamente (sin uv), deberá añadir `mkdocs-git-revision-date-localized-plugin==1.6.0`
a la lista explícita de dependencias del CI.
