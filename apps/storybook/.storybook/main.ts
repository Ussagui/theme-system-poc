import { fileURLToPath, URL } from 'node:url'
import { mergeConfig } from 'vite'
import type { StorybookConfig } from '@storybook/vue3-vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  framework: {
    name: '@storybook/vue3-vite',
    options: {
      docgen: {
        plugin: 'vue-component-meta',
        tsconfig: '../../../packages/ui/tsconfig.app.json',
      },
    },
  },
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],
  viteFinal(config) {
    return mergeConfig(config, {
      plugins: [vue(), tailwindcss()],
      resolve: {
        alias: [
          // style subpath must come before the main alias to avoid prefix matching
          {
            find: '@phoenix-ui/ui/style',
            replacement: fileURLToPath(new URL('../../../packages/ui/src/style.css', import.meta.url)),
          },
          {
            find: '@phoenix-ui/ui',
            replacement: fileURLToPath(new URL('../../../packages/ui/src/index.ts', import.meta.url)),
          },
        ],
        dedupe: ['vue', 'reka-ui'],
      },
      optimizeDeps: {
        exclude: ['@phoenix-ui/ui'],
      },
    })
  },
}

export default config
