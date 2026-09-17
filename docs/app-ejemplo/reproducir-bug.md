# Reproducir el bug

!!! bug "Bug intencional"
    El endpoint `POST /users` de la aplicación de ejemplo devuelve `HTTP 500` con `NullPointerException` para cualquier payload sintácticamente válido. El fallo es determinista: se reproduce en el 100% de los intentos. Este comportamiento **está introducido a propósito** y es el punto de partida del módulo *Depurando con Claude*.

## Prerrequisitos

- Toolchain listo según [Setup del entorno → SDKMAN](../setup/sdkman.md).
- La aplicación `user-crud-modern` arrancada en `http://localhost:8080` — ver [Cómo levantarla](index.md#como-levantarla).

## Pasos

Con la aplicación arrancada, ejecutar en otra terminal:

```bash
curl -i -X POST http://localhost:8080/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana Torres","email":"ana.torres@example.com"}'
```

## Resultado esperado

La respuesta HTTP:

```text
HTTP/1.1 500
Content-Type: application/json
```

El cuerpo es la respuesta de error por defecto de Spring Boot (sin `@ExceptionHandler` genérico definido, a propósito).

## Traza esperada en el log

En el log de la aplicación aparece (fragmento representativo):

```text
2026-09-16T10:12:34.567 ERROR ... o.a.c.c.C.[.[.[/].[dispatcherServlet] : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed: java.lang.NullPointerException: Cannot invoke "String.toLowerCase(java.util.Locale)" because the return value of "com.sngular.formacion.usercrud.user.User.getEmail()" is null] with root cause
java.lang.NullPointerException: Cannot invoke "String.toLowerCase(java.util.Locale)" because the return value of "com.sngular.formacion.usercrud.user.User.getEmail()" is null
    at com.sngular.formacion.usercrud.user.UserService.normalizeEmail(UserService.java:56)
    at com.sngular.formacion.usercrud.user.UserService.create(UserService.java:27)
    at com.sngular.formacion.usercrud.user.UserController.create(UserController.java:35)
    ...
```

Los números de línea pueden variar ligeramente entre releases, pero la ruta clave siempre es:

- **Método visible en la traza**: `UserService.normalizeEmail`.
- **Método que lo invoca**: `UserService.create`.
- **Punto de entrada**: `UserController.create` (endpoint `POST /users`).

## Qué observar

1. La aserción del NPE menciona explícitamente que `User.getEmail()` devolvió `null`.
2. La traza señala el `UserService`, no el mapper.
3. El payload de entrada llevaba el `email` correcto — la validación Jakarta lo aceptó sin problemas.

Estos tres hechos juntos son la pista que arranca el ejercicio de depuración: **el service parece culpable pero el email vino informado, así que algo se pierde antes**. Ese "antes" es el mapper.

## Verificar que el resto del CRUD sigue vivo

```bash
curl -i http://localhost:8080/users
# → HTTP 200 con los dos usuarios sembrados (seed@example.com, second@example.com)

curl -i http://localhost:8080/users/1
# → HTTP 200 + UserResponse

curl -i -X PUT http://localhost:8080/users/1 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Seed Renombrado","email":"seed@example.com"}'
# → HTTP 200 + UserResponse actualizado
```

Este contraste refuerza que el problema está localizado en la creación.

## Siguientes pasos

- **[Depurando con Claude](depurando-con-claude.md)** — guion completo (≈18 min) para llegar de la traza a la causa raíz, aplicar el fix mínimo y dejar la suite verde.
