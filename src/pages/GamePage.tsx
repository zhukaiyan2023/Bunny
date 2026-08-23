import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/shell/TopBar';
import { Bunny } from '../components/mascot/Bunny';
import { Button } from '../components/ui/Button';
import { useContent } from '../runtime/ContentProvider';
import { useLearner } from '../runtime/LearnerProvider';
import { useAudio } from '../runtime/AudioProvider';
import type { Character } from '../domain/types';

/**
 * GamePage · 妙妙的游戏（/game）
 *
 * 两种游戏模式：
 *   - find-char: 看到字/听到音 → 从 3 张字卡里选正确的（森林找字）
 *   - match-meaning: 看到释义 → 从 3 张字卡里选正确的（看意思找字）
 *
 * 设计：
 *   - 池子：妙妙没掌握的 8 字 + 已掌握的 4 字（干扰）
 *   - 计分：正确 +1 颗星，错误 -1 颗星（最低 0）
 *   - 12 关结束：进入"通关页"，告诉妙妙她的成绩 + 推荐下一个游戏
 *
 * 数据流：
 *   - markCharacterCorrect → mastery 升级（用于 assessment 和 daily plan）
 *   - playText → 鼓励 cue
 */

const FALLBACK_CHARS: Character[] = [
  { id: 'char-shan', glyph: '山', pinyin: ['shān'], tone: 1, meaning: ['山'], strokes: 3, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' },
  { id: 'char-shui', glyph: '水', pinyin: ['shuǐ'], tone: 3, meaning: ['水'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' },
  { id: 'char-mu', glyph: '木', pinyin: ['mù'], tone: 4, meaning: ['树木'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'plants' },
  { id: 'char-ri', glyph: '日', pinyin: ['rì'], tone: 4, meaning: ['太阳'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' },
  { id: 'char-yue', glyph: '月', pinyin: ['yuè'], tone: 4, meaning: ['月亮'], strokes: 4, tier: 'A', type: 'pictograph', origin: { fact: '', story: '' }, words: [], island: 'nature' },
];

function artPath(ch: Character): string {
  const slug = ch.id.replace(/^char-/, '');
  if (ch.tier === 'B') return `/assets/art/l1/tier-b/picto-${slug}.jpg`;
  if (ch.tier === 'C') return `/assets/art/l1/tier-c/picto-${slug}.jpg`;
  if (ch.tier === 'D') return `/assets/art/l1/tier-d/picto-${slug}.jpg`;
  if (ch.tier === 'E') return `/assets/art/l1/tier-e/picto-${slug}.jpg`;
  return `/assets/art/l1/tier-a/picto-${slug}.jpg`;
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
        transition: 'transform 0.2s ease',
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

type Phase = 'play' | 'result';
type GameMode = 'find-char' | 'match-meaning';

const MODE_LABEL: Record<GameMode, { title: string; sub: string; emoji: string }> = {
  'find-char': { title: '森林找字', sub: '听音选字 · 看图选字', emoji: '🔍' },
  'match-meaning': { title: '看意找字', sub: '看解释找对应的字', emoji: '💡' },
};

export function GamePage() {
  const navigate = useNavigate();
  const { characters } = useContent();
  const { profile, markCharacterCorrect } = useLearner();
  const { playText } = useAudio();
  const childName = profile.displayName || '妙妙';
  const [mode, setMode] = useState<GameMode>('find-char');

  /**
   * 妙妙的字池：
   *   - 优先挑妙妙还没掌握的（学习入口）
   *   - 加上 4 个她已经掌握的字作为干扰（巩固）
   */
  const pool = useMemo(() => {
    if (characters.length === 0) return FALLBACK_CHARS;
    const masteredSet = new Set(
      Object.entries(profile.mastery)
        .filter(([, m]) => m.state === 'mastered')
        .map(([id]) => id),
    );
    const unknown = characters.filter((c) => !masteredSet.has(c.id));
    const review = characters.filter((c) => masteredSet.has(c.id)).slice(0, 4);
    const merged = [...unknown, ...review];
    return merged.length >= 6 ? merged.slice(0, 12) : characters.slice(0, 12);
  }, [characters, profile.mastery]);

  // match-meaning 模式：只挑选有 meaning 的字
  const meaningPool = useMemo(() => {
    return pool.filter((c) => c.meaning && c.meaning.length > 0 && c.meaning[0]);
  }, [pool]);

  const effectivePool = mode === 'match-meaning' && meaningPool.length >= 6 ? meaningPool : pool;

  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<{ pickId: string; correct: boolean } | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [phase, setPhase] = useState<Phase>('play');
  // 用 ref 计数 +1 飘字动画
  const [correctBurst, setCorrectBurst] = useState<number>(0);

  const totalRounds = Math.max(effectivePool.length, 1);
  const currentChar = effectivePool[round % effectivePool.length] ?? effectivePool[0];

  const options = useMemo(() => {
    const distractors = effectivePool.filter((c) => c.id !== currentChar?.id).slice(0, 2);
    const result = currentChar ? [currentChar, ...distractors] : distractors;
    return [...result].sort(() => Math.random() - 0.5);
  }, [pool, currentChar]);

  useEffect(() => setFeedback(null), [round]);

  // 当 round 走到尽头，进入结算
  useEffect(() => {
    if (round >= totalRounds && phase === 'play') {
      window.setTimeout(() => setPhase('result'), 600);
    }
  }, [round, totalRounds, phase]);

  // 每题自动念出这个字的读音（Web Speech API）
  useEffect(() => {
    if (phase !== 'play' || !currentChar) return;
    const t = window.setTimeout(() => {
      playText(`${currentChar.glyph}, ${currentChar.pinyin[0]}`).catch(() => {});
    }, 480);
    return () => window.clearTimeout(t);
  }, [phase, round, currentChar, playText]);

  const handleReplayQuestion = () => {
    if (!currentChar) return;
    void playText(`${currentChar.glyph}, ${currentChar.pinyin[0]}`).catch(() => {});
  };

  const handlePick = (ch: Character) => {
    const correct = ch.id === currentChar?.id;
    setFeedback({ pickId: ch.id, correct });
    if (correct) {
      markCharacterCorrect(ch.id);
      setScore((s) => s + 1);
      setCorrectCount((c) => c + 1);
      setCorrectBurst((n) => n + 1); // 触发 +1 飘字
      void playText(`${childName}太棒了`);
      window.setTimeout(() => setRound((r) => r + 1), 900);
    } else {
      setScore((s) => Math.max(0, s - 1));
      setWrongCount((c) => c + 1);
      void playText('再点一次');
      window.setTimeout(() => setFeedback(null), 950);
    }
  };

  const handleReplay = () => {
    setRound(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setFeedback(null);
    setPhase('play');
  };

  // ===== 结算页 =====
  if (phase === 'result') {
    const accuracy = correctCount + wrongCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <TopBar title="冒险乐园" subtitle={`${childName} · 通关啦`} />
        <main style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 48px 104px' }}>
          <div style={{
            maxWidth: 640, width: '100%',
            background: '#FFFFFF', borderRadius: 32, padding: 40,
            border: '2px solid var(--bunny-border)', boxShadow: 'var(--shadow-pop)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          }}>
            <Bunny pose="cheering" size={180} />
            <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--bunny-ink)' }}>
              {accuracy >= 80 ? '太棒啦！' : accuracy >= 50 ? '做得不错！' : '加油！'}
            </div>
            <div style={{ fontSize: 16, color: 'var(--bunny-soft-ink)', textAlign: 'center' }}>
              {childName}答对了 <b style={{ color: 'var(--bunny-green-deep)' }}>{correctCount}</b> 题，错了 <b style={{ color: 'var(--bunny-red)' }}>{wrongCount}</b> 题
            </div>
            <div style={{ display: 'flex', gap: 6, fontSize: 32 }}>
              {Array.from({ length: totalRounds }).map((_, i) => (
                <span key={i} style={{ filter: i < score ? 'none' : 'grayscale(1) opacity(0.3)' }}>
                  ⭐
                </span>
              ))}
            </div>
            <div style={{ fontSize: 56, fontWeight: 900, color: 'var(--bunny-green-deep)', lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: 14, color: 'var(--bunny-soft-ink)' }}>总积分（满分 {totalRounds}）</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <Button variant="red" size="lg" leading="🎮" onClick={handleReplay}>再玩一次</Button>
              <Button variant="mint" size="lg" leading="📖" onClick={() => navigate('/story')}>读绘本</Button>
              <Button variant="lavender" size="lg" leading="🏠" onClick={() => navigate('/')}>回首页</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ===== 游戏页 =====
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <TopBar
        title="冒险乐园"
        subtitle={`${childName} · ${MODE_LABEL[mode].title} · 第 ${Math.min(round + 1, totalRounds)} / ${totalRounds} 关`}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* 模式切换 */}
            <button
              type="button"
              onClick={() => {
                setMode((m) => (m === 'find-char' ? 'match-meaning' : 'find-char'));
                setRound(0);
                setScore(0);
                setCorrectCount(0);
                setWrongCount(0);
                setFeedback(null);
              }}
              title="切换游戏模式"
              style={{
                padding: '6px 14px', borderRadius: 999,
                background: 'var(--bunny-butter)', color: 'var(--bunny-amber-deep)',
                fontWeight: 900, fontSize: 13, border: '2px solid var(--bunny-amber-deep)',
                cursor: 'pointer', fontFamily: 'inherit', boxShadow: 'var(--shadow-soft)',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              <span>{MODE_LABEL[mode].emoji}</span> 换一种
            </button>
            {/* 积分 */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 14px', borderRadius: 999,
              background: '#FFFFFF', border: '2px solid var(--bunny-border)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--bunny-soft-ink)' }}>⭐</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--bunny-green-deep)', lineHeight: 1 }}>{score}</div>
            </div>
          </div>
        }
      />

      <main style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateRows: 'auto minmax(230px, 1fr) auto', gap: 14, padding: 'clamp(14px, 1.8vw, 24px) clamp(16px, 2.2vw, 32px) 104px', overflow: 'auto' }}>
        <section style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px', borderRadius: 22, background: '#fff', border: '2px solid var(--bunny-border)', boxShadow: 'var(--shadow-soft)', width: 'fit-content', maxWidth: '100%' }}>
          <Bunny pose="idle" size={88} />
          <div style={{ minWidth: 0, fontSize: 'clamp(20px, 1.9vw, 28px)', fontWeight: 900, color: 'var(--bunny-ink)' }}>
            {mode === 'find-char' ? (
              <>哪个是「<span style={{ color: 'var(--bunny-red)' }}>{currentChar?.glyph ?? '?'}</span>」？</>
            ) : (
              <>「<span style={{ color: 'var(--bunny-red)' }}>{currentChar?.meaning?.[0] ?? currentChar?.glyph ?? '?'}</span>」是哪个字？</>
            )}
          </div>
          <button
            type="button"
            onClick={handleReplayQuestion}
            title="再听一次"
            aria-label="再听一次"
            style={{
              minWidth: 56, minHeight: 56,
              borderRadius: '50%',
              background: 'var(--bunny-butter)',
              border: '3px solid var(--bunny-amber-deep)',
              fontSize: 26,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-pop)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'inherit',
            }}
          >
            🔊
          </button>
        </section>

        <section style={{ position: 'relative', minHeight: 0, overflow: 'hidden', borderRadius: 28, border: '2px solid var(--bunny-border)', boxShadow: 'var(--shadow-soft)' }}>
          <img src="/assets/art/l0/backgrounds/bg-forest-light.jpg" alt="森林场景" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,.04), rgba(21,50,75,.22))' }} />
          <div style={{ position: 'absolute', left: 20, bottom: 18, padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,.92)', color: 'var(--bunny-green-deep)', fontSize: 13, fontWeight: 900 }}>
            {mode === 'find-char' ? '找到汉字，就能继续探险' : '读懂意思，再找出字'}
          </div>
          <div style={{ position: 'absolute', right: 26, bottom: 12 }}><Bunny pose="cheering" size={150} /></div>
          {/* +1 ⭐ 飘字动画 */}
          {correctBurst > 0 && (
            <span key={correctBurst} className="game-correct-burst">+1 ⭐</span>
          )}
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
      <style>{`
        @keyframes correctBurst {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          20% { transform: translate(-50%, -70%) scale(1.4); opacity: 1; }
          80% { transform: translate(-50%, -100%) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, -140%) scale(0.9); opacity: 0; }
        }
        .game-correct-burst {
          position: absolute;
          top: 50%; left: 50%;
          font-size: 56px;
          font-weight: 900;
          color: var(--bunny-yellow);
          text-shadow: 0 4px 0 rgba(0,0,0,0.18), 0 0 14px rgba(255,209,92,.55);
          pointer-events: none;
          animation: correctBurst 0.95s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
}

export default GamePage;