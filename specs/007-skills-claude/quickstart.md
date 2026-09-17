# Quickstart — Validación end-to-end del feature

Guía mínima para confirmar que el módulo Skills cumple la spec. NO
sustituye a `tasks.md` (Fase 2).

## Prerequisitos

- Repo clonado; rama `007-skills-claude` activa.
- `uv sync` ejecutado.
- Sin cambios pendientes en `.claude/skills/` (este feature NO añade
  nada ahí).

## Validación 1 — Docs se construyen sin warnings

```bash
uv run mkdocs build --strict
```

**Expectativa**: código 0, sin `WARNING`. Existe `site/skills/` con
las cinco páginas construidas.

## Validación 2 — Nav renderiza el módulo Skills

```bash
uv run mkdocs serve
```

Abrir `http://127.0.0.1:8000/claude-code-sdd-java/skills/`.

**Expectativa**: el módulo "Skills" aparece en la barra lateral con
cinco entradas (`Introducción`, `Anatomía`, `Alcance`, `Catálogo`,
`Crear una`), en orden, entre "Agentes" y "SDD con Speckit".

## Validación 3 — Contenido de las páginas

Comprobar por inspección visual:

- `index.md`: definición, cuándo usar, tabla comparativa skill vs
  agente (al menos filas "qué es" y "cuándo se dispara").
- `anatomia.md`: estructura de una skill (`SKILL.md`, scripts, assets),
  triggers admitidos y mecanismo de invocación.
- `alcance.md`: tabla usuario vs proyecto, referencia a plugins, cómo
  listar las skills disponibles.
- `catalogo.md`: tabla con 5–8 filas verificadas conforme al contrato
  `contracts/catalog-entry.schema.md`.
- `crear-una.md`: paso a paso teórico, ejemplo ilustrativo aplicado al
  CRUD, aviso visible de "material didáctico, ninguna skill se
  materializa en el repo", enlaces cruzados a Agentes y SDD.

## Validación 4 — Catálogo verificable

Para cada fila de `docs/skills/catalogo.md`:

```bash
curl -Is "<URL>" | head -n 1
```

**Expectativa**: `HTTP/2 200` o `HTTP/1.1 200 OK`. Fecha en `Verificado`
no supera 6 meses de antigüedad.

## Validación 5 — Fuera de alcance respetado

```bash
find .claude/skills -type f 2>/dev/null | grep . && echo "FAIL: skills materializadas" || echo "OK"
grep -R -inE "gitlab-ci|github actions|pipeline ci" docs/skills/ && echo "REVISAR: podría estar detallando CI/CD" || echo "OK"
```

**Expectativa**: primero NO devuelve nada; segundo tampoco.

## Validación 6 — Constitution v1.1.0 respetada

Comprobar por revisión del MR que:

- El bloque "Constitution Check" del `plan.md` marca PASS en los seis
  principios.
- La spec y el plan mencionan Constitution v1.1.0.
- El principio V se lee "agente propio MUST + skill propia SHOULD".

## Criterios de aceptación agregados

- Validaciones 1–6 pasan.
- Checklist `checklists/requirements.md` conserva 16/16 items.
- Nav position (entre Agentes y SDD) queda verificada.
