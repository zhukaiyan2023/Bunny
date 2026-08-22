/**
 * L1 · 绘本《太阳和月亮》 · 4 页
 *
 * 主题岛：nature（自然）
 * 核心汉字：日 / 月 / 天 / 上
 */

const PAGES = [
  {
    pageNumber: 1,
    text: '天上有太阳，照得大地暖暖的。',
    background: 'sky-day',
    characterIds: ['char-ri', 'char-tian', 'char-shang'],
    audioId: 'story-tai-yang-he-yue-liang-p1',
  },
  {
    pageNumber: 2,
    text: '太阳下山了，天慢慢黑下来。',
    background: 'sky-dusk',
    characterIds: ['char-ri', 'char-xia'],
    audioId: 'story-tai-yang-he-yue-liang-p2',
  },
  {
    pageNumber: 3,
    text: '月亮出来了，亮亮的挂在天上。',
    background: 'sky-night',
    characterIds: ['char-yue', 'char-tian'],
    audioId: 'story-tai-yang-he-yue-liang-p3',
  },
  {
    pageNumber: 4,
    text: '太阳和月亮，轮流照顾小朋友。',
    background: 'sky-cycle',
    characterIds: ['char-ri', 'char-yue'],
    audioId: 'story-tai-yang-he-yue-liang-p4',
  },
];

module.exports = {
  cues: PAGES.map((p) => ({
    id: p.audioId,
    kind: 'story',
    text: p.text,
    url: `/assets/audio/l1/stories/tai-yang-he-yue-liang/${p.audioId}.mp3`,
    refType: 'story-page-audio',
    refId: `book-tai-yang-he-yue-liang-p${p.pageNumber}`,
  })),
  art: [
    {
      id: 'cover-tai-yang-he-yue-liang',
      subject: '太阳和月亮',
      // 🚫 不写中文字！模型对任何文字渲染都不可靠
      prompt: 'A 3 year old girl picture book cover illustration. The scene is split in half: left side has a chubby pastel yellow sun character with pink cheek blush and a flower crown; right side has a chubby lavender crescent moon character with a tiny star hairpin. Two chubby white Bunny characters hold hands at the bottom, both with pink bow ties. Background is pastel pink to lavender gradient, decorated with rainbow hearts petals. Dreamy soft warm, rounded chubby shapes, 3D render, no Chinese text no Chinese characters no alphabet letters no digits no writing anywhere in the image.',
      outPath: '/assets/art/l1/stories/cover-tai-yang-he-yue-liang.jpg',
    },
  ],
  story: {
    id: 'book-tai-yang-he-yue-liang',
    title: '太阳和月亮',
    coverEmoji: '☀️🌙',
    level: 1,
    island: 'nature',
    coreCharacterIds: ['char-ri', 'char-yue', 'char-tian'],
    ageMin: 3,
    ageMax: 6,
    pages: PAGES,
  },
};