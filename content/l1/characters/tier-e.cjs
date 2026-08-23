/**
 * L1 · Tier-E 一年级扩展字（100 字）
 *
 * 选字原则：
 *   - 部编/人教版一年级高频字扩展
 *   - 主题：方位 / 数量 / 反义词 / 形容词 / 职业 / 工具 / 形容词
 *   - 让 L1 总量达到 ~300 字（小学 1 年级核心字）
 *
 * 与 Tier-D 区别：更细分的常用字，覆盖句子里常见的修饰字、虚词、动词。
 */

const STYLE_SUFFIX =
  '3 year old girl picture book illustration style, ' +
  'soft pastel color palette (pink mint butter lavender sky blue), ' +
  'dreamy soft warm lighting, rounded chubby shapes with no sharp edges, ' +
  '3D render with soft shadows, clean uncluttered composition, ' +
  'square 1:1 framing. ' +
  'NO text NO Chinese characters NO alphabet letters NO digits NO writing NO symbols anywhere in the image.';

function buildPictoPrompt(c) {
  const sceneFor = {
    '两': 'two cute tiny strawberries side by side in the center of the frame. Bright red with tiny seeds and green leaves. Background: soft pink-to-cream gradient.',
    '半': 'a cute half apple in the center of the frame. Pink inside with tiny seeds, red outside. Background: soft pink gradient.',
    '百': 'many cute tiny stars in the center of the frame forming the shape of one hundred. Soft pastel colors. Background: soft lavender-to-sky-blue gradient.',
    '千': 'many cute tiny stars in the center of the frame forming a thousand pattern. Soft pastel colors. Background: soft purple-to-sky-blue gradient.',

    '只': 'a cute small bunny paw in the center of the frame with one paw up as if counting. Soft cream fur. Background: soft pink-to-cream gradient.',
    '条': 'a cute small wiggly worm in the center of the frame. Soft pink, friendly face. Background: soft mint-to-cream gradient.',
    '本2': 'a single cute small book in the center of the frame with a tiny star on the cover. Soft pastel. Background: soft cream-to-butter gradient.',
    '棵': 'a cute small tree sapling in the center of the frame. Soft green leaves, brown trunk. Background: soft mint-to-sky-blue gradient.',

    '比': 'two cute small icons in the center of the frame side by side, one slightly bigger than the other. Soft pastel. Background: soft mint-to-cream gradient.',
    '再': 'a cute small arrow pointing back to the start in the center of the frame. Soft pink arrow with friendly face. Background: soft cream gradient.',
    '也': 'two cute small identical bunny faces in the center of the frame side by side, both smiling. Soft cream fur. Background: soft pink-to-mint gradient.',
    '还': 'a cute small hand returning something in the center of the frame. Soft skin tone with pink palm. Background: soft butter gradient.',

    '这': 'a cute small finger pointing at something close in the center of the frame. Soft skin tone with pink nail. Background: soft cream-to-butter gradient.',
    '那': 'a cute small finger pointing at something far in the center of the frame. Soft skin tone with pink nail. Background: soft sky-blue gradient.',
    '哪': 'a cute small confused face with a question mark in the center of the frame. Soft pastel. Background: soft lavender gradient.',
    '儿': 'a cute small child figure in the center of the frame. Soft cream skin, friendly face, big curious eyes. Background: soft pink-to-cream gradient.',

    '把': 'a cute small hand gripping a tiny object in the center of the frame. Soft skin tone with pink palm. Background: soft mint-cream gradient.',
    '个': 'a cute small single seed in the center of the frame with a tiny green sprout. Soft pastel. Background: soft butter-to-mint gradient.',
    '和': 'a cute small heart connecting two small bunny paws in the center of the frame. Soft pink heart. Background: soft pink-to-cream gradient.',
    '的': 'a cute small white dove in the center of the frame. Soft white feathers, friendly eyes. Background: soft sky-blue gradient.',

    '在': 'a cute small chick sitting in a nest in the center of the frame. Soft yellow feathers. Background: soft butter-to-sky-blue gradient.',
    '有': 'a cute small open hand with two tiny stars in the palm in the center of the frame. Soft skin tone with pink palm. Background: soft mint-cream gradient.',
    '无': 'a cute small empty bowl in the center of the frame with a tiny "nothing" cloud floating above. Soft cream. Background: soft lavender gradient.',
    '来': 'a cute small friendly bunny walking forward in the center of the frame with a wave. Soft cream fur. Background: soft mint gradient.',

    '去': 'a cute small bunny walking away in the center of the frame, looking back with a wave. Soft cream fur. Background: soft pink-to-cream gradient.',
    '回': 'a cute small bunny returning home in the center of the frame, walking toward a tiny house. Background: soft sky-blue-to-cream gradient.',
    '到': 'a cute small flag in the center of the frame marking an arrival point. Soft pastel. Background: soft mint-to-sky-blue gradient.',
    '出': 'a cute small bunny emerging from a tiny doorway in the center of the frame. Soft cream fur. Background: soft butter gradient.',

    '入': 'a cute small bunny entering a tiny doorway in the center of the frame. Soft cream fur. Background: soft pink-to-cream gradient.',
    '开': 'a cute small open door in the center of the frame with light shining through. Soft wood. Background: soft butter-to-cream gradient.',
    '关': 'a cute small closed door in the center of the frame. Soft wood. Background: soft sky-blue gradient.',
    '看2': 'a cute small pair of binoculars in the center of the frame. Soft pastel. Background: soft cream gradient.',

    '会': 'a cute small lightbulb in the center of the frame with sparkles around. Soft yellow glow. Background: soft cream-to-butter gradient.',
    '能': 'a cute small flexed arm in the center of the frame. Soft skin tone with pink palm. Background: soft mint-cream gradient.',
    '可': 'a cute small "OK" hand gesture in the center of the frame. Soft skin tone with pink palm. Background: soft pink gradient.',
    '以': 'a cute small arrow pointing forward in the center of the frame. Soft blue arrow. Background: soft sky-blue gradient.',

    '要': 'a cute small star with a face in the center of the frame. Soft yellow, smiling. Background: soft butter gradient.',
    '想': 'a cute small thought bubble in the center of the frame with a tiny heart inside. Soft pastel. Background: soft pink-to-sky-blue gradient.',
    '知': 'a cute small lightbulb with rays in the center of the frame. Soft yellow glow. Background: soft butter-to-sky-blue gradient.',
    '觉': 'a cute small face with closed sleepy eyes in the center of the frame. Soft pink cheek blush. Background: soft lavender gradient.',

    '我3': 'a cute small hand pointing at its chest in the center of the frame. Soft skin tone with pink palm. Background: soft butter gradient.',
    '你2': 'a cute small finger pointing forward at the viewer in the center of the frame. Soft skin tone with pink nail. Background: soft pink-to-cream gradient.',
    '他2': 'a cute small boy figure in the center of the frame waving. Soft cream skin. Background: soft sky-blue gradient.',
    '她2': 'a cute small girl figure in the center of the frame with a ponytail. Soft cream skin, pink cheek blush. Background: soft pink gradient.',

    '们': 'three cute small children standing side by side in the center of the frame holding hands. Soft pastel clothing. Background: soft mint-to-cream gradient.',
    '些': 'many cute small hearts scattered in the center of the frame. Various pastel colors. Background: soft pink gradient.',
    '样': 'a cute small butterfly in the center of the frame with soft pastel wings. Background: soft lavender gradient.',
    '种': 'a cute small seed in the center of the frame with a tiny green sprout coming out. Soft brown and green. Background: soft mint gradient.',

    '事': 'a cute small scroll in the center of the frame with tiny drawings (no text). Soft pastel. Background: soft butter gradient.',
    '情': 'a cute small heart in the center of the frame with a tiny smile. Soft pink. Background: soft pink-to-cream gradient.',
    '意': 'a cute small thought bubble with a tiny heart in the center of the frame. Soft pastel. Background: soft lavender-to-cream gradient.',
    '心2': 'a cute small pink heart in the center of the frame with a sweet smile. Background: soft pink-to-cream gradient.',

    '起': 'a cute small bunny jumping up in the center of the frame with happy face. Soft cream fur. Background: soft sky-blue gradient.',
    '来2': 'a cute small arrow pointing right in the center of the frame with a friendly face. Soft pink. Background: soft mint-cream gradient.',
    '坐': 'a cute small child sitting cross-legged in the center of the frame with a smile. Soft pastel clothing. Background: soft butter-to-cream gradient.',
    '站': 'a cute small child standing tall in the center of the frame with hands on hips. Soft pastel. Background: soft sky-blue-to-cream gradient.',

    '睡': 'a cute small sleeping bunny in the center of the frame with closed peaceful eyes. Soft cream fur. Background: soft purple-to-sky-blue gradient.',
    '醒': 'a cute small bunny just waking up in the center of the frame with sleepy eyes. Soft cream fur. Background: soft butter-to-sky-blue gradient.',
    '忙': 'a cute small busy bee in the center of the frame with tiny wings. Soft yellow and black stripes. Background: soft butter gradient.',
    '累': 'a cute small tired bunny in the center of the frame sitting down. Soft cream fur. Background: soft pink-to-cream gradient.',

    '饿': 'a cute small tummy in the center of the frame growling with a tiny "rumble" wave. Soft skin tone. Background: soft peach-to-cream gradient.',
    '渴': 'a cute small water droplet in the center of the frame with a tiny tongue. Soft blue. Background: soft sky-blue gradient.',
    '饱': 'a cute small happy tummy in the center of the frame with a content smile. Soft skin tone. Background: soft butter-to-peach gradient.',
    '冷': 'a cute small shivering bunny in the center of the frame wrapped in a soft blanket. Soft cream fur. Background: soft sky-blue gradient.',

    '热': 'a cute small bright sun in the center of the frame making everything warm. Soft yellow rays. Background: soft butter-to-pink gradient.',
    '暖': 'a cute small cup of hot cocoa in the center of the frame with steam rising. Soft brown mug. Background: soft cream-to-pink gradient.',
    '凉': 'a cute small ice cream cone in the center of the frame. Soft pastel scoops. Background: soft pink-to-cream gradient.',
    '亮': 'a cute small bright lightbulb in the center of the frame with rays. Soft yellow glow. Background: soft cream-to-butter gradient.',

    '暗': 'a cute small dim lamp in the center of the frame with soft glow. Soft yellow. Background: soft purple-to-sky-blue gradient.',
    '新': 'a cute small shiny new gift box in the center of the frame with a ribbon. Soft pastel. Background: soft mint-to-cream gradient.',
    '旧': 'a cute small old teddy bear in the center of the frame with a friendly face. Soft brown fur. Background: soft butter-to-cream gradient.',
    '快': 'a cute small bunny running fast in the center of the frame with a cloud of dust behind. Soft cream fur. Background: soft sky-blue gradient.',

    '慢': 'a cute small turtle in the center of the frame walking slowly. Soft green shell. Background: soft mint-to-cream gradient.',
    '早2': 'a cute small sunrise in the center of the frame with pink and orange colors. Tiny birds flying. Background: pink-to-amber gradient.',
    '晚': 'a cute small evening sky in the center of the frame with a tiny moon and stars. Soft pastel. Background: soft purple-to-sky-blue gradient.',
    '中': 'a cute small target with a bullseye in the center of the frame. Soft pastel rings. Background: soft cream gradient.',

    '外2': 'a cute small window in the center of the frame showing a sunny outdoor scene. Background: soft sky-blue gradient.',
    '里2': 'a cute small house interior in the center of the frame with cozy furniture. Background: soft warm cream gradient.',
    '上2': 'a cute small bird flying up high in the center of the frame. Soft blue feathers. Background: soft sky-blue gradient.',
    '下2': 'a cute small umbrella in the center of the frame. Soft pastel. Background: soft sky-blue-to-grey gradient.',

    '前2': 'a cute small bunny walking forward in the center of the frame with a smile. Soft cream fur. Background: soft mint gradient.',
    '后2': 'a cute small bunny hopping backwards in the center of the frame. Soft cream fur. Background: soft pink-to-cream gradient.',
    '左2': 'a cute small left hand pointing to the left in the center of the frame. Soft skin tone. Background: soft butter gradient.',
    '右2': 'a cute small right hand pointing to the right in the center of the frame. Soft skin tone. Background: soft mint gradient.',

    '一2': 'a single cute apple in the center of the frame. Round red with tiny green leaf. Background: soft pink-to-cream gradient.',
    '不': 'a cute small "no" sign in the center of the frame. Soft pastel red circle with a slash. Background: soft cream gradient.',
    '都': 'many cute small identical stars in the center of the frame. Soft pastel colors. Background: soft sky-blue gradient.',
    '很': 'a cute small three-line emphasis mark in the center of the frame. Soft pastel. Background: soft mint-cream gradient.',

    '才': 'a cute small fresh sprout in the center of the frame just emerging from soil. Soft green. Background: soft mint-to-butter gradient.',
    '就': 'a cute small arrow curving forward in the center of the frame. Soft pastel. Background: soft cream-to-sky-blue gradient.',
    '又': 'a cute small double arrow looping back in the center of the frame. Soft pastel. Background: soft mint-cream gradient.',
    '只2': 'a cute small single bird in the center of the frame perched on a branch. Soft blue feathers. Background: soft sky-blue gradient.',

    '看3': 'a cute small pair of binoculars in the center of the frame. Soft pastel. Background: soft cream gradient.',
    '让': 'a cute small hand giving way to another in the center of the frame. Soft skin tones. Background: soft pink-to-cream gradient.',
    '请': 'a cute small hand making a polite gesture in the center of the frame. Soft skin tone with pink palm. Background: soft mint-cream gradient.',
    '谢': 'a cute small heart-shaped thank you card in the center of the frame. Soft pink. Background: soft pink-to-cream gradient.',

    '啊': 'a cute small "ah" speech bubble in the center of the frame. Soft pastel. Background: soft sky-blue gradient.',
    '吗': 'a cute small "?" speech bubble in the center of the frame. Soft pastel. Background: soft lavender gradient.',
    '呢': 'a cute small smile face in the center of the frame thinking. Soft pastel. Background: soft butter-cream gradient.',
    '吧': 'a cute small suggestion speech bubble in the center of the frame. Soft pastel. Background: soft mint-cream gradient.',

    '住2': 'a cute small house with a heart in the window in the center of the frame. Soft pastel. Background: soft pink-to-sky-blue gradient.',
    '院': 'a cute small courtyard with flowers in the center of the frame. Tiny fence around. Background: soft mint-to-cream gradient.',
    '校': 'a cute small school building in the center of the frame with a tiny flag. Soft yellow walls. Background: soft sky-blue gradient.',
    '室': 'a cute small bedroom in the center of the frame with a tiny bed. Soft pastel. Background: soft lavender-to-cream gradient.',

    '种2': 'a cute small variety of seeds in the center of the frame. Tiny different colors and shapes. Background: soft butter gradient.',
    '名': 'a cute small name tag in the center of the frame with a tiny star. Soft pastel. Background: soft mint-cream gradient.',
    '字2': 'a cute small open book with tiny drawings in the center of the frame (no actual text). Soft pastel. Background: soft cream gradient.',
    '音': 'a cute small music note in the center of the frame with tiny sound waves. Soft pastel. Background: soft lavender gradient.',
  };

  const scene = sceneFor[c.glyph] ?? `a cute visual scene for ${c.glyph} in the center of the frame with soft pastel picture book style surroundings.`;
  return `A 3 year old girl picture book illustration. ${scene} ${STYLE_SUFFIX}`;
}

/**
 * Tier-E 数据集：100 字（一年级扩展）
 */
const TIER_E = [
  // ===== 数字扩展 4 字 =====
  { id: 'char-liang-e', glyph: '两', pinyin: ['liǎng'], tone: 3, meaning: ['两个'], strokes: 7, tier: 'E', type: 'compound', origin: { fact: '"两"由"一"和"二"组成。', story: '"两"原本是一加二，表示两个。' }, words: ['两个', '两边', '两人'], island: 'numbers' },
  { id: 'char-ban-e', glyph: '半', pinyin: ['bàn'], tone: 4, meaning: ['一半'], strokes: 5, tier: 'E', type: 'compound', origin: { fact: '"半"由"八"和"丿"组成。', story: '"半"原本是分开成两半。' }, words: ['一半', '半夜', '半天'], island: 'numbers' },
  { id: 'char-bai-e', glyph: '百', pinyin: ['bǎi'], tone: 3, meaning: ['一百'], strokes: 6, tier: 'E', type: 'compound', origin: { fact: '"百"由"一"和"白"组成。', story: '"百"原本是一百颗白色的头。' }, words: ['一百', '百个', '百岁'], island: 'numbers' },
  { id: 'char-qian-thousand-e', glyph: '千', pinyin: ['qiān'], tone: 1, meaning: ['一千'], strokes: 3, tier: 'E', type: 'phonetic', origin: { fact: '"千"古字像人的小腿。', story: '"千"原本是人小腿的形状。' }, words: ['一千', '千年', '千米'], island: 'numbers' },

  // ===== 量词 4 字 =====
  { id: 'char-zhi-e', glyph: '只', pinyin: ['zhī'], tone: 1, meaning: ['一只'], strokes: 5, tier: 'E', type: 'pictograph', origin: { fact: '"只"古字像一只鸟。', story: '"只"原本是一只鸟。' }, words: ['一只', '只鸟', '只猫'], island: 'starter' },
  { id: 'char-tiao-e', glyph: '条', pinyin: ['tiáo'], tone: 2, meaning: ['一条'], strokes: 7, tier: 'E', type: 'pictograph', origin: { fact: '"条"古字像树枝的细长样子。', story: '"条"原本是细长的树枝。' }, words: ['一条', '条线', '面条'], island: 'starter' },
  { id: 'char-ben-measure-e', glyph: '本', pinyin: ['běn'], tone: 3, meaning: ['一本'], strokes: 5, tier: 'E', type: 'phonetic', origin: { fact: '"本"古字像树根。', story: '"本"原本画的是树根。' }, words: ['一本', '本书', '本子'], island: 'starter' },
  { id: 'char-ke-e', glyph: '棵', pinyin: ['kē'], tone: 1, meaning: ['一棵'], strokes: 9, tier: 'E', type: 'phonetic', origin: { fact: '"棵"由"木"和"颗"组成。', story: '"棵"是植物的量词。' }, words: ['一棵', '棵树', '棵草'], island: 'starter' },

  // ===== 副词 4 字 =====
  { id: 'char-bi-compare-e', glyph: '比', pinyin: ['bǐ'], tone: 3, meaning: ['比较'], strokes: 4, tier: 'E', type: 'compound', origin: { fact: '"比"古字像两人紧靠站着。', story: '"比"原本是两人并排比较。' }, words: ['比较', '对比', '比一比'], island: 'starter' },
  { id: 'char-zai-again-e', glyph: '再', pinyin: ['zài'], tone: 4, meaning: ['再一次'], strokes: 6, tier: 'E', type: 'compound', origin: { fact: '"再"由"冂"和"一"和"土"组成。', story: '"再"是两次、第二次。' }, words: ['再见', '再来', '再一次'], island: 'starter' },
  { id: 'char-ye-e', glyph: '也', pinyin: ['yě'], tone: 3, meaning: ['也是'], strokes: 3, tier: 'E', type: 'pictograph', origin: { fact: '"也"古字像女子。', story: '"也"原本是女子的样子。' }, words: ['也是', '也好', '也喜欢'], island: 'starter' },
  { id: 'char-hai-e', glyph: '还', pinyin: ['hái'], tone: 2, meaning: ['还有'], strokes: 7, tier: 'E', type: 'compound', origin: { fact: '"还"由"辶"和"不"组成。', story: '"还"原本是返回。' }, words: ['还有', '还会', '还好'], island: 'starter' },

  // ===== 指示代词 4 字 =====
  { id: 'char-zhe-e', glyph: '这', pinyin: ['zhè'], tone: 4, meaning: ['这个'], strokes: 7, tier: 'E', type: 'phonetic', origin: { fact: '"这"由"辶"和"言"组成。', story: '"这"是指近处的事物。' }, words: ['这个', '这里', '这些'], island: 'starter' },
  { id: 'char-na-e', glyph: '那', pinyin: ['nà'], tone: 4, meaning: ['那个'], strokes: 6, tier: 'E', type: 'compound', origin: { fact: '"那"由"阝"和"那"组成。', story: '"那"是指远处的事物。' }, words: ['那个', '那里', '那些'], island: 'starter' },
  { id: 'char-na3-e', glyph: '哪', pinyin: ['nǎ'], tone: 3, meaning: ['哪里'], strokes: 9, tier: 'E', type: 'compound', origin: { fact: '"哪"由"口"和"那"组成。', story: '"哪"是问地方或事物的词。' }, words: ['哪儿', '哪个', '哪些'], island: 'starter' },
  { id: 'char-er2-e', glyph: '儿', pinyin: ['ér'], tone: 2, meaning: ['儿子'], strokes: 2, tier: 'E', type: 'pictograph', origin: { fact: '"儿"古字像小孩的样子。', story: '"儿"原本画的是小孩。' }, words: ['儿子', '女儿', '儿童'], island: 'family' },

  // ===== 介词 4 字 =====
  { id: 'char-ba-e', glyph: '把', pinyin: ['bǎ'], tone: 3, meaning: ['一把'], strokes: 7, tier: 'E', type: 'compound', origin: { fact: '"把"由"扌"和"巴"组成。', story: '"把"原本是手里握着东西。' }, words: ['一把', '把手', '把关'], island: 'starter' },
  { id: 'char-ge-e', glyph: '个', pinyin: ['gè'], tone: 4, meaning: ['一个'], strokes: 2, tier: 'E', type: 'pictograph', origin: { fact: '"个"古字像人侧立。', story: '"个"原本是一个人侧立的样子。' }, words: ['一个', '个人', '个子'], island: 'numbers' },
  { id: 'char-he-e', glyph: '和', pinyin: ['hé'], tone: 2, meaning: ['和气'], strokes: 8, tier: 'E', type: 'pictograph', origin: { fact: '"和"古字像禾穗在口边。', story: '"和"原本是禾穗在嘴里，象征和谐。' }, words: ['和平', '和气', '和好'], island: 'starter' },
  { id: 'char-de-e', glyph: '的', pinyin: ['de'], tone: 0, meaning: ['的'], strokes: 8, tier: 'E', type: 'compound', origin: { fact: '"的"由"白"和"勺"组成。', story: '"的"是表示所有或修饰的虚词。' }, words: ['我的', '好的', '红的'], island: 'starter' },

  // ===== 动词 5 字 =====
  { id: 'char-zai-e', glyph: '在', pinyin: ['zài'], tone: 4, meaning: ['在'], strokes: 6, tier: 'E', type: 'compound', origin: { fact: '"在"由"土"和"才"组成。', story: '"在"原本是在土地中。' }, words: ['在家', '在哪', '现在'], island: 'starter' },
  { id: 'char-you-e', glyph: '有', pinyin: ['yǒu'], tone: 3, meaning: ['有'], strokes: 6, tier: 'E', type: 'pictograph', origin: { fact: '"有"古字像手持肉。', story: '"有"原本是手里有肉。' }, words: ['有的', '没有', '有只'], island: 'starter' },
  { id: 'char-wu-e', glyph: '无', pinyin: ['wú'], tone: 2, meaning: ['没有'], strokes: 4, tier: 'E', type: 'pictograph', origin: { fact: '"无"古字像没有的样子。', story: '"无"原本画的是没有的样子。' }, words: ['没有', '无声', '无穷'], island: 'starter' },
  { id: 'char-lai-e', glyph: '来', pinyin: ['lái'], tone: 2, meaning: ['来'], strokes: 7, tier: 'E', type: 'pictograph', origin: { fact: '"来"古字像一棵麦子。', story: '"来"原本是一棵成熟的麦子。' }, words: ['来了', '来往', '回来'], island: 'starter' },
  { id: 'char-qu-e', glyph: '去', pinyin: ['qù'], tone: 4, meaning: ['去'], strokes: 5, tier: 'E', type: 'compound', origin: { fact: '"去"古字像人走出门。', story: '"去"原本是人走出家门。' }, words: ['去了', '回去', '出去'], island: 'starter' },

  // ===== 动词 4 字 =====
  { id: 'char-hui-e', glyph: '回', pinyin: ['huí'], tone: 2, meaning: ['回来'], strokes: 6, tier: 'E', type: 'pictograph', origin: { fact: '"回"古字像围绕的样子。', story: '"回"原本是围绕、回到原处。' }, words: ['回家', '回来', '回去'], island: 'starter' },
  { id: 'char-dao-e', glyph: '到', pinyin: ['dào'], tone: 4, meaning: ['到达'], strokes: 8, tier: 'E', type: 'phonetic', origin: { fact: '"到"由"至"和"刂"组成。', story: '"到"原本是到达。' }, words: ['到了', '到来', '到底'], island: 'starter' },
  { id: 'char-chu-e', glyph: '出', pinyin: ['chū'], tone: 1, meaning: ['出去'], strokes: 5, tier: 'E', type: 'compound', origin: { fact: '"出"由两个"山"组成。', story: '"出"原本是两座山之间走出来。' }, words: ['出去', '出来', '出门'], island: 'starter' },
  { id: 'char-ru-e', glyph: '入', pinyin: ['rù'], tone: 4, meaning: ['进入'], strokes: 2, tier: 'E', type: 'pictograph', origin: { fact: '"入"古字像人进入。', story: '"入"原本是人进入的样子。' }, words: ['进入', '入门', '入口'], island: 'starter' },

  // ===== 动词 4 字 =====
  { id: 'char-kai-e', glyph: '开', pinyin: ['kāi'], tone: 1, meaning: ['开门'], strokes: 4, tier: 'E', type: 'compound', origin: { fact: '"开"由"门"和"廾"组成。', story: '"开"原本是把门打开。' }, words: ['开门', '打开', '开口'], island: 'starter' },
  { id: 'char-guan-e', glyph: '关', pinyin: ['guān'], tone: 1, meaning: ['关门'], strokes: 6, tier: 'E', type: 'compound', origin: { fact: '"关"由"门"和"关"组成。', story: '"关"原本是把门关上。' }, words: ['关门', '关上', '关心'], island: 'starter' },
  { id: 'char-kan2-e', glyph: '看', pinyin: ['kàn'], tone: 4, meaning: ['看见'], strokes: 9, tier: 'E', type: 'phonetic', origin: { fact: '"看"由"手"和"目"组成。', story: '"看"原本是手遮光，眯眼看。' }, words: ['看见', '好看', '看书'], island: 'starter' },
  { id: 'char-hui-can-e', glyph: '会', pinyin: ['huì'], tone: 4, meaning: ['会'], strokes: 6, tier: 'E', type: 'pictograph', origin: { fact: '"会"古字像人聚集。', story: '"会"原本是人聚集在一起。' }, words: ['会做', '学会', '开会'], island: 'starter' },

  // ===== 助动词 4 字 =====
  { id: 'char-neng-e', glyph: '能', pinyin: ['néng'], tone: 2, meaning: ['能'], strokes: 10, tier: 'E', type: 'compound', origin: { fact: '"能"由"月"和"能"组成。', story: '"能"原本是一只熊，象征能力。' }, words: ['能干', '可能', '能行'], island: 'starter' },
  { id: 'char-ke2-e', glyph: '可', pinyin: ['kě'], tone: 3, meaning: ['可以'], strokes: 5, tier: 'E', type: 'compound', origin: { fact: '"可"古字像可以的样子。', story: '"可"原本是可以、能够。' }, words: ['可以', '可爱', '可能'], island: 'starter' },
  { id: 'char-yi-e', glyph: '以', pinyin: ['yǐ'], tone: 3, meaning: ['可以'], strokes: 5, tier: 'E', type: 'pictograph', origin: { fact: '"以"古字像一个人。', story: '"以"原本是人的样子。' }, words: ['可以', '以为', '所以'], island: 'starter' },
  { id: 'char-yao-e', glyph: '要', pinyin: ['yào'], tone: 4, meaning: ['要'], strokes: 9, tier: 'E', type: 'compound', origin: { fact: '"要"古字像女子。', story: '"要"原本是女子腰部的形状。' }, words: ['要吃', '想要', '重要'], island: 'starter' },

  // ===== 心理动词 4 字 =====
  { id: 'char-xiang-e', glyph: '想', pinyin: ['xiǎng'], tone: 3, meaning: ['想念'], strokes: 13, tier: 'E', type: 'compound', origin: { fact: '"想"由"相"和"心"组成。', story: '"想"原本是心里互相看。' }, words: ['想念', '想要', '想法'], island: 'starter' },
  { id: 'char-zhi-e2', glyph: '知', pinyin: ['zhī'], tone: 1, meaning: ['知道'], strokes: 8, tier: 'E', type: 'compound', origin: { fact: '"知"由"矢"和"口"组成。', story: '"知"原本是箭的尖端对准。' }, words: ['知道', '知识', '知心'], island: 'starter' },
  { id: 'char-jue-e', glyph: '觉', pinyin: ['jué'], tone: 2, meaning: ['感觉'], strokes: 9, tier: 'E', type: 'compound', origin: { fact: '"觉"由"⺗"和"见"组成。', story: '"觉"是心里的感觉。' }, words: ['感觉', '觉得', '睡觉'], island: 'starter' },
  { id: 'char-wo-i-e', glyph: '我', pinyin: ['wǒ'], tone: 3, meaning: ['我'], strokes: 7, tier: 'E', type: 'phonetic', origin: { fact: '"我"由"戈"和"手"组成。', story: '"我"原本是手里握戈的自己。' }, words: ['我们', '我的', '我国'], island: 'starter' },

  // ===== 复数代词 4 字 =====
  { id: 'char-men-e', glyph: '们', pinyin: ['men'], tone: 0, meaning: ['们'], strokes: 5, tier: 'E', type: 'phonetic', origin: { fact: '"们"由"亻"和"门"组成。', story: '"们"是表示多数。' }, words: ['我们', '他们', '你们'], island: 'starter' },
  { id: 'char-xie-e', glyph: '些', pinyin: ['xiē'], tone: 1, meaning: ['一些'], strokes: 8, tier: 'E', type: 'phonetic', origin: { fact: '"些"由"此"和"二"组成。', story: '"些"原本是不定数量。' }, words: ['一些', '这些', '那些'], island: 'starter' },
  { id: 'char-yang-e', glyph: '样', pinyin: ['yàng'], tone: 4, meaning: ['样子'], strokes: 10, tier: 'E', type: 'compound', origin: { fact: '"样"由"木"和"羊"组成。', story: '"样"是样式、形状。' }, words: ['样子', '一样', '这样'], island: 'starter' },
  { id: 'char-zhong-seed-e', glyph: '种', pinyin: ['zhǒng'], tone: 3, meaning: ['种子'], strokes: 9, tier: 'E', type: 'compound', origin: { fact: '"种"由"禾"和"中"组成。', story: '"种"原本是禾苗的种子。' }, words: ['种子', '种花', '种类'], island: 'starter' },

  // ===== 抽象名词 4 字 =====
  { id: 'char-shi-matter-e', glyph: '事', pinyin: ['shì'], tone: 4, meaning: ['事情'], strokes: 8, tier: 'E', type: 'pictograph', origin: { fact: '"事"古字像一只手拿着工具。', story: '"事"原本是一个人做事的样子。' }, words: ['事情', '故事', '做事'], island: 'starter' },
  { id: 'char-qing-e', glyph: '情', pinyin: ['qíng'], tone: 2, meaning: ['感情'], strokes: 11, tier: 'E', type: 'compound', origin: { fact: '"情"由"忄"和"青"组成。', story: '"情"是心里的感情。' }, words: ['心情', '感情', '事情'], island: 'starter' },
  { id: 'char-yi-e2', glyph: '意', pinyin: ['yì'], tone: 4, meaning: ['意思'], strokes: 13, tier: 'E', type: 'compound', origin: { fact: '"意"由"音"和"心"组成。', story: '"意"是心里的声音。' }, words: ['意思', '心意', '同意'], island: 'starter' },
  { id: 'char-xin-heart-e', glyph: '心', pinyin: ['xīn'], tone: 1, meaning: ['心'], strokes: 4, tier: 'E', type: 'pictograph', origin: { fact: '"心"古字像心脏。', story: '"心"原本画的是心脏。' }, words: ['开心', '小心', '用心'], island: 'starter' },

  // ===== 动词 4 字 =====
  { id: 'char-qi-e', glyph: '起', pinyin: ['qǐ'], tone: 3, meaning: ['起来'], strokes: 10, tier: 'E', type: 'compound', origin: { fact: '"起"由"走"和"己"组成。', story: '"起"原本是站起来。' }, words: ['起来', '起床', '起飞'], island: 'starter' },
  { id: 'char-lai-come-e', glyph: '来', pinyin: ['lái'], tone: 2, meaning: ['来'], strokes: 7, tier: 'E', type: 'pictograph', origin: { fact: '"来"古字像一棵麦子。', story: '"来"原本是一棵成熟的麦子。' }, words: ['来', '来到', '回来'], island: 'starter' },
  { id: 'char-zuo-e', glyph: '坐', pinyin: ['zuò'], tone: 4, meaning: ['坐下'], strokes: 7, tier: 'E', type: 'pictograph', origin: { fact: '"坐"古字像人坐在地上。', story: '"坐"原本是一个人坐在地上的样子。' }, words: ['坐下', '坐车', '请坐'], island: 'starter' },
  { id: 'char-zhan-e', glyph: '站', pinyin: ['zhàn'], tone: 4, meaning: ['站立'], strokes: 10, tier: 'E', type: 'phonetic', origin: { fact: '"站"由"立"和"占"组成。', story: '"站"是站立。' }, words: ['站立', '站好', '车站'], island: 'starter' },

  // ===== 状态 4 字 =====
  { id: 'char-shui-e', glyph: '睡', pinyin: ['shuì'], tone: 4, meaning: ['睡觉'], strokes: 10, tier: 'E', type: 'compound', origin: { fact: '"睡"由"目"和"垂"组成。', story: '"睡"原本是眼睛垂下。' }, words: ['睡觉', '睡着了', '睡午觉'], island: 'starter' },
  { id: 'char-xing-e', glyph: '醒', pinyin: ['xǐng'], tone: 3, meaning: ['醒来'], strokes: 9, tier: 'E', type: 'phonetic', origin: { fact: '"醒"由"星"和"忄"组成。', story: '"醒"是睡醒后清醒。' }, words: ['醒来', '醒了', '清醒'], island: 'starter' },
  { id: 'char-mang-e', glyph: '忙', pinyin: ['máng'], tone: 2, meaning: ['忙碌'], strokes: 6, tier: 'E', type: 'compound', origin: { fact: '"忙"由"忄"和"亡"组成。', story: '"忙"是心里想着很多事。' }, words: ['忙碌', '忙忙', '帮忙'], island: 'starter' },
  { id: 'char-lei-e', glyph: '累', pinyin: ['lèi'], tone: 4, meaning: ['累了'], strokes: 11, tier: 'E', type: 'compound', origin: { fact: '"累"由"田"和"糸"组成。', story: '"累"原本是一团团的丝。' }, words: ['累了', '很累', '劳累'], island: 'starter' },

  // ===== 感受 4 字 =====
  { id: 'char-e-e', glyph: '饿', pinyin: ['è'], tone: 4, meaning: ['饥饿'], strokes: 12, tier: 'E', type: 'compound', origin: { fact: '"饿"由"我"和"口"组成。', story: '"饿"是我饿了想吃东西。' }, words: ['饿了', '饥饿', '挨饿'], island: 'starter' },
  { id: 'char-ke3-e', glyph: '渴', pinyin: ['kě'], tone: 3, meaning: ['口渴'], strokes: 12, tier: 'E', type: 'compound', origin: { fact: '"渴"由"氵"和"曷"组成。', story: '"渴"是口渴想喝水。' }, words: ['口渴', '解渴', '渴了'], island: 'starter' },
  { id: 'char-bao-full-e', glyph: '饱', pinyin: ['bǎo'], tone: 3, meaning: ['吃饱'], strokes: 9, tier: 'E', type: 'compound', origin: { fact: '"饱"由"饣"和"包"组成。', story: '"饱"是吃饱了。' }, words: ['吃饱', '饱满', '温饱'], island: 'starter' },
  { id: 'char-leng-e', glyph: '冷', pinyin: ['lěng'], tone: 3, meaning: ['冷'], strokes: 7, tier: 'E', type: 'phonetic', origin: { fact: '"冷"由"冫"和"令"组成。', story: '"冷"是冰冷的。' }, words: ['冷了', '天冷', '寒冷'], island: 'starter' },

  // ===== 感受 4 字 =====
  { id: 'char-re-e', glyph: '热', pinyin: ['rè'], tone: 4, meaning: ['热'], strokes: 13, tier: 'E', type: 'phonetic', origin: { fact: '"热"由"灬"和"埶"组成。', story: '"热"是火的温度。' }, words: ['热了', '天气热', '热闹'], island: 'starter' },
  { id: 'char-nuan-e', glyph: '暖', pinyin: ['nuǎn'], tone: 3, meaning: ['温暖'], strokes: 13, tier: 'E', type: 'phonetic', origin: { fact: '"暖"由"灬"和"爰"组成。', story: '"暖"是温暖的。' }, words: ['温暖', '暖和', '暖心'], island: 'starter' },
  { id: 'char-liang-cold-e', glyph: '凉', pinyin: ['liáng'], tone: 2, meaning: ['凉快'], strokes: 10, tier: 'E', type: 'phonetic', origin: { fact: '"凉"由"冫"和"京"组成。', story: '"凉"是冰凉的。' }, words: ['凉快', '凉爽', '冰凉'], island: 'starter' },
  { id: 'char-liang-bright-e', glyph: '亮', pinyin: ['liàng'], tone: 4, meaning: ['明亮'], strokes: 7, tier: 'E', type: 'compound', origin: { fact: '"亮"由"亠"和"光"组成。', story: '"亮"是明亮的光。' }, words: ['明亮', '天亮了', '光亮'], island: 'starter' },

  // ===== 形容词 4 字 =====
  { id: 'char-an-e', glyph: '暗', pinyin: ['àn'], tone: 4, meaning: ['黑暗'], strokes: 13, tier: 'E', type: 'compound', origin: { fact: '"暗"由"日"和"音"组成。', story: '"暗"是黑暗的、没有光。' }, words: ['黑暗', '暗暗', '阴暗'], island: 'starter' },
  { id: 'char-xin-new-e', glyph: '新', pinyin: ['xīn'], tone: 1, meaning: ['新'], strokes: 13, tier: 'E', type: 'compound', origin: { fact: '"新"由"亲"和"斤"组成。', story: '"新"是新做的、刚出现的。' }, words: ['新的', '新年', '新奇'], island: 'starter' },
  { id: 'char-jiu-old-e', glyph: '旧', pinyin: ['jiù'], tone: 4, meaning: ['旧的'], strokes: 5, tier: 'E', type: 'phonetic', origin: { fact: '"旧"古字像一只鸟。', story: '"旧"原本是鸟叫的意思。' }, words: ['旧的', '旧衣服', '怀旧'], island: 'starter' },
  { id: 'char-kuai-e', glyph: '快', pinyin: ['kuài'], tone: 4, meaning: ['快速'], strokes: 7, tier: 'E', type: 'compound', origin: { fact: '"快"由"忄"和"夬"组成。', story: '"快"是心里高兴、快速。' }, words: ['快点', '很快', '快乐'], island: 'starter' },

  // ===== 形容词 4 字 =====
  { id: 'char-man-e', glyph: '慢', pinyin: ['màn'], tone: 4, meaning: ['慢慢'], strokes: 15, tier: 'E', type: 'compound', origin: { fact: '"慢"由"忄"和"曼"组成。', story: '"慢"是慢慢来、不着急。' }, words: ['慢慢', '慢走', '慢点'], island: 'starter' },
  { id: 'char-zao-morning-e', glyph: '早', pinyin: ['zǎo'], tone: 3, meaning: ['早上'], strokes: 6, tier: 'E', type: 'pictograph', origin: { fact: '"早"古字像日出时的草。', story: '"早"是早晨、太阳刚升起。' }, words: ['早上', '早晨', '早安'], island: 'starter' },
  { id: 'char-wan-e', glyph: '晚', pinyin: ['wǎn'], tone: 3, meaning: ['晚上'], strokes: 11, tier: 'E', type: 'phonetic', origin: { fact: '"晚"由"日"和"免"组成。', story: '"晚"是日落之后的晚上。' }, words: ['晚上', '夜晚', '晚会'], island: 'starter' },
  { id: 'char-zhong-middle-e', glyph: '中', pinyin: ['zhōng'], tone: 1, meaning: ['中间'], strokes: 4, tier: 'E', type: 'pictograph', origin: { fact: '"中"古字像一面旗。', story: '"中"是中间的、中心。' }, words: ['中间', '中国', '心中'], island: 'starter' },

  // ===== 方位 4 字 =====
  { id: 'char-wai-outside-e', glyph: '外', pinyin: ['wài'], tone: 4, meaning: ['外面'], strokes: 5, tier: 'E', type: 'compound', origin: { fact: '"外"由"夕"和"卜"组成。', story: '"外"是外面、外边。' }, words: ['外面', '外边', '课外'], island: 'starter' },
  { id: 'char-li-inside-e', glyph: '里', pinyin: ['lǐ'], tone: 3, meaning: ['里面'], strokes: 7, tier: 'E', type: 'compound', origin: { fact: '"里"由"土"和"里"组成。', story: '"里"是里面、内部。' }, words: ['里面', '里边', '公里'], island: 'starter' },
  { id: 'char-shang-up-e', glyph: '上', pinyin: ['shàng'], tone: 4, meaning: ['上面'], strokes: 3, tier: 'E', type: 'compound', origin: { fact: '"上"古字像一横上方。', story: '"上"是上面、上方。' }, words: ['上面', '上学', '早上'], island: 'starter' },
  { id: 'char-xia-down-e', glyph: '下', pinyin: ['xià'], tone: 4, meaning: ['下面'], strokes: 3, tier: 'E', type: 'compound', origin: { fact: '"下"古字像一横下方。', story: '"下"是下面、下方。' }, words: ['下面', '下雨', '地下'], island: 'starter' },

  // ===== 方位 4 字 =====
  { id: 'char-qian-front-e', glyph: '前', pinyin: ['qián'], tone: 2, meaning: ['前面'], strokes: 9, tier: 'E', type: 'compound', origin: { fact: '"前"由"⺊"和"月"组成。', story: '"前"是前面、前方。' }, words: ['前面', '以前', '前方'], island: 'starter' },
  { id: 'char-hou-behind-e', glyph: '后', pinyin: ['hòu'], tone: 4, meaning: ['后面'], strokes: 6, tier: 'E', type: 'compound', origin: { fact: '"后"由"厶"和"口"组成。', story: '"后"是后面、后方。' }, words: ['后面', '以后', '后来'], island: 'starter' },
  { id: 'char-zuo-left-e', glyph: '左', pinyin: ['zuǒ'], tone: 3, meaning: ['左边'], strokes: 5, tier: 'E', type: 'compound', origin: { fact: '"左"由"工"和"又"组成。', story: '"左"是左边、左手。' }, words: ['左边', '左手', '左右'], island: 'starter' },
  { id: 'char-you-right-e', glyph: '右', pinyin: ['yòu'], tone: 4, meaning: ['右边'], strokes: 5, tier: 'E', type: 'compound', origin: { fact: '"右"由"口"和"又"组成。', story: '"右"是右边、右手。' }, words: ['右边', '右手', '左右'], island: 'starter' },

  // ===== 副词 4 字 =====
  { id: 'char-yi-one2-e', glyph: '一', pinyin: ['yī'], tone: 1, meaning: ['一'], strokes: 1, tier: 'E', type: 'phonetic', origin: { fact: '"一"古字就是简单的一横。', story: '"一"是最简单的数字。' }, words: ['一', '一个', '一起'], island: 'numbers' },
  { id: 'char-bu-e', glyph: '不', pinyin: ['bù'], tone: 4, meaning: ['不'], strokes: 4, tier: 'E', type: 'pictograph', origin: { fact: '"不"古字像花瓣落下的样子。', story: '"不"原本是否定的意思。' }, words: ['不', '不对', '不是'], island: 'starter' },
  { id: 'char-dou-e', glyph: '都', pinyin: ['dōu'], tone: 1, meaning: ['都'], strokes: 11, tier: 'E', type: 'compound', origin: { fact: '"都"由"者"和"阝"组成。', story: '"都"是全部、都是。' }, words: ['都是', '都有', '全都'], island: 'starter' },
  { id: 'char-hen-e', glyph: '很', pinyin: ['hěn'], tone: 3, meaning: ['很'], strokes: 7, tier: 'E', type: 'compound', origin: { fact: '"很"由"彳"和"艮"组成。', story: '"很"是非常的意思。' }, words: ['很好', '很大', '很快'], island: 'starter' },

  // ===== 副词 4 字 =====
  { id: 'char-cai-e', glyph: '才', pinyin: ['cái'], tone: 2, meaning: ['才'], strokes: 3, tier: 'E', type: 'pictograph', origin: { fact: '"才"古字像草木初生。', story: '"才"是刚刚、才开始。' }, words: ['才有', '才来', '才能'], island: 'starter' },
  { id: 'char-jiu-e', glyph: '就', pinyin: ['jiù'], tone: 4, meaning: ['就'], strokes: 5, tier: 'E', type: 'compound', origin: { fact: '"就"由"京"和"尤"组成。', story: '"就"是立刻、马上。' }, words: ['就是', '就有', '就来'], island: 'starter' },
  { id: 'char-you-again-e', glyph: '又', pinyin: ['yòu'], tone: 4, meaning: ['又'], strokes: 2, tier: 'E', type: 'pictograph', origin: { fact: '"又"古字像一只手。', story: '"又"是再一次、再来一次。' }, words: ['又', '又来', '又吃'], island: 'starter' },
  { id: 'char-zhi-only-e', glyph: '只', pinyin: ['zhǐ'], tone: 3, meaning: ['只'], strokes: 5, tier: 'E', type: 'pictograph', origin: { fact: '"只"古字像一只鸟。', story: '"只"是仅仅、唯一。' }, words: ['只有', '只是', '只好'], island: 'starter' },

  // ===== 礼貌用语 4 字 =====
  { id: 'char-kan-look-e', glyph: '看', pinyin: ['kàn'], tone: 4, meaning: ['看'], strokes: 9, tier: 'E', type: 'phonetic', origin: { fact: '"看"由"手"和"目"组成。', story: '"看"是观察、阅读。' }, words: ['看见', '看书', '好看'], island: 'starter' },
  { id: 'char-rang-e', glyph: '让', pinyin: ['ràng'], tone: 4, meaning: ['让'], strokes: 16, tier: 'E', type: 'phonetic', origin: { fact: '"让"由"辶"和"上"组成。', story: '"让"是谦让、让步。' }, words: ['让开', '让位', '让步'], island: 'starter' },
  { id: 'char-qing-e2', glyph: '请', pinyin: ['qǐng'], tone: 3, meaning: ['请'], strokes: 15, tier: 'E', type: 'compound', origin: { fact: '"请"由"讠"和"青"组成。', story: '"请"是礼貌的请求。' }, words: ['请坐', '请问', '请求'], island: 'starter' },
  { id: 'char-xie-thanks-e', glyph: '谢', pinyin: ['xiè'], tone: 4, meaning: ['谢谢'], strokes: 12, tier: 'E', type: 'compound', origin: { fact: '"谢"由"讠"和"射"组成。', story: '"谢"是感谢。' }, words: ['谢谢', '感谢', '致谢'], island: 'starter' },

  // ===== 语气词 4 字 =====
  { id: 'char-a-e', glyph: '啊', pinyin: ['a'], tone: 0, meaning: ['啊'], strokes: 6, tier: 'E', type: 'compound', origin: { fact: '"啊"由"口"和"阿"组成。', story: '"啊"是感叹词。' }, words: ['啊', '啊呀', '啊哈'], island: 'starter' },
  { id: 'char-ma-q-e', glyph: '吗', pinyin: ['ma'], tone: 0, meaning: ['吗'], strokes: 6, tier: 'E', type: 'compound', origin: { fact: '"吗"由"口"和"马"组成。', story: '"吗"是疑问语气。' }, words: ['吗', '好吗', '是吗'], island: 'starter' },
  { id: 'char-ne-e', glyph: '呢', pinyin: ['ne'], tone: 0, meaning: ['呢'], strokes: 8, tier: 'E', type: 'compound', origin: { fact: '"呢"由"口"和"尼"组成。', story: '"呢"是疑问语气。' }, words: ['呢', '在哪呢', '做什么呢'], island: 'starter' },
  { id: 'char-ba-suggest-e', glyph: '吧', pinyin: ['ba'], tone: 0, meaning: ['吧'], strokes: 4, tier: 'E', type: 'compound', origin: { fact: '"吧"由"口"和"巴"组成。', story: '"吧"是建议语气。' }, words: ['吧', '好吧', '去吧'], island: 'starter' },

  // ===== 居所 4 字 =====
  { id: 'char-zhu-e', glyph: '住', pinyin: ['zhù'], tone: 4, meaning: ['住'], strokes: 7, tier: 'E', type: 'compound', origin: { fact: '"住"由"亻"和"主"组成。', story: '"住"是居住、停留。' }, words: ['住', '住家', '记住'], island: 'starter' },
  { id: 'char-yuan-yard-e', glyph: '院', pinyin: ['yuàn'], tone: 4, meaning: ['院子'], strokes: 10, tier: 'E', type: 'compound', origin: { fact: '"院"由"阝"和"完"组成。', story: '"院"是院子、庭院。' }, words: ['院子', '庭院', '医院'], island: 'starter' },
  { id: 'char-xiao-school-e', glyph: '校', pinyin: ['xiào'], tone: 4, meaning: ['学校'], strokes: 10, tier: 'E', type: 'compound', origin: { fact: '"校"由"木"和"交"组成。', story: '"校"原本是木制的刑具，后指学校。' }, words: ['学校', '校园', '校长'], island: 'starter' },
  { id: 'char-shi-room-e', glyph: '室', pinyin: ['shì'], tone: 4, meaning: ['房间'], strokes: 9, tier: 'E', type: 'compound', origin: { fact: '"室"由"宀"和"至"组成。', story: '"室"是房间、屋子。' }, words: ['教室', '卧室', '室外'], island: 'starter' },

  // ===== 抽象名词 4 字 =====
  { id: 'char-zhong-type-e', glyph: '种', pinyin: ['zhǒng'], tone: 3, meaning: ['种类'], strokes: 9, tier: 'E', type: 'compound', origin: { fact: '"种"由"禾"和"中"组成。', story: '"种"是种类、类型。' }, words: ['种类', '各种', '种子'], island: 'starter' },
  { id: 'char-ming-name-e', glyph: '名', pinyin: ['míng'], tone: 2, meaning: ['名字'], strokes: 6, tier: 'E', type: 'compound', origin: { fact: '"名"由"口"和"夕"组成。', story: '"名"原本是黄昏时自报名字。' }, words: ['名字', '姓名', '有名'], island: 'starter' },
  { id: 'char-zi-word-e', glyph: '字', pinyin: ['zì'], tone: 4, meaning: ['汉字'], strokes: 6, tier: 'E', type: 'compound', origin: { fact: '"字"由"宀"和"子"组成。', story: '"字"原本是在屋子里给孩子取名。' }, words: ['汉字', '识字', '写字'], island: 'starter' },
  { id: 'char-yin-sound-e', glyph: '音', pinyin: ['yīn'], tone: 1, meaning: ['声音'], strokes: 9, tier: 'E', type: 'compound', origin: { fact: '"音"由"立"和"日"组成。', story: '"音"是声音、音乐。' }, words: ['声音', '音乐', '回音'], island: 'starter' },
];

module.exports = {
  characters: TIER_E,
  cues: TIER_E.map((c) => ({
    id: `char-${c.id.replace('char-', '')}-pron`,
    kind: 'character',
    text: `${c.glyph}，${c.glyph}，${c.glyph}。`,
    url: `/assets/audio/l1/tier-e/${c.id.replace('char-', '')}-pron.mp3`,
    refId: c.id,
  })),
  art: TIER_E.map((c) => ({
    id: `picto-${c.id.replace('char-', '')}`,
    subject: c.glyph,
    prompt: buildPictoPrompt(c),
    outPath: `/assets/art/l1/tier-e/picto-${c.id.replace('char-', '')}.jpg`,
    refId: c.id,
  })),
};