# Theme System POC

A proof-of-concept for a Vue 3 UI library foundation, exploring two pillars: **theming via CSS custom properties** and **composition via reka-ui's headless primitives**.

## What this demonstrates

### Theming

CSS custom properties defined at the `:root` level, overridden per theme with a `data-theme` attribute on `<html>`. The token hierarchy is:

```
base.css            ← sensible defaults (font sizes, radius, etc.)
  ↓
theme-*.css         ← theme overrides (colors, radius, font family)
  ↓
Button.css          ← component semantic tokens (--btn-bg, --btn-text, etc.)
```

Switching themes is a single attribute change — no JS bundle toggling, no class churn.

The Theme Inspector sidebar shows live token values and highlights which ones changed on each switch. Tokens marked **overridden** differ from the baseline (theme-sword).

### Composition

Components are built on [reka-ui](https://reka-ui.com) headless primitives. reka-ui handles accessibility, keyboard navigation, focus trapping, and ARIA — your components handle only appearance.

The `asChild` pattern lets you render any reka-ui part as your own component:

```vue
<DialogTrigger :as-child="true">
  <Button>Open Dialog</Button>   <!-- Button renders, DialogTrigger behaviour -->
</DialogTrigger>
```

Wrappers are only added when they contribute styling or bundle complexity (e.g. `DialogContent` bundles Portal + Overlay + Content). Pure pass-throughs (`DialogRoot`, `DialogTrigger`, `DialogClose`) are re-exported directly from reka-ui.

## Tech stack

| Tool | Role |
|---|---|
| Vue 3 + `<script setup>` | Component authoring |
| [reka-ui](https://reka-ui.com) | Headless accessible primitives |
| [tailwind-variants](https://www.tailwind-variants.org) | Typed variant API for components |
| Tailwind CSS v4 | Utility classes |
| CSS custom properties | Theming tokens |
| Vite | Dev server and build |
| Vitest | Unit testing |

## Running

```bash
pnpm install
pnpm dev
```

## Project structure

```
src/
  tokens/
    base.css              ← design tokens (defaults)
    themes/
      theme-sword.css     ← Sword theme overrides
      theme-mind.css      ← Mind theme overrides
  components/
    Button/               ← theming demo: variants, sizes, states
    Dialog/               ← composition demo: compound component via reka-ui
    Tooltip/              ← composition demo: tooltip via reka-ui
  composables/
    useTheme.ts           ← provide/inject for active theme
```
