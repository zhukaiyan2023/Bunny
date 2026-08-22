#!/usr/bin/env node
import { generateImage } from './lib/minimax-image.mjs';
import { promises as fs } from 'node:fs';
import { loadEnv } from './lib/load-env.mjs';
loadEnv();

// Softer English prompt to avoid moderation
const prompt = 'A cute chubby white bunny character standing on tiptoes with long floppy ears floating up, smiling with closed crescent eyes, both paws raised gently at chest level, wearing a red small backpack, soft pink hearts and flower petals floating around. Style: 3 year old girl picture book, pastel pink mint butter lavender palette, dreamy and soft warm, rounded chubby shapes with circular black eyes and pink cheek blush, friendly smile, 3D render, transparent background.';
try {
  const buf = await generateImage(prompt, { aspect: '1:1' });
  await fs.writeFile('public/assets/art/l0/bunny/bunny-happy.jpg', buf);
  console.log('✓', buf.length, 'bytes');
} catch (err) {
  console.error('✗', err.message);
  process.exit(1);
}