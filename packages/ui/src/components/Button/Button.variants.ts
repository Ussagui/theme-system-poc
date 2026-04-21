import { tv } from 'tailwind-variants'

export const buttonVariants = tv({
  slots: {
    base: [
      'inline-flex items-center justify-center gap-2',
      'font-medium cursor-pointer select-none',
      'transition-all duration-150 ease-in-out',
      'outline-none',
      'disabled:opacity-50 disabled:pointer-events-none',
    ],
    label: 'select-none',
    icon: 'shrink-0',
  },
  variants: {
    intent: {
      primary: {
        base: [
          'bg-[var(--btn-bg)] text-[var(--btn-text)]',
          'hover:brightness-110',
          'active:brightness-90 active:scale-[0.98]',
          'focus-visible:ring-2 focus-visible:ring-[var(--btn-bg)] focus-visible:ring-offset-2',
        ],
      },
      secondary: {
        base: [
          'bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)]',
          'hover:brightness-110',
          'active:brightness-90 active:scale-[0.98]',
          'focus-visible:ring-2 focus-visible:ring-[var(--btn-secondary-bg)] focus-visible:ring-offset-2',
        ],
      },
    },
    size: {
      sm: { base: 'h-8 px-5 text-sm', icon: 'size-4' },
      md: { base: 'h-10 px-7 text-base', icon: 'size-5' },
      lg: { base: 'h-12 px-9 text-lg', icon: 'size-6' },
    },
    rounded: {
      full: { base: 'rounded-full' },
      md: { base: 'rounded-md' },
      none: { base: 'rounded-none' },
    },
  },
  defaultVariants: {
    intent: 'primary',
    size: 'md',
    rounded: 'full',
  },
})
