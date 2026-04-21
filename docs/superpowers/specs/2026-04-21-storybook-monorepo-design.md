# Storybook + Monorepo Design

**Date:** 2026-04-21
**Status:** Approved

## Goal

Restructure the repo as a pnpm monorepo and add a Storybook 10 app that documents and showcases `@phoenix-ui/ui` components, with live theme switching matching the library's real `data-theme` mechanism.

---

## Monorepo Structure

```
theme-system-poc/              ← workspace root (no src, no build)
  package.json                 ← workspace root scripts only
  pnpm-workspace.yaml          ← packages: ['packages/*', 'apps/*']
  packages/
    ui/                        ← moved from current root
      src/
      vite.config.ts
      tsconfig*.json
      package.json             ← name: "@phoenix-ui/ui"
  apps/
    storybook/                 ← new
      .storybook/
        main.ts
        preview.ts
      src/
        stories/
          Button.stories.ts
          Dialog.stories.ts
          Tooltip.stories.ts
      package.json             ← name: "@phoenix-ui/storybook"
```

### Workspace root `package.json`

- `name`: `phoenix-ui` (private, not published)
- `scripts`:
  - `dev`: `pnpm --filter @phoenix-ui/ui dev`
  - `build`: `pnpm --filter @phoenix-ui/ui build`
  - `storybook`: `pnpm --filter @phoenix-ui/storybook storybook`
  - `build-storybook`: `pnpm --filter @phoenix-ui/storybook build-storybook`
  - `type-check`: `pnpm -r type-check`

### `pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
onlyBuiltDependencies:
  - vue-demi
```

---

## UI Library package (`packages/ui`)

All files from the current root move here verbatim. Only `package.json` changes:

- `name`: `@phoenix-ui/ui` (was `sebthemesystem`)
- All relative paths inside the package remain the same — nothing else needs updating.

The `dist/` output stays inside `packages/ui/dist/`. The exports field remains:
```json
".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
"./style": "./dist/style.css"
```

---

## Storybook App (`apps/storybook`)

### Dependencies

```json
{
  "dependencies": {
    "@phoenix-ui/ui": "workspace:*"
  },
  "devDependencies": {
    "@storybook/vue3-vite": "^10.0.0",
    "@storybook/addon-themes": "^10.0.0",
    "storybook": "^10.0.0",
    "@tailwindcss/vite": "^4.2.2",
    "tailwindcss": "^4.2.2",
    "vue": "^3.5.0"
  }
}
```

> Exact versions are pinned by `storybook@latest init`. Storybook 10 is the current latest stable (10.3.x as of April 2026).

### `.storybook/main.ts`

```ts
import type { StorybookConfig } from '@storybook/vue3-vite'
import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  framework: '@storybook/vue3-vite',
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],
  viteFinal(config) {
    config.plugins ??= []
    config.plugins.push(tailwindcss())
    return config
  },
}

export default config
```

`viteFinal` injects `@tailwindcss/vite` into Storybook's internal Vite config so Tailwind v4 processes the imported CSS correctly.

### `.storybook/preview.ts`

```ts
import { setup } from '@storybook/vue3-vite'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/vue3-vite'
import { ThemeProvider } from '@phoenix-ui/ui'
import '@phoenix-ui/ui/style'

setup((app) => {
  app.component('ThemeProvider', ThemeProvider)
})

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        'theme-sword': 'theme-sword',
        'theme-mind':  'theme-mind',
      },
      defaultTheme: 'theme-sword',
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    layout: 'centered',
  },
}

export default preview
```

`withThemeByDataAttribute` sets the `data-theme` attribute on `<html>` when the user picks a theme in the Storybook toolbar — the same mechanism the library uses — so theme switching in Storybook is real, not a simulation.

---

## Stories

All stories use CSF3 format. Each story file:
- Exports a `default` meta object with `component`, `title`, `tags: ['autodocs']`
- Exports named stories covering the meaningful prop/state axes

### `Button.stories.ts`

Axes covered:
- `intent`: primary, secondary
- `size`: sm, md, lg
- `rounded`: full, md, none
- States: disabled, loading, with icon slot

### `Dialog.stories.ts`

Axes covered:
- Default (trigger + content with title, description, close action)
- The `asChild` pattern (`DialogTrigger` with `Button` via `:as-child`)

### `Tooltip.stories.ts`

Axes covered:
- Default tooltip
- Different `side` values (top, bottom, left, right) via `TooltipContent` props

---

## File Migration Plan

The move from root to `packages/ui/` touches the following files:

| Source | Destination |
|--------|-------------|
| `src/` | `packages/ui/src/` |
| `vite.config.ts` | `packages/ui/vite.config.ts` |
| `tsconfig*.json` | `packages/ui/tsconfig*.json` |
| `env.d.ts` | `packages/ui/env.d.ts` |
| `package.json` | `packages/ui/package.json` (name updated) |
| `index.html` | `packages/ui/index.html` |
| `public/` | `packages/ui/public/` |

Root `package.json` becomes a bare workspace root.
Root `pnpm-workspace.yaml` updated to declare packages.
Root `eslint.config.ts` stays at root (applies to whole workspace).
Root `.gitignore` stays at root.

---

## Out of Scope

- Accessibility (`@storybook/addon-a11y`) — not in this iteration
- Viewport addon — not in this iteration
- Dark mode / additional themes — token system supports it, not added here
- Publishing `@phoenix-ui/ui` to npm — private POC
- CI/CD for Storybook build — not in this iteration
