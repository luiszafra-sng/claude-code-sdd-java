# Phase 1 Quickstart: Módulo "Setup del entorno"

**Feature**: 002-setup-entorno
**Date**: 2026-09-16

Guía runnable para validar el módulo end-to-end en local. Reduce el
esfuerzo de aceptación a comandos ejecutables + revisiones manuales
guiadas.

Los detalles de decisiones técnicas están en `research.md` y
`data-model.md`.

---

## Prerrequisitos

- Repo clonado, `uv sync` ejecutado (heredado de spec 001).
- `.venv/` operativa. `uv run mkdocs serve` funcional (verificable con
  `uv run mkdocs --version`).

## Escenario 1 — Build estricta sigue en verde (SC-005)

Tras publicar las 7 páginas y actualizar `mkdocs.yml`:

```bash
uv run mkdocs build --strict
```

Aceptación:
- Exit code `0`.
- Cero líneas `WARNING`.
- `site/setup/index.html`, `site/setup/sdkman/index.html`,
  `site/setup/claude-code/index.html`, `site/setup/rtk/index.html`,
  `site/setup/caveman/index.html`, `site/setup/codegraph/index.html`,
  `site/setup/verificacion/index.html` presentes.

Verificación shell:

```bash
for f in site/setup/index.html site/setup/sdkman/index.html \
         site/setup/claude-code/index.html site/setup/rtk/index.html \
         site/setup/caveman/index.html site/setup/codegraph/index.html \
         site/setup/verificacion/index.html; do
  test -f "$f" && echo "OK  $f" || echo "MISS $f"
done
```

## Escenario 2 — Estructura fija de 5 secciones (FR-003)

Para cada página de herramienta:

```bash
for slug in sdkman claude-code rtk caveman codegraph; do
  echo "=== $slug ==="
  grep -E '^## ' docs/setup/${slug}.md
done
```

Aceptación: las cinco primeras `##` de cada página coinciden con:

1. `## Qué es y qué problema resuelve`
2. `## Cómo instalar`
3. `## Verificación`
4. `## Cuándo usarlo`
5. `## Gotchas y troubleshooting`

## Escenario 3 — Bloque "versión de referencia + fecha" (FR-015)

```bash
for slug in sdkman claude-code rtk caveman codegraph; do
  echo "=== $slug ==="
  grep -E 'Verificado el [0-9]{4}-[0-9]{2}-[0-9]{2}' docs/setup/${slug}.md \
    || echo "MISSING reference block"
done
```

Aceptación: cinco coincidencias, formato ISO. Todas las fechas ≤ hoy y a
menos de 6 meses.

## Escenario 4 — Métodos de instalación exhaustivos para RTK / Caveman / CodeGraph (FR-004a)

```bash
for slug in rtk caveman codegraph; do
  echo "=== $slug ==="
  grep -cE '^### ' docs/setup/${slug}.md
done
```

Aceptación: cada página tiene ≥ 2 sub-secciones bajo "Cómo instalar"
(métodos alternativos). Además, la tabla comparativa debe existir:

```bash
for slug in rtk caveman codegraph; do
  grep -E '\|.*método.*\|.*requisitos.*\|.*velocidad.*\|' docs/setup/${slug}.md \
    || echo "MISSING comparativa table in $slug"
done
```

## Escenario 5 — Nota Bash ↔ Zsh única (Clarifications Q1)

```bash
grep -c "~/.zshrc" docs/setup/index.md
grep -RcE "~/\.zshrc" docs/setup/*.md | grep -v 'index.md'
```

Aceptación: `docs/setup/index.md` menciona `~/.zshrc` (nota de
equivalencia). Ninguna otra página del módulo lo menciona (una nota
única).

## Escenario 6 — Checklist de verificación con trazabilidad (SC-003)

```bash
grep -cE '^- \[ \]' docs/setup/verificacion.md
grep -E '^- \[ \]' docs/setup/verificacion.md | grep -vE '\[.*\]\([^)]+\)' \
  && echo "FAIL: hay items sin enlace" || echo "OK: todos los items enlazan"
```

Aceptación: al menos 7 items (≥1 por herramienta más Java + Maven + RTK
hook), y **todos** los items incluyen un enlace Markdown a la subsección
correspondiente.

## Escenario 7 — Aterrizaje directo <60 s (SC-006)

Cronometrado manual: arrancar el sitio (`uv run mkdocs serve`), abrir la
home, y desde ahí navegar hasta encontrar el comando exacto de
verificación de RTK.

Aceptación: tiempo ≤ 60 s siguiendo únicamente la navegación (sin usar el
buscador).

## Escenario 8 — Máquina limpia < 30 min (SC-001)

Sobre macOS 13+ o Ubuntu 22.04+ **sin** SDKMAN / JDK / Claude Code / RTK
/ Caveman / CodeGraph preinstalados:

1. Abrir el sitio publicado.
2. Seguir el orden recomendado del `index.md`.
3. Ejecutar cada bloque copy-paste sin editar (salvo credenciales /
   rutas explícitamente marcadas).
4. Terminar con el checklist de `verificacion.md` en verde.

Aceptación: cronómetro ≤ 30 min. Reportar en la revisión de aceptación.

## Escenario 9 — Registro de tono profesional-directo (SC-004)

Revisión manual por 5 personas del equipo. Cada revisor lee el `index.md`
+ una página de herramienta al azar y responde `sí/no` a: "¿el tono
respeta el Principio I de la constitution 1.0.2 (profesional y directo,
sin argot ni frases coloquiales)?".

Aceptación: 5 de 5 respuestas positivas.

## Definition of Done local

Antes de mergear la spec 002:

- [ ] Los 8 escenarios anteriores pasan.
- [ ] `uv run mkdocs build --strict` verde.
- [ ] `mkdocs.yml` actualizado con la sección anidada.
- [ ] `docs/setup/index.md` reemplaza al placeholder actual.
- [ ] 6 páginas nuevas creadas y navegables.
- [ ] Cada página de herramienta tiene bloque "versión + fecha" con
  `verified_at = 2026-09-16` (fecha inicial).
- [ ] RTK, Caveman, CodeGraph tienen tabla comparativa + ≥ 2 métodos de
  instalación cada una.
- [ ] Checklist final con enlaces a troubleshooting.
