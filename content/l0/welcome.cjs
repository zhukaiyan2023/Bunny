/**
 * L0 · Bunny 问候 cues（3 段）
 *
 * 🎙️ 音频风格：3 岁小孩适龄
 *   - 智童女童声（101016，默认环境变量）
 *   - 语速 0（慢速）
 *   - 音量 0（柔和）
 *   - 文案 ≤ 15 字、句句独立、叠词优先（暖暖的 / 软软的 / 甜甜的）
 *   - 永远温柔、永远欢迎
 */
module.exports = {
  cues: [
    {
      id: 'bunny-welcome-1',
      kind: 'welcome',
      text: '你好呀小朋友，我是 Bunny，我们一起玩吧。',
      url: '/assets/audio/l0/welcome/bunny-welcome-1.mp3',
    },
    {
      id: 'bunny-welcome-2',
      kind: 'welcome',
      text: '欢迎欢迎，Bunny 在等你呢。',
      url: '/assets/audio/l0/welcome/bunny-welcome-2.mp3',
    },
    {
      id: 'bunny-welcome-3',
      kind: 'welcome',
      text: '今天呀，我们读一个暖暖的故事。',
      url: '/assets/audio/l0/welcome/bunny-welcome-3.mp3',
    },
  ],
};