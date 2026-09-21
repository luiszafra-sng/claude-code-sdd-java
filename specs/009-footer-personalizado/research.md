# Research: Pie de página personalizado

**Feature**: 009-footer-personalizado | **Date**: 2026-09-21

---

## Decisión 1 — Plugin de fechas git

**Decision**: `mkdocs-git-revision-date-localized` (PyPI)

**Rationale**:
- Única solución mantenida activamente para MkDocs que extrae la fecha del último commit por archivo.
- Soporte nativo de locale español (`locale: es`, `type: long`) → produce "21 de septiembre de 2026" directamente.
- Expone `page.meta.git_revision_date_localized` en contexto Jinja2, accesible desde templates de Material.
- `fallback_to_build_date: true` cubre el edge case de páginas sin historial git.

**Alternatives considered**:
- Hook Python personalizado (`hooks/` de MkDocs) para inyectar fechas — más control pero sin soporte de locale ni fallback; complejidad innecesaria.
- Campo manual `git_date:` en front matter — no escala, requiere mantenimiento manual por página.

**Configuración target en `mkdocs.yml`**:
```yaml
plugins:
  - search
  - git-revision-date-localized:
      enable_creation_date: false
      locale: es
      type: date
      fallback_to_build_date: true
```

**Nota de implementación**: El tipo `long` no es válido en v1.x; el plugin acepta `date`, `datetime`, `iso_date`, `iso_datetime`, `timeago`, `custom`. `type: date` usa internamente `babel.dates.format_date(format="long", locale=locale)`, que con `locale: es` produce "21 de septiembre de 2026". ✓

**Nombre PyPI**: `mkdocs-git-revision-date-localized-plugin` (con sufijo `-plugin`). Versión instalada: `1.6.0`.

---

## Decisión 2 — Mecanismo para mostrar la fecha de revisión

**Decision**: Fecha inline nativa de Material (`partials/source-file.html`) con alineación via CSS

**Rationale**:
- Material for MkDocs incluye el partial `source-file.html` que inyecta `page.meta.git_revision_date_localized` al final del contenido del artículo como `<aside class="md-source-file">`, sin necesidad de override de template.
- La fecha inline pertenece inequívocamente a la página que se está leyendo; en el footer global podría confundirse con una revisión del sitio completo.
- La alineación a la derecha se consigue con una única regla CSS: `.md-source-file { text-align: right }`.
- Elimina la necesidad de `overrides/partials/footer.html` y de clases CSS personalizadas `.sng-footer*`.

**Alternatives considered** (y razones de descarte):
- Override de `overrides/partials/footer.html` con logo + fecha — implementado inicialmente, descartado por redundancia visual y porque la fecha en el footer parecía revisión global del sitio, no de la página.
- Campo `copyright:` en `mkdocs.yml` — acepta HTML plano pero no expresiones Jinja2; no puede acceder a `page.meta.git_revision_date_localized`.

**Configuración final**:
```css
/* docs/stylesheets/extra.css */
.md-source-file {
  text-align: right;
}
```

---

## Decisión 3 — Eliminación del texto "Made with Material for MkDocs"

**Decision**: `generator: false` bajo `extra:` en `mkdocs.yml`

**Rationale**:
- El partial `partials/copyright.html` de Material comprueba `config.extra.generator`, no `config.theme.generator`. Colocar la opción bajo `theme:` no tiene efecto.
- La configuración correcta es `extra: generator: false` (clave de nivel superior en `mkdocs.yml`).
- No requiere override de template; es el mecanismo oficial para suprimir el badge del generador.

**Alternatives considered**:
- `generator: false` bajo `theme:` — probado y descartado: el template lee `config.extra.generator`, así que la opción bajo `theme:` se ignora silenciosamente.
- Override de `partials/copyright.html` vacío — funcionaría, pero `extra.generator: false` es más semántico y no requiere mantener un archivo de template.

**Config final**:
```yaml
extra:
  generator: false
```

---

## Decisión 4 — CSS de alineación de la fecha nativa

**Decision**: `.md-source-file { text-align: right }` en `docs/stylesheets/extra.css`

**Rationale**:
- El `<aside class="md-source-file">` renderizado por Material es un elemento de bloque; por defecto alinea su contenido a la izquierda.
- Una regla `text-align: right` propaga la alineación a los `<span class="md-source-file__fact">` internos (que son `inline-flex`).
- Mínima intervención: una línea de CSS sin nuevas clases ni selectores complejos.

**CSS final**:
```css
/* docs/stylesheets/extra.css */
.md-source-file {
  text-align: right;
}
```

**Alternatives considered**:
- Flexbox en `.md-source-file` con `justify-content: flex-end` — funcionaría, pero requiere cambiar el `display` por defecto del aside; `text-align: right` es suficiente y menos invasivo.
- Clases `.sng-footer*` con Flexbox — implementadas inicialmente para el footer custom, descartadas junto con el footer override.

---

## Decisión 5 — `custom_dir` en `mkdocs.yml`

**Decision**: `custom_dir: overrides` eliminado de `mkdocs.yml`

**Rationale**:
- La directiva se añadió durante la implementación inicial del footer custom. Al revertir el override, el directorio `overrides/` quedó vacío.
- Git no trackea directorios vacíos → el directorio no existe en el entorno de CI → `mkdocs build --strict` falla con "The path set in custom_dir does not exist".
- Al no haber ningún override activo, la directiva sobra y se eliminó.

**Alternatives considered**:
- Añadir `.gitkeep` en `overrides/` para forzar el tracking — funciona, pero mantiene una directiva activa que no hace nada; más confuso que eliminarla.

**Config final** (sin `custom_dir`):
```yaml
theme:
  name: material
  language: es
  # ... resto de config; sin custom_dir
```
