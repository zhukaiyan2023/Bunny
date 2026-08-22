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

const STYLE_SUFFIX = '3 year old girl picture book style, pastel pink mint butter lavender palette, dreamy soft warm, rounded chubby shapes with no sharp edges, all characters chubby with big round eyes pink cheek blush sweet smile, 3D render, no Chinese text no Chinese characters no writing, transparent background.';

/**
 * 为每个 Tier-B 字符生成"部件 + Bunny" 的视觉 prompt
 * 用 emoji + 实物描述代替中文字
 */
function buildPictoPrompt(c) {
  const visualSubject = {
    '林': 'two cute chubby trees standing close together like siblings',
    '森': 'three cute chubby trees grouped together like a tiny forest',
    '明': 'a soft sun and a crescent moon smiling together side by side',
    '休': 'a small person silhouette leaning against a chubby tree',
    '好': 'a mother figure and a tiny baby figure together with hearts around',
  }[c.glyph] ?? `a cute visual symbol for ${c.glyph}`;
  return `A cute chubby white Bunny character stands beside ${visualSubject}. Bunny is on the left, the visual symbol is on the right and fills 60 percent of the frame. Background is pastel gradient (pink to butter to mint). Scene decorated with flowers hearts butterflies. ${STYLE_SUFFIX}`;
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