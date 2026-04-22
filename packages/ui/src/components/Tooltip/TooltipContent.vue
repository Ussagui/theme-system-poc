<script setup lang="ts">
import { TooltipPortal, TooltipContent } from 'reka-ui'

defineOptions({ name: 'PTooltipContent' })

defineProps<{
  side?: 'top' | 'bottom' | 'left' | 'right'
}>()
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      :side="side"
      :side-offset="6"
      class="bg-[var(--tooltip-bg)] text-[var(--tooltip-text)] text-(length:--font-size-sm) px-3 py-1.5 rounded-(--radius,4px) shadow-md select-none"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
