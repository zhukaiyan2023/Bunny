import './ProgressBar.css';

interface ProgressBarProps {
  /** 0..1 */
  value: number;
  total?: number;
  label?: string;
  color?: 'mint' | 'butter' | 'red' | 'pink' | 'sky';
  width?: number;
}

/**
 * 进度条 — 用 "已学 / 总量" 显示，不显示百分比。
 * 3-6 岁视角下用"小苗长出来"代替百分数。
 */
export function ProgressBar({
  value,
  total,
  label,
  color = 'butter',
  width = 240,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <div className="progress" style={{ width }}>
      {label && <div className="progress__label">{label}</div>}
      <div className={`progress__track progress__track--${color}`}>
        <div
          className="progress__fill"
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      {total !== undefined && (
        <div className="progress__caption">
          <span>{Math.round(pct * total)} / {total}</span>
        </div>
      )}
    </div>
  );
}