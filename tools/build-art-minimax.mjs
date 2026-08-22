#!/usr/bin/env node
/**
 * tools/build-art-minimax.mjs
 *
 * 读取 content/manifest.json 里所有 art cue，按 manifest 路径写 png/jpeg。
 * 用 MiniMax 文生图（默认 .env）。
 *
 * 用法：
 *   node tools/build-art-minimax.mjs                 # 生成所有缺失的
 *   node tools/build-art-minimax.mjs --force         # 强制重生成
 *   node tools/build-art-minimax.mjs --only id1,id2  # 只生成指定 id
 *   node tools/build-art-minimax.mjs --dry-run       # 只看会生成哪些
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/load-env.mjs';
import { generateImage } from './lib/minimax-image.mjs';

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

function withExt(outPath, ext) {
  return outPath.replace(/\.(png|jpg|jpeg)$/i, `.${ext}`);
}

async function main() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
  let items = manifest.art.filter((a) => a.outPath && a.outPath.startsWith('/assets/'));

  if (only) {
    const set = new Set(only);
    items = items.filter((a) => set.has(a.id));
  }

  if (force) {
    for (const item of items) {
      const p = path.join(PUBLIC_DIR, item.outPath.replace(/^\//, ''));
      try { await fs.unlink(p); } catch {}
    }
  }

  console.log(`[build-art-minimax] 待处理 ${items.length} art items`);

  let ok = 0, skip = 0, fail = 0;

  for (const item of items) {
    const target = path.join(PUBLIC_DIR, item.outPath.replace(/^\//, ''));
    try {
      await fs.access(target);
      skip++;
      continue;
    } catch {}

    if (dryRun) {
      console.log(`  · would generate ${item.id} (${item.prompt.length} 字)`);
      continue;
    }

    try {
      console.log(`  · ${item.id} (${item.prompt.length} 字) ...`);
      // 限流重试：RPM 触发时退避 30s 后重试，最多 3 次
      let buf = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          buf = await generateImage(item.prompt, { aspect: '1:1' });
          break;
        } catch (err) {
          if (/1002|rate limit/i.test(err.message) && attempt < 3) {
            const wait = 30 * attempt;
            console.log(`    ⏳ rate-limited, waiting ${wait}s ...`);
            await new Promise((r) => setTimeout(r, wait * 1000));
            continue;
          }
          throw err;
        }
      }
      if (!buf) throw new Error('rate-limited after 3 attempts');
      await fs.mkdir(path.dirname(target), { recursive: true });
      const finalPath = withExt(target, 'jpg');
      await fs.writeFile(finalPath, buf);
      ok++;
      // 间隔 3s 避免触发 RPM（实测 MiniMax RPM ≈ 20）
      await new Promise((r) => setTimeout(r, 3000));
    } catch (err) {
      console.error(`  ✗ ${item.id}: ${err.message}`);
      fail++;
    }
  }

  console.log(`[build-art-minimax] done · ok=${ok} skip=${skip} fail=${fail}`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error('[build-art-minimax] fatal:', err);
  process.exit(1);
});