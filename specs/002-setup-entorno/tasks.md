---

description: "Task list — Módulo 'Setup del entorno'"
---

# Tasks: Módulo "Setup del entorno"

**Input**: Design documents from `specs/002-setup-entorno/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: No hay test tasks. Docs-only; verificación por `mkdocs build --strict`, auditorías `grep` y revisiones manuales.

**Organization**: Tareas agrupadas por user story. US1 (P1) = contenido de las 6 páginas de herramienta + index. US2 (P2) = auditoría estructural (aterrizaje directo). US3 (P2) = checklist final `verificacion.md`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede correr en paralelo (archivos distintos, sin dependencias).
- **[Story]**: US1 / US2 / US3.
- Rutas relativas al repo root (`/Users/luis.zafra/sngular/vitaly/claude-code-sdd-java/`).

## Path Conventions

Sólo contenido Markdown bajo `docs/setup/` + un único cambio en `mkdocs.yml`. Sin `src/`, sin `tests/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: verificar precondiciones heredadas de spec 001.

- [X] T001 Verificar precondiciones: `uv sync` sin errores, `uv run mkdocs --version` responde, `uv run mkdocs build --strict` en verde antes de tocar nada, `docs/setup/index.md` placeholder existe. **Fecha de verificación fijada literalmente en `2026-09-16`** — todas las páginas de este módulo comparten esta fecha en el bloque "Verificado el …" (sin variar por autor, sin `date` dinámico).

**Checkpoint**: entorno de trabajo confirmado.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: preparar la navegación anidada para las 7 páginas.

**⚠️ CRITICAL**: bloquea US1, US2, US3.

- [X] T002 Actualizar `mkdocs.yml`: reemplazar la entrada `- Setup del entorno: setup/index.md` por una estructura anidada con las 7 páginas del módulo (`index.md`, `sdkman.md`, `claude-code.md`, `rtk.md`, `caveman.md`, `codegraph.md`, `verificacion.md`) en el orden fijado por FR-002. Verificar con `uv run mkdocs build --strict` que el placeholder existente sigue construyendo sin warnings; los archivos aún no creados generarán `WARNING` que se resolverán al crearse las páginas en US1/US3.

**Checkpoint**: `nav` preparada.

---

## Phase 3: User Story 1 — Entorno operativo desde cero en <30 min (Priority: P1) 🎯 MVP

**Goal**: publicar el `index.md` y las 5 páginas de herramientas (SDKMAN, Claude Code, RTK, Caveman, CodeGraph) con estructura fija, comandos copy-paste, bloque versión+fecha, y cumpliendo el registro profesional-directo de la constitution 1.0.2.

**Independent Test**: en máquina limpia con `uv` instalado, seguir el orden recomendado del `index.md` deja Claude Code, SDKMAN + Liberica + Maven, RTK, Caveman y CodeGraph operativos en menos de 30 minutos. Comandos de verificación por herramienta responden con la salida documentada.

### Implementation for User Story 1

- [X] T003 [US1] Reemplazar `docs/setup/index.md`: propósito del módulo, estimación de tiempo (<30 min), sistemas soportados (macOS 13+ / Ubuntu 22.04+ / WSL2 Windows 11), permisos y red mínima, **nota única** sobre Bash canónica vs Zsh (equivalencia y cambio de `~/.bashrc` por `~/.zshrc`), orden recomendado de lectura (SDKMAN → Claude Code → RTK → Caveman → CodeGraph → Verificación), enlaces a las seis páginas hijas y enlace de vuelta a `docs/index.md`. Tono profesional-directo (constitution 1.0.1 Principio I; sin argot). Ninguna otra página del módulo debe repetir la nota Zsh.
- [X] T004 [P] [US1] Escribir `docs/setup/sdkman.md` con las cinco secciones fijas de FR-003 en este orden:
  1. **Qué es y qué problema resuelve**: SDKMAN como gestor de SDKs (JDK, Maven, etc.) y por qué la formación lo usa para reproducibilidad Java (constitution Principio III).
  2. **Cómo instalar**: `curl -s "https://get.sdkman.io" | bash`, carga en shell (`source "$HOME/.sdkman/bin/sdkman-init.sh"`), instalación de JDK **BellSoft Liberica** (`sdk install java 21.0.4-librca`) y Maven (`sdk install maven`), uso de `sdk env`, ejemplo de `.sdkmanrc` (`java=21.0.4-librca`, `maven=3.9.9`) y `sdk env install`. Documentar explícitamente que Liberica es la distribución fijada por la formación y por qué (Clarifications Q3).
  3. **Verificación**: `sdk version`, `java -version` (esperar `21.0.x-LTS ... Liberica ...`), `mvn -v` (esperar `Apache Maven 3.9.x`), con outputs esperados citados.
  4. **Cuándo usarlo**: al arrancar cualquier proyecto Java de la formación; para saltar entre versiones sin `alternatives`; para reproducir el JDK/Maven en CI.
  5. **Gotchas y troubleshooting**: SDKMAN no cargado en la sesión (relanzar shell o `source …/sdkman-init.sh`), `SDKMAN_DIR` mal apuntado, cambio de shell, `.sdkmanrc` no auto-cargado (activar con `sdk config`), permisos en `/private` en macOS.
  6. Bloque final "Versión de referencia": `Documentado sobre SDKMAN 5.19.0, BellSoft Liberica 21.0.4-librca, Maven 3.9.9. Verificado el 2026-09-16`. Enlace de vuelta a `docs/setup/index.md` y enlace a `docs/setup/verificacion.md`.
- [X] T005 [P] [US1] Escribir `docs/setup/claude-code.md` con las cinco secciones fijas:
  1. **Qué es y qué problema resuelve**: Claude Code como CLI oficial de Anthropic para desarrollo asistido; qué aporta (contexto conversacional persistente, edición de archivos, permission modes).
  2. **Cómo instalar**: comando oficial de instalación (macOS/Linux/WSL2), verificación de que aparece en PATH.
  3. **Verificación**: `claude --version` (output esperado con formato semver), `claude auth status` (o comando equivalente vigente al redactar).
  4. **Cuándo usarlo**: cualquier sesión de trabajo asistido; se combina con RTK, Caveman y CodeGraph.
  5. **Gotchas y troubleshooting**: PATH mal configurado tras instalación por script, colisión con instalaciones previas (uninstall + reinstall), permisos de red en máquina corporativa, cierre de sesión de Anthropic.
  6. **Autenticación (sub-sección obligatoria bajo "Cómo instalar" o inmediatamente después)** documentando **ambos** métodos (FR-006a):
     - *Login OAuth con cuenta Claude* (`claude` abre navegador, cubre Pro/Max/Team). Comando + comprobación (`claude auth status`).
     - *API key* `ANTHROPIC_API_KEY` como variable de entorno. Comando de export + comprobación (`echo $ANTHROPIC_API_KEY | head -c 8`, mostrando prefijo `sk-ant-`).
     - Criterios explícitos de elección: OAuth cuando ya hay suscripción; API key para facturación por uso, scripts o CI.
  7. **Permission modes básicos** (subsección tras las cinco fijas): mención breve de `accept edits`, `plan`, `default`, `bypass permissions`, remitiendo al módulo SDD (spec 5) para el detalle.
  8. **Ubicaciones estándar** (subsección): `~/.claude/` (usuario) y `.claude/` (proyecto).
  9. Bloque "Versión de referencia": `Documentado sobre Claude Code <versión al redactar>. Verificado el 2026-09-16`.
- [X] T006 [P] [US1] Escribir `docs/setup/rtk.md` con las cinco secciones fijas:
  1. **Qué es y qué problema resuelve**: RTK (`https://github.com/rtk-ai/rtk`), proxy CLI que reescribe comandos de dev ops de forma transparente reduciendo el consumo de tokens entre un 60% y un 90% en operaciones típicas (git, grep, listados, análisis).
  2. **Cómo instalar**: documentar **todos** los métodos oficiales soportados por el repositorio (script oficial, `cargo install`, binarios prebuilt, Homebrew si aplica, build desde fuentes). Comando copy-paste completo por método. Añadir **tabla comparativa** con estas columnas canónicas literales, en este orden: `| Método | Requisitos | Velocidad | Facilidad de actualización | Contexto recomendado |` (FR-004a; sin renombrar).
  3. **Verificación**: `rtk --version`, `rtk gain` (analytics de ahorro; sólo el RTK correcto responde con la tabla de ganancias — sirve además como test de colisión).
  4. **Cuándo usarlo**: siempre que se trabaje con Claude Code sobre un repo con historia larga y comandos frecuentes (`git status`, `git log`, `grep`, lints); no aporta valor para prompts conversacionales sin comandos.
  5. **Gotchas y troubleshooting**:
     - **Colisión de nombres** con `reachingforthejack/rtk` (Rust Type Kit). Diagnóstico obligatorio: `which rtk` (identificar binario en PATH) + `rtk gain` (el RTK correcto responde con analytics; el otro devuelve `unknown subcommand` o similar). Instrucciones para desinstalar el intruso o precedencia en PATH.
     - Hook para Claude Code: qué reescribe, cómo se activa (bloque de configuración en `~/.claude/settings.json` o mecanismo vigente al redactar), cómo desactivarlo.
     - Fallback: `rtk proxy <cmd>` para saltarse la reescritura ante debugging.
  6. Bloque "Versión de referencia": `Documentado sobre RTK <versión al redactar>. Verificado el 2026-09-16`.
- [X] T007 [P] [US1] Escribir `docs/setup/caveman.md` con las cinco secciones fijas:
  1. **Qué es y qué problema resuelve**: Caveman (`https://github.com/juliusbrussee/caveman`), skill/CLI que aplica un registro "caveman" (fragmentos, sin artículos ni relleno) para reducir tokens de salida conservando la sustancia técnica.
  2. **Cómo instalar**: documentar **todos** los métodos oficiales del repositorio (skill de Claude Code, `pipx`, `pip --user`, `git clone`, etc.). Comandos copy-paste completos y **tabla comparativa** con las mismas columnas canónicas literales que RTK: `| Método | Requisitos | Velocidad | Facilidad de actualización | Contexto recomendado |`.
  3. **Verificación**: cómo comprobar que la skill/CLI está registrada (comando específico del proyecto), invocación de `/caveman` desde Claude Code, respuesta esperada.
  4. **Cuándo usarlo**: sesiones largas o repetitivas donde interesa reducir verbosidad sin perder rigor; evitarlo en documentación producida por Claude que se vaya a publicar tal cual (el registro caveman es interno).
  5. **Gotchas y troubleshooting**: niveles disponibles (`lite`, `full`, `ultra`), cómo activar y desactivar (`/caveman`, `stop caveman`, `normal mode`), riesgo de perder matices si se abusa del nivel `ultra`, incompatibilidades con reviews formales.
  6. Bloque "Versión de referencia": `Documentado sobre Caveman <versión al redactar>. Verificado el 2026-09-16`.
- [X] T008 [P] [US1] Escribir `docs/setup/codegraph.md` con las cinco secciones fijas:
  1. **Qué es y qué problema resuelve**: CodeGraph (`https://github.com/colbymchenry/codegraph`), índice SQLite de símbolos y llamadas de un repositorio para responder preguntas de código en una llamada MCP en lugar de un bucle grep+read; soporta 30+ lenguajes.
  2. **Cómo instalar**: documentar **todos** los métodos oficiales soportados (comando principal del README + alternativas), comandos copy-paste y **tabla comparativa** con las mismas columnas canónicas literales que RTK: `| Método | Requisitos | Velocidad | Facilidad de actualización | Contexto recomendado |`.
  3. **Verificación**: `codegraph --version` (o comando vigente), `codegraph init` en un proyecto de prueba, verificación de que se crea `.codegraph/`; consulta ejemplo con `codegraph explore "<pregunta>"` en un repo pequeño.
  4. **Cuándo usarlo**: repos indexables (con símbolos identificables) para acelerar navegación asistida por Claude; menos útil en repos muy pequeños o puramente configurativos.
  5. **Gotchas y troubleshooting**: proyectos sin `.codegraph/`, índice desactualizado tras cambios grandes (re-indexar), permisos SQLite, MCP no habilitado en Claude Code, tamaño del índice.
  6. **Ejemplo aplicado a la app CRUD Spring Boot 4** (subsección extra tras las cinco fijas): plantilla de comando `codegraph explore "flujo de creación de usuario"` con nota **"spec 4 pendiente"** y enlace a `../app-ejemplo/index.md`. Cuando la spec 4 publique la app real, se actualiza con la salida esperada.
  7. Bloque "Versión de referencia": `Documentado sobre CodeGraph <versión al redactar>. Verificado el 2026-09-16`.
- [X] T009 [US1] Ejecutar `uv run mkdocs build --strict` tras publicar `index.md` + 5 páginas de herramienta. Confirmar exit 0, cero líneas `WARNING`. Si aparece warning por `docs/setup/verificacion.md` inexistente todavía, se resuelve en US3. Además, verificar que el "Mapa de módulos" de la home enlaza correctamente al módulo de setup:
  ```bash
  grep -qE 'href="setup/(index\.html|)"' site/index.html \
    && echo "home → setup link: OK" \
    || echo "home → setup link: MISSING"
  ```
  Aceptación: el enlace home → setup resuelve en el HTML generado.

**Checkpoint**: sitio operativo con las 6 páginas de contenido de herramienta.

---

## Phase 4: User Story 2 — Aterrizaje directo a una herramienta ya instalada (Priority: P2)

**Goal**: garantizar que cualquiera puede abrir una página de herramienta y encontrar en <60 s el comando de instalación / verificación / troubleshooting, gracias a estructura homogénea, tabla comparativa (donde aplica) y bloque de referencia visible.

**Independent Test**: los tres scripts de auditoría del `quickstart.md` (escenarios 2, 3, 4) devuelven OK para las cinco páginas de herramienta creadas en US1. Un revisor humano llega en <60 s desde la home hasta el comando exacto de `rtk gain`.

### Implementation for User Story 2

- [X] T010 [US2] Auditar estructura fija de cinco secciones por página. Ejecutar:
  ```bash
  for slug in sdkman claude-code rtk caveman codegraph; do
    echo "=== $slug ==="
    grep -E '^## ' docs/setup/${slug}.md | head -5
  done
  ```
  Aceptación: las cinco primeras `##` de cada página coinciden literalmente con "Qué es y qué problema resuelve", "Cómo instalar", "Verificación", "Cuándo usarlo", "Gotchas y troubleshooting" en ese orden. Cualquier desviación obliga a corregir la página afectada de US1.
- [X] T011 [US2] Auditar bloque "Versión de referencia + fecha de verificación" en cada página de herramienta:
  ```bash
  for slug in sdkman claude-code rtk caveman codegraph; do
    grep -E 'Verificado el [0-9]{4}-[0-9]{2}-[0-9]{2}' docs/setup/${slug}.md \
      || echo "MISSING reference block in $slug"
  done
  ```
  Aceptación: cinco coincidencias, formato ISO. Ninguna fecha futura respecto a hoy. Ninguna fecha con más de 6 meses (constitution 1.0.2 norma operativa).
- [X] T012 [US2] Auditar métodos de instalación exhaustivos y tabla comparativa canónica en RTK / Caveman / CodeGraph:
  ```bash
  for slug in rtk caveman codegraph; do
    echo "=== $slug ==="
    echo "  sub-métodos: $(grep -cE '^### ' docs/setup/${slug}.md)"
    grep -qF '| Método | Requisitos | Velocidad | Facilidad de actualización | Contexto recomendado |' \
      "docs/setup/${slug}.md" \
      && echo "  tabla comparativa: OK" \
      || echo "  tabla comparativa: MISSING (cabecera canónica FR-004a ausente)"
  done
  ```
  Aceptación: cada página tiene ≥ 2 sub-secciones `###` (métodos de instalación) y la tabla comparativa contiene la cabecera **canónica literal** definida en FR-004a. Si falla, corregir la página en US1 sin renombrar columnas.

**Checkpoint**: estructura homogénea confirmada; aterrizajes directos garantizados.

---

## Phase 5: User Story 3 — Checklist de verificación con trazabilidad (Priority: P2)

**Goal**: publicar `docs/setup/verificacion.md` con al menos un check por herramienta (≥7 items), comandos copy-paste, output esperado y enlace directo a la subsección de troubleshooting correspondiente si un check falla.

**Independent Test**: siguiendo únicamente `verificacion.md`, cada línea del checklist tiene comando + criterio de éxito + enlace de diagnóstico. Ninguna línea queda huérfana.

### Implementation for User Story 3

- [X] T013 [US3] Escribir `docs/setup/verificacion.md` con:
  - Introducción breve: "Al terminar el módulo, ejecuta este checklist. Si algún comando falla, sigue el enlace de la línea correspondiente".
  - Checklist Markdown (`- [ ] …`) con al menos **7** items cubriendo SDKMAN, Java (Liberica), Maven, Claude Code (auth), RTK (versión + hook activo), Caveman (activación) y CodeGraph (índice). Cada línea con: descripción → comando en bloque `bash` → output esperado o criterio → enlace Markdown a la subsección `#gotchas-y-troubleshooting` (o `#verificacion`) de la página relevante.
  - Ejemplo mínimo por item:
    ```markdown
    - [ ] **SDKMAN**: `sdk version` devuelve `SDKMAN 5.19.0` o superior.
          Si falla → [SDKMAN › gotchas](sdkman.md#gotchas-y-troubleshooting).
    ```
  - Enlace de vuelta a `docs/setup/index.md`.
  - Bloque "Versión de referencia" con la misma fecha ISO utilizada en las otras páginas.
- [X] T014 [US3] Auditar el checklist:
  ```bash
  items=$(grep -cE '^- \[ \]' docs/setup/verificacion.md)
  echo "items=$items"
  test "$items" -ge 7 || echo "FAIL: <7 items"
  grep -E '^- \[ \]' docs/setup/verificacion.md | grep -vE '\[[^]]+\]\([^)]+\)' \
    && echo "FAIL: items sin enlace" \
    || echo "OK: todos los items enlazan"
  ```
  Aceptación: `items >= 7` y **todos** los items incluyen al menos un enlace Markdown.

**Checkpoint**: puerta de salida del módulo lista.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: cumplir SC-001 (<30 min máquina limpia), SC-004 (tono 5/5), SC-006 (aterrizaje <60 s), y sanity general.

- [X] T015 Auditar Bash canónica y nota Zsh única (Clarifications Q1, FR-002a). Ejecutar:
  ```bash
  echo "index.md: $(grep -c '~/\.zshrc' docs/setup/index.md)"
  for f in docs/setup/sdkman.md docs/setup/claude-code.md docs/setup/rtk.md \
           docs/setup/caveman.md docs/setup/codegraph.md docs/setup/verificacion.md; do
    n=$(grep -c '~/\.zshrc' "$f"); echo "$f: $n"
    test "$n" -eq 0 || echo "  FAIL: nota Zsh duplicada en $f"
  done
  ```
  Aceptación: `index.md` menciona `~/.zshrc` al menos una vez; el resto de páginas del módulo NO lo mencionan.
- [X] T016 Build final `uv run mkdocs build --strict`. Confirmar exit 0 y cero `WARNING`. Sanity de HTML generados y auditoría de assets pendientes:
  ```bash
  for slug in index sdkman claude-code rtk caveman codegraph verificacion; do
    p="site/setup/${slug}/index.html"
    [ "$slug" = "index" ] && p="site/setup/index.html"
    test -f "$p" && echo "OK  $p" || echo "MISS $p"
  done
  # Auditoría no bloqueante de assets pendientes (FR-014)
  todos=$(grep -RnE 'TODO\(asset\)' docs/setup/ 2>/dev/null | wc -l | tr -d ' ')
  echo "TODO(asset) pendientes: $todos (aviso, no bloquea aceptación)"
  ```
  Aceptación: HTMLs presentes; el conteo de `TODO(asset)` se registra en el reporte de aceptación pero no bloquea el merge (FR-014 los permite).
- [ ] T017 Revisión de tono profesional-directo (SC-004): pedir a personas del equipo que lean `docs/setup/index.md` + una página de herramienta al azar y respondan sí/no a "¿el tono respeta el Principio I de la constitution 1.0.2?". Aceptación estándar: 5 de 5 sí. **Soft-gate** (ajuste post-analyze): si no hay 5 revisores disponibles se acepta cerrar con **mínimo 3/3 revisores sí**, documentando el sample size en el reporte de aceptación. Si falla, corregir la página con el registro adecuado y re-medir.
- [ ] T018 Test cronometrado en máquina limpia (SC-001): sobre macOS 13+ o Ubuntu 22.04+ **sin** ninguna de las herramientas preinstaladas, seguir el módulo íntegro (comandos copy-paste) hasta que el checklist de `verificacion.md` quede en verde. Aceptación estándar: cronómetro ≤ 30 min con muestra representativa. **Soft-gate** (ajuste post-analyze): si no hay muestra representativa disponible se acepta con **una única medición** documentando máquina, OS, versión y tiempo real. Reportar tiempo real.
- [ ] T019 Test de aterrizaje directo (SC-006): con `uv run mkdocs serve` corriendo, arrancar cronómetro desde la home y navegar hasta encontrar el comando exacto de verificación de RTK (`rtk gain`). Prohibido usar el buscador; sólo nav lateral / superior. Aceptación: ≤ 60 s.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias externas.
- **Foundational (Phase 2)**: requiere Setup completo. Bloquea US1, US2, US3.
- **US1 (Phase 3)**: requiere Foundational.
- **US2 (Phase 4)**: requiere US1 completo (audita el contenido creado).
- **US3 (Phase 5)**: requiere US1 completo (necesita las secciones de troubleshooting para poder enlazar).
- **Polish (Phase 6)**: requiere US1, US2, US3.

### User Story Dependencies

- **US1 (P1)**: independiente.
- **US2 (P2)**: depende de US1 exclusivamente (auditoría).
- **US3 (P2)**: depende de US1 (enlaces a subsecciones de las páginas de herramienta). Puede ejecutarse en paralelo con US2 si hay dos personas.

### Within Each Story

- Dentro de US1: T003 (`index.md`) puede solaparse con T004–T008 (páginas hijas); T009 (build strict) al final. T004–T008 son [P] entre sí (archivos distintos).
- Dentro de US2: T010, T011, T012 son [P] entre sí (auditorías independientes sobre archivos ya creados).
- Dentro de US3: T013 antes de T014.

### Parallel Opportunities

- US1: T003–T008 son 6 tareas paralelizables (una persona por página).
- US2: T010, T011, T012 en paralelo.
- Polish: T015–T016 automatizables; T017/T018/T019 manuales, pueden repartirse.

---

## Parallel Example: User Story 1

```bash
# Tras T002 (nav actualizada):
Task: "Reescribir docs/setup/index.md (T003)"
Task: "Escribir docs/setup/sdkman.md (T004)"
Task: "Escribir docs/setup/claude-code.md (T005)"
Task: "Escribir docs/setup/rtk.md (T006)"
Task: "Escribir docs/setup/caveman.md (T007)"
Task: "Escribir docs/setup/codegraph.md (T008)"
# Al final:
Task: "uv run mkdocs build --strict (T009)"
```

---

## Implementation Strategy

### MVP First (US1 + US3)

1. Phase 1 Setup (T001).
2. Phase 2 Foundational (T002).
3. Phase 3 US1 (T003–T009) → contenido operativo.
4. Phase 5 US3 (T013–T014) → puerta de salida del módulo.
5. **STOP y VALIDAR**: el módulo ya permite completar el setup con checklist.

### Incremental Delivery

1. Setup + Foundational.
2. US1 → contenido en verde → demo interno.
3. US2 → auditoría estructural → confianza en aterrizajes directos.
4. US3 → checklist → módulo cerrado.
5. Polish → tono, cronómetro, aterrizaje real.

### Parallel Team Strategy

- Persona A: Phase 1 + 2 + T003 (`index.md`) + T009 (build final de US1).
- Personas A/B/C: T004–T008 en paralelo (una página cada uno).
- Persona A o B: Phase 4 US2 (T010–T012) mientras otra persona hace Phase 5 US3 (T013–T014).
- Todas: Phase 6 Polish (revisiones humanas).

---

## Notes

- [P] = archivos distintos, sin dependencias.
- No hay test tasks: la verificación es `mkdocs build --strict` + auditorías `grep` + revisiones manuales (tono, cronómetro, aterrizaje).
- **Fecha de verificación**: usar la misma fecha ISO capturada en T001 para el bloque "Verificado el …" en las 6 páginas de herramienta + `verificacion.md`. Consistencia obliga.
- Referencias a spec 4 (app CRUD) desde `codegraph.md` se dejan como enlace a `../app-ejemplo/index.md` (placeholder existente); se actualizarán cuando la spec 4 se implemente.
- Commit por checkpoint (fin de fase) o por grupo lógico.
