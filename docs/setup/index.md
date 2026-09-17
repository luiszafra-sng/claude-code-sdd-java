# Setup del entorno

Este módulo deja el entorno de trabajo con Claude Code operativo para el
resto de la formación en menos de 30 minutos. Cubre cinco herramientas
que se instalan en este orden:

1. [Claude Code](claude-code.md) — CLI oficial de Anthropic.
2. [RTK](rtk.md) — proxy que reduce el consumo de tokens.
3. [Caveman](caveman.md) — compresión del registro de salida.
4. [CodeGraph](codegraph.md) — índice de símbolos para consultar código.
5. [SDKMAN](sdkman.md) — gestor de JDK y Maven para los proyectos Java.

Al terminar, la [verificación](verificacion.md) confirma que todo
responde como se espera.

## Requisitos previos

- **Sistema operativo**: macOS 13 o superior, Ubuntu 22.04 o superior,
  o WSL2 sobre Windows 11. Windows nativo no está soportado; consulta la
  [documentación oficial de WSL2](https://learn.microsoft.com/windows/wsl/install)
  antes de continuar.
- **Permisos de administración** local para instalar paquetes y modificar
  la shell rc.
- **Conexión a internet** estable (≥ 5 Mbps sostenidos durante la
  instalación).
- **Tiempo estimado**: 30 minutos siguiendo el orden recomendado.

## Shell

La guía toma **Bash** como shell canónica. Todos los bloques de código
funcionan tal cual en Bash 4+ y en Zsh sin modificaciones, con una única
salvedad: los ficheros de configuración a los que se añaden líneas al
instalar herramientas.

- En **Bash** (Linux por defecto): añadir configuración a `~/.bashrc`.
- En **Zsh** (macOS por defecto desde Catalina): añadir configuración a
  `~/.zshrc`.

Cuando una página del módulo indique "añade la siguiente línea a
`~/.bashrc`", si usas Zsh sustituye por `~/.zshrc`. Ningún comando de la
guía cambia entre las dos shells más allá de este detalle.

Fish y otras shells quedan fuera del alcance de esta iteración.

## Cómo aprovechar el módulo

- **De cero a operativo**: sigue el orden de arriba. Cada página termina
  con un enlace a la siguiente y con la sección de verificación.
- **Consulta puntual**: cada página tiene la misma estructura (Qué es /
  Cómo instalar / Verificación / Cuándo usarlo / Gotchas). Salta directo
  a la sección que necesites.
- **Confirmación final**: al terminar, ejecuta el
  [checklist de verificación](verificacion.md). Si algún check falla,
  cada línea enlaza al punto exacto donde arreglarlo.

Cuando el checklist de verificación quede en verde, continúa con el
módulo [CLAUDE.md](../claude-md/index.md), que enseña a escribir
instrucciones persistentes para Claude Code a nivel usuario y
proyecto.

[Volver a la home](../index.md)
