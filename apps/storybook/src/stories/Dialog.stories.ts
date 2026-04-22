import type { Meta, StoryObj } from '@storybook/vue3-vite'
import {
  PDialogRoot,
  PDialogTrigger,
  PDialogContent,
  PDialogTitle,
  PDialogDescription,
  PDialogClose,
  PButton,
} from '@phoenix-ui/ui'

const meta = {
  title: 'Components/Dialog',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { PDialogRoot, PDialogTrigger, PDialogContent, PDialogTitle, PDialogDescription, PDialogClose, PButton },
    template: `
      <p-dialog-root>
        <p-dialog-trigger as-child>
          <p-button>Open Dialog</p-button>
        </p-dialog-trigger>
        <p-dialog-content>
          <p-dialog-title>Confirm action</p-dialog-title>
          <p-dialog-description>This action cannot be undone. Are you sure?</p-dialog-description>
          <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem; justify-content: flex-end;">
            <p-dialog-close as-child>
              <p-button intent="secondary" size="sm">Cancel</p-button>
            </p-dialog-close>
            <p-dialog-close as-child>
              <p-button intent="primary" size="sm">Confirm</p-button>
            </p-dialog-close>
          </div>
        </p-dialog-content>
      </p-dialog-root>
    `,
  }),
}

export const AsChild: Story = {
  name: 'Trigger as Button (asChild)',
  render: () => ({
    components: { PDialogRoot, PDialogTrigger, PDialogContent, PDialogTitle, PDialogDescription, PDialogClose, PButton },
    template: `
      <p-dialog-root>
        <p-dialog-trigger :as-child="true">
          <p-button intent="secondary">Open with asChild</p-button>
        </p-dialog-trigger>
        <p-dialog-content>
          <p-dialog-title>asChild pattern</p-dialog-title>
          <p-dialog-description>
            PDialogTrigger renders the PButton element directly — no wrapper div.
            Inspect the DOM to confirm.
          </p-dialog-description>
          <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
            <p-dialog-close as-child>
              <p-button size="sm">Close</p-button>
            </p-dialog-close>
          </div>
        </p-dialog-content>
      </p-dialog-root>
    `,
  }),
}
