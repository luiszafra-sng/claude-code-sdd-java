# Crear uno

Guía práctica para construir tu primer agente. Como caso guía usamos
`spring-boot-debugger`, el agente incluido en `.claude/agents/` de
este repo. Al final encontrarás una transcripción reducida de su
invocación sobre el bug NPE del CRUD de la app de ejemplo.

!!! info "Perfil cubierto"
    El agente que construimos aquí cubre el perfil **moderno**
    (Spring Boot 4 + Java 21). La variante legacy queda fuera de
    alcance de esta página; se propone como ejercicio en el módulo de
    proyectos legacy.

## Paso 1 — Decide el slug y ubicación

- Slug en `kebab-case`, único dentro de la ubicación elegida.
- Ubicación:
  - `~/.claude/agents/` si es personal.
  - `.claude/agents/` si es del proyecto (opción de este repo, ver
    [Alcance](alcance.md)).
- Nombre de archivo = `<slug>.md`; debe coincidir con `name:`.

En nuestro ejemplo: `.claude/agents/spring-boot-debugger.md`.

## Paso 2 — Redacta la description

Una línea, ≤160 caracteres, describiendo cuándo invocar al agente. Es
la base que Claude Code usa para el enrutado automático.

```yaml
description: Diagnostica errores en apps Spring Boot 4 + Java 21 (mapping DTO/entidad, validación, ciclo Spring); propone diff mínimo tras reproducir con test.
```

Evita adjetivos vacíos ("potente", "increíble"): añaden ruido y no
ayudan al enrutado.

## Paso 3 — Escoge modelo

Consulta la tabla de [Memoria y modelos](memoria-modelos.md). Para
diagnóstico dirigido con contexto acotado, `sonnet` es el baseline
correcto. Anota el alias corto, no el ID de versión, para sobrevivir
a bumps menores:

```yaml
model: sonnet
```

## Paso 4 — Declara herramientas mínimas

Enumera sólo las estrictamente necesarias. En nuestro caso, el agente
debe leer código (`Read`, `Grep`, `Glob`), ejecutar Maven (`Bash`) y
aplicar el diff (`Edit`). No necesita `Write` (edita archivos ya
existentes salvo un nuevo test, que también entra por `Edit`).

```yaml
tools: Read, Grep, Glob, Bash, Edit
```

## Paso 5 — Escribe el prompt del sistema

Estructura el prompt en **cuatro pasos** para el ciclo de trabajo,
declara **edge cases** y fija **criterios de cierre**. La versión
completa vive en `.claude/agents/spring-boot-debugger.md` del repo y
encaja con este esqueleto:

```markdown
# spring-boot-debugger

## Alcance
- Spring Boot 4 + Java 21; wrapper `./mvnw`; H2 en memoria.
- Legacy fuera de alcance.

## Ciclo de trabajo
### 1. Localizar el stacktrace
### 2. Reproducir con test
### 3. Proponer diff mínimo
### 4. Ejecutar tests

## Edge cases
- Proyecto sin build previo → pedir `./mvnw -q -DskipTests package`.
- Bug ya resuelto → no proponer diff.
- Diff que rompe otro test → volver al paso 3.

## Criterios de cierre
Stacktrace localizado + test reproductor + diff aplicado + `./mvnw test` en verde.
```

Regla: nunca cierres tu intervención con tests en rojo.

## Paso 6 — Commit al repo (si es de proyecto)

Como el agente es material del repo, commiteálo junto al resto de
cambios de la feature. Revisión por MR como cualquier código.

```bash
git add .claude/agents/spring-boot-debugger.md
git commit -m "feat(agentes): añade spring-boot-debugger"
```

## Paso 7 — Verifica

Antes de invocarlo por primera vez, comprueba el frontmatter:

```bash
head -n 10 .claude/agents/spring-boot-debugger.md
```

Debe mostrar `name`, `description`, `model: sonnet` y `tools` en el
orden declarado.

## Invocación sobre el bug del CRUD

Con la app CRUD del repo [luiszafra-sng/user-crud-modern](https://github.com/luiszafra-sng/user-crud-modern) levantada (`./mvnw spring-boot:run` en la raíz del clon),
reproduce el bug con:

```bash
curl -i -X POST http://localhost:8080/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ana Torres","email":"ana.torres@example.com"}'
```

La respuesta es `HTTP 500` con un `NullPointerException` en el log.
Copia el stacktrace y pide en Claude Code:

> Usa el agente `spring-boot-debugger` para diagnosticar este error.

### Transcripción reducida

````markdown
[usuario]
Usa el agente `spring-boot-debugger`. NPE al hacer POST /users:
java.lang.NullPointerException: Cannot invoke "String.toLowerCase(...)" because "user.getEmail()" is null
  at com.sngular.formacion.usercrud.user.UserService.normalizeEmail(UserService.java:47)
  at com.sngular.formacion.usercrud.user.UserService.create(UserService.java:33)

[spring-boot-debugger — paso 1: localizar]
El stacktrace apunta a UserService.normalizeEmail:47, línea
user.setEmail(user.getEmail().toLowerCase(Locale.ROOT)). El síntoma
está ahí, pero user.getEmail() no debería ser null tras el mapping.
Reviso UserMapper.toEntity (Grep sobre user/UserMapper.java): sólo
asigna name, nunca email. Causa raíz: UserMapper.toEntity, línea 12.

[spring-boot-debugger — paso 2: reproducir con test]
Creo test/java/.../user/UserMapperReproducesBugTest.java con
UserMapper mapper = new UserMapper();
User u = mapper.toEntity(new CreateUserRequest("Ana","ana@example.com"));
assertThat(u.getEmail()).isEqualTo("ana@example.com");
Ejecuto ./mvnw -q -Dtest=UserMapperReproducesBugTest test.
Resultado: FALLA con expected "ana@example.com" but was null. Bug
reproducido.

[spring-boot-debugger — paso 3: diff propuesto]
```diff
--- a/src/main/java/com/sngular/formacion/usercrud/user/UserMapper.java
+++ b/src/main/java/com/sngular/formacion/usercrud/user/UserMapper.java
@@
 public User toEntity(CreateUserRequest request) {
     User user = new User();
     user.setName(request.name());
+    user.setEmail(request.email());
     return user;
 }
```
Cambio mínimo, un archivo, sin refactor colateral. ¿Aplico?

[usuario]
Aplícalo.

[spring-boot-debugger — paso 4: ejecutar tests]
Aplicado con Edit. Ejecuto ./mvnw test.
Resultado: BUILD SUCCESS. UserMapperReproducesBugTest pasa; ninguno de
los 32 tests existentes queda en rojo.
Cierro intervención: causa raíz identificada, test regresivo añadido,
fix aplicado, suite en verde.
````

## Qué queda como ejercicio

- Renombrar el test creado por el agente a un nombre más descriptivo
  siguiendo la convención del proyecto.
- Adaptar los tests existentes que documentaban el bug (por ejemplo,
  `UserMapperUnitTest.toEntity_currentlyOmitsEmail_bugKnown`) al nuevo
  comportamiento esperado. Está detallado en el módulo
  [App de ejemplo → Depurando con Claude](../app-ejemplo/depurando-con-claude.md).

## Cierre del módulo

Con esto tienes: teoría de agentes, catálogo verificado y experiencia
construyendo uno propio funcional. El siguiente módulo natural es
[SDD con Speckit](../sdd/index.md), que aplica agentes dentro del
flujo de especificación dirigida.
