import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    process.env.ANALYZE === 'true' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: [
      // style subpath must come before the main alias to avoid prefix matching
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
