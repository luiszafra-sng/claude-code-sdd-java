# App de ejemplo (Spring Boot 4)

CRUD de usuarios sobre **Spring Boot 4 + Java 21 + H2 en memoria**, publicado como repositorio independiente en [github.com/luiszafra-sng/user-crud-modern](https://github.com/luiszafra-sng/user-crud-modern). Es la aplicación de referencia para el resto de la formación, y en particular para el módulo de depuración asistida por Claude.

## Qué hace

Expone cinco endpoints REST sobre una entidad `User` (`id`, `name`, `email`, `createdAt`):

| Método | Ruta            | Propósito                                    |
|--------|-----------------|----------------------------------------------|
| `POST` | `/users`        | Crea un usuario. **Bug intencional aquí.**   |
| `GET`  | `/users`        | Lista los usuarios existentes.               |
| `GET`  | `/users/{id}`   | Obtiene un usuario por id.                   |
| `PUT`  | `/users/{id}`   | Reemplaza los datos de un usuario existente. |
| `DELETE` | `/users/{id}` | Borra un usuario.                            |

Persistencia H2 embebida (en memoria). Validación con Jakarta Validation. Documentación viva con Swagger UI en desarrollo. Manejo de errores centralizado en un `@RestControllerAdvice` que extiende `ResponseEntityExceptionHandler` de Spring y devuelve `application/problem+json` (RFC 7807 · `ProblemDetail`) para HTTP `400`, `404` y `409`, con dos propiedades extra propias: `code` (identificador estable) y `fieldErrors` (sólo en validación).

## Por qué existe

La aplicación cumple dos funciones:

1. **Referencia moderna** — muestra un CRUD Spring Boot 4 minimalista, útil como plantilla mental para el resto de módulos (agentes, skills, SDD).
2. **Caso de estudio de depuración** — contiene un bug reproducible al 100% en `POST /users` (NPE aunque el `email` venga informado en el payload). Ese bug alimenta el módulo *Depurando con Claude*.

## Arquitectura

Estructura mínima, un solo paquete raíz `com.sngular.formacion.usercrud`:

```text
com.sngular.formacion.usercrud
├── UserCrudApplication          # arranque Spring Boot
├── config/
│   ├── OpenApiConfig            # metadata OpenAPI
│   └── ClockConfig              # Clock inyectable
├── user/
│   ├── User                     # @Entity
│   ├── UserRepository           # JpaRepository
│   ├── UserService              # orquesta creación, normalización, persistencia
│   ├── UserMapper               # DTO ↔ Entity (a mano)
│   ├── UserController           # /users
│   ├── UserSeeder               # siembra usuarios al arrancar
│   └── dto/
│       ├── CreateUserRequest
│       ├── UpdateUserRequest
│       └── UserResponse
└── error/
    ├── UserNotFoundException
    └── GlobalExceptionHandler   # extiende ResponseEntityExceptionHandler → ProblemDetail (RFC 7807) para 400/404/409
```

Sin base de datos externa, sin autenticación, sin capa de caché. Nada que distraiga del ejercicio.

## Cómo levantarla

```bash
git clone https://github.com/luiszafra-sng/user-crud-modern.git
cd user-crud-modern
sdk env install    # instala JDK 21 y Maven 3.9.11 (una vez)
sdk env            # activa las versiones en la shell
./mvnw spring-boot:run
```

- Aplicación: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Consola H2: `http://localhost:8080/h2-console`

Al arrancar, un `CommandLineRunner` siembra dos usuarios de ejemplo para poder probar `GET`, `PUT` y `DELETE` sin depender del endpoint de creación (que está bloqueado por el bug).

Detalle completo de invocación (curl / httpie), tests y estructura del repositorio en el [`README.md`](https://github.com/luiszafra-sng/user-crud-modern/blob/main/README.md) del proyecto.

## Siguientes pasos

- **[Reproducir el bug](reproducir-bug.md)** — pasos exactos para hacer que la creación falle con `NullPointerException`.
- **[Depurando con Claude](depurando-con-claude.md)** — guion completo de la sesión con Claude Code para llegar al fix + buenas y malas prácticas de depuración asistida.

!!! info "Versión de referencia — verificado 2026-09-16"
    - JDK: `21.0.4-tem` (Temurin, vía SDKMAN).
    - Maven: `3.9.11` (vía SDKMAN).
    - Spring Boot: `4.0.8`.
    - springdoc-openapi: `3.0.3`.

    Re-verificar cada 6 meses (Constitution 1.0.2 · Development & Publishing Workflow).
