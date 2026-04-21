import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  Button,
} from '@phoenix-ui/ui'

const meta = {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const makeTooltipStory = (side: 'top' | 'bottom' | 'left' | 'right'): Story => ({
  render: () => ({
    components: { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent, Button },
    setup() { return { side } },
    template: `
      <TooltipProvider>
        <TooltipRoot>
          <TooltipTrigger as-child>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent :side="side">Tooltip on {{ side }}</TooltipContent>
        </TooltipRoot>
      </TooltipProvider>
    `,
  }),
})

export const Top: Story = makeTooltipStory('top')
export const Bottom: Story = makeTooltipStory('bottom')
export const Left: Story = makeTooltipStory('left')
export const Right: Story = makeTooltipStory('right')
