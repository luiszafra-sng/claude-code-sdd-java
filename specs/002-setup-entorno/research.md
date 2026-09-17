# Phase 0 Research: Módulo "Setup del entorno"

**Feature**: 002-setup-entorno
**Date**: 2026-09-16

Todas las `NEEDS CLARIFICATION` de la spec fueron resueltas durante
`/speckit-clarify` (5 preguntas, sesión 2026-09-16). Este documento
consolida decisiones técnicas para la implementación, con racional y
alternativas descartadas.

---

## 1. Shell canónica

- **Decision**: Bash como shell canónica en todos los snippets del módulo.
  Nota unificada al inicio de `docs/setup/index.md` explicando que Zsh es
  equivalente y que sólo cambia `~/.bashrc` por `~/.zshrc` al cargar
  herramientas.
- **Rationale**: minimiza duplicación y mantenimiento. Los comandos POSIX
  usados son idénticos en Bash y Zsh; sólo difiere el fichero rc.
- **Alternatives considered**:
  - Duplicar con `pymdownx.tabbed` → doble mantenimiento sin ganancia real.
  - Zsh canónica → coincide con macOS default pero excluye a Linux/CI.
  - Detección automática `$SHELL` → complica los snippets sin beneficio
    proporcional.

## 2. Distribución de JDK

- **Decision**: **BellSoft Liberica** JDK 21 LTS, identificador SDKMAN
  `21.0.4-librca` (o última patch estable disponible en el momento de
  redacción; se declara en el bloque "versión de referencia").
- **Rationale**: exigido explícitamente por el usuario (Clarifications Q3).
  Liberica JDK es OpenJDK certificado TCK, con paquetes Full/Standard,
  soporte comercial disponible y presencia en SDKMAN estable.
- **Alternatives considered**: Temurin (`-tem`), Corretto (`-amzn`), Zulu
  (`-zulu`), GraalVM CE (`-graalce`) — descartadas por decisión.

## 3. Autenticación de Claude Code

- **Decision**: `docs/setup/claude-code.md` documenta **ambos** métodos con
  criterios de elección:
  - **OAuth con cuenta Claude** (comando `claude` abre navegador). Cubre
    suscripción Pro / Max / Team. Recomendado cuando ya se dispone de
    cuenta.
  - **API key** `ANTHROPIC_API_KEY` (variable de entorno). Facturación por
    uso. Recomendado para participantes sin suscripción, integración en
    scripts / CI, o control de presupuesto por proyecto.
- **Rationale**: Clarifications Q2. Ambos son caminos oficiales soportados
  por Claude Code; cubrir los dos evita bloquear participantes con
  distintos setups (personal vs corporativo).
- **Alternatives considered**: sólo OAuth (excluye API key en CI/scripts);
  sólo API key (excluye suscripciones); SSO corporativo (no aplica de
  forma general).

## 4. Métodos de instalación de RTK / Caveman / CodeGraph

- **Decision**: cada página documenta **todos los métodos oficiales
  disponibles** en el repositorio de la herramienta, con comandos
  copy-paste completos y una **tabla comparativa** (método × requisitos ×
  velocidad × facilidad de actualización × contexto recomendado).
- **Métodos a documentar por herramienta**:
  - **RTK** (`https://github.com/rtk-ai/rtk`, escrito en Rust):
    - Script oficial `curl -sSf https://…/install.sh | sh` (si lo ofrece).
    - `cargo install rtk-ai-cli` (o similar según nombre real del crate).
    - Binario prebuilt desde Releases (macOS/Linux `arm64`/`x86_64`).
    - `brew install rtk-ai/tap/rtk` (si existe tap).
    - Build desde fuentes: `git clone … && cargo install --path .`.
    - Nota crítica: colisión de nombre con `reachingforthejack/rtk` (Rust
      Type Kit). Diagnóstico: `which rtk` + `rtk gain` (sólo el RTK
      correcto responde con analytics).
  - **Caveman** (`https://github.com/juliusbrussee/caveman`, Python):
    - `pipx install caveman-cli` (o nombre real del paquete).
    - `pip install --user caveman-cli`.
    - Instalación de skill/plugin directamente en `~/.claude/skills/` vía
      `git clone` si es una skill de Claude Code (revisar README).
    - Build desde fuentes.
  - **CodeGraph** (`https://github.com/colbymchenry/codegraph`):
    - Método principal según README (probablemente `pipx install
      codegraph` o `npm i -g @colbymchenry/codegraph` o binary release).
    - Alternativas listadas.
- **Rationale**: Clarifications Q4. Al documentar todos los métodos con
  comandos exactos, cada participante elige el que encaja con su entorno
  (con o sin Rust, con o sin Python, con o sin Homebrew…). La tabla
  comparativa evita la parálisis por elección.
- **Alternatives considered**: un único método por herramienta (más
  limpio pero excluyente); método uniforme entre herramientas (fricción
  artificial); dejar que el participante consulte el README oficial
  (violaría FR-004 "nada de instálalo como sepas").

**Nota de implementación**: durante la fase de implementación, cada
comando exacto se **verifica en máquina** antes de publicar. Si el
repositorio oficial de una herramienta cambia de método principal, se
actualiza esta sección y se aplica la política de re-verificación
semestral (constitution 1.0.2).

## 5. Bloque "versión de referencia + fecha de verificación"

- **Decision**: cada página de herramienta lleva al final (o al principio,
  formato consistente) un bloque tipo:

  ```markdown
  !!! info "Versión de referencia"
      Documentado sobre RTK 0.7.0. Verificado el 2026-09-16.
  ```

  La re-verificación es **semestral** (norma operativa constitution
  1.0.2). Cuando la herramienta publique una versión mayor upstream, se
  refresca inmediatamente.
- **Rationale**: Clarifications Q5. Trazabilidad clara sin obligar a un
  ciclo demasiado corto.
- **Alternatives considered**: sólo versión sin fecha (opaco); revisión
  mensual con marca de obsolescencia (demasiado ruido); reactiva (deuda
  técnica silenciosa).

## 6. Requisitos previos del participante

- **Decision**: `docs/setup/index.md` documenta:
  - Sistema operativo soportado: macOS 13+ (Apple Silicon o Intel), Ubuntu
    22.04+, WSL2 sobre Windows 11.
  - Shell: Bash o Zsh. Fish y otras shells fuera de alcance.
  - Permisos de administración local.
  - Conexión a internet ≥ 5 Mbps sostenidos durante la instalación.
  - Windows nativo NO soportado: redirect a WSL2 con enlace oficial.
- **Rationale**: alinea con Assumptions de la spec.

## 7. Estructura de página de herramienta

- **Decision**: cinco secciones fijas y en este orden, con `##` como
  nivel:
  1. Qué es y qué problema resuelve
  2. Cómo instalar
  3. Verificación
  4. Cuándo usarlo
  5. Gotchas y troubleshooting

  Se admite añadir secciones extra tras las cinco (p. ej. "Uso avanzado",
  "Referencias") sin romper el patrón.
- **Rationale**: FR-003. Homogeneidad = aterrizajes directos rápidos
  (SC-006: <60 s para encontrar el comando de verificación de RTK).

## 8. `docs/setup/index.md` (mapa del módulo)

- **Decision**: contiene:
  - Propósito y estimación de tiempo (<30 min).
  - Requisitos previos (OS soportado + shell + permisos + red).
  - Nota **única** sobre Bash canónica vs Zsh (equivalencia + cambio de
    rc).
  - Orden recomendado de lectura (actualizado 2026-09-16):
    Claude Code → RTK → Caveman → CodeGraph → SDKMAN → Verificación.
    SDKMAN se mueve al final: sólo se necesita cuando entran los
    módulos Java (spec 4 en adelante); Claude Code y sus complementos
    IA abren el módulo por ser la puerta de entrada de la formación.
  - Enlaces a las 6 páginas siguientes.
  - Enlace de vuelta a la home del sitio.

## 9. `docs/setup/verificacion.md` (checklist final)

- **Decision**: checklist con al menos una comprobación por herramienta,
  formato:

  ```markdown
  - [ ] SDKMAN: `sdk version` devuelve `SDKMAN 5.19.0` o superior.
        Si falla → [SDKMAN › troubleshooting](sdkman.md#gotchas-y-troubleshooting).
  - [ ] Java: `java -version` devuelve `openjdk 21.0.x-LTS ... Liberica ...`.
        Si falla → [SDKMAN › verificación](sdkman.md#verificacion).
  ```

  Cada línea fallida enlaza a la sección de la página de la herramienta que
  cubre el diagnóstico (trazabilidad 100%, SC-003).

## 10. Actualización de `mkdocs.yml`

- **Decision**: reemplazar en `nav` la entrada
  `- Setup del entorno: setup/index.md` por una entrada anidada (orden
  actualizado 2026-09-16, SDKMAN al final de las herramientas):

  ```yaml
  - Setup del entorno:
      - setup/index.md
      - Claude Code: setup/claude-code.md
      - RTK: setup/rtk.md
      - Caveman: setup/caveman.md
      - CodeGraph: setup/codegraph.md
      - SDKMAN: setup/sdkman.md
      - Verificación: setup/verificacion.md
  ```

- **Rationale**: FR-011 (páginas registradas + `--strict` no fallará por
  huérfanas gracias al `validation.nav.omitted_files: warn` heredado de
  spec 001).

## 11. Home del sitio

- **Decision**: `docs/index.md` ya enlaza a `setup/index.md` desde la
  spec 001; no requiere cambio adicional. Se verifica que el enlace sigue
  siendo válido tras el rename anidado (MkDocs lo respeta al ser el mismo
  `index.md`).

## 12. Actualización de la app CRUD en `codegraph.md`

- **Decision**: `codegraph.md` incluye un ejemplo de uso apuntando a la
  app CRUD Spring Boot 4 con nota "spec 4 pendiente" y enlace hacia
  `docs/app-ejemplo/index.md` (placeholder actual). Cuando la spec 4
  publique la app real, se actualiza el ejemplo con comandos concretos.
- **Rationale**: FR-009. Evita duplicar contenido no-existente y ancla el
  futuro trabajo.

## NEEDS CLARIFICATION residuales

Ninguna. Todas resueltas en la sesión de `/speckit-clarify` 2026-09-16.
