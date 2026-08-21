# Bunny 内容 DSL 与数据模型

## 1. 原则

Bunny 要做到“换内容，不改程序”。

游戏、绘本、汉字、课程、奖励和陪读流程全部通过结构化内容配置运行。

## 2. Character DSL

```json
{
  "id": "char-ming",
  "character": "明",
  "pinyin": "míng",
  "tone": 2,
  "meaning": ["明亮", "清楚"],
  "radical": "日",
  "characterType": "compound",
  "origin": {
    "fact": "儿童化解释",
    "evidenceLevel": "verified"
  },
  "words": ["明天", "明白"],
  "storyRefs": ["story-ming-001"],
  "gameTemplates": ["find_character", "build_character"]
}
```

## 3. Story DSL

```json
{
  "id": "book-001",
  "title": "小兔找妈妈",
  "level": "L1",
  "curriculumRefs": ["grade1-unit1"],
  "targetCharacters": ["小", "兔", "妈", "找"],
  "pages": [
    {
      "id": "page-1",
      "background": "forest",
      "texts": [
        {
          "id": "t1",
          "text": "小兔子在森林里找妈妈。",
          "tokens": ["小兔子", "在", "森林里", "找", "妈妈"],
          "audio": "audio/page-1.mp3"
        }
      ],
      "interactions": [
        {
          "type": "tap_character",
          "characterId": "兔"
        }
      ]
    }
  ]
}
```

## 4. Game DSL

```json
{
  "id": "game-001",
  "type": "find_character",
  "learningObjectives": ["recognition"],
  "difficulty": 2,
  "scene": "forest",
  "prompt": {
    "text": "找到‘兔’",
    "audio": "audio/find-rabbit.mp3"
  },
  "options": [
    {"character": "兔", "correct": true},
    {"character": "免", "correct": false},
    {"character": "儿", "correct": false}
  ],
  "success": {
    "animation": "bunny_jump",
    "audio": "audio/great.mp3"
  }
}
```

## 5. Lesson DSL

```json
{
  "id": "grade1-unit-01",
  "grade": 1,
  "semester": 1,
  "lesson": "天地人",
  "learningObjectives": [
    "recognize_target_characters",
    "read_target_words"
  ],
  "targetCharacters": ["天", "地", "人", "你", "我", "他"],
  "storyRefs": ["book-001"],
  "gameRefs": ["game-001"],
  "reviewPlan": {
    "enabled": true
  }
}
```

## 6. DailyPlan DSL

```json
{
  "id": "today-001",
  "items": [
    {"type": "warmup", "contentId": "game-101"},
    {"type": "story", "contentId": "book-001"},
    {"type": "character-story", "contentId": "char-ming"},
    {"type": "game", "contentId": "game-001"},
    {"type": "review", "contentId": "review-set-001"}
  ]
}
```

## 7. 内容引用关系

```text
CurriculumUnit
  -> Character
  -> Word
  -> Story
  -> Game
  -> Review
```

同一个 Character 可被多个故事和多个游戏引用。

## 8. 内容版本

每个内容实体应包含：

- version
- status: draft/review/published/archived
- author
- reviewer
- source
- copyrightStatus
- updatedAt

## 9. 自动校验

发布前至少校验：

- character 是否存在
- pinyin 是否存在
- 目标字是否属于本内容目标
- 游戏答案是否唯一
- 音频/图片是否存在
- 绘本新字密度是否超限
- 课程映射是否存在
- 字源事实状态是否允许发布

## 10. 为什么采用 DSL

最终目标是：

```text
AI/编辑生成内容
      ↓
Content DSL
      ↓
Validator
      ↓
Content Repository
      ↓
H5 Runtime
```

同一个运行时可以承载数千本绘本和大量小游戏。
