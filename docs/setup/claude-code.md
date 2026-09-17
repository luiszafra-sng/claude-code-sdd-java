# Claude Code

## Qué es y qué problema resuelve

Claude Code es el CLI oficial de Anthropic para desarrollo asistido.
Corre en la terminal, edita archivos en el repo, ejecuta comandos,
mantiene contexto conversacional entre turnos y expone permission modes
para acotar qué puede hacer en cada sesión.

En la formación es la herramienta central: todos los ejercicios de SDD,
depuración, agentes y skills se hacen sobre Claude Code.

## Cómo instalar

Método oficial recomendado (macOS, Linux, WSL2):

```bash
curl -fsSL https://claude.ai/install.sh | sh
```

El script deja el binario `claude` en `~/.local/bin/` y añade la ruta a
la shell rc. Reinicia la terminal o ejecuta:

```bash
source ~/.bashrc
```

Si usas Zsh, consulta la [nota sobre Bash y Zsh en el índice del
módulo](index.md#shell).

Verificar que aparece en el PATH:

```bash
which claude
```

Debe devolver una ruta absoluta (típicamente `/Users/<usuario>/.local/bin/claude`
o `/home/<usuario>/.local/bin/claude`).

### Autenticación

Claude Code admite dos vías de autenticación. Documentamos las dos
porque cubren perfiles distintos.

#### Opción A — Login OAuth con cuenta Claude (Pro / Max / Team)

Al ejecutar `claude` por primera vez en una carpeta, el CLI abre el
navegador para autenticarte con tu cuenta Claude. La suscripción activa
(Pro, Max o Team) determina el uso disponible.

```bash
claude
```

Sigue el flujo del navegador y vuelve a la terminal. Verificación:

```bash
claude auth status
```

Debe indicar la cuenta autenticada y el plan.

#### Opción B — API key de Anthropic Console

Adecuada para sesiones sin suscripción, uso en scripts / CI, o control
de presupuesto por proyecto (facturación por uso).

1. Crea una API key en <https://console.anthropic.com/settings/keys>.
2. Añade la variable de entorno a tu shell rc:

   ```bash
   echo 'export ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxxxxx"' >> ~/.bashrc
   source ~/.bashrc
   ```

   Si usas Zsh, aplica la equivalencia de rc descrita en la
   [nota del índice del módulo](index.md#shell).

3. Verifica que la variable está cargada sin exponer la clave completa:

   ```bash
   echo "${ANTHROPIC_API_KEY:0:8}"
   ```

   Salida esperada: `sk-ant-a` (los primeros 8 caracteres).

#### Cuándo elegir cada método

- **OAuth** si ya tienes suscripción Claude Pro, Max o Team activa y
  quieres facturación consolidada.
- **API key** si no tienes suscripción, si integras Claude Code en
  scripts / pipelines, o si necesitas presupuesto por proyecto.

Los dos métodos pueden coexistir: si `ANTHROPIC_API_KEY` está definida,
Claude Code la usa; si no, cae al login OAuth.

## Verificación

```bash
claude --version
```

Salida esperada: una versión semver, p. ej. `claude 1.6.3`.

```bash
claude auth status
```

Salida esperada (OAuth): cuenta y plan. Salida esperada (API key):
`Authenticated with ANTHROPIC_API_KEY` o equivalente vigente.

Prueba mínima de conversación:

```bash
cd $(mktemp -d)
claude --print "responde solo con OK"
```

Debe imprimir `OK` y volver al prompt.

## Cuándo usarlo

En cualquier sesión de trabajo asistido: pair programming, depuración,
refactor, revisión, generación de tests, etc. Se combina con:

- [RTK](rtk.md) para reducir tokens en operaciones de dev ops.
- [Caveman](caveman.md) para comprimir la salida del modelo.
- [CodeGraph](codegraph.md) para acelerar la exploración de código.

No se usa para operaciones sin componente conversacional (por ejemplo,
un `grep` puntual) — para eso ya está el shell.

## Gotchas y troubleshooting

- **`claude: command not found`** tras instalar: el instalador añadió
  `~/.local/bin` al PATH del rc, pero la sesión actual no lo ha
  recargado. Ejecuta `source ~/.bashrc` (o el rc equivalente según la
  [nota del índice](index.md#shell)) o abre una terminal nueva.
- **Colisión con instalaciones previas** (p. ej. binario en
  `/usr/local/bin/claude` de una prueba antigua): `which -a claude` lista
  todos; borra los sobrantes o cambia el orden del PATH.
- **Permisos de red en máquina corporativa**: si el instalador falla en
  el `curl`, revisa proxy corporativo. Documentar proxies queda fuera del
  alcance de esta guía; consulta con IT.
- **Sesión OAuth caducada**: `claude auth logout` seguido de `claude`
  vuelve a abrir el navegador.
- **API key filtrada**: si `ANTHROPIC_API_KEY` termina en un log o
  historial, revócala inmediatamente en la consola de Anthropic y crea
  otra. Añade `.env*` al `.gitignore` (spec 001 ya lo cubre).

### Permission modes básicos

Al ejecutar `claude` dentro de un proyecto, el CLI expone cuatro modos
que acotan qué operaciones ejecuta sin preguntar:

- `default` — pregunta antes de cada acción con efecto lateral.
- `plan` — sólo planifica, no toca archivos ni ejecuta comandos.
- `accept edits` — aplica ediciones a archivos sin preguntar; los
  comandos siguen requiriendo confirmación.
- `bypass permissions` — no pregunta nada. Sólo con proyectos de
  confianza plena y prompts revisados.

El detalle práctico de cuándo usar cada modo se cubre en el módulo
[SDD con Speckit](../sdd/index.md).

### Ubicaciones estándar

- `~/.claude/` — configuración de usuario: agentes globales, skills
  globales, CLAUDE.md de usuario, historial.
- `.claude/` en la raíz de un proyecto — configuración de proyecto:
  agentes y skills específicos, `settings.json` del repo.

---

!!! info "Versión de referencia"
    Documentado sobre Claude Code 1.6.x. **Verificado el 2026-09-16.**

[← Índice del módulo](index.md) · [Siguiente: RTK →](rtk.md) · [Ir al checklist](verificacion.md)
