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
  { pageNumber: 4, audioId: '', text: '它看见一片大草地。', characterIds: [] },
  { pageNumber: 5, audioId: '', text: '妈妈就在家门口等它。', characterIds: [] },
] as unknown as StoryPageType[];

const FALLBACK_STORY: Story = {
  id: 'book-xiao-tu-de-jia',
  title: '小兔的家',
  coverEmoji: '🐰',
  level: 1,
  island: 'family',
  coreCharacterIds: ['char-shan', 'char-shui', 'char-mu'],
  pages: FALLBACK_PAGES,
  ageMin: 3,
  ageMax: 6,
};

const STORY_COVERS: Record<string, string> = {
  'book-xiao-tu-de-jia': '/assets/art/l1/stories/cover-xiao-tu-de-jia.jpg',
  'book-tai-yang-he-yue-liang': '/assets/art/l1/stories/cover-tai-yang-he-yue-liang.jpg',
  'book-sen-lin-li-de-yi-tian': '/assets/art/l1/stories/cover-sen-lin-li-de-yi-tian.jpg',
  'book-wo-de-yi-jia': '/assets/art/l1/stories/cover-wo-de-yi-jia.svg',
  'book-chun-xia-qiu-dong': '/assets/art/l1/stories/cover-chun-xia-qiu-dong.svg',
  'book-xiao-dong-ji': '/assets/art/l1/stories/cover-xiao-dong-ji.svg',
  fallback: '/assets/art/l1/stories/cover-xiao-tu-de-jia.jpg',
};

const STORY_BACKGROUNDS = [
  '/assets/art/l0/backgrounds/bg-forest-light.jpg',
  '/assets/art/l0/backgrounds/bg-meadow.jpg',
  '/assets/art/l0/backgrounds/bg-pond.jpg',
  '/assets/art/l0/backgrounds/bg-forest-light.jpg',
  '/assets/art/l0/backgrounds/bg-sky-day.jpg',
];

function splitText(text: string): string[] {
  return text.split('').filter((c) => c.trim() !== '');
}

function PageIllustration({ story, page, index }: { story: Story; page: StoryPageType; index: number }) {
  const cover = STORY_COVERS[story.id] ?? STORY_COVERS.fallback;
  const environment = STORY_BACKGROUNDS[index % STORY_BACKGROUNDS.length];
  const pageAsset = typeof page.background === 'string' && page.background.startsWith('/assets/') ? page.background : undefined;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#DFF3E4' }}>
      <img src={pageAsset ?? environment} alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <img
        src={cover}
        alt={`${story.title} 绘本插画`}
        style={{ position: 'absolute', left: '6%', right: '6%', top: '6%', bottom: '9%', width: '88%', height: '85%', objectFit: 'cover', borderRadius: 28, boxShadow: '0 18px 36px rgba(30,50,40,.20)', border: '3px solid rgba(255,255,255,.92)' }}
      />
      <div style={{ position: 'absolute', left: 22, top: 18, padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,.9)', color: 'var(--bunny-ink)', fontSize: 13, fontWeight: 900 }}>
        第 {page.pageNumber} 页
      </div>
      <div style={{ position: 'absolute', right: 22, bottom: 18, padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,.9)', color: 'var(--bunny-green-deep)', fontSize: 13, fontWeight: 900 }}>
        这一页的画面
      </div>
    </div>
  );
}

export function StoryPage() {
  const params = useParams<{ storyId?: string }>();
  const navigate = useNavigate();
  const { stories, characters } = useContent();
  const { profile, markCharacterExposed } = useLearner();
  const { playText, stop } = useAudio();
  const childName = profile.displayName || '妙妙';

  // 按 glyph 索引，方便从句子里的字查到 character id
  const charByGlyph = useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of characters) m[c.glyph] = c.id;
    return m;
  }, [characters]);

  const storyList = stories.length > 0 ? stories : [FALLBACK_STORY];

  // ===== 故事选择页（/story 不带 storyId）=====
  if (!params.storyId) {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <TopBar title="故事王国" subtitle={`${childName}选一个故事，开始读吧`} />
        <main style={{ flex: 1, minHeight: 0, padding: '24px 32px 104px', overflow: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, maxWidth: 1180, margin: '0 auto' }}>
            {storyList.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => navigate(`/story/${s.id}`)}
                style={{
                  background: '#FFFFFF',
                  border: '2px solid var(--bunny-border)',
                  borderRadius: 24,
                  padding: 0,
                  boxShadow: 'var(--shadow-soft)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  overflow: 'hidden',
                  textAlign: 'left',
                  minHeight: 240,
                }}
              >
                <div style={{
                  width: '100%',
                  height: 180,
                  background: '#FFF4E6',
                  backgroundImage: `url(${STORY_COVERS[s.id] ?? STORY_COVERS.fallback})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderBottom: '2px solid var(--bunny-border)',
                }} />
                <div style={{ padding: 18 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--bunny-ink)' }}>《{s.title}》</div>
                  <div style={{ marginTop: 6, fontSize: 13, color: 'var(--bunny-soft-ink)', lineHeight: 1.6 }}>
                    {s.pages.length} 页 · 主题：{s.island} · 核心字：{s.coreCharacterIds?.length ?? 0} 个
                  </div>
                  <div style={{ marginTop: 12, display: 'inline-block', padding: '6px 14px', borderRadius: 999, background: 'var(--bunny-mint)', color: 'var(--bunny-green-deep)', fontWeight: 900, fontSize: 13 }}>
                    妙妙读 →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const story = useMemo(() => storyList.find((s) => s.id === params.storyId) ?? storyList[0] ?? FALLBACK_STORY, [storyList, params.storyId]);
  const [pageIdx, setPageIdx] = useState(0);
  const [recorded, setRecorded] = useState(false);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const currentPage = story.pages[pageIdx] ?? story.pages[0];

  useEffect(() => setHighlighted(null), [pageIdx]);
  useEffect(() => () => stop(), [stop]);

  const readSentence = () => {
    void playText(currentPage.text);
  };

  const startReadAlong = () => {
    setRecorded((value) => !value);
    void playText(recorded ? '我们停一下。' : '轮到你啦，跟 Bunny 一起读。');
  };

  const onWordClick = (ch: string) => {
    setHighlighted(ch);
    const charId = charByGlyph[ch];
    if (charId) markCharacterExposed(charId);
    void playText(ch);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <TopBar title={`《${story.title}》`} subtitle={`${childName} · 第 ${currentPage.pageNumber} 页 / 共 ${story.pages.length} 页`} />

      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 1.65fr) minmax(320px, .75fr)', gap: 18, padding: '16px 24px 104px', overflow: 'hidden' }}>
        <div style={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ flex: 1, minHeight: 0, borderRadius: 28, overflow: 'hidden', boxShadow: 'var(--shadow-pop)', border: '2px solid var(--bunny-border)' }}>
            <PageIllustration story={story} page={currentPage} index={pageIdx} />
          </div>

          <Card variant="soft" padding={18}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 4, fontSize: 36, lineHeight: 1.55, fontWeight: 800, color: 'var(--bunny-ink)' }}>
              {splitText(currentPage.text).map((ch, i) => (
                <button key={`${currentPage.pageNumber}-${i}`} type="button" onClick={() => onWordClick(ch)} style={{ minHeight: 54, padding: '2px 7px', borderRadius: 12, background: highlighted === ch ? 'var(--bunny-butter)' : 'transparent', color: highlighted === ch ? 'var(--bunny-amber-deep)' : 'var(--bunny-ink)', fontSize: 36, fontWeight: 800 }}>
                  {ch}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card variant="butter" padding={18}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Bunny pose={recorded ? 'cheering' : 'idle'} size={112} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--bunny-amber-deep)' }}>Bunny 陪你读</div>
                <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.6, color: 'var(--bunny-soft-ink)' }}>先听故事，再跟着 Bunny 读，最后自己读。</div>
              </div>
            </div>
          </Card>

          <Card variant="soft" padding={18} style={{ flex: '0 0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Button variant="red" size="lg" onClick={readSentence}>🔊 再听一遍</Button>
              <Button variant="pink" size="lg" onClick={startReadAlong}>{recorded ? '⏹ 停止跟读' : '🎤 跟我读'}</Button>
            </div>
          </Card>

          <Card variant="lavender" padding={18} style={{ flex: 1, minHeight: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--bunny-lavender-deep)' }}>这一页发现</div>
            <div style={{ marginTop: 10, fontSize: 26, fontWeight: 900, color: 'var(--bunny-ink)' }}>{currentPage.characterIds?.length ? `${currentPage.characterIds.length} 个目标字` : '跟读一句话'}</div>
            <div style={{ marginTop: 8, fontSize: 14, lineHeight: 1.65, color: 'var(--bunny-soft-ink)' }}>点一下句子里的字，Bunny 会把这个字单独读给你听。</div>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Button variant="ghost" size="lg" disabled={pageIdx === 0} onClick={() => setPageIdx((p) => Math.max(0, p - 1))}>上一页</Button>
            <Button variant="red" size="lg" disabled={pageIdx >= story.pages.length - 1} onClick={() => setPageIdx((p) => Math.min(story.pages.length - 1, p + 1))}>下一页</Button>
          </div>

          <Button variant="mint" size="md" block onClick={() => navigate('/story')}>← 回到故事王国</Button>
        </div>
      </div>
    </div>
  );
}

export default StoryPage;
