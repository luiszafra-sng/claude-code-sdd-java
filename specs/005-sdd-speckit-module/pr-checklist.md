# PR Checklist — Módulo "SDD con Speckit" (spec 005)

Adjuntar al merge request. Cumplimiento por principio de la constitution 1.0.2.

## Constitution — principios tocados

- **Principio I · Documentación como Producto**
  - [x] Registro profesional-directo, sin argot ni caricaturas (T035 pendiente de revisión editorial final).
  - [x] Doble audiencia (arranque de cero + consulta avanzada) cubierta.
  - [x] Tokens visuales sólo en `docs/stylesheets/extra.css`; sin CSS inline (ninguno añadido).
  - [x] Cada página incluye ejemplos ejecutables o comandos reproducibles cuando aplica.
- **Principio II · Java-céntrico moderno + legacy**
  - [x] Caso guía sobre Spring Boot 4 + Java 21 (perfil moderno).
  - [x] `brownfield.md` cubre perfil legacy con guía específica.
- **Principio IV · SDD como método por defecto**
  - [x] Módulo atraviesa el ciclo Speckit completo: `/speckit-specify` → `/speckit-clarify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-analyze` → `/speckit-implement`.
  - [x] Artefactos vivos en `specs/005-sdd-speckit-module/`.
- **Principio V · Agentes y skills**
  - [x] Referenciados sin duplicar contenido; implementación real fuera de esta spec (módulos "Agentes" y "Skills").
- **Norma · Re-verificación semestral de versiones**
  - [x] Bloque "Versión de referencia" con fecha `2026-09-16` presente en 5 páginas (flujo, caso-guia, greenfield, brownfield, antipatrones) vía snippet `_snippets/version-block.md`.
  - [x] Fecha ≤ 6 meses respecto a merge previsto.

## Constitution — principios no tocados por este PR

- **Principio III · Toolchain reproducible vía SDKMAN**: no aplica directamente al módulo (no publica nuevas instrucciones de instalación); las páginas enlazan al módulo "Setup del entorno" para la instalación real.
- **Principio VI · Publicación GitLab Pages**: no altera pipeline; `mkdocs build --strict` pasa sin warnings (verificado — 0 warnings). El pipeline existente seguirá publicando sin cambios.

## Gates automáticos

- [x] `uv run mkdocs build --strict` — 0 warnings.
- [ ] `git diff --stat examples/ contracts/` — vacío (verificar en el propio PR; en el entorno de esta ejecución el repositorio no está inicializado en git).
- [x] `find examples/user-crud-modern/.specify -type f` y `find examples/user-crud-modern/specs -type f` — ambas vacías (FR-015).
- [x] Cross-links: 6/6 páginas con sección "Enlaces relacionados".

## Pendiente de humano antes de merge

- [ ] **T023** — Revisor externo reproduce el caso guía sobre su máquina siguiendo únicamente `caso-guia.md`. Cronometra (SC-002 exige ≤ 90 min) y registra divergencias en `notes-validation-us2.md`.
- [ ] **T031** — Lector de prueba realiza recorrido `index → flujo → caso-guia`. Cronometra (SC-001 exige ≤ 45 min) e identifica un antipatrón cometido antes + contramedida (SC-005).
- [ ] **T035** — Revisión editorial global (Principio I): tono, ausencia de argot/caricaturas, ausencia de redacción académica excesiva.

## Alcance verificable en el diff del PR

- `docs/sdd/` — 6 páginas nuevas + subcarpeta `_snippets/` con 2 snippets.
- `docs/assets/js/mermaid-init.js` — nuevo.
- `mkdocs.yml` — ampliada nav SDD; añadido `extra_javascript`; añadido `custom_fences` para Mermaid; añadido `pymdownx.snippets.base_path`; añadido `exclude_docs` para `_snippets/`.
- `.specify/notes/scope-gate.md` — nuevo.
- `specs/005-sdd-speckit-module/` — artefactos Speckit completos.

## Alcance NO tocado (verificable en el diff)

- `examples/user-crud-modern/` — 0 cambios.
- `contracts/users-api.yaml` — 0 cambios.
- `docs/app-ejemplo/**` — 0 cambios.
- `.specify/memory/constitution.md` — 0 cambios.
