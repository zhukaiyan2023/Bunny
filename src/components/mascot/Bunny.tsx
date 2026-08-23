import { CSSProperties, ReactNode } from 'react';

/**
 * Bunny · 主角白兔
 *
 * 视觉要求：一眼可识别为“兔子”。
 * - 长耳朵必须明显高于头部
 * - 头/身体比例约 1:1.15
 * - 白色毛发、粉色内耳、红色书包
 * - 眼睛、鼻子、嘴巴保持高对比
 * - 不使用文字作为角色造型
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

export function Bunny({ pose = 'idle', size = 180, showBackpack = true, className, style, ariaLabel = 'Bunny 主角白兔' }: BunnyProps) {
  const transform = pose === 'happy' ? 'translate(0 -8)' : pose === 'cheering' ? 'translate(0 -5) scale(1.03)' : '';

  return (
    <svg width={size} height={size} viewBox="-120 -150 240 330" role="img" aria-label={ariaLabel} className={className} style={style} overflow="visible">
      <g transform={transform}>
        <path d="M-46-30 C-58-78-58-124-38-135 C-19-122-19-72-24-28Z" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="4" />
        <path d="M-43-43 C-49-82-48-111-38-119 C-30-105-31-75-32-43Z" fill="#FFD3DC" />
        <path d="M46-30 C58-78 58-124 38-135 C19-122 19-72 24-28Z" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="4" />
        <path d="M43-43 C49-82 48-111 38-119 C30-105 31-75 32-43Z" fill="#FFD3DC" />

        <ellipse cx="0" cy="75" rx="72" ry="78" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="4" />

        {showBackpack && (
          <>
            <path d="M-46 52 L-52 112 Q-52 126-38 126 H38 Q52 126 52 112 L46 52Z" fill="#E94545" stroke="#2C2C54" strokeWidth="4" />
            <path d="M-26 58 Q-26 38 0 38 Q26 38 26 58" fill="none" stroke="#2C2C54" strokeWidth="4" />
            <rect x="-10" y="82" width="20" height="10" rx="3" fill="#FFFFFF" />
            <circle cx="0" cy="73" r="5" fill="#FFD15C" />
          </>
        )}

        <circle cx="0" cy="0" r="58" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="4" />
        <ellipse cx="-34" cy="18" rx="13" ry="8" fill="#FFC1CC" />
        <ellipse cx="34" cy="18" rx="13" ry="8" fill="#FFC1CC" />

        <circle cx="-20" cy="-8" r="9" fill="#2C2C54" />
        <circle cx="20" cy="-8" r="9" fill="#2C2C54" />
        <circle cx="-17" cy="-11" r="3" fill="#FFFFFF" />
        <circle cx="23" cy="-11" r="3" fill="#FFFFFF" />

        <ellipse cx="0" cy="19" rx="6" ry="4" fill="#FFB5C4" />

        {pose === 'happy' ? (
          <path d="M-12 28 Q0 40 12 28 Q0 49-12 28Z" fill="#FFC1CC" stroke="#2C2C54" strokeWidth="3" />
        ) : (
          <path d="M-12 29 Q0 38 12 29" fill="none" stroke="#2C2C54" strokeWidth="3" strokeLinecap="round" />
        )}

        {pose === 'cheering' ? (
          <>
            <path d="M-58 67 Q-93 36-88 4" fill="none" stroke="#2C2C54" strokeWidth="12" strokeLinecap="round" />
            <path d="M58 67 Q93 36 88 4" fill="none" stroke="#2C2C54" strokeWidth="12" strokeLinecap="round" />
            <circle cx="-88" cy="2" r="11" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="4" />
            <circle cx="88" cy="2" r="11" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="4" />
          </>
        ) : (
          <>
            <ellipse cx="-70" cy="74" rx="15" ry="10" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="4" transform="rotate(-15 -70 74)" />
            <ellipse cx="70" cy="74" rx="15" ry="10" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="4" transform="rotate(15 70 74)" />
          </>
        )}

        <ellipse cx="-30" cy="145" rx="28" ry="16" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="4" />
        <ellipse cx="30" cy="145" rx="28" ry="16" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="4" />
      </g>
    </svg>
  );
}

export function SmileyFace({ size = 80, earColor = '#FFD3DC' }: { size?: number; earColor?: string }) {
  return (
    <svg width={size} height={size} viewBox="-36 -50 72 92" aria-hidden>
      <ellipse cx="-16" cy="-34" rx="8" ry="18" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="3" />
      <ellipse cx="-16" cy="-31" rx="4" ry="12" fill={earColor} />
      <ellipse cx="16" cy="-34" rx="8" ry="18" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="3" />
      <ellipse cx="16" cy="-31" rx="4" ry="12" fill={earColor} />
      <circle cy="0" r="30" fill="#FFFFFF" stroke="#2C2C54" strokeWidth="3" />
      <circle cx="-10" cy="-4" r="5" fill="#2C2C54" />
      <circle cx="10" cy="-4" r="5" fill="#2C2C54" />
      <ellipse cx="-15" cy="8" rx="7" ry="4" fill="#FFC1CC" />
      <ellipse cx="15" cy="8" rx="7" ry="4" fill="#FFC1CC" />
      <path d="M-7 13 Q0 20 7 13" stroke="#2C2C54" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function AvatarFrame({ size = 120, shape = 'circle', color = 'var(--bunny-mint)', children }: { size?: number; shape?: 'circle' | 'rounded'; color?: string; children: ReactNode }) {
  return (
    <div style={{ width: size, height: size, borderRadius: shape === 'circle' ? '50%' : '24px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.05)' }}>
      {children}
    </div>
  );
}
