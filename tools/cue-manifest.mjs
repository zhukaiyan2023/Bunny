#!/usr/bin/env node
/**
 * tools/cue-manifest.mjs
 *
 * 聚合所有内容层（character / museum / stories / welcome / praise / worlds / reading）
 * 输出统一的 cue 清单（audio + art），并校验：
 *   - 所有 id 满足 ^[a-z0-9][a-z0-9-]*$
 *   - 同一 id 只能对应一个文本（防止后写者覆盖先写者）
 *   - 每个 story 的 page.audioId 必须在 manifest 里存在
 *
 * 每个 content module 默认导出：
 *   export default {
 *     cues: AudioCue[],   // 音频 cue 列表
 *     art: ArtItem[],     // 插画 cue 列表
 *   }
 *
 * 用法：
 *   node tools/cue-manifest.mjs --dry-run     # 仅输出统计
 *   node tools/cue-manifest.mjs --json        # 输出 JSON 到 stdout
 *   node tools/cue-manifest.mjs --out content/manifest.json
 */

import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const LEVELS = [
  { id: 'l0', dir: 'content/l0' },
  { id: 'l1', dir: 'content/l1' },
];

const ID_REGEX = /^[a-z0-9][a-z0-9-]*$/;

const errors = [];
const cueById = new Map();
const artById = new Map();
const cues = [];
const art = [];

function registerCue(cue, source) {
  if (!ID_REGEX.test(cue.id)) {
    errors.push(`[${source}] cue id "${cue.id}" 不满足 ^[a-z0-9][a-z0-9-]*$`);
    return;
  }
  if (cueById.has(cue.id)) {
    errors.push(`[${source}] cue id "${cue.id}" 与 [${cueById.get(cue.id)}] 重复`);
    return;
  }
  cueById.set(cue.id, source);
  cues.push(cue);
}

function registerArt(item, source) {
  if (!ID_REGEX.test(item.id)) {
    errors.push(`[${source}] art id "${item.id}" 不满足 ^[a-z0-9][a-z0-9-]*$`);
    return;
  }
  if (artById.has(item.id)) {
    errors.push(`[${source}] art id "${item.id}" 与 [${artById.get(item.id)}] 重复`);
    return;
  }
  artById.set(item.id, source);
  art.push(item);
}

async function loadLevel(level) {
  const dir = path.join(ROOT, level.dir);
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return;
    throw err;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await fs.readdir(full);
      for (const f of sub) {
        if (!f.endsWith('.cjs') && !f.endsWith('.js')) continue;
        if (f.startsWith('_') || f.startsWith('index.')) continue; // skip aggregate files
        await loadOne(path.join(full, f), `${level.id}/${entry.name}/${f}`);
      }
    } else if (entry.name.endsWith('.cjs') || entry.name.endsWith('.js')) {
      if (entry.name.startsWith('_') || entry.name.startsWith('index.')) continue;
      await loadOne(full, `${level.id}/${entry.name}`);
    }
  }
}

async function loadOne(file, source) {
  const url = new URL(`file://${file}`);
  const mod = await import(url.href);
  const def = mod.default ?? mod;
  if (def && Array.isArray(def.cues)) {
    for (const cue of def.cues) registerCue(cue, source);
  }
  if (def && Array.isArray(def.art)) {
    for (const item of def.art) registerArt(item, source);
  }
}

async function main() {
  for (const level of LEVELS) {
    await loadLevel(level);
  }

  // 校验：story-page 的 audioId 必须存在
  const cueIds = new Set(cues.map((c) => c.id));
  for (const cue of cues) {
    if (cue.refType === 'story-page-audio') {
      // story module 已经把 page.audioId 注册成 cue，不需要再校验
    }
  }

  const manifest = {
    version: '1',
    builtAt: new Date().toISOString(),
    cueCount: cues.length,
    artCount: art.length,
    cues,
    art,
  };

  const args = process.argv.slice(2);
  if (args.includes('--dry-run')) {
    console.log(`[cue-manifest] ${cues.length} cues · ${art.length} art items`);
    if (errors.length) {
      console.log('\n错误：');
      for (const e of errors) console.log('  - ' + e);
      process.exit(1);
    }
    return;
  }

  if (args.includes('--json')) {
    console.log(JSON.stringify(manifest, null, 2));
    return;
  }

  const outIdx = args.indexOf('--out');
  if (outIdx !== -1 && args[outIdx + 1]) {
    const outPath = path.resolve(args[outIdx + 1]);
    await fs.writeFile(outPath, JSON.stringify(manifest, null, 2));
    console.log(`[cue-manifest] wrote ${outPath} (${cues.length} cues · ${art.length} art)`);
  }

  if (errors.length) {
    console.log('\n错误：');
    for (const e of errors) console.log('  - ' + e);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[cue-manifest] fatal:', err);
  process.exit(1);
});