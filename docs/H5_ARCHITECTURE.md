# Bunny H5 产品与技术架构

## 1. 总体架构

```text
                         Bunny H5 / Pad
                              │
               React + TypeScript + Vite
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   Story UI              Learning UI          Game Host
        │                     │                     │
   Story Engine          Learning Engine       Phaser 3
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                  ┌───────────┼───────────┐
                  │           │           │
            Content Model  Learner Model  AI Planner
                  │           │           │
                  └───────────┼───────────┘
                              │
                         Content APIs
```

## 2. 前端技术选型

正式推荐：

- **React + TypeScript**：产品 UI、页面、学习系统、绘本界面、家长中心
- **Vite**：开发与构建工具
- **Phaser 3**：小游戏、Canvas 场景、角色互动、粒子和复杂触控交互
- **DOM/CSS/SVG**：绘本文本、汉字详情、成长系统、课程和报告
- **Web Audio API + AudioEngine**：声音与音频编排
- **TTS/ASR Provider Adapter**：语音能力抽象
- **Zod**：Content DSL、Game DSL、API 数据校验
- **Vitest + React Testing Library + Playwright**：单元、组件、端到端测试

详细选型见 [`FRONTEND_TECH_STACK.md`](./FRONTEND_TECH_STACK.md)。

## 3. React / Phaser 边界

Bunny 不是纯游戏，因此不能把所有页面做成 Phaser Canvas。

### React 负责

- 首页/世界地图
- 绘本目录
- 绘本阅读 UI
- 汉字详情与字源故事
- 汉字博物馆
- 学习等级与成长树
- 每日学习计划
- 学习报告
- 家长中心
- 设置
- 内容驱动组件

### Phaser 负责

- 找字
- 钓鱼
- 拖拽配对
- 迷宫
- 消消乐
- 场景探索
- 角色移动
- 粒子效果
- 连击
- 高交互 Canvas 游戏

### 原则

```text
React = Product / Learning UI
Phaser = Game Runtime
LearningEngine = Learning Truth
Content DSL = Content Truth
```

游戏不能直接修改长期学习状态。

## 4. 核心 Runtime

### GameEngine

负责：

- 加载游戏 DSL
- 校验配置
- 状态机
- 输入
- 胜负条件
- 动画触发
- 奖励结果
- 埋点

### StoryEngine

负责：

- 页面加载
- 文本高亮
- 逐句/逐词音频同步
- 交互节点
- 页面状态
- 角色对白
- 跟读流程

### AudioEngine

负责：

- TTS/预录音频
- 音效
- 背景音乐
- 播放队列
- 暂停/继续
- 音量/静音
- 句子时间轴

### LearningEngine

负责：

- 学习状态
- Character Mastery
- Skill Profile
- 复习队列
- 学习事件
- 推荐输入

### ProgressionEngine

负责：

- Bunny Level
- 阶段解锁
- 能力成长
- 升级条件
- 奖励条件

## 5. 前端目录建议

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
│   └── adapters/
├── domain/
├── engines/
│   ├── story/
│   ├── game/
│   ├── learning/
│   ├── progression/
│   └── audio/
├── content/
│   ├── loaders/
│   ├── schemas/
│   └── validators/
├── services/
├── assets/
└── utils/
```

## 6. 内容与程序解耦

程序不写死：

- 汉字列表
- 绘本页面
- 生字提示
- 游戏题目
- 奖励数值
- 音频路径
- 等级晋级规则

这些内容进入 Content DSL / Content API。

## 7. 游戏运行模型

```text
load game config
 -> validate
 -> preload assets
 -> create Phaser scene
 -> bind interactions
 -> run state machine
 -> emit learning events
 -> calculate result
 -> LearningEngine update
 -> ProgressionEngine update
 -> reward
 -> next content
```

## 8. 绘本运行模型

```text
load story
 -> validate Story DSL
 -> render page
 -> Bunny narration
 -> highlight sentence/word
 -> child interaction
 -> optional character explanation
 -> read-aloud mode
 -> comprehension task
 -> emit reading events
 -> update learner
 -> next page
```

## 9. 事件模型

统一事件：

```text
SESSION_START
STORY_OPEN
PAGE_VIEW
CHARACTER_EXPOSED
CHARACTER_CLICKED
CHARACTER_EXPLANATION_OPEN
AUDIO_PLAY
READ_START
READ_RESULT
GAME_START
GAME_RESULT
REVIEW_START
REVIEW_RESULT
SKILL_UPDATED
LEVEL_UP
CONTENT_COMPLETE
REWARD_GRANTED
```

每个事件至少包含：

- userId/sessionId
- contentId
- timestamp
- eventType
- context
- result

## 10. Pad / H5 性能要求

- 首屏优先保证快速可交互
- 音频尽快开始
- 图片按需加载
- 游戏资源按场景加载
- 绘本不一次性加载全书大资源
- 不阻塞主线程执行大量学习计算
- 大动画和游戏场景控制对象数量
- 长时间学习后避免持续内存增长
- 弱设备必须有降级策略

## 11. 离线与弱网

可缓存：

- 已阅读绘本
- 常用音频
- 游戏资源
- 汉字基础数据
- 最近学习计划

网络恢复后再上传学习事件。

## 12. 安全与儿童隐私

儿童产品必须尽量减少采集。

语音识别、账号、设备信息和家长数据要按上线地区法规及平台要求单独设计数据治理、同意机制、删除机制和保留期限。
