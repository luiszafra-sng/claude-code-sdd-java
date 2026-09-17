# Formación Claude Code + SDD (Speckit) para Java

Este sitio recoge la formación práctica sobre **Claude Code** y
**Spec-Driven Development con Speckit** aplicada a proyectos **Java**, tanto
modernos (Spring Boot 4 + Java 21) como legacy.

El objetivo es sencillo: pasar de un uso ad hoc de la IA a un flujo con
método, trazabilidad y control, sin renunciar a la agilidad que aporta.

## Para quién es esta formación

Se ha diseñado con dos perfiles en mente:

- **Nivel básico**: personas que aún no han utilizado Claude Code, o lo han
  usado de forma esporádica. Aquí encontrarán todo lo necesario para dejar
  el entorno operativo y entender el flujo de trabajo desde cero, con
  comandos exactos y ejemplos reproducibles.
- **Nivel avanzado**: personas que ya trabajan con Claude a diario y buscan
  profundizar. Aquí disponen de referencia detallada sobre agentes, skills,
  memoria, alcance usuario/proyecto, SDD end-to-end, brownfield en Java
  legacy y buenas prácticas para `CLAUDE.md`.

Ambos perfiles conviven en el mismo sitio: la lectura secuencial cubre a
quien empieza, y las secciones son autocontenidas para quien busca un tema
concreto.

## Objetivos

- Dejar el entorno listo con Claude Code, RTK, Caveman, CodeGraph y SDKMAN.
- Comprender qué es `CLAUDE.md` y cómo redactarlo bien a nivel usuario y
  proyecto.
- Diagnosticar problemas reales en una aplicación Spring Boot 4 + Java 21
  con la ayuda de Claude.
- Aplicar el ciclo completo de Speckit (`specify` → `plan` → `tasks` →
  `implement`).
- Crear agentes y skills propios para proyectos Java.
- Distinguir cuándo se trabaja en **greenfield** o en **brownfield** y qué
  hacer en cada caso.

## Mapa de módulos

- [Setup del entorno](setup/index.md) — instalación y verificación de todas las herramientas.
- [CLAUDE.md](claude-md/index.md) — buenas prácticas a nivel usuario y proyecto.
- [App de ejemplo (Spring Boot 4)](app-ejemplo/index.md) — CRUD sobre H2 con un bug reproducible.
- [Agentes](agentes/index.md) — qué son, cómo crearlos, ejemplos.
- [Skills](skills/index.md) — qué son, cómo crearlas, ejemplos.
- [SDD con Speckit](sdd/index.md) — flujo completo y diferencias greenfield / brownfield.

!!! tip "Cómo leer esta formación"
    Se recomienda seguir el orden del mapa en una primera lectura. Para
    consultas puntuales, cada módulo puede leerse de forma independiente y
    enlaza a los demás cuando corresponde.
