# Composition Demo — Design Spec

**Date:** 2026-04-14  
**Status:** Approved

## Goal

Add a composition demo to the existing theming POC to sell reka-ui as the foundation for the new UI library. The demo shows reka-ui's composition model — specifically `asChild` and independently usable parts — using a styled `Dialog` component.

The Button demo (theming) is untouched.

## What Gets Built

A `Dialog` compound component: styled wrappers around reka-ui's Dialog primitives. Each part is its own named export. The demo in `App.vue` gets a new "Composition" section below the existing button demos.

## Component Structure

```
src/components/Dialog/
├── DialogRoot.vue         — thin pass-through of reka-ui DialogRoot
├── DialogTrigger.vue      — passes asChild through to reka-ui DialogTrigger
├── DialogContent.vue      — bundles Portal + Overlay + Content into one component
├── DialogTitle.vue        — styled wrapper of reka-ui DialogTitle
├── DialogDescription.vue  — styled wrapper of reka-ui DialogDescription
├── DialogClose.vue        — passes asChild through to reka-ui DialogClose
├── Dialog.css             — token-based styles for overlay and content panel
└── index.ts               — named exports for all parts
```

`src/components/Dialog` is added to `src/index.ts`.

## Token Usage

Dialog uses existing tokens from the theme system:

- `--font-size-lg` — dialog title
- `--color-primary` — title colour
- `--font-size-md` — description text

One new token is introduced in `src/tokens/base.css`:

- `--radius` — border-radius for the content panel (default `8px`). Each theme can override it.

## The Demo (App.vue)

A new **"Composition"** section is added below the existing button demos. It contains a single demo row:

```
"Dialog trigger"   [Open Dialog button]   ← <DialogTrigger asChild><Button>
```

Clicking it opens a dialog with:
- `DialogTitle` — "Confirm action"
- `DialogDescription` — a one-line explanation of what reka-ui is handling invisibly (focus trap, escape key, aria-modal)
- Two close buttons using `<DialogClose asChild><Button>`:
  - Primary intent — "Confirm"
  - Secondary intent — "Cancel"

The same `Button` component appears in three roles (trigger, confirm, cancel), which is the composition point made concretely.

## What the Demo Communicates

1. **`asChild` on trigger** — consumers bring their own component; reka-ui adds the open/close behaviour
2. **`asChild` on close buttons** — same component, different semantic roles
3. **Parts are independent exports** — consumers can omit `DialogTitle`, replace `DialogDescription` with custom markup, etc.
4. **Invisible behaviour for free** — focus trapping, scroll lock, escape key, `aria-modal` — all provided by reka-ui, none of it visible in the consumer code

## Out of Scope

- No new theming section in the sidebar inspector for Dialog tokens
- No animation beyond reka-ui defaults
- No mobile/responsive considerations
