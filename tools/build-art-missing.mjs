#!/usr/bin/env node
/**
 * tools/build-art-missing.mjs
 *
 * Generate only the art items that are missing on disk.
 * With 60s backoff on rate-limit, runs as a focused recovery job.
 */

import { generateImage } from './lib/minimax-image.mjs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from './lib/load-env.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

loadEnv();

const MISSING = [
  { id: 'bunny-happy',       prompt: '一只圆胖的白色小兔 Bunny 开心跳跃姿势，长垂耳飘起来、笑得眯起眼、双手举过头、红色小书包在身上，周围飘着小心心和花瓣，3 岁女孩专属绘本风格，pastel 柔粉 + 薄荷 + 奶黄 + 淡紫调色板，画面梦幻柔软温暖，圆润无尖角，所有角色胖嘟嘟并带圆眼睛 + 腮红 + 甜甜笑，3D 渲染，picture-book 风，背景透明或淡奶油色 #FFF4E6。', out: '/assets/art/l0/bunny/bunny-happy.jpg' },
  { id: 'bunny-reading',     prompt: '一只圆胖的白色小兔 Bunny 盘腿坐地上抱着一本打开的童话书，眼睛认真看书表情专注，长垂耳 + 红色小书包，身边有小花和蝴蝶，3 岁女孩专属绘本风格，pastel 调色板，画面梦幻柔软温暖，圆润无尖角，所有角色胖嘟嘟并带圆眼睛 + 腮红 + 甜甜笑，3D 渲染，picture-book 风，背景透明。', out: '/assets/art/l0/bunny/bunny-reading.jpg' },
  { id: 'companion-bird',    prompt: '一只可爱圆胖的小鸟，全身奶黄 + 橘色尖嘴，头顶一朵小花，站在粉色树枝上，3 岁女孩专属绘本风格，pastel 调色板，画面梦幻柔软温暖，圆润无尖角，所有角色胖嘟嘟并带圆眼睛 + 腮红 + 甜甜笑，3D 渲染，picture-book 风，背景透明。', out: '/assets/art/l0/companions/companion-bird.jpg' },
  { id: 'ui-star',           prompt: '一颗奶黄金色星星，带拟人笑脸（圆眼睛 + 粉腮红 + 甜甜笑），3 岁女孩专属绘本风格，pastel 调色板，画面梦幻柔软温暖，圆润无尖角，所有元素胖嘟嘟，3D 渲染，picture-book 风，背景透明。', out: '/assets/art/l0/ui/ui-star.jpg' },
  { id: 'badge-body',        prompt: '一枚 pastel 淡紫圆形徽章，写白色"身体"两个字 + 👀👀小眼睛图标，3 岁女孩专属绘本风格，pastel 调色板，画面梦幻柔软温暖，圆润无尖角，所有元素胖嘟嘟，3D 渲染，picture-book 风，背景透明。', out: '/assets/art/l0/badges/badge-body.jpg' },
  { id: 'badge-stories',     prompt: '一枚 pastel 天蓝圆形徽章，写白色"故事"两个字 + 📖📖打开的书图标，3 岁女孩专属绘本风格，pastel 调色板，画面梦幻柔软温暖，圆润无尖角，所有元素胖嘟嘟，3D 渲染，picture-book 风，背景透明。', out: '/assets/art/l0/badges/badge-stories.jpg' },
];

const PUBLIC = path.join(ROOT, 'public');

let ok = 0, fail = 0;
for (const m of MISSING) {
  const target = path.join(PUBLIC, m.out.replace(/^\//, ''));
  try {
    await fs.access(target);
    console.log(`  · ${m.id} (already exists, skip)`);
    ok++;
    continue;
  } catch {}

  try {
    console.log(`  · ${m.id} ...`);
    const buf = await generateImage(m.prompt, { aspect: '1:1' });
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, buf);
    console.log(`    ✓ ${m.id} (${buf.length} bytes)`);
    ok++;
    await new Promise(r => setTimeout(r, 5000));
  } catch (err) {
    console.error(`    ✗ ${m.id}: ${err.message}`);
    if (/1002|rate limit/i.test(err.message)) {
      console.log('    ⏳ rate limit, backing off 60s');
      await new Promise(r => setTimeout(r, 60000));
    }
    fail++;
  }
}

console.log(`[build-art-missing] done · ok=${ok} fail=${fail}`);