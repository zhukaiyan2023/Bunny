/**
 * L1 · 绘本《小动物的家》 · 5 页
 *
 * 主题岛：animals（动物）
 * 核心汉字：猫 / 狗 / 鸟 / 鱼 / 虫 / 家
 *
 * 让妙妙用刚学过的「猫、狗、鸟、鱼、虫」认识小动物的家
 */

const PAGES = [
  {
    pageNumber: 1,
    text: '小猫住在温暖的屋子里。',
    background: 'cat-home',
    characterIds: ['char-mao', 'char-zhu', 'char-jia', 'char-nuan'],
    audioId: 'story-xiao-dong-ji-p1',
  },
  {
    pageNumber: 2,
    text: '小狗喜欢在草地上跑。',
    background: 'dog-park',
    characterIds: ['char-gou', 'char-cao', 'char-pao'],
    audioId: 'story-xiao-dong-ji-p2',
  },
  {
    pageNumber: 3,
    text: '小鸟在天上飞呀飞。',
    background: 'bird-sky',
    characterIds: ['char-niao', 'char-tian', 'char-fei'],
    audioId: 'story-xiao-dong-ji-p3',
  },
  {
    pageNumber: 4,
    text: '小鱼在水里游。',
    background: 'fish-water',
    characterIds: ['char-yu-fish', 'char-shui', 'char-you'],
    audioId: 'story-xiao-dong-ji-p4',
  },
  {
    pageNumber: 5,
    text: '小动物们都有自己的家。',
    background: 'animal-friends',
    characterIds: ['char-wo', 'char-men', 'char-jia'],
    audioId: 'story-xiao-dong-ji-p5',
  },
];

module.exports = {
  cues: PAGES.map((p) => ({
    id: p.audioId,
    kind: 'story',
    text: p.text,
    url: `/assets/audio/l1/stories/xiao-dong-ji/${p.audioId}.mp3`,
    refType: 'story-page-audio',
    refId: `book-xiao-dong-ji-p${p.pageNumber}`,
  })),
  art: [
    {
      id: 'cover-xiao-dong-ji',
      subject: '小动物的家',
      prompt: 'A 3 year old girl picture book cover illustration. Three chubby cute animals in a row: a soft orange tabby kitten with a pink bow, a soft cream-brown puppy with a tiny blue collar, and a soft blue songbird with tiny wings. All have big friendly eyes and pink cheek blush. Tiny pastel hearts and flowers in the air. Background: soft mint to cream gradient with a tiny warm house in the distance. Dreamy soft warm, rounded chubby shapes, 3D render, no Chinese text no Chinese characters no alphabet letters no digits no writing anywhere in the image.',
      outPath: '/assets/art/l1/stories/cover-xiao-dong-ji.jpg',
    },
  ],
  story: {
    id: 'book-xiao-dong-ji',
    title: '小动物的家',
    coverEmoji: '🐱🐶🐦',
    level: 1,
    island: 'animals',
    coreCharacterIds: ['char-mao', 'char-gou', 'char-niao', 'char-yu-fish'],
    ageMin: 3,
    ageMax: 6,
    pages: PAGES,
  },
};