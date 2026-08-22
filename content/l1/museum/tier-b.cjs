/**
 * L1 · Tier-B 会意字字源故事旁白（5 段）
 */
const TIER_B_CUES = [
  { char: '林', id: 'lin',  text: '一棵树不够呀，要很多很多树呢。所以呀，两个"木"放在一起，就变成了"林"。' },
  { char: '森', id: 'sen',  text: '"林"已经很多啦，"森"还要更多呀。三个"木"放在一起呢，就是大森林。' },
  { char: '明', id: 'ming', text: '白天有太阳，晚上有月亮呀。把它们放在一起呢，就是最亮的时候呀。' },
  { char: '休', id: 'xiu',  text: '一个人走累了呀，靠在大树旁边休息呢。这就是"休"呀，人靠在木旁。' },
  { char: '好', id: 'hao',  text: '有妈妈有宝宝呀，一家人在一起呢。古时候呀，觉得这是最美好的事情呢。' },
];

module.exports = {
  cues: TIER_B_CUES.map(({ char, id, text }) => ({
    id: `museum-${id}-reveal`,
    kind: 'museum',
    text,
    url: `/assets/audio/l1/tier-b/museum-${id}.mp3`,
    refId: `char-${id}`,
  })),
};