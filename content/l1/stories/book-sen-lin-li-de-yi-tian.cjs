/**
 * L1 · 绘本《森林里的一天》 · 4 页
 *
 * 主题岛：nature（自然）
 * 核心汉字：森 / 林 / 里 / 一 / 天 / 大 / 小
 */

const PAGES = [
  {
    pageNumber: 1,
    text: '森林里，住着一只小小兔。',
    background: 'forest-deep',
    characterIds: ['char-sen', 'char-lin', 'char-li'],
    audioId: 'story-sen-lin-li-de-yi-tian-p1',
  },
  {
    pageNumber: 2,
    text: '小小兔有大大大的耳朵，短短的尾巴。',
    background: 'forest-character',
    characterIds: ['char-da', 'char-xiao', 'char-er'],
    audioId: 'story-sen-lin-li-de-yi-tian-p2',
  },
  {
    pageNumber: 3,
    text: '它喜欢下雨天在森林里跳来跳去。',
    background: 'forest-rain',
    characterIds: ['char-yu', 'char-tian'],
    audioId: 'story-sen-lin-li-de-yi-tian-p3',
  },
  {
    pageNumber: 4,
    text: '森林里的一天，真美好呀！',
    background: 'forest-sunset',
    characterIds: ['char-hao'],
    audioId: 'story-sen-lin-li-de-yi-tian-p4',
  },
];

module.exports = {
  cues: PAGES.map((p) => ({
    id: p.audioId,
    kind: 'story',
    text: p.text,
    url: `/assets/audio/l1/stories/sen-lin-li-de-yi-tian/${p.audioId}.mp3`,
    refType: 'story-page-audio',
    refId: `book-sen-lin-li-de-yi-tian-p${p.pageNumber}`,
  })),
  art: [
    {
      id: 'cover-sen-lin-li-de-yi-tian',
      subject: '森林里的一天',
      prompt: '3 岁女孩专属绘本封面。圆胖白兔 Bunny 站在 pastel 薄荷绿色森林前面，戴着粉色花环，森林里有粉色小山、有小树、有小花和小蘑菇。顶部用大号中文写"森林里的一天"。画面有彩虹、爱心、蝴蝶、小云朵装饰。背景 pastel 柔色渐变，3D 渲染，圆润温暖。',
      outPath: '/assets/art/l1/stories/cover-sen-lin-li-de-yi-tian.png',
    },
  ],
  story: {
    id: 'book-sen-lin-li-de-yi-tian',
    title: '森林里的一天',
    coverEmoji: '🌳🐰',
    level: 1,
    island: 'nature',
    coreCharacterIds: ['char-sen', 'char-lin', 'char-da', 'char-xiao'],
    ageMin: 3,
    ageMax: 6,
    pages: PAGES,
  },
};