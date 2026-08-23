import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/shell/TopBar';
import { Bunny } from '../components/mascot/Bunny';
import { useLearner } from '../runtime/LearnerProvider';
import { useContent } from '../runtime/ContentProvider';
import { useAudio } from '../runtime/AudioProvider';
import type { LearnerProfile } from '../domain/types';
import './HomePage.css';

type IslandId = 'story' | 'characters' | 'game' | 'house';

const ISLANDS: Array<{ id: IslandId; title: string; subtitle: string; to: string; theme: string; scene: string; icon: string }> = [
  { id: 'story', title: '故事王国', subtitle: 'Bunny 带你读绘本', to: '/story', theme: 'butter', scene: '/assets/art/l0/backgrounds/bg-forest-light.jpg', icon: '读' },
  { id: 'characters', title: '汉字花园', subtitle: '发现汉字的秘密', to: '/characters', theme: 'mint', scene: '/assets/art/l0/backgrounds/bg-meadow.jpg', icon: '字' },
  { id: 'game', title: '冒险乐园', subtitle: '沿地图完成学习任务', to: '/garden', theme: 'sky', scene: '/assets/art/l0/backgrounds/bg-pond.jpg', icon: '玩' },
  { id: 'house', title: '我的小屋', subtitle: '收集勋章与成长奖励', to: '/badges', theme: 'pink', scene: '/assets/art/l0/backgrounds/bg-sky-day.jpg', icon: '藏' },
];

/**
 * 「正常模式」的 hero stats + 打卡按钮
 * 抽成小组件，避免 HomePage 里嵌套三元导致 JSX 报错
 */
function NormalHeroStats({
  profile,
  masteredCount,
  checkedInToday,
  onCheckIn,
  childName,
}: {
  profile: LearnerProfile;
  masteredCount: number;
  checkedInToday: boolean;
  onCheckIn: () => void;
  childName: string;
}) {
  return (
    <>
      <div className="home-hero__stats">
        <div className="home-stat"><span className="home-stat__value">{profile.badges.length}</span><span className="home-stat__label">我的勋章</span></div>
        <div className="home-stat"><span className="home-stat__value">{profile.streakDays}</span><span className="home-stat__label">连续学习</span></div>
        <div className="home-stat"><span className="home-stat__value">{masteredCount}</span><span className="home-stat__label">已学汉字</span></div>
      </div>
      {checkedInToday ? (
        <div style={{
          marginTop: 10, padding: '10px 16px', borderRadius: 999,
          background: 'rgba(255,255,255,.85)', border: '2px solid var(--bunny-mint-deep)',
          fontSize: 14, fontWeight: 800, color: 'var(--bunny-green-deep)',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: 'var(--shadow-soft)',
        }}>
          ✅ {childName}今日已打卡 · 连续 {profile.streakDays} 天
        </div>
      ) : (
        <button
          type="button"
          onClick={onCheckIn}
          className="home-hero__cta"
          style={{ position: 'static', transform: 'none', bottom: 'auto', left: 'auto', marginTop: 12 }}
        >
          <span style={{ fontSize: 22 }}>📅</span> 今日打卡
        </button>
      )}
    </>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { profile, checkInToday } = useLearner();
  const { characters } = useContent();
  const { playText } = useAudio();
  const childName = profile.displayName || '妙妙';
  const totalL1 = characters.length;
  const masteredCount = useMemo(() => Object.values(profile.mastery).filter((m) => m.state === 'mastered').length, [profile]);
  const learnedByIsland = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const character of characters) {
      if (!profile.mastery[character.id]?.state) continue;
      const island = character.island ?? 'starter';
      counts[island] = (counts[island] ?? 0) + 1;
    }
    return counts;
  }, [characters, profile.mastery]);
  const l1ProgressPercent = totalL1 > 0 ? Math.round((masteredCount / totalL1) * 100) : 0;
  const needsAssessment = !profile.assessment;
  const todayStr = new Date().toISOString().slice(0, 10);
  const checkedInToday = profile.lastCheckInDate === todayStr;
  const handleCheckIn = () => {
    const result = checkInToday();
    if (result.changed) {
      void playText(`${childName}打卡成功，已连续 ${result.streak} 天`);
    }
  };
  const assessmentDate = profile.assessment
    ? new Date(profile.assessment.testedAt).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="home-page">
      <TopBar
        title={`${childName} 的 Bunny 世界`}
        subtitle={`${childName}，今天我们一起发现汉字的秘密`}
        showBack={false}
        right={(
          <div className="home-progress">
            <div className="home-progress__label">{childName} 的识字量</div>
            <div className="home-progress__value">{masteredCount} / {totalL1} 字 (L1 一年级 {l1ProgressPercent}%)</div>
            <div className="home-progress__track"><div className="home-progress__fill" style={{ width: `${l1ProgressPercent}%` }} /></div>
            {assessmentDate && (
              <div className="home-progress__meta">上次测试：{assessmentDate}</div>
            )}
          </div>
        )}
      />

      <main className="home-page__main">
        <section className="home-hero" aria-label="Bunny 欢迎区">
          <div className="home-hero__halo" />
          <div className="home-hero__speech">
            {needsAssessment ? (
              <>
                <div className="home-hero__speech-title">嗨，{childName}！</div>
                <div className="home-hero__speech-text">Bunny 想先认识你<br />点下面的按钮开始识字量小测试</div>
              </>
            ) : (
              <>
                <div className="home-hero__speech-title">今天想去哪里？</div>
                <div className="home-hero__speech-text">选一个地方，Bunny 就带你出发。</div>
              </>
            )}
          </div>
          <div className="home-hero__bunny">
            <Bunny pose={needsAssessment ? 'idle' : 'cheering'} size={needsAssessment ? 220 : 320} showBackpack />
          </div>
          {needsAssessment ? (
            <button
              type="button"
              onClick={() => navigate('/assessment')}
              className="home-hero__cta"
            >
              <span style={{ fontSize: 22 }}>🎯</span> 开始识字量测试
            </button>
          ) : (
            <NormalHeroStats
              profile={profile}
              masteredCount={masteredCount}
              checkedInToday={checkedInToday}
              onCheckIn={handleCheckIn}
              childName={childName}
            />
          )}
        </section>

        <section className="home-islands" aria-label="学习入口">
          <div className="home-islands__heading">
            <div><div className="home-islands__eyebrow">选择你的下一步</div><h1>四个世界，一个学习旅程</h1></div>
            <button className="home-islands__more" type="button" onClick={() => navigate('/daily')}>今日学习计划 →</button>
          </div>
          <div className="home-islands__grid">
            {ISLANDS.map((island) => (
              <button key={island.id} type="button" className={`home-island home-island--${island.theme}`} onClick={() => navigate(island.to)}>
                <img className="home-island__scene" src={island.scene} alt="" aria-hidden="true" />
                <div className="home-island__veil" />
                <div className="home-island__content"><span className="home-island__icon">{island.icon}</span><div><div className="home-island__title">{island.title}</div><div className="home-island__subtitle">{island.subtitle}</div></div></div>
                <div className="home-island__footer">
                  <span>
                    {island.id === 'characters' && `已探索 ${learnedByIsland.plants ?? 0} 个字`}
                    {island.id === 'game' && '探索 10 个冒险站点'}
                    {island.id === 'story' && '推荐：1 本分级绘本'}
                    {island.id === 'house' && `已有 ${profile.badges.length} 枚勋章`}
                  </span>
                  <span>进入 →</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;