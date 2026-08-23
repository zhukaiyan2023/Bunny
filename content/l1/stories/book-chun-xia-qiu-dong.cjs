/**
 * L1 · 绘本《春夏秋冬》 · 4 页
 *
 * 主题岛：nature（自然）
 * 核心汉字：春 / 夏 / 秋 / 冬 / 花 / 雪 / 叶 / 风
 */

const PAGES = [
  {
    pageNumber: 1,
    text: '春天来了，花儿开了。',
    background: 'spring',
    characterIds: ['char-chun', 'char-hua-flower'],
    audioId: 'story-chun-xia-qiu-dong-p1',
  },
  {
    pageNumber: 2,
    text: '夏天热热的，太阳大大的。',
    background: 'summer',
    characterIds: ['char-xia2', 'char-re', 'char-da', 'char-ri'],
    audioId: 'story-chun-xia-qiu-dong-p2',
  },
  {
    pageNumber: 3,
    text: '秋天到了，叶子黄了。',
    background: 'autumn',
    characterIds: ['char-qiu', 'char-huang'],
    audioId: 'story-chun-xia-qiu-dong-p3',
  },
  {
    pageNumber: 4,
    text: '冬天好冷，雪花飞呀飞。',
    background: 'winter',
    characterIds: ['char-dong-east', 'char-leng', 'char-xue2', 'char-fei'],
    audioId: 'story-chun-xia-qiu-dong-p4',
  },
];

module.exports = {
  cues: PAGES.map((p) => ({
    id: p.audioId,
    kind: 'story',
    text: p.text,
    url: `/assets/audio/l1/stories/chun-xia-qiu-dong/${p.audioId}.mp3`,
    refType: 'story-page-audio',
    refId: `book-chun-xia-qiu-dong-p${p.pageNumber}`,
  })),
  art: [
    {
      id: 'cover-chun-xia-qiu-dong',
      subject: '春夏秋冬',
      prompt: 'A 3 year old girl picture book cover illustration. Four cute seasonal mini scenes in a 2x2 grid: top-left soft pink cherry blossom with a tiny bunny, top-right a chubby pastel yellow sun with sandcastle and tiny waves, bottom-left a soft orange leaf falling from a tree with tiny acorns, bottom-right a chubby pastel snowman with pink cheek blush and tiny carrot nose. Center: a chubby white bunny with a flower crown, holding a tiny book. Background: soft pastel gradient (pink-butter-orange-lavender). Dreamy soft warm, rounded chubby shapes, 3D render, no Chinese text no Chinese characters no alphabet letters no digits no writing anywhere in the image.',
      outPath: '/assets/art/l1/stories/cover-chun-xia-qiu-dong.jpg',
    },
  ],
  story: {
    id: 'book-chun-xia-qiu-dong',
    title: '春夏秋冬',
    coverEmoji: '🌸☀️🍂❄️',
    level: 1,
    island: 'nature',
    coreCharacterIds: ['char-chun', 'char-xia2', 'char-qiu', 'char-dong-east'],
    ageMin: 3,
    ageMax: 6,
    pages: PAGES,
  },
};