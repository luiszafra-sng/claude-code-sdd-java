# Antipatrones

Un `CLAUDE.md` mal redactado no falla ruidosamente: sigue funcionando,
pero degrada la calidad de las respuestas y desperdicia contexto. Esta
página lista los errores frecuentes agrupados por tipo, con ejemplo
negativo y mitigación, más los umbrales de longitud que el módulo
recomienda respetar.

## Contenido prohibido

- **Secretos incrustados** — nunca deben aparecer. Ni API keys, ni
  tokens de servicio, ni credenciales de base de datos, ni cadenas de
  conexión con contraseña. La prompt de sistema no es un lugar seguro:
  puede filtrarse en logs, en capturas o al compartir el archivo.

    ```markdown
    <!-- MAL -->
    ANTHROPIC_API_KEY=sk-ant-abc123defg
    DB_URL=jdbc:postgresql://user:s3cr3t@db.internal/prod
    ```

    Mitigación: mover a `.env` gitignoreado y referenciar por nombre
    de variable de entorno.

    ```markdown
    <!-- BIEN -->
    La API key vive en `ANTHROPIC_API_KEY` (nunca en este archivo).
    Comprobar con `test -n "$ANTHROPIC_API_KEY" && echo OK`.
    ```

- **Información volátil** — fechas concretas, versiones cambiantes,
  estado del sprint, quién lleva qué tarea. Envejece mal y confunde en
  cuanto pasa una semana.

- **Historia de commits copiada** — mensajes de PR o resúmenes de
  cambios recientes. Esa información vive en `git log`; duplicarla en
  el `CLAUDE.md` sólo aporta ruido.

- **Información sensible del cliente o del equipo** — nombres de
  cuentas privadas, códigos internos, decisiones no públicas. Un
  repositorio con `CLAUDE.md` puede acabar siendo público (open source,
  demo pública, formación). Trátalo como si fuera a mirarlo alguien de
  fuera.

## Errores de formato

- **Docstrings enormes** — párrafos de 30-40 líneas sin bullets,
  headings ni comandos. Diluyen la señal. Prefiere listas cortas,
  encabezados navegables y bloques de código.

- **Reglas contradictorias** — "MUST responder corto" y "MUST explicar
  detalladamente cada paso" en la misma sección. Consolida en una
  sola regla o explica cuándo se aplica cada una.

- **Ausencia de criterios de aceptación** — "el código MUST ser
  limpio" no dice nada verificable. Sustituye por regla observable
  ("las funciones MUST tener ≤ 25 líneas efectivas y NEVER incluir
  código comentado"). Ver [buenas prácticas](buenas-practicas.md) para
  el patrón completo.

- **`should` vago en lugar de `MUST` / `NEVER`** — "sería bueno que…"
  se interpreta como aspiración, no como restricción. Si algo debe
  cumplirse, escríbelo con imperativo observable.

## Umbrales de longitud

Un `CLAUDE.md` demasiado largo diluye el contexto útil: la prompt de
sistema tiene un peso finito y cada línea de más resta atención al
resto de la conversación. Umbrales recomendados por el módulo:

- **Techo orientativo — 200 líneas útiles**. Por debajo, casi todo
  encaja bien. Entre 200 y 500, se admite si hay muchas tablas o
  ejemplos.
- **Aviso duro — 500 líneas totales**. Por encima, el contenido casi
  siempre debería vivir en otra parte: páginas dedicadas dentro de
  `docs/`, `README.md` para audiencia humana, agentes o skills para
  comportamientos específicos.

Regla operativa para contar "líneas útiles":

- **Cuenta** cualquier línea de texto o encabezado fuera de un bloque
  de código.
- **NO cuenta** el contenido dentro de bloques de código delimitados
  por triple backtick, las líneas de tablas Markdown (`| … | … |`) ni
  las líneas dentro de bloques `!!! …`.

Ejemplo aproximado con `awk`:

```bash
useful=$(awk '/^```/ { in_fence = !in_fence; next }
              in_fence { next }
              { print }' CLAUDE.md | wc -l)
total=$(wc -l < CLAUDE.md)
echo "útiles=$useful · totales=$total"
```

Si `útiles > 200` o `totales ≥ 500`, revisa qué se puede mover a otra
parte antes de aceptar el archivo.

## Cómo auditar un CLAUDE.md

Checklist rápido para revisar un `CLAUDE.md` (propio o ajeno):

- [ ] **Secretos**: `grep -E 'sk-[A-Za-z0-9]+|AKIA[0-9A-Z]{16}|-----BEGIN'
      CLAUDE.md` no devuelve ninguna línea.
- [ ] **Contraseñas en URLs**: `grep -E '://[^:]+:[^@]+@' CLAUDE.md` no
      devuelve nada.
- [ ] **Fechas concretas**: `grep -oE '20[0-9]{2}-[0-9]{2}-[0-9]{2}'
      CLAUDE.md` sólo devuelve el sello temporal esperado (por
      ejemplo, `Redactado en 2026-09`), no fechas de tareas o sprints.
- [ ] **Reglas ejecutables**: `grep -c '\<MUST\>\|\<NEVER\>\|\<SHOULD\>'
      CLAUDE.md ≥ 5`. Si no hay ni una restricción imperativa
      observable, el archivo está en modo aspiracional.
- [ ] **Umbrales de longitud**: `awk` de arriba dentro de límites (200
      útiles / 500 totales).
- [ ] **Coherencia usuario ↔ proyecto**: si existe también un
      `~/.claude/CLAUDE.md`, revisar que las reglas no se contradicen.
      Si se contradicen, [gana la capa proyecto](index.md#precedencia-entre-capas)
      pero conviene explicitar la contradicción o resolverla.
- [ ] **Enlaces externos**: los enlaces del `CLAUDE.md` que apuntan
      fuera del repo (documentación oficial, guías) responden 200.

Cuando el checklist queda en verde, el archivo es apto para
publicarse. Si algún ítem falla, hay que corregirlo antes de mergear.

[← Buenas prácticas](buenas-practicas.md) · [Volver al índice del módulo](index.md)
