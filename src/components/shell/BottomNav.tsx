import { NavLink } from 'react-router-dom';
import './BottomNav.css';

/**
 * 6-tab 底栏 — Open Design rule_pad_landscape_touch 强制：
 *   首页 / 故事 / 汉字 / 今日 / 游戏 / 成长
 *
 * 每个 tab 文字 + emoji 居中；选中态填充 Bunny Red 圆形高亮。
 * 触摸目标 ≥ 56px。
 */

const TABS = [
  { to: '/',           label: '首页', emoji: '🏝️' },
  { to: '/story',      label: '故事', emoji: '📖' },
  { to: '/characters', label: '汉字', emoji: '🌸' },
  { to: '/daily',      label: '今日', emoji: '📋' },
  { to: '/game',       label: '游戏', emoji: '🎮' },
  { to: '/badges',     label: '小屋', emoji: '🏠' },
] as const;

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `bottom-nav__tab ${isActive ? 'is-active' : ''}`
          }
        >
          <span className="bottom-nav__emoji">{tab.emoji}</span>
          <span className="bottom-nav__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}