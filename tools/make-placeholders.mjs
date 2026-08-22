#!/usr/bin/env node
/**
 * tools/make-placeholders.mjs
 *
 * 当 .env 里没有 API key 时，写入占位音频 + SVG 占位图，让 H5 应用可以启动。
 *
 *   - 音频：写一段 1 秒静音 mp3（每个 cue 一个文件）
 *   - 图片：写 pastel 圆角 SVG 占位图
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MANIFEST = path.join(ROOT, 'content/manifest.json');
const PUBLIC = path.join(ROOT, 'public');

// 1 秒静音 mp3 (CBR 32kbps mono) - 用最简 ID3v2 + MPEG 帧
function silentMp3() {
  // A 1-frame MP3 silence. 144 bytes/frame at 32kbps.
  const buf = Buffer.alloc(144);
  // MPEG header: 0xFF 0xFB 0x14 0xC4 → 32kbps mono, 44.1kHz, padding=0
  buf[0] = 0xff; buf[1] = 0xfb; buf[2] = 0x14; buf[3] = 0xc4;
  // rest is zeros = silent
  return buf;
}

const PASTEL_COLORS = ['#FFE9A8', '#FFC1CC', '#A8E6CF', '#B5DEFF', '#D9C2F0', '#FFD15C'];

function svgPlaceholder({ id, subject, color }) {
  const initials = subject ? subject.slice(0, 2) : id.slice(0, 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="${color}" rx="40"/>
  <text x="256" y="280" font-family="PingFang SC, sans-serif" font-size="80"
    font-weight="700" fill="#2C2C54" text-anchor="middle">${escapeXml(initials)}</text>
  <text x="256" y="340" font-family="PingFang SC, sans-serif" font-size="22"
    fill="#5C5C8A" text-anchor="middle">${escapeXml(subject || id)}</text>
</svg>`;
}

function escapeXml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  }[c]));
}

async function main() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST, 'utf8'));
  const silent = silentMp3();

  let audioCount = 0, artCount = 0;

  for (const cue of manifest.cues) {
    if (!cue.url) continue;
    const target = path.join(PUBLIC, cue.url.replace(/^\//, ''));
    try {
      await fs.access(target);
      continue; // skip if exists
    } catch {}
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, silent);
    audioCount++;
  }

  for (let i = 0; i < manifest.art.length; i++) {
    const item = manifest.art[i];
    if (!item.outPath) continue;
    const target = path.join(PUBLIC, item.outPath.replace(/^\//, ''));
    try {
      await fs.access(target);
      continue;
    } catch {}
    const color = PASTEL_COLORS[i % PASTEL_COLORS.length];
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, svgPlaceholder({
      id: item.id,
      subject: item.subject,
      color,
    }));
    artCount++;
  }

  console.log(`[make-placeholders] wrote ${audioCount} silent mp3 + ${artCount} svg placeholders`);
}

main().catch((err) => {
  console.error('[make-placeholders] fatal:', err);
  process.exit(1);
});