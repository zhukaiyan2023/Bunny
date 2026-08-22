/**
 * L1 · characters 聚合入口
 * 让 cue-manifest 只需读一个文件就能拿到全部 characters
 */

const TIER_A = require('./tier-a.cjs');
const TIER_B = require('./tier-b.cjs');

module.exports = {
  characters: [...TIER_A.characters, ...TIER_B.characters],
  cues: [...TIER_A.cues, ...TIER_B.cues],
  art: [...TIER_A.art, ...TIER_B.art],
};