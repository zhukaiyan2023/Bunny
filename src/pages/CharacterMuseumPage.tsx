import { useEffect, useMemo, useState } from 'react';
import { TopBar } from '../components/shell/TopBar';
import { Bunny } from '../components/mascot/Bunny';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useContent } from '../runtime/ContentProvider';
import { useLearner } from '../runtime/LearnerProvider';
import { useAudio } from '../runtime/AudioProvider';
import type { Character } from '../domain/types';

const FALLBACK_CHARS: Character[] = [
  { id: 'char-shan', glyph: '山', pinyin: ['shān'], tone: 1, meaning: ['山峰'], strokes: 3, tier: 'A', type: 'pictograph', origin: { fact: '象形字，像三座山峰。', story: '高高的山峰，就像一排起伏的山。' }, words: ['大山', '山上'], island: 'nature' },
  { id: 'char-shui', glyph: '水', pinyin: ['shuǐ'], tone: 3, meaning: ['水流'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '象形字，表示流动的水。', story: '水会弯弯曲曲地流动，所以古人画出了水流的样子。' }, words: ['河水', '喝水'], island: 'nature' },
  { id: 'char-mu', glyph: '木', pinyin: ['mù'], tone: 4, meaning: ['树木'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '象形字，像一棵有根、有干、有枝的树。', story: '古人看到树，把树根、树干和树枝画下来，慢慢就变成了“木”。' }, words: ['木头', '树木'], island: 'plants' },
  { id: 'char-ri', glyph: '日', pinyin: ['rì'], tone: 4, meaning: ['太阳'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '象形字，本义与太阳有关。', story: '抬头看太阳，古人把它画下来，后来慢慢写成“日”。' }, words: ['日出', '生日'], island: 'nature' },
  { id: 'char-yue', glyph: '月', pinyin: ['yuè'], tone: 4, meaning: ['月亮'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '象形字，像弯弯的月亮。', story: '夜空里的月亮弯弯的，古人就把它画下来。' }, words: ['月亮', '明月'], island: 'nature' },
] as Character[];

/**
 * 汉字教学图统一走 content 里 AI 生成的象形图（jpg）。
 *
 * 历史：以前 山/水/木/日/月 走手写 SVG（teach-*.svg），Tier-B 又写错 .png，
 * 导致页面经常回落到 SVG fallback。现在所有字都用 AI 生成的 picto-*.jpg。
 */
function teachingArtPath(ch: Character): string {
  const slug = ch.id.replace(/^char-/, '');
  if (ch.tier === 'B') return `/assets/art/l1/tier-b/picto-${slug}.jpg`;
  if (ch.tier === 'C') return `/assets/art/l1/tier-c/picto-${slug}.jpg`;
  if (ch.tier === 'D') return `/assets/art/l1/tier-d/picto-${slug}.jpg`;
  if (ch.tier === 'E') return `/assets/art/l1/tier-e/picto-${slug}.jpg`;
  return `/assets/art/l1/tier-a/picto-${slug}.jpg`;
}

function TeachingArt({ ch, size = 340 }: { ch: Character; size?: number }) {
  const src = teachingArtPath(ch);
  return (
    <div style={{ width: size, height: size, borderRadius: 32, overflow: 'hidden', background: '#fff', border: '3px solid var(--bunny-border)', boxShadow: 'var(--shadow-pop)' }}>
      <img
        src={src}
        alt={`${ch.glyph} 汉字教学图`}
        style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(event) => {
          // 兜底：picto 缺失时显示带渐变背景的字卡（仅占位，正常流程不会触发）
          event.currentTarget.src = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#FFF4E6"/><stop offset="1" stop-color="#FFE0BF"/></linearGradient></defs><rect width="400" height="400" rx="24" fill="url(#g)"/><text x="200" y="270" text-anchor="middle" font-size="220" font-family="PingFang SC,Microsoft YaHei,sans-serif" font-weight="900" fill="#2C2C54">${ch.glyph}</text></svg>`)}`;
        }}
      />
    </div>
  );
}

function PreviewCard({ ch, onClick, onPlay, active }: { ch: Character; onClick: () => void; onPlay: (e: React.MouseEvent) => void; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${ch.glyph}（${ch.pinyin[0]}）— ${ch.meaning?.[0] ?? ''}`}
      style={{
        position: 'relative',
        minWidth: 0,
        minHeight: 142,
        border: active ? '3px solid var(--bunny-red)' : '2px solid var(--bunny-border)',
        background: active ? 'var(--bunny-butter)' : '#FFFFFF',
        borderRadius: 20,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        fontFamily: 'inherit',
        boxShadow: active ? 'var(--shadow-pop)' : 'var(--shadow-soft)',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-pop)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = active ? 'var(--shadow-pop)' : 'var(--shadow-soft)'; }}
    >
      <span
        role="button"
        aria-label={`播放 ${ch.glyph} 的读音`}
        onClick={onPlay}
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: 'var(--bunny-mint)',
          color: 'var(--bunny-green-deep)',
          fontSize: 14,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-soft)',
          zIndex: 2,
        }}
      >
        🔊
      </span>
      <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--bunny-ink)', lineHeight: 1 }}>{ch.glyph}</div>
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--bunny-blue-deep)' }}>{ch.pinyin[0]}</div>
      <div style={{ fontSize: 11, color: 'var(--bunny-soft-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{ch.meaning?.[0] ?? ''}</div>
    </button>
  );
}

export function CharacterMuseumPage() {
  const { characters } = useContent();
  const { profile, markCharacterExposed } = useLearner();
  const { playText } = useAudio();
  const childName = profile.displayName || '妙妙';

  // 妙妙已掌握 / 学习中字的数量
  const masteredCount = useMemo(() => {
    return Object.values(profile.mastery).filter((m) => m.state === 'mastered').length;
  }, [profile.mastery]);
  const learningCount = characters.length - masteredCount;

  /**
   * 「妙妙的汉字花园」：
   *   1. 妙妙还没掌握的 5 字（学习入口）
   *   2. 妙妙最近练过的 3 字（复习入口）
   * 找不到则退回到前 8 个 tier-A 象形字
   */
  const list = useMemo<Character[]>(() => {
    const source = characters.length > 0 ? characters : FALLBACK_CHARS;
    const mastered = new Set(
      Object.entries(profile.mastery)
        .filter(([, m]) => m.state === 'mastered')
        .map(([id]) => id),
    );
    const toLearn = source.filter((c) => !mastered.has(c.id));
    const toReview = source.filter((c) => mastered.has(c.id)).slice(0, 3);
    const pick = [...toLearn.slice(0, 5), ...toReview];
    if (pick.length > 0) return pick;
    // 兜底：tier-A 象形字前 8
    const preferred = ['char-shan', 'char-shui', 'char-mu', 'char-ri', 'char-yue', 'char-ren', 'char-kou', 'char-huo'];
    return preferred.map((id) => source.find((c) => c.id === id)).filter(Boolean) as Character[];
  }, [characters, profile.mastery]);

  const [idx, setIdx] = useState(0);
  const [showLibrary, setShowLibrary] = useState(false);
  const main = list[idx] ?? list[0] ?? FALLBACK_CHARS[0];
  const next3 = useMemo(() => [1, 2, 3].map((offset) => list[(idx + offset) % list.length]).filter(Boolean), [idx, list]);

  // 进入汉字花园时自动念出第一个字
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (main) void playText(`${main.glyph}，${main.pinyin[0]}`);
    }, 600);
    return () => window.clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRead = () => {
    void playText(`${main.glyph}，${main.pinyin[0]}`);
    markCharacterExposed(main.id);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <TopBar
        title="汉字花园"
        subtitle={`${childName} · 已掌握 ${masteredCount} 字，待学习 ${learningCount} 字 · 先认识字，再发现这个字为什么这样写`}
        right={
          showLibrary ? (
            <button
              type="button"
              onClick={() => setShowLibrary(false)}
              style={{
                padding: '8px 14px', borderRadius: 999,
                background: 'var(--bunny-mint)', color: 'var(--bunny-green-deep)',
                fontWeight: 900, fontSize: 13, border: 'none', cursor: 'pointer',
                boxShadow: 'var(--shadow-soft)', fontFamily: 'inherit',
              }}
            >
              ← 回学习模式
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowLibrary(true)}
              style={{
                padding: '8px 14px', borderRadius: 999,
                background: 'rgba(255,255,255,.95)', color: 'var(--bunny-blue-deep)',
                fontWeight: 900, fontSize: 13, border: '2px solid var(--bunny-border)',
                cursor: 'pointer', boxShadow: 'var(--shadow-soft)', fontFamily: 'inherit',
              }}
            >
              📚 字库浏览
            </button>
          )
        }
      />

      <div style={{ flex: 1, minHeight: 0, padding: '18px 24px 104px', overflow: 'auto' }}>
        {showLibrary ? (
          <CharacterLibraryView
            characters={characters}
            mastery={profile.mastery}
            onPick={(c) => {
              const target = list.findIndex((x) => x.id === c.id);
              if (target >= 0) setIdx(target);
              setShowLibrary(false);
              markCharacterExposed(c.id);
            }}
          />
        ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(560px, 1.2fr) minmax(380px, .8fr)', gap: 20, minHeight: '100%' }}>
          <Card variant="soft" padding={24} style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--bunny-soft-ink)' }}>汉字本体 · 第 {idx + 1} / {list.length} 个</div>
                <div style={{ marginTop: 4, fontSize: 28, fontWeight: 900, color: 'var(--bunny-ink)' }}>{main.glyph}</div>
              </div>
              <div style={{ padding: '8px 14px', borderRadius: 999, background: 'var(--bunny-mint)', color: 'var(--bunny-green-deep)', fontWeight: 900 }}>{main.meaning?.[0] ?? '汉字'}</div>
            </div>

            <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, flexWrap: 'wrap', padding: '18px 0' }}>
              <TeachingArt ch={main} size={Math.min(400, 42 * 9)} />
              <div style={{ width: 180 }}>
                <div style={{ fontSize: 'clamp(62px, 6vw, 92px)', fontWeight: 900, lineHeight: 1, color: 'var(--bunny-ink)' }}>{main.glyph}</div>
                <div style={{ marginTop: 14, fontSize: 32, fontWeight: 900, color: 'var(--bunny-blue-deep)' }}>{main.pinyin[0]}</div>
                <div style={{ marginTop: 14, fontSize: 15, lineHeight: 1.7, color: 'var(--bunny-soft-ink)' }}>笔画：{main.strokes} 画<br />类型：{main.type === 'pictograph' ? '象形字' : '构字字'}<br />常用词：{main.words?.slice(0, 2).join('、') || '—'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <Button variant="red" size="lg" leading="🐰" onClick={handleRead}>跟 Bunny 读</Button>
              <Button variant="ghost" size="lg" onClick={() => { const prev = (idx - 1 + list.length) % list.length; setIdx(prev); markCharacterExposed(list[prev].id); }}>上一个</Button>
              <Button variant="mint" size="lg" onClick={() => { const next = (idx + 1) % list.length; setIdx(next); markCharacterExposed(list[next].id); }}>下一个</Button>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            <Card variant="lavender" padding={20}>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--bunny-lavender-deep)' }}>汉字来历</div>
              <div style={{ marginTop: 10, fontSize: 25, fontWeight: 900, color: 'var(--bunny-ink)' }}>为什么是“{main.glyph}”？</div>
              <div style={{ marginTop: 10, fontSize: 16, lineHeight: 1.75, color: 'var(--bunny-soft-ink)' }}>{main.origin?.story ?? main.origin?.fact}</div>
              <div style={{ marginTop: 14, padding: 14, borderRadius: 16, background: 'rgba(255,255,255,.72)', fontSize: 14, fontWeight: 800, color: 'var(--bunny-ink)' }}>① 看“{main.glyph}” ② 听故事 ③ 跟读 ④ 回到绘本里{childName}会再遇见它</div>
            </Card>

            <Card variant="butter" padding={18}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Bunny pose="idle" size={84} />
                <div style={{ fontSize: 15, lineHeight: 1.65, fontWeight: 800, color: 'var(--bunny-amber-deep)' }}>Bunny 会先读一遍，再邀请你读一遍。读对以后，这个字会长大一级。</div>
              </div>
            </Card>

            <div style={{ minHeight: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--bunny-soft-ink)', marginBottom: 8 }}>接下来</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10 }}>{next3.map((ch) => <PreviewCard key={ch.id} ch={ch} onClick={() => { const target = list.indexOf(ch); if (target >= 0) { setIdx(target); markCharacterExposed(ch.id); } }} onPlay={(e) => { e.stopPropagation(); void playText(`${ch.glyph}, ${ch.pinyin[0]}`); markCharacterExposed(ch.id); }} />)}</div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

/**
 * 字库浏览模式 — 按 tier 分组显示全部 304 字
 */
function CharacterLibraryView({
  characters,
  mastery,
  onPick,
}: {
  characters: Character[];
  mastery: Record<string, { state: string }>;
  onPick: (c: Character) => void;
}) {
  const tiers = ['A', 'B', 'C', 'D', 'E'];
  const tierLabels: Record<string, string> = { A: '象形字', B: '会意字', C: '高频字', D: '一年级下', E: '一年级扩展' };
  return (
    <div style={{ maxWidth: 1180, margin: '0 auto' }}>
      <div style={{ fontSize: 14, color: 'var(--bunny-soft-ink)', marginBottom: 14 }}>
        点击任意字 → 回到学习模式
      </div>
      {tiers.map((t) => {
        const list = characters.filter((c) => c.tier === t);
        if (list.length === 0) return null;
        return (
          <div key={t} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 8, background: 'var(--bunny-mint)', color: 'var(--bunny-green-deep)', fontWeight: 900, fontSize: 13 }}>{t}</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: 'var(--bunny-ink)' }}>{tierLabels[t] || t}</span>
              <span style={{ fontSize: 13, color: 'var(--bunny-soft-ink)' }}>
                {list.filter((c) => mastery[c.id]?.state === 'mastered').length} / {list.length} 已掌握
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gap: 8 }}>
              {list.map((c) => {
                const mastered = mastery[c.id]?.state === 'mastered';
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onPick(c)}
                    title={`${c.glyph}（${c.pinyin[0]}）— ${c.meaning?.[0] ?? ''}`}
                    style={{
                      minHeight: 56,
                      borderRadius: 12,
                      background: mastered ? 'var(--bunny-mint)' : '#FFFFFF',
                      color: 'var(--bunny-ink)',
                      border: mastered ? '2px solid var(--bunny-mint-deep)' : '2px solid var(--bunny-border)',
                      fontSize: 28, fontWeight: 900,
                      cursor: 'pointer', fontFamily: 'inherit',
                      boxShadow: 'var(--shadow-soft)',
                    }}
                  >
                    {c.glyph}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CharacterMuseumPage;
