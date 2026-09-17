# SDKMAN

## Qué es y qué problema resuelve

SDKMAN es un gestor de SDKs para la JVM: instala y cambia versiones de
JDK, Maven, Gradle, Kotlin, Scala y otras herramientas sin tocar el
gestor de paquetes del sistema.

La formación lo usa por tres motivos:

- Cada proyecto Java del repositorio declara sus versiones en un fichero
  `.sdkmanrc` reproducible.
- Cambiar entre proyectos moderno (Spring Boot 4 + Java 21) y legacy
  (JDK antiguos) es un único comando (`sdk env`).
- El pipeline y las máquinas de los participantes usan las mismas
  versiones, sin depender del `apt`/`brew` de cada uno.

La distribución de JDK fijada por la formación es **BellSoft Liberica**
(identificador SDKMAN `-librca`). Otras distribuciones (Temurin, Corretto,
Zulu, GraalVM) funcionan con SDKMAN pero quedan fuera del camino
soportado.

## Cómo instalar

Requisito previo: `curl`, `unzip` y `zip` disponibles (`apt install -y
curl unzip zip` en Ubuntu; en macOS vienen de serie).

```bash
curl -s "https://get.sdkman.io" | bash
```

Al terminar, cargar SDKMAN en la sesión actual:

```bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

Para que se cargue automáticamente en nuevas sesiones, el instalador
añade el `source` a `~/.bashrc` (ver [nota sobre Bash y Zsh en el índice
del módulo](index.md#shell) si usas Zsh). Reinicia la terminal si
prefieres partir de una sesión limpia.

Instalar el JDK Liberica 21 y Maven:

```bash
sdk install java 21.0.4-librca
sdk install maven
```

Activar las versiones instaladas como default globales:

```bash
sdk default java 21.0.4-librca
```

### Fichar versiones por proyecto con `.sdkmanrc`

En la raíz de un proyecto Java:

```bash
cd path/al/proyecto
sdk env init
```

Editar el `.sdkmanrc` resultante para dejarlo así:

```text
java=21.0.4-librca
maven=3.9.9
```

Activar el entorno del proyecto (instala versiones si faltan):

```bash
sdk env install
sdk env
```

`sdk env` puede activarse automáticamente al `cd` al proyecto si en
`~/.sdkman/etc/config` está `sdkman_auto_env=true`.

## Verificación

```bash
sdk version
```

Salida esperada: `SDKMAN 5.19.0` o superior.

```bash
java -version
```

Salida esperada (ejemplo):

```text
openjdk version "21.0.4" 2024-07-16 LTS
OpenJDK Runtime Environment (build 21.0.4+7-LTS)
OpenJDK 64-Bit Server VM (build 21.0.4+7-LTS, mixed mode, sharing)
```

La palabra clave "Liberica" aparece en `java -version -verbose` o en
`java -XshowSettings:properties -version 2>&1 | grep java.vendor` (debe
devolver `BellSoft`).

```bash
mvn -v
```

Salida esperada (ejemplo):

```text
Apache Maven 3.9.9
Maven home: /Users/<usuario>/.sdkman/candidates/maven/current
Java version: 21.0.4, vendor: BellSoft
```

## Cuándo usarlo

- Al arrancar cualquier proyecto Java de la formación: los proyectos
  legacy y modernos tienen distintas versiones de JDK y Maven.
- Al cambiar de rama o repositorio y encontrar un `.sdkmanrc` nuevo:
  `sdk env install` deja el shell alineado con lo declarado.
- Al reproducir localmente lo que ejecuta CI.

No se usa para:

- Gestionar el intérprete Python (`uv` cubre eso).
- Instalar Node, Rust u otras cadenas no-JVM (aunque SDKMAN admite
  algunas, la formación no las gestiona por SDKMAN).

## Gotchas y troubleshooting

- **SDKMAN no cargado en la sesión** tras instalar: `sdk: command not
  found`. Ejecuta `source "$HOME/.sdkman/bin/sdkman-init.sh"` o abre una
  terminal nueva.
- **`SDKMAN_DIR` incorrecto**: comprueba `echo $SDKMAN_DIR`; debe
  apuntar a `$HOME/.sdkman`. Si se corrompe, `unset SDKMAN_DIR` y
  reiniciar la shell.
- **Cambio de shell**: el `source` está sólo en un rc, no en ambos. Si
  cambias de shell, añádelo al rc de destino según la
  [nota sobre Bash y Zsh en el índice del módulo](index.md#shell).
- **`.sdkmanrc` no se auto-activa**: por defecto `sdkman_auto_env` está
  a `false`. Actívalo editando `~/.sdkman/etc/config`.
- **Permisos denegados en macOS al escribir en `/private/tmp`** durante
  la instalación: no es habitual; suele deberse a políticas MDM. Pide a
  IT permiso o instala como usuario normal (SDKMAN nunca requiere `sudo`).
- **Actualizar SDKMAN**: `sdk selfupdate`. Actualizar Java a un patch
  nuevo: `sdk install java 21.0.<nuevo>-librca && sdk default java
  21.0.<nuevo>-librca`.

---

!!! info "Versión de referencia"
    Documentado sobre SDKMAN 5.19.0, BellSoft Liberica 21.0.4-librca,
    Maven 3.9.9. **Verificado el 2026-09-16.**

[← CodeGraph](codegraph.md) · [Siguiente: Verificación →](verificacion.md) · [Volver al índice del módulo](index.md)
