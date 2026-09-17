# Contract — Badges en README

**Feature**: 008-gitlab-pages-ci
**Fecha**: 2026-09-16

Contrato del bloque de badges añadido al `README.md`.

## Ubicación

- MUST situarse inmediatamente después del título de primer nivel (`# ...`) del README, antes de cualquier párrafo descriptivo.

## Badges obligatorios

### 1. Pipeline `main`

- **Imagen**: `<GITLAB_HOST>/<NAMESPACE>/<PROJECT>/badges/main/pipeline.svg`
- **Alt text**: `Pipeline status`
- **Enlace**: `<GITLAB_HOST>/<NAMESPACE>/<PROJECT>/-/pipelines?ref=main`
- **Formato Markdown**:
  ```markdown
  [![Pipeline status](<PIPELINE_BADGE_URL>)](<PIPELINE_LIST_URL>)
  ```
- **Restricción**: MUST reflejar el estado real del último pipeline de `main` (rojo cuando falla, verde cuando pasa).

### 2. Página publicada

- **Imagen**: badge estático (por ejemplo shields.io `https://img.shields.io/badge/Pages-online-brightgreen`) o badge nativo de GitLab.
- **Alt text**: `Sitio publicado`
- **Enlace**: URL de GitLab Pages del proyecto (valor de `$CI_PAGES_URL`, incluida literalmente en el README).
- **Formato Markdown**:
  ```markdown
  [![Sitio publicado](<PAGES_BADGE_URL>)](<PAGES_URL>)
  ```
- **Restricción**: la URL enlazada MUST llevar a un sitio accesible bajo la visibilidad **Internal**.

## Reglas transversales

- Los badges MUST caber en una sola línea de Markdown.
- Los placeholders `<GITLAB_HOST>`, `<NAMESPACE>`, `<PROJECT>` MUST sustituirse por valores reales del repositorio antes de mergear.
- NO MUST usarse tokens ni credenciales en las URLs.
- NO MUST añadirse badges adicionales fuera de alcance en esta feature (releases, coverage, etc.).

## Verificación

- Render del README en la UI de GitLab: los dos badges se muestran y son clicables.
- Provocar un fallo en el pipeline de `main` (build con warning) y comprobar que el badge se pone rojo tras <5 min.
- Click en badge "Sitio publicado" desde una sesión con login válido → carga el sitio.
- Click en badge "Sitio publicado" desde sesión anónima → GitLab redirige a login (visibilidad Internal).
