# Port FacilityApi.github.io to Docusaurus

## Goal

Port the Facility API Framework site from its current Jekyll/Bootstrap implementation to a Docusaurus site modeled on `muchadonet.github.io`, while preserving public URLs and the existing live editor experience.

## Current State

FacilityApi.github.io is a small GitHub Pages/Jekyll site:

* `_config.yml` only defines the site title.
* `_layouts`, `_includes`, and `assets` provide Bootstrap-based page chrome, table styles, heading anchors, and a right-side table of contents.
* The documentation content is 13 Markdown pages plus the HTML landing page.
* `/editor` is a separate bundled web app that uses Monaco, `facility-generator-api`, and old webpack dependencies.

MuchAdoNet.github.io is the target model:

* Docusaurus 3 with `@docusaurus/preset-classic`.
* Docs are served at the site root with `docs.routeBasePath: '/'`.
* `trailingSlash: false` keeps extensionless routes like `/commands`.
* Local search is provided by `@easyops-cn/docusaurus-search-local`.
* Broken links, duplicate routes, broken anchors, and broken Markdown links throw during build.
* Syntax highlighting uses Prism plus Shiki through `@shikijs/rehype`.

## Target Structure

Create the Docusaurus app at the root of `FacilityApi.github.io`:

```text
FacilityApi.github.io/
  docusaurus.config.js
  package.json
  sidebars.js
  docs/
    README.md
    start.md
    why.md
    contribute.md
    define/
      index.md
      fsd.md
      swagger.md
    generate/
      index.md
      aspnet.md
      csharp.md
      javascript.md
      markdown.md
      tools.md
  src/
    css/
      custom.css
  static/
    editor/
      ...built editor assets...
```

Remove or archive the Jekyll-only pieces once the Docusaurus build has replaced them:

* `_config.yml`
* `_includes/`
* `_layouts/`
* `assets/default.css`
* `assets/page.css`

Keep `LICENSE` and `README.md`. Update the root `README.md` so it explains how to build and serve the Docusaurus site.

## Route Mapping

Preserve the current public route shape as closely as possible:

| Current route | Docusaurus source | Target route |
| --- | --- | --- |
| `/` | `docs/README.md` | `/` |
| `/why` | `docs/why.md` | `/why` |
| `/start` | `docs/start.md` | `/start` |
| `/define` | `docs/define/index.md` | `/define` |
| `/define/fsd` | `docs/define/fsd.md` | `/define/fsd` |
| `/define/swagger` | `docs/define/swagger.md` | `/define/swagger` |
| `/generate` | `docs/generate/index.md` | `/generate` |
| `/generate/aspnet` | `docs/generate/aspnet.md` | `/generate/aspnet` |
| `/generate/csharp` | `docs/generate/csharp.md` | `/generate/csharp` |
| `/generate/javascript` | `docs/generate/javascript.md` | `/generate/javascript` |
| `/generate/markdown` | `docs/generate/markdown.md` | `/generate/markdown` |
| `/generate/tools` | `docs/generate/tools.md` | `/generate/tools` |
| `/contribute` | `docs/contribute.md` | `/contribute` |
| `/editor` | `static/editor/index.html` or Docusaurus page wrapper | `/editor` |

Use `trailingSlash: false` in `docusaurus.config.js` to match the current extensionless routes.

## Implementation Plan

### 1. Bootstrap Docusaurus

* Add `package.json` using the same dependency family and scripts as `muchadonet.github.io`.
* Add `docusaurus.config.js` with Facility-specific metadata:
  * `title: 'Facility API Framework'`
  * `tagline: 'Design, implement, consume, and document APIs with simple API definitions.'`
  * `url: 'https://facilityapi.github.io'`
  * `baseUrl: '/'`
  * `organizationName: 'FacilityApi'`
  * `projectName: 'FacilityApi.github.io'`
* Configure strict validation:
  * `onBrokenAnchors: 'throw'`
  * `onBrokenLinks: 'throw'`
  * `onDuplicateRoutes: 'throw'`
  * `markdown.hooks.onBrokenMarkdownLinks: 'throw'`
* Configure docs like MuchAdo:
  * `routeBasePath: '/'`
  * `sidebarPath: './sidebars.js'`
  * `editUrl: 'https://github.com/FacilityApi/FacilityApi.github.io/tree/master/'`
  * `blog: false`
  * `theme.customCss: './src/css/custom.css'`
* Add local search with `docsRouteBasePath: '/'`.

### 2. Convert Content

* Move each Jekyll Markdown page into `docs/` according to the route mapping.
* Convert `index.html` into `docs/README.md` or a simple MDX landing page that keeps the same four core paths: Design, Implement, Consume, Document.
* Remove Jekyll front matter such as `layout: home`; add Docusaurus front matter where useful:
  * `sidebar_position` for ordering.
  * `title` when the generated sidebar label should differ from the first heading.
  * `slug` only where Docusaurus defaults do not preserve the target route.
* Convert absolute internal links from `/path` to relative Markdown links where practical, so Docusaurus can validate them. Examples:
  * `/start` -> `./start.md`
  * `/define/fsd` -> `./define/fsd.md` or `../define/fsd.md`
  * `/editor` can remain absolute if implemented as a static route outside docs validation.
* Check every heading link currently used by the site, especially links to sections in the FSD specification such as `/define/fsd#attributes`.

### 3. Sidebar And Navigation

* Start with an explicit sidebar instead of autogenerated ordering, because the current site has a small curated information architecture:
  * Introduction
  * Why Facility?
  * Get Started
  * Define API
  * Generate Code
  * Contribute
* Under Define API, list FSD Specification and OpenAPI/Swagger conversion.
* Under Generate Code, list tools and each generator page.
* Configure the navbar with:
  * Title: `Facility`
  * Docs dropdown or direct docs links for Why, Get Started, FSD Specification, and Generate Code.
  * `Live Editor` pointing to `/editor`.
  * GitHub link pointing to `https://github.com/FacilityApi`.

### 4. Styling And Theme

* Create `src/css/custom.css` based on MuchAdo's smaller heading scale and dark-mode Shiki support.
* Pick a Facility palette that works in light and dark mode and does not depend on Bootswatch Flatly/Darkly.
* Recreate only the useful global styles from the Jekyll CSS:
  * readable tables;
  * neutral code blocks;
  * compact documentation headings.
* Let Docusaurus provide the page layout, heading anchors, mobile navigation, right-side table of contents, and search UI.
* Avoid porting Bootstrap, jQuery, AnchorJS, or bootstrap-toc.

### 5. Syntax Highlighting

* Keep Prism languages needed by the docs, likely `csharp`, `javascript`, `typescript`, `json`, `bash`, and `yaml`.
* Add Shiki through `@shikijs/rehype` like MuchAdo.
* Add an FSD language strategy:
  * short term: render FSD examples as plain text or a close existing language if acceptable;
  * preferred: add a custom Shiki/TextMate grammar for `fsd` if one exists in Facility tooling or the VS Code extension.

### 6. Live Editor Strategy

The `/editor` app needs special handling because it is not ordinary documentation.

Preferred migration path:

* Keep the editor as a separate app during the first Docusaurus migration.
* Build or copy its current output into `static/editor/` so Docusaurus serves it at `/editor`.
* Preserve these files together:
  * `index.html`
  * `index.css`
  * `bundle.js`
  * `vs/`
* Verify that Monaco still loads from `vs/loader.js` and that `bundle.js` can find its assets from `/editor/`.

Follow-up modernization path:

* Upgrade the editor build from webpack 1 and Monaco 0.7 to a current bundler after the site port is complete.
* Consider wrapping the editor in a Docusaurus page only after the standalone route is stable.
* Keep the generator API form endpoint behavior unchanged until there is a separate product decision to replace it.

### 7. Build And Deploy

* Decide whether to commit `build/` like `muchadonet.github.io` currently does, or to publish with GitHub Actions from the generated Docusaurus output.
* If committing `build/`, document the exact regeneration command in `README.md`.
* If using GitHub Actions, add a workflow that:
  * installs Node 18 or newer;
  * runs `npm ci`;
  * runs `npm run build`;
  * publishes `build/` to GitHub Pages.
* Keep the deployment target compatible with GitHub Pages at `https://facilityapi.github.io/`.

### 8. Verification Checklist

Run these checks before switching over:

* `npm install`
* `npm run build`
* `npm run serve`
* Verify `/`, `/why`, `/start`, `/define/fsd`, `/generate`, `/generate/csharp`, `/contribute`, and `/editor` locally.
* Confirm Docusaurus search indexes all docs and does not index blog content.
* Confirm all current internal links resolve without redirects where possible.
* Confirm section anchors used by existing links still work.
* Confirm the editor can load the example FSD, generate previews, and submit the download form.
* Confirm mobile navigation and the docs table of contents work without custom Bootstrap scripts.

## Suggested Work Order

1. Add the Docusaurus config, package files, sidebar, and custom CSS.
2. Move and convert docs content.
3. Preserve `/editor` as a static standalone route.
4. Run the first build and fix broken links or duplicate routes.
5. Tune styling and navigation.
6. Update `README.md` and deployment instructions.
7. Decide whether to remove Jekyll files immediately or in a cleanup PR after deployment is verified.

## Risks And Open Questions

* The editor's old dependency stack may be difficult to rebuild on modern Node, so the first migration should treat existing built assets as the compatibility baseline.
* The FSD docs contain many section links; Docusaurus heading ID generation may not exactly match the current anchors.
* Facility FSD code blocks may need custom syntax highlighting to look as good as the current site.
* The repository needs a deployment decision: commit `build/` like MuchAdo, or move to GitHub Actions publishing.
* The current site has no lockfile; adding one will make the Docusaurus migration more reproducible.
