<script setup lang="ts">
import { watch } from 'vue'
import { useThemeProvider, type Theme } from '@/composables/useTheme'

const props = withDefaults(
  defineProps<{
    defaultTheme?: Theme
  }>(),
  { defaultTheme: 'theme-sword' },
)

const { setTheme } = useThemeProvider(props.defaultTheme)

watch(
  () => props.defaultTheme,
  (theme) => setTheme(theme),
)
</script>

<template>
  <slot />
</template>
