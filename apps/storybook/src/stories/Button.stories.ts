import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { PButton } from '@phoenix-ui/ui'

const meta = {
  component: PButton,
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    intent: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    rounded: { control: 'select', options: ['full', 'md', 'none'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof PButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: (args) => ({
    components: { PButton },
    setup() { return { args } },
    template: `<p-button v-bind="args">Click me</p-button>`,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'full',
  },
}

export const Secondary: Story = {
  render: (args) => ({
    components: { PButton },
    setup() { return { args } },
    template: `<p-button v-bind="args">Click me</p-button>`,
  }),
  args: {
    intent: 'secondary',
    size: 'md',
    rounded: 'full',
  },
}

export const Small: Story = {
  render: (args) => ({
    components: { PButton },
    setup() { return { args } },
    template: `<p-button v-bind="args">Small</p-button>`,
  }),
  args: {
    intent: 'primary',
    size: 'sm',
    rounded: 'full',
  },
}

export const Large: Story = {
  render: (args) => ({
    components: { PButton },
    setup() { return { args } },
    template: `<p-button v-bind="args">Large</p-button>`,
  }),
  args: {
    intent: 'primary',
    size: 'lg',
    rounded: 'full',
  },
}

export const RoundedMd: Story = {
  name: 'Rounded md',
  render: (args) => ({
    components: { PButton },
    setup() { return { args } },
    template: `<p-button v-bind="args">Rounded</p-button>`,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'md',
  },
}

export const RoundedNone: Story = {
  name: 'Rounded none',
  render: (args) => ({
    components: { PButton },
    setup() { return { args } },
    template: `<p-button v-bind="args">Sharp</p-button>`,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'none',
  },
}

export const Disabled: Story = {
  render: (args) => ({
    components: { PButton },
    setup() { return { args } },
    template: `<p-button v-bind="args">Disabled</p-button>`,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'full',
    disabled: true,
  },
}

export const Loading: Story = {
  render: (args) => ({
    components: { PButton },
    setup() { return { args } },
    template: `<p-button v-bind="args">Saving…</p-button>`,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'full',
    loading: true,
  },
}

export const WithIcon: Story = {
  name: 'With icon',
  render: (args) => ({
    components: { PButton },
    setup() { return { args } },
    template: `
      <p-button v-bind="args">
        <template #icon>★</template>
        Starred
      </p-button>
    `,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'full',
  },
}
