/**
 * L1 · Tier-B 会意字（5 字）
 *
 * 选字原则：
 *   - 由两个 Tier-A 部件组成
 *   - 含义直观可联想
 *   - 进入"汉字家族"演示
 *
 * 🎨 风格基线：3 岁女孩适龄 pastel 绘本风格
 *
 * 🚫 严禁要求模型写中文字——模型对任何文字渲染都不可靠
 */

const STYLE_SUFFIX =
  '3 year old girl picture book illustration style, ' +
  'soft pastel color palette (pink mint butter lavender sky blue), ' +
  'dreamy soft warm lighting, rounded chubby shapes with no sharp edges, ' +
  '3D render with soft shadows, clean uncluttered composition, ' +
  'square 1:1 framing. ' +
  'NO text NO Chinese characters NO alphabet letters NO digits NO writing NO symbols anywhere in the image.';

/**
 * 为每个 Tier-B 会意字生成"部件场景"插画 prompt
 *
 * 设计原则（与 Tier-A 一致）：
 *   - 主体（部件组合后表达的含义）占画面中心 ~60%
 *   - 配套场景（草地 / 天空 / 装饰）填满整个画框
 *   - 拟人化克制
 *   - 不出现 Bunny 角色
 *   - 不出现任何文字 / 字母 / 数字
 */
function buildPictoPrompt(c) {
  const visualSubject = {
    '林': 'two trees standing close together in the center of the frame, side by side like siblings. Two brown trunks each with branches going up, and two soft round green canopies of leaves touching slightly. Soft green grass at the base with tiny flowers. Background: soft pastel pink-to-sky-blue gradient sky with one fluffy cloud.',
    '森': 'three trees grouped together in the center of the frame, side by side. Three brown trunks of slightly varying heights with branches, and lush overlapping green canopies creating a dense forest feel. Grass and tiny mushrooms at the base. Background: soft pastel sky-blue gradient with soft sunlight filtering through.',
    '明': 'a smiling sun on the left and a crescent moon on the right, side by side in the center of the frame. Both have cute faces: closed happy eyes, pink cheek blush, sweet smiles. Background: split gradient — warm yellow-to-pink on the left (day side), soft purple-to-blue on the right (night side). A tiny horizon line at the bottom with grass.',
    '休': 'a small chubby person silhouette on the left leaning against a tree on the right, taking a peaceful rest. The person has a content peaceful pose with closed happy eyes. Soft green grass underfoot with tiny flowers. Background: soft pastel sky gradient with warm sunlight and one fluffy cloud.',
    '好': 'a chubby mother figure and a small chubby child figure standing close together in the center of the frame, side by side with hands held. Both have sweet smiles and pink cheek blush. Tiny pink hearts floating around them. Background: soft pastel pink-to-cream gradient with small flowers.',
  }[c.glyph] ?? `a cute visual scene for ${c.glyph} in the center of the frame with soft pastel picture book style surroundings.`;

  return `A 3 year old girl picture book illustration. ${visualSubject} ${STYLE_SUFFIX}`;
}

const TIER_B = [
  {
    id: 'char-lin',
    glyph: '林',
    pinyin: ['lín'],
    tone: 2,
    meaning: ['树林', '两棵树'],
    radical: '木',
    strokes: 8,
    tier: 'B',
    type: 'ideogram',
    island: 'plants',
    origin: {
      fact: '"林"由两个"木"组成，表示很多树在一起。',
      story: '一棵树不够，要很多很多树，才叫"林"。所以古人把两个"木"放在一起，变成了"林"。',
      evolution: ['🌳🌳', '木+木', '林'],
    },
    words: ['树林', '森林', '林荫道'],
    components: ['char-mu', 'char-mu'],
  },
  {
    id: 'char-sen',
    glyph: '森',
    pinyin: ['sēn'],
    tone: 1,
    meaning: ['森林', '很多很多树'],
    radical: '木',
    strokes: 12,
    tier: 'B',
    type: 'ideogram',
    island: 'plants',
    origin: {
      fact: '"森"由三个"木"组成，表示非常多的树。',
      story: '"林"已经很多了，"森"还要更多！三个"木"放在一起，就是"森"。',
      evolution: ['🌳🌳🌳', '木+木+木', '森'],
    },
    words: ['森林', '阴森', '森森'],
    components: ['char-mu', 'char-mu', 'char-mu'],
  },
  {
    id: 'char-ming',
    glyph: '明',
    pinyin: ['míng'],
    tone: 2,
    meaning: ['明亮', '清楚'],
    radical: '日',
    strokes: 8,
    tier: 'B',
    type: 'ideogram',
    island: 'nature',
    origin: {
      fact: '"明"由"日"和"月"组成，日月同辉即"明"。',
      story: '白天有太阳，晚上有月亮，把它们放在一起，就是最明亮的时候。这就是"明"字。',
      evolution: ['☀️🌙', '日+月', '明'],
    },
    words: ['明天', '明白', '明亮'],
    components: ['char-ri', 'char-yue'],
  },
  {
    id: 'char-xiu',
    glyph: '休',
    pinyin: ['xiū'],
    tone: 1,
    meaning: ['休息'],
    radical: '亻',
    strokes: 6,
    tier: 'B',
    type: 'ideogram',
    island: 'actions',
    origin: {
      fact: '"休"由"人"和"木"组成，表示人靠在树旁。',
      story: '一个人走路走累了，靠在大树旁边休息一下，这就是"休"字。',
      evolution: ['🧍🌳', '人+木', '休'],
    },
    words: ['休息', '退休', '休止符'],
    components: ['char-ren', 'char-mu'],
  },
  {
    id: 'char-hao',
    glyph: '好',
    pinyin: ['hǎo'],
    tone: 3,
    meaning: ['好，美好'],
    radical: '女',
    strokes: 6,
    tier: 'B',
    type: 'ideogram',
    island: 'family',
    origin: {
      fact: '"好"由"女"和"子"组成，表示女子与孩子。',
      story: '有妈妈有孩子，一家人在一起，就是"好"。古时候觉得这是最美好的事情。',
      evolution: ['👩👦', '女+子', '好'],
    },
    words: ['好的', '好看', '好吃'],
    components: ['char-nv', 'char-zi'],
  },
];

module.exports = {
  characters: TIER_B,
  cues: TIER_B.map((c) => ({
    id: `char-${c.id.replace('char-', '')}-pron`,
    kind: 'character',
    text: `${c.glyph}，${c.glyph}，${c.glyph}。`,
    url: `/assets/audio/l1/tier-b/${c.id.replace('char-', '')}-pron.mp3`,
    refId: c.id,
  })),
  art: TIER_B.map((c) => ({
    id: `picto-${c.id.replace('char-', '')}`,
    subject: c.glyph,
    prompt: buildPictoPrompt(c),
    outPath: `/assets/art/l1/tier-b/picto-${c.id.replace('char-', '')}.jpg`,
    refId: c.id,
  })),
};