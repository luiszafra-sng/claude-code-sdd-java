# Crear una

Guía práctica para construir una skill propia. Como caso guía usamos
`spring-endpoint-scaffolder`, una skill que genera controller REST +
DTO + servicio + repositorio + tests base + entrada OpenAPI para un
recurso Spring Boot 4 + Java 21, siguiendo la convención del CRUD de
la formación.

## Paso 1 — Elige slug y ubicación

- Slug en `kebab-case`, único dentro de la ubicación elegida.
- Ubicación:
  - `~/.claude/skills/` si es personal.
  - `.claude/skills/` si es del proyecto (ver [Alcance](alcance.md)).
- Nombre de directorio = slug; el comando por defecto será
  `/nombre-slug`.

En este ejemplo: slug `spring-endpoint-scaffolder`.

## Paso 2 — Redacta `SKILL.md` (frontmatter + descripción)

Como mínimo un `SKILL.md` con:

- `description`: una línea que describa cuándo Claude debe activarla.
- `when_to_use` (opcional): frases que refuercen la detección
  automática.
- `argument-hint` y `arguments` (opcional) si aceptas parámetros.

Snippet ilustrativo del `SKILL.md`:

````markdown
---
name: spring-endpoint-scaffolder
description: Genera controller REST, DTO, servicio, repositorio, tests base y entrada OpenAPI para un recurso Spring Boot 4 respetando la convención del CRUD de la formación.
when_to_use: "crear endpoint", "scaffolder recurso", "nuevo CRUD para <recurso>"
argument-hint: "[NombreRecurso]"
arguments: [resource]
allowed-tools: Read, Write, Edit, Grep, Glob
---

# spring-endpoint-scaffolder

## Contexto
Recurso solicitado: `$resource` (ejemplo: `Product`). Deriva el
nombre de paquete como `products`, la ruta REST como `/products` y
los nombres de clase como `ProductController`, `ProductService`,
`ProductRepository`, `ProductDto`, `CreateProductRequest`, ...

## Instrucciones
1. Comprueba que el recurso NO existe ya en `src/main/java/.../$resource`
   ni en `src/test/java/.../$resource`. Si existe, detente e informa.
2. Genera los archivos siguiendo las plantillas de referencia (ver
   más abajo) respetando estilo, orden de imports y anotaciones del
   CRUD.
3. Añade una entrada OpenAPI en `src/main/resources/openapi.yaml` (o
   equivalente) con los cuatro endpoints estándar (GET list, GET id,
   POST, DELETE).
4. Muestra al usuario el listado de archivos creados y sugiere
   `./mvnw -q -DskipTests package` para verificar compilación.

## Restricciones
- No modifiques archivos ajenos al recurso salvo `openapi.yaml`.
- No introduzcas dependencias nuevas en `pom.xml`.
- No cambies la configuración global de Spring.
````

## Paso 3 — Añade plantillas y assets (opcional)

Guarda plantillas Markdown de referencia en el mismo directorio para
que Claude las use como base. Ejemplo de plantilla de controller:

````markdown
# Plantilla — Controller REST para `{{Resource}}`

```java
package com.sngular.formacion.usercrud.{{resource}};

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/{{resources}}")
public class {{Resource}}Controller {

    private final {{Resource}}Service service;

    public {{Resource}}Controller({{Resource}}Service service) {
        this.service = service;
    }

    @GetMapping
    public List<{{Resource}}Dto> list() {
        return service.list();
    }

    @PostMapping
    public ResponseEntity<{{Resource}}Dto> create(@RequestBody Create{{Resource}}Request request) {
        return ResponseEntity.status(201).body(service.create(request));
    }
}
```

Notas:
- Placeholders `{{Resource}}` (PascalCase) y `{{resource}}` /
  `{{resources}}` (kebab/plural minúsculas) los sustituye Claude
  usando el argumento `$resource`.
- Respeta el `package` real del proyecto en el momento de generar.
````

Puedes añadir plantillas similares para `Service`, `Repository`,
`Dto`, tests base y snippet OpenAPI. Vive en el propio directorio de
la skill; Claude sólo las carga cuando la skill se invoca.

## Paso 4 — Prueba local

- Coloca el directorio en `~/.claude/skills/` (personal) o en
  `.claude/skills/` del proyecto.
- Abre Claude Code en ese proyecto.
- Invoca la skill: `/spring-endpoint-scaffolder Product`.
- Observa:
  - Detección de colisión con recursos existentes.
  - Ficheros generados en los paquetes correctos.
  - Entrada OpenAPI añadida.
- Ejecuta `./mvnw -q -DskipTests package` para confirmar que compila.

## Paso 5 — Verifica

Antes de darla por buena, comprueba:

- El `description` es lo bastante específico para que Claude la
  active de forma automática cuando corresponde y no en otras
  situaciones.
- El slug del directorio coincide con `name` (si declaras `name`).
- No has commiteado credenciales en las plantillas.
- Ninguna plantilla asume dependencias fuera del `pom.xml` del CRUD.

## Cuándo elegir skill vs agente

Duda frecuente al terminar esta guía. Repaso rápido:

- **Skill** = comando reutilizable / paquete de contexto. Encaja aquí
  porque queremos empaquetar plantillas y una instrucción invocable
  con parámetro (`/spring-endpoint-scaffolder Product`).
- **Agente** = ejecutor con prompt del sistema propio, modelo y tools
  independientes. Encaja cuando la tarea exige razonamiento en
  bucle y contexto aislado (por ejemplo, el
  `spring-boot-debugger` visto en el módulo de agentes).

Para profundizar, consulta la [comparativa completa en el módulo
Agentes](../agentes/index.md#diferencia-agente-vs-skill).

## Dónde encaja una skill en el flujo SDD

Dentro del ciclo Speckit (`/speckit-specify` → `/speckit-plan` →
`/speckit-tasks` → `/speckit-implement`), las skills son herramientas
de apoyo durante `implement`:

- Un `spring-endpoint-scaffolder` bien afinado ahorra minutos en cada
  tarea de tipo "crear endpoint REST" que tasks.md haya generado.
- El `SKILL.md` funciona como referencia contractual: si tasks.md
  dice "genera controller para `Product`", basta con invocar la
  skill; el resultado es homogéneo entre features.
- No sustituye al plan: la decisión de crear el recurso vive en la
  spec / plan; la skill se limita a materializarla.

Ampliación en el módulo [SDD con Speckit](../sdd/index.md).

## Cierre del módulo

Con esto tienes teoría de skills, catálogo verificado y guía práctica
para crear una propia. El siguiente módulo natural es
[SDD con Speckit](../sdd/index.md), que aplica lo aprendido dentro
del flujo de Spec-Driven Development.
