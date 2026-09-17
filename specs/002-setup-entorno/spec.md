# Feature Specification: Módulo "Setup del entorno"

**Feature Branch**: `002-setup-entorno`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Módulo 'Setup del entorno' — que un participante pueda dejar operativo su entorno de trabajo con Claude para la formación en <30 min. Contenidos: index, sdkman, claude-code, rtk, caveman, codegraph, verificacion."

## Clarifications

### Session 2026-09-16

- Q: ¿Cómo debe tratar la guía la dualidad Zsh / Bash a la hora de dar comandos y snippets de configuración? → A: Bash canónica en todos los snippets; nota inicial única en `docs/setup/index.md` indicando que Zsh es equivalente y que sólo cambia `~/.bashrc` por `~/.zshrc` al cargar herramientas.
- Q: ¿Qué método de autenticación de Claude Code debe documentar la guía como camino principal para arrancar? → A: Documentar ambos (login OAuth con cuenta Claude para suscripción Pro/Max/Team y API key `ANTHROPIC_API_KEY` desde Anthropic Console), con criterios explícitos de cuándo elegir cada uno.
- Q: ¿Qué distribución concreta de JDK 21 debe usar la guía como valor por defecto en los comandos de SDKMAN? → A: **BellSoft Liberica** (identificador SDKMAN `-librca`, p. ej. `21.0.4-librca`). Se documenta explícitamente en `docs/setup/sdkman.md` como la distribución fijada por la formación.
- Q: ¿Qué método de instalación debe documentar la guía para RTK, Caveman y CodeGraph? → A: Documentar **todos los métodos oficiales disponibles** por herramienta (script oficial, gestores de paquetes, build desde fuentes, binarios prebuilt), con comandos copy-paste completos para cada uno y una tabla comparativa que ayude al participante a elegir según su contexto (velocidad, control, permisos, actualización).
- Q: ¿Con qué política se declara y refresca el bloque "versión de referencia" de cada página de herramienta? → A: Versión + **fecha de verificación** explícitas en cada página; compromiso de **re-verificación semestral** o cuando cualquier herramienta publique versión mayor upstream. Se incorpora como norma en la constitution (Development & Publishing Workflow).
- Ajuste post-analyze (2026-09-16): (a) fecha ISO de verificación fijada literalmente en `2026-09-16` para toda la implementación inicial de este módulo (todas las páginas comparten fecha); (b) nombres canónicos de columnas de la tabla comparativa (FR-004a) fijados sin flexibilidad: `Método | Requisitos | Velocidad | Facilidad de actualización | Contexto recomendado`; (c) T016 audita `TODO(asset)` como aviso no bloqueante; (d) T009 verifica que el enlace home → `setup/index.md` resuelve tras el rename anidado; (e) T017 (revisión de tono) y T018 (cronómetro máquina limpia) se aceptan como **soft-gate**: pueden cerrarse con muestra reducida documentada (mínimo 3/3 revisores en T017; una sola persona con snapshot de tiempo en T018) sin bloquear merge.
- Reordenación post-implementación (2026-09-16): SDKMAN pasa de primer documento del módulo a **penúltimo** (justo antes de Verificación). Motivo: Claude Code es la herramienta central de la formación; RTK, Caveman y CodeGraph orbitan a su alrededor; SDKMAN sólo interviene en los módulos de Java (spec 4 en adelante), por lo que introducirlo al final del setup evita fricción para participantes que empiezan por el flujo IA antes de tocar el JDK. FR-001 refleja el nuevo orden; los enlaces `Anterior / Siguiente` de las páginas afectadas se actualizan en consecuencia.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dejar el entorno operativo desde cero en menos de 30 minutos (Priority: P1)

Una persona que nunca ha usado Claude Code ni conoce el resto de herramientas
abre el sitio, entra en "Setup del entorno" y sigue las páginas en el orden
sugerido. Al final del recorrido tiene: Claude Code instalado y respondiendo,
SDKMAN con un JDK y Maven instalados, RTK y Caveman funcionales, y CodeGraph
listo para indexar un proyecto. El tiempo total invertido es menor de 30
minutos en una máquina razonable con conexión estable.

**Why this priority**: sin esto no se puede empezar ninguno de los módulos
posteriores. Es el requisito de arranque de toda la formación.

**Independent Test**: en una máquina limpia (macOS o Ubuntu 22.04, o WSL2
sobre Windows 11) sin ninguna de las herramientas preinstaladas, seguir el
módulo debe llevar a un estado en el que los comandos de verificación finales
(`claude --version`, `rtk --version`, `java -version`, `mvn -v`, `codegraph
--help`, y activación de Caveman) devuelvan salidas coherentes en menos de 30
minutos.

**Acceptance Scenarios**:

1. **Given** máquina limpia con shell soportada, **When** el participante
   completa el módulo siguiendo las páginas en orden, **Then** el checklist
   final (`verificacion.md`) queda en verde sin necesidad de consultar
   fuentes externas.
2. **Given** un comando de instalación falla por un error conocido (p. ej.
   xcode-select en macOS, permisos, PATH), **When** el participante consulta
   la sección de troubleshooting de esa herramienta, **Then** encuentra la
   causa típica y su solución con comandos exactos.
3. **Given** una máquina con Windows nativo, **When** el participante intenta
   seguir la guía, **Then** el `index.md` le redirige explícitamente a WSL2
   con un enlace a documentación oficial y no cae en instrucciones que
   asumen POSIX.

---

### User Story 2 - Consultar rápidamente una herramienta ya instalada (Priority: P2)

Alguien con parte del entorno ya configurado (por ejemplo, Claude Code
instalado pero sin RTK, o SDKMAN sin Maven) entra directamente en la página
de la herramienta que le falta, sigue únicamente la sección "instalación" y
"verificación", y continúa con su trabajo.

**Why this priority**: la formación se va a consultar como referencia también
por gente que ya tiene entorno; la navegación debe permitir aterrizajes
directos sin obligar a leer el módulo completo.

**Independent Test**: al abrir cualquier página del módulo, la sección de
instalación empieza en los primeros dos scrolls y todas las secciones fijas
(qué hace, cómo instalar, cómo verificar, cuándo usar, gotchas) están
enlazadas desde una tabla de contenidos visible.

**Acceptance Scenarios**:

1. **Given** el sitio en local, **When** se abre `docs/setup/rtk.md`, **Then**
   se ve claramente su estructura: "Qué es", "Cómo instalar", "Verificación",
   "Cuándo usarlo", "Gotchas" (o secciones equivalentes), en ese orden y
   como headings navegables.
2. **Given** el sitio en local, **When** se abre cualquier página del módulo,
   **Then** existe un enlace de vuelta a `docs/setup/index.md` (breadcrumbs o
   nav lateral) sin recargar.

---

### User Story 3 - Confirmar que todo está listo antes de continuar con la formación (Priority: P2)

Al terminar la instalación, el participante entra en `verificacion.md` y
ejecuta un checklist con comandos concretos que producen outputs
predecibles. Si algo falla, el checklist le devuelve al punto exacto del
módulo donde arreglarlo.

**Why this priority**: sin puerta de salida clara, el módulo queda abierto y
el resto de la formación empieza con entornos inconsistentes.

**Independent Test**: siguiendo únicamente `verificacion.md` sobre una
instalación completa, cada línea del checklist tiene su comando y su output
esperado. Cualquier fallo tiene link directo a la página que lo cubre.

**Acceptance Scenarios**:

1. **Given** entorno instalado correctamente, **When** el participante
   ejecuta el checklist en orden, **Then** todos los comandos devuelven la
   salida documentada.
2. **Given** un comando del checklist falla, **When** el participante
   consulta la línea afectada, **Then** encuentra un enlace directo a la
   subsección de troubleshooting de esa herramienta.

---

### Edge Cases

- Máquina con Homebrew en Apple Silicon vs macOS Intel: se indica cómo
  detectar la arquitectura antes de instalar.
- Shell Zsh vs Bash: instrucciones separadas para cargar SDKMAN, RTK y
  Caveman en el `~/.zshrc` o `~/.bashrc` correspondiente.
- Windows nativo: NO soportado; se redirige a WSL2 en el `index.md`.
- Fish y otras shells: fuera de alcance; se documenta explícitamente que la
  guía asume Zsh o Bash y se anima a adaptar.
- Colisión de nombres: la página de RTK avisa del conflicto con
  `reachingforthejack/rtk` (Rust Type Kit) y da comandos para diagnosticarlo.
- Máquina corporativa con proxy o firewall: se marca como fuera de alcance
  para esta spec; se anota en cada herramienta cuando aplica.
- Instalación previa parcial: el checklist final permite detectar estados
  inconsistentes (p. ej. Java sin Maven, RTK sin hook activado en Claude
  Code).
- Actualización de una herramienta ya instalada: cada página incluye el
  comando de actualización recomendado (`sdk upgrade`, `claude update` si
  aplica, `brew upgrade`, `curl … | bash` para RTK, etc.).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El módulo DEBE existir en `docs/setup/` con siete páginas
  en este orden en `mkdocs.yml`:
  `index.md`, `claude-code.md`, `rtk.md`, `caveman.md`, `codegraph.md`,
  `sdkman.md`, `verificacion.md`. SDKMAN se sitúa al final de las
  herramientas (justo antes de la verificación) por decisión de producto
  del 2026-09-16: Claude Code y sus complementos (RTK, Caveman,
  CodeGraph) son la puerta de entrada de la formación; SDKMAN sólo se
  necesita cuando entran los proyectos Java (specs 4 en adelante).
- **FR-002**: `docs/setup/index.md` DEBE incluir: propósito del módulo, mapa
  de las seis páginas, requisitos previos (sistemas operativos soportados:
  macOS 13+, Ubuntu 22.04+, WSL2 sobre Windows 11), decisión de shell y
  estimación de tiempo (<30 min). Sobre la shell: la guía canoniza **Bash**
  para todos los snippets; incluye una **nota única** al principio del
  `index.md` explicando que en Zsh los comandos son idénticos y que el
  único cambio es sustituir `~/.bashrc` por `~/.zshrc` cuando se cargue
  una herramienta. Fish y otras shells quedan fuera de alcance.
- **FR-002a**: Ninguna página del módulo (ni `sdkman.md`, ni
  `claude-code.md`, ni `rtk.md`, ni `caveman.md`, ni `codegraph.md`, ni
  `verificacion.md`) DEBE duplicar snippets Zsh y Bash. Toda referencia a
  la shell canónica usa la sintaxis de Bash; si alguna herramienta ofrece
  instaladores específicos por shell (p. ej. SDKMAN), la página remite a la
  nota general del `index.md` y no reintroduce la dualidad.
- **FR-003**: Cada una de las páginas de herramientas (`sdkman.md`,
  `claude-code.md`, `rtk.md`, `caveman.md`, `codegraph.md`) DEBE contener
  como mínimo estas secciones, en este orden, con nombres reconocibles: (1)
  "Qué es y qué problema resuelve", (2) "Cómo instalar", (3) "Verificación",
  (4) "Cuándo usarlo", (5) "Gotchas y troubleshooting". Se admite añadir
  secciones adicionales (p. ej. "Uso avanzado") tras estas cinco.
- **FR-004**: Los comandos de instalación y verificación DEBEN ser
  **exactos y copiables**: bloques de código con la sintaxis correcta para
  la shell asumida, sin placeholders del tipo `<tu-usuario>` cuando pueda
  evitarse, y con outputs esperados citados donde tenga sentido. No se
  admiten instrucciones de la forma "instálalo como sepas" o "sigue la
  documentación oficial" como sustituto del comando.
- **FR-004a**: Para RTK, Caveman y CodeGraph, la página de cada
  herramienta DEBE documentar **todos los métodos de instalación oficiales
  disponibles en su repositorio** (por ejemplo: script `curl | bash`,
  binarios prebuilt, `cargo install`, `pipx install`, `npm i -g`,
  `brew install`, `git clone` + build, según lo que ofrezca cada
  proyecto). Cada método DEBE incluir su bloque de comandos copy-paste
  completo. La página DEBE incluir además una **tabla comparativa** con
  las siguientes columnas y nombres canónicos, en este orden exacto:
  `| Método | Requisitos | Velocidad | Facilidad de actualización |
  Contexto recomendado |`. No se admite renombrar las cabeceras; auditar
  con `grep` estos nombres literales.
- **FR-005**: `docs/setup/sdkman.md` DEBE cubrir: qué es SDKMAN y por qué
  la formación lo usa para gestionar JDK y Maven, instalación paso a paso
  (`curl -s "https://get.sdkman.io" | bash` y carga en shell), comandos
  esenciales (`sdk install java 21.0.4-librca`, `sdk install maven`, `sdk
  env`, uso de `.sdkmanrc` y `sdk env install`), verificación (`sdk
  version`, `java -version`, `mvn -v`), y troubleshooting típico (SDKMAN no
  cargado en la sesión, `SDKMAN_DIR` mal apuntado, cambio de shell). La
  distribución de JDK fijada por la formación es **BellSoft Liberica**
  (identificador SDKMAN `-librca`); la página lo indica explícitamente al
  presentar los comandos de instalación y aclara que otras distribuciones
  (Temurin, Corretto, Zulu, GraalVM) son válidas pero quedan fuera del
  camino soportado.
- **FR-006**: `docs/setup/claude-code.md` DEBE cubrir: qué es Claude Code,
  cómo instalarlo, comprobación con `claude --version`, primer arranque y
  autenticación, explicación breve de los permission modes básicos
  (accept edits / plan / default / bypass permissions) sin entrar en detalle
  fino (eso ya vendrá en el módulo SDD), y ubicaciones estándar (`~/.claude/`
  a nivel usuario y `.claude/` a nivel proyecto).
- **FR-006a**: La sección de autenticación de `docs/setup/claude-code.md`
  DEBE documentar **ambos** métodos y ofrecer criterios explícitos de
  elección:
  (1) **Login OAuth con cuenta Claude** (`claude` abre navegador, cubre
  suscripción Pro / Max / Team). Recomendado por defecto para participantes
  con cuenta Claude ya activa.
  (2) **API key de Anthropic Console** con `ANTHROPIC_API_KEY` como
  variable de entorno; facturación por uso.
  Criterios: OAuth cuando el participante ya tiene suscripción y quiere
  facturación consolidada; API key cuando trabaja sin suscripción, integra
  Claude Code en scripts / CI, o gestiona su propio presupuesto por
  proyecto. Cada método DEBE incluir comandos exactos y comprobación
  específica (por ejemplo, `claude auth status`, `echo
  $ANTHROPIC_API_KEY | head -c 8`).
- **FR-007**: `docs/setup/rtk.md` DEBE cubrir: qué es RTK
  (`https://github.com/rtk-ai/rtk`), qué problema resuelve (proxy que
  reduce el consumo de tokens en operaciones de desarrollo típicas entre
  un 60% y un 90%), cómo instalarlo, verificación con `rtk --version` y
  `rtk gain`, **advertencia explícita** sobre la colisión de nombres con
  `reachingforthejack/rtk` (Rust Type Kit) con un comando de diagnóstico
  (`which rtk`, `rtk gain` como test funcional), y explicación del hook
  para Claude Code (qué reescribe, cómo se activa y cómo desactivarlo si
  se necesita).
- **FR-008**: `docs/setup/caveman.md` DEBE cubrir: qué es Caveman
  (`https://github.com/juliusbrussee/caveman`), qué hace (compresión de
  tokens de salida a un registro "caveman" que preserva sustancia técnica
  reduciendo verbosidad), instalación, niveles disponibles (`lite`, `full`,
  `ultra`), cómo activar y desactivar (comandos `/caveman`, `stop caveman`,
  `normal mode`), y criterios para elegir cuándo aplicarlo y cuándo no.
- **FR-009**: `docs/setup/codegraph.md` DEBE cubrir: qué es CodeGraph
  (`https://github.com/colbymchenry/codegraph`), instalación,
  `codegraph init` en un proyecto, cómo Claude Code consulta el índice
  `.codegraph/` (herramienta MCP `codegraph_explore` y CLI `codegraph
  explore`), y un ejemplo de uso referenciado con la app CRUD Spring Boot 4
  cuya spec queda pendiente (spec 4).
- **FR-010**: `docs/setup/verificacion.md` DEBE incluir un checklist final
  con al menos una comprobación por herramienta (comando + output esperado
  o criterio de éxito), y cada línea DEBE enlazar a la página o subsección
  correspondiente para diagnóstico si falla.
- **FR-011**: Todas las páginas DEBEN estar cruzadas: `index.md` enlaza a
  cada una de las siete, cada página de herramienta enlaza como mínimo a
  `index.md` (vuelta) y a `verificacion.md` (siguiente paso). La home del
  sitio (`docs/index.md`) DEBE tener actualizado su mapa de módulos para
  que la entrada "Setup del entorno" enlace a `setup/index.md` (esto ya
  existe; se verifica).
- **FR-012**: El sitio DEBE seguir cumpliendo `uv run mkdocs build
  --strict` sin warnings tras la incorporación de estas páginas (heredado
  del Principio VI y de la spec 001).
- **FR-013**: El registro de tono DEBE respetar el Principio I de la
  constitution 1.0.1: profesional y directo. Sin argot ("a saco", "picar
  código") ni frases coloquiales.
- **FR-014**: Los assets pesados (screenshots, asciicasts, GIFs) son
  **opcionales** en esta iteración. Cuando se identifique un punto donde un
  screenshot ayudaría (por ejemplo, primera pantalla de Claude Code), se
  DEBE marcar con una nota `<!-- TODO(asset): captura de … -->` embebida en
  el Markdown, sin bloquear la aceptación del módulo.
- **FR-015**: Cada página de herramienta DEBE indicar un bloque visible
  al principio o al final con **versión de referencia + fecha de
  verificación**, p. ej. `Documentado sobre SDKMAN 5.19.0, BellSoft
  Liberica 21.0.4-librca, RTK 0.7.0. Verificado el 2026-09-16`. Este
  bloque DEBE re-verificarse:
  (1) **cada 6 meses** como mínimo (política semestral), y
  (2) **inmediatamente** cuando cualquier herramienta cubierta publique
  una versión mayor upstream.
  Tras cada re-verificación se actualiza la fecha; si la versión ha
  cambiado, se actualiza también el número. Esta política queda recogida
  en la constitution del proyecto.

### Key Entities

- **Módulo de setup**: sección del sitio compuesta por siete páginas
  Markdown cohesionadas. Atributos: título, mapa de páginas, requisitos
  previos, estimación de tiempo.
- **Página de herramienta**: entrada dedicada a una herramienta específica
  (SDKMAN, Claude Code, RTK, Caveman, CodeGraph). Estructura fija de cinco
  secciones mínimas.
- **Checklist de verificación**: colección ordenada de comprobaciones
  ejecutables (comando + output esperado + enlace a diagnóstico).
- **Requisitos previos del participante**: sistema operativo soportado,
  shell utilizada, conectividad a internet, permisos de administración
  local.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una persona sin ninguna de las herramientas preinstaladas
  puede completar el módulo en **≤ 30 minutos** (medido con cronómetro)
  usando exclusivamente el contenido publicado, sobre macOS 13+ o Ubuntu
  22.04+.
- **SC-002**: **100% de los comandos** de instalación y verificación
  presentados en el módulo son ejecutables sin edición (copy-paste). Los
  únicos placeholders permitidos son valores que el usuario debe elegir
  (por ejemplo, una ruta de proyecto), y siempre están marcados
  explícitamente.
- **SC-003**: El checklist final de `verificacion.md` cubre las **cinco**
  herramientas y **cada línea fallida** enlaza a la sección de
  troubleshooting correspondiente (100% de trazabilidad).
- **SC-004**: 5 de 5 revisiones internas al módulo confirman que el tono
  cumple el Principio I de la constitution 1.0.1 (profesional y directo,
  sin argot ni frases coloquiales).
- **SC-005**: `uv run mkdocs build --strict` sigue en verde (exit 0, 0
  `WARNING`) tras publicar las siete páginas.
- **SC-006**: En un test de "aterrizaje directo", una persona con Claude
  Code ya instalado puede localizar el comando exacto para verificar RTK
  en menos de **60 segundos** desde la home del sitio, siguiendo sólo la
  navegación.

## Assumptions

- La audiencia trabaja en macOS 13+, Ubuntu 22.04+ o WSL2 sobre Windows 11.
  Windows nativo y Fish shell quedan fuera de alcance (se documenta
  explícitamente).
- La audiencia tiene privilegios de administrador en su máquina local y
  conexión estable a internet (≥ 5 Mbps sostenidos durante la instalación).
- Los repositorios de las herramientas externas mencionadas (RTK, Caveman,
  CodeGraph) siguen disponibles bajo las URLs oficiales indicadas.
- No se documenta configuración detrás de proxies corporativos; si aparece,
  se remite a la documentación oficial de cada herramienta.
- La versión de referencia de cada herramienta se fija al momento de
  redactar el módulo y se declara explícitamente en la página (FR-015). Un
  cambio mayor upstream puede exigir una actualización del módulo, no
  cubierta por esta spec.
- Las capturas de pantalla, asciicasts o vídeos quedan como "nice to have"
  para una iteración posterior; su ausencia no bloquea aceptación.
- La app CRUD Spring Boot 4 referenciada por `codegraph.md` aún no existe;
  la página incluye la referencia como enlace pendiente al módulo de spec 4.

**Deferidos a specs posteriores** (fuera de alcance aquí):

- Contenido del módulo `CLAUDE.md` (spec 3).
- App CRUD Spring Boot 4 (spec 4).
- Módulo SDD con Speckit (spec 5).
- Módulos Agentes / Skills (specs 6 y 7).
- Pipeline CI/CD y despliegue en GitLab Pages (spec 8).
- Detalles avanzados de RTK, Caveman y CodeGraph que no sean necesarios
  para arrancar (se irán cubriendo en su spec correspondiente si aplica).
