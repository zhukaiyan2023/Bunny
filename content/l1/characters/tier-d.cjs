/**
 * L1 · Tier-D 一年级下册+扩展字（70 字）
 *
 * 选字原则：
 *   - 一年级下册核心字（春夏秋冬+课文）
 *   - 高频生活字（文具/玩具/衣服/职业/时间/方向）
 *   - 让 L1 总量达到 ~200 字，覆盖一年级 90% 高频字
 *
 * 与 Tier-C 区别：
 *   - Tier-C 偏部首归类（动物/颜色/数字/家庭）
 *   - Tier-D 偏场景归类（文具/玩具/衣服/职业/时间/方向）
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
    '文': 'a stack of cute colorful papers in the center of the frame with a small pencil resting on top. Soft pastel colors. Background: soft cream gradient.',
    '具': 'a cute wooden toolbox in the center of the frame with a tiny hammer and wrench sticking out. Background: soft mint gradient.',
    '笔': 'a cute colorful pencil in the center of the frame with a soft pink eraser on top. Tiny sparkle dots around. Background: soft butter-to-cream gradient.',
    '纸': 'a single soft cream paper in the center of the frame with a tiny cute drawing (no text) on it. Background: soft mint gradient.',
    '尺': 'a cute small ruler in the center of the frame with tiny colorful dots marking measurements. Soft pink wood. Background: soft cream-to-butter gradient.',

    '玩': 'a cute colorful ball in the center of the frame with a tiny bunny playing nearby. Soft pastel stripes. Background: soft sky-blue gradient.',
    '具2': 'a cute toy train in the center of the frame with three soft pastel cars. Tiny smiling face on the locomotive. Background: soft mint-to-cream gradient.',
    '球': 'a cute colorful beach ball in the center of the frame with soft pastel segments. Background: soft sky-blue gradient.',
    '娃': 'a cute small doll in the center of the frame with a soft pastel dress and friendly face. Background: soft pink-to-cream gradient.',
    '娃2': 'same scene as 娃 but with cute small teddy bear in the center of the frame. Soft brown fur, friendly eyes. Background: soft butter-to-cream gradient.',

    '衣': 'a cute small colorful t-shirt in the center of the frame with soft pastel stripes. Background: soft pink gradient.',
    '服': 'a cute small colorful dress in the center of the frame with soft ruffles. Background: soft lavender-to-pink gradient.',
    '帽': 'a cute small sun hat in the center of the frame with a tiny ribbon. Soft cream color. Background: soft butter-to-sky-blue gradient.',
    '鞋': 'a pair of cute small sneakers in the center of the frame, side by side. Soft pastel colors with tiny laces. Background: soft mint gradient.',

    '医': 'a cute friendly doctor figure in the center of the frame wearing a tiny white coat and stethoscope. Background: soft mint-to-cream gradient.',
    '警': 'a cute friendly police officer figure in the center of the frame wearing a tiny blue uniform. Background: soft sky-blue gradient.',
    '司': 'a cute small steering wheel in the center of the frame with a friendly face. Background: soft cream-to-butter gradient.',
    '机2': 'a cute friendly airplane pilot figure in the center of the frame wearing a tiny uniform. Background: soft sky-blue gradient.',

    '时': 'a cute small clock in the center of the frame with a friendly face. Round, soft pastel colors. Background: soft butter gradient.',
    '分': 'a cute small clock showing a happy minute hand in the center of the frame. Soft pastel colors. Background: soft cream gradient.',
    '年': 'a cute small fireworks burst in the center of the frame celebrating a new year. Soft pastel colors. Background: soft lavender gradient.',
    '月2': 'a cute small calendar in the center of the frame with a soft pastel cover and tiny heart on it. Background: soft pink-to-cream gradient.',
    '日2': 'a cute small sun in the center of the frame smiling warmly. Soft yellow with rays. Background: soft butter gradient.',

    '东': 'a cute small sun rising in the east in the center of the frame. Soft pastel sunrise colors. Background: pink-to-orange-to-sky gradient.',
    '西': 'a cute small sunset in the west in the center of the frame. Soft pastel sunset colors. Background: amber-to-pink-to-purple gradient.',
    '南': 'a cute small palm tree in the center of the frame pointing south. Soft green leaves. Background: warm butter-to-sky-blue gradient.',
    '北': 'a cute small polar bear in the center of the frame in the cold north. Soft white fur with pink cheek blush. Background: soft sky-blue-to-white gradient.',

    '刀': 'a cute small chef knife in the center of the frame with a soft wooden handle. Background: soft cream-to-butter gradient.',
    '勺': 'a cute small wooden spoon in the center of the frame. Soft brown wood. Background: soft mint gradient.',
    '叉': 'a cute small fork in the center of the frame. Soft pastel silver with a tiny heart. Background: soft pink-to-cream gradient.',
    '筷': 'a cute pair of chopsticks in the center of the frame resting on a tiny chopstick holder. Soft wood. Background: soft butter gradient.',

    '瓜': 'a cute small watermelon slice in the center of the frame with tiny black seeds. Pink flesh, green rind. Background: soft mint-to-cream gradient.',
    '果': 'a cute small bowl of mixed fruits in the center of the frame: tiny apple, banana, grapes. Background: soft pink-to-cream gradient.',
    '茶': 'a cute small teacup in the center of the frame with soft steam rising and tiny leaf floating. Background: soft mint-cream gradient.',
    '饭': 'a cute small bowl of rice with chopsticks in the center of the frame. Tiny steam rising. Background: soft butter gradient.',
    '包': 'a cute small bun in the center of the frame. Soft white with a tiny smile. Background: soft cream-to-butter gradient.',
    '蛋': 'a cute small egg in the center of the frame with a tiny crack and a baby chick peeking out. Background: soft butter-to-cream gradient.',
    '肉': 'a cute small meatball in the center of the frame on a tiny plate with a friendly face. Background: soft peach-to-cream gradient.',

    '国': 'a cute small flag in the center of the frame with soft pastel red color waving gently. Background: soft sky-blue gradient.',
    '旗': 'a cute small flag pole with a soft pastel flag waving in the center of the frame. Background: soft sky-blue gradient.',
    '城': 'a cute small city skyline in the center of the frame with tiny pastel buildings. Background: soft lavender-to-sky-blue gradient.',
    '村': 'a cute small village scene in the center of the frame with tiny houses, a windmill, and rolling hills. Background: soft mint-to-sky-blue gradient.',

    '园': 'a cute small garden in the center of the frame with tiny flowers, a tree, and a tiny path. Background: soft mint-to-cream gradient.',
    '林2': 'a cute small forest scene in the center of the frame with many tiny trees. Background: soft mint-to-sky-blue gradient.',
    '田': 'a cute small rice field in the center of the frame with tiny green shoots in soft rows. Background: soft mint gradient.',
    '禾': 'a cute single stalk of rice in the center of the frame with a soft golden head of grain. Background: soft butter gradient.',

    '石': 'a cute small smooth pebble in the center of the frame. Soft grey with tiny sparkles. Background: soft cream gradient.',
    '土': 'a cute small pile of soft brown soil in the center of the frame with a tiny green sprout pushing up. Background: soft butter gradient.',
    '沙': 'a cute small pile of soft sand in the center of the frame with tiny seashells. Background: soft cream-to-sky-blue gradient.',

    '花': 'a cute small flower in the center of the frame with soft pastel petals and a yellow center. Background: soft pink-to-mint gradient.',
    '草': 'a cute small tuft of green grass in the center of the frame with tiny dewdrops. Background: soft mint-cream gradient.',
    '树': 'a cute small tree in the center of the frame with a soft round green canopy. Background: soft mint-to-sky-blue gradient.',

    '虫2': 'a cute small ladybug in the center of the frame with soft red wings and tiny black spots. Background: soft mint gradient.',
    '贝': 'a cute small seashell in the center of the frame with soft pink inner spiral. Background: soft cream-to-sky-blue gradient.',

    '河': 'a cute small river flowing through the center of the frame with soft blue water and tiny pebbles. Background: soft sky-blue gradient.',
    '湖': 'a cute small lake in the center of the frame with calm blue water and tiny lily pads. Background: soft sky-blue-to-mint gradient.',
    '海': 'a cute small ocean scene in the center of the frame with soft waves and a tiny sailboat. Background: soft sky-blue gradient.',

    '星': 'a cute small star in the center of the frame with soft glowing rays and a tiny smile. Background: soft purple-to-sky-blue gradient.',
    '光': 'a cute small sunbeam in the center of the frame with soft glowing light and tiny sparkles. Background: soft butter-to-sky-blue gradient.',

    '工': 'a cute small wrench in the center of the frame with soft metallic colors. Background: soft cream-to-mint gradient.',
    '厂': 'a cute small factory in the center of the frame with a tiny chimney and pastel walls. Background: soft sky-blue gradient.',
    '田2': 'a cute small rice field in the center of the frame with golden ripe grains ready for harvest. Background: soft butter gradient.',

    '今': 'a cute small clock in the center of the frame showing the present moment, with a friendly face. Background: soft cream-to-butter gradient.',
    '明': 'a cute small sun rising in the center of the frame representing tomorrow. Soft pastel sunrise. Background: pink-to-sky-blue gradient.',
    '昨': 'a cute small crescent moon in the center of the frame representing yesterday. Soft pastel night sky. Background: soft purple-to-sky-blue gradient.',
    '早': 'a cute small sunrise in the center of the frame with a tiny bird singing. Background: pink-to-amber-to-sky gradient.',

    '高': 'a cute tall giraffe in the center of the frame, looking up. Soft yellow with brown spots. Background: soft butter-to-sky-blue gradient.',
    '低': 'a cute small turtle in the center of the frame looking down. Soft green shell. Background: soft mint gradient.',
    '长': 'a cute long noodle in the center of the frame on a tiny plate. Soft yellow. Background: soft butter-to-cream gradient.',
    '短': 'a cute short stubby pencil in the center of the frame. Soft pastel. Background: soft pink-to-cream gradient.',

    '远': 'a cute small bird flying far away in the distance in the center of the frame. Tiny soft clouds around. Background: soft sky-blue-to-lavender gradient.',
    '近': 'a cute big bunny close-up in the center of the frame with friendly face. Soft white fur. Background: soft pink-to-cream gradient.',

    '美': 'a cute small rainbow in the center of the frame with soft pastel colors. Tiny sparkles. Background: soft sky-blue gradient.',
    '丽': 'a cute small butterfly in the center of the frame with soft colorful wings. Background: soft pink-to-mint gradient.',

    '白2': 'a cute small white cloud in the center of the frame with a tiny smile. Background: soft sky-blue gradient.',
    '红2': 'a cute small red heart in the center of the frame with a friendly smile. Background: soft pink-to-cream gradient.',

    '错': 'two cute small puzzle pieces in the center of the frame, one with a soft red X and one with a soft green checkmark. Background: soft cream gradient.',
    '对': 'a cute soft green checkmark in the center of the frame with a tiny glow. Background: soft mint-cream gradient.',

    '跳2': 'a cute small frog jumping in the center of the frame with happy face. Soft green skin. Background: soft mint-to-sky-blue gradient.',
    '笑2': 'a cute small happy face in the center of the frame with closed smiling eyes and pink cheek blush. Background: soft butter-to-pink gradient.',
  };

  const scene = sceneFor[c.glyph] ?? `a cute visual scene for ${c.glyph} in the center of the frame with soft pastel picture book style surroundings.`;
  return `A 3 year old girl picture book illustration. ${scene} ${STYLE_SUFFIX}`;
}

/**
 * Tier-D 数据集：70 字（一年级下册+扩展）
 */
const TIER_D = [
  // ===== 文具 5 字 =====
  { id: 'char-wen', glyph: '文', pinyin: ['wén'], tone: 2, meaning: ['文字，文化'], strokes: 4, tier: 'D', type: 'phonetic', origin: { fact: '"文"古字像人胸前有花纹。', story: '"文"原本是人身上的花纹。' }, words: ['文字', '中文', '文化'], island: 'starter' },
  { id: 'char-ju', glyph: '具', pinyin: ['jù'], tone: 4, meaning: ['工具'], strokes: 8, tier: 'D', type: 'phonetic', origin: { fact: '"具"由"目"和"八"等组成。', story: '"具"原本是准备工具。' }, words: ['工具', '家具', '具备'], island: 'starter' },
  { id: 'char-bi', glyph: '笔', pinyin: ['bǐ'], tone: 3, meaning: ['笔'], strokes: 10, tier: 'D', type: 'phonetic', origin: { fact: '"笔"由"竹"和"毛"组成。', story: '"笔"原本是竹管里装毛笔头。' }, words: ['铅笔', '毛笔', '画笔'], island: 'starter' },
  { id: 'char-zhi', glyph: '纸', pinyin: ['zhǐ'], tone: 3, meaning: ['纸'], strokes: 6, tier: 'D', type: 'pictograph', origin: { fact: '"纸"由"纟"和"氏"组成。', story: '"纸"原本是丝絮做的书写材料。' }, words: ['白纸', '画纸', '报纸'], island: 'starter' },
  { id: 'char-chi3', glyph: '尺', pinyin: ['chǐ'], tone: 3, meaning: ['尺子'], strokes: 4, tier: 'D', type: 'pictograph', origin: { fact: '"尺"古字像躺着的尺。', story: '"尺"原本是测量长度的工具。' }, words: ['尺子', '尺寸', '尺码'], island: 'starter' },

  // ===== 玩具 5 字 =====
  { id: 'char-wan', glyph: '玩', pinyin: ['wán'], tone: 2, meaning: ['玩耍'], strokes: 7, tier: 'D', type: 'phonetic', origin: { fact: '"玩"由"王"和"元"组成。', story: '"玩"原本是手里玩着玉。' }, words: ['玩具', '玩耍', '玩笑'], island: 'actions' },
  { id: 'char-ju-toy', glyph: '具', pinyin: ['jù'], tone: 4, meaning: ['玩具'], strokes: 8, tier: 'D', type: 'phonetic', origin: { fact: '"具"由"目"和"八"等组成。', story: '"具"原本是准备工具。' }, words: ['玩具', '工具', '家具'], island: 'starter' },
  { id: 'char-qiu-ball', glyph: '球', pinyin: ['qiú'], tone: 2, meaning: ['球'], strokes: 11, tier: 'D', type: 'phonetic', origin: { fact: '"球"由"王"和"求"组成。', story: '"球"原本是抛来抛去的玉。' }, words: ['皮球', '足球', '篮球'], island: 'actions' },
  { id: 'char-wa', glyph: '娃', pinyin: ['wá'], tone: 2, meaning: ['娃娃'], strokes: 8, tier: 'D', type: 'phonetic', origin: { fact: '"娃"由"女"和"圭"组成。', story: '"娃"原本是小女孩。' }, words: ['娃娃', '娃子', '小娃'], island: 'family' },
  { id: 'char-xiong', glyph: '熊', pinyin: ['xióng'], tone: 2, meaning: ['熊'], strokes: 10, tier: 'D', type: 'pictograph', origin: { fact: '"熊"古字像一只熊。', story: '"熊"原本画的就是一只熊的样子。' }, words: ['熊猫', '小熊', '北极熊'], island: 'animals' },

  // ===== 衣服 4 字 =====
  { id: 'char-yi-clothes', glyph: '衣', pinyin: ['yī'], tone: 1, meaning: ['衣服'], strokes: 6, tier: 'D', type: 'pictograph', origin: { fact: '"衣"古字像一件上衣。', story: '"衣"原本画的就是一件衣服。' }, words: ['衣服', '上衣', '毛衣'], island: 'starter' },
  { id: 'char-fu', glyph: '服', pinyin: ['fú'], tone: 2, meaning: ['服装'], strokes: 8, tier: 'D', type: 'pictograph', origin: { fact: '"服"古字像跪着的人。', story: '"服"原本是服从、屈服的意思。' }, words: ['衣服', '服装', '服务'], island: 'starter' },
  { id: 'char-mao-hat', glyph: '帽', pinyin: ['mào'], tone: 4, meaning: ['帽子'], strokes: 12, tier: 'D', type: 'phonetic', origin: { fact: '"帽"由"冒"和"巾"组成。', story: '"帽"是戴在头上的布。' }, words: ['帽子', '草帽', '礼帽'], island: 'starter' },
  { id: 'char-xie', glyph: '鞋', pinyin: ['xié'], tone: 2, meaning: ['鞋子'], strokes: 14, tier: 'D', type: 'phonetic', origin: { fact: '"鞋"由"革"和"圭"组成。', story: '"鞋"原本是皮鞋。' }, words: ['鞋子', '皮鞋', '球鞋'], island: 'starter' },

  // ===== 职业 4 字 =====
  { id: 'char-yi-doctor', glyph: '医', pinyin: ['yī'], tone: 1, meaning: ['医生'], strokes: 7, tier: 'D', type: 'phonetic', origin: { fact: '"医"由"匚"和"矢"组成。', story: '"医"原本是装箭的器具。' }, words: ['医生', '医院', '医师'], island: 'family' },
  { id: 'char-jing', glyph: '警', pinyin: ['jǐng'], tone: 3, meaning: ['警察'], strokes: 19, tier: 'D', type: 'phonetic', origin: { fact: '"警"由"敬"和"言"组成。', story: '"警"是警告、让人警觉。' }, words: ['警察', '警报', '警卫'], island: 'family' },
  { id: 'char-si-driver', glyph: '司', pinyin: ['sī'], tone: 1, meaning: ['司机'], strokes: 5, tier: 'D', type: 'phonetic', origin: { fact: '"司"古字像一个人。', story: '"司"原本是掌管、主持。' }, words: ['司机', '公司', '司令'], island: 'family' },
  { id: 'char-fei-pilot', glyph: '飞', pinyin: ['fēi'], tone: 1, meaning: ['飞机'], strokes: 3, tier: 'D', type: 'pictograph', origin: { fact: '"飞"古字像一只展翅的鸟。', story: '"飞"原本画的是鸟展开翅膀的样子。' }, words: ['飞机', '飞鸟', '飞翔'], island: 'starter' },

  // ===== 时间 5 字 =====
  { id: 'char-shi-time', glyph: '时', pinyin: ['shí'], tone: 2, meaning: ['时间'], strokes: 7, tier: 'D', type: 'phonetic', origin: { fact: '"时"由"日"和"寺"组成。', story: '"时"是太阳经过寺庙的时刻。' }, words: ['时间', '小时', '时候'], island: 'starter' },
  { id: 'char-fen', glyph: '分', pinyin: ['fēn'], tone: 1, meaning: ['分钟'], strokes: 4, tier: 'D', type: 'phonetic', origin: { fact: '"分"由"八"和"刀"组成。', story: '"分"是分开、分配。' }, words: ['分钟', '分开', '分数'], island: 'starter' },
  { id: 'char-nian', glyph: '年', pinyin: ['nián'], tone: 2, meaning: ['年'], strokes: 6, tier: 'D', type: 'pictograph', origin: { fact: '"年"古字像禾穗成熟。', story: '"年"原本是稻谷一年成熟一次。' }, words: ['一年', '新年', '年龄'], island: 'nature' },
  { id: 'char-yue-month', glyph: '月', pinyin: ['yuè'], tone: 4, meaning: ['月份'], strokes: 4, tier: 'D', type: 'pictograph', origin: { fact: '"月"古字像月牙。', story: '"月"原本画的就是月牙。' }, words: ['月份', '月亮', '月光'], island: 'nature' },
  { id: 'char-ri-sun', glyph: '日', pinyin: ['rì'], tone: 4, meaning: ['日子'], strokes: 4, tier: 'D', type: 'pictograph', origin: { fact: '"日"古字像太阳。', story: '"日"原本画的就是太阳。' }, words: ['日子', '日出', '生日'], island: 'nature' },

  // ===== 方向 4 字 =====
  { id: 'char-dong-east', glyph: '东', pinyin: ['dōng'], tone: 1, meaning: ['东方'], strokes: 5, tier: 'D', type: 'phonetic', origin: { fact: '"东"古字像木被捆起来的样子。', story: '"东"原本是树木被绑起来的形状。' }, words: ['东方', '东边', '东西'], island: 'starter' },
  { id: 'char-xi', glyph: '西', pinyin: ['xī'], tone: 1, meaning: ['西方'], strokes: 6, tier: 'D', type: 'pictograph', origin: { fact: '"西"古字像鸟巢的形状。', story: '"西"原本是鸟归巢的方向。' }, words: ['西方', '西边', '东西'], island: 'starter' },
  { id: 'char-nan', glyph: '南', pinyin: ['nán'], tone: 2, meaning: ['南方'], strokes: 9, tier: 'D', type: 'phonetic', origin: { fact: '"南"古字像悬挂的钟。', story: '"南"原本是悬挂的钟。' }, words: ['南方', '南边', '南北'], island: 'starter' },
  { id: 'char-bei-north', glyph: '北', pinyin: ['běi'], tone: 3, meaning: ['北方'], strokes: 5, tier: 'D', type: 'phonetic', origin: { fact: '"北"古字像两人背对背。', story: '"北"原本是两人背对背的样子。' }, words: ['北方', '北边', '南北'], island: 'starter' },

  // ===== 餐具 4 字 =====
  { id: 'char-dao', glyph: '刀', pinyin: ['dāo'], tone: 1, meaning: ['刀'], strokes: 2, tier: 'D', type: 'pictograph', origin: { fact: '"刀"古字像一把刀。', story: '"刀"原本画的就是一把刀。' }, words: ['小刀', '刀子', '剪刀'], island: 'starter' },
  { id: 'char-shao-spoon', glyph: '勺', pinyin: ['sháo'], tone: 2, meaning: ['勺子'], strokes: 4, tier: 'D', type: 'phonetic', origin: { fact: '"勺"古字像勺子的形状。', story: '"勺"原本画的就是勺子。' }, words: ['勺子', '小勺', '汤勺'], island: 'starter' },
  { id: 'char-cha', glyph: '叉', pinyin: ['chā'], tone: 1, meaning: ['叉子'], strokes: 3, tier: 'D', type: 'pictograph', origin: { fact: '"叉"古字像分叉的样子。', story: '"叉"原本画的是树枝分叉的样子。' }, words: ['叉子', '交叉', '刀叉'], island: 'starter' },
  { id: 'char-kuai', glyph: '筷', pinyin: ['kuài'], tone: 4, meaning: ['筷子'], strokes: 12, tier: 'D', type: 'phonetic', origin: { fact: '"筷"由"快"和"竹"组成。', story: '"筷"是快快夹菜的竹制工具。' }, words: ['筷子', '木筷', '竹筷'], island: 'starter' },

  // ===== 食物 7 字 =====
  { id: 'char-gua', glyph: '瓜', pinyin: ['guā'], tone: 1, meaning: ['瓜'], strokes: 5, tier: 'D', type: 'pictograph', origin: { fact: '"瓜"古字像瓜藤上结的瓜。', story: '"瓜"原本是藤蔓上结的果实。' }, words: ['西瓜', '南瓜', '哈密瓜'], island: 'plants' },
  { id: 'char-guo-fruit', glyph: '果', pinyin: ['guǒ'], tone: 3, meaning: ['水果'], strokes: 8, tier: 'D', type: 'pictograph', origin: { fact: '"果"古字像树上结的果子。', story: '"果"原本画的是树上结的果实。' }, words: ['水果', '果子', '苹果'], island: 'plants' },
  { id: 'char-cha-tea', glyph: '茶', pinyin: ['chá'], tone: 2, meaning: ['茶'], strokes: 9, tier: 'D', type: 'phonetic', origin: { fact: '"茶"由"艹"和"余"组成。', story: '"茶"原本是茶树的叶子。' }, words: ['茶叶', '喝茶', '茶花'], island: 'plants' },
  { id: 'char-fan', glyph: '饭', pinyin: ['fàn'], tone: 4, meaning: ['米饭'], strokes: 7, tier: 'D', type: 'phonetic', origin: { fact: '"饭"由"饣"和"反"组成。', story: '"饭"是煮熟的米。' }, words: ['米饭', '吃饭', '晚饭'], island: 'starter' },
  { id: 'char-bao', glyph: '包', pinyin: ['bāo'], tone: 1, meaning: ['包子'], strokes: 5, tier: 'D', type: 'phonetic', origin: { fact: '"包"由"勹"和"巾"组成。', story: '"包"是把东西包起来。' }, words: ['包子', '书包', '打包'], island: 'starter' },
  { id: 'char-dan', glyph: '蛋', pinyin: ['dàn'], tone: 4, meaning: ['蛋'], strokes: 5, tier: 'D', type: 'pictograph', origin: { fact: '"蛋"古字像蛋的形状。', story: '"蛋"原本画的就是一颗蛋。' }, words: ['鸡蛋', '蛋糕', '蛋壳'], island: 'starter' },
  { id: 'char-rou', glyph: '肉', pinyin: ['ròu'], tone: 4, meaning: ['肉'], strokes: 6, tier: 'D', type: 'pictograph', origin: { fact: '"肉"古字像一块肉。', story: '"肉"原本画的就是一块肉。' }, words: ['肉肉', '牛肉', '猪肉'], island: 'starter' },

  // ===== 国家地理 4 字 =====
  { id: 'char-guo-country', glyph: '国', pinyin: ['guó'], tone: 2, meaning: ['国家'], strokes: 8, tier: 'D', type: 'phonetic', origin: { fact: '"国"由"囗"和"玉"组成。', story: '"国"原本是"或"加"囗"，表示国家的领土。' }, words: ['国家', '中国', '外国'], island: 'starter' },
  { id: 'char-qi-flag', glyph: '旗', pinyin: ['qí'], tone: 2, meaning: ['旗帜'], strokes: 14, tier: 'D', type: 'phonetic', origin: { fact: '"旗"由"方"和"其"组成。', story: '"旗"是方方正正的旗帜。' }, words: ['国旗', '红旗', '彩旗'], island: 'starter' },
  { id: 'char-cheng', glyph: '城', pinyin: ['chéng'], tone: 2, meaning: ['城市'], strokes: 9, tier: 'D', type: 'phonetic', origin: { fact: '"城"由"土"和"成"组成。', story: '"城"原本是筑土而成的城墙。' }, words: ['城市', '城墙', '城堡'], island: 'starter' },
  { id: 'char-cun', glyph: '村', pinyin: ['cūn'], tone: 1, meaning: ['村庄'], strokes: 7, tier: 'D', type: 'phonetic', origin: { fact: '"村"由"木"和"寸"组成。', story: '"村"原本是树木边的小聚集地。' }, words: ['村庄', '村子', '山村'], island: 'starter' },

  // ===== 自然 7 字 =====
  { id: 'char-yuan', glyph: '园', pinyin: ['yuán'], tone: 2, meaning: ['花园'], strokes: 7, tier: 'D', type: 'phonetic', origin: { fact: '"园"由"囗"和"元"组成。', story: '"园"是围着围墙的种植地。' }, words: ['花园', '公园', '菜园'], island: 'plants' },
  { id: 'char-lin-forest', glyph: '林', pinyin: ['lín'], tone: 2, meaning: ['树林'], strokes: 8, tier: 'D', type: 'compound', origin: { fact: '"林"由两个"木"组成。', story: '"林"是两棵树在一起。' }, words: ['树林', '森林', '林荫'], island: 'plants' },
  { id: 'char-tian-field', glyph: '田', pinyin: ['tián'], tone: 2, meaning: ['田地'], strokes: 5, tier: 'D', type: 'pictograph', origin: { fact: '"田"古字像一块块农田。', story: '"田"原本画的是有田埂的农田。' }, words: ['田地', '稻田', '农田'], island: 'plants' },
  { id: 'char-he-rice', glyph: '禾', pinyin: ['hé'], tone: 2, meaning: ['禾苗'], strokes: 5, tier: 'D', type: 'pictograph', origin: { fact: '"禾"古字像一棵禾苗。', story: '"禾"原本画的是一棵谷类作物。' }, words: ['禾苗', '禾田', '禾场'], island: 'plants' },
  { id: 'char-shi-stone', glyph: '石', pinyin: ['shí'], tone: 2, meaning: ['石头'], strokes: 5, tier: 'D', type: 'pictograph', origin: { fact: '"石"古字像山崖下的石块。', story: '"石"原本画的是山崖下的石头。' }, words: ['石头', '石子', '岩石'], island: 'nature' },
  { id: 'char-tu-earth', glyph: '土', pinyin: ['tǔ'], tone: 3, meaning: ['泥土'], strokes: 3, tier: 'D', type: 'pictograph', origin: { fact: '"土"古字像地上一块土。', story: '"土"原本画的是地上鼓起的一块土。' }, words: ['土地', '泥土', '土豆'], island: 'nature' },
  { id: 'char-sha', glyph: '沙', pinyin: ['shā'], tone: 1, meaning: ['沙子'], strokes: 7, tier: 'D', type: 'phonetic', origin: { fact: '"沙"由"氵"和"少"组成。', story: '"沙"原本是水边散落的细小石头。' }, words: ['沙子', '沙滩', '沙土'], island: 'nature' },

  // ===== 植物 3 字 =====
  { id: 'char-hua-flower', glyph: '花', pinyin: ['huā'], tone: 1, meaning: ['花朵'], strokes: 7, tier: 'D', type: 'pictograph', origin: { fact: '"花"古字像花朵。', story: '"花"原本画的就是一朵盛开的花。' }, words: ['花朵', '鲜花', '花园'], island: 'plants' },
  { id: 'char-cao', glyph: '草', pinyin: ['cǎo'], tone: 3, meaning: ['草地'], strokes: 9, tier: 'D', type: 'phonetic', origin: { fact: '"草"由"艹"和"早"组成。', story: '"草"是早春先长出来的植物。' }, words: ['草地', '小草', '草原'], island: 'plants' },
  { id: 'char-shu-tree', glyph: '树', pinyin: ['shù'], tone: 4, meaning: ['树木'], strokes: 8, tier: 'D', type: 'phonetic', origin: { fact: '"树"由"木"和"尌"组成。', story: '"树"是站立生长的木本植物。' }, words: ['树木', '大树', '树叶'], island: 'plants' },

  // ===== 动物 2 字 =====
  { id: 'char-chong-bug', glyph: '虫', pinyin: ['chóng'], tone: 2, meaning: ['小虫'], strokes: 6, tier: 'D', type: 'pictograph', origin: { fact: '"虫"古字像一条蛇。', story: '"虫"原本指蛇，后来指各种小虫子。' }, words: ['虫子', '昆虫', '毛虫'], island: 'animals' },
  { id: 'char-bei-shell', glyph: '贝', pinyin: ['bèi'], tone: 4, meaning: ['贝壳'], strokes: 4, tier: 'D', type: 'pictograph', origin: { fact: '"贝"古字像贝壳的样子。', story: '"贝"原本是海里的贝壳。' }, words: ['贝壳', '宝贝', '海贝'], island: 'animals' },

  // ===== 水域 3 字 =====
  { id: 'char-he-river', glyph: '河', pinyin: ['hé'], tone: 2, meaning: ['河流'], strokes: 8, tier: 'D', type: 'phonetic', origin: { fact: '"河"由"氵"和"可"组成。', story: '"河"是可以喝水的大水流。' }, words: ['河水', '大河', '小河'], island: 'nature' },
  { id: 'char-hu-lake', glyph: '湖', pinyin: ['hú'], tone: 2, meaning: ['湖泊'], strokes: 12, tier: 'D', type: 'phonetic', origin: { fact: '"湖"由"氵"和"胡"组成。', story: '"湖"是平静的大水面。' }, words: ['湖水', '湖泊', '西湖'], island: 'nature' },
  { id: 'char-hai', glyph: '海', pinyin: ['hǎi'], tone: 3, meaning: ['大海'], strokes: 10, tier: 'D', type: 'phonetic', origin: { fact: '"海"由"氵"和"每"组成。', story: '"海"是最大的水域。' }, words: ['大海', '海边', '海洋'], island: 'nature' },

  // ===== 天体 2 字 =====
  { id: 'char-xing', glyph: '星', pinyin: ['xīng'], tone: 1, meaning: ['星星'], strokes: 9, tier: 'D', type: 'pictograph', origin: { fact: '"星"古字像散落的亮点。', story: '"星"原本是天空中的亮点。' }, words: ['星星', '星光', '明星'], island: 'nature' },
  { id: 'char-guang', glyph: '光', pinyin: ['guāng'], tone: 1, meaning: ['光线'], strokes: 6, tier: 'D', type: 'pictograph', origin: { fact: '"光"古字像人举着火把。', story: '"光"原本是人举着火把发光的样子。' }, words: ['光线', '阳光', '光明'], island: 'nature' },

  // ===== 时间 4 字 =====
  { id: 'char-jin', glyph: '今', pinyin: ['jīn'], tone: 1, meaning: ['现在'], strokes: 4, tier: 'D', type: 'phonetic', origin: { fact: '"今"由"人"和"一"组成。', story: '"今"是今天、现在的意思。' }, words: ['今天', '今天', '如今'], island: 'starter' },
  { id: 'char-ming2', glyph: '明', pinyin: ['míng'], tone: 2, meaning: ['明天'], strokes: 8, tier: 'D', type: 'compound', origin: { fact: '"明"由"日"和"月"组成。', story: '"明"是日月同辉，光明。' }, words: ['明天', '明亮', '明白'], island: 'starter' },
  { id: 'char-zuo2', glyph: '昨', pinyin: ['zuó'], tone: 2, meaning: ['昨天'], strokes: 9, tier: 'D', type: 'phonetic', origin: { fact: '"昨"由"日"和"乍"组成。', story: '"昨"是刚刚过去的日子。' }, words: ['昨天', '昨日', '昨夜'], island: 'starter' },
  { id: 'char-zao', glyph: '早', pinyin: ['zǎo'], tone: 3, meaning: ['早上'], strokes: 6, tier: 'D', type: 'pictograph', origin: { fact: '"早"古字像日出时的草。', story: '"早"原本是太阳刚升起，草上有晨露的样子。' }, words: ['早上', '早晨', '早安'], island: 'starter' },

  // ===== 形容词 4 字 =====
  { id: 'char-gao', glyph: '高', pinyin: ['gāo'], tone: 1, meaning: ['高大'], strokes: 10, tier: 'D', type: 'phonetic', origin: { fact: '"高"古字像高楼的样子。', story: '"高"原本是高高的楼台。' }, words: ['高大', '高兴', '高山'], island: 'starter' },
  { id: 'char-di-low', glyph: '低', pinyin: ['dī'], tone: 1, meaning: ['低'], strokes: 7, tier: 'D', type: 'phonetic', origin: { fact: '"低"由"亻"和"氐"组成。', story: '"低"是头往下垂。' }, words: ['低头', '低矮', '低声'], island: 'starter' },
  { id: 'char-chang-long', glyph: '长', pinyin: ['cháng'], tone: 2, meaning: ['长短'], strokes: 4, tier: 'D', type: 'pictograph', origin: { fact: '"长"古字像长发的人。', story: '"长"原本是长发飘动的样子。' }, words: ['长短', '长江', '长久'], island: 'starter' },
  { id: 'char-duan', glyph: '短', pinyin: ['duǎn'], tone: 3, meaning: ['短'], strokes: 7, tier: 'D', type: 'phonetic', origin: { fact: '"短"由"矢"和"豆"组成。', story: '"短"原本是短的箭。' }, words: ['长短', '短小', '短裤'], island: 'starter' },

  // ===== 抽象 4 字 =====
  { id: 'char-yuan-far', glyph: '远', pinyin: ['yuǎn'], tone: 3, meaning: ['远'], strokes: 7, tier: 'D', type: 'phonetic', origin: { fact: '"远"由"辶"和"袁"组成。', story: '"远"是走得远的意思。' }, words: ['远近', '远方', '远处'], island: 'starter' },
  { id: 'char-jin-near', glyph: '近', pinyin: ['jìn'], tone: 4, meaning: ['近'], strokes: 7, tier: 'D', type: 'phonetic', origin: { fact: '"近"由"辶"和"斤"组成。', story: '"近"是走得近的意思。' }, words: ['远近', '近处', '近路'], island: 'starter' },
  { id: 'char-mei-beauty', glyph: '美', pinyin: ['měi'], tone: 3, meaning: ['美丽'], strokes: 9, tier: 'D', type: 'phonetic', origin: { fact: '"美"由"羊"和"大"组成。', story: '"美"原本是羊大很肥美的样子。' }, words: ['美丽', '美好', '美食'], island: 'starter' },
  { id: 'char-li-pretty', glyph: '丽', pinyin: ['lì'], tone: 4, meaning: ['美丽'], strokes: 7, tier: 'D', type: 'compound', origin: { fact: '"丽"由"一"和"冂"和"𡗗"组成。', story: '"丽"原本是成对、好看。' }, words: ['美丽', '艳丽', '华丽'], island: 'starter' },

  // ===== 反馈 4 字 =====
  { id: 'char-cuo', glyph: '错', pinyin: ['cuò'], tone: 4, meaning: ['错误'], strokes: 10, tier: 'D', type: 'phonetic', origin: { fact: '"错"由"金"和"昔"组成。', story: '"错"原本是磨玉的工具。' }, words: ['错误', '弄错', '不错'], island: 'starter' },
  { id: 'char-dui', glyph: '对', pinyin: ['duì'], tone: 4, meaning: ['正确'], strokes: 4, tier: 'D', type: 'compound', origin: { fact: '"对"古字像对着的样子。', story: '"对"是两件事物相对应。' }, words: ['对的', '对面', '对了'], island: 'starter' },
  { id: 'char-tiao-dance', glyph: '跳', pinyin: ['tiào'], tone: 4, meaning: ['跳'], strokes: 13, tier: 'D', type: 'phonetic', origin: { fact: '"跳"由"足"和"兆"组成。', story: '"跳"是用脚跃起。' }, words: ['跳舞', '跳动', '跳跃'], island: 'actions' },
  { id: 'char-xiao-smile', glyph: '笑', pinyin: ['xiào'], tone: 4, meaning: ['笑'], strokes: 10, tier: 'D', type: 'phonetic', origin: { fact: '"笑"由"竹"和"夭"组成。', story: '"笑"是心情好发出的声音。' }, words: ['笑脸', '微笑', '大笑'], island: 'starter' },
];

module.exports = {
  characters: TIER_D,
  cues: TIER_D.map((c) => ({
    id: `char-${c.id.replace('char-', '')}-pron`,
    kind: 'character',
    text: `${c.glyph}，${c.glyph}，${c.glyph}。`,
    url: `/assets/audio/l1/tier-d/${c.id.replace('char-', '')}-pron.mp3`,
    refId: c.id,
  })),
  art: TIER_D.map((c) => ({
    id: `picto-${c.id.replace('char-', '')}`,
    subject: c.glyph,
    prompt: buildPictoPrompt(c),
    outPath: `/assets/art/l1/tier-d/picto-${c.id.replace('char-', '')}.jpg`,
    refId: c.id,
  })),
};