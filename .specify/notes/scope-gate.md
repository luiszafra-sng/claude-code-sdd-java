# Scope Gate — spec 005 (Módulo SDD con Speckit)

Verificaciones obligatorias antes de mergear el módulo. Automatizables con los comandos siguientes; deben ejecutarse desde la raíz del repositorio.

## SC-006 — App de ejemplo y contract API intactos

```bash
git diff --stat examples/ contracts/
```

Esperado: **salida vacía** en el diff atribuible al commit del módulo. Cualquier línea implica revisión y probable rechazo.

## FR-015 — No hay ciclo Speckit ejecutable dentro de la app

```bash
find examples/user-crud-modern/.specify -type f 2>/dev/null
find examples/user-crud-modern/specs -type f 2>/dev/null
```

Esperado: **ambas salidas vacías**. El caso guía sólo debe existir como extractos ilustrativos en `docs/sdd/` (y anexos en `docs/sdd/artefactos/` si se han creado).

## SC-003 — Build sin warnings

```bash
uv run mkdocs build --strict
```

Esperado: **exit code 0**, sin líneas `WARNING`.

## SC-004 — Bloques de versión frescos

```bash
grep -R '"Versión de referencia"' docs/sdd/
```

Para cada resultado, la línea `Verificado: YYYY-MM-DD` debe tener fecha ≤ 6 meses respecto a la fecha del merge.

## Gate

Si alguna verificación falla, el PR queda bloqueado hasta corregir. Anexar salida de los comandos al PR como evidencia.
