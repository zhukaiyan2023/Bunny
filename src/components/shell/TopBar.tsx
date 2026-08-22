import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';

interface TopBarProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  /** Right-side chip / progress indicator (e.g. "47 / 3000 字") */
  right?: ReactNode;
}

/**
 * TopBar — 1366×96 white-translucent bar with Bunny avatar + title.
 * Mirrors the Open Design prototypes (panel-3-6-01-home / -02 / -07 …).
 */
export function TopBar({
  title,
  subtitle,
  showBack = true,
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