<script setup lang="ts">
import { DialogTitle } from 'reka-ui'
</script>

<template>
  <DialogTitle class="text-[length:var(--font-size-lg)] font-bold text-[var(--color-primary)] mb-2">
    <slot />
  </DialogTitle>
</template>
