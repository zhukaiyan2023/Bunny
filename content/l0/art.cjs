/**
 * L0 · 学前插画 cue 清单（Bunny 姿势 / 朋友 / UI 装饰 / 徽章 / 背景）
 *
 * 🎨 风格基线：适合 3 岁女孩
 *   - pastel 粉彩色调（柔粉 · 薄荷 · 奶黄 · 淡紫 · 天蓝）
 *   - 整体梦幻、柔软、温暖、安全
 *   - 圆润 0 尖角，所有角色都是胖嘟嘟的
 *   - 拟人化（每个角色都有大大的圆眼睛 + 腮红 + 甜甜的笑）
 *   - 装饰小元素：花朵、爱心、蝴蝶、星星、小蘑菇、小云朵
 *
 * 🚫 严禁在 prompt 里写任何中文字或具体文字！
 *    模型对中文/任何文字渲染都很不可靠，出来的字都是错的/扭曲的。
 *    改用 emoji + 视觉元素 + 通用符号来表达含义。
 */

const STYLE_SUFFIX = '3 year old girl picture book style, pastel pink mint butter lavender palette, dreamy soft warm, rounded chubby shapes with no sharp edges, all characters chubby with big round eyes pink cheek blush sweet smile, 3D render, transparent background.';

const BUNNY_POSES = [
  { id: 'idle',     prompt: 'A cute chubby white bunny character standing pose, long droopy floppy ears with pink inner ear, red small backpack, big round black eyes, pink cheek blush, sweet smile, ' },
  { id: 'happy',    prompt: 'A cute chubby white bunny character joyful tiptoe pose, long floppy ears floating up gently, smiling with closed crescent eyes, paws raised gently at chest, red small backpack, surrounded by soft floating hearts and tiny flower petals, ' },
  { id: 'cheering', prompt: 'A cute chubby white bunny character celebrating with both arms reaching up, long floppy ears, pink inner ear, red small backpack, big open smile, confetti and stars around, ' },
  { id: 'reading',  prompt: 'A cute chubby white bunny character sitting cross-legged hugging a big open picture book, focused expression, long floppy ears, red small backpack, surrounded by flowers and butterflies, ' },
  { id: 'listening',prompt: 'A cute chubby white bunny character tilting head listening, one long floppy ear up and the other floppy down, pink inner ear, red small backpack, focused cute expression, ' },
  { id: 'waving',   prompt: 'A cute chubby white bunny character waving hello with one paw up, red small backpack, long floppy ear up and one floppy down, big open smile, ' },
];

const COMPANIONS = [
  { id: 'fox',     prompt: 'A cute chubby little fox character, soft orange-red fur, pink bow scarf around neck, friendly sweet smile, ' },
  { id: 'frog',    prompt: 'A cute chubby little frog character, mint green body, big sparkly eyes with a tiny bow, sitting on a pink lotus leaf, ' },
  { id: 'bird',    prompt: 'A cute chubby little bird character, butter yellow body with orange beak, tiny flower on head, sitting on a pink branch, ' },
  { id: 'panda',   prompt: 'A cute chubby little panda character, black and white fur, pink scarf, holding a heart shape in paws, ' },
  { id: 'deer',    prompt: 'A cute chubby little deer character, soft caramel body with white spots, tiny pink antlers, flower crown on head, ' },
];

const UI_DECORATIONS = [
  { id: 'book',     prompt: 'An open picture book, pink cover, centered, two facing pages with colorful illustrations of flowers hearts butterflies, ' },
  { id: 'scroll',   prompt: 'An unrolled soft scroll, cream paper color, with pink ribbon ties at both ends, ' },
  { id: 'star',     prompt: 'A soft butter-yellow star with a cute face, big round eyes and pink cheek blush and sweet smile, ' },
  { id: 'lock',     prompt: 'A friendly pink padlock with a heart-shaped golden keyhole, ' },
  { id: 'gift',     prompt: 'A friendly soft pink gift box with a butter-cream and gold ribbon bow on top, ' },
];

const WORLD_BADGES = [
  { id: 'starter', prompt: 'A round pastel green badge with a small sprout seedling icon and tiny stars around, ' },
  { id: 'family',  prompt: 'A round pastel pink badge with a tiny house icon and hearts around, ' },
  { id: 'animals', prompt: 'A round pastel peach badge with a tiny bunny rabbit icon and paw prints around, ' },
  { id: 'plants',  prompt: 'A round pastel mint badge with a tiny tree icon and flowers around, ' },
  { id: 'body',    prompt: 'A round pastel lavender badge with a tiny eye icon and hearts around, ' },
  { id: 'stories', prompt: 'A round pastel sky-blue badge with a tiny open book icon and sparkles around, ' },
];

const BACKGROUNDS = [
  { id: 'forest-light', prompt: 'A sunny forest floor background, soft mint green and caramel tree shadows, with small flowers and butterflies, widescreen 1024x1024, no foreground characters, ' },
  { id: 'pond',         prompt: 'A peaceful pastel pond background, soft blue-green water surface with pink water lilies and distant mountain reflection, with tiny butterflies, widescreen 1024x1024, no foreground characters, ' },
  { id: 'sky-day',      prompt: 'A pastel bright blue sky background with a few cream clouds and a soft rainbow, widescreen 1024x1024, no foreground characters, ' },
  { id: 'meadow',       prompt: 'A pastel wildflower meadow background, butter yellow pink lavender tiny flowers and butterflies, widescreen 1024x1024, no foreground characters, ' },
];

module.exports = {
  art: [
    ...BUNNY_POSES.map((p) => ({
      id: `bunny-${p.id}`,
      subject: `Bunny pose ${p.id}`,
      prompt: p.prompt + STYLE_SUFFIX,
      outPath: `/assets/art/l0/bunny/bunny-${p.id}.jpg`,
    })),
    ...COMPANIONS.map((p) => ({
      id: `companion-${p.id}`,
      subject: `companion ${p.id}`,
      prompt: p.prompt + STYLE_SUFFIX,
      outPath: `/assets/art/l0/companions/companion-${p.id}.jpg`,
    })),
    ...UI_DECORATIONS.map((p) => ({
      id: `ui-${p.id}`,
      subject: `UI decoration ${p.id}`,
      prompt: p.prompt + STYLE_SUFFIX,
      outPath: `/assets/art/l0/ui/ui-${p.id}.jpg`,
    })),
    ...WORLD_BADGES.map((p) => ({
      id: `badge-${p.id}`,
      subject: `world badge ${p.id}`,
      prompt: p.prompt + STYLE_SUFFIX,
      outPath: `/assets/art/l0/badges/badge-${p.id}.jpg`,
    })),
    ...BACKGROUNDS.map((p) => ({
      id: `bg-${p.id}`,
      subject: `background ${p.id}`,
      prompt: p.prompt + STYLE_SUFFIX,
      outPath: `/assets/art/l0/backgrounds/bg-${p.id}.jpg`,
    })),
  ],
};