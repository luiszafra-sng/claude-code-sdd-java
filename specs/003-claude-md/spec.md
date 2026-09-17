# Feature Specification: Módulo "CLAUDE.md: usuario y proyecto"

**Feature Branch**: `003-claude-md`

**Created**: 2026-09-16

**Status**: Draft

**Input**: User description: "Módulo CLAUDE.md en `docs/claude-md/`: índice, capa usuario, capa proyecto, buenas prácticas, antipatrones, snippets copiables. Comparativa antes/después. Enlaces cruzados desde setup y SDD."

## Clarifications

### Session 2026-09-16

- Q: ¿Qué regla de precedencia entre `~/.claude/CLAUDE.md` (usuario) y `CLAUDE.md` (proyecto) debe documentar el módulo cuando ambos existen y contienen instrucciones que se solapan o contradicen? → A: Ambas capas se **componen** en la misma prompt de sistema (usuario primero, proyecto después). Ante contradicción efectiva, **la capa proyecto gana** por orden y especificidad.
- Q: ¿Debe este módulo publicar además un `CLAUDE.md` real en la raíz del repositorio de la formación como snippet vivo? → A: Sí; se publica en `CLAUDE.md` de la raíz del repo como parte de este módulo y se enlaza desde `proyecto.md` como cuarto snippet vivo (además de los tres FR-008: user, Spring Boot 4, Spring Boot 2.7).
- Q: ¿En qué formato visual debe presentarse la comparativa "antes / después" de `CLAUDE.md` en la página de buenas prácticas? → A: Secuencial con tres bloques H3: `### Antes` (bloque completo), `### Después` (bloque completo), `### Qué cambió` (lista de al menos 3 diferencias explicando qué se mejoró y por qué).
- Q: ¿Qué versión concreta de Java debe usar el ejemplo de `CLAUDE.md` para el proyecto legacy Spring Boot 2.7? → A: **Java 8**. Refleja el escenario más antiguo real (proyectos que no han migrado ni siquiera a 11), maximiza el contraste pedagógico con el snippet moderno (Spring Boot 4 + Java 21) y evidencia deudas típicas (`javax.*`, Maven antiguo, ausencia de features modernas de la JVM).
- Q: ¿Qué longitud máxima orientativa debe recomendar el módulo para un `CLAUDE.md` de proyecto antes de considerarlo hipertrofiado? → A: Techo orientativo **200 líneas útiles** (excluyendo bloques de código, tablas y ejemplos); umbral duro de aviso **500 líneas totales**. Por encima de 500 el contenido debería vivir en otra parte.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender qué es CLAUDE.md y dónde vive (Priority: P1)

Un participante que acaba de instalar Claude Code (o alguien que ya lo usa
pero no ha formalizado su configuración) llega al módulo. En pocos
minutos entiende qué es `CLAUDE.md`, en qué carpetas puede vivir, qué
diferencia hay entre la capa usuario y la capa proyecto, con qué
precedencia se combinan, y en qué momento del ciclo de conversación
Claude Code los carga.

**Why this priority**: sin este bloque conceptual no puede tomar
decisiones informadas sobre qué escribir en cada capa. Es el punto de
entrada del módulo.

**Independent Test**: sobre el sitio construido, `docs/claude-md/index.md`
responde de forma explícita a estas cinco preguntas: (1) qué es
`CLAUDE.md`, (2) dónde se ubica a nivel usuario, (3) dónde se ubica a
nivel proyecto, (4) cómo se combinan cuando existen los dos, (5) cuándo
Claude Code los lee dentro de una sesión.

**Acceptance Scenarios**:

1. **Given** un participante sin conocimiento previo, **When** lee la
   página `index.md` del módulo, **Then** puede explicar con sus palabras
   la diferencia entre `~/.claude/CLAUDE.md` y el `CLAUDE.md` en la raíz
   de un proyecto.
2. **Given** la misma página, **When** el participante busca "cuándo se
   lee", **Then** encuentra un párrafo o subsección explícito que lo
   explica.
3. **Given** un participante avanzado que ya usa Claude Code, **When**
   necesita recordar la precedencia entre capas, **Then** llega a la
   sección de precedencia en menos de 30 segundos.

---

### User Story 2 - Escribir un CLAUDE.md útil (Priority: P1)

Un participante quiere redactar su propio `CLAUDE.md`. Consulta las
páginas de capa usuario y capa proyecto, ve qué contenidos son
apropiados en cada una, aplica las buenas prácticas del módulo y evita
los antipatrones documentados. Al terminar tiene un `CLAUDE.md` en su
proyecto que Claude Code interpreta sin ambigüedad y que respeta los
principios del módulo.

**Why this priority**: es el objetivo funcional del módulo. Sin
capacidad de aplicar el contenido, el módulo se queda en teoría.

**Independent Test**: siguiendo únicamente el módulo, un participante
copia el snippet base de `CLAUDE.md` para proyecto Java y lo adapta con
las convenciones de su repositorio en menos de 15 minutos.

**Acceptance Scenarios**:

1. **Given** las páginas de capa usuario, capa proyecto y buenas
   prácticas leídas, **When** el participante compara un `CLAUDE.md`
   "pobre" con uno "bueno" del ejemplo antes/después, **Then** identifica
   al menos tres diferencias concretas (concreción, formato ejecutable,
   ausencia de contenido volátil).
2. **Given** los snippets copiables del módulo, **When** el participante
   los usa como plantilla para su proyecto, **Then** obtiene un
   `CLAUDE.md` bien formado sin necesidad de partir de cero.
3. **Given** la página de antipatrones, **When** el participante revisa
   su `CLAUDE.md` recién creado, **Then** puede tachar la ausencia de
   secretos, información volátil e historia de commits mediante los
   ítems documentados.

---

### User Story 3 - Escribir restricciones "ejecutables" por el LLM (Priority: P2)

Un participante con experiencia previa quiere que Claude Code respete
sus reglas de estilo y proceso de forma consistente. La página de
buenas prácticas le enseña a redactar restricciones con vocabulario
imperativo verificable ("MUST", "NEVER", "SHOULD"), a evitar frases
vagas y a incluir criterios de aceptación en cada regla.

**Why this priority**: es el "efecto composite" que hace que
`CLAUDE.md` pase de ser una lista de deseos a un contrato útil. La
distingue de una guía trivial de "escribe qué te gustaría".

**Independent Test**: sobre un `CLAUDE.md` real (por ejemplo, uno de
prueba redactado por el participante), aplicar la checklist de la
sección "reglas ejecutables" convierte al menos el 80% de las líneas
vagas en formulaciones verificables. La página se puede validar en
aislamiento (H3 canónicos "Antes / Después / Qué cambió" presentes,
≥ 3 diferencias, referencia externa citada); su **valor pedagógico
completo** exige haber leído US1 (concepto) y US2 (capas y snippets),
pero el criterio de aceptación estructural no depende de ellas.

**Acceptance Scenarios**:

1. **Given** la página de buenas prácticas, **When** el participante
   revisa una regla como "el código debe ser limpio", **Then** la
   reescribe con el patrón enseñado (por ejemplo: "Las funciones MUST
   tener ≤ 20 líneas; MUST no incluir comentarios excepto para docs de
   API pública").
2. **Given** la comparativa antes/después, **When** el participante ve
   el `CLAUDE.md` "bueno", **Then** identifica al menos tres reglas
   redactadas con verbos imperativos y criterio de aceptación
   observable.

---

### Edge Cases

- **Colisión de reglas** entre capa usuario y capa proyecto: la regla
  fijada por Clarifications 2026-09-16 es que ambas se componen (usuario
  primero, proyecto después) y **la capa proyecto gana** ante
  contradicción efectiva. `index.md` documenta este comportamiento con
  un ejemplo mínimo.
- **`CLAUDE.md` vacío o inexistente**: cubierto en la página `index.md`
  con la explicación de comportamiento por defecto.
- **`CLAUDE.md` con más de 200 líneas útiles / 500 líneas totales**: la
  página de antipatrones flagea la hipertrofia con los umbrales
  concretos fijados en Clarifications 2026-09-16.
- **Secretos incrustados**: la página de antipatrones lo documenta como
  error crítico y explica cómo detectarlos (grep de patrones típicos) y
  cómo mitigarlos (mover a `.env` gitignoreado).
- **`CLAUDE.md` regenerado por herramientas** (`/init` u otros): la
  página `index.md` menciona cómo Claude Code puede autogenerar un
  `CLAUDE.md` inicial y qué esperar de la calidad de salida (borrador,
  no producto final).
- **Compartir `CLAUDE.md` en repositorios públicos**: la página de
  antipatrones advierte de no incluir información sensible del cliente
  o del equipo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El módulo DEBE existir en `docs/claude-md/` con cinco
  páginas Markdown: `index.md`, `usuario.md`, `proyecto.md`,
  `buenas-practicas.md`, `antipatrones.md`. Todas registradas en
  `mkdocs.yml` como hijos de la sección "CLAUDE.md".
- **FR-002**: `docs/claude-md/index.md` DEBE cubrir: qué es
  `CLAUDE.md`, dónde vive (`~/.claude/CLAUDE.md` para la capa usuario y
  raíz del repositorio para la capa proyecto), y en qué momento del
  ciclo de conversación Claude Code las lee. La página DEBE incluir una
  subsección explícita "Precedencia entre capas" con la regla fijada en
  Clarifications 2026-09-16: **ambas capas se componen en la prompt de
  sistema, usuario primero y proyecto después; ante contradicción
  efectiva, la capa proyecto gana** por orden de aplicación y por
  especificidad. Ejemplo mínimo de colisión: usuario declara
  "responde siempre en inglés", proyecto declara "responde siempre en
  español" → proyecto gana. Incluye enlaces a las cuatro páginas
  hermanas.
- **FR-003**: `docs/claude-md/usuario.md` DEBE cubrir: qué tiene sentido
  meter a nivel usuario (estilo personal de trabajo, herramientas
  siempre presentes, atajos, preferencias de tono, flujos habituales) y
  un **ejemplo real anonimizado** de `~/.claude/CLAUDE.md` completo, no
  fragmentado.
- **FR-004**: `docs/claude-md/proyecto.md` DEBE cubrir: qué meter a
  nivel proyecto (tecnologías, convenciones, comandos build/test,
  estructura de carpetas, restricciones de seguridad, integraciones
  específicas) y **dos ejemplos completos**:
  (1) `CLAUDE.md` para un proyecto **Spring Boot 4 + Java 21** moderno.
  (2) `CLAUDE.md` para un proyecto **legacy Spring Boot 2.7 + Java 8**
  (Clarifications 2026-09-16) con convenciones antiguas: uso de
  `javax.*` (no `jakarta.*`), Maven, comandos `mvn`, features de la JVM
  8 (streams, `Optional`, lambdas pero sin records ni `var`), y notas
  de deuda técnica típicas (migración pendiente a jakarta, ausencia de
  módulos JPMS, etc.).
- **FR-005**: `docs/claude-md/buenas-practicas.md` DEBE cubrir, con al
  menos un ejemplo copiable por punto: minimalismo (sin features
  especulativas), clean code aplicable, tests como criterio de
  verificación, prohibición explícita de cambios fuera de scope, y cómo
  escribir **restricciones ejecutables** por el LLM (imperativos
  "MUST"/"NEVER"/"SHOULD" en vez de vaguedades). Referencia externa:
  [`multica-ai/andrej-karpathy-skills/CLAUDE.md`](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/CLAUDE.md).
- **FR-006**: `docs/claude-md/antipatrones.md` DEBE cubrir, con
  ejemplos negativos, al menos: secretos incrustados, información
  volátil (fechas, versiones cambiantes sin política de refresco),
  historia de commits copiada al `CLAUDE.md`, docstrings enormes,
  reglas contradictorias, **exceso de longitud** (techo orientativo
  **200 líneas útiles** excluyendo bloques de código / tablas /
  ejemplos; umbral duro de aviso a partir de **500 líneas totales**;
  por encima de 500 el contenido debería vivir en otra parte —
  Clarifications 2026-09-16), y ausencia de criterios de aceptación
  en las reglas.
- **FR-007**: `docs/claude-md/buenas-practicas.md` DEBE incluir una
  **comparativa "antes/después"** aplicada a una misma tarea (por
  ejemplo: instrucción "refactoriza el código de autenticación"),
  estructurada en tres subsecciones consecutivas de nivel H3 en este
  orden y con estos títulos literales (Clarifications 2026-09-16):
  `### Antes` (bloque `markdown` completo del `CLAUDE.md` pobre, en
  código copiable), `### Después` (bloque `markdown` completo de la
  versión mejorada, en código copiable), `### Qué cambió` (lista con al
  menos **3 diferencias** identificadas, cada una explicando "qué se
  mejoró" y "por qué"). Ambos bloques deben tener longitud comparable
  para que la comparación no dependa del tamaño.
- **FR-008**: El módulo DEBE ofrecer al menos **tres snippets copiables
  completos**, todos como bloques de código Markdown con marca de
  lenguaje `markdown`:
  (1) `~/.claude/CLAUDE.md` de referencia para participantes.
  (2) `CLAUDE.md` para proyectos Spring Boot 4 + Java 21.
  (3) `CLAUDE.md` para proyectos legacy Spring Boot 2.7.
- **FR-008a**: El módulo DEBE además publicar un **`CLAUDE.md` vivo en
  la raíz del repositorio de la formación** (Clarifications 2026-09-16)
  que refleje las convenciones reales del repo (constitution 1.0.2, `uv`
  como gestor Python, MkDocs Material, Spec-Driven Development como
  método por defecto, etc.). El archivo DEBE quedar enlazado como
  "cuarto snippet vivo" desde `docs/claude-md/proyecto.md`, con
  advertencia visible de que es el archivo real del repo y puede haber
  divergido del snippet estático si se ha modificado desde la
  publicación del módulo.
- **FR-009**: `docs/setup/index.md` (módulo Setup) DEBE incluir un
  enlace explícito al módulo `CLAUDE.md` como "siguiente paso natural
  tras dejar el entorno operativo". Esto NO exige rehacer setup, sólo
  añadir un párrafo o enlace desde la home del módulo Setup.
- **FR-010**: El futuro módulo SDD (spec 5) DEBE poder enlazar
  directamente a las secciones del módulo `CLAUDE.md` sin ambigüedad
  (títulos H2/H3 estables). El módulo `CLAUDE.md` DEBE evitar renombrar
  headings entre iteraciones.
- **FR-011**: Todas las páginas DEBEN estar cruzadas: `index.md` enlaza
  a las cuatro hermanas; cada página hermana enlaza al menos al
  `index.md`. Al final del módulo se sugiere al lector el módulo SDD
  (spec 5) como siguiente paso natural, con nota "pendiente" mientras
  spec 5 no esté publicada.
- **FR-012**: El registro de tono DEBE cumplir la constitution 1.0.2
  Principio I (profesional y directo). Prohibido argot; prohibido
  redactar los ejemplos "pobre" con caricaturas exageradas: deben ser
  ejemplos plausibles que un equipo real podría producir.
- **FR-013**: `uv run mkdocs build --strict` DEBE seguir en verde tras
  incorporar las cinco páginas.
- **FR-014**: Los ejemplos y snippets DEBEN incluir el **año de
  redacción** (`Redactado en 2026-09`) en un comentario Markdown para
  contextualizar. No se pide política de refresco semestral aquí
  (aplica a la spec 002); basta el sello temporal.

### Key Entities

- **Módulo CLAUDE.md**: sección del sitio compuesta por cinco páginas
  Markdown cohesionadas.
- **Página**: entrada del módulo con propósito específico (índice,
  usuario, proyecto, buenas prácticas, antipatrones).
- **Snippet copiable**: bloque de código Markdown completo, listo para
  usarse tal cual como `CLAUDE.md` o como base.
- **Comparativa antes/después**: par de bloques de código Markdown
  (`CLAUDE.md` pobre vs mejorado) sobre la misma tarea concreta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un participante sin conocimiento previo de `CLAUDE.md`
  puede explicar la diferencia entre capa usuario y capa proyecto y su
  precedencia en menos de **10 minutos** tras leer `index.md` y
  `usuario.md`.
- **SC-002**: Un participante puede redactar un `CLAUDE.md` para un
  proyecto Java existente siguiendo únicamente el módulo, en menos de
  **15 minutos**, partiendo del snippet copiable adecuado.
- **SC-003**: La comparativa antes/después contiene **al menos tres
  mejoras concretas** identificables sin lectura interpretativa (formato
  ejecutable, verbos imperativos, ausencia de contenido volátil, etc.).
- **SC-004**: 5 de 5 revisiones internas del módulo confirman que los
  ejemplos "pobre" son plausibles (no caricaturas), y que los ejemplos
  "bueno" son directamente aplicables sin edición conceptual (aceptable
  soft-gate 3/3 documentado si no hay 5 revisores).
- **SC-005**: `uv run mkdocs build --strict` termina con exit 0 y
  cero `WARNING` tras publicar el módulo.
- **SC-006**: Desde la home del sitio, un participante llega a la
  sección "restricciones ejecutables" de `buenas-practicas.md` en menos
  de **90 segundos** sin usar el buscador.

## Assumptions

- La documentación oficial de Claude Code sobre `CLAUDE.md` (ubicaciones
  válidas, momento de lectura, precedencia entre capas) es la fuente
  autorizada al redactar. Si esa documentación cambia, el módulo se
  re-verifica bajo la política semestral heredada de la constitution
  1.0.2 (aunque este módulo no declara versiones de herramientas
  externas).
- Los ejemplos de proyectos Java (Spring Boot 4 y legacy 2.7) no
  requieren código funcional: son plantillas de `CLAUDE.md` con
  convenciones realistas. El código de aplicación real llega con la
  spec 4.
- El `CLAUDE.md` del repositorio de la formación se publica como parte
  de este módulo (FR-008a, Clarifications 2026-09-16). No es opcional.
- Los enlaces desde `docs/setup/index.md` (FR-009) y hacia el módulo SDD
  (FR-011) se materializan aquí o quedan como placeholders con enlace
  válido cuando la spec correspondiente esté publicada.
- No se ejecutan agentes ni skills en este módulo: sólo texto y
  snippets.

**Deferidos a specs posteriores** (fuera de alcance aquí):

- App CRUD Spring Boot 4 real (spec 4) — los ejemplos de `CLAUDE.md`
  para proyecto no dependen de la app real.
- Módulo SDD (spec 5).
- Agentes / skills (specs 6 y 7).
- Pipeline CI/CD (spec 8).
