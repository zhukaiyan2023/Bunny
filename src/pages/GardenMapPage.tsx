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

const ISLAND_SEEDS: IslandSeed[] = [
  { id: 'starter',  title: '起步',  emoji: '🌱', capacity: 50,  color: 'linear-gradient(160deg, #C6F0D8 0%, #A8E6CF 100%)' },
  { id: 'family',   title: '家',    emoji: '🏠', capacity: 300, color: 'linear-gradient(160deg, #FFE9A8 0%, #FFC76B 100%)' },
  { id: 'animals',  title: '动物',  emoji: '🐰', capacity: 300, color: 'linear-gradient(160deg, #FFC1CC 0%, #FF9F43 100%)' },
  { id: 'plants',   title: '植物',  emoji: '🌳', capacity: 300, color: 'linear-gradient(160deg, #C6F0D8 0%, #6FD7A0 100%)' },
  { id: 'body',     title: '身体',  emoji: '👀', capacity: 300, color: 'linear-gradient(160deg, #D9C2F0 0%, #B5DEFF 100%)' },
  { id: 'actions',  title: '动作',  emoji: '🏃', capacity: 300, color: 'linear-gradient(160deg, #B5DEFF 0%, #A8E6CF 100%)' },
  { id: 'colors',   title: '颜色',  emoji: '🎨', capacity: 300, color: 'linear-gradient(160deg, #FFC1CC 0%, #D9C2F0 100%)' },
  { id: 'nature',   title: '自然',  emoji: '☁️', capacity: 300, color: 'linear-gradient(160deg, #B5DEFF 0%, #FFE9A8 100%)' },
  { id: 'numbers',  title: '数字',  emoji: '🔢', capacity: 300, color: 'linear-gradient(160deg, #FFE9A8 0%, #A8E6CF 100%)' },
  { id: 'stories',  title: '故事',  emoji: '📚', capacity: 600, color: 'linear-gradient(160deg, #D9C2F0 0%, #FFC1CC 100%)' },
];

function IslandBubble({
  seed,
  active,
  onClick,
}: {
  seed: IslandSeed;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 180,
        height: 180,
        borderRadius: '50%',
        background: active ? seed.color : 'var(--bunny-cream)',
        border: active ? '3px solid #FFFFFF' : '2px dashed var(--bunny-border)',
        boxShadow: active ? 'var(--shadow-pop)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        cursor: active ? 'pointer' : 'default',
        fontFamily: 'inherit',
        opacity: active ? 1 : 0.55,
        position: 'relative',
      }}
      disabled={!active}
    >
      <div style={{ fontSize: 56 }}>{seed.emoji}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--bunny-ink)' }}>{seed.title}</div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--bunny-soft-ink)',
          padding: '3px 10px',
          borderRadius: 999,
          background: 'rgba(255,255,255,0.8)',
        }}
      >
        {seed.capacity} 字
      </div>
    </button>
  );
}

export function GardenMapPage() {
  const navigate = useNavigate();
  const { islands, characters } = useContent();
  const { profile } = useLearner();

  // 合并 islands（来自 content）+ 兜底
  const islandData = useMemo<IslandSeed[]>(() => {
    if (islands.length > 0) {
      return islands.map((isl) => {
        const seed = ISLAND_SEEDS.find((s) => s.id === isl.id);
        return {
          id: isl.id,
          title: isl.title,
          emoji: isl.emoji,
          capacity: isl.capacity,
          color: seed?.color ?? 'linear-gradient(160deg, #FFE9A8 0%, #A8E6CF 100%)',
        } as IslandSeed;
      });
    }
    return ISLAND_SEEDS;
  }, [islands]);

  // 计算每个字掌握数（按 island 字段）
  const islandProgress = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of characters) {
      const island = (c as any).island ?? 'starter';
      const id = (c as any).id;
      const mastery = profile.mastery[id];
      if (mastery && mastery.state !== 'unknown') {
        counts[island] = (counts[island] ?? 0) + 1;
      }
    }
    return counts;
  }, [characters, profile.mastery]);

  // 顺序：主角 starter 先激活，其余按 learner 数据判断激活
  const activeIslands = useMemo(() => {
    const totalLearned = profile.learnedCount ?? 0;
    return islandData.map((isl) => ({
      ...isl,
      active: isl.id === 'starter' || totalLearned >= 5,
    }));
  }, [islandData, profile.learnedCount]);

  const totalSeeds = profile.learnedCount ?? Object.keys(profile.mastery).length;
  const totalCapacity = islandData.reduce((sum, isl) => sum + isl.capacity, 0);

  const sproutBadge = (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 20px',
        borderRadius: 999,
        background: 'var(--bunny-mint)',
        border: '2px solid var(--bunny-mint-deep)',
        boxShadow: 'var(--shadow-soft)',
      }}
    >
      <span style={{ fontSize: 22 }}>🌱</span>
      <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--bunny-green-deep)' }}>
        {totalSeeds} 棵苗
      </span>
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TopBar title="字花园全景" subtitle="你种下了多少棵小苗？" right={sproutBadge} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 24px',
          gap: 16,
          minHeight: 0,
        }}
      >
        {/* Bunny dialogue */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: '#FFFFFF',
            border: '2px solid var(--bunny-border)',
            borderRadius: 28,
            padding: '12px 20px',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <Bunny pose="idle" size={80} />
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--bunny-ink)' }}>
            小苗一棵棵长起来，花园呀越来越暖 ✨
          </div>
        </div>

        {/* World map with 10 islands */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            borderRadius: 36,
            background: 'linear-gradient(180deg, #C6F0D8 0%, #B5DEFF 60%, #FFE9A8 100%)',
            border: '2px solid var(--bunny-border)',
            boxShadow: 'var(--shadow-soft)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gridTemplateRows: '1fr 1fr',
            gap: 12,
            padding: 24,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            justifyItems: 'center',
            minHeight: 0,
          }}
        >
          {activeIslands.map((isl) => (
            <div key={isl.id} style={{ position: 'relative' }}>
              <IslandBubble
                seed={isl}
                active={isl.active}
                onClick={() => {
                  if (isl.id === 'family' || isl.id === 'plants' || isl.id === 'stories') {
                    navigate('/characters');
                  } else if (isl.id === 'animals') {
                    navigate('/story');
                  } else {
                    navigate('/characters');
                  }
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: -22,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--bunny-soft-ink)',
                  background: 'rgba(255,255,255,0.85)',
                  padding: '2px 10px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                }}
              >
                {islandProgress[isl.id] ?? 0} / {isl.capacity}
              </div>
            </div>
          ))}
        </div>

        {/* Total progress */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: '#FFFFFF',
            border: '2px solid var(--bunny-border)',
            borderRadius: 28,
            padding: '14px 24px',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--bunny-soft-ink)',
            }}
          >
            总进度
          </div>
          <ProgressBar
            value={totalSeeds / totalCapacity}
            total={totalCapacity}
            label="已学"
            color="mint"
            width={500}
          />
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: 'var(--bunny-green-deep)',
              flexShrink: 0,
            }}
          >
            {totalSeeds} / {totalCapacity} 字
          </div>
        </div>
      </div>
    </div>
  );
}

export default GardenMapPage;
