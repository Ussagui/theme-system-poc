<script setup lang="ts">
import { onMounted, ref, computed, nextTick, watch } from 'vue'
import { Button, DialogRoot, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from './index'
import { useThemeProvider } from './composables/useTheme'

const { current, setTheme, themes } = useThemeProvider()

const cssVarGroups = [
  {
    label: 'Primitives',
    vars: [
      { name: '--color-primary',   isColor: true  },
      { name: '--color-secondary', isColor: true  },
      { name: '--color-neutral',   isColor: true  },
    ],
  },
  {
    label: 'Button',
    vars: [
      { name: '--btn-bg',             isColor: true  },
      { name: '--btn-text',           isColor: true  },
      { name: '--btn-secondary-bg',   isColor: true  },
      { name: '--btn-secondary-text', isColor: true  },
    ],
  },
  {
    label: 'Typography',
    vars: [
      { name: '--font-family',  isColor: false },
      { name: '--font-size-sm', isColor: false },
      { name: '--font-size-md', isColor: false },
      { name: '--font-size-lg', isColor: false },
    ],
  },
]

const varValues   = ref<Record<string, string>>({})
const baseValues  = ref<Record<string, string>>({}) // theme-a baseline
const changedVars = ref<Set<string>>(new Set())
const copied      = ref<string | null>(null)

const overriddenVars = computed(() => {
  const s = new Set<string>()
  Object.keys(varValues.value).forEach(k => {
    if (baseValues.value[k] && varValues.value[k] !== baseValues.value[k]) s.add(k)
  })
  return s
})

function readVarValues() {
  const cs   = getComputedStyle(document.documentElement)
  const prev = { ...varValues.value }
  const next: Record<string, string> = {}

  cssVarGroups.forEach(g => g.vars.forEach(v => {
    next[v.name] = cs.getPropertyValue(v.name).trim()
  }))

  const changed = new Set<string>()
  Object.keys(next).forEach(k => {
    if (prev[k] !== undefined && prev[k] !== next[k]) changed.add(k)
  })
  changedVars.value = changed
  varValues.value   = next
  if (changed.size) setTimeout(() => { changedVars.value = new Set() }, 900)
}

async function copy(text: string, id: string) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copied.value = id
    setTimeout(() => { copied.value = null }, 1200)
  } catch { /* noop */ }
}

watch(current, async () => { await nextTick(); readVarValues() })
onMounted(() => {
  setTheme('theme-sword')
  nextTick(() => {
    readVarValues()
    baseValues.value = { ...varValues.value } // capture theme-sword as baseline
  })
})
</script>

<template>
  <div class="shell">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-top">
        <p class="sidebar-title">Theme Inspector</p>

        <div class="theme-switcher">
          <button
            v-for="t in themes"
            :key="t"
            class="theme-btn"
            :class="{ active: current === t }"
            @click="setTheme(t)"
          >{{ t }}</button>
        </div>
      </div>

      <div class="var-list">
        <div v-for="group in cssVarGroups" :key="group.label" class="var-group">
          <p class="group-label">{{ group.label }}</p>

          <div
            v-for="v in group.vars"
            :key="v.name"
            class="var-row"
            :class="{ changed: changedVars.has(v.name) }"
          >
            <div
              v-if="v.isColor"
              class="swatch"
              :style="{ background: varValues[v.name] }"
            />
            <div v-else class="swatch swatch--text">~</div>

            <div class="var-meta">
              <div class="var-name-row">
                <button
                  class="var-name"
                  :class="{ ok: copied === v.name + 'n' }"
                  @click="copy(v.name, v.name + 'n')"
                >{{ v.name }}</button>
                <span v-if="overriddenVars.has(v.name)" class="override-badge">overridden</span>
              </div>
              <button
                class="var-val"
                :class="{ ok: copied === v.name + 'v' }"
                @click="copy(varValues[v.name] || '', v.name + 'v')"
              >{{ varValues[v.name] || '—' }}</button>
            </div>
          </div>
        </div>
      </div>

      <p class="hint">Click name or value to copy</p>
    </aside>

    <!-- MAIN -->
    <main class="main">
      <h1 class="page-title">Button</h1>

      <div class="demos">
        <div class="demo-row">
          <span class="demo-label">Primary</span>
          <span class="color-code" :style="{ color: varValues['--btn-bg'] }">{{ varValues['--btn-bg'] }}</span>
          <Button>Primary</Button>
        </div>
        <div class="demo-row">
          <span class="demo-label">Secondary</span>
          <span class="color-code" :style="{ color: varValues['--btn-secondary-bg'] }">{{ varValues['--btn-secondary-bg'] }}</span>
          <Button intent="secondary">Secondary</Button>
        </div>
        <div class="demo-row">
          <span class="demo-label">Small</span>
          <span class="color-code" :style="{ color: varValues['--btn-bg'] }">{{ varValues['--btn-bg'] }}</span>
          <Button size="sm">Small</Button>
        </div>
        <div class="demo-row">
          <span class="demo-label">Medium</span>
          <span class="color-code" :style="{ color: varValues['--btn-bg'] }">{{ varValues['--btn-bg'] }}</span>
          <Button size="md" >Medium</Button>
        </div>
        <div class="demo-row">
          <span class="demo-label">Large</span>
          <span class="color-code" :style="{ color: varValues['--btn-bg'] }">{{ varValues['--btn-bg'] }}</span>
          <Button size="lg">Large</Button>
        </div>
        <div class="demo-row">
          <span class="demo-label">Rounded MD</span>
          <span class="color-code" :style="{ color: varValues['--btn-bg'] }">{{ varValues['--btn-bg'] }}</span>
          <Button rounded="md">Rounded MD</Button>
        </div>
        <div class="demo-row">
          <span class="demo-label">Square</span>
          <span class="color-code" :style="{ color: varValues['--btn-bg'] }">{{ varValues['--btn-bg'] }}</span>
          <Button rounded="none">Square</Button>
        </div>
        <div class="demo-row">
          <span class="demo-label">Loading</span>
          <span class="color-code" :style="{ color: varValues['--btn-bg'] }">{{ varValues['--btn-bg'] }}</span>
          <Button loading>Loading</Button>
        </div>
        <div class="demo-row">
          <span class="demo-label">Disabled</span>
          <span class="color-code" :style="{ color: varValues['--btn-bg'] }">{{ varValues['--btn-bg'] }}</span>
          <Button disabled>Disabled</Button>
        </div>
        <div class="demo-row">
          <span class="demo-label">With icon</span>
          <span class="color-code" :style="{ color: varValues['--btn-bg'] }">{{ varValues['--btn-bg'] }}</span>
          <Button><template #icon>★</template> With icon</Button>
        </div>
      </div>

      <h1 class="page-title" style="margin-top: 56px;">Composition</h1>

      <div class="demos">
        <div class="demo-row">
          <span class="demo-label">Dialog</span>
          <span class="color-code" style="font-size: 10px; width: 120px;">&lt;DialogTrigger asChild&gt;</span>
          <DialogRoot>
            <DialogTrigger :as-child="true">
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Confirm action</DialogTitle>
              <DialogDescription>
                reka-ui handles focus trapping, scroll lock, escape key, and
                aria-modal. Your components, reka-ui's behaviour.
              </DialogDescription>
              <div class="dialog-footer">
                <DialogClose :as-child="true">
                  <Button>Confirm</Button>
                </DialogClose>
                <DialogClose :as-child="true">
                  <Button intent="secondary">Cancel</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </DialogRoot>
        </div>
      </div>
    </main>

  </div>
</template>
