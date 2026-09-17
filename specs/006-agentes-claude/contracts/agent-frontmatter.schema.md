# Contrato — Frontmatter de `.claude/agents/spring-boot-debugger.md`

Contrato mínimo que MUST cumplir el archivo del agente committeado en
el repo. Se valida por inspección en `/speckit-implement` y en revisión
de MR.

## Estructura obligatoria

```markdown
---
name: spring-boot-debugger
description: <una línea, ≤160 chars, describe cuándo invocarlo>
model: sonnet
tools: Read, Grep, Glob, Bash, Edit
---

<prompt del sistema en Markdown>
```

## Reglas de validación

| Regla | Detalle |
|-------|---------|
| Nombre archivo | `spring-boot-debugger.md`, exactamente. |
| Frontmatter | YAML válido entre `---` delimitadores en las primeras líneas. |
| `name` | `spring-boot-debugger`, idéntico al slug del archivo. |
| `description` | Enfoca diagnóstico Spring Boot 4 + Java 21 (DTO/entidad, validación, ciclo Spring). |
| `model` | Literal `sonnet` (alias corto, no ID versión). |
| `tools` | Lista CSV exacta: `Read, Grep, Glob, Bash, Edit`. Orden fijo. |
| `isolation` | Campo ausente. |
| Body | Debe contener las cuatro secciones de proceso (ver contrato de prompt más abajo). |

## Contrato del prompt del sistema

El cuerpo del agente MUST estructurar el proceso en cuatro pasos
identificables (títulos, listas o secciones):

1. **Localizar stacktrace** — leer logs, identificar clase/línea raíz;
   si el estudiante no ha pegado el error, pedirlo explícitamente.
2. **Reproducir con test** — proponer un test JUnit (Spring Boot Test si
   procede) que falle antes del fix. Escribirlo con `Edit`.
3. **Proponer diff mínimo** — cambios localizados (Principio 3 de
   `CLAUDE.md` global), sin refactor colateral. Presentar el diff.
4. **Ejecutar tests** — invocar `./mvnw test` con `Bash`. NO cerrar la
   intervención sin salida en verde.

## Comportamiento en edge cases

- Sin proyecto CRUD compilado → pedir `./mvnw -q -DskipTests package` antes de diagnosticar.
- Bug ya resuelto localmente (no reproduce) → informar y abstenerse de diff.
- Diff propuesto rompe otro test → volver al paso 3 con test existente como restricción.

## Cómo se verifica el contrato

- Grep del frontmatter (`yq` o inspección manual) en revisión.
- Simulación en Claude Code sobre el CRUD de la spec 004 con el bug de
  NPE — cubierto por `quickstart.md`.
