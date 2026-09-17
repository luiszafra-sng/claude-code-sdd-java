<!--
Sync Impact Report
==================
Version change: 1.0.2 → 1.1.0
Bump rationale: MINOR — Principio V relaja la exigencia de skill propia de MUST a SHOULD, manteniendo agente propio como MUST. Cambio semántico material (relaja una norma), pero no elimina ni redefine principios de forma incompatible; los artefactos previos siguen siendo válidos.
Modified principles: V (Extensiones de Claude Code)
Added sections: none
Removed sections: none
Templates status:
  - .specify/templates/spec-template.md ✓ sin cambios
  - .specify/templates/plan-template.md ✓ sin cambios
  - .specify/templates/tasks-template.md ✓ sin cambios
  - .specify/templates/checklist-template.md ✓ sin cambios
Deferred TODOs: none

Historial previo:
- 1.0.2 (2026-09-16): PATCH — añadida norma de re-verificación semestral de versiones de herramientas.
- 1.0.1 (2026-09-16): PATCH — Principio I refinado en registro de tono ("profesional, directo, ni académico ni excesivamente coloquial").
- 1.0.0 (2026-09-16): ratificación inicial. Prior file contained only unresolved template placeholders.
-->

# Formación Claude Code + SDD (Speckit) para Java — Constitution

## Core Principles

### I. Documentación como Producto (MkDocs Material, tono informal-preciso)
Todo contenido formativo se publica como sitio MkDocs con el tema `mkdocs-material`. Cada
módulo MUST cumplir:

- Doble audiencia: legible por alguien que arranca de cero, y suficientemente detallado para
  consulta avanzada. Los conceptos nuevos MUST introducirse antes de usarse.
- Registro **profesional y directo**: ni académico ni excesivamente coloquial. La formación
  se dirige a profesionales adultos, por lo que MUST evitarse el argot ("a saco", "picar
  código", "venir a machete"), las muletillas juveniles y las metáforas de manual. Se
  admite tono cercano (2ª persona, verbos activos) siempre que la frase siga siendo
  clara en un contexto corporativo. Nada de relleno, pleonasmos ni advertencias vacías.
- Identidad visual centralizada: tipografías, paleta y ritmo tipográfico definidos como
  tokens únicos en `docs/stylesheets/extra.css` + `mkdocs.yml`. Los cambios estéticos se
  hacen ahí, no duplicados por página.
- Cada página MUST incluir ejemplo ejecutable o comando reproducible siempre que aplique.

Rationale: la formación es el entregable. Sin homogeneidad visual y de tono, la audiencia
avanzada la abandona y la básica se pierde.

### II. Java-Céntrico, Doble Tipología (Moderno + Legacy)
Los ejemplos de código MUST cubrir explícitamente dos perfiles:

- **Moderno**: Spring Boot 4 + Java 21 (baseline por defecto).
- **Legacy**: proyectos Java de varios años (versiones antiguas de Spring/JDK) representativos
  del trabajo real.

Cada técnica presentada (prompts, agentes, skills, flujo SDD) MUST mostrarse aplicada al
menos en el perfil moderno; cuando difiera en legacy, la diferencia MUST documentarse.
Ejemplos con bug intencionado (p. ej. NPE en creación de usuario) MUST marcarse como tales
y aislarse en su propio subproyecto/carpeta para no contaminar código de referencia.

Rationale: la audiencia trabaja en ambos mundos; una formación monotipológica no le sirve.

### III. Toolchain Reproducible vía SDKMAN
Las versiones de JDK y Maven usadas en la formación MUST gestionarse con
[SDKMAN](https://sdkman.io/). Cada proyecto de ejemplo MUST declarar sus versiones de forma
verificable (`.sdkmanrc` o equivalente) y la documentación MUST incluir el comando exacto
de instalación. No se permiten instrucciones que asuman JDK/Maven "ya instalados" sin
puntero a SDKMAN.

Herramientas del entorno de trabajo con Claude — **Claude Code**, **RTK**
(`https://github.com/rtk-ai/rtk`), **Caveman**
(`https://github.com/juliusbrussee/caveman`) y **CodeGraph**
(`https://github.com/colbymchenry/codegraph`) — MUST documentarse con: qué hace, cómo se
instala, cómo se verifica la instalación, y cuándo usarla. Ninguna se asume preinstalada.

Rationale: sin comandos exactos y versiones fijadas, los ejemplos dejan de reproducirse a
los pocos meses y la formación pierde credibilidad.

### IV. Spec-Driven Development como Método por Defecto
Cualquier funcionalidad no trivial que se construya dentro del repositorio (aplicación de
ejemplo, agentes, skills, módulos de docs con lógica) MUST atravesar el flujo Speckit:
`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`. Los pasos
opcionales (`clarify`, `analyze`, `checklist`, `converge`) MUST documentarse con su
disparador (cuándo tiene sentido usarlos).

La formación MUST cubrir explícitamente:

- Diferencia SDD vs "vibe coding" con ejemplo comparativo.
- Flujo **greenfield** (proyecto nuevo) vs **brownfield** (proyecto Java existente),
  incluyendo qué meter en `CLAUDE.md`, qué en la constitution, cuándo conviene crear
  agentes específicos y cómo indexar con CodeGraph.

Rationale: es el corazón de la formación; sin flujo homogéneo, cada módulo enseñaría algo
distinto.

### V. Extensiones de Claude Code (Agentes y Skills) Documentadas y Ejemplificadas
Todo lo que la formación enseñe sobre agentes y skills MUST incluir:

- Definición precisa, diferencias entre ambos, cuándo usar cuál.
- Alcance de instalación (usuario vs proyecto) y consecuencias.
- Tipos de memoria y modelo aplicable.
- Listado curado de repositorios de referencia con agentes/skills reutilizables.
- Al menos **un agente propio** diseñado sobre la aplicación Spring Boot 4 de
  ejemplo, con código completo en el repo. Requisito MUST.
- **SHOULD** incluir además una skill propia diseñada sobre la misma aplicación,
  con código completo en el repo. Se recomienda cerrarla como spec independiente
  cuando el mantenedor de la formación decida abordarla. Su ausencia temporal
  no bloquea merges de los módulos teóricos de skills.

Rationale: sin ejemplo propio funcional, la parte de agentes queda teórica.
La parte de skills admite una fase intermedia solo documental cuando la
formación prioriza cerrar antes los bloques conceptuales.

### VI. Publicación Automatizada en GitLab Pages
El sitio MkDocs MUST publicarse automáticamente vía GitLab CI/CD (`.gitlab-ci.yml` con job
`pages`). No se acepta build manual como método de publicación. El pipeline MUST:

- Fijar versiones de Python, MkDocs Material y plugins.
- Fallar si `mkdocs build --strict` produce warnings.
- Publicar sólo desde la rama principal (o la configurada explícitamente).

Rationale: la documentación desactualizada mata la formación; automatizar es el único modo
sostenible.

## Content & Tooling Constraints

- **Estructura de repositorio**: `docs/` contiene el sitio MkDocs; `examples/` contiene los
  proyectos Java (moderno y legacy, cada uno en su subcarpeta con su `.sdkmanrc`); `.claude/`
  contiene agentes y skills del proyecto; `.specify/` contiene artefactos Speckit.
- **CLAUDE.md**: existirán dos capas — la global del usuario (fuera del repo) y la del
  proyecto (`CLAUDE.md` en la raíz). La formación MUST explicar qué va en cada una, con
  ejemplo tomando como referencia
  `https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md`.
- **Aplicación de ejemplo**: CRUD de usuarios en Spring Boot 4 + Java 21, persistencia H2,
  con un bug reproducible (NPE en creación pese a enviar `email`) usado para enseñar
  depuración asistida por Claude.
- **Secretos y credenciales**: ningún ejemplo commitea credenciales reales; H2 en memoria
  para el CRUD.
- **Idioma**: español para las páginas de formación; nombres técnicos, comandos y código en
  su idioma original.

## Development & Publishing Workflow

- Cada nueva unidad formativa o módulo de ejemplo MUST originarse con `/speckit-specify` y
  cerrarse tras `/speckit-implement`, dejando trazables `spec.md`, `plan.md`, `tasks.md`.
- Pull/merge requests MUST verificar en su descripción qué principios de esta constitution
  se han respetado y justificar cualquier desviación.
- Antes de mergear a la rama principal, el pipeline MUST estar en verde (`mkdocs build
  --strict` + validaciones que se añadan).
- Los proyectos de `examples/` MUST compilar en local con el JDK/Maven declarados en su
  `.sdkmanrc`; la CI puede verificarlo opcionalmente pero no es bloqueante para la
  publicación de docs.
- **Re-verificación semestral de versiones**: toda página de la formación que declare
  una versión de herramienta externa (por ejemplo `docs/setup/*.md`) MUST incluir un
  bloque visible con "versión de referencia + fecha de verificación". Este bloque MUST
  re-verificarse al menos cada 6 meses y, adicionalmente, de forma inmediata cuando la
  herramienta publique una versión mayor upstream. Tras cada re-verificación se
  actualiza la fecha; si la versión ha cambiado, también el número. La ausencia de
  fecha o una fecha con más de 6 meses de antigüedad bloquea el merge de cambios que
  toquen la página afectada.

## Governance

Esta constitution prevalece sobre cualquier otra práctica del repositorio. Las enmiendas
MUST:

1. Proponerse en un merge request que edite `.specify/memory/constitution.md` e incluya
   Sync Impact Report actualizado.
2. Justificar el tipo de bump (MAJOR/MINOR/PATCH) según:
   - **MAJOR**: eliminar o redefinir un principio de forma incompatible.
   - **MINOR**: añadir un principio o expandir materialmente una sección.
   - **PATCH**: aclaraciones, redacción, correcciones no semánticas.
3. Actualizar plantillas dependientes (`plan-template`, `spec-template`, `tasks-template`,
   `checklist-template`) si el cambio las afecta.
4. Aprobarse por el mantenedor de la formación antes de mergear.

Revisiones de cumplimiento: cada nueva unidad publicada revisa contra los principios
vigentes. Las desviaciones no justificadas bloquean el merge.

**Version**: 1.1.0 | **Ratified**: 2026-09-16 | **Last Amended**: 2026-09-16
