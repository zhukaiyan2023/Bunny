import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TopBar } from '../components/shell/TopBar';
import { Bunny } from '../components/mascot/Bunny';
import { useContent } from '../runtime/ContentProvider';
import { useLearner } from '../runtime/LearnerProvider';
import { useAudio } from '../runtime/AudioProvider';
import type { Story, StoryPage } from '../domain/types';

const FALLBACK_SENTENCES = [
  '小兔子出门了',
  '看见一座山',
  '看见一条河',
  '妈妈在等它',
];

const FALLBACK_STORY: Story = {
  id: 'fallback',
  title: '跟 Bunny 读',
  coverEmoji: '🎤',
  level: 1,
  island: 'family',
  coreCharacterIds: [],
  pages: FALLBACK_SENTENCES.map((text, i) => ({
    pageNumber: i + 1,
    audioId: '',
    text,
    characterIds: [],
  })) as unknown as StoryPage[],
  ageMin: 3,
  ageMax: 6,
};

function WaveformBars({ active }: { active: boolean }) {
  // 12 条高低不一的波形条
  const bars = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div
      style={{
        position: 'absolute',
        bottom: -28,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 6,
        height: 24,
      }}
    >
      {bars.map((b) => (
        <span
          key={b}
          style={{
            display: 'inline-block',
            width: 5,
            borderRadius: 3,
            background: 'var(--bunny-mint-deep)',
            height: active ? `${20 + Math.abs(Math.sin((b + 1) * 0.8)) * 40}%` : '20%',
            animation: active ? `wave 0.7s ease-in-out ${b * 0.05}s infinite` : 'none',
            transition: 'height 0.2s ease',
          }}
        />
      ))}
    </div>
  );
}

export function ReadAlongPage() {
  const params = useParams<{ storyId?: string }>();
  const { stories } = useContent();
  const { markCharacterExposed } = useLearner();
  const { playText, stop } = useAudio();

  const story: Story = useMemo(() => {
    const found = stories.find((s) => s.id === params.storyId) ?? stories[0];
    return found ?? FALLBACK_STORY;
  }, [stories, params.storyId]);

  const sentences = useMemo(() => {
    if (story.pages.length === 0) return FALLBACK_SENTENCES;
    return story.pages.map((p) => p.text);
  }, [story]);

  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [highlightedCh, setHighlightedCh] = useState<string | null>(null);

  useEffect(() => () => stop(), [stop]);

  const sentence = sentences[idx] ?? '';
  const chars = Array.from(sentence).filter((c) => c.trim());

  const handleMic = () => {
    if (recording) {
      setRecording(false);
      stop();
      return;
    }
    setRecording(true);
    void playText('你真厉害');
  };

  const handleWord = (ch: string) => {
    setHighlightedCh(ch);
    markCharacterExposed(`char-${ch}`);
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
      <TopBar
        title="跟 Bunny 读"
        subtitle={`第 ${idx + 1} 句 / 共 ${sentences.length} 句`}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '32px 32px 24px',
          gap: 24,
          minHeight: 0,
        }}
      >
        {/* Sentence card */}
        <div
          style={{
            width: '100%',
            maxWidth: 1200,
            minHeight: 160,
            borderRadius: 36,
            background: '#FFFFFF',
            border: '2px solid var(--bunny-border)',
            boxShadow: 'var(--shadow-pop)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            padding: '24px 36px',
          }}
        >
          {chars.map((ch, i) => {
            const isHi = highlightedCh === ch;
            return (
              <button
                key={`${idx}-${i}`}
                type="button"
                onClick={() => handleWord(ch)}
                style={{
                  border: 0,
                  background: isHi ? 'var(--bunny-butter)' : 'transparent',
                  color: isHi ? 'var(--bunny-amber-deep)' : 'var(--bunny-ink)',
                  fontSize: 64,
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: 16,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  lineHeight: 1.2,
                  transform: isHi ? 'translateY(-3px)' : 'none',
                  transition: 'all 0.18s ease',
                }}
              >
                {ch}
              </button>
            );
          })}
        </div>

        {/* Huge mic */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Pulsing rings */}
          {recording && (
            <>
              <span
                style={{
                  position: 'absolute',
                  width: 260,
                  height: 260,
                  borderRadius: '50%',
                  background: 'rgba(255, 193, 204, 0.45)',
                  animation: 'ringPulse 1.6s ease-out infinite',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  width: 260,
                  height: 260,
                  borderRadius: '50%',
                  background: 'rgba(255, 193, 204, 0.4)',
                  animation: 'ringPulse 1.6s ease-out 0.5s infinite',
                }}
              />
            </>
          )}
          <button
            type="button"
            onClick={handleMic}
            aria-label={recording ? '停止录音' : '开始录音'}
            style={{
              position: 'relative',
              width: 200,
              height: 200,
              borderRadius: '50%',
              border: '6px solid #FFFFFF',
              background: recording
                ? 'linear-gradient(180deg, #E94545 0%, #B81F1F 100%)'
                : 'linear-gradient(180deg, #FFC1CC 0%, #FF9F43 100%)',
              boxShadow: recording
                ? '0 12px 0 rgba(184,31,31,0.5), var(--shadow-pop)'
                : '0 12px 0 rgba(255,159,67,0.45), var(--shadow-pop)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'transform 0.1s ease',
              transform: recording ? 'scale(1.04)' : 'scale(1)',
            }}
          >
            <span style={{ fontSize: 88 }}>{recording ? '🛑' : '🎤'}</span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: recording ? '#FFFFFF' : 'var(--bunny-pink-deep)',
              }}
            >
              {recording ? '在听' : '按住读'}
            </span>
          </button>
          <WaveformBars active={recording} />
        </div>

        {/* Bunny encouragement strip */}
        <div
          style={{
            width: '100%',
            maxWidth: 1100,
            minHeight: 100,
            background: 'linear-gradient(90deg, #C6F0D8 0%, #FFE9A8 100%)',
            border: '2px solid var(--bunny-border)',
            borderRadius: 28,
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <Bunny pose="happy" size={88} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: 'var(--bunny-green-deep)',
                marginBottom: 4,
              }}
            >
              太棒了！像小小朗诵家！
            </div>
            <div style={{ fontSize: 15, color: 'var(--bunny-soft-ink)' }}>
              再读一遍会
              <span style={{ color: 'var(--bunny-red)', fontWeight: 700 }}> 更清楚</span>
              哦 🐰
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIdx((i) => Math.min(i + 1, sentences.length - 1))}
            style={{
              border: 0,
              background: 'var(--bunny-red)',
              color: '#FFFFFF',
              padding: '16px 32px',
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-soft)',
              minHeight: 56,
            }}
          >
            下一句 →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes ringPulse {
          0%   { transform: scale(0.9); opacity: 0.7; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.3); }
          50%      { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}

export default ReadAlongPage;
