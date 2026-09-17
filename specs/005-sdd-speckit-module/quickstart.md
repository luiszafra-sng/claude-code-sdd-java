# Phase 1 · Quickstart — Validar el módulo "SDD con Speckit"

**Feature**: `005-sdd-speckit-module`
**Date**: 2026-09-16

Escenarios de validación end-to-end que prueban que el módulo cumple sus FR y SC. Todos los comandos se ejecutan desde la raíz del repositorio formativo.

## Prerequisitos

- `uv` instalado y `uv sync` ejecutado al menos una vez en el repo.
- Repositorio con las páginas nuevas ya escritas bajo `docs/sdd/` y `mkdocs.yml` actualizado.
- Navegador moderno con JavaScript habilitado (para verificar renderizado Mermaid).

## Escenario 1 · Build sin warnings

**Objetivo**: SC-003, FR-002.

```bash
uv run mkdocs build --strict
```

**Esperado**: comando termina con exit code 0 y sin líneas `WARNING`. Si aparece cualquier warning (ficheros omitidos, enlaces rotos, anchors inválidos), fallar la validación.

## Escenario 2 · Nav publica las seis páginas

**Objetivo**: FR-001.

```bash
uv run mkdocs serve
```

Abrir `http://127.0.0.1:8000/claude-code-sdd-java/sdd/` y verificar en la barra lateral la presencia y orden de:

1. `index.md` (título de la entrada raíz del módulo)
2. `flujo.md`
3. `caso-guia.md`
4. `greenfield.md`
5. `brownfield.md`
6. `antipatrones.md`

## Escenario 3 · Diagrama Mermaid renderiza

**Objetivo**: FR-003, research §1–3.

En `http://127.0.0.1:8000/claude-code-sdd-java/sdd/flujo/`, comprobar que el bloque `flowchart LR` del ciclo Speckit se renderiza como SVG (no como bloque de texto). Verificar en la consola del navegador que Mermaid `11.4.0` (o versión fijada) se ha cargado sin errores.

## Escenario 4 · App de ejemplo intacta

**Objetivo**: SC-006, FR-014.

```bash
git diff --stat examples/ contracts/
```

**Esperado**: salida vacía. Cualquier cambio en `examples/user-crud-modern/` o `contracts/users-api.yaml` atribuible al commit del módulo debe rechazarse en revisión.

## Escenario 5 · Bloques de versión conformes

**Objetivo**: FR-005, SC-004.

```bash
grep -RE '"Versión de referencia"' docs/sdd/
```

Para cada página que cite versiones de herramientas externas, verificar manualmente que:

- Existe un bloque `!!! info "Versión de referencia"`.
- Contiene una línea `Verificado: YYYY-MM-DD` con fecha ≤ 6 meses respecto a la fecha del merge.
- Las versiones citadas coinciden con las declaradas en el bloque.

## Escenario 6 · Cross-links relativos y válidos

**Objetivo**: FR-004.

```bash
uv run mkdocs build --strict 2>&1 | grep -Ei 'link|anchor'
```

**Esperado**: sin coincidencias. `mkdocs.yml` ya tiene `validation.unrecognized_links: warn`, por lo que cualquier enlace roto rompe `--strict`.

Adicional: revisar en el HTML publicado que cada página del módulo tiene sección "Enlaces relacionados" (o justifica su ausencia en revisión).

## Escenario 7 · Estructura de página cumple contrato

**Objetivo**: FR-007 a FR-013.

Cotejar cada página contra `contracts/page-template.md`:

- `index.md`: contiene los cinco H2 obligatorios.
- `flujo.md`: pasos obligatorios y opcionales separados en secciones distintas, con H3 por comando y campos "Qué produce" / "Inputs necesarios" en cada uno.
- `caso-guia.md`: incluye aviso explícito de extractos ilustrativos + Clarifications con respuesta oficial + justificación + alternativas.
- `greenfield.md` y `brownfield.md`: cubren los H2 exigidos por el contrato.
- `antipatrones.md`: al menos 10 antipatrones, cada uno con síntoma / causa / contramedida.

## Escenario 8 · Reproducibilidad para el alumno (spot check)

**Objetivo**: SC-002.

Un revisor con Claude Code y Speckit instalados clona el repo, sigue `caso-guia.md` desde su copia local de `examples/user-crud-modern/` y ejecuta:

1. `/speckit-specify` con el prompt copiado.
2. `/speckit-clarify` verificando que las preguntas surfaceadas coinciden en tema (no textualmente) con las publicadas.
3. `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`.

**Esperado**: los artefactos generados tienen estructura equivalente a los extractos publicados. Variaciones textuales son admisibles; divergencias estructurales (secciones faltantes, orden distinto) requieren revisar el módulo.

## Escenario 9 · Antipatrones accionables

**Objetivo**: SC-005.

Lector de prueba lee `antipatrones.md` y anota:

- Antipatrón que ha cometido antes.
- Contramedida propuesta.
- Si la contramedida es aplicable a su próximo proyecto.

Registrar en el PR como evidencia.

## Salida de la validación

El módulo se considera listo para merge cuando **todos** los escenarios anteriores pasan. Los escenarios 8 y 9 son revisiones humanas; los 1–7 son automatizables (build + grep + revisión estructural).
