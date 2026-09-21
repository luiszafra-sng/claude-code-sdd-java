# Verificación

Al terminar el módulo, ejecuta este checklist en el orden indicado. Cada
línea tiene su comando y su salida esperada. Si alguna falla, sigue el
enlace de la línea al punto exacto donde arreglarlo.

## Checklist

- [ ] **SDKMAN** — `sdk version` devuelve `SDKMAN 5.19.0` o superior. Si falla → [SDKMAN › Gotchas y troubleshooting](sdkman.md#gotchas-y-troubleshooting).

    ```bash
    sdk version
    ```

- [ ] **Java (BellSoft Liberica)** — `java -version` devuelve `openjdk version "21.0.x"` y `java.vendor = BellSoft`. Si falla → [SDKMAN › Verificación](sdkman.md#verificacion).

    ```bash
    java -version
    java -XshowSettings:properties -version 2>&1 | grep java.vendor
    ```

    Salida esperada del segundo comando: `java.vendor = BellSoft`.

- [ ] **Maven** — `mvn -v` devuelve `Apache Maven 3.9.x`. Si falla → [SDKMAN › Verificación](sdkman.md#verificacion).

    ```bash
    mvn -v
    ```

- [ ] **Claude Code (binario)** — `claude --version` devuelve una versión semver. Si falla → [Claude Code › Gotchas y troubleshooting](claude-code.md#gotchas-y-troubleshooting).

    ```bash
    claude --version
    ```

- [ ] **Claude Code (autenticación)** — `claude auth status` devuelve OAuth con plan activo o autenticación con `ANTHROPIC_API_KEY`. Si falla → [Claude Code › Autenticación](claude-code.md#autenticacion).

    ```bash
    claude auth status
    ```

- [ ] **RTK (binario)** — `rtk --version` devuelve una versión semver. Si falla → [RTK › Gotchas y troubleshooting](rtk.md#gotchas-y-troubleshooting).

    ```bash
    rtk --version
    ```

- [ ] **RTK (funcional y sin colisión)** — `rtk gain` devuelve la tabla de ahorro (aunque esté vacía). Si en su lugar aparece `unknown subcommand: gain`, tienes instalado el paquete equivocado. Si falla → [RTK › Colisión de nombres](rtk.md#gotchas-y-troubleshooting).

    ```bash
    rtk gain
    ```

- [ ] **RTK (hook en Claude Code)** — `~/.claude/settings.json` contiene un bloque `PreToolUse` con `matcher: "Bash"` y `command: "rtk hook claude-code"`. Si falla → [RTK › Activar el hook con Claude Code](rtk.md#activar-el-hook-con-claude-code).

    ```bash
    grep -q '"rtk hook claude-code"' ~/.claude/settings.json && echo "hook OK" || echo "hook MISSING"
    ```

- [ ] **Caveman (skill registrada)** — `~/.claude/skills/caveman/SKILL.md` existe. Si falla → [Caveman › Cómo instalar](caveman.md#como-instalar).

    ```bash
    test -f ~/.claude/skills/caveman/SKILL.md && echo "skill OK" || echo "skill MISSING"
    ```

- [ ] **CodeGraph (binario)** — `codegraph --version` devuelve una versión semver. Si falla → [CodeGraph › Gotchas y troubleshooting](codegraph.md#gotchas-y-troubleshooting).

    ```bash
    codegraph --version
    ```

- [ ] **CodeGraph (índice funcional)** — `codegraph init` sobre un directorio de prueba genera `.codegraph/`. Si falla → [CodeGraph › Verificación](codegraph.md#verificacion).

    ```bash
    cd $(mktemp -d) && git init -q . && echo "def hello(): return 'hi'" > hello.py \
      && codegraph init && test -d .codegraph && echo "OK" || echo "FAIL"
    ```

Cuando todas las líneas estén marcadas, el entorno queda listo para el
resto de la formación.

---

!!! info "Versión de referencia"
    Documentado sobre SDKMAN 5.19.0, BellSoft Liberica 21.0.4-librca,
    Maven 3.9.9, Claude Code 1.6.x, RTK 0.7.x, Caveman `main`,
    CodeGraph `main`. **Verificado el 2026-09-16.**
