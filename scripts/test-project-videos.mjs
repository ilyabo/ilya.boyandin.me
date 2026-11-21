import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { chromium } from 'playwright-core';

// Run against a local Astro dev server with Google Chrome installed.
const baseURL = process.env.SITE_URL ?? 'http://localhost:4321';
const projectsDir = new URL('../content/projects/', import.meta.url);

test('the dev server serves the requested video bytes and rejects out-of-bounds ranges', async () => {
  const file = 'sqlrooms/sqlrooms-cars-document.mp4';
  const bytes = await readFile(new URL(file, projectsDir));
  const url = new URL('/media/projects/' + file, baseURL);
  for (const [range, start] of [['bytes=0-127', 0], ['bytes=-128', bytes.length - 128]]) {
    const response = await fetch(url, { headers: { Range: range } });
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('content-range'), `bytes ${start}-${start + 127}/${bytes.length}`);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes.subarray(start, start + 128));
  }
  const invalid = await fetch(url, { headers: { Range: `bytes=${bytes.length}-` } });
  assert.equal(invalid.status, 416);
  assert.equal(invalid.headers.get('content-range'), `bytes */${bytes.length}`);
});

test('project videos play in Chrome after client-side navigation from the list', async (t) => {
  const browser = await chromium.launch({ channel: 'chrome' });
  t.after(() => browser.close());
  const page = await browser.newPage({ baseURL });
  const projects = await readdir(projectsDir, { withFileTypes: true });
  for (const project of projects.filter(entry => entry.isDirectory())) {
    const markdown = await readFile(new URL(project.name + '/index.md', projectsDir), 'utf8');
    const embeds = markdown.match(/<embed\b[^>]*\bsrc=["'][^"']+\.(?:mp4|webm|mov)["'][^>]*>/gi);
    if (!embeds) continue;

    await t.test(project.name, async () => {
      await page.goto('/projects');
      await page.evaluate(() => {
        document.addEventListener('astro:after-swap', () => { window.projectSwapped = true; }, { once: true });
      });
      const route = '/p/' + project.name;
      await page.locator(`a[href="${route}"]`).click();
      await page.waitForURL(url => url.pathname === route, { waitUntil: 'commit' });
      assert.ok(await page.evaluate(() => window.projectSwapped), 'expected an Astro page swap');
      const videos = await page.locator('article video').all();
      assert.equal(videos.length, embeds.length);
      for (const video of videos) {
        const player = await video.elementHandle();
        await page.waitForFunction(el => el.readyState >= el.HAVE_METADATA && el.duration > 0,
          player, { timeout: 10_000 });
        await video.evaluate(async el => {
          el.muted = true;
          await el.play();
        }, undefined, { timeout: 10_000 });
        await page.waitForFunction(el => el.currentTime > 0.15 && el.videoWidth > 0 && !el.error,
          player, { timeout: 10_000 });
        await video.evaluate(el => el.pause());
      }
    });
  }
});
