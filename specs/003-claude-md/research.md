# Phase 0 Research: Módulo "CLAUDE.md: usuario y proyecto"

**Feature**: 003-claude-md
**Date**: 2026-09-16

Todas las `NEEDS CLARIFICATION` de la spec fueron resueltas en la
sesión de `/speckit-clarify` del 2026-09-16 (5 preguntas). Este
documento consolida las decisiones técnicas de implementación con
racional y alternativas descartadas.

---

## 1. Precedencia entre capas usuario y proyecto

- **Decision**: `index.md` documenta que ambas capas de `CLAUDE.md` se
  componen en la prompt de sistema — usuario primero, proyecto después
  — y que ante contradicción efectiva **la capa proyecto gana** por
  orden de aplicación y por especificidad. Ejemplo mínimo en la propia
  página: usuario declara "responde en inglés"; proyecto declara
  "responde en español" → proyecto gana.
- **Rationale**: Clarifications Q1. Coincide con el comportamiento
  documentado por Anthropic para Claude Code y con la intuición
  operativa (el contexto más específico manda).
- **Alternatives considered**: usuario gana (protege preferencias
  personales pero rompe cuando el equipo estandariza en un repo);
  no fijar precedencia (deja a la audiencia sin respuesta a la pregunta
  operativa más frecuente).

## 2. Estructura del módulo (cinco páginas)

- **Decision**: cinco páginas Markdown bajo `docs/claude-md/` en este
  orden:
  1. `index.md` — qué es, dónde vive, precedencia, cuándo se lee.
  2. `usuario.md` — qué meter a nivel usuario + snippet vivo completo.
  3. `proyecto.md` — qué meter a nivel proyecto + dos snippets
     (Spring Boot 4 + Java 21 moderno / Spring Boot 2.7 + Java 8
     legacy) + enlace al `CLAUDE.md` vivo del repo.
  4. `buenas-practicas.md` — reglas ejecutables + comparativa
     Antes/Después/Qué cambió.
  5. `antipatrones.md` — qué NO meter + umbrales de longitud (200
     útiles / 500 totales).
- **Rationale**: FR-001, FR-011. Orden pedagógico "qué es → dónde
  ponerlo → cómo ponerlo bien → qué evitar".

## 3. Snippet legacy — versión de Java

- **Decision**: Spring Boot 2.7 + **Java 8** (Clarifications Q4). El
  snippet refleja convenciones típicas:
  - `javax.*` (no `jakarta.*`).
  - Maven como build system, `mvn` como comando.
  - Sin `record`, sin `var`, sin patrones modernos (`sealed`,
    `switch` moderno, etc.).
  - Streams, `Optional`, lambdas están presentes (Java 8 los introduce).
  - Nota de deuda técnica: migración pendiente a Jakarta EE 9+ /
    Spring Boot 3+, ausencia de módulos JPMS.
- **Rationale**: máximo contraste pedagógico con el snippet moderno
  (Java 21) y refleja el escenario más antiguo real todavía activo en
  clientes.
- **Alternatives considered**: Java 11 (menos contraste), Java 17
  (demasiado cercano al moderno; pierde valor didáctico), documentar
  las tres (multiplica contenido sin ganancia clara).

## 4. Formato de la comparativa "Antes / Después"

- **Decision**: en `buenas-practicas.md`, tres subsecciones H3
  consecutivas con títulos literales (Clarifications Q3):
  - `### Antes` — bloque `markdown` completo del `CLAUDE.md` pobre.
  - `### Después` — bloque `markdown` completo del `CLAUDE.md`
    mejorado.
  - `### Qué cambió` — lista con **al menos 3 diferencias** que
    identifican "qué se mejoró" y "por qué".
  Los bloques `Antes` y `Después` deben tener longitud comparable para
  que la comparación no dependa del tamaño.
- **Rationale**: renderiza bien en cualquier ancho, no depende de
  `pymdownx.tabbed`, es auditable por `grep` (`### Antes`, `###
  Después`, `### Qué cambió`).
- **Alternatives considered**: pestañas (dependencia visual), tabla
  side-by-side (columnas estrechas corrompen los bloques de código),
  diff `git`-style (menos legible para audiencia mixta).

## 5. `CLAUDE.md` vivo en la raíz del repositorio

- **Decision**: publicar `CLAUDE.md` en la raíz del repositorio como
  parte de este módulo (FR-008a, Clarifications Q2). Contenido:
  - Contexto del repo: sitio de formación MkDocs, gestionado con `uv`,
    con Spec-Driven Development como método de trabajo.
  - Convenciones: Bash canónica en snippets, español en contenido,
    términos técnicos en su idioma original.
  - Comandos: `uv sync`, `uv run mkdocs serve`, `uv run mkdocs build
    --strict`, cómo añadir páginas y dependencias.
  - Restricciones para Claude: no crear docs no pedidos, no tocar
    `docs/stylesheets/extra.css` desde otras páginas, respetar la
    constitution, seguir el flujo Speckit para features no triviales.
  - Sello temporal `Redactado en 2026-09`.
- El archivo se enlaza desde `docs/claude-md/proyecto.md` como
  "cuarto snippet vivo" con advertencia de que es el archivo real del
  repo y puede haber divergido del snippet estático del módulo.
- **Rationale**: FR-008a. Aporta el ejemplo más útil (formación real);
  demuestra "eating your own dog food".
- **Alternatives considered**: dejarlo opcional (rechazado por Q2), sin
  enlace (perdería visibilidad), duplicar en `docs/claude-md/samples/`
  (mantenimiento doble).

## 6. Snippets copiables — anatomía común

- **Decision**: los cuatro snippets (`~/.claude/CLAUDE.md` de usuario,
  `CLAUDE.md` Spring Boot 4, `CLAUDE.md` Spring Boot 2.7 legacy y el
  `CLAUDE.md` vivo del repo) siguen un esqueleto común:
  1. Cabecera con propósito y sello temporal (`Redactado en 2026-09`).
  2. Contexto (qué es el proyecto o persona).
  3. Convenciones / preferencias.
  4. Comandos y flujos habituales.
  5. Restricciones ("MUST" / "NEVER" / "SHOULD" con criterio de
     aceptación).
  6. Opcional: enlaces a docs internas.
- Cada snippet respeta el techo orientativo de 200 líneas útiles
  fijado por Clarifications Q5.
- **Rationale**: patrón repetible, comparable entre snippets, facilita
  auditar tono y longitud.

## 7. Reglas ejecutables ("MUST" / "NEVER" / "SHOULD")

- **Decision**: `buenas-practicas.md` enseña a redactar restricciones
  con verbos imperativos observables. Patrón:

  ```markdown
  <SUJETO> MUST/NEVER/SHOULD <acción medible> <criterio de aceptación>.
  ```

  Ejemplos:
  - MAL: "las funciones deben ser cortas".
  - BIEN: "las funciones MUST tener ≤ 20 líneas efectivas y MUST hacer
    una sola cosa (regla del single responsibility)".
- Referencia externa citada en la página:
  `https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md`.
- **Rationale**: FR-005. Convierte las reglas en algo verificable por
  el LLM y por revisores humanos.

## 8. Umbrales de longitud (antipatrones)

- **Decision**: `antipatrones.md` fija (Clarifications Q5):
  - **Techo orientativo**: 200 líneas útiles (excluyendo bloques de
    código embebidos, tablas y ejemplos).
  - **Aviso duro**: 500 líneas totales.
  Cómo medir "útiles": una regla operativa que la propia página
  explica (excluir líneas dentro de <code>```</code>, tablas y bloques
  admonition).
- **Rationale**: número concreto en lugar de adjetivo. Compatible con
  la política semestral de la constitution 1.0.2 aunque no sea una
  norma directa.

## 9. Cross-links con Setup (spec 002) y SDD (spec 5)

- **Decision**:
  - `docs/setup/index.md` recibe una línea al final del bloque "Cómo
    aprovechar el módulo" apuntando a `../claude-md/index.md` como
    "siguiente paso natural tras dejar el entorno operativo" (FR-009).
    Cambio mínimo, sin alterar la estructura de spec 002.
  - `docs/claude-md/index.md` y `docs/claude-md/buenas-practicas.md`
    incluyen enlace hacia `../sdd/index.md` con nota "spec 5 pendiente"
    hasta que la spec 5 se publique. Los títulos H2/H3 del módulo
    CLAUDE.md quedan estables para que la spec 5 pueda enlazar sin
    ambigüedad (FR-010).
- **Rationale**: FR-009, FR-010, FR-011. Consolidar la navegación
  transversal del sitio sin reescribir spec 002.

## 10. Registro de tono

- **Decision**: profesional y directo (constitution 1.0.2 Principio I).
  Los ejemplos "pobre" de la comparativa deben ser **plausibles**, no
  caricaturas — el mensaje pedagógico depende de que el lector pueda
  identificarse con ellos.
- **Rationale**: FR-012 + SC-004.

## 11. Sello temporal en snippets

- **Decision**: cada snippet copiable incluye una línea inicial (o de
  cierre) con `<!-- Redactado en 2026-09 -->` u equivalente visible.
  No hay compromiso semestral aquí (aplica a spec 002).
- **Rationale**: FR-014. Contextualiza al lector sin abrir
  mantenimiento periódico.

## 12. Verificación del módulo

- **Decision**: dos vías:
  1. **Auditorías `grep`** sobre estructura fija de cada página
     (`### Antes`, `### Después`, `### Qué cambió`, subsecciones
     canónicas de `usuario.md` y `proyecto.md`) — automatizables.
  2. **Revisiones manuales**: tono (SC-004), cronómetros (SC-001,
     SC-002, SC-006) — humanas con soft-gate 3/3 admitido si no hay
     5 revisores disponibles, por analogía con spec 002.
- **Rationale**: coherencia con el patrón de verificación del sitio ya
  establecido en specs 001 y 002.

---

## NEEDS CLARIFICATION residuales

Ninguna. Todas resueltas en la sesión de `/speckit-clarify`
2026-09-16.
