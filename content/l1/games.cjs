/**
 * L1 · 游戏定义（games DSL）
 *
 * 把内容 DSL 里的 GameDefinition 真正落到文件里，让 manifest 能 parse。
 * 当前 8 个游戏，覆盖 tier-a/b/c/d 的核心字：
 *
 *   - find-character : 看图找字（点字卡，3 选 1）
 *   - listen-choose  : 听音选字（听 cue，3 选 1）
 *   - image-match    : 图文配对（拖字到图）
 *   - match-word     : 词语配对（连字成词）
 *   - fishing        : 汉字钓鱼（场景游戏）
 *   - treasure       : 字族寻宝（会意字家族）
 *   - build          : 拼字游戏（部件合成）
 *   - sentence-order : 句子排序
 *
 * 每个游戏都有 rounds — 每 round 给一组目标字 + 干扰字。
 * 运行时（GameEngine）按用户掌握的 mastery 动态选 round。
 */

const STYLE_SUFFIX =
  '3 year old girl picture book illustration style, ' +
  'soft pastel color palette (pink mint butter lavender sky blue), ' +
  'dreamy soft warm lighting, rounded chubby shapes with no sharp edges, ' +
  '3D render with soft shadows, clean uncluttered composition, ' +
  'square 1:1 framing. ' +
  'NO text NO Chinese characters NO alphabet letters NO digits NO writing NO symbols anywhere in the image.';

/** Tier-A 14 字 + Tier-B 5 字 + Tier-C 部分字 */
const PICTO_TARGETS = [
  'char-shan', 'char-shui', 'char-huo', 'char-mu',
  'char-ri', 'char-yue', 'char-ren', 'char-kou',
  'char-mu-eye', 'char-er', 'char-shou', 'char-xin',
  'char-zu', 'char-yu',
  'char-lin', 'char-sen', 'char-ming', 'char-xiu', 'char-hao',
];

const COMMON_DISTRACTORS = [
  'char-yue', 'char-mu-eye', 'char-ren', 'char-er',
  'char-shou', 'char-shui', 'char-huo',
];

const games = [];

/**
 * Game 1：森林找字 (find_character)
 * 玩法：给出一张字卡 + 3 个图，妙妙点击"哪个图是这个字的意思"
 */
games.push({
  id: 'game-find-character',
  type: 'find_character',
  title: '森林找字',
  emoji: '🔍',
  ageMin: 3,
  ageMax: 9,
  island: 'starter',
  rounds: PICTO_TARGETS.map((id, idx) => ({
    targetCharacterIds: [id],
    distractorCharacterIds: COMMON_DISTRACTORS.slice(idx % COMMON_DISTRACTORS.length, (idx % COMMON_DISTRACTORS.length) + 2),
    prompt: '找出和图一样的字',
    storyId: idx === 0 ? 'book-xiao-tu-de-jia' : undefined,
  })),
});

/**
 * Game 2：听音选字 (listen_choose)
 * 玩法：播一个 cue，妙妙从 3 个字里选出听到的字
 */
games.push({
  id: 'game-listen-choose',
  type: 'listen_choose',
  title: 'Bunny 念哪个',
  emoji: '👂',
  ageMin: 3,
  ageMax: 9,
  island: 'starter',
  rounds: PICTO_TARGETS.map((id, idx) => ({
    targetCharacterIds: [id],
    distractorCharacterIds: COMMON_DISTRACTORS.slice((idx + 1) % COMMON_DISTRACTORS.length, (idx + 3) % COMMON_DISTRACTORS.length + 1),
    prompt: 'Bunny 念的是哪个字？',
  })),
});

/**
 * Game 3：图文配对 (image_match)
 * 玩法：3 张图 + 3 张字，妙妙把图和字连起来
 */
games.push({
  id: 'game-image-match',
  type: 'image_match',
  title: '看图找字',
  emoji: '🖼️',
  ageMin: 3,
  ageMax: 9,
  island: 'starter',
  rounds: [
    { targetCharacterIds: ['char-shan', 'char-shui', 'char-huo'], distractorCharacterIds: [], prompt: '把图和字连起来' },
    { targetCharacterIds: ['char-mu', 'char-ri', 'char-yue'], distractorCharacterIds: [], prompt: '把图和字连起来' },
    { targetCharacterIds: ['char-ren', 'char-kou', 'char-mu-eye'], distractorCharacterIds: [], prompt: '把图和字连起来' },
    { targetCharacterIds: ['char-er', 'char-shou', 'char-xin'], distractorCharacterIds: [], prompt: '把图和字连起来' },
    { targetCharacterIds: ['char-zu', 'char-yu', 'char-lin'], distractorCharacterIds: [], prompt: '把图和字连起来' },
  ],
});

/**
 * Game 4：词语配对 (match_word)
 * 玩法：给一个字，选能配成词的字
 */
games.push({
  id: 'game-match-word',
  type: 'match_word',
  title: '字宝宝配对',
  emoji: '🧩',
  ageMin: 4,
  ageMax: 9,
  island: 'starter',
  rounds: [
    { targetCharacterIds: ['char-shan'], distractorCharacterIds: ['char-shui', 'char-huo'], prompt: '哪个字能和「山」配成词？' },
    { targetCharacterIds: ['char-shui'], distractorCharacterIds: ['char-huo', 'char-mu'], prompt: '哪个字能和「水」配成词？' },
    { targetCharacterIds: ['char-huo'], distractorCharacterIds: ['char-ri', 'char-yue'], prompt: '哪个字能和「火」配成词？' },
    { targetCharacterIds: ['char-mu'], distractorCharacterIds: ['char-ren', 'char-kou'], prompt: '哪个字能和「木」配成词？' },
    { targetCharacterIds: ['char-ri'], distractorCharacterIds: ['char-yue', 'char-shui'], prompt: '哪个字能和「日」配成词？' },
  ],
});

/**
 * Game 5：汉字钓鱼 (fishing)
 * 玩法：池塘里有鱼的字卡，妙妙用"鱼竿"挑出认识的字
 */
games.push({
  id: 'game-fishing',
  type: 'fishing',
  title: '池塘钓鱼',
  emoji: '🎣',
  ageMin: 4,
  ageMax: 9,
  island: 'nature',
  rounds: PICTO_TARGETS.slice(0, 6).map((id) => ({
    targetCharacterIds: [id],
    distractorCharacterIds: COMMON_DISTRACTORS.slice(0, 3),
    prompt: '用鱼竿钓出认识的字',
  })),
});

/**
 * Game 6：字族寻宝 (treasure)
 * 玩法：会意字家族 — 把会意字的部件放进正确的"宝藏盒"
 */
games.push({
  id: 'game-treasure',
  type: 'treasure',
  title: '字族寻宝',
  emoji: '💎',
  ageMin: 5,
  ageMax: 9,
  island: 'starter',
  rounds: [
    { targetCharacterIds: ['char-lin'], distractorCharacterIds: ['char-shan', 'char-shui'], prompt: '把两个「木」放进宝藏盒，变成「林」', storyId: 'book-sen-lin-li-de-yi-tian' },
    { targetCharacterIds: ['char-sen'], distractorCharacterIds: ['char-mu', 'char-yue'], prompt: '三个「木」变成「森」' },
    { targetCharacterIds: ['char-ming'], distractorCharacterIds: ['char-ri', 'char-yue'], prompt: '「日」+「月」=「明」' },
    { targetCharacterIds: ['char-xiu'], distractorCharacterIds: ['char-ren', 'char-mu'], prompt: '「人」+「木」=「休」' },
    { targetCharacterIds: ['char-hao'], distractorCharacterIds: ['char-mu', 'char-shui'], prompt: '两个「女」变成「好」' },
  ],
});

/**
 * Game 7：拼字 (build)
 * 玩法：把部件拼成完整的字
 */
games.push({
  id: 'game-build',
  type: 'build',
  title: '拼字小工匠',
  emoji: '🔨',
  ageMin: 5,
  ageMax: 9,
  island: 'starter',
  rounds: PICTO_TARGETS.slice(0, 8).map((id, idx) => ({
    targetCharacterIds: [id],
    distractorCharacterIds: COMMON_DISTRACTORS.slice(0, 3),
    prompt: '拼出和图一样的字',
  })),
});

/**
 * Game 8：句子排序 (sentence_order)
 * 玩法：把打乱的字排成正确的句子
 */
games.push({
  id: 'game-sentence-order',
  type: 'sentence_order',
  title: '句子排排坐',
  emoji: '📜',
  ageMin: 5,
  ageMax: 9,
  island: 'starter',
  rounds: [
    { targetCharacterIds: ['char-shan', 'char-shui', 'char-huo'], distractorCharacterIds: [], prompt: '山水火，按顺序排好', storyId: 'book-xiao-tu-de-jia' },
    { targetCharacterIds: ['char-mu', 'char-ri', 'char-yue'], distractorCharacterIds: [], prompt: '木日月，按顺序排好' },
    { targetCharacterIds: ['char-ren', 'char-kou', 'char-mu-eye'], distractorCharacterIds: [], prompt: '人口目，按顺序排好', storyId: 'book-tai-yang-he-yue-liang' },
    { targetCharacterIds: ['char-lin', 'char-ming', 'char-xiu'], distractorCharacterIds: [], prompt: '林明休，按顺序排好' },
  ],
});

module.exports = {
  games,
};