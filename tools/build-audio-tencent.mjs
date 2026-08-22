#!/usr/bin/env node
/**
 * tools/build-audio-tencent.mjs
 *
 * 读取 content/manifest.json 里所有 audio cue，按 manifest 路径写 mp3。
 * 用腾讯云 TTS（智童女童声 101016，默认 .env）。
 *
 * 用法：
 *   node tools/build-audio-tencent.mjs                 # 生成所有缺失的
 *   node tools/build-audio-tencent.mjs --force         # 强制重生成所有
 *   node tools/build-audio-tencent.mjs --only id1,id2  # 只生成指定 id
 *   node tools/build-audio-tencent.mjs --dry-run       # 只看会生成哪些
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/load-env.mjs';
import { synthesize } from './lib/tencent-tts.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

loadEnv();

const args = process.argv.slice(2);
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');
const onlyIdx = args.indexOf('--only');
const only = onlyIdx !== -1 ? args[onlyIdx + 1].split(',') : null;

const MANIFEST_PATH = path.join(ROOT, 'content/manifest.json');
const PUBLIC_DIR = path.join(ROOT, 'public');

async function main() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
  let cues = manifest.cues.filter((c) => c.url && c.url.startsWith('/assets/'));

  if (only) {
    const set = new Set(only);
    cues = cues.filter((c) => set.has(c.id));
  }

  if (force) {
    // 删除已有
    for (const cue of cues) {
      const p = path.join(PUBLIC_DIR, cue.url.replace(/^\//, ''));
      try { await fs.unlink(p); } catch {}
    }
  }

  console.log(`[build-audio-tencent] 待处理 ${cues.length} cues`);

  let ok = 0, skip = 0, fail = 0;

  for (const cue of cues) {
    const target = path.join(PUBLIC_DIR, cue.url.replace(/^\//, ''));
    try {
      await fs.access(target);
      skip++;
      continue;
    } catch {}

    if (dryRun) {
      console.log(`  · would synthesize ${cue.id} (${cue.text})`);
      continue;
    }

    try {
      console.log(`  · ${cue.id} (${cue.text.length} 字) ...`);
      const audioBase64 = await synthesize(cue.text);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, Buffer.from(audioBase64, 'base64'));
      ok++;
    } catch (err) {
      console.error(`  ✗ ${cue.id}: ${err.message}`);
      fail++;
    }
  }

  console.log(`[build-audio-tencent] done · ok=${ok} skip=${skip} fail=${fail}`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error('[build-audio-tencent] fatal:', err);
  process.exit(1);
});