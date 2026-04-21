import { ref, provide, inject } from 'vue'

const THEME_KEY = Symbol('theme')

export const themes = ['theme-sword', 'theme-mind'] as const
export type Theme = (typeof themes)[number]

export function useThemeProvider(defaultTheme: Theme = 'theme-sword') {
  const current = ref<Theme>(defaultTheme)

  function setTheme(theme: Theme) {
    current.value = theme
    document.documentElement.setAttribute('data-theme', theme)
  }

  setTheme(defaultTheme)

  provide(THEME_KEY, { current, setTheme, themes })

  return { current, setTheme, themes }
}

export function useTheme() {
  const context = inject<ReturnType<typeof useThemeProvider>>(THEME_KEY)
  if (!context) throw new Error('useTheme must be used inside a ThemeProvider')
  return context
}
