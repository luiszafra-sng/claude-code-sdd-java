---

description: "Task list for feature 004-user-crud-modern"
---

# Tasks: Aplicación de ejemplo `user-crud-modern` con bug NPE intencionado

**Input**: Design documents from `specs/004-user-crud-modern/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/users-api.yaml`, `quickstart.md`

**Tests**: INCLUDED — la spec exige explícitamente tests JUnit 5 (US5 + FR-014/15).

**Organization**: por user story (US1..US5) para entrega incremental. MVP = US1 + US2 (bug reproducible + `BUG.md`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizable (ficheros distintos, sin dependencias pendientes).
- **[Story]**: `[US1]`..`[US5]`.

## Path conventions

Layout definido en `plan.md` (Project Structure). Raíz del subproyecto Java: `examples/user-crud-modern/`. Paquete Java raíz: `com.sngular.formacion.usercrud`. Sitio MkDocs: `docs/app-ejemplo/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: crear el subproyecto Maven autónomo con toolchain declarado y esqueleto arrancable.

- [X] T001 Crear el directorio `examples/user-crud-modern/` con estructura Maven estándar (`src/main/java`, `src/main/resources`, `src/test/java`, `src/test/resources`).
- [X] T002 Escribir `examples/user-crud-modern/.sdkmanrc` con `java=21.0.4-tem` y `maven=3.9.x` (última minor estable disponible en SDKMAN el día de la creación; documentar el valor exacto).
- [X] T003 [P] Escribir `examples/user-crud-modern/.gitignore` (`target/`, `*.class`, `.idea/`, `.vscode/`, `*.iml`, `HELP.md`).
- [X] T004 Instalar Maven Wrapper 3.9.x en `examples/user-crud-modern/` (`mvn -N wrapper:wrapper -Dmaven=3.9.x`), generando `mvnw`, `mvnw.cmd` y `.mvn/wrapper/`.
- [X] T005 Escribir `examples/user-crud-modern/pom.xml`: `groupId=com.sngular.formacion`, `artifactId=user-crud-modern`, `packaging=jar`, `java.version=21`, parent `spring-boot-starter-parent:4.0.8` (verificar `https://api.github.com/repos/spring-projects/spring-boot/releases` — usar la última patch estable de la línea `4.0.x` si es posterior a `4.0.8`), starters `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`, runtime `com.h2database:h2`, `org.springdoc:springdoc-openapi-starter-webmvc-ui:3.0.3` (línea `3.0.x` alineada con SB `4.0.x`; si aparece un `3.0.4+`, usarlo), y `spring-boot-starter-test` (scope test).
- [X] T006 [P] Crear `examples/user-crud-modern/README.md` con esqueleto (título, propósito, aviso de bug intencional, secciones vacías: Requisitos, Arranque, Endpoints, Tests, Referencia al `BUG.md`). El contenido detallado se completa en tareas posteriores.
- [X] T007 Verificar arranque mínimo: crear la clase `com.sngular.formacion.usercrud.UserCrudApplication` en `src/main/java/com/sngular/formacion/usercrud/UserCrudApplication.java` con `@SpringBootApplication` y `main` estándar. Ejecutar `./mvnw compile` desde `examples/user-crud-modern/` y confirmar que compila.

**Checkpoint**: subproyecto Java compila; SDKMAN + Maven activos.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: infraestructura común (persistencia, config, manejo de errores) que todas las user stories necesitan.

**⚠️ CRITICAL**: ninguna US puede empezar hasta cerrar esta fase.

- [X] T008 Escribir `examples/user-crud-modern/src/main/resources/application.yml`: `spring.datasource.url=jdbc:h2:mem:userdb`, `spring.jpa.hibernate.ddl-auto=create-drop`, `spring.jpa.show-sql=true`, `springdoc.swagger-ui.enabled=true`, `springdoc.api-docs.path=/v3/api-docs`, `springdoc.swagger-ui.path=/swagger-ui/index.html`, `spring.h2.console.enabled=true` (opcional para depuración).
- [X] T009 [P] Crear `examples/user-crud-modern/src/main/java/com/sngular/formacion/usercrud/config/OpenApiConfig.java` con `@Configuration` que registra un bean `io.swagger.v3.oas.models.OpenAPI` con metadata (title=`user-crud-modern`, version=`0.1.0`, description referenciando `BUG.md`).
- [X] T010 [P] Crear `examples/user-crud-modern/src/main/java/com/sngular/formacion/usercrud/user/User.java` con `@Entity`, `@Table(name = "users")` y los campos definidos en `data-model.md` (id `@Id @GeneratedValue(IDENTITY)`, `name` `@Column(nullable=false, length=100)`, `email` `@Column(nullable=false, length=200, unique=true)`, `createdAt` `@Column(nullable=false)`). Constructor sin argumentos + constructor completo + getters/setters (o `@Getter/@Setter` si se añade Lombok, no requerido). Aplicar Clean Code (nombres claros, sin lógica en la entidad).
- [X] T011 [P] Crear `examples/user-crud-modern/src/main/java/com/sngular/formacion/usercrud/user/UserRepository.java` como `interface UserRepository extends JpaRepository<User, Long>`. No añadir métodos custom en esta fase.
- [X] T012 [P] Sin clases custom de error: se usa `org.springframework.http.ProblemDetail` (RFC 7807) que ya trae Spring 6/Boot 4. Los campos `code` (estable, enum) y `fieldErrors` se añaden como **propiedades extra** vía `body.setProperty("code", ...)` / `body.setProperty("fieldErrors", ...)` dentro del handler (T014); serializadas como top-level por `ProblemDetailJacksonMixin`. Tarea aquí: **no crear `ApiError`/`FieldError`** y documentar la decisión en el commit.
- [X] T013 [US3 pre-req] Crear `examples/user-crud-modern/src/main/java/com/sngular/formacion/usercrud/error/UserNotFoundException.java` extendiendo `RuntimeException` con constructor `UserNotFoundException(Long id)` que produce mensaje `"Usuario " + id + " no encontrado."`.
- [X] T014 Crear `examples/user-crud-modern/src/main/java/com/sngular/formacion/usercrud/error/GlobalExceptionHandler.java` con `@RestControllerAdvice` **extendiendo `ResponseEntityExceptionHandler`** y devolviendo `ProblemDetail`:
  - `handleMethodArgumentNotValid(...)` (override) → HTTP 400. Construye `ProblemDetail.forStatusAndDetail(BAD_REQUEST, "El cuerpo de la petición contiene errores de validación.")`, `setTitle("Validation Error")`, `setProperty("code","VALIDATION_ERROR")`, `setProperty("fieldErrors", <mapear ex.getBindingResult().getFieldErrors() a List<Map<String,String>> {field, message}>)`. Devuelve via `handleExceptionInternal(...)`.
  - `@ExceptionHandler(UserNotFoundException.class)` → HTTP 404. `ProblemDetail` con `title="User Not Found"`, `detail=ex.getMessage()`, `code:"USER_NOT_FOUND"`.
  - `@ExceptionHandler(DataIntegrityViolationException.class)` → HTTP 409. `ProblemDetail` con `title="Email Already Exists"`, `detail="El email indicado ya está registrado."`, `code:"EMAIL_ALREADY_EXISTS"`.
  Documentar en comentario `// No se define handler genérico Exception: se deja que Spring emita 500 para preservar el ejercicio de depuración (ver BUG.md).`
  Documentar también el supuesto: `// Supuesto: la única constraint UNIQUE del modelo es users.email; toda DataIntegrityViolationException aquí se atribuye a colisión de email.`
- [X] T015 Arrancar la aplicación (`./mvnw spring-boot:run`) y confirmar que Swagger UI carga en `/swagger-ui/index.html` y que `/v3/api-docs` devuelve JSON válido con las rutas aún vacías (o sólo la health de Spring).

**Checkpoint**: persistencia, error handling y config listos. US1..US5 pueden empezar.

---

## Phase 3: User Story 1 — Alumno reproduce el bug NPE en `POST /users` (Priority: P1) 🎯 MVP

**Goal**: al enviar `POST /users` con payload válido, la aplicación responde `HTTP 500` con `NullPointerException` reproducible al 100%, y la página "Reproducir el bug" del sitio documenta el paso a paso.

**Independent Test**: seguir `quickstart.md` §"Validación 1" — arrancar la app, ejecutar el `curl` documentado, verificar `500` + traza con `NullPointerException` en el log. La página `docs/app-ejemplo/reproducir-bug.md` incluye el mismo comando y un fragmento representativo del stacktrace.

### Implementation for User Story 1

- [X] T016 [P] [US1] Crear `examples/user-crud-modern/src/main/java/com/sngular/formacion/usercrud/user/dto/CreateUserRequest.java` como `record CreateUserRequest(@NotBlank @Size(max=100) String name, @NotBlank @Size(max=200) @Email String email)`. Imports desde `jakarta.validation.constraints`.
- [X] T017 [US1] Crear `examples/user-crud-modern/src/main/java/com/sngular/formacion/usercrud/user/UserMapper.java` como `@Component`. Método público `User toEntity(CreateUserRequest request)` que instancia `User`, asigna `name` desde `request.name()`, deja `id=null` y **NO invoca `entity.setEmail(request.email())`** (bug intencional — este es el olvido). Añadir `TODO(bug-intentional)` sólo si es necesario para trazabilidad interna; NEVER indicarlo en cadenas visibles al alumno. Métodos adicionales (`toEntity(UpdateUserRequest, User existing)`, `toResponse`) se añaden en US3.
- [X] T018 [US1] Crear `examples/user-crud-modern/src/main/java/com/sngular/formacion/usercrud/user/UserService.java` como `@Service`, dependencias inyectadas por constructor: `UserRepository`, `UserMapper`, `java.time.Clock`. Método público `User create(CreateUserRequest request)`:
  1. `User user = mapper.toEntity(request);`
  2. `normalizeEmail(user);` — método privado `private void normalizeEmail(User user) { user.setEmail(user.getEmail().toLowerCase(java.util.Locale.ROOT)); }`. Ésta es la línea donde estalla el NPE por el bug de T017.
  3. `user.setCreatedAt(clock.instant());`
  4. `return repository.save(user);`
  El orden es importante: la normalización va antes que `setCreatedAt` para que la traza señale a `normalizeEmail`.
- [X] T019 [P] [US1] Crear `examples/user-crud-modern/src/main/java/com/sngular/formacion/usercrud/config/ClockConfig.java` con `@Bean public Clock systemClock() { return Clock.systemUTC(); }` en una `@Configuration` (o inline en `UserCrudApplication`). Necesario para que `UserService` reciba `Clock` inyectado.
- [X] T020 [US1] Crear `examples/user-crud-modern/src/main/java/com/sngular/formacion/usercrud/user/UserController.java` como `@RestController @RequestMapping("/users")`. Añadir sólo el endpoint de esta historia: `@PostMapping public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest request)`. Cuerpo: `User created = service.create(request); return ResponseEntity.created(URI.create("/users/" + created.getId())).body(mapper.toResponse(created));`. Nota: `mapper.toResponse` aún no existe (llegará en US3); ese método público se declara como stub que devuelve `null` en esta historia y se completa en US3. **Prioridad**: el NPE debe estallar antes de llegar al `mapper.toResponse`, por lo que el stub no afecta al comportamiento visible del bug.
- [X] T021 [US1] Verificación manual siguiendo `quickstart.md` §"Validación 1": arrancar `./mvnw spring-boot:run`, ejecutar el `curl` de creación, confirmar `HTTP 500` + `NullPointerException` en el log con línea que señala `UserService.normalizeEmail`. Registrar el fragmento del stacktrace exacto (se reutiliza en T022).
- [X] T022 [US1] Crear `docs/app-ejemplo/reproducir-bug.md` con: título, admonition `!!! bug "Bug intencional"`, prerrequisitos (link a `docs/setup/`), comando `curl` exacto (idéntico al del `README.md` y `quickstart.md`), bloque `text` con el fragmento representativo del stacktrace obtenido en T021, sección "Qué observar" (línea `UserService.normalizeEmail`, código HTTP 500) y link a la página placeholder `depurando-con-claude.md`. Tono profesional-directo, español, sin CSS en línea, sin argot.

**Checkpoint**: US1 completa. El alumno puede reproducir el bug siguiendo docs+curl. MVP alcanzable con US1+US2.

---

## Phase 4: User Story 2 — Formador dispone del origen del bug en `BUG.md` (Priority: P1)

**Goal**: `examples/user-crud-modern/BUG.md` documenta síntoma, causa raíz (mapper), mecanismo del NPE, fix esperado y comando de validación; **no** enlazado desde el sitio público.

**Independent Test**: un formador que no ha visto el ejercicio abre `BUG.md` y en <5 min entiende dónde y por qué falla y cómo se corrige.

### Implementation for User Story 2

- [X] T023 [US2] Escribir `examples/user-crud-modern/BUG.md` con secciones:
  1. **Síntoma**: `POST /users` con payload válido devuelve `HTTP 500` con `NullPointerException`.
  2. **Ubicación de la causa raíz**: fichero `src/main/java/com/sngular/formacion/usercrud/user/UserMapper.java`, método `toEntity(CreateUserRequest)`. Snippet del código actual (con el bug) y explicación de la línea que falta.
  3. **Punto donde estalla**: fichero `src/main/java/com/sngular/formacion/usercrud/user/UserService.java`, método `normalizeEmail`, línea `user.setEmail(user.getEmail().toLowerCase(Locale.ROOT));`. Explicar por qué el síntoma parece estar en el service pero la causa está en el mapper.
  4. **Fix esperado** (1–3 líneas): añadir `entity.setEmail(request.email());` en `UserMapper.toEntity(CreateUserRequest)` antes del `return`.
  5. **Comando de validación del fix**: `./mvnw -Dtest=UserMapperUnitTest test` debe pasar en verde con el aserto ajustado; `./mvnw verify` debe seguir verde con el test `createUser_currentlyThrowsNPE_bugKnown` reescrito a happy path (fuera del alcance de esta feature).
  6. **Nota al formador**: cómo conducir la sesión de depuración con Claude (preguntas guía, cuándo revelar la causa).
- [X] T024 [US2] Añadir en `examples/user-crud-modern/README.md` una nota al principio: `> Este proyecto contiene un bug intencional (ver BUG.md). NO abras BUG.md si eres alumno — arruinará el ejercicio.` Verificar que `BUG.md` **no** está referenciado desde ningún `.md` en `docs/`.
- [X] T025 [US2] Verificar cumplimiento de FR-011: `grep -r "BUG.md" docs/` desde la raíz del monorepo NO debe producir coincidencias. `grep -r "BUG.md" examples/user-crud-modern/` puede producir la referencia del `README.md`.

**Checkpoint**: US2 completa. MVP formador+alumno cerrado (US1 ∪ US2).

---

## Phase 5: User Story 3 — Alumno prueba el resto de endpoints (`GET`/`PUT`/`DELETE`) (Priority: P2)

**Goal**: `GET /users`, `GET /users/{id}`, `PUT /users/{id}`, `DELETE /users/{id}` funcionan en happy path; `404` en ids inexistentes; `409` en email duplicado vía `PUT`. Sembrado runtime para poder probar sin depender del `POST` roto.

**Independent Test**: seguir `quickstart.md` §"Validación 3" — arrancar la app, `GET /users` devuelve el usuario sembrado, `GET /users/1` devuelve `200`, `PUT /users/1` devuelve `200`, `DELETE /users/1` devuelve `204`, `GET /users/9999` devuelve `404`.

### Implementation for User Story 3

- [X] T026 [P] [US3] Crear `examples/user-crud-modern/src/main/java/com/sngular/formacion/usercrud/user/dto/UpdateUserRequest.java` como `record UpdateUserRequest(@NotBlank @Size(max=100) String name, @NotBlank @Size(max=200) @Email String email)`.
- [X] T027 [P] [US3] Crear `examples/user-crud-modern/src/main/java/com/sngular/formacion/usercrud/user/dto/UserResponse.java` como `record UserResponse(Long id, String name, String email, java.time.Instant createdAt)`.
- [X] T028 [US3] Completar `UserMapper` con:
  - `public UserResponse toResponse(User user)` — mapeo directo (reemplaza el stub introducido en T020).
  - `public void applyUpdate(UpdateUserRequest request, User existing)` — asigna `name` y `email` (este método SÍ asigna `email` correctamente; el bug es sólo en `toEntity(CreateUserRequest)`).
- [X] T029 [US3] Completar `UserService` con:
  - `public java.util.List<User> findAll()` → `repository.findAll()`.
  - `public User findById(Long id)` → `repository.findById(id).orElseThrow(() -> new UserNotFoundException(id))`.
  - `public User update(Long id, UpdateUserRequest request)` → `User existing = findById(id); mapper.applyUpdate(request, existing); normalizeEmail(existing); return repository.save(existing);` (reutiliza `normalizeEmail`).
  - `public void delete(Long id)` → `if (!repository.existsById(id)) throw new UserNotFoundException(id); repository.deleteById(id);`.
- [X] T030 [US3] Completar `UserController` con los cuatro endpoints restantes:
  - `@GetMapping public java.util.List<UserResponse> list()` → mapea via `mapper::toResponse`.
  - `@GetMapping("/{id}") public UserResponse get(@PathVariable Long id)`.
  - `@PutMapping("/{id}") public UserResponse update(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request)`.
  - `@DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id)`.
- [X] T031 [US3] Crear `examples/user-crud-modern/src/main/java/com/sngular/formacion/usercrud/user/UserSeeder.java` como `@Component` implementando `CommandLineRunner`. En `run(...)` inserta 1–2 usuarios de ejemplo directamente vía `repository.save(new User(null, "Seed User", "seed@example.com", Instant.now()))`, **sin pasar por el mapper**, para que el alumno pueda probar `GET`/`PUT`/`DELETE` con la app arrancada.
- [X] T032 [US3] Ampliar `examples/user-crud-modern/README.md` con la sección "Endpoints — happy path": ejemplos `curl` (y equivalentes `httpie`) para `GET /users`, `GET /users/{id}`, `PUT /users/{id}`, `DELETE /users/{id}`, incluyendo códigos HTTP esperados y ejemplos de payload. Referenciar el sembrado (usuario `seed@example.com` con id conocido al arrancar).
- [X] T033 [US3] Verificación manual siguiendo `quickstart.md` §"Validación 3": arrancar la app tras el sembrado, ejecutar todos los `curl` documentados, confirmar códigos HTTP y payloads.

**Checkpoint**: US3 completa. CRUD completo funcional (menos `POST`, bloqueado por el bug intencional).

---

## Phase 6: User Story 4 — Documentación en el sitio (Priority: P2)

**Goal**: `docs/app-ejemplo/` contiene tres páginas (`index.md`, `reproducir-bug.md`, `depurando-con-claude.md`) integradas en la navegación de `mkdocs.yml`; `mkdocs build --strict` termina sin warnings.

**Independent Test**: `uv run mkdocs serve` levanta el sitio; la sección "App de ejemplo" aparece en el nav; las tres páginas cargan; `uv run mkdocs build --strict` finaliza sin warnings; `grep -r "BUG.md" docs/` no produce coincidencias.

**Cross-story note (S1)**: la página `docs/app-ejemplo/reproducir-bug.md` se crea en Phase 3 (T022, dentro de US1) porque requiere el stacktrace real capturado en T021. Phase 6 asume que ese fichero ya existe y sólo añade `index.md`, `depurando-con-claude.md` e integración en `mkdocs.yml`. Si se ejecuta US4 antes de US1, T022 debe adelantarse.

### Implementation for User Story 4

- [X] T034 [P] [US4] Crear `docs/app-ejemplo/index.md`: presentación de la app (qué es, por qué existe), arquitectura (endpoints, stack, dependencias externas — none más allá de H2), cómo levantarla (`sdk env`, `./mvnw spring-boot:run`), enlace a Swagger UI local, enlace a "Reproducir el bug". Incluir bloque `!!! info "Versión de referencia — verificado 2026-09-16"` que cita `java=21.0.4-tem` y `maven=3.9.x` (norma de re-verificación semestral). Tono profesional-directo, español, sin CSS en línea, sin argot.
- [X] T035 [P] [US4] Crear `docs/app-ejemplo/depurando-con-claude.md` con contenido completo: prerrequisitos (SDKMAN, app arrancada, Claude Code, opcional CodeGraph); guion de sesión en 7 pasos (reproducir + capturar stacktrace → primer prompt efectivo y contraejemplo pobre → guiar el diagnóstico con `codegraph_explore` o rutas de fichero → llegar a la causa raíz en `UserMapper.toEntity` → aplicar fix mínimo de una línea → verificar con `./mvnw -Dtest=UserMapperUnitTest test` antes y después → confirmar con `curl` que `POST /users` devuelve `201 Created`); ejemplos concretos de prompts efectivos vs. pobres; sección de buenas prácticas (leer código antes de parchear, fix mínimo, test verificable, nombres que documentan intención, trazabilidad, preguntas cerradas de confirmación); sección de malas prácticas (`"arréglame esto"`, `if (email != null)` en el service, `Optional`, `try/catch NullPointerException`, refactor amplio "de paso", pedir varias respuestas en paralelo, ignorar la traza); tabla-resumen con duración esperada por fase (≈18 min); indicación de cómo reescribir los dos tests `*_bugKnown` a happy path tras el fix. Tono profesional-directo, español, sin CSS en línea, NEVER depender del módulo SDD.
- [X] T036 [US4] Editar `mkdocs.yml` añadiendo en `nav` la sección `- App de ejemplo:` con las tres páginas en el orden: `app-ejemplo/index.md`, `Reproducir el bug: app-ejemplo/reproducir-bug.md`, `Depurando con Claude: app-ejemplo/depurando-con-claude.md`. NEVER modificar tokens visuales aquí; se mantienen en `docs/stylesheets/extra.css`.
- [X] T037 [US4] Ejecutar `uv run mkdocs build --strict` desde la raíz del monorepo. Confirmar salida sin warnings. Resolver cualquier warning (links rotos, snippets huérfanos) hasta que pase limpio.

**Checkpoint**: US4 completa. Sitio integra la sección "App de ejemplo".

---

## Phase 7: User Story 5 — Suite JUnit 5 (Priority: P2)

**Goal**: suite de tests en verde: happy path `GET`/`PUT`/`DELETE`, validaciones 400, y test `assertThrows(NullPointerException.class, ...)` que documenta el bug. Test unitario del mapper (`toEntity` deja `email` a `null`) como "acta de defunción" del bug.

**Independent Test**: `./mvnw test` desde `examples/user-crud-modern/` finaliza con 0 fallos, 0 errores, N tests ejecutados; el nombre `createUser_currentlyThrowsNPE_bugKnown` y `toEntity_currentlyOmitsEmail_bugKnown` aparecen en el reporte.

### Tests for User Story 5

- [X] T038 [P] [US5] Crear `examples/user-crud-modern/src/test/java/com/sngular/formacion/usercrud/user/UserMapperUnitTest.java` (JUnit 5 puro, sin Spring). Test `toEntity_currentlyOmitsEmail_bugKnown`: instancia `UserMapper`, invoca `mapper.toEntity(new CreateUserRequest("Ana", "ana@example.com"))`, asserts `entity.getName()` es `"Ana"` y `entity.getEmail()` es `null`. Comentario Javadoc: `Documenta el bug conocido; ver BUG.md. Cuando se aplique el fix, este test debe reescribirse para afirmar que el email queda asignado.`
- [X] T039 [P] [US5] Crear `examples/user-crud-modern/src/test/java/com/sngular/formacion/usercrud/user/UserControllerCreateBugIT.java` con `@SpringBootTest(webEnvironment=RANDOM_PORT)` + `@AutoConfigureMockMvc`. Test `createUser_currentlyThrowsNPE_bugKnown`: estrategia fijada — usar `MockMvc` + `LogCaptor` (dependencia `nl.altindag:log-captor` scope `test`, versión última estable, añadir al `pom.xml` en esta tarea). Cuerpo del test:

  ```java
  var payload = """{"name":"Ana Torres","email":"ana.torres@example.com"}""";
  try (LogCaptor logCaptor = LogCaptor.forRoot()) {
      mockMvc.perform(post("/users")
              .contentType(MediaType.APPLICATION_JSON)
              .content(payload))
          .andExpect(status().is5xxServerError());
      assertThat(logCaptor.getErrorLogs())
          .anySatisfy(line -> assertThat(line).contains("NullPointerException"));
  }
  ```

  Rationale de la elección: `MockMvc` envuelve el `NullPointerException` en `ServletException` según la configuración del `DispatcherServlet`, por lo que `assertThatThrownBy` sería frágil. Aserción sobre `5xx` + captura de log evita esa fragilidad. Javadoc: `Documenta el bug conocido (ver BUG.md). Cuando se aplique el fix, reescribir a: mockMvc.perform(post("/users")...).andExpect(status().isCreated()) y eliminar el LogCaptor.`
- [X] T040 [P] [US5] Crear `examples/user-crud-modern/src/test/java/com/sngular/formacion/usercrud/user/UserControllerHappyPathIT.java` con `@SpringBootTest(webEnvironment=RANDOM_PORT)` + `@AutoConfigureMockMvc`. `@BeforeEach` inserta un usuario vía `UserRepository.save(...)` (evitando el `POST` con bug). Tests:
  - `listUsers_returnsSeeded`.
  - `getUser_byExistingId_returnsUser`.
  - `getUser_byMissingId_returns404_withProblemDetail` (verifica `status:404`, `title:"User Not Found"`, `detail`, `code:"USER_NOT_FOUND"`).
  - `updateUser_byExistingId_returnsUpdated`.
  - `updateUser_byMissingId_returns404`.
  - `deleteUser_byExistingId_returns204`.
  - `deleteUser_byMissingId_returns404`.
- [X] T041 [P] [US5] Crear `examples/user-crud-modern/src/test/java/com/sngular/formacion/usercrud/user/UserControllerValidationIT.java`. Tests:
  - `createUser_withBlankName_returns400_withProblemDetail`.
  - `createUser_withInvalidEmail_returns400_withProblemDetail`.
  - `createUser_withNameOver100Chars_returns400`.
  - `updateUser_withBlankEmail_returns400`.
  Cada test verifica código 400 y presencia de `ProblemDetail` con `status:400`, `code:"VALIDATION_ERROR"` y `fieldErrors[].field` esperado.
- [X] T042 [P] [US5] Crear `examples/user-crud-modern/src/test/java/com/sngular/formacion/usercrud/user/UserControllerConflictIT.java`. Test único `updateUser_toEmailAlreadyTakenByAnotherUser_returns409`: sembrar dos usuarios vía `UserRepository`, `PUT` sobre el segundo para asignarle el email del primero, esperar `HTTP 409` + `code:"EMAIL_ALREADY_EXISTS"`. (Se testea la ruta `PUT` porque `POST` está bloqueado por el bug.)
- [X] T043 [US5] Ejecutar `./mvnw test` desde `examples/user-crud-modern/`; confirmar 0 fallos, 0 errores. Ajustar tests si algún assert es demasiado laxo o estricto.

**Checkpoint**: US5 completa. Suite entera en verde.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: cerrar quickstart y verificaciones finales sin tocar código de otras historias.

- [X] T044 [P] Completar `examples/user-crud-modern/README.md` con la sección "Tests": comando `./mvnw test`, listado de tests con su significado (happy path, validaciones, bug conocido). Añadir enlace a la página "Reproducir el bug" del sitio.
- [X] T045 [P] Añadir al `README.md` una sección "Aviso al alumno" al inicio: `> Este proyecto contiene un bug intencional. Sigue el módulo de docs; NO leas BUG.md si eres alumno.`
- [X] T046 Ejecutar `uv run mkdocs build --strict` una vez más para confirmar que la interacción entre US1 y US4 (link cruzado entre `reproducir-bug.md` y `depurando-con-claude.md`) no ha roto la puerta de calidad.
- [X] T047 Ejecutar la validación completa de `quickstart.md` (§Validación 1–6). Registrar en un comentario del PR que las 6 validaciones pasan.
- [X] T048 Verificación final de constitution: `.sdkmanrc` presente y correcto; página `docs/app-ejemplo/index.md` con bloque "versión + fecha"; no hay CSS en línea introducido en ninguna página; ninguna nueva credencial commiteada (grep de `password|secret|token` en cambios de esta feature).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Phase 1. Bloquea todas las US.
- **US1 (Phase 3, P1)**: depende de Phase 2.
- **US2 (Phase 4, P1)**: depende de Phase 3 completada (necesita el mapper con bug y el service para poder describirlos con precisión en `BUG.md`).
- **US3 (Phase 5, P2)**: depende de Phase 2. En T028 completa el mapper introducido por US1, así que en la práctica US3 arranca tras Phase 3 para evitar conflictos en `UserMapper.java`.
- **US4 (Phase 6, P2)**: depende de Phase 2 para citar arquitectura, y de la traza obtenida en T021 (US1) para la página "Reproducir el bug" (que ya se creó en T022 dentro de US1). Las páginas `index.md` y `depurando-con-claude.md` pueden generarse en paralelo con US3 y US5. El paso `mkdocs build --strict` (T037) requiere las 3 páginas presentes.
- **US5 (Phase 7, P2)**: depende de Phase 3+5 completadas (necesita todos los endpoints y el mapper con bug definitivo).
- **Polish (Phase 8)**: depende de todas las US completadas.

### User Story Dependencies

- **US1 (P1)**: base del ejercicio. Sin dependencias entre US.
- **US2 (P1)**: describe artefactos creados por US1 → requiere US1 cerrada.
- **US3 (P2)**: comparte `UserMapper.java`, `UserService.java`, `UserController.java` con US1. Serializar sobre esos ficheros (US1 → US3).
- **US4 (P2)**: `reproducir-bug.md` se crea dentro de US1 (T022). `index.md` y `depurando-con-claude.md` (T034/T035) pueden ir en paralelo con US3/US5.
- **US5 (P2)**: tests que cubren US1+US3. Requiere ambas cerradas.

### Within Each User Story

- Modelos y DTOs antes que servicios; servicios antes que controladores; controladores antes que la validación manual con `curl`.
- En US5, cada test es independiente del resto (fichero propio) → todos [P] entre sí.
- Documentación (`README.md`, `docs/…`) tras la funcionalidad correspondiente.

### Parallel Opportunities

- **Phase 1**: T003 y T006 en paralelo con la instalación del wrapper.
- **Phase 2**: T009, T010, T011, T012 en paralelo (ficheros distintos). T013 en paralelo con los anteriores (pre-req de US3 pero no bloquea Phase 2).
- **Phase 3 (US1)**: T016, T019 en paralelo. T017, T018, T020 secuenciales (dependen del mapper y service).
- **Phase 5 (US3)**: T026, T027 en paralelo. T028 tras ellas. T029, T030 secuenciales sobre `UserService`/`UserController` (mismo fichero).
- **Phase 6 (US4)**: T034, T035 en paralelo. T036 y T037 secuenciales al final.
- **Phase 7 (US5)**: T038, T039, T040, T041, T042 en paralelo (ficheros de test distintos). T043 tras todos.

---

## Parallel Example: User Story 5

```bash
# Lanzar los cinco ficheros de test en paralelo (ficheros distintos, sin dependencias entre sí):
Task: "T038 [P] [US5] Crear UserMapperUnitTest.java (test unitario del mapper con bug)"
Task: "T039 [P] [US5] Crear UserControllerCreateBugIT.java (assertThrows NPE en POST /users)"
Task: "T040 [P] [US5] Crear UserControllerHappyPathIT.java (GET/PUT/DELETE en verde)"
Task: "T041 [P] [US5] Crear UserControllerValidationIT.java (400 en payloads inválidos)"
Task: "T042 [P] [US5] Crear UserControllerConflictIT.java (409 en PUT con email duplicado)"
# T043 después: ejecutar ./mvnw test y validar verde.
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Cerrar Phase 1 (Setup) y Phase 2 (Foundational).
2. Cerrar Phase 3 (US1) → alumno reproduce el bug siguiendo docs+curl.
3. Cerrar Phase 4 (US2) → `BUG.md` disponible para el formador.
4. **STOP y VALIDATE**: sesión formativa mínima viable (bug reproducible + guía del formador).
5. Demo con formador+alumno de prueba.

### Incremental Delivery

1. Setup + Foundational → base lista.
2. US1 + US2 → MVP formativo (bug + BUG.md + página reproducir).
3. US3 → CRUD completo probable en local (sembrado + happy path).
4. US4 → sitio integra la sección completa (index + placeholder Depurando con Claude).
5. US5 → suite JUnit verde protege el estado esperado.
6. Polish → cierre + validación quickstart + verificación constitution.

### Parallel Team Strategy

- Dev A: Phase 1 → Phase 2 → US1 → US2.
- Dev B (arranca tras Phase 2): US3 (respetando dependencia sobre `UserMapper.java` de US1).
- Dev C (arranca tras Phase 2): US4 (páginas `index.md` y `depurando-con-claude.md`); espera a T021 (US1) para acabar `reproducir-bug.md`.
- Dev D (arranca tras US1+US3): US5.
- Todos: Phase 8 al final.

---

## Notes

- `[P]` = ficheros distintos, sin dependencias pendientes.
- El bug intencional NEVER debe reemplazarse por un `throw new NullPointerException()` sintético (FR-008).
- El estado esperado de la suite es **todo en verde** mientras el bug exista (aclaración Session 2026-09-16 en `spec.md`).
- Ningún `.md` bajo `docs/` debe enlazar a `BUG.md` (FR-011).
- Ningún cambio de estilo va en Markdown; tokens visuales permanecen en `docs/stylesheets/extra.css` (constitución Principio I).
- Verificar `uv run mkdocs build --strict` antes de considerar cerradas US4 y Polish.
- Cada tarea debe cerrarse con commit atómico; el título del commit MUST citar el `TaskID` (ej. `T017 add UserMapper (bug intencional)`).
