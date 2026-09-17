# Phase 0 — Research: Módulo Agentes + agente propio

Todas las incógnitas de la spec se resolvieron durante `/speckit-clarify`. Este
documento consolida las decisiones tomadas y las fuentes consultadas para
sostener el diseño de Fase 1.

## Decisión 1 — Valor del campo `model:` en el agente

- **Decisión**: alias corto `sonnet`.
- **Rationale**: sobrevive a rev de versiones menores publicadas por
  Anthropic; alineado con los agentes de referencia del ecosistema Claude
  Code y con lo que enseñará `memoria-modelos.md`.
- **Alternativas descartadas**:
  - ID exacto `claude-sonnet-4-6`: rompería el agente cuando Anthropic
    publique 4.7/5.0; obligaría a bump manual del repo formativo.
  - Omitir el campo: perderíamos la oportunidad didáctica de mostrar el
    control explícito del modelo.

## Decisión 2 — Isolación por worktree del agente propio

- **Decisión**: NO declarar `isolation: worktree` en el frontmatter del
  agente. Concepto se documenta en `anatomia.md` con snippet ilustrativo
  aislado.
- **Rationale**: feedback rápido sobre el CRUD supera al aislamiento en
  contexto formativo; el estudiante tiene el repo bajo control y puede
  revertir con git.
- **Alternativas descartadas**:
  - `isolation: worktree` por defecto: añade latencia y overhead de disco
    en cada ejecución sobre un proyecto Maven; ruido en formación.
  - Sin mención al worktree: incumpliría FR-004 (anatomía debe cubrirlo).

## Decisión 3 — Comando de ejecución de tests del CRUD

- **Decisión**: `./mvnw test` (Maven wrapper del proyecto).
- **Rationale**: reproducible sin depender de la versión de Maven del
  estudiante; coherente con Principio III (toolchain fijado). El agente
  ejecuta el comando vía la herramienta Bash listada en su frontmatter.
- **Alternativas descartadas**:
  - `mvn test`: depende de instalación externa; conflicto con Principio III.
  - `./mvnw -pl <módulo> test`: prematuro; el CRUD (spec 004) es un
    solo módulo.

## Decisión 4 — Formato de fecha de verificación en `catalogo.md`

- **Decisión**: tabla con columnas `Nombre | Autor | Propósito | Enlace | Verificado (YYYY-MM-DD)`.
- **Rationale**: granularidad por entrada permite retirar filas
  individuales sin invalidar el resto; encaja con la norma semestral
  (`Development & Publishing Workflow`, constitution 1.0.2).
- **Alternativas descartadas**:
  - Bloque global "todas verificadas el X": una entrada muerta bloquea
    todo el bloque.
  - Sección separada de fechas: fragmenta la información y complica la
    lectura.

## Decisión 5 — Candidatos para el catálogo (5–8 entradas)

Búsqueda restringida a repos públicos con agentes reutilizables para
Claude Code y coherentes con el perfil del estudiante (Java moderno,
docs, testing). Verificación online obligatoria justo antes de commit —
si un enlace no responde, se retira de la lista y se sustituye por otro
verificado.

- **Rationale**: FR-007 exige verificación previa; la lista definitiva se
  cerrará durante `/speckit-implement` con `curl -I` o navegación
  manual. El plan fija la política de curación, no las URLs finales.
- **Alternativas descartadas**:
  - Copiar listados de terceros sin verificar: viola la constitution
    (credibilidad) y el propio FR-007.
  - Listado 100% autogenerado por búsqueda semántica: sin curación no
    hay garantías de calidad.

## Decisión 6 — Ubicación del módulo en `mkdocs.yml`

- **Decisión**: colocar "Agentes" después del módulo "CLAUDE.md" y
  antes de "SDD (Speckit)".
- **Rationale**: sigue la progresión pedagógica ya publicada (setup →
  CLAUDE.md → agentes → skills → SDD). Los estudiantes llegan al módulo
  con el `CLAUDE.md` interiorizado y aún sin haber visto el flujo
  Speckit completo.
- **Alternativas descartadas**:
  - Al final del `nav`: rompe la progresión y confunde al estudiante que
    consulta linealmente.
  - Como submódulo de Speckit: mezcla dos temas distintos (extensiones
    del agente vs método de trabajo).

## Notas transversales

- El agente `spring-boot-debugger` se dirige al perfil moderno (Spring
  Boot 4 + Java 21). Principio II se cumple; el legacy no aplica en
  este feature y se marcará explícitamente en `crear-uno.md`.
- Ningún artefacto del feature toca `docs/stylesheets/extra.css`; la
  identidad visual permanece intacta (Principio I).
- Ningún archivo dentro de `examples/` se modifica en este feature.

Todos los NEEDS CLARIFICATION quedan resueltos. Se puede avanzar a
Fase 1.
