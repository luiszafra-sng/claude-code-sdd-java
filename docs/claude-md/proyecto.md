# Capa proyecto

El `CLAUDE.md` de la raíz del repositorio describe **cómo trabaja ese
proyecto en concreto**: tecnologías, convenciones, comandos, estructura
de carpetas, restricciones específicas. Aplica sólo cuando Claude Code
se ejecuta desde dentro del repositorio. Es la capa que
[gana ante contradicción](index.md#precedencia-entre-capas) frente a
la capa usuario.

## Qué meter en la capa proyecto

Contenido apropiado:

- **Tecnologías**: lenguaje y versión (JDK, Node, Python), framework
  principal, base de datos, gestor de paquetes, servidor de
  aplicaciones, herramientas de build.
- **Convenciones del código**: estilo, patrones, naming, límites por
  archivo o función, cuándo usar records / interfaces / DTOs.
- **Comandos build/test**: comandos exactos y copiables. `./mvnw
  spring-boot:run`, `uv run pytest`, etc.
- **Estructura de carpetas**: qué vive en `src/main/java/…`, en
  `docs/…`, en `.github/…`. Reglas de "no toques X".
- **Restricciones de seguridad**: qué no debe salir del repo (secretos,
  claves, PII), rutas gitignoreadas, patrones prohibidos.
- **Integraciones específicas**: servicios externos con los que habla
  el proyecto (identidad, mensajería, storage), cómo autenticarse en
  entornos de dev, dónde vive la config de esos servicios.

## Ejemplo: Spring Boot 4 + Java 21

`CLAUDE.md` de referencia para un microservicio moderno. Java 21 LTS,
Spring Boot 4.0.x, Maven wrapper, tests JUnit 5, Jakarta EE 9+.

```markdown
<!-- Redactado en 2026-09 -->

# CLAUDE.md — user-service (Spring Boot 4 + Java 21)

## Contexto

Microservicio HTTP de gestión de usuarios. REST + JSON. BBDD H2 en dev,
PostgreSQL 16 en pre y prod. Publicado como imagen Docker.

## Tecnologías

- Java 21 LTS (BellSoft Liberica, `21.0.4-librca`).
- Spring Boot 4.0.x, Spring Data JPA, Jakarta EE 9+ (`jakarta.*`).
- Maven 3.9.9 vía `./mvnw` (Maven wrapper).
- JUnit 5, AssertJ, Testcontainers para tests de integración.
- OpenAPI generado por `springdoc-openapi`.

## Convenciones

- Estructura por dominio: `com.example.user.<subdominio>` en lugar de
  layered por tipo.
- DTOs como `record`. Entidades JPA como `class` con constructor
  protegido.
- MUST usar `var` para variables locales cuando el tipo es evidente;
  NEVER en firmas públicas.
- Métodos MUST tener ≤ 25 líneas efectivas. Excepción: builders y
  configuraciones.
- Comentarios MUST limitarse a documentar API pública o invariantes no
  evidentes. NEVER comentarios que expliquen qué hace el código.
- Tests MUST estar en `src/test/java/<mismo paquete>` con sufijo `Test`
  para unitarios, `IT` para integración.

## Comandos

- Levantar en local: `./mvnw spring-boot:run`.
- Tests unitarios: `./mvnw test`.
- Tests integración: `./mvnw verify`.
- Empaquetar: `./mvnw package`.
- Imagen Docker: `./mvnw spring-boot:build-image`.

## Estructura

- `src/main/java/…` — código.
- `src/main/resources/application.yml` — config base.
- `src/main/resources/application-<perfil>.yml` — override por perfil.
- `src/test/java/…` — tests.
- `docs/adr/` — Architecture Decision Records; NEVER modificar ADRs
  publicados; MUST crear uno nuevo si cambias una decisión.

## Restricciones

- NEVER commitear credenciales. Cualquier valor sensible MUST venir de
  variables de entorno vía `SPRING_APPLICATION_JSON` o
  `application-<perfil>.yml` gitignoreado.
- NEVER exponer entidades JPA en el endpoint. MUST convertir a `record`
  DTO en la capa de controlador.
- NEVER usar `System.out` en código. MUST usar SLF4J vía Logback.
- MUST superar `./mvnw verify` antes de considerar cerrada cualquier
  tarea.

## Integraciones

- Auth: Keycloak (OIDC). Config en `application.yml` bajo `spring.security`.
- Mensajería: Kafka; topics declarados en `docs/topics.md`.
- Observabilidad: OpenTelemetry vía Micrometer.
```

## Ejemplo: legacy Spring Boot 2.7 + Java 8

`CLAUDE.md` de referencia para un proyecto legacy vivo. Java 8, Spring
Boot 2.7, `javax.*`, Maven clásico, sin features modernas de la JVM.
Sin patrones nuevos, con deuda técnica declarada.

```markdown
<!-- Redactado en 2026-09 -->

# CLAUDE.md — account-service (Spring Boot 2.7 + Java 8, legacy)

## Contexto

Microservicio en mantenimiento desde 2018. Se actualiza sólo con
parches de seguridad y correcciones críticas. Migración a Spring Boot
3+ / Jakarta EE 9+ **planificada pero no priorizada**; documentada
como deuda técnica en `docs/adr/0007-migracion-jakarta.md`.

## Tecnologías

- Java 8 (Oracle JDK 8u372 en pre/prod; OpenJDK 8 local vía
  `sdk install java 8.0.372-tem`).
- Spring Boot 2.7.x, Spring Data JPA con Hibernate 5.
- Jakarta EE no; **`javax.*`** (`javax.persistence`, `javax.validation`,
  `javax.servlet`).
- Maven 3.6 con `pom.xml` (sin wrapper). `mvn` global instalado en la
  máquina.
- JUnit 4 en tests existentes; JUnit 5 permitido para tests nuevos con
  `junit-jupiter-vintage-engine`.

## Convenciones

- Java 8: streams, lambdas y `Optional` sí. NEVER `record`, NEVER
  `var`, NEVER `sealed`, NEVER `switch` de expresión (Java 14+).
- Lombok activo (`@Data`, `@Builder`, `@Slf4j`). MUST mantener el
  estilo Lombok existente; NEVER convertir clases Lombok a POJO
  manualmente.
- DTOs como POJO Lombok. Entidades JPA con anotaciones `javax.persistence`.
- Métodos SHOULD tener ≤ 40 líneas (la base actual no cumple; regla
  aspiracional para código nuevo).
- Comentarios en el código existente son intocables; MUST no
  eliminarlos aunque parezcan redundantes.

## Comandos

- Levantar en local: `mvn spring-boot:run`.
- Tests: `mvn test`.
- Empaquetar: `mvn package`.
- Verificar Java 8 activo: `sdk env` y `java -version` debe indicar
  `1.8.0_372`.

## Estructura

- `src/main/java/com/example/account/…` — layered por tipo
  (`controller`, `service`, `repository`, `entity`, `dto`), estilo
  heredado.
- `src/main/resources/application.properties` (no YAML).
- `src/test/java/…` — mezcla JUnit 4 y JUnit 5.
- `docs/adr/` — ADRs históricos, algunos obsoletos; consultar antes de
  cambiar diseño.

## Restricciones

- NEVER migrar `javax.*` a `jakarta.*` sin discutirlo antes. La
  migración es un ejercicio separado, no un side-effect de otras
  tareas.
- NEVER subir Spring Boot ni Hibernate sin pruebas de compatibilidad
  con Java 8 y con la BBDD Oracle 11g de producción.
- NEVER usar features de Java 9+ (`Map.of`, `List.of`, `var`, etc.):
  romperían el build en Java 8.
- MUST correr `mvn test` en local antes de subir cualquier cambio.
- MUST justificar cualquier bump de dependencia en el commit message.

## Deuda técnica declarada

- Migración a Spring Boot 3+ / Jakarta EE 9+ (`docs/adr/0007-…`).
- Cobertura de tests < 40 %; SHOULD subir con cada cambio nuevo, no
  como esfuerzo aislado.
- Ausencia de módulos JPMS; no aplica hasta migrar a Java 11+.
- Sin OpenAPI generado; documentación manual en `docs/api.md`.
```

## CLAUDE.md del repositorio de la formación

Además de los dos snippets anteriores, este repositorio publica su
propio `CLAUDE.md` en la raíz. Es un ejemplo vivo: describe cómo
trabajar sobre el sitio de formación con Claude Code (uso de `uv`,
MkDocs `--strict`, flujo Speckit, tono profesional-directo,
restricciones sobre `docs/stylesheets/extra.css`).

- Ruta del archivo en el repositorio: `CLAUDE.md` (raíz del proyecto,
  al mismo nivel que `mkdocs.yml` y `pyproject.toml`).

!!! warning "Archivo vivo — puede divergir del módulo"
    Este `CLAUDE.md` es el archivo real que Claude Code lee cuando
    trabaja sobre este repositorio. Puede haber evolucionado desde la
    publicación de este módulo (nuevas convenciones, ajustes a la
    constitution, etc.). Si detectas divergencias notables con los
    snippets estáticos de esta página, la fuente autorizada es el
    archivo vivo.
