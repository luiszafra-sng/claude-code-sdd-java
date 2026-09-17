# CodeGraph

## Qué es y qué problema resuelve

[CodeGraph](https://github.com/colbymchenry/codegraph) construye un
índice SQLite del código de un repositorio: símbolos, llamadas,
relaciones entre archivos, con soporte para más de 30 lenguajes. Un
único `codegraph_explore` responde una pregunta ("¿dónde se llama a
`createUser`?", "¿qué componentes tocan la tabla `users`?") devolviendo
el código verbatim de los símbolos implicados, más las rutas de llamada
y el radio de impacto.

Sustituye el bucle `grep` + `read` + `grep` cuando trabajas con Claude
Code sobre repositorios medianos o grandes: una llamada con contexto
completo en lugar de varias iteraciones sueltas.

## Cómo instalar

CodeGraph ofrece varios métodos oficiales. Elige uno según tu contexto:

### Método 1 — `pipx install` (recomendado)

Requiere [`pipx`](https://pipx.pypa.io/) (`brew install pipx` en macOS o
`apt install pipx` en Ubuntu 23.04+).

```bash
pipx install codegraph
```

### Método 2 — `pip --user`

Alternativa si no tienes `pipx`:

```bash
pip install --user codegraph
```

Requiere que `~/.local/bin` esté en el PATH.

### Método 3 — Binario prebuilt desde Releases

Descargar el binario correspondiente al SO desde
<https://github.com/colbymchenry/codegraph/releases>:

```bash
mkdir -p ~/.local/bin
curl -fsSL -o codegraph.tar.gz \
  "https://github.com/colbymchenry/codegraph/releases/latest/download/codegraph-$(uname -s)-$(uname -m).tar.gz"
tar -xzf codegraph.tar.gz -C ~/.local/bin/
chmod +x ~/.local/bin/codegraph
rm codegraph.tar.gz
```

### Método 4 — Build desde fuentes

```bash
git clone https://github.com/colbymchenry/codegraph.git
cd codegraph
pip install --user .
```

### Tabla comparativa

| Método | Requisitos | Velocidad | Facilidad de actualización | Contexto recomendado |
|--------|------------|-----------|----------------------------|----------------------|
| `pipx install` | `pipx` | Rápida | `pipx upgrade codegraph` | Máquina personal; aísla dependencias |
| `pip --user` | Python 3.10+ | Rápida | `pip install --user -U codegraph` | Máquinas sin `pipx` disponible |
| Binario prebuilt | `curl`, `tar` | Muy rápida | Manual, descargar release nueva | Air-gapped o Python no disponible |
| Build desde fuentes | Python + git | Media | `git pull && pip install --user .` | Contribuir o versión sin publicar |

### Configurar el servidor MCP en Claude Code

CodeGraph expone la herramienta MCP `codegraph_explore`. Registrar el
servidor MCP en Claude Code (una sola vez):

```bash
claude mcp add codegraph -- codegraph mcp
```

Reiniciar la sesión de Claude Code. La herramienta queda disponible
automáticamente cuando el proyecto activo tiene `.codegraph/`.

## Verificación

```bash
codegraph --version
```

Salida esperada: una versión semver.

Crear un índice de prueba sobre un proyecto pequeño:

```bash
cd $(mktemp -d)
git init -q .
echo "def hello(): return 'hi'" > hello.py
codegraph init
ls -la .codegraph/
```

Salida esperada: directorio `.codegraph/` con al menos un archivo
`.sqlite`.

Consulta ejemplo desde el shell:

```bash
codegraph explore "hello function"
```

Debe devolver el código de la función y su ubicación.

## Cuándo usarlo

- En repositorios con símbolos identificables (código, no configuración
  pura) donde interesa navegar rápido por relaciones y llamadas.
- Antes de refactors que atraviesan varios archivos: `codegraph explore`
  da el mapa de impacto en un solo turno.
- Cuando la audiencia (o Claude Code) necesita **el código verbatim con
  numeración de líneas** de varios símbolos a la vez.

No aporta valor en:

- Repos pequeños (2-3 archivos) donde `grep` es más rápido.
- Repos puramente configurativos (YAML/JSON) sin símbolos que indexar.
- Consultas que van a la web pública (documentación externa, no código
  local).

## Gotchas y troubleshooting

- **`.codegraph/` no existe**: sin `.codegraph/` en la raíz del
  proyecto, la herramienta MCP responde que no hay índice. Solución:
  `codegraph init` en la raíz. Para monorepos, pasar `projectPath`
  apuntando al subproyecto.
- **Índice desactualizado tras cambios grandes**: `codegraph reindex`.
  Cambios pequeños se detectan automáticamente en algunas versiones;
  ante duda, re-indexar.
- **Permisos SQLite en Linux**: si el índice queda en un directorio
  con propietario `root` (p. ej. montaje NFS), CodeGraph puede fallar
  al escribir. Ejecutar como el usuario que posee el árbol.
- **MCP no habilitado en Claude Code**: ejecutar `claude mcp list` y
  verificar que `codegraph` aparece. Si no, revisar el `claude mcp
  add` y reiniciar la sesión.
- **Tamaño del índice**: en repos grandes puede alcanzar cientos de MB.
  `.codegraph/` va en `.gitignore` por defecto.
- **Actualizar CodeGraph**: `pipx upgrade codegraph` (o `pip install
  --user -U codegraph` / re-descargar release).

### Ejemplo aplicado a la app CRUD Spring Boot 4

En el módulo [App de ejemplo (Spring Boot 4)](../app-ejemplo/index.md)
se publicará un CRUD de usuarios con un bug reproducible en la creación.
Con CodeGraph indexado sobre ese proyecto, una consulta natural es:

```bash
codegraph explore "flujo de creación de usuario"
```

La salida esperada incluirá `UserController#create`,
`UserService#create`, `UserRepository#save` y el DTO involucrado, todo
con código verbatim y líneas, listo para pegar a Claude Code y localizar
el NPE en una sola iteración.

> El comando exacto y el output se completarán cuando la spec 4
> (`docs/app-ejemplo/`) publique la aplicación real. Hasta entonces,
> este ejemplo sirve como plantilla.

---

!!! info "Versión de referencia"
    Documentado sobre CodeGraph `main` en `2026-09-16`. **Verificado el 2026-09-16.**

[← Caveman](caveman.md) · [Siguiente: SDKMAN →](sdkman.md) · [Volver al índice del módulo](index.md)
