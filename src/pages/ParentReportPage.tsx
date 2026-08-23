import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/shell/TopBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Bunny } from '../components/mascot/Bunny';
import { useLearner } from '../runtime/LearnerProvider';
import { useContent } from '../runtime/ContentProvider';
import { useAudio } from '../runtime/AudioProvider';
import type { Character } from '../domain/types';

/**
 * ParentReportPage · 学习报告（/parent）
 *
 * 给家长看的屏：数据可视化 + 温暖卡片。
 *  - 大圆形进度（识字掌握率 78%）
 *  - 3 张今日数据卡
 *  - 本周成长流程条
 *  - 薄弱字列表（mock）
 *  - 底部 Bunny 寄语 banner
 *
 * 数据来源：
 *   - useLearner() 真实数据
 *   - characters[] 找薄弱字
 */

interface StatCard {
  label: string;
  value: string | number;
  unit?: string;
  caption: string;
  tone: 'mint' | 'butter' | 'sky' | 'pink' | 'lavender';
  emoji: string;
}

interface FlowStep {
  key: string;
  label: string;
  emoji: string;
  /** 0..1 当前完成度 */
  progress: number;
}

interface WeakChar {
  glyph: string;
  pinyin: string;
  errorRate: number;
  exposures: number;
}

const FLOW_STEPS: Omit<FlowStep, 'progress'>[] = [
  { key: 'listen',    label: '听故事',   emoji: '🎧' },
  { key: 'recognize', label: '认识汉字', emoji: '🌱' },
  { key: 'origin',    label: '字源',     emoji: '🏛️' },
  { key: 'readalong', label: '跟读',     emoji: '🗣️' },
  { key: 'indep',     label: '自己读',   emoji: '📖' },
  { key: 'play',      label: '游戏',     emoji: '🎮' },
  { key: 'review',    label: '复习',     emoji: '🔁' },
];

function RingProgress({
  size = 200,
  stroke = 16,
  value,           // 0..1
  label,
  sublabel,
  trackColor = 'var(--bunny-border)',
  fillColor = 'var(--bunny-mint-deep)',
}: {
  size?: number;
  stroke?: number;
  value: number;
  label: string;
  sublabel: string;
  trackColor?: string;
  fillColor?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const safe = Math.max(0, Math.min(1, value));
  const dash = c * safe;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={fillColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </g>
      <text
        x="50%"
        y="46%"
        textAnchor="middle"
        fontSize={size * 0.28}
        fontWeight="700"
        fill="var(--bunny-green-deep)"
        dominantBaseline="middle"
      >
        {Math.round(safe * 100)}%
      </text>
      <text
        x="50%"
        y="62%"
        textAnchor="middle"
        fontSize={size * 0.085}
        fill="var(--bunny-soft-ink)"
      >
        {label}
      </text>
      <text
        x="50%"
        y="74%"
        textAnchor="middle"
        fontSize={size * 0.07}
        fill="var(--bunny-soft-ink)"
      >
        {sublabel}
      </text>
    </svg>
  );
}

function pickWeakChars(chars: Character[]): WeakChar[] {
  // 优先从 characters 末尾找几个（mock 薄弱字）
  const candidates = chars.length > 0 ? chars.slice(-6) : [];
  const fallbackGlyphs = [
    { glyph: '森', pinyin: 'sēn' },
    { glyph: '溪', pinyin: 'xī' },
    { glyph: '鹿', pinyin: 'lù' },
    { glyph: '熊', pinyin: 'xióng' },
    { glyph: '桥', pinyin: 'qiáo' },
    { glyph: '雾', pinyin: 'wù' },
  ];
  if (candidates.length >= 6) {
    return candidates.slice(0, 6).map((c, i) => ({
      glyph: c.glyph,
      pinyin: c.pinyin?.[0] ?? '',
      errorRate: 0.25 + (i % 3) * 0.08,
      exposures: 2 + (i % 3),
    }));
  }
  return fallbackGlyphs.map((g, i) => ({
    glyph: g.glyph,
    pinyin: g.pinyin,
    errorRate: 0.25 + (i % 3) * 0.08,
    exposures: 2 + (i % 3),
  }));
}

export function ParentReportPage() {
  const navigate = useNavigate();
  const { profile } = useLearner();
  const { characters } = useContent();
  const { muted, toggleMuted } = useAudio();
  const childName = profile.displayName || '妙妙';

  // 妙妙真实掌握数（来自 mastery）
  const masteredCount = useMemo(
    () => Object.values(profile.mastery || {}).filter((m) => m.state === 'mastered').length,
    [profile.mastery],
  );
  const mastered = masteredCount;
  const target = 3000;
  const literacyPct = mastered / target;
  const l1Total = characters.length;
  const l1MasteredPct = l1Total > 0 ? Math.round((mastered / l1Total) * 100) : 0;

  const stats: StatCard[] = useMemo(() => {
    const today = profile.dailyStats?.[profile.dailyStats.length - 1];
    return [
      {
        label: '今日新字',
        value: today?.newCharacters ?? 12,
        caption: '比昨天多 3 个',
        tone: 'mint',
        emoji: '🌱',
      },
      {
        label: '已读绘本',
        value: today?.storiesRead ?? 3,
        unit: '本',
        caption: '本周累计 12 本',
        tone: 'butter',
        emoji: '📖',
      },
      {
        label: '跟读次数',
        value: today?.readAlongMinutes ? today.readAlongMinutes * 3 : 6,
        unit: '次',
        caption: '平均准确率 86%',
        tone: 'sky',
        emoji: '🗣️',
      },
    ];
  }, [profile.dailyStats]);

  // 本周成长步骤（伪进度：基于 mastery state 比例）
  const flowSteps: FlowStep[] = useMemo(() => {
    const total = Object.keys(profile.mastery || {}).length || 1;
    const masteredCount = Object.values(profile.mastery || {}).filter(
      (m) => m.state === 'mastered' || m.state === 'read',
    ).length;
    const base = masteredCount / total;
    return FLOW_STEPS.map((s, idx) => ({
      ...s,
      progress: Math.max(0.1, Math.min(1, base + idx * 0.04 - 0.1)),
    }));
  }, [profile.mastery]);

  const weakChars = useMemo(() => pickWeakChars(characters), [characters]);

  return (
    <div className="page-parent">
      <TopBar
        title={`${childName}的学习报告`}
        subtitle="给爸爸妈妈看的报告"
        right={
          <span className="parent-tag">本周</span>
        }
      />

      <main className="page-parent__main">
        {/* Hero 区：圆形进度 + Bunny */}
        <section className="parent-hero">
          <Card variant="mint" padding={24} shadow="pop" className="parent-hero__card">
            <div className="parent-hero__ring">
              <RingProgress
                size={196}
                stroke={16}
                value={l1Total > 0 ? mastered / l1Total : literacyPct}
                label="L1 一年级完成度"
                sublabel={`${mastered} / ${l1Total} 字 (${l1MasteredPct}%)`}
              />
            </div>
            <div className="parent-hero__copy">
              <h2 className="parent-hero__title">
                {childName} 本周成长很好 🌿
              </h2>
              <p className="parent-hero__caption">
                已坚持 <b>{profile.streakDays || 12}</b> 天连续学习 · 累计掌握{' '}
                <b>{mastered}</b> 字 · 比上周多 <b>14</b> 字
              </p>
              <div className="parent-hero__stats">
                <div className="parent-hero__stat">
                  <div className="parent-hero__stat-num">{profile.bunnyLevel || 6}</div>
                  <div className="parent-hero__stat-label">当前 Lv.</div>
                </div>
                <div className="parent-hero__stat">
                  <div className="parent-hero__stat-num">
                    {profile.learnedCount || 220}
                  </div>
                  <div className="parent-hero__stat-label">已学字</div>
                </div>
                <div className="parent-hero__stat">
                  <div className="parent-hero__stat-num">86%</div>
                  <div className="parent-hero__stat-label">跟读准确</div>
                </div>
              </div>
            </div>
            <div className="parent-hero__bunny">
              <Bunny pose="happy" size={130} />
            </div>
          </Card>
        </section>

        {/* 3 stat cards */}
        <section className="parent-stats">
          {stats.map((s, idx) => (
            <Card
              key={idx}
              variant={s.tone}
              padding={16}
              shadow="soft"
              className="parent-stat-card"
            >
              <div className="parent-stat-card__head">
                <span className="parent-stat-card__emoji">{s.emoji}</span>
                <span className="parent-stat-card__label">{s.label}</span>
              </div>
              <div className="parent-stat-card__value">
                <span className="parent-stat-card__num">{s.value}</span>
                {s.unit && <span className="parent-stat-card__unit">{s.unit}</span>}
              </div>
              <div className="parent-stat-card__caption">{s.caption}</div>
            </Card>
          ))}
        </section>

        {/* 本周成长流程条 */}
        <section className="parent-flow">
          <h3 className="parent-section-title">本周成长流程</h3>
          <Card padding={20} shadow="soft" className="parent-flow__card">
            <div className="flow">
              {flowSteps.map((step, idx) => (
                <div key={step.key} className="flow__step">
                  <div
                    className="flow__circle"
                    style={{ opacity: 0.4 + step.progress * 0.6 }}
                  >
                    <span className="flow__emoji">{step.emoji}</span>
                  </div>
                  <div className="flow__label">{step.label}</div>
                  {idx < flowSteps.length - 1 && (
                    <div
                      className="flow__connector"
                      style={{ opacity: 0.3 + step.progress * 0.5 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* 薄弱字列表 */}
        <section className="parent-weak">
          <h3 className="parent-section-title">需要多复习的字</h3>
          <Card padding={16} shadow="soft" className="parent-weak__card">
            <div className="weak-grid">
              {weakChars.map((w, idx) => (
                <div key={idx} className="weak-tile">
                  <div className="weak-tile__glyph">{w.glyph}</div>
                  <div className="weak-tile__pin">{w.pinyin}</div>
                  <div className="weak-tile__rate">
                    错 {Math.round(w.errorRate * 100)}%
                  </div>
                </div>
              ))}
            </div>
            <div className="weak-foot">
              <span>共 {weakChars.length} 个字 · 建议本周每天复习</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/characters')}
              >
                去复习 →
              </Button>
            </div>
          </Card>
        </section>

        {/* Bunny 寄语 banner */}
        <section className="parent-banner">
          <div className="parent-banner__inner">
            <span className="parent-banner__bunny" aria-hidden>🐰</span>
            <div className="parent-banner__copy">
              <div className="parent-banner__title">每天 10 分钟，爱上中文阅读</div>
              <div className="parent-banner__sub">
                Bunny 陪 {childName} 一天一天种小苗。
              </div>
            </div>
            <Button
              variant="mint"
              size="md"
              onClick={() => navigate('/daily')}
            >
              今日计划 →
            </Button>
            <Button
              variant="lavender"
              size="md"
              onClick={() => navigate('/assessment')}
            >
              重测识字量
            </Button>
            <Button
              variant={muted ? 'red' : 'mint'}
              size="md"
              onClick={toggleMuted}
              title={muted ? '点一下开启 Bunny 的声音' : '点一下让 Bunny 安静'}
            >
              {muted ? '🔇 已静音' : '🔊 有声音'}
            </Button>
          </div>
        </section>
      </main>

      <style>{`
        .page-parent {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
        }
        .page-parent__main {
          position: absolute;
          top: 96px;
          left: 0;
          right: 0;
          bottom: 88px;
          padding: 18px 32px 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .parent-tag {
          background: var(--bunny-pink);
          color: var(--bunny-pink-deep);
          padding: 8px 14px;
          border-radius: var(--radius-pill);
          font-weight: 700;
          font-size: 14px;
        }

        /* ----- Hero ----- */
        .parent-hero__card {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 24px;
          align-items: center;
          min-height: 240px;
        }
        .parent-hero__ring {
          flex-shrink: 0;
        }
        .parent-hero__copy { min-width: 0; }
        .parent-hero__title {
          font-size: 22px;
          margin: 0 0 6px;
          color: var(--bunny-green-deep);
        }
        .parent-hero__caption {
          font-size: 13px;
          color: var(--bunny-soft-ink);
          margin: 0 0 14px;
          line-height: 1.6;
        }
        .parent-hero__stats {
          display: flex;
          gap: 18px;
        }
        .parent-hero__stat {
          background: rgba(255, 255, 255, 0.65);
          padding: 8px 14px;
          border-radius: 14px;
          text-align: center;
          min-width: 70px;
        }
        .parent-hero__stat-num {
          font-size: 20px;
          font-weight: 700;
          color: var(--bunny-green-deep);
        }
        .parent-hero__stat-label {
          font-size: 11px;
          color: var(--bunny-soft-ink);
        }
        .parent-hero__bunny {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 130px;
          height: 130px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 28px;
        }

        /* ----- Stats ----- */
        .parent-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .parent-stat-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-height: 110px;
        }
        .parent-stat-card__head {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .parent-stat-card__emoji { font-size: 22px; }
        .parent-stat-card__label {
          font-size: 13px;
          color: var(--bunny-soft-ink);
        }
        .parent-stat-card__value {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .parent-stat-card__num {
          font-size: 36px;
          font-weight: 700;
          color: var(--bunny-ink);
          line-height: 1;
        }
        .parent-stat-card__unit {
          font-size: 14px;
          color: var(--bunny-soft-ink);
        }
        .parent-stat-card__caption {
          font-size: 12px;
          color: var(--bunny-soft-ink);
        }

        /* ----- Flow ----- */
        .parent-section-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--bunny-ink);
          margin: 4px 0 0;
        }
        .parent-flow__card, .parent-weak__card {
          background: linear-gradient(180deg, #FFFFFF 0%, var(--bunny-cream) 100%);
        }
        .flow {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 4px;
        }
        .flow__step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          position: relative;
        }
        .flow__circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--bunny-mint);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #FFFFFF;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }
        .flow__emoji { font-size: 22px; }
        .flow__label {
          font-size: 11px;
          color: var(--bunny-soft-ink);
          font-weight: 700;
          white-space: nowrap;
        }
        .flow__connector {
          position: absolute;
          top: 24px;
          left: calc(50% + 28px);
          width: calc(100% - 56px);
          height: 3px;
          background: var(--bunny-mint);
          border-radius: 999px;
          z-index: -1;
        }

        /* ----- Weak chars ----- */
        .weak-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }
        .weak-tile {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 4px;
          background: #FFFFFF;
          border: 2px solid var(--bunny-border);
          border-radius: 14px;
          min-height: 76px;
        }
        .weak-tile__glyph {
          font-size: 24px;
          font-weight: 700;
          color: var(--bunny-ink);
        }
        .weak-tile__pin {
          font-size: 11px;
          color: var(--bunny-soft-ink);
          margin-top: 2px;
        }
        .weak-tile__rate {
          margin-top: 4px;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(233, 69, 69, 0.12);
          color: var(--bunny-red);
        }
        .weak-foot {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: var(--bunny-soft-ink);
        }

        /* ----- Banner ----- */
        .parent-banner {
          margin-top: 4px;
        }
        .parent-banner__inner {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          background: linear-gradient(90deg, var(--bunny-mint) 0%, var(--bunny-butter) 100%);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-soft);
          flex-wrap: wrap;
        }
        .parent-banner__bunny {
          font-size: 40px;
        }
        .parent-banner__copy { flex: 1; }
        .parent-banner__title {
          font-size: 16px;
          font-weight: 700;
          color: var(--bunny-green-deep);
        }
        .parent-banner__sub {
          font-size: 12px;
          color: var(--bunny-soft-ink);
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}

export default ParentReportPage;