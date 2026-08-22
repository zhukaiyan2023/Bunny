/**
 * 临时占位页 - 仅用于让 App.tsx 在 subagent 完成前能编译
 * 真实页面由 subagent 写入后会自动覆盖
 */
import { TopBar } from '../components/shell/TopBar';

interface Props { title: string; }

export function PlaceholderPage({ title }: Props) {
  return (
    <>
      <TopBar title={title} subtitle="加载中..." />
      <div style={{
        position: 'absolute',
        top: 96, left: 0, right: 0, bottom: 88,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        color: 'var(--bunny-soft-ink)',
      }}>
        <div style={{ fontSize: 64 }}>🐰</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{title} 加载中…</div>
        <div>请等待真实页面完成</div>
      </div>
    </>
  );
}