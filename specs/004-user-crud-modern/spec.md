# Feature Specification: Aplicación de ejemplo `user-crud-modern` con bug NPE intencionado

**Feature Branch**: `004-user-crud-modern`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "App de ejemplo Spring Boot 4 + bug NPE — CRUD de usuarios sobre H2 en memoria con Spring Boot 4 y Java 21; bug reproducible intencionado (NPE al crear usuario) usado como caso de estudio para depuración asistida por Claude. Incluye `.sdkmanrc`, `README.md`, tests JUnit 5 y documentación asociada en `docs/app-ejemplo/`."

## Clarifications

### Session 2026-09-16

- Q: ¿Qué variante concreta de bug realista provoca el NPE en `POST /users`? → A: Mapper DTO→Entity manual que omite la asignación de `email` (línea `entity.setEmail(dto.email())` olvidada); una capa posterior invoca `user.getEmail().toLowerCase()` durante la normalización previa a persistir, y ahí se lanza el `NullPointerException`. Causa raíz en el mapper; síntoma en la normalización.
- Q: ¿El test que reproduce el NPE queda rojo bloqueante en CI, verde mediante `assertThrows`, `@Disabled`, o combinación? → A: Verde mediante `assertThrows(NullPointerException.class, ...)` con nombre explícito `..._bugKnown` y comentario que remite a `BUG.md`. Cuando el módulo de debugging aplique el fix, ese test se reescribe a happy path. La suite del ejemplo permanece siempre verde para no bloquear el pipeline.
- Q: ¿Qué validaciones Jakarta aplica el DTO de entrada en `POST /users`? → A: `@NotBlank` en `name` (con `@Size(max=100)`) y en `email` (con `@Size(max=200)`), más `@Email` en `email`. La validación pasa con payloads sintácticamente válidos, y el bug se dispara después, en el mapper y la etapa de normalización.
- Q: ¿Cómo responde `POST /users` a un email duplicado? → A: Constraint `UNIQUE` a nivel de BD sobre `email` + `@ExceptionHandler` que traduce la violación a `HTTP 409 Conflict` con cuerpo `application/problem+json` (RFC 7807, `ProblemDetail` de Spring) enriquecido con propiedad extra `code:"EMAIL_ALREADY_EXISTS"`. Sin pre-consulta `existsByEmail`. Estrategia "constraint + handler", no "check-then-insert".
- Q: ¿Qué shape usa la API para errores? → A: RFC 7807 vía `org.springframework.http.ProblemDetail` (Spring 6 / Boot 4). Campos estándar `type`, `title`, `status`, `detail`, `instance`; más dos propiedades extra propias (`code` estable como enum, y `fieldErrors` sólo en validación). Sin clases custom tipo `ApiError`. Los handlers de `MethodArgumentNotValidException` reutilizan `ResponseEntityExceptionHandler` de Spring para la integración automática.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Alumno reproduce el bug NPE en creación de usuario (Priority: P1)

Un alumno de la formación clona el repositorio, entra en `examples/user-crud-modern/`, activa las versiones de JDK/Maven declaradas, arranca la aplicación y lanza una petición `POST /users` con `name` y `email` válidos. La respuesta es un error 500 con un stacktrace que contiene `NullPointerException`. El alumno puede verificar el fallo de forma repetible siguiendo únicamente los pasos del `README.md` y la página "Reproducir el bug" del sitio.

**Why this priority**: es el caso de estudio que sostiene todo el módulo de "Depuración asistida por Claude". Sin bug reproducible, el módulo no existe.

**Independent Test**: seguir los pasos de arranque documentados, ejecutar el `curl` de creación de usuario y confirmar el 500 + traza con `NullPointerException`. Delivers la experiencia de "veo el fallo real" imprescindible para la clase.

**Acceptance Scenarios**:

1. **Given** el alumno tiene `sdk` instalado y usa las versiones declaradas en `.sdkmanrc`, **When** ejecuta el comando de arranque documentado en el `README.md`, **Then** la aplicación levanta en menos de 30 segundos y expone los endpoints del CRUD sin errores en el log de arranque.
2. **Given** la aplicación está arrancada, **When** el alumno envía `POST /users` con un cuerpo que incluye `name` y `email` sintácticamente válidos, **Then** recibe un HTTP 500 y el log muestra un `NullPointerException` en la ruta de creación.
3. **Given** el alumno repite el paso anterior varias veces con distintos payloads válidos, **Then** el fallo se reproduce siempre (comportamiento determinista, no intermitente).
4. **Given** el alumno consulta la página "Reproducir el bug" en el sitio de docs, **Then** encuentra el comando exacto usado y el fragmento representativo del stacktrace esperado, incluyendo la referencia al método donde estalla el NPE (etapa de normalización sobre el email).

---

### User Story 2 - Formador dispone del origen del bug documentado en `BUG.md` (Priority: P1)

El formador que imparte la sesión necesita conocer la causa raíz exacta del bug antes de la clase, para guiar la sesión de depuración, anticipar preguntas y validar que la solución propuesta por Claude durante el ejercicio es correcta. La causa raíz vive en un archivo `BUG.md` dentro de `examples/user-crud-modern/`, no enlazado desde el sitio público del alumno, pero presente en el repositorio.

**Why this priority**: sin `BUG.md`, la sesión no es reproducible por otro formador y depende del autor original.

**Independent Test**: un formador que no ha visto el ejercicio abre `examples/user-crud-modern/BUG.md` y en menos de 5 minutos entiende (a) dónde está el bug en el código, (b) por qué provoca NPE, (c) cuál es el fix esperado.

**Acceptance Scenarios**:

1. **Given** el repositorio recién clonado, **When** el formador abre `examples/user-crud-modern/BUG.md`, **Then** encuentra: descripción del síntoma, ruta al fichero y método concreto donde está la causa, explicación de por qué produce NPE, fix esperado en 1–3 líneas y comando de validación del fix.
2. **Given** `docs/app-ejemplo/` (sitio del alumno), **When** el formador o el alumno lo navega, **Then** `BUG.md` no aparece enlazado ni indexado desde ninguna página pública.

---

### User Story 3 - Alumno prueba el resto de endpoints del CRUD (Priority: P2)

Con la aplicación arrancada, el alumno usa los endpoints `GET /users`, `GET /users/{id}`, `PUT /users/{id}` y `DELETE /users/{id}` siguiendo ejemplos `curl`/`httpie` del `README.md` para tener contexto completo de la aplicación antes de abordar el bug. Estos endpoints funcionan correctamente (happy path verde) para poder aislar mentalmente el bug al flujo de creación.

**Why this priority**: refuerza que el bug está localizado y no es "todo está roto". Facilita el ejercicio de depuración por contraste.

**Independent Test**: crear un usuario "a mano" en la base H2 (o vía el fix temporal del formador), luego listar, obtener por id, actualizar y borrar. Cada operación devuelve el código HTTP esperado y payload coherente.

**Acceptance Scenarios**:

1. **Given** existe al menos un usuario en la base, **When** el alumno ejecuta `GET /users`, **Then** recibe HTTP 200 y una colección JSON con ese usuario.
2. **Given** existe un usuario con id conocido, **When** ejecuta `GET /users/{id}`, `PUT /users/{id}` o `DELETE /users/{id}`, **Then** recibe respectivamente HTTP 200 (con el recurso), HTTP 200 (con el recurso actualizado) y HTTP 204.
3. **Given** un id inexistente, **When** el alumno ejecuta cualquiera de esos tres endpoints, **Then** recibe HTTP 404 con un cuerpo de error consistente.

---

### User Story 4 - Alumno recorre las páginas del sitio dedicadas a la aplicación de ejemplo (Priority: P2)

Antes o durante la clase, el alumno abre en el sitio MkDocs la sección `docs/app-ejemplo/` y encuentra cuatro contenidos completos: presentación y arquitectura de la app, cómo levantarla, "Reproducir el bug" y "Depurando con Claude" (guion de sesión con Claude Code + buenas y malas prácticas para arreglar el bug). No hay placeholders: las cuatro páginas están redactadas y son autosuficientes. La navegación del sitio incluye la nueva sección sin romper el `mkdocs build --strict`. La página "Depurando con Claude" NEVER debe depender del módulo SDD, que es un módulo independiente.

**Why this priority**: sin las páginas, la app no está anclada al material formativo y queda huérfana.

**Independent Test**: navegar al sitio local (`uv run mkdocs serve`) y visitar cada una de las páginas de `app-ejemplo/`. Comprobar que enlazan correctamente entre sí y que la sección aparece en la navegación principal.

**Acceptance Scenarios**:

1. **Given** el sitio arrancado, **When** el alumno consulta la navegación, **Then** ve una sección "App de ejemplo" con al menos tres entradas.
2. **Given** la página de arquitectura, **When** el alumno la lee, **Then** entiende qué endpoints existen, qué persistencia usa y por qué es un ejemplo doblemente útil (aprender CRUD moderno + practicar depuración).
3. **Given** la página "Depurando con Claude", **When** el alumno la abre, **Then** encuentra contenido completo: prerrequisitos, guion paso a paso de la sesión con Claude Code (reproducir → capturar → guiar diagnóstico → causa raíz → fix mínimo → verificación con la suite → confirmación con `curl`), ejemplos de prompts efectivos y prompts pobres, listado explícito de buenas y malas prácticas, y una tabla-resumen con duraciones esperadas por fase. La página NEVER referencia el módulo SDD como dependencia.
4. **Given** cualquier cambio en `docs/app-ejemplo/`, **When** se ejecuta `uv run mkdocs build --strict`, **Then** termina sin warnings.

---

### User Story 5 - Tests automatizados evidencian el estado esperado del código (Priority: P2)

El repositorio incluye tests JUnit 5 dentro del propio ejemplo. Al ejecutar la suite, los tests de happy path de los endpoints `GET`, `PUT`, `DELETE` (y los estados iniciales) pasan en verde, mientras que existe al menos un test que reproduce el NPE en `POST /users` con `email` informado y queda en rojo (fallo esperado). Este test rojo es la firma automática del bug.

**Why this priority**: sin test rojo, no hay confirmación automatizada de que el bug sigue vivo entre commits; ni forma limpia de validar el fix cuando llegue el módulo de debugging.

**Independent Test**: ejecutar la suite con Maven; verificar que los tests verdes son verdes y que existe exactamente el fallo documentado en el test de creación.

**Acceptance Scenarios**:

1. **Given** el proyecto compila, **When** se ejecuta la suite de tests, **Then** todos los tests terminan en verde, incluidos los happy path de `GET`/`PUT`/`DELETE` y el test del bug conocido.
2. **Given** el test del bug conocido (`assertThrows` sobre el `NullPointerException` en la creación), **When** se ejecuta aisladamente, **Then** pasa en verde y su nombre / comentario dejan claro que documenta un bug reproducible.
3. **Given** un futuro commit que resuelva el bug (fuera del alcance de esta feature), **When** se reescriba ese test a happy path (`POST /users` → `201 Created`), **Then** también pasa en verde. La reescritura queda fuera del alcance de esta feature.

---

### Edge Cases

- **Payload `POST /users` con `email` ausente, vacío o con formato inválido**: la validación declarada por la aplicación (`@NotBlank` + `@Email` + `@Size(max=200)`) MUST rechazarlo con HTTP 400 antes de que se llegue a la ruta afectada por el bug. El caso de estudio se centra en payloads sintácticamente válidos donde el NPE es sorprendente.
- **Payload `POST /users` con `name` ausente, vacío o excediendo 100 caracteres**: la validación (`@NotBlank` + `@Size(max=100)`) MUST rechazarlo con HTTP 400.
- **Payload `POST /users` con `email` duplicado**: la unicidad se declara mediante constraint `UNIQUE` en la BD y un `@ExceptionHandler` la traduce a `HTTP 409 Conflict`. Sin embargo, en el estado con bug el `NullPointerException` del mapper se dispara antes de que el `INSERT` llegue a la BD, por lo que el cliente ve `HTTP 500` (no `409`) incluso con emails duplicados. Este comportamiento es consecuencia natural del bug y NEVER MUST corregirse en esta feature; el `409` volverá a ser visible cuando el módulo de debugging aplique el fix.
- **Reinicio de la aplicación**: al usar H2 en memoria, los usuarios creados manualmente (por ejemplo desde la consola H2 para probar `GET`/`PUT`/`DELETE`) desaparecen tras el reinicio. Documentado en la página de arranque.
- **Ejecución sin `sdk env`**: si el alumno arranca con un JDK distinto al declarado, puede obtener errores de compilación o de arranque; el `README.md` avisa explícitamente y prescribe el comando.
- **Ejecución en Windows sin SDKMAN**: fuera del alcance de esta feature; se documenta como limitación conocida y se remite al módulo Setup del entorno.

## Requirements *(mandatory)*

### Functional Requirements

**Aplicación**

- **FR-001**: La aplicación de ejemplo MUST vivir en `examples/user-crud-modern/` con estructura Maven estándar.
- **FR-002**: La aplicación MUST estar construida sobre Spring Boot 4.0.x y Java 21, usando Maven como gestor de build.
- **FR-003**: La aplicación MUST exponer los cinco endpoints REST: `POST /users`, `GET /users`, `GET /users/{id}`, `PUT /users/{id}`, `DELETE /users/{id}`.
- **FR-004**: La entidad `User` MUST tener los campos `id` (identificador numérico autogenerado), `name` (obligatorio, no nulo), `email` (obligatorio, no nulo, único a nivel de base de datos mediante constraint `UNIQUE`) y `createdAt` (marca temporal instantánea establecida por el sistema en la creación).
- **FR-005**: La persistencia MUST ser H2 en memoria mediante Spring Data JPA; no MUST requerir configuración externa de base de datos.
- **FR-006**: La aplicación MUST aplicar validación de entrada mediante Jakarta Validation en el DTO de `POST /users` (y en el de `PUT /users/{id}` cuando aplique) con las siguientes reglas: `name` MUST llevar `@NotBlank` y `@Size(max=100)`; `email` MUST llevar `@NotBlank`, `@Size(max=200)` y `@Email`. El endpoint MUST rechazar con HTTP 400 cualquier payload que incumpla estas reglas antes de invocar el flujo de creación (y por tanto antes de ejercitar el bug del mapper).
- **FR-007**: La aplicación MUST exponer OpenAPI / Swagger UI accesible en desarrollo, con la ruta y el perfil documentados en el `README.md`.

**Bug intencionado**

- **FR-008**: La aplicación MUST contener un bug reproducible que, al invocar `POST /users` con un payload que incluye `email` sintácticamente válido, provoque un `NullPointerException` en el flujo de creación y devuelva HTTP 500. La causa raíz MUST ser un mapper DTO→Entity manual que omite la asignación del campo `email` (es decir, falta la línea equivalente a `entity.setEmail(dto.email())`), combinado con una etapa posterior en el flujo de creación que invoca un método sobre `user.getEmail()` (por ejemplo `toLowerCase()` para normalizar el email antes de persistir), lo que hace estallar el `NullPointerException` en esa etapa aunque el payload traía el email correctamente. El bug NEVER MUST ser un `throw new NullPointerException()` sintético.
- **FR-009**: El resto de endpoints (`GET`, `PUT`, `DELETE`) MUST funcionar en su happy path sin verse afectados por el bug.
- **FR-009a**: La aplicación MUST incluir un `@ExceptionHandler` (en un `@RestControllerAdvice` que MUST extender `ResponseEntityExceptionHandler` de Spring) que traduzca la violación de constraint `UNIQUE` sobre `email` en `HTTP 409 Conflict` con cuerpo `application/problem+json` (RFC 7807, `org.springframework.http.ProblemDetail`) enriquecido con la propiedad extra `code:"EMAIL_ALREADY_EXISTS"` (via `body.setProperty(...)`). NEVER MUST realizarse una pre-consulta tipo `existsByEmail` antes del insert; la unicidad se apoya únicamente en la constraint de BD.
- **FR-009b**: El mismo `@RestControllerAdvice` MUST traducir errores de validación Jakarta (`MethodArgumentNotValidException`) a `HTTP 400 Bad Request` con `ProblemDetail` enriquecido con `code:"VALIDATION_ERROR"` y `fieldErrors` (lista de `{field, message}`), y los recursos inexistentes en `GET/PUT/DELETE /users/{id}` a `HTTP 404 Not Found` con `ProblemDetail` enriquecido con `code:"USER_NOT_FOUND"`. NEVER MUST introducir clases custom tipo `ApiError`: el shape RFC 7807 de Spring es suficiente y estándar.
- **FR-010**: La causa raíz del bug, el fichero afectado (mapper DTO→Entity), el método concreto que omite la asignación del `email`, la ubicación del punto donde estalla el NPE (la normalización sobre `user.getEmail()`), la explicación del mecanismo y el fix esperado (añadir la línea de asignación del `email` en el mapper, 1–3 líneas) MUST estar documentados en `examples/user-crud-modern/BUG.md`.
- **FR-011**: `BUG.md` NEVER MUST estar enlazado ni indexado desde el sitio MkDocs del alumno; permanece únicamente en el repositorio para uso del formador.

**Reproducibilidad**

- **FR-012**: `examples/user-crud-modern/` MUST incluir un `.sdkmanrc` que fije JDK 21 (variante Temurin disponible en SDKMAN, referencia `21.0.4-tem`) y Maven en la última minor estable de la línea 3.9.x, respetando la puerta de re-verificación semestral definida por la constitution.
- **FR-013**: `examples/user-crud-modern/README.md` MUST explicar los pasos exactos para: (a) activar el toolchain con `sdk env`, (b) arrancar la aplicación (por ejemplo `./mvnw spring-boot:run`), (c) ejecutar ejemplos de invocación de cada endpoint mediante `curl` o `httpie`, (d) ejecutar la suite de tests.

**Tests**

- **FR-014**: El proyecto MUST incluir tests JUnit 5 que cubran el happy path de `GET /users`, `GET /users/{id}`, `PUT /users/{id}` y `DELETE /users/{id}`, y esos tests MUST pasar en verde.
- **FR-015**: El proyecto MUST incluir al menos un test que ejercite `POST /users` con `email` informado y sirva de evidencia automatizada del NPE actual. Ese test MUST estar implementado como `assertThrows(NullPointerException.class, ...)` (o equivalente) sobre el flujo de creación, con nombre explícito que indique que documenta un bug conocido (por ejemplo `createUser_currentlyThrowsNPE_bugKnown`) y comentario que enlace a `BUG.md`. En el estado con bug MUST pasar en verde; cuando el módulo de debugging aplique el fix, ese test MUST reescribirse a happy path (fuera del alcance de esta feature). La suite completa del ejemplo MUST quedar en verde en esta feature.

**Documentación en el sitio**

- **FR-016**: `docs/app-ejemplo/` MUST contener tres páginas, todas con contenido completo (sin placeholders): (a) presentación + arquitectura + cómo arrancar la aplicación; (b) "Reproducir el bug" con pasos exactos y stacktrace esperado representativo; (c) "Depurando con Claude" con guion completo de la sesión (prerrequisitos, pasos 1..7, prompts efectivos y pobres, fix esperado con snippet, verificación con la suite, reescritura de tests `*_bugKnown`) y con secciones explícitas de buenas y malas prácticas. La página (c) NEVER MUST depender del módulo SDD; MUST ser autosuficiente dentro de la sección "App de ejemplo".
- **FR-017**: La sección "App de ejemplo" MUST estar integrada en la navegación de `mkdocs.yml`.
- **FR-018**: Cualquier cambio introducido en `docs/` para esta feature MUST superar `uv run mkdocs build --strict` sin warnings.
- **FR-019**: La aplicación y su documentación NEVER MUST commitear credenciales reales; H2 en memoria y sin secretos.

**Alcance**

- **FR-020**: Esta feature NEVER MUST modificar el código de la aplicación legacy (aún no existente), NEVER MUST crear agentes ni skills sobre la aplicación (specs futuras), y NEVER MUST aplicar el fix del bug (se hará en el módulo de debugging).

### Key Entities *(include if feature involves data)*

- **User**: representa a un usuario del CRUD. Atributos: identificador numérico autogenerado, nombre (obligatorio), email (obligatorio y único a nivel de dominio) y marca temporal de creación asignada por el sistema. No hay relaciones con otras entidades en esta feature.
- **BUG.md**: artefacto documental interno para el formador. Contiene la descripción del síntoma, la localización de la causa raíz, la explicación del mecanismo del NPE, el fix esperado y el comando de validación. No es una entidad del dominio pero sí un artefacto obligatorio del entregable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un alumno que sigue únicamente el `README.md` puede tener la aplicación arrancada y el primer 500 con NPE en menos de 10 minutos desde el clonado del repositorio.
- **SC-002**: El bug se reproduce en el 100% de los intentos de `POST /users` con `name` y `email` sintácticamente válidos; NEVER es intermitente.
- **SC-003**: El resto de endpoints (`GET`, `PUT`, `DELETE`) funcionan correctamente al menos en el 100% de las peticiones válidas usadas en los tests y ejemplos del `README.md`.
- **SC-004**: Un formador que abre `BUG.md` por primera vez entiende causa raíz, mecanismo y fix esperado en menos de 5 minutos, sin consultar el código.
- **SC-005**: La suite de tests deja evidencia clara del bug sin dejar la suite en rojo: happy path de `GET`/`PUT`/`DELETE` en verde, y test del bug también en verde afirmando explícitamente el lanzamiento del `NullPointerException` (con nombre y comentario que lo identifican como fallo conocido). El 100% de la suite pasa en cada ejecución mientras el bug exista.
- **SC-006**: `uv run mkdocs build --strict` termina sin warnings tras integrar las nuevas páginas.
- **SC-007**: La formación puede sostener el módulo de "Depuración asistida por Claude" con esta app como único caso de estudio, sin necesidad de material adicional.

## Assumptions

- Los alumnos tienen SDKMAN operativo y una versión reciente de Bash o Zsh, siguiendo el módulo Setup del entorno.
- La versión `21.0.4-tem` de JDK sigue disponible en SDKMAN en el momento de ejecutar la formación; si no lo estuviera, se sustituye por la LTS Temurin más cercana disponible y se actualiza el `.sdkmanrc` y la fecha de verificación en `docs/setup/*.md`.
- La versión "3.9.x" de Maven se interpreta como la última minor estable de esa línea en SDKMAN en el momento de crear el ejemplo.
- La aplicación se ejecuta en `localhost` con puerto por defecto de Spring Boot; no se requiere configuración de red adicional.
- Los ejemplos de invocación en el `README.md` se ofrecen con `curl` y opcionalmente `httpie`; se asume que el alumno tiene al menos uno instalado (parte del módulo Setup).
- Windows sin SDKMAN queda fuera de alcance para esta feature; la constitución prescribe SDKMAN y la documentación remite al módulo Setup.
- La página "Depurando con Claude" se entrega completa en esta feature (guion de la sesión + prácticas). El fix real del bug queda fuera del alcance del CÓDIGO de esta feature (los tests `*_bugKnown` siguen en verde afirmando la excepción); la página describe cómo aplicar el fix cuando corresponda. El módulo SDD con Speckit es independiente y no se ocupa de este bug.
- La aplicación legacy y los agentes/skills sobre esta aplicación se abordan en specs futuras y no se anticipan aquí más allá de dejar la estructura del repositorio limpia para su llegada.
