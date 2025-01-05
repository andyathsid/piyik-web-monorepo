'use client';

import React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  'absolute inset-0 z-50 bg-background/80 backdrop-blur-sm',
  {
    variants: {
      show: {
        true: 'flex',
        false: 'hidden',
      },
    },
    defaultVariants: {
      show: true,
    },
});

const loaderVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      small: 'size-6',
      medium: 'size-8',
      large: 'size-12',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

interface SpinnerProps
  extends VariantProps<typeof spinnerVariants>,
    VariantProps<typeof loaderVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Spinner({ size, show, children, className }: SpinnerProps) {
  return (
    <div className={spinnerVariants({ show })}>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <Loader2 className={cn(loaderVariants({ size }), className)} />
        {children}
      </div>
    </div>
  );
} 