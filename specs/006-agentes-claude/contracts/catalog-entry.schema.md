# Contrato — Entrada de `docs/agentes/catalogo.md`

Contrato para cada fila de la tabla del catálogo curado.

## Estructura de la tabla

```markdown
| Nombre | Autor | Propósito | Enlace | Verificado |
|--------|-------|-----------|--------|------------|
| <nombre> | <autor> | <propósito ≤120 chars> | <URL absoluta> | YYYY-MM-DD |
```

## Reglas por fila

| Campo | Regla |
|-------|-------|
| `Nombre` | Título corto (≤40 chars). |
| `Autor` | Persona u organización visible en el repo de origen. |
| `Propósito` | Frase declarativa; sin marketing ni superlativos ("robusto", "increíble" — vetados). |
| `Enlace` | URL absoluta a repo público. MUST responder HTTP 200 en `Verificado`. |
| `Verificado` | Fecha ISO `YYYY-MM-DD`. MUST ser ≤ 6 meses respecto a la fecha del último merge de la página. |

## Reglas globales

| Regla | Detalle |
|-------|---------|
| Cardinalidad | 5 ≤ N ≤ 8 filas. |
| Duplicados | Prohibidos por `Enlace`. |
| Idioma | `Nombre` y `Enlace` respetan idioma original; `Propósito` en español. |
| Ordenación | Alfabética por `Nombre` para lectura determinista. |

## Verificación

- Comando sugerido para CI opcional:

  ```bash
  awk -F'|' '/^\|/ && NR>2 {print $5}' docs/agentes/catalogo.md \
    | tr -d ' ' \
    | grep -v '^Enlace$' \
    | xargs -I{} curl -Is {} | grep -E '^HTTP/'
  ```

- El merge queda bloqueado si alguna fila tiene `Verificado` con más de
  6 meses (`Development & Publishing Workflow`, constitution 1.0.2).

## Fuera de contrato

- Ratings o notas subjetivas.
- Enlaces a repos privados o gated.
- Entradas propias del propio módulo (auto-referencia al `spring-boot-debugger`).
