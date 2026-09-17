# Feature Specification: Esqueleto del sitio MkDocs de la formación

**Feature Branch**: `001-mkdocs-skeleton`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Monta la estructura base del sitio MkDocs de la formación con el tema mkdocs-material, levantable en local con `mkdocs serve` en http://127.0.0.1:8000. Alcance: sólo el esqueleto y la identidad visual; no incluyas todavía CI/CD ni contenido de módulos. Gestión Python: uv obligatorio."

## Clarifications

### Session 2026-09-16

- Q: ¿Qué familias tipográficas debemos usar para clonar la estética de referencia (títulos y cuerpo)? → A: Inter para títulos y cuerpo (Google Fonts) + IBM Plex Mono para código (Google Fonts).
- Q: ¿Qué contenido mínimo debe llevar la página placeholder de cada sección? → A: H1 con nombre del módulo + párrafo "próximamente cubriremos X" alineado a la spec futura + admonition `!!! note` "Contenido en construcción".
- Q: ¿Qué nivel de accesibilidad web debe cumplir el sitio desde el primer commit? → A: WCAG 2.1 AA como objetivo declarado (contraste ≥4.5:1 texto normal / ≥3:1 texto grande, foco visible, navegación por teclado completa, `alt` en imágenes, jerarquía de headings correcta) en tema claro y oscuro.
- Q: ¿Qué tema debe activarse por defecto la primera vez que un visitante abre el sitio? → A: Auto, siguiendo `prefers-color-scheme` del sistema; el toggle claro/oscuro sobrescribe la elección para esa sesión/dispositivo.
- Q: ¿Qué versión mínima de Python debe declararse en `pyproject.toml` como `requires-python`? → A: `>=3.12` (fijado como suelo del proyecto).
- Ajuste post-implementación (2026-09-16, tras revisión de tono): el registro de FR-003 y del contenido del sitio se alinea con la constitution 1.0.1 (Principio I refinado): tono **profesional y directo**, ni académico ni excesivamente coloquial. Se sustituyen expresiones como "a saco" o "picar código" por formulaciones neutras. No se toca ningún otro FR/SC.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Levantar el sitio en local desde cero (Priority: P1)

Un participante recién llegado a la formación clona el repositorio, instala `uv` siguiendo el
enlace del README, ejecuta `uv sync` y a continuación `uv run mkdocs serve`. En menos de un
par de minutos ve el sitio en `http://127.0.0.1:8000`, con la home traducida al español, la
navegación superior con las secciones vacías de la formación y la identidad visual de
referencia aplicada tanto en modo claro como oscuro.

**Why this priority**: sin esto la formación no arranca; es el requisito mínimo para poder
empezar a producir contenido y compartir el sitio en local. Todo lo demás depende de que
este punto funcione.

**Independent Test**: en una máquina limpia (macOS o Linux), tras clonar el repo y con `uv`
instalado, `uv sync` seguido de `uv run mkdocs serve` debe abrir el sitio con navegación
completa, identidad visual aplicada y ningún warning en consola.

**Acceptance Scenarios**:

1. **Given** máquina limpia con `uv` instalado, **When** el participante ejecuta `uv sync` y
   luego `uv run mkdocs serve`, **Then** el sitio queda disponible en
   `http://127.0.0.1:8000` sin errores y sin warnings de MkDocs.
2. **Given** el sitio corriendo, **When** el participante navega por la barra superior,
   **Then** encuentra las secciones "Introducción", "Setup del entorno", "CLAUDE.md",
   "App de ejemplo (Spring Boot 4)", "SDD con Speckit", "Agentes" y "Skills" en ese orden,
   cada una con al menos una página placeholder accesible.
3. **Given** el sitio corriendo, **When** el participante alterna el toggle de tema
   claro/oscuro, **Then** la paleta y la tipografía se mantienen coherentes con la
   referencia visual en ambos modos.

---

### User Story 2 - Validar el sitio antes de publicar (Priority: P1)

Cualquier persona que contribuya al repositorio ejecuta `uv run mkdocs build --strict` antes
de abrir un merge request y obtiene una build limpia, sin warnings, con la carpeta `site/`
generada. Este comando es la puerta de entrada para el pipeline futuro y garantiza que el
sitio se puede publicar en cualquier momento.

**Why this priority**: la constitution exige que `mkdocs build --strict` pase sin warnings
desde el primer commit (Principio VI). Sin este check la calidad del sitio se degrada
silenciosamente y bloquea la publicación futura.

**Independent Test**: en cualquier entorno con `uv sync` completado, `uv run mkdocs build
--strict` termina con código 0 y sin líneas `WARNING` en la salida.

**Acceptance Scenarios**:

1. **Given** dependencias sincronizadas con `uv sync`, **When** se ejecuta `uv run mkdocs
   build --strict`, **Then** la build termina con éxito, no hay warnings, y `site/`
   contiene el sitio estático generado.
2. **Given** una página nueva se añade sin registrarla en la navegación, **When** se
   ejecuta la build en modo estricto, **Then** el comando falla con un mensaje que
   identifica el archivo huérfano (comportamiento nativo de `--strict`).

---

### User Story 3 - Añadir una página o dependencia nueva (Priority: P2)

Un contribuidor con conocimientos básicos de Markdown quiere añadir una página a la sección
"Setup del entorno" y, más adelante, una dependencia de MkDocs (por ejemplo un plugin de
diagramas). El README le indica exactamente los comandos a usar: crear el archivo Markdown,
declararlo en la navegación de `mkdocs.yml`, y para dependencias `uv add <paquete>`. En
ningún caso necesita conocer `pip`, `venv` u otros gestores.

**Why this priority**: la formación se irá construyendo módulo a módulo; el flujo de "cómo
añado contenido" debe estar documentado desde el minuto uno o cada colaborador improvisará.

**Independent Test**: siguiendo únicamente las instrucciones del README (sin conocimiento
previo del proyecto), un contribuidor puede añadir una página nueva y una dependencia nueva
sin salirse de `uv` como gestor.

**Acceptance Scenarios**:

1. **Given** el README como única referencia, **When** el contribuidor añade
   `docs/setup/nueva-pagina.md` y la registra en `mkdocs.yml`, **Then** aparece en la
   navegación al recargar `uv run mkdocs serve` sin más pasos.
2. **Given** el README como única referencia, **When** el contribuidor ejecuta `uv add
   mkdocs-glightbox` (u otro plugin), **Then** el paquete queda declarado en
   `pyproject.toml`, `uv.lock` se actualiza y `uv run mkdocs serve` sigue funcionando.

---

### Edge Cases

- Máquina sin `uv` instalado: el README dirige a `https://docs.astral.sh/uv/` como único
  método soportado; no debe haber instrucciones alternativas con `pip`/`venv` que puedan
  desviar al usuario.
- Versión de Python inferior a la declarada: `uv sync` debe fallar con un mensaje claro
  guiado por `.python-version` o el `requires-python` de `pyproject.toml`.
- `uv.lock` desincronizado respecto a `pyproject.toml`: el flujo local usa `uv sync`
  (auto-actualiza); el flujo de validación futuro exigirá `--frozen` (fuera de alcance de
  esta spec, pero el lock debe estar siempre commiteado y coherente).
- Ejecución del sitio en Windows nativo: no es un objetivo declarado; se asume macOS,
  Linux o WSL2.
- Página Markdown sin registrar en `nav`: `mkdocs build --strict` debe fallar (no
  silenciarlo con configuración permisiva).
- Fuentes elegidas no disponibles en Google Fonts: Inter e IBM Plex Mono (fijadas en
  Clarifications Q1) están servidas por Google Fonts, por lo que este caso no se
  espera en esta feature. Sólo aplica si en el futuro se sustituye alguna familia por
  otra sin disponibilidad en Google Fonts: entonces se cae a self-hosting en
  `docs/assets/fonts/` con licencia SIL Open Font incluida.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El repositorio DEBE incluir un sitio MkDocs con tema `mkdocs-material`
  levantable en local con `uv run mkdocs serve` en `http://127.0.0.1:8000`.
- **FR-002**: La navegación superior DEBE incluir, en este orden y con al menos una página
  placeholder cada una: "Introducción", "Setup del entorno", "CLAUDE.md", "App de ejemplo
  (Spring Boot 4)", "SDD con Speckit", "Agentes", "Skills". Cada página placeholder DEBE
  contener: un H1 con el nombre del módulo, un párrafo breve del tipo "próximamente
  cubriremos X" alineado con la spec futura correspondiente, y una admonition
  `!!! note "Contenido en construcción"` indicando que la sección aún no está publicada.
  No se admiten páginas vacías ni con sólo un título.
- **FR-003**: La página `docs/index.md` DEBE presentar la formación en español con tono
  **profesional y directo** (constitution 1.0.1, Principio I: ni académico ni
  excesivamente coloquial; sin argot como "a saco" o "picar código"), describir la
  audiencia dual (básico y avanzado), listar los objetivos y ofrecer un mapa de módulos
  con enlaces a las secciones anteriores.
- **FR-004**: El sitio DEBE usar el idioma español para toda la UI de MkDocs Material y
  para el contenido, manteniendo términos técnicos y comandos en su idioma original.
- **FR-005**: El sitio DEBE ofrecer alternancia entre tema claro y tema oscuro, ambos
  respetando la paleta definida en `docs/stylesheets/extra.css`. El tema por defecto en el
  primer acceso DEBE resolverse automáticamente según `prefers-color-scheme` del sistema
  del visitante; el toggle debe permitir sobrescribir esa elección y su selección persiste
  al menos durante la sesión.
- **FR-006**: La identidad visual (tipografías, paleta, spacing, tarjetas/grid) DEBE
  aproximarse a la referencia y estar concentrada en un único archivo
  `docs/stylesheets/extra.css`, referenciado desde `mkdocs.yml`.
- **FR-007**: Las tipografías del sitio DEBEN ser **Inter** para títulos y cuerpo e
  **IBM Plex Mono** para bloques de código, cargadas desde Google Fonts. Si la política
  del proyecto pasase a exigir self-hosting (privacidad/offline), se autoalojan en
  `docs/assets/fonts/` con la licencia SIL Open Font incluida; no se admiten otras
  familias sin actualizar esta spec.
- **FR-008**: MkDocs Material DEBE tener activadas las features: `navigation.tabs`,
  `navigation.sections`, `navigation.top`, `search.suggest`, `content.code.copy`,
  `content.code.annotate`.
- **FR-009**: Markdown DEBE tener activados admonitions, `pymdownx.superfences`,
  `pymdownx.tabbed`, `pymdownx.highlight`, `pymdownx.snippets`, `attr_list`, `md_in_html`.
- **FR-010**: El repositorio DEBE incluir un logo y un favicon placeholder en formato SVG
  simple bajo `docs/assets/`, referenciados desde `mkdocs.yml`.
- **FR-011**: La gestión de dependencias Python DEBE realizarse íntegramente con `uv`. El
  repositorio DEBE incluir `pyproject.toml` con las dependencias fijadas (versiones
  exactas, sin rangos abiertos) y `uv.lock` commiteado y coherente con el `pyproject.toml`.
  No DEBE existir `requirements.txt` ni instrucciones que empleen `pip`, `venv`, `pipenv`,
  `poetry` o `conda` en el flujo principal.
- **FR-012**: `pyproject.toml` DEBE declarar `requires-python = ">=3.12"` como suelo
  fijado del proyecto. El repositorio DEBE incluir `.python-version` gestionado por `uv`
  con una versión concreta de la rama **3.12.x** (p. ej. `3.12.7`) para que `uv sync`
  resuelva el intérprete de forma determinista. Un bump a `3.13.x` o superior exige
  actualizar esta spec explícitamente (no se acepta "o superior compatible" en el pin).
- **FR-013**: El repositorio DEBE incluir un `README.md` que documente: cómo instalar `uv`
  (con enlace a `https://docs.astral.sh/uv/`), cómo ejecutar `uv sync`, cómo levantar el
  sitio con `uv run mkdocs serve`, cómo validar con `uv run mkdocs build --strict`, cómo
  añadir páginas y cómo añadir dependencias con `uv add`. El README puede incluir una nota
  final indicando que el estándar del proyecto es `uv` y no se contemplan alternativas.
- **FR-014**: El repositorio DEBE incluir un `.gitignore` que ignore `.venv/`, `site/` y
  cachés de `uv` (por ejemplo `.uv-cache/`). El `.gitignore` NO DEBE ignorar `uv.lock`
  ni `.python-version` (ambos se versionan). La política de gestor Python vive en
  FR-011; este requisito se limita a la especificación del `.gitignore`.
- **FR-015**: `uv run mkdocs build --strict` DEBE terminar sin errores ni warnings en el
  primer commit del esqueleto.
- **FR-016**: La estructura final DEBE contener al menos: `docs/`, `docs/stylesheets/`,
  `docs/assets/`, `mkdocs.yml`, `pyproject.toml`, `uv.lock`, `README.md`, `.gitignore`.
- **FR-017**: El sitio DEBE cumplir WCAG 2.1 nivel AA como objetivo declarado en ambos
  temas (claro y oscuro). En concreto: contraste texto/fondo ≥ 4.5:1 para texto normal y
  ≥ 3:1 para texto grande y componentes de UI, foco visible en todos los elementos
  interactivos, navegación completa por teclado sin trampas de foco, atributo `alt`
  presente en toda imagen (o `alt=""` explícito si es decorativa), jerarquía de headings
  sin saltos (`h1` único por página, sin saltar niveles). La paleta de `extra.css` DEBE
  respetar estos ratios y verificarse antes de mergear.

### Key Entities

- **Sitio de formación**: colección de páginas Markdown en `docs/` publicada como sitio
  estático MkDocs. Atributos: título, idioma, navegación jerárquica, tema visual claro y
  oscuro, activos (logo, favicon, tipografías, CSS custom).
- **Módulo de formación**: sección de la navegación (Introducción, Setup del entorno,
  CLAUDE.md, App de ejemplo, SDD con Speckit, Agentes, Skills). En esta spec cada módulo
  contiene sólo un placeholder; el contenido real llega en specs posteriores.
- **Entorno Python del sitio**: entorno virtual gestionado por `uv`, descrito por
  `pyproject.toml` y bloqueado por `uv.lock`. Contiene MkDocs, MkDocs Material y plugins de
  Markdown necesarios.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En una máquina limpia con `uv` ya instalado, el sitio queda accesible en
  `http://127.0.0.1:8000` en menos de 3 minutos desde `git clone` (incluyendo `uv sync` y
  `uv run mkdocs serve`).
- **SC-002**: `uv run mkdocs build --strict` termina con código de salida 0 y sin líneas
  que empiecen por `WARNING` en la salida.
- **SC-003**: 100% de las siete secciones de navegación exigidas están presentes, en el
  orden requerido, con al menos una página placeholder navegable cada una.
- **SC-004**: En una evaluación visual interna, la paleta, familia tipográfica y spacing
  del sitio se perciben como coherentes con la identidad visual definida en `extra.css`
  en al menos 4 de 5 revisiones del equipo, tanto en tema claro como oscuro.
- **SC-005**: Un contribuidor sin conocimiento previo del proyecto puede añadir una página
  nueva y verla publicada en local siguiendo únicamente el README, en menos de 5 minutos.
- **SC-006**: Un contribuidor puede añadir una dependencia MkDocs siguiendo únicamente el
  README (`uv add …`) sin recurrir a `pip`, `venv` u otro gestor.
- **SC-007**: Una auditoría automatizada de contraste (p. ej. axe DevTools o Lighthouse
  accesibilidad) sobre la home y una página placeholder cualquiera, en tema claro y
  oscuro, reporta 0 issues de contraste con umbrales WCAG 2.1 AA y una puntuación de
  accesibilidad ≥ 95/100.

## Assumptions

- Los participantes trabajan en macOS, Linux o WSL2. Windows nativo queda fuera de esta
  spec.
- `uv` es el único gestor Python soportado; se asume que los usuarios pueden instalarlo
  siguiendo la documentación oficial enlazada desde el README.
- La versión mínima de Python del proyecto queda fijada en `>=3.12` (Clarifications
  2026-09-16) y se refleja en `pyproject.toml` y `.python-version`.
- La aproximación estética a la referencia se limita a fuentes, paleta, spacing y
  tratamiento de tarjetas/grid dentro de lo que MkDocs Material permite mediante
  configuración + CSS custom; no se rehace la maquetación página a página.
- Los placeholders de logo/favicon son SVG simples pensados para reemplazarse por assets
  finales más adelante; no se busca aún la identidad definitiva del programa.
- Ningún módulo se implementa aún; en esta spec sólo se dejan páginas mínimas para que la
  navegación no aparezca vacía.

**Deferidos a specs posteriores** (fuera de alcance aquí):
- Pipeline GitLab CI/CD y despliegue en GitLab Pages (spec 8 del plan de la formación).
- Contenido real de cualquier módulo (specs 2–7).
- Proyectos Java de ejemplo bajo `examples/`.
