'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'magenta' | 'cyan' | 'gold' | 'ghost';

interface GrimoireButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  glow?: boolean;
}

const variantClasses: Record<Variant, string> = {
  magenta: 'btn-grimoire',
  cyan: 'btn-cyan',
  gold: 'btn-gold',
  ghost: 'font-orbitron text-xs uppercase tracking-widest text-void-light/60 hover:text-pink-haze transition-colors',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-sm',
};

export const GrimoireButton = forwardRef<HTMLButtonElement, GrimoireButtonProps>(
  ({ variant = 'magenta', size = 'md', loading, glow, className, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          variantClasses[variant],
          size !== 'md' && sizeClasses[size],
          glow && variant === 'magenta' && 'animate-pulse-glow',
          glow && variant === 'cyan' && 'animate-pulse-glow-cyan',
          disabled && 'opacity-40 cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        {...(props as object)}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="ritual-spinner" style={{ width: 16, height: 16 }} />
            <span>Channeling...</span>
          </span>
        ) : children}
      </motion.button>
    );
  }
);

GrimoireButton.displayName = 'GrimoireButton';
