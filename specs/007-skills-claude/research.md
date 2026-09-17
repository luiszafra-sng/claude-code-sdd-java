# Phase 0 — Research: Módulo Skills (solo documentación)

Todas las incógnitas se resolvieron en `/speckit-clarify`. Este
documento consolida las decisiones y añade lo mínimo necesario para
sostener el diseño de Fase 1.

## Decisión 1 — Scope: solo documentación, sin skill propia

- **Decisión**: NO crear ningún directorio ni fichero bajo
  `.claude/skills/` como parte de este feature. Módulo estrictamente
  documental (5 páginas MD).
- **Rationale**: prioridad del mantenedor de la formación en cerrar la
  parte conceptual antes de invertir en un scaffolder funcional; el
  ejemplo teórico basta para el objetivo pedagógico.
- **Alternativas descartadas**:
  - Skill funcional `spring-endpoint-scaffolder`: introduce trabajo de
    plantillas, decisión de motor, ejemplo verificable end-to-end;
    fuera del alcance elegido.
  - Skill mínima placeholder: aportaría un `SKILL.md` inerte que ensucia
    el repo sin aportar valor didáctico.

## Decisión 2 — Enmienda de constitution (v1.1.0)

- **Decisión**: bump MINOR del documento
  `.specify/memory/constitution.md`: Principio V pasa "skill propia" de
  MUST a SHOULD. Agente propio permanece MUST.
- **Rationale**: sin la enmienda, el gate del plan bloquearía (spec no
  entrega skill propia). Relajar la sub-cláusula preserva la parte
  fuerte del principio y admite una fase intermedia solo documental.
- **Alternativas descartadas**:
  - Aceptar desviación puntual: contamina el gate y crea deuda de
    interpretación en features futuros.
  - Enmienda MAJOR eliminando la referencia a skill: reduce el
    principio; innecesario.

## Decisión 3 — Fuentes autoritativas para el contenido del módulo

- **Decisión**: usar la documentación oficial de Claude Code como
  fuente principal para `anatomia.md` y `alcance.md`. Verificar cada
  concepto contra `https://code.claude.com/docs/en/skills` y páginas
  vinculadas en el momento de redacción.
- **Rationale**: mismo criterio aplicado al módulo Agentes (spec 006);
  garantiza consistencia entre módulos y evita reinventar
  terminología. La constitution exige fechas de verificación en
  materiales que declaren versiones; se aplica también aquí.
- **Alternativas descartadas**:
  - Redactar desde memoria/experiencia: alto riesgo de drift respecto
    a la documentación oficial actual.
  - Sólo citar tutoriales de terceros: menor autoridad y potencial
    fuente de errores.

## Decisión 4 — Formato de la tabla de catálogo

- **Decisión**: reutilizar el contrato validado en el módulo Agentes:
  tabla con columnas `Nombre | Autor | Propósito | Enlace | Verificado (YYYY-MM-DD)`,
  filas ordenadas alfabéticamente, 5–8 entradas.
- **Rationale**: coherencia con `docs/agentes/catalogo.md`; misma
  regla semestral de verificación; un contrato reutilizable a lo largo
  del sitio (`specs/007-skills-claude/contracts/catalog-entry.schema.md`).
- **Alternativas descartadas**:
  - Formato distinto por módulo: fragmenta la experiencia del lector y
    complica la revisión semestral.

## Decisión 5 — Candidatos para el catálogo (5–8 entradas)

Búsqueda de repos públicos con **skills** para Claude Code (SKILL.md o
directorios `skills/`). Candidatos preliminares a verificar antes de
publicar (HTTP 200 obligatorio):

- `anthropics/skills` (referencia oficial).
- `multica-ai/andrej-karpathy-skills` (mencionada en la constitution).
- `hesreallyhim/awesome-claude-code` (awesome list general que
  incluye sección de skills).
- `davila7/claude-code-templates` (packs mixtos con skills y agentes).
- `revolutionary-git/claude-skills` (pack de skills reutilizables).

Se cerrará la lista definitiva durante `/speckit-implement`; el plan
sólo fija criterios y ordenación. Si un enlace no responde HTTP 200 en
la fecha de verificación, se descarta y se sustituye por otro
verificado.

## Decisión 6 — Ubicación del módulo en `mkdocs.yml`

- **Decisión**: entre "Agentes" y "SDD con Speckit". Alineado con la
  memoria persistente `feedback-nav-order` guardada por el usuario.
- **Rationale**: mantiene la progresión pedagógica setup → CLAUDE.md →
  app-ejemplo → agentes → skills → SDD. Estudiante llega al bloque
  Speckit habiendo visto ambas extensiones (agentes y skills).
- **Alternativas descartadas**:
  - Antes de Agentes: rompe la progresión ya establecida en spec 006.
  - Después de SDD: separa dos módulos conceptualmente hermanos.

## Notas transversales

- Ninguna página modifica `docs/stylesheets/extra.css` (Principio I).
- Ningún ejemplo materializa código Java nuevo; el `crear-una.md`
  ilustra un scaffolder hipotético con snippets de referencia sin
  generar archivos reales.
- `crear-una.md` DEBE incluir un aviso visible al inicio: "Ejemplo
  ilustrativo; ninguna skill se materializa en el repo".

Todos los NEEDS CLARIFICATION quedan resueltos. Avanza a Fase 1.
