import { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import './Button.css';

type Variant = 'primary' | 'mint' | 'butter' | 'pink' | 'sky' | 'lavender' | 'ghost' | 'red';
type Size = 'sm' | 'md' | 'lg' | 'hero';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  /** Add a small emoji / icon prefix */
  leading?: ReactNode;
  trailing?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  leading,
  trailing,
  className,
  children,
  style,
  ...rest
}: ButtonProps) {
  const cls = ['btn', `btn--${variant}`, `btn--${size}`, block && 'btn--block', className]
    .filter(Boolean)
    .join(' ');

  const inlineStyle: CSSProperties = { ...style };
  if (block) inlineStyle.width = '100%';

  return (
    <button type="button" className={cls} style={inlineStyle} {...rest}>
      {leading && <span className="btn__lead">{leading}</span>}
      <span className="btn__label">{children}</span>
      {trailing && <span className="btn__trail">{trailing}</span>}
    </button>
  );
}