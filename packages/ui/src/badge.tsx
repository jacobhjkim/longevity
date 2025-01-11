import { type VariantProps, cva } from 'class-variance-authority'
import type React from 'react'

import { cn } from './lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        rose: 'border-transparent bg-rose-200 text-rose-800 shadow',
        blue: 'border-transparent bg-blue-200 text-blue-800 shadow',
        eat: 'border-transparent bg-green-200 text-green-800 shadow',
        measurements: 'border-transparent bg-indigo-200 text-indigo-800 shadow',
        exercise: 'border-transparent bg-yellow-200 text-yellow-800 shadow',
        females: 'border-transparent bg-pink-200 text-pink-800 shadow',
        pregnancy: 'border-transparent bg-purple-200 text-purple-800 shadow',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
