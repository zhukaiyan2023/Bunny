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
  { id: 'char-shan', glyph: '山', pinyin: ['shān'], tone: 1, meaning: ['山峰'], strokes: 3, tier: 'A', type: 'pictograph', origin: { fact: '象形字，像三座山峰。', story: '高高的山峰，就像一排起伏的山。' }, words: ['大山', '山上'], island: 'nature' },
  { id: 'char-shui', glyph: '水', pinyin: ['shuǐ'], tone: 3, meaning: ['水流'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '象形字，表示流动的水。', story: '水会弯弯曲曲地流动，所以古人画出了水流的样子。' }, words: ['河水', '喝水'], island: 'nature' },
  { id: 'char-mu', glyph: '木', pinyin: ['mù'], tone: 4, meaning: ['树木'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '象形字，像一棵有根、有干、有枝的树。', story: '古人看到树，把树根、树干和树枝画下来，慢慢就变成了“木”。' }, words: ['木头', '树木'], island: 'plants' },
  { id: 'char-ri', glyph: '日', pinyin: ['rì'], tone: 4, meaning: ['太阳'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '象形字，本义与太阳有关。', story: '抬头看太阳，古人把它画下来，后来慢慢写成“日”。' }, words: ['日出', '生日'], island: 'nature' },
  { id: 'char-yue', glyph: '月', pinyin: ['yuè'], tone: 4, meaning: ['月亮'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '象形字，像弯弯的月亮。', story: '夜空里的月亮弯弯的，古人就把它画下来。' }, words: ['月亮', '明月'], island: 'nature' },
] as Character[];

function teachingArtPath(ch: Character): string {
  const slug = ch.id.replace(/^char-/, '');
  const supported = new Set(['shan', 'shui', 'mu', 'ri', 'yue']);
  if (supported.has(slug)) return `/assets/art/l1/teaching/teach-${slug}.svg`;
  return ch.tier === 'B'
    ? `/assets/art/l1/tier-b/picto-${slug}.png`
    : `/assets/art/l1/tier-a/picto-${slug}.jpg`;
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
          event.currentTarget.src = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" rx="24" fill="#FFF4E6"/><text x="200" y="270" text-anchor="middle" font-size="220" font-family="PingFang SC,Microsoft YaHei,sans-serif" font-weight="900" fill="#2C2C54">${ch.glyph}</text></svg>`)}`;
        }}
      />
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
      }}
    >
      <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--bunny-ink)', lineHeight: 1 }}>{ch.glyph}</div>
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--bunny-blue-deep)' }}>{ch.pinyin[0]}</div>
      <div style={{ fontSize: 11, color: 'var(--bunny-soft-ink)' }}>{ch.meaning?.[0] ?? ''}</div>
    </button>
  );
}

export function CharacterMuseumPage() {
  const { characters } = useContent();
  const { markCharacterExposed } = useLearner();
  const { playText } = useAudio();

  const list = useMemo<Character[]>(() => {
    const source = characters.length > 0 ? characters : FALLBACK_CHARS;
    const preferred = ['char-shan', 'char-shui', 'char-mu', 'char-ri', 'char-yue'];
    const ordered = preferred.map((id) => source.find((c) => c.id === id)).filter(Boolean) as Character[];
    return ordered.length >= 5 ? ordered.slice(0, 8) : source.slice(0, 8);
  }, [characters]);

  const [idx, setIdx] = useState(0);
  const main = list[idx] ?? list[0] ?? FALLBACK_CHARS[0];
  const next3 = useMemo(() => [1, 2, 3].map((offset) => list[(idx + offset) % list.length]).filter(Boolean), [idx, list]);

  const handleRead = () => {
    void playText(`${main.glyph}，${main.pinyin[0]}`);
    markCharacterExposed(main.id);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <TopBar title="汉字花园" subtitle="先认识字，再发现这个字为什么这样写" />

      <div style={{ flex: 1, minHeight: 0, padding: '18px 24px 104px', overflow: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(560px, 1.2fr) minmax(380px, .8fr)', gap: 20, minHeight: '100%' }}>
          <Card variant="soft" padding={24} style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--bunny-soft-ink)' }}>汉字本体 · 第一视觉元素</div>
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
              <Button variant="mint" size="lg" onClick={() => { const next = (idx + 1) % list.length; setIdx(next); markCharacterExposed(list[next].id); }}>下一个</Button>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            <Card variant="lavender" padding={20}>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--bunny-lavender-deep)' }}>汉字来历</div>
              <div style={{ marginTop: 10, fontSize: 25, fontWeight: 900, color: 'var(--bunny-ink)' }}>为什么是“{main.glyph}”？</div>
              <div style={{ marginTop: 10, fontSize: 16, lineHeight: 1.75, color: 'var(--bunny-soft-ink)' }}>{main.origin?.story ?? main.origin?.fact}</div>
              <div style={{ marginTop: 14, padding: 14, borderRadius: 16, background: 'rgba(255,255,255,.72)', fontSize: 14, fontWeight: 800, color: 'var(--bunny-ink)' }}>① 看“{main.glyph}” ② 听故事 ③ 跟读 ④ 回到绘本里再遇见它</div>
            </Card>

            <Card variant="butter" padding={18}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Bunny pose="idle" size={84} />
                <div style={{ fontSize: 15, lineHeight: 1.65, fontWeight: 800, color: 'var(--bunny-amber-deep)' }}>Bunny 会先读一遍，再邀请你读一遍。读对以后，这个字会长大一级。</div>
              </div>
            </Card>

            <div style={{ minHeight: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--bunny-soft-ink)', marginBottom: 8 }}>接下来</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10 }}>{next3.map((ch) => <PreviewCard key={ch.id} ch={ch} onClick={() => { const target = list.indexOf(ch); if (target >= 0) { setIdx(target); markCharacterExposed(ch.id); } }} />)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterMuseumPage;
