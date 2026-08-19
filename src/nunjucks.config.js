'use strict';

const path = require('path');
const nunjucks = require('nunjucks');

// All component macros live directly under src/components/<name>/macro.njk,
// so this is the loader root — templates import each other with paths like
// "button/macro.njk", not "components/button/macro.njk".
const COMPONENTS_ROOT = path.join(__dirname, 'components');

/**
 * @param {object} [options]
 * @param {boolean} [options.watch] - reload templates on change (dev use)
 * @param {boolean} [options.noCache] - disable template caching (test use)
 * @param {boolean} [options.throwOnUndefined] - throw on undefined vars instead of silently rendering empty
 * @returns {nunjucks.Environment}
 */
function configure(options = {}) {
  const loader = new nunjucks.FileSystemLoader(COMPONENTS_ROOT, {
    watch: Boolean(options.watch),
    noCache: Boolean(options.noCache),
  });

  return new nunjucks.Environment(loader, {
    autoescape: true,
    trimBlocks: true,
    lstripBlocks: true,
    throwOnUndefined: Boolean(options.throwOnUndefined),
  });
}

module.exports = { configure, COMPONENTS_ROOT };
