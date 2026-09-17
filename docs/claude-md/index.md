# CLAUDE.md

`CLAUDE.md` es el archivo que Claude Code lee al abrir una sesión para
establecer contexto persistente. Este módulo explica qué es, dónde puede
vivir, cómo se combinan sus dos capas y cuándo interviene en la
conversación. Al final, ofrece páginas dedicadas a la capa usuario, la
capa proyecto, las buenas prácticas para redactarlo y los antipatrones
que conviene evitar.

## Qué es CLAUDE.md

`CLAUDE.md` es un fichero Markdown que Claude Code carga
automáticamente al iniciar una sesión y mantiene disponible durante
todos los turnos. Su contenido pasa a formar parte de la prompt de
sistema, junto con el resto de instrucciones del CLI, y condiciona
cómo Claude interpreta las peticiones del usuario y qué operaciones
considera aceptables.

Se diferencia del `README.md` tradicional en dos puntos:

- El `README.md` está dirigido a personas que abren el repositorio.
- `CLAUDE.md` está dirigido a Claude Code cuando trabaja sobre ese
  repositorio (o cualquier repositorio, si es de capa usuario).

Ambos pueden coexistir. Redirigir a un lector humano al `README.md`
desde el `CLAUDE.md` es una práctica habitual para no duplicar
información.

## Dónde vive

`CLAUDE.md` puede vivir en dos ubicaciones, ambas opcionales:

- **Capa usuario** — `~/.claude/CLAUDE.md`. Aplica a todas las
  sesiones que abras con Claude Code, en cualquier repositorio.
  Recoge preferencias personales de trabajo (estilo, herramientas
  siempre presentes, atajos).
- **Capa proyecto** — `CLAUDE.md` en la raíz del repositorio. Aplica
  únicamente cuando Claude Code se ejecuta dentro de ese proyecto.
  Recoge convenciones del código, comandos build/test, restricciones
  específicas.

Si ninguno de los dos existe, Claude Code funciona con la configuración
por defecto sin bloquearse. No es obligatorio tener `CLAUDE.md` para
usar Claude Code, pero una vez que llevas más de un par de sesiones
seguidas, redactar uno reduce fricción de forma notable.

## Precedencia entre capas

Cuando existen los dos `CLAUDE.md` (usuario y proyecto), Claude Code
**los compone en la misma prompt de sistema**: primero el de la capa
usuario, después el de la capa proyecto. Ambos coexisten y se aplican.

Ante una **contradicción efectiva** entre las dos capas, **la capa
proyecto gana**: aparece después en la prompt de sistema y es más
específica que la de usuario, por lo que Claude tiende a interpretarla
como la palabra final.

Ejemplo mínimo:

- `~/.claude/CLAUDE.md` (usuario) dice: "responde siempre en inglés".
- `CLAUDE.md` (proyecto) dice: "responde siempre en español, porque la
  documentación del repositorio está en español".

Resultado en ese proyecto concreto: Claude responderá en español. En
cualquier otro repositorio sin `CLAUDE.md` de proyecto, seguirá la
regla de usuario.

Esta regla es la que aplica el módulo cuando ilustra ejemplos y la que
se sostiene en la página de [antipatrones](antipatrones.md) al hablar
de reglas contradictorias.

## Cuándo lo lee Claude Code

Claude Code lee los dos `CLAUDE.md` **al inicio de la sesión**:

1. Detecta el directorio de trabajo actual.
2. Carga `~/.claude/CLAUDE.md` si existe.
3. Sube por la jerarquía de directorios buscando un `CLAUDE.md` de
   proyecto (típicamente en la raíz del repo). Si lo encuentra, lo
   carga.
4. Compone ambos en la prompt de sistema y arranca la conversación.

Durante la sesión, los `CLAUDE.md` no se releen turno a turno: quedan
fijados en la prompt inicial. Si editas alguno de los dos y quieres que
Claude Code lo tenga en cuenta, cierra la sesión y ábrela de nuevo.

## Mapa del módulo

- [Capa usuario](usuario.md) — qué meter a nivel usuario y un
  `~/.claude/CLAUDE.md` de referencia.
- [Capa proyecto](proyecto.md) — qué meter a nivel proyecto con dos
  ejemplos (Spring Boot 4 + Java 21 y legacy Spring Boot 2.7 + Java 8),
  más el `CLAUDE.md` vivo del propio repositorio de la formación.
- [Buenas prácticas](buenas-practicas.md) — reglas ejecutables por el
  LLM y comparativa completa Antes / Después / Qué cambió.
- [Antipatrones](antipatrones.md) — qué evitar, umbrales de longitud y
  cómo auditar un `CLAUDE.md` existente.

Cuando termines este módulo, el siguiente paso natural es el módulo
[SDD con Speckit](../sdd/index.md) *(spec 5 pendiente)*, que aplica lo
aprendido dentro del flujo de Spec-Driven Development.

[← Volver a la home del sitio](../index.md)
