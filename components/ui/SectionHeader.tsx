import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  sigil?: string;
  title: string;
  subtitle?: string;
  variant?: 'magenta' | 'cyan' | 'gold';
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  sigil,
  title,
  subtitle,
  variant = 'magenta',
  align = 'center',
  className,
}: SectionHeaderProps) {
  const titleGlow =
    variant === 'cyan'
      ? 'gradient-cyan-magenta'
      : variant === 'gold'
      ? 'gradient-gold-pink'
      : 'gradient-magenta-cyan';

  const dividerClass =
    variant === 'cyan'
      ? 'divider-cyan'
      : variant === 'gold'
      ? 'divider-gold'
      : 'divider-magenta';

  const subtitleColor =
    variant === 'cyan' ? 'text-cyan-dim' : variant === 'gold' ? 'text-gold/70' : 'text-pink-haze/70';

  return (
    <div className={cn('space-y-4', align === 'center' ? 'text-center' : 'text-left', className)}>
      {sigil && (
        <div
          className={cn(
            'text-4xl animate-float',
            variant === 'magenta' && 'glow-magenta',
            variant === 'cyan' && 'glow-cyan',
            variant === 'gold' && 'glow-gold',
            align === 'center' && 'block'
          )}
        >
          {sigil}
        </div>
      )}
      <h2
        className={cn(
          'text-grimoire text-2xl md:text-3xl font-bold',
          titleGlow
        )}
      >
        {title}
      </h2>
      <div className={cn(dividerClass, 'my-3', align === 'center' ? 'mx-auto max-w-xs' : 'max-w-xs')} />
      {subtitle && (
        <p className={cn('font-grotesk text-sm md:text-base leading-relaxed max-w-2xl', subtitleColor, align === 'center' && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
