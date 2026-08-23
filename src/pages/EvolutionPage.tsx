import { TopBar } from '../components/shell/TopBar';
import { Bunny } from '../components/mascot/Bunny';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useLearner } from '../runtime/LearnerProvider';

interface Stage {
  age: string;
  title: string;
  subtitle: string;
  description: string;
  chars: number;
  gradient: string;
  ringColor: string;
  emoji: string;
  bunnySize: number;
}

const STAGES: Stage[] = [
  {
    age: '3 岁',
    title: '启蒙',
    subtitle: '100 字',
    description: '大 Bunny + 图 → 字',
    chars: 100,
    gradient: 'linear-gradient(160deg, #FFE9A8 0%, #FFC76B 100%)',
    ringColor: '#7A4F00',
    emoji: '🌱',
    bunnySize: 160,
  },
  {
    age: '6 岁',
    title: '入学',
    subtitle: '300 字',
    description: '教材同步 + 字源',
    chars: 300,
    gradient: 'linear-gradient(160deg, #C6F0D8 0%, #6FD7A0 100%)',
    ringColor: '#1F6A4D',
    emoji: '📚',
    bunnySize: 170,
  },
  {
    age: '9 岁',
    title: '进阶',
    subtitle: '1500 字',
    description: '偏旁 + 阅读',
    chars: 1500,
    gradient: 'linear-gradient(160deg, #B5DEFF 0%, #7CCFAF 100%)',
    ringColor: '#3F4C7A',
    emoji: '📖',
    bunnySize: 180,
  },
  {
    age: '12 岁',
    title: '自由',
    subtitle: '3000 字',
    description: '原创故事 + 文化',
    chars: 3000,
    gradient: 'linear-gradient(160deg, #D9C2F0 0%, #FFC1CC 100%)',
    ringColor: '#7B5EAB',
    emoji: '👑',
    bunnySize: 200,
  },
];

function StageCard({ stage, index }: { stage: Stage; index: number }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        minWidth: 240,
        flex: 1,
      }}
    >
      {/* Index badge */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: stage.gradient,
          border: '3px solid #FFFFFF',
          boxShadow: 'var(--shadow-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 800,
          color: stage.ringColor,
        }}
      >
        {index + 1}
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          flex: 1,
          borderRadius: 28,
          background: stage.gradient,
          border: '3px solid #FFFFFF',
          boxShadow: 'var(--shadow-pop)',
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          minHeight: 280,
        }}
      >
        <Bunny pose={index === 0 ? 'idle' : 'happy'} size={stage.bunnySize} />
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: stage.ringColor,
            marginTop: 4,
          }}
        >
          {stage.age} · {stage.title}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--bunny-ink)',
          }}
        >
          {stage.subtitle}
        </div>
        <div
          style={{
            fontSize: 14,
            color: stage.ringColor,
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          {stage.description}
        </div>
        <div style={{ fontSize: 36, marginTop: 4 }}>{stage.emoji}</div>
      </div>
    </div>
  );
}

export function EvolutionPage() {
  const { profile } = useLearner();
  const childName = profile.displayName || '妙妙';
  const masteredCount = Object.values(profile.mastery || {}).filter((m) => m.state === 'mastered').length;
  const learned = masteredCount;
  const stageIdx = learned < 100 ? 0 : learned < 300 ? 1 : learned < 1500 ? 2 : 3;
  const currentStage = STAGES[stageIdx];

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
        title={`${childName}的字时光机`}
        subtitle="从 3 岁到 12 岁，Bunny 陪你走过 3000 字"
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px 32px 104px',
          gap: 16,
          minHeight: 0,
          overflow: 'auto',
        }}
      >
        {/* Stage current indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            background: '#FFFFFF',
            border: '2px solid var(--bunny-border)',
            borderRadius: 28,
            padding: '14px 20px',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <Bunny pose="happy" size={88} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: 'var(--bunny-ink)',
                marginBottom: 6,
              }}
            >
              {childName}现在在 →
              <span style={{ color: currentStage.ringColor, marginLeft: 8 }}>
                {currentStage.age} · {currentStage.title}
              </span>
            </div>
            <ProgressBar
              value={Math.min(1, learned / currentStage.chars)}
              total={currentStage.chars}
              label={`${childName}本阶段进度`}
              color="mint"
              width={500}
            />
          </div>
        </div>

        {/* 4-stage timeline */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            position: 'relative',
            minHeight: 0,
          }}
        >
          {/* Timeline arrow behind */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '8%',
              right: '8%',
              height: 8,
              borderRadius: 999,
              background: 'linear-gradient(90deg, #FFE9A8 0%, #A8E6CF 30%, #B5DEFF 65%, #D9C2F0 100%)',
              zIndex: 0,
            }}
          />
          {STAGES.map((stage, i) => (
            <div key={stage.age} style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex' }}>
              <StageCard stage={stage} index={i} />
              {i < STAGES.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '38%',
                    right: -10,
                    fontSize: 36,
                    color: 'var(--bunny-soft-ink)',
                    pointerEvents: 'none',
                  }}
                >
                  ➜
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bunny encouragement */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            background: 'linear-gradient(90deg, #FFE9A8 0%, #C6F0D8 100%)',
            borderRadius: 28,
            padding: '14px 28px',
            border: '2px solid var(--bunny-border)',
            boxShadow: 'var(--shadow-soft)',
            minHeight: 88,
          }}
        >
          <Bunny pose="cheering" size={72} />
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: 'var(--bunny-green-deep)',
            }}
          >
            不要急，慢慢来 🌱 Bunny 会一直陪你。
          </div>
          <Bunny pose="idle" size={72} />
        </div>
      </div>
    </div>
  );
}

export default EvolutionPage;
