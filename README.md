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
- [Visual Style Guide（视觉规范）](docs/STYLE_GUIDE.md) — 从 [`docs/prototype.png`](docs/prototype.png) (1536×1024，12 屏全功能 UI 视觉稿) 提取的色板 / 角色规范，是所有插画 + UI 的执行依据
- [原型资产索引](docs/prototypes/PROTOTYPE_ASSET_INDEX.md)
- [3-6 岁 × 3000 字专属原型 + 调研](docs/prototypes/KIDS_3_6_RESEARCH.md) — 8 屏适龄分支 + 字花园 10 岛 + 字时光机

这份文档是产品、内容、AI、Pad、游戏引擎和开发路线的最高层规划。后续新增局部设计时，必须与该文档保持一致。视觉风格任何调整先在 [`docs/prototype.png`](docs/prototype.png) 上画出，再同步到 [`docs/STYLE_GUIDE.md`](docs/STYLE_GUIDE.md)，最后重跑 `npm run art:force`。

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

## 内容生产管线 (Content Pipeline)

当前仓库已搭好 Bunny 内容生产管线的第一批骨架：汉字 + 绘本 + 音频 + 图片都按"等级 / 类目"分目录存储，运行时按 id 查表。

### 内容分层 (Content Layout)

```text
content/
├── l0/                            # 学前 / 入门 (Level 0 shared)
│   ├── welcome.cjs                # Bunny 问候 (3 cues)
│   ├── praise.cjs                 # 鼓励 + 表扬 (8 cues, 永不负面)
│   ├── worlds.cjs                 # 世界地图导航 (6 cues)
│   └── reading-along.cjs          # 跟我一起读 prompt (4 cues)
│
└── l1/                            # 一年级基础 (Level 1 first-grade core)
    ├── characters/
    │   ├── tier-a.js              # 14 个 Tier-A 象形字
    │   ├── tier-b.js              #  5 个 Tier-B 会意 / 形声字
    │   └── index.js               # 聚合 + CHARACTERS / CHARACTERS_BY_ID
    │
    ├── museum/
    │   ├── tier-a.cjs             # 14 段象形字来历短解
    │   └── tier-b.cjs             #  5 段会意 / 形声字来历短解
    │
    └── stories/
        ├── book-xiao-tu-de-jia.cjs          # 《小兔的家》 (5 pages)
        ├── book-tai-yang-he-yue-liang.cjs    # 《太阳和月亮》 (4 pages)
        ├── book-sen-lin-li-de-yi-tian.cjs    # 《森林里的一天》 (4 pages)
        └── index.cjs                         # 聚合
```

### 资产布局 (Asset Layout)

```text
assets/
├── art/
│   ├── l0/                        # 学前共享插画
│   │   ├── bunny/                 #   主角 Bunny 的 6 个姿势
│   │   ├── companions/            #   5 个森林 / 池塘朋友
│   │   ├── ui/                    #   5 个 UI 装饰 (book / scroll / star / lock / gift)
│   │   ├── badges/                #   6 个世界地图徽章
│   │   └── backgrounds/           #   4 张全幅背景
│   │
│   ├── l1/                        # 一年级核心插画
│   │   ├── tier-a/                #   11 张象形字参考图 (picto-*)
│   │   ├── tier-b/                #    4 张会意字合成图 (picto-*)
│   │   └── stories/               #    3 张绘本封面 (cover-*)
│   │
│   └── .raw/                      # 生成器原始输出 (gitignored)
│
└── audio/                         # 当前先存放静音占位 mp3
    ├── l0/
    │   ├── welcome/               #   3 段问候
    │   ├── praise/                #   8 段鼓励 / 表扬
    │   ├── worlds/                #   6 段世界导航
    │   └── reading/               #   4 段跟读提示
    │
    └── l1/
        ├── tier-a/                #  14 字 × 3 段 (单句 + 揭示 + 词语) = 42
        ├── tier-b/                #   5 字 × 2 段 (单句 + 揭示) = 10
        └── stories/               #  13 段绘本分页旁白
```

总计 86 条音频 cue + 44 张插画；磁盘布局和 `content/` 完全镜像，方便按层删除 / 重生成。

### Skills 目录 (`.claude/skills/`)

```text
.claude/skills/
├── lib/
│   ├── minimax-api.sh             # MiniMax HTTP + auth 共享代码
│   └── tencent-api.sh             # 腾讯云 TC3-HMAC-SHA256 共享代码
│
├── minimax-image/                 # 一次性 MiniMax 文生图
│   ├── SKILL.md
│   └── bin/image.sh               # bash skill
│
├── minimax-tts/                   # 一次性 MiniMax TTS (lovely_girl)
│   ├── SKILL.md
│   └── bin/tts.sh
│
└── tencent-tts/                   # 一次性 腾讯云 TTS (智童 女童声, 默认)
    ├── SKILL.md
    └── bin/tencent-tts.sh
```

每个 skill 都可以直接 `bash .claude/skills/<name>/bin/<script>.sh --prompt ...` 单独调用；也由 `tools/build-art-minimax.mjs` / `tools/build-audio-minimax.mjs` / `tools/build-audio-tencent.mjs` 批量调度。

### Content Builders (`tools/`)

| 脚本 | 作用 |
|---|---|
| `tools/cue-manifest.mjs` | 聚合所有内容层，输出统一的 cue 清单（86 条）+ 校验 id 唯一性 / 故事→cue 引用闭合 |
| `tools/build-art-minimax.mjs` | 按 `ART[]` 调 `minimax-image` skill 生图 → chroma-key cutout → 写盘 |
| `tools/build-audio-minimax.mjs` | 按 manifest 调 `minimax-tts` 一次性接口合成 mp3（lovely_girl 默认） |
| `tools/build-audio-tencent.mjs` | 按 manifest 调腾讯云 `TextToVoice`（智童 101016 默认，**Bunny 项目首选**） |
| `tools/make-placeholders.mjs` | 给每条 cue 写一段静音 mp3 占位，让游戏不带 API key 也能跑 |
| `tools/cutout.mjs` + `cutout.py` | 边缘 flood-fill 抠绿幕背景，PIL/numpy 实现 |
| `tools/resize-png.mjs` + `resize-png.py` | 等比 resize，PIL 实现 |

### Quick start

```bash
# 1. 安装 python 依赖 (PIL + numpy)
pip3 install pillow numpy

# 2. 准备账号 (任选一种 TTS 提供方即可启动)
cp .env.example .env
#   编辑 .env 填入 MINIMAX_API_KEY 和 / 或 TENCENT_SECRET_ID / SECRET_KEY

# 3. 让游戏在没有任何真音频的情况下也能启动
npm run audio:placeholders          # 86 段静音 mp3 写入 assets/audio/

# 4. 生成图片 (需要 MINIMAX_API_KEY)
npm run art:list                    # 看当前会生成哪些资产
npm run art:make                    # 只生成缺失的
npm run art:force                   # 强制重生成所有

# 5. 生成音频 (默认走腾讯云智童)
npm run audio:tencent:dry           # 看会生成哪些音频
npm run audio:tencent               # 生成所有缺失的音频

#   或者用 MiniMax:
npm run audio:minimax:dry
npm run audio:minimax
```

### 内容层级与等级映射

| 等级 | 字数 / 课 | 内容目录 | 音频目录 | 插画目录 |
|---|---|---|---|---|
| L0 学前 / 入门 | 0–100 | `content/l0/` | `assets/audio/l0/` | `assets/art/l0/` |
| L1 一年级基础 | 101–300 | `content/l1/` | `assets/audio/l1/` | `assets/art/l1/` |
| L2–L8 长期进阶 | 301–3000 | (后续按 `content/l<level>/` 镜像添加) | 同 | 同 |

每个新等级接入时只需要：
1. 新建 `content/l<level>/{characters, museum, stories}/`，按现有 tier-a / tier-b 模板写；
2. 在 `tools/cue-manifest.mjs` 的对应 `push` 段里加一行；
3. 在 `tools/build-art-minimax.mjs` 的 `ART[]` 里加新层；
4. 在 `.env.example` 加对应 provider 的可选 env。

`cue-manifest.mjs` 会在 build 时强制校验：
* 所有 cue id 满足 `^[a-z0-9][a-z0-9-]*$`；
* 同一 id 只能对应一个文本（防止后写者覆盖先写者）；
* 每个故事的 `page.audioId` 必须在 manifest 里存在 — 加了页没加旁白直接 build 失败。

### Provider 选择

| 用途 | 推荐 | 原因 |
|---|---|---|
| 一次性 / 调试 | `minimax-image` + `minimax-tts` | 速度快，lovely_girl 适合 quick test |
| 儿童生产旁白（默认） | `tencent-tts` (智童 101016) | 真童声（F0 ~348 Hz），不像成人扮小孩 |
| 任何生图 | `minimax-image` | 当前没有第二个 provider |

切换默认只需：

```bash
# 用腾讯云智童覆盖全部 86 条 mp3
npm run audio:tencent

# 只想补一条
npm run audio:tencent:only bunny-welcome-1,story-xiao-tu-de-jia-p3
```

### 为什么切分成 "等级 + 子目录"

* 删除一个等级就把它的 `content/l<n>` 和 `assets/{art,audio}/l<n>` 一起删，不会误删其他等级；
* `tools/cue-manifest.mjs` 的 `--dry-run` 输出能直接告诉内容团队"l1/tier-a 还差多少段"；
* `tools/build-audio-tencent.mjs` 的进度条按 level/subdir 分组（欢迎、表扬、汉字、绘本各自分开），便于在大批量（数千段）时定位卡点；
* 后续接 H5 运行时（`docs/H5_ARCHITECTURE.md`）后，运行时只需 `assets/audio/<level>/<subdir>/<id>.mp3` 一条规则就能找到任何 cue，不需要按内容类型分多张映射表。

### 当前进度 (Phase 1 MVP)

| 资产 | 数量 | 状态 |
|---|---:|---|
| Tier-A 象形字角色 | 14 | 内容就绪，等待 MiniMax 生成图 + 腾讯云合成音 |
| Tier-B 会意字角色 | 5 | 内容就绪，等待 |
| 绘本 | 3 | 13 页旁白就绪，封面需生成 |
| 主角 Bunny 姿势 | 6 | 提示词就绪，等待生成 |
| 陪伴角色 | 5 | 提示词就绪 |
| UI 装饰 + 世界徽章 | 11 | 提示词就绪 |
| 全幅背景 | 4 | 提示词就绪 |
| **音频 cue 总数** | **86** | 静音占位已生成，真声需 `npm run audio:tencent` |
| **插画总数** | **44** | 0 已生成，需 `npm run art:make` |

下一步：

1. 接入 MiniMax / 腾讯云账号生成第一批真素材；
2. 把 14 个 Tier-A 象形字扩展到 L1 全量（约 100 字），加 L2 第一批会意字；
3. 把 README + manifest 的错误信息本地化为中文，方便内容团队接手。
