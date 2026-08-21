# Bunny 前端技术栈与工程规范

## 1. 技术结论

Bunny 是面向儿童学习机/Pad 的横屏 H5 产品，核心形态同时包含：

- 大量信息架构与学习状态页面
- 互动绘本与逐句陪读
- 汉字动画与内容展示
- 拖拽、点击、排序、配对等小游戏
- Canvas 场景、动画、粒子和角色交互
- 音频、TTS/ASR、录音
- 个性化学习与成长系统

因此不采用“所有页面都 Canvas”或“所有内容都游戏引擎化”的方案。

**正式推荐：React + TypeScript + Vite + Phaser 3。**

其中：

```text
React + TypeScript
        │
        ├── App Shell / 路由 / 页面 / 学习 UI
        ├── 绘本阅读 / 汉字详情 / 成长体系
        ├── 家长中心 / 设置 / 报告
        └── 内容驱动组件

Phaser 3
        │
        ├── 识字小游戏
        ├── 冒险场景
        ├── 拖拽 / 物理 / 粒子
        ├── 角色动画
        └── Canvas 高交互场景

Shared Domain Layer
        │
        ├── Learner Model
        ├── Content DSL
        ├── Game DSL
        ├── Story DSL
        ├── Audio Engine
        └── Event / Analytics
```

## 2. 为什么选择 React

### 2.1 Bunny 本质不是纯游戏

Bunny 有大量非游戏页面：

- 世界地图
- 绘本目录
- 汉字详情
- 汉字博物馆
- 学习等级
- 能力成长树
- 每日学习计划
- 学习报告
- 家长中心
- 内容管理和调试页面

这些页面用 React 的组件化 UI 模型比直接使用游戏引擎更容易维护。

### 2.2 内容驱动更适合 React

同一个页面需要根据 Content DSL 动态渲染不同绘本、汉字、词语、任务和学习状态。React 的组件组合非常适合：

```text
Content JSON
    ↓
React Renderer
    ↓
StoryPage / CharacterCard / Reward / Progress
```

### 2.3 生态适合长期产品化

React + TypeScript 对路由、状态管理、组件测试、工程规范、代码生成、AI Coding 和团队协作都较成熟。

## 3. 为什么使用 TypeScript

Bunny 的核心数据不是简单页面数据，而是复杂的领域模型：

- Character
- Word
- Story
- StoryPage
- GameDefinition
- LearnerProfile
- CharacterMastery
- SkillProfile
- DailyPlan
- Reward
- Progression

必须使用强类型约束，避免 AI 批量生成内容时出现字段漂移和运行时错误。

建议：

- `strict: true`
- 禁止隐式 `any`
- DSL 全部建立 TypeScript Schema
- API 响应必须经过 schema validation

## 4. 为什么使用 Vite

Bunny 当前阶段是 H5/Pad Web 产品，优先目标是：

- 开发启动快
- 热更新快
- 打包简单
- 静态部署方便
- 与 CDN/对象存储兼容
- 适合 GitHub Pages、Cloudflare、Nginx、对象存储等部署模型

Vite 可以作为工程构建层，不承担业务逻辑。

## 5. 为什么使用 Phaser 3

Phaser 专门负责 Bunny 的“游戏运行时”，尤其适合：

- 找字
- 钓鱼识字
- 汉字消消乐
- 迷宫
- 拖拽配对
- 角色移动
- 场景探索
- 粒子效果
- 连击
- 简单物理
- Canvas 动画

不要用 Phaser 承担整个产品 UI。

推荐边界：

```text
React
├── 页面
├── 导航
├── 绘本文字
├── 汉字详情
├── 成长系统
├── 学习报告
└── 家长中心

Phaser
├── GameScene
├── InteractiveScene
├── CharacterAnimation
└── MiniGameRuntime
```

## 6. React 与 Phaser 集成原则

禁止在 Phaser Scene 中直接实现业务规则。

推荐：

```text
React Page
   ↓
GameContainer
   ↓
Phaser Runtime
   ↓
Game DSL
   ↓
Game Result
   ↓
LearningEngine
```

Phaser 只产生运行结果，例如：

```ts
{
  gameId: "find_character_001",
  score: 95,
  attempts: 4,
  hints: 0,
  durationMs: 18200,
  targetCharacters: ["森"],
  mastered: false
}
```

真正的学习状态更新由 Learning Engine 完成。

## 7. 状态管理

采用分层状态，而不是一个全局 Store 塞进所有数据。

### UI State

React 组件局部状态：

- 弹窗
- 当前 tab
- 播放状态
- 当前页面动画状态

### Session State

当前学习会话：

- sessionId
- currentStory
- currentPage
- currentGame
- audioState
- learner snapshot

### Domain State

长期学习状态：

- LearnerProfile
- CharacterMastery
- SkillProfile
- Progression
- Rewards

Domain State 必须通过 Learning Engine 更新，UI 不直接修改。

## 8. 绘本渲染策略

绘本正文默认使用 DOM/CSS，而不是 Canvas。

原因：

- 大字号适配 Pad
- 文本清晰
- 高亮容易
- 点击汉字容易
- 可做逐词同步
- 适合无障碍和字体缩放
- 更容易做测试

绘本插画、角色动画可以使用：

- Web image
- CSS animation
- SVG
- Lottie（如需要）
- Phaser scene（高互动页面）

## 9. 音频层

建立独立 `AudioEngine`，统一管理：

```text
Narration
Character Voice
TTS
ASR Recording
BGM
SFX
UI Sound
```

要求：

- 音频可暂停/继续
- 页面切换自动管理
- 支持队列
- 支持句子级时间轴
- 支持“当前词/句”高亮同步
- 网络失败时优先使用缓存资源

## 10. 语音能力

语音必须独立于具体供应商。

```text
SpeechProvider
├── TTS Provider
└── ASR Provider
```

上层只依赖统一接口：

```ts
interface SpeechProvider {
  synthesize(text: string, options?: SpeechOptions): Promise<AudioResult>;
  recognize(audio: Blob, options?: RecognitionOptions): Promise<RecognitionResult>;
}
```

这样后续可以替换云端或本地模型。

## 11. H5 / Pad 适配

设计基准：

- 8～13 英寸平板
- 横屏优先
- 触控优先
- 远距离观看优先
- 一屏一个核心任务

禁止依赖桌面鼠标 hover 才能完成任务。

触控区域建议：

- 核心按钮至少 56×56 CSS px
- 儿童主要操作尽量 64～96 CSS px
- 游戏对象优先 80 CSS px 以上

具体数值需通过真实设备测试调整。

## 12. 响应式断点

建议至少覆盖：

```text
1280 × 800
1280 × 720
1024 × 768
1920 × 1200
```

不要以手机 375px 布局为基础再放大到 Pad。

## 13. 工程目录

```text
src/
├── app/
│   ├── router/
│   ├── layouts/
│   └── providers/
├── components/
│   ├── ui/
│   ├── story/
│   ├── character/
│   ├── progression/
│   └── learning/
├── pages/
│   ├── home/
│   ├── story/
│   ├── character/
│   ├── game/
│   ├── progress/
│   └── parent/
├── game-runtime/
│   ├── PhaserGameHost.tsx
│   ├── scenes/
│   ├── systems/
│   └── adapters/
├── domain/
│   ├── character/
│   ├── story/
│   ├── game/
│   ├── learner/
│   └── progression/
├── engines/
│   ├── story/
│   ├── game/
│   ├── learning/
│   └── audio/
├── content/
│   ├── loaders/
│   ├── validators/
│   └── schemas/
├── services/
├── assets/
└── utils/
```

## 14. 推荐依赖方向

基础：

- React
- TypeScript
- Vite
- React Router

游戏：

- Phaser 3

验证：

- Zod

测试：

- Vitest
- React Testing Library
- Playwright

代码质量：

- ESLint
- Prettier

具体库版本在真正初始化项目时统一锁定，不在产品文档中长期写死版本号。

## 15. 不建议

### 不建议：纯 Phaser

原因：家长中心、报告、课程、汉字详情、内容管理会变得笨重。

### 不建议：纯 DOM + CSS 游戏

简单拖拽可以，但随着粒子、场景、角色、复杂动画增加，会重复制造游戏基础设施。

### 不建议：React + 大量 Canvas 自研游戏引擎

会让 Bunny 变成“自己造游戏引擎”的项目，增加研发成本。

### 不建议：把学习逻辑写进页面组件

页面只能展示和触发动作，不能直接决定 mastery、升级、复习和推荐结果。

## 16. 最终责任边界

```text
React
  = 产品 UI / 页面 / 内容展示

Phaser
  = 游戏表现 / 游戏交互

StoryEngine
  = 绘本播放与交互

AudioEngine
  = 声音、TTS、ASR适配

LearningEngine
  = 学习状态、Mastery、复习

ProgressionEngine
  = Level、能力、晋级

Content DSL
  = 内容数据

AI Planner
  = 下一步学习内容推荐
```

这个边界必须在开始开发前固定，否则项目很容易在后期演变成“页面、游戏和学习逻辑全部互相调用”的不可维护结构。
