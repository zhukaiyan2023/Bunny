/**
 * L1 · 游戏插画（Phaser 游戏场景用）
 *
 * 与 tier-a/b 的 picto-* 主插画风格一致 —— 主体 + 配套场景的儿童绘本构图。
 * 未来接入 Phaser 时可直接用，也可以用 CSS 滤镜按场景染色。
 *
 * 输出路径：`/assets/art/l1/game/<id>.jpg`
 * 登记入口：`assets/art/l1/game/manifest.json`（Phaser 用）
 */

const STYLE_SUFFIX =
  '3 year old girl picture book illustration style, ' +
  'soft pastel color palette (pink mint butter lavender sky blue), ' +
  'dreamy soft warm lighting, rounded chubby shapes with no sharp edges, ' +
  '3D render with soft shadows, clean uncluttered composition, ' +
  'square 1:1 framing, ' +
  'NO text NO Chinese characters NO alphabet letters NO digits NO writing NO symbols anywhere in the image.';

const SCENES = {
  'char-shan-game': 'A scene composition for the Chinese character 山 (mountain). Center: three soft rounded green mountain peaks with white snow caps. Foreground: rolling green grass with tiny wildflowers and small trees. Background: soft pastel sky with two fluffy white clouds.',
  'char-shui-game': 'A scene composition for the Chinese character 水 (water). Center: gentle flowing water stream shown as soft curved blue lines with three small water droplets. Foreground: moss-covered rocks with small green plants. Background: soft blue to cream gradient.',
  'char-mu-game':   'A scene composition for the Chinese character 木 (tree). Center: a single tree with brown trunk and round green canopy. Foreground: soft grass with tiny flowers. Background: soft pastel sky with one cloud.',
  'char-ri-game':   'A scene composition for the Chinese character 日 (sun). Center: a smiling sun with cute face (closed happy eyes, pink cheek blush, sweet smile) and short golden rays. Below: soft rolling green hills. Background: warm yellow-orange-pink gradient sky.',
};

module.exports = {
  art: Object.entries(SCENES).map(([id, scene]) => ({
    id,
    subject: id,
    prompt: `A 3 year old girl picture book illustration. ${scene} ${STYLE_SUFFIX}`,
    outPath: `/assets/art/l1/game/${id}.jpg`,
  })),
};
