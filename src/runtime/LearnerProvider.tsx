import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CharacterMastery, MasteryState, LearnerProfile, SkillProfile, BunnyEvent, AssessmentResult } from '../domain/types';

/**
 * LearnerProvider · 学习者状态
 *
 * - 默认 localStorage 持久化（key = 'bunny.learner'）
 * - 内置事件总线 emit()
 * - 暴露完整的 Learner Model 给页面订阅
 *
 * 关键方法：
 *   - recordEvent(BunnyEvent) — 记录埋点
 *   - markCharacterExposed(id) — 触发 Sprout 状态
 *   - markCharacterCorrect(id) — 升级状态
 *   - getMastery(id) — 查询掌握度
 */

const STORAGE_KEY = 'bunny.learner.v1';

const DEFAULT_PROFILE: LearnerProfile = {
  id: 'default',
  displayName: '妙妙',
  bunnyLevel: 1,
  masteredCount: 0,
  learnedCount: 0,
  streakDays: 0,
  skills: { literacy: 0, reading: 0, expression: 0, writing: 0 },
  mastery: {},
  dailyStats: [],
  badges: [],
};

function loadProfile(): LearnerProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_PROFILE;
}

function saveProfile(p: LearnerProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {}
}

// 事件总线：本地 listener 模式；生产可接埋点 SDK
type Listener = (e: BunnyEvent) => void;
const listeners = new Set<Listener>();

export function onLearnerEvent(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

interface LearnerContextValue {
  profile: LearnerProfile;
  recordEvent: (e: BunnyEvent) => void;
  markCharacterExposed: (characterId: string) => void;
  markCharacterCorrect: (characterId: string) => void;
  markCharacterMastered: (characterId: string) => void;
  setLearnerName: (name: string) => void;
  recordAssessment: (result: Omit<AssessmentResult, 'testedAt'>) => void;
  checkInToday: () => { changed: boolean; streak: number };
  getMastery: (characterId: string) => CharacterMastery | undefined;
}

const LearnerContext = createContext<LearnerContextValue | null>(null);

const STATE_ORDER: MasteryState[] = [
  'unknown',
  'exposed',
  'heard',
  'recognized',
  'understood',
  'used',
  'read',
  'mastered',
];

function bumpMastery(m: CharacterMastery | undefined, correct: boolean): CharacterMastery {
  const base: CharacterMastery = m ?? {
    characterId: m?.characterId ?? '',
    state: 'unknown',
    sproutLevel: 0,
    exposures: 0,
  };
  const next = { ...base };
  next.exposures++;
  if (correct) {
    const idx = STATE_ORDER.indexOf(next.state);
    const newIdx = Math.min(idx + 1, STATE_ORDER.length - 1);
    next.state = STATE_ORDER[newIdx];
    next.sproutLevel = Math.min(3, next.sproutLevel + 1) as 0 | 1 | 2 | 3;
    next.lastSeenAt = Date.now();
    next.correctRate = ((next.correctRate ?? 0) * (next.exposures - 1) + 1) / next.exposures;
  }
  return next;
}

export function LearnerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<LearnerProfile>(() => loadProfile());

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const recordEvent = useCallback((e: BunnyEvent) => {
    listeners.forEach((l) => {
      try { l(e); } catch {}
    });
  }, []);

  const markCharacterExposed = useCallback((characterId: string) => {
    setProfile((p) => {
      const next = { ...p, mastery: { ...p.mastery } };
      const cur = next.mastery[characterId];
      if (!cur) {
        next.mastery[characterId] = {
          characterId,
          state: 'exposed',
          sproutLevel: 1,
          exposures: 1,
          lastSeenAt: Date.now(),
        };
        next.learnedCount = Object.keys(next.mastery).length;
      } else {
        next.mastery[characterId] = bumpMastery(cur, false);
      }
      return next;
    });
    recordEvent({ type: 'CHARACTER_EXPOSED', at: Date.now(), characterId });
  }, [recordEvent]);

  const markCharacterCorrect = useCallback((characterId: string) => {
    setProfile((p) => {
      const next = { ...p, mastery: { ...p.mastery } };
      const cur = next.mastery[characterId];
      const wasMastered = cur?.state === 'mastered';
      next.mastery[characterId] = bumpMastery(cur, true);
      if (!cur) next.learnedCount = Object.keys(next.mastery).length;
      if (!wasMastered && next.mastery[characterId].state === 'mastered') {
        next.masteredCount = Object.values(next.mastery).filter(
          (m) => m.state === 'mastered',
        ).length;
      }
      return next;
    });
  }, []);

  /**
    markCharacterMastered — 直接把一个字设为「已掌握」。
    用于识字量检测后，把妙妙已认识的字直接标为 mastered，
    不再让她在课程里重复学。
   */
  const markCharacterMastered = useCallback((characterId: string) => {
    setProfile((p) => {
      const next = { ...p, mastery: { ...p.mastery } };
      const cur = next.mastery[characterId];
      if (cur?.state === 'mastered') return next;
      const wasAny = !!cur;
      next.mastery[characterId] = {
        characterId,
        state: 'mastered',
        sproutLevel: 3,
        exposures: wasAny ? cur.exposures : 1,
        lastSeenAt: Date.now(),
        correctRate: 1,
      };
      if (!wasAny) next.learnedCount = Object.keys(next.mastery).length;
      next.masteredCount = Object.values(next.mastery).filter(
        (m) => m.state === 'mastered',
      ).length;
      return next;
    });
  }, []);

  /**
    setLearnerName — 改妙妙的名字（默认是「妙妙」）。
    可用于家长改昵称 / 多孩子共用。
   */
  const setLearnerName = useCallback((name: string) => {
    setProfile((p) => ({ ...p, displayName: name || '妙妙' }));
  }, []);

  /**
    recordAssessment — 保存识字量检测结果，并把「认识」的字直接标 mastered。
    assessment 完成后，Bunny 会把剩下不认识的字当作「待学习列表」进入课程。
   */
  const recordAssessment = useCallback(
    (result: Omit<AssessmentResult, 'testedAt'>) => {
      setProfile((p) => {
        const next = { ...p, mastery: { ...p.mastery } };
        // 把已认识的字标 mastered
        for (const id of result.knownCharacterIds) {
          if (!next.mastery[id] || next.mastery[id].state !== 'mastered') {
            next.mastery[id] = {
              characterId: id,
              state: 'mastered',
              sproutLevel: 3,
              exposures: 1,
              lastSeenAt: Date.now(),
              correctRate: 1,
            };
          }
        }
        next.masteredCount = Object.values(next.mastery).filter(
          (m) => m.state === 'mastered',
        ).length;
        next.learnedCount = Object.keys(next.mastery).length;
        next.assessment = { ...result, testedAt: Date.now() };
        return next;
      });
      recordEvent({ type: 'CONTENT_COMPLETE', at: Date.now(), contentId: 'assessment' });
    },
    [recordEvent],
  );

  const getMastery = useCallback(
    (characterId: string) => profile.mastery[characterId],
    [profile],
  );

  /**
    checkInToday — 妙妙每日打卡。
    - 今日已打卡 → 返回 changed:false
    - 昨日已打卡 → streak +1
    - 跨天/首次打卡 → streak 重置为 1
  */
  const checkInToday = useCallback((): { changed: boolean; streak: number } => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400_000).toISOString().slice(0, 10);
    const last = profile.lastCheckInDate;
    if (last === today) return { changed: false, streak: profile.streakDays };
    let newStreak: number;
    if (last === yesterday) {
      newStreak = Math.max(1, profile.streakDays + 1);
    } else {
      newStreak = 1;
    }
    setProfile((p) => ({
      ...p,
      streakDays: newStreak,
      lastCheckInDate: today,
    }));
    recordEvent({ type: 'CONTENT_COMPLETE', at: Date.now(), contentId: 'daily-checkin' });
    return { changed: true, streak: newStreak };
  }, [profile.lastCheckInDate, profile.streakDays, recordEvent]);

  const value = useMemo<LearnerContextValue>(() => ({
    profile,
    recordEvent,
    markCharacterExposed,
    markCharacterCorrect,
    markCharacterMastered,
    setLearnerName,
    recordAssessment,
    checkInToday,
    getMastery,
  }), [profile, recordEvent, markCharacterExposed, markCharacterCorrect, markCharacterMastered, setLearnerName, recordAssessment, checkInToday, getMastery]);

  return (
    <LearnerContext.Provider value={value}>
      {children}
    </LearnerContext.Provider>
  );
}

export function useLearner(): LearnerContextValue {
  const ctx = useContext(LearnerContext);
  if (!ctx) throw new Error('useLearner must be used inside <LearnerProvider>');
  return ctx;
}