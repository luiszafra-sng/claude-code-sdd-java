# Quickstart: `user-crud-modern`

Guía de validación de extremo a extremo. Referencia rápida para verificar que la aplicación reproduce el estado esperado por la feature (happy path verde en `GET`/`PUT`/`DELETE`, bug NPE reproducible en `POST /users`, docs integradas, suite de tests en verde).

## Prerrequisitos

- SDKMAN instalado y operativo. (Ver [módulo Setup](../../../docs/setup/) si no lo tienes).
- Bash o Zsh.
- Git para clonar el repo.
- Opcional: `httpie` (`brew install httpie` / `apt install httpie`).

## Setup

```bash
cd examples/user-crud-modern
sdk env install    # instala Java 21.0.4-tem y Maven 3.9.x según .sdkmanrc
sdk env            # activa las versiones en la shell actual
```

Verificar:

```bash
java -version      # debe imprimir 21 (Temurin)
mvn -v             # debe imprimir 3.9.x
```

## Arranque de la aplicación

```bash
./mvnw spring-boot:run
```

La aplicación levanta en `http://localhost:8080`. Swagger UI en `http://localhost:8080/swagger-ui/index.html`. OpenAPI JSON en `http://localhost:8080/v3/api-docs`.

## Validación 1 — Reproducir el bug (US1)

```bash
curl -i -X POST http://localhost:8080/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana Torres","email":"ana.torres@example.com"}'
```

**Resultado esperado**: `HTTP/1.1 500`. En el log de la aplicación aparece un `NullPointerException` cuya traza incluye una línea de `UserService` correspondiente a la normalización del email. La página `docs/app-ejemplo/reproducir-bug.md` incluye el fragmento representativo del stacktrace.

Repetir varias veces con distintos payloads válidos: el fallo se reproduce siempre.

## Validación 2 — Payloads inválidos (Edge cases)

```bash
# email malformado
curl -i -X POST http://localhost:8080/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana","email":"no-es-un-email"}'
# → HTTP 400 (application/problem+json) + ProblemDetail con code:VALIDATION_ERROR y fieldErrors:[{field:"email", ...}]

# name vacío
curl -i -X POST http://localhost:8080/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"","email":"a@b.com"}'
# → HTTP 400
```

## Validación 3 — Happy path del resto del CRUD (US3)

El bug bloquea `POST /users`, así que los datos se siembran vía `CommandLineRunner` al arrancar. Si tras iniciar la app se ha creado el usuario `seed@example.com` con id `1`:

```bash
# Listar
curl -i http://localhost:8080/users
# → HTTP 200 + colección con al menos 1 usuario

# Obtener por id
curl -i http://localhost:8080/users/1
# → HTTP 200 + UserResponse{id:1, ...}

# Actualizar
curl -i -X PUT http://localhost:8080/users/1 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Seed Renombrado","email":"seed@example.com"}'
# → HTTP 200 + UserResponse actualizado

# 404 en id inexistente
curl -i http://localhost:8080/users/9999
# → HTTP 404 (application/problem+json) + ProblemDetail con code:USER_NOT_FOUND

# Borrar
curl -i -X DELETE http://localhost:8080/users/1
# → HTTP 204
```

Alternativa con `httpie`:

```bash
http :8080/users
http :8080/users/1
http PUT :8080/users/1 name="Nuevo" email=seed@example.com
http DELETE :8080/users/1
```

## Validación 4 — Suite de tests (US5)

```bash
./mvnw test
```

**Resultado esperado**: suite entera en verde. Salida incluye:

- `UserControllerHappyPathIT` — tests GET/PUT/DELETE happy path en verde.
- `UserControllerValidationIT` — tests 400 en verde.
- `UserControllerCreateBugIT.createUser_currentlyThrowsNPE_bugKnown` — en verde (`assertThrows` sobre el NPE).
- `UserMapperUnitTest.toEntity_currentlyOmitsEmail_bugKnown` — en verde (`assertThat(entity.getEmail()).isNull()`).

## Validación 5 — Documentación en el sitio (US4)

Desde la raíz del monorepo:

```bash
uv sync
uv run mkdocs serve
```

Abrir `http://127.0.0.1:8000/claude-code-sdd-java/app-ejemplo/`. Verificar:

- Aparece la sección "App de ejemplo" en la navegación.
- Existen las tres páginas: presentación/arquitectura, "Reproducir el bug", "Depurando con Claude" (placeholder).
- `BUG.md` **no** aparece indexado ni enlazado desde ninguna página pública.

Build reproducible:

```bash
uv run mkdocs build --strict
```

**Resultado esperado**: finaliza sin warnings.

## Validación 6 — Referencias formador (`BUG.md`)

```bash
cat examples/user-crud-modern/BUG.md
```

**Resultado esperado**: documento con síntoma, ubicación de la causa raíz (`UserMapper.toEntity`), explicación del mecanismo del NPE, fix esperado en 1–3 líneas y comando de validación del fix.

## Cierre

La feature se considera lista cuando las 6 validaciones anteriores pasan y el checklist de calidad `checklists/requirements.md` sigue en verde tras el `implement`.
