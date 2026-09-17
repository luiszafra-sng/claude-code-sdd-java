# Contrato — Entrada de `docs/skills/catalogo.md`

Contrato para cada fila de la tabla del catálogo curado de skills.
Reutiliza el mismo esquema definido para el catálogo de agentes
(spec 006) para preservar consistencia.

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
| `Enlace` | URL absoluta a repo público. MUST responder `HTTP/2 200` o `HTTP/1.1 200 OK` en la fecha declarada. |
| `Verificado` | Fecha ISO `YYYY-MM-DD`. MUST ser ≤ 6 meses respecto a la fecha del último merge de la página. |

## Reglas globales

| Regla | Detalle |
|-------|---------|
| Cardinalidad | 5 ≤ N ≤ 8 filas. |
| Duplicados | Prohibidos por `Enlace`. |
| Idioma | `Nombre` y `Enlace` respetan idioma original; `Propósito` en español. |
| Ordenación | Alfabética por `Nombre`. |

## Verificación

- Comando sugerido:

  ```bash
  for url in <URLs>; do
    curl -Is "$url" | head -n 1
  done
  ```

- El merge queda bloqueado si alguna fila tiene `Verificado` con más de
  6 meses (`Development & Publishing Workflow`, constitution v1.1.0).

## Fuera de contrato

- Ratings o notas subjetivas.
- Enlaces a repos privados o gated.
- Entradas propias del propio módulo (auto-referencia; en este feature
  no aplica porque no se materializa skill alguna).
