import { useEffect, useMemo, useState } from 'react';
import { TopBar } from '../components/shell/TopBar';
import { Bunny } from '../components/mascot/Bunny';
import { useContent } from '../runtime/ContentProvider';
import { useLearner } from '../runtime/LearnerProvider';
import { useAudio } from '../runtime/AudioProvider';
import type { Character } from '../domain/types';

const FALLBACK_CHARS: Character[] = [
  { id: 'c1', glyph: '山', pinyin: ['shān'], tone: 1, meaning: ['mountain'], strokes: 3, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' },
  { id: 'c2', glyph: '水', pinyin: ['shuǐ'], tone: 3, meaning: ['water'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' },
  { id: 'c3', glyph: '木', pinyin: ['mù'], tone: 4, meaning: ['tree'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'plants' },
  { id: 'c4', glyph: '日', pinyin: ['rì'], tone: 4, meaning: ['sun'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' },
  { id: 'c5', glyph: '月', pinyin: ['yuè'], tone: 4, meaning: ['moon'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' },
  { id: 'c6', glyph: '花', pinyin: ['huā'], tone: 1, meaning: ['flower'], strokes: 7, tier: 'B', type: 'compound', origin: { fact: '', story: '' }, words: [], island: 'plants' },
] as Character[];

function CharCard({
  ch,
  state,
  onClick,
}: {
  ch: Character;
  state: 'idle' | 'correct' | 'wrong';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 160,
        height: 160,
        borderRadius: 32,
        background: state === 'correct' ? 'var(--bunny-mint)' : '#FFFFFF',
        border: state === 'correct' ? '3px solid var(--bunny-mint-deep)' : '2px solid var(--bunny-border)',
        boxShadow: state === 'correct' ? 'var(--shadow-pop)' : 'var(--shadow-soft)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'transform 0.2s ease',
        transform: state === 'correct' ? 'scale(1.04)' : 'scale(1)',
      }}
    >
      {state === 'correct' ? (
        <div style={{ fontSize: 72 }}>✅</div>
      ) : (
        <>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: 'var(--bunny-pink-deep)',
              lineHeight: 1,
            }}
          >
            {ch.glyph}
          </div>
          <div style={{ fontSize: 14, color: 'var(--bunny-soft-ink)', fontWeight: 700 }}>
            {ch.pinyin[0]}
          </div>
        </>
      )}
    </button>
  );
}

export function GamePage() {
  const { characters } = useContent();
  const { markCharacterCorrect, markCharacterExposed } = useLearner();
  const { playText } = useAudio();

  const pool: Character[] = useMemo(
    () => (characters.length > 0 ? characters.slice(0, 12) : FALLBACK_CHARS),
    [characters],
  );

  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<{ pickId: string; correct: boolean } | null>(null);

  const currentChar = pool[round % pool.length] ?? pool[0];
  // 三个选项：当前正确 + 两个不同的干扰
  const options = useMemo(() => {
    const distractors = pool.filter((c) => c.id !== currentChar?.id);
    const pick = distractors.slice(0, 2);
    const result = [currentChar, ...pick];
    // 打乱
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }, [pool, currentChar]);

  useEffect(() => {
    setFeedback(null);
  }, [round]);

  const handlePick = (ch: Character) => {
    const correct = ch.id === currentChar?.id;
    setFeedback({ pickId: ch.id, correct });
    if (correct) {
      markCharacterCorrect(ch.id);
      void playText('太棒了');
      setTimeout(() => {
        setRound((r) => r + 1);
      }, 1000);
    } else {
      void playText('再点一次');
      setTimeout(() => setFeedback(null), 1100);
    }
  };

  const totalRounds = pool.length;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TopBar
        title="玩游戏"
        subtitle={`找一找 · 第 ${Math.min(round + 1, totalRounds)} / ${totalRounds} 关`}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 32px',
          gap: 20,
          minHeight: 0,
        }}
      >
        {/* Bunny prompt */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: '#FFFFFF',
            border: '2px solid var(--bunny-border)',
            borderRadius: 32,
            padding: '14px 24px',
            boxShadow: 'var(--shadow-soft)',
            maxWidth: 720,
          }}
        >
          <Bunny pose="idle" size={96} />
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--bunny-ink)' }}>
            哪个是「
            <span style={{ color: 'var(--bunny-red)', fontSize: 28 }}>{currentChar?.glyph ?? '?'}</span>
            」呀？
          </div>
        </div>

        {/* Scene illustration */}
        <div
          style={{
            flex: 1,
            borderRadius: 32,
            background: 'linear-gradient(180deg, #C6F0D8 0%, #B5DEFF 100%)',
            border: '2px solid var(--bunny-border)',
            boxShadow: 'var(--shadow-soft)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ fontSize: 160, opacity: 0.9 }}>🌲🌳🦌🦋</div>
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              right: 24,
              fontSize: 14,
              color: 'var(--bunny-green-deep)',
              fontWeight: 700,
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 999,
              padding: '6px 14px',
            }}
          >
            暖暖的森林呀
          </div>
        </div>

        {/* Character options */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 32,
            paddingBottom: 8,
          }}
        >
          {options.map((ch) => {
            const isFeedback = feedback?.pickId === ch.id;
            return (
              <div key={ch.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <CharCard
                  ch={ch}
                  state={isFeedback ? (feedback?.correct ? 'correct' : 'wrong') : 'idle'}
                  onClick={() => handlePick(ch)}
                />
                {isFeedback && feedback?.correct && (
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: 'var(--bunny-green-deep)',
                    }}
                  >
                    太棒了！🌟
                  </div>
                )}
                {isFeedback && !feedback?.correct && (
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: 'var(--bunny-soft-ink)',
                    }}
                  >
                    Bunny 没听清，再点一次 🐰
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GamePage;
