<script setup lang="ts">
import { DialogPortal, DialogOverlay, DialogContent as RekaDialogContent } from 'reka-ui'
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="dialog-overlay" />
    <RekaDialogContent class="dialog-content">
      <slot />
    </RekaDialogContent>
  </DialogPortal>
</template>
