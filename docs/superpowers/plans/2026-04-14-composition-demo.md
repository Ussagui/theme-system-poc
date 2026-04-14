# Composition Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a styled `Dialog` compound component that demonstrates reka-ui's `asChild` and independent-parts composition model in a new "Composition" section of the existing POC.

**Architecture:** Six thin Vue wrappers around reka-ui Dialog primitives (`DialogRoot`, `DialogTrigger`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogClose`). Token-based CSS lives in `Dialog.css`, imported via the central `src/styles/index.css`. `App.vue` gets a new Composition section below the untouched Button demos.

**Tech Stack:** Vue 3 (`<script setup>`), reka-ui Dialog primitives, CSS custom properties (token system), Tailwind (utility classes available but not required here), pnpm, Vite.

---

## File Map

**New files:**
- `src/components/Dialog/DialogRoot.vue`
- `src/components/Dialog/DialogTrigger.vue`
- `src/components/Dialog/DialogContent.vue`
- `src/components/Dialog/DialogTitle.vue`
- `src/components/Dialog/DialogDescription.vue`
- `src/components/Dialog/DialogClose.vue`
- `src/components/Dialog/Dialog.css`
- `src/components/Dialog/index.ts`

**Modified files:**
- `src/tokens/base.css` — add `--radius` token
- `src/tokens/themes/theme-sword.css` — add `--radius: 6px`
- `src/tokens/themes/theme-mind.css` — add `--radius: 12px`
- `src/styles/index.css` — fix stale theme imports + add Dialog CSS import
- `src/index.ts` — export Dialog parts
- `src/App.vue` — import Dialog parts + add Composition section

---

## Task 1: Fix CSS imports and add `--radius` token

**Files:**
- Modify: `src/styles/index.css`
- Modify: `src/tokens/base.css`
- Modify: `src/tokens/themes/theme-sword.css`
- Modify: `src/tokens/themes/theme-mind.css`

- [ ] **Step 1: Fix stale theme imports in `src/styles/index.css`**

`theme-a.css` and `theme-b.css` are deleted on disk. Replace them with the current theme files and add the Dialog CSS import (which we'll create in Task 2 — adding the import now keeps the change in one commit).

Replace the full content of `src/styles/index.css` with:

```css
@import 'tailwindcss';
@import './reset.css';
@import './app.css';
@import '../tokens/base.css';
@import '../tokens/themes/theme-sword.css';
@import '../tokens/themes/theme-mind.css';
@import '../components/Button/Button.css';
@import '../components/Dialog/Dialog.css';
```

- [ ] **Step 2: Add `--radius` to `src/tokens/base.css`**

```css
@layer base {
  :root {
    /* tipografia */
    --font-size-sm: 0.875rem;
    --font-size-md: 1rem;
    --font-size-lg: 1.125rem;

    /* border radius */
    --radius: 8px;
  }
}
```

- [ ] **Step 3: Add `--radius` override to `src/tokens/themes/theme-sword.css`**

```css
@layer base {
  [data-theme='theme-sword'] {
    --font-family: system-ui, -apple-system, sans-serif;

    /* cores primitivas */
    --color-primary: #4c6ef5;
    --color-secondary: #e8404f;
    --color-neutral: #868e96;

    /* tokens semânticos do botão */
    --btn-bg: var(--color-primary);
    --btn-text: #ffffff;

    --btn-secondary-bg: var(--color-secondary);
    --btn-secondary-text: #ffffff;

    /* border radius */
    --radius: 6px;
  }
}
```

- [ ] **Step 4: Add `--radius` override to `src/tokens/themes/theme-mind.css`**

```css
@layer base {
  [data-theme='theme-mind'] {
    --font-family: Georgia, serif;

    /* cores primitivas */
    --color-primary: #0ca678;
    --color-secondary: #f76707;
    --color-neutral: #74c0fc;

    /* tokens semânticos do botão */
    --btn-bg: var(--color-primary);
    --btn-text: #ffffff;

    --btn-secondary-bg: var(--color-secondary);
    --btn-secondary-text: #ffffff;

    /* border radius */
    --radius: 12px;
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/styles/index.css src/tokens/base.css src/tokens/themes/theme-sword.css src/tokens/themes/theme-mind.css
git commit -m "feat: add --radius token and fix stale CSS imports"
```

---

## Task 2: Create Dialog.css

**Files:**
- Create: `src/components/Dialog/Dialog.css`

- [ ] **Step 1: Create `src/components/Dialog/Dialog.css`**

```css
@layer components {
  .dialog-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    animation: overlay-show 150ms ease;
  }

  .dialog-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    border-radius: var(--radius, 8px);
    padding: 28px 32px;
    width: 480px;
    max-width: calc(100vw - 32px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
    animation: content-show 150ms ease;
  }

  .dialog-title {
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 8px;
  }

  .dialog-description {
    font-size: var(--font-size-md);
    color: #6b7280;
    margin-bottom: 24px;
    line-height: 1.6;
  }

  .dialog-footer {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  @keyframes overlay-show {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes content-show {
    from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Dialog/Dialog.css
git commit -m "feat: add Dialog token-based styles"
```

---

## Task 3: Create Dialog Vue components

**Files:**
- Create: `src/components/Dialog/DialogRoot.vue`
- Create: `src/components/Dialog/DialogTrigger.vue`
- Create: `src/components/Dialog/DialogContent.vue`
- Create: `src/components/Dialog/DialogTitle.vue`
- Create: `src/components/Dialog/DialogDescription.vue`
- Create: `src/components/Dialog/DialogClose.vue`

- [ ] **Step 1: Create `src/components/Dialog/DialogRoot.vue`**

```vue
<script setup lang="ts">
import { DialogRoot } from 'reka-ui'
</script>

<template>
  <DialogRoot>
    <slot />
  </DialogRoot>
</template>
```

- [ ] **Step 2: Create `src/components/Dialog/DialogTrigger.vue`**

```vue
<script setup lang="ts">
import { DialogTrigger } from 'reka-ui'

defineProps<{ asChild?: boolean }>()
</script>

<template>
  <DialogTrigger :as-child="asChild">
    <slot />
  </DialogTrigger>
</template>
```

- [ ] **Step 3: Create `src/components/Dialog/DialogContent.vue`**

Bundles `DialogPortal` + `DialogOverlay` + `DialogContent` so consumers don't deal with portal setup.

```vue
<script setup lang="ts">
import { DialogPortal, DialogOverlay, DialogContent } from 'reka-ui'
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="dialog-overlay" />
    <DialogContent class="dialog-content">
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
```

- [ ] **Step 4: Create `src/components/Dialog/DialogTitle.vue`**

```vue
<script setup lang="ts">
import { DialogTitle } from 'reka-ui'
</script>

<template>
  <DialogTitle class="dialog-title">
    <slot />
  </DialogTitle>
</template>
```

- [ ] **Step 5: Create `src/components/Dialog/DialogDescription.vue`**

```vue
<script setup lang="ts">
import { DialogDescription } from 'reka-ui'
</script>

<template>
  <DialogDescription class="dialog-description">
    <slot />
  </DialogDescription>
</template>
```

- [ ] **Step 6: Create `src/components/Dialog/DialogClose.vue`**

```vue
<script setup lang="ts">
import { DialogClose } from 'reka-ui'

defineProps<{ asChild?: boolean }>()
</script>

<template>
  <DialogClose :as-child="asChild">
    <slot />
  </DialogClose>
</template>
```

- [ ] **Step 7: Commit**

```bash
git add src/components/Dialog/
git commit -m "feat: add Dialog compound component wrappers"
```

---

## Task 4: Wire up exports

**Files:**
- Create: `src/components/Dialog/index.ts`
- Modify: `src/index.ts`

- [ ] **Step 1: Create `src/components/Dialog/index.ts`**

```ts
export { default as DialogRoot } from './DialogRoot.vue'
export { default as DialogTrigger } from './DialogTrigger.vue'
export { default as DialogContent } from './DialogContent.vue'
export { default as DialogTitle } from './DialogTitle.vue'
export { default as DialogDescription } from './DialogDescription.vue'
export { default as DialogClose } from './DialogClose.vue'
```

- [ ] **Step 2: Update `src/index.ts`**

```ts
export { Button } from './components/Button'
export * from './components/Dialog'
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Dialog/index.ts src/index.ts
git commit -m "feat: export Dialog parts from library index"
```

---

## Task 5: Add Composition section to App.vue

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: Add Dialog imports to the `<script setup>` block**

In `src/App.vue`, the existing import line is:

```ts
import { Button } from './index'
```

Replace it with:

```ts
import { Button, DialogRoot, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from './index'
```

- [ ] **Step 2: Add the Composition section to the template**

In `src/App.vue`, after the closing `</div>` of the `.demos` div and before the closing `</main>`, add:

```html
      <h1 class="page-title" style="margin-top: 56px;">Composition</h1>

      <div class="demos">
        <div class="demo-row">
          <span class="demo-label">Dialog</span>
          <span class="color-code" style="font-size: 10px; width: 120px;">&lt;DialogTrigger asChild&gt;</span>
          <DialogRoot>
            <DialogTrigger :as-child="true">
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Confirm action</DialogTitle>
              <DialogDescription>
                reka-ui handles focus trapping, scroll lock, escape key, and
                aria-modal. Your components, reka-ui's behaviour.
              </DialogDescription>
              <div class="dialog-footer">
                <DialogClose :as-child="true">
                  <Button>Confirm</Button>
                </DialogClose>
                <DialogClose :as-child="true">
                  <Button intent="secondary">Cancel</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </DialogRoot>
        </div>
      </div>
```

- [ ] **Step 3: Commit**

```bash
git add src/App.vue
git commit -m "feat: add Composition section with Dialog asChild demo"
```

---

## Task 6: Visual verification

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev
```

Expected: server starts at `http://localhost:5173` (or similar) with no build errors.

- [ ] **Step 2: Verify Button demos are untouched**

Open the app. The "Button" section should look exactly as before. Switch themes — all button variants should still update correctly.

- [ ] **Step 3: Verify Dialog opens and closes**

Scroll to the "Composition" section. Click "Open Dialog":
- Overlay should appear (semi-transparent dark backdrop)
- Dialog panel should animate in from centre
- Title should use `--color-primary` (blue in theme-sword, green in theme-mind)
- Press Escape — dialog should close
- Click "Confirm" or "Cancel" — dialog should close

- [ ] **Step 4: Verify `--radius` differs per theme**

With the dialog open, switch themes using the sidebar. Dialog `border-radius` should visibly change:
- `theme-sword` → 6px (sharper corners)
- `theme-mind` → 12px (softer corners)

- [ ] **Step 5: Verify focus trapping**

With the dialog open, press Tab repeatedly. Focus should cycle between "Confirm" and "Cancel" without escaping to the background.
