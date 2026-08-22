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

  // 找几个会在 warmup 中复习的字（山、木、林）
  const warmupChars: Character[] = useMemo(() => {
    const ids = ['char-shan', 'char-mu', 'char-lin'];
    const found = ids
      .map((id) => characters.find((c) => c.id === id))
      .filter(Boolean) as Character[];
    return found.slice(0, 3);
  }, [characters]);

  const handleStart = (task: TaskDef) => {
    playCue('reading-prompt-2').catch(() => {});
    setCompleted((prev) => ({ ...prev, [task.key]: true }));
    navigate(task.href);
  };

  const handleShowReason = () => {
    const reason = `${profile.displayName} 今天先复习再探索，「森」字今天第一次见面，所以 Bunny 把它放在第 3 步。`;
    playText(reason).catch(() => {});
    alert(reason);
  };

  return (
    <div className="page-daily">
      <TopBar
        title="今日学习计划"
        subtitle="根据你的学习习惯，Bunny 为你定制"
      />

      <main className="page-daily__main">
        {/* Hero 卡：Bunny + 文案 */}
        <Card variant="butter" padding={20} shadow="soft" className="daily-hero">
          <div className="daily-hero__bunny">
            <Bunny pose="cheering" size={140} />
          </div>
          <div className="daily-hero__text">
            <h2 className="daily-hero__title">
              今天有 {TASKS.length} 个任务，预计 {totalMinutes} 分钟
            </h2>
            <p className="daily-hero__caption">
              完成 {completedCount}/{TASKS.length} ·
              {allDone ? ' 全部完成啦，可以休息啦' : ' 还差 ' + (TASKS.length - completedCount) + ' 个'}
            </p>
            {/* 顶部进度条 */}
            <div className="daily-hero__bar">
              <div
                className="daily-hero__bar-fill"
                style={{ width: `${(completedCount / TASKS.length) * 100}%` }}
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
          {TASKS.map((task, idx) => {
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
          <Button
            variant="lavender"
            size="lg"
            block
            onClick={handleShowReason}
            leading="✨"
          >
            查看 AI 推荐理由
          </Button>
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