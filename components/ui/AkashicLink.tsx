import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AkashicLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}

export function AkashicLink({ href, children, className, external }: AkashicLinkProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('akashic-link', className)}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cn('akashic-link', className)}>
      {children}
    </Link>
  );
}
