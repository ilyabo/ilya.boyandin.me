import assert from 'node:assert/strict';
import test from 'node:test';
import { getKeywordIndex, matchesItem } from '../src/lib/keyword-search.ts';

const project = { title: 'Flowmap City', keywords: ['geo', 'transport', 'analytics', 'open source'] };

test('keywords rank by distinct project count, then alphabetically', () => {
  const projects = [project, { title: 'Map', keywords: ['Geo', 'GEO', 'transport'] }];
  const index = getKeywordIndex(projects, ['geo', 'research']);
  assert.deepEqual(index.keywords, ['geo', 'transport', 'analytics', 'open source', 'research']);
  assert.deepEqual(index.keywordCounts, { geo: 2, transport: 2, analytics: 1, 'open source': 1, research: 0 });
});

test('selected keywords use AND and match whole tags, ignoring case', () => {
  assert.equal(matchesItem(project, ['GEO', 'transport'], ''), true);
  assert.equal(matchesItem(project, ['geo', 'music'], ''), false);
  assert.equal(matchesItem({ title: 'Train data', keywords: ['trains'] }, ['AI'], ''), false);
});

test('free text searches names and keywords alongside selected tags', () => {
  assert.equal(matchesItem(project, ['geo'], '  FLOWMAP  '), true);
  assert.equal(matchesItem(project, ['geo'], 'city analytics'), true);
  assert.equal(matchesItem(project, ['music'], 'Flowmap City'), false);
  assert.equal(matchesItem({ title: 'SQLRooms', keywords: ['analytics'] }, [], 'sqlrooms'), true);
});

test('free text searches talk details alongside title and keyword filters', () => {
  const talk = {
    title: 'FlowmapBlue',
    keywords: ['flow maps', 'geospatial'],
    details: ['talk', 'Data Visualization Group meeting, University of Bern (in German)', 'Apr 3, 2019'],
  };
  assert.equal(matchesItem(talk, ['flow maps'], 'flowmapblue "University of Bern" 2019'), true);
  assert.equal(matchesItem(talk, ['flow maps'], 'English'), false);
  assert.equal(matchesItem(talk, ['German'], ''), false);
});

test('quoted phrases stay together within a title or keyword', () => {
  assert.equal(matchesItem(project, ['geo'], '"open source" city'), true);
  assert.equal(matchesItem(project, [], '"geo transport"'), false);
  assert.equal(matchesItem(project, [], '"flowmap city"'), true);
  assert.equal(matchesItem(project, [], '"open source'), true);
});

test('cleared searches include all projects and unmatched queries return no match', () => {
  assert.equal(matchesItem(project, [], '  '), true);
  assert.equal(matchesItem({ title: 'No tags', keywords: [] }, [], ''), true);
  assert.equal(matchesItem(project, [], 'not-a-project'), false);
});
