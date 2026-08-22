/**
 * tools/lib/minimax-image.mjs
 *
 * MiniMax 文生图客户端（base64 返回）
 *
 * 真实 endpoint：POST {baseUrl}/v1/image_generation
 *   - 默认 baseUrl: https://api.minimaxi.com（用户的 key 在这里有效）
 *   - 注意：Open Design 默认配置的是 https://api.minimax.io，那个端 key 会返回 2049 invalid
 *   - 可通过环境变量 MINIMAX_IMAGE_BASE_URL 覆盖
 *
 * 用法：
 *   import { generateImage } from './lib/minimax-image.mjs';
 *   const buffer = await generateImage('a cute bunny ...');
 */

const DEFAULT_BASE_URL = 'https://api.minimaxi.com';

function getEnv(name) {
  return process.env[name] ?? globalThis.__bunny_env?.[name];
}

function getBaseUrl() {
  return (process.env.MINIMAX_IMAGE_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
}

/**
 * 生成一张图片，返回 Buffer（JPEG bytes）
 *
 * @param {string} prompt
 * @param {object} [opts]
 * @param {string} [opts.aspect]  '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3' | '21:9'
 * @param {string} [opts.model]  默认 'image-01'
 * @param {number} [opts.n]       默认 1
 */
export async function generateImage(prompt, opts = {}) {
  const apiKey = getEnv('MINIMAX_API_KEY');
  if (!apiKey) throw new Error('缺少 MINIMAX_API_KEY（请在 .env 配置）');

  const baseUrl = getBaseUrl();
  const body = {
    model: opts.model ?? 'image-01',
    prompt,
    response_format: 'base64',
    n: opts.n ?? 1,
  };
  if (opts.aspect) body.aspect_ratio = opts.aspect;

  const res = await fetch(`${baseUrl}/v1/image_generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MiniMax HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = await res.json();
  if (json.base_resp && json.base_resp.status_code !== 0) {
    throw new Error(`MiniMax API Error [${json.base_resp.status_code}]: ${json.base_resp.status_msg}`);
  }
  const base64 = json?.data?.image_base64?.[0];
  if (typeof base64 !== 'string' || !base64) {
    throw new Error(`MiniMax 返回无 image_base64：${JSON.stringify(json).slice(0, 200)}`);
  }
  return Buffer.from(base64, 'base64');
}