# Bunny

Bunny 是一个面向儿童的中文 AI 阅读与教育游戏平台，长期目标不是只覆盖小学 1-2 年级，而是建立一套可持续扩展到约 **3000 个汉字**的中文学习与阅读体系。

核心理念：

> 以统编/人教版语文知识体系为课程底座，以互动绘本为学习主线，以汉字来历与故事增强记忆，以教育游戏推动探索，以 AI 陪读和个性化学习形成长期阅读能力。

Bunny 的长期产品形态：

```text
                 Bunny
                   |
      +------------+------------+
      |            |            |
     汉字         绘本         游戏
      |            |            |
   字源/词语     陪读/跟读     探索/解谜
      |            |            |
      +------------+------------+
                   |
             Learning Runtime
                   |
         识字 / 阅读 / 表达 / 书写
                   |
              AI 个性化
                   |
              3000字体系
```

## 第一入口：全局规划

- [Bunny Global Product Master Plan](docs/MASTER_PLAN.md)

这份文档是产品、内容、AI、Pad、游戏引擎和开发路线的最高层规划。后续新增局部设计时，必须与该文档保持一致。

## 产品与学习体系

- [产品总览](docs/PRODUCT_OVERVIEW.md)
- [课程与内容体系](docs/CURRICULUM.md)
- [3000 汉字内容规模规划](docs/CHARACTER_CONTENT_SCALE.md)
- [汉字学习体系](docs/CHARACTER_SYSTEM.md)
- [互动绘本与 AI 陪读](docs/READING_SYSTEM.md)
- [游戏体系](docs/GAME_SYSTEM.md)
- [AI 与个性化学习](docs/AI_LEARNING_SYSTEM.md)
- [进阶与等级体系](docs/PROGRESSION_SYSTEM.md)
- [用户完整学习旅程](docs/USER_JOURNEY.md)

## Pad 与原型

- [Pad 产品规格](docs/PAD_PRODUCT_SPEC.md)
- [Pad 进阶原型](docs/prototypes/PAD_PROGRESS_PROTOTYPE.svg)
- [核心 UI 原型](docs/prototypes/BUNNY_UI_PROTOTYPE.svg)
- [原型资产索引](docs/prototypes/PROTOTYPE_ASSET_INDEX.md)

## 技术与引擎

- [H5 产品与技术架构](docs/H5_ARCHITECTURE.md)
- [前端技术栈](docs/FRONTEND_TECH_STACK.md)
- [内容 DSL 与数据模型](docs/CONTENT_DSL.md)
- [内容质量与 QA](docs/CONTENT_QA.md)
- [MVP 与版本路线图](docs/ROADMAP.md)

## 开发原则

1. 绘本是学习主线，游戏是学习机制，不把产品做成刷题工具。
2. 教材知识决定“学什么”，AI 决定“现在学什么”，故事决定“为什么学”，游戏决定“怎么学”。
3. 同一个汉字必须跨图片、声音、字源故事、词语、绘本、游戏和复习反复出现。
4. 内容配置驱动、运行时驱动，禁止一个游戏一个硬编码页面。
5. Bunny 应被实现为“教育游戏引擎 + Learning Runtime + Content Platform”，而不是简单 H5 页面集合。
6. AI 可以生成候选内容，但教材映射、字源事实和发布内容必须经过结构化校验。
7. 儿童产品优先保证低认知负荷、即时反馈、可恢复、可探索和正向鼓励。
8. 3000 汉字是长期产品容量目标，1-2 年级只是首个核心课程阶段。
9. Pad 横屏是首发体验基准；手机和桌面适配不能破坏 Pad 的交互模型。
