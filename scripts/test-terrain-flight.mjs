import assert from 'node:assert/strict';
import test from 'node:test';
import { chromium } from 'playwright-core';

// Run against a local Astro dev server with Google Chrome installed.
const baseURL = process.env.SITE_URL ?? 'http://localhost:4321';

test('3D flight and cursor zoom can cross the flat map boundary', async (t) => {
  const browser = await chromium.launch({ channel: 'chrome' });
  t.after(() => browser.close());
  const page = await browser.newPage({
    baseURL,
    reducedMotion: 'reduce',
    viewport: { width: 800, height: 450 },
  });
  await page.addInitScript(() => {
    const gl = WebGL2RenderingContext.prototype;
    const locations = new WeakMap();
    const { getUniformLocation, uniform2f, readPixels } = gl;
    gl.getUniformLocation = function (program, name) {
      const location = getUniformLocation.call(this, program, name);
      if (location) locations.set(location, name);
      return location;
    };
    gl.uniform2f = function (location, x, y) {
      if (locations.get(location) === 'center') window.terrainCenterY = y;
      uniform2f.call(this, location, x, y);
    };
    gl.readPixels = function (x, y, width, height, format, type, pixels) {
      readPixels.call(this, x, y, width, height, format, type, pixels);
      window.terrainZoomPicked = (pixels[0] || pixels[1]) && (pixels[2] || pixels[3]);
    };
  });

  await page.goto('/paint');
  await page.getByRole('button', { name: '3D view' }).click();
  await page.keyboard.down('w');
  await page.waitForFunction(() => window.terrainCenterY > 1.15, null, { timeout: 8000 });
  await page.keyboard.up('w');

  await page.mouse.move(400, 225);
  await page.mouse.wheel(0, -120);
  // An anchored zoom reads back the new center even when the cursor is near the orbit target.
  await page.waitForFunction(() => window.terrainCenterY > 1.1 && window.terrainZoomPicked);

  const notice = page.getByRole('status').filter({ hasText: 'Edge of terrain' });
  await page.keyboard.down('w');
  await notice.waitFor({ timeout: 8000 });
  await page.keyboard.up('w');
  assert.equal(await page.evaluate(() => window.terrainCenterY), 1.5);

  await page.keyboard.down('s');
  await page.waitForFunction(() => window.terrainCenterY < 1.45);
  await page.keyboard.up('s');
  await notice.waitFor({ state: 'hidden' });
});
