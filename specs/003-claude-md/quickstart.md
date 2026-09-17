# Phase 1 Quickstart: Módulo "CLAUDE.md: usuario y proyecto"

**Feature**: 003-claude-md
**Date**: 2026-09-16

Guía runnable para validar el módulo end-to-end en local. Reduce
aceptación a comandos ejecutables + revisiones manuales guiadas.

---

## Prerrequisitos

- Repo clonado, `uv sync` ejecutado (heredado spec 001).
- `uv run mkdocs serve` operativo.
- Placeholder actual `docs/claude-md/index.md` existe (creado en spec
  001).

## Escenario 1 — Build estricta sigue en verde (SC-005)

Tras publicar las 5 páginas del módulo + `CLAUDE.md` en la raíz +
actualizar `mkdocs.yml`:

```bash
rm -rf site/
uv run mkdocs build --strict
```

Aceptación:

- Exit code `0`.
- Cero líneas `WARNING`.
- HTMLs presentes:

```bash
for slug in index usuario proyecto buenas-practicas antipatrones; do
  p="site/claude-md/${slug}/index.html"
  [ "$slug" = "index" ] && p="site/claude-md/index.html"
  test -f "$p" && echo "OK  $p" || echo "MISS $p"
done
```

## Escenario 2 — Estructura fija de secciones H2 (FR-002 a FR-006)

Para cada página, comprobar que aparecen sus H2 canónicos:

```bash
echo "=== index.md ==="
grep -E '^## ' docs/claude-md/index.md
echo "=== usuario.md ==="
grep -E '^## ' docs/claude-md/usuario.md
echo "=== proyecto.md ==="
grep -E '^## ' docs/claude-md/proyecto.md
echo "=== buenas-practicas.md ==="
grep -E '^## ' docs/claude-md/buenas-practicas.md
echo "=== antipatrones.md ==="
grep -E '^## ' docs/claude-md/antipatrones.md
```

Aceptación: cada salida contiene los H2 declarados en
`data-model.md` §"Secciones por página".

## Escenario 3 — Comparativa Antes / Después / Qué cambió (FR-007, SC-003)

```bash
grep -c '^### Antes$' docs/claude-md/buenas-practicas.md
grep -c '^### Después$' docs/claude-md/buenas-practicas.md
grep -c '^### Qué cambió$' docs/claude-md/buenas-practicas.md
```

Aceptación: cada grep devuelve exactamente `1`.

Verificar que la sección "Qué cambió" tiene ≥ 3 diferencias:

```bash
awk '/^### Qué cambió$/,/^## |^### /{ if ($0 ~ /^### Qué cambió$/) f=1; else if ($0 ~ /^## |^### [^Q]/) f=0; else if (f && $0 ~ /^- /) print }' \
  docs/claude-md/buenas-practicas.md | wc -l
```

Aceptación: ≥ 3.

## Escenario 4 — Snippets copiables completos (FR-008)

```bash
echo "=== usuario snippet ==="
grep -c '^```markdown$' docs/claude-md/usuario.md
echo "=== proyecto snippets ==="
grep -c '^```markdown$' docs/claude-md/proyecto.md
```

Aceptación:
- `usuario.md` contiene al menos 1 bloque `\`\`\`markdown`.
- `proyecto.md` contiene al menos 2 bloques `\`\`\`markdown` (Spring
  Boot 4 y Spring Boot 2.7 legacy).

## Escenario 5 — `CLAUDE.md` vivo en la raíz del repo (FR-008a)

```bash
test -f CLAUDE.md && echo "root CLAUDE.md OK" || echo "MISS root CLAUDE.md"
useful=$(grep -vE '^```|^\s*\|' CLAUDE.md | wc -l | tr -d ' ')
total=$(wc -l < CLAUDE.md | tr -d ' ')
echo "useful=$useful total=$total"
test "$useful" -le 200 && echo "useful ≤ 200 OK" || echo "useful > 200 FAIL"
test "$total" -lt 500 && echo "total < 500 OK" || echo "total ≥ 500 FAIL"
grep -qF 'Redactado en 2026-09' CLAUDE.md && echo "sello temporal OK" || echo "sello MISSING"
grep -qF '../CLAUDE.md' docs/claude-md/proyecto.md \
  && echo "enlace desde proyecto.md OK" \
  || echo "enlace desde proyecto.md MISSING"
```

Aceptación: todos los checks OK.

## Escenario 6 — Sello temporal en snippets del sitio (FR-014)

```bash
for f in docs/claude-md/usuario.md docs/claude-md/proyecto.md; do
  count=$(grep -c 'Redactado en 2026-09' "$f")
  echo "$f: $count"
done
```

Aceptación:
- `usuario.md` ≥ 1.
- `proyecto.md` ≥ 2 (uno por snippet).

## Escenario 7 — Umbrales de longitud documentados (FR-006, Clarifications Q5)

```bash
grep -E '200|500' docs/claude-md/antipatrones.md | head -5
grep -qE '200 líneas útiles' docs/claude-md/antipatrones.md \
  && echo "techo 200 OK" || echo "techo 200 MISSING"
grep -qE '500 líneas totales' docs/claude-md/antipatrones.md \
  && echo "aviso 500 OK" || echo "aviso 500 MISSING"
```

Aceptación: ambos umbrales aparecen literalmente.

## Escenario 8 — Precedencia usuario ↔ proyecto documentada (FR-002, Clarifications Q1)

```bash
grep -q 'Precedencia entre capas' docs/claude-md/index.md \
  && echo "subsección OK" || echo "subsección MISSING"
grep -q 'proyecto gana' docs/claude-md/index.md \
  && echo "regla OK" || echo "regla MISSING"
```

Aceptación: ambos OK.

## Escenario 9 — Cross-links (FR-009, FR-010, FR-011)

```bash
# Setup enlaza a CLAUDE.md
grep -q 'claude-md/index.md' docs/setup/index.md \
  && echo "setup → claude-md OK" || echo "setup → claude-md MISSING"

# CLAUDE.md enlaza a SDD (placeholder)
grep -qE 'sdd/index.md|../sdd/' docs/claude-md/index.md \
  && echo "claude-md → sdd (index) OK" || echo "MISSING"
grep -qE 'sdd/index.md|../sdd/' docs/claude-md/buenas-practicas.md \
  && echo "claude-md → sdd (buenas-practicas) OK" || echo "MISSING"

# Todas las páginas hijas enlazan a index.md del módulo
for slug in usuario proyecto buenas-practicas antipatrones; do
  grep -qE 'index\.md|\./index' docs/claude-md/${slug}.md \
    && echo "${slug} → index OK" || echo "${slug} → index MISSING"
done
```

Aceptación: todos los enlaces OK.

## Escenario 10 — Aterrizaje directo <90 s a "reglas ejecutables" (SC-006)

Cronometrado manual: con `uv run mkdocs serve` corriendo, arrancar
cronómetro en la home y navegar hasta la subsección "Reglas ejecutables
por el LLM" de `docs/claude-md/buenas-practicas.md`. Prohibido usar el
buscador.

Aceptación: ≤ 90 segundos.

## Escenario 11 — Revisión de tono y plausibilidad (SC-004)

Revisión manual por personas del equipo. Cada revisor:

1. Lee `index.md` + una página al azar de las hermanas.
2. Lee la comparativa Antes / Después completa.

Responden sí/no a:
- "¿El tono respeta el Principio I de la constitution 1.0.2
  (profesional y directo, sin argot)?"
- "¿El ejemplo 'Antes' es plausible (algo que un equipo real podría
  producir), no una caricatura?"

Aceptación estándar: **5 de 5** sí en cada pregunta. **Soft-gate**: 3
de 3 admitido con sample size documentado.

## Escenario 12 — Cronómetros pedagógicos (SC-001, SC-002)

- **SC-001 (< 10 min entender capas)**: pedir a un participante sin
  contexto que lea `index.md` + `usuario.md`. Al terminar, debe
  explicar la diferencia entre capa usuario y capa proyecto y la
  precedencia. Cronometrar tiempo de lectura + explicación.
- **SC-002 (< 15 min redactar un `CLAUDE.md`)**: pedir a un
  participante que use el snippet de Spring Boot 4 como plantilla y
  adapte 3–5 líneas a un proyecto real hipotético. Cronometrar
  desde "copiar snippet" hasta "archivo guardado".

Aceptación estándar: cronómetros ≤ 10 min y ≤ 15 min respectivamente.
**Soft-gate**: una única medición documentando participante y contexto.

## Definition of Done local

Antes de mergear la spec 003:

- [ ] Escenarios 1 a 9 automatizables pasan.
- [ ] Escenarios 10, 11, 12 manuales cerrados (con soft-gate si aplica).
- [ ] `uv run mkdocs build --strict` verde.
- [ ] 5 páginas nuevas / actualizadas bajo `docs/claude-md/`.
- [ ] `mkdocs.yml` con nav "CLAUDE.md" anidada (5 hijos).
- [ ] `CLAUDE.md` en la raíz del repo con ≤ 200 líneas útiles y sello
  `Redactado en 2026-09`.
- [ ] Enlaces desde `docs/setup/index.md` y hacia `docs/sdd/index.md`
  (placeholder) en su sitio.
