# Capa usuario

`~/.claude/CLAUDE.md` recoge lo que quieres que Claude Code aplique en
**cualquier sesión, en cualquier proyecto**. Es la voz personal
constante: cómo trabajas tú, qué herramientas asumes siempre presentes,
qué tono prefieres, qué atajos usas a diario.

## Qué meter en la capa usuario

Contenido apropiado para esta capa:

- **Estilo personal de trabajo**: pasos previos que aplicas a cualquier
  tarea (leer antes de escribir, preferir cambios localizados, evitar
  refactors amplios sin permiso explícito).
- **Herramientas siempre presentes**: alias, gestores globales
  (`sdkman`, `uv`, `rtk`, `caveman`), CLIs de trabajo que expones a
  Claude Code de forma constante.
- **Atajos y comandos favoritos**: cómo abres una terminal, cómo
  arrancas un servidor local, qué shell usas, qué flags aplicas por
  defecto.
- **Preferencias de tono**: formal / informal, longitud máxima de
  respuestas, si quieres explicaciones o resúmenes.
- **Flujos habituales**: por ejemplo, "antes de escribir tests, muestra
  el plan"; "no crees archivos nuevos sin pedirme confirmación".

Contenido que NO va aquí (se cubre en detalle en
[antipatrones](antipatrones.md)):

- Convenciones de un proyecto concreto.
- Credenciales, tokens, cadenas de conexión.
- Historial personal o notas volátiles.

## Ejemplo real anonimizado

Este es un `~/.claude/CLAUDE.md` completo, redactado para una persona
ficticia con perfil senior full-stack, listo para copiar como base.

```markdown
<!-- Redactado en 2026-09 -->

# CLAUDE.md — usuario

Perfil: desarrollador senior full-stack. Trabaja con Java + Spring en
backend, TypeScript + React en frontend, Python + FastAPI en tooling.

## Estilo de trabajo

- Preferencia por cambios localizados. NEVER refactorices módulos
  completos sin pedir confirmación explícita.
- MUST leer los archivos afectados antes de proponer cambios.
- SHOULD proponer un plan corto (3–5 pasos) antes de tocar más de un
  archivo.
- NEVER elimines código comentado sin preguntar.
- MUST respetar el estilo y las convenciones existentes del proyecto,
  aunque no coincidan con tus preferencias.

## Herramientas siempre presentes

- `sdkman` para JDK y Maven (`sdk install java 21.0.4-librca`,
  `sdk env`).
- `uv` como único gestor Python (NEVER `pip`, `venv`, `poetry`).
- `rtk` como proxy de comandos de dev ops en sesiones de Claude Code.
- `caveman` para comprimir la salida en sesiones largas de refactor.
- `codegraph` para navegar repositorios grandes con `.codegraph/`.

## Atajos y comandos favoritos

- Shell: Bash 5 (macOS con Homebrew) o Bash de Ubuntu 22.04.
- Editor: Neovim con LSP; también IntelliJ para Java.
- Contenedores: Docker en Rancher Desktop; nunca `sudo` con Docker.
- Test rápido en Java: `./mvnw test -Dtest=<clase>`.
- Test rápido en Python: `uv run pytest -k <expresión>`.

## Preferencias de tono y formato

- SHOULD responder en español profesional-directo (sin argot).
- Longitud MUST ≤ 20 líneas por turno cuando la respuesta sea
  operativa; excepción: cuando redactes código o documentación
  completa.
- MUST usar bloques de código con marca de lenguaje explícita.
- SHOULD citar rutas de archivo relativas al repo, no absolutas.

## Flujos habituales

- Antes de escribir tests, MUST mostrar el plan y esperar confirmación.
- Antes de crear archivos nuevos, MUST anunciarlo y esperar OK.
- Antes de instalar dependencias nuevas, MUST justificar la necesidad.
- Al terminar un cambio, SHOULD indicar cómo verificarlo (comando o
  test concreto).
```

Adapta este esqueleto a tu perfil: quita lo que no te aplique, añade
las herramientas específicas de tu día a día y ajusta el tono al
registro que prefieras.

## Antipatrones específicos de la capa usuario

- **Credenciales o tokens**: nunca deben aparecer. Ni tuyos ni de
  clientes ni de servicios internos. Si necesitas configurar una API
  key, hazlo con variables de entorno externas (`ANTHROPIC_API_KEY`,
  etc.).
- **Contexto de un proyecto concreto**: si escribes "en el proyecto
  X hacemos Y", ese contenido debería vivir en el `CLAUDE.md` del
  proyecto, no en el de usuario.
- **Historial personal o comentarios de sesión**: notas del tipo
  "ayer probé esto y no funcionó" ensucian la prompt de sistema y no
  aportan valor operativo. Guárdalas en otro sitio.
- **Reglas contradictorias**: si en la misma sección coexiste "MUST
  responder corto" y "MUST explicar detalladamente cada paso", Claude
  tenderá a interpretar de forma inconsistente. Consolida.
