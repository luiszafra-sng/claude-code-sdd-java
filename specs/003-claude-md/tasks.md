---

description: "Task list — Módulo 'CLAUDE.md: usuario y proyecto'"
---

# Tasks: Módulo "CLAUDE.md: usuario y proyecto"

**Input**: Design documents from `specs/003-claude-md/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: No hay test tasks. Docs-only + un archivo `CLAUDE.md` en la raíz; verificación por `mkdocs build --strict`, auditorías `grep` y revisiones manuales.

**Organization**: Tareas agrupadas por user story. US1 (P1) = `index.md`. US2 (P1) = `usuario.md`, `proyecto.md`, `antipatrones.md` + `CLAUDE.md` vivo en raíz. US3 (P2) = `buenas-practicas.md` con comparativa Antes/Después/Qué cambió.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede correr en paralelo (archivos distintos, sin dependencias).
- **[Story]**: US1 / US2 / US3.
- Rutas relativas al repo root (`/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/`).

## Path Conventions

Contenido Markdown bajo `docs/claude-md/` + un archivo `CLAUDE.md` en la raíz + ajuste puntual en `docs/setup/index.md` (cross-link) + un cambio en `mkdocs.yml`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: verificar precondiciones heredadas de specs 001 y 002.

- [X] T001 Verificar precondiciones: `uv sync` sin errores, `uv run mkdocs --version` responde, `uv run mkdocs build --strict` en verde antes de tocar nada, placeholder `docs/claude-md/index.md` existe (creado por spec 001), `docs/setup/index.md` publicado (por spec 002). Fecha de sello temporal en snippets fijada literalmente en `2026-09` (Clarifications 2026-09-16).

**Checkpoint**: entorno confirmado.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: preparar la navegación anidada para las 5 páginas del módulo.

**⚠️ CRITICAL**: bloquea US1, US2, US3.

- [X] T002 Actualizar `mkdocs.yml`: reemplazar la entrada `- CLAUDE.md: claude-md/index.md` por una estructura anidada con las 5 páginas del módulo en este orden: `index.md`, `usuario.md`, `proyecto.md`, `buenas-practicas.md`, `antipatrones.md`. Verificar con `uv run mkdocs build --strict` que el placeholder existente construye sin warnings; los archivos hijos aún no creados generarán `WARNING` que se resolverán al crearse las páginas en US1/US2/US3.

**Checkpoint**: `nav` preparada.

---

## Phase 3: User Story 1 — Entender qué es CLAUDE.md y dónde vive (Priority: P1) 🎯 MVP conceptual

**Goal**: publicar `docs/claude-md/index.md` con los cinco H2 canónicos que responden a "qué es", "dónde vive", "precedencia entre capas" (proyecto gana), "cuándo lo lee Claude Code" y "mapa del módulo".

**Independent Test**: `docs/claude-md/index.md` publicado responde de forma explícita a las cinco preguntas del `data-model.md` §"Secciones por página" (index) y menciona literalmente "proyecto gana" en la sección de precedencia.

### Implementation for User Story 1

- [X] T003 [US1] Reemplazar `docs/claude-md/index.md` (placeholder actual) con contenido completo. Estructura obligatoria (H2 canónicos, en este orden literal):
  1. `## Qué es CLAUDE.md` — introducción sobre archivo Markdown que Claude Code lee al abrir una sesión, propósito (instrucciones persistentes de contexto y estilo), diferencia frente a un `README.md`.
  2. `## Dónde vive` — dos ubicaciones: `~/.claude/CLAUDE.md` (capa usuario) y `CLAUDE.md` en la raíz del repositorio (capa proyecto). Detallar que ambos son opcionales y que su ausencia no rompe Claude Code.
  3. `## Precedencia entre capas` — regla explícita fijada en Clarifications 2026-09-16: **ambas capas se componen en la prompt de sistema, usuario primero y proyecto después; ante contradicción efectiva, la capa proyecto gana** por orden y por especificidad. Incluir ejemplo mínimo (usuario "responde en inglés" vs proyecto "responde en español" → proyecto gana).
  4. `## Cuándo lo lee Claude Code` — párrafo describiendo que ambos `CLAUDE.md` se cargan al inicio de la sesión y quedan en la prompt de sistema durante todos los turnos; se recargan al reabrir la sesión.
  5. `## Mapa del módulo` — enlaces a las cuatro páginas hermanas (`usuario.md`, `proyecto.md`, `buenas-practicas.md`, `antipatrones.md`) más enlace al futuro módulo SDD (`../sdd/index.md`) con nota `(spec 5 pendiente)`.
  Registro profesional-directo (constitution 1.0.2 Principio I). Terminar con enlace de vuelta a `../index.md` (home del sitio).
- [X] T004 [US1] Auditoría estructural de `docs/claude-md/index.md`:
  ```bash
  for h in "Qué es CLAUDE.md" "Dónde vive" "Precedencia entre capas" "Cuándo lo lee Claude Code" "Mapa del módulo"; do
    grep -qF "## $h" docs/claude-md/index.md && echo "OK  ## $h" || echo "MISS ## $h"
  done
  grep -qF 'proyecto gana' docs/claude-md/index.md \
    && echo 'regla precedencia: OK' || echo 'regla precedencia: MISSING'
  ```
  Aceptación: 5 H2 presentes y frase "proyecto gana" literal en el cuerpo.

**Checkpoint**: página conceptual publicada; regla de precedencia clara.

---

## Phase 4: User Story 2 — Escribir un CLAUDE.md útil (Priority: P1)

**Goal**: publicar `docs/claude-md/usuario.md`, `docs/claude-md/proyecto.md`, `docs/claude-md/antipatrones.md` con contenido, snippets copiables y umbrales de longitud; publicar `CLAUDE.md` vivo en la raíz del repo y enlazarlo desde `proyecto.md`.

**Independent Test**: un participante puede copiar cualquiera de los cuatro snippets (`~/.claude/CLAUDE.md` de usuario, Spring Boot 4, Spring Boot 2.7 legacy Java 8, `CLAUDE.md` vivo del repo) y usarlo como base sin editar el esqueleto. Antipatrones lista contenido prohibido y umbrales 200 / 500 líneas literales.

### Implementation for User Story 2

- [X] T005 [P] [US2] Escribir `docs/claude-md/usuario.md` con estos H2 en orden:
  1. `## Qué meter en la capa usuario` — estilo personal, herramientas siempre presentes (`rtk`, `uv`, `sdkman`), atajos, preferencias de tono, flujos habituales, comandos favoritos.
  2. `## Ejemplo real anonimizado` — un único bloque `\`\`\`markdown ... \`\`\`` con un `~/.claude/CLAUDE.md` completo (esqueleto §6 del research: cabecera + contexto + convenciones + comandos + restricciones + enlaces), sello `<!-- Redactado en 2026-09 -->` visible, ≤ 200 líneas útiles.
  3. `## Antipatrones específicos de la capa usuario` — 3-5 bullets breves (p. ej. NO meter credenciales, NO meter contexto de proyecto concreto, NO meter historia de commits personal).
  Enlace final a `index.md` (vuelta) y a `proyecto.md` (siguiente).
- [X] T006 [P] [US2] Escribir `docs/claude-md/proyecto.md` con estos H2 en orden:
  1. `## Qué meter en la capa proyecto` — tecnologías, convenciones, comandos build/test, estructura de carpetas, restricciones de seguridad, integraciones específicas.
  2. `## Ejemplo: Spring Boot 4 + Java 21` — bloque `\`\`\`markdown` completo con `CLAUDE.md` del proyecto moderno. Convenciones: `sdk env` con Liberica 21.0.4, `mvn` o `./mvnw`, `spring-boot:run`, tests JUnit 5, DTO/entity mapping con `record`, uso de `var`, patterns modernos (`switch`, `sealed`), Jakarta EE (jakarta.*). Sello `<!-- Redactado en 2026-09 -->`. ≤ 200 líneas útiles.
  3. `## Ejemplo: legacy Spring Boot 2.7 + Java 8` — bloque `\`\`\`markdown` completo con `CLAUDE.md` del proyecto legacy (Clarifications Q4). Convenciones: JDK 8, `javax.*` (no `jakarta.*`), Maven clásico, sin `record` ni `var`, streams + lambdas + `Optional` sí, notas de deuda técnica (migración pendiente a Jakarta EE 9+, ausencia de JPMS). Sello `<!-- Redactado en 2026-09 -->`. ≤ 200 líneas útiles.
  4. `## CLAUDE.md del repositorio de la formación` — párrafo breve + enlace a `../../CLAUDE.md` (archivo real del repo, creado en T008) con admonition `!!! warning` avisando de que es el archivo vivo y puede haber divergido del snippet estático si se ha modificado desde la publicación del módulo.
  Enlace final a `index.md`, `usuario.md`, `buenas-practicas.md`.
- [X] T007 [P] [US2] Escribir `docs/claude-md/antipatrones.md` con estos H2 en orden:
  1. `## Contenido prohibido` — secretos incrustados (con ejemplo negativo y mitigación: mover a `.env` gitignoreado), información volátil (fechas, versiones sin política de refresco), historia de commits copiada, información sensible del cliente o del equipo.
  2. `## Errores de formato` — docstrings enormes, reglas contradictorias, ausencia de criterios de aceptación en las reglas, uso de "should" vago en lugar de "MUST/NEVER" observable.
  3. `## Umbrales de longitud` — recogida literal de Clarifications Q5:
     - Techo orientativo: **200 líneas útiles** (excluyendo bloques de código, tablas y admonitions).
     - Aviso duro: **500 líneas totales**.
     - Por encima de 500, el contenido debería vivir en otra parte (páginas dedicadas, README, agentes o skills).
     - Regla operativa para contar "útiles": líneas fuera de <code>```</code>, tablas Markdown y bloques `!!! …`.
  4. `## Cómo auditar un CLAUDE.md` — checklist: buscar patrones de secretos (`sk-…`, `AKIA…`, `-----BEGIN`), grep de fechas fijas, wc -l, revisar reglas por verbo imperativo.
  Enlace final a `index.md` y `buenas-practicas.md`.
- [X] T008 [US2] Crear `CLAUDE.md` en la raíz del repositorio (archivo real, FR-008a). Contenido:
  - Cabecera con propósito del repo y sello `<!-- Redactado en 2026-09 -->`.
  - Contexto: sitio de formación MkDocs Material sobre Claude Code y SDD con Speckit, orientado a Java (moderno + legacy).
  - Convenciones: Bash canónica en snippets del sitio, español en contenido, términos técnicos en su idioma original, MkDocs `--strict` como puerta de calidad.
  - Comandos habituales: `uv sync`, `uv run mkdocs serve`, `uv run mkdocs build --strict`, `uv add --group docs <paquete>`, `uv remove --group docs <paquete>`.
  - Restricciones para Claude (imperativos observables):
    - MUST respetar el flujo Speckit (`specify` → `plan` → `tasks` → `implement`) para features no triviales; NEVER modificar código de aplicación fuera de una spec activa.
    - MUST mantener todos los tokens visuales en `docs/stylesheets/extra.css`; NEVER duplicar estilos en páginas Markdown.
    - MUST usar `uv` como único gestor Python; NEVER `pip`, `venv`, `pipenv`, `poetry` ni `conda`.
    - MUST fijar dependencias con `==`; NEVER `~=`/`>=`/`^`.
    - MUST respetar el registro profesional-directo de la constitution 1.0.2 (Principio I); NEVER argot ("a saco", "picar código").
    - MUST superar `uv run mkdocs build --strict` sin warnings antes de considerar cerrada cualquier tarea que toque `docs/` o `mkdocs.yml`.
    - SHOULD priorizar cambios localizados y minimalismo (constitution + `~/.claude/CLAUDE.md` global del usuario).
  - Enlaces: constitution (`.specify/memory/constitution.md`), spec activa (dinámica según `.specify/feature.json`), home del sitio (`docs/index.md`).
  - Tamaño: DEBE ≤ 200 líneas útiles y < 500 líneas totales (coherencia con `antipatrones.md`).
- [X] T009 [US2] Auditoría de US2:
  ```bash
  # H2 canónicos por página
  for h in "Qué meter en la capa usuario" "Ejemplo real anonimizado" "Antipatrones específicos de la capa usuario"; do
    grep -qF "## $h" docs/claude-md/usuario.md && echo "OK  usuario: $h" || echo "MISS usuario: $h"
  done
  for h in "Qué meter en la capa proyecto" "Ejemplo: Spring Boot 4 + Java 21" "Ejemplo: legacy Spring Boot 2.7 + Java 8" "CLAUDE.md del repositorio de la formación"; do
    grep -qF "## $h" docs/claude-md/proyecto.md && echo "OK  proyecto: $h" || echo "MISS proyecto: $h"
  done
  for h in "Contenido prohibido" "Errores de formato" "Umbrales de longitud" "Cómo auditar un CLAUDE.md"; do
    grep -qF "## $h" docs/claude-md/antipatrones.md && echo "OK  antipatrones: $h" || echo "MISS antipatrones: $h"
  done
  # Snippets copiables
  echo "usuario snippets markdown: $(grep -c '^```markdown$' docs/claude-md/usuario.md)"
  echo "proyecto snippets markdown: $(grep -c '^```markdown$' docs/claude-md/proyecto.md)"
  # Sellos temporales
  echo "sellos usuario: $(grep -c 'Redactado en 2026-09' docs/claude-md/usuario.md)"
  echo "sellos proyecto: $(grep -c 'Redactado en 2026-09' docs/claude-md/proyecto.md)"
  # Umbrales literales
  grep -qF '200 líneas útiles' docs/claude-md/antipatrones.md \
    && echo "techo 200: OK" || echo "techo 200: MISSING"
  grep -qF '500 líneas totales' docs/claude-md/antipatrones.md \
    && echo "aviso 500: OK" || echo "aviso 500: MISSING"
  # CLAUDE.md vivo — existencia
  test -f CLAUDE.md && echo "root CLAUDE.md: OK" || echo "root CLAUDE.md: MISSING"
  # Cálculo preciso de líneas útiles: excluye contenido dentro de code fences ``` ... ```
  useful=$(awk '
    /^```/ { in_fence = !in_fence; next }
    in_fence { next }
    { print }
  ' CLAUDE.md | wc -l | tr -d ' ')
  total=$(wc -l < CLAUDE.md | tr -d ' ')
  echo "root CLAUDE.md useful=$useful total=$total"
  test "$useful" -le 200 && echo "useful ≤ 200: OK" || echo "useful > 200: FAIL"
  test "$total" -lt 500 && echo "total < 500: OK" || echo "total ≥ 500: FAIL"
  grep -qF 'Redactado en 2026-09' CLAUDE.md \
    && echo "sello raíz: OK" || echo "sello raíz: MISSING"
  # Restricciones literales del CLAUDE.md raíz (fix analyze C3)
  for pat in 'uv sync' 'uv run mkdocs build --strict' 'constitution' 'docs/stylesheets/extra.css' 'Speckit'; do
    grep -qF "$pat" CLAUDE.md && echo "raíz contiene '$pat': OK" || echo "raíz falta '$pat': FAIL"
  done
  must_count=$(grep -c 'MUST' CLAUDE.md)
  echo "raíz MUST count=$must_count"
  test "$must_count" -ge 5 && echo "raíz ≥5 MUST: OK" || echo "raíz <5 MUST: FAIL"
  ```
  Aceptación: todos los checks OK; `usuario.md` con ≥ 1 bloque `\`\`\`markdown`; `proyecto.md` con ≥ 2 bloques `\`\`\`markdown`; `CLAUDE.md` raíz con useful ≤ 200, total < 500, sello temporal, 5 patrones literales y ≥ 5 `MUST`.

**Checkpoint**: contenido de "cómo escribir un CLAUDE.md útil" publicado y coherente con lo que enseña el módulo.

---

## Phase 5: User Story 3 — Reglas ejecutables y comparativa Antes/Después (Priority: P2)

**Goal**: publicar `docs/claude-md/buenas-practicas.md` con la pedagogía de reglas MUST/NEVER/SHOULD y la comparativa Antes / Después / Qué cambió sobre una misma tarea.

**Independent Test**: `buenas-practicas.md` contiene exactamente un `### Antes`, un `### Después` y un `### Qué cambió` (H3 literales, Clarifications Q3); "Qué cambió" enumera al menos 3 diferencias explicando qué se mejoró y por qué.

### Implementation for User Story 3

- [X] T010 [US3] Escribir `docs/claude-md/buenas-practicas.md` con estos H2 en orden:
  1. `## Reglas ejecutables por el LLM` — explicar el patrón `<SUJETO> MUST/NEVER/SHOULD <acción medible> <criterio de aceptación>`. Contraste corto con formulaciones vagas ("debe ser limpio") vs ejecutables ("las funciones MUST tener ≤ 20 líneas efectivas y MUST hacer una sola cosa"). Citar la referencia externa `https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md`.
     - Sub-bullets: minimalismo (sin features especulativas), clean code aplicable, tests como criterio de verificación, prohibir cambios fuera de scope.
  2. `## Comparativa Antes / Después` — introducción de una única tarea concreta a la que se aplican los dos `CLAUDE.md` (por ejemplo, "refactorizar el módulo de autenticación de un backend Java"). Justo debajo, tres H3 en este orden literal (Clarifications Q3):
     - `### Antes` — bloque `\`\`\`markdown` completo con un `CLAUDE.md` pobre plausible (no caricatura): reglas vagas, sin criterios de aceptación, sin scope acotado, sin comandos concretos.
     - `### Después` — bloque `\`\`\`markdown` completo con un `CLAUDE.md` mejorado: mismas intenciones expresadas con verbos imperativos y criterios observables, scope acotado, comandos build/test, restricciones "NEVER fuera de scope".
     - `### Qué cambió` — lista con al menos **3 elementos**; cada elemento explica "qué se mejoró" y "por qué".
     Longitud de `Antes` y `Después` comparable (± 30%).
  3. `## Checklist de calidad` — checklist verificable (5-8 items) que el lector puede aplicar sobre su propio `CLAUDE.md`: presencia de sello temporal, formato MUST/NEVER, scope acotado, longitud dentro de umbrales, ausencia de secretos, etc. Cada item empieza con `- [ ]`.
  Enlace final a `index.md` y al módulo SDD (`../sdd/index.md`) con nota `(spec 5 pendiente)`.
- [X] T011 [US3] Auditoría de US3:
  ```bash
  # Comparativa (H3 canónicos, exactamente uno de cada)
  a=$(grep -c '^### Antes$' docs/claude-md/buenas-practicas.md)
  d=$(grep -c '^### Después$' docs/claude-md/buenas-practicas.md)
  q=$(grep -c '^### Qué cambió$' docs/claude-md/buenas-practicas.md)
  echo "### Antes=$a ### Después=$d ### Qué cambió=$q"
  test "$a" -eq 1 && test "$d" -eq 1 && test "$q" -eq 1 \
    && echo "comparativa H3: OK" || echo "comparativa H3: FAIL"
  # ≥ 3 diferencias en "Qué cambió"
  changes=$(awk '
    /^### Qué cambió$/ { f=1; next }
    /^## / || /^### / { if (f) f=0 }
    f && /^- / { c++ }
    END { print c+0 }
  ' docs/claude-md/buenas-practicas.md)
  echo "Qué cambió bullets=$changes"
  test "$changes" -ge 3 && echo "≥3 cambios: OK" || echo "<3 cambios: FAIL"
  # Longitud comparable entre Antes y Después (fix analyze C1: ratio ≤ 30%)
  len_before=$(awk '
    /^### Antes$/ { in_before=1; next }
    /^### / { in_before=0 }
    in_before { c++ }
    END { print c+0 }
  ' docs/claude-md/buenas-practicas.md)
  len_after=$(awk '
    /^### Después$/ { in_after=1; next }
    /^### / { in_after=0 }
    in_after { c++ }
    END { print c+0 }
  ' docs/claude-md/buenas-practicas.md)
  echo "Antes=$len_before líneas · Después=$len_after líneas"
  awk -v b="$len_before" -v a="$len_after" 'BEGIN {
    max = (b > a) ? b : a
    diff = (b > a) ? b - a : a - b
    ratio = (max > 0) ? diff / max : 0
    printf "ratio=%.3f\n", ratio
    if (ratio <= 0.30) print "longitud comparable ±30%: OK"
    else print "longitud comparable: FAIL (>30%)"
  }'
  # Referencia externa citada exactamente una vez (fix analyze C4)
  ext=$(grep -c 'multica-ai/andrej-karpathy-skills' docs/claude-md/buenas-practicas.md)
  echo "ref externa count=$ext"
  test "$ext" -eq 1 && echo "ref externa: OK (== 1)" || echo "ref externa: FAIL (esperado == 1)"
  ```
  Aceptación: exactamente un H3 de cada, ≥ 3 diferencias, ratio de longitud Antes/Después ≤ 30 %, referencia externa citada exactamente una vez.

**Checkpoint**: pedagogía de reglas ejecutables + comparativa publicada.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: cerrar cross-links con Setup y SDD, build final, y validaciones humanas (SC-004, SC-006, SC-001, SC-002).

- [X] T012 [P] Cross-link Setup → CLAUDE.md (FR-009). Añadir a `docs/setup/index.md` en el bloque final "Cómo aprovechar el módulo" (o justo después) una línea del tipo: "Cuando el checklist de verificación quede en verde, continúa con el módulo [CLAUDE.md](../claude-md/index.md), que enseña a escribir instrucciones persistentes para Claude Code a nivel usuario y proyecto". Único cambio en `docs/setup/index.md`.
- [X] T013 [P] Cross-links CLAUDE.md → SDD (placeholder). Verificar (o añadir) enlaces desde `docs/claude-md/index.md` (subsección "Mapa del módulo") y `docs/claude-md/buenas-practicas.md` (final de página) hacia `../sdd/index.md` con nota `(spec 5 pendiente)`. Cuando la spec 5 publique contenido, la nota se retira; los enlaces siguen resolviendo por ser el mismo `index.md`.
- [X] T014 [P] Auditar cross-links:
  ```bash
  grep -qF 'claude-md/index.md' docs/setup/index.md \
    && echo "setup → claude-md: OK" || echo "setup → claude-md: MISSING"
  for f in docs/claude-md/index.md docs/claude-md/buenas-practicas.md; do
    grep -qE 'sdd/index\.md|\.\./sdd/' "$f" \
      && echo "$f → sdd: OK" || echo "$f → sdd: MISSING"
  done
  for slug in usuario proyecto buenas-practicas antipatrones; do
    grep -qE 'index\.md|\./index' docs/claude-md/${slug}.md \
      && echo "${slug} → index: OK" || echo "${slug} → index: MISSING"
  done
  grep -qF '## CLAUDE.md del repositorio de la formación' docs/claude-md/proyecto.md \
    && echo "proyecto → sección CLAUDE.md raíz: OK" || echo "proyecto → sección CLAUDE.md raíz: MISSING"
  # Nota: se referencia por ruta filesystem (no link Markdown) porque el archivo vive fuera de docs/
  ```
  Aceptación: todos los checks OK.
- [X] T015 Build final `uv run mkdocs build --strict`. Confirmar exit 0 y cero `WARNING`. Sanity de HTML + headings estables (fix analyze C2) + `TODO(asset)` no bloqueante:
  ```bash
  rm -rf site/
  uv run mkdocs build --strict > /tmp/b_final.log 2>&1
  echo "MKDOCS_EXIT=$?"
  grep -cE '^WARNING|^ERROR' /tmp/b_final.log
  for slug in index usuario proyecto buenas-practicas antipatrones; do
    p="site/claude-md/${slug}/index.html"
    [ "$slug" = "index" ] && p="site/claude-md/index.html"
    test -f "$p" && echo "OK  $p" || echo "MISS $p"
  done
  # Estabilidad de headings clave que la spec 5 (SDD) enlazará (FR-010)
  for h in "Precedencia entre capas" "Reglas ejecutables por el LLM" "Comparativa Antes / Después" "Umbrales de longitud"; do
    if grep -RqF "## $h" docs/claude-md/; then
      echo "heading estable '## $h': OK"
    else
      echo "heading estable '## $h': MISSING"
    fi
  done
  # TODO(asset) no bloqueante
  todos=$(grep -RnE 'TODO\(asset\)' docs/claude-md/ 2>/dev/null | wc -l | tr -d ' ')
  echo "TODO(asset) pendientes: $todos (aviso, no bloquea aceptación)"
  ```
  Aceptación: exit 0, 0 warnings, 5 HTMLs presentes, 4 headings estables presentes; `TODO(asset)` sólo se reporta.
- [ ] T016 Revisión manual de tono y plausibilidad (SC-004). Pedir a personas del equipo que:
  1. Lean `docs/claude-md/index.md` + una página hermana al azar.
  2. Lean la comparativa Antes / Después / Qué cambió completa.
  3. Respondan sí/no a: "¿el tono respeta el Principio I de la constitution 1.0.2 (profesional-directo, sin argot)?" y "¿el ejemplo 'Antes' es plausible, no una caricatura?".
  Aceptación estándar: **5 de 5** sí en cada pregunta. **Soft-gate**: mínimo 3/3 documentando el sample size.
- [ ] T017 Test cronometrado de aterrizaje directo (SC-006). Con `uv run mkdocs serve` corriendo, arrancar cronómetro en la home y navegar hasta la subsección "Reglas ejecutables por el LLM" de `docs/claude-md/buenas-practicas.md`. Prohibido usar el buscador; sólo nav superior/lateral. Aceptación estándar: ≤ **90 s** con muestra representativa. **Soft-gate** (fix analyze B2): si no hay muestra representativa, se acepta con **una única medición** documentando persona, máquina, ancho de viewport y tiempo real.
- [ ] T018 Tests cronometrados pedagógicos (SC-001, SC-002).
  - **SC-001**: participante sin contexto lee `index.md` + `usuario.md` y explica la diferencia entre capa usuario y proyecto + su precedencia. Aceptación: ≤ 10 min (lectura + explicación).
  - **SC-002**: participante copia el snippet Spring Boot 4 y adapta 3-5 líneas a un proyecto hipotético. Aceptación: ≤ 15 min (copiar + editar + guardar).
  **Soft-gate** (fix analyze B2): una medición única documentada admitida si no hay muestra representativa; el informe indica participante, contexto, punto de partida y tiempo real por escenario.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias externas.
- **Foundational (Phase 2)**: requiere Setup. Bloquea US1, US2, US3.
- **US1 (Phase 3)**: requiere Foundational.
- **US2 (Phase 4)**: requiere Foundational. Puede ejecutarse en paralelo con US1.
- **US3 (Phase 5)**: requiere US2 (necesita la referencia al `CLAUDE.md` vivo del repo para el ejemplo mejorado) y US1 (para enlazar precedencia en la introducción). Puede empezar cuando terminen US1 + T005/T006/T007 (aunque `CLAUDE.md` raíz no esté todavía).
- **Polish (Phase 6)**: requiere US1, US2 y US3 completas.

### User Story Dependencies

- **US1 (P1)**: sólo depende de Foundational.
- **US2 (P1)**: sólo depende de Foundational.
- **US3 (P2)**: depende de US1 y US2.

### Within Each Story

- Dentro de US1: T003 antes de T004.
- Dentro de US2: T005–T007 son [P] entre sí (archivos distintos). T008 (`CLAUDE.md` raíz) puede solaparse con las anteriores. T009 (auditoría) al final.
- Dentro de US3: T010 antes de T011.

### Parallel Opportunities

- US2: T005, T006, T007 en paralelo. T008 en paralelo con las anteriores (raíz vs `docs/`).
- Polish: T012, T013, T014 en paralelo entre sí (archivos distintos).
- T016/T017/T018 humanos; se reparten entre revisores.

---

## Parallel Example: User Story 2

```bash
# Tras T002:
Task: "Escribir docs/claude-md/usuario.md (T005)"
Task: "Escribir docs/claude-md/proyecto.md (T006)"
Task: "Escribir docs/claude-md/antipatrones.md (T007)"
Task: "Crear CLAUDE.md en la raíz del repositorio (T008)"
# Al final:
Task: "Auditar US2 (T009)"
```

---

## Implementation Strategy

### MVP conceptual + puerta de escritura (US1 + US2)

1. Phase 1 Setup (T001).
2. Phase 2 Foundational (T002).
3. Phase 3 US1 (T003–T004) → módulo con "qué es" claro.
4. Phase 4 US2 (T005–T009) → escritura de `CLAUDE.md` cubierta + archivo vivo.
5. **STOP y VALIDAR**: participantes pueden ya redactar sus `CLAUDE.md` con criterio.

### Incremental Delivery

1. Setup + Foundational.
2. US1 → concepto claro → demo interno.
3. US2 → snippets copiables + `CLAUDE.md` vivo del repo → gran salto de valor.
4. US3 → reglas ejecutables + comparativa Antes/Después → pedagogía completa.
5. Polish → cross-links + tono + cronómetros.

### Parallel Team Strategy

- Persona A: Phase 1 + 2 + T003 (US1) + T010 (US3).
- Personas A/B/C: US2 en paralelo (T005 usuario / T006 proyecto / T007 antipatrones / T008 `CLAUDE.md` raíz).
- Persona A: auditorías T004, T009, T011.
- Persona A/B: Phase 6 (T012 + T013 en paralelo; T015 build; T016/T017/T018 humanos).

---

## Notes

- [P] = archivos distintos, sin dependencias.
- Ninguna tarea toca `examples/`, `.claude/` ni módulos futuros (SDD, agentes, skills).
- **Fecha en snippets**: usar sello `2026-09` literal (Clarifications 2026-09-16) en las 4 apariciones (`usuario.md`, `proyecto.md` × 2 snippets, `CLAUDE.md` raíz).
- Referencia externa `multica-ai/andrej-karpathy-skills/CLAUDE.md` se cita **una vez** en `buenas-practicas.md` (T010).
- La longitud del `CLAUDE.md` vivo (T008) debe respetar los umbrales que el propio módulo enseña (200 útiles / 500 totales) — coherencia interna auditada en T009.
- Commit por checkpoint (fin de fase) o por grupo lógico.
