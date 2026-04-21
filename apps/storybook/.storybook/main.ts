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
    return config
  },
}

export default config
