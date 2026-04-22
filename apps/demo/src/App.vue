<script setup lang="ts">
import { PThemeProvider, PButton } from '@phoenix-ui/ui'
import '@phoenix-ui/ui/style'
</script>

<template>
  <PThemeProvider>
    <main class="min-h-screen flex flex-col items-center justify-center gap-6 bg-surface">
      <h1 class="text-3xl font-bold text-on-surface">Phoenix UI Demo</h1>
      <div class="flex gap-3">
        <p-button>Primary</p-button>
        <p-button intent="secondary">Secondary</p-button>
        <p-button size="sm">Small</p-button>
        <p-button :loading="true">Loading</p-button>
        <p-button :disabled="true">Disabled</p-button>
      </div>
    </main>
  </PThemeProvider>
</template>
