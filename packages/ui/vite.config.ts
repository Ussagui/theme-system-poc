import { resolve } from 'path'

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      include: ['env.d.ts', 'src/index.ts', 'src/components/**', 'src/composables/**'],
      outDir: 'dist',
      rollupTypes: true,
      tsconfigPath: './tsconfig.app.json',
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['vue', 'reka-ui'],
      output: { globals: { vue: 'Vue', 'reka-ui': 'RekaUI' } },
    },
  },
})
