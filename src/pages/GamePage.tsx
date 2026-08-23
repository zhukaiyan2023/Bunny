import { useEffect, useMemo, useState } from 'react';
import { TopBar } from '../components/shell/TopBar';
import { Bunny } from '../components/mascot/Bunny';
import { useContent } from '../runtime/ContentProvider';
import { useLearner } from '../runtime/LearnerProvider';
import { useAudio } from '../runtime/AudioProvider';
import type { Character } from '../domain/types';

const FALLBACK_CHARS: Character[] = [
  { id: 'char-shan', glyph: '山', pinyin: ['shān'], tone: 1, meaning: ['山'], strokes: 3, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' },
  { id: 'char-shui', glyph: '水', pinyin: ['shuǐ'], tone: 3, meaning: ['水'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' },
  { id: 'char-mu', glyph: '木', pinyin: ['mù'], tone: 4, meaning: ['树木'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'plants' },
  { id: 'char-ri', glyph: '日', pinyin: ['rì'], tone: 4, meaning: ['太阳'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' },
  { id: 'char-yue', glyph: '月', pinyin: ['yuè'], tone: 4, meaning: ['月亮'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' },
];

function artPath(ch: Character): string {
  const slug = ch.id.replace(/^char-/, '');
  return ch.tier === 'B' ? `/assets/art/l1/tier-b/picto-${slug}.png` : `/assets/art/l1/tier-a/picto-${slug}.jpg`;
}

function CharCard({ ch, state, onClick }: { ch: Character; state: 'idle' | 'correct' | 'wrong'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 'clamp(130px, 12vw, 170px)',
        height: 'clamp(140px, 16vh, 180px)',
        borderRadius: 24,
        background: state === 'correct' ? 'var(--bunny-mint)' : state === 'wrong' ? '#FFE4E8' : '#FFFFFF',
        border: state === 'correct' ? '3px solid var(--bunny-mint-deep)' : state === 'wrong' ? '3px solid var(--bunny-red)' : '2px solid var(--bunny-border)',
        boxShadow: state === 'correct' ? 'var(--shadow-pop)' : 'var(--shadow-soft)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transform: state === 'correct' ? 'scale(1.04)' : 'scale(1)',
      }}
    >
      {state === 'correct' ? (
        <div style={{ fontSize: 58 }}>✓</div>
      ) : (
        <img src={artPath(ch)} alt="" aria-hidden style={{ width: 78, height: 78, objectFit: 'cover', borderRadius: 14 }} onError={(event) => { event.currentTarget.style.display = 'none'; }} />
      )}
      <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--bunny-ink)', lineHeight: 1 }}>{ch.glyph}</div>
      <div style={{ fontSize: 12, color: 'var(--bunny-soft-ink)', fontWeight: 800 }}>{ch.pinyin[0]}</div>
    </button>
  );
}

export function GamePage() {
  const { characters } = useContent();
  const { markCharacterCorrect } = useLearner();
  const { playText } = useAudio();

  const pool = useMemo(() => (characters.length > 0 ? characters.slice(0, 12) : FALLBACK_CHARS), [characters]);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<{ pickId: string; correct: boolean } | null>(null);
  const currentChar = pool[round % pool.length] ?? pool[0];

  const options = useMemo(() => {
    const distractors = pool.filter((c) => c.id !== currentChar?.id).slice(0, 2);
    const result = currentChar ? [currentChar, ...distractors] : distractors;
    return [...result].sort(() => Math.random() - 0.5);
  }, [pool, currentChar]);

  useEffect(() => setFeedback(null), [round]);

  const handlePick = (ch: Character) => {
    const correct = ch.id === currentChar?.id;
    setFeedback({ pickId: ch.id, correct });
    if (correct) {
      markCharacterCorrect(ch.id);
      void playText('太棒了');
      window.setTimeout(() => setRound((r) => r + 1), 900);
    } else {
      void playText('再点一次');
      window.setTimeout(() => setFeedback(null), 950);
    }
  };

  const totalRounds = Math.max(pool.length, 1);

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <TopBar title="冒险乐园" subtitle={`森林找字 · 第 ${Math.min(round + 1, totalRounds)} / ${totalRounds} 关`} />

      <main style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateRows: 'auto minmax(230px, 1fr) auto', gap: 14, padding: 'clamp(14px, 1.8vw, 24px) clamp(16px, 2.2vw, 32px) 104px', overflow: 'auto' }}>
        <section style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px', borderRadius: 22, background: '#fff', border: '2px solid var(--bunny-border)', boxShadow: 'var(--shadow-soft)', width: 'fit-content', maxWidth: '100%' }}>
          <Bunny pose="idle" size={88} />
          <div style={{ minWidth: 0, fontSize: 'clamp(20px, 1.9vw, 28px)', fontWeight: 900, color: 'var(--bunny-ink)' }}>
            哪个是「<span style={{ color: 'var(--bunny-red)' }}>{currentChar?.glyph ?? '?'}</span>」？
          </div>
        </section>

        <section style={{ position: 'relative', minHeight: 0, overflow: 'hidden', borderRadius: 28, border: '2px solid var(--bunny-border)', boxShadow: 'var(--shadow-soft)' }}>
          <img src="/assets/art/l0/backgrounds/bg-forest-light.jpg" alt="森林场景" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(21,50,75,.22))' }} />
          <div style={{ position: 'absolute', left: 20, bottom: 18, padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,.92)', color: 'var(--bunny-green-deep)', fontSize: 13, fontWeight: 900 }}>找到汉字，就能继续探险</div>
          <div style={{ position: 'absolute', right: 26, bottom: 12 }}><Bunny pose="cheering" size={150} /></div>
        </section>

        <section style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', gap: '12px clamp(14px, 2vw, 30px)' }}>
          {options.map((ch) => {
            const active = feedback?.pickId === ch.id;
            return (
              <div key={ch.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <CharCard ch={ch} state={active ? (feedback?.correct ? 'correct' : 'wrong') : 'idle'} onClick={() => handlePick(ch)} />
                {active && <div style={{ fontSize: 13, fontWeight: 900, color: feedback?.correct ? 'var(--bunny-green-deep)' : 'var(--bunny-soft-ink)' }}>{feedback?.correct ? '答对啦！' : '再试一次'}</div>}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default GamePage;
