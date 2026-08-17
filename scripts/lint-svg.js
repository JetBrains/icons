'use strict';

const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');

const allowedClasses = new Set(['secondary', 'tertiary']);
const allowedPaint = new Set(['currentColor', 'none', 'transparent']);

function lintSvg(file, source) {
  if (path.basename(file) === 'log.svg') return [];

  const errors = new Set();
  const basename = path.basename(file, '.svg');
  const size = Number(basename.match(/-(\d+)px(?:-|$)/)?.[1] ?? 16);
  const checkExplicitPaint = !basename.startsWith('file-');
  const checkClipPath = !basename.startsWith('file-properties');
  let groupCount = 0;
  let remainingGroupCount = 0;
  let rootFound = false;

  try {
    optimize(source, {
      path: file,
      plugins: [
        {
          name: 'lintSvg',
          fn: () => ({
            element: {
              enter(node, parentNode) {
                const attributes = node.attributes;

                if (node.name === 'svg' && parentNode.type === 'root') {
                  rootFound = true;
                  if (attributes.width !== String(size)) errors.add(`width must be ${size}`);
                  if (attributes.height !== String(size)) errors.add(`height must be ${size}`);
                  if (attributes.viewBox !== `0 0 ${size} ${size}`) errors.add(`viewBox must be "0 0 ${size} ${size}"`);
                }

                if (node.name === 'g') groupCount++;
                if (node.name === 'mask' || attributes.mask != null) errors.add('masks are not allowed');
                if (node.name === 'style') errors.add('<style> elements are not allowed');
                if (attributes.style != null) errors.add('style attributes are not allowed');
                if (checkClipPath && node.name === 'clipPath') errors.add('<clipPath> elements are not allowed');

                const classes = attributes.class?.trim().split(/\s+/) ?? [];
                if (classes.length > 0) {
                  if (classes.some(className => !allowedClasses.has(className))) {
                    errors.add('only "secondary" and "tertiary" class names are allowed');
                  }
                }

                const isSecondary = classes.some(className => allowedClasses.has(className));
                if (isSecondary && Object.keys(attributes).some(name => name === 'stroke' || name.startsWith('stroke-'))) {
                  errors.add('stroke is not allowed');
                }
                if (checkExplicitPaint && attributes.fill != null && !allowedPaint.has(attributes.fill)) {
                  errors.add('fill must be omitted or set to "currentColor", "none", or "transparent"');
                }
                if (checkExplicitPaint && attributes.stroke != null && !allowedPaint.has(attributes.stroke)) {
                  errors.add('stroke must be omitted or set to "currentColor", "none", or "transparent"');
                }

                for (const [, property, value] of attributes.style?.matchAll(/(?:^|;)\s*(fill|stroke)\s*:\s*([^;]+)/g) ?? []) {
                  if (isSecondary && property === 'stroke') errors.add('stroke is not allowed');
                  if (checkExplicitPaint && property === 'fill' && !allowedPaint.has(value.trim())) errors.add('fill must be omitted or set to "currentColor", "none", or "transparent"');
                  if (checkExplicitPaint && property === 'stroke' && !allowedPaint.has(value.trim())) errors.add('stroke must be omitted or set to "currentColor", "none", or "transparent"');
                }
              }
            }
          })
        },
        'collapseGroups',
        {
          name: 'countRemainingGroups',
          fn: () => ({
            element: {
              enter(node) {
                if (node.name === 'g') remainingGroupCount++;
              }
            }
          })
        }
      ]
    });
    if (!rootFound) errors.add('root <svg> element is missing');
    if (remainingGroupCount < groupCount) errors.add('redundant <g> element');
  } catch (error) {
    errors.add(error.message);
  }

  return [...errors];
}

function getFiles(args) {
  if (args.length === 0) {
    return fs
      .readdirSync('src')
      .filter(name => name.endsWith('.svg'))
      .sort()
      .map(name => path.join('src', name));
  }

  const src = path.resolve('src');
  return args.filter(file => {
    const relative = path.relative(src, path.resolve(file));
    return relative.endsWith('.svg') && !relative.startsWith('..') && !path.isAbsolute(relative);
  });
}

if (require.main === module) {
  let failed = false;

  for (const file of getFiles(process.argv.slice(2))) {
    const errors = lintSvg(file, fs.readFileSync(file, 'utf8'));
    if (errors.length > 0) {
      failed = true;
      console.error(`${file}:\n  ${errors.join('\n  ')}`);
    }
  }

  process.exitCode = failed ? 1 : 0;
}

module.exports = lintSvg;
module.exports.getFiles = getFiles;
