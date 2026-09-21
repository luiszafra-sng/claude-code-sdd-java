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

Caveman ofrece varios métodos oficiales. Elige uno según tu contexto:

### Método 1 — Skill de Claude Code (recomendado)

Caveman se distribuye como skill de Claude Code. Clonar el repositorio
en la carpeta de skills de usuario:

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/juliusbrussee/caveman.git ~/.claude/skills/caveman
```

Reiniciar la sesión de Claude Code. La skill se registra automáticamente
y queda disponible como `/caveman` o vía trigger textual ("caveman mode").

### Método 2 — Instalación por proyecto

Para activar la skill solo en un proyecto concreto:

```bash
mkdir -p .claude/skills
git clone https://github.com/juliusbrussee/caveman.git .claude/skills/caveman
```

Añade `.claude/skills/caveman/` al `.gitignore` si no quieres versionar
la skill; añádelo al repo si quieres que todo el equipo la tenga.

### Método 3 — Descarga puntual del release

Si prefieres no depender de `git`:

```bash
mkdir -p ~/.claude/skills/caveman
curl -fsSL https://github.com/juliusbrussee/caveman/archive/refs/heads/main.tar.gz \
  | tar -xz --strip-components=1 -C ~/.claude/skills/caveman
```

### Método 4 — Fork con ajustes propios

Fork del repositorio + clonar tu fork en `~/.claude/skills/caveman`.
Útil si quieres personalizar los niveles o el comportamiento por
defecto.

### Tabla comparativa

| Método | Requisitos | Velocidad | Facilidad de actualización | Contexto recomendado |
|--------|------------|-----------|----------------------------|----------------------|
| Skill de usuario | `git` | Rápida | `git pull` en la carpeta | Uso personal en todos los proyectos |
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

Comprobación desde fuera de Claude Code (skill registrada):

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
  revisar que el directorio contiene `SKILL.md` y reiniciar la sesión
  de Claude Code.
- **Ultra en revisiones**: evitarlo si esa sesión va a producir
  documentos para clientes o dirección. Preferir `lite` o `full`.
- **Actualizar Caveman**: `git -C ~/.claude/skills/caveman pull` (o el
  método equivalente al usado en la instalación).

---

!!! info "Versión de referencia"
    Documentado sobre Caveman `main` en `2026-09-16`. **Verificado el 2026-09-16.**
