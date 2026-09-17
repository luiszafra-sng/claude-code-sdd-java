# Validación final — spec 005 (Módulo SDD con Speckit)

**Fecha**: 2026-09-16

## Automatizado (ejecutado durante `/speckit-implement`)

| Escenario | Comando | Resultado |
|---|---|---|
| SC-003 · Build --strict | `uv run mkdocs build --strict` | PASS (0 warnings) |
| SC-006 · App intacta (diff)| `git diff --stat examples/ contracts/` | N/A: repositorio no inicializado en git en el entorno de esta ejecución. Verificable en el PR real. |
| FR-015 · No ciclo Speckit en app | `find examples/user-crud-modern/.specify -type f` y `/specs -type f` | PASS (ambas salidas vacías) |
| SC-004 · Bloques versión | grep `"Versión de referencia"` renderizado en sitio | PASS: presente en flujo/caso-guia/greenfield/brownfield/antipatrones (5 páginas incluyen snippet vía `--8<--`). Fecha `2026-09-16` (≤ 6 meses). |
| FR-004 · Sección "Enlaces relacionados" | `grep -c '^## Enlaces relacionados'` en cada página | PASS 6/6 páginas. |
| Contrato de página (FR-007/007b/008/009/011/012/013) | Revisión estructural por sección | PASS. |

## Pendiente de humano (post-implement)

| Tarea | Escenario quickstart | Persona requerida |
|---|---|---|
| T023 · Reproducibilidad alumno + cronómetro SC-002 | §8 | Revisor externo al autor. Requiere Claude Code + Speckit + JDK 21 en su máquina, y clon de la app. |
| T031 · Antipatrón anotado + cronómetro SC-001 | §7, §9 | Alumno de prueba (~45 min de lectura). |
| T035 · Revisión editorial global (tono Principio I) | — | Autor + revisor. |
| T038 · Consolidar notas | — | Autor. |
| T039 · Checklist de PR | — | Autor. |

## Extractos y anexos

- Umbral de 40 líneas (research §4): revisados todos los extractos en
  `caso-guia.md`. Todos por debajo del umbral. **No** se ha creado
  `docs/sdd/artefactos/`. T017 no aplica.

## Notas de scope

- No se ha modificado ningún fichero bajo `examples/user-crud-modern/`.
- No se ha modificado `contracts/users-api.yaml`.
- `mkdocs.yml` ampliado (nav SDD + `pymdownx.snippets.base_path` + `pymdownx.superfences.custom_fences` para Mermaid + `extra_javascript` con Mermaid CDN + `exclude_docs` para `_snippets/`).
- `docs/assets/js/mermaid-init.js` nuevo (init runtime Mermaid).
- `docs/sdd/_snippets/` nuevo (2 snippets: `version-block.md`, `enlaces-relacionados.md`).
- `.specify/notes/scope-gate.md` nuevo (gate para PR).
- `specs/005-sdd-speckit-module/notes-crosslinks.md` nuevo (matriz cross-links).

## Estado

MVP + US3 + US4 publicados. Pendiente sólo validación humana (T023, T031, T035, T038, T039). Módulo listo para revisión y merge tras esa validación.
