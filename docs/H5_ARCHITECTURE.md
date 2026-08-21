# Bunny H5 产品与技术架构

## 1. 总体架构

```text
                         Bunny H5
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   Story Engine        Game Engine       Learning UI
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                      Learning Engine
                            │
             ┌──────────────┼──────────────┐
             │              │              │
        Content Model   Learner Model   AI Planner
             │              │              │
             └──────────────┼──────────────┘
                            │
                       Content APIs
```

## 2. 前端建议

推荐：

- React
- TypeScript
- Vite
- Phaser 3：互动小游戏/Canvas 场景
- DOM/CSS：绘本文本、导航、管理界面
- Web Audio API：音效与音频控制
- Web Speech / 第三方 ASR/TTS：按实际兼容性与供应商方案接入

不要求所有页面都使用 Canvas。

原则：

- 阅读文本优先 DOM，保证可访问、可缩放、可选中和响应式布局
- 强交互游戏使用 Phaser
- 动画与场景尽量数据驱动

## 3. 核心 Runtime

### GameEngine

负责：

- 加载游戏 DSL
- 状态机
- 输入
- 胜负条件
- 动画触发
- 奖励
- 埋点

### StoryEngine

负责：

- 页面加载
- 文本高亮
- 音频同步
- 交互节点
- 页面状态
- 角色对白

### AudioEngine

负责：

- TTS/预录音频
- 音效
- 背景音乐
- 播放队列
- 暂停/继续
- 音量/静音

### LearningEngine

负责：

- 学习状态
- mastery update
- 复习队列
- 学习事件
- 推荐输入

## 4. 前端目录建议

```text
src/
├── app/
├── core/
│   ├── game/
│   ├── story/
│   ├── audio/
│   └── analytics/
├── learning/
├── characters/
├── stories/
├── games/
├── content/
├── components/
├── pages/
└── services/
```

## 5. 内容与程序解耦

程序不写死：

- 汉字列表
- 绘本页面
- 游戏题目
- 奖励数值
- 音频路径

上述内容进入 Content DSL/Content API。

## 6. 游戏运行模型

```text
load game config
 -> validate
 -> preload assets
 -> create scene
 -> bind interactions
 -> run state machine
 -> emit learning events
 -> calculate result
 -> update learner
 -> reward
 -> next content
```

## 7. 事件模型

统一事件：

```text
SESSION_START
STORY_OPEN
PAGE_VIEW
CHARACTER_EXPOSED
CHARACTER_CLICKED
AUDIO_PLAY
READ_START
READ_RESULT
GAME_START
GAME_RESULT
REVIEW_START
REVIEW_RESULT
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

## 8. 性能要求

儿童 H5 优先保证：

- 首屏快
- 音频可快速开始
- 大图按需加载
- 游戏资源分场景加载
- 避免一次性加载整套绘本/游戏资源
- 低端移动设备不出现明显卡顿

## 9. 离线与弱网

可缓存：

- 已阅读绘本
- 常用音频
- 游戏资源
- 汉字基础数据

网络恢复后再上传学习事件。

## 10. 安全与儿童隐私

儿童产品必须尽量减少采集。

语音识别、账号、设备信息和家长数据要按上线地区法规及平台要求单独设计数据治理、同意机制、删除机制和保留期限。
