<!--
  Documentación interna del repositorio. No forma parte del sitio publicado.
  Excluida de `nav` en `mkdocs.yml` mediante `validation.nav.not_in_nav`.
-->

# Publicación del sitio en GitLab Pages

Guía operativa del pipeline que publica este sitio MkDocs en GitLab Pages.
Dirigida a mantenedores y contribuidores del repositorio, no a la audiencia
de la formación.

## Cómo funciona el pipeline

El fichero `.gitlab-ci.yml` de la raíz define dos jobs, ambos con la imagen
`ghcr.io/astral-sh/uv:python3.12-bookworm-slim` y ambos ejecutando
`uv sync --frozen` antes de compilar.

- Job `build-mr` (stage `build`). Se dispara únicamente en pipelines de
  merge request y sólo cuando el MR toca alguno de estos paths:
  `docs/**/*`, `mkdocs.yml`, `pyproject.toml`, `uv.lock`. Ejecuta
  `uv run mkdocs build --strict`. No publica artefactos. Falla si
  `uv.lock` está desincronizado con `pyproject.toml` o si MkDocs emite
  cualquier warning.
- Job `pages` (stage `deploy`). Se dispara únicamente en la rama `main`.
  Ejecuta `uv run mkdocs build --strict --site-dir public` y publica el
  directorio `public/` como artefacto de GitLab Pages. GitLab expone el
  sitio en `$CI_PAGES_URL`.

Ambos jobs son `interruptible: true`. Con la opción "Auto-cancel redundant
pipelines" activada a nivel de proyecto, un commit nuevo a `main` cancela
el pipeline anterior aún en curso: sólo se publica el resultado del último
commit.

La caché de uv se guarda en `.uv-cache/` y `$HOME/.cache/uv/` y se invalida
por hash de `uv.lock` (`key.files: [uv.lock]`).

## Forzar rebuild

Sin cambios en el repositorio, desde la UI de GitLab:

1. `Build → Pipelines` en el proyecto.
2. Seleccionar el pipeline del commit deseado en `main`.
3. Pulsar `Retry` sobre el pipeline entero o `Retry` individual sobre el job
   `pages`.

Alternativa (crear un pipeline nuevo sobre el commit HEAD de `main`):

1. `Build → Pipelines → Run pipeline`.
2. Rama: `main`. Confirmar.

## Revisar el sitio publicado

- URL canónica: valor de `$CI_PAGES_URL` del proyecto.
- Visualmente: `Deploy → Pages` muestra la URL activa y el historial de
  despliegues.
- El sitio está configurado con visibilidad **Internal**: sólo usuarios
  autenticados en la instancia GitLab pueden acceder. Sesiones anónimas
  reciben una redirección a login.

## Cambiar la rama de publicación

El nombre de la rama de publicación vive en un único punto del
`.gitlab-ci.yml`:

```yaml
variables:
  DEFAULT_BRANCH: "main"
```

Para publicar desde otra rama (por ejemplo `release`):

1. Editar `DEFAULT_BRANCH` en `.gitlab-ci.yml`.
2. Commit + push a `main`.
3. A partir de ese momento, los commits en la rama nueva disparan el job
   `pages`.

No hay que tocar la lógica del job. `pages.rules[0].if` ya usa
`$DEFAULT_BRANCH`.

## Actualizar dependencias localmente

Para regenerar `uv.lock` con las versiones más recientes compatibles:

```bash
uv lock --upgrade
git add uv.lock
git commit -m "chore(deps): actualizar uv.lock"
git push
```

Para actualizar una única dependencia:

```bash
uv lock --upgrade-package <paquete>
```

Tras el push, el pipeline reconstruye la caché de uv (la clave
`files: [uv.lock]` cambia con el hash del lock) y sigue publicando
normalmente.

## Notificaciones de fallo

Si el pipeline de `main` falla, GitLab notifica por email a Maintainers y
committers con la configuración de notificaciones por defecto. No hay
integraciones externas (Slack, MS Teams).

Cada colaborador puede ajustar el nivel de notificación en
`User Settings → Notifications`. A nivel de proyecto, `Project → Settings →
Members` controla quién recibe qué.

## Configuración one-off del proyecto en GitLab

Estos ajustes se hacen una vez en la UI, fuera del pipeline. Documentados
aquí para reproducibilidad tras clonado o migración.

1. `Project → Settings → Pages → Access control` → **Internal**.
2. `Project → Settings → CI/CD → General pipelines` → activar
   **Auto-cancel redundant pipelines**.
3. Comprobar que el badge de pipeline en `README.md` apunta al proyecto
   correcto (`<GITLAB_HOST>/<NAMESPACE>/<PROJECT>`) y que el badge de
   sitio enlaza a `$CI_PAGES_URL`.

## Versión de referencia + fecha de verificación

| Herramienta | Versión de referencia | Verificado |
|-------------|-----------------------|------------|
| Imagen CI | `ghcr.io/astral-sh/uv:python3.12-bookworm-slim` | 2026-09-16 |
| Python | 3.12 | 2026-09-16 |

Re-verificar como mínimo cada 6 meses (constitution 1.1.0). Si Astral
publica una versión mayor de la imagen o si Python 3.12 se marca EOL,
re-verificar de forma inmediata y actualizar tanto el tag en
`.gitlab-ci.yml` como este bloque.
