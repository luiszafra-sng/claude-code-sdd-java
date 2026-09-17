# SDD en greenfield: arrancar un proyecto Java nuevo con Speckit

Empezar un proyecto Java con Speckit desde el día uno da tres ventajas: las
convenciones nacen documentadas, el equipo aprende el ciclo con features
pequeñas antes de que crezca el coste, y la trazabilidad entre requisitos y
código existe por defecto (no como retrofit). Esta página describe el orden
recomendado, el contenido mínimo de `CLAUDE.md` y `constitution.md`, y cuándo
crear tu primer agente específico.

## Punto de partida: proyecto Java nuevo

Repositorio recién creado, decisiones de stack ya tomadas (por ejemplo Spring
Boot 4 + Java 21 + PostgreSQL), CI vacía, cero features implementadas. La
tentación es maquetar el skeleton con `spring initializr` y arrancar a picar
código; el orden que recomendamos es distinto:

1. **Instalar Claude Code y Speckit** — ver [Setup del entorno](../setup/index.md).
2. **Redactar `CLAUDE.md` inicial** — sección siguiente. No hace falta que
   sea perfecto; sí que refleje decisiones ya tomadas.
3. **Ejecutar `/speckit-constitution`** — con los principios mínimos abajo.
4. **Primera spec: "setup del skeleton"** — usa Speckit para bootstrapear el
   proyecto. Esto entrena al equipo con una feature acotada.
5. **A partir de aquí, cada feature va por el ciclo Speckit completo.**

## `CLAUDE.md` inicial

`CLAUDE.md` es lo primero que lee Claude cuando abre el repo. En un proyecto
nuevo debe contener sólo lo que ya es cierto o ya está decidido. No aspiraciones.

Plantilla mínima:

```markdown
# CLAUDE.md — <Nombre del proyecto>

## Contexto

Breve descripción del proyecto: dominio, tipo (API, batch, backend web…),
audiencia (interno, externo, mixto).

## Stack

- Lenguaje: Java 21 (Temurin, vía SDKMAN).
- Framework: Spring Boot 4.
- Build: Maven 3.9.x (`./mvnw`).
- BBDD: PostgreSQL 16 en producción; H2 en memoria para tests.
- Testing: JUnit 5 + MockMvc + Testcontainers para tests de integración.

## Convenciones

- Records para DTOs y value objects. Clases sólo para entidades JPA.
- `ProblemDetail` (RFC 7807) para errores 4xx/5xx.
- Nombres en inglés en código; comentarios y commits en español.

## Comandos habituales

- `./mvnw test` — suite completa.
- `./mvnw spring-boot:run` — arrancar en local.
- `docker compose up -d db` — PostgreSQL local.

## Restricciones para Claude Code

- **Flujo Speckit obligatorio** para features no triviales.
- **No commitear** ficheros bajo `.env*` ni credenciales.
- **No introducir dependencias nuevas** sin justificación en `plan.md`.
```

Notas:

- Si no sabes qué convención adoptar para algo, **no lo escribas**. Añádelo
  cuando el equipo tome la decisión formal (idealmente vía spec).
- Cross-references a otras páginas del repo (por ejemplo `docs/ARCHITECTURE.md`)
  se enlazan aquí para que Claude tenga el pointer.

## Constitution mínima

`/speckit-constitution` crea `.specify/memory/constitution.md`. En un proyecto
nuevo, apunta bajo:

```markdown
# <Nombre del proyecto> — Constitution

## Core Principles

### I. Contrato antes que código
Cualquier API pública nace de un contrato OpenAPI versionado en `contracts/`.
El código se genera o valida contra el contrato, nunca al revés.

### II. Tests son parte del entregable
No hay merge sin tests que cubran los criterios de aceptación de la spec.
La suite corre en CI en cada commit.

### III. Toolchain reproducible
JDK y Maven vía SDKMAN, versiones fijadas en `.sdkmanrc`. No se aceptan
instrucciones que asuman "ya tienes X instalado".

### IV. Spec-Driven Development como método por defecto
Features no triviales atraviesan `/speckit-specify → /speckit-plan →
/speckit-tasks → /speckit-implement`. Excepciones: spikes, hotfixes,
prototipos (ver docs/sdd/index.md#cuando-no-usar-sdd).

## Governance

Esta constitution prevalece sobre convenciones informales. Enmiendas por PR
que edite este fichero e incluya justificación del bump (MAJOR/MINOR/PATCH).

Version: 0.1.0 | Ratified: YYYY-MM-DD | Last Amended: YYYY-MM-DD
```

Cuatro principios, redactados en presente, con "rationale" implícito por
principio. Amplíala sólo cuando cambie una política estructural (nuevo
lenguaje, nueva restricción legal, nuevo entorno de despliegue).

## Cuándo crear agentes específicos

Un [agente](../agentes/index.md) tiene sentido en greenfield cuando ya has
identificado un patrón de trabajo repetitivo que Claude Code hace con
cualquier prompt pero que se beneficiaría de contexto persistente. Ejemplos:

- **`api-first-agent`**: agente que ejecuta el ciclo Speckit forzando siempre
  contract-first (parte del OpenAPI antes que del código). Útil si el equipo
  tiende a dejar el contract para el final.
- **`java-legacy-analyst`**: no aplica en greenfield puro; sí si sabes que en
  6 meses el proyecto va a absorber módulos legacy.
- **`db-migration-reviewer`**: revisa migraciones Flyway/Liquibase antes de
  merge. Justifica su existencia sólo si hay volumen suficiente.

Regla de arranque: **no crees agentes en la primera semana**. Deja que el
equipo use Claude Code plano hasta que aparezca el patrón repetitivo. Crear
un agente por adelantado ata el flujo a decisiones que aún no has validado.

## Orden recomendado de specs

En un proyecto nuevo, el orden en que apilas features cambia el ritmo de
adopción. Recomendación:

1. **`001-setup-skeleton`**: crear el skeleton Spring Boot con
   `spring-boot-starter-web`, health check, primer test de integración,
   pipeline CI mínimo. Feature pequeña, entrena al equipo con Speckit.
2. **`002-<entidad-central>`**: la entidad de dominio principal (por ejemplo
   `User`, `Order`, `Invoice`) con CRUD básico. Fija patrón de capas, DTOs,
   validación, mapping.
3. **`003-<entidad-relacionada>`**: segunda entidad con relación con la
   primera. Introduce transacciones, integridad referencial.
4. **`004-first-integration`**: primer punto de integración con un servicio
   externo (payment gateway, correo, storage). Introduce cliente HTTP,
   circuit breaker o retry, manejo de errores.
5. **`005-observability`**: métricas Prometheus, logs estructurados, health
   checks avanzados. No lo dejes para "cuando falle en prod".
6. **`006-security-baseline`**: autenticación, autorización básica,
   rate limiting. Se separa por scope; no lo mezcles con la primera CRUD.

Este orden garantiza que las decisiones estructurales (capas, DTOs,
transacciones, errores, observabilidad) se toman con specs pequeñas y
específicas, no como afterthought de una feature grande.

## Enlaces relacionados

- [Flujo Speckit paso a paso](flujo.md) — referencia de comandos.
- [Brownfield](brownfield.md) — el otro escenario de adopción.
- [Setup del entorno](../setup/index.md) — instalación de herramientas.
- [CLAUDE.md](../claude-md/index.md) — cómo estructurar la capa proyecto.
- [Agentes](../agentes/index.md) — cuándo crear agentes propios.
- [Skills](../skills/index.md) — skills reutilizables sobre Speckit.

!!! info "Versión de referencia"

    - **Speckit**: 1.0.4
    - **Claude Code**: 2.x (LTS actual)
    - **SDKMAN**: 5.19.x
    - **JDK**: 21 (Temurin)
    - **Maven**: 3.9.x
    - **Spring Boot**: 4.0.x
    - **Verificado**: 2026-09-16
