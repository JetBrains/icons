'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const lintSvg = require('./lint-svg');

test('selects only requested SVGs in src', () => {
  assert.deepEqual(lintSvg.getFiles(['README.md', 'src/activity.svg', 'outside.svg']), ['src/activity.svg']);
});

test('checks SVG conventions', () => {
  assert.deepEqual(lintSvg('src/log.svg', '<invalid>'), []);
  assert.deepEqual(lintSvg('icon-10px.svg', '<svg width="10" height="10" viewBox="0 0 10 10"/>'), ['size suffix must be 12px or 20px']);
  assert.deepEqual(lintSvg('caret-down-10px.svg', '<svg width="10" height="10" viewBox="0 0 10 10"/>'), []);
  assert.deepEqual(lintSvg('icon-12px.svg', '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path class="secondary"/></svg>'), []);
  assert.deepEqual(lintSvg('icon.svg', '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill="transparent" stroke="none"/></svg>'), []);
  assert.deepEqual(lintSvg('file-icon.svg', '<svg width="16" height="16" viewBox="0 0 16 16" fill="red"><path stroke="red"/></svg>'), []);
  assert.deepEqual(lintSvg('icon.svg', '<svg width="16" height="16" viewBox="0 0 16 16"><g opacity=".5"><path/><path/></g></svg>'), []);
  assert.deepEqual(lintSvg('icon.svg', '<svg width="16" height="16" viewBox="0 0 16 16"><defs><clipPath/></defs><style/><path style="opacity: .5"/></svg>'), ['<clipPath> elements are not allowed', '<style> elements are not allowed', 'style attributes are not allowed']);
  assert.deepEqual(lintSvg('file-properties.svg', '<svg width="16" height="16" viewBox="0 0 16 16"><defs><clipPath/></defs></svg>'), []);

  const errors = lintSvg('icon.svg', '<svg width="12"><g><path class="other" style="fill: red; stroke: red" mask="url(#x)"/><path class="secondary" stroke="red"/></g><mask id="x"/></svg>');
  assert.equal(errors.length, 10);
});
