<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { buttonVariants } from './Button.variants'

interface Props {
  as?:      string | object
  intent?:  'primary' | 'secondary'
  size?:    'sm' | 'md' | 'lg'
  rounded?: 'full' | 'md' | 'none'
  disabled?: boolean
  loading?:  boolean
}

const props = withDefaults(defineProps<Props>(), {
  as:       'button',
  intent:   'primary',
  size:     'md',
  rounded:  'full',
  disabled: false,
  loading:  false,
})

const { base, label, icon } = buttonVariants()

const classes = computed(() =>
  base({
    intent:  props.intent,
    size:    props.size,
    rounded: props.rounded,
  })
)

</script>

<template>
  <Primitive
    :as="as"
    :class="classes"
    :disabled="disabled || loading"
  >
    <span v-if="$slots.icon && !loading" :class="icon()">
      <slot name="icon" />
    </span>

    <span v-if="loading" :class="icon()">
      ⏳
    </span>

    <span :class="label()">
      <slot />
    </span>
  </Primitive>
</template>