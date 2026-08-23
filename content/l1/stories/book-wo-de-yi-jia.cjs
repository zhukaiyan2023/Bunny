/**
 * L1 · 绘本《我的一家》 · 5 页
 *
 * 主题岛：family（家）
 * 核心汉字：爸 / 妈 / 哥 / 姐 / 我
 *
 * 用一年级学过的「爸、妈、哥、姐、弟、妹」组成一家，
 * 让妙妙在故事里把刚检测过的字再复习一遍。
 */

const PAGES = [
  {
    pageNumber: 1,
    text: '我有一个幸福的家。',
    background: 'home',
    characterIds: ['char-wo', 'char-jia'],
    audioId: 'story-wo-de-yi-jia-p1',
  },
  {
    pageNumber: 2,
    text: '爸爸高高的，像一座山。',
    background: 'family-dad',
    characterIds: ['char-ba-dad', 'char-shan', 'char-gao'],
    audioId: 'story-wo-de-yi-jia-p2',
  },
  {
    pageNumber: 3,
    text: '妈妈暖暖的，像一颗太阳。',
    background: 'family-mom',
    characterIds: ['char-ma-mom', 'char-ri', 'char-nuan'],
    audioId: 'story-wo-de-yi-jia-p3',
  },
  {
    pageNumber: 4,
    text: '哥哥姐姐陪我读书。',
    background: 'family-siblings',
    characterIds: ['char-ge', 'char-jie', 'char-shu'],
    audioId: 'story-wo-de-yi-jia-p4',
  },
  {
    pageNumber: 5,
    text: '我们一家人，笑着在一起。',
    background: 'family-together',
    characterIds: ['char-wo', 'char-xiao', 'char-yi-one'],
    audioId: 'story-wo-de-yi-jia-p5',
  },
];

module.exports = {
  cues: PAGES.map((p) => ({
    id: p.audioId,
    kind: 'story',
    text: p.text,
    url: `/assets/audio/l1/stories/wo-de-yi-jia/${p.audioId}.mp3`,
    refType: 'story-page-audio',
    refId: `book-wo-de-yi-jia-p${p.pageNumber}`,
  })),
  art: [
    {
      id: 'cover-wo-de-yi-jia',
      subject: '我的一家',
      prompt: 'A 3 year old girl picture book cover illustration. A chubby cute family of four: tall father, kind mother, older brother, older sister, and a small child holding hands, all standing in front of a cozy small house with warm yellow light in the windows. Soft pastel family clothing, all with pink cheek blush and friendly smiles. Background: soft pink to cream gradient with tiny hearts. Dreamy soft warm, rounded chubby shapes, 3D render, no Chinese text no Chinese characters no alphabet letters no digits no writing anywhere in the image.',
      outPath: '/assets/art/l1/stories/cover-wo-de-yi-jia.jpg',
    },
  ],
  story: {
    id: 'book-wo-de-yi-jia',
    title: '我的一家',
    coverEmoji: '👨‍👩‍👧‍👦',
    level: 1,
    island: 'family',
    coreCharacterIds: ['char-ba-dad', 'char-ma-mom', 'char-ge', 'char-jie', 'char-wo'],
    ageMin: 3,
    ageMax: 6,
    pages: PAGES,
  },
};