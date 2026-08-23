import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/shell/TopBar';
import { Bunny } from '../components/mascot/Bunny';
import { useLearner } from '../runtime/LearnerProvider';
import { useContent } from '../runtime/ContentProvider';
import './HomePage.css';

const TOTAL_GOAL = 3000;

type IslandId = 'story' | 'characters' | 'game' | 'house';

const ISLANDS: Array<{
  id: IslandId;
  title: string;
  subtitle: string;
  to: string;
  theme: string;
  scene: string;
  icon: string;
}> = [
  { id: 'story', title: '故事王国', subtitle: 'Bunny 带你读绘本', to: '/story', theme: 'butter', scene: '/assets/art/l0/backgrounds/bg-forest-light.jpg', icon: '读' },
  { id: 'characters', title: '汉字花园', subtitle: '发现汉字的秘密', to: '/characters', theme: 'mint', scene: '/assets/art/l0/backgrounds/bg-meadow.jpg', icon: '字' },
  { id: 'game', title: '冒险乐园', subtitle: '用游戏完成任务', to: '/game', theme: 'sky', scene: '/assets/art/l0/backgrounds/bg-pond.jpg', icon: '玩' },
  { id: 'house', title: '我的小屋', subtitle: '收集勋章与成长奖励', to: '/badges', theme: 'pink', scene: '/assets/art/l0/backgrounds/bg-sky-day.jpg', icon: '藏' },
];

export function HomePage() {
  const navigate = useNavigate();
  const { profile } = useLearner();
  const { characters } = useContent();

  const learnedCount = useMemo(
    () => profile.learnedCount ?? Object.keys(profile.mastery).length,
    [profile],
  );

  const learnedByIsland = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const character of characters) {
      const state = profile.mastery[character.id]?.state;
      if (!state) continue;
      counts[character.island ?? 'starter'] = (counts[character.island ?? 'starter'] ?? 0) + 1;
    }
    return counts;
  }, [characters, profile.mastery]);

  const progressPercent = Math.min(100, Math.round((learnedCount / TOTAL_GOAL) * 100));

  return (
    <div className="home-page">
      <TopBar
        title="Bunny 世界"
        subtitle="今天也和 Bunny 一起读、玩、发现汉字"
        showBack={false}
        right={(
          <div className="home-progress">
            <div className="home-progress__label">我的识字旅程</div>
            <div className="home-progress__value">{learnedCount} / {TOTAL_GOAL} 字</div>
            <div className="home-progress__track"><div className="home-progress__fill" style={{ width: `${progressPercent}%` }} /></div>
          </div>
        )}
      />

      <main className="home-page__main">
        <section className="home-hero" aria-label="Bunny 欢迎区">
          <div className="home-hero__halo" />
          <div className="home-hero__speech">
            <div className="home-hero__speech-title">今天想去哪里？</div>
            <div className="home-hero__speech-text">选一个地方，Bunny 就带你出发。</div>
          </div>
          <div className="home-hero__bunny"><Bunny pose="cheering" size={320} showBackpack /></div>
          <div className="home-hero__stats">
            <div className="home-stat"><span className="home-stat__value">{profile.badges.length}</span><span className="home-stat__label">我的勋章</span></div>
            <div className="home-stat"><span className="home-stat__value">{profile.streakDays}</span><span className="home-stat__label">连续学习</span></div>
            <div className="home-stat"><span className="home-stat__value">12</span><span className="home-stat__label">今日分钟</span></div>
          </div>
        </section>

        <section className="home-islands" aria-label="学习入口">
          <div className="home-islands__heading">
            <div>
              <div className="home-islands__eyebrow">选择你的下一步</div>
              <h1>四个世界，一个学习旅程</h1>
            </div>
            <button className="home-islands__more" type="button" onClick={() => navigate('/daily')}>今日学习计划 →</button>
          </div>

          <div className="home-islands__grid">
            {ISLANDS.map((island) => (
              <button key={island.id} type="button" className={`home-island home-island--${island.theme}`} onClick={() => navigate(island.to)}>
                <img className="home-island__scene" src={island.scene} alt="" aria-hidden="true" />
                <div className="home-island__veil" />
                <div className="home-island__content">
                  <span className="home-island__icon">{island.icon}</span>
                  <div><div className="home-island__title">{island.title}</div><div className="home-island__subtitle">{island.subtitle}</div></div>
                </div>
                <div className="home-island__footer">
                  <span>
                    {island.id === 'characters' && `已探索 ${learnedByIsland.plants ?? 0} 个字`}
                    {island.id === 'game' && '今日推荐：森林找字'}
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
