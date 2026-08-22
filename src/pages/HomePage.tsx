import { useMemo, CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/shell/TopBar';
import { Bunny } from '../components/mascot/Bunny';
import { useLearner } from '../runtime/LearnerProvider';
import { useContent } from '../runtime/ContentProvider';

const TOTAL_GOAL = 3000;

interface IslandCard {
  id: string;
  title: string;
  subtitle: string;
  to: string;
  bg: string;
  emoji: string;
  ringColor: string;
  progressText: string;
}

const ISLAND_CARDS: IslandCard[] = [
  {
    id: 'story',
    title: '故事岛',
    subtitle: 'Bunny 讲故事',
    to: '/story',
    bg: 'linear-gradient(160deg, #FFE9A8 0%, #FFC76B 100%)',
    emoji: '📖',
    ringColor: '#7A4F00',
    progressText: '本岛 300 字 · 已读 12 本',
  },
  {
    id: 'characters',
    title: '汉字花园',
    subtitle: '和字做朋友',
    to: '/characters',
    bg: 'linear-gradient(160deg, #C6F0D8 0%, #6FD7A0 100%)',
    emoji: '🌸',
    ringColor: '#1F6A4D',
    progressText: '本岛 300 字 · 已学 12 字',
  },
  {
    id: 'game',
    title: '玩游戏',
    subtitle: '找一找',
    to: '/game',
    bg: 'linear-gradient(160deg, #B5DEFF 0%, #7CCFAF 100%)',
    emoji: '🎮',
    ringColor: '#3F4C7A',
    progressText: '本岛 300 字 · 闯到第 8 关',
  },
  {
    id: 'house',
    title: '我的小屋',
    subtitle: '收集勋章',
    to: '/badges',
    bg: 'linear-gradient(160deg, #FFC1CC 0%, #FF9F43 100%)',
    emoji: '🏠',
    ringColor: '#7A2A4D',
    progressText: '已拿 6 枚勋章',
  },
];

function AnthropomorphicIcon({
  emoji,
  size = 96,
  bg = '#FFFFFF',
}: { emoji: string; size?: number; bg?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        border: '2px solid #2C2C54',
        boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.05)',
      }}
    >
      <span style={{ fontSize: size * 0.5 }}>{emoji}</span>
      {/* 拟人化：腮红 + 圆眼 */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: size * 0.18,
          top: size * 0.46,
          width: size * 0.14,
          height: size * 0.1,
          borderRadius: '50%',
          background: 'var(--bunny-pink)',
          opacity: 0.85,
        }}
      />
      <span
        aria-hidden
        style={{
          position: 'absolute',
          right: size * 0.18,
          top: size * 0.46,
          width: size * 0.14,
          height: size * 0.1,
          borderRadius: '50%',
          background: 'var(--bunny-pink)',
          opacity: 0.85,
        }}
      />
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { profile } = useLearner();
  const { characters } = useContent();

  // 已学计数来自 mastery key 数量
  const learnedCount = useMemo(
    () => (profile.learnedCount ?? Object.keys(profile.mastery).length),
    [profile],
  );

  // 计算每个岛已学数（按 island 字段过滤 characters）
  const islandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of characters) {
      const island = (c as any).island ?? 'starter';
      const id = (c as any).id;
      const mastered = profile.mastery[id];
      if (mastered && (mastered.state === 'exposed' || mastered.state === 'heard' || mastered.state === 'recognized' || mastered.state === 'understood' || mastered.state === 'used' || mastered.state === 'read' || mastered.state === 'mastered')) {
        counts[island] = (counts[island] ?? 0) + 1;
      }
    }
    return counts;
  }, [characters, profile.mastery]);

  const progressBadge = (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 20px',
        borderRadius: 999,
        background: 'var(--bunny-mint)',
        border: '2px solid var(--bunny-mint-deep)',
        boxShadow: 'var(--shadow-soft)',
      }}
    >
      <span style={{ fontSize: 22 }}>🌱</span>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--bunny-green-deep)' }}>已学</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--bunny-green-deep)' }}>
          {learnedCount} / {TOTAL_GOAL}
        </span>
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TopBar title="你好小朋友" right={progressBadge} />

      {/* Hero zone */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '440px 1fr',
          alignItems: 'stretch',
          padding: '24px 32px 24px',
          gap: 24,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* Left: big Bunny + bubble */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingTop: 8,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 24,
              right: 12,
              background: '#FFFFFF',
              border: '2px solid var(--bunny-border)',
              borderRadius: 24,
              padding: '14px 20px',
              boxShadow: 'var(--shadow-soft)',
              maxWidth: 280,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--bunny-ink)' }}>
              我们今天去哪里玩呀？
            </div>
            <div
              style={{
                position: 'absolute',
                left: 28,
                bottom: -10,
                width: 18,
                height: 18,
                background: '#FFFFFF',
                borderRight: '2px solid var(--bunny-border)',
                borderBottom: '2px solid var(--bunny-border)',
                transform: 'rotate(45deg)',
              }}
            />
          </div>
          <Bunny pose="idle" size={280} style={{ marginBottom: 12 }} />
        </div>

        {/* Right: 2×2 island grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: 20,
            minHeight: 0,
          }}
        >
          {ISLAND_CARDS.map((card) => {
            const learned = islandCounts[card.id === 'story' ? 'stories' : card.id === 'characters' ? 'plants' : card.id === 'house' ? 'family' : 'animals'] ?? 0;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => navigate(card.to)}
                style={{
                  border: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: 16,
                  borderRadius: 32,
                  background: card.bg,
                  boxShadow: 'var(--shadow-pop)',
                  position: 'relative',
                  transition: 'transform 0.12s ease',
                  fontFamily: 'inherit',
                  color: 'var(--bunny-ink)',
                  minHeight: 220,
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <AnthropomorphicIcon emoji={card.emoji} size={104} />
                <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{card.title}</div>
                <div
                  style={{
                    fontSize: 14,
                    color: card.ringColor,
                    fontWeight: 600,
                    opacity: 0.85,
                  }}
                >
                  {card.subtitle}
                </div>
                {/* 进度 chip */}
                <div
                  style={{
                    marginTop: 10,
                    padding: '6px 14px',
                    borderRadius: 999,
                    background: 'rgba(255,255,255,0.92)',
                    fontSize: 12,
                    fontWeight: 700,
                    color: card.ringColor,
                  }}
                >
                  {card.id === 'characters'
                    ? `本岛 300 字 · 已学 ${learned} 字`
                    : card.id === 'game'
                      ? `本岛 300 字 · 闯到第 ${Math.max(1, Math.floor(learned / 2) + 1)} 关`
                      : card.id === 'house'
                        ? `已拿 ${profile.badges.length} 枚勋章`
                        : card.progressText}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 防止未使用的 CSSProperties 警告
export type { CSSProperties };
