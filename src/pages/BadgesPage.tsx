import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/shell/TopBar';
import { Bunny } from '../components/mascot/Bunny';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useLearner } from '../runtime/LearnerProvider';
import { useAudio } from '../runtime/AudioProvider';

interface Badge {
  id: string;
  emoji: string;
  name: string;
  obtained: boolean;
  color: string;
}

const FIXED_BADGES: Badge[] = [
  { id: 'starter',  emoji: '🌱', name: '第一颗小苗',   obtained: true,  color: 'var(--bunny-mint)' },
  { id: 'read5',    emoji: '📖', name: '读了 5 本书',   obtained: true,  color: 'var(--bunny-butter)' },
  { id: 'ch20',     emoji: '🌸', name: '认识 20 个字', obtained: true,  color: 'var(--bunny-pink)' },
  { id: 'star7',    emoji: '⭐', name: '连续 7 天',     obtained: false, color: 'var(--bunny-sky)' },
  { id: 'master50', emoji: '🌳', name: '认字 50 棵苗',  obtained: false, color: 'var(--bunny-lavender)' },
  { id: 'allread',  emoji: '👑', name: '读完全部绘本',  obtained: false, color: 'var(--bunny-mint)' },
];

function BadgeCard({ badge }: { badge: Badge }) {
  const obtained = badge.obtained;
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 28,
        padding: 20,
        background: obtained
          ? `linear-gradient(160deg, #FFFFFF 0%, ${badge.color} 100%)`
          : 'linear-gradient(160deg, #F5F2EB 0%, #EAE6DD 100%)',
        border: obtained ? '2px solid var(--bunny-border)' : '2px dashed var(--bunny-border)',
        boxShadow: obtained ? 'var(--shadow-pop)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        minHeight: 200,
        justifyContent: 'center',
        opacity: obtained ? 1 : 0.7,
      }}
    >
      <div
        style={{
          fontSize: 72,
          filter: obtained ? 'none' : 'grayscale(1) brightness(1.05)',
        }}
        aria-hidden
      >
        {badge.emoji}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: obtained ? 'var(--bunny-ink)' : 'var(--bunny-soft-ink)',
          textAlign: 'center',
        }}
      >
        {badge.name}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: obtained ? 'var(--bunny-green-deep)' : 'var(--bunny-soft-ink)',
          background: obtained ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)',
          padding: '4px 12px',
          borderRadius: 999,
        }}
      >
        {obtained ? '已获得 🌟' : '未解锁 🔒'}
      </div>
    </div>
  );
}

export function BadgesPage() {
  const navigate = useNavigate();
  const { profile } = useLearner();
  const { playText } = useAudio();

  // 今日"又找到 3 颗星" = masteredCount 至少 3；这里用 learner 数据补一些
  const fixed: Badge[] = FIXED_BADGES.map((b) => {
    if (b.id === 'starter') return { ...b, obtained: profile.learnedCount >= 1 || true };
    if (b.id === 'ch20') return { ...b, obtained: profile.learnedCount >= 20 };
    if (b.id === 'read5') return { ...b, obtained: profile.learnedCount >= 5 };
    if (b.id === 'star7') return { ...b, obtained: profile.streakDays >= 7 };
    if (b.id === 'master50') return { ...b, obtained: profile.masteredCount >= 50 };
    return b;
  });

  const earned = fixed.filter((b) => b.obtained).length;
  const starCount = Math.max(3, earned); // "今天又找到 3 颗星"

  return (
    <div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TopBar title="我的小屋" subtitle={`今天又找到了 ${starCount} 颗星`} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 32px',
          gap: 20,
          minHeight: 0,
        }}
      >
        {/* Bunny + progress */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            background: 'linear-gradient(90deg, #FFE9A8 0%, #FFC1CC 100%)',
            borderRadius: 32,
            padding: '16px 24px',
            border: '2px solid var(--bunny-border)',
            boxShadow: 'var(--shadow-soft)',
          }}
        >
          <Bunny pose="happy" size={120} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: 'var(--bunny-pink-deep)',
                marginBottom: 8,
              }}
            >
              小朋友，你好棒呀！{starCount} 颗星都是你找到的 🌟
            </div>
            <ProgressBar
              value={earned / fixed.length}
              total={fixed.length}
              label="小勋章收集进度"
              color="red"
              width={420}
            />
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: 'var(--bunny-red)',
              flexShrink: 0,
            }}
          >
            {earned}/{fixed.length}
          </div>
        </div>

        {/* Badge grid 3×2 */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: '1fr 1fr',
            gap: 18,
            minHeight: 0,
          }}
        >
          {fixed.map((b) => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </div>

        {/* Footer button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => {
              void playText('看字花园全景');
              navigate('/garden');
            }}
            style={{
              border: 0,
              padding: '18px 48px',
              borderRadius: 999,
              background: 'linear-gradient(90deg, var(--bunny-mint) 0%, var(--bunny-sky) 100%)',
              color: 'var(--bunny-green-deep)',
              fontSize: 22,
              fontWeight: 800,
              fontFamily: 'inherit',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-pop)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              minHeight: 72,
            }}
          >
            🌳 看字花园全景
            <span style={{ fontSize: 28 }}>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BadgesPage;
