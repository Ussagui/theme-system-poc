# Storybook + Monorepo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the repo as a pnpm monorepo (`packages/ui` + `apps/storybook`) and ship a Storybook 10 app that documents Button, Dialog, and Tooltip with live `data-theme` switching.

**Architecture:** The current root becomes a bare workspace root; all library files move to `packages/ui/` via `git mv` (preserving history); a new `apps/storybook/` package references the library via `workspace:*`. Storybook's `viteFinal` aliases `@phoenix-ui/ui` to the library source so no pre-build is needed during development.

**Tech Stack:** pnpm workspaces, Storybook 10 (`@storybook/vue3-vite`), `@storybook/addon-themes`, Tailwind CSS v4, Vue 3, TypeScript

---

## File Map

| Action | Path |
|--------|------|
| Modify | `pnpm-workspace.yaml` |
| Create | `package.json` (new bare root, replaces current) |
| Move → | `packages/ui/src/` |
| Move → | `packages/ui/env.d.ts` |
| Move → | `packages/ui/index.html` |
| Move → | `packages/ui/package.json` (name updated to `@phoenix-ui/ui`) |
| Move → | `packages/ui/public/` |
| Move → | `packages/ui/tsconfig.json` |
| Move → | `packages/ui/tsconfig.app.json` |
| Move → | `packages/ui/tsconfig.node.json` |
| Move → | `packages/ui/tsconfig.vitest.json` |
| Move → | `packages/ui/vite.config.ts` |
| Move → | `packages/ui/vitest.config.ts` |
| Keep | `eslint.config.ts` (root, applies workspace-wide) |
| Keep | `.gitignore` (root) |
| Modify | `packages/ui/src/components/Tooltip/TooltipContent.vue` (add `side` prop) |
| Create | `apps/storybook/package.json` |
| Create | `apps/storybook/.storybook/main.ts` |
| Create | `apps/storybook/.storybook/preview.ts` |
| Create | `apps/storybook/src/stories/Button.stories.ts` |
| Create | `apps/storybook/src/stories/Dialog.stories.ts` |
| Create | `apps/storybook/src/stories/Tooltip.stories.ts` |

---

### Task 1: Update workspace config and create directory scaffolding

**Files:**
- Modify: `pnpm-workspace.yaml`

- [ ] **Step 1: Add packages declaration to pnpm-workspace.yaml**

Replace the file contents with:

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
onlyBuiltDependencies:
  - vue-demi
```

- [ ] **Step 2: Create the directory structure**

```bash
mkdir -p packages/ui
mkdir -p apps/storybook/.storybook
mkdir -p apps/storybook/src/stories
```

- [ ] **Step 3: Verify directories exist**

```bash
ls packages/ && ls apps/
```

Expected output:
```
ui
storybook
```

- [ ] **Step 4: Commit**

```bash
git add pnpm-workspace.yaml
git commit -m "chore: scaffold monorepo directory structure"
```

---

### Task 2: Move UI library files into packages/ui/

**Files:**
- Source: everything at root (src/, vite.config.ts, tsconfig*.json, env.d.ts, index.html, public/, vitest.config.ts)
- Destination: packages/ui/

- [ ] **Step 1: git mv all library files**

```bash
git mv src packages/ui/src
git mv vite.config.ts packages/ui/vite.config.ts
git mv tsconfig.json packages/ui/tsconfig.json
git mv tsconfig.app.json packages/ui/tsconfig.app.json
git mv tsconfig.node.json packages/ui/tsconfig.node.json
git mv tsconfig.vitest.json packages/ui/tsconfig.vitest.json
git mv env.d.ts packages/ui/env.d.ts
git mv index.html packages/ui/index.html
git mv public packages/ui/public
git mv vitest.config.ts packages/ui/vitest.config.ts
```

- [ ] **Step 2: Verify the moves**

```bash
ls packages/ui/
```

Expected output includes: `env.d.ts  index.html  public  src  tsconfig.app.json  tsconfig.json  tsconfig.node.json  tsconfig.vitest.json  vite.config.ts  vitest.config.ts`

- [ ] **Step 3: Move package.json last (git mv requires target dir to exist first)**

```bash
git mv package.json packages/ui/package.json
```

- [ ] **Step 4: Commit the moves**

```bash
git add -A
git commit -m "chore: move UI library files into packages/ui"
```

---

### Task 3: Update packages/ui/package.json and create root package.json

**Files:**
- Modify: `packages/ui/package.json` (rename to `@phoenix-ui/ui`)
- Create: `package.json` (bare workspace root)

- [ ] **Step 1: Update name in packages/ui/package.json**

Edit `packages/ui/package.json` — change the `"name"` field from `"sebthemesystem"` to `"@phoenix-ui/ui"`. No other changes needed; all paths inside the package remain relative and still valid.

The result should have:
```json
{
  "name": "@phoenix-ui/ui",
  ...
}
```

- [ ] **Step 2: Create the bare workspace root package.json**

Write `package.json` at the repo root:

```json
{
  "name": "phoenix-ui",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter @phoenix-ui/ui dev",
    "build": "pnpm --filter @phoenix-ui/ui build",
    "storybook": "pnpm --filter @phoenix-ui/storybook storybook",
    "build-storybook": "pnpm --filter @phoenix-ui/storybook build-storybook",
    "type-check": "pnpm -r type-check"
  }
}
```

- [ ] **Step 3: Run pnpm install from the root to regenerate the lockfile for the new structure**

```bash
pnpm install
```

Expected: installs packages for the workspace. `packages/ui` is now a workspace package.

- [ ] **Step 4: Verify the UI library builds from its new location**

```bash
pnpm --filter @phoenix-ui/ui build
```

Expected: clean build, `packages/ui/dist/` contains `index.js`, `style.css`, `index.d.ts`.

- [ ] **Step 5: Commit**

```bash
git add package.json packages/ui/package.json pnpm-lock.yaml
git commit -m "chore: rename package to @phoenix-ui/ui, create bare root workspace package.json"
```

---

### Task 4: Add `side` prop to TooltipContent.vue

**Files:**
- Modify: `packages/ui/src/components/Tooltip/TooltipContent.vue`

This prop is required for the Tooltip stories to demonstrate different placements.

- [ ] **Step 1: Update TooltipContent.vue**

Replace the entire file:

```vue
<script setup lang="ts">
import { TooltipPortal, TooltipContent } from 'reka-ui'

defineProps<{
  side?: 'top' | 'bottom' | 'left' | 'right'
}>()
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      :side="side"
      :side-offset="6"
      class="bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] text-(length:--font-size-sm) px-3 py-1.5 rounded-(--radius,4px) shadow-md select-none"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
```

- [ ] **Step 2: Verify the library still builds cleanly**

```bash
pnpm --filter @phoenix-ui/ui build
```

Expected: clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/Tooltip/TooltipContent.vue
git commit -m "feat(tooltip): add side prop to TooltipContent"
```

---

### Task 5: Create apps/storybook/package.json

**Files:**
- Create: `apps/storybook/package.json`

- [ ] **Step 1: Write apps/storybook/package.json**

```json
{
  "name": "@phoenix-ui/storybook",
  "private": true,
  "type": "module",
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "@phoenix-ui/ui": "workspace:*"
  },
  "devDependencies": {
    "@storybook/addon-themes": "^10.0.0",
    "@storybook/vue3-vite": "^10.0.0",
    "@tailwindcss/vite": "^4.2.2",
    "reka-ui": "^2.9.0",
    "storybook": "^10.0.0",
    "tailwindcss": "^4.2.2",
    "vue": "^3.5.0"
  }
}
```

> `reka-ui` is listed explicitly because `@phoenix-ui/ui` lists it as a peer dependency; Storybook bundles the library source and must be able to resolve it.

- [ ] **Step 2: Install storybook dependencies**

```bash
pnpm --filter @phoenix-ui/storybook install
```

Expected: `apps/storybook/node_modules/` is populated, `pnpm-lock.yaml` updated.

- [ ] **Step 3: Commit**

```bash
git add apps/storybook/package.json pnpm-lock.yaml
git commit -m "chore: add @phoenix-ui/storybook package with Storybook 10 dependencies"
```

---

### Task 6: Write .storybook/main.ts

**Files:**
- Create: `apps/storybook/.storybook/main.ts`

- [ ] **Step 1: Write main.ts**

```ts
import { fileURLToPath, URL } from 'node:url'
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

    config.resolve ??= {}
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string>),
      '@phoenix-ui/ui': fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)),
      '@phoenix-ui/ui/style': fileURLToPath(new URL('../../packages/ui/src/style.css', import.meta.url)),
    }

    return config
  },
}

export default config
```

The two aliases let Storybook resolve `@phoenix-ui/ui` and `@phoenix-ui/ui/style` directly from the library source — no pre-build step required, and HMR works across packages.

- [ ] **Step 2: Commit**

```bash
git add apps/storybook/.storybook/main.ts
git commit -m "chore(storybook): write main.ts with tailwindcss plugin and source aliases"
```

---

### Task 7: Write .storybook/preview.ts

**Files:**
- Create: `apps/storybook/.storybook/preview.ts`

- [ ] **Step 1: Write preview.ts**

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
        'theme-mind': 'theme-mind',
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

`withThemeByDataAttribute` sets `data-theme` on `<html>` via the Storybook toolbar — the same attribute the library's CSS reads, so theme switching is real, not simulated.

- [ ] **Step 2: Verify Storybook starts (no stories yet)**

```bash
pnpm --filter @phoenix-ui/storybook storybook
```

Expected: dev server starts at `http://localhost:6006`, no fatal errors in console. Kill it with Ctrl-C.

- [ ] **Step 3: Commit**

```bash
git add apps/storybook/.storybook/preview.ts
git commit -m "chore(storybook): write preview.ts with theme decorator and CSS import"
```

---

### Task 8: Write Button.stories.ts

**Files:**
- Create: `apps/storybook/src/stories/Button.stories.ts`

Axes covered: `intent` (primary, secondary), `size` (sm, md, lg), `rounded` (full, md, none), `disabled`, `loading`, with icon slot.

- [ ] **Step 1: Write Button.stories.ts**

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Button } from '@phoenix-ui/ui'

const meta = {
  component: Button,
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    intent: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    rounded: { control: 'select', options: ['full', 'md', 'none'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Click me</Button>`,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'full',
  },
}

export const Secondary: Story = {
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Click me</Button>`,
  }),
  args: {
    intent: 'secondary',
    size: 'md',
    rounded: 'full',
  },
}

export const Small: Story = {
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Small</Button>`,
  }),
  args: {
    intent: 'primary',
    size: 'sm',
    rounded: 'full',
  },
}

export const Large: Story = {
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Large</Button>`,
  }),
  args: {
    intent: 'primary',
    size: 'lg',
    rounded: 'full',
  },
}

export const RoundedMd: Story = {
  name: 'Rounded md',
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Rounded</Button>`,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'md',
  },
}

export const RoundedNone: Story = {
  name: 'Rounded none',
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Sharp</Button>`,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'none',
  },
}

export const Disabled: Story = {
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Disabled</Button>`,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'full',
    disabled: true,
  },
}

export const Loading: Story = {
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Saving…</Button>`,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'full',
    loading: true,
  },
}

export const WithIcon: Story = {
  name: 'With icon',
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `
      <Button v-bind="args">
        <template #icon>★</template>
        Starred
      </Button>
    `,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'full',
  },
}
```

- [ ] **Step 2: Verify Button stories appear in Storybook**

```bash
pnpm --filter @phoenix-ui/storybook storybook
```

Open `http://localhost:6006`. Navigate to **Components > Button**. Verify all 8 stories render and the theme switcher in the toolbar changes colors. Kill server.

- [ ] **Step 3: Commit**

```bash
git add apps/storybook/src/stories/Button.stories.ts
git commit -m "feat(storybook): add Button stories (intent, size, rounded, disabled, loading, icon)"
```

---

### Task 9: Write Dialog.stories.ts

**Files:**
- Create: `apps/storybook/src/stories/Dialog.stories.ts`

Axes covered: Default (trigger + content), asChild pattern (DialogTrigger renders a Button).

- [ ] **Step 1: Write Dialog.stories.ts**

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Button,
} from '@phoenix-ui/ui'

const meta = {
  title: 'Components/Dialog',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { DialogRoot, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, Button },
    template: `
      <DialogRoot>
        <DialogTrigger as-child>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>This action cannot be undone. Are you sure?</DialogDescription>
          <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; justify-content: flex-end;">
            <DialogClose as-child>
              <Button intent="secondary" size="sm">Cancel</Button>
            </DialogClose>
            <DialogClose as-child>
              <Button intent="primary" size="sm">Confirm</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogRoot>
    `,
  }),
}

export const AsChild: Story = {
  name: 'Trigger as Button (asChild)',
  render: () => ({
    components: { DialogRoot, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, Button },
    template: `
      <DialogRoot>
        <DialogTrigger :as-child="true">
          <Button intent="secondary">Open with asChild</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>asChild pattern</DialogTitle>
          <DialogDescription>
            DialogTrigger renders the Button element directly — no wrapper div.
            Inspect the DOM to confirm.
          </DialogDescription>
          <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
            <DialogClose as-child>
              <Button size="sm">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogRoot>
    `,
  }),
}
```

- [ ] **Step 2: Verify Dialog stories in Storybook**

```bash
pnpm --filter @phoenix-ui/storybook storybook
```

Open `http://localhost:6006`. Navigate to **Components > Dialog**. Click the trigger button — the dialog should open with overlay and focus trap. Switch themes via toolbar; dialog background and text should update. Kill server.

- [ ] **Step 3: Commit**

```bash
git add apps/storybook/src/stories/Dialog.stories.ts
git commit -m "feat(storybook): add Dialog stories (default, asChild trigger)"
```

---

### Task 10: Write Tooltip.stories.ts

**Files:**
- Create: `apps/storybook/src/stories/Tooltip.stories.ts`

Axes covered: Default (top), and all four sides (top, bottom, left, right).

- [ ] **Step 1: Write Tooltip.stories.ts**

```ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  Button,
} from '@phoenix-ui/ui'

const meta = {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const makeTooltipStory = (side: 'top' | 'bottom' | 'left' | 'right'): Story => ({
  render: () => ({
    components: { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent, Button },
    setup() { return { side } },
    template: `
      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger as-child>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent :side="side">Tooltip on {{ side }}</TooltipContent>
        </TooltipRoot>
      </TooltipProvider>
    `,
  }),
})

export const Top: Story = makeTooltipStory('top')
export const Bottom: Story = makeTooltipStory('bottom')
export const Left: Story = makeTooltipStory('left')
export const Right: Story = makeTooltipStory('right')
```

- [ ] **Step 2: Verify Tooltip stories in Storybook**

```bash
pnpm --filter @phoenix-ui/storybook storybook
```

Open `http://localhost:6006`. Navigate to **Components > Tooltip**. Hover the button in each story — tooltip should appear on the expected side in theme colors. Kill server.

- [ ] **Step 3: Commit**

```bash
git add apps/storybook/src/stories/Tooltip.stories.ts
git commit -m "feat(storybook): add Tooltip stories (top, bottom, left, right)"
```

---

### Task 11: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add monorepo and Storybook sections to README**

Add the following after the existing "Running" section:

```markdown
## Monorepo structure

```
theme-system-poc/
  packages/
    ui/                   ← @phoenix-ui/ui library
  apps/
    storybook/            ← @phoenix-ui/storybook Storybook app
```

## Running Storybook

```bash
pnpm storybook
```

Opens at `http://localhost:6006`. The toolbar theme switcher sets `data-theme` on `<html>` — the same mechanism the library uses — so all component stories respond to live theme changes.
```

- [ ] **Step 2: Update the tech stack table in README**

Add these two rows to the existing table:

```markdown
| Storybook 10 (`@storybook/vue3-vite`) | Component documentation and visual testing |
| `@storybook/addon-themes` | Live `data-theme` switching in Storybook toolbar |
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: update README for monorepo structure and Storybook"
```

---

## Self-Review

### Spec coverage check

| Spec requirement | Task |
|-----------------|------|
| pnpm monorepo `packages/ui` + `apps/storybook` | Tasks 1–3 |
| `packages/ui` name `@phoenix-ui/ui`, exports unchanged | Task 3 |
| `pnpm-workspace.yaml` with packages + onlyBuiltDependencies | Task 1 |
| Root scripts: dev, build, storybook, build-storybook, type-check | Task 3 |
| `@storybook/vue3-vite` + `@storybook/addon-themes` + `storybook ^10` | Task 5 |
| `@phoenix-ui/ui: workspace:*` dependency | Task 5 |
| `.storybook/main.ts` with tailwindcss viteFinal | Task 6 |
| `.storybook/preview.ts` with withThemeByDataAttribute on `data-theme` | Task 7 |
| `Button.stories.ts`: intent, size, rounded, disabled, loading, icon | Task 8 |
| `Dialog.stories.ts`: default + asChild | Task 9 |
| `Tooltip.stories.ts`: default + four sides | Task 10 |
| `eslint.config.ts` stays at root | ✓ (not moved) |
| `dist/` stays inside `packages/ui/dist/` | ✓ (vite.config.ts relative paths unchanged) |

### Placeholder scan
No TBDs or TODOs in the plan. All code steps contain complete, runnable code.

### Type consistency
- `side` prop type in TooltipContent.vue: `'top' | 'bottom' | 'left' | 'right'` — matches `makeTooltipStory` parameter type in Tooltip.stories.ts.
- Story imports in all three story files use named exports from `@phoenix-ui/ui` exactly as defined in `packages/ui/src/index.ts`.
- `Meta`, `StoryObj` imported from `@storybook/vue3-vite` consistently across all story files.
