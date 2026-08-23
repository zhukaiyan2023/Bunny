import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 414, height: 896 } });
const errors = [];
page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
});

await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(800);

const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML?.length ?? 0);
const title = await page.title();
const heading = await page.evaluate(() => document.querySelector('h1, h2, h3')?.textContent?.trim() ?? null);
const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 300));

await page.screenshot({ path: '/tmp/bunny-home.png', fullPage: false });

console.log(JSON.stringify({
  title,
  rootHtmlLen: rootHtml,
  heading,
  bodyTextPreview: bodyText,
  errors,
}, null, 2));

await browser.close();