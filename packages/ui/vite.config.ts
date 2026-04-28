import { resolve } from 'path'

import { defineConfig, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// TODO(tw3-compat): Remove stripCssLayersPlugin once ui-onboarding migrates to TW4.
//
// Why this exists: TW4 wraps all output in named @layer blocks. TW3 consumers
// break in two ways — (1) TW3's PostCSS chokes on @layer directives it doesn't
// own, and (2) CSS layers always lose to unlayered styles regardless of
// specificity, so TW3's unlayered preflight (e.g. button { background: transparent })
// silently overrides TW4 utility classes on the same element.
//
// When to remove: when ui-onboarding no longer uses Tailwind v3. At that point
// both sides use TW4 layers and the cascade behaves correctly without this shim.
// Also remove the corresponding import in apps/demo/vite.config.ts if it was added.
function stripCssLayersPlugin(): Plugin {
  return {
    name: 'strip-css-layers',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === 'asset' && typeof chunk.source === 'string' && chunk.fileName.endsWith('.css')) {
          chunk.source = stripLayers(chunk.source)
        }
      }
    },
  }
}

function stripLayers(css: string): string {
  let result = ''
  let i = 0
  while (i < css.length) {
    const empty = css.slice(i).match(/^@layer\s+[\w-]+\s*;/)
    if (empty) { i += empty[0].length; continue }
    const block = css.slice(i).match(/^@layer\s+[\w-]+\s*\{/)
    if (block) {
      let depth = 1
      i += block[0].length
      const start = i
      while (i < css.length && depth > 0) {
        if (css[i] === '{') depth++
        else if (css[i] === '}') depth--
        i++
      }
      result += css.slice(start, i - 1)
      continue
    }
    result += css[i++]
  }
  return result
}

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
    stripCssLayersPlugin(),
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
