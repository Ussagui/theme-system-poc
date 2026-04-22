import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  PTooltipProvider,
  PTooltipRoot,
  PTooltipTrigger,
  PTooltipContent,
  PButton,
} from '@phoenix-ui/ui'

const meta = {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const makeTooltipStory = (side: 'top' | 'bottom' | 'left' | 'right'): Story => ({
  render: () => ({
    components: { PTooltipProvider, PTooltipRoot, PTooltipTrigger, PTooltipContent, PButton },
    setup() { return { side } },
    template: `
      <p-tooltip-provider>
        <p-tooltip-root>
          <p-tooltip-trigger as-child>
            <p-button>Hover me</p-button>
          </p-tooltip-trigger>
          <p-tooltip-content :side="side">Tooltip on {{ side }}</p-tooltip-content>
        </p-tooltip-root>
      </p-tooltip-provider>
    `,
  }),
})

export const Top: Story = makeTooltipStory('top')
export const Bottom: Story = makeTooltipStory('bottom')
export const Left: Story = makeTooltipStory('left')
export const Right: Story = makeTooltipStory('right')
