<script setup lang="ts">
import { DialogPortal, DialogOverlay, DialogContent as RekaDialogContent } from 'reka-ui'
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="fixed inset-0 bg-black/50" />
    <RekaDialogContent class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--dialog-bg)] rounded-(--radius,8px) px-8 py-7 w-120 max-w-[calc(100vw-32px)] shadow-[var(--dialog-shadow)]">
      <slot />
    </RekaDialogContent>
  </DialogPortal>
</template>
