<script setup lang="ts">
import { DialogClose } from 'reka-ui'

withDefaults(defineProps<{ asChild?: boolean }>(), { asChild: false })
</script>

<template>
  <DialogClose :as-child="asChild">
    <slot />
  </DialogClose>
</template>
