import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Button,
} from '@phoenix-ui/ui'

const meta = {
  title: 'Components/Dialog',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { DialogRoot, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, Button },
    template: `
      <DialogRoot>
        <DialogTrigger as-child>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>This action cannot be undone. Are you sure?</DialogDescription>
          <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; justify-content: flex-end;">
            <DialogClose as-child>
              <Button intent="secondary" size="sm">Cancel</Button>
            </DialogClose>
            <DialogClose as-child>
              <Button intent="primary" size="sm">Confirm</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogRoot>
    `,
  }),
}

export const AsChild: Story = {
  name: 'Trigger as Button (asChild)',
  render: () => ({
    components: { DialogRoot, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, Button },
    template: `
      <DialogRoot>
        <DialogTrigger :as-child="true">
          <Button intent="secondary">Open with asChild</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>asChild pattern</DialogTitle>
          <DialogDescription>
            DialogTrigger renders the Button element directly — no wrapper div.
            Inspect the DOM to confirm.
          </DialogDescription>
          <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
            <DialogClose as-child>
              <Button size="sm">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogRoot>
    `,
  }),
}
