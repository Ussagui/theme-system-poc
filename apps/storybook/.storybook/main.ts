import { fileURLToPath, URL } from 'node:url'
import { mergeConfig } from 'vite'
import type { StorybookConfig } from '@storybook/vue3-vite'
import tailwindcss from '@tailwindcss/vite'

const config: StorybookConfig = {
  framework: '@storybook/vue3-vite',
  stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],
  viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tailwindcss()],
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
