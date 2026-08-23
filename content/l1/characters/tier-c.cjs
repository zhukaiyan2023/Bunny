/**
 * L1 · Tier-C 一年级高频字（80 字）
 *
 * 选字原则：
 *   - 部编/人教版一年级上册+下册全册覆盖
 *   - 高频日常字（数字 / 方位 / 自然 / 身体 / 动作 / 动物 / 食物 / 学校 / 颜色）
 *   - 形声字为主，含少量复合字
 *   - 笔画 ≤ 10，3-6 岁书写友好
 *
 * 教学策略：和 Tier-A 象形字不同，Tier-C 多用「常用词 + 场景图」教学，
 * 因为形声字字形和字义之间没有直接的象形关联，
 * 改用「字 + 词 + 场景」的具象化教学（参考 docs/CURRICULUM.md）。
 */

const STYLE_SUFFIX =
  '3 year old girl picture book illustration style, ' +
  'soft pastel color palette (pink mint butter lavender sky blue), ' +
  'dreamy soft warm lighting, rounded chubby shapes with no sharp edges, ' +
  '3D render with soft shadows, clean uncluttered composition, ' +
  'square 1:1 framing. ' +
  'NO text NO Chinese characters NO alphabet letters NO digits NO writing NO symbols anywhere in the image.';

/**
 * Tier-C 字形声字场景 prompt 生成器
 *
 * 设计原则：
 *   - 主体场景表达字义（如「苹」→ 苹果场景，「车」→ 一辆可爱小车）
 *   - 主体居中 ~60%，周边陪衬花草 / 草地
 *   - 不出现 Bunny 角色
 *   - 不出现任何文字 / 字母 / 数字
 */
function buildPictoPrompt(c) {
  const sceneFor = {
    '一': 'a single cute apple in the center of the frame. Round and shiny red with a tiny green leaf on top. Tiny sparkles around it. Background: soft cream-pink gradient with a small white cloud.',
    '二': 'two cute apples side by side in the center of the frame. Round and shiny red with tiny green leaves on top. Background: soft mint-green gradient.',
    '三': 'three cute apples in a row in the center of the frame. Round and shiny red with tiny green leaves. Background: soft butter-to-sky-blue gradient.',
    '四': 'four cute strawberries in a 2x2 grid in the center of the frame. Bright red with tiny seeds. Background: soft pink-to-cream gradient.',
    '五': 'five cute bananas in the center of the frame, slightly fanned out. Yellow with brown tips. Background: soft butter gradient with tiny stars.',
    '六': 'six cute oranges in a 2x3 grid in the center of the frame. Bright orange with tiny green leaves. Background: soft peach gradient.',
    '七': 'seven cute grapes in a cluster in the center of the frame. Purple and round with a small green stem. Background: soft lavender gradient.',
    '八': 'eight cute cherries in a 2x4 grid in the center of the frame. Bright red with thin green stems. Background: soft pink gradient.',
    '九': 'nine cute blueberries in a 3x3 grid in the center of the frame. Deep purple-blue and round. Background: soft sky-blue gradient.',
    '十': 'a small cross made of two soft pink twigs crossing in the center of the frame, like the Chinese character ten. Surrounded by tiny green leaves. Background: soft mint-cream gradient.',

    '天': 'a soft blue sky in the center of the frame with a few fluffy white clouds and a smiling sun in the corner. Tiny birds flying. Background: blue-to-pink gradient at horizon.',
    '地': 'soft green grass and brown earth in the center of the frame, with tiny flowers, a small rock, and a tiny sprout pushing up. Background: cream-to-sky-blue gradient.',
    '人': 'two chubby little children side by side holding hands in the center of the frame, both with happy faces and pink cheek blush. Background: soft mint gradient.',
    '你': 'a friendly pointing hand gesture in the center of the frame, finger pointing at the viewer as if saying "you". Soft skin tone with pink palm. Tiny hearts floating around. Background: soft pink-to-cream gradient.',
    '我': 'a chubby hand pointing at its own chest in the center of the frame, as if saying "me". Soft skin tone with pink palm. Background: soft butter gradient.',
    '他': 'a chubby little boy waving with a big smile in the center of the frame. Soft cream skin tone, friendly eyes. Background: soft sky-blue gradient.',
    '她': 'a chubby little girl with a ponytail waving with a big smile in the center of the frame. Soft cream skin tone, pink cheek blush, friendly eyes. Background: soft pink-to-cream gradient.',
    '它': 'a cute small puppy sitting in the center of the frame, looking up with big friendly eyes and wagging tail. Soft cream-brown fur with pink tongue. Background: soft mint gradient.',

    '上': 'a cute little bird sitting on top of a soft tree branch in the center of the frame. Small and chubby with pink chest. Background: soft sky-blue gradient.',
    '下': 'a small yellow umbrella in the center of the frame with tiny raindrops falling around it. Soft ground below. Background: soft blue-to-grey gradient sky.',
    '左': 'a chubby left hand pointing to the left in the center of the frame, with pink palm and soft skin. Background: soft butter gradient with tiny stars.',
    '右': 'a chubby right hand pointing to the right in the center of the frame, with pink palm and soft skin. Background: soft mint gradient with tiny hearts.',
    '前': 'a small chubby rabbit walking forward in the center of the frame, looking ahead with big eyes. Soft cream fur with pink ear interiors. Background: soft cream gradient with tiny flowers.',
    '后': 'a small chubby rabbit hopping backwards in the center of the frame, looking over its shoulder. Soft cream fur with pink ear interiors. Background: soft pink gradient with tiny clouds.',
    '里': 'a small house cross-section view in the center of the frame, showing cozy furniture inside: tiny bed, table, and a bunny sitting on a cushion. Background: soft warm cream gradient.',
    '外': 'a small house exterior in the center of the frame with a friendly bunny standing outside waving. Tiny flowers and a tree around. Background: soft sky-blue gradient.',

    '爸': 'a friendly chubby father figure in the center of the frame. Tall, kind eyes, slight smile, holding out a hand. Soft warm clothing. Background: soft butter-to-cream gradient.',
    '妈': 'a friendly chubby mother figure in the center of the frame. Kind eyes, warm smile, hair in a soft bun, gentle hands. Background: soft pink-to-cream gradient.',
    '哥': 'a friendly chubby older brother figure in the center of the frame. Slight smile, taller than a child, holding a small toy. Background: soft sky-blue gradient.',
    '姐': 'a friendly chubby older sister figure in the center of the frame. Warm smile, hair in a ponytail, kind eyes. Background: soft lavender-to-pink gradient.',
    '弟': 'a small chubby little brother figure in the center of the frame. Big curious eyes, slight smile, holding a tiny ball. Background: soft mint gradient.',
    '妹': 'a small chubby little sister figure in the center of the frame. Big curious eyes, sweet smile, pink cheek blush. Background: soft pink-to-cream gradient.',
    '家': 'a small cozy house in the center of the frame with a warm yellow light inside the window. Soft red roof, tiny chimney with smoke. Background: soft sky-to-cream gradient.',

    '学': 'a small cute school building in the center of the frame with a tiny flag on top. Soft yellow walls, red roof, friendly entrance. Background: soft sky-blue gradient.',
    '字': 'a small open book in the center of the frame with tiny colorful symbols on the pages (no actual text). A tiny cute bunny sitting next to it reading. Background: soft cream gradient.',
    '书': 'a stack of three cute small books in the center of the frame with soft pastel covers. Tiny bookmarks sticking out. Background: soft butter gradient.',
    '本': 'a single cute small book standing upright in the center of the frame with a soft pastel cover. Tiny star on the cover. Background: soft mint gradient.',
    '页': 'a single open book page in the center of the frame with soft watercolor illustration of flowers and a tiny bunny. Background: soft cream-pink gradient.',

    '鸡': 'a cute chubby chicken in the center of the frame. Round yellow body with a small red comb, friendly eyes, soft feathers. Background: soft butter gradient with grass at base.',
    '狗': 'a cute friendly puppy sitting in the center of the frame. Soft cream-brown fur, big eyes, pink tongue, wagging tail. Background: soft mint gradient.',
    '猫': 'a cute chubby kitten sitting in the center of the frame. Soft orange tabby fur, big green eyes, pink nose, friendly expression. Background: soft pink-to-cream gradient.',
    '鸭': 'a cute chubby duckling swimming in the center of the frame. Soft yellow fluffy feathers, orange beak, friendly eyes. Tiny water ripples. Background: soft sky-blue gradient.',
    '鹅': 'a cute chubby white goose in the center of the frame. Soft white feathers, orange beak, friendly eyes, long graceful neck. Background: soft mint-to-cream gradient.',
    '鸟': 'a small cute songbird in the center of the frame perched on a soft branch. Soft blue feathers, tiny wings, friendly expression. Background: soft sky-blue gradient with clouds.',
    '虫': 'a cute chubby caterpillar in the center of the frame. Soft green body with tiny pink spots, friendly face. Background: soft mint-cream gradient with leaves.',
    '鱼': 'a cute chubby fish swimming in the center of the frame. Soft orange scales, big eye, friendly smile. Tiny bubbles around. Background: soft sky-blue gradient.',

    '春': 'soft cherry blossoms blooming in the center of the frame. Pink petals floating in the air, small green buds on branches. Background: soft pink-to-sky-blue gradient.',
    '夏': 'a cute bright sun in the center of the frame with a soft beach scene: small waves, a tiny sandcastle, and a seashell. Background: soft butter-to-sky-blue gradient.',
    '秋': 'soft autumn leaves in warm colors (orange red yellow) falling in the center of the frame. Tiny acorns and a small pumpkin below. Background: soft amber-to-cream gradient.',
    '冬': 'a small cute snowman in the center of the frame with a tiny carrot nose, scarf, and happy face. Soft snowflakes falling. Background: soft white-to-sky-blue gradient.',
    '风': 'soft wind swirls in the center of the frame carrying tiny flower petals and a leaf. Friendly curve and motion. Background: soft mint-to-cream gradient.',
    '雪': 'soft white snowflakes falling in the center of the frame. Each snowflake is a unique simple 6-pointed star shape. Background: soft white-to-sky-blue gradient.',
    '雷': 'a small cute lightning bolt in the center of the frame with a tiny fluffy cloud above. Soft yellow bolt with pink edges. Background: soft grey-to-sky-blue gradient.',
    '电': 'a small cute spark of electricity in the center of the frame with tiny glow around it. Soft yellow with white center. Background: soft purple-to-sky-blue gradient.',
    '云': 'soft fluffy white clouds in the center of the frame. Two big puffy clouds and one small one, with smiling faces. Background: soft sky-blue gradient.',

    '红': 'a cute ripe strawberry in the center of the frame with a tiny green leaf. Bright red with soft seeds. Background: soft cream gradient.',
    '黄': 'a cute ripe banana in the center of the frame. Soft yellow with a tiny smile. Background: soft cream gradient.',
    '蓝': 'a cute bluebird in the center of the frame perched on a tiny branch. Soft blue feathers, friendly eyes. Background: soft sky-blue gradient.',
    '白': 'a cute fluffy white bunny in the center of the frame. Soft white fur, pink ear interiors, friendly smile. Background: soft cream-to-pink gradient.',
    '黑': 'a cute small black kitten in the center of the frame. Soft black fur with bright friendly eyes. Background: soft cream-to-lavender gradient.',
    '绿': 'a cute small green frog in the center of the frame. Soft green skin, big friendly eyes, sitting on a lily pad. Background: soft mint-cream gradient.',
    '紫': 'a cute bunch of purple grapes in the center of the frame. Soft purple with green leaf. Background: soft lavender gradient.',

    '桌': 'a small cute wooden table in the center of the frame with a tiny cup and a small flower on top. Soft wood texture. Background: soft cream gradient.',
    '椅': 'a small cute wooden chair in the center of the frame. Soft wood texture, slightly tilted to show comfort. Background: soft mint gradient.',
    '门': 'a small cute wooden door in the center of the frame. Soft brown wood with a tiny round handle and a small window above. Background: soft cream-to-sky-blue gradient.',
    '窗': 'a small cute window in the center of the frame with soft white curtains and a tiny flower on the windowsill. Background: soft sky-blue gradient with sunlight.',
    '灯': 'a cute small desk lamp in the center of the frame. Soft warm yellow light glowing from the lampshade. Background: soft cream-to-butter gradient.',
    '杯': 'a cute small cup in the center of the frame with steam rising from it. Soft pastel ceramic with a tiny heart design. Background: soft pink-to-cream gradient.',

    '车': 'a cute small red car in the center of the frame. Rounded shape with tiny windows and friendly headlights. Background: soft sky-blue gradient with a tiny road.',
    '船': 'a cute small sailboat in the center of the frame with a soft white sail. Tiny waves below. Background: soft sky-blue-to-sea-blue gradient.',
    '飞': 'a cute small paper airplane flying in the center of the frame with a tiny soft trail of clouds behind. Background: soft sky-blue gradient.',
    '机': 'a cute small airplane in the center of the frame flying through soft clouds. Rounded body, tiny wings, friendly face on the cockpit. Background: soft sky-blue gradient.',

    '苹': 'a cute shiny red apple in the center of the frame with a tiny green leaf. Background: soft mint-cream gradient.',
    '香': 'a cute small flower with a sweet fragrance aura in the center of the frame. Soft petals and tiny floating scent sparkles around. Background: soft pink-to-cream gradient.',
    '米': 'a small pile of rice grains in the center of the frame forming a tiny mountain shape. Tiny steam rising. Background: soft butter gradient with a tiny bowl.',
    '牛': 'a cute chubby cow in the center of the frame. Soft white-and-brown spots, friendly eyes, tiny bell on neck. Background: soft mint-green grass gradient.',
    '羊': 'a cute chubby sheep in the center of the frame with soft fluffy white wool. Tiny horns and friendly face. Background: soft mint gradient with grass.',
    '马': 'a cute friendly horse in the center of the frame. Soft brown coat, flowing mane, kind eyes. Background: soft amber-to-cream gradient.',
    '兔': 'a cute chubby bunny in the center of the frame with long soft ears. White fur with pink ear interiors, friendly smile. Background: soft cream-to-pink gradient.',

    '头': 'a cute small head silhouette in the center of the frame, with friendly eyes and pink cheek blush. Soft skin tone. Background: soft butter-to-cream gradient.',
    '眼': 'a big cute round eye in the center of the frame with long eyelashes and a tiny sparkle. Brown iris. Background: soft pink-to-cream gradient.',
    '牙': 'a cute single white tooth with a tiny happy face in the center of the frame. Pearly white with pink cheek blush. Background: soft mint-cream gradient.',
    '舌': 'a cute small tongue sticking out playfully in the center of the frame. Soft pink with a tiny happy expression. Background: soft pink-to-cream gradient.',

    '老': 'a friendly old grandpa figure in the center of the frame. White hair, kind smile, holding a tiny cane. Background: soft cream gradient.',
    '师': 'a friendly teacher figure in the center of the frame. Holding a tiny book and a kind smile. Background: soft mint-cream gradient.',
    '同': 'two small cute children standing side by side in the center of the frame, holding hands and smiling. Background: soft sky-blue gradient.',
    '好': 'a friendly thumbs-up hand in the center of the frame. Soft skin tone with pink palm. Tiny sparkles around. Background: soft mint-cream gradient.',

    '爱': 'a soft pink heart in the center of the frame surrounded by tiny floating hearts and sparkles. Warm glow. Background: soft pink-to-red gradient.',
    '笑': 'a cute happy smiling face in the center of the frame. Closed happy eyes, sweet smile, pink cheek blush. Tiny floating hearts. Background: soft butter-to-pink gradient.',
    '吃': 'a cute small bowl of rice with a tiny spoon in the center of the frame. Steam rising, friendly look. Background: soft cream-to-butter gradient.',
    '喝': 'a cute small cup of water with tiny bubbles in the center of the frame. Clear glass, tiny straw. Background: soft sky-blue-to-cream gradient.',

    '走': 'a small cute rabbit walking in the center of the frame with one paw forward and one back. Tiny footprints behind. Background: soft mint-cream gradient.',
    '跑': 'a small cute rabbit running in the center of the frame with both paws forward. Tiny cloud of dust behind. Background: soft sky-blue gradient.',
    '飞2': 'a cute small butterfly in the center of the frame with soft colorful wings. Flying motion, friendly face. Background: soft pink-to-cream gradient.',
    '看': 'a cute big eye looking forward in the center of the frame. Friendly brown iris with tiny sparkle. Background: soft butter-cream gradient.',
    '听': 'a cute soft ear in the center of the frame. Pink inner part, with tiny music notes floating around. Background: soft lavender gradient.',

    '说': 'a small cute speech bubble in the center of the frame with tiny floating hearts inside. Soft pastel colors. Background: soft sky-blue gradient.',
    '叫': 'a cute small open mouth in the center of the frame with a tiny voice wave coming out. Friendly smile. Background: soft pink-to-cream gradient.',
    '唱': 'a cute small music note in the center of the frame with a tiny bunny singing next to it. Tiny musical waves around. Background: soft lavender gradient.',
    '跳': 'a cute small bunny jumping in the center of the frame, mid-leap with happy face. Tiny motion lines. Background: soft mint-to-sky-blue gradient.',

    '大': 'a huge soft cute elephant in the center of the frame with tiny friendly eyes. Soft grey skin, big floppy ears. Background: soft sky-blue gradient.',
    '小': 'a tiny cute mouse in the center of the frame. Small and round with soft grey fur, big ears, friendly eyes. Background: soft cream-to-pink gradient.',
    '多': 'many tiny cute stars scattered in the center of the frame in various pastel colors. Like a starry night. Background: soft lavender-to-sky-blue gradient.',
    '少': 'a few tiny cute stars scattered in the center of the frame (just 3). Various pastel colors. Background: soft cream-to-sky-blue gradient.',

    '是': 'a cute checkmark in the center of the frame with a soft glow. Pink check mark with tiny sparkles. Background: soft mint-cream gradient.',
    '了': 'a cute small fireworks burst in the center of the frame with soft pastel colors. Sparkly celebration. Background: soft sky-blue gradient.',
    '我2': 'a chubby hand pointing at its own chest in the center of the frame, palm facing in. Soft skin tone with pink palm. Background: soft butter gradient.',

    '朋': 'two cute small bunnies side by side in the center of the frame, friends. Both with friendly smiles and pink cheek blush. Background: soft pink-to-mint gradient.',
    '友': 'two cute small hands making a friendship handshake in the center of the frame. Pink palm and cream palm. Tiny hearts above. Background: soft pink-to-cream gradient.',
  };

  const scene = sceneFor[c.glyph] ?? `a cute visual scene for ${c.glyph} in the center of the frame with soft pastel picture book style surroundings.`;
  return `A 3 year old girl picture book illustration. ${scene} ${STYLE_SUFFIX}`;
}

/**
 * Tier-C 数据集：80 字
 *
 * 来源：部编/人教版一年级语文（上+下）全册核心汉字
 * 分类：数字/方位/天地人/家/学校/动物/自然/颜色/家具/食物/身体/动作/抽象
 */
const TIER_C = [
  // ===== 数字 10 字 =====
  { id: 'char-yi-one', glyph: '一', pinyin: ['yī'], tone: 1, meaning: ['一，一个'], strokes: 1, tier: 'C', type: 'phonetic', origin: { fact: '最简单的汉字，一横。', story: '数东西的时候，第一个，就是"一"。' }, words: ['一个', '一只', '一起'], island: 'numbers' },
  { id: 'char-er-two', glyph: '二', pinyin: ['èr'], tone: 4, meaning: ['二，两个'], strokes: 2, tier: 'C', type: 'phonetic', origin: { fact: '两横，表示两个。', story: '"一"再加一横，就是"二"。' }, words: ['二月', '二月', '二个'], island: 'numbers' },
  { id: 'char-san', glyph: '三', pinyin: ['sān'], tone: 1, meaning: ['三，三个'], strokes: 3, tier: 'C', type: 'phonetic', origin: { fact: '三横，表示三个。', story: '"二"再加一横，就是"三"。' }, words: ['三月', '三天', '三个'], island: 'numbers' },
  { id: 'char-si', glyph: '四', pinyin: ['sì'], tone: 4, meaning: ['四，四个'], strokes: 5, tier: 'C', type: 'phonetic', origin: { fact: '"四"古字像鼻子呼吸的样子。', story: '古人用"四"代表呼吸的样子，因为鼻子在脸中间。' }, words: ['四季', '四只', '四个'], island: 'numbers' },
  { id: 'char-wu', glyph: '五', pinyin: ['wǔ'], tone: 3, meaning: ['五，五个'], strokes: 4, tier: 'C', type: 'phonetic', origin: { fact: '"五"古字像上下午之间。', story: '古人觉得"五"是一天里上下午中间的时刻。' }, words: ['五月', '五个', '五彩'], island: 'numbers' },
  { id: 'char-liu', glyph: '六', pinyin: ['liù'], tone: 4, meaning: ['六，六个'], strokes: 4, tier: 'C', type: 'phonetic', origin: { fact: '"六"古字像一间小屋。', story: '"六"原本画的是一间小房子。' }, words: ['六月', '六个', '六一'], island: 'numbers' },
  { id: 'char-qi', glyph: '七', pinyin: ['qī'], tone: 1, meaning: ['七，七个'], strokes: 2, tier: 'C', type: 'phonetic', origin: { fact: '"七"古字像切断的样子。', story: '古人在木头上切一道口子，就是"七"。' }, words: ['七月', '七个', '七彩'], island: 'numbers' },
  { id: 'char-ba-eight', glyph: '八', pinyin: ['bā'], tone: 1, meaning: ['八，八个'], strokes: 2, tier: 'C', type: 'phonetic', origin: { fact: '"八"古字像分开的两半。', story: '古人把东西掰成两半，就是"八"。' }, words: ['八月', '八个', '八角'], island: 'numbers' },
  { id: 'char-jiu', glyph: '九', pinyin: ['jiǔ'], tone: 3, meaning: ['九，九个'], strokes: 2, tier: 'C', type: 'phonetic', origin: { fact: '"九"古字像手肘弯曲。', story: '"九"原本画的是人的手肘弯曲的样子。' }, words: ['九月', '九个', '九十九'], island: 'numbers' },
  { id: 'char-shi-ten', glyph: '十', pinyin: ['shí'], tone: 2, meaning: ['十，十个'], strokes: 2, tier: 'C', type: 'phonetic', origin: { fact: '"十"是一横一竖，表示完整。', story: '"十"代表完整、齐全的数字。' }, words: ['十个', '十岁', '十片'], island: 'numbers' },

  // ===== 天地人你/我/他 7 字 =====
  { id: 'char-tian', glyph: '天', pinyin: ['tiān'], tone: 1, meaning: ['天空'], strokes: 4, tier: 'C', type: 'phonetic', origin: { fact: '"天"古字像人的头顶。', story: '"天"原本是"大"加"一"，表示人头顶之上。' }, words: ['天上', '天空', '每天'], island: 'nature' },
  { id: 'char-di', glyph: '地', pinyin: ['dì'], tone: 4, meaning: ['土地，大地'], strokes: 6, tier: 'C', type: 'phonetic', origin: { fact: '"地"古字像地上的土。', story: '"地"由"土"和"也"组成，是大地的意思。' }, words: ['土地', '地方', '地球'], island: 'nature' },
  { id: 'char-ren2', glyph: '人', pinyin: ['rén'], tone: 2, meaning: ['人们'], strokes: 2, tier: 'C', type: 'pictograph', origin: { fact: '"人"是人的侧影。', story: '"人"画的就是一个人侧立的样子。' }, words: ['大人', '人们', '好人'], island: 'starter' },
  { id: 'char-ni', glyph: '你', pinyin: ['nǐ'], tone: 3, meaning: ['你'], strokes: 7, tier: 'C', type: 'phonetic', origin: { fact: '"你"由"亻"和"尔"组成。', story: '"你"是指对方，是好朋友之间的称呼。' }, words: ['你好', '你们', '你的'], island: 'starter' },
  { id: 'char-wo', glyph: '我', pinyin: ['wǒ'], tone: 3, meaning: ['我自己'], strokes: 7, tier: 'C', type: 'phonetic', origin: { fact: '"我"由"戈"和"手"组成。', story: '"我"原本是手里握着一把戈（兵器），表示"自己"。' }, words: ['我们', '我的', '我国'], island: 'starter' },
  { id: 'char-ta1', glyph: '他', pinyin: ['tā'], tone: 1, meaning: ['他（男）'], strokes: 5, tier: 'C', type: 'phonetic', origin: { fact: '"他"由"亻"和"也"组成。', story: '"他"是指另一个男生。' }, words: ['他们', '他的', '他人'], island: 'starter' },
  { id: 'char-ta2', glyph: '她', pinyin: ['tā'], tone: 1, meaning: ['她（女）'], strokes: 6, tier: 'C', type: 'phonetic', origin: { fact: '"她"由"女"和"也"组成。', story: '"她"是指另一个女生。' }, words: ['她们', '她的', '她家'], island: 'starter' },

  // ===== 方位 8 字 =====
  { id: 'char-shang', glyph: '上', pinyin: ['shàng'], tone: 4, meaning: ['上面'], strokes: 3, tier: 'C', type: 'phonetic', origin: { fact: '"上"古字像一条线上面。', story: '"上"表示位置高、在高处。' }, words: ['上面', '上学', '早上'], island: 'starter' },
  { id: 'char-xia', glyph: '下', pinyin: ['xià'], tone: 4, meaning: ['下面'], strokes: 3, tier: 'C', type: 'phonetic', origin: { fact: '"下"古字像一条线下面。', story: '"下"表示位置低、在低处。' }, words: ['下面', '下雨', '地下'], island: 'starter' },
  { id: 'char-zuo', glyph: '左', pinyin: ['zuǒ'], tone: 3, meaning: ['左边'], strokes: 5, tier: 'C', type: 'phonetic', origin: { fact: '"左"古字像左手。', story: '"左"原本画的是一只左手。' }, words: ['左边', '左手', '左右'], island: 'starter' },
  { id: 'char-you-right', glyph: '右', pinyin: ['yòu'], tone: 4, meaning: ['右边'], strokes: 5, tier: 'C', type: 'phonetic', origin: { fact: '"右"古字像右手。', story: '"右"原本画的是一只右手。' }, words: ['右边', '右手', '左右'], island: 'starter' },
  { id: 'char-qian', glyph: '前', pinyin: ['qián'], tone: 2, meaning: ['前面'], strokes: 9, tier: 'C', type: 'phonetic', origin: { fact: '"前"由"⺊"和"月"组成。', story: '"前"原本是"月"加一个脚，意思是往前。' }, words: ['前面', '以前', '前方'], island: 'starter' },
  { id: 'char-hou', glyph: '后', pinyin: ['hòu'], tone: 4, meaning: ['后面'], strokes: 6, tier: 'C', type: 'phonetic', origin: { fact: '"后"古字像牵着丝线的人。', story: '"后"原本指君主，后来也指后面。' }, words: ['后面', '以后', '后来'], island: 'starter' },
  { id: 'char-li', glyph: '里', pinyin: ['lǐ'], tone: 3, meaning: ['里面'], strokes: 7, tier: 'C', type: 'phonetic', origin: { fact: '"里"古字像田地中心。', story: '"里"原本是田地的中心。' }, words: ['里面', '公里', '里外'], island: 'starter' },
  { id: 'char-wai', glyph: '外', pinyin: ['wài'], tone: 4, meaning: ['外面'], strokes: 5, tier: 'C', type: 'phonetic', origin: { fact: '"外"由"夕"和"卜"组成。', story: '"外"是夜晚在屋外占卜。' }, words: ['外面', '外边', '外面'], island: 'starter' },

  // ===== 家人 7 字 =====
  { id: 'char-ba-dad', glyph: '爸', pinyin: ['bà'], tone: 4, meaning: ['爸爸'], strokes: 8, tier: 'C', type: 'phonetic', origin: { fact: '"爸"由"父"和"巴"组成。', story: '"爸"是称呼爸爸的词。' }, words: ['爸爸', '爸妈', '老爸'], island: 'family' },
  { id: 'char-ma-mom', glyph: '妈', pinyin: ['mā'], tone: 1, meaning: ['妈妈'], strokes: 6, tier: 'C', type: 'phonetic', origin: { fact: '"妈"由"女"和"马"组成。', story: '"妈"是称呼妈妈的词。' }, words: ['妈妈', '爸妈', '姑妈'], island: 'family' },
  { id: 'char-ge', glyph: '哥', pinyin: ['gē'], tone: 1, meaning: ['哥哥'], strokes: 10, tier: 'C', type: 'phonetic', origin: { fact: '"哥"由"可"和"口"组成。', story: '"哥"是称呼哥哥的词。' }, words: ['哥哥', '大哥', '表哥'], island: 'family' },
  { id: 'char-jie', glyph: '姐', pinyin: ['jiě'], tone: 3, meaning: ['姐姐'], strokes: 8, tier: 'C', type: 'phonetic', origin: { fact: '"姐"由"女"和"且"组成。', story: '"姐"是称呼姐姐的词。' }, words: ['姐姐', '大姐', '表姐'], island: 'family' },
  { id: 'char-di2', glyph: '弟', pinyin: ['dì'], tone: 4, meaning: ['弟弟'], strokes: 7, tier: 'C', type: 'phonetic', origin: { fact: '"弟"由"丿"和"八"等组成。', story: '"弟"是称呼弟弟的词。' }, words: ['弟弟', '小弟', '表弟'], island: 'family' },
  { id: 'char-mei', glyph: '妹', pinyin: ['mèi'], tone: 4, meaning: ['妹妹'], strokes: 8, tier: 'C', type: 'phonetic', origin: { fact: '"妹"由"女"和"未"组成。', story: '"妹"是称呼妹妹的词。' }, words: ['妹妹', '小妹', '表妹'], island: 'family' },
  { id: 'char-jia', glyph: '家', pinyin: ['jiā'], tone: 1, meaning: ['家，家庭'], strokes: 10, tier: 'C', type: 'phonetic', origin: { fact: '"家"古字是屋里养着一头猪。', story: '"家"原本是屋子里有"豕"（猪），代表温暖的家。' }, words: ['家庭', '回家', '国家'], island: 'family' },

  // ===== 学校 5 字 =====
  { id: 'char-xue', glyph: '学', pinyin: ['xué'], tone: 2, meaning: ['学习'], strokes: 8, tier: 'C', type: 'phonetic', origin: { fact: '"学"古字是孩子双手捧着爻。', story: '"学"原本是小孩在屋子里学习的样子。' }, words: ['学习', '学生', '学校'], island: 'starter' },
  { id: 'char-zi', glyph: '字', pinyin: ['zì'], tone: 4, meaning: ['汉字'], strokes: 6, tier: 'C', type: 'phonetic', origin: { fact: '"字"由"宀"和"子"组成。', story: '"字"原本是在屋子里生孩子，给孩子取名。' }, words: ['汉字', '识字', '文字'], island: 'starter' },
  { id: 'char-shu', glyph: '书', pinyin: ['shū'], tone: 1, meaning: ['书本'], strokes: 4, tier: 'C', type: 'phonetic', origin: { fact: '"书"古字像一支笔在写字。', story: '"书"原本是手持毛笔写字的样子。' }, words: ['书本', '读书', '看书'], island: 'starter' },
  { id: 'char-ben', glyph: '本', pinyin: ['běn'], tone: 3, meaning: ['根本，本子'], strokes: 5, tier: 'C', type: 'phonetic', origin: { fact: '"本"古字是树根的样子。', story: '"本"原本画的是树根。' }, words: ['课本', '本子', '根本'], island: 'starter' },
  { id: 'char-ye', glyph: '页', pinyin: ['yè'], tone: 4, meaning: ['书页'], strokes: 4, tier: 'C', type: 'phonetic', origin: { fact: '"页"古字像一张树叶。', story: '"页"原本画的是人的头。' }, words: ['书页', '页码', '页面'], island: 'starter' },

  // ===== 动物 8 字 =====
  { id: 'char-ji-chicken', glyph: '鸡', pinyin: ['jī'], tone: 1, meaning: ['鸡'], strokes: 7, tier: 'C', type: 'phonetic', origin: { fact: '"鸡"由"鸟"和"奚"组成。', story: '鸡原本是能报晓的鸟。' }, words: ['公鸡', '母鸡', '鸡蛋'], island: 'animals' },
  { id: 'char-gou', glyph: '狗', pinyin: ['gǒu'], tone: 3, meaning: ['狗'], strokes: 8, tier: 'C', type: 'phonetic', origin: { fact: '"狗"由"犭"和"句"组成。', story: '"狗"是人类的好朋友。' }, words: ['小狗', '狗叫', '热狗'], island: 'animals' },
  { id: 'char-mao', glyph: '猫', pinyin: ['māo'], tone: 1, meaning: ['猫'], strokes: 11, tier: 'C', type: 'phonetic', origin: { fact: '"猫"由"犭"和"苗"组成。', story: '"猫"是喜欢抓老鼠的可爱动物。' }, words: ['小猫', '猫咪', '熊猫'], island: 'animals' },
  { id: 'char-ya', glyph: '鸭', pinyin: ['yā'], tone: 1, meaning: ['鸭'], strokes: 7, tier: 'C', type: 'phonetic', origin: { fact: '"鸭"由"鸟"和"甲"组成。', story: '"鸭"是喜欢游泳的家禽。' }, words: ['鸭子', '小鸭', '烤鸭'], island: 'animals' },
  { id: 'char-e', glyph: '鹅', pinyin: ['é'], tone: 2, meaning: ['鹅'], strokes: 12, tier: 'C', type: 'phonetic', origin: { fact: '"鹅"由"鸟"和"我"组成。', story: '"鹅"是能看家的大鸟。' }, words: ['白鹅', '鹅毛', '天鹅'], island: 'animals' },
  { id: 'char-niao', glyph: '鸟', pinyin: ['niǎo'], tone: 3, meaning: ['鸟'], strokes: 5, tier: 'C', type: 'pictograph', origin: { fact: '"鸟"古字像一只侧立的鸟。', story: '"鸟"原本画的就是一只鸟。' }, words: ['小鸟', '鸟类', '飞鸟'], island: 'animals' },
  { id: 'char-chong', glyph: '虫', pinyin: ['chóng'], tone: 2, meaning: ['虫'], strokes: 6, tier: 'C', type: 'pictograph', origin: { fact: '"虫"古字像一条蛇。', story: '"虫"原本指蛇，后来指各种小虫子。' }, words: ['虫子', '毛毛虫', '小虫'], island: 'animals' },
  { id: 'char-yu-fish', glyph: '鱼', pinyin: ['yú'], tone: 2, meaning: ['鱼'], strokes: 8, tier: 'C', type: 'pictograph', origin: { fact: '"鱼"古字像一条有头有尾的鱼。', story: '"鱼"原本画的就是一条鱼。' }, words: ['小鱼', '鱼儿', '金鱼'], island: 'animals' },

  // ===== 自然 8 字 =====
  { id: 'char-chun', glyph: '春', pinyin: ['chūn'], tone: 1, meaning: ['春天'], strokes: 9, tier: 'C', type: 'phonetic', origin: { fact: '"春"古字是春雷惊动草木的样子。', story: '"春"原本是春雷响起，草木苏醒的样子。' }, words: ['春天', '春季', '春风'], island: 'nature' },
  { id: 'char-xia2', glyph: '夏', pinyin: ['xià'], tone: 4, meaning: ['夏天'], strokes: 10, tier: 'C', type: 'phonetic', origin: { fact: '"夏"古字像跳舞的人。', story: '"夏"原本是夏天跳舞庆祝丰收的人。' }, words: ['夏天', '夏季', '夏日'], island: 'nature' },
  { id: 'char-qiu', glyph: '秋', pinyin: ['qiū'], tone: 1, meaning: ['秋天'], strokes: 9, tier: 'C', type: 'phonetic', origin: { fact: '"秋"古字像蟋蟀。', story: '"秋"原本是蟋蟀在秋天鸣叫。' }, words: ['秋天', '秋季', '秋风'], island: 'nature' },
  { id: 'char-dong', glyph: '冬', pinyin: ['dōng'], tone: 1, meaning: ['冬天'], strokes: 5, tier: 'C', type: 'phonetic', origin: { fact: '"冬"古字像绳子两端打结。', story: '"冬"原本指绳子两端打结。' }, words: ['冬天', '冬季', '冬日'], island: 'nature' },
  { id: 'char-feng', glyph: '风', pinyin: ['fēng'], tone: 1, meaning: ['风'], strokes: 4, tier: 'C', type: 'phonetic', origin: { fact: '"风"古字像风把鸟吹走的样子。', story: '"风"原本画的是凤鸟被风吹动的样子。' }, words: ['大风', '微风', '风雨'], island: 'nature' },
  { id: 'char-xue2', glyph: '雪', pinyin: ['xuě'], tone: 3, meaning: ['雪'], strokes: 11, tier: 'C', type: 'phonetic', origin: { fact: '"雪"古字是"雨"加"彗"。', story: '"雪"原本是雨加扫帚（彗），表示扫下来的雪。' }, words: ['下雪', '雪花', '雪人'], island: 'nature' },
  { id: 'char-lei', glyph: '雷', pinyin: ['léi'], tone: 2, meaning: ['雷'], strokes: 13, tier: 'C', type: 'phonetic', origin: { fact: '"雷"古字像车轮转动的样子。', story: '"雷"原本是雨加转动的车轮，表示雷声像车轮滚过。' }, words: ['打雷', '雷雨', '雷声'], island: 'nature' },
  { id: 'char-yun', glyph: '云', pinyin: ['yún'], tone: 2, meaning: ['云'], strokes: 4, tier: 'C', type: 'pictograph', origin: { fact: '"云"古字像云彩卷曲的样子。', story: '"云"原本画的就是云彩。' }, words: ['白云', '云朵', '乌云'], island: 'nature' },

  // ===== 颜色 7 字 =====
  { id: 'char-hong', glyph: '红', pinyin: ['hóng'], tone: 2, meaning: ['红色'], strokes: 6, tier: 'C', type: 'phonetic', origin: { fact: '"红"由"纟"和"工"组成。', story: '"红"原本指粉红色的丝线。' }, words: ['红色', '红花', '火红'], island: 'colors' },
  { id: 'char-huang', glyph: '黄', pinyin: ['huáng'], tone: 2, meaning: ['黄色'], strokes: 11, tier: 'C', type: 'phonetic', origin: { fact: '"黄"古字像佩玉。', story: '"黄"原本是系在腰间的黄色佩玉。' }, words: ['黄色', '黄金', '黄牛'], island: 'colors' },
  { id: 'char-lan', glyph: '蓝', pinyin: ['lán'], tone: 2, meaning: ['蓝色'], strokes: 13, tier: 'C', type: 'phonetic', origin: { fact: '"蓝"由"艹"和"监"组成。', story: '"蓝"原本指一种叫蓝草的植物，可以染蓝色。' }, words: ['蓝色', '蓝天', '蓝色'], island: 'colors' },
  { id: 'char-bai', glyph: '白', pinyin: ['bái'], tone: 2, meaning: ['白色'], strokes: 5, tier: 'C', type: 'pictograph', origin: { fact: '"白"古字像白色尖尖的东西。', story: '"白"原本是白色尖尖的样子。' }, words: ['白色', '白云', '白雪'], island: 'colors' },
  { id: 'char-hei', glyph: '黑', pinyin: ['hēi'], tone: 1, meaning: ['黑色'], strokes: 12, tier: 'C', type: 'phonetic', origin: { fact: '"黑"古字像人被烟熏黑了脸。', story: '"黑"原本是烟熏窗户，里面人被熏黑。' }, words: ['黑色', '黑夜', '黑暗'], island: 'colors' },
  { id: 'char-lv', glyph: '绿', pinyin: ['lǜ'], tone: 4, meaning: ['绿色'], strokes: 10, tier: 'C', type: 'phonetic', origin: { fact: '"绿"由"纟"和"录"组成。', story: '"绿"原本是绿色丝线。' }, words: ['绿色', '绿草', '绿叶'], island: 'colors' },
  { id: 'char-zi2', glyph: '紫', pinyin: ['zǐ'], tone: 3, meaning: ['紫色'], strokes: 12, tier: 'C', type: 'phonetic', origin: { fact: '"紫"由"糸"和"此"组成。', story: '"紫"原本是紫色的丝线。' }, words: ['紫色', '紫葡萄', '紫色'], island: 'colors' },

  // ===== 家具 6 字 =====
  { id: 'char-zhuo', glyph: '桌', pinyin: ['zhuō'], tone: 1, meaning: ['桌子'], strokes: 16, tier: 'C', type: 'phonetic', origin: { fact: '"桌"由"卓"和"木"组成。', story: '"桌"是高高的木台。' }, words: ['桌子', '书桌', '课桌'], island: 'starter' },
  { id: 'char-yi-chair', glyph: '椅', pinyin: ['yǐ'], tone: 3, meaning: ['椅子'], strokes: 12, tier: 'C', type: 'phonetic', origin: { fact: '"椅"由"奇"和"木"组成。', story: '"椅"是奇特的木制家具。' }, words: ['椅子', '木椅', '轮椅'], island: 'starter' },
  { id: 'char-men', glyph: '门', pinyin: ['mén'], tone: 2, meaning: ['门'], strokes: 3, tier: 'C', type: 'pictograph', origin: { fact: '"门"古字像两扇门。', story: '"门"原本画的是两扇对开的门。' }, words: ['大门', '开门', '门口'], island: 'starter' },
  { id: 'char-chuang', glyph: '窗', pinyin: ['chuāng'], tone: 1, meaning: ['窗'], strokes: 10, tier: 'C', type: 'phonetic', origin: { fact: '"窗"由"穴"和"囱"组成。', story: '"窗"是墙上的通风口。' }, words: ['窗户', '窗口', '窗帘'], island: 'starter' },
  { id: 'char-deng', glyph: '灯', pinyin: ['dēng'], tone: 1, meaning: ['灯'], strokes: 6, tier: 'C', type: 'phonetic', origin: { fact: '"灯"由"火"和"丁"组成。', story: '"灯"原本是"火"加"丁"，表示燃烧的灯。' }, words: ['电灯', '灯光', '灯火'], island: 'starter' },
  { id: 'char-bei', glyph: '杯', pinyin: ['bēi'], tone: 1, meaning: ['杯子'], strokes: 7, tier: 'C', type: 'phonetic', origin: { fact: '"杯"由"木"和"不"组成。', story: '"杯"原本是木头做的小杯子。' }, words: ['杯子', '水杯', '奖杯'], island: 'starter' },

  // ===== 交通 4 字 =====
  { id: 'char-che', glyph: '车', pinyin: ['chē'], tone: 1, meaning: ['车'], strokes: 4, tier: 'C', type: 'pictograph', origin: { fact: '"车"古字像一辆带轮子的车。', story: '"车"原本画的就是一辆车的样子。' }, words: ['小车', '汽车', '火车'], island: 'starter' },
  { id: 'char-chuan', glyph: '船', pinyin: ['chuán'], tone: 2, meaning: ['船'], strokes: 11, tier: 'C', type: 'phonetic', origin: { fact: '"船"由"舟"和"几"组成。', story: '"船"是水上的交通工具。' }, words: ['小船', '坐船', '船头'], island: 'starter' },
  { id: 'char-fei', glyph: '飞', pinyin: ['fēi'], tone: 1, meaning: ['飞'], strokes: 3, tier: 'C', type: 'pictograph', origin: { fact: '"飞"古字像一只展翅的鸟。', story: '"飞"原本画的是鸟展开翅膀的样子。' }, words: ['飞鸟', '飞机', '飞翔'], island: 'starter' },
  { id: 'char-ji-machine', glyph: '机', pinyin: ['jī'], tone: 1, meaning: ['机器'], strokes: 6, tier: 'C', type: 'phonetic', origin: { fact: '"机"由"木"和"几"组成。', story: '"机"原本是木头做的机关。' }, words: ['飞机', '机器', '电脑'], island: 'starter' },

  // ===== 食物 7 字 =====
  { id: 'char-ping', glyph: '苹', pinyin: ['píng'], tone: 2, meaning: ['苹果'], strokes: 8, tier: 'C', type: 'phonetic', origin: { fact: '"苹"由"艹"和"平"组成。', story: '"苹"原本是浮萍，后来专指苹果。' }, words: ['苹果', '青苹果', '苹果树'], island: 'plants' },
  { id: 'char-xiang', glyph: '香', pinyin: ['xiāng'], tone: 1, meaning: ['香气'], strokes: 9, tier: 'C', type: 'phonetic', origin: { fact: '"香"由"禾"和"口"组成。', story: '"香"原本是谷物成熟时飘出的香气。' }, words: ['香气', '香味', '香花'], island: 'plants' },
  { id: 'char-mi', glyph: '米', pinyin: ['mǐ'], tone: 3, meaning: ['大米'], strokes: 6, tier: 'C', type: 'pictograph', origin: { fact: '"米"古字像米粒。', story: '"米"原本画的就是一颗颗米粒。' }, words: ['大米', '米饭', '玉米'], island: 'plants' },
  { id: 'char-niu', glyph: '牛', pinyin: ['niú'], tone: 2, meaning: ['牛'], strokes: 4, tier: 'C', type: 'pictograph', origin: { fact: '"牛"古字像牛头。', story: '"牛"原本画的是牛头的形状。' }, words: ['小牛', '牛奶', '黄牛'], island: 'animals' },
  { id: 'char-yang', glyph: '羊', pinyin: ['yáng'], tone: 2, meaning: ['羊'], strokes: 6, tier: 'C', type: 'pictograph', origin: { fact: '"羊"古字像羊头有弯角。', story: '"羊"原本画的是有角的羊头。' }, words: ['小羊', '山羊', '绵羊'], island: 'animals' },
  { id: 'char-ma-horse', glyph: '马', pinyin: ['mǎ'], tone: 3, meaning: ['马'], strokes: 3, tier: 'C', type: 'pictograph', origin: { fact: '"马"古字像一匹马。', story: '"马"原本画的就是一匹马。' }, words: ['小马', '马车', '骏马'], island: 'animals' },
  { id: 'char-tu', glyph: '兔', pinyin: ['tù'], tone: 4, meaning: ['兔'], strokes: 7, tier: 'C', type: 'pictograph', origin: { fact: '"兔"古字像兔子。', story: '"兔"原本画的就是一只兔子。' }, words: ['小兔', '白兔', '玉兔'], island: 'animals' },

  // ===== 身体 4 字 =====
  { id: 'char-tou', glyph: '头', pinyin: ['tóu'], tone: 2, meaning: ['头部'], strokes: 5, tier: 'C', type: 'pictograph', origin: { fact: '"头"古字像人的头。', story: '"头"原本画的是人的头部。' }, words: ['头脑', '头发', '点头'], island: 'body' },
  { id: 'char-yan', glyph: '眼', pinyin: ['yǎn'], tone: 3, meaning: ['眼睛'], strokes: 11, tier: 'C', type: 'phonetic', origin: { fact: '"眼"由"目"和"艮"组成。', story: '"眼"是眼睛的意思。' }, words: ['眼睛', '眼泪', '眼光'], island: 'body' },
  { id: 'char-ya2', glyph: '牙', pinyin: ['yá'], tone: 2, meaning: ['牙齿'], strokes: 4, tier: 'C', type: 'pictograph', origin: { fact: '"牙"古字像牙齿。', story: '"牙"原本画的就是一颗牙齿。' }, words: ['牙齿', '刷牙', '门牙'], island: 'body' },
  { id: 'char-she', glyph: '舌', pinyin: ['shé'], tone: 2, meaning: ['舌头'], strokes: 6, tier: 'C', type: 'pictograph', origin: { fact: '"舌"古字像伸出的舌头。', story: '"舌"原本画的是嘴里伸出的舌头。' }, words: ['舌头', '舌尖', '口舌'], island: 'body' },

  // ===== 学校人物 4 字 =====
  { id: 'char-lao', glyph: '老', pinyin: ['lǎo'], tone: 3, meaning: ['老人'], strokes: 6, tier: 'C', type: 'pictograph', origin: { fact: '"老"古字像老人弓背拄杖。', story: '"老"原本画的是驼背拄拐的老人。' }, words: ['老人', '老师', '古老'], island: 'family' },
  { id: 'char-shi-teacher', glyph: '师', pinyin: ['shī'], tone: 1, meaning: ['老师'], strokes: 6, tier: 'C', type: 'phonetic', origin: { fact: '"师"由"帀"和"土"组成。', story: '"师"原本指军队，后来指传授知识的人。' }, words: ['老师', '师傅', '军师'], island: 'family' },
  { id: 'char-tong', glyph: '同', pinyin: ['tóng'], tone: 2, meaning: ['同学'], strokes: 6, tier: 'C', type: 'compound', origin: { fact: '"同"由"冂"和"口"组成。', story: '"同"是封闭的同一个口。' }, words: ['同学', '同事', '相同'], island: 'starter' },
  { id: 'char-hao2', glyph: '好', pinyin: ['hǎo'], tone: 3, meaning: ['好'], strokes: 6, tier: 'C', type: 'phonetic', origin: { fact: '"好"由"女"和"子"组成。', story: '"好"是女子和孩子在一起。' }, words: ['好的', '你好', '好看'], island: 'starter' },

  // ===== 抽象/常用 8 字 =====
  { id: 'char-ai', glyph: '爱', pinyin: ['ài'], tone: 4, meaning: ['喜爱'], strokes: 10, tier: 'C', type: 'phonetic', origin: { fact: '"爱"由"爫"和"夂"和"心"组成。', story: '"爱"原本是心里想着，用行动表达。' }, words: ['可爱', '爱心', '爱笑'], island: 'starter' },
  { id: 'char-xiao', glyph: '笑', pinyin: ['xiào'], tone: 4, meaning: ['笑'], strokes: 10, tier: 'C', type: 'phonetic', origin: { fact: '"笑"由"竹"和"夭"组成。', story: '"笑"是心情好发出的声音。' }, words: ['笑脸', '微笑', '大笑'], island: 'starter' },
  { id: 'char-chi', glyph: '吃', pinyin: ['chī'], tone: 1, meaning: ['吃'], strokes: 6, tier: 'C', type: 'phonetic', origin: { fact: '"吃"由"口"和"乞"组成。', story: '"吃"是用口吃东西。' }, words: ['吃饭', '好吃', '吃鱼'], island: 'starter' },
  { id: 'char-he', glyph: '喝', pinyin: ['hē'], tone: 1, meaning: ['喝'], strokes: 12, tier: 'C', type: 'phonetic', origin: { fact: '"喝"由"口"和"曷"组成。', story: '"喝"是口渴要喝水。' }, words: ['喝水', '喝茶', '喝奶'], island: 'starter' },

  // ===== 动作 6 字 =====
  { id: 'char-zou', glyph: '走', pinyin: ['zǒu'], tone: 3, meaning: ['走'], strokes: 7, tier: 'C', type: 'pictograph', origin: { fact: '"走"古字像一个人甩开胳膊跑。', story: '"走"原本是奔跑的样子。' }, words: ['走路', '走开', '行走'], island: 'actions' },
  { id: 'char-pao', glyph: '跑', pinyin: ['pǎo'], tone: 3, meaning: ['跑'], strokes: 12, tier: 'C', type: 'phonetic', origin: { fact: '"跑"由"足"和"包"组成。', story: '"跑"是用脚快速移动。' }, words: ['跑步', '跑开', '奔跑'], island: 'actions' },
  { id: 'char-kan', glyph: '看', pinyin: ['kàn'], tone: 4, meaning: ['看'], strokes: 9, tier: 'C', type: 'phonetic', origin: { fact: '"看"由"手"和"目"组成。', story: '"看"是用手遮光，眯眼看。' }, words: ['看见', '看书', '好看'], island: 'actions' },
  { id: 'char-ting', glyph: '听', pinyin: ['tīng'], tone: 1, meaning: ['听'], strokes: 7, tier: 'C', type: 'phonetic', origin: { fact: '"听"由"口"和"斤"组成。', story: '"听"是用耳朵听声音。' }, words: ['听话', '听见', '好听'], island: 'actions' },

  // ===== 社交 4 字 =====
  { id: 'char-shuo', glyph: '说', pinyin: ['shuō'], tone: 1, meaning: ['说'], strokes: 9, tier: 'C', type: 'phonetic', origin: { fact: '"说"由"讠"和"兑"组成。', story: '"说"是用嘴说话。' }, words: ['说话', '听说', '看书'], island: 'actions' },
  { id: 'char-jiao', glyph: '叫', pinyin: ['jiào'], tone: 4, meaning: ['叫'], strokes: 5, tier: 'C', type: 'phonetic', origin: { fact: '"叫"由"口"和"丩"组成。', story: '"叫"是张口发出声音。' }, words: ['叫喊', '叫声', '大叫'], island: 'actions' },
  { id: 'char-chang', glyph: '唱', pinyin: ['chàng'], tone: 4, meaning: ['唱'], strokes: 11, tier: 'C', type: 'phonetic', origin: { fact: '"唱"由"昌"和"口"组成。', story: '"唱"是嘴里发出歌声。' }, words: ['唱歌', '唱歌', '合唱'], island: 'actions' },
  { id: 'char-tiao', glyph: '跳', pinyin: ['tiào'], tone: 4, meaning: ['跳'], strokes: 13, tier: 'C', type: 'phonetic', origin: { fact: '"跳"由"足"和"兆"组成。', story: '"跳"是用脚跃起。' }, words: ['跳舞', '跳动', '跳跃'], island: 'actions' },

  // ===== 抽象 4 字 =====
  { id: 'char-da', glyph: '大', pinyin: ['dà'], tone: 4, meaning: ['大'], strokes: 3, tier: 'C', type: 'pictograph', origin: { fact: '"大"古字像人张开手脚站立。', story: '"大"原本画的是人张开四肢很大。' }, words: ['大小', '大鱼', '大雨'], island: 'starter' },
  { id: 'char-xiao2', glyph: '小', pinyin: ['xiǎo'], tone: 3, meaning: ['小'], strokes: 3, tier: 'C', type: 'pictograph', origin: { fact: '"小"古字像三颗小点。', story: '"小"原本画的是三颗小小的颗粒。' }, words: ['大小', '小雨', '小猫'], island: 'starter' },
  { id: 'char-duo', glyph: '多', pinyin: ['duō'], tone: 1, meaning: ['多'], strokes: 6, tier: 'C', type: 'phonetic', origin: { fact: '"多"古字像两条夕。', story: '"多"是很多东西聚在一起。' }, words: ['多少', '很多', '大多'], island: 'starter' },
  { id: 'char-shao', glyph: '少', pinyin: ['shǎo'], tone: 3, meaning: ['少'], strokes: 4, tier: 'C', type: 'phonetic', origin: { fact: '"少"古字像小点。', story: '"少"是东西不多。' }, words: ['多少', '很少', '少数'], island: 'starter' },

  // ===== 社交 2 字 =====
  { id: 'char-peng', glyph: '朋', pinyin: ['péng'], tone: 2, meaning: ['朋友'], strokes: 8, tier: 'C', type: 'compound', origin: { fact: '"朋"由两个月组成。', story: '"朋"原本是两串贝壳（货币），表示"同伙"。' }, words: ['朋友', '亲朋', '高朋'], island: 'family' },
  { id: 'char-you-friend', glyph: '友', pinyin: ['yǒu'], tone: 3, meaning: ['朋友'], strokes: 4, tier: 'C', type: 'phonetic', origin: { fact: '"友"古字像两只手。', story: '"友"原本是两只右手相握。' }, words: ['朋友', '友好', '友爱'], island: 'family' },

  // ===== 抽象 2 字 =====
  { id: 'char-shi2', glyph: '是', pinyin: ['shì'], tone: 4, meaning: ['是的'], strokes: 9, tier: 'C', type: 'phonetic', origin: { fact: '"是"由"日"和"正"组成。', story: '"是"原本是太阳正直。' }, words: ['是的', '不是', '就是'], island: 'starter' },
  { id: 'char-le', glyph: '了', pinyin: ['le'], tone: 0, meaning: ['完成'], strokes: 2, tier: 'C', type: 'phonetic', origin: { fact: '"了"古字像小孩。', story: '"了"原本是小孩的样子。' }, words: ['好的', '走了', '来了'], island: 'starter' },
];

module.exports = {
  characters: TIER_C,
  cues: TIER_C.map((c) => ({
    id: `char-${c.id.replace('char-', '')}-pron`,
    kind: 'character',
    text: `${c.glyph}，${c.glyph}，${c.glyph}。`,
    url: `/assets/audio/l1/tier-c/${c.id.replace('char-', '')}-pron.mp3`,
    refId: c.id,
  })),
  art: TIER_C.map((c) => ({
    id: `picto-${c.id.replace('char-', '')}`,
    subject: c.glyph,
    // 🚫 严禁要求模型"写字" — 改为纯视觉图标
    prompt: buildPictoPrompt(c),
    outPath: `/assets/art/l1/tier-c/picto-${c.id.replace('char-', '')}.jpg`,
    refId: c.id,
  })),
};