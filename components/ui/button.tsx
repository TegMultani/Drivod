import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva('inline-flex items-center justify-center rounded-lg text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50', {
  variants: {
    variant: {
      default: 'bg-accent text-accent-foreground hover:opacity-90',
      secondary: 'bg-muted text-foreground hover:bg-muted/70',
      ghost: 'hover:bg-muted',
      destructive: 'bg-red-500 text-white hover:bg-red-600'
    },
    size: {
      default: 'h-9 px-4',
      sm: 'h-8 px-3 text-xs',
      icon: 'h-9 w-9'
    }
  },
  defaultVariants: { variant: 'default', size: 'default' }
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
));
Button.displayName = 'Button';
