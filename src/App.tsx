import { Routes, Route, Navigate } from 'react-router-dom';
import { ContentProvider } from './runtime/ContentProvider';
import { LearnerProvider } from './runtime/LearnerProvider';
import { AudioProvider } from './runtime/AudioProvider';
import { BottomNav } from './components/shell/BottomNav';
import { HomePage } from './pages/HomePage';
import { StoryPage } from './pages/StoryPage';
import { CharacterMuseumPage } from './pages/CharacterMuseumPage';
import { GamePage } from './pages/GamePage';
import { ReadAlongPage } from './pages/ReadAlongPage';
import { BadgesPage } from './pages/BadgesPage';
import { GardenMapPage } from './pages/GardenMapPage';
import { EvolutionPage } from './pages/EvolutionPage';
import { DailyPlanPage } from './pages/DailyPlanPage';
import { LevelPage } from './pages/LevelPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { ParentReportPage } from './pages/ParentReportPage';
import './App.css';

/**
 * App · 顶层路由
 *
 * 渲染顺序（外 → 内）：
 *   BrowserRouter       (main.tsx)
 *   ├ ContentProvider   提供所有 Content DSL
 *   ├ LearnerProvider   学习者状态（识字掌握度、等级、奖励）
 *   ├ AudioProvider     TTS + 音频队列
 *   └ Routes
 *
 * App shell 为 1366×1024 固定画布；底部始终挂着 BottomNav。
 *
 * 注：12 个真实页面由 subagent 在 background 创建。
 * 占位页让 main bundle 可以先编译通过。
 */
export default function App() {
  return (
    <ContentProvider>
      <LearnerProvider>
        <AudioProvider>
          <div className="app-shell">
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* 主线 6-9 岁 */}
              <Route path="/story" element={<StoryPage />} />
              <Route path="/characters" element={<CharacterMuseumPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/readalong" element={<ReadAlongPage />} />
              <Route path="/badges" element={<BadgesPage />} />

              {/* 3000 字骨架 */}
              <Route path="/garden" element={<GardenMapPage />} />
              <Route path="/evolution" element={<EvolutionPage />} />

              {/* 6-9 岁扩展 */}
              <Route path="/daily" element={<DailyPlanPage />} />
              <Route path="/level" element={<LevelPage />} />
              <Route path="/curriculum" element={<CurriculumPage />} />
              <Route path="/parent" element={<ParentReportPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <BottomNav />
          </div>
        </AudioProvider>
      </LearnerProvider>
    </ContentProvider>
  );
}