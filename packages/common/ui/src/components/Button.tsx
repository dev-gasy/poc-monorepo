import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, CSSProperties } from 'react';

type ButtonVariant = 'solid' | 'outline' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const baseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.6rem',
  borderRadius: '999px',
  border: '1px solid transparent',
  padding: '0.9rem 1.4rem',
  fontSize: '0.95rem',
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: '0.01em',
  cursor: 'pointer',
  transition:
    'transform 160ms ease, border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease',
};

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  solid: {
    background: 'linear-gradient(135deg, rgba(212, 94, 44, 1) 0%, rgba(255, 153, 94, 1) 100%)',
    boxShadow: '0 16px 32px rgba(212, 94, 44, 0.28)',
    color: '#fff7ef',
  },
  outline: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderColor: 'rgba(67, 53, 44, 0.18)',
    color: '#2f241d',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#2f241d',
  },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, style, variant = 'solid', type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={['repo-button', className].filter(Boolean).join(' ')}
      style={{ ...baseStyle, ...variantStyles[variant], ...style }}
      {...props}
    />
  );
});
