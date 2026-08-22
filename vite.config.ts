import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Bunny H5 dev/build config — see docs/H5_ARCHITECTURE.md.
//
// Pad landscape target: 1366x1024 (matches Panda's design canvas and
// the mockup at docs/prototype.png). The runtime is content-driven
// (`content/` is the source of truth) so Vite is purely the build /
// dev pipeline, with no extra plugins beyond the React fast refresh
// one.
//
// Audio + art assets are served from /assets/, which is a symlink
// to the top-level `assets/` directory at the repo root — the same
// layout `tools/build-audio-*.mjs` and `tools/build-art-*.mjs` write
// into. The placeholders script (`node tools/make-placeholders.mjs`)
// populates `assets/audio/` with silent stubs so a fresh checkout
// boots without any API key.
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5180,
    strictPort: false,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    target: "es2020",
  },
});