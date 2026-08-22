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
      prompt: '3 岁女孩专属绘本封面。画面分为左右两半：左边是 pastel 奶黄色的太阳姐姐（带粉腮红、戴花环），右边是淡紫渐变的月亮姐姐（戴小星星发夹），两只圆胖白兔 Bunny 在画面下方手拉手（头顶带粉色蝴蝶结）。顶部用大号中文写"太阳和月亮"。背景 pastel 柔粉 → 淡紫渐变，有彩虹、爱心、花瓣装饰。3D 渲染，圆润温暖。',
      outPath: '/assets/art/l1/stories/cover-tai-yang-he-yue-liang.png',
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