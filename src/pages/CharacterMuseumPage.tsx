import { useMemo, useState } from 'react';
import { TopBar } from '../components/shell/TopBar';
import { Bunny } from '../components/mascot/Bunny';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useContent } from '../runtime/ContentProvider';
import { useLearner } from '../runtime/LearnerProvider';
import { useAudio } from '../runtime/AudioProvider';
import type { Character } from '../domain/types';

const FALLBACK_CHARS: Character[] = [
  { id: 'char-shan', glyph: '山', pinyin: ['shān'], tone: 1, meaning: ['mountain'], strokes: 3, tier: 'A', type: 'pictograph', origin: { fact: '象形字，像三座山峰。', story: '高高的大山呀，就像三座尖尖的小帽子。' }, words: [], island: 'nature' },
  { id: 'char-shui', glyph: '水', pinyin: ['shuǐ'], tone: 3, meaning: ['water'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '象形字，像流水的样子。', story: '小水滴呀，弯弯地流下来。' }, words: [], island: 'nature' },
  { id: 'char-mu', glyph: '木', pinyin: ['mù'], tone: 4, meaning: ['tree'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '象形字，像一棵树。', story: '一棵树呀，有根有干有叶子。' }, words: [], island: 'plants' },
  { id: 'char-ri', glyph: '日', pinyin: ['rì'], tone: 4, meaning: ['sun'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '象形字，像太阳的形状。', story: '暖暖的小太阳呀，圆圆的。' }, words: [], island: 'nature' },
  { id: 'char-yue', glyph: '月', pinyin: ['yuè'], tone: 4, meaning: ['moon'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '象形字，像弯弯的月亮。', story: '弯弯的小月亮呀，像小船。' }, words: [], island: 'nature' },
] as Character[];

function artPath(ch: Character): string {
  const slug = ch.id.replace(/^char-/, '');
  return ch.tier === 'B'
    ? `/assets/art/l1/tier-b/picto-${slug}.png`
    : `/assets/art/l1/tier-a/picto-${slug}.jpg`;
}

function CharArt({ ch, size = 280 }: { ch: Character; size?: number }) {
  const src = artPath(ch);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 30,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4E6 100%)',
        border: '2px solid var(--bunny-border)',
        boxShadow: 'var(--shadow-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={src}
        alt={`${ch.glyph} 插画`}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(event) => {
          event.currentTarget.style.display = 'none';
          const fallback = event.currentTarget.parentElement?.querySelector('[data-fallback]') as HTMLElement | null;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <div
        data-fallback
        style={{ display: 'none', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.62, fontWeight: 900, color: 'var(--bunny-ink)' }}
      >
        {ch.glyph}
      </div>
    </div>
  );
}

function PreviewCard({ ch, onClick, active }: { ch: Character; onClick: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minWidth: 0,
        minHeight: 148,
        border: active ? '3px solid var(--bunny-red)' : '2px solid var(--bunny-border)',
        background: active ? 'var(--bunny-butter)' : '#FFFFFF',
        borderRadius: 20,
        padding: 10,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'inherit',
        boxShadow: active ? 'var(--shadow-pop)' : 'var(--shadow-soft)',
      }}
    >
      <img src={artPath(ch)} alt="" aria-hidden style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 14 }} />
      <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--bunny-ink)' }}>{ch.glyph}</div>
      <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--bunny-soft-ink)' }}>{ch.pinyin[0]}</div>
    </button>
  );
}

export function CharacterMuseumPage() {
  const { characters } = useContent();
  const { markCharacterExposed } = useLearner();
  const { playText } = useAudio();

  const list: Character[] = useMemo(
    () => (characters.length > 0 ? characters.slice(0, 8) : FALLBACK_CHARS),
    [characters],
  );

  const [idx, setIdx] = useState(0);
  const main = list[idx] ?? list[0];
  const next3 = useMemo(() => {
    const out: Character[] = [];
    for (let i = 1; i <= 3; i++) {
      const c = list[(idx + i) % list.length];
      if (c) out.push(c);
    }
    return out;
  }, [list, idx]);

  const handleNext = () => {
    setIdx((i) => (i + 1) % list.length);
    const next = list[(idx + 1) % list.length];
    if (next) markCharacterExposed(next.id);
  };

  const onReadWithBunny = () => {
    void playText(`${main.glyph}，${main.pinyin[0]}`);
    markCharacterExposed(main.id);
  };

  return (
    <div className="page-character-museum" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <TopBar title="汉字花园" subtitle={`今天认识 ${next3.length + 1} 个字`} />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: 'minmax(460px, 1.05fr) minmax(360px, .95fr)',
          gap: 20,
          padding: 'clamp(14px, 1.8vw, 24px) clamp(16px, 2.2vw, 32px) 104px',
          overflow: 'auto',
        }}
      >
        <Card variant="soft" padding={24} style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--bunny-soft-ink)' }}>字宝宝 · {main.tier ?? 'A'} 阶</div>
            <div style={{ padding: '7px 12px', borderRadius: 999, background: 'var(--bunny-mint)', fontSize: 13, fontWeight: 800, color: 'var(--bunny-green-deep)', whiteSpace: 'nowrap' }}>{main.meaning?.[0] ?? '字'}</div>
          </div>

          <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22, flexWrap: 'wrap', padding: '10px 0' }}>
            <CharArt ch={main} size={Math.min(320, 32 * 10)} />
            <div style={{ minWidth: 160, textAlign: 'left' }}>
              <div style={{ fontSize: 'clamp(48px, 5vw, 76px)', lineHeight: 1, fontWeight: 900, color: 'var(--bunny-ink)' }}>{main.glyph}</div>
              <div style={{ marginTop: 12, fontSize: 'clamp(24px, 2.4vw, 34px)', fontWeight: 900, color: 'var(--bunny-blue-deep)' }}>{main.pinyin.join(' · ')}</div>
              <div style={{ marginTop: 12, fontSize: 15, color: 'var(--bunny-soft-ink)', lineHeight: 1.6 }}>笔画：{main.strokes} 画<br />造字：{main.type === 'pictograph' ? '象形字' : '会意 / 形声类'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Button variant="red" size="lg" leading="🐰" onClick={onReadWithBunny}>跟 Bunny 读</Button>
            <Button variant="mint" size="lg" leading="→" onClick={handleNext}>下一个</Button>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          <Card variant="lavender" padding={20} style={{ flex: '0 0 auto' }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--bunny-lavender-deep)' }}>汉字来历</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(150px, .9fr) 1.1fr', gap: 16, marginTop: 10, alignItems: 'center' }}>
              <img src={artPath(main)} alt={`${main.glyph} 场景图`} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 18, background: '#fff' }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--bunny-ink)' }}>为什么是“{main.glyph}”？</div>
                <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.65, color: 'var(--bunny-soft-ink)' }}>{main.origin?.story ?? main.origin?.fact ?? '这个字宝宝，等你来发现。'}</div>
                <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 14, background: 'rgba(255,255,255,.72)', fontSize: 13, fontWeight: 800, color: 'var(--bunny-ink)' }}>先看图 → 再听故事 → 最后自己说一遍</div>
              </div>
            </div>
          </Card>

          <Card variant="butter" padding={16} style={{ flex: '0 0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Bunny pose="idle" size={76} />
              <div style={{ fontSize: 15, lineHeight: 1.55, fontWeight: 800, color: 'var(--bunny-amber-deep)' }}>{main.glyph} 一共 {main.strokes} 画。Bunny 会先读给你听，再邀请你读。</div>
            </div>
          </Card>

          <div style={{ minHeight: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--bunny-soft-ink)', marginBottom: 9 }}>接下来认识</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
              {next3.map((ch) => (
                <PreviewCard
                  key={ch.id}
                  ch={ch}
                  onClick={() => {
                    const targetIdx = list.indexOf(ch);
                    if (targetIdx >= 0) {
                      setIdx(targetIdx);
                      markCharacterExposed(ch.id);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterMuseumPage;
