/**
 * L1 · Tier-A 象形字（14 字）
 *
 * 选字原则：
 *   - 高频日常字
 *   - 象形 / 表意图象强，儿童可以一眼联想到图
 *   - 笔画 ≤ 7，方便 3-6 岁书写练习
 *
 * 🎨 风格基线：3 岁女孩适龄 pastel 绘本风格
 *
 * 🚫 严禁要求模型"写字"——模型对任何文字渲染都不可靠
 *    改用 emoji + 视觉元素来表达"山 / 水 / 火 / 木"等
 */

const STYLE_SUFFIX =
  '3 year old girl picture book illustration style, ' +
  'soft pastel color palette (pink mint butter lavender sky blue), ' +
  'dreamy soft warm lighting, rounded chubby shapes with no sharp edges, ' +
  '3D render with soft shadows, clean uncluttered composition, ' +
  'square 1:1 framing. ' +
  'NO text NO Chinese characters NO alphabet letters NO digits NO writing NO symbols anywhere in the image.';

/**
 * 为每个 Tier-A 象形字生成"主体场景"插画 prompt
 *
 * 设计原则（参考 docs/STYLE_GUIDE.md + 用户参考图）：
 *   - 主体（字义本身）占画面中心 ~60%
 *   - 配套场景（草地 / 天空 / 石头 / 花朵）填满整个画框
 *   - 拟人化克制：最多 1 处 cute face，且不喧宾夺主
 *   - 不出现 Bunny 角色（pictograph 是字本身，不是 Bunny 的故事）
 *   - 不出现任何文字 / 字母 / 数字
 */
function buildPictoPrompt(c) {
  const visualSubject = {
    '山': 'three soft rounded green mountain peaks standing side by side in the center of the frame, like three gentle hills. Soft white snow caps on the top of each peak. Foreground: soft green rolling grass with tiny wildflowers and a few small trees. Background: soft pastel gradient sky from pink at horizon to light blue above with two fluffy white clouds.',
    '水': 'gentle flowing water stream in the center of the frame, shown as soft curved blue streams with three small water droplets falling nearby. A small waterfall scene with moss-covered rocks at the base, surrounded by small green plants and grass. Background: soft blue to cream gradient sky.',
    '火': 'a friendly dancing flame in the center of the frame. The flame has three soft pointed tongues (top center, top left, top right) like the three dots in the Chinese character, and a rounded base. Warm orange and red colors with a yellow inner glow. Tiny floating sparks around it. Background: warm pastel orange-to-pink gradient sky.',
    '木': 'a single tree in the center of the frame. Clear brown trunk with two branches going up-left and up-right, and a soft round green canopy of leaves on top. Soft green grass at the base with tiny flowers. Background: soft pink-to-sky-blue gradient sky with one fluffy white cloud.',
    '日': 'a smiling sun in the center of the frame. The sun is round and warm yellow with a cute face: closed happy eyes, pink cheek blush, sweet smile. Short golden rays radiating outward. Below the sun: soft rolling green hills with a small tree. Background: warm yellow-to-orange-to-pink gradient sky.',
    '月': 'a crescent moon in the center of the frame. The moon is soft pale yellow with a sleepy face: closed peaceful eyes, slight content smile, pink cheek blush. Background: soft purple-to-blue night sky gradient with a few small twinkling stars and tiny wispy clouds.',
    '人': 'a small chubby person silhouette in the center of the frame, shown in side profile with a slight walking pose and bent posture like a gentle curve. Soft cream skin tone. Background: soft pink-to-cream gradient sky. Small grass patch and tiny path underfoot.',
    '口': 'a soft rounded square in the center of the frame, shaped like a small open mouth. Soft corners and a slight inward curve. Tiny pink lips at the bottom edge, slightly personified. Background: soft pastel pink-to-cream gradient with small flowers around it.',
    '目': 'a big round cute eye in the center of the frame. The eye has a dark brown iris with a small white highlight, long soft eyelashes, and soft pink eyelid details. Surrounded by a hint of soft skin tone and tiny sparkles. Background: soft pastel peach-to-cream gradient.',
    '耳': 'a soft rounded ear shape in the center of the frame. The ear has a soft pink inner part and a pale outer curve. Like a friendly cartoon ear. Background: soft pastel mint-to-cream gradient with tiny flowers floating around.',
    '手': 'a chubby open hand in the center of the frame, palm facing the viewer with five small fingers spread out in a friendly wave. Soft skin tone with pink palm. Background: soft pastel sky-blue-to-cream gradient with tiny hearts floating around.',
    '心': 'a soft pink heart in the center of the frame. The heart has a cute face: closed happy eyes, sweet smile, pink cheek blush. Surrounded by tiny floating hearts and sparkles. Background: soft pink-to-red gradient.',
    '足': 'a chubby footprint shape in the center of the frame, showing the sole of a small foot with five toe pads and a heel pad. Soft skin tone with pink details. Background: soft pastel butter-to-cream gradient with green grass around it.',
    '雨': 'soft rain drops in the center of the frame. A small fluffy white cloud at top with several clear water droplets falling down in vertical lines below it. A small green grass patch at the bottom. Background: soft blue-to-grey gradient sky.',
  }[c.glyph] ?? `a cute visual scene for ${c.glyph} in the center of the frame with soft pastel picture book style surroundings.`;

  return `A 3 year old girl picture book illustration. ${visualSubject} ${STYLE_SUFFIX}`;
}

const TIER_A = [
  {
    id: 'char-shan',
    glyph: '山',
    pinyin: ['shān'],
    tone: 1,
    meaning: ['山，山坡', '高大的山'],
    radical: '山',
    strokes: 3,
    tier: 'A',
    type: 'pictograph',
    island: 'nature',
    origin: {
      fact: '甲骨文"山"是三座山峰的侧视图。',
      story: '古时候的人看到远处的山，就在纸上画了三座尖尖的山峰，这就是最早的"山"字。',
      evolution: ['⛰️', '⿱山山', '山'],
    },
    words: ['高山', '上山', '山水画'],
  },
  {
    id: 'char-shui',
    glyph: '水',
    pinyin: ['shuǐ'],
    tone: 3,
    meaning: ['水', '水流'],
    radical: '水',
    strokes: 4,
    tier: 'A',
    type: 'pictograph',
    island: 'nature',
    origin: {
      fact: '甲骨文"水"是中间一股水流、两边各三个小点的样子。',
      story: '古人看到河水流下来，中间是水流，旁边溅起小水花，就这样画成了"水"。',
      evolution: ['💧', '𣱳', '水'],
    },
    words: ['喝水', '水果', '河水'],
  },
  {
    id: 'char-huo',
    glyph: '火',
    pinyin: ['huǒ'],
    tone: 3,
    meaning: ['火', '火焰'],
    radical: '火',
    strokes: 4,
    tier: 'A',
    type: 'pictograph',
    island: 'nature',
    origin: {
      fact: '甲骨文"火"像一团向上蹿的火焰。',
      story: '古人看到火苗往上跳，就画了一团尖尖的火焰，这就是"火"。',
      evolution: ['🔥', '灬', '火'],
    },
    words: ['火车', '火苗', '火山'],
  },
  {
    id: 'char-mu',
    glyph: '木',
    pinyin: ['mù'],
    tone: 4,
    meaning: ['木头', '树木'],
    radical: '木',
    strokes: 4,
    tier: 'A',
    type: 'pictograph',
    island: 'plants',
    origin: {
      fact: '甲骨文"木"是一棵带根、带干、带枝的树。',
      story: '古人看到一棵树，上面有树枝，下面有树根，中间是树干，这就是"木"字。',
      evolution: ['🌳', '木', '木'],
    },
    words: ['树木', '木头', '木马'],
  },
  {
    id: 'char-ri',
    glyph: '日',
    pinyin: ['rì'],
    tone: 4,
    meaning: ['太阳', '日子'],
    radical: '日',
    strokes: 4,
    tier: 'A',
    type: 'pictograph',
    island: 'nature',
    origin: {
      fact: '甲骨文"日"是太阳的圆形，里面加一点表示日中。',
      story: '古人看到圆圆的太阳，中间加了一点表示光最亮的地方，这就是"日"字。',
      evolution: ['☀️', '⺊', '日'],
    },
    words: ['日子', '日出', '生日'],
  },
  {
    id: 'char-yue',
    glyph: '月',
    pinyin: ['yuè'],
    tone: 4,
    meaning: ['月亮', '月份'],
    radical: '月',
    strokes: 4,
    tier: 'A',
    type: 'pictograph',
    island: 'nature',
    origin: {
      fact: '甲骨文"月"是月牙的形状。',
      story: '古人看到弯弯的月亮，像一弯小船，就照着画了下来，这就是"月"字。',
      evolution: ['🌙', '⺼', '月'],
    },
    words: ['月亮', '月光', '月饼'],
  },
  {
    id: 'char-ren',
    glyph: '人',
    pinyin: ['rén'],
    tone: 2,
    meaning: ['人', '人类'],
    radical: '人',
    strokes: 2,
    tier: 'A',
    type: 'pictograph',
    island: 'body',
    origin: {
      fact: '甲骨文"人"是一个弯腰侧立的人形。',
      story: '古人看到人走路的样子，弯着腰侧着身子走路，就画了下来，这就是"人"字。',
      evolution: ['🧍', '人', '人'],
    },
    words: ['大人', '人们', '好人'],
  },
  {
    id: 'char-kou',
    glyph: '口',
    pinyin: ['kǒu'],
    tone: 3,
    meaning: ['嘴', '口'],
    radical: '口',
    strokes: 3,
    tier: 'A',
    type: 'pictograph',
    island: 'body',
    origin: {
      fact: '甲骨文"口"是张开嘴的方形。',
      story: '古人看到张开的嘴巴，是方方的形状，就照着画了下来，这就是"口"字。',
      evolution: ['👄', '口', '口'],
    },
    words: ['口袋', '开口', '口水'],
  },
  {
    id: 'char-mu-eye',
    glyph: '目',
    pinyin: ['mù'],
    tone: 4,
    meaning: ['眼睛', '看'],
    radical: '目',
    strokes: 5,
    tier: 'A',
    type: 'pictograph',
    island: 'body',
    origin: {
      fact: '甲骨文"目"是竖起来的眼睛，里面有一个瞳孔。',
      story: '古人看到眼睛，竖着画下来，中间有一个圆圆的瞳孔，这就是"目"字。',
      evolution: ['👁️', '目', '目'],
    },
    words: ['目光', '目录', '眼睛'],
  },
  {
    id: 'char-er',
    glyph: '耳',
    pinyin: ['ěr'],
    tone: 3,
    meaning: ['耳朵'],
    radical: '耳',
    strokes: 6,
    tier: 'A',
    type: 'pictograph',
    island: 'body',
    origin: {
      fact: '甲骨文"耳"是人的耳朵形状。',
      story: '古人看到大大的耳朵，就像一片叶子，就照着画了下来，这就是"耳"字。',
      evolution: ['👂', '耳', '耳'],
    },
    words: ['耳朵', '木耳', '耳目'],
  },
  {
    id: 'char-shou',
    glyph: '手',
    pinyin: ['shǒu'],
    tone: 3,
    meaning: ['手', '手臂'],
    radical: '手',
    strokes: 4,
    tier: 'A',
    type: 'pictograph',
    island: 'body',
    origin: {
      fact: '甲骨文"手"是张开五指的手掌。',
      story: '古人看到张开的手掌，五根手指都伸出来，就照着画了下来，这就是"手"字。',
      evolution: ['🖐️', '扌', '手'],
    },
    words: ['小手', '手里', '动手'],
  },
  {
    id: 'char-xin',
    glyph: '心',
    pinyin: ['xīn'],
    tone: 1,
    meaning: ['心，心脏'],
    radical: '心',
    strokes: 4,
    tier: 'A',
    type: 'pictograph',
    island: 'body',
    origin: {
      fact: '甲骨文"心"是心脏的形状。',
      story: '古人看到心脏的形状，像一颗尖尖的果子，就画了下来，这就是"心"字。',
      evolution: ['❤️', '⺗', '心'],
    },
    words: ['开心', '小心', '用心'],
  },
  {
    id: 'char-zu',
    glyph: '足',
    pinyin: ['zú'],
    tone: 2,
    meaning: ['脚，足'],
    radical: '足',
    strokes: 7,
    tier: 'A',
    type: 'pictograph',
    island: 'body',
    origin: {
      fact: '甲骨文"足"是脚的形状，下面是脚趾。',
      story: '古人看到人的脚，下面有几个脚趾，就照着画了下来，这就是"足"字。',
      evolution: ['🦶', '⾛', '足'],
    },
    words: ['足球', '足够', '足迹'],
  },
  {
    id: 'char-yu',
    glyph: '雨',
    pinyin: ['yǔ'],
    tone: 3,
    meaning: ['雨，下雨'],
    radical: '雨',
    strokes: 8,
    tier: 'A',
    type: 'pictograph',
    island: 'nature',
    origin: {
      fact: '甲骨文"雨"是天上下雨的样子，上有云，下有雨滴。',
      story: '古人看到天上乌云下雨，就画了一朵云，下面加几滴雨水，这就是"雨"字。',
      evolution: ['🌧️', '⻗', '雨'],
    },
    words: ['下雨', '雨水', '雨伞'],
  },
];

module.exports = {
  characters: TIER_A,
  cues: TIER_A.map((c) => ({
    id: `char-${c.id.replace('char-', '')}-pron`,
    kind: 'character',
    text: `${c.glyph}，${c.glyph}，${c.glyph}。`,
    url: `/assets/audio/l1/tier-a/${c.id.replace('char-', '')}-pron.mp3`,
    refId: c.id,
  })),
  art: TIER_A.map((c) => ({
    id: `picto-${c.id.replace('char-', '')}`,
    subject: c.glyph,
    // 🚫 严禁要求模型"写字" — 改为纯视觉图标
    prompt: buildPictoPrompt(c),
    outPath: `/assets/art/l1/tier-a/picto-${c.id.replace('char-', '')}.jpg`,
    refId: c.id,
  })),
};