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
  {
    id: 'char-shan',
    glyph: '山',
    pinyin: ['shān'],
    tone: 1,
    meaning: ['mountain'],
    strokes: 3,
    tier: 'A',
    type: 'pictograph',
    origin: { fact: '象形字，像三座山峰。', story: '高高的大山呀，就像三座尖尖的小帽子。' },
    words: [],
    island: 'nature',
  },
  {
    id: 'char-shui',
    glyph: '水',
    pinyin: ['shuǐ'],
    tone: 3,
    meaning: ['water'],
    strokes: 4,
    tier: 'A',
    type: 'pictograph',
    origin: { fact: '象形字，像流水的样子。', story: '小水滴呀，弯弯地流下来。' },
    words: [],
    island: 'nature',
  },
  {
    id: 'char-mu',
    glyph: '木',
    pinyin: ['mù'],
    tone: 4,
    meaning: ['tree'],
    strokes: 4,
    tier: 'A',
    type: 'pictograph',
    origin: { fact: '象形字，像一棵树。', story: '一棵树呀，有根有干有叶子。' },
    words: [],
    island: 'plants',
  },
  {
    id: 'char-ri',
    glyph: '日',
    pinyin: ['rì'],
    tone: 4,
    meaning: ['sun'],
    strokes: 4,
    tier: 'A',
    type: 'pictograph',
    origin: { fact: '象形字，像太阳的形状。', story: '暖暖的小太阳呀，圆圆的。' },
    words: [],
    island: 'nature',
  },
  {
    id: 'char-yue',
    glyph: '月',
    pinyin: ['yuè'],
    tone: 4,
    meaning: ['moon'],
    strokes: 4,
    tier: 'A',
    type: 'pictograph',
    origin: { fact: '象形字，像弯弯的月亮。', story: '弯弯的小月亮呀，像小船。' },
    words: [],
    island: 'nature',
  },
] as Character[];

const EXPLANATION_EMOJI: Record<string, string> = {
  山: '⛰️🌲',
  水: '💧🌊',
  木: '🌳🍃',
  日: '☀️🌞',
  月: '🌙⭐',
};

function CharIcon({ glyph, size = 220 }: { glyph: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 36,
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4E6 100%)',
        border: '3px solid var(--bunny-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-soft)',
        position: 'relative',
      }}
    >
      <span
        style={{
          fontSize: size * 0.7,
          fontWeight: 800,
          color: 'var(--bunny-pink-deep)',
          fontFamily: 'var(--font-sans)',
          lineHeight: 1,
          textShadow: '0 4px 0 rgba(0,0,0,0.05)',
        }}
      >
        {glyph}
      </span>
      {/* 拟人化：腮红 */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: size * 0.18,
          bottom: size * 0.22,
          width: size * 0.13,
          height: size * 0.09,
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
          bottom: size * 0.22,
          width: size * 0.13,
          height: size * 0.09,
          borderRadius: '50%',
          background: 'var(--bunny-pink)',
          opacity: 0.85,
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
        border: active ? '3px solid var(--bunny-red)' : '2px solid var(--bunny-border)',
        background: active ? 'var(--bunny-butter)' : '#FFFFFF',
        borderRadius: 20,
        padding: 14,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'inherit',
        boxShadow: active ? 'var(--shadow-pop)' : 'var(--shadow-soft)',
        transition: 'transform 0.12s ease',
        minHeight: 140,
      }}
    >
      <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--bunny-pink-deep)' }}>{ch.glyph}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--bunny-soft-ink)' }}>
        {ch.pinyin[0]}
      </div>
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
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TopBar title="汉字花园" subtitle={`今天认识 ${next3.length + 1} 个字`} />

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '620px 1fr',
          gap: 24,
          padding: '20px 32px',
          minHeight: 0,
        }}
      >
        {/* Main character card */}
        <Card variant="soft" padding={28} style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--bunny-soft-ink)' }}>
              字宝宝 · {main.tier ?? 'A'} 阶
            </div>
            <div
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                background: 'var(--bunny-mint)',
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--bunny-green-deep)',
              }}
            >
              {main.meaning?.[0] ?? '字'}
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <CharIcon glyph={main.glyph} size={260} />
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: 'var(--bunny-ink)',
                letterSpacing: 6,
              }}
            >
              {main.pinyin.join(' · ')}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12 }}>
            <Button variant="red" size="lg" leading="🐰" onClick={onReadWithBunny}>
              跟 Bunny 读
            </Button>
            <Button variant="mint" size="lg" leading="→" onClick={handleNext}>
              下一个
            </Button>
          </div>
        </Card>

        {/* Right: explanation card with bunny */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
          <Card variant="lavender" padding={24} style={{ flex: '0 0 360px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ fontSize: 64, flexShrink: 0 }}>
                {EXPLANATION_EMOJI[main.glyph] ?? '✨'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: 'var(--bunny-ink)',
                    marginBottom: 6,
                  }}
                >
                  看，{main.glyph}是这样
                </div>
                <div
                  style={{
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: 'var(--bunny-soft-ink)',
                  }}
                >
                  {main.origin?.story ?? main.origin?.fact ?? '这个字宝宝呀，等你来发现。'}
                </div>
              </div>
            </div>
          </Card>

          <Card variant="butter" padding={20} style={{ flex: 1, minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Bunny pose="idle" size={88} />
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--bunny-amber-deep)' }}>
                {main.glyph} 一共 {main.strokes} 画，跟着 Bunny 一起读吧。
              </div>
            </div>
          </Card>

          {/* Preview row */}
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--bunny-soft-ink)',
                marginBottom: 10,
              }}
            >
              接下来认识 →
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
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
