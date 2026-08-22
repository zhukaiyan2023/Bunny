import { createContext, ReactNode, useContext, useMemo } from 'react';
import type { ContentPack } from '../domain/types';
import { useContentLoader } from './contentLoader';

/**
 * ContentProvider — 把 Content DSL 注入 React 树
 *
 * 数据源：content/ 目录下的 .js 模块（占位内容）
 * 未来：可替换为 fetch('/api/content.json')
 */
const ContentContext = createContext<ContentPack | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const { pack, loading, error } = useContentLoader();

  if (loading) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, color: 'var(--bunny-soft-ink)',
      }}>
        🐰 Bunny 准备中…
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div style={{
        width: '100vw', height: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 16, color: 'var(--bunny-red)',
      }}>
        <div style={{ fontSize: 32 }}>😢</div>
        <div>内容加载失败：{error?.message ?? 'unknown'}</div>
      </div>
    );
  }

  return (
    <ContentContext.Provider value={pack}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): ContentPack {
  const pack = useContext(ContentContext);
  if (!pack) {
    throw new Error('useContent must be used inside <ContentProvider>');
  }
  return pack;
}

/**
 * Hook helpers — 让页面不用写 .filter / .find
 */
export function useCharacter(id: string) {
  const { charactersById } = useContent();
  return charactersById[id];
}

export function useStory(id: string) {
  const { stories } = useContent();
  return useMemo(() => stories.find((s) => s.id === id), [stories, id]);
}

export function useGame(id: string) {
  const { games } = useContent();
  return useMemo(() => games.find((g) => g.id === id), [games, id]);
}

export function useIslandCharacters(islandId: string) {
  const { characters } = useContent();
  return useMemo(
    () => characters.filter((c) => c.island === islandId),
    [characters, islandId],
  );
}