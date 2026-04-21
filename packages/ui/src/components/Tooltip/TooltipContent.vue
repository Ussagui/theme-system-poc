<script setup lang="ts">
import { TooltipPortal, TooltipContent } from 'reka-ui'
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      :side-offset="6"
      class="bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] text-(length:--font-size-sm) px-3 py-1.5 rounded-(--radius,4px) shadow-md select-none"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
