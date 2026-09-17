# Contract · Bloque "versión de referencia + fecha de verificación"

**Feature**: `005-sdd-speckit-module`
**Referencia**: constitution 1.0.2, sección Development & Publishing Workflow.

## Plantilla canónica

Todas las páginas del módulo que citen versiones de herramientas externas MUST insertar, cerca de la primera mención, este bloque admonition:

```markdown
!!! info "Versión de referencia"

    - **{Herramienta}**: {versión}
    - **Verificado**: {YYYY-MM-DD}
```

## Reglas

- **Herramientas afectadas**: Claude Code, Speckit, MkDocs Material, Mermaid, Java (JDK), Spring Boot, SDKMAN, CodeGraph, RTK, Caveman. Si la página cita más de una, se listan todas en un mismo bloque.
- **Formato de versión**: cadena que use la herramienta en su release oficial (semver, YYYY.NN, etc.). Sin `~=`, `>=`, `^` ni rangos.
- **Formato de fecha**: `YYYY-MM-DD` (ISO 8601), sin timezone.
- **Ubicación**: inmediatamente después del primer encabezado H2 donde la versión aparece por primera vez, o al principio de la página si la versión está en la introducción.
- **Uno por página**: si la página cita 5 herramientas, un único bloque con 5 líneas es preferible a 5 bloques separados.
- **Re-verificación**: cada 6 meses o al detectar release mayor upstream; actualizar `Verificado`; si cambió la versión, actualizar también la línea correspondiente.
- **Merge gate**: PR que toque una página con `Verificado` >6 meses queda bloqueado hasta actualizar el bloque.

## Ejemplo aplicado a `flujo.md`

```markdown
!!! info "Versión de referencia"

    - **Speckit**: 1.0.4
    - **MkDocs Material**: 9.5.34
    - **Mermaid**: 11.4.0
    - **Verificado**: 2026-09-16
```

## Antipatrones

- Nota al pie de la página en lugar de admonition visible.
- `Verificado: reciente` u otra fecha no ISO.
- Rango de versiones (`>=1.0`, `~1.0`) — incumple constraint del pin exacto.
- Bloque duplicado en varias secciones de la misma página.
- Omitir el bloque en páginas que citan versiones (por ejemplo, `flujo.md` sin la versión de Mermaid pese a embeberlo).
