# Matriz de cross-links por página (spec 005)

Cada celda indica si la página de origen debe enlazar al módulo destino en su sección "Enlaces relacionados". `R` = recomendado, `O` = opcional (según relevancia), `—` = no necesario.

| Página origen \ Destino | setup | claude-md | app-ejemplo | agentes | skills |
|---|---|---|---|---|---|
| `index.md`          | R | R | R | O | O |
| `flujo.md`          | R | R | R | O | O |
| `caso-guia.md`      | R | O | R | O | O |
| `greenfield.md`     | R | R | O | R | R |
| `brownfield.md`     | R | R | R | R | R |
| `antipatrones.md`   | O | R | O | O | O |

## Notas

- Cross-links siempre relativos: `../<modulo>/index.md`.
- Sección "Enlaces relacionados" al pie, después del contenido principal.
- Si una fila queda con todo `O`, el autor decide en revisión.
- La página de origen no se enlaza a sí misma.
