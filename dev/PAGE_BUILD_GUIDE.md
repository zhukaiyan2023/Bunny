# Bunny · 页面构建指南（给 subagent 参考）

## 已就位的层

### 1. Design tokens · `src/styles/tokens.css`
```css
--bunny-cream: #FFF4E6;     /* 主背景 */
--bunny-peach: #FFE0BF;     /* 二级背景 */
--bunny-red:   #E94545;     /* CTA / 主色 */
--bunny-mint:  #A8E6CF;
--bunny-sky:   #B5DEFF;
--bunny-butter:#FFE9A8;
--bunny-lavender:#D9C2F0;
--bunny-pink:  #FFC1CC;
--bunny-mint-deep:#39B86A;
--bunny-ink:        #2C2C54;
--bunny-soft-ink:   #5C5C8A;
--bunny-pink-deep:  #7A2A4D;
--bunny-amber-deep: #7A4F00;
--bunny-green-deep: #1F6A4D;
--bunny-blue-deep:  #3F4C7A;
--bunny-lavender-deep:#7B5EAB;
--bunny-pink-ear:   #FFD3DC;
--bunny-cheek:      #FFC1CC;
--bunny-yellow:     #FFD15C;
--font-sans: ...PingFang SC...
--radius-card: 24px; --radius-button: 22px; --radius-pill: 999px;
--touch-min: 56px; --touch-hero: 88px; --touch-mascot: 120px;
```

### 2. 已就位的组件

```tsx
import { Bunny, SmileyFace } from '../components/mascot/Bunny';
// <Bunny pose="idle|happy|cheering" size={180} />
// <SmileyFace size={80} />

import { BottomNav } from '../components/shell/BottomNav';
// 6-tab 底栏，已在 App.tsx 挂在最外层
import { TopBar } from '../components/shell/TopBar';
// <TopBar title="…" subtitle="…" right={<X />} />

import { Button } from '../components/ui/Button';
// <Button variant="primary|mint|butter|pink|sky|lavender|red|ghost"
//         size="sm|md|lg|hero" block leading="🐰">…</Button>

import { Card } from '../components/ui/Card';
// <Card variant="soft|mint|butter|pink|sky|lavender" shadow="soft|pop|none">…</Card>

import { ProgressBar } from '../components/ui/ProgressBar';
// <ProgressBar value={0.7} total={300} label="…" color="…" />
```

### 3. 已就位的 Hooks

```tsx
import { useContent } from '../runtime/ContentProvider';
const { characters, charactersById, stories, games, audio, islands } = useContent();

import { useLearner } from '../runtime/LearnerProvider';
const { profile, markCharacterExposed, markCharacterCorrect, recordEvent } = useLearner();
// profile: { bunnyLevel, learnedCount, masteredCount, mastery, badges, ... }

import { useAudio } from '../runtime/AudioProvider';
const { playCue, playText, stop, isPlaying, currentCueId } = useAudio();
// playCue('bunny-welcome-1')  // 播 audio cue
// playText('你真棒呀')          // 智能匹配一个 praise cue
```

### 4. 资源路径
- `useContent().audio[].url` 直接是 `/assets/audio/l0/welcome/bunny-welcome-1.mp3`
- `public/assets/...` 是 Vite 静态资源根目录
- 占位也已经在写入；真实图/音由 `npm run art:make` / `npm run audio:tencent` 生成

## 设计基线（3-6 岁适龄 + Open Design 对齐）

1. **大 Bunny 始终在场**（除了纯文字页）
2. **主 CTA ≥ 120px · 触控目标 ≥ 88px**
3. **屏幕汉字 ≤ 20 个、≤ 2 行**
4. **拟人化图标**：圆眼睛 + 腮红 + 甜甜笑
5. **永不负面反馈**：错误 = "Bunny 没听清，再点一次"
6. **进度用星 / 用苗**："找到 5 颗星"、"种下 47 棵苗"
7. **风格**：pastel + 圆润 + 温暖 + 安全
8. **画面色板**：奶油 #FFF4E6 + 桃 #FFE0BF + 薄荷 #A8E6CF + 天空蓝 #B5DEFF + 黄油 #FFE9A8 + 淡紫 #D9C2F0 + 柔粉 #FFC1CC

## 路由（在 App.tsx 已经挂好）

- `/`              → HomePage
- `/story`         → StoryPage
- `/characters`    → CharacterMuseumPage
- `/game`          → GamePage
- `/readalong`     → ReadAlongPage
- `/badges`        → BadgesPage
- `/garden`        → GardenMapPage
- `/evolution`     → EvolutionPage
- `/daily`         → DailyPlanPage
- `/level`         → LevelPage
- `/curriculum`    → CurriculumPage
- `/parent`        → ParentReportPage

## 资源读取

```tsx
const { audio, characters } = useContent();

// 找 character art
const charItem = characters.find((c) => c.id === 'char-shan');
// character 的图目前在 art[].outPath，但 character object 没存图路径
// 需要从 manifest.art 里找
```

实际 art manifest 的 outPath 是 `/assets/art/l0/bunny/bunny-idle.jpg` 这种，文件后缀是 jpg。读取：

```tsx
<img src={`${cue.url}`} />
// 例如：/assets/audio/l0/welcome/bunny-welcome-1.mp3
```

## 建议

1. 每个页面用 `<TopBar>` 开头，留 96px 顶部空间
2. 主区从 96px 到 936px（840px 高度），保留 88px 给 BottomNav
3. 容器 padding 32px
4. 用 CSS Grid / Flex 布局，不要硬编码 width/ height（除了内容物）
5. 字体大小：标题 22-36px、正文 14-18px、按钮 16-22px
6. 文字色优先 `--bunny-ink` (#2C2C54)，次要 `--bunny-soft-ink` (#5C5C8A)

## 验证

```bash
# 每次写完一个页面，立即验证
npm run dev
# 打开浏览器访问对应路由
```