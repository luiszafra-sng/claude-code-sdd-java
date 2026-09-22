# Caveman

## Qué es y qué problema resuelve

[Caveman](https://github.com/juliusbrussee/caveman) es un modo /
skill para Claude Code que aplica al texto de salida un registro
compacto ("caveman"): fragmentos, sin artículos, sin muletillas, con la
sustancia técnica intacta. Reduce el consumo de tokens de salida sin
sacrificar precisión.

Ejemplo del efecto:

- **Normal**: "Sure! The bug is in the auth middleware. The token expiry
  check uses `<` when it should use `<=`. Let me fix it for you..."
- **Caveman full**: "Bug in auth middleware. Token expiry check use `<`
  not `<=`. Fix:"

Caveman complementa a [RTK](rtk.md): RTK comprime *entradas* (comandos y
sus outputs); Caveman comprime *salidas* (texto del modelo).

## Cómo instalar

Caveman ofrece varios métodos de instalación. Elige uno según tu contexto:

### Método 1 — Plugin marketplace (recomendado)

Claude Code incluye un sistema de plugins con marketplace. Dos comandos
y listo:

```bash
claude plugin marketplace add JuliusBrussee/caveman
claude plugin install caveman@caveman
```

El primer comando registra el repositorio de Caveman como marketplace.
El segundo instala el plugin en el scope de usuario. No requiere
reiniciar la sesión.

### Método 2 — Skill de Claude Code (sin plugin system)

Si usas una versión de Claude Code sin sistema de plugins, clonar el
repositorio en la carpeta de skills de usuario:

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/juliusbrussee/caveman.git ~/.claude/skills/caveman
```

Reiniciar la sesión de Claude Code. La skill se registra automáticamente
y queda disponible como `/caveman` o vía trigger textual ("caveman mode").

### Método 3 — Instalación por proyecto

Para activar la skill solo en un proyecto concreto:

```bash
mkdir -p .claude/skills
git clone https://github.com/juliusbrussee/caveman.git .claude/skills/caveman
```

Añade `.claude/skills/caveman/` al `.gitignore` si no quieres versionar
la skill; añádelo al repo si quieres que todo el equipo la tenga.

### Método 4 — Descarga puntual del release

Si prefieres no depender de `git`:

```bash
mkdir -p ~/.claude/skills/caveman
curl -fsSL https://github.com/juliusbrussee/caveman/archive/refs/heads/main.tar.gz \
  | tar -xz --strip-components=1 -C ~/.claude/skills/caveman
```

### Método 5 — Fork con ajustes propios

Fork del repositorio + clonar tu fork en `~/.claude/skills/caveman`.
Útil si quieres personalizar los niveles o el comportamiento por
defecto.

### Tabla comparativa

| Método | Requisitos | Velocidad | Facilidad de actualización | Contexto recomendado |
|--------|------------|-----------|----------------------------|----------------------|
| Plugin marketplace | `claude` CLI | Inmediata | `claude plugin update caveman@caveman` | Uso personal, método moderno |
| Skill de usuario | `git` | Rápida | `git pull` en la carpeta | Versiones sin plugin system |
| Skill de proyecto | `git` | Rápida | `git pull` en `.claude/skills/caveman` | Equipo que quiere Caveman en un repo concreto |
| Descarga tarball | `curl`, `tar` | Rápida | Manual, re-descargar | Máquinas sin `git` disponible |
| Fork propio | `git`, GitHub | Media | `git pull upstream main` | Personalización o control de versión estricta |

## Verificación

Con Claude Code abierto en cualquier carpeta:

```text
/caveman
```

Salida esperada: mensaje breve confirmando activación del modo (por
defecto nivel `full`).

Comprobación desde fuera de Claude Code (plugin instalado vía marketplace):

```bash
claude plugin list | grep caveman
```

Debe mostrar `caveman@caveman`.

Comprobación para instalación vía skill (git clone):

```bash
ls ~/.claude/skills/caveman/SKILL.md 2>/dev/null && echo "skill OK"
```

Debe imprimir `skill OK`.

## Cuándo usarlo

- **Sesiones largas de refactor, revisión o depuración** donde interesa
  minimizar tokens de salida para no cortar antes de tiempo.
- **Tareas repetitivas** con muchos turnos cortos (Caveman ahorra el
  relleno de cortesía en cada respuesta).
- **Explicaciones técnicas** que no vas a copiar tal cual a
  documentación externa: el registro es interno, útil para trabajo, no
  publicable.

No usarlo cuando:

- La salida va a un documento final visible por audiencia externa (el
  registro caveman puede sonar telegráfico).
- Se necesita matiz retórico o pedagógico completo.
- Se trabaja en pair con alguien que prefiere prosa completa.

## Gotchas y troubleshooting

- **Niveles disponibles**:
  - `lite` — quita relleno y muletillas; mantiene frases completas.
  - `full` (default) — fragmentos permitidos, sin artículos, sintaxis
    compacta.
  - `ultra` — máxima compresión; riesgo de perder matices.
- **Activar y desactivar**:
  - Activar: `/caveman` (nivel `full` por defecto) o `/caveman lite` /
    `/caveman ultra` para elegir nivel.
  - Desactivar: `stop caveman` o `normal mode` en cualquier turno.
- **Persistencia**: dentro de una misma sesión, Caveman se mantiene
  activo hasta que se desactiva explícitamente o termina la sesión.
- **Skill no aparece**: si `/caveman` no responde tras la instalación,
  verificar con `claude plugin list | grep caveman` (marketplace) o
  `ls ~/.claude/skills/caveman/SKILL.md` (git clone). Reiniciar
  la sesión de Claude Code si todo está en su lugar.
- **Ultra en revisiones**: evitarlo si esa sesión va a producir
  documentos para clientes o dirección. Preferir `lite` o `full`.
- **Actualizar Caveman**:
  - Plugin marketplace: `claude plugin update caveman@caveman`
  - Git clone: `git -C ~/.claude/skills/caveman pull`

---

!!! info "Versión de referencia"
    Documentado sobre Caveman `main` en `2026-09-16`. **Verificado el 2026-09-22.**
