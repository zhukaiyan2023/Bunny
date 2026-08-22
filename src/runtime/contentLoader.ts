import { useEffect, useState } from 'react';
import type { ContentPack } from '../domain/types';
import manifestData from '../../content/manifest.json';

/**
 * useContentLoader — 同步加载本地 content/manifest.json
 *
 * 真正的生产环境会从 /api/content.json 异步加载。
 * 这里把 import 当作同步 source-of-truth：
 *   - Vite 在 build 时把 JSON 静态打包
 *   - 运行时不再发 HTTP 请求
 *   - 启动最快，离线可用
 */

const manifest = manifestData as Omit<ContentPack, 'islands' | 'charactersById' | 'storiesById'> & {
  characters: any[];
  stories: any[];
  games: any[];
};

// 标准 10 岛
const ISLANDS = [
  { id: 'starter', title: '起步', emoji: '🌱', color: 'mint', capacity: 50 },
  { id: 'family', title: '家', emoji: '🏠', color: 'butter', capacity: 300 },
  { id: 'animals', title: '动物', emoji: '🐰', color: 'pink', capacity: 300 },
  { id: 'plants', title: '植物', emoji: '🌳', color: 'mint', capacity: 300 },
  { id: 'body', title: '身体', emoji: '👀', color: 'lavender', capacity: 300 },
  { id: 'actions', title: '动作', emoji: '🏃', color: 'sky', capacity: 300 },
  { id: 'colors', title: '颜色', emoji: '🎨', color: 'pink', capacity: 300 },
  { id: 'nature', title: '自然', emoji: '🌤️', color: 'sky', capacity: 300 },
  { id: 'numbers', title: '数字', emoji: '🔢', color: 'butter', capacity: 300 },
  { id: 'stories', title: '故事', emoji: '📚', color: 'lavender', capacity: 600 },
];

export function useContentLoader() {
  const [state, setState] = useState<{
    pack: ContentPack | null;
    loading: boolean;
    error: Error | null;
  }>({
    pack: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    try {
      const characters = manifest.characters;
      const charactersById: Record<string, any> = {};
      for (const c of characters) charactersById[c.id] = c;

      const storiesById: Record<string, any> = {};
      for (const s of manifest.stories ?? []) storiesById[s.id] = s;

      const pack: ContentPack = {
        islands: ISLANDS,
        characters,
        charactersById,
        stories: manifest.stories ?? [],
        games: manifest.games ?? [],
        audio: manifest.cues,
        meta: {
          version: manifest.version ?? '1',
          level: 'l1',
          builtAt: manifest.builtAt ?? new Date().toISOString(),
        },
      };

      // 把 stories 挂到 pack 上（额外的 byId 索引）
      (pack as any).storiesById = storiesById;

      setState({ pack, loading: false, error: null });
    } catch (err) {
      setState({ pack: null, loading: false, error: err as Error });
    }
  }, []);

  return state;
}