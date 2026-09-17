# Quickstart — Validación end-to-end del feature

Guía de verificación mínima para confirmar que el módulo Agentes y el
agente `spring-boot-debugger` funcionan tal como exige la spec. NO
sustituye a `tasks.md` (Fase 2).

## Prerequisitos

- Repo clonado en local, rama `006-agentes-claude` activa.
- `uv` instalado; ejecutar `uv sync` una vez.
- SDKMAN con JDK 21 y Maven según `.sdkmanrc` del CRUD (spec 004).
- Claude Code CLI reciente con soporte de `.claude/agents/`.
- App CRUD (`examples/user-crud-modern` o equivalente de la spec 004)
  compilable en local; bug NPE presente e intencionado.

## Validación 1 — Docs se construyen sin warnings

```bash
uv run mkdocs build --strict
```

**Expectativa**: sale con código 0 y sin mensajes `WARNING`.

Verifica adicionalmente en `site/agentes/` que existen las seis páginas.

## Validación 2 — Nav renderiza el módulo Agentes

```bash
uv run mkdocs serve
```

Abrir `http://127.0.0.1:8000/claude-code-sdd-java/agentes/`.

**Expectativa**: el módulo "Agentes" aparece en la barra lateral con
seis entradas (`Introducción`, `Anatomía`, `Memoria y modelos`,
`Alcance`, `Catálogo`, `Crear uno`), en orden, entre "CLAUDE.md" y
"SDD (Speckit)".

## Validación 3 — Frontmatter del agente cumple contrato

```bash
head -n 10 .claude/agents/spring-boot-debugger.md
```

**Expectativa**: bloque YAML con `name: spring-boot-debugger`,
`model: sonnet`, `tools: Read, Grep, Glob, Bash, Edit`, sin campo
`isolation`. Contrato completo en
`contracts/agent-frontmatter.schema.md`.

## Validación 4 — Invocación del agente sobre el bug del CRUD

1. Levantar el CRUD según su README y provocar el NPE (crear usuario
   con payload que incluya `email`).
2. Pegar el stacktrace en Claude Code y pedir explícitamente:
   `Usa el agente spring-boot-debugger para diagnosticar este error.`
3. Observar la secuencia esperada:
   - Localización del stacktrace (clase + línea).
   - Test JUnit propuesto que reproduce el fallo.
   - Diff mínimo sugerido (SIN ejecutar el fix definitivo — queda como
     ejercicio guiado).
   - Ejecución de `./mvnw test` en el módulo del CRUD.

**Expectativa**: agente completa el ciclo en una única pasada sin
requerir orientación extra del estudiante (SC-005).

## Validación 5 — Catálogo verificable

Para cada fila de `docs/agentes/catalogo.md`:

```bash
curl -Is "<URL de la columna Enlace>" | head -n 1
```

**Expectativa**: cabecera `HTTP/2 200` (o `HTTP/1.1 200 OK`). Fecha en
columna `Verificado` no supera 6 meses de antigüedad.

## Validación 6 — Fuera de alcance respetado

```bash
grep -R -n "skills/" docs/agentes/ && echo "FAIL: contiene skills" || echo "OK"
grep -R -n "@Transactional" docs/agentes/crear-uno.md && echo "REVISAR: podría estar detallando fix" || echo "OK"
```

**Expectativa**: primer comando NO encuentra `skills/`; el segundo no
revela el fix definitivo del bug.

## Criterios de aceptación agregados

- Todas las validaciones (1–6) pasan.
- Checklist `checklists/requirements.md` conserva 16/16 items marcados.
- Constitution v1.0.2 respetada (revisión visual del MR con los
  principios listados en `plan.md`).
