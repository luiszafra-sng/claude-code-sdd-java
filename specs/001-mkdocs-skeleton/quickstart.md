# Phase 1 Quickstart: Esqueleto del sitio MkDocs

**Feature**: 001-mkdocs-skeleton
**Date**: 2026-09-16

Guía runnable para validar la feature end-to-end en local. Sirve tanto como
"onboarding para contribuidor" (equivalente reducido del `README.md`) como
puerta de aceptación previa a mergear.

Los detalles de decisiones técnicas están en `research.md` y `data-model.md`; aquí sólo
se recogen comandos y outputs esperados.

---

## Prerrequisitos

- macOS, Linux o WSL2.
- `uv` instalado (`https://docs.astral.sh/uv/`). Verificar con:

  ```bash
  uv --version
  ```

  Output esperado: una línea del tipo `uv 0.4.x` o superior.

- (Opcional para verificación de accesibilidad) navegador Chromium reciente con
  Lighthouse, o la extensión axe DevTools.

## Setup inicial

Desde la raíz del repositorio:

```bash
uv sync
```

Esto:
- Resuelve el intérprete Python declarado en `.python-version` y `requires-python`.
- Crea `.venv/` si no existe.
- Instala exactamente las versiones fijadas en `uv.lock`.

Verificación:

```bash
uv run python -c "import mkdocs, material" 2>&1 | head -n 1
```

No debe haber `ImportError`. Alternativa equivalente: `uv run mkdocs --version`.

## Escenario 1 — Levantar el sitio en local (SC-001, US1)

```bash
uv run mkdocs serve
```

Output esperado:
- Se abre servidor en `http://127.0.0.1:8000`.
- Sin líneas `WARNING` ni `ERROR` en la salida.
- Al navegar en el navegador: la home carga con presentación, la barra superior
  muestra siete pestañas en el orden fijado por FR-002, cada una accesible con al
  menos su página placeholder.

Criterio de aceptación: el sitio queda accesible en < 3 minutos desde `git clone` en
una máquina con `uv` ya instalado.

## Escenario 2 — Build estricta (SC-002, US2)

En otra terminal, o tras `Ctrl+C` de `serve`:

```bash
uv run mkdocs build --strict
```

Aceptación:
- Exit code `0`.
- Salida SIN líneas que empiecen por `WARNING`.
- Se genera `site/` con `index.html` y los HTML de cada módulo.

Verificación adicional (sanity):

```bash
test -f site/index.html && echo OK
grep -R "Contenido en construcción" site/ | wc -l
```

La segunda debe devolver un número ≥ 7 (una por placeholder).

## Escenario 3 — Alternancia de tema y `prefers-color-scheme`

Con `mkdocs serve` corriendo:
1. Abrir el navegador en modo claro del sistema. La home debe mostrarse con paleta
   clara.
2. Cambiar el sistema (o el DevTools → Rendering → `Emulate CSS media feature
   prefers-color-scheme`) a `dark`. Recargar. La home debe cargar con paleta oscura.
3. Usar el toggle superior derecho (icono brillo). Debe alternar entre modos y
   persistir dentro de la sesión.

Aceptación: los tres pasos se cumplen sin recargar `mkdocs.yml` y sin errores en
consola del navegador.

## Escenario 4 — Accesibilidad WCAG 2.1 AA (SC-007)

Con `site/` ya construido (`uv run mkdocs build --strict`), servirlo estático o usar
`mkdocs serve`. Ejecutar Lighthouse en `http://127.0.0.1:8000/` y en al menos una
placeholder, para modo claro y modo oscuro.

Aceptación:
- Score de "Accessibility" ≥ 95 en cada combinación.
- 0 issues de contraste reportados.
- axe DevTools no reporta violaciones críticas (Critical / Serious).

Si algún check falla, ajustar `docs/stylesheets/extra.css` (sólo ahí) y re-validar.

## Escenario 5 — Añadir una página nueva (SC-005, US3)

1. Crear `docs/setup/nueva-pagina.md` con contenido mínimo:

   ```markdown
   # Nueva página

   Contenido de prueba.
   ```

2. Registrar en `mkdocs.yml` → `nav` → sección "Setup del entorno".
3. `uv run mkdocs serve` debe recargar automáticamente y mostrar la nueva página en la
   navegación en < 5 minutos siguiendo únicamente el README.

## Escenario 6 — Añadir una dependencia sólo con uv (SC-006)

```bash
uv add mkdocs-glightbox
```

Aceptación:
- `pyproject.toml` recibe la nueva dependencia con versión exacta.
- `uv.lock` se actualiza.
- `uv run mkdocs serve` sigue funcionando (aunque el plugin no esté aún activado en
  `mkdocs.yml`).
- No aparecen archivos `requirements.txt` o similares.

## Definition of Done local

Antes de commitear:

- [ ] `uv sync` sin errores.
- [ ] `uv run mkdocs build --strict` termina con exit 0 y sin `WARNING`.
- [ ] Los siete módulos aparecen en la navegación en el orden correcto.
- [ ] Home muestra presentación + audiencia dual + mapa de módulos con enlaces.
- [ ] Toggle claro/oscuro funciona; default responde a `prefers-color-scheme`.
- [ ] Lighthouse Accessibility ≥ 95 en home y una placeholder, en ambos temas.
- [ ] Fuentes Inter (texto) e IBM Plex Mono (código) cargan correctamente.
- [ ] `docs/assets/logo.svg` y `docs/assets/favicon.svg` presentes y referenciados.
- [ ] `uv.lock` y `.python-version` commiteados; sin `requirements.txt` ni
  `.venv/` trackeados.
