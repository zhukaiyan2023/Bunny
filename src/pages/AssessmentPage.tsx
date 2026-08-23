import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/shell/TopBar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Bunny } from '../components/mascot/Bunny';
import { useContent } from '../runtime/ContentProvider';
import { useLearner } from '../runtime/LearnerProvider';
import { useAudio } from '../runtime/AudioProvider';
import type { Character, AssessmentBand } from '../domain/types';

/**
 * AssessmentPage · 妙妙的识字量检测（/assessment）
 *
 * 设计目的：
 *   妙妙已经认识一些汉字。我们先用 30 题抽样测出她的识字量区间，
 *   然后 Bunny 根据结果给出学习路径：跳过已认识的字，
 *   把不认识的字作为「今日学习计划」的入口。
 *
 * 流程（3 步）：
 *   1) intro    — 介绍 + 「开始测试」按钮
 *   2) quiz     — 30 张字卡，每张卡点「认识 ✓」或「不认识 ✗」
 *   3) report   — 识字量区间 + 已认识 / 待学习统计 + 「开始学习」按钮
 *
 * 选字抽样：
 *   - 从 199 字 L1 内容里均匀抽 30 张
 *   - 覆盖 tier-A / tier-B / tier-C / tier-D 四个层级
 *   - 默认按 id hash 抽，确保每次跑的题目一样（可重测）
 *
 * 识字量区间：
 *   - starter     : 认识 < 50 字
 *   - beginner    : 认识 50-150 字
 *   - intermediate: 认识 150-300 字
 *   - advanced    : 认识 > 300 字（已超 L1 课程容量，进阶路线）
 *
 * 关键点：
 *   - 不允许「重置」localStorage — 用 `recordAssessment` 增量更新
 *   - 测试过程中不写入 mastery，避免污染学习进度
 *   - 测试结束一次性写入 mastery + assessment.result
 */

const SAMPLE_SIZE = 30;
const DEFAULT_NAME = '妙妙';

/** 用 id 的简单 hash 取固定子集（保证可重测） */
function hashId(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** 从 199 字 L1 课程里抽 30 个分层均匀的字 */
function sampleCharacters(pool: Character[], n: number): Character[] {
  if (pool.length <= n) return pool.slice();
  // 按 tier 排序，让抽样跨 tier
  const sorted = [...pool].sort((a, b) => (a.tier < b.tier ? -1 : 1));
  const buckets: Record<string, Character[]> = { A: [], B: [], C: [], D: [], E: [] };
  for (const c of sorted) {
    (buckets[c.tier] ??= []).push(c);
  }
  const result: Character[] = [];
  const tiers = ['A', 'B', 'C', 'D', 'E'];
  const perTier = Math.ceil(n / tiers.length);
  for (const t of tiers) {
    const arr = buckets[t] ?? [];
    if (arr.length === 0) continue;
    // 用 hash 抽 perTier 个
    const sorted = [...arr].sort((a, b) => hashId(a.id) - hashId(b.id));
    result.push(...sorted.slice(0, perTier));
  }
  // 截断到 n
  return result.slice(0, n);
}

function bandFor(known: number, total: number): AssessmentBand {
  const ratio = total > 0 ? known / total : 0;
  // 把抽样比例外推到 304 字 L1 一年级课程
  const estTotal = Math.round(ratio * 304);
  if (estTotal < 50) return 'starter';
  if (estTotal < 150) return 'beginner';
  if (estTotal < 300) return 'intermediate';
  return 'advanced';
}

const BAND_LABEL: Record<AssessmentBand, { title: string; caption: string; emoji: string; tone: string }> = {
  starter: { title: '刚起步', caption: '妙妙刚开始认字，先学最常用的 100 字', emoji: '🌱', tone: 'var(--bunny-mint)' },
  beginner: { title: '小读者', caption: '妙妙已经认识一些字，可以开始读短句了', emoji: '📖', tone: 'var(--bunny-butter)' },
  intermediate: { title: '故事大王', caption: '妙妙识字量不错，可以读小故事了', emoji: '🌟', tone: 'var(--bunny-sky)' },
  advanced: { title: '小学者', caption: '妙妙识字量丰富，要挑战更高的故事', emoji: '🏆', tone: 'var(--bunny-pink)' },
};

type Phase = 'intro' | 'quiz' | 'report';

export function AssessmentPage() {
  const navigate = useNavigate();
  const { characters } = useContent();
  const { profile, recordAssessment } = useLearner();
  const { playText } = useAudio();
  const childName = profile.displayName || DEFAULT_NAME;

  const sample = useMemo(() => sampleCharacters(characters, SAMPLE_SIZE), [characters]);
  const [phase, setPhase] = useState<Phase>('intro');
  const [idx, setIdx] = useState(0);
  const [knownIds, setKnownIds] = useState<string[]>([]);
  const [unknownIds, setUnknownIds] = useState<string[]>([]);

  const current = sample[idx];
  const progressPct = sample.length > 0 ? Math.round((idx / sample.length) * 100) : 0;

  // 每题自动念出字的读音（如果 audio 已就绪）
  useEffect(() => {
    if (phase !== 'quiz' || !current) return;
    const t = window.setTimeout(() => {
      playText(`${current.glyph}, ${current.pinyin[0]}`).catch(() => {});
    }, 480);
    return () => window.clearTimeout(t);
  }, [phase, idx, current, playText]);

  const handleStart = useCallback(() => {
    setIdx(0);
    setKnownIds([]);
    setUnknownIds([]);
    setPhase('quiz');
    playText('我们开始吧').catch(() => {});
  }, [playText]);

  const handleAnswer = useCallback(
    (known: boolean) => {
      if (!current) return;
      const id = current.id;
      setKnownIds((cur) => (known ? [...cur, id] : cur));
      setUnknownIds((cur) => (known ? cur : [...cur, id]));
      // 简短的鼓励音效
      playText(known ? '太棒了' : '没关系').catch(() => {});
      // 念出这个字（如果认识，给出正确的音；如果不认识，给一个温柔的鼓励）
      const phrase = known
        ? `${current.glyph}, ${current.pinyin[0]}`
        : `${current.glyph}, ${current.pinyin[0]}, 妙妙学一学`;
      window.setTimeout(() => playText(phrase).catch(() => {}), 360);
      // 下一题
      window.setTimeout(() => {
        setIdx((i) => {
          if (i + 1 >= sample.length) {
            setPhase('report');
            return i;
          }
          return i + 1;
        });
      }, 320);
    },
    [current, sample.length, playText],
  );

  const handleFinish = useCallback(() => {
    const band = bandFor(knownIds.length, sample.length);
    recordAssessment({
      total: sample.length,
      known: knownIds.length,
      band,
      testedCharacterIds: sample.map((c) => c.id),
      knownCharacterIds: knownIds,
      unknownCharacterIds: unknownIds,
    });
    playText('检测完成啦').catch(() => {});
    navigate('/daily');
  }, [knownIds, unknownIds, sample, recordAssessment, playText, navigate]);

  // ---- INTRO ----
  if (phase === 'intro') {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <TopBar
          title="识字量检测"
          subtitle={profile.assessment
            ? `${childName} 又来认识新字啦`
            : `${childName} 的第一次小测验`}
        />
        <main style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 48px 104px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 28, maxWidth: 1100, width: '100%' }}>
            <Card variant="soft" padding={28} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}>
              <Bunny pose="cheering" size={240} />
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--bunny-ink)', textAlign: 'center' }}>
                嗨 {profile.displayName || DEFAULT_NAME}，我们来玩个认字小测试
              </div>
              <div style={{ fontSize: 15, color: 'var(--bunny-soft-ink)', textAlign: 'center', lineHeight: 1.7 }}>
                Bunny 会给你看 30 个字<br />认识就点 ✓，不认识就点 ✗<br />Bunny 会按你的水平准备课程
              </div>
            </Card>
            <Card variant="butter" padding={28} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--bunny-amber-deep)' }}>测试小贴士</div>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 2, color: 'var(--bunny-ink)' }}>
                <li>只看一眼字，能说出读音就算认识</li>
                <li>不认识也没关系，点 ✗ 就好</li>
                <li>约 3 分钟即可完成</li>
                <li>测试结果会自动保存，下次可重新测</li>
              </ul>
              <div style={{ marginTop: 'auto', display: 'flex', gap: 12 }}>
                <Button variant="red" size="lg" leading="🎯" onClick={handleStart}>开始测试</Button>
                <Button variant="mint" size="lg" onClick={() => navigate('/')}>先不测</Button>
              </div>
              {profile.assessment && (
                <div style={{ marginTop: 8, padding: '10px 14px', borderRadius: 14, background: '#FFFFFF', fontSize: 13, color: 'var(--bunny-soft-ink)', lineHeight: 1.7 }}>
                  上次测试：{new Date(profile.assessment.testedAt).toLocaleDateString()} 认识了 {profile.assessment.known}/{profile.assessment.total}
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // ---- REPORT ----
  if (phase === 'report') {
    const band = bandFor(knownIds.length, sample.length);
    const info = BAND_LABEL[band];
    const estTotal = Math.round((knownIds.length / Math.max(1, sample.length)) * 304);
    const perfect = knownIds.length === sample.length;
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <TopBar
          title="检测报告"
          subtitle={`${profile.displayName || DEFAULT_NAME} 的识字量结果`}
        />
        <main style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 48px 104px' }}>
          <Card variant="soft" padding={36} style={{ maxWidth: 900, width: '100%', display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <Bunny pose={perfect ? 'cheering' : 'happy'} size={160} />
              <div>
                <div style={{ fontSize: 16, color: 'var(--bunny-soft-ink)', fontWeight: 700 }}>{profile.displayName || DEFAULT_NAME}的识字量</div>
                <div style={{ fontSize: 40, fontWeight: 900, color: 'var(--bunny-ink)', lineHeight: 1.1 }}>
                  {perfect ? '🎉 全对！' : `${info.emoji} ${info.title}`}
                </div>
                <div style={{ marginTop: 6, fontSize: 15, color: 'var(--bunny-soft-ink)' }}>
                  {perfect ? `${childName}太厉害啦！30 道题全都认识。` : info.caption}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              <div style={{ padding: '18px 20px', borderRadius: 18, background: 'var(--bunny-mint)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--bunny-green-deep)' }}>本次认识</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--bunny-ink)' }}>{knownIds.length} / {sample.length}</div>
                <div style={{ fontSize: 12, color: 'var(--bunny-soft-ink)' }}>抽样题</div>
              </div>
              <div style={{ padding: '18px 20px', borderRadius: 18, background: 'var(--bunny-butter)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--bunny-amber-deep)' }}>估计识字量</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--bunny-ink)' }}>~{estTotal}</div>
                <div style={{ fontSize: 12, color: 'var(--bunny-soft-ink)' }}>个汉字</div>
              </div>
              <div style={{ padding: '18px 20px', borderRadius: 18, background: 'var(--bunny-sky)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--bunny-blue-deep)' }}>待学习</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--bunny-ink)' }}>{Math.max(0, 304 - estTotal)}</div>
                <div style={{ fontSize: 12, color: 'var(--bunny-soft-ink)' }}>个字 (L1 一年级)</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--bunny-soft-ink)' }}>接下来 Bunny 会…</div>
              <ol style={{ margin: 0, paddingLeft: 20, fontSize: 15, lineHeight: 1.9, color: 'var(--bunny-ink)' }}>
                <li>把已认识的 <b>{knownIds.length}</b> 个字标记为「已掌握」，不再重复学</li>
                <li>把不认识的 <b>{unknownIds.length}</b> 个字放进「今日学习计划」</li>
                <li>从最常用的 50 字开始，按主题岛带妙妙探索</li>
              </ol>
            </div>

            {/* 字卡 recap */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--bunny-green-deep)' }}>
                ✓ 妙妙认识的字（{knownIds.length}）
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {knownIds.length === 0 && (
                  <span style={{ fontSize: 13, color: 'var(--bunny-soft-ink)' }}>（这道测试里没遇到认识的字）</span>
                )}
                {knownIds.slice(0, 18).map((id) => {
                  const c = characters.find((ch) => ch.id === id);
                  return c ? (
                    <button
                      key={id}
                      type="button"
                      title={`${c.glyph}（${c.pinyin[0]}）— 点击听读音`}
                      onClick={() => playText(`${c.glyph}, ${c.pinyin[0]}`).catch(() => {})}
                      style={{
                        padding: '6px 10px', borderRadius: 12,
                        background: 'var(--bunny-mint)', color: 'var(--bunny-green-deep)',
                        fontSize: 18, fontWeight: 900, border: 'none', cursor: 'pointer',
                        fontFamily: 'inherit', boxShadow: 'var(--shadow-soft)',
                      }}
                    >{c.glyph}</button>
                  ) : null;
                })}
                {knownIds.length > 18 && <span style={{ fontSize: 13, color: 'var(--bunny-soft-ink)', alignSelf: 'center' }}>+{knownIds.length - 18}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--bunny-red)' }}>
                ⏳ 待学习的字（{unknownIds.length}）
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {unknownIds.length === 0 && (
                  <span style={{ fontSize: 13, color: 'var(--bunny-green-deep)', fontWeight: 700 }}>🎉 都认识！妙妙太厉害啦！</span>
                )}
                {unknownIds.slice(0, 18).map((id) => {
                  const c = characters.find((ch) => ch.id === id);
                  return c ? (
                    <button
                      key={id}
                      type="button"
                      title={`${c.glyph}（${c.pinyin[0]}）— 点击听读音并跟读`}
                      onClick={() => playText(`${c.glyph}, ${c.pinyin[0]}, 妙妙跟我读`).catch(() => {})}
                      style={{
                        padding: '6px 10px', borderRadius: 12,
                        background: '#FFE4E8', color: 'var(--bunny-red)',
                        fontSize: 18, fontWeight: 900, border: 'none', cursor: 'pointer',
                        fontFamily: 'inherit', boxShadow: 'var(--shadow-soft)',
                      }}
                    >{c.glyph}</button>
                  ) : null;
                })}
                {unknownIds.length > 18 && <span style={{ fontSize: 13, color: 'var(--bunny-soft-ink)', alignSelf: 'center' }}>+{unknownIds.length - 18}</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Button variant="red" size="lg" leading="📋" onClick={handleFinish}>开始今日学习</Button>
              <Button variant="mint" size="lg" onClick={() => navigate('/')}>回首页</Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // ---- QUIZ ----
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <TopBar
        title="识字量检测"
        subtitle={`第 ${idx + 1} / ${sample.length} 题 · ${profile.displayName || DEFAULT_NAME}`}
        right={
          <div style={{ minWidth: 240, padding: '6px 14px', borderRadius: 999, background: '#FFFFFF', border: '2px solid var(--bunny-border)' }}>
            <div style={{ fontSize: 12, color: 'var(--bunny-soft-ink)', fontWeight: 700, marginBottom: 2 }}>进度</div>
            <div style={{ height: 8, background: 'var(--bunny-border)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--bunny-mint-deep)', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        }
      />
      <main style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 48px 104px' }}>
        {current ? (
          <Card variant="soft" padding={36} style={{ maxWidth: 720, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Bunny pose="idle" size={96} />
              <div style={{ fontSize: 18, color: 'var(--bunny-soft-ink)', fontWeight: 700 }}>这个字，{profile.displayName || DEFAULT_NAME}认识吗？</div>
            </div>
            <div
              style={{
                width: 280,
                height: 280,
                borderRadius: 32,
                background: '#FFFFFF',
                border: '4px solid var(--bunny-butter)',
                boxShadow: 'var(--shadow-pop)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 180,
                fontWeight: 900,
                color: 'var(--bunny-ink)',
                fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                lineHeight: 1,
                userSelect: 'none',
              }}
              aria-label={`汉字 ${current.glyph}`}
            >
              {current.glyph}
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <button
                type="button"
                onClick={() => handleAnswer(true)}
                style={{
                  width: 140, height: 96, borderRadius: 24,
                  background: 'var(--bunny-mint)', border: '3px solid var(--bunny-mint-deep)',
                  fontSize: 28, fontWeight: 900, color: 'var(--bunny-green-deep)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: 'var(--shadow-pop)', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: 36 }}>✓</span> 认识
              </button>
              <button
                type="button"
                onClick={() => handleAnswer(false)}
                style={{
                  width: 140, height: 96, borderRadius: 24,
                  background: '#FFE4E8', border: '3px solid var(--bunny-red)',
                  fontSize: 28, fontWeight: 900, color: 'var(--bunny-red)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxShadow: 'var(--shadow-pop)', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: 36 }}>✗</span> 不认识
              </button>
            </div>
          </Card>
        ) : (
          <div style={{ fontSize: 18, color: 'var(--bunny-soft-ink)' }}>加载字卡中…</div>
        )}
      </main>
    </div>
  );
}

export default AssessmentPage;