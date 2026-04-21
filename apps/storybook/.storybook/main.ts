import { fileURLToPath, URL } from 'node:url'
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
    config.plugins ??= []
    config.plugins.push(tailwindcss())

    config.resolve ??= {}
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string>),
      '@phoenix-ui/ui': fileURLToPath(new URL('../../../packages/ui/src/index.ts', import.meta.url)),
      '@phoenix-ui/ui/style': fileURLToPath(new URL('../../../packages/ui/src/style.css', import.meta.url)),
    }

    return config
  },
}

export default config
