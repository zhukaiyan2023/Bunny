import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TopBar } from '../components/shell/TopBar';
import { Bunny } from '../components/mascot/Bunny';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useContent } from '../runtime/ContentProvider';
import { useLearner } from '../runtime/LearnerProvider';
import { useAudio } from '../runtime/AudioProvider';
import type { Story, StoryPage as StoryPageType } from '../domain/types';

const FALLBACK_PAGES = [
  { pageNumber: 1, audioId: '', text: '小兔子走出门，去找妈妈。', characterIds: [] },
  { pageNumber: 2, audioId: '', text: '它看见一座大山。', characterIds: [] },
  { pageNumber: 3, audioId: '', text: '它看见一条小河。', characterIds: [] },
  { pageNumber: 4, audioId: '', text: '它看见一朵白云。', characterIds: [] },
  { pageNumber: 5, audioId: '', text: '妈妈就在那里等它。', characterIds: [] },
] as unknown as StoryPageType[];

const FALLBACK_STORY: Story = {
  id: 'fallback',
  title: '小兔子找妈妈',
  coverEmoji: '🐰',
  level: 1,
  island: 'family',
  coreCharacterIds: [],
  pages: FALLBACK_PAGES,
  ageMin: 3,
  ageMax: 6,
};

const GRADIENTS = [
  'linear-gradient(160deg, #FFE9A8 0%, #FFC76B 100%)',
  'linear-gradient(160deg, #C6F0D8 0%, #A8E6CF 100%)',
  'linear-gradient(160deg, #B5DEFF 0%, #D9C2F0 100%)',
  'linear-gradient(160deg, #FFC1CC 0%, #FFE9A8 100%)',
  'linear-gradient(160deg, #D9C2F0 0%, #FFC1CC 100%)',
];

const SCENE_EMOJI = ['🌳🌲🌳', '🌊🐟🐚', '☁️🌥️🌤️', '🌸🌼🌷', '🏡🌳🌈'];

function splitWords(text: string): string[] {
  // 把汉字切成单字 token，保留标点 / 空白
  return text.split('').filter((c) => c.trim() !== '');
}

function PageBackground({ page, index }: { page: StoryPageType; index: number }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 28,
        background: GRADIENTS[index % GRADIENTS.length],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 大场景插画占位 */}
      <div
        style={{
          fontSize: 140,
          opacity: 0.85,
          filter: 'drop-shadow(0 6px 0 rgba(255,255,255,0.5))',
        }}
        aria-hidden
      >
        {page.background ?? SCENE_EMOJI[index % SCENE_EMOJI.length]}
      </div>
      <div style={{ fontSize: 16, color: 'var(--bunny-soft-ink)', fontWeight: 600 }}>
        第 {page.pageNumber} 页 · 插画
      </div>
    </div>
  );
}

export function StoryPage() {
  const navigate = useNavigate();
  const params = useParams<{ storyId?: string }>();
  const { stories } = useContent();
  const { markCharacterExposed } = useLearner();
  const { playText, stop } = useAudio();

  const story: Story = useMemo(() => {
    const found = stories.find((s) => s.id === params.storyId) ?? stories[0];
    return found ?? FALLBACK_STORY;
  }, [stories, params.storyId]);

  const [pageIdx, setPageIdx] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const totalPages = story.pages.length;
  const currentPage = story.pages[pageIdx];

  // 翻页时重置 highlight
  useEffect(() => {
    setHighlighted(null);
  }, [pageIdx]);

  useEffect(() => () => stop(), [stop]);

  const onPrev = () => setPageIdx((p) => Math.max(0, p - 1));
  const onNext = () => setPageIdx((p) => Math.min(totalPages - 1, p + 1));

  const onMic = () => {
    if (recorded) {
      setRecorded(false);
      stop();
      return;
    }
    setRecorded(true);
    void playText('你真棒呀', { voice: 'warm' });
  };

  const onWordClick = (ch: string) => {
    setHighlighted(ch);
    // 单字 id 暂用 char + glyph 简化（生产应该用 charactersById 找）
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
        title={`《${story.title}》`}
        subtitle={`第 ${currentPage.pageNumber} 页 / 共 ${totalPages} 页`}
        showBack
      />

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '800px 1fr',
          gap: 24,
          padding: 24,
          minHeight: 0,
        }}
      >
        {/* Left: illustration + sentence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
          <div
            style={{
              flex: '0 0 400px',
              borderRadius: 32,
              boxShadow: 'var(--shadow-pop)',
              overflow: 'hidden',
              border: '2px solid var(--bunny-border)',
            }}
          >
            <PageBackground page={currentPage} index={pageIdx} />
          </div>

          {/* Sentence card */}
          <Card variant="soft" padding={20} style={{ flex: 1, minHeight: 0 }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                fontSize: 36,
                fontWeight: 700,
                color: 'var(--bunny-ink)',
                lineHeight: 1.5,
                textAlign: 'center',
              }}
            >
              {splitWords(currentPage.text).map((ch, i) => {
                const isHi = highlighted === ch;
                return (
                  <button
                    key={`${currentPage.pageNumber}-${i}`}
                    type="button"
                    onClick={() => onWordClick(ch)}
                    style={{
                      border: 0,
                      background: isHi ? 'var(--bunny-butter)' : 'transparent',
                      color: isHi ? 'var(--bunny-amber-deep)' : 'var(--bunny-ink)',
                      padding: '4px 10px',
                      borderRadius: 12,
                      fontSize: 36,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transform: isHi ? 'translateY(-2px)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right: Bunny + mic + nav */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            minHeight: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <Bunny pose={recorded ? 'cheering' : 'idle'} size={220} />
            <div
              style={{
                background: '#FFFFFF',
                border: '2px solid var(--bunny-border)',
                borderRadius: 20,
                padding: '10px 18px',
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--bunny-soft-ink)',
                position: 'relative',
              }}
            >
              Bunny 在讲
              <div
                style={{
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  width: 18,
                  height: 18,
                  background: '#FFFFFF',
                  borderRight: '2px solid var(--bunny-border)',
                  borderBottom: '2px solid var(--bunny-border)',
                  transform: 'translateX(-50%) rotate(45deg)',
                }}
              />
            </div>
          </div>

          {/* Big mic button */}
          <button
            type="button"
            onClick={onMic}
            aria-label={recorded ? '停止录音' : '开始跟读'}
            style={{
              width: 140,
              height: 140,
              borderRadius: '50%',
              border: '4px solid #FFFFFF',
              background: recorded ? 'var(--bunny-red)' : 'var(--bunny-pink)',
              boxShadow: recorded
                ? '0 0 0 6px rgba(233,69,69,0.25), var(--shadow-pop)'
                : 'var(--shadow-pop)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              cursor: 'pointer',
              fontFamily: 'inherit',
              animation: recorded ? 'pulse 1.4s ease-in-out infinite' : 'none',
            }}
          >
            <span style={{ fontSize: 56 }}>🎤</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>
              {recorded ? '在听' : '跟读'}
            </span>
          </button>

          <div style={{ display: 'flex', gap: 12, width: '100%' }}>
            <Button
              variant="ghost"
              size="lg"
              block
              disabled={pageIdx === 0}
              onClick={onPrev}
              leading="←"
            >
              上一页
            </Button>
            <Button
              variant="red"
              size="lg"
              block
              disabled={pageIdx === totalPages - 1}
              onClick={() => {
                onNext();
                if (pageIdx + 1 === totalPages - 1) {
                  navigate('/readalong');
                }
              }}
              trailing="→"
            >
              下一页
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 6px rgba(233,69,69,0.25), var(--shadow-pop); }
          50% { box-shadow: 0 0 0 18px rgba(233,69,69,0), var(--shadow-pop); }
        }
      `}</style>
    </div>
  );
}

export default StoryPage;
