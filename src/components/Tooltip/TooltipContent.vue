<script setup lang="ts">
import { TooltipPortal, TooltipContent } from 'reka-ui'
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      :side-offset="6"
      class="bg-[var(--color-primary)] text-white text-[length:var(--font-size-sm)] px-3 py-1.5 rounded-[var(--radius,4px)] shadow-md select-none"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
