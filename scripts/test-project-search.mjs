import assert from 'node:assert/strict';
import test from 'node:test';
import { matchesProject } from '../src/lib/project-search.ts';

const project = { title: 'Flowmap City', keywords: ['geo', 'transport', 'analytics', 'open source'] };

test('selected keywords use AND and match whole tags, ignoring case', () => {
  assert.equal(matchesProject(project, ['GEO', 'transport'], ''), true);
  assert.equal(matchesProject(project, ['geo', 'music'], ''), false);
  assert.equal(matchesProject({ title: 'Train data', keywords: ['trains'] }, ['AI'], ''), false);
});

test('free text searches names and keywords alongside selected tags', () => {
  assert.equal(matchesProject(project, ['geo'], '  FLOWMAP  '), true);
  assert.equal(matchesProject(project, ['geo'], 'city analytics'), true);
  assert.equal(matchesProject(project, ['music'], 'Flowmap City'), false);
  assert.equal(matchesProject({ title: 'SQLRooms', keywords: ['analytics'] }, [], 'sqlrooms'), true);
});

test('quoted phrases stay together within a title or keyword', () => {
  assert.equal(matchesProject(project, ['geo'], '"open source" city'), true);
  assert.equal(matchesProject(project, [], '"geo transport"'), false);
  assert.equal(matchesProject(project, [], '"flowmap city"'), true);
  assert.equal(matchesProject(project, [], '"open source'), true);
});

test('cleared searches include all projects and unmatched queries return no match', () => {
  assert.equal(matchesProject(project, [], '  '), true);
  assert.equal(matchesProject({ title: 'No tags', keywords: [] }, [], ''), true);
  assert.equal(matchesProject(project, [], 'not-a-project'), false);
});
