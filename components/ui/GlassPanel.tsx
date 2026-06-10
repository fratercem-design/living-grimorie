import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'magenta' | 'cyan' | 'gold';
  glow?: boolean;
}

export function GlassPanel({
  variant = 'magenta',
  glow,
  className,
  children,
  ...props
}: GlassPanelProps) {
  const base =
    variant === 'cyan'
      ? 'glass-panel-cyan'
      : variant === 'gold'
      ? 'glass-panel-gold'
      : 'glass-panel';

  const glowClass =
    glow && variant === 'magenta'
      ? 'glow-border-magenta'
      : glow && variant === 'cyan'
      ? 'glow-border-cyan'
      : glow && variant === 'gold'
      ? 'glow-border-gold'
      : '';

  return (
    <div className={cn(base, glowClass, 'p-6', className)} {...props}>
      {children}
    </div>
  );
}
