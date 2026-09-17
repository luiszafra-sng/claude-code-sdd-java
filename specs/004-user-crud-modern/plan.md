# Implementation Plan: Aplicación de ejemplo `user-crud-modern` con bug NPE intencionado

**Branch**: `004-user-crud-modern` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-user-crud-modern/spec.md`

## Summary

CRUD de usuarios sobre Spring Boot 4 + Java 21 + H2 embebida, ubicado en `examples/user-crud-modern/`, con cinco endpoints REST (`POST/GET/PUT/DELETE /users` y `GET /users/{id}`), validación Jakarta, OpenAPI/Swagger UI, `@RestControllerAdvice` que extiende `ResponseEntityExceptionHandler` y devuelve `ProblemDetail` (RFC 7807 / `application/problem+json`) con propiedades extra `code` y `fieldErrors`, y un bug reproducible intencionado en el flujo de creación (mapper DTO→Entity manual que omite la asignación de `email`, con NPE que estalla en la etapa de normalización previa a persistir). Suite JUnit 5 completa en verde: happy path para `GET`/`PUT`/`DELETE` + un test `assertThrows(NullPointerException.class, ...)` que documenta el bug. Sitio MkDocs recibe una sección "App de ejemplo" con tres páginas (presentación/arquitectura, reproducir el bug, placeholder "Depurando con Claude"). `.sdkmanrc` fija JDK 21 Temurin y Maven 3.9.x; `BUG.md` interno documenta causa raíz y fix esperado (fuera del sitio público).

## Technical Context

**Language/Version**: Java 21 (identificador SDKMAN `21.0.4-tem`); Bash/Zsh para scripts locales; contenido del sitio en Markdown (MkDocs Material, sitio ya gobernado por `uv`).

**Primary Dependencies**:
- Spring Boot **4.0.8** (última patch estable de la línea `4.0.x` a 2026-09-16; pin exacto en `pom.xml`). Verificar con `https://api.github.com/repos/spring-projects/spring-boot/releases` en el momento de ejecutar T005 y usar la más reciente disponible de la línea `4.0.x`.
- Starters `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`.
- Base de datos embebida `com.h2database:h2` (runtime).
- `springdoc-openapi-starter-webmvc-ui` **3.0.3** (línea `3.0.x` compatible con Spring Boot `4.0.x`; ver `research.md` R-002).
- Test: `spring-boot-starter-test` (arrastra JUnit 5 Jupiter, AssertJ, Mockito, MockMvc).

**Storage**: H2 en memoria (`jdbc:h2:mem:userdb`), esquema generado por Hibernate (`spring.jpa.hibernate.ddl-auto=create-drop`); constraint `UNIQUE` sobre `email` a nivel de columna JPA.

**Testing**: JUnit 5 (Jupiter) + `@SpringBootTest(webEnvironment = RANDOM_PORT)` con `MockMvc` (o `TestRestTemplate` para uno de los tests) + AssertJ. Test rojo del bug implementado como `assertThrows(NullPointerException.class, ...)`.

**Target Platform**: JDK 21 en macOS/Linux con SDKMAN operativo. Windows queda fuera de alcance (constitución delega en módulo Setup).

**Project Type**: Servicio backend Java Maven autónomo bajo `examples/user-crud-modern/`, publicado como material formativo dentro del monorepo `claude-code-sdd-java/`. Sin frontend propio; el sitio MkDocs consume documentación referida a la aplicación.

**Performance Goals**: N/A (aplicación de aula, sin objetivos de throughput). Objetivo pedagógico: primera petición NPE en menos de 10 minutos desde el clonado (SC-001).

**Constraints**:
- Sin credenciales reales; H2 sólo en memoria; sin secretos en el repo.
- `.sdkmanrc` obligatorio (Principio III de la constitución).
- El bug es intencional y NEVER debe reemplazarse por `throw new NullPointerException()` sintético.
- Suite de tests en verde en cada ejecución mientras el bug exista.
- `mkdocs build --strict` sin warnings tras integrar las páginas nuevas.
- Documento `BUG.md` presente en `examples/user-crud-modern/`, no enlazado desde el sitio.

**Scale/Scope**:
- 5 endpoints REST + 1 entidad + 3 DTOs (`CreateUserRequest`, `UpdateUserRequest`, `UserResponse`) + 1 mapper + 1 servicio + 1 repositorio + 1 `@RestControllerAdvice` (`GlobalExceptionHandler` extends `ResponseEntityExceptionHandler`, devuelve `ProblemDetail`) + 1 excepción de dominio + configuración OpenAPI + `Clock` bean.
- 3 páginas nuevas en `docs/app-ejemplo/` + entrada de navegación en `mkdocs.yml`.
- Suite: ~7–10 tests JUnit 5.
- Volumen del ejercicio: 1 clase formativa, 1 formador, 1–N alumnos ejecutando en local.

## Constitution Check

Evaluación contra `.specify/memory/constitution.md` (versión **1.0.2**). Gate: PASS.

| Principio / Norma | Aplica | Evidencia en el plan |
|---|---|---|
| **I. Documentación como Producto** (tono profesional-directo, tokens en `extra.css`, ejemplos ejecutables) | Sí (3 páginas en `docs/app-ejemplo/`) | Páginas redactadas con tono profesional-directo; sin CSS en línea; comandos `curl`/`httpie` reproducibles en cada página. Ver `quickstart.md` y `contracts/`. |
| **II. Java-Céntrico, Doble Tipología** (moderno + legacy; ejemplos con bug intencionado marcados y aislados) | Sí (perfil moderno) | Aplicación situada en `examples/user-crud-modern/` (aislada). Marcada explícitamente como "ejemplo con bug intencionado" en `README.md`, `BUG.md` y página "Reproducir el bug". |
| **III. Toolchain Reproducible vía SDKMAN** (`.sdkmanrc` obligatorio; sin asumir JDK/Maven preinstalados) | Sí | `.sdkmanrc` con `java=21.0.4-tem` y `maven=3.9.x`; `README.md` documenta `sdk env` como primer paso. Bloque "versión + fecha de verificación" añadido en la página de arranque de docs si declara la versión (norma semestral). |
| **IV. Spec-Driven Development como Método por Defecto** | Sí (esta feature) | Ciclo `/speckit-specify` → `/speckit-plan` (en curso) → `/speckit-tasks` → `/speckit-implement` registrado en `specs/004-user-crud-modern/`. |
| **V. Extensiones (Agentes/Skills) Documentadas** | No aplica aquí | Fuera de alcance por FR-020. Se abordará en spec futura. |
| **VI. Publicación Automatizada en GitLab Pages** | Sí (para las páginas nuevas) | El pipeline existente publica `docs/`. `mkdocs build --strict` se ejecuta como puerta antes de mergear cualquier cambio en `docs/`. |
| **Content constraints — `examples/` layout** | Sí | Nuevo subdirectorio `examples/user-crud-modern/` con su propio `.sdkmanrc`. |
| **Content constraints — Idioma español para docs** | Sí | Las 3 páginas de `docs/app-ejemplo/` se redactan en español; código y comandos en inglés. |
| **Content constraints — Sin credenciales** | Sí | H2 en memoria; `application.yml` sin secretos. |
| **Development & Publishing Workflow — Re-verificación semestral** | Sí (páginas que declaren versión) | Página "Cómo levantarla" incluirá bloque `!!! info "Versión de referencia — verificado 2026-09-16"` cuando cite `java=21.0.4-tem` o `maven=3.9.x`. |

Sin violaciones. Sin entradas en Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/004-user-crud-modern/
├── plan.md              # Este archivo
├── spec.md              # Ya existente
├── research.md          # Phase 0 (generado ahora)
├── data-model.md        # Phase 1 (generado ahora)
├── quickstart.md        # Phase 1 (generado ahora)
├── contracts/
│   └── users-api.yaml   # OpenAPI 3.1 del CRUD de usuarios
├── checklists/
│   └── requirements.md  # Ya existente
└── tasks.md             # Phase 2 — lo genera /speckit-tasks
```

### Source Code (repository root)

```text
examples/
└── user-crud-modern/                     # Nuevo subproyecto Java autónomo
    ├── .sdkmanrc                         # java=21.0.4-tem, maven=3.9.x
    ├── .gitignore                        # target/, *.class, .idea/, etc.
    ├── BUG.md                            # Interno formador (NO enlazado en docs)
    ├── README.md                         # Arranque, curl/httpie, tests
    ├── mvnw, mvnw.cmd, .mvn/             # Wrapper Maven 3.9.x
    ├── pom.xml                           # Spring Boot 4.0.x, Java 21, H2, springdoc
    └── src/
        ├── main/
        │   ├── java/com/sngular/formacion/usercrud/
        │   │   ├── UserCrudApplication.java
        │   │   ├── user/
        │   │   │   ├── User.java                       # @Entity
        │   │   │   ├── UserRepository.java             # JpaRepository
        │   │   │   ├── UserService.java                # normalización + persistencia (contiene el punto donde estalla el NPE)
        │   │   │   ├── UserMapper.java                 # DTO→Entity manual (falta setEmail — bug intencional)
        │   │   │   ├── UserController.java             # @RestController /users
        │   │   │   ├── UserSeeder.java                 # CommandLineRunner: siembra 1–2 usuarios sin pasar por el mapper
        │   │   │   └── dto/
        │   │   │       ├── CreateUserRequest.java      # @NotBlank + @Email + @Size
        │   │   │       ├── UpdateUserRequest.java      # ídem
        │   │   │       └── UserResponse.java
        │   │   ├── error/
        │   │   │   ├── GlobalExceptionHandler.java     # @RestControllerAdvice extends ResponseEntityExceptionHandler → ProblemDetail (RFC 7807) 400/404/409
        │   │   │   └── UserNotFoundException.java
        │   │   └── config/
        │   │       ├── OpenApiConfig.java              # metadata OpenAPI
        │   │       └── ClockConfig.java                # @Bean Clock.systemUTC() inyectable en UserService
        │   └── resources/
        │       ├── application.yml                     # H2 mem, JPA, springdoc
        │       └── application-dev.yml                 # (si aplica) Swagger UI dev-only
        └── test/
            ├── java/com/sngular/formacion/usercrud/
            │   ├── UserControllerHappyPathIT.java      # GET/PUT/DELETE happy path
            │   ├── UserControllerCreateBugIT.java      # POST /users → assertThrows NPE (bug conocido)
            │   ├── UserControllerValidationIT.java     # 400 en payloads inválidos
            │   ├── UserControllerConflictIT.java       # 409 desactivado por el bug; verificar shape del handler vía otra ruta (o test unitario del advice)
            │   └── UserMapperUnitTest.java             # Evidencia unitaria del email no asignado
            └── resources/
                └── application-test.yml                # (opcional) overrides de test

docs/
└── app-ejemplo/                          # Nueva sección del sitio (español)
    ├── index.md                          # Presentación + arquitectura + cómo levantarla
    ├── reproducir-bug.md                 # Pasos exactos, comando, stacktrace esperado
    └── depurando-con-claude.md           # Placeholder — se rellena en módulo SDD

mkdocs.yml                                # Añadir sección "App de ejemplo" en nav
```

**Structure Decision**: subproyecto Java autónomo bajo `examples/user-crud-modern/` con estructura Maven estándar (raíz `pom.xml`, `src/main/java`, `src/main/resources`, `src/test/java`), aislado del sitio MkDocs. La documentación formativa vive en `docs/app-ejemplo/` y referencia la aplicación por ruta relativa. El paquete raíz Java `com.sngular.formacion.usercrud` centraliza el código; los subpaquetes agrupan por rebanada (`user/`, `error/`, `config/`) para que el flujo del bug quede legible en el mapper. Este layout respeta el content constraint de repositorio (`examples/…` para proyectos Java, `docs/` para el sitio) y no toca el resto del monorepo.

## Complexity Tracking

Sin violaciones de constitución. Sin entradas.
