import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';

interface TopBarProps {
  title: string;
  subtitle?: string;
  /** 默认不显示返回。Bunny Pad 使用 BottomNav 作为一级导航。 */
  showBack?: boolean;
  /** Right-side chip / progress indicator */
  right?: ReactNode;
}

/**
 * TopBar — Pad 横屏顶部标题栏。
 * 一级页面默认不显示返回按钮；只有真正的二级/沉浸式页面才显式传 showBack=true。
 */
export function TopBar({
  title,
  subtitle,
  showBack = false,
  right,
}: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="top-bar">
      {showBack && (
        <button
          type="button"
          className="top-bar__back"
          aria-label="返回"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
      )}
      <div className="top-bar__title-block">
        <h2 className="top-bar__title">{title}</h2>
        {subtitle && <p className="top-bar__subtitle">{subtitle}</p>}
      </div>
      {right && <div className="top-bar__right">{right}</div>}
    </header>
  );
}
