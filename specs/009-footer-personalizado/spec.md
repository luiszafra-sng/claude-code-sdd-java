# Feature Specification: Fecha de revisión por página sin texto genérico del generador

**Feature Branch**: `009-footer-personalizado`

**Created**: 2026-09-21
**Closed**: 2026-09-21

**Status**: Implemented

**Input**: User description: "Como formador que publica el sitio MkDocs de la formación, quiero que cada página muestre la fecha de su última revisión y que no aparezca el pie de página genérico de MkDocs."

> **Nota de diseño**: El planteamiento inicial incluía logo de Sngular en el pie de página con layout personalizado (`overrides/partials/footer.html`). Durante la implementación se decidió mostrar la fecha al final del contenido de cada artículo (mecanismo nativo de Material for MkDocs), sin footer custom ni logo, para evitar redundancia visual y ofrecer contexto más preciso: la fecha inline pertenece inequívocamente a la página que se está leyendo.

## Clarifications

### Session 2026-09-21

- Q: ¿Qué altura debe tener el logo de Sngular en el pie de página? → A: Media (≈ 32 px) — visible y equilibrada.
- Q: ¿Prefieres la fecha en un footer personalizado global o al final del contenido de cada artículo? → A: Al final del contenido de cada artículo, alineada a la derecha. Sin logo en el pie; sin footer custom.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fecha de revisión al final del contenido de cada página (Priority: P1)

El visitante del sitio ve la fecha del último commit de cada página al final de su contenido, alineada a la derecha, en formato español comprensible ("17 de septiembre de 2026"). Puede saber si el contenido está actualizado sin revisar el historial de git.

**Why this priority**: La fecha por página aporta confianza en la vigencia de la formación y es contextualmente más precisa que una fecha en el footer global del sitio.

**Independent Test**: Abrir una página cuyo último commit tenga fecha conocida y verificar que la fecha mostrada al final del contenido coincide, en formato español largo y alineada a la derecha.

**Acceptance Scenarios**:

1. **Given** una página con historial git, **When** se carga la página, **Then** al final del contenido aparece la fecha del último commit en formato "DD de mes de YYYY", alineada a la derecha.
2. **Given** una página sin historial git (nueva, sin commits previos), **When** se construye el sitio, **Then** la fecha mostrada es la de build como fallback, sin errores.
3. **Given** el sitio construido con `uv run mkdocs build --strict`, **When** se completa el build, **Then** no se emite ningún warning.

---

### User Story 2 - Eliminación del texto genérico del generador (Priority: P2)

El visitante del sitio no ve el texto "Made with Material for MkDocs" en el pie de ninguna página.

**Why this priority**: El pie genérico no aporta información relevante para la formación y distrae de la identidad editorial del sitio.

**Independent Test**: Inspeccionar el HTML generado y verificar que ninguna página contiene el texto "Made with Material for MkDocs".

**Acceptance Scenarios**:

1. **Given** el sitio publicado, **When** se inspecciona el HTML de cualquier página, **Then** el texto "Made with Material for MkDocs" no aparece en ningún lugar.

---

### Edge Cases

- ¿Qué ocurre si una página no tiene ningún commit en el historial git (p. ej. añadida pero no commiteada)? El sistema DEBE usar la fecha de build como fallback sin emitir warnings.
- ¿Qué ocurre si el entorno de CI no tiene acceso al historial git completo (shallow clone)? El sistema DEBE degradarse a fecha de build sin interrumpir el build.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Al final del contenido de TODAS las páginas MUST aparecer la fecha del último commit git de ese archivo, en formato español largo (p. ej. "17 de septiembre de 2026"), alineada a la derecha.
- **FR-002**: La fecha MUST presentarse en formato español largo: día ordinal, mes en minúsculas, año (p. ej. "17 de septiembre de 2026").
- **FR-003**: El texto "Made with Material for MkDocs" MUST NOT aparecer en ninguna página del sitio publicado.
- **FR-004**: Cuando no existe historial git para una página, el sistema MUST usar la fecha de build como valor de fallback, sin emitir errores ni warnings.
- **FR-005**: La dependencia que provee las fechas git MUST declararse con versión exacta (`==`) en `pyproject.toml`, gestionada con `uv`.
- **FR-006**: El comando `uv run mkdocs build --strict` MUST completarse sin ningún warning.
- **FR-007**: Todos los ajustes visuales MUST definirse en `docs/stylesheets/extra.css`, sin CSS en línea.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100 % de las páginas del sitio muestra la fecha de revisión al final de su contenido; ninguna queda sin fecha.
- **SC-002**: Las fechas son correctas: la fecha mostrada en cada página coincide con la del último commit de ese archivo (verificable comparando con `git log -1 --format="%ci" docs/<página>.md`).
- **SC-003**: El build con `--strict` produce cero warnings y cero errores en el entorno local y en CI.
- **SC-004**: No existe ninguna referencia al texto "Made with Material for MkDocs" en el HTML generado del sitio.

## Assumptions

- El repositorio tiene historial git completo en el entorno de build. Si el CI usa shallow clones, será responsabilidad del pipeline configurar `fetch-depth: 0`; esta spec no cubre la configuración de CI.
- El pie de página nativo de Material (navegación anterior/siguiente) se conserva sin modificaciones; no se usa override de `footer.html`.
- La fecha se muestra mediante el mecanismo nativo de Material for MkDocs integrado con el plugin `git-revision-date-localized`, sin override de template personalizado.
- Los tokens de color de la fecha inline los hereda del tema; no se introducen nuevos tokens de color.
