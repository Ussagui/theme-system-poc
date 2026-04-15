<script setup lang="ts">
import { DialogDescription } from 'reka-ui'
</script>

<template>
  <DialogDescription class="text-[length:var(--font-size-md)] text-gray-500 mb-6 leading-relaxed">
    <slot />
  </DialogDescription>
</template>
