/**
 * Engines · 4 大运行时
 *
 * 这里导出占位的"运行时"接口，方便页面 import 真实业务类时不需要改动。
 * 真正的 Phaser / Audio / Story / Learning 引擎在生产代码里替换为：
 *   - src/game-runtime/PhaserGameHost.tsx
 *   - src/engines/audio/AudioEngine.ts
 *   - src/engines/story/StoryEngine.ts
 *   - src/engines/learning/LearningEngine.ts
 *
 * 当前 MVP 实现统一在 Provider 里（LearnerProvider / AudioProvider）。
 */

export type GameId = 'find_character' | 'listen_choose' | 'image_match';

export interface GameResult {
  gameId: GameId;
  correct: boolean;
  attempts: number;
  durationMs: number;
  targetCharacterIds: string[];
}

export interface StoryState {
  storyId: string;
  currentPage: number;
  totalPages: number;
  startedAt: number;
}

export type { AudioCue, MasteryState, BunnyEvent } from '../domain/types';

// 占位：MVP 阶段直接在页面里实现游戏逻辑
// 下一阶段把 React 实现迁到 Phaser.Scene
export const GameEngine = {
  name: 'Bunny Game Engine (MVP stub)',
  version: '0.1.0',
};

export const StoryEngine = {
  name: 'Bunny Story Engine (MVP stub)',
  version: '0.1.0',
};

export const LearningEngine = {
  name: 'Bunny Learning Engine (MVP stub)',
  version: '0.1.0',
};

export const AudioEngine = {
  name: 'Bunny Audio Engine (uses AudioProvider)',
  version: '0.1.0',
};