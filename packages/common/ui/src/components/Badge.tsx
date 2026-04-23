import type { CSSProperties, HTMLAttributes } from 'react';

type BadgeTone = 'accent' | 'neutral';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  borderRadius: '999px',
  border: '1px solid rgba(15, 23, 42, 0.12)',
  padding: '0.35rem 0.75rem',
  fontSize: '0.78rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
};

const toneStyles: Record<BadgeTone, CSSProperties> = {
  accent: {
    backgroundColor: '#fff0df',
    color: '#8c3511',
  },
  neutral: {
    backgroundColor: '#f5f1e8',
    color: '#43352c',
  },
};

export function Badge({ className, style, tone = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={['repo-badge', className].filter(Boolean).join(' ')}
      style={{ ...baseStyle, ...toneStyles[tone], ...style }}
      {...props}
    />
  );
}
