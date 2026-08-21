# Bunny Global Product Master Plan

## 0. Product definition

Bunny is a long-term Chinese literacy, reading, and children's educational game platform for Pad/learning-tablet devices.

The long-term content target is approximately **3,000 Chinese characters**. Grade 1–2 Mandarin curriculum is the first major curriculum stage, not the product ceiling.

Core proposition:

> Let children learn Chinese by entering stories, discovering characters, playing missions, reading with Bunny, understanding why characters look the way they do, and gradually becoming independent readers.

Bunny is therefore not only an H5 app and not only a game. The long-term technical/product abstraction is:

**Bunny Educational Game Engine + Learning Runtime + Content Platform.**

---

## 1. Global product architecture

```text
                                   Bunny
                                     |
             +-----------------------+-----------------------+
             |                       |                       |
        Curriculum               Content                 Learner
             |                       |                       |
    textbook mapping          characters / stories       learner model
    grade / stage             games / audio              mastery
    objectives                knowledge graph            abilities
             |                       |                       |
             +-----------------------+-----------------------+
                                     |
                              Learning Runtime
                                     |
          +------------------+------+-------+------------------+
          |                  |              |                  |
      Story Runtime      Game Runtime   Reading Runtime   AI Planner
          |                  |              |                  |
          +------------------+------+-------+------------------+
                                     |
                              Progression Engine
                                     |
                         level / abilities / unlocks
                                     |
                              Bunny World / Pad UI
                                     |
                           Child experience + parent area
```

### Strategic layers

1. **Curriculum layer** — what the child should learn.
2. **Character knowledge layer** — what each Chinese character means and how it connects to other knowledge.
3. **Content layer** — stories, picture books, games, audio, exercises, activities.
4. **Learning layer** — mastery, forgetting, review, reading ability, expression, writing.
5. **Runtime layer** — story engine, game engine, audio engine, reading engine, progression engine.
6. **AI layer** — personalization, recommendation, difficulty, content generation assistance, reading feedback.
7. **Experience layer** — Pad navigation, world map, rewards, parent area.

---

## 2. Long-term learning target

The product should support a child moving approximately through:

```text
启蒙
  -> 一年级
  -> 二年级
  -> 三年级
  -> 中高年级阅读
  -> 自主阅读
  -> 文化/文学阅读
```

The 3,000-character target is a **content and learning-capacity target**, not a requirement that every child must finish all 3,000 characters.

A child should always have a personalized frontier:

```text
already mastered
        |
        +--> review
        |
        +--> reinforce
        |
        +--> current learning
        |
        +--> next best characters
```

---

## 3. 3,000-character content architecture

Every character is a reusable learning node, not a static flashcard.

```text
Character
├── glyph
├── pinyin
├── pronunciation
├── stroke order
├── radical / components
├── character structure
├── origin / etymology evidence
├── child-friendly origin story
├── related characters
├── word families
├── common words
├── example sentences
├── picture references
├── stories / picture books
├── game templates
├── read-aloud tasks
├── writing tasks
├── comprehension tasks
└── mastery state
```

Character relationships should form a graph:

```text
字
  -> 偏旁
  -> 构字关系
  -> 同音/近音关系
  -> 反义/近义关系
  -> 词语
  -> 句子
  -> 绘本
  -> 主题
```

The content system should avoid generating 3,000 completely independent lessons. Reuse and graph relationships are essential for scale.

---

## 4. Curriculum architecture

### Stage A — Grade 1 foundation

Primary emphasis:

- picture-to-word association
- sound-to-word association
- character recognition
- basic words
- simple sentences
- guided reading
- basic handwriting

Typical game mechanics:

- find
- match
- listen and choose
- drag
- exploration
- collect
- simple maze
- simple role play

### Stage B — Grade 2 expansion

Primary emphasis:

- words and phrases
- sentence understanding
- paragraph comprehension
- story sequencing
- simple reasoning
- guided expression
- handwriting accuracy

Game mechanics expand to:

- sequencing
- inference
- reading treasure hunts
- role play
- sentence building
- story continuation
- comprehension missions

### Stage C — Grade 3+ expansion

Increase:

- independent reading
- vocabulary networks
- multi-paragraph stories
- character families
- idioms and allusions
- classical poetry
- informational reading
- expression and retelling

### Stage D — 3,000-character long-term world

The product gradually transitions from “teach me a character” to “help me read and understand Chinese.”

---

## 5. Learning model

Bunny must not use a single score to represent learning.

### Four independent ability dimensions

```text
识字能力
阅读能力
表达能力
书写能力
```

Each dimension has its own progression.

Example:

```text
识字 85
阅读 68
表达 51
书写 43
```

The learner may advance in one dimension while receiving reinforcement in another.

### Character mastery

```text
M0 未接触
M1 见过
M2 能识别
M3 能理解
M4 能在词语/句子中使用
M5 稳定掌握
```

Mastery is updated from learning events, not from completing a lesson alone.

---

## 6. Progression system

Bunny Level represents overall learning journey, while ability scores represent actual competence.

```text
Bunny Level
   |
   +-- unlocks new worlds
   +-- unlocks harder games
   +-- unlocks richer stories
   +-- unlocks new character families
   +-- unlocks new expression tasks
```

Suggested long-term progression:

```text
Lv1  汉字小芽
Lv2  识字学徒
Lv3  故事新手
Lv4  绘本探险家
Lv5  阅读小能手
Lv6  故事探险家
Lv7  汉字侦探
Lv8  阅读探险家
Lv9  小小作家
Lv10 中文阅读家
```

Exact XP thresholds should be data-driven later.

---

## 7. Daily learning loop

The default Pad session should feel like an adventure, not a worksheet.

```text
进入 Bunny
  -> 今日目标
  -> 复习 2~5 个弱字
  -> Bunny 讲绘本
  -> 一起读
  -> 发现新字
  -> 汉字来历故事
  -> 游戏任务
  -> 再读
  -> 自己读 / 角色对读
  -> 一个理解或表达挑战
  -> 奖励
  -> AI 决定下一次复习
```

Typical session target: about 10–20 minutes for younger children; the exact range is configurable.

---

## 8. Picture-book reading system

Reading is the core experience, not an audio add-on.

Four modes:

1. Bunny讲故事
2. 一起读
3. 我自己读
4. 角色对读

Core runtime features:

- sentence-level highlighting
- word/token highlighting
- tap character explanation
- synchronized audio
- pause/replay
- reading progress
- role voices
- optional speech recognition
- simple positive reading feedback
- comprehension checkpoint

The story must remain playable even when the child makes mistakes.

---

## 9. Character origin and story system

Character origin content has two distinct layers:

### Factual layer

- verified glyph history
- known character formation category
- reliable sources and review status

### Child story layer

- 30–90 second visual explanation
- simple language
- animation
- picture association
- one memorable insight

Supported story patterns:

- pictographic characters
- ideographic characters
- phonetic-semantic families
- radicals/components
- character evolution
- idiom/origin stories
- cultural stories

AI-generated explanations must never be treated as authoritative etymology without content review.

---

## 10. Game engine strategy

Bunny should be built as an educational game engine, not as a collection of hard-coded mini-games.

```text
Game DSL
   -> validate
   -> load scene
   -> preload assets
   -> create entities
   -> bind interaction
   -> run state machine
   -> emit learning events
   -> calculate result
   -> update mastery
   -> reward
```

Game templates are reusable. Example templates:

- find character
- listen and choose
- match picture/word
- fishing
- memory
- drag and drop
- maze
- trace writing
- word building
- sentence building
- reading treasure hunt
- role play
- inference puzzle

AI can generate a game configuration, but the runtime executes it deterministically.

---

## 11. Content DSL strategy

The program should not hard-code learning content.

Primary content types:

```text
CharacterDSL
WordDSL
SentenceDSL
StoryDSL
GameDSL
LessonDSL
DailyPlanDSL
ProgressionDSL
```

This allows:

```text
same character
   -> many games
   -> many stories
   -> many review tasks
   -> many progression paths
```

It is a prerequisite for 3,000-character scale.

---

## 12. AI architecture

AI should personalize and assist content operations rather than control the entire runtime.

### AI Planner

Inputs:

- mastered characters
- weak characters
- recent errors
- reading performance
- session time
- grade/stage
- progression level
- content already consumed

Outputs:

- daily plan
- next story
- next game
- review queue
- difficulty adjustment

### AI Content Assistant

Can generate candidate:

- story outlines
- example sentences
- game configurations
- dialogue
- explanations
- review questions

All education content needs validation and approval status.

### AI Reading Assistant

Supports:

- read-aloud feedback
- pronunciation prompts
- pacing prompts
- encouragement
- comprehension questions

---

## 13. Pad-first experience

Target experience: landscape Pad / learning tablet.

Design rules:

- large touch targets
- one primary action per screen
- voice-first interaction where useful
- minimal text-heavy controls
- stable visual hierarchy
- no child-facing leaderboard pressure
- parent area separated from child area
- offline/weak-network support
- audio must start quickly
- resources loaded by scene/content

The child should rarely need to navigate complex menus.

The world map is the main spatial metaphor:

```text
故事王国
汉字博物馆
冒险乐园
汉字探秘局
阅读天空
表达森林
```

---

## 14. Technical architecture

Recommended front-end stack:

```text
React + TypeScript + Vite
        |
        +-- Bunny UI Runtime
        |
        +-- Story Runtime
        |
        +-- Learning Runtime
        |
        +-- Progression Runtime
        |
        +-- Content Runtime
        |
        +-- Phaser 3 Game Runtime
```

React should handle product/application UI, while Phaser handles highly interactive game scenes. The project should expose a Bunny abstraction instead of leaking framework details into content code.

Target internal modules:

```text
BunnyRuntime
GameRuntime
StoryRuntime
ReadingRuntime
AudioRuntime
LearningRuntime
ProgressionRuntime
ContentRuntime
AnalyticsRuntime
```

---

## 15. Data architecture

Core entities:

```text
Learner
Character
Word
Sentence
Story
Game
Lesson
LearningEvent
MasteryRecord
ProgressionState
DailyPlan
Reward
Asset
```

Relationships:

```text
Learner
  -> MasteryRecord -> Character
  -> ProgressionState
  -> LearningEvent
  -> DailyPlan

Character
  -> Word
  -> Sentence
  -> Story
  -> Game
  -> Asset
```

Learning events are the source of evidence for mastery updates.

---

## 16. Content production system

3000 characters require a production pipeline, not manual page-by-page creation.

```text
教材/词表规划
    -> 字符知识审核
    -> Character Master Record
    -> AI候选内容生成
    -> 人工/规则审核
    -> 音频生成/审核
    -> 插画/动画
    -> Story/Game assembly
    -> QA
    -> 发布
```

Each content asset should have status:

```text
DRAFT
AI_GENERATED
REVIEW_REQUIRED
APPROVED
PUBLISHED
DEPRECATED
```

---

## 17. Quality gates

Every character should pass:

### Knowledge QA

- character correctness
- pronunciation correctness
- word correctness
- origin evidence status
- stroke data status

### Education QA

- age suitability
- cognitive load
- learning objective
- difficulty
- review usefulness

### Game QA

- clear objective
- touch accuracy
- no dead ends
- recoverable errors
- completion path

### Reading QA

- text quality
- audio sync
- highlighting sync
- reading difficulty
- comprehension quality

### Child safety / privacy QA

- minimal data collection
- parent controls
- speech-data handling
- retention/deletion rules
- regional compliance review

---

## 18. Product navigation

Child side:

```text
Home
├── 今日冒险
├── 故事王国
├── 汉字博物馆
├── 冒险乐园
├── 汉字探秘局
├── 我的成长
└── 我的收藏
```

Parent side:

```text
学习概览
├── 识字
├── 阅读
├── 表达
├── 书写
├── 学习时长
├── 绘本完成
├── 薄弱字
└── 推荐计划
```

Parent controls must not become visible during normal child play.

---

## 19. Rewards and motivation

Prefer intrinsic progression over score grinding.

Rewards include:

- character collection
- world expansion
- Bunny growth
- story unlocks
- badges
- artifacts
- character museum entries
- exploration discoveries

Avoid making the main learning loop dependent on:

- public leaderboards
- punishment
- failure screens
- excessive streak anxiety

---

## 20. Business and content scalability

The architecture should allow future content packs without changing runtime code.

Potential content packs:

- 人教/统编同步
- 主题绘本
- 动物世界
- 自然科学
- 古诗词
- 成语故事
- 传统文化
- 科普阅读
- 角色冒险

Long-term moat:

```text
3000字知识图谱
      +
大量高质量绘本
      +
教育游戏引擎
      +
Learner Model
      +
AI个性化
      +
Pad体验
```

---

## 21. Product phases

### Phase 0 — Foundation

- product architecture
- design system
- Bunny runtime skeleton
- Character DSL
- Story DSL
- Game DSL
- learner event model

### Phase 1 — MVP

Target:

- Grade 1 content foundation
- first 100 characters
- 10–20 picture books
- 8–10 game templates
- read-aloud core
- character origin core
- basic mastery
- Pad horizontal UI

### Phase 2 — Grade 1 expansion

- 300–600 characters
- larger picture-book set
- multiple game families
- progression levels
- AI daily plan

### Phase 3 — Grade 1–2 system

- approximately 1000–1600 character coverage
- textbook mapping
- richer reading comprehension
- expression tasks
- parent reporting

### Phase 4 — Long-term 3000-character platform

- 3000-character knowledge graph
- 500+ picture books target
- large reusable game library
- advanced reading paths
- literature/culture content
- stronger AI personalization

---

## 22. What must never be changed casually

These are architecture-level decisions:

1. Content must be configuration-driven.
2. Character knowledge must be reusable across stories and games.
3. Learning state must be independent from content completion.
4. Reading is a first-class learning mode.
5. Game runtime must emit learning evidence.
6. Progression must depend on demonstrated ability, not only XP.
7. AI suggestions must be deterministic after generation/approval.
8. Educational facts require review status.
9. Pad child experience must remain simple even as the backend grows complex.
10. The 3,000-character target must not cause a 3,000-page hard-coded application.

---

## 23. North-star metrics

Product quality should eventually be measured by:

- character retention
- reading completion
- read-aloud participation
- independent reading progression
- vocabulary transfer into stories
- comprehension improvement
- repeat learning value
- content reuse efficiency
- session completion without frustration

Avoid optimizing solely for clicks, screen time, or raw game completion.

---

## 24. Final product vision

```text
                     Bunny
                       |
           “让孩子爱上中文阅读”
                       |
      +----------------+----------------+
      |                |                |
    汉字            绘本阅读          游戏冒险
      |                |                |
  字源/字形         陪读/跟读         探索/解谜
      |                |                |
      +----------------+----------------+
                       |
                 学习成长模型
                       |
               识字/阅读/表达/书写
                       |
                    AI 个性化
                       |
                  3000字长期体系
                       |
                自主阅读与终身阅读
```

The product goal is not to make children complete more exercises. It is to use an educational game engine to turn Chinese characters into stories, worlds, missions, and eventually independent reading ability.
