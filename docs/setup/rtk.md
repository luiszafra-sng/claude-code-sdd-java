# RTK

## Qué es y qué problema resuelve

[RTK](https://github.com/rtk-ai/rtk) (*Rust Token Killer*) es un proxy
CLI que se coloca entre la terminal y los comandos de dev ops habituales
(`git`, `grep`, `find`, listados, análisis) y reescribe sus resultados
para reducir el consumo de tokens cuando esos comandos se ejecutan
dentro de una sesión de Claude Code.

Según su README, el ahorro medio se sitúa entre el **60% y el 90%** en
operaciones típicas. El objetivo no es el ahorro por sí mismo, sino que
Claude Code pueda mantener sesiones más largas sin agotar el contexto
antes de tiempo.

RTK es transparente: el usuario ejecuta `git status` como siempre; un
hook lo reescribe internamente a `rtk git status` y devuelve una salida
compactada.

## Cómo instalar

RTK ofrece varios métodos oficiales. Elige uno según tu contexto:

### Método 1 — Script oficial (recomendado)

```bash
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
```

Deja el binario `rtk` en `~/.local/bin/`. Reinicia la terminal o
`source ~/.bashrc` (equivalencia Zsh en la [nota del índice](index.md#shell)).

### Método 2 — Binario prebuilt desde Releases

Descargar el binario correspondiente al SO y arquitectura desde
<https://github.com/rtk-ai/rtk/releases>, extraerlo y moverlo a `~/.local/bin/`:

```bash
mkdir -p ~/.local/bin
curl -fsSL -o rtk.tar.gz \
  "https://github.com/rtk-ai/rtk/releases/latest/download/rtk-$(uname -s)-$(uname -m).tar.gz"
tar -xzf rtk.tar.gz -C ~/.local/bin/
chmod +x ~/.local/bin/rtk
rm rtk.tar.gz
```

### Método 3 — `cargo install`

Requiere Rust toolchain (`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`):

```bash
cargo install rtk-cli
```

### Método 4 — Homebrew (macOS / Linux con Homebrew)

```bash
brew install rtk-ai/tap/rtk
```

### Método 5 — Build desde fuentes

```bash
git clone https://github.com/rtk-ai/rtk.git
cd rtk
cargo install --path .
```

### Tabla comparativa

| Método | Requisitos | Velocidad | Facilidad de actualización | Contexto recomendado |
|--------|------------|-----------|----------------------------|----------------------|
| Script oficial | `curl` | Rápida (<1 min) | `rtk selfupdate` o re-ejecutar script | Máquina personal sin Rust |
| Binario prebuilt | `curl`, `tar` | Rápida | Manual, descargar release nueva | Máquinas air-gapped o donde el script no llega |
| `cargo install` | Rust toolchain | Lenta (compila) | `cargo install --force rtk-cli` | Ya usas Rust; quieres binario nativo optimizado |
| Homebrew | Homebrew | Media | `brew upgrade rtk` | macOS con brew ya en el flujo del equipo |
| Build desde fuentes | Rust toolchain + git | Muy lenta | `git pull && cargo install --path .` | Contribuir a RTK o necesitar cambios sin release |

### Activar el hook con Claude Code

RTK incluye un hook para que Claude Code reescriba automáticamente los
comandos habituales. Añadir a `~/.claude/settings.json` (crear el
archivo si no existe):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "rtk hook claude-code" }
        ]
      }
    ]
  }
}
```

Reiniciar la sesión de Claude Code para que cargue el hook. Para
desactivarlo temporalmente, comentar o eliminar el bloque; para
saltárselo puntualmente en un comando, `rtk proxy <cmd>` ejecuta el
comando sin reescribir.

## Verificación

```bash
rtk --version
```

Salida esperada: una versión semver, p. ej. `rtk 0.7.0`.

```bash
rtk gain
```

Salida esperada: una tabla con estadísticas de ahorro por comando y por
día. Si RTK está recién instalado y no ha procesado nada aún, la tabla
puede aparecer vacía pero el comando responde sin error.

> **Test de colisión de nombres**: si en lugar de la tabla de ahorro
> aparece un error tipo `unknown subcommand: gain`, tienes instalado el
> paquete equivocado (ver siguiente sección).

## Cuándo usarlo

Siempre que trabajes con Claude Code sobre un repositorio real con
historia larga o comandos frecuentes: `git status`, `git log`, `git
diff`, `grep`, `find`, listados de archivos, output de linters, etc. En
esos escenarios RTK evita que la ventana de contexto se llene con
información redundante.

No aporta valor en:

- Prompts puramente conversacionales sin ejecución de comandos.
- Sesiones interactivas cortas con muy poco output de comandos.
- CI donde no hay Claude Code invocando comandos.

## Gotchas y troubleshooting

### Colisión de nombres con `reachingforthejack/rtk` (Rust Type Kit)

Existe otro proyecto llamado `rtk` (Rust Type Kit) que se instala con
`cargo install rtk` sin más. Si aparece en el PATH antes que RTK
(*Rust Token Killer*), los comandos de esta guía no responderán.

Diagnóstico:

```bash
which rtk
```

Debe apuntar al binario correcto (`~/.local/bin/rtk` si instalaste con
el script oficial). Comprobar además con:

```bash
rtk gain
```

- Si devuelve una tabla de ahorro → tienes el RTK correcto.
- Si devuelve `unknown subcommand: gain` o similar → tienes el paquete
  equivocado.

Solución si tienes el intruso:

```bash
cargo uninstall rtk
# o borrar el binario equivocado y reinstalar RTK con el script oficial
```

Alternativamente, ajustar el orden del PATH para que la ruta de la
instalación oficial gane precedencia.

### Otros

- **`rtk gain` no muestra ahorros aunque hayas usado RTK**: el hook no
  está activo. Revisa `~/.claude/settings.json` y reinicia la sesión de
  Claude Code.
- **`rtk` funciona pero Claude Code parece ignorarlo**: comprueba que
  `matcher: "Bash"` está bien escrito en el hook y que `rtk hook
  claude-code` existe (`rtk hook --help`).
- **Actualizar RTK**: `rtk selfupdate` (si lo soporta la versión
  instalada), o re-ejecutar el script oficial.
- **Debug de un comando concreto sin reescritura**: `rtk proxy <cmd>` o
  desactivar temporalmente el hook.

---

!!! info "Versión de referencia"
    Documentado sobre RTK 0.7.x. **Verificado el 2026-09-22.**
