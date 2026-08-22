/**
 * L1 · 绘本《小兔子找妈妈》 · 5 页
 *
 * 主题岛：family（家）+ nature（自然）
 * 核心汉字：兔 / 子 / 找 / 妈 / 妈 / 在 / 里 / 家
 * 适龄：3-6 岁
 */

const PAGES = [
  {
    pageNumber: 1,
    text: '小兔子在森林里找妈妈。',
    background: 'forest',
    characterIds: ['char-shan', 'char-shui', 'char-mu'],
    audioId: 'story-xiao-tu-de-jia-p1',
  },
  {
    pageNumber: 2,
    text: '它问大树：我的妈妈在哪里？',
    background: 'forest-tree',
    characterIds: ['char-mu'],
    audioId: 'story-xiao-tu-de-jia-p2',
  },
  {
    pageNumber: 3,
    text: '它问小草：我的妈妈在哪里？',
    background: 'meadow',
    characterIds: ['char-ren'],
    audioId: 'story-xiao-tu-de-jia-p3',
  },
  {
    pageNumber: 4,
    text: '妈妈在山洞里等它。',
    background: 'mountain',
    characterIds: ['char-shan'],
    audioId: 'story-xiao-tu-de-jia-p4',
  },
  {
    pageNumber: 5,
    text: '小兔子终于找到妈妈啦！',
    background: 'home',
    characterIds: ['char-hao'],
    audioId: 'story-xiao-tu-de-jia-p5',
  },
];

const CORE_CHARACTERS = ['char-tu', 'char-zi', 'char-zhao', 'char-ma', 'char-zai', 'char-li', 'char-jia'];

module.exports = {
  cues: PAGES.map((p) => ({
    id: p.audioId,
    kind: 'story',
    text: p.text,
    url: `/assets/audio/l1/stories/xiao-tu-de-jia/${p.audioId}.mp3`,
    refType: 'story-page-audio',
    refId: `book-xiao-tu-de-jia-p${p.pageNumber}`,
  })),
  art: [
    {
      id: 'cover-xiao-tu-de-jia',
      subject: '小兔子找妈妈',
      // 🚫 不写中文字！模型对任何文字渲染都不可靠
      prompt: 'A 3 year old girl picture book cover illustration. A cute chubby white Bunny character looking up into the distance with sparkly eyes. Background shows a pastel forest with soft pink mountains. Decorated with flowers hearts butterflies. Pastel pink gradient background, dreamy soft warm, rounded chubby shapes with no sharp edges, all elements chubby with cute faces, 3D render, no Chinese text no Chinese characters no alphabet letters no digits no writing anywhere in the image.',
      outPath: '/assets/art/l1/stories/cover-xiao-tu-de-jia.jpg',
    },
  ],
  // 给 StoryPage 用的元数据
  story: {
    id: 'book-xiao-tu-de-jia',
    title: '小兔子找妈妈',
    coverEmoji: '🐰',
    level: 1,
    island: 'family',
    coreCharacterIds: CORE_CHARACTERS,
    ageMin: 3,
    ageMax: 6,
    pages: PAGES,
  },
};