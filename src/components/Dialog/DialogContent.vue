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
