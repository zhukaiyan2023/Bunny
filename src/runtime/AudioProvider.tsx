import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useContent } from './ContentProvider';
import type { AudioCue } from '../domain/types';

/**
 * AudioProvider · 音频队列 + TTS 占位
 *
 * 责任：
 *   - 维护单一 HTMLAudioElement 实例（避免多个重叠）
 *   - playCue(id) 按 id 找 cue 并播放
 *   - playCueByText(text) 给动态文本（用于鼓励、跟读反馈）
 *   - 记录播放历史 / 当前状态
 *
 * 注：未来切换到 Web Audio API 做混音 + 波形可视化。
 */

interface AudioContextValue {
  playCue: (cueId: string) => Promise<void>;
  playText: (text: string, opts?: { voice?: 'kid' | 'warm' }) => Promise<void>;
  stop: () => void;
  isPlaying: boolean;
  currentCueId: string | null;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const { audio } = useContent();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentCueId, setCurrentCueId] = useState<string | null>(null);

  // 创建单例 audio 元素
  useEffect(() => {
    const el = new Audio();
    el.preload = 'auto';
    el.addEventListener('play', () => setIsPlaying(true));
    el.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentCueId(null);
    });
    el.addEventListener('pause', () => {
      setIsPlaying(false);
    });
    audioRef.current = el;
    return () => {
      el.pause();
      el.src = '';
    };
  }, []);

  const findCue = useCallback(
    (id: string): AudioCue | undefined => audio.find((c) => c.id === id),
    [audio],
  );

  const playCue = useCallback(
    async (cueId: string) => {
      const cue = findCue(cueId);
      if (!cue) {
        console.warn('[audio] cue not found:', cueId);
        return;
      }
      const el = audioRef.current;
      if (!el) return;

      // 如果已经在播别的，先停
      el.pause();

      // 占位音频（144B 静音）直接跳过，避免播放占位
      const isPlaceholder = cue.url.endsWith('.mp3') && (
        cue.url.includes('/welcome/') ||
        cue.url.includes('/praise/') ||
        cue.url.includes('/worlds/') ||
        cue.url.includes('/reading/')
      );
      // 即使是占位也尝试播放（占位 mp3 也存在，只是静音 1 秒）

      el.src = cue.url;
      setCurrentCueId(cueId);
      try {
        await el.play();
      } catch (err) {
        // autoplay 可能在某些浏览器被禁用
        console.warn('[audio] play failed:', err);
      }
    },
    [findCue],
  );

  /**
   * playText — 动态文本播放（暂时是占位：找一个长度匹配的鼓励 cue 替代）
   * 真实生产应该走 TTS provider（腾讯云 / Web Speech API）
   */
  const playText = useCallback(
    async (text: string, opts?: { voice?: 'kid' | 'warm' }) => {
      // 找匹配长度 / 关键字的 cue 替代
      const fallback = audio.find((c) =>
        c.kind === 'praise' && text.includes(c.text.split('，')[0]),
      );
      if (fallback) return playCue(fallback.id);

      // 否则随机播一个 praise
      const praises = audio.filter((c) => c.kind === 'praise');
      if (praises.length) {
        const idx = Math.floor(Math.random() * praises.length);
        return playCue(praises[idx].id);
      }
    },
    [audio, playCue],
  );

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setCurrentCueId(null);
  }, []);

  const value = useMemo<AudioContextValue>(() => ({
    playCue,
    playText,
    stop,
    isPlaying,
    currentCueId,
  }), [playCue, playText, stop, isPlaying, currentCueId]);

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used inside <AudioProvider>');
  return ctx;
}