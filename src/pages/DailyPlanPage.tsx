import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/shell/TopBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Bunny } from '../components/mascot/Bunny';
import { useContent } from '../runtime/ContentProvider';
import { useLearner } from '../runtime/LearnerProvider';
import { useAudio } from '../runtime/AudioProvider';
import type { Character } from '../domain/types';

/**
 * DailyPlanPage · 今日学习计划（/daily）
 *
 * 设计基线（6-9 岁主线版）：
 *   - 主区 96px → 936px（840 高）
 *   - 顶部 Hero 卡：Bunny + 「今天有 N 个任务，预计 X 分钟」
 *   - 任务列表垂直栈，每张卡：✓/○ 状态图标 + 标题 + 时长 + 开始按钮
 *   - 底部 CTA：查看 AI 推荐理由
 *
 * 状态管理：
 *   - useState 控制每条任务是否完成（点击"开始"即标记完成）
 *   - 进度 = completed / total
 */

type TaskKey = 'warmup' | 'story' | 'newchar' | 'readalong' | 'game';

interface TaskDef {
  key: TaskKey;
  emoji: string;
  tone: 'butter' | 'mint' | 'sky' | 'lavender' | 'pink';
  title: string;
  subtitle: string;
  durationMin: number;
  /** 跳转路径（开始按钮的 onClick） */
  href: string;
}

const TASKS: TaskDef[] = [
  {
    key: 'warmup',
    emoji: '🟡',
    tone: 'butter',
    title: '热身',
    subtitle: '复习「山、木、林」',
    durationMin: 3,
    href: '/characters',
  },
  {
    key: 'story',
    emoji: '🟢',
    tone: 'mint',
    title: '绘本',
    subtitle: '读《小兔子找妈妈》第 3-5 页',
    durationMin: 5,
    href: '/story',
  },
  {
    key: 'newchar',
    emoji: '🔵',
    tone: 'sky',
    title: '新字',
    subtitle: '探索「森」',
    durationMin: 3,
    href: '/characters',
  },
  {
    key: 'readalong',
    emoji: '🟣',
    tone: 'lavender',
    title: '跟读',
    subtitle: '读 2 句话',
    durationMin: 2,
    href: '/readalong',
  },
  {
    key: 'game',
    emoji: '🩷',
    tone: 'pink',
    title: '游戏',
    subtitle: '森林寻宝',
    durationMin: 2,
    href: '/game',
  },
];

function StatusDot({ done }: { done: boolean }) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
      <circle
        cx="22"
        cy="22"
        r="18"
        fill={done ? 'var(--bunny-mint-deep)' : '#FFFFFF'}
        stroke={done ? 'var(--bunny-mint-deep)' : 'var(--bunny-soft-ink)'}
        strokeWidth="3"
      />
      {done && (
        <path
          d="M 13 22 L 19 28 L 31 16"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function toneVar(tone: TaskDef['tone']): string {
  switch (tone) {
    case 'butter':   return 'var(--bunny-butter)';
    case 'mint':     return 'var(--bunny-mint)';
    case 'sky':      return 'var(--bunny-sky)';
    case 'lavender': return 'var(--bunny-lavender)';
    case 'pink':     return 'var(--bunny-pink)';
  }
}

function toneInkVar(tone: TaskDef['tone']): string {
  switch (tone) {
    case 'butter':   return 'var(--bunny-amber-deep)';
    case 'mint':     return 'var(--bunny-green-deep)';
    case 'sky':      return 'var(--bunny-blue-deep)';
    case 'lavender': return 'var(--bunny-lavender-deep)';
    case 'pink':     return 'var(--bunny-pink-deep)';
  }
}

export function DailyPlanPage() {
  const navigate = useNavigate();
  const { characters } = useContent();
  const { profile } = useLearner();
  const { playCue, playText } = useAudio();
  const childName = profile.displayName || '妙妙';

  const [completed, setCompleted] = useState<Record<TaskKey, boolean>>({
    warmup: false,
    story: false,
    newchar: false,
    readalong: false,
    game: false,
  });

  const totalMinutes = TASKS.reduce((s, t) => s + t.durationMin, 0);
  const completedCount = TASKS.filter((t) => completed[t.key]).length;
  const allDone = completedCount === TASKS.length;

  /**
   * 妙妙的「待学习字」按以下优先级：
   *   1. assessment 测出来不认识的字（unknownCharacterIds）
   *   2. tier-a 象形字里还没 master 的字（入门最优）
   *   3. 全部 tier-A 里还没 master 的字
   * 找不到则退回到前 3 个 tier-A。
   */
  const unknownList = useMemo(() => {
    const masterSet = new Set(
      Object.entries(profile.mastery)
        .filter(([, m]) => m.state === 'mastered')
        .map(([id]) => id),
    );
    const fromAssessment = profile.assessment?.unknownCharacterIds ?? [];
    if (fromAssessment.length > 0) {
      return fromAssessment
        .map((id) => characters.find((c) => c.id === id))
        .filter(Boolean) as Character[];
    }
    return (characters as Character[])
      .filter((c) => c.tier === 'A' && !masterSet.has(c.id))
      .slice(0, 6);
  }, [characters, profile.assessment, profile.mastery]);

  // 检测结果估算的待学习量（基于 304 字 L1 一年级）
  const unknownCount = unknownList.length;
  const totalL1 = characters.length;

  // 找几个会在 warmup 中复习的字：
  //   - 妙妙还没掌握的 3 字（学习入口）
  //   - 如果未掌握 <3，加 妙妙已掌握的（复习）补到 3
  const warmupChars = useMemo(() => {
    const picked = unknownList.slice(0, 3);
    if (picked.length < 3) {
      const masterSet = new Set(
        Object.entries(profile.mastery)
          .filter(([, m]) => m.state === 'mastered')
          .map(([id]) => id),
      );
      const review = characters.filter((c) => masterSet.has(c.id) && !picked.find((p) => p.id === c.id));
      picked.push(...review.slice(0, 3 - picked.length));
    }
    return picked;
  }, [unknownList, characters, profile.mastery]);

  // 新字 = unknownList 里第一个还没 master 的字
  const newChar = unknownList[0];
  const newCharLabel = newChar?.glyph ?? '森';

  // 当妙妙已掌握所有 L1 字时的"通关庆祝"
  const allMastered = unknownList.length === 0 && characters.length > 0;

  // 动态生成任务列表
  const dynamicTasks: TaskDef[] = useMemo(() => [
    {
      key: 'warmup',
      emoji: '🟡',
      tone: 'butter',
      title: '热身 · 复习字',
      subtitle: warmupChars.length > 0
        ? `复习 ${warmupChars.map((c) => c.glyph).join('、')}`
        : '今天没有要复习的字啦',
      durationMin: 3,
      href: '/characters',
    },
    {
      key: 'story',
      emoji: '🟢',
      tone: 'mint',
      title: '绘本',
      subtitle: '读《小兔子找妈妈》第 3-5 页',
      durationMin: 5,
      href: '/story',
    },
    {
      key: 'newchar',
      emoji: '🔵',
      tone: 'sky',
      title: '新字',
      subtitle: newChar ? `探索「${newCharLabel}」${newChar.meaning?.[0] ? '（' + newChar.meaning[0] + '）' : ''}` : '今天没有新字',
      durationMin: 3,
      href: '/characters',
    },
    {
      key: 'readalong',
      emoji: '🟣',
      tone: 'lavender',
      title: '跟读',
      subtitle: '读 2 句话',
      durationMin: 2,
      href: '/readalong',
    },
    {
      key: 'game',
      emoji: '🩷',
      tone: 'pink',
      title: '游戏',
      subtitle: '森林寻宝',
      durationMin: 2,
      href: '/game',
    },
  ], [warmupChars, newChar, newCharLabel]);

  const handleStart = (task: TaskDef) => {
    playCue('reading-prompt-2').catch(() => {});
    setCompleted((prev) => ({ ...prev, [task.key]: true }));
    navigate(task.href);
  };

  const handleShowReason = () => {
    const reason = newChar
      ? `${childName} 今天先复习 ${warmupChars.map((c) => c.glyph).join('、')}，再探索新字「${newChar.glyph}」${newChar.meaning?.[0] ? '（' + newChar.meaning[0] + '）' : ''}，最后玩个小游戏放松一下。`
      : `${childName} 已经认识所有 L1 一年级的 ${totalL1} 个字啦，可以玩个小游戏轻松一下。`;
    playText(reason).catch(() => {});
    alert(reason);
  };

  // 检测结果未做时，引导去测
  if (!profile.assessment) {
    return (
      <div className="page-daily">
        <TopBar title="今日学习计划" subtitle={`${childName}，先做一次识字量小测试`} />
        <main className="page-daily__main">
          <Card variant="butter" padding={28} className="daily-hero">
            <div className="daily-hero__bunny">
              <Bunny pose="idle" size={140} />
            </div>
            <div className="daily-hero__text">
              <h2 className="daily-hero__title">先认识一下{childName}</h2>
              <p className="daily-hero__caption">Bunny 想先用 30 题小测试，看{childName}已经认识哪些字。这样才能给{childName}定制最合适的课程。</p>
              <div style={{ marginTop: 14 }}>
                <Button variant="red" size="lg" leading="🎯" onClick={() => navigate('/assessment')}>开始识字量测试</Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (allMastered) {
    return (
      <div className="page-daily">
        <TopBar title={`${childName}的今日学习`} subtitle={`${childName}已经把 L1 一年级的 ${characters.length} 个字都认识啦`} />
        <main className="page-daily__main">
          <Card variant="mint" padding={32} className="daily-hero" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Bunny pose="cheering" size={200} />
            <h2 className="daily-hero__title" style={{ fontSize: 32, marginTop: 16 }}>🎉 {childName}把 L1 一年级的 {characters.length} 个字都认识啦！</h2>
            <p className="daily-hero__caption" style={{ marginTop: 12, fontSize: 16, lineHeight: 1.7 }}>
              恭喜{childName}！Bunny 准备带你进入 L2 课程，认识更多汉字，读更长的故事。
            </p>
            <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button variant="red" size="lg" leading="📚" onClick={() => navigate('/story')}>读新故事</Button>
              <Button variant="mint" size="lg" leading="🎮" onClick={() => navigate('/game')}>玩游戏</Button>
              <Button variant="lavender" size="lg" leading="🌱" onClick={() => navigate('/assessment')}>重测识字量</Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="page-daily">
      <TopBar
        title={`${childName}的今日学习`}
        subtitle="根据妙妙的识字量，Bunny 为你定制"
      />

      <main className="page-daily__main">
        {/* Hero 卡：Bunny + 文案 */}
        <Card variant="butter" padding={20} shadow="soft" className="daily-hero">
          <div className="daily-hero__bunny">
            <Bunny pose="cheering" size={140} />
          </div>
          <div className="daily-hero__text">
            <h2 className="daily-hero__title">
              {childName}今天有 {dynamicTasks.length} 个任务，预计 {totalMinutes} 分钟
            </h2>
            <p className="daily-hero__caption">
              完成 {completedCount}/{dynamicTasks.length} ·
              {allDone ? ` ${childName}全部完成啦，可以休息啦` : ' 还差 ' + (dynamicTasks.length - completedCount) + ' 个'}
            </p>
            {/* 顶部进度条 */}
            <div className="daily-hero__bar">
              <div
                className="daily-hero__bar-fill"
                style={{ width: `${(completedCount / dynamicTasks.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 复习字预览 */}
          {warmupChars.length > 0 && (
            <div className="daily-hero__chars">
              {warmupChars.map((c) => (
                <span key={c.id} className="daily-hero__char-chip">{c.glyph}</span>
              ))}
            </div>
          )}
        </Card>

        {/* 任务列表 */}
        <ul className="daily-tasks">
          {dynamicTasks.map((task, idx) => {
            const done = completed[task.key];
            return (
              <li key={task.key} className={`daily-task ${done ? 'is-done' : ''}`}>
                <div className="daily-task__index">{idx + 1}</div>
                <div
                  className="daily-task__swatch"
                  style={{ background: toneVar(task.tone) }}
                  aria-hidden
                />
                <StatusDot done={done} />
                <div className="daily-task__body">
                  <div className="daily-task__title">
                    <span className="daily-task__emoji">{task.emoji}</span>
                    <span style={{ color: toneInkVar(task.tone) }}>{task.title}</span>
                    <span className="daily-task__duration">{task.durationMin} min</span>
                  </div>
                  <div className="daily-task__subtitle">{task.subtitle}</div>
                </div>
                <Button
                  variant={done ? 'ghost' : 'primary'}
                  size="md"
                  onClick={() => handleStart(task)}
                  aria-label={`开始 ${task.title}`}
                >
                  {done ? '再看一次' : '开始'}
                </Button>
              </li>
            );
          })}
        </ul>

        {/* 底部 CTA */}
        <div className="daily-footer">
          {allDone ? (
            <div style={{
              padding: '20px 24px',
              borderRadius: 22,
              background: 'linear-gradient(90deg, var(--bunny-mint) 0%, var(--bunny-butter) 100%)',
              display: 'flex', alignItems: 'center', gap: 16,
              boxShadow: 'var(--shadow-pop)',
            }}>
              <Bunny pose="cheering" size={64} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--bunny-green-deep)' }}>
                  🎉 {childName}今天任务全部完成！
                </div>
                <div style={{ fontSize: 13, color: 'var(--bunny-ink)', marginTop: 2 }}>
                  太棒啦！明天见～
                </div>
              </div>
              <Button variant="red" size="md" onClick={() => { setCompleted({ warmup: false, story: false, newchar: false, readalong: false, game: false }); }}>
                再玩一轮
              </Button>
            </div>
          ) : (
            <Button
              variant="lavender"
              size="lg"
              block
              onClick={handleShowReason}
              leading="✨"
            >
              查看 AI 推荐理由
            </Button>
          )}
        </div>
      </main>

      <style>{`
        .page-daily {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
        }
        .page-daily__main {
          position: absolute;
          top: 96px;
          left: 0;
          right: 0;
          bottom: 88px;
          padding: 24px 32px 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ----- Hero ----- */
        .daily-hero {
          display: flex;
          align-items: center;
          gap: 20px;
          min-height: 140px;
        }
        .daily-hero__bunny {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 140px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 32px;
        }
        .daily-hero__text { flex: 1; min-width: 0; }
        .daily-hero__title {
          font-size: 22px;
          margin: 0 0 6px;
          color: var(--bunny-amber-deep);
        }
        .daily-hero__caption {
          font-size: 14px;
          color: var(--bunny-soft-ink);
          margin: 0 0 10px;
        }
        .daily-hero__bar {
          width: 100%;
          height: 12px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 999px;
          overflow: hidden;
        }
        .daily-hero__bar-fill {
          height: 100%;
          background: var(--bunny-mint-deep);
          border-radius: 999px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .daily-hero__chars {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
          justify-content: center;
          padding: 0 8px;
        }
        .daily-hero__char-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: #FFFFFF;
          border: 2px solid var(--bunny-border);
          border-radius: 14px;
          font-size: 26px;
          font-weight: 700;
          color: var(--bunny-ink);
          box-shadow: var(--shadow-soft);
        }

        /* ----- Task list ----- */
        .daily-tasks {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .daily-task {
          display: grid;
          grid-template-columns: 28px 8px 44px 1fr auto;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: linear-gradient(180deg, #FFFFFF 0%, var(--bunny-cream) 100%);
          border: 2px solid var(--bunny-border);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-soft);
          min-height: 84px;
        }
        .daily-task.is-done { opacity: 0.78; }
        .daily-task__index {
          font-size: 18px;
          font-weight: 700;
          color: var(--bunny-soft-ink);
          text-align: center;
        }
        .daily-task__swatch {
          width: 8px;
          height: 56px;
          border-radius: 4px;
        }
        .daily-task__body { min-width: 0; }
        .daily-task__title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 700;
        }
        .daily-task__emoji { font-size: 18px; }
        .daily-task__duration {
          margin-left: auto;
          font-size: 12px;
          font-weight: 700;
          color: var(--bunny-soft-ink);
          background: rgba(255, 255, 255, 0.7);
          padding: 4px 10px;
          border-radius: 999px;
        }
        .daily-task__subtitle {
          margin-top: 2px;
          font-size: 14px;
          color: var(--bunny-soft-ink);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ----- Footer ----- */
        .daily-footer { margin-top: auto; padding-top: 8px; }
      `}</style>
    </div>
  );
}

export default DailyPlanPage;