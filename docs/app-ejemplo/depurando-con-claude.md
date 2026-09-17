# Depurando con Claude

Sesión guiada para diagnosticar y arreglar el bug de `POST /users` con la ayuda de **Claude Code**. Objetivo: llegar del stacktrace a la causa raíz real (una línea que falta en el mapper), aplicar el fix mínimo y dejar la suite de tests protegiéndolo. Sin refactors amplios, sin parches defensivos.

!!! tip "Cuándo abrir esta página"
    Después de haber reproducido el bug siguiendo [Reproducir el bug](reproducir-bug.md). Ten la aplicación arrancada y Claude Code abierto en el proyecto.

## Prerrequisitos

- Toolchain listo (JDK 21, Maven 3.9.11) — ver [Setup del entorno → SDKMAN](../setup/sdkman.md).
- Aplicación arrancada según [Cómo levantarla](index.md#como-levantarla).
- Bug reproducido con el `curl` de [Reproducir el bug](reproducir-bug.md) y stacktrace visible en el log.
- **Claude Code** operativo con el proyecto abierto — ver [Setup del entorno → Claude Code](../setup/claude-code.md).
- Opcional pero recomendado: [CodeGraph](../setup/codegraph.md) indexado (`codegraph init` en la raíz del monorepo). Permite saltar de la traza al mapper en un único query.

## Guion de la sesión (≈ 20 minutos)

### 1. Reproducir y capturar (2 min)

Con la aplicación arrancada, ejecuta:

```bash
curl -i -X POST http://localhost:8080/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana Torres","email":"ana.torres@example.com"}'
```

Verás `HTTP/1.1 500`. En el log de la aplicación aparece el `NullPointerException`. **Copia el bloque completo del stacktrace** (desde `java.lang.NullPointerException:` hasta el final del `Caused by:` más profundo). Pégalo entero a Claude en el siguiente paso.

### 2. Primer prompt a Claude (2 min)

Prompt efectivo (obliga a Claude a leer código antes de opinar):

```text
Este stacktrace lo genera POST /users en la aplicación abierta.
Antes de proponer nada: lee UserController.create, UserService.create y UserService.normalizeEmail
y dime qué hace cada uno. Después, sólo entonces, propón dónde puede estar la causa.

[pegar aquí el stacktrace completo]
```

Contraejemplo — prompt pobre:

```text
Se me cae con NPE en Spring, arréglalo.
```

Con el pobre, Claude improvisa: sugiere `Optional`, `if (email != null)` en el service, o `try/catch (NullPointerException)`. Nada de eso arregla el bug real.

### 3. Guiar el diagnóstico (5 min)

Claude leerá los tres métodos y dirá algo como *"el service asume que `user.getEmail()` no es null; conviene verificar dónde se asigna"*. Refuerza esa línea:

```text
De acuerdo: si el service asume no-null, ¿dónde se asigna user.email en el flujo
que arranca en UserController.create? Sigue la creación del User desde el DTO.
```

Con CodeGraph:

```text
Usa codegraph_explore con "UserMapper.toEntity" y muéstrame el código verbatim.
```

Sin CodeGraph, pídele que abra el fichero por ruta: `src/main/java/com/sngular/formacion/usercrud/user/UserMapper.java`.

### 4. Llegar a la causa raíz (3 min)

Al leer `UserMapper.toEntity(CreateUserRequest)`, Claude debe notar que sólo asigna `name` y devuelve el `User` sin tocar `email`. Ésa es la causa: el DTO trae el email correcto, pero el mapper no lo transfiere a la entidad, así que el `normalizeEmail` del service estalla al invocar `toLowerCase` sobre `null`.

Confirma con una pregunta cerrada:

```text
Entonces el síntoma está en normalizeEmail pero la causa está en toEntity, ¿correcto?
Confírmalo señalando la línea concreta que falta.
```

### 5. Aplicar el fix mínimo (2 min)

Pide a Claude un cambio de una línea:

```text
Propón el fix mínimo — una sola línea añadida en UserMapper.toEntity — sin tocar nada más.
No introduzcas Optional, ni chequeos, ni refactor.
```

El fix esperado:

```java
public User toEntity(CreateUserRequest request) {
    User user = new User();
    user.setName(request.name());
    user.setEmail(request.email());   // ← línea añadida
    return user;
}
```

### 6. Verificar con la suite (3 min)

Antes de aplicar el cambio, ejecuta el test unitario que documenta el bug:

```bash
./mvnw -Dtest=UserMapperUnitTest test
```

Pasa en verde. **Verde con el bug vivo** — el test afirma que `entity.getEmail()` es `null`.

Aplica la línea del fix. Vuelve a ejecutar el mismo test:

```bash
./mvnw -Dtest=UserMapperUnitTest test
```

Ahora **falla en rojo** — el test seguía afirmando `null` pero el mapper ya asigna el email. Ese rojo es la señal de que el bug ha muerto.

Reescribe el test para el nuevo comportamiento:

```java
@Test
void toEntity_assignsNameAndEmail() {
    CreateUserRequest request = new CreateUserRequest("Ana Torres", "ana.torres@example.com");
    User entity = mapper.toEntity(request);
    assertThat(entity.getName()).isEqualTo("Ana Torres");
    assertThat(entity.getEmail()).isEqualTo("ana.torres@example.com");
}
```

Haz lo mismo con `UserControllerCreateBugIT`: sustituir `assertThatThrownBy(...).hasRootCauseInstanceOf(NullPointerException.class)` por `mockMvc.perform(post("/users")...).andExpect(status().isCreated())`.

Ejecuta la suite completa:

```bash
./mvnw test
```

Todo verde. Fin de sesión.

### 7. Confirmar con `curl` (1 min)

Con la aplicación reiniciada:

```bash
curl -i -X POST http://localhost:8080/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana Torres","email":"ana.torres@example.com"}'
```

Ahora responde `HTTP/1.1 201 Created` con `Location: /users/{id}` y el `UserResponse` en el cuerpo.

## Buenas prácticas

- **Leer código antes de parchear**: la primera acción con Claude es abrir los ficheros de la traza y explicarlos. Prohíbe respuestas del tipo "prueba esto y mira si funciona".
- **Fix mínimo**: una línea si basta una línea. Añadir `Optional`, `if != null`, `try/catch` o MapStruct "de paso" contamina la revisión y no arregla la causa.
- **Test verificable**: cada cambio va acompañado de un test que estaba rojo antes y queda verde después (o al revés, como aquí). Sin test, el fix no se demuestra.
- **Nombres que documentan intención**: los tests que conviven con un bug conocido lo dicen en su nombre (patrón `*_bugKnown`). Cuando el bug muere, se renombran.
- **Trazabilidad**: en el commit deja qué prompt orientó a Claude o al menos qué hipótesis descartaron el diagnóstico antes de llegar al fix.
- **Preguntas cerradas para confirmar**: cuando crees que Claude ha llegado a la causa, pregúntaselo en forma cerrada (`"entonces la causa es X, ¿correcto?"`). Fuerza a comprometerse con un sí/no.

## Malas prácticas — a evitar durante la sesión

- **"Arréglame esto"** como primer prompt: Claude improvisa un parche plausible y superficial. Sin contexto ni lectura, el fix suele desplazar el bug, no eliminarlo.
- **Aceptar `if (email != null)` en el service**: el `email` sigue siendo `null` al persistir; la constraint `NOT NULL` de la BD hace explotar el `save`. Bug movido, no muerto.
- **Envolver en `Optional`**: no evita el NPE si el `Optional` viene vacío. Añade ceremonia sin resolver la causa.
- **`try/catch (NullPointerException)`**: el usuario ve `500` sin traza útil; el bug queda vivo y silencioso.
- **Refactor amplio "de paso"**: introducir MapStruct, rehacer el `@RestControllerAdvice` o inyectar un `Validator` distinto. Nada resuelve el NPE y todo dispersa la revisión.
- **Pedir varias respuestas en paralelo**: "dame tres formas de arreglarlo". Empujas a Claude hacia respuestas variadas por variar; termina con soluciones defensivas para "cubrirse".
- **Ignorar la traza**: cualquier propuesta que no señale al fichero y método concretos que muestra el stacktrace es una hipótesis, no un diagnóstico.

## Después del fix

- Reescribe los dos tests con sufijo `*_bugKnown` a happy path (mostrado arriba).
- Revisa el `README.md` del subproyecto y elimina el aviso "contiene un bug intencional" si el fix pasa a formar parte del código base de referencia. Si el ejemplo se conserva con bug para futuras ediciones de la formación, revierte el fix y deja los tests como estaban.
- Considera indexar el proyecto con CodeGraph si aún no lo estaba: para próximas sesiones, `codegraph_explore` acorta el paso 3 (llegar del síntoma a la causa) de 5 min a 30 s.

## Resumen

| Fase | Duración | Salida esperada |
|---|---|---|
| Reproducir + capturar | 2 min | Stacktrace completo copiado |
| Primer prompt | 2 min | Claude leyendo los 3 métodos citados |
| Guiar diagnóstico | 5 min | Claude propone leer el mapper |
| Causa raíz | 3 min | Línea concreta identificada en `UserMapper.toEntity` |
| Fix mínimo | 2 min | 1 línea añadida al mapper |
| Verificación | 3 min | Suite verde, tests `*_bugKnown` reescritos |
| Confirmación curl | 1 min | `HTTP 201 Created` con `Location` |

Tiempo total ≈ 18 min. Si tardas más, revisa las malas prácticas de arriba — probablemente entraste en una de ellas.
