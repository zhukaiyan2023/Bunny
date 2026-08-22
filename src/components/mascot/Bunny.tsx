import { CSSProperties, ReactNode } from 'react';

/**
 * Bunny · 主角白兔 mascot
 *
 * 与 docs/STYLE_GUIDE.md / Open Design rule_bunny_mascot 完全对齐：
 *   - 圆胖 1.5 头身
 *   - 白 #FFFFFF + 内耳粉 #FFD3DC + 红书包 #E94545 + 长垂耳
 *   - 腮红椭圆 #FFC1CC + 黑圆点眼 #2C2C54
 *
 * 该组件纯 SVG，可缩放、可复用、可视化三个姿势：
 *   - `idle`      默认站立
 *   - `happy`     跳起来（用于成功反馈）
 *   - `cheering`  张开双手（用于庆祝）
 *
 * 默认 size=180，可通过 style.width / style.height 调整。
 */

export type BunnyPose = 'idle' | 'happy' | 'cheering';

interface BunnyProps {
  pose?: BunnyPose;
  size?: number;
  showBackpack?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}

export function Bunny({
  pose = 'idle',
  size = 180,
  showBackpack = true,
  className,
  style,
  ariaLabel = 'Bunny 主角白兔',
}: BunnyProps) {
  const transform =
    pose === 'happy'
      ? 'translate(0 -8)'
      : pose === 'cheering'
        ? 'translate(0 -4) scale(1.04)'
        : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="-110 -110 220 220"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={style}
    >
      <g transform={transform}>
        {/* 脚 */}
        <ellipse cx="-32" cy="100" rx="26" ry="14" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="3" />
        <ellipse cx="32" cy="100" rx="26" ry="14" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="3" />

        {/* 身体 */}
        <ellipse cx="0" cy="40" rx="78" ry="64" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="3" />

        {/* 书包 */}
        {showBackpack && (
          <>
            <path
              d="M -38 18 L -44 76 Q -44 88 -32 88 L 32 88 Q 44 88 44 76 L 38 18 Z"
              fill="#E94545"
              stroke="#2C2C54"
              strokeWidth="3"
            />
            <rect x="-8" y="50" width="16" height="8" rx="2" fill="#FFFFFF" />
            <circle cx="0" cy="42" r="4" fill="#FFD15C" />
          </>
        )}

        {/* 长垂耳（左） */}
        <path
          d="M -32 -8 Q -46 -8 -50 14 Q -54 56 -42 76 Q -26 76 -20 56 Q -20 14 -20 -8 Z"
          fill="#FFFFFF"
          stroke="#2C2C54"
          strokeWidth="3"
        />
        <path
          d="M -32 0 Q -38 14 -40 38 Q -42 70 -34 72 Q -26 56 -26 36 Q -26 6 -26 0 Z"
          fill="#FFD3DC"
        />

        {/* 长垂耳（右） */}
        <path
          d="M 32 -8 Q 46 -8 50 14 Q 54 56 42 76 Q 26 76 20 56 Q 20 14 20 -8 Z"
          fill="#FFFFFF"
          stroke="#2C2C54"
          strokeWidth="3"
        />
        <path
          d="M 32 0 Q 38 14 40 38 Q 42 70 34 72 Q 26 56 26 36 Q 26 6 26 0 Z"
          fill="#FFD3DC"
        />

        {/* 头 */}
        <circle cx="0" cy="-2" r="52" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="3" />

        {/* 腮红 */}
        <ellipse cx="-30" cy="10" rx="11" ry="7" fill="#FFC1CC" opacity="0.85" />
        <ellipse cx="30" cy="10" rx="11" ry="7" fill="#FFC1CC" opacity="0.85" />

        {/* 眼睛 */}
        <circle cx="-18" cy="-10" r="7" fill="#2C2C54" />
        <circle cx="18" cy="-10" r="7" fill="#2C2C54" />
        <circle cx="-16" cy="-13" r="2.5" fill="#FFFFFF" />
        <circle cx="20" cy="-13" r="2.5" fill="#FFFFFF" />

        {/* 鼻子 */}
        <ellipse cx="0" cy="8" rx="5" ry="3.5" fill="#FFC1CC" />

        {/* 嘴 */}
        {pose === 'happy' ? (
          <path
            d="M -10 16 Q 0 24 10 16"
            stroke="#2C2C54"
            strokeWidth="2.5"
            fill="#FFC1CC"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M -10 16 Q 0 22 10 16"
            stroke="#2C2C54"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* 庆祝姿势举手 */}
        {pose === 'cheering' && (
          <>
            <ellipse
              cx="-72" cy="0"
              rx="14" ry="8"
              fill="#FFFFFF"
              stroke="#2C2C54"
              strokeWidth="3"
              transform="rotate(-50 -72 0)"
            />
            <ellipse
              cx="72" cy="0"
              rx="14" ry="8"
              fill="#FFFFFF"
              stroke="#2C2C54"
              strokeWidth="3"
              transform="rotate(50 72 0)"
            />
          </>
        )}
      </g>
    </svg>
  );
}

/**
 * 拟人化表情组（用于按钮、卡片、奖励）
 * 复用 Open Design 中"big-eye" symbol 的设计
 */
export function SmileyFace({
  size = 80,
  earColor = '#FFD3DC',
}: { size?: number; earColor?: string }) {
  return (
    <svg width={size} height={size} viewBox="-30 -30 60 60">
      {/* 长垂耳 */}
      <ellipse cx="-12" cy="-18" rx="6" ry="14" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="2" />
      <ellipse cx="-12" cy="-15" rx="3" ry="9" fill={earColor} />
      <ellipse cx="12" cy="-18" rx="6" ry="14" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="2" />
      <ellipse cx="12" cy="-15" rx="3" ry="9" fill={earColor} />
      {/* 头 */}
      <circle r="22" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="2" />
      {/* 眼 */}
      <circle cx="-7" cy="-4" r="3" fill="#2C2C54" />
      <circle cx="7" cy="-4" r="3" fill="#2C2C54" />
      {/* 腮红 */}
      <ellipse cx="-12" cy="6" rx="5" ry="3" fill="#FFC1CC" opacity="0.85" />
      <ellipse cx="12" cy="6" rx="5" ry="3" fill="#FFC1CC" opacity="0.85" />
      {/* 嘴 */}
      <path d="M -4 8 Q 0 12 4 8" stroke="#2C2C54" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/**
 * 通用 wrapper：把 children 居中在一个固定宽高的圆形/方块里
 */
export function AvatarFrame({
  size = 120,
  shape = 'circle',
  color = 'var(--bunny-mint)',
  children,
}: {
  size?: number;
  shape?: 'circle' | 'rounded';
  color?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: shape === 'circle' ? '50%' : '24px',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.05)',
      }}
    >
      {children}
    </div>
  );
}