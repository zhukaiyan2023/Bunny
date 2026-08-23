/**
 * L1 · characters 聚合入口
 * 让 cue-manifest 只需读一个文件就能拿到全部 characters
 */

const TIER_A = require('./tier-a.cjs');
const TIER_B = require('./tier-b.cjs');
const TIER_C = require('./tier-c.cjs');
const TIER_D = require('./tier-d.cjs');
const TIER_E = require('./tier-e.cjs');

module.exports = {
  characters: [...TIER_A.characters, ...TIER_B.characters, ...TIER_C.characters, ...TIER_D.characters, ...TIER_E.characters],
  cues: [...TIER_A.cues, ...TIER_B.cues, ...TIER_C.cues, ...TIER_D.cues, ...TIER_E.cues],
  art: [...TIER_A.art, ...TIER_B.art, ...TIER_C.art, ...TIER_D.art, ...TIER_E.art],
};