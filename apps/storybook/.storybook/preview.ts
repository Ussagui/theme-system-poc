import { setup } from '@storybook/vue3-vite'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/vue3-vite'
import { ThemeProvider } from '@phoenix-ui/ui'
import '@phoenix-ui/ui/style'

setup((app) => {
  app.component('ThemeProvider', ThemeProvider)
})

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      themes: {
        'theme-sword': 'theme-sword',
        'theme-mind': 'theme-mind',
      },
      defaultTheme: 'theme-sword',
      attributeName: 'data-theme',
    }),
  ],
  parameters: {
    layout: 'centered',
  },
}

export default preview
