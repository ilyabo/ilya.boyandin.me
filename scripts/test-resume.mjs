import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';
import { parse } from 'yaml';

let server;
let getResume;
let english;
let german;

before(async () => {
  server = await createServer({ configFile: false, server: { middlewareMode: true, ws: false } });
  ({ getResume } = await server.ssrLoadModule('/src/lib/resume.ts'));
  [english, german] = await Promise.all([getResume('en'), getResume('de')]);
});

after(async () => {
  await server?.close();
});

test('localizes profile, sections, controls, and employment dates', () => {
  assert.match(english.summaryHtml, /AI assistants/);
  assert.match(german.summaryHtml, /KI-Assistenten/);
  assert.equal(english.ui.short, 'Short');
  assert.equal(german.ui.short, 'Kurzfassung');
  const enExperience = english.sections.find((section) => section.id === 'experience');
  const deExperience = german.sections.find((section) => section.id === 'experience');
  assert.equal(enExperience.title, 'Experience');
  assert.equal(deExperience.title, 'Berufserfahrung');
  assert.equal(enExperience.items[0].start, 'July 2021');
  assert.equal(deExperience.items[0].start, 'Juli 2021');
  assert.equal(deExperience.items[0].end, 'heute');
  assert.ok(deExperience.items[0].bullets.some((bullet) => /KI-Assistenten/.test(bullet.html)));
});

test('preserves shared details, Markdown links, and short/full membership', () => {
  assert.deepEqual(german.profile.contacts, english.profile.contacts);
  assert.equal(german.profile.name, english.profile.name);
  for (const [index, section] of english.sections.entries()) {
    const translated = german.sections[index];
    assert.equal(translated.id, section.id);
    assert.equal(translated.type, section.type);
    assert.equal(translated.short, section.short);
    const items = section.type === 'expertise' ? section.groups : section.items;
    const deItems = section.type === 'expertise' ? translated.groups : translated.items;
    assert.equal(deItems.length, items.length);
    items.forEach((item, i) => {
      assert.equal(deItems[i].short, item.short);
      const texts = item.bullets || item.details || [item];
      const deTexts = deItems[i].bullets || deItems[i].details || [deItems[i]];
      assert.equal(deTexts.length, texts.length);
      texts.forEach((text, j) => {
        assert.equal(deTexts[j].short, text.short);
        if (text.html) {
          const links = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
          assert.deepEqual(links(deTexts[j].html), links(text.html));
        }
      });
    });
  }
});

test('defaults to the English résumé', async () => {
  assert.deepEqual(await getResume(), english);
});

test('rejects incomplete translation pairs even when rendering English', async (context) => {
  const resumePath = path.join(process.cwd(), 'content', 'data', 'resume.yml');
  const source = parse(fs.readFileSync(resumePath, 'utf8'));
  delete source.summary.de;
  const readFileSync = fs.readFileSync;
  context.mock.method(fs, 'readFileSync', (file, ...options) => {
    if (file === resumePath) return JSON.stringify(source);
    return readFileSync(file, ...options);
  });
  await assert.rejects(getResume('en'), (error) => error.name === 'ZodError');
  await assert.rejects(getResume('de'), (error) => error.name === 'ZodError');
});
