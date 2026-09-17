# SDD en brownfield: introducir Speckit en un proyecto Java existente

Brownfield es el escenario mayoritario: código con años de decisiones
acumuladas, documentación fragmentada, tests desiguales, personas que
conocen zonas distintas del sistema. Introducir Speckit aquí exige un
principio: **codificar lo que ya es cierto, no lo aspiracional**. La
constitution y `CLAUDE.md` describen convenciones existentes; los cambios
aspiracionales se abordan como specs individuales, no como imposición
retroactiva.

## Punto de partida: proyecto Java existente

Sabes cómo compila, cómo se despliega, tienes al menos un test que pasa. Lo
que **no** sabes con precisión: qué convenciones están vivas y cuáles son
folclore, dónde vive cada dominio, qué "temas peligrosos" evitar. Introducir
Speckit sobre este escenario sigue estos pasos, sin saltarse ninguno:

1. **Indexar con CodeGraph** — para localizar código sin adivinar rutas.
2. **Redactar `CLAUDE.md` descriptivo** — no aspiracional.
3. **Escribir una constitution que codifique lo que ya es cierto** — no
   principios que el equipo aún no cumple.
4. **Decidir sobre agentes por dominio** — sólo si el legacy tiene fronteras
   claras.
5. **Primera spec sobre código heredado** — pequeña, verificable, con
   `/speckit-clarify` obligatorio para desambiguar convenciones.

El caso guía de este módulo ([caso-guia.md](caso-guia.md)) es exactamente un
ejemplo brownfield puro: añadir búsqueda + paginación al `GET /users` del
CRUD moderno, respetando `records`, `ProblemDetail`, tests con MockMvc y
sembrado runtime que ya existen.

## Indexar con CodeGraph

[CodeGraph](../setup/codegraph.md) construye un grafo del código (símbolos,
llamadas, ficheros, dependencias entre paquetes) sobre el que Claude Code
puede consultar sin abrir 20 ficheros a mano. En brownfield es especialmente
útil: te ahorra el "grep del pastor" que domina las primeras semanas.

Puesta en marcha mínima:

```bash
cd /ruta/al/repo-legacy
codegraph init
codegraph build  # tarda; escala con tamaño del repo
```

Cuando Claude Code arranca dentro del repo indexado, dispone de la tool
`codegraph_explore`: una sola llamada te devuelve el origen literal
(numerado por línea) de los símbolos relevantes **más** las rutas de
llamada entre ellos, incluidos saltos por dispatch dinámico que grep no
sigue. Esto reduce drásticamente el número de rondas de exploración.

Verificación:

```bash
codegraph explore "UserService.list"
# → devuelve UserService.list y sus callers/callees, con líneas numeradas.
```

Si el proyecto no tiene `.codegraph/`, sáltate el paso; Claude Code usará
`grep`/`find`. La adopción es opcional pero fuertemente recomendada en repos
grandes (a partir de unas 50 000 líneas de código, donde `grep` empieza a
devolver demasiado ruido).

## `CLAUDE.md` que refleja las convenciones actuales

En brownfield, `CLAUDE.md` es un espejo del proyecto tal como es hoy. Sirve
para que Claude no proponga cambios "porque en un manual dicen que…" cuando
el proyecto tiene razones históricas para hacerlo distinto.

Plantilla brownfield:

```markdown
# CLAUDE.md — <Nombre del proyecto legacy>

## Contexto

Descripción real del proyecto: qué hace, cuándo se arrancó, quién lo mantiene
hoy, qué zonas están vivas y cuáles congeladas.

## Stack actual

- Lenguaje: Java 17 (algunos módulos aún en Java 11 — módulo `foo/`).
- Framework: Spring Boot 3.4.
- Build: Maven multi-módulo con `parent-pom` interno.
- BBDD: PostgreSQL 15 en prod; H2 sólo para tests unitarios.
- Testing: JUnit 4 en módulos antiguos, JUnit 5 en módulos post-2023.

## Convenciones observadas

- DTOs como clases con Lombok (no records) — legado, no romper por consistencia.
- Errores: mezcla de `ResponseEntity<ErrorDto>` (módulos antiguos) y
  `ProblemDetail` (módulos post-2024). Convención objetivo: `ProblemDetail`,
  pero migrar sólo tocando el módulo por otra razón.
- Nombres en inglés en código; commits en inglés. Comentarios en español o
  inglés indistintamente (legado).

## Zonas peligrosas

- `com.legacy.billing` — módulo con lógica financiera; cualquier cambio
  requiere revisión del owner (@fulanito). No refactorizar sin spec explícita.
- `PaymentGatewayClient` — cliente con retries manuales; hay un bug conocido
  de doble cobro documentado en `docs/incidents/2024-03-payment-race.md`.

## Comandos habituales

- `./mvnw -pl <modulo> test`
- `./mvnw -pl <modulo> spring-boot:run`

## Restricciones para Claude Code

- **Flujo Speckit** para cambios en módulos vivos; los congelados se tocan
  sólo por hotfix documentado.
- **No introducir records donde ya hay clases con Lombok** — mezclar
  convenciones dentro del mismo módulo genera más ruido que valor.
- **No unificar el manejo de errores en un mismo PR** — migración progresiva
  por spec.
```

Tres notas críticas:

1. **Convenciones observadas** describe lo que **está**, no lo que "debería
   estar". Si el proyecto usa Lombok, escribes Lombok, aunque prefieras
   records. La migración se aborda como spec.
2. **Zonas peligrosas** es una sección brownfield específica que no existe
   en greenfield. Reduce enormemente los sustos.
3. **Restricciones para Claude Code** codifica las líneas rojas para que
   Claude no proponga refactors bien intencionados que rompen el equilibrio.

## Constitution descriptiva, no aspiracional

El error típico en brownfield es redactar la constitution como declaración
de intenciones: "todos los tests son E2E con Testcontainers", "todas las
APIs usan ProblemDetail", "toda la lógica financiera está auditada". Si eso
no es cierto **hoy**, la constitution miente y su función de gate se rompe
al primer `Constitution Check`.

Regla: la constitution codifica principios que **el equipo cumple hoy**. Si
quieres subir el listón (más tests, mejor observabilidad), abre una spec de
mejora con un ámbito acotado, y sólo cuando esa spec se cierra y la práctica
está consolidada, la elevas a la constitution como enmienda MINOR.

Ejemplo de constitution honesta para un legacy típico:

```markdown
### I. Compatibilidad hacia atrás
Cambios en APIs públicas MUST mantener compatibilidad hacia atrás salvo
mayor deprecación anunciada con >=90 días. Rationale: consumers externos
sin ciclo de release sincronizado.

### II. Tests como red de seguridad
Cada bugfix MUST venir con un test que falla antes del fix y pasa después.
Cobertura total no es un principio; añadir el test-que-falla al bugfix, sí.

### III. Refactor con propósito
Refactorizar sólo cuando el cambio funcional lo justifica o cuando existe
una spec explícita de "mejora". No mezclar refactor con feature.
```

Estos son principios cumplibles hoy. La constitution puede crecer, pero
crece por enmienda con evidencia, no por wishlist.

## Cuándo conviene un agente por dominio del legacy

Los agentes ganan sentido cuando el legacy tiene **fronteras de dominio
claras** y cada dominio tiene su propio idioma. Ejemplos:

- **`billing-agent`**: agente especializado en el módulo `com.legacy.billing`,
  con contexto sobre el owner, incidentes históricos, restricciones de
  compliance. Cuando Claude Code trabaja en billing, este agente entra en
  contexto y evita proponer cambios que el generalista propondría.
- **`payment-gateway-agent`**: mismo patrón, cliente externo con bug conocido
  y restricciones de rate limit.

Contraindicaciones:

- **Módulos con fronteras difusas** (todo se llama con todo): un agente por
  dominio no ayuda porque los cambios cruzan fronteras.
- **Un solo mantenedor**: crear un agente formal duplica el conocimiento
  que ya vive en la cabeza de esa persona. Es más valioso volcarlo a
  `CLAUDE.md` primero.
- **Volumen de cambios bajo**: si tocas el módulo dos veces al año, el
  agente envejece más rápido de lo que se usa.

Regla: **primero `CLAUDE.md` + zona peligrosa; después agentes cuando el
volumen lo justifique**.

## Primera spec sobre código heredado

La primera spec brownfield debe ser **pequeña, verificable y en zona no
peligrosa**. Objetivo: entrenar al equipo con Speckit sobre código real sin
riesgo.

Recomendación:

1. **Elige una ampliación pequeña** que respete todas las convenciones
   existentes. El caso guía de este módulo (búsqueda + paginación en
   `GET /users`) es exactamente esto: amplía un endpoint existente sin
   tocar el bug NPE conocido, sin cambiar convenciones (records, MockMvc,
   ProblemDetail).
2. **`/speckit-specify`** con prompt que enumere restricciones actuales
   ("respeta ProblemDetail existente", "no tocar tests `*_bugKnown`",
   "convención de records"). Esto obliga a que el spec las registre como
   FR o Assumptions.
3. **`/speckit-clarify` obligatorio**. Brownfield acumula decisiones
   implícitas; clarify las hace explícitas antes de plan.
4. **`/speckit-plan`** con `Constitution Check` estricto. Si el plan
   propone algo que la constitution descriptiva no permite, corriges el
   plan (no la constitution).
5. **`/speckit-tasks`** con granularidad conservadora; en brownfield es
   común descubrir dependencias implícitas que rompen tareas grandes.
6. **`/speckit-implement`** por fases pequeñas, con validación incremental.

Post-implement, ejecuta `/speckit-analyze` como red de seguridad. En
brownfield es especialmente valioso porque los artefactos evolucionan sobre
un contexto lleno de convenciones tácitas.

Ver [caso-guia.md](caso-guia.md) para el recorrido completo de este patrón
aplicado a la app de ejemplo.

## Enlaces relacionados

- [Caso guía](caso-guia.md) — ejemplo brownfield puro sobre [user-crud-modern](https://github.com/luiszafra-sng/user-crud-modern).
- [Flujo Speckit paso a paso](flujo.md) — referencia de comandos.
- [Greenfield](greenfield.md) — el otro escenario de adopción.
- [Setup del entorno](../setup/index.md) — CodeGraph, SDKMAN, Speckit.
- [CLAUDE.md](../claude-md/index.md) — capa proyecto para brownfield.
- [App de ejemplo](../app-ejemplo/index.md) — el CRUD sobre el que se ilustra.
- [Agentes](../agentes/index.md) — cuándo crear agente por dominio del legacy.
- [Skills](../skills/index.md) — skills que refuerzan el flujo.

!!! info "Versión de referencia"

    - **Speckit**: 1.0.4
    - **Claude Code**: 2.x (LTS actual)
    - **CodeGraph**: 0.x (última publicada)
    - **SDKMAN**: 5.19.x
    - **JDK**: 17 o 21 según módulo del legacy
    - **Maven**: 3.9.x
    - **Verificado**: 2026-09-16
