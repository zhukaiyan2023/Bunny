import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/shell/TopBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Bunny } from '../components/mascot/Bunny';
import { useLearner } from '../runtime/LearnerProvider';
import { useContent } from '../runtime/ContentProvider';
import { useAudio } from '../runtime/AudioProvider';

/**
 * LevelPage · 我的成长（/level）
 *
 * 6-9 岁主线版：
 *   - TopBar：我的成长 + Lv.X 故事探险家
 *   - 4 条能力轨道（horizontal bars，每条 ~800×80）
 *   - 3 张进阶目标卡片
 *   - 优先用 useLearner() 真实数据；无数据时用合理占位
 */

type SkillKey = 'literacy' | 'reading' | 'expression' | 'writing';

interface SkillTrack {
  key: SkillKey;
  label: string;
  emoji: string;
  /** 0..1 */
  value: number;
  description: string;
  nextGoal: string;
  color: 'mint' | 'butter' | 'sky' | 'lavender';
}

const TRACK_HEIGHT = 80;

/** 把 0..100 映射到 0..1 */
const pct = (n: number) => Math.max(0, Math.min(1, n / 100));

export function LevelPage() {
  const navigate = useNavigate();
  const { profile } = useLearner();
  const { characters } = useContent();
  const { playText } = useAudio();
  const childName = profile.displayName || '妙妙';

  const [activeKey, setActiveKey] = useState<SkillKey | null>(null);

  // 妙妙的真实掌握数
  const masteredCount = useMemo(
    () => Object.values(profile.mastery).filter((m) => m.state === 'mastered').length,
    [profile.mastery],
  );

  // 从 profile.skills 拿真实数据；不足时给合理占位
  const skills = profile.skills;
  const tracks: SkillTrack[] = useMemo(() => {
    const learned = masteredCount;
    const l1Pct = characters.length > 0 ? Math.round((learned / characters.length) * 100) : 0;
    return [
      {
        key: 'literacy',
        label: '识字',
        emoji: '🌱',
        value: characters.length > 0 ? pct(Math.round((learned / characters.length) * 100)) : pct(skills.literacy || 78),
        description: `已掌握 ${learned} / ${characters.length} 字 (L1 ${l1Pct}%)`,
        nextGoal: characters.length - learned > 0
          ? `再学 ${Math.min(14, characters.length - learned)} 字升到 Lv.${profile.bunnyLevel + 1}`
          : '已完成 L1 一年级，去探索 L2 吧！',
        color: 'mint',
      },
      {
        key: 'reading',
        label: '阅读',
        emoji: '📖',
        // 阅读进度：基于 L1 完成度推算
        value: characters.length > 0
          ? pct(Math.min(80, Math.round((masteredCount / characters.length) * 80)))
          : pct(skills.reading || 56),
        description: `已读 ${profile.dailyStats?.[profile.dailyStats.length - 1]?.storiesRead ?? 0} 本绘本`,
        nextGoal: '尝试读一段 30 字的短文',
        color: 'butter',
      },
      {
        key: 'expression',
        label: '表达',
        emoji: '💬',
        // 表达进度：跟读次数 / 10
        value: pct(Math.min(100, (profile.dailyStats?.[profile.dailyStats.length - 1]?.readAlongMinutes ?? 0) * 10)),
        description: `今日跟读 ${profile.dailyStats?.[profile.dailyStats.length - 1]?.readAlongMinutes ?? 0} 分钟`,
        nextGoal: '用 5 个字描述一张图',
        color: 'sky',
      },
      {
        key: 'writing',
        label: '书写',
        emoji: '✏️',
        // 书写进度：粗略估算 = 已学 / 10
        value: pct(Math.min(100, masteredCount * 10)),
        description: `已学 ${masteredCount} 个字的写法`,
        nextGoal: '再学 10 个笔画简单的字',
        color: 'lavender',
      },
    ];
  }, [skills, profile.learnedCount]);

  const levelTitle = `Lv.${profile.bunnyLevel || 6} 故事探险家`;
  const mastered = profile.masteredCount || 132;
  const totalChars = characters.length || 3000;

  // 进阶目标 cards
  const milestones = useMemo(
    () => [
      {
        title: '再学 14 字升到 Lv.7 山林探险家',
        caption: '还差 14 字 → Lv.7',
        state: 'today' as const,
        emoji: '🏔️',
        tone: 'mint' as const,
      },
      {
        title: '阅读 5 本绘本解锁「故事大王」勋章',
        caption: '还差 2 本',
        state: 'future' as const,
        emoji: '🏅',
        tone: 'butter' as const,
      },
      {
        title: '坚持 30 天点亮连续学习徽章',
        caption: '已坚持 ' + (profile.streakDays || 12) + ' 天',
        state: 'future' as const,
        emoji: '🔥',
        tone: 'pink' as const,
      },
    ],
    [profile.streakDays],
  );

  const handleTrackClick = (track: SkillTrack) => {
    setActiveKey((cur) => (cur === track.key ? null : track.key));
    playText(track.nextGoal).catch(() => {});
  };

  return (
    <div className="page-level">
      <TopBar
        title={`${childName}的成长`}
        subtitle={levelTitle}
        right={
          <div className="level-summary">
            <span className="level-summary__num">{mastered}</span>
            <span className="level-summary__sep">/ {totalChars} 字</span>
          </div>
        }
      />

      <main className="page-level__main">
        {/* Hero strip with Bunny + stats */}
        <section className="level-hero">
          <div className="level-hero__bunny">
            <Bunny pose="happy" size={120} />
          </div>
          <div className="level-hero__copy">
            <div className="level-hero__name">{childName}</div>
            <div className="level-hero__sub">
              已掌握 <b>{mastered}</b> / <b>{characters.length}</b> 字 (L1 一年级 {characters.length > 0 ? Math.round((mastered / characters.length) * 100) : 0}%)
            </div>
          </div>
        </section>

        {/* 4 ability tracks */}
        <section className="level-tracks">
          {tracks.map((track) => {
            const isActive = activeKey === track.key;
            return (
              <button
                key={track.key}
                type="button"
                className={`track track--${track.color} ${isActive ? 'is-active' : ''}`}
                onClick={() => handleTrackClick(track)}
                aria-expanded={isActive}
              >
                <div className="track__head">
                  <span className="track__emoji">{track.emoji}</span>
                  <span className="track__label">{track.label}</span>
                  <span className="track__pct">{Math.round(track.value * 100)}%</span>
                </div>
                <div className="track__bar">
                  <div
                    className="track__fill"
                    style={{ width: `${track.value * 100}%` }}
                  />
                </div>
                <div className="track__foot">
                  <span className="track__desc">{track.description}</span>
                  <span className="track__chev">{isActive ? '▾' : '▸'}</span>
                </div>
                {isActive && (
                  <div className="track__goal">
                    <span className="track__goal-label">下一目标：</span>
                    {track.nextGoal}
                  </div>
                )}
              </button>
            );
          })}
        </section>

        {/* 进阶目标 cards */}
        <section className="level-milestones">
          <h3 className="level-section-title">进阶目标</h3>
          <div className="level-milestones__grid">
            {milestones.map((m, idx) => (
              <Card
                key={idx}
                variant={m.tone}
                padding={16}
                shadow={m.state === 'today' ? 'pop' : 'soft'}
                className={`milestone milestone--${m.state}`}
              >
                <div className="milestone__head">
                  <span className="milestone__emoji">{m.emoji}</span>
                  {m.state === 'today' && (
                    <span className="milestone__badge">今天</span>
                  )}
                </div>
                <div className="milestone__title">{m.title}</div>
                <div className="milestone__caption">{m.caption}</div>
                {m.state === 'today' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/daily')}
                    style={{ marginTop: 8 }}
                  >
                    开始 →
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        .page-level {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
        }
        .page-level__main {
          position: absolute;
          top: 96px;
          left: 0;
          right: 0;
          bottom: 88px;
          padding: 20px 32px 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* ----- TopBar right slot ----- */
        .level-summary {
          display: inline-flex;
          align-items: baseline;
          gap: 4px;
          background: var(--bunny-mint);
          padding: 10px 18px;
          border-radius: var(--radius-pill);
          font-weight: 700;
        }
        .level-summary__num { font-size: 22px; color: var(--bunny-green-deep); }
        .level-summary__sep { font-size: 13px; color: var(--bunny-soft-ink); }

        /* ----- Hero ----- */
        .level-hero {
          display: flex;
          align-items: center;
          gap: 20px;
          background: linear-gradient(180deg, #FFFFFF 0%, var(--bunny-cream) 100%);
          border: 2px solid var(--bunny-border);
          border-radius: var(--radius-card);
          padding: 16px 24px;
          box-shadow: var(--shadow-soft);
        }
        .level-hero__bunny {
          flex-shrink: 0;
          width: 120px;
          height: 120px;
          background: var(--bunny-butter);
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .level-hero__name {
          font-size: 22px;
          font-weight: 700;
          color: var(--bunny-ink);
        }
        .level-hero__sub {
          margin-top: 4px;
          font-size: 14px;
          color: var(--bunny-soft-ink);
        }

        /* ----- Tracks ----- */
        .level-tracks {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .track {
          display: block;
          width: 100%;
          min-height: ${TRACK_HEIGHT}px;
          padding: 14px 20px;
          background: #FFFFFF;
          border: 2px solid var(--bunny-border);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-soft);
          text-align: left;
          font-family: inherit;
          cursor: pointer;
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .track:hover { transform: translateY(-2px); box-shadow: var(--shadow-pop); }
        .track.is-active { box-shadow: var(--shadow-pop); }
        .track__head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .track__emoji { font-size: 22px; }
        .track__label {
          font-size: 16px;
          font-weight: 700;
          color: var(--bunny-ink);
        }
        .track__pct {
          margin-left: auto;
          font-size: 18px;
          font-weight: 700;
          color: var(--bunny-soft-ink);
        }
        .track__bar {
          height: 14px;
          background: var(--bunny-border);
          border-radius: 999px;
          overflow: hidden;
        }
        .track__fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .track--mint .track__fill     { background: var(--bunny-mint-deep); }
        .track--butter .track__fill   { background: var(--bunny-yellow); }
        .track--sky .track__fill      { background: var(--bunny-blue-deep); }
        .track--lavender .track__fill { background: var(--bunny-lavender-deep); }
        .track__foot {
          margin-top: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: var(--bunny-soft-ink);
        }
        .track__chev { font-size: 14px; color: var(--bunny-soft-ink); }
        .track__goal {
          margin-top: 8px;
          padding: 8px 12px;
          background: var(--bunny-cream);
          border-radius: 12px;
          font-size: 13px;
          color: var(--bunny-ink);
        }
        .track__goal-label { font-weight: 700; margin-right: 4px; }

        /* ----- Milestones ----- */
        .level-section-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--bunny-ink);
          margin: 4px 0 0;
        }
        .level-milestones__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .milestone {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-height: 140px;
        }
        .milestone__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .milestone__emoji { font-size: 28px; }
        .milestone__badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          background: var(--bunny-red);
          color: #FFFFFF;
        }
        .milestone__title {
          font-size: 15px;
          font-weight: 700;
          color: var(--bunny-ink);
          line-height: 1.35;
        }
        .milestone__caption {
          font-size: 12px;
          color: var(--bunny-soft-ink);
        }
        .milestone--future {
          opacity: 0.85;
          filter: saturate(0.9);
        }
      `}</style>
    </div>
  );
}

export default LevelPage;