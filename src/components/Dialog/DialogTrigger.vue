<script setup lang="ts">
import { DialogTrigger } from 'reka-ui'

withDefaults(defineProps<{ asChild?: boolean }>(), { asChild: false })
</script>

<template>
  <DialogTrigger :as-child="asChild">
    <slot />
  </DialogTrigger>
</template>
