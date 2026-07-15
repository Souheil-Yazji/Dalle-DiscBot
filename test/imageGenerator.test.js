const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizePrompt } = require('../lib/imageGenerator');

test('normalizePrompt strips the command prefix and trims whitespace', () => {
  assert.equal(normalizePrompt('!dalle   a futuristic city at sunset'), 'a futuristic city at sunset');
  assert.equal(normalizePrompt('   !dalle   '), '');
});
