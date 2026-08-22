# Bunny 原型资产索引

本目录用于 Pad/学习机优先的产品原型与交互规范。所有 SVG 都是 **Open Design 风格**（1366×1024、奶油→桃→天空蓝渐变背景、白色半透明顶栏、Bunny 🐰 + 圆形头像、Bunny 品牌色板），并已通过 Open Design 0.20.1 daemon 校验（`bunny-app` 项目 · `lint` 0 findings at p0/p1/p2）。

## 已提交的核心资产

| 文件 | 用途 | Open Design artifact path |
|---|---|---|
| `BUNNY_UI_PROTOTYPE.svg` | 第一版核心 UI 总览（6 屏抽样） | `prototypes/bunny-ui-overview.svg` |
| `PAD_PROGRESS_PROTOTYPE.svg` | Pad 横屏进阶原型（6 屏抽样） | `prototypes/pad-progress-overview.svg` |
| `DAILY_PLAN_PROTOTYPE.svg` | **Open Design 每日学习计划原型**（Panel 07 完整版） | `prototypes/panel-07-daily-plan.svg` |
| `LEVEL_PROGRESSION_PROTOTYPE.svg` | **Open Design 学习等级 / 进阶目标原型**（Panel 05 + 11 合并版） | `prototypes/panel-05-11-level.svg` |
| `READ_ALONG_PROTOTYPE.svg` | **Open Design AI 跟读评分原型**（Panel 08 完整版） | `prototypes/panel-08-ai-readalong.svg` |
| `BADGES_PROTOTYPE.svg` | **Open Design 勋章 / 收藏原型**（Panel 10 完整版） | `prototypes/panel-10-badges.svg` |
| `CURRICULUM_PROTOTYPE.svg` | **Open Design 课程映射原型**（Panel 12 完整版 · 人教版 1-2 年级） | `prototypes/panel-12-curriculum.svg` |
| `panel-08-readalong.html` | Panel 08 的 Open Design HTML entry（可导出 standalone HTML） | `prototypes/panel-08-readalong.html` |
| **3-6 岁专属原型（8 屏）** | 见下方"3-6 岁 × 3000 字子集" | — |
| `KIDS_3_6_RESEARCH.md` | 3-6 岁适配调研 + 3000 字架构与适龄衔接分析 | — |
| `README.md` | 原型使用说明、页面清单、视觉/交互原则 | — |
| `../prototype.png` (1536×1024) | **当前视觉基准**：12 屏全功能 UI 视觉稿。是 MiniMax / 内容生成 prompts 的视觉锚点 | — |
| `../STYLE_GUIDE.md` | 从 `prototype.png` 提取的色板 / 字体 / 角色规范 — 生成内容 (插画 + UI) 的执行依据 | — |

## 当前面板清单（prototype.png）

| # | 面板 | 对应运行时 | 状态 | Open Design artifact |
|---|---|---|---|---|
| 01 | 首页 / Bunny 世界地图 | `HomePage` | ✅ 已实现 | `bunny-ui-overview.svg` (1) |
| 02 | 绘本陪读 / 互动阅读主界面 | `StoryBookPage` | ✅ 已实现 | (1) |
| 03 | 汉字详情页 / 字源故事 + 进阶信息 | `CharacterMuseumPage` | ✅ 已实现 | (1) |
| 04 | 识字游戏 / 找一找 | `GamePage` (G01) | ✅ 已实现 | (1) |
| 05 | 学习等级 / 进阶体系 | `LevelPage` | ✅ Open Design 原型 + 代码 | `panel-05-11-level.svg` |
| 06 | 学习路径 / 能力成长树 | `LevelPage` (含长梯) | ✅ 与 05 合并 | (panel-05-11-level.svg) |
| 07 | 每日学习计划 / 个性化推荐 | `DailyPlanPage` | ✅ Open Design 原型 + 代码 | `panel-07-daily-plan.svg` |
| 08 | AI 跟读评分 / 语音评测 | `ReadAlongPage` | ✅ **新增** Open Design 原型 + 代码 | `panel-08-ai-readalong.svg` |
| 09 | 学习报告 / 成长总览（家长视图） | `ParentReportPage` | ✅ 已实现 | `bunny-ui-overview.svg` (1) |
| 10 | 奖励系统 / 勋章与收藏 | `BadgesPage` | ✅ **新增** Open Design 原型 + 代码 | `panel-10-badges.svg` |
| 11 | 进阶目标 / 学习里程碑 | `LevelPage` (里程碑卡) | ✅ 合并入 05 | `panel-05-11-level.svg` |
| 12 | 内容体系 / 人教版 1-2 年级课程映射 | `CurriculumPage` | ✅ **新增** Open Design 原型 + 代码 | `panel-12-curriculum.svg` |

(1) `bunny-ui-overview.svg` 是多屏总览，包含 01 / 02 / 03 / 04 / 09 五屏。

## 3-6 岁 × 3000 字子集（新增）

> 把 Bunny 下沉到 3-6 岁适龄的同时，保持对 3000 字长期目标的可视化。
> 单次只学 3-5 字，但通过"字花园全景（10 岛 × 300 字）+ 字时光机（3 / 6 / 9 / 12 岁四阶段）"
> 把 3000 字的长期累积骨架显式建模进来。

| 屏 | 文件 | 用途 | Open Design artifact |
|---|---|---|---|
| 总览 | `panel-3-6-overview.html` | 8 屏总览 + 3000 字架构图（HTML 入口） | `prototypes/panel-3-6-overview.html` |
| 总览 | `panel-3-6-overview.svg` | 6 屏总览 SVG（视觉稿） | `prototypes/panel-3-6-overview.svg` |
| 01 | `panel-3-6-01-home.svg` | 首页 · 4 大岛 + Bunny 中央 + "47/3000" 顶栏 | `prototypes/panel-3-6-01-home.svg` |
| 02 | `panel-3-6-02-story.svg` | 绘本陪读 · Bunny 讲故事 + 大麦克风 | `prototypes/panel-3-6-02-story.svg` |
| 03 | `panel-3-6-03-characters.svg` | 汉字花园 · 拟人字方块 + 图示 + "家岛还剩 253 字" | `prototypes/panel-3-6-03-characters.svg` |
| 04 | `panel-3-6-04-game.svg` | 玩游戏 · 找一找 + 3 字按钮 + 永不负面反馈 | `prototypes/panel-3-6-04-game.svg` |
| 05 | `panel-3-6-05-badges.svg` | 我的小屋 · 拟人小屋 + 勋章 + 字花园入口 | `prototypes/panel-3-6-05-badges.svg` |
| 06 | `panel-3-6-06-readalong.svg` | 跟 Bunny 读 · 大麦克风 + 鼓励优先 | `prototypes/panel-3-6-06-readalong.svg` |
| 07 | `panel-3-6-07-garden-map.svg` | **字花园全景** · 10 主题岛 × 300 字 = 3000 字 | `prototypes/panel-3-6-07-garden-map.svg` |
| 08 | `panel-3-6-08-evolution.svg` | **字时光机** · 3 / 6 / 9 / 12 岁四阶段 | `prototypes/panel-3-6-08-evolution.svg` |

### 3-6 岁适配的核心张力

- **单次只学 3-5 字**，5-10 分钟一关（3-6 岁的认知极限）；
- **但 3000 字是长期目标**，不能因为每次只学一点点就让孩子看不到"远方"。
- 解法：**字花园（10 主题岛 × 300 字）+ 字时光机（4 年龄段）** 让"远方"始终可见，但永远只走"眼前这一步"。

### 3-6 岁专属基线（与原 6-9 岁版差异）

| 维度 | 6-9 岁原版 | 3-6 岁新版 |
|---|---|---|
| 主 CTA | ≥ 56 px | **≥ 120 px** |
| 触控目标 | ≥ 56 px | **≥ 88 px** |
| 屏幕汉字 | 多行、可读 | ≤ 20 字 / ≤ 2 行 |
| 图标 | 中性 | **拟人化（圆眼睛 + 腮红）** |
| 进度 | Lv.x / 百分比 | **"种下 47 棵苗" / "找到 5 颗星"** |
| 跟读反馈 | 流利度/完整度/发音 | **仅 Bunny 鼓励短句** |
| 失败反馈 | 引导再试 | **隐藏"错"= "Bunny 没听清"** |
| 3000 字语境 | 课程表 | **字花园 10 岛 + 字时光机 4 阶段** |

详见 `KIDS_3_6_RESEARCH.md` 与 `panel-3-6-overview.html`。

## Open Design 集成（CLI 驱动）

### 接入条件
- macOS sandbox 允许写 `/Applications/Open Design.app/Contents/Resources/app/node_modules/better-sqlite3/build/Release/better_sqlite3.node`
- Open Design daemon 在 127.0.0.1:7456 监听（`nohup "$OD_NODE_BIN" "$OD_BIN" --no-open --port 7456 &`）
- 环境变量：`OD_NODE_BIN=$(which node)`、`OD_BIN=/Applications/Open\ Design.app/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs`、`OD_DAEMON_URL=http://127.0.0.1:7456`

### 项目
- `bunny-app` · id: `bunny-app` · 创建于 2026-08-22

### Memory 注入
- `user_profile` — Bunny 视觉 / 课程 / 反 slop 基线
- `rule_bunny_palette` — 必须用 Bunny brand palette（不能默认 Human/approachable 灰绿）
- `rule_bunny_mascot` — Bunny 必须是白兔：圆胖 1.5 头身、白+粉内耳+红书包+长垂耳+腮红椭圆+黑圆点眼
- `rule_pad_landscape_touch` — 1366×1024 横屏、6-tab 底栏、触摸目标 ≥ 56px

### 自动化
- `routine-5c8d34f2-...` · daily 09:00 UTC · "Bunny daily lint" — `od lint` 全 SVG 反 slop 巡检

### CLI 验证命令
```bash
od tools directions --label "Human / approachable — Airbnb / Duolingo systems" --json
od artifacts list                                                              # (—)
curl -s http://127.0.0.1:7456/api/projects | jq .
curl -s http://127.0.0.1:7456/api/projects/bunny-app/files | jq .
od lint prototypes/panel-08-readalong.html --json --fail-on none
od memory profile show
od memory rule list
```

### 已知限制
- `od export --format image/pdf/pptx` 需要 Open Design 桌面 Chromium，CLI sandbox 拿不到；HTML export headless 可用但要求 artifact 是 `.html` entry。PNG/PDF 导出请打开 Open Design.app 后从 GUI 操作。

## 原型设计原则

1. Pad 横屏优先，核心操作区适配儿童触控距离。
2. 单屏一个主任务，避免信息过载。
3. 绘本陪读是主学习路径，不把游戏和题库作为首页中心。
4. 汉字学习同时提供字形、音、词、字源故事和生活/绘本语境。
5. Bunny Level 与识字掌握度、阅读能力、表达能力、书写能力解耦。
6. AI 根据孩子近期表现生成每日学习计划，而不是固定刷题序列。
7. 失败不阻断故事，鼓励式反馈优先，不设计儿童之间的公开排行榜。
8. 家长区与儿童区隔离，儿童学习页面不暴露复杂数据和控制项。

## 视觉锚点 → 内容生成

`prototype.png` 不是装饰性参考图，而是 `tools/build-art-minimax.mjs`
中所有 prompts 的视觉锚点。每次新增插画 prompt，必须保证：

- **角色一致性**：白色 Bunny，粉色内耳，红色小书包 / 红领，长垂耳；
- **色板一致**：奶油 / 桃色背景 + 薄荷 / 浅蓝 / 黄油黄 / 淡紫 / 柔粉点
  缀，红橙色作为主 CTA；
- **UI 形态一致**：圆角卡片、柔和投影、大号圆角按钮、世界地图岛屿式
  导航；
- **风格一致**：picture-book 风格的童趣 3D 渲染，而非 2D 矢量描线。

具体色值与排版规范见 `../STYLE_GUIDE.md`。