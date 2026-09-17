# Caso guía: búsqueda y paginación en `GET /users`

Recorrido end-to-end del ciclo Speckit aplicado a una funcionalidad realista
sobre la [app de ejemplo](../app-ejemplo/index.md): ampliar el endpoint
`GET /users` con filtros (`email`, `nameContains`, `createdAfter`), ordenación
(`sort`) y paginación (`page`, `size`), devolviendo un envelope
`{content, page, size, totalElements, totalPages}` en lugar del array plano
actual.

## Contexto del ejercicio

La app `examples/user-crud-modern/` expone hoy un `GET /users` que devuelve
todos los usuarios como array plano. La feature amplía ese endpoint para
soportar búsqueda, ordenación y paginación. Es representativa porque obliga
a decisiones no triviales (semántica AND/OR entre filtros, sensibilidad a
mayúsculas, orden por defecto, tamaño máximo de página, shape de la respuesta,
qué hacer con query params desconocidos) que justifican el flujo completo
Speckit y hacen `/speckit-clarify` valioso.

La feature es también un ejemplo brownfield puro: se añade sobre un CRUD ya
existente y respeta sus convenciones (`records`, `ProblemDetail` para errores,
tests con MockMvc, sembrado runtime, H2 en memoria). Ver
[brownfield.md](brownfield.md) para el marco general.

## Aviso — extractos ilustrativos

!!! warning "Extractos ilustrativos, no artefactos ejecutables"
    Todos los fragmentos `spec.md`, `plan.md`, `tasks.md`, contract y salidas
    de comandos que aparecen en esta página son **extractos ilustrativos**. No
    se generan dentro de este repositorio ni modifican la app
    `examples/user-crud-modern/`, sus tests o `contracts/users-api.yaml`.

    El módulo está diseñado para que **tú reproduzcas el ciclo en tu
    máquina** sobre tu propia copia local de la app (o sobre un proyecto Java
    equivalente: Spring Boot 3/4 + Java 17+, endpoint REST con colección
    paginable, persistencia relacional Spring Data, build Maven/Gradle
    reproducible). Los extractos te sirven como referencia estructural; el
    detalle exacto variará ligeramente en cada ejecución.

    Prerequisitos: instalar Claude Code, Speckit y JDK/Maven vía SDKMAN según
    el [Setup del entorno](../setup/index.md), y clonar el repo para tener la
    app en `examples/user-crud-modern/`.

## Cómo reproducir esto en tu máquina

Checklist rápido antes de ejecutar el primer `/speckit-*`:

1. **Claude Code** instalado y autenticado — [Setup > Claude Code](../setup/claude-code.md).
2. **Speckit** instalado (`speckit --version` responde) — [Setup del entorno](../setup/index.md).
3. **SDKMAN + JDK 21 + Maven 3.9.x** — [Setup > SDKMAN](../setup/sdkman.md).
4. **Copia local de la app**: `cd examples/user-crud-modern && ./mvnw -q -DskipTests package` compila sin errores.

Cada bloque de comando de esta página es **copiable tal cual**. Los prompts
para Claude Code se copian con el botón de la esquina del bloque; los pega en
tu terminal Claude Code sin ediciones.

### Inicializar Speckit en la app de ejemplo

La app `examples/user-crud-modern/` es un proyecto Spring Boot 4 normal: **no
tiene nada de Speckit**. Antes de ejecutar el ciclo tienes que inicializarlo
tú, y ese paso también forma parte del aprendizaje. Se hace una única vez.

Desde la raíz de tu copia local de la app:

```bash
cd examples/user-crud-modern
speckit init .
```

`speckit init` crea la carpeta `.specify/` con la estructura mínima
(`memory/`, `templates/`, `scripts/`) y deja un `.specify/memory/constitution.md`
vacío para que lo rellenes. Verifica que no ha tocado código de la app:

```bash
ls -la .specify/
git status  # sólo cambios bajo .specify/, nunca bajo src/ o pom.xml
```

Ahora arranca Claude Code dentro de esa carpeta y ejecuta:

```text
/speckit-constitution
```

Claude Code te preguntará por los principios que quieres fijar. Como la app
ya existe con convenciones vivas, redacta una **constitution descriptiva**
(qué es cierto hoy), no aspiracional. Para este caso guía, una constitution
mínima suficiente es:

```markdown
# user-crud-modern — Constitution

## Core Principles

### I. Records para DTOs
DTOs y value objects son records de Java 21. Las clases sólo se usan para
entidades JPA. Rationale: coherencia con el código existente.

### II. Errores como ProblemDetail
Todos los errores 4xx/5xx se serializan como `ProblemDetail` (RFC 7807). No
se aceptan `ResponseEntity<ErrorDto>` custom. Rationale: consistencia de
contrato para el consumidor.

### III. Tests con MockMvc
Los tests de controller usan MockMvc + JUnit 5. Los tests marcados
`*_bugKnown` documentan bugs intencionales y NO se tocan.

### IV. Retro-compatibilidad de endpoints existentes
Ampliar un endpoint MUST mantener URL y verbo. Los cambios de shape de
respuesta se documentan explícitamente en la spec como decisión consciente.

## Governance

Enmiendas por PR que edite este fichero e incluya bump MAJOR/MINOR/PATCH.

Version: 0.1.0 | Ratified: 2026-09-16 | Last Amended: 2026-09-16
```

Copia ese contenido a `.specify/memory/constitution.md` (o pídeselo a
`/speckit-constitution` guiándole con esos cuatro principios). A partir de
aquí, `/speckit-plan` tiene un `Constitution Check` real contra el que
evaluarse cuando amplíes el `GET /users`.

Comprobación final antes de seguir:

```bash
cat .specify/memory/constitution.md | head -5
# Debe mostrar el encabezado "# user-crud-modern — Constitution"
```

Ya puedes ejecutar `/speckit-specify` con el prompt de la sección
siguiente.

!!! tip "Si el paso falla"
    Si `speckit init` no está disponible en tu instalación, revisa la
    versión con `speckit --version` y consulta [Setup del entorno](../setup/index.md)
    para reinstalar. Como fallback, puedes crear la carpeta `.specify/memory/`
    a mano y depositar el `constitution.md` de arriba; el ciclo funciona
    igual.

## Prompt inicial para `/speckit-specify`

Este es el prompt que dispara el ciclo. Es intencionalmente descriptivo: no
prescribe solución, describe necesidad y restricciones.

```markdown
Amplía el endpoint GET /users del CRUD moderno para soportar búsqueda,
ordenación y paginación.

Query params:
- email: match exacto (opcional).
- nameContains: substring (opcional).
- createdAfter: fecha ISO-8601 (opcional).
- sort: campo,direccion (opcional; default a decidir).
- page: entero >= 0 (default 0).
- size: entero > 0 (default y máximo a decidir).

Respuesta: envelope { content, page, size, totalElements, totalPages }.
El endpoint sigue en GET /users (retro-compatible en URL/verbo); el shape
cambia de array plano a envelope y ese cambio se debe documentar.

Restricciones:
- Errores 4xx en formato ProblemDetail (RFC 7807), como el resto del CRUD.
- Tests con MockMvc; los tests existentes *_bugKnown del NPE no se tocan.
- Convenciones existentes de la app: records, sembrado runtime, H2 en memoria.

Fuera de alcance: autenticación, autorización, rate limiting, exportación,
notificaciones. Tampoco arreglar el NPE del POST /users (vive en su propio
ejercicio).
```

Después de pegar este prompt en `/speckit-specify`, Speckit genera un
`spec.md` con FR, SC, User Stories priorizadas, Edge Cases y Key Entities. Si
alguna decisión queda ambigua, Speckit puede lanzar hasta tres
`[NEEDS CLARIFICATION]` que resolverás en `/speckit-clarify`.

## Clarifications propuestas

Estas son las preguntas que `/speckit-clarify` debería surfacear sobre esta
spec, junto con la **respuesta recomendada oficial**, su **justificación** y
las **alternativas rechazadas**. Tú puedes divergir con criterio cuando
ejecutes en tu máquina; los defaults de aquí sirven como referencia canónica.

### Semántica entre filtros

**Pregunta**: ¿los filtros `email`, `nameContains` y `createdAfter` se combinan
con AND o con OR?

**Respuesta recomendada oficial**: **AND**.

**Justificación**: el usuario busca un subconjunto que cumpla todas las
condiciones a la vez ("usuarios cuyo email es X **y** cuyo nombre contiene Y").
Coincide con la semántica de las query strings de las UIs de administración
más comunes. Simplifica el contrato: un único `and` implícito, sin operador
booleano en la URL.

**Alternativas rechazadas**:

- OR entre filtros: aparece útil hasta que un consumidor lo combina con `size`
  pequeño y descubre que la paginación oscila. Además complica el índice.
- Operador explícito (`?operator=or`): añade superficie de contrato sin caso
  de negocio actual que lo pida.

### Sensibilidad a mayúsculas en `nameContains`

**Pregunta**: ¿`nameContains=an` debe encontrar `Ana`, `ana`, `Adrian`, o solo
un subconjunto?

**Respuesta recomendada oficial**: **case-insensitive** (los tres coinciden).

**Justificación**: el usuario final no piensa en mayúsculas al escribir un
nombre. Case-sensitive genera falsos negativos evidentes ("busco Ana y no
aparece porque escribí ana"). En SQL se implementa con `LOWER(name) LIKE
LOWER(?)` o el equivalente `ILIKE` en PostgreSQL.

**Alternativas rechazadas**:

- Case-sensitive: sorprende al usuario y penaliza la usabilidad.
- Parámetro configurable (`?caseSensitive=true`): complica el contrato, y en 6
  años nadie ha pedido lo contrario.

### Orden por defecto

**Pregunta**: si el cliente no pasa `sort`, ¿cómo se ordena la respuesta?

**Respuesta recomendada oficial**: `createdAt,desc` (usuarios más recientes
primero).

**Justificación**: es el orden más informativo por defecto en una UI de
administración; también estabiliza el comportamiento de la paginación (dos
llamadas consecutivas devuelven la misma primera página aunque llegue un alta
en medio, porque el nuevo elemento va arriba en la primera).

**Alternativas rechazadas**:

- Sin orden (aleatorio efectivo): rompe la paginación de forma sutil (misma
  página, resultados distintos).
- `id,asc`: legible pero sesga hacia usuarios antiguos, que suelen ser los
  menos interesantes en operaciones de administración.

### Tamaño máximo de página

**Pregunta**: ¿cuánto vale `size` por defecto y cuál es el máximo permitido?

**Respuesta recomendada oficial**: default `20`, máximo `100`. `size` fuera
de rango (`<1` o `>100`) devuelve `400 ProblemDetail`.

**Justificación**: 20 es un tamaño manejable en UI. 100 protege contra
degradación en peticiones que devuelven muchos usuarios sin necesidad. Rechazar
`size` inválido es más útil que "acotar silenciosamente" (evita
comportamientos que el cliente no puede explicar).

**Alternativas rechazadas**:

- Sin máximo: expone la BBDD a full scans triviales.
- Acotar silenciosamente a 100 sin error: el cliente cree que pidió 500 pero
  sólo cuenta 100 y no sabe por qué.

### Shape del envelope

**Pregunta**: ¿el envelope es propio (`{content, page, size, totalElements,
totalPages}`) o se serializa `Page<T>` de Spring Data directamente?

**Respuesta recomendada oficial**: **envelope propio** con los cinco campos.

**Justificación**: `Page<T>` serializado por defecto incluye media docena de
campos internos (`pageable.sort.sorted`, `first`, `last`, `empty`, `number`,
`numberOfElements`) que son ruido para el consumidor. Un envelope propio da
control sobre el contrato y facilita evolucionarlo sin acoplarse a
serialización de Spring.

**Alternativas rechazadas**:

- Serializar `Page<T>` directo: contrato inestable entre versiones de Spring;
  ruido en la respuesta.
- HAL/HATEOAS completo: sobreingeniería para esta API interna.

### Política con query params desconocidos

**Pregunta**: si el cliente manda `?foo=bar` (parámetro no reconocido), ¿se
ignora o se rechaza?

**Respuesta recomendada oficial**: **ignorar** (comportamiento por defecto de
Spring MVC).

**Justificación**: rechazar params desconocidos rompe cliente antiguos que
añaden tracking (`utm_*`, `_gl`) sin ser conscientes. Ignorar es la política
mayoritaria en APIs REST modernas.

**Alternativas rechazadas**:

- Rechazar con `400`: valida más estrictamente pero rompe integraciones sin
  aviso previo.
- Loggear un warning: útil como observabilidad, no bloquea el request. Se
  puede añadir después si aparece necesidad.

### `size=0` o `page` negativo

**Pregunta**: ¿qué pasa con `size=0` o `page=-1`?

**Respuesta recomendada oficial**: `400 ProblemDetail` con mensaje explícito
(`size must be >= 1`, `page must be >= 0`).

**Justificación**: valores fuera de rango son errores del cliente, no
"solicitudes vacías". Fallar rápido con mensaje claro evita respuestas
sorprendentes (¿`size=0` devuelve el envelope con `content: []` pero
`totalElements` real? ¿o array vacío? Ambiguo). Un `400` cierra el debate.

**Alternativas rechazadas**:

- `size=0` = "no me devuelvas contenido, sólo el total": interesante pero
  fuera de alcance de esta iteración; sería otro endpoint (`HEAD /users`
  o `GET /users/count`).
- Silenciar el error y devolver una página por defecto: el cliente cree que
  su request fue válido cuando no lo fue.

## Extracto de `plan.md`

Este es el bloque de decisiones técnicas que el plan debe registrar. Es un
extracto — el `plan.md` real incluye `Technical Context`, `Constitution
Check`, `Project Structure` y `Complexity Tracking`.

```markdown
## Decisiones técnicas

- **Persistencia**: Spring Data JPA + `Specification<User>` compuestas con
  `Specification.where(...).and(...)`. Se descarta `@Query` custom por filtro:
  crece pobremente al añadir criterios y duplica lógica.
- **Paginación y orden**: `Pageable` estándar de Spring Data
  (`PageRequest.of(page, size, Sort.by(...))`). Validación de `size` y `page`
  con `@Min` de Jakarta Validation en los parámetros del controller.
- **Envelope**: DTO `PagedUserResponse<T>` como record (por convención del
  proyecto). Mapeo explícito desde `Page<UserResponse>` en el controller;
  no se serializa `Page<T>` directamente.
- **Errores**: `@ControllerAdvice` existente extendido para mapear
  `ConstraintViolationException` (Jakarta Validation) y
  `PropertyReferenceException` (sort con campo inexistente) a
  `ProblemDetail` 400.
- **Contract-first**: `contracts/users-api.yaml` se actualiza en la spec 005
  con los nuevos query params y `PagedUserResponse`. La implementación se
  valida contra el contract con `springdoc-openapi`.
- **Test strategy**: matriz con MockMvc que cubre (a) cada filtro por
  separado, (b) combinaciones AND, (c) paginación (primera página, página
  intermedia, última página, página fuera de rango), (d) orden por defecto,
  (e) sort custom, (f) errores 400 por `size`/`page`/`sort` inválidos.
- **No se toca**: `POST /users` y sus tests `*_bugKnown` (bug NPE
  documentado, resolución fuera del alcance de esta spec).
```

## Extracto de `tasks.md`

Descomposición típica del caso guía (6 tareas críticas + un par de tests +
polish). El `tasks.md` real añadiría fases `Setup` y `Foundational` si
aplicaran; en un brownfield con infra ya montada suelen quedar cortas o vacías.

```markdown
## Phase 3: User Story 1 — Envelope y filtros AND (P1) MVP

- [ ] T010 [P] [US1] Crear record PagedUserResponse<T> en
      src/main/java/com/example/users/api/PagedUserResponse.java
- [ ] T011 [P] [US1] Crear record UserSearchCriteria(email, nameContains,
      createdAfter) en src/main/java/com/example/users/api/UserSearchCriteria.java
- [ ] T012 [US1] Crear UserSpecifications con métodos estáticos hasEmail,
      nameContainsIgnoreCase, createdAfter en
      src/main/java/com/example/users/repo/UserSpecifications.java (depende T011)
- [ ] T013 [US1] Ampliar UserRepository extends JpaRepository, JpaSpecificationExecutor
      en src/main/java/com/example/users/repo/UserRepository.java
- [ ] T014 [US1] Ampliar UserController.list(@Valid criteria, @Valid Pageable) para
      devolver PagedUserResponse en
      src/main/java/com/example/users/api/UserController.java (depende T010, T012, T013)
- [ ] T015 [US1] Ampliar GlobalExceptionHandler para mapear
      ConstraintViolationException y PropertyReferenceException a ProblemDetail 400
      en src/main/java/com/example/users/api/GlobalExceptionHandler.java

## Phase 4: Tests

- [ ] T016 [P] [US1] Test matriz filtros AND en
      src/test/java/com/example/users/api/UserControllerListTest.java
- [ ] T017 [P] [US1] Test paginación (primera/intermedia/última/fuera de rango) en
      src/test/java/com/example/users/api/UserControllerPageTest.java
- [ ] T018 [P] [US1] Test errores 400 (size, page, sort inválidos) en
      src/test/java/com/example/users/api/UserControllerErrorsTest.java

## Phase 5: Polish

- [ ] T019 Actualizar contracts/users-api.yaml con nuevos query params y schema
      PagedUserResponse
- [ ] T020 Actualizar docs/app-ejemplo/index.md con la nueva capacidad
```

## Extracto del contract

Fragmento de `contracts/users-api.yaml` tras la ampliación. El OpenAPI real
incluiría también `parameters` y `responses` completos.

```yaml
paths:
  /users:
    get:
      summary: Listar usuarios con filtros, orden y paginación
      parameters:
        - name: email
          in: query
          required: false
          schema: { type: string, format: email }
        - name: nameContains
          in: query
          required: false
          schema: { type: string, minLength: 1, maxLength: 100 }
        - name: createdAfter
          in: query
          required: false
          schema: { type: string, format: date-time }
        - name: sort
          in: query
          required: false
          schema:
            type: string
            example: "createdAt,desc"
            default: "createdAt,desc"
        - name: page
          in: query
          required: false
          schema: { type: integer, minimum: 0, default: 0 }
        - name: size
          in: query
          required: false
          schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
      responses:
        "200":
          description: Página de usuarios
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/PagedUserResponse"
        "400":
          description: Parámetros inválidos
          content:
            application/problem+json:
              schema:
                $ref: "#/components/schemas/ProblemDetail"

components:
  schemas:
    PagedUserResponse:
      type: object
      required: [content, page, size, totalElements, totalPages]
      properties:
        content:
          type: array
          items: { $ref: "#/components/schemas/UserResponse" }
        page: { type: integer, minimum: 0 }
        size: { type: integer, minimum: 1 }
        totalElements: { type: integer, minimum: 0 }
        totalPages: { type: integer, minimum: 0 }
```

## Salida esperada de `/speckit-implement`

Cuando ejecutes `/speckit-implement` sobre el `tasks.md` completo, Claude
Code irá reportando progreso por fase. Salida típica (recortada):

```text
Phase 1 Setup: 0/0 (brownfield, sin setup)
Phase 2 Foundational: 0/0 (infra existente cubre)
Phase 3 US1 (MVP): 6/6 completed
  ✓ T010 PagedUserResponse.java
  ✓ T011 UserSearchCriteria.java
  ✓ T012 UserSpecifications.java
  ✓ T013 UserRepository amplation
  ✓ T014 UserController.list refactor
  ✓ T015 GlobalExceptionHandler mapping

Phase 4 Tests: 3/3 completed
  ✓ T016 UserControllerListTest (7 tests)
  ✓ T017 UserControllerPageTest (5 tests)
  ✓ T018 UserControllerErrorsTest (4 tests)

Phase 5 Polish: 2/2 completed
  ✓ T019 users-api.yaml updated (envelope + params)
  ✓ T020 docs/app-ejemplo/index.md updated

Build validation:
$ ./mvnw -q test
Tests run: 42, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS

Note: existing tests *_bugKnown remain untouched (NPE en POST /users
sigue documentado como bug intencional).
```

## Verificación

Tras `/speckit-implement`, verifica manualmente en tu máquina:

### 1. Tests en verde

```bash
cd examples/user-crud-modern
./mvnw -q test
```

Esperado: `BUILD SUCCESS`, 0 failures, 0 errors. Los tests
`*_bugKnown` del NPE siguen documentando el bug intencional (no se han
tocado).

### 2. Endpoint responde con envelope

Arranca la app en un terminal:

```bash
./mvnw -q spring-boot:run
```

En otro terminal, prueba los filtros:

```bash
curl -s "http://localhost:8080/users" | jq
curl -s "http://localhost:8080/users?nameContains=an&page=0&size=5" | jq
curl -s "http://localhost:8080/users?email=ada@example.com" | jq
curl -s "http://localhost:8080/users?sort=email,asc&size=3" | jq
```

Respuesta esperada (recortada):

```json
{
  "content": [
    { "id": "3f...", "email": "ada@example.com", "name": "Ada", "createdAt": "..." }
  ],
  "page": 0,
  "size": 5,
  "totalElements": 1,
  "totalPages": 1
}
```

### 3. Errores 400 conformes a ProblemDetail

```bash
curl -s -i "http://localhost:8080/users?size=0"
curl -s -i "http://localhost:8080/users?page=-1"
curl -s -i "http://localhost:8080/users?sort=noSuchField,asc"
```

Esperado: `HTTP/1.1 400`, `Content-Type: application/problem+json`,
cuerpo con `type`, `title`, `status`, `detail`.

### 4. Contract actualizado

Abre `http://localhost:8080/swagger-ui.html` (o el path configurado). Verifica
que `GET /users` muestra los nuevos query params y que el response schema es
`PagedUserResponse`.

## Enlaces relacionados

- [Flujo Speckit paso a paso](flujo.md) — referencia de cada comando.
- [Brownfield](brownfield.md) — este caso guía como ejemplo brownfield puro.
- [Antipatrones](antipatrones.md) — errores frecuentes al ejecutar este ciclo.
- [Setup del entorno](../setup/index.md) — instalación previa.
- [App de ejemplo](../app-ejemplo/index.md) — arquitectura y estado actual del CRUD.

!!! info "Versión de referencia"

    - **Speckit**: 1.0.4
    - **Claude Code**: 2.x (LTS actual)
    - **JDK**: 21 (Temurin, vía SDKMAN)
    - **Maven**: 3.9.x
    - **Spring Boot**: 4.0.x
    - **Verificado**: 2026-09-16
