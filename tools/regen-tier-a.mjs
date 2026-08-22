#!/usr/bin/env node
/**
 * tools/regen-tier-a.mjs
 *
 * 重新生成 l1/tier-a 的所有象形字图。
 * 关键是 prompt 里完全不出现 "symbol" / "字母" / "letter" / "代表"
 * 让模型只画"场景"，场景里自然包含那个视觉元素
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
  // 1. 山 = mountain
  { id: 'shan', prompt: `${SCENE_BASE} Scene: Bunny stands in a meadow with three soft rounded chubby mountain peaks behind him, with a soft sun rising from behind the peaks, flowers butterflies hearts floating in the air.` },
  // 2. 水 = water
  { id: 'shui', prompt: `${SCENE_BASE} Scene: Bunny stands beside a gentle flowing river with soft flowing water drops and small wavy bubbles, with pink water lilies floating, with cute fish swimming, hearts in the air.` },
  // 3. 火 = fire
  { id: 'huo', prompt: `${SCENE_BASE} Scene: Bunny sits beside a campfire with soft rounded dancing flames in butter yellow and orange, with tiny glowing embers floating up like hearts, cozy warm scene.` },
  // 4. 木 = tree/wood
  { id: 'mu', prompt: `${SCENE_BASE} Scene: Bunny hugs a small chubby tree with a soft brown trunk and round green canopy with tiny flowers blooming on the branches, butterflies flying around.` },
  // 5. 日 = sun
  { id: 'ri', prompt: `${SCENE_BASE} Scene: Bunny stands in a meadow under a soft smiling sun with small radiating heart-shaped petals, with rainbow in the background, flowers and butterflies.` },
  // 6. 月 = moon
  { id: 'yue', prompt: `${SCENE_BASE} Scene: Bunny stands on a hill under a soft crescent moon with a sleepy face and tiny twinkling stars, with lavender sky gradient, dreamy and calm.` },
  // 7. 人 = person
  { id: 'ren', prompt: `${SCENE_BASE} Scene: Bunny walks alongside a small chubby walking person silhouette who looks just like Bunny but smaller, holding hands, walking through a flower meadow.` },
  // 8. 口 = mouth
  { id: 'kou', prompt: `${SCENE_BASE} Scene: Bunny opens his mouth wide showing a soft rounded square opening, with a tiny butterfly flying out of his mouth, silly playful expression.` },
  // 9. 目 = eye
  { id: 'mu-eye', prompt: `${SCENE_BASE} Scene: Bunny stares at a giant round cute eye with eyelashes that floats in the air in front of him, the eye has a tiny sparkle, magical dreamy scene.` },
  // 10. 耳 = ear
  { id: 'er', prompt: `${SCENE_BASE} Scene: Bunny reaches up to touch a giant soft rounded ear shape that floats above him, with a tiny pink inner ear visible inside, surrounded by musical notes made of hearts.` },
  // 11. 手 = hand
  { id: 'shou', prompt: `${SCENE_BASE} Scene: Bunny waves at a giant chubby open hand with five small fingers floating in the sky, the hand has a sweet friendly face, magical dreamy scene.` },
  // 12. 心 = heart
  { id: 'xin', prompt: `${SCENE_BASE} Scene: Bunny holds a giant soft pink heart shape with a sweet smile in his paws, surrounded by smaller floating hearts, sparkles and butterflies, very pink and dreamy.` },
  // 13. 足 = foot
  { id: 'zu', prompt: `${SCENE_BASE} Scene: Bunny looks down at a giant cute chubby footprint shape on the ground next to him, the footprint has a smiley face, with tiny footprints leading away into the distance.` },
  // 14. 雨 = rain
  { id: 'yu', prompt: `${SCENE_BASE} Scene: Bunny stands under a tiny cloud with soft rain drops falling, the rain drops are shaped like tiny hearts, with a small puddle of hearts on the ground, butterflies hiding under a mushroom.` },
];

const PUBLIC = path.join(ROOT, 'public');
let ok = 0, fail = 0;

for (const s of SCENES) {
  const target = path.join(PUBLIC, `assets/art/l1/tier-a/picto-${s.id}.jpg`);
  try {
    console.log(`  · picto-${s.id} ...`);
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

console.log(`[regen-tier-a] done · ok=${ok} fail=${fail}`);
if (fail > 0) process.exit(1);