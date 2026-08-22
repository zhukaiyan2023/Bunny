import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/shell/TopBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useContent } from '../runtime/ContentProvider';
import { useLearner } from '../runtime/LearnerProvider';
import { useAudio } from '../runtime/AudioProvider';
import type { Character } from '../domain/types';

/**
 * CurriculumPage · 课程体系（/curriculum）
 *
 * 6-9 岁主线版：
 *   - TopBar：课程体系 + 人教版 1-2 年级语文
 *   - 两张大卡片：一年级上 / 一年级下（每张 4×4 unit 网格）
 *   - 每张卡显示 2 个 starter family 样字
 *   - 底部 timeline：3000 字按学段分桶的 10 条横条
 *
 * 数据策略：
 *   - 起步 family = characters.filter(c => c.tier === 'A')（与 starter 起步岛对应）
 *   - characters 为空时回退到 mock 字串
 */

const STAGE_BUCKETS: { label: string; count: number; color: 'mint' | 'butter' | 'pink' | 'sky' | 'lavender' }[] = [
  { label: '启蒙', count: 50, color: 'mint' },
  { label: '一年级上', count: 300, color: 'butter' },
  { label: '一年级下', count: 100, color: 'butter' },
  { label: '二年级', count: 800, color: 'pink' },
  { label: '三年级', count: 250, color: 'sky' },
  { label: '四年级', count: 200, color: 'sky' },
  { label: '五年级', count: 300, color: 'lavender' },
  { label: '六年级', count: 400, color: 'lavender' },
  { label: '初中', count: 400, color: 'mint' },
  { label: '高中', count: 200, color: 'mint' },
];

interface GradeCard {
  key: 'g1-up' | 'g1-down';
  label: string;
  title: string;
  emoji: string;
  units: number;
  totalChars: number;
  /** unit labels（4×4 grid = 16 cells，4 行 × 4 列） */
  unitNames: string[];
  tone: 'mint' | 'sky' | 'butter' | 'lavender' | 'pink';
}

const GRADE_CARDS: GradeCard[] = [
  {
    key: 'g1-up',
    label: '一年级上',
    title: '人教版 · 一年级上',
    emoji: '🍂',
    units: 16,
    totalChars: 100,
    unitNames: [
      '识字一', '识字二', '识字三', '识字四',
      '课文 1', '课文 2', '课文 3', '课文 4',
      '阅读', '拼音', '口语', '写字',
      '复习', '测试', '故事', '总结',
    ],
    tone: 'butter',
  },
  {
    key: 'g1-down',
    label: '一年级下',
    title: '人教版 · 一年级下',
    emoji: '🌸',
    units: 16,
    totalChars: 100,
    unitNames: [
      '识字一', '识字二', '识字三', '识字四',
      '课文 1', '课文 2', '课文 3', '课文 4',
      '春天', '夏天', '秋天', '冬天',
      '复习', '测试', '故事', '总结',
    ],
    tone: 'pink',
  },
];

function colorVar(c: GradeCard['tone']): string {
  switch (c) {
    case 'mint':     return 'var(--bunny-mint)';
    case 'butter':   return 'var(--bunny-butter)';
    case 'sky':      return 'var(--bunny-sky)';
    case 'lavender': return 'var(--bunny-lavender)';
    case 'pink':     return 'var(--bunny-pink)';
  }
}

function getStarterFamily(chars: Character[]): Character[] {
  // 起步 family = tier A 象形字
  const tierA = chars.filter((c) => c.tier === 'A');
  if (tierA.length > 0) return tierA;
  // fallback mock
  const fallback: Character[] = [
    { id: 'char-shan', glyph: '山', pinyin: ['shān'], tone: 1, meaning: [], strokes: 3, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' } as unknown as Character,
    { id: 'char-mu',   glyph: '木', pinyin: ['mù'],   tone: 4, meaning: [], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'plants' } as unknown as Character,
    { id: 'char-shui', glyph: '水', pinyin: ['shuǐ'], tone: 3, meaning: [], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' } as unknown as Character,
  ];
  return fallback;
}

export function CurriculumPage() {
  const navigate = useNavigate();
  const { characters } = useContent();
  const { profile } = useLearner();
  const { playText } = useAudio();

  const starterChars = useMemo(() => getStarterFamily(characters).slice(0, 4), [characters]);
  const sampleA = starterChars[0];
  const sampleB = starterChars[1] ?? starterChars[0];

  const totalAll = STAGE_BUCKETS.reduce((s, b) => s + b.count, 0);
  const maxBucket = Math.max(...STAGE_BUCKETS.map((b) => b.count));

  const handleSampleClick = (c: Character) => {
    playText(c.glyph + '，' + (c.pinyin?.[0] ?? '')).catch(() => {});
    navigate('/characters');
  };

  return (
    <div className="page-curriculum">
      <TopBar
        title="课程体系"
        subtitle="人教版 1-2 年级语文"
        right={
          <div className="curr-summary">
            <span className="curr-summary__num">{totalAll}</span>
            <span className="curr-summary__label">字</span>
          </div>
        }
      />

      <main className="page-curriculum__main">
        {/* 起步 family 样字条 */}
        <section className="curr-starter">
          <div className="curr-starter__label">起步家族</div>
          <div className="curr-starter__chips">
            {starterChars.map((c) => (
              <button
                key={c.id}
                type="button"
                className="curr-starter__chip"
                onClick={() => handleSampleClick(c)}
                aria-label={`查看 ${c.glyph}`}
              >
                <span className="curr-starter__glyph">{c.glyph}</span>
                <span className="curr-starter__pin">{c.pinyin?.[0] ?? ''}</span>
              </button>
            ))}
          </div>
          <div className="curr-starter__hint">
            点击 → 字卡 · 当前 <b>{profile.learnedCount || 0}</b> / 50 启蒙字
          </div>
        </section>

        {/* 两张大卡片 side-by-side */}
        <section className="curr-grades">
          {GRADE_CARDS.map((card) => (
            <Card
              key={card.key}
              variant={card.tone}
              padding={18}
              shadow="soft"
              className="curr-grade-card"
            >
              <div className="curr-grade-card__head">
                <span className="curr-grade-card__emoji">{card.emoji}</span>
                <div className="curr-grade-card__title-block">
                  <h3 className="curr-grade-card__title">{card.title}</h3>
                  <p className="curr-grade-card__sub">
                    {card.units} 单元 · {card.totalChars} 字
                  </p>
                </div>
              </div>

              {/* 4×4 unit grid */}
              <div className="unit-grid">
                {card.unitNames.map((name, idx) => {
                  const isCurrent =
                    (card.key === 'g1-up' && profile.bunnyLevel >= 1 && idx === 4) ||
                    (card.key === 'g1-down' && idx === 8);
                  return (
                    <button
                      key={`${card.key}-${idx}`}
                      type="button"
                      className={`unit-cell ${isCurrent ? 'is-current' : ''}`}
                      style={{ background: colorVar(card.tone) }}
                      onClick={() => navigate('/story')}
                    >
                      <span className="unit-cell__num">{idx + 1}</span>
                      <span className="unit-cell__name">{name}</span>
                    </button>
                  );
                })}
              </div>

              {/* 样字预览 */}
              <div className="curr-grade-card__samples">
                <span className="curr-grade-card__samples-label">样字：</span>
                <span
                  className="curr-grade-card__sample-glyph"
                  onClick={() => handleSampleClick(sampleA)}
                  role="button"
                  tabIndex={0}
                >
                  {sampleA?.glyph ?? '山'}
                </span>
                <span
                  className="curr-grade-card__sample-glyph"
                  onClick={() => handleSampleClick(sampleB)}
                  role="button"
                  tabIndex={0}
                >
                  {sampleB?.glyph ?? '木'}
                </span>
              </div>
            </Card>
          ))}
        </section>

        {/* 底部 timeline：3000 字分桶 */}
        <section className="curr-timeline">
          <h3 className="curr-section-title">3000 字 · 学段分布</h3>
          <div className="timeline">
            {STAGE_BUCKETS.map((bucket, idx) => {
              const heightPct = (bucket.count / maxBucket) * 100;
              const isCurrent = idx === 1; // 一年级上是当前阶段
              return (
                <div key={bucket.label} className="timeline__col">
                  <div className="timeline__num">{bucket.count}</div>
                  <div className="timeline__bar-wrap">
                    <div
                      className={`timeline__bar timeline__bar--${bucket.color} ${isCurrent ? 'is-current' : ''}`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <div className="timeline__label">{bucket.label}</div>
                </div>
              );
            })}
          </div>
          <p className="curr-timeline__hint">
            当前阶段：一年级上（黄色高亮）。共 {totalAll} 字，按 10 个学段铺开。
          </p>
        </section>
      </main>

      <style>{`
        .page-curriculum {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
        }
        .page-curriculum__main {
          position: absolute;
          top: 96px;
          left: 0;
          right: 0;
          bottom: 88px;
          padding: 18px 32px 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ----- TopBar right ----- */
        .curr-summary {
          display: inline-flex;
          align-items: baseline;
          gap: 4px;
          background: var(--bunny-lavender);
          padding: 10px 18px;
          border-radius: var(--radius-pill);
          font-weight: 700;
        }
        .curr-summary__num { font-size: 22px; color: var(--bunny-lavender-deep); }
        .curr-summary__label { font-size: 13px; color: var(--bunny-soft-ink); }

        /* ----- Starter family ----- */
        .curr-starter {
          background: linear-gradient(180deg, #FFFFFF 0%, var(--bunny-cream) 100%);
          border: 2px solid var(--bunny-border);
          border-radius: var(--radius-card);
          padding: 14px 20px;
          box-shadow: var(--shadow-soft);
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .curr-starter__label {
          font-size: 14px;
          font-weight: 700;
          color: var(--bunny-soft-ink);
          white-space: nowrap;
        }
        .curr-starter__chips {
          display: flex;
          gap: 8px;
          flex: 1;
        }
        .curr-starter__chip {
          width: 60px;
          height: 64px;
          background: #FFFFFF;
          border: 2px solid var(--bunny-border);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.12s ease;
        }
        .curr-starter__chip:hover { transform: translateY(-3px); }
        .curr-starter__glyph { font-size: 26px; font-weight: 700; color: var(--bunny-ink); }
        .curr-starter__pin   { font-size: 12px; color: var(--bunny-soft-ink); }
        .curr-starter__hint {
          font-size: 12px;
          color: var(--bunny-soft-ink);
          white-space: nowrap;
        }

        /* ----- Grade cards ----- */
        .curr-grades {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .curr-grade-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .curr-grade-card__head {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .curr-grade-card__emoji { font-size: 36px; }
        .curr-grade-card__title {
          font-size: 18px;
          font-weight: 700;
          color: var(--bunny-ink);
          margin: 0;
        }
        .curr-grade-card__sub {
          font-size: 13px;
          color: var(--bunny-soft-ink);
          margin: 2px 0 0;
        }

        .unit-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }
        .unit-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 4px;
          min-height: 56px;
          border-radius: 12px;
          border: 2px solid transparent;
          cursor: pointer;
          font-family: inherit;
          transition: transform 0.12s ease;
        }
        .unit-cell:hover { transform: translateY(-2px); }
        .unit-cell__num { font-size: 12px; font-weight: 700; color: var(--bunny-soft-ink); }
        .unit-cell__name { font-size: 13px; font-weight: 700; color: var(--bunny-ink); }
        .unit-cell.is-current {
          border-color: var(--bunny-red);
          box-shadow: 0 0 0 2px rgba(233, 69, 69, 0.2);
        }

        .curr-grade-card__samples {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 12px;
        }
        .curr-grade-card__samples-label {
          font-size: 13px;
          color: var(--bunny-soft-ink);
        }
        .curr-grade-card__sample-glyph {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: #FFFFFF;
          border: 2px solid var(--bunny-border);
          border-radius: 12px;
          font-size: 22px;
          font-weight: 700;
          color: var(--bunny-ink);
          cursor: pointer;
        }

        /* ----- Timeline ----- */
        .curr-section-title {
          font-size: 16px;
          font-weight: 700;
          color: var(--bunny-ink);
          margin: 4px 0 0;
        }
        .timeline {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 180px;
          padding: 12px 16px;
          background: linear-gradient(180deg, #FFFFFF 0%, var(--bunny-cream) 100%);
          border: 2px solid var(--bunny-border);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-soft);
        }
        .timeline__col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 0;
        }
        .timeline__num {
          font-size: 12px;
          font-weight: 700;
          color: var(--bunny-soft-ink);
        }
        .timeline__bar-wrap {
          flex: 1;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .timeline__bar {
          width: 70%;
          min-height: 6px;
          border-radius: 6px 6px 0 0;
          transition: height 0.4s ease;
        }
        .timeline__bar--mint     { background: var(--bunny-mint); }
        .timeline__bar--butter   { background: var(--bunny-butter); }
        .timeline__bar--pink     { background: var(--bunny-pink); }
        .timeline__bar--sky      { background: var(--bunny-sky); }
        .timeline__bar--lavender { background: var(--bunny-lavender); }
        .timeline__bar.is-current {
          outline: 2px solid var(--bunny-red);
          outline-offset: 2px;
        }
        .timeline__label {
          font-size: 11px;
          color: var(--bunny-soft-ink);
          text-align: center;
          line-height: 1.2;
          white-space: nowrap;
        }
        .curr-timeline__hint {
          font-size: 12px;
          color: var(--bunny-soft-ink);
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default CurriculumPage;