# Buenas prácticas

Un `CLAUDE.md` bien redactado convierte instrucciones vagas en un
contrato que Claude Code puede aplicar de forma consistente. Esta
página resume el patrón de redacción y muestra, sobre una tarea
concreta, cómo se pasa de un `CLAUDE.md` pobre a uno útil.

## Reglas ejecutables por el LLM

Una regla es **ejecutable** cuando cualquier revisor (humano o LLM)
puede decidir sin ambigüedad si se ha cumplido. Para llegar ahí,
sustituye adjetivos por verbos imperativos y añade un criterio de
aceptación observable.

Patrón:

```text
<SUJETO> MUST | NEVER | SHOULD <acción medible> <criterio de aceptación>.
```

- **MUST** — obligación fuerte. Si no se cumple, se considera un fallo.
- **NEVER** — prohibición fuerte. Si se cumple, se considera un fallo.
- **SHOULD** — obligación blanda. Se puede saltar si hay justificación
  explícita.

Ejemplos:

- Vago: "el código debe ser limpio".
- Ejecutable: "las funciones MUST tener ≤ 20 líneas efectivas y MUST
  hacer una sola cosa (regla del single responsibility)".

- Vago: "cuidado con los tests".
- Ejecutable: "MUST superar `./mvnw verify` antes de considerar
  cerrada cualquier tarea; NEVER usar `@Disabled` sin enlazar a la
  incidencia que lo justifica".

- Vago: "no toques cosas de las que no estés seguro".
- Ejecutable: "NEVER modificar archivos fuera del scope declarado en
  `tasks.md`; MUST anunciar cualquier cambio adicional y esperar
  confirmación".

Aplicado a este módulo, los cuatro pilares que un `CLAUDE.md` de
proyecto debería cubrir son:

- **Minimalismo** — SHOULD proponer cambios localizados; NEVER
  refactorizar áreas no pedidas explícitamente; NEVER añadir features
  especulativas.
- **Clean code aplicable** — MUST respetar convenciones del proyecto
  aunque difieran de las preferencias personales; MUST nombrar
  funciones y variables por intención; NEVER dejar código muerto.
- **Tests como criterio de verificación** — MUST correr los tests
  relevantes antes de dar por cerrada una tarea; SHOULD proponer
  cobertura nueva cuando cambies lógica de dominio.
- **Prohibir cambios fuera de scope** — MUST ceñirse a los archivos
  declarados en la spec/tarea; MUST enumerar cualquier cambio
  colateral necesario y pedir OK antes de aplicarlo.

Referencia externa útil como inspiración de estilo:
[multica-ai/andrej-karpathy-skills/CLAUDE.md](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md).

## Comparativa Antes / Después

La misma tarea — **"refactorizar el módulo de autenticación de un
backend Java"** — se aborda con dos `CLAUDE.md` distintos. Ambos están
escritos por un equipo real; el primero es plausible (no una
caricatura), el segundo aplica el patrón de reglas ejecutables.

### Antes

```markdown
<!-- Redactado en 2026-09 -->

# CLAUDE.md — auth-service

Este microservicio hace autenticación.

## Cómo trabajar

Queremos código limpio y bien testeado. Intentamos no complicar las
cosas. Si tienes que hacer refactor, hazlo con cabeza y no te metas
donde no toca.

Los tests son importantes, pásalos antes de subir. Cuidado con las
credenciales, no las dejes por ahí.

Las funciones deben ser cortas. Sigue el estilo del proyecto. Si ves
algo raro en el código, arréglalo. Si hay algo que no entiendes,
pregunta antes de tocarlo.

Utilizamos Spring y Maven. Tenemos varios entornos, así que ten
cuidado con lo que subes.

## Notas del equipo

Tenemos un chat de Slack para dudas rápidas. La documentación de
arquitectura está por ahí en Confluence, en la sección que llevamos
años sin actualizar. El PM es Fulanito y el arquitecto es Menganito.

Estamos en sprint 42, cerrando la épica de renovación de tokens.
Menganito prefiere que se piense el diseño antes de picar. Fulanito
prefiere que no bloqueemos entregables por debates de diseño.

Cuando salga la versión 2.7.18 de Spring Boot revisaremos si vale la
pena subir. De momento seguimos en 2.7.17 por comodidad.
```

### Después

```markdown
<!-- Redactado en 2026-09 -->

# CLAUDE.md — auth-service (Spring Boot 4 + Java 21)

## Contexto

Microservicio HTTP de autenticación OIDC. Emite y refresca tokens
contra Keycloak. Java 21 LTS, Spring Boot 4.0.x, Maven wrapper. BBDD
PostgreSQL 16.

## Reglas de trabajo

- MUST leer los archivos afectados antes de proponer cambios. NEVER
  proponer un diff sin haber leído la lógica actual.
- MUST ceñirse a los archivos declarados en `tasks.md`. MUST
  anunciar cualquier cambio colateral necesario y esperar
  confirmación antes de tocarlo.
- Funciones MUST tener ≤ 25 líneas efectivas. MUST hacer una sola
  cosa (regla single responsibility).
- NEVER dejar código comentado. Si necesitas conservar una alternativa,
  MUST justificarlo en un ADR bajo `docs/adr/`.
- MUST convertir entidades JPA a `record` DTO en la capa de
  controlador. NEVER exponer entidades en el endpoint.

## Comandos y verificación

- Levantar en local: `./mvnw spring-boot:run`.
- Tests unitarios: `./mvnw test`. Tests integración: `./mvnw verify`.
- MUST superar `./mvnw verify` antes de considerar cerrada cualquier
  tarea. NEVER usar `@Disabled` sin enlazar a la incidencia que lo
  justifica.

## Seguridad y datos sensibles

- NEVER commitear credenciales. Cualquier secreto MUST venir de
  variables de entorno vía `SPRING_APPLICATION_JSON` o
  `application-<perfil>.yml` gitignoreado.
- NEVER usar `System.out`. MUST usar SLF4J vía Logback.
- Cualquier bump de dependencia MUST justificarse en el mensaje de
  commit citando la CVE o la funcionalidad requerida.

## Enlaces

- ADRs: `docs/adr/`.
- Contratos OpenAPI: `openapi/`.
- Runbook de incidentes: `docs/runbook.md`.
```

### Qué cambió

- **De adjetivos a verbos imperativos observables.** "Las funciones
  deben ser cortas" pasa a "Funciones MUST tener ≤ 25 líneas
  efectivas". Ahora se puede auditar sin interpretación.
  *Por qué:* elimina la subjetividad; cualquier revisor (humano o
  LLM) llega a la misma conclusión.
- **Scope acotado explícito.** El bloque "MUST ceñirse a los archivos
  declarados en `tasks.md`; MUST anunciar cualquier cambio colateral"
  sustituye al genérico "no te metas donde no toca".
  *Por qué:* protege contra refactors accidentales y da a Claude una
  regla que puede aplicar turno a turno.
- **Comandos exactos en lugar de intenciones.** "`./mvnw verify`"
  sustituye a "los tests son importantes, pásalos antes de subir".
  *Por qué:* copy-paste puro; sin ambigüedad sobre qué se considera
  "haber pasado los tests".
- **Contenido volátil fuera.** Se han eliminado las referencias al
  chat de Slack, a Confluence y al PM (Fulanito) porque envejecen mal
  y no son operativos para Claude Code.
  *Por qué:* la prompt de sistema no es un directorio de personas;
  esa información vive mejor en el `README.md` humano.
- **Restricciones de seguridad reforzadas.** "NEVER commitear
  credenciales" con criterio de aceptación ("MUST venir de variables
  de entorno vía…") sustituye a "cuidado con las credenciales".
  *Por qué:* el patrón NEVER + criterio deja claro qué se acepta y
  qué no.

## Checklist de calidad

Aplica este checklist antes de dar por bueno tu `CLAUDE.md`:

- [ ] Sello temporal presente (`Redactado en YYYY-MM` o equivalente).
- [ ] Cada regla usa `MUST` / `NEVER` / `SHOULD` con criterio
  observable. Ninguna dice "debe ser limpio" o "cuidado con X".
- [ ] Scope acotado: hay una regla explícita sobre qué archivos NO
  tocar sin permiso.
- [ ] Comandos build/test aparecen literales, copiables.
- [ ] Longitud dentro de umbrales (200 líneas útiles / 500 totales;
  ver [antipatrones](antipatrones.md#umbrales-de-longitud)).
- [ ] Sin credenciales, tokens ni datos sensibles.
- [ ] Sin información volátil (fechas de sprint, nombres de personas,
  estados temporales).
- [ ] Enlaces internos apuntan a documentos del repo, no a Confluence
  ni a chats.

Cuando este checklist queda en verde, tu `CLAUDE.md` está listo para
usarse. El siguiente paso natural es aplicar el flujo de
[SDD con Speckit](../sdd/index.md) *(spec 5 pendiente)*, que usa este
`CLAUDE.md` como base de contexto para redactar specs y planes.
