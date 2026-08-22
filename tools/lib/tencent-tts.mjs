/**
 * tools/lib/tencent-tts.mjs
 *
 * 腾讯云 TTS 客户端（TC3-HMAC-SHA256 签名）
 * 用于给 Bunny 项目生成 86+ 段儿童女声旁白。
 *
 * 调用方式：
 *   import { synthesize } from './lib/tencent-tts.mjs';
 *   const { audioBase64 } = await synthesize('你好呀小朋友');
 */

import crypto from 'node:crypto';

const SERVICE = 'tts';
const HOST = 'tts.tencentcloudapi.com';
const ACTION = 'TextToVoice';
const VERSION = '2019-08-23';
const ALG = 'TC3-HMAC-SHA256';

function sha256hex(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

function hmacSHA256(key, msg) {
  return crypto.createHmac('sha256', key).update(msg).digest();
}

function getEnv(name) {
  // 从 process.env 或 import.meta.env (Vite) 取
  const env = process.env[name] ?? globalThis.__bunny_env?.[name];
  if (!env) throw new Error(`缺少环境变量 ${name}（请在 .env 里配置）`);
  return env;
}

function pad(n) { return n < 10 ? '0' + n : '' + n; }
function utcNow() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`;
}

/**
 * 合成一段音频，返回 base64 编码的 mp3
 *
 * @param {string} text        要朗读的文本（≤ 150 字）
 * @param {object} [opts]
 * @param {string} [opts.voiceType]  智童女童声 = 101016
 * @param {string} [opts.codec]      mp3 / wav / pcm
 * @param {number} [opts.sampleRate]
 * @param {number} [opts.speed]      -2..6（默认 0）
 * @param {number} [opts.volume]     -10..10
 */
export async function synthesize(text, opts = {}) {
  const secretId = getEnv('TENCENT_SECRET_ID');
  const secretKey = getEnv('TENCENT_SECRET_KEY');

  const voiceType = opts.voiceType ?? getEnv('TENCENT_VOICE_TYPE') ?? '101016';
  const codec = opts.codec ?? getEnv('TENCENT_CODEC') ?? 'mp3';
  const sampleRate = parseInt(opts.sampleRate ?? getEnv('TENCENT_SAMPLE_RATE') ?? '16000', 10);
  const speed = parseFloat(opts.speed ?? getEnv('TENCENT_SPEED') ?? '0');
  const volume = parseFloat(opts.volume ?? getEnv('TENCENT_VOLUME') ?? '0');
  const region = getEnv('TENCENT_REGION') ?? 'ap-guangzhou';

  const payload = {
    Text: text,
    VoiceType: parseInt(voiceType, 10),
    Codec: codec,
    SampleRate: sampleRate,
    Speed: speed,
    Volume: volume,
    SessionId: crypto.randomUUID(),
  };

  const body = JSON.stringify(payload);
  const contentType = 'application/json; charset=utf-8';
  const timestamp = Math.floor(Date.now() / 1000);
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);

  // 1. 拼 canonical request
  const canonicalUri = '/';
  const canonicalQuery = '';
  const signedHeaders = 'content-type;host';
  const canonicalHeaders =
    `content-type:${contentType}\n` +
    `host:${HOST}\n`;
  const hashedRequestPayload = sha256hex(body);
  const canonicalRequest =
    `POST\n${canonicalUri}\n${canonicalQuery}\n` +
    `${canonicalHeaders}\n${signedHeaders}\n${hashedRequestPayload}`;

  // 2. 拼 string to sign
  const credentialScope = `${date}/${SERVICE}/tc3_request`;
  const hashedCanonicalRequest = sha256hex(canonicalRequest);
  const stringToSign =
    `${ALG}\n${timestamp}\n${credentialScope}\n${hashedCanonicalRequest}`;

  // 3. 算签名
  const secretDate = hmacSHA256(`TC3${secretKey}`, date);
  const secretService = hmacSHA256(secretDate, SERVICE);
  const secretSigning = hmacSHA256(secretService, 'tc3_request');
  const signature = crypto.createHmac('sha256', secretSigning)
    .update(stringToSign).digest('hex');

  // 4. 拼 Authorization
  const authorization =
    `${ALG} Credential=${secretId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  // 5. 发请求
  const url = `https://${HOST}/`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': contentType,
      Host: HOST,
      'X-TC-Action': ACTION,
      'X-TC-Version': VERSION,
      'X-TC-Timestamp': String(timestamp),
      'X-TC-Region': region,
    },
    body,
  });

  const json = await res.json();
  if (json.Response && json.Response.Error) {
    throw new Error(`Tencent TTS Error: ${JSON.stringify(json.Response.Error)}`);
  }
  if (!res.ok) {
    throw new Error(`Tencent TTS HTTP ${res.status}: ${JSON.stringify(json).slice(0, 200)}`);
  }
  const audio = json.Response?.Audio ?? json.Audio;
  if (!audio) {
    throw new Error(`Tencent TTS 返回无 Audio 字段：${JSON.stringify(json).slice(0, 200)}`);
  }
  return audio; // base64 string
}