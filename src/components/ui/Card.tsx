import { CSSProperties, ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  variant?: 'soft' | 'mint' | 'butter' | 'pink' | 'sky' | 'lavender';
  padding?: number | string;
  shadow?: 'soft' | 'pop' | 'none';
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export function Card({
  children,
  variant = 'soft',
  padding = 24,
  shadow = 'soft',
  className,
  style,
  onClick,
}: CardProps) {
  const cls = ['card', `card--${variant}`, `card--shadow-${shadow}`, onClick && 'is-clickable', className]
    .filter(Boolean)
    .join(' ');
  return (
    <div
      className={cls}
      style={{ padding, ...style }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}