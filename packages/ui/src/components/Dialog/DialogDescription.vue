<script setup lang="ts">
import { DialogDescription } from 'reka-ui'

defineOptions({ name: 'PDialogDescription' })
</script>

<template>
  <DialogDescription class="text-(length:--font-size-md) text-on-surface-muted mb-6 leading-relaxed">
    <slot />
  </DialogDescription>
</template>
