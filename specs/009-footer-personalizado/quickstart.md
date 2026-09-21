# Quickstart: Validación de la fecha de revisión por página

**Feature**: 009-footer-personalizado | **Date**: 2026-09-21

Guía de validación end-to-end para verificar que la fecha de revisión y la supresión del texto del generador funcionan correctamente.

---

## Prerrequisitos

- Entorno Python activo con `uv sync` ejecutado (incluye `mkdocs-git-revision-date-localized-plugin`).
- Repositorio con historial git completo (no shallow clone).
- Al menos una página con commits en el historial.

---

## Escenario 1 — Build sin warnings (SC-003)

```bash
uv run mkdocs build --strict
```

**Resultado esperado**: Salida termina con `INFO - Documentation built in X.XX seconds` sin líneas `WARNING`.

---

## Escenario 2 — Fecha visible al final del contenido (SC-001, FR-001, FR-002)

```bash
uv run mkdocs serve
```

1. Abrir `http://127.0.0.1:8000/claude-code-sdd-java/` en el navegador.
2. Navegar a cualquier página (p. ej. `Setup del entorno → Claude Code`).
3. Desplazarse al final del contenido del artículo (antes de la navegación anterior/siguiente).

**Resultado esperado**:
- Aparece el icono de reloj (⏱) seguido de la fecha en español largo ("17 de septiembre de 2026").
- La fecha está alineada a la derecha del área de contenido.
- No aparece logo de Sngular en el pie (se usa footer nativo de Material).

---

## Escenario 3 — Fecha correcta por página (SC-002)

```bash
# Obtener la fecha del último commit de una página concreta
git log -1 --format="%ci" docs/setup/claude-code.md
```

1. Anotar la fecha devuelta (p. ej. `2026-09-16 10:30:00 +0200`).
2. Abrir `http://127.0.0.1:8000/claude-code-sdd-java/setup/claude-code/` en el navegador.
3. Verificar que al final del contenido aparece exactamente esa fecha en español largo.

**Resultado esperado**: La fecha mostrada coincide con la del `git log`, formateada como "16 de septiembre de 2026".

---

## Escenario 4 — No aparece el texto del generador (SC-004)

```bash
grep -r "Made with Material" site/ || echo "OK: texto no encontrado"
```

**Resultado esperado**: `OK: texto no encontrado`

---

## Escenario 5 — Fallback sin historial git (FR-004)

1. Crear un archivo temporal sin commits:
   ```bash
   echo "# Test" > docs/test-sin-commit.md
   ```
2. Añadir el archivo a `not_in_nav` en `mkdocs.yml` temporalmente y hacer build:
   ```bash
   uv run mkdocs build --strict
   ```
3. Verificar que el build **no emite warnings** y la página muestra la fecha de build.
4. Eliminar el archivo temporal y revertir `mkdocs.yml`.

**Resultado esperado**: Build limpio; fecha válida mostrada (la de build).

---

## Criterios de aceptación completos

| Criterio | Comando / Acción | Pasa si... |
|----------|-----------------|------------|
| SC-001 | Inspección visual 5 páginas | Todas muestran fecha al final del contenido |
| SC-002 | `git log` vs fecha en página | Fechas coinciden |
| SC-003 | `mkdocs build --strict` | Cero warnings |
| SC-004 | `grep "Made with Material" site/` | Sin resultados |
| FR-005 | `cat pyproject.toml` | `mkdocs-git-revision-date-localized-plugin==1.6.0` |
