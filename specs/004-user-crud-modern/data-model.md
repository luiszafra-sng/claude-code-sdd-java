# Phase 1 Data Model: `user-crud-modern`

## Entidad

### `User`

Persistida como tabla `users` en H2 embebida.

| Campo       | Tipo Java   | Restricciones JPA / BD                                        | Notas                                                       |
|-------------|-------------|---------------------------------------------------------------|-------------------------------------------------------------|
| `id`        | `Long`      | `@Id`, `@GeneratedValue(strategy = IDENTITY)`, no nulo         | Autogenerado por la BD.                                     |
| `name`      | `String`    | `@Column(nullable = false, length = 100)`                      | Se acepta cualquier cadena no vacía tras trim en el DTO.    |
| `email`     | `String`    | `@Column(nullable = false, length = 200, unique = true)`       | Único a nivel de BD; el `@ExceptionHandler` traduce a `409`.|
| `createdAt` | `Instant`   | `@Column(nullable = false)`, asignado en `UserService.create`  | `Instant.now()` en el momento de crear; no editable vía API.|

**Ciclo de vida**:

1. **Creación**: llega `CreateUserRequest`; se aplica validación Jakarta; el mapper produce `User` **sin `email` (bug)**; `UserService.normalizeEmail(user)` estalla con NPE al hacer `user.getEmail().toLowerCase(...)`. En estado corregido: `email` normalizado a minúsculas, `createdAt = Instant.now()`, `repository.save(user)` persiste, se devuelve `UserResponse` + `201 Created` + `Location`.
2. **Lectura por id / lista**: `repository.findById` / `repository.findAll` → `UserResponse`. `404` si no existe.
3. **Actualización**: `PUT /users/{id}` reemplaza `name` y `email`; `createdAt` se preserva. Colisión de `email` → `409`.
4. **Borrado**: `DELETE /users/{id}` → `204` si existe, `404` si no.

## DTOs de transporte

### `CreateUserRequest` (record)

| Campo   | Tipo   | Validación                                        |
|---------|--------|---------------------------------------------------|
| `name`  | String | `@NotBlank`, `@Size(max = 100)`                   |
| `email` | String | `@NotBlank`, `@Size(max = 200)`, `@Email`         |

### `UpdateUserRequest` (record)

Mismos campos y restricciones que `CreateUserRequest`. Semántica: reemplazo total. Un `PATCH` parcial queda fuera de alcance.

### `UserResponse` (record)

| Campo       | Tipo    | Notas                              |
|-------------|---------|------------------------------------|
| `id`        | Long    | Nunca nulo.                        |
| `name`      | String  | Igual al persistido.               |
| `email`     | String  | En minúsculas (normalizado).       |
| `createdAt` | Instant | Serializado ISO-8601 (`toString`). |

## Modelo de error API

Sigue **RFC 7807 (`application/problem+json`)** mediante `org.springframework.http.ProblemDetail` (Spring 6 / Boot 4). No hay clases custom de error: `ProblemDetail` se enriquece con dos propiedades extra mediante `setProperty(...)`.

### Shape de la respuesta de error

| Campo         | Tipo                    | Origen                                                     | Notas                                                                                       |
|---------------|-------------------------|------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| `type`        | URI (String)            | `ProblemDetail` estándar RFC 7807.                          | Por defecto `about:blank` (Spring); puede personalizarse por handler si se documenta un tipo. |
| `title`       | String                  | `ProblemDetail.setTitle(...)`.                              | Etiqueta humana: `"Validation Error"`, `"User Not Found"`, `"Email Already Exists"`.        |
| `status`      | Integer                 | `ProblemDetail.forStatusAndDetail(status, ...)`.            | `400`, `404` o `409` según el handler.                                                       |
| `detail`      | String                  | `ProblemDetail.forStatusAndDetail(..., detail)`.            | Mensaje humano en español (equivalente al antiguo `message`).                                |
| `instance`    | URI (String) (opcional) | `ProblemDetail.setInstance(...)`.                           | No usado en esta feature; queda a discreción del handler.                                    |
| `code`        | String (propiedad extra)| `body.setProperty("code", ...)`.                            | Constante estable: `VALIDATION_ERROR`, `USER_NOT_FOUND`, `EMAIL_ALREADY_EXISTS`.             |
| `fieldErrors` | Lista (propiedad extra) | `body.setProperty("fieldErrors", ...)`.                     | Sólo presente en `VALIDATION_ERROR`. Cada elemento: `{field: String, message: String}`.       |

### Nota sobre las propiedades extra

`ProblemDetail` serializa las propiedades añadidas via `setProperty(...)` como campos top-level del JSON gracias a `ProblemDetailJacksonMixin` (registrado automáticamente por Spring). Cliente compatible con RFC 7807 puro ignora `code` y `fieldErrors`; cliente propio los aprovecha.

### Handlers

- `MethodArgumentNotValidException` → `handleMethodArgumentNotValid` (override de `ResponseEntityExceptionHandler`) → HTTP 400 + `code:"VALIDATION_ERROR"` + `fieldErrors`.
- `UserNotFoundException` → `@ExceptionHandler` propio → HTTP 404 + `code:"USER_NOT_FOUND"`.
- `DataIntegrityViolationException` → `@ExceptionHandler` propio → HTTP 409 + `code:"EMAIL_ALREADY_EXISTS"`.
- Sin fallback `Exception`: `NullPointerException` del bug se propaga a Spring y devuelve 500 con la traza en el log (comportamiento deliberado para el ejercicio de depuración).

## Relación entidad ↔ DTO

- `UserMapper.toEntity(CreateUserRequest req)` → `User` **con `email` no asignado (bug intencional)**. El resto de campos sí se asignan (`name` correctamente; `id` queda `null` para que JPA lo genere; `createdAt` se asigna después en el service).
- `UserMapper.toEntity(UpdateUserRequest req, User existing)` → aplica `name` y `email` sobre `existing` (nota: en la versión con bug, este método también podría omitir `email`, pero la spec se centra en creación; el mapper de actualización se implementa correctamente para que `PUT` sea happy path).
- `UserMapper.toResponse(User user)` → `UserResponse` completo.

## Constraint semántica adicional

- `email` se normaliza a **minúsculas** antes de persistir y de comparar en unicidad. La constraint `UNIQUE` a nivel de columna opera sobre el valor persistido, por lo que "Ana@Example.com" y "ana@example.com" colisionan tras normalización. **Este paso de normalización es exactamente donde estalla el NPE en `POST /users`** por el bug del mapper (el `PUT` sí lo ejecuta correctamente porque su mapper no está roto).
