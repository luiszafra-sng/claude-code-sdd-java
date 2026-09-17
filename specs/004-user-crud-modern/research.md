# Phase 0 Research: `user-crud-modern`

Consolida decisiones de investigación previas a la fase de diseño. Cada entrada resuelve una incógnita del `plan.md` (Technical Context) o de la spec, o fija una práctica recomendada para el stack elegido.

## R-001 — Versión exacta de Spring Boot 4.0.x

- **Decision**: Spring Boot **`4.0.8`** (última patch estable de la línea `4.0.x` a 2026-09-16, publicada 2026-08-21 según `https://api.github.com/repos/spring-projects/spring-boot/releases`). Pin exacto en `pom.xml`; el valor se documenta en la página `docs/app-ejemplo/index.md` con bloque "versión + fecha de verificación" (norma semestral de la constitución). Si al ejecutar T005 hay una `4.0.9+` disponible, usarla y actualizar la fecha.
- **Rationale**: La constitución exige toolchain reproducible con versiones verificables. `4.0.x` está publicado desde finales de 2025; a septiembre de 2026 hay 8 patch releases. Fijar `4.0.8` evita CVEs conocidos, mantiene compatibilidad con Java 21 y no salta a la línea `4.1.x` (más reciente pero fuera del baseline pactado por la constitución para esta feature).
- **Alternatives considered**:
  - `3.5.x` — descartado: la constitución (Principio II) fija Spring Boot 4 como baseline moderno.
  - `4.1.x` — descartado: baseline pactado para esta feature es `4.0.x`; migrar a `4.1.x` cambiaría R-002 (springdoc `3.1.x` en lugar de `3.0.x`).
  - Versión hito (`4.2.0-M1`) — descartado: milestone no reproducible.

## R-002 — Compatibilidad `springdoc-openapi` con Spring Boot 4

- **Decision**: `springdoc-openapi-starter-webmvc-ui` **`3.0.3`** (publicada 2026-04-11; última de la línea `3.0.x`, alineada con Spring Boot `4.0.5`). Compatible con `4.0.6..4.0.8` (patch releases del starter web no rompen contrato con springdoc). Verificado contra `https://api.github.com/repos/springdoc/springdoc-openapi/releases` a 2026-09-16.
- **Rationale**: springdoc mantiene dos líneas activas — `2.x` para Spring Boot `3.x`, `3.x` para Spring Boot `4.x`. Dentro de `3.x`: `3.0.x` sigue la línea SB `4.0.x`; `3.1.x` sigue SB `4.1.x`. Coincidir línea de springdoc con línea de SB minimiza sorpresas.
- **Fallback (si `3.0.3` falla contra `4.0.8`)**: bajar temporalmente SB a `4.0.5` (patch compatible garantizado), o servir sólo el JSON `/v3/api-docs` sin Swagger UI activando `springdoc.swagger-ui.enabled=false`.
- **Alternatives considered**:
  - `3.1.1` — descartado: exige SB `4.1.x`, fuera del baseline pactado en R-001.
  - `springfox` — descartado: proyecto sin mantenimiento, no soporta Spring 6/Jakarta.
  - Escribir OpenAPI YAML a mano — descartado: mantenimiento manual, se aleja del ejemplo real.

## R-003 — Perfil de activación de Swagger UI

- **Decision**: Dejar Swagger UI **siempre disponible** (`springdoc.swagger-ui.enabled=true`) porque la aplicación sólo se ejecuta en aula/local con H2 en memoria; no hay riesgo de exposición pública. La página de arranque explica cómo abrir Swagger UI (`/swagger-ui/index.html`).
- **Rationale**: Un perfil `dev` añade fricción didáctica sin aportar seguridad real en un ejemplo local. La constitución no exige perfiles.
- **Alternatives considered**:
  - Sólo perfil `dev` — descartado: el alumno tendría que aprender de perfiles Spring antes de tocar el CRUD, ruido para el objetivo de la clase.

## R-004 — Estrategia de mapping DTO ↔ Entity

- **Decision**: Mapper **manual** (`UserMapper` como `@Component` o clase estática), escrito a mano. En `toEntity(CreateUserRequest)` se omite intencionalmente `entity.setEmail(dto.email());` para producir el bug.
- **Rationale**: MapStruct o ModelMapper ocultarían el bug detrás de generación de código y harían el ejercicio ilegible para el alumno. El objetivo pedagógico exige un mapper trivial y auditable a simple vista.
- **Alternatives considered**:
  - MapStruct — descartado: el bug sería una anotación mal configurada, poco realista y difícil de leer.
  - Records con `toEntity()` estático en el DTO — descartado: acopla DTO a Entity y complica la lectura del bug.

## R-005 — Punto donde estalla el NPE

- **Decision**: `UserService.create(CreateUserRequest)` invoca al mapper, obtiene un `User` sin `email`, y a continuación ejecuta una etapa de **normalización** que hace `user.setEmail(user.getEmail().toLowerCase(Locale.ROOT));` antes de `userRepository.save(user)`. El NPE estalla en esa línea. La traza señala `UserService.normalizeEmail(...)` o similar; la causa raíz vive en `UserMapper.toEntity(...)`.
- **Rationale**: Separa síntoma (normalización) de causa (mapper) por un salto de stack, lo que hace el ejercicio de depuración pedagógicamente valioso. Coincide con el patrón real "olvido de línea en un mapper manual".
- **Alternatives considered**:
  - NPE en `save()` directo — descartado: la traza apuntaría a Hibernate/JPA, menos didáctico.
  - NPE en el controller — descartado: demasiado obvio.

## R-006 — Estrategia de manejo de errores

- **Decision**: `@RestControllerAdvice` (`GlobalExceptionHandler`) que **extiende `ResponseEntityExceptionHandler`** y devuelve `ProblemDetail` (RFC 7807, `application/problem+json`) en lugar de una clase custom. Handlers concretos:
  - `handleMethodArgumentNotValid(...)` (override) → `HTTP 400` + `ProblemDetail{title:"Validation Error", detail:"El cuerpo…", code:"VALIDATION_ERROR", fieldErrors:[{field,message}]}`.
  - `@ExceptionHandler(DataIntegrityViolationException.class)` → `HTTP 409` + `ProblemDetail{title:"Email Already Exists", detail:"El email indicado ya está registrado.", code:"EMAIL_ALREADY_EXISTS"}`. Supuesto: la única constraint UNIQUE del modelo es `users.email`, documentado en comentario del handler.
  - `@ExceptionHandler(UserNotFoundException.class)` → `HTTP 404` + `ProblemDetail{title:"User Not Found", detail:ex.getMessage(), code:"USER_NOT_FOUND"}`.
  - Fallback `Exception` → **no capturado explícitamente**; se deja que Spring devuelva `HTTP 500` para que el bug del NPE muestre la traza en el log (objetivo pedagógico). Un fallback amable ocultaría el ejercicio.
- **Rationale**: `ProblemDetail` es el patrón recomendado en Spring 6 / Boot 4 y sigue RFC 7807. Reduce ceremonia (no requiere records custom), gana interoperabilidad (`application/problem+json`), y las propiedades extra `code` y `fieldErrors` — añadidas via `setProperty(...)` — se serializan como top-level gracias a `ProblemDetailJacksonMixin`. Ajustado a FR-009a/9b y a la clarificación de Session 2026-09-16.
- **Alternatives considered**:
  - Record custom `ApiError{code, message, fieldErrors}` — descartado: reinventa RFC 7807, no interoperable, no aprovecha la integración automática de `ResponseEntityExceptionHandler`.
  - Handler `Exception` con `500` + `ProblemDetail` genérico — descartado: enmascara la traza, arruina el ejercicio.

## R-007 — Estrategia de tests

- **Decision**:
  - **Happy path (`GET`, `PUT`, `DELETE`)**: `@SpringBootTest(webEnvironment=RANDOM_PORT)` + `MockMvc` + `@AutoConfigureMockMvc`. Datos sembrados desde un `@BeforeEach` que inserta directamente vía `UserRepository.save(new User(null, "seed", "seed@example.com", Instant.now()))`, evitando `POST /users` (bloqueado por el bug).
  - **Test del bug**: `@SpringBootTest` con `MockMvc`. Se lanza `POST /users` con payload válido. Se envuelve con `assertThrows(NullPointerException.class, () -> mockMvc.perform(...).andReturn())`, verificando que la excepción se propaga (o alternativamente `andExpect(status().isInternalServerError())` con aserción sobre el mensaje del log). Nombre: `createUser_currentlyThrowsNPE_bugKnown`. Comentario referenciando `BUG.md`.
  - **Test unitario del mapper**: `UserMapperUnitTest` que llama a `mapper.toEntity(request)` y afirma `assertThat(entity.getEmail()).isNull()`. Es la firma automatizada más directa del bug y sirve de "acta de defunción" al fix (cuando el mapper se arregle, este test se reescribe con `assertThat(entity.getEmail()).isEqualTo(request.email())`).
  - **Test de validación (400)**: enviar payloads con `name` vacío, `email` vacío, `email` malformado. Verificar 400 y `code:"VALIDATION_ERROR"`.
- **Rationale**: Cobertura suficiente sin sobreingeniería. Suite en verde mientras el bug exista.
- **Alternatives considered**:
  - `@WebMvcTest` — descartado: exige mockear el service y complica el ejemplo del NPE que ocurre en el service real.
  - `TestRestTemplate` en todos los tests — descartado: MockMvc es más habitual en formaciones Spring.

## R-008 — Sembrado de datos para happy path

- **Decision**: `UserRepository.save(...)` desde un `@BeforeEach` en los tests que necesiten datos previos. En runtime interactivo (para que el alumno pruebe `GET /users` en el navegador o Swagger sin haber creado usuarios), añadir un `CommandLineRunner` opcional que inserte 1–2 usuarios de ejemplo **saltándose el mapper** (`repository.save(new User(...))` directo).
- **Rationale**: El bug bloquea `POST /users`, por lo que sin sembrado el resto del CRUD no se puede probar en local. La inserción directa en runtime demuestra que el problema es local al mapper.
- **Alternatives considered**:
  - `data.sql` — descartado: menos didáctico y esconde qué datos existen.
  - No sembrar y pedir usar Swagger tras el fix — descartado: rompe US3.

## R-009 — Versión de Maven y wrapper

- **Decision**: Maven **3.9.x** (última minor estable de la línea `3.9` en SDKMAN en el momento de crear el ejemplo). Incluir Maven Wrapper (`mvnw`) para que el alumno pueda ejecutar `./mvnw spring-boot:run` sin depender de la versión global. `.sdkmanrc` fija la versión aunque exista wrapper, para reforzar el hábito de `sdk env`.
- **Rationale**: Alinea con el toolchain SDKMAN documentado en el módulo Setup.
- **Alternatives considered**:
  - Maven 4.x — descartado: aún en RC/GA reciente, algunos plugins pueden no ser compatibles con Spring Boot 4 en producción; formación se mantiene en la línea estable.

## R-010 — Estructura de paquetes Java

- **Decision**: Paquete raíz `com.sngular.formacion.usercrud`. Subpaquetes por rebanada de dominio (`user/`, `error/`, `config/`) — no por capa técnica (`controller/`, `service/`, `repository/`). Esto acorta el path del alumno al leer el bug (todo lo del `User` en un mismo paquete) sin sacrificar orden.
- **Rationale**: Rebanadas verticales facilitan la lectura pedagógica del flujo del bug.
- **Alternatives considered**:
  - Paquetes por capa — descartado: el alumno saltaría entre `controller/`, `service/`, `mapper/` para entender un único flujo.

## R-011 — Contenido y ubicación de `BUG.md`

- **Decision**: Un único archivo `examples/user-crud-modern/BUG.md` en la raíz del subproyecto (no en `docs/`). Contiene: síntoma, ruta al mapper y método afectado, snippet del código con bug, explicación del mecanismo (mapper omite `setEmail`, normalización estalla), fix esperado (una línea `entity.setEmail(request.email());`), comando de validación (`./mvnw -Dtest=UserMapperUnitTest test`) y checklist de "cómo darle la vuelta al ejercicio en clase". Referenciado desde `README.md` con nota "para el formador; no leer si eres alumno".
- **Rationale**: FR-010 y FR-011 lo exigen. Un único archivo simplifica mantenimiento.
- **Alternatives considered**:
  - `docs/app-ejemplo/reproducir-bug-solucion.md` marcado `unlisted` — descartado: MkDocs no ofrece "unlisted" nativo y el archivo terminaría indexado por buscadores; incumple FR-011.

## R-012 — Integración con MkDocs y navegación

- **Decision**: Añadir a `mkdocs.yml` una entrada nueva en `nav`:
  ```yaml
  - App de ejemplo:
      - app-ejemplo/index.md
      - Reproducir el bug: app-ejemplo/reproducir-bug.md
      - Depurando con Claude: app-ejemplo/depurando-con-claude.md
  ```
  Las páginas usan tono profesional-directo, admonitions `!!!` para notas y warnings, y bloques de código con lenguaje explícito. La página `index.md` incluye el bloque "Versión de referencia — verificado 2026-09-16" cuando cita `java=21.0.4-tem` y `maven=3.9.x`.
- **Rationale**: Cumple Principios I, III y VI.
- **Alternatives considered**:
  - Sección dentro de un módulo existente — descartado: la app merece sección propia por peso didáctico.

## R-014 — Migración a `ProblemDetail` (RFC 7807)

- **Decision**: Sustituir cualquier clase custom de error (`ApiError`, `FieldError`) por `org.springframework.http.ProblemDetail` (Spring 6 / Boot 4). El `@RestControllerAdvice` extiende `ResponseEntityExceptionHandler` y devuelve `ProblemDetail` con dos propiedades extra: `code` (enum estable) y `fieldErrors` (lista de `{field, message}`, sólo en `VALIDATION_ERROR`). Media type de respuesta: `application/problem+json`.
- **Rationale**: es el patrón recomendado en Spring 6 desde su GA y se generaliza en Boot 3+; en SB 4 forma parte de la baseline. Ventajas concretas: (a) elimina código propio, (b) interoperabilidad con clientes que ya entienden RFC 7807, (c) integración automática de la validación Jakarta vía el override de `handleMethodArgumentNotValid`, (d) `ProblemDetailJacksonMixin` serializa `properties` como campos top-level, así que `code`/`fieldErrors` se ven como si formaran parte del schema principal.
- **Alternatives considered**:
  - Mantener `ApiError` custom — descartado: reinventa lo que Spring ofrece de serie; peor para la formación (patrón desactualizado).
  - Devolver `ProblemDetail` sin propiedades extra — descartado: perderíamos el identificador estable `code` que sirve al cliente para desambiguar sin parsear mensajes humanos.
  - Enum central `ErrorCode` + método `toProblemDetail()` — descartado como sobreingeniería para 3 códigos; puede reintroducirse si el catálogo crece.

## R-013 — Ejemplos `curl` vs `httpie`

- **Decision**: Ejemplos principales con `curl` (universal), con equivalente `httpie` opcional en bloque anexo. Todos los ejemplos usan `-i` o `-w` para mostrar código HTTP.
- **Rationale**: `curl` viene preinstalado en macOS/Linux; `httpie` es más legible pero no siempre disponible.
- **Alternatives considered**:
  - Solo `httpie` — descartado: barrera de entrada.
