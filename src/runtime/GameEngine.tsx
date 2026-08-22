import { useEffect, useRef } from 'react';

/**
 * PhaserGameHost · 在 React 中嵌入 Phaser 3 游戏场景
 *
 * 当前实现：占位（CSS 渲染），先用 React 实现 G01 find_character。
 * 未来：把 GameScene 改为真正的 Phaser.Scene，由 GameEngine 驱动。
 *
 * 这是简化版，避免引入 Phaser 依赖导致 MVP 启动失败。
 * 真正 Phaser 集成路线见 src/game-runtime/（下一步）。
 */

interface PhaserGameHostProps {
  gameId: string;
  width?: number;
  height?: number;
  onResult?: (result: { correct: boolean; durationMs: number }) => void;
  children?: React.ReactNode;
}

export function PhaserGameHost({
  gameId,
  width = 600,
  height = 400,
  children,
}: PhaserGameHostProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Future: import Phaser from 'phaser' and instantiate game.
    // import('phaser').then(({ default: Phaser }) => {
    //   const game = new Phaser.Game({
    //     type: Phaser.AUTO,
    //     parent: containerRef.current!,
    //     width, height,
    //     scene: { key: gameId, preload() {...}, create() {...} }
    //   });
    // });
  }, [gameId, width, height]);

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #FFE9A8 0%, #FFC1CC 100%)',
      }}
    >
      {children}
    </div>
  );
}