import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { Button } from '@phoenix-ui/ui'

const meta = {
  component: Button,
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    intent: { control: 'select', options: ['primary', 'secondary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    rounded: { control: 'select', options: ['full', 'md', 'none'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Click me</Button>`,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'full',
  },
}

export const Secondary: Story = {
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Click me</Button>`,
  }),
  args: {
    intent: 'secondary',
    size: 'md',
    rounded: 'full',
  },
}

export const Small: Story = {
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Small</Button>`,
  }),
  args: {
    intent: 'primary',
    size: 'sm',
    rounded: 'full',
  },
}

export const Large: Story = {
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Large</Button>`,
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
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Rounded</Button>`,
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
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Sharp</Button>`,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'none',
  },
}

export const Disabled: Story = {
  render: (args) => ({
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Disabled</Button>`,
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
    components: { Button },
    setup() { return { args } },
    template: `<Button v-bind="args">Saving…</Button>`,
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
    components: { Button },
    setup() { return { args } },
    template: `
      <Button v-bind="args">
        <template #icon>★</template>
        Starred
      </Button>
    `,
  }),
  args: {
    intent: 'primary',
    size: 'md',
    rounded: 'full',
  },
}
