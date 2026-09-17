# Alcance

Un agente vive en una de dos ubicaciones: la **capa usuario** o la
**capa proyecto**. La elección determina quién puede invocarlo, cómo
se distribuye y qué pasa cuando dos agentes con el mismo nombre
coexisten.

## Capa usuario — `~/.claude/agents/`

Agentes disponibles en cualquier sesión de Claude Code que abras,
independientemente del repositorio.

- **Cuándo elegirla**: preferencias personales que quieres arrastrar
  entre proyectos (por ejemplo, un agente `commit-message-writer` que
  aplica tu estilo, o un `pr-reviewer` genérico).
- **Consecuencias**:
  - No aparece en el repositorio. El resto del equipo no lo ve ni lo
    puede reproducir.
  - Vive fuera del control de versiones del proyecto (aunque tú
    puedas versionarlo en tu dotfiles).
  - Al cambiar de máquina, se pierde salvo que lo sincronices por
    otros medios.

## Capa proyecto — `.claude/agents/`

Agentes disponibles cuando Claude Code se ejecuta dentro del
repositorio. Se commitean junto al código.

- **Cuándo elegirla**: agentes específicos del proyecto y compartidos
  por el equipo. En este repo formativo, `spring-boot-debugger` es un
  ejemplo claro: diagnostica errores del CRUD Spring Boot 4 + Java 21;
  no tiene sentido fuera del contexto de la app de ejemplo.
- **Consecuencias**:
  - Cualquier persona que clone el repo hereda el agente sin acciones
    adicionales.
  - Los cambios al agente pasan por revisión de código como cualquier
    otro archivo.
  - Aparece en el diff de los MRs; la evolución del agente queda
    trazada en git.

## Tabla resumen

| Dimensión | Usuario (`~/.claude/agents/`) | Proyecto (`.claude/agents/`) |
|-----------|-------------------------------|------------------------------|
| Alcance de invocación | Todas las sesiones del usuario. | Sólo dentro del repo. |
| Versionado | No versionado con el proyecto. | Versionado con el proyecto. |
| Compartición con el equipo | No. | Sí, automática. |
| Reproducibilidad | Depende del usuario. | Igual para todo el equipo. |
| Riesgo de deriva | Alto (cada usuario tiene el suyo). | Bajo (una fuente de verdad). |
| Colisión con otro agente | Puede chocar con uno del proyecto (ver más abajo). | Sólo colisiona con uno de usuario del mismo nombre. |

## Precedencia ante colisiones

Cuando existe un agente `mi-agente` en la capa usuario y otro
`mi-agente` en la capa proyecto, Claude Code prioriza la **capa
proyecto**. La razón es la misma que en `CLAUDE.md`: el proyecto es
más específico y suele encarnar la decisión del equipo.

Para diagnosticar colisiones:

```bash
# Listar agentes de usuario
ls ~/.claude/agents/

# Listar agentes del proyecto activo
ls .claude/agents/
```

Si un nombre aparece en ambas listas, renombra la variante de usuario
o elimínala del alcance donde no aporte. Deja siempre una única
definición autoritativa.

## Política del repo formativo

- Agentes específicos de la formación viven en `.claude/agents/` y se
  commitean al repo.
- Ningún agente del alumnado se copia por defecto a `.claude/agents/`
  del repo; ese sitio queda reservado para lo que la formación
  distribuye.
- Los ejemplos de agentes personales se muestran como bloques de
  código en las páginas, no como archivos versionados.
- Al crear un agente para uso personal, ubícalo bajo
  `~/.claude/agents/` y NO en el repo, salvo que la formación lo
  requiera como material.

## Siguiente paso

Antes de crear un agente propio, revisa el
[catálogo](catalogo.md) de agentes reutilizables ya existentes.
Puede que la tarea ya esté cubierta por un pack de terceros o merezca
inspiración desde uno.
