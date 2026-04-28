import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@phoenix-ui/ui/style',
        replacement: fileURLToPath(new URL('../../packages/ui/src/style.css', import.meta.url)),
      },
      {
        find: '@phoenix-ui/ui',
        replacement: fileURLToPath(new URL('../../packages/ui/src/index.ts', import.meta.url)),
      },
    ],
    dedupe: ['vue', 'reka-ui'],
  },
  optimizeDeps: {
    exclude: ['@phoenix-ui/ui'],
  },
})
