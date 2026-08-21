# Bunny AI 与个性化学习系统

## 1. AI 的边界

AI 是学习规划器和陪读助手，不是教材知识的唯一来源。

### AI 可以做

- 初始学习能力评估
- 绘本推荐
- 游戏推荐
- 复习调度
- 阅读难度调整
- 陪读反馈
- 个性化提示
- 原创绘本候选生成
- 原创游戏候选生成

### AI 不应直接决定

- 教材标准答案
- 字源事实
- 汉字笔顺
- 拼音标准
- 教材归属
- 未审核的教学知识

这些内容来自受控知识库。

## 2. Learner Model

```text
Learner
├── profile
│   ├── age
│   ├── grade
│   └── interests
├── curriculumProgress
├── characterMastery
├── wordMastery
├── readingLevel
├── readAloudProfile
├── comprehensionProfile
├── gamePreferences
├── recentErrors
└── reviewQueue
```

## 3. 汉字 Mastery Score

每个字使用多维状态，而不是单一对错：

```text
recognition
listening
meaning
wordUsage
reading
writing
retention
```

内部可以转化为 0-100 的 masteryScore，但 UI 不直接展示为考试分数。

## 4. 推荐策略

AI 每次打开产品时生成：

```text
TodayPlan
├── warmup
├── newTarget
├── reading
├── game
├── review
└── freeChoice
```

推荐逻辑优先级：

1. 当前课程同步任务
2. 学习薄弱点
3. 即将遗忘的字
4. 当前阅读兴趣
5. 新内容探索

## 5. 动态难度

如果连续正确：

```text
图片 -> 单字 -> 词语 -> 短句 -> 语境
```

如果连续错误：

```text
减少干扰项
 -> 加图片
 -> 加语音
 -> 给提示
 -> 换一个游戏机制
```

不通过简单降低全部难度解决问题，而是找出错误维度。

## 6. 复习策略

使用事件驱动的 spaced repetition：

```text
首次学习
 -> 短期复现
 -> 次日复现
 -> 数日后复现
 -> 绘本自然复现
 -> 长期保持
```

实际间隔由数据验证，不在产品文档中写死单一算法。

## 7. AI 陪读

AI 陪读需要：

- TTS
- 词/句高亮
- 可解释提示
- 朗读识别
- 简单情绪反馈
- 不羞辱儿童的错误纠正

示例：

```text
孩子读：小兔子在林里找妈妈
目标：小兔子在森林里找妈妈
```

反馈：

> “已经读得很接近啦。你漏掉了‘森’这个字，我们再读一次：森——林。”

## 8. AI 生成内容流程

```text
Learning Objective
 -> Content Template
 -> AI Generate Candidate
 -> Automated Validation
 -> Human/Editorial Review
 -> Publish
```

禁止生产环境直接将 LLM 原始输出作为儿童学习内容。

## 9. 推荐引擎输出

```json
{
  "dailyPlanId": "plan-001",
  "items": [
    {
      "type": "reading",
      "contentId": "book-123",
      "reason": "复现最近学习的5个字"
    },
    {
      "type": "review",
      "characterIds": ["山", "水"]
    }
  ]
}
```
