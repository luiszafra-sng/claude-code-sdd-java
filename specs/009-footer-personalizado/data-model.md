# Data Model: Fecha de revisión por página

**Feature**: 009-footer-personalizado | **Date**: 2026-09-21

Esta feature no introduce entidades persistidas. El "modelo de datos" es el flujo de metadatos que el plugin extrae del historial git y expone al template Jinja2 nativo de Material.

---

## Flujo de metadatos

```
Archivo .md (docs/)
      │
      ▼
git log --follow -1 --format="%ci" <archivo>
      │
      ▼ (procesado por mkdocs-git-revision-date-localized)
page.meta.git_revision_date_localized   ← string formateado
      │
      ▼ (inyectado en partials/source-file.html del tema Material)
<aside class="md-source-file">
  <span class="md-source-file__fact">⏱ 17 de septiembre de 2026</span>
</aside>
      │
      ▼ (alineación via extra.css)
Fecha visible a la derecha, al final del contenido del artículo
```

---

## Variables de template disponibles

| Variable | Tipo | Ejemplo | Fuente |
|----------|------|---------|--------|
| `page.meta.git_revision_date_localized` | `str \| None` | `"17 de septiembre de 2026"` | Plugin (`locale: es`, `type: date`) |
| `config.extra.generator` | `bool` | `False` | `mkdocs.yml` (`extra.generator: false`) |

---

## Condiciones de fallback

| Condición | Comportamiento | Variable resultante |
|-----------|---------------|---------------------|
| Página con commits | Fecha del último commit | `"17 de septiembre de 2026"` |
| Página sin commits (nueva, no commiteada) | Fecha de build | Fecha de build en mismo formato |
| Entorno sin acceso completo a git (shallow clone) | Fecha de build | Fecha de build en mismo formato |

---

## Nota sobre `type: date`

El plugin acepta `date`, `datetime`, `iso_date`, `iso_datetime`, `timeago`, `custom`. El valor `type: date` llama internamente a `babel.dates.format_date(format="long", locale="es")`, que produce el formato español largo deseado ("17 de septiembre de 2026"). El valor `long` **no es** un tipo válido directamente.

---

## Archivos modificados

| Archivo | Acción | Cambio |
|---------|--------|--------|
| `pyproject.toml` | Modificar | Añadir `mkdocs-git-revision-date-localized-plugin==1.6.0` |
| `mkdocs.yml` | Modificar | Plugin + `extra.generator: false` |
| `docs/stylesheets/extra.css` | Modificar | `.md-source-file { text-align: right }` |
| `overrides/partials/footer.html` | **No creado** | Descartado; se usa footer nativo de Material |
