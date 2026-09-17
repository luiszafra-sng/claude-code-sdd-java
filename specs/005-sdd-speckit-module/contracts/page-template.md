# Contract · Plantilla de página del módulo "SDD con Speckit"

**Feature**: `005-sdd-speckit-module`

Todas las páginas bajo `docs/sdd/` MUST respetar esta plantilla estructural. El contenido se adapta a la página; los encabezados y el orden no.

## Estructura obligatoria

```markdown
# {Título de la página}

{Párrafo introductorio: 2-4 líneas explicando qué encontrará el lector y en qué momento del recorrido está.}

## {H2 específicos de la página}

{Cuerpo. Cada H2 corresponde a una sección del contrato específico de la página.}

## Enlaces relacionados

- [{Título del módulo destino}]({ruta relativa}) — {motivo del link, 1 línea}.
```

## Reglas por página

### `index.md`

Secciones obligatorias:

1. `## Qué es Spec-Driven Development`
2. `## SDD vs vibe coding` (contiene tabla comparativa)
3. `## Por qué SDD encaja en Java empresarial`
4. `## Cuándo NO usar SDD` (nota sobre exploraciones y spikes)
5. `## Enlaces relacionados`

### `flujo.md`

Secciones obligatorias:

1. `## Ciclo Speckit en un vistazo` (contiene diagrama Mermaid)
2. `## Pasos obligatorios` (subsecciones H3 por comando: `specify`, `plan`, `tasks`, `implement`)
3. `## Pasos opcionales` (subsecciones H3 por comando: `constitution`, `clarify`, `analyze`, `checklist`, `converge`)
4. Cada H3 debe contener: **Qué produce**, **Inputs necesarios**, **Cuándo dispararlo** (opcionales) y **Extracto ilustrativo del caso guía**.
5. `## Enlaces relacionados`
6. Bloque de versión de referencia si se cita versión de Speckit (obligatorio en esta página).

### `caso-guia.md`

Secciones obligatorias:

1. `## Contexto del ejercicio`
2. `## Aviso — extractos ilustrativos` (declaración explícita FR-010: el alumno reproduce en su máquina; los extractos son referencia)
3. `## Prompt inicial para /speckit-specify` (bloque copiable)
4. `## Clarifications propuestas` (una subsección H3 por pregunta con: pregunta, respuesta recomendada oficial, justificación, alternativas rechazadas)
5. `## Extracto de plan.md — decisiones técnicas`
6. `## Extracto de tasks.md — descomposición` (5–8 tareas)
7. `## Extracto del contract` (query params + schema `PagedUserResponse`)
8. `## Salida esperada de /speckit-implement`
9. `## Verificación`  (bloques copiables `./mvnw test` y `curl`)
10. `## Enlaces relacionados`

### `greenfield.md`

Secciones obligatorias:

1. `## Punto de partida: proyecto Java nuevo`
2. `## Constitution mínima`
3. `## CLAUDE.md inicial`
4. `## Cuándo crear agentes específicos`
5. `## Orden recomendado de specs` (setup → dominio central → integraciones → operaciones)
6. `## Enlaces relacionados`

### `brownfield.md`

Secciones obligatorias:

1. `## Punto de partida: proyecto Java existente`
2. `## Indexar con CodeGraph`
3. `## CLAUDE.md que refleja las convenciones actuales`
4. `## Constitution descriptiva, no aspiracional`
5. `## Cuándo conviene un agente por dominio del legacy`
6. `## Primera spec sobre código heredado` (usa `user-crud-modern` como referencia narrativa)
7. `## Enlaces relacionados`

### `antipatrones.md`

Secciones obligatorias:

1. `## Cómo leer esta página` (síntoma → causa → contramedida)
2. Una subsección H3 por antipatrón (mínimo 10, según FR-013): specs vagas, tasks sin AC, saltarse el plan, editar código sin spec, `/speckit-clarify` cosmético, `plan.md` que dicta código, `/speckit-analyze` ignorado, `/speckit-converge` como coartada, prompts con solución preescrita, tests escritos post-implement.
3. Cada H3 contiene bloques `**Síntoma**`, `**Causa**`, `**Contramedida**`.
4. `## Enlaces relacionados`

## Reglas transversales

- **Idioma**: español para prosa; comandos, nombres técnicos y código en su idioma original.
- **Tono**: profesional-directo (constitution Principio I). Sin argot, sin caricaturas.
- **CSS**: cero CSS inline. Cualquier ajuste visual vive en `docs/stylesheets/extra.css`.
- **Enlaces**: relativos (`../claude-md/index.md`), nunca absolutos con `site_url`.
- **Bloques de código**: SIEMPRE con lenguaje explícito (` ```java `, ` ```yaml `, ` ```bash `, ` ```markdown `).
- **Admonitions**: `!!!` para notas/warnings/tips. Reservar `info` para el bloque de versión (ver `version-block.md`).
- **Longitud de extractos ilustrativos**: >40 líneas se trasladan a anexo bajo `docs/sdd/artefactos/`.
