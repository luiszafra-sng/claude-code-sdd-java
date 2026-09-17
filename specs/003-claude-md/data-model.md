# Phase 1 Data Model: Módulo "CLAUDE.md: usuario y proyecto"

**Feature**: 003-claude-md
**Date**: 2026-09-16

Feature docs-only + un archivo `CLAUDE.md` en la raíz del repositorio.
Este modelo describe las entidades conceptuales de contenido y sus
relaciones, útiles para razonar sobre estructura, snippets y
verificación.

---

## Entidades

### 1. Módulo CLAUDE.md (`ClaudeMdModule`)

Sección "CLAUDE.md" del sitio.

**Atributos**:
- `id` (const): `claude-md`.
- `title` (string): `"CLAUDE.md"`.
- `pages` (list<Pagina>): ordenada, 5 entradas.
- `live_repo_file` (path): `CLAUDE.md` en la raíz del repo (FR-008a).

**Validaciones**:
- `pages` DEBE contener exactamente 5 entradas en el orden fijado:
  `index`, `usuario`, `proyecto`, `buenas-practicas`, `antipatrones`.
- `live_repo_file` DEBE existir en la raíz y estar enlazado desde
  `proyecto.md`.

### 2. Página del módulo (`ModulePage`)

**Atributos**:
- `slug` (enum): `index` | `usuario` | `proyecto` | `buenas-practicas`
  | `antipatrones`.
- `title` (string): visible en la nav (ver tabla abajo).
- `path` (path): `docs/claude-md/<slug>.md`.
- `required_sections` (list<Seccion>): secciones H2 obligatorias por
  página (ver §"Secciones por página").
- `back_link` (path): apunta a `docs/claude-md/index.md` (excepto la
  propia `index.md`, que enlaza a la home del sitio).

**Tabla de páginas (fija)**:

| order | slug              | title              | path                             |
|------:|-------------------|--------------------|----------------------------------|
| 1     | index             | CLAUDE.md          | docs/claude-md/index.md          |
| 2     | usuario           | Capa usuario       | docs/claude-md/usuario.md        |
| 3     | proyecto          | Capa proyecto      | docs/claude-md/proyecto.md       |
| 4     | buenas-practicas  | Buenas prácticas   | docs/claude-md/buenas-practicas.md |
| 5     | antipatrones      | Antipatrones       | docs/claude-md/antipatrones.md   |

### 3. Sección estándar (`Seccion`)

**Atributos**:
- `page_slug` (string).
- `heading` (string): título literal del H2 o H3 requerido.
- `level` (enum: `h2` | `h3`).
- `order` (int).

**Secciones por página** (mínimo requerido):

- **`index.md`** (H2 canónicos):
  1. `Qué es CLAUDE.md`
  2. `Dónde vive`
  3. `Precedencia entre capas` (regla explícita: proyecto gana)
  4. `Cuándo lo lee Claude Code`
  5. `Mapa del módulo` (enlaces a las 4 páginas hermanas)

- **`usuario.md`** (H2 canónicos):
  1. `Qué meter en la capa usuario`
  2. `Ejemplo real anonimizado` (snippet copiable completo)
  3. `Antipatrones específicos de la capa usuario` (breve)

- **`proyecto.md`** (H2 canónicos):
  1. `Qué meter en la capa proyecto`
  2. `Ejemplo: Spring Boot 4 + Java 21` (snippet)
  3. `Ejemplo: legacy Spring Boot 2.7 + Java 8` (snippet)
  4. `CLAUDE.md del repositorio de la formación` (enlace al archivo
     vivo + advertencia)

- **`buenas-practicas.md`** (H2 canónicos):
  1. `Reglas ejecutables por el LLM`
  2. `Comparativa Antes / Después` — contiene tres H3 fijos: `### Antes`,
     `### Después`, `### Qué cambió`
  3. `Checklist de calidad`

- **`antipatrones.md`** (H2 canónicos):
  1. `Contenido prohibido`
  2. `Errores de formato`
  3. `Umbrales de longitud`
  4. `Cómo auditar un CLAUDE.md`

### 4. Snippet copiable (`ClaudeMdSnippet`)

Bloque de código Markdown con lenguaje `markdown` que representa un
`CLAUDE.md` completo, listo para copiar.

**Atributos**:
- `id` (enum): `user-ref` | `spring-boot-4` | `spring-boot-2-7-legacy`
  | `formacion-live`.
- `location` (path): página que lo contiene, o `CLAUDE.md` de la raíz
  (para `formacion-live`).
- `language_tag` (const): `markdown`.
- `sections` (list<string>): esqueleto común (cabecera + contexto +
  convenciones + comandos + restricciones + [enlaces]).
- `stamped_year_month` (string): `2026-09`.
- `useful_lines` (int): número de líneas útiles (excluyendo bloques
  embebidos); DEBE ser ≤ 200.
- `total_lines` (int): total; DEBE ser < 500.

**Validaciones**:
- Todo snippet DEBE incluir el sello temporal (FR-014).
- Todo snippet DEBE respetar los umbrales del módulo (200 útiles / 500
  totales) — coherencia interna con lo que enseña `antipatrones.md`.
- `user-ref` vive en `usuario.md`; `spring-boot-4` y
  `spring-boot-2-7-legacy` viven en `proyecto.md`; `formacion-live`
  vive como archivo real en la raíz del repo.

### 5. Comparativa (`AntesDespuesComparison`)

Componente pedagógico único de `buenas-practicas.md`.

**Atributos**:
- `task` (string): descripción breve de la tarea a la que se aplica el
  `CLAUDE.md` comparado (por ejemplo, "refactorizar el módulo de
  autenticación").
- `antes_block` (ClaudeMdSnippet-like): bloque `markdown` del
  `CLAUDE.md` pobre.
- `despues_block` (ClaudeMdSnippet-like): bloque `markdown` del
  mejorado.
- `changes` (list<Change>): al menos 3 elementos.
- `h3_titles` (const): `["### Antes", "### Después", "### Qué cambió"]`
  en ese orden.

**Validaciones**:
- `changes.length >= 3` (FR-007, SC-003).
- Cada `Change` debe indicar "qué se mejoró" y "por qué".
- `antes_block` y `despues_block` deben tener longitud comparable (± 30%).

### 6. Change (`Change`)

**Atributos**:
- `what_changed` (string): descripción de la mejora.
- `why` (string): motivo.
- `references_rule` (string, opcional): nombre de la regla de la página
  que la sostiene (p. ej. "regla de reglas ejecutables").

### 7. Cross-link (`Crosslink`)

Enlace entre este módulo y otros módulos del sitio.

**Instancias fijas**:

| id                    | from                                | to                                        | tipo         |
|-----------------------|-------------------------------------|-------------------------------------------|--------------|
| setup-to-claude       | `docs/setup/index.md`               | `docs/claude-md/index.md`                 | siguiente    |
| claude-to-sdd         | `docs/claude-md/index.md`           | `docs/sdd/index.md` (placeholder spec 5)  | siguiente    |
| practices-to-sdd      | `docs/claude-md/buenas-practicas.md`| `docs/sdd/index.md` (placeholder spec 5)  | referencia   |
| proyecto-to-live-file | `docs/claude-md/proyecto.md`        | `../CLAUDE.md` (raíz del repo)            | ejemplo vivo |

### 8. Umbrales de longitud (`LengthThreshold`)

**Atributos**:
- `soft` (int): `200` — líneas útiles orientativas.
- `hard` (int): `500` — líneas totales; aviso duro.
- `useful_lines_definition` (string): "líneas fuera de bloques de
  código embebidos, tablas y admonitions".

**Validaciones**:
- Los umbrales DEBEN aparecer literalmente en `antipatrones.md` §
  "Umbrales de longitud".
- Cada `ClaudeMdSnippet` publicado DEBE ser ≤ `soft` líneas útiles.

---

## Relaciones

- `ClaudeMdModule` 1 — 5 `ModulePage` (composición ordenada).
- `ModulePage` 1 — N `Seccion` (composición; N ≥ tamaño canónico
  definido en §"Secciones por página").
- `usuario.md` 1 — 1 `ClaudeMdSnippet` (`user-ref`).
- `proyecto.md` 1 — 2 `ClaudeMdSnippet` (`spring-boot-4`,
  `spring-boot-2-7-legacy`) + referencia a `formacion-live`.
- `buenas-practicas.md` 1 — 1 `AntesDespuesComparison`.
- `AntesDespuesComparison` 1 — N `Change` (N ≥ 3).
- `ClaudeMdModule` 1 — 4 `Crosslink` (tabla arriba).
- `antipatrones.md` 1 — 1 `LengthThreshold`.
- `ClaudeMdModule` 1 — 1 `ClaudeMdSnippet` (`formacion-live`, vive en
  la raíz).

## Transiciones de estado

No aplica en runtime. A nivel de mantenimiento:

```text
Publicada → (constitución cambia o repo evoluciona) → Actualizar `CLAUDE.md` vivo → Republicada
```

`stamped_year_month` no está sujeto a política semestral (aplica sólo a
spec 002); se actualiza si se toca la página o el archivo vivo.

## Materialización

- `ClaudeMdModule` + orden → `mkdocs.yml` (bloque `nav` de "CLAUDE.md").
- Cada `ModulePage` → un `.md` bajo `docs/claude-md/`.
- Cada `ClaudeMdSnippet` → bloque de código Markdown dentro de su
  página (salvo `formacion-live`, que es archivo separado).
- `AntesDespuesComparison` → tres H3 consecutivos en
  `buenas-practicas.md`.
- `Crosslink` → enlaces Markdown en las páginas indicadas.
- `LengthThreshold` → subsección de `antipatrones.md`.
