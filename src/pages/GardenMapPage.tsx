import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/shell/TopBar';
import { Bunny } from '../components/mascot/Bunny';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useContent } from '../runtime/ContentProvider';
import { useLearner } from '../runtime/LearnerProvider';

interface IslandSeed {
  id: string;
  title: string;
  emoji: string;
  capacity: number;
  color: string;
}

const DEFAULT_ISLANDS: IslandSeed[] = [
  { id: 'starter', title: '起步森林', emoji: '🌱', capacity: 50, color: '#A8E6CF' },
  { id: 'family', title: '温暖小屋', emoji: '🏠', capacity: 300, color: '#FFE9A8' },
  { id: 'animals', title: '动物谷', emoji: '🐾', capacity: 300, color: '#FFC1CC' },
  { id: 'plants', title: '树木岛', emoji: '🌳', capacity: 300, color: '#C6F0D8' },
  { id: 'body', title: '身体城', emoji: '👀', capacity: 300, color: '#D9C2F0' },
  { id: 'actions', title: '动作山', emoji: '🏃', capacity: 300, color: '#B5DEFF' },
  { id: 'colors', title: '彩虹园', emoji: '🎨', capacity: 300, color: '#FFC1CC' },
  { id: 'nature', title: '自然湖', emoji: '☁️', capacity: 300, color: '#B5DEFF' },
  { id: 'numbers', title: '数字村', emoji: '🔢', capacity: 300, color: '#FFE9A8' },
  { id: 'stories', title: '故事城堡', emoji: '📚', capacity: 600, color: '#D9C2F0' },
];

function Node({ seed, index, active, progress, onClick }: { seed: IslandSeed; index: number; active: boolean; progress: number; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={!active}
      onClick={onClick}
      style={{
        position: 'relative',
        width: 176,
        minHeight: 166,
        borderRadius: 30,
        border: active ? '3px solid rgba(255,255,255,.95)' : '2px solid rgba(255,255,255,.7)',
        background: active ? seed.color : 'rgba(255,255,255,.65)',
        boxShadow: active ? 'var(--shadow-pop)' : 'none',
        opacity: active ? 1 : .52,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontFamily: 'inherit',
      }}
    >
      <div style={{ position: 'absolute', top: 10, left: 12, width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.75)', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 900, color: 'var(--bunny-soft-ink)' }}>{index + 1}</div>
      <div style={{ fontSize: 50, lineHeight: 1 }}>{seed.emoji}</div>
      <div style={{ fontSize: 19, fontWeight: 900, color: 'var(--bunny-ink)' }}>{seed.title}</div>
      <div style={{ width: 120, height: 8, background: 'rgba(255,255,255,.65)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, progress)}%`, height: '100%', background: 'var(--bunny-green-deep)', borderRadius: 999 }} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--bunny-soft-ink)' }}>{Math.round((progress / 100) * seed.capacity)} / {seed.capacity} 字</div>
    </button>
  );
}

export function GardenMapPage() {
  const navigate = useNavigate();
  const { islands, characters } = useContent();
  const { profile } = useLearner();

  const data = useMemo(() => (islands.length ? islands.map((island) => {
    const fallback = DEFAULT_ISLANDS.find((item) => item.id === island.id);
    return { id: island.id, title: island.title, emoji: island.emoji, capacity: island.capacity, color: fallback?.color ?? '#D9C2F0' };
  }) : DEFAULT_ISLANDS), [islands]);

  const progress = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of characters) {
      const state = profile.mastery[c.id]?.state;
      if (state && state !== 'unknown') map[c.island ?? 'starter'] = (map[c.island ?? 'starter'] ?? 0) + 1;
    }
    return map;
  }, [characters, profile.mastery]);

  const learned = profile.learnedCount ?? Object.keys(profile.mastery).length;
  const totalCapacity = data.reduce((sum, item) => sum + item.capacity, 0);

  const go = (id: string) => {
    if (id === 'animals') return navigate('/story');
    if (id === 'stories') return navigate('/story');
    return navigate('/characters');
  };

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <TopBar title="冒险乐园" subtitle="沿着 Bunny 的路线，一站一站认识汉字" right={<div style={{ padding: '9px 14px', borderRadius: 999, background: 'var(--bunny-mint)', color: 'var(--bunny-green-deep)', fontWeight: 900 }}>{learned} / 3000 字</div>} />

      <main style={{ flex: 1, minHeight: 0, padding: '14px 22px 104px', display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr) auto', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px', background: '#fff', border: '2px solid var(--bunny-border)', borderRadius: 24, boxShadow: 'var(--shadow-soft)' }}>
          <Bunny pose="cheering" size={86} />
          <div><div style={{ fontSize: 20, fontWeight: 900, color: 'var(--bunny-ink)' }}>今天去哪里冒险？</div><div style={{ marginTop: 4, fontSize: 13, color: 'var(--bunny-soft-ink)' }}>先从第 1 站出发，完成任务就能解锁下一站。</div></div>
        </div>

        <section style={{ position: 'relative', minHeight: 0, borderRadius: 34, overflow: 'hidden', border: '2px solid var(--bunny-border)', boxShadow: 'var(--shadow-pop)', background: '#DFF2DE' }}>
          <img src="/assets/art/l0/backgrounds/bg-meadow.jpg" alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.22))' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(5, minmax(140px,1fr))', gridTemplateRows: 'repeat(2, 1fr)', alignItems: 'center', justifyItems: 'center', padding: '24px 20px', gap: 12 }}>
            {data.map((seed, index) => {
              const mastered = progress[seed.id] ?? 0;
              const percent = seed.capacity ? (mastered / seed.capacity) * 100 : 0;
              const active = index === 0 || learned >= index * 5;
              return <Node key={seed.id} seed={seed} index={index} active={active} progress={percent} onClick={() => go(seed.id)} />;
            })}
          </div>
          <div style={{ position: 'absolute', left: 26, bottom: 20, padding: '9px 14px', borderRadius: 999, background: 'rgba(255,255,255,.88)', fontSize: 12, fontWeight: 900, color: 'var(--bunny-green-deep)' }}>🌿 每到一站都会遇到新的字、绘本和小游戏</div>
        </section>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '11px 18px', background: '#fff', border: '2px solid var(--bunny-border)', borderRadius: 22, boxShadow: 'var(--shadow-soft)' }}>
          <div style={{ width: 66, fontSize: 14, fontWeight: 900, color: 'var(--bunny-soft-ink)' }}>总进度</div>
          <ProgressBar value={learned / totalCapacity} total={totalCapacity} label="已学" color="mint" width={520} />
          <div style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 900, color: 'var(--bunny-green-deep)' }}>{learned} / {totalCapacity} 字</div>
        </div>
      </main>
    </div>
  );
}

export default GardenMapPage;
