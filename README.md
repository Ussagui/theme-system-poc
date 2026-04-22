# Theme System POC

A proof-of-concept for a Vue 3 UI library foundation, exploring two pillars: **theming via CSS custom properties** and **composition via reka-ui's headless primitives**.

## What this demonstrates

### Theming

CSS custom properties scoped by `data-theme` attribute on `<html>`. Switching themes is a single attribute change — no JS color manipulation, no class churn. The token hierarchy is:

```
@theme { }                  ← Tailwind v4 theme block; registers primitives as utilities
                              and sets the default token values (= theme-sword)
  ↓
[data-theme='*'] { }        ← per-theme overrides (colors, radius, font family)
  ↓
Button.css / Dialog.css … ← component semantic tokens (--btn-bg, --dialog-shadow, …)
  ↓
[data-theme='*'] { }        ← component-level per-theme overrides (e.g. button intent swap)
```

Tailwind v4's `@theme` registers primitives as utilities (`bg-primary`, `text-on-surface-muted`, `bg-surface-raised`, …) that resolve through the CSS variable at runtime, so all utilities respond to theme switches automatically.

The Theme Inspector sidebar shows live token values and highlights which ones changed on each switch.

### Composition

Components are built on [reka-ui](https://reka-ui.com) headless primitives. reka-ui handles accessibility, keyboard navigation, focus trapping, and ARIA — components handle only appearance.

The `asChild` pattern lets you render any reka-ui part as your own component:

```vue
<PDialogTrigger :as-child="true">
  <PButton>Open Dialog</PButton>   <!-- PButton renders, PDialogTrigger behaviour -->
</PDialogTrigger>
```

Wrappers are only added when they contribute styling or structure (e.g. `PDialogContent` bundles Portal + Overlay + Content). Pure pass-throughs (`PDialogRoot`, `PDialogTrigger`, `PDialogClose`) are re-exported directly from reka-ui.

## Tech stack

| Tool | Role |
|---|---|
| Vue 3 + `<script setup>` | Component authoring |
| [reka-ui](https://reka-ui.com) | Headless accessible primitives |
| [tailwind-variants](https://www.tailwind-variants.org) | Typed variant API for components |
| Tailwind CSS v4 | Utility classes + `@theme` token registration |
| CSS custom properties | Runtime theming tokens |
| Vite + vite-plugin-dts | Dev server, library build, type declarations |
| Storybook 10 (`@storybook/vue3-vite`) | Component documentation and visual testing |
| `@storybook/addon-themes` | Live `data-theme` switching in Storybook toolbar |
| rollup-plugin-visualizer | Interactive bundle analysis |

## Monorepo structure

```
theme-system-poc/
  packages/
    ui/                   ← @phoenix-ui/ui library
  apps/
    storybook/            ← @phoenix-ui/storybook Storybook app
    demo/                 ← @phoenix-ui/demo Vite + Vue 3 consumer app
```

## Commands

```bash
pnpm install              # install all workspace dependencies

pnpm storybook            # start Storybook at http://localhost:6006
pnpm build-storybook      # build Storybook

pnpm demo                 # start demo app dev server
pnpm build-demo           # build demo app
pnpm analyze-demo         # build demo app + open interactive bundle treemap

pnpm build                # build @phoenix-ui/ui → packages/ui/dist/
pnpm type-check           # type-check all packages
```

## Dev flow

Both Storybook and the demo app resolve `@phoenix-ui/ui` directly to `packages/ui/src` via `resolve.alias` in their Vite configs. This means editing any file in the library triggers Vite's native HMR instantly in whichever app is running — no separate library build step needed.

```bash
pnpm storybook   # edit components in packages/ui/src → Storybook hot-reloads
pnpm demo        # edit components in packages/ui/src → demo hot-reloads
```

`pnpm build` is only needed to publish the library or produce static Storybook output.

**What makes this work:**
- `resolve.alias` — bypasses `dist/`, Vite serves raw source files directly
- `optimizeDeps.exclude` — prevents Vite from pre-bundling the source package at startup
- `resolve.dedupe: ['vue', 'reka-ui']` — single instance across the monorepo, required for provide/inject to work correctly

## Storybook

Opens at `http://localhost:6006`. The toolbar theme switcher sets `data-theme` on `<html>` — the same mechanism the library uses — so all component stories respond to live theme changes.

## Bundle analysis

```bash
pnpm analyze-demo
```

Builds the demo app and opens `apps/demo/dist/stats.html` — an interactive treemap showing module sizes with gzip and brotli breakdowns.

## Building as a library

```bash
pnpm build
```

Outputs to `packages/ui/dist/`:
- `index.js` — ES module bundle (Vue and reka-ui are external peer dependencies)
- `style.css` — all tokens + component styles, processed by Tailwind v4
- `index.d.ts` — full TypeScript declarations (rolled up into a single file)

### Consuming the library

Install with workspace or npm:

```ts
// app entry (once):
import '@phoenix-ui/ui/style'

// per component file — JS only, no extra CSS import needed:
import { PButton, PThemeProvider } from '@phoenix-ui/ui'
```

CSS strategy: `style.css` ships all tokens and component styles in one file. Import it once at the app entry point; component imports everywhere else are pure JS. This keeps per-file imports clean while keeping the loading model simple — a separate CSS file that browsers download in parallel with JS and cache independently.

## Library structure

```
packages/ui/src/
  tokens/
    base.css              ← @theme defaults (= theme-sword) + spacing, shadows, radius
    themes/
      theme-sword.css     ← Sword theme: font-family, radius override only
      theme-mind.css      ← Mind theme: colors, font-family, radius
  components/
    Button/               ← theming demo: variants, sizes, states
      Button.css          ← component semantic tokens (--btn-bg, …)
      Button.theme-mind.css ← mind-specific button token overrides
      Button.variants.ts  ← tailwind-variants slot definitions (exported)
    Dialog/               ← composition demo: compound component via reka-ui
      Dialog.css          ← semantic tokens (--dialog-bg, --dialog-shadow)
    Tooltip/              ← composition demo: tooltip via reka-ui
      Tooltip.css         ← semantic tokens (--tooltip-bg, --tooltip-text)
    ThemeProvider/        ← ThemeProvider component (wraps useThemeProvider)
  composables/
    useTheme.ts           ← provide/inject for active theme; exports Theme type
  style.css               ← library CSS entry (tokens + all component CSS)
  index.ts                ← library JS entry (all exports)
```

## Token architecture

### Primitive tokens (in `@theme`)

Registered as Tailwind utilities. Defaults match theme-sword; theme-mind overrides them:

| Token | Utility | Default |
|---|---|---|
| `--color-primary` | `bg-primary`, `text-primary`, … | `#4c6ef5` |
| `--color-secondary` | `bg-secondary`, `text-secondary`, … | `#e8404f` |
| `--color-neutral` | `bg-neutral`, `text-neutral`, … | `#868e96` |
| `--color-surface` | `bg-surface`, … | `#ffffff` |
| `--color-surface-raised` | `bg-surface-raised`, … | `#ffffff` |
| `--color-on-surface` | `text-on-surface`, … | `#18181b` |
| `--color-on-surface-muted` | `text-on-surface-muted`, … | `#6b7280` |
| `--color-on-primary` | `text-on-primary`, … | `#ffffff` |

### Non-color base tokens (in `:root`)

Not registered as Tailwind utilities — used via CSS arbitrary values in components:

| Token | Default |
|---|---|
| `--font-family` | `system-ui` |
| `--font-size-sm / md / lg` | `0.875rem / 1rem / 1.125rem` |
| `--space-xs … --space-2xl` | `0.25rem … 3rem` |
| `--radius` | `8px` |
| `--shadow-sm / md / lg` | `0 1px 3px … / 0 4px 12px … / 0 8px 32px …` |

### Component semantic tokens

Defined in per-component CSS files, defaulting to primitive tokens:

| Token | Default |
|---|---|
| `--btn-bg` | `var(--color-primary)` |
| `--btn-text` | `var(--color-on-primary)` |
| `--btn-secondary-bg` | `var(--color-secondary)` |
| `--dialog-bg` | `var(--color-surface-raised)` |
| `--dialog-shadow` | `var(--shadow-lg)` |
| `--tooltip-bg` | `var(--color-primary)` |
| `--tooltip-text` | `var(--color-on-primary)` |
