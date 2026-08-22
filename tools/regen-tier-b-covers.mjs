#!/usr/bin/env node
/**
 * tools/regen-tier-b-covers.mjs
 *
 * 重新生成 tier-b (5 张) + covers (3 张)
 * 完全场景化，避开"symbol"等会让模型画字母的关键词
 */

import { generateImage } from './lib/minimax-image.mjs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/load-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

loadEnv();

const SCENE_BASE = 'A cute chubby white Bunny character with long floppy ears, pink inner ear, red small backpack, big round eyes with eyelashes, pink cheek blush, sweet smile. Soft pastel pink mint butter yellow lavender dreamy warm lighting, rounded chubby shapes, no sharp edges, 3D render, soft focus background, transparent backdrop. NO text NO letters NO alphabet NO digits NO symbols NO writing anywhere in the image. Pure visual scene only.';

const SCENES = [
  // Tier-B
  { id: 'tier-b/lin', out: 'public/assets/art/l1/tier-b/picto-lin.jpg', prompt: `${SCENE_BASE} Scene: Bunny stands in a forest clearing with two cute chubby trees standing close together like siblings, hugging each other, surrounded by tiny flowers and butterflies, soft pastel mint background.` },
  { id: 'tier-b/sen', out: 'public/assets/art/l1/tier-b/picto-sen.jpg', prompt: `${SCENE_BASE} Scene: Bunny walks through a tiny forest of three cute chubby trees grouped together like a small family, with mushrooms and flowers at their feet, soft sunbeams filtering through the canopy.` },
  { id: 'tier-b/ming', out: 'public/assets/art/l1/tier-b/picto-ming.jpg', prompt: `${SCENE_BASE} Scene: Bunny stands in a meadow under both a soft smiling sun and a crescent moon smiling together in the sky side by side, like friends, with rainbow and pastel sky, dreamy warm.` },
  { id: 'tier-b/xiu', out: 'public/assets/art/l1/tier-b/picto-xiu.jpg', prompt: `${SCENE_BASE} Scene: Bunny rests leaning against a chubby tree trunk in a forest clearing, eyes closed peacefully, with flowers blooming around, sleepy afternoon vibes, butterflies fluttering.` },
  { id: 'tier-b/hao', out: 'public/assets/art/l1/tier-b/picto-hao.jpg', prompt: `${SCENE_BASE} Scene: Bunny stands beside a chubby mother bunny figure and a tiny chubby baby bunny figure together with hearts floating around them, sweet family scene, flowers blooming.` },

  // Covers
  { id: 'cover/sen-lin', out: 'public/assets/art/l1/stories/cover-sen-lin-li-de-yi-tian.jpg', prompt: `${SCENE_BASE} Cover scene: Bunny stands in front of a pastel mint green forest wearing a pink flower crown. The forest has pink mountains, small trees, tiny flowers and cute mushrooms. Decorated with rainbow hearts butterflies small clouds. Pastel soft gradient background, dreamy soft warm.` },
  { id: 'cover/tai-yang', out: 'public/assets/art/l1/stories/cover-tai-yang-he-yue-liang.jpg', prompt: `${SCENE_BASE} Cover scene: Two chubby Bunny characters hold hands at the bottom. Above them the sky is split in half: left side has a chubby pastel yellow sun character with pink cheek blush and a flower crown; right side has a chubby lavender crescent moon character with a tiny star hairpin. Background is pastel pink to lavender gradient, decorated with rainbow hearts petals.` },
  { id: 'cover/xiao-tu', out: 'public/assets/art/l1/stories/cover-xiao-tu-de-jia.jpg', prompt: `${SCENE_BASE} Cover scene: A cute chubby white Bunny character looking up into the distance with sparkly eyes. Background shows a pastel forest with soft pink mountains. Decorated with flowers hearts butterflies. Pastel pink gradient background, dreamy soft warm.` },
];

const PUBLIC = path.join(ROOT, 'public');
let ok = 0, fail = 0;

for (const s of SCENES) {
  const target = path.join(PUBLIC, s.out.replace(/^public\//, ''));
  try {
    console.log(`  · ${s.id} ...`);
    let buf = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        buf = await generateImage(s.prompt, { aspect: '1:1' });
        break;
      } catch (err) {
        if (/1002|rate limit/i.test(err.message) && attempt < 3) {
          console.log(`    ⏳ rate-limited, waiting ${30 * attempt}s ...`);
          await new Promise((r) => setTimeout(r, 30 * attempt * 1000));
          continue;
        }
        throw err;
      }
    }
    if (!buf) throw new Error('rate-limited after 3 attempts');
    await fs.writeFile(target, buf);
    console.log(`    ✓ ${s.id} (${buf.length} bytes)`);
    ok++;
    await new Promise((r) => setTimeout(r, 4000));
  } catch (err) {
    console.error(`    ✗ ${s.id}: ${err.message}`);
    fail++;
  }
}

console.log(`[regen-tier-b-covers] done · ok=${ok} fail=${fail}`);
if (fail > 0) process.exit(1);