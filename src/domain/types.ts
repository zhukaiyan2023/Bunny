/**
 * Bunny · 领域类型（Content DSL + Learner Model）
 *
 * 这是 MASTER_PLAN.md 9+1 维度学习节点的 TypeScript 投影。
 * 所有 Content loader / Runtime engine 都消费这套 schema。
 *
 * 注意：
 *   - 不允许引入与运行时无关的字段
 *   - 可选字段用 `?:`；不要用 `| null` 表示"缺省"
 *   - 拼音必须字符串数组（多音字场景）
 *   - 字 id 用 kebab-case
 */

// ============================================================================
// CHARACTER  · 汉字学习节点（每个汉字 = 一棵苗 / 一朵花 / 一颗果）
// ============================================================================

export type CharacterTier = 'A' | 'B' | 'C' | 'D';
export type CharacterType =
  | 'pictograph'      // 象形
  | 'ideogram'        // 会意
  | 'phonetic'        // 形声
  | 'compound';       // 复合

export interface CharacterOrigin {
  /** 简短字源描述（事实层） */
  fact: string;
  /** 儿童化故事版（情感层） */
  story: string;
  /** 字形演变步骤（古文字 → 今文字） */
  evolution?: string[];
}

export interface Character {
  id: string;                // e.g. "char-shan"
  glyph: string;             // e.g. "山"
  pinyin: string[];          // e.g. ["shān"]
  tone: number;              // 1-4
  meaning: string[];         // 释义（简版）
  radical?: string;
  strokes: number;
  tier: CharacterTier;
  type: CharacterType;
  origin: CharacterOrigin;
  words: string[];           // 词语 id list
  sentenceIds?: string[];
  storyIds?: string[];
  gameIds?: string[];
  /** 所属主题岛（3000 字骨架），用于面板 07 / 08 的可视化 */
  island?: IslandId;
}

export type IslandId =
  | 'starter'      // 起步（高频字 50）
  | 'family'       // 家
  | 'animals'      // 动物
  | 'plants'       // 植物
  | 'body'         // 身体
  | 'actions'      // 动作
  | 'colors'       // 颜色
  | 'nature'       // 自然
  | 'numbers'      // 数字
  | 'stories'      // 故事 / 汉字家族
  ;

export interface Island {
  id: IslandId;
  title: string;
  emoji: string;
  color: 'mint' | 'butter' | 'pink' | 'sky' | 'lavender' | 'cream';
  /** 本岛字数（教学容量） */
  capacity: number;
}

// ============================================================================
// STORY · 互动绘本
// ============================================================================

export interface StoryPage {
  pageNumber: number;
  /** 该页音频 id（在 audio manifest 里） */
  audioId: string;
  /** 该页正文（一句或多句） */
  text: string;
  /** 该页背景图（占位：emoji；真实：minimax 生成的插画 url） */
  background?: string;
  /** 该页出现的汉字 id（用于点击字 → 字卡） */
  characterIds: string[];
  /** 该页可点击角色位置（用于"和 Bunny 对读"） */
  characters?: StoryCharacter[];
}

export interface StoryCharacter {
  /** 角色名 */
  name: string;
  /** 角色头像 emoji / 资产 id */
  avatar: string;
  /** 该页朗读文本（用于对读模式） */
  speech?: string;
  /** 屏幕位置 */
  x: number;
  y: number;
}

export interface Story {
  id: string;
  title: string;
  coverEmoji: string;
  /** 难度等级 1-3，3-6 岁只显示 Lv.1 */
  level: 1 | 2 | 3;
  /** 该绘本主题岛 */
  island: IslandId;
  /** 该绘本核心汉字 */
  coreCharacterIds: string[];
  pages: StoryPage[];
  /** 推荐阅读年龄 */
  ageMin: number;
  ageMax: number;
}

// ============================================================================
// GAME · 游戏定义（DSL）
// ============================================================================

export type GameType =
  | 'find_character'   // 找字
  | 'listen_choose'    // 听音选字
  | 'image_match'      // 图文配对
  | 'match_word'       // 词语配对
  | 'fishing'          // 汉字钓鱼
  | 'treasure'         // 寻宝
  | 'build'            // 拼字
  | 'sentence_order'   // 句子排序
  | 'reading_puzzle';  // 阅读解谜

export interface GameDefinition {
  id: string;
  type: GameType;
  title: string;
  emoji: string;
  /** 适用年龄段 */
  ageMin: number;
  ageMax: number;
  /** 该游戏主题岛 */
  island: IslandId;
  /** 关卡（1+） */
  rounds: GameRound[];
}

export interface GameRound {
  /** 目标汉字 id 列表 */
  targetCharacterIds: string[];
  /** 干扰项汉字 id 列表 */
  distractorCharacterIds: string[];
  /** 题目文字提示 */
  prompt: string;
  /** 该关关联故事 id（可选） */
  storyId?: string;
}

// ============================================================================
// AUDIO · 音频 cue 清单
// ============================================================================

export type AudioKind =
  | 'welcome'           // Bunny 问候
  | 'praise'            // 鼓励 / 表扬
  | 'world'             // 世界导航
  | 'reading'           // 跟读提示
  | 'character'         // 单字发音
  | 'museum'            // 字源故事旁白
  | 'story';            // 绘本旁白

export interface AudioCue {
  id: string;
  kind: AudioKind;
  /** 朗读文本 */
  text: string;
  /** 资源 url（占位：/assets/audio/l0/welcome/welcome-1.mp3） */
  url: string;
  /** 关联内容 id */
  refId?: string;
}

// ============================================================================
// LEARNER · 学习者状态
// ============================================================================

export type MasteryState =
  | 'unknown'      // UNKNOWN
  | 'exposed'      // EXPOSED (遇到过)
  | 'heard'        // HEARD
  | 'recognized'   // RECOGNIZED
  | 'understood'   // UNDERSTOOD
  | 'used'         // USED
  | 'read'         // READ
  | 'mastered';    // MASTERED

export interface CharacterMastery {
  characterId: string;
  state: MasteryState;
  /** 当前主题岛进度（0=种子，1=苗，2=花，3=果） */
  sproutLevel: 0 | 1 | 2 | 3;
  /** 上次见到的时间戳（ms） */
  lastSeenAt?: number;
  /** 见过次数 */
  exposures: number;
  /** 复习正确率 */
  correctRate?: number;
}

export interface SkillProfile {
  /** 识字能力 0..100 */
  literacy: number;
  /** 阅读能力 0..100 */
  reading: number;
  /** 表达能力 0..100 */
  expression: number;
  /** 书写能力 0..100 */
  writing: number;
}

export interface DailyStats {
  date: string;            // YYYY-MM-DD
  newCharacters: number;
  storiesRead: number;
  gamesPlayed: number;
  readAlongMinutes: number;
}

export interface LearnerProfile {
  id: string;
  displayName: string;
  /** 当前 Bunny Level（1-30） */
  bunnyLevel: number;
  /** 累计掌握汉字 */
  masteredCount: number;
  /** 已学汉字 */
  learnedCount: number;
  /** 连续学习天数 */
  streakDays: number;
  /** 4 项能力线 */
  skills: SkillProfile;
  /** 每个汉字掌握度 */
  mastery: Record<string, CharacterMastery>;
  /** 最近 30 天每日统计 */
  dailyStats: DailyStats[];
  /** 已获奖励 / 勋章 */
  badges: string[];
}

// ============================================================================
// CONTENT PACK · 启动时一次性载入的全部内容
// ============================================================================

export interface ContentPack {
  /** 主题岛列表（10 个，固定） */
  islands: Island[];
  /** 全部汉字 */
  characters: Character[];
  /** 字 id → Character 索引 */
  charactersById: Record<string, Character>;
  /** 全部绘本 */
  stories: Story[];
  /** 全部游戏 */
  games: GameDefinition[];
  /** 全部音频 cue */
  audio: AudioCue[];
  /** 元数据 */
  meta: {
    version: string;
    level: 'l0' | 'l1' | 'l2';
    builtAt: string;
  };
}

// ============================================================================
// EVENT · 统一事件埋点
// ============================================================================

export type BunnyEvent =
  | { type: 'SESSION_START';  at: number }
  | { type: 'STORY_OPEN';     at: number; storyId: string }
  | { type: 'PAGE_VIEW';      at: number; storyId: string; page: number }
  | { type: 'CHARACTER_EXPOSED'; at: number; characterId: string }
  | { type: 'CHARACTER_CLICKED'; at: number; characterId: string }
  | { type: 'CHARACTER_EXPLANATION_OPEN'; at: number; characterId: string }
  | { type: 'AUDIO_PLAY';     at: number; cueId: string }
  | { type: 'READ_START';     at: number; storyId: string; page: number }
  | { type: 'READ_RESULT';    at: number; storyId: string; page: number; correct: boolean }
  | { type: 'GAME_START';     at: number; gameId: string }
  | { type: 'GAME_RESULT';    at: number; gameId: string; correct: boolean; durationMs: number }
  | { type: 'REVIEW_START';   at: number; characterIds: string[] }
  | { type: 'REVIEW_RESULT';  at: number; correct: number; total: number }
  | { type: 'SKILL_UPDATED';  at: number; skill: keyof SkillProfile }
  | { type: 'LEVEL_UP';       at: number; from: number; to: number }
  | { type: 'CONTENT_COMPLETE'; at: number; contentId: string }
  | { type: 'REWARD_GRANTED'; at: number; rewardId: string };