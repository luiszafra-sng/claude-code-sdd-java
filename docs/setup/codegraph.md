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

### Paso 1 — Instalar el CLI

**macOS / Linux (recomendado):**

```bash
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh
```

**Cualquier plataforma (npm):**

```bash
npm i -g @colbymchenry/codegraph
```

**Windows (PowerShell):**

```powershell
irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex
```

!!! warning "Abre una terminal nueva antes de continuar"
    El instalador añade `codegraph` al PATH pero no recarga el shell
    actual. Los pasos siguientes fallarán si los ejecutas en la misma
    terminal.

### Paso 2 — Configurar los agentes

En una terminal nueva:

```bash
codegraph install
```

Auto-detecta los agentes instalados (Claude Code, Cursor, Copilot…) y
registra el servidor MCP en cada uno. Para Claude Code en concreto,
acepta las opciones `--yes` y `--target`:

```bash
codegraph install --yes                          # auto-detecta y configura todo
codegraph install --target=claude --yes          # solo Claude Code
codegraph install --yes --init                   # configura y además indexa el proyecto actual
```

### Paso 3 — Inicializar cada proyecto

En la raíz del repositorio que quieras indexar:

```bash
codegraph init
```

Crea el directorio `.codegraph/` y construye el índice completo. El
auto-sync está activo por defecto: CodeGraph detecta cambios en los
archivos y actualiza el índice sin intervención manual.

### Configuración MCP manual (alternativa)

Si prefieres no usar `codegraph install`, añade manualmente a
`~/.claude.json`:

```json
{
  "mcpServers": {
    "codegraph": {
      "type": "stdio",
      "command": "codegraph",
      "args": ["serve", "--mcp"],
      "alwaysLoad": true
    }
  }
}
```

## Verificación

```bash
codegraph status
```

Muestra estadísticas del índice activo y confirma que el servidor MCP
está operativo.

Consulta ejemplo desde el shell:

```bash
cd tu-proyecto
codegraph explore "hello function"
```

Debe devolver el código de la función y su ubicación con número de
línea.

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
- **Índice desactualizado**: el auto-sync cubre cambios incrementales.
  Si el índice queda muy desfasado tras una rama grande, ejecutar
  `codegraph init` de nuevo en la raíz del proyecto.
- **Permisos SQLite en Linux**: si el índice queda en un directorio
  con propietario `root` (p. ej. montaje NFS), CodeGraph puede fallar
  al escribir. Ejecutar como el usuario que posee el árbol.
- **MCP no habilitado en Claude Code**: verificar con `claude mcp list`
  que `codegraph` aparece. Si no, ejecutar `codegraph install
  --target=claude --yes` y reiniciar la sesión.
- **Tamaño del índice**: en repos grandes puede alcanzar cientos de MB.
  `.codegraph/` va en `.gitignore` por defecto.
- **Actualizar CodeGraph**: volver a ejecutar el script de instalación
  o `npm update -g @colbymchenry/codegraph` según el método usado.

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
    Documentado sobre CodeGraph `main` en `2026-09-16`. **Verificado el 2026-09-22.**
